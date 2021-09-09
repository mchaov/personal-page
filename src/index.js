const path = require("path");
const { readFileSync, writeFileSync, emptyDirSync, ensureDir, copySync, copyFileSync } = require("fs-extra");
const rr = require("recursive-readdir");
const marked = require('marked');
const hljs = require('highlight.js');

const sitePath = path.resolve(__dirname, "..", "site");
const cssPath = path.join(sitePath, "css");
const imagesPath = path.join(sitePath, "i");
const articlesPath = path.join(sitePath, "articles");
const favIcoPath = path.join(sitePath, "favicon.ico");

const pageTemplate = readFileSync(
    path.resolve(__dirname, "template.html")
).toString();

const articleAbstractTemplate = readFileSync(
    path.resolve(__dirname, "article-abstract.html")
).toString();


const outFolder = path.resolve(__dirname, "..", "public");
const outFolderCSS = path.join(outFolder, "css");
const outFolderImages = path.join(outFolder, "i");

const metaRegex = /^!{{(.*?)}}/s;

marked.setOptions({
    gfm: true,
    breaks: true,
    smartLists: true,
    highlight: (code, lang, _) => {
        return hljs.highlight(lang, code).value
    }
});

const html = {
    HEADER: readFileAsString(path.resolve(__dirname, "header.html")),
    MENU: readFileAsString(path.resolve(__dirname, "menu.html")),
    FOOTER: readFileAsString(path.resolve(__dirname, "footer.html"))
}

function readFileAsString(pth) {
    return readFileSync(pth).toString();
}

function extractMeta(content) {
    const meta = content.match(metaRegex)[1];
    return JSON.parse(`{${meta}}`)
}

function generatePageTitle(title) {
    if (title) {
        return ` | ${title}`;
    }
    return "";
}

function parseArticle(fullPath) {
    const content = readFileAsString(fullPath);
    const meta = extractMeta(content);

    const parcedContent = `<article class="markdown-body"><p></p>
        ${marked(content.replace(metaRegex, ""))}
    </article>`;

    let output = undefined;
    if (meta.ready !== false) {

        const t = generatePageTitle(meta.pageTitle);

        output = pageTemplate;
        output = output.replace("{{PAGETITLE}}", t);
        output = output.replace("{{PAGEDESC}}", meta.abstract);
        output = output.replace("{{HEADER}}", html.HEADER);
        output = output.replace("{{CONTENT}}", parcedContent);
        output = output.replace("{{MENU}}", html.MENU);
        output = output.replace("{{FOOTER}}", html.FOOTER);

        // FB
        // output = output.replace("{{OG:URL}}", "");
        output = output.replace("{{OG:TITLE}}", t);
        output = output.replace("{{OG:DESC}}", meta.abstract);
        output = output.replace("{{OG:IMG}}", meta.ogImage || "https://mchaov.net/i/profile-2.jpg");
    }

    return { meta, output };
}

function parseArticles(paths) {
    console.log("\n### Parsing articles\n")
    const articles = paths
        .map(fullPath => {
            console.log(`#### PARSING: ${fullPath}`)
            return {
                pth: path.parse(fullPath),
                article: parseArticle(fullPath),
            }
        })
        .filter(x => x.article.output !== undefined);

    // write all articles to FS
    articles.forEach(x => {
        writeFileSync(
            path.join(outFolder, `${x.pth.name.toLowerCase()}.html`),
            x.article.output
        )
    });

    // generate content for home page
    console.log(`#### PARSING: homepage`)
    const homePageContent = articles
        .map(x => {
            return {
                ...x.article.meta,
                url: x.pth.name.toLowerCase()
            }
        })
        .sort((b, a) => a.dateCreated - b.dateCreated)
        .map(x => {
            let article = articleAbstractTemplate;
            article = article.replace("{{TITLE}}", x.pageTitle);
            article = article.replace("{{DATE}}", new Date(x.dateCreated).toUTCString());
            article = article.replace("{{ABSTRACT}}", x.abstract);
            article = article.replace("{{LINK}}", `/${x.url}.html`);
            return article;
        })
        .join("<hr></hr>");

    let homeOutput = pageTemplate;
    homeOutput = homeOutput.replace("{{PAGETITLE}}", "");
    homeOutput = homeOutput.replace("{{PAGEDESC}}", "Martin's personal blog, where he shares his thoughts about various topics.");
    homeOutput = homeOutput.replace("{{HEADER}}", html.HEADER);
    homeOutput = homeOutput.replace("{{CONTENT}}", `<div class="markdown-body">${homePageContent}</div>`);
    homeOutput = homeOutput.replace("{{MENU}}", html.MENU);
    homeOutput = homeOutput.replace("{{FOOTER}}", html.FOOTER);

    writeFileSync(
        path.join(outFolder, `index.html`),
        homeOutput
    );

    console.log("\n### ALL ARTICLES PARSED");
}

function parseCSS(paths) {
    const css = paths
        .map(readFileAsString)
        .join(" ")
        .replace(/\s+/gim, " ");

    writeFileSync(
        path.join(outFolderCSS, "main.css"),
        css
    );

    console.log("### CSS Parsed");
}

async function manageFS() {
    await ensureDir(outFolder);
    emptyDirSync(outFolder);
    await ensureDir(outFolderCSS);

    writeFileSync(path.join(outFolder, "favicon.ico"), readFileSync(favIcoPath));

    copySync(imagesPath, outFolderImages);
    console.log("### Directory clean up complete");
}

(async function () {
    await manageFS();

    rr(articlesPath)
        .then(parseArticles)
        .catch(console.error)

    rr(cssPath)
        .then(parseCSS)
        .catch(console.error)
}())
