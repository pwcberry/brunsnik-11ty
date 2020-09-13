const poetry = require("./poetry.json");
const prose = require("./prose.json");

function trimFields(item) {
    return {
        title: item.title,
        added: item.added,
        date: item.date,
        when: item.when,
        firstLine: item.firstLine,
        excerpt: item.excerpt,
        docPath: item.docPath
    };
}

function getPublicDocuments(collection) {
    if (collection === "prose") {
        return prose.filter(item => !item.private).map(trimFields);
    }
    return poetry.filter(item => !item.private).map(trimFields);
}

module.exports = {
    get poetry() {
        return getPublicDocuments("poetry");
    },

    get prose() {
        return getPublicDocuments("prose");
    }
};
