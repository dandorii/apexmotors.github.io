import { inquiryUrl, isSold, statusBadge } from "../utils/inquiry.js";
// Builds a single vehicle card element from a vehicle data object.
// Both the home page (featured vehicles) and the inventory page render
// vehicles this way, so the card markup is defined once here instead of
// drifting out of sync between two places that build it independently.
export function createVehicleCard(vehicle) {
    if (!vehicle) {
        throw new Error("createVehicleCard requires a vehicle object.");
    }

    const card = document.createElement("article");
    card.className = "vehicle-card";

    // If the vehicle has a photo, show it (with a gradient behind the name
    // for legibility). Otherwise fall back to the typographic spec plate.
    const photoMarkup = vehicle.image
        ? `<img class="vehicle-plate-photo" src="${vehicle.image}" alt="${vehicle.manufacturer} ${vehicle.model}" loading="lazy" />
       <span class="vehicle-plate-overlay"></span>`
        : "";

    card.innerHTML = `
        <div class="vehicle-plate${vehicle.image ? " has-photo" : ""}">
            ${photoMarkup}
            <span class="vehicle-plate-category">${vehicle.category}</span>
            ${statusBadge(vehicle)}
            <p class="vehicle-plate-name">
                <small>${vehicle.manufacturer}</small>
                ${vehicle.model}
            </p>
        </div>
        <div class="vehicle-card-body">
            <dl class="vehicle-card-specs">
                <dt>Power</dt>
                <dd>${vehicle.power}</dd>
                <dt>0&ndash;100 km/h</dt>
                <dd>${vehicle.zeroToHundred}</dd>
                <dt>Drivetrain</dt>
                <dd>${vehicle.drivetrain}</dd>
                <dt>Year</dt>
                <dd>${vehicle.year}</dd>
                <dt>Condition</dt>
                <dd>${vehicle.condition}</dd>
                <dt>Mileage</dt>
                <dd>${vehicle.mileage}</dd>
            </dl>
            <div class="vehicle-card-actions">
                <a class="vehicle-card-link vehicle-card-main-link" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}">View vehicle <span class="arrow">&rarr;</span></a>
                ${isSold(vehicle) ? "" : `<a class="vehicle-card-link" href="${inquiryUrl(vehicle, "price")}">Request price</a>`}
            </div>
        </div>
    `;

    return card;
}
