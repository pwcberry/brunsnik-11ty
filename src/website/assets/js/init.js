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

initializePageLengthWatcher();
