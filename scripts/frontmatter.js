const DOC_FRONTMATTER = `---
layout: [[layout]]
title: "[[title]]"
when: "[[when]]"
description: "[[description]]"
---
`;

/**
 * Generate a document's front-matter.
 *
 * @param {string} fileContents The text content (UTF8) of the document
 * @param {string} description The description of the document for the HTML meta data
 * @param {string} firstLine The first line extracted from the document
 * @param {string} layout The layout to use by Eleventy to generate the HTML file
 * @param {string} title The title to use for the document
 * @param {string} when The month and year for when the document was written
 * @returns {string} The front-matter for the document
 */
function generateFrontmatter(fileContents, { description, firstLine, layout, title, when }) {
    const placeholders = new Map([
        ["[[description]]", `${description}${firstLine}...`],
        ["[[layout]]", layout],
        ["[[title]]", title],
        ["[[when]]", when],
    ]);

    let output = DOC_FRONTMATTER;

    for (const [key, value] of placeholders.entries()) {
        output = output.replace(key, value);
    }

    return output;
}

module.exports = {
    generateFrontmatter,
};
