import { vehicles, getUniqueValues } from "../data/vehicles.js";
import { createVehicleCard } from "../components/vehicleCard.js";

// Queried once at module load rather than inside each function, since
// these elements only exist on inventory.html — main.js imports this
// module unconditionally on every page, so every function here must
// tolerate the possibility that all of these are null.
const grid = document.querySelector("#inventory-grid");
const categorySelect = document.querySelector("#filter-category");
const manufacturerSelect = document.querySelector("#filter-manufacturer");
const resetButton = document.querySelector("#filter-reset");
const countLabel = document.querySelector("#filter-count");

// Populates the two <select> filters from the data itself, rather than
// hardcoding option lists, so a vehicle added to vehicles.js with a new
// category or manufacturer automatically becomes filterable — no HTML
// edit required.
function populateFilterOptions() {
    getUniqueValues("category").forEach((category) => {
        categorySelect.append(new Option(category, category));
    });
    getUniqueValues("manufacturer").forEach((manufacturer) => {
        manufacturerSelect.append(new Option(manufacturer, manufacturer));
    });
}

// Re-renders the grid to match the current filter selections. Rebuilding
// from scratch (rather than diffing) is simpler and plenty fast for a
// collection this size.
function renderInventory() {
    const category = categorySelect.value;
    const manufacturer = manufacturerSelect.value;

    const filtered = vehicles.filter((vehicle) => {
        const matchesCategory = category === "all" || vehicle.category === category;
        const matchesManufacturer = manufacturer === "all" || vehicle.manufacturer === manufacturer;
        return matchesCategory && matchesManufacturer;
    });

    grid.innerHTML = "";

    if (filtered.length === 0) {
        // An empty grid with no explanation reads as broken; naming the
        // cause and offering a next step (clear filters, or contact us)
        // keeps a zero-result search from feeling like a dead end.
        grid.innerHTML = `<p class="empty-state">No vehicles match those filters. Try clearing them or contact us — we can source a vehicle to your specification.</p>`;
    } else {
        filtered.forEach((vehicle) => grid.appendChild(createVehicleCard(vehicle)));
    }

    if (countLabel) {
        countLabel.textContent = `${filtered.length} of ${vehicles.length} vehicles`;
    }
}

function resetFilters() {
    categorySelect.value = "all";
    manufacturerSelect.value = "all";
    renderInventory();
}

export function initInventoryPage() {
    // If the grid is missing we're not on the inventory page at all; if a
    // filter control is missing the page markup is broken. Either way,
    // there's nothing safe to wire up, so bail out before touching anything.
    if (!grid || !categorySelect || !manufacturerSelect || !resetButton) return;

    populateFilterOptions();
    renderInventory();

    categorySelect.addEventListener("change", renderInventory);
    manufacturerSelect.addEventListener("change", renderInventory);
    resetButton.addEventListener("click", resetFilters);
}
