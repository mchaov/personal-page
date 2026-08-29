const test = require("node:test");
const assert = require("node:assert/strict");
const {
    getDateParts,
    normalizeTags,
    slugifyTag
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
