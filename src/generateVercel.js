const path = require("path");
const { writeFileSync } = require("fs-extra");
const rr = require("recursive-readdir");

const rootPath = path.resolve(__dirname, "..");
const vercelPath = path.join(rootPath, "vercel.json");

const sitePath = path.resolve(__dirname, "..", "site");
const articlesPath = path.join(sitePath, "articles");

const template = (routes) => `{
    "name": "mchaov personal blog",
    "routes": [
        {
            "src": "/(.*)",
            "headers": {
                "Cache-Control": "max-age=31536000",
                "Link": "</main.css>; rel=preload; as=style"
            },
            "continue": true
        },
        {
            "src": "/",
            "dest": "/index.html"
        },
        ${
    routes
        .map(x => {
            return `{
                "src": "/${x}",
                "dest": "/${x}.html"
            }`
        })
        .join(",")
    }
    ]
}`;

rr(articlesPath)
    .then(x => {
        writeFileSync(
            vercelPath,
            template(x.map(y => {
                const p = path.parse(y);
                return p.name
            }))
        );

        console.log("### Vercel config generated")
    })
    .catch(console.error)