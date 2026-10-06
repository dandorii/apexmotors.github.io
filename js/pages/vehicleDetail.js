import { vehicles, getVehicleById, STATUS } from "../data/vehicles.js";
import { createVehicleCard } from "../components/vehicleCard.js";
import {
    vehicleName,
    formatPower,
    formatTorque,
    formatZeroToHundred,
    formatTopSpeed,
    formatWeight,
    formatPrice,
    conditionLabel,
    formatMileage,
    contactHref,
    getViews,
    usesCrops,
} from "../utils/format.js";
import { watchImage } from "../utils/imageLoad.js";

// Spec rows in display order: [label, formatter]. A row is skipped when
// the formatter returns "" (the field is absent), so the page never shows
// a blank value or "N/A".
const SPEC_ROWS = [
    ["Year", (v) => String(v.year || "")],
    ["Condition", conditionLabel],
    ["Mileage", formatMileage],
    ["Engine", (v) => v.engine || ""],
    ["Power", formatPower],
    ["Torque", formatTorque],
    ["Transmission", (v) => v.transmission || ""],
    ["Drivetrain", (v) => v.drivetrain || ""],
    ["0–100 km/h", formatZeroToHundred],
    ["Top speed", formatTopSpeed],
    ["Weight", formatWeight],
];

// -- Meters ---------------------------------------------------------------
// Specs are numbers (see vehicles.js), so no text parsing is needed. A bar
// is only drawn when its inputs exist; nothing is guessed.
const clamp01 = (n) => Math.max(0, Math.min(1, n));

function buildMeters(v) {
    const meters = [];
    if (v.powerHp != null) meters.push({ label: "Power", value: `${v.powerHp} hp`, pct: clamp01((v.powerHp - 400) / (1000 - 400)) });
    if (v.zeroToHundred != null) meters.push({ label: "Acceleration", value: `0–100 in ${v.zeroToHundred.toFixed(1)} s`, pct: clamp01((5 - v.zeroToHundred) / (5 - 2.4)) });
    if (v.topSpeedKmh != null) meters.push({ label: "Top speed", value: `${v.topSpeedKmh} km/h`, pct: clamp01((v.topSpeedKmh - 240) / (350 - 240)) });
    if (v.powerHp != null && v.weightKg != null) {
        const ptw = Math.round((v.powerHp / v.weightKg) * 1000);
        meters.push({ label: "Power-to-weight", value: `${ptw} hp / tonne`, pct: clamp01((ptw - 250) / (600 - 250)) });
    }
    return meters;
}

// -- Photo gallery with thumbnails -------------------------------------------
function renderGallery(v, views) {
    if (!views.length) {
        return `
            <div class="vehicle-hero-plate">
                <span class="manufacturer">${v.manufacturer}</span>
                <h2 class="plate-model">${v.model}</h2>
            </div>`;
    }
    const alt = vehicleName(v);
    const first = views[0];
    return `
        <div class="vg" data-gallery>
            <div class="vg-stage is-loading">
                <img class="vg-main" src="${first.src}" alt="${alt} — ${first.label}" style="${first.style}" width="1600" height="1000" />
                <span class="vg-label" data-label>${first.label}</span>
                <button type="button" class="vg-nav vg-prev" aria-label="Previous photo">&larr;</button>
                <button type="button" class="vg-nav vg-next" aria-label="Next photo">&rarr;</button>
            </div>
            <div class="vg-thumbs" role="group" aria-label="Choose a photo">
                ${views
                    .map(
                        (view, i) => `
                    <button type="button" class="vg-thumb${i === 0 ? " is-active" : ""}" aria-pressed="${i === 0}" aria-label="${view.label}" data-index="${i}">
                        <img src="${view.src}" alt="" style="${view.style}" loading="lazy" />
                        <span>${view.label}</span>
                    </button>`
                    )
                    .join("")}
            </div>
            <p class="vg-note">
                ${
                    usesCrops(v)
                        ? "Detail views are enlarged crops of the main photo. Separate interior and rear photos have not been added yet."
                        : "Photos of this vehicle."
                }
                ${v.photoCheck ? `<br /><strong>Photo notice:</strong> ${v.photoCheck} It is shown as a representative image only.` : ""}
            </p>
        </div>`;
}

function initGalleryBehavior(root, v, views) {
    const gallery = root.querySelector("[data-gallery]");
    if (!gallery) return;
    const stage = gallery.querySelector(".vg-stage");
    const main = gallery.querySelector(".vg-main");
    const label = gallery.querySelector("[data-label]");
    const thumbs = [...gallery.querySelectorAll(".vg-thumb")];
    let index = 0;

    watchImage(main, stage);

    function show(i) {
        index = (i + views.length) % views.length;
        const view = views[index];
        main.classList.add("is-swapping");
        window.setTimeout(() => {
            main.src = view.src;
            main.style.cssText = view.style;
            main.alt = `${vehicleName(v)} — ${view.label}`;
            label.textContent = view.label;
            main.classList.remove("is-swapping");
        }, 160);
        thumbs.forEach((t, n) => {
            t.classList.toggle("is-active", n === index);
            t.setAttribute("aria-pressed", String(n === index));
        });
    }

    thumbs.forEach((t) => t.addEventListener("click", () => show(Number(t.dataset.index))));
    gallery.querySelector(".vg-prev").addEventListener("click", () => show(index - 1));
    gallery.querySelector(".vg-next").addEventListener("click", () => show(index + 1));
    gallery.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") show(index - 1);
        if (e.key === "ArrowRight") show(index + 1);
    });
}

// The booking card changes with availability, so the page never offers a
// test drive for a car that is sold, and says what the button really does.
function bookingCard(v) {
    if (v.status === "available") {
        return `
            <div class="booking-card">
                <div class="booking-card-title">Request a test drive</div>
                <p>Choose a preferred date and time on the next page. This is a request: our team confirms the slot with you by phone or email.</p>
                <a class="btn btn-primary btn-lg btn-block" href="${contactHref(v, "test-drive")}">Request a Test Drive</a>
                <a class="btn btn-outline btn-block" href="${contactHref(v, "general")}">Ask About This Car</a>
            </div>`;
    }
    if (v.status === "reserved") {
        return `
            <div class="booking-card">
                <div class="booking-card-title">Currently reserved</div>
                <p>This car is reserved for another buyer, so test drives are paused. Ask us and we will tell you if it becomes available again.</p>
                <a class="btn btn-primary btn-lg btn-block" href="${contactHref(v, "general")}">Ask About This Car</a>
            </div>`;
    }
    return `
        <div class="booking-card">
            <div class="booking-card-title">This vehicle has sold</div>
            <p>Want something similar? We can look for a matching ${v.manufacturer} or an alternative on your behalf.</p>
            <a class="btn btn-primary btn-lg btn-block" href="${contactHref(v, "sourcing")}">Ask Us to Find a Similar Car</a>
            <a class="btn btn-outline btn-block" href="inventory.html">Browse Available Vehicles</a>
        </div>`;
}

export function initVehicleDetailPage() {
    const root = document.querySelector("#vehicle-detail-root");
    if (!root) return; // Guard: only run on the vehicle detail page.

    const params = new URLSearchParams(window.location.search);
    const vehicle = getVehicleById(params.get("id"));

    if (!vehicle) {
        root.innerHTML = `
            <div class="vehicle-not-found">
                <h1>Vehicle not found</h1>
                <p class="section-intro">
                    We couldn't find that vehicle in our current inventory. It may have sold or the link may be out of date.
                </p>
                <div class="btn-row">
                    <a class="btn btn-primary" href="inventory.html">Browse Inventory</a>
                </div>
            </div>
        `;
        document.title = "Vehicle Not Found — Apex Motors";
        return;
    }

    const fullName = vehicleName(vehicle);
    document.title = `${fullName} — Apex Motors`;

    const views = getViews(vehicle);
    const meters = buildMeters(vehicle);

    const specRows = SPEC_ROWS.map(([label, fmt]) => [label, fmt(vehicle)])
        .filter(([, value]) => value)
        .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
        .join("");

    const keyStats = [
        ["Power", formatPower(vehicle).replace(/ \(.*\)/, "")],
        ["0–100 km/h", formatZeroToHundred(vehicle)],
        ["Top speed", formatTopSpeed(vehicle).replace(/ \(.*\)/, "")],
        ["Drivetrain", vehicle.drivetrain],
    ]
        .filter(([, value]) => value)
        .map(([label, value]) => `<div class="key-stat"><span class="key-stat-value">${value}</span><span class="key-stat-label">${label}</span></div>`)
        .join("");

    const meterMarkup = meters
        .map(
            (m) => `
            <div class="meter">
                <div class="meter-head"><span>${m.label}</span><strong>${m.value}</strong></div>
                <div class="meter-track"><span class="meter-fill" style="--pct:${Math.round(m.pct * 100)}%"></span></div>
            </div>`
        )
        .join("");

    // Prefer same-category vehicles that are still buyable.
    const rank = (x) => (x.category === vehicle.category ? 0 : 1) + (x.status === "sold" ? 2 : 0);
    const related = vehicles
        .filter((x) => x.id !== vehicle.id)
        .sort((a, b) => rank(a) - rank(b))
        .slice(0, 3);

    root.innerHTML = `
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="inventory.html">&larr; Back to Inventory</a><span aria-hidden="true">/</span><span>${vehicle.manufacturer}</span>
        </nav>

        <div class="vehicle-hero">
            <div class="vehicle-hero-media">${renderGallery(vehicle, views)}</div>

            <aside class="vehicle-hero-info">
                <div class="vehicle-meta-row">
                    <span class="tag tag-red">${vehicle.category}</span>
                    <span class="tag">${vehicle.year}</span>
                    <span class="status-badge status-${vehicle.status}">${STATUS[vehicle.status]}</span>
                </div>
                <div>
                    <span class="manufacturer-label">${vehicle.manufacturer}</span>
                    <h1 class="vehicle-title">${vehicle.model}</h1>
                </div>

                <div class="buy-panel">
                    <div class="buy-price${vehicle.price ? "" : " is-request"}">${formatPrice(vehicle)}</div>
                    <dl class="buy-facts">
                        <div><dt>Condition</dt><dd>${conditionLabel(vehicle)}</dd></div>
                        <div><dt>Mileage</dt><dd>${formatMileage(vehicle)}</dd></div>
                        <div><dt>Availability</dt><dd>${STATUS[vehicle.status]}</dd></div>
                    </dl>
                    <p class="demo-note">Demo listing: price, mileage and availability are placeholders, not real stock.</p>
                </div>

                <div class="key-stats">${keyStats}</div>
                <p class="vehicle-hero-desc">${vehicle.description}</p>

                ${bookingCard(vehicle)}
            </aside>
        </div>

        <div class="vehicle-detail-grid">
            <section class="detail-panel">
                <span class="eyebrow">Specifications</span>
                <h2 class="section-heading">Specifications</h2>
                <table class="spec-table"><caption class="sr-only">${fullName} specifications</caption>${specRows}</table>
                <p class="meter-note">Units are the same on every listing: hp, Nm, km/h, kg and seconds. Metric PS/CV figures are converted to hp (1 PS = 0.986 hp).</p>
            </section>
            ${
                meterMarkup
                    ? `<section class="detail-panel">
                <span class="eyebrow">Performance</span>
                <h2 class="section-heading">At a glance</h2>
                <div class="meters">${meterMarkup}</div>
                <p class="meter-note">Bars compare this car with the typical range of our collection. Power-to-weight uses the listed weight, which may be a dry, kerb or approximate figure.</p>
            </section>`
                    : ""
            }
        </div>

        <section class="related">
            <div class="section-head">
                <div>
                    <span class="eyebrow">More to explore</span>
                    <h2 class="section-heading">You may also like</h2>
                </div>
                <a href="inventory.html" class="btn btn-outline">View Full Inventory</a>
            </div>
            <div class="grid-3" id="related-grid"></div>
        </section>
    `;

    related.forEach((v) => root.querySelector("#related-grid").appendChild(createVehicleCard(v)));
    initGalleryBehavior(root, vehicle, views);
}
