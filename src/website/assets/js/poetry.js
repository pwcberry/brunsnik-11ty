const container = document.querySelector(".article-container");

function playerLink({docPath , title}) {
    const message = `Jump to hear a reading of "${title}"`;
    return `
        <a class="poem-audio-player-link" href="${docPath}#player" title="${message}">
            <svg viewBox="0 0 32 32" width="100%" height="100%">
                <use xlink:href="#player-icon"/>
            </svg>
            ${message}
        </a>
    `;
}

function updateView(data) {
    const html = data.map(item => `
      <article>
        <p><a href="${item.docPath}">${item.title}</a></p>
        <time>${item.when}</time>
        ${item.soundcloudId ? playerLink(item) : ""}
      </article>
   `);
    container.innerHTML = html.join("");
}

document.querySelector(".poetry-switcher").addEventListener("change",
    ({ target }) => {
        if (target.value === "date") {
            POETRY_DATA.sort((a, b) => (a.date < b.date ? 1 : -1));
        } else {
            POETRY_DATA.sort((a, b) => (a.title > b.title ? 1 : -1));
        }
        updateView(POETRY_DATA);
    });
