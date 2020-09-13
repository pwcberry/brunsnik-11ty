const fs = require("fs");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "../src");
const DATA_DIR = path.resolve(__dirname, "../src/data");
const DIST_DIR = path.resolve(__dirname, "../_site");
const ASSETS_DIR = path.resolve(__dirname, "../src/website/assets");

const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// GNARLY: Function that returns a value and causes a side-effect
function checkDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        return false;
    }
    return true;
}

function checkAssetsDir(subPath) {
    if (subPath) {
        const assetsPath = path.join(ASSETS_DIR, subPath);
        if (!checkDir(assetsPath)) {
            console.log(`Created "assets/${subPath}" directory`);
        }
    }else    if (!checkDir(ASSETS_DIR)) {
        console.log("Created \"assets\" directory");
    }
}

function checkDistDir() {
    if (!checkDir(DIST_DIR)) {
        console.log("Created \"_site\" directory");
    }
}
function currentDateAsString() {
    const d = new Date();
    return d.toISOString().substring(0, 10);
}

function isDirectory(path) {
    const stats = fs.statSync(path);
    return stats.isDirectory();
}

function isWordDocument(path) {
    return /\.docx$/.test(path);
}

function resolvePath(filePath) {
    const stat = path.parse(filePath);
    return stat.root.length > 0 ? filePath : path.resolve(filePath);
}

function formatDate(date) {
    const [year, month] = date.split("-");
    return `${MONTHS[parseInt(month)]} ${year}`.trim();
}

module.exports = {
    ASSETS_DIR,
    DATA_DIR,
    DIST_DIR,
    SRC_DIR,
    MONTHS,
    checkAssetsDir,
    checkDistDir,
    currentDateAsString,
    formatDate,
    isDirectory,
    isWordDocument,
    resolvePath
};
