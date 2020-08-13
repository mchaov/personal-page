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

const template = readFileSync(path.resolve(__dirname, "template")).toString();

const outFolder = path.resolve(__dirname, "..", "public");
const outFolderCSS = path.join(outFolder, "css");
const outFolderImages = path.join(outFolder, "i");

// const pagesPath = path.resolve(__dirname, "..", "site", "pages");
// const articles = [];

const metaRegex = /!{{(.*)}}/s;

marked.setOptions({
    gfm: true,
    smartLists: true,
    highlight: (code, lang, _) => {
        return hljs.highlight(lang, code).value
    }
});

const html = {
    HEADER: readFileAsString(path.resolve(__dirname, "header.html")),
    MENU: readFileAsString(path.resolve(__dirname, "menu.html")),
    FOOTER: `<footer>footer</footer>`
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

    const parcedContent = `<div class="markdown-body">
        ${marked(content.replace(metaRegex, ""))}
    </div>`;

    let output = "";
    output = template.replace("{{PAGETITLE}}", generatePageTitle(meta.pageTitle))
    output = output.replace("{{HEADER}}", html.HEADER)
    output = output.replace("{{CONTENT}}", parcedContent)
    output = output.replace("{{MENU}}", html.MENU)
    output = output.replace("{{FOOTER}}", html.FOOTER)

    return { meta, output };
}

function parseArticles(paths) {
    const articles = paths
        .map(fullPath => {
            return {
                pth: path.parse(fullPath),
                article: parseArticle(fullPath),
            }
        });

    // sort articles and do other stuff to them...

    articles.forEach(x => {
        console.log(x.article.meta)
        writeFileSync(
            path.join(outFolder, `${x.pth.name}.html`),
            x.article.output.replace(/\s+/gim, " ")
        )
    });

    console.log("### ALL ARTICLES PARSED");
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

    console.log("### CSS PARSED");
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
