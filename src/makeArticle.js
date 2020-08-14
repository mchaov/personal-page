const path = require("path");
const { writeFileSync } = require("fs-extra");
const { v4: uuidv4 } = require('uuid');

const sitePath = path.resolve(__dirname, "..", "site");
const articlesPath = path.join(sitePath, "articles");

const _name = process.argv
    .slice(2, process.argv.length)
    .map(x => x.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))

const name = _name.join(" ");

const pth = path.join(articlesPath, `${_name.join("-")}.md`);

const template = `!{{
    "dateCreated": ${Date.now()},
    "dateUpdated": ${Date.now()},
    "pageTitle": "${name}",
    "tags": "[]",
    "id": "${uuidv4()}",
    "abstract": "ADD ABSTACT HERE"
}}

# ${name}`;

writeFileSync(pth, template);

console.log(`### Article "${name}" was created in ${pth}`);