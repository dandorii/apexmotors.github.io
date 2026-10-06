import { vehicles, STATUS } from "../data/vehicles.js";
import { vehicleName, formatPrice, conditionLine } from "../utils/format.js";
import { watchImage } from "../utils/imageLoad.js";

// Renders one gallery tile per vehicle. Tiles are real <button>s, so the
// grid is keyboard and screen-reader friendly without extra wiring.
// Each tile has a fixed aspect ratio (CSS), so layout never jumps, and
// shows a shimmer skeleton until its photo has loaded and faded in.
export function renderGallery(gridElement) {
    if (!gridElement) return;

    vehicles.forEach((vehicle, i) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `gallery-item${vehicle.image ? " has-photo" : ""}`;
        item.setAttribute("aria-haspopup", "dialog");
        item.setAttribute("aria-label", `${vehicleName(vehicle)}: open larger photo`);
        // First row loads eagerly so the top of the page is never blank;
        // everything below lazy-loads.
        const loading = i < 3 ? "eager" : "lazy";
        const photoMarkup = vehicle.image
            ? `<img class="gallery-item-photo" src="${vehicle.image}" alt="" width="1600" height="1000" loading="${loading}" decoding="async" />
               <span class="gallery-item-overlay"></span>`
            : "";
        item.innerHTML = `
            ${photoMarkup}
            <span class="gallery-item-label">
                ${vehicle.model}
                <small>${vehicle.manufacturer}</small>
            </span>
        `;
        item.addEventListener("click", () => openLightbox(vehicle, item));
        gridElement.appendChild(item);
        const img = item.querySelector("img");
        if (img) watchImage(img, item);
    });
}

// -- Lightbox -----------------------------------------------------------------
// One shared dialog, reused for every tile. It shows a large photo, the key
// buying facts, and a link through to the full vehicle page.
let lastTrigger = null;
let currentIndex = -1;

const els = () => {
    const box = document.querySelector(".lightbox");
    if (!box) return null;
    return {
        box,
        close: box.querySelector(".lightbox-close"),
        stage: box.querySelector(".lightbox-stage"),
        img: box.querySelector(".lightbox-img"),
        title: box.querySelector(".lightbox-title"),
        category: box.querySelector(".lightbox-category"),
        meta: box.querySelector(".lightbox-meta"),
        desc: box.querySelector(".lightbox-desc"),
        link: box.querySelector(".lightbox-link"),
        thumbs: box.querySelector(".lightbox-thumbs"),
        count: box.querySelector(".lightbox-count"),
    };
};

function showVehicle(vehicle) {
    const e = els();
    if (!e) return;
    currentIndex = vehicles.indexOf(vehicle);
    const name = vehicleName(vehicle);

    e.title.textContent = name;
    e.category.textContent = vehicle.category;
    e.meta.textContent = `${formatPrice(vehicle)} · ${conditionLine(vehicle)} · ${STATUS[vehicle.status]}`;
    e.desc.textContent = vehicle.description;
    e.link.href = `vehicle.html?id=${encodeURIComponent(vehicle.id)}`;
    e.link.setAttribute("aria-label", `View vehicle details: ${name}`);
    e.count.textContent = `${currentIndex + 1} of ${vehicles.length}`;

    // Swap the photo with a skeleton + fade so a slow load never shows a
    // blank panel.
    e.img.classList.remove("is-loaded");
    e.stage.classList.add("is-loading");
    e.img.alt = vehicle.photoCheck ? `${name} (representative photo)` : name;
    e.img.src = vehicle.image || "";
    watchImage(e.img, e.stage);

    // Extra real views (if the vehicle defines them) become thumbnails.
    e.thumbs.innerHTML = "";
    const extra = Array.isArray(vehicle.views) ? [{ src: vehicle.image, label: "Main" }, ...vehicle.views] : [];
    extra.forEach((view, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `lightbox-thumb${i === 0 ? " is-active" : ""}`;
        b.setAttribute("aria-label", `${name}: ${view.label}`);
        b.innerHTML = `<img src="${view.src}" alt="" loading="lazy" />`;
        b.addEventListener("click", () => {
            e.img.classList.remove("is-loaded");
            e.stage.classList.add("is-loading");
            e.img.src = view.src;
            watchImage(e.img, e.stage);
            e.thumbs.querySelectorAll(".lightbox-thumb").forEach((t) => t.classList.toggle("is-active", t === b));
        });
        e.thumbs.appendChild(b);
    });
}

function openLightbox(vehicle, trigger) {
    const e = els();
    if (!e) return;
    lastTrigger = trigger;
    showVehicle(vehicle);
    e.box.classList.add("is-open");
    document.body.classList.add("modal-open"); // stops the page scrolling behind the dialog
    e.close.focus();
}

function closeLightbox() {
    const e = els();
    if (!e || !e.box.classList.contains("is-open")) return;
    e.box.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    // Return focus to the tile that opened the dialog (keyboard users).
    lastTrigger?.focus();
}

function step(delta) {
    const next = vehicles[(currentIndex + delta + vehicles.length) % vehicles.length];
    showVehicle(next);
}

export function initLightbox() {
    const e = els();
    if (!e || !e.close) return;

    // Three ways to close: the button, a click on the dimmed backdrop (the
    // overlay itself, not the panel), and Escape.
    e.close.addEventListener("click", closeLightbox);
    e.box.addEventListener("click", (event) => {
        if (event.target === e.box) closeLightbox();
    });
    e.box.querySelector(".lightbox-prev")?.addEventListener("click", () => step(-1));
    e.box.querySelector(".lightbox-next")?.addEventListener("click", () => step(1));

    document.addEventListener("keydown", (event) => {
        if (!e.box.classList.contains("is-open")) return;
        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            step(-1);
        } else if (event.key === "ArrowRight") {
            step(1);
        } else if (event.key === "Tab") {
            // Focus trap: keep Tab inside the dialog while it is open.
            const focusable = [...e.box.querySelectorAll("a[href], button:not([disabled])")].filter((n) => n.offsetParent !== null);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}
