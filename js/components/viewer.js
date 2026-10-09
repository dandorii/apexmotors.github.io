// Photo viewer for a vehicle's exterior / interior / rear views: one large
// stage plus a row of thumbnail buttons. Used on the vehicle detail page.

export function viewerMarkup(views, name) {
    const tabs = views
        .map(
            (view, index) => `
            <button type="button" class="view-tab" data-index="${index}" aria-pressed="${index === 0}">
                <img src="${view.src}" alt="" loading="lazy" />
                <span class="view-tab-label">${view.label}</span>
            </button>`
        )
        .join("");

    return `
        <section class="vehicle-views" aria-label="${name} photos">
            <h2 class="section-heading">Photos</h2>
            <div class="view-stage">
                <img class="view-backdrop" src="${views[0].src}" alt="" aria-hidden="true" />
                <img class="view-main" src="${views[0].src}" alt="${name} — ${views[0].label.toLowerCase()} view" />
            </div>
            <div class="view-tabs">${tabs}</div>
        </section>
    `;
}

export function initViewer(root, views, name) {
    const stage = root.querySelector(".view-stage");
    const main = root.querySelector(".view-main");
    const backdrop = root.querySelector(".view-backdrop");
    const tabs = [...root.querySelectorAll(".view-tab")];
    if (!stage || !main || !backdrop || tabs.length === 0) return;

    let current = 0;

    const show = (index) => {
        if (index === current) return;
        current = index;
        const view = views[index];

        tabs.forEach((tab, i) => tab.setAttribute("aria-pressed", String(i === index)));

        // Fade out, swap once the new photo has loaded, fade back in.
        stage.classList.add("is-changing");
        const next = new Image();
        next.onload = next.onerror = () => {
            if (current !== index) return; // A newer click won.
            main.src = view.src;
            main.alt = `${name} — ${view.label.toLowerCase()} view`;
            backdrop.src = view.src;
            stage.classList.remove("is-changing");
        };
        next.src = view.src;
    };

    tabs.forEach((tab, index) => tab.addEventListener("click", () => show(index)));
}
