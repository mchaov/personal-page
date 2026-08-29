const test = require("node:test");
const assert = require("node:assert/strict");
const {
    matchesArticle,
    parseFilterParams,
    resolveYearForMonth
} = require("../src/article-navigation");

const article = {
    month: "02",
    searchText: "Testing feature flags safely Quality Assurance",
    tags: ["feature-flags", "testing"],
    year: "2024"
};

test("matchesArticle combines query terms, all tags, year, and month", () => {
    assert.equal(matchesArticle(article, {
        query: "flags testing",
        tags: ["feature-flags", "testing"],
        year: "2024",
        month: "02"
    }), true);

    assert.equal(matchesArticle(article, {
        query: "flags",
        tags: ["feature-flags", "risk-management"],
        year: "2024",
        month: "02"
    }), false);

    assert.equal(matchesArticle(article, {
        query: "missing",
        tags: [],
        year: "",
        month: ""
    }), false);
});

test("parseFilterParams supports repeated tags and ignores invalid dates", () => {
    assert.deepEqual(
        parseFilterParams("?q=web%20performance&tag=frontend&tag=performance&tag=frontend&year=2023&month=11"),
        {
            query: "web performance",
            tags: ["frontend", "performance"],
            year: "2023",
            month: "11"
        }
    );

    assert.deepEqual(
        parseFilterParams("?year=23&month=13"),
        { query: "", tags: [], year: "", month: "" }
    );
});

test("resolveYearForMonth keeps compatible years and otherwise selects the newest", () => {
    const dates = [
        { year: "2020", month: "08" },
        { year: "2023", month: "11" },
        { year: "2024", month: "02" },
        { year: "2022", month: "02" }
    ];

    assert.equal(resolveYearForMonth("02", "2022", dates), "2022");
    assert.equal(resolveYearForMonth("02", "2023", dates), "2024");
    assert.equal(resolveYearForMonth("11", "", dates), "2023");
    assert.equal(resolveYearForMonth("12", "", dates), "");
});
