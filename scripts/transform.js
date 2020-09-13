const fs = require("fs");
const pathLib = require("path");
const unzip = require("unzipper");
const convertDocument = require("./convert");

function normalizeFileName(fileName) {
	return fileName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function transformToMarkdown(outputPath, inputFilePath, options) {
	const filename = pathLib.basename(inputFilePath, ".docx");
	const zip = unzip.Parse();
	const outputFilePath = pathLib.join(
		`${outputPath}`,
		`${normalizeFileName(filename)}.md`,
	);

	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(inputFilePath);
		const output = fs.createWriteStream(outputFilePath);

		output.on("close", () => {
			resolve(outputFilePath);
		});

		zip.on("entry", entry => {
			if (entry.path === "word/document.xml") {
				convertDocument(entry, output, options);
			} else {
				entry.autodrain();
			}
		});

		zip.on("close", () => {
			output.close();
		});

		zip.on("error", error => {
			reject(error);
		});

		stream.pipe(zip);
	});
}

async function* transform(outputPath, inputFiles, options) {
	for (const filePath of inputFiles) {
		console.log("Processing:", filePath);
		const outputFilePath = await transformToMarkdown(
			outputPath,
			filePath,
			options
		);
		yield outputFilePath;
	}
}

module.exports = {
	transform
};
