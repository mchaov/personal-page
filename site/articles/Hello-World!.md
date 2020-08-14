!{{
    "dateCreated": 1597363374653,
    "dateUpdated": 1597363374653,
    "pageTitle": "Hello World!",
    "tags": "[]",
    "abstract": "What is a new venture whithout a 'Hello World!' message. This post talks about how this page became reality... also why I did write my own static site generator in the process..."
}}

# Hello World!

Hi there! Welcome to my blog and very first post!

As you may have noticed in the abstract I mention that I wrote a static site generator because of it.

It definitelly didn't start this way. I was planning to use one of already popular ones... However, I was wasting more and more time in their documentation, and I wanted a simple web site that is quick to build and release. I didn't want complex setups and lenghty installs and etc.

And so ... my static site generator from markdown started to look more and more appealing.

The entire logic doing that is quite simple - I am using:

- [marked](https://www.npmjs.com/package/marked) - to parse the markdown files
- [highlight.js](https://www.npmjs.com/package/highlight.js) - to highligh any code samples in the posts
- [github-markdown-css](https://www.npmjs.com/package/github-markdown-css) - well... why would I write my own styles...

And that's it ... the code below generates this entire website. As I am writing this post at 3AM after just completing my frankenstatic generator it looks quite ugly. Maybe I will improve it and publish - yet another open source static site generator...

```javascript
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

const metaRegex = /!{{(.*)}}/s;

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

    let output = pageTemplate;
    output = output.replace("{PAGETITLE}", generatePageTitle(meta.pageTitle));
    output = output.replace("{HEADER}", html.HEADER);
    output = output.replace("{CONTENT}", parcedContent);
    output = output.replace("{MENU}", html.MENU);
    output = output.replace("{FOOTER}", html.FOOTER);

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
        });

    // write all articles to FS
    articles.forEach(x => {
        writeFileSync(
            path.join(outFolder, `${x.pth.name}.html`),
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
            article = article.replace("{TITLE}", x.pageTitle);
            article = article.replace("{DATE}", new Date(x.dateCreated).toLocaleString());
            article = article.replace("{ABSTRACT}", x.abstract);
            article = article.replace("{LINK}", `/${x.url}.html`);
            return article;
        })
        .join("<hr></hr>");

    let homeOutput = pageTemplate;
    homeOutput = homeOutput.replace("{PAGETITLE}", "");
    homeOutput = homeOutput.replace("{HEADER}", html.HEADER);
    homeOutput = homeOutput.replace("{CONTENT}", `<div class="markdown-body">${homePageContent}</div>`);
    homeOutput = homeOutput.replace("{MENU}", html.MENU);
    homeOutput = homeOutput.replace("{FOOTER}", html.FOOTER);

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
```

Nah, I am too lazy to make this a product. After I am done playing with it, I will probably migrate to something that supports generating posts from markdown.