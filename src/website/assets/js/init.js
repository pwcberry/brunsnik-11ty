const imageToWidth = new Map([
    ["brunsnik_bg_mob_portrait", "(min-width: 320px) and (orientation: portrait)"],
    ["brunsnik_bg_mob_landscape", "(min-width: 568px) and (orientation: landscape)"],
    ["brunsnik_bg_tablet_portrait", "(min-width: 768px) and (orientation: portrait)"],
    ["brunsnik_bg_desktop", "(min-width: 1024px) and (orientation: landscape)"],
]);

function createStyle(imageKey, data) {
    const ruleArgs = imageToWidth.get(imageKey);

    return `@media screen and ${ruleArgs} {
    body {
      background-image: url("${data}");
    }
}`;
}

function readImage(imageData) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            resolve(reader.result);
        });
        reader.readAsDataURL(imageData);
    });
}

function downloadBackgroundImages() {
    Promise.all([
        fetch("/assets/jpg/brunsnik_bg_mob_portrait.jpg"),
        fetch("/assets/jpg/brunsnik_bg_mob_landscape.jpg"),
        fetch("/assets/jpg/brunsnik_bg_tablet_portrait.jpg"),
        fetch("/assets/jpg/brunsnik_bg_desktop.jpg"),
    ]).then(list => {
        return new Promise(async (resolve) => {
            const styles = [];
            const mediaKeys = Array.from(imageToWidth.keys());

            let image = await list[0].blob();
            let data = await readImage(image);
            styles.push(createStyle(mediaKeys[0], data));

            image = await list[1].blob();
            data = await readImage(image);
            styles.push(createStyle(mediaKeys[1], data));

            image = await list[2].blob();
            data = await readImage(image);
            styles.push(createStyle(mediaKeys[2], data));

            image = await list[3].blob();
            data = await readImage(image);
            styles.push(createStyle(mediaKeys[3], data));

            resolve(styles);
        });
    }).then(styles => {
        const element = document.createElement("style");
        element.id = "Background-Images";
        element.textContent = styles.join("\n");
        document.head.appendChild(element);
    });
}

function checkBackToTopSpace() {
    const contentMain = document.querySelector("main");
    const { height } = contentMain ? contentMain.getBoundingClientRect() : document.body.getBoundingClientRect();

    if (height > window.innerHeight) {
        document.body.parentElement.classList.remove("no-back-to-top");
    } else {
        // Have to attach class to <html> as modifying attributes of an observed element has no effect
        document.body.parentElement.classList.add("no-back-to-top");
    }
}

function initializePageLengthWatcher() {
    const observer = new MutationObserver((mutationsList) => {
        const isMutated = mutationsList.some(m => m.type === "childList");

        if (isMutated) {
            checkBackToTopSpace();
        }
    });

    observer.observe(document.body, {
        childList: true, subtree: true
    });
}

downloadBackgroundImages();
initializePageLengthWatcher();
