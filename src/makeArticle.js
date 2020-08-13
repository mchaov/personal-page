const path = require("path");
const { writeFileSync } = require("fs-extra");

const sitePath = path.resolve(__dirname, "..", "site");
const articlesPath = path.join(sitePath, "articles");

const _name = process.argv
    .slice(2, process.argv.length)

const name = _name.join(" ");

const pth = path.join(articlesPath, `${_name.join("-")}.md`);

const template = `!{{
    "dateCreated": ${Date.now()},
    "dateUpdated": ${Date.now()},
    "pageTitle": "${name}",
    "abstract": "ADD ABSTACT HERE"
}}

# ${name}`;

writeFileSync(pth, template);

console.log(`### Article "${name}" was created in ${pth}`);