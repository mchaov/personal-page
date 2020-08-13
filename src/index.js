const path = require("path");
const { readFileSync, writeFileSync } = require("fs-extra");
const rr = require("recursive-readdir");
const marked = require('marked');
const hljs = require('highlight.js');

const articlesPath = path.resolve(__dirname, "..", "site", "articles");
const template = readFileSync(path.resolve(__dirname, "template")).toString();
const outFolder = path.resolve(__dirname, "..", "public");

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
    HEADER: `<header>Header</header>`,
    MENU: `<menu>menu</menu>`,
    FOOTER: `<footer>footer</footer>`
}

function readFile(pth) {
    return readFileSync(pth).toString();
}

function extractMeta(content) {
    const meta = content.match(metaRegex)[1];
    return JSON.parse(`{${meta}}`)
}

function parseArticle(fullPath) {
    const content = readFile(fullPath);
    const meta = extractMeta(content);

    const parcedContent = `<div class="markdown-body">
        ${marked(content.replace(metaRegex, ""))}
    </div>`;

    let output = "";
    output = template.replace("{{PAGETITLE}}", meta.pageTitle)
    output = template.replace("{{HEADER}}", html.HEADER)
    output = output.replace("{{CONTENT}}", parcedContent)
    output = output.replace("{{MENU}}", html.MENU)
    output = output.replace("{{FOOTER}}", html.FOOTER)

    return output;
}

function parseArticles(paths) {
    paths.forEach(fullPath => {
        const pth = path.parse(fullPath);

        writeFileSync(
            path.join(outFolder, `${pth.name}.html`),
            parseArticle(fullPath)
        )
    });
}

rr(articlesPath)
    .then(parseArticles)
    .catch(console.error)