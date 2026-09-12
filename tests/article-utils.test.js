const test = require("node:test");
const assert = require("node:assert/strict");
const {
    getDateParts,
    normalizeTags,
    slugifyTag,
    splitAbstract
} = require("../src/article-utils");

test("normalizeTags accepts arrays and legacy JSON strings", () => {
    assert.deepEqual(
        normalizeTags([" Feature Flags ", "feature flags", "Testing", ""]),
        ["Feature Flags", "Testing"]
    );
    assert.deepEqual(
        normalizeTags('["Performance", "Testing"]'),
        ["Performance", "Testing"]
    );
    assert.deepEqual(normalizeTags("not-json"), []);
    assert.deepEqual(normalizeTags(undefined), []);
});

test("slugifyTag creates stable URL values", () => {
    assert.equal(slugifyTag("Real-Time Web"), "real-time-web");
    assert.equal(slugifyTag("  Quality Assurance  "), "quality-assurance");
});

test("getDateParts uses UTC and a concise display date", () => {
    assert.deepEqual(
        getDateParts(Date.UTC(2024, 1, 28, 23, 59, 59)),
        {
            date: new Date("2024-02-28T23:59:59.000Z"),
            dateIso: "2024-02-28",
            displayDate: "28 Feb 2024",
            month: "02",
            year: "2024"
        }
    );
});

test("excerpts preserve the complete searchable abstract and quoted titles", () => {
    const cases = [
        ["First sentence. Remaining text.", "First sentence."],
        ['In &quot;So, you think you do quality assurance? Part 2,&quot; I discuss quality. More.', 'In &quot;So, you think you do quality assurance? Part 2,&quot; I discuss quality.'],
        ["I wrote for SmashingMagazine.com. More.", "I wrote for SmashingMagazine.com."],
        ["With React 16.8 we got hooks! More.", "With React 16.8 we got hooks!"],
        ["What is a venture without a 'Hello World!' message. More.", "What is a venture without a 'Hello World!' message."],
        ["No sentence terminator", "No sentence terminator"],
        ["", ""]
    ];
    for (const [abstract, expected] of cases) {
        const [excerpt, remainder] = splitAbstract(abstract);
        assert.equal(excerpt, expected);
        assert.equal(excerpt + remainder, abstract);
    }
});
