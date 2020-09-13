const Sax = require("sax");

/**
 * Convert an incoming Word document (.docx) to a Markdown document.
 *
 * @param inputStream The Word document expressed as a Node Readable stream
 * @param outputStream The Markdown document expressed as a Node Writable stream
 * @param {Object} options The options for parsing and output format
 * @param {boolean} options.asStanza Output a Word `<w:p>` element as part of a stanza
 */
function convertDocument(inputStream, outputStream, options = {}) {
    const convertOptions = {
        asStanza: true,
        ...options
    };

    const saxStream = Sax.createStream(true);
    const format = {
        paragraph: false,
        heading: false,
        text: false,
        addSpace: false,
        run: [],
    };

    saxStream.on("opentag", node => {
        switch (node.name) {
        case "w:pStyle":
            if (node.attributes["w:val"] === "Title") {
                outputStream.write("# ");
                format.heading = true;
            } else if (node.attributes["w:val"] === "Heading1") {
                outputStream.write("## ");
                format.heading = true;
            }
            break;
        case "w:p":
            format.paragraph = true;
            break;
        case "w:i":
            format.run.push("i");
            outputStream.write("_");
            break;
        case "w:b":
            format.run.push("b");
            outputStream.write("**");
            break;
        case "w:r":
            format.run = [];
            break;
        default:
            break;
        }
    });
    saxStream.on("closetag", nodeName => {
        switch (nodeName) {
        case "w:p":
            if (format.text) {
                if (format.heading) {
                    outputStream.write("\n\n");
                } else if (convertOptions.asStanza) {
                    outputStream.write("  \n");
                } else {
                    outputStream.write("\n\n");
                }
                format.text = false;
                format.heading = false;
                format.paragraph = false;
            } else {
                outputStream.write("\n");
            }
            break;
        case "w:r":
            while (format.run.length) {
                const node = format.run.pop();
                if (node === "b") {
                    outputStream.write("**");
                } else if (node === "i") {
                    outputStream.write("_");
                }
            }
            if (format.addSpace) {
                outputStream.write(" ");
                format.addSpace = false;
            }
            break;
        default:
            break;
        }
    });
    saxStream.on("text", text => {
        if (text.length > 0) {
            format.text = true;
            const match = /\S(\s+)$/.exec(text);
            let textToWrite = text;
            if (match && match[1]) {
                format.addSpace = true;
                textToWrite = text.replace(/\s+$/, "");
            }
            outputStream.write(textToWrite);
        }
    });
    saxStream.on("error", error => {
        console.error(error);
        this._parser.error = null;
        this._parser.resume();
    });
    saxStream.on("close", () => {
        console.log("XML stream closed");
    });
    inputStream.pipe(saxStream);
}

module.exports = convertDocument;
