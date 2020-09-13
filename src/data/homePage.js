const publicData = require("./publicData");

function lastNinetyDays() {
    const now = Date.now();
    const earlierLimit = now - 1000 * 60 * 60 * 24 * 90;
    const date = new Date(earlierLimit);
    return date.toISOString().substring(0, 10);
}

function getRandomInt(max, min = 0) {
    const randomNumber = Math.floor(Math.random() * max);
    return randomNumber - min;
}

function getLatestAdditions(source) {
    const limit = lastNinetyDays();
    const latest = source
        .filter(({ added }) => typeof added === "string" && added.length > 0)
        .filter(({ added }) => added >= limit);

    return latest.length === 0 ? [] :
        latest.sort((a, b) => (a.added > b.added ? -1 : 1));
}

function getRandomItems(source, exclude) {
    const result = source.filter(({ docPath }) => !exclude.some(x => x.docPath === docPath));

    if (result.length > 2) {
        const iterations = result.length * 2;
        let counter = 0;
        while (counter < iterations) {
            const x1 = getRandomInt(result.length);
            const x2 = getRandomInt(result.length);

            if (x1 !== x2) {
                const temp = result[x1];
                result[x1] = result[x2];
                result[x2] = temp;
                counter += 1;
            }
        }
    }

    return result;
}

function getTopItemsFromCollection(collection, size) {
    const publicDocs = publicData[collection];
    const latest = getLatestAdditions(publicDocs);
    const random = latest.length < size ? getRandomItems(publicDocs, latest) : [];
    return latest.concat(random).slice(0, size);
}

module.exports = {
    get poetry() {
        return getTopItemsFromCollection("poetry", 8);
    },

    get prose() {
        return getTopItemsFromCollection("prose", 8);
    }
};
