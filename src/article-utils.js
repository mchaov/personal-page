const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

function normalizeTags(value) {
    let tags = value;

    if (typeof tags === "string") {
        try {
            tags = JSON.parse(tags);
        } catch (_) {
            return [];
        }
    }

    if (!Array.isArray(tags)) {
        return [];
    }

    const seen = new Set();

    return tags.reduce((result, tag) => {
        if (typeof tag !== "string") {
            return result;
        }

        const label = tag.trim();
        const key = label.toLowerCase();
        if (!label || seen.has(key)) {
            return result;
        }

        seen.add(key);
        result.push(label);
        return result;
    }, []);
}

function slugifyTag(value) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getDateParts(value) {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid article date: ${value}`);
    }

    const monthIndex = date.getUTCMonth();
    const year = String(date.getUTCFullYear());
    const month = String(monthIndex + 1).padStart(2, "0");

    return {
        date,
        dateIso: date.toISOString().slice(0, 10),
        displayDate: `${date.getUTCDate()} ${MONTH_NAMES[monthIndex]} ${year}`,
        month,
        year
    };
}

module.exports = {
    MONTH_NAMES,
    getDateParts,
    normalizeTags,
    slugifyTag
};
