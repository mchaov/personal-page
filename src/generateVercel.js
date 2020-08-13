const path = require("path");
const { writeFileSync } = require("fs-extra");
const rr = require("recursive-readdir");

const rootPath = path.resolve(__dirname, "..");
const vercelPath = path.join(rootPath, "vercel.json");

const sitePath = path.resolve(__dirname, "..", "site");
const articlesPath = path.join(sitePath, "articles");

const template = (routes) => {
    const defaultRoutes = [];

    defaultRoutes.push({
        src: "/(.*)",
        headers: {
            "Cache-Control": "max-age=31536000",
            "Link": "</css/main.css>; rel=preload; as=style"
        },
        continue: true
    });

    defaultRoutes.push({
        src: "/",
        dest: "/index.html"
    });

    const dynamicRoutes = routes
        .map(x => {
            return {
                src: x,
                dest: `/${x}.html`
            }
        });

    return {
        name: "mchaov personal blog",
        routes: [...defaultRoutes, ...dynamicRoutes]
    }
};

rr(articlesPath)
    .then(x => {
        writeFileSync(
            vercelPath,
            JSON.stringify(
                template(x.map(y => {
                    const p = path.parse(y);
                    return p.name.toLowerCase();
                })), null, 4
            )
        );

        console.log("### Vercel config generated")
    })
    .catch(console.error)