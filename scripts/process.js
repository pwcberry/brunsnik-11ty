const fs = require("fs");
const pathLib = require("path");
const { transform } = require("./transform");
const { generateFrontmatter } = require("./frontmatter");
const { generateDocumentMetadata, updateStaticData } = require("./data");
const { currentDateAsString, isDirectory, isWordDocument, resolvePath } = require("./utils");

function prependFrontmatter(filePath, fields) {
    let fileContents = fs.readFileSync(filePath);
    const frontmatter = generateFrontmatter(fileContents.toString(), fields);

    fs.writeFileSync(filePath, `${frontmatter}${fileContents}`);
}

function getMetadata(filePath, options) {
    let fileContents = fs.readFileSync(filePath);
    return generateDocumentMetadata(fileContents.toString(), {
        ...options,
        filePath
    });
}

/**
 * Process an array of Word documents.
 *
 * @param {string} outputPath The target path for the Markdown files
 * @param {string[]} inputFiles The list of Word documents to process
 * @param {Object} options The options for parsing and output format
 * @param {boolean} options.asStanza Output a Word `<w:p>` element as part of a stanza
 * @param {number} options.year The year the document was originally written
 * @param {string} options.collection The collection the document belongs to
 * @param {string} options.layout The layout to use by Eleventy to generate the HTML file
 * @param {string} options.description The prefix to use for the document's description in the front-matter
 * @returns {Array} The metadata for each file that has been transformed
 */
async function processFiles(outputPath, inputFiles, options) {
    const result = [];
    if (!Array.isArray(inputFiles)) {
        console.error(
            "The function \"processFiles\" expects an array of file paths.",
        );
    } else {
        const fullOutputPath = pathLib.resolve(outputPath);
        if (!isDirectory(fullOutputPath)) {
            console.error(`Specified output path "${outputPath}" is not a directory`);
        } else {
            console.log("Output path:", fullOutputPath);
            const dateAdded = currentDateAsString();

            for await (const newFilePath of transform(fullOutputPath, inputFiles, options)) {
                const metadata = getMetadata(newFilePath, { dateAdded, ...options });
                prependFrontmatter(newFilePath, {
                    description: options.description,
                    layout: options.layout,
                    title: metadata.title,
                    when: metadata.when,
                    firstLine: metadata.firstLine
                });
                result.push(metadata);
            }
        }
    }
    updateStaticData(result, options);
}

/**
 * Process a directory containing Word documents.
 *
 * @param {string} outputPath The target path for the Markdown files
 * @param {string} path The path of the directory containing the Word documents to process
 * @param {Object} options The options for parsing and output format
 * @param {boolean} options.asStanza Output a Word `<w:p>` element as part of a stanza
 * @param {number} options.year The year the document was originally composed
 * @param {string} options.collection The collection the document belongs to
 * @param {string} options.layout The layout to use by Eleventy to generate the HTML file
 * @param {string} options.description The prefix to use for the document's description in the front-matter
 */
async function processDirectory(outputPath, path, options) {
    const inputPath = resolvePath(path);

    if (!isDirectory(inputPath)) {
        if (isWordDocument(inputPath)) {
             await processFiles(outputPath, [inputPath], options);
        } else {
            console.error(`Specified file "${path}" is not a directory`);
        }
    } else {
        const files = fs
            .readdirSync(inputPath)
            .filter(path => isWordDocument(path))
            .map(file => pathLib.join(inputPath, file));

        await processFiles(outputPath, files, options);
    }
}

module.exports = {
    processDirectory,
    processFiles,
};
