const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { existsSync, readFileSync, readdirSync } = require("node:fs");
const path = require("node:path");
const { gzipSync } = require("node:zlib");
const { createHash } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const publicPath = path.join(root, "public");

test("generator emits the static navigation and article metadata", { timeout: 15000 }, () => {
    execFileSync(process.execPath, [path.join(root, "src", "index.js")], {
        cwd: root,
        stdio: "pipe"
    });

    const home = readFileSync(path.join(publicPath, "index.html"), "utf8");
    const articleCards = home.match(/<article class="article-abstract" data-article-card/g) || [];

    assert.equal(articleCards.length, 14);
    assert.match(home, /data-article-navigation hidden/);
    assert.match(home, /name="tag" value="feature-flags"/);
    assert.match(home, /data-tags="feature-flags,testing"/);
    assert.doesNotMatch(home, /\bfetch\s*\(/);
    assert.equal(existsSync(path.join(publicPath, "notes-on-software-architecture.html")), false);
    assert.match(home, /<details class="article-filters"/);
    assert.match(home, /<summary>Filters/);
    assert.match(home, /<span hidden>/);
    assert.doesNotMatch(home, /Read more|<menu|{{[A-Z_:]+}}|Tweak|mc-mock/);
    assert.equal((home.match(/<h1\b/g) || []).length, 1);

    const stylesheet = home.match(/rel="stylesheet" href="([^"]+)"/)[1];
    const logo = home.match(/<img src="([^"]+)" alt="mchaov"/)[1];
    for (const asset of [stylesheet, logo]) {
        const content = readFileSync(path.join(publicPath, asset));
        const hash = createHash("sha256").update(content).digest("hex").slice(0, 12);
        assert.ok(asset.includes(`.${hash}.`), `Invalid asset fingerprint: ${asset}`);
    }
    const css = readFileSync(path.join(publicPath, stylesheet));
    assert.ok(css.length <= 8000);
    assert.ok(gzipSync(css).length <= 2500);
    assert.doesNotMatch(css.toString(), /\.octicon|\.pl-|\.blob-|main-menu/);
    assert.equal(readdirSync(path.join(publicPath, "css")).filter(name => name.endsWith(".css")).length, 1);
    assert.ok(existsSync(path.join(publicPath, "css", "LICENSE.txt")));
    const navigation = [...home.matchAll(/<script>([\s\S]*?)<\/script>/g)]
        .map(match => match[1]).find(script => script.includes("data-article-navigation"));
    assert.ok(navigation);
    assert.ok(gzipSync(navigation).length <= 2000);

    execFileSync(process.execPath, [path.join(root, "src", "generateVercel.js")], { cwd: root, stdio: "pipe" });
    const config = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8"));
    assert.ok(config.routes.some(route => route.headers && route.headers.Link === `<${stylesheet}>; rel=preload; as=style`));
    const cacheFor = url => config.routes.filter(route => route.headers && new RegExp(`^${route.src}$`).test(url))
        .reduce((value, route) => route.headers["Cache-Control"] || value, "");
    assert.equal(cacheFor("/"), "no-cache");
    assert.equal(cacheFor("/hello-world.html"), "no-cache");
    assert.equal(cacheFor(stylesheet), "public, max-age=31536000");
    assert.equal(cacheFor(logo), "public, max-age=31536000");

    const generatedArticles = readdirSync(publicPath)
        .filter(name => name.endsWith(".html") && name !== "index.html");
    assert.equal(generatedArticles.length, 14);

    generatedArticles.forEach(fileName => {
        const content = readFileSync(path.join(publicPath, fileName), "utf8");
        assert.match(content, /class="article-page-meta article-meta"/);
        assert.match(content, /<time datetime="\d{4}-\d{2}-\d{2}">Published /);
        assert.match(content, /class="article-tag" data-filter-tag=/);
        assert.ok(content.indexOf("</h1>") < content.indexOf("article-page-meta"));
        assert.ok(content.includes(`href="${stylesheet}"`));
        assert.ok(content.includes(`src="${logo}"`));
        assert.equal((content.match(/<h1\b/g) || []).length, 1);
        const shell = content.replace(/<article[\s\S]*?<\/article>/, "");
        assert.doesNotMatch(shell, /data-article-navigation|{{[A-Z_:]+}}/);
    });

    for (const file of ["index.html", ...generatedArticles]) {
        const content = readFileSync(path.join(publicPath, file), "utf8");
        assert.match(content, /window\.__perf/);
        assert.match(content, /https:\/\/project-624g0\.vercel\.app\/v1\/tracker\.js/);
        assert.match(content, /googletagmanager\.com\/gtag\/js\?id=UA-84011057-1/);
        const footer = content.match(/<footer[\s\S]*?<\/footer>/)[0];
        assert.equal((footer.match(/<a\b/g) || []).length, 7);
    }
});
