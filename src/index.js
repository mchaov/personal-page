const path = require("path");
const {
    readFileSync,
    writeFileSync,
    emptyDirSync,
    ensureDir,
    copySync
} = require("fs-extra");
const rr = require("recursive-readdir");
const marked = require("marked");
const hljs = require("highlight.js");
const { transformSync } = require("esbuild");
const { createHash } = require("node:crypto");
const { gzipSync } = require("node:zlib");
const {
    MONTH_NAMES,
    getDateParts,
    normalizeTags,
    slugifyTag,
    splitAbstract
} = require("./article-utils");

const sitePath = path.resolve(__dirname, "..", "site");
const cssPath = path.join(sitePath, "css");
const imagesPath = path.join(sitePath, "i");
const articlesPath = path.join(sitePath, "articles");
const favIcoPath = path.join(sitePath, "favicon.ico");

const pageTemplate = readFileAsString(path.resolve(__dirname, "template.html"));
const articleAbstractTemplate = readFileAsString(path.resolve(__dirname, "article-abstract.html"));
const articleNavigationTemplate = readFileAsString(path.resolve(__dirname, "article-navigation.html"));
const articleNavigationScript = transformSync(
    readFileAsString(path.resolve(__dirname, "article-navigation.js")),
    { loader: "js", minify: true, format: "iife", target: "es2020", define: { module: "undefined" } }
).code;

const outFolder = path.resolve(__dirname, "..", "public");
const outFolderCSS = path.join(outFolder, "css");
const outFolderImages = path.join(outFolder, "i");

const metaRegex = /^!{{(.*?)}}/s;

marked.setOptions({
    gfm: true,
    breaks: true,
    smartLists: true,
    highlight: (code, lang) => hljs.highlight(lang, code).value
});

const html = {
    HEADER: readFileAsString(path.resolve(__dirname, "header.html")),
    FOOTER: readFileAsString(path.resolve(__dirname, "footer.html"))
};

function readFileAsString(pth) {
    return readFileSync(pth).toString();
}

function replaceTokens(template, values) {
    return Object.entries(values).reduce((output, [token, value]) => {
        return output.replaceAll(`{{${token}}}`, () => String(value ?? ""));
    }, template);
}

function escapeHtml(value) {
    const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    };

    return String(value).replace(/[&<>"']/g, character => replacements[character]);
}

function extractMeta(content) {
    const match = content.match(metaRegex);
    if (!match) {
        throw new Error("Article metadata block is missing");
    }

    return JSON.parse(`{${match[1]}}`);
}

function generatePageTitle(title) {
    return title ? ` | ${title}` : "";
}

function getStructuredData(title, image, datePublished, dateModified) {
    return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "image": ["${image}"],
      "datePublished": "${datePublished}",
      "dateModified": "${dateModified}",
      "author": [{
          "@type": "Person",
          "name": "Martin Chaov",
          "url": "https://mchaov.net"
        }]
    }
    </script>
`;
}

function createArticleModel(fullPath) {
    const content = readFileAsString(fullPath);
    const sourceMeta = extractMeta(content);
    const date = getDateParts(sourceMeta.dateCreated);
    const tags = normalizeTags(sourceMeta.tags)
        .map(label => ({ label, slug: slugifyTag(label) }))
        .filter(tag => tag.slug);
    const parsedPath = path.parse(fullPath);

    return {
        content,
        date,
        meta: {
            ...sourceMeta,
            tags: tags.map(tag => tag.label)
        },
        parsedPath,
        tags,
        url: parsedPath.name.toLowerCase()
    };
}

function renderTags(tags) {
    if (!tags.length) {
        return "";
    }

    const items = tags.map(tag => {
        return `<li><a class="article-tag" data-filter-tag="${tag.slug}" href="/?tag=${tag.slug}">${escapeHtml(tag.label)}</a></li>`;
    }).join("");

    return `<ul class="article-tags" aria-label="Tags">${items}</ul>`;
}

function renderArticlePage(article, assets) {
    const renderedMarkdown = marked(article.content.replace(metaRegex, ""));
    const articleMeta = `
        <div class="article-page-meta article-meta">
            <time datetime="${article.date.dateIso}">Published ${article.date.displayDate}</time>
            ${renderTags(article.tags)}
        </div>`;
    const renderedArticle = renderedMarkdown.includes("</h1>")
        ? renderedMarkdown.replace("</h1>", `</h1>${articleMeta}`)
        : `${articleMeta}${renderedMarkdown}`;
    const content = `<main><a class="article-home" href="/">Home</a><article class="markdown-body article-page">${renderedArticle}</article></main>`;

    return replaceTokens(pageTemplate, {
        PAGETITLE: generatePageTitle(article.meta.pageTitle),
        PAGEDESC: article.meta.abstract,
        HEADER: html.HEADER,
        CONTENT: content,
        FOOTER: html.FOOTER,
        "OG:TITLE": article.meta.pageTitle,
        "OG:DESC": article.meta.abstract,
        "OG:IMG": article.meta.ogImage || "https://mchaov.net/i/profile-2.jpg",
        "JSON:LD": getStructuredData(
            article.meta.pageTitle,
            article.meta.ogImage || "https://mchaov.net/i/profile-2.jpg",
            new Date(article.meta.dateCreated).toISOString(),
            new Date(article.meta.dateUpdated).toISOString()
        ),
        PAGE_SCRIPT: "",
        ...assets
    });
}

function renderArticleAbstract(article) {
    const [excerpt, remainder] = splitAbstract(article.meta.abstract);
    return replaceTokens(articleAbstractTemplate, {
        TITLE: escapeHtml(article.meta.pageTitle),
        DATE: article.date.displayDate.padStart(11, "0"),
        DATE_ISO: article.date.dateIso,
        ABSTRACT: excerpt + (remainder ? `<span hidden>${remainder}</span>` : ""),
        LINK: `/${article.url}.html`,
        TAGS: renderTags(article.tags),
        TAG_SLUGS: article.tags.map(tag => tag.slug).join(","),
        YEAR: article.date.year,
        MONTH: article.date.month
    });
}

function renderNavigation(articles) {
    const tags = new Map();
    articles.forEach(article => {
        article.tags.forEach(tag => {
            const current = tags.get(tag.slug) || { ...tag, count: 0 };
            current.count += 1;
            tags.set(tag.slug, current);
        });
    });

    const tagOptions = [...tags.values()]
        .sort((left, right) => left.label.localeCompare(right.label))
        .map(tag => {
            const countLabel = `${tag.count} ${tag.count === 1 ? "article" : "articles"}`;
            return `<label class="article-tag-option"><input type="checkbox" name="tag" value="${tag.slug}" /><span>${escapeHtml(tag.label)}</span><small aria-label="${countLabel}">${tag.count}</small></label>`;
        })
        .join("");

    const years = [...new Set(articles.map(article => article.date.year))]
        .sort((left, right) => Number(right) - Number(left))
        .map(year => `<option value="${year}">${year}</option>`)
        .join("");

    const months = MONTH_NAMES
        .map((month, index) => {
            const value = String(index + 1).padStart(2, "0");
            return `<option value="${value}">${month}</option>`;
        })
        .join("");

    return replaceTokens(articleNavigationTemplate, {
        TAG_OPTIONS: tagOptions,
        YEAR_OPTIONS: years,
        MONTH_OPTIONS: months
    });
}

function renderHomePage(articles, assets) {
    const sortedArticles = [...articles]
        .sort((left, right) => right.date.date.getTime() - left.date.date.getTime());
    const articleList = sortedArticles.map(renderArticleAbstract).join("");
    const content = `<main class="article-browser">
        <div class="article-heading"><h1>Articles</h1><span>${articles.length} articles</span></div>
        ${renderNavigation(sortedArticles)}
        <div class="article-list" data-article-list>${articleList}</div>
        <p class="article-empty" data-article-empty hidden>No articles match the selected filters.</p>
    </main>`;

    return replaceTokens(pageTemplate, {
        PAGETITLE: "",
        PAGEDESC: "Martin's personal blog, where he shares his thoughts about various topics.",
        HEADER: html.HEADER,
        CONTENT: content,
        FOOTER: html.FOOTER,
        "OG:TITLE": "Martin Chaov chasing bits...",
        "OG:DESC": "Personal blog where I explore topics that are interesting to me :)",
        "OG:IMG": "https://mchaov.net/i/profile.jpg",
        "JSON:LD": getStructuredData("", "https://mchaov.net/i/profile-2.jpg", "", ""),
        PAGE_SCRIPT: `<script>${articleNavigationScript}</script>`,
        ...assets
    });
}

function parseArticles(paths, assets) {
    console.log("\n### Parsing articles\n");
    const articles = paths.map(fullPath => {
        console.log(`#### PARSING: ${fullPath}`);
        return createArticleModel(fullPath);
    });
    const publishedArticles = articles.filter(article => article.meta.ready !== false);

    publishedArticles.forEach(article => {
        writeFileSync(
            path.join(outFolder, `${article.url}.html`),
            renderArticlePage(article, assets)
        );
    });

    console.log("#### PARSING: homepage");
    writeFileSync(path.join(outFolder, "index.html"), renderHomePage(publishedArticles, assets));
    console.log("\n### ALL ARTICLES PARSED");
}

function parseCSS(paths) {
    const source = [...paths].sort().map(readFileAsString).join("\n");
    const css = transformSync(source, { loader: "css", minify: true, target: "es2020" }).code;
    checkBudget("CSS", css, 8000, 2500);
    return writeAsset(outFolderCSS, "main", "css", css);
}

function writeAsset(folder, name, extension, content) {
    const hash = createHash("sha256").update(content).digest("hex").slice(0, 12);
    const file = `${name}.${hash}.${extension}`;
    writeFileSync(path.join(folder, file), content);
    return `/${path.relative(outFolder, folder).split(path.sep).join("/")}/${file}`;
}

function checkBudget(name, content, rawLimit, gzipLimit) {
    const raw = Buffer.byteLength(content);
    const compressed = gzipSync(content).length;
    if (raw > rawLimit || compressed > gzipLimit) {
        throw new Error(`${name} exceeds byte budget: ${raw} raw, ${compressed} gzip`);
    }
    console.log(`${name}: ${raw} bytes, ${compressed} gzip`);
}

async function manageFS() {
    await ensureDir(outFolder);
    emptyDirSync(outFolder);
    await ensureDir(outFolderCSS);

    writeFileSync(path.join(outFolder, "favicon.ico"), readFileSync(favIcoPath));
    copySync(imagesPath, outFolderImages);
    writeFileSync(path.join(outFolderCSS, "LICENSE.txt"),
        readFileAsString(path.join(sitePath, "css-LICENSE-MIT.txt")) + "\n\n" +
        readFileAsString(path.join(sitePath, "css-LICENSE-BSD.txt")));
    console.log("### Directory clean up complete");
}

async function build() {
    await manageFS();
    const [articlePaths, cssPaths] = await Promise.all([rr(articlesPath), rr(cssPath)]);
    checkBudget("Navigation JS", articleNavigationScript, Infinity, 2000);
    const assets = {
        STYLESHEET: parseCSS(cssPaths),
        LOGO: writeAsset(outFolderImages, "logo", "svg", readFileAsString(path.join(sitePath, "logo.svg")))
    };
    parseArticles(articlePaths, assets);
}

build().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
