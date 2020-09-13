const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const { ASSETS_DIR, SRC_DIR, checkAssetsDir } = require("./utils");

checkAssetsDir("styles");

[
    "styles/base.scss",
    "styles/home.scss",
    "styles/poetry.scss",
    "styles/article.scss"
].forEach(inputFile => {
    sass.render({
        file: path.join(SRC_DIR, inputFile),
    }, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            const outputName = `${path.basename(inputFile, ".scss")}.css`;
            const { css } = result;

            fs.writeFileSync(path.join(ASSETS_DIR, "styles", outputName), css, { encoding: "utf8" });
            console.log("Wrote:", outputName);
        }
    });
});
