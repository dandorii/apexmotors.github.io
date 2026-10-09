import { initNavigation, highlightCurrentPage } from "./components/navigation.js";
import { createVehicleCard } from "./components/vehicleCard.js";
import { vehicles } from "./data/vehicles.js";
import { initInventoryPage } from "./pages/inventory.js";
import { initVehicleDetailPage } from "./pages/vehicleDetail.js";
import { initContactPage } from "./pages/contact.js";
import { renderGallery, initLightbox } from "./components/gallery.js";
import { initThemeToggle } from "./components/theme.js";
import { initAnimations } from "./components/animations.js";

// The home page highlights a short selection rather than the whole
// collection, so it reads as a preview instead of a duplicate of
// the inventory page. Update this list (not vehicles.js) to change which
// vehicles are featured — see README.md "How to add a vehicle".
const FEATURED_VEHICLE_IDS = ["ferrari-296-gtb", "porsche-911-gt3-rs", "lamborghini-revuelto"];

function renderFeaturedVehicles() {
    const featuredGrid = document.querySelector("#featured-grid");
    if (!featuredGrid) return; // Only present on the home page.

    FEATURED_VEHICLE_IDS
        .map((id) => vehicles.find((vehicle) => vehicle.id === id))
        // .filter(Boolean) drops any id here that no longer matches a
        // vehicle (e.g. it was removed from vehicles.js), so a stale
        // featured id fails quietly instead of rendering a broken card.
        .filter(Boolean)
        .forEach((vehicle) => featuredGrid.appendChild(createVehicleCard(vehicle)));
}

function initGalleryPage() {
    const grid = document.querySelector("#gallery-grid");
    if (!grid) return; // Only present on the gallery page.
    renderGallery(grid);
    initLightbox();
}

// Every page loads this single entry point (see each page's closing
// <script type="module">), and every init function below is self-guarding
// — it checks for the DOM element it needs and returns early if absent —
// so it's safe to call all of them unconditionally here rather than
// maintaining a per-page list of "which script goes with which HTML file".
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initNavigation();
    highlightCurrentPage();
    renderFeaturedVehicles();
    initInventoryPage();
    initVehicleDetailPage();
    initGalleryPage();
    initContactPage();
    // Last, so cards and tiles rendered above are picked up by the reveal.
    initAnimations();
});
