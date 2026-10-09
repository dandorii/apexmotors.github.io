import { inquiryUrl, isSold, statusBadge } from "../utils/inquiry.js";
import { getVehicleById, getVehicleViews } from "../data/vehicles.js";
import { viewerMarkup, initViewer } from "../components/viewer.js";

// Spec rows to render, in display order. Each entry is [label, dataKey].
// Defined as data rather than hand-written HTML so adding or reordering a
// spec is a one-line change here instead of an edit inside a template
// string. A row is skipped entirely when the vehicle lacks that field —
// so an
// unknown figure should never appear as blank or "N/A".
const SPEC_ROWS = [
    ["Condition", "condition"],
    ["Mileage", "mileage"],
    ["Availability", "availability"],
    ["Year / Generation", "year"],
    ["Engine", "engine"],
    ["Power", "power"],
    ["Torque", "torque"],
    ["Transmission", "transmission"],
    ["Drivetrain", "drivetrain"],
    ["0–100 km/h", "zeroToHundred"],
    ["Top Speed", "topSpeed"],
    ["Weight", "weight"],
];

export function initVehicleDetailPage() {
    const root = document.querySelector("#vehicle-detail-root");
    if (!root) return; // Guard: only run on the vehicle detail page.

    // The site has one vehicle.html rather than one file per vehicle;
    // reading the id from the URL is what lets that single page display
    // any vehicle in the dataset (e.g. vehicle.html?id=porsche-911-gt3-rs).
    const params = new URLSearchParams(window.location.search);
    const vehicle = getVehicleById(params.get("id"));

    // A missing or stale id (sold vehicle, old bookmark, typo) is expected
    // over time, not a bug — show a real page with a way forward instead
    // of a blank root or a thrown error.
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

    document.title = `${vehicle.manufacturer} ${vehicle.model} — Apex Motors`;

    const specRows = SPEC_ROWS.filter(([, key]) => vehicle[key])
        .map(([label, key]) => `<tr><td>${label}</td><td>${vehicle[key]}</td></tr>`)
        .join("");

    const photoMarkup = vehicle.image
        ? `<img class="vehicle-plate-photo" src="${vehicle.image}" alt="${vehicle.manufacturer} ${vehicle.model}" />
       <span class="vehicle-plate-overlay"></span>`
        : "";

    const views = getVehicleViews(vehicle);

    root.innerHTML = `
        <div class="vehicle-hero">
            <div class="vehicle-hero-plate${vehicle.image ? " has-photo" : ""}">
                ${photoMarkup}
                <span class="manufacturer">${vehicle.manufacturer}</span>
                <h1>${vehicle.model}</h1>
            </div>
            <div class="vehicle-hero-info">
                <div class="tag-list"><span class="tag">${vehicle.category}</span>${statusBadge(vehicle)}</div>
                <p class="vehicle-hero-desc">${vehicle.description}</p>
                <div class="btn-row">
                    ${isSold(vehicle)
                        ? `<a class="btn btn-primary" href="${inquiryUrl(vehicle, "sourcing")}">Ask About Similar Vehicles</a>`
                        : `<a class="btn btn-primary" href="${inquiryUrl(vehicle, "test-drive")}">Request a Test Drive</a>
                    <a class="btn btn-outline" href="${inquiryUrl(vehicle, "price")}">Request Price</a>`}
                    <a class="btn btn-outline" href="inventory.html">Back to Inventory</a>
                </div>
            </div>
        </div>
        ${views.length > 1 ? `<hr class="divider" />${viewerMarkup(views, `${vehicle.manufacturer} ${vehicle.model}`)}` : ""}
        <hr class="divider" />
        <div>
            <h2 class="section-heading">Specifications</h2>
            <table class="spec-table">${specRows}</table>
        </div>
    `;

    if (views.length > 1) {
        initViewer(root, views, `${vehicle.manufacturer} ${vehicle.model}`);
    }
}
