const path = require("path");
const { writeFileSync, readFileSync, existsSync } = require("fs-extra");
const rr = require("recursive-readdir");

const rootPath = path.resolve(__dirname, "..");
const vercelPath = path.join(rootPath, "vercel.json");

const sitePath = path.resolve(__dirname, "..", "site");
const articlesPath = path.join(sitePath, "articles");

const template = (routes) => {
    const home = readFileSync(path.join(rootPath, "public", "index.html"), "utf8");
    const stylesheet = home.match(/<link rel="stylesheet" href="(\/css\/main\.[a-f0-9]{12}\.css)"/);
    if (!stylesheet || !existsSync(path.join(rootPath, "public", stylesheet[1]))) {
        throw new Error("Run npm run articles before generating Vercel routes");
    }
    const defaultRoutes = [];

    defaultRoutes.push({
        src: "/(?!css/|i/)(.*)",
        headers: {
            "Cache-Control": "no-cache",
            "Link": `<${stylesheet[1]}>; rel=preload; as=style`
        },
        continue: true
    });

    defaultRoutes.push({
        src: "/(?:css|i)/(.*)",
        headers: { "Cache-Control": "public, max-age=31536000" },
        continue: true
    });

    defaultRoutes.push({
        src: "/",
        dest: "/index.html"
    });

    const dynamicRoutes = routes
        .map(x => {
            return {
                src: `/${x}`,
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
                template(x.sort().map(y => {
                    const p = path.parse(y);
                    return p.name.toLowerCase();
                })), null, 4
            )
        );

        console.log("### Vercel config generated")
    })
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
