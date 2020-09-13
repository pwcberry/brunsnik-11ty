const fs = require("fs");
const path = require("path");
const { DATA_DIR, formatDate } = require("./utils");

const MAX_CHARACTERS = 300;
const MIN_CHARACTERS = 20;

function toNextSpace(line, trimLength) {
    const indexOfTrimSpace = line.indexOf(" ", trimLength);
    return line.substring(0, indexOfTrimSpace);
}

function trimPunctuation(line) {
    return line.replace(/[,.;\s-]+$/, "");
}

/**
 * @param fileContents
 * @param collection
 * @param dateAdded
 * @param filePath
 * @param year
 * @returns {Object} The metadata for the document
 */
function generateDocumentMetadata(fileContents, { collection, dateAdded, filePath, year }) {
    const date = `${year}-00`;
    const metadata = {
        collection,
        added: dateAdded,
        date,
        when: formatDate(date),
        private: false,
        title: "",
        firstLine: "",
        excerpt: "",
        docPath: `/${collection}/${path.basename(filePath, ".md")}.html`
    };

    let lineCounter = 0;
    let characterCount = 0;

    const lines = fileContents.split("\n");
    const excerpt = [];

    for (const line of lines) {
        if (!metadata.title && (/^#[^#]/.test(line))) {
            metadata.title = trimPunctuation(line.substr(2));
            lineCounter += 1;
        } else if (!(/^##+/.test(line)) && lineCounter <= 4) {
            const trimmedLine = line.trim();
            const lineLength = trimmedLine.length;

            if ((characterCount < MAX_CHARACTERS) && (lineLength > 0)) {
                const charactersRemaining = MAX_CHARACTERS - characterCount;
                if (charactersRemaining > MIN_CHARACTERS) {
                    const lineLength = line.length;
                    const lineToWrite = lineLength < charactersRemaining ? trimmedLine : toNextSpace(line, charactersRemaining) + "...";

                    if (lineCounter === 1) {
                        metadata.firstLine = trimPunctuation(lineToWrite);
                    }

                    excerpt.push(`<p>${lineToWrite}</p>`);

                    characterCount += lineLength;
                }
            }

            if (line.trim().length > 0) {
                lineCounter += 1;
            }
        } else if (lineCounter > 4) {
            break;
        }
    }

    metadata.excerpt = excerpt.join("");

    return metadata;
}

function updateStaticData(metadata, { collection }) {
    if (!Array.isArray(metadata) || !metadata.length) {
        return;
    }

    const dataPath = path.join(DATA_DIR, `${collection}.json`);
    const sourceData = fs.readFileSync(dataPath);
    const staticData = JSON.parse(sourceData.toString());

    for (let item of metadata) {
        const target = staticData.find(x => x.docPath === item.docPath);

        if (target) {
            Object.keys(target).forEach(key => {
               if (target[key] !== item[key]) {
                   target[key] = item[key];
               }
            });
        } else {
            staticData.push(item);
        }
    }

    staticData.sort((a, b) => a.title > b.title ? 1 : -1);

    fs.writeFileSync(dataPath, JSON.stringify(staticData, null, 2));
}

module.exports = {
    generateDocumentMetadata,
    updateStaticData
};
