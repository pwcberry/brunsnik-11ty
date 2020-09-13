const { processFiles, processDirectory } = require("./process");

async function main(args) {
    const now = new Date();
    const options = {
        asStanza: true,
        collection: "poetry",
        layout: "poetry.hbs",
        description: "A poem written by brunsnik. ",
        year: now.getFullYear()
    };

    switch (args.length) {
    case 0:
    case 1:
        console.error(
            "Usage: poetry.js outputPath [[inputPath] [file1 file2 ...]]",
        );
        break;
    case 2:
        await processDirectory(args[0], args[1], options);
        break;
    default:
        await processFiles(args[0], args.slice(1), options);
        break;
    }
}

main(process.argv.slice(2));
