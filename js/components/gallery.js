import { vehicles, getVehicleViews } from "../data/vehicles.js";

// Renders one gallery tile per vehicle into the given grid container.
// Each tile is a real <button>, not a <div>, so the gallery is fully
// keyboard- and screen-reader-navigable without any extra tabindex/role
// wiring — buttons get that behavior for free.
export function renderGallery(gridElement) {
    if (!gridElement) return;

    vehicles.forEach((vehicle) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `gallery-item${vehicle.image ? " has-photo" : ""}`;
        item.setAttribute("aria-haspopup", "dialog");
        const photoMarkup = vehicle.image
            ? `<img class="gallery-item-photo" src="${vehicle.image}" alt="${vehicle.manufacturer} ${vehicle.model}" loading="lazy" />
         <span class="gallery-item-overlay"></span>`
            : "";
        item.innerHTML = `
            ${photoMarkup}
            <span class="gallery-item-label">
                ${vehicle.model}
                <small>${vehicle.manufacturer}</small>
            </span>
        `;
        item.addEventListener("click", () => openLightbox(vehicle));
        gridElement.appendChild(item);
    });
}

// One shared dialog is reused for every tile, rather than building a
// modal per vehicle up front, so the gallery page's DOM stays small
// regardless of how many vehicles are in the collection.
function openLightbox(vehicle) {
    const lightbox = document.querySelector(".lightbox");
    const closeButton = lightbox?.querySelector(".lightbox-close");
    const photoEl = lightbox?.querySelector(".lightbox-photo");
    const titleEl = lightbox?.querySelector(".lightbox-title");
    const categoryEl = lightbox?.querySelector(".lightbox-category");
    const descEl = lightbox?.querySelector(".lightbox-desc");

    // Bail out rather than partially populate the dialog if the expected
    // markup isn't there — a half-filled lightbox would be more confusing
    // than one that simply doesn't open.
    if (!lightbox || !closeButton || !photoEl || !titleEl || !categoryEl || !descEl) return;

    // Show the enlarged photo when the vehicle has one; otherwise hide the
    // image slot so the dialog falls back to text only.
    if (vehicle.image) {
        photoEl.src = vehicle.image;
        photoEl.alt = `${vehicle.manufacturer} ${vehicle.model}`;
        photoEl.hidden = false;
    } else {
        photoEl.removeAttribute("src");
        photoEl.hidden = true;
    }

    // Exterior / Interior / Rear buttons, when the vehicle has more than one view.
    const viewsEl = lightbox.querySelector(".lightbox-views");
    const views = getVehicleViews(vehicle);
    if (viewsEl) {
        viewsEl.innerHTML = "";
        viewsEl.hidden = views.length < 2;
        if (views.length > 1) {
            views.forEach((view, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "lightbox-view-btn";
                button.textContent = view.label;
                button.setAttribute("aria-pressed", String(index === 0));
                button.addEventListener("click", () => {
                    photoEl.src = view.src;
                    photoEl.alt = `${vehicle.manufacturer} ${vehicle.model} — ${view.label.toLowerCase()} view`;
                    viewsEl.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
                });
                viewsEl.appendChild(button);
            });
        }
    }

    titleEl.textContent = `${vehicle.manufacturer} ${vehicle.model}`;
    categoryEl.textContent = vehicle.category;
    descEl.textContent = vehicle.description;
    const specsLink = lightbox.querySelector(".lightbox-specs");
    if (specsLink) specsLink.href = `vehicle.html?id=${encodeURIComponent(vehicle.id)}`;
    lightbox.classList.add("is-open");

    // Move focus into the dialog on open, since a mouse click doesn't do
    // this automatically — without it, keyboard/screen-reader users would
    // stay focused on a now-hidden gallery tile behind the overlay.
    closeButton.focus();
}

export function initLightbox() {
    const lightbox = document.querySelector(".lightbox");
    const closeButton = lightbox?.querySelector(".lightbox-close");
    if (!lightbox || !closeButton) return;

    const close = () => lightbox.classList.remove("is-open");

    closeButton.addEventListener("click", close);

    // Clicking the dimmed backdrop counts as "outside the panel" only when
    // the click target is the overlay itself, not something inside it —
    // otherwise clicking the title or description would also close it.
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) close();
    });

    // Escape is a standard, expected way to dismiss any modal dialog,
    // so it's bound globally rather than only while the lightbox has focus.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    });
}
