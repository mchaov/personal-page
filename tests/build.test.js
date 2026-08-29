const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { existsSync, readFileSync, readdirSync } = require("node:fs");
const path = require("node:path");

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

    const generatedArticles = readdirSync(publicPath)
        .filter(name => name.endsWith(".html") && name !== "index.html");
    assert.equal(generatedArticles.length, 14);

    generatedArticles.forEach(fileName => {
        const content = readFileSync(path.join(publicPath, fileName), "utf8");
        assert.match(content, /class="article-page-meta article-meta"/);
        assert.match(content, /<time datetime="\d{4}-\d{2}-\d{2}">Published /);
        assert.match(content, /class="article-tag" data-filter-tag=/);
        assert.ok(content.indexOf("</h1>") < content.indexOf("article-page-meta"));
    });
});
