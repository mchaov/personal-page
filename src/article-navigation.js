function normalizeSearch(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function parseFilterParams(search) {
    const params = new URLSearchParams(search || "");
    const year = params.get("year") || "";
    const month = params.get("month") || "";
    const tags = params
        .getAll("tag")
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean);

    return {
        query: (params.get("q") || "").trim(),
        tags: [...new Set(tags)],
        year: /^\d{4}$/.test(year) ? year : "",
        month: /^(0[1-9]|1[0-2])$/.test(month) ? month : ""
    };
}

function matchesArticle(article, filters) {
    const terms = normalizeSearch(filters.query).split(" ").filter(Boolean);
    const searchText = normalizeSearch(article.searchText);
    const articleTags = article.tags || [];

    return terms.every(term => searchText.includes(term))
        && (filters.tags || []).every(tag => articleTags.includes(tag))
        && (!filters.year || article.year === filters.year)
        && (!filters.month || article.month === filters.month);
}

function resolveYearForMonth(month, currentYear, availableDates) {
    if (!month) {
        return currentYear || "";
    }

    if (currentYear && availableDates.some(date => date.year === currentYear && date.month === month)) {
        return currentYear;
    }

    const matchingYears = availableDates
        .filter(date => date.month === month)
        .map(date => date.year)
        .sort((left, right) => Number(right) - Number(left));

    return matchingYears[0] || "";
}

function initArticleNavigation(doc, win) {
    const navigation = doc.querySelector("[data-article-navigation]");
    if (!navigation) {
        return;
    }

    const form = navigation.querySelector("[data-article-filter-form]");
    const searchInput = form.elements.q;
    const yearSelect = form.elements.year;
    const monthSelect = form.elements.month;
    const clearButton = form.querySelector("[type=reset]");
    const tagDetails = form.querySelector("[data-article-tag-filter]");
    const tagCount = form.querySelector("[data-selected-tag-count]");
    const tagInputs = [...form.querySelectorAll("input[name=tag]")];
    const resultCount = navigation.querySelector("[data-article-result-count]");
    const emptyState = doc.querySelector("[data-article-empty]");
    const cards = [...doc.querySelectorAll("[data-article-card]")];

    const articles = cards.map(element => {
        const title = element.querySelector(".article-title");
        const summary = element.querySelector(".article-summary-text");
        const tagLabels = [...element.querySelectorAll("[data-filter-tag]")]
            .map(tag => tag.textContent);

        return {
            element,
            month: element.dataset.month,
            searchText: [title && title.textContent, summary && summary.textContent, ...tagLabels].join(" "),
            tags: (element.dataset.tags || "").split(",").filter(Boolean),
            year: element.dataset.year
        };
    });

    const availableDates = articles.map(article => ({
        month: article.month,
        year: article.year
    }));
    const availableTags = new Set(tagInputs.map(input => input.value));
    const availableYears = new Set(articles.map(article => article.year));

    function getFilters() {
        return {
            month: monthSelect.value,
            query: searchInput.value.trim(),
            tags: tagInputs.filter(input => input.checked).map(input => input.value),
            year: yearSelect.value
        };
    }

    function updateMonthOptions() {
        const selectedYear = yearSelect.value;

        [...monthSelect.options].forEach(option => {
            if (!option.value) {
                return;
            }

            option.disabled = !availableDates.some(date => {
                return date.month === option.value && (!selectedYear || date.year === selectedYear);
            });
        });

        if (monthSelect.selectedOptions[0] && monthSelect.selectedOptions[0].disabled) {
            monthSelect.value = "";
        }
    }

    function updateLocation(filters) {
        const url = new win.URL(win.location.href);
        ["q", "tag", "year", "month"].forEach(name => url.searchParams.delete(name));

        if (filters.query) {
            url.searchParams.set("q", filters.query);
        }
        filters.tags.forEach(tag => url.searchParams.append("tag", tag));
        if (filters.year) {
            url.searchParams.set("year", filters.year);
        }
        if (filters.month) {
            url.searchParams.set("month", filters.month);
        }

        win.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }

    function applyFilters() {
        const filters = getFilters();
        let visibleCount = 0;

        articles.forEach(article => {
            const visible = matchesArticle(article, filters);
            article.element.hidden = !visible;
            if (visible) {
                visibleCount += 1;
            }
        });

        resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "article" : "articles"}`;
        emptyState.hidden = visibleCount !== 0;
        tagCount.textContent = filters.tags.length ? `(${filters.tags.length} selected)` : "";
        clearButton.disabled = !filters.query
            && !filters.tags.length
            && !filters.year
            && !filters.month;
        updateLocation(filters);
    }

    const initial = parseFilterParams(win.location.search);
    searchInput.value = initial.query;
    yearSelect.value = availableYears.has(initial.year) ? initial.year : "";
    tagInputs.forEach(input => {
        input.checked = initial.tags.includes(input.value) && availableTags.has(input.value);
    });

    const validMonth = availableDates.some(date => date.month === initial.month);
    monthSelect.value = validMonth ? initial.month : "";
    if (monthSelect.value) {
        yearSelect.value = resolveYearForMonth(monthSelect.value, yearSelect.value, availableDates);
    }

    updateMonthOptions();
    navigation.hidden = false;
    applyFilters();

    searchInput.addEventListener("input", applyFilters);
    tagInputs.forEach(input => input.addEventListener("change", applyFilters));

    yearSelect.addEventListener("change", () => {
        updateMonthOptions();
        applyFilters();
    });

    monthSelect.addEventListener("change", () => {
        if (monthSelect.value) {
            yearSelect.value = resolveYearForMonth(monthSelect.value, yearSelect.value, availableDates);
        }
        updateMonthOptions();
        applyFilters();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        applyFilters();
    });

    form.addEventListener("reset", event => {
        event.preventDefault();
        searchInput.value = "";
        yearSelect.value = "";
        monthSelect.value = "";
        tagInputs.forEach(input => {
            input.checked = false;
        });
        updateMonthOptions();
        applyFilters();
        searchInput.focus();
    });

    doc.addEventListener("click", event => {
        const link = event.target.closest("[data-filter-tag]");
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const input = tagInputs.find(tagInput => tagInput.value === link.dataset.filterTag);
        if (!input) {
            return;
        }

        event.preventDefault();
        input.checked = true;
        tagDetails.open = true;
        applyFilters();
    });
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        matchesArticle,
        normalizeSearch,
        parseFilterParams,
        resolveYearForMonth
    };
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
    initArticleNavigation(document, window);
}
