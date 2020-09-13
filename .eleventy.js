const { MONTHS } = require("./scripts/utils");

module.exports = function (config) {
    config.addPassthroughCopy("src/website/assets");

    config.addHandlebarsShortcode("json", data => JSON.stringify(data, null, 2));
    config.addPairedHandlebarsShortcode("eq", (content, val1, val2) => val1 === val2 ? content : "");

    config.addHandlebarsHelper("formatDate", (value) => {
        const [y, m, d] = value.split("-").map(s => parseInt(s));
        return !isNaN(d) ? `${d} ${MONTHS[m]} ${y}` : `${MONTHS[m]} ${y}`;
    });

    return {
        dir: {
            input: "src/website",
            output: "_site",
            includes: "../includes",
            layouts: "../layouts",
            data: "../data"
        }
    };
};
