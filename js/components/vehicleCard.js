import { STATUS } from "../data/vehicles.js";
import { vehicleName, formatPower, formatZeroToHundred, formatPrice, conditionLine } from "../utils/format.js";
import { watchImage } from "../utils/imageLoad.js";

// One card builder for home, inventory and "you may also like", so the
// card can never drift between pages. v8 adds the buying info a shopper
// needs at a glance: price, condition/mileage and availability.
export function createVehicleCard(vehicle) {
    if (!vehicle) throw new Error("createVehicleCard requires a vehicle object.");

    const name = vehicleName(vehicle);
    const card = document.createElement("article");
    card.className = `vehicle-card is-${vehicle.status}`;

    const photoMarkup = vehicle.image
        ? `<img class="vehicle-plate-photo" src="${vehicle.image}" alt="${name}" width="1600" height="1000" loading="lazy" decoding="async" />
           <span class="vehicle-plate-overlay"></span>`
        : "";

    card.innerHTML = `
        <div class="vehicle-plate${vehicle.image ? " has-photo" : ""}">
            ${photoMarkup}
            <span class="vehicle-plate-category">${vehicle.category}</span>
            <span class="vehicle-plate-cta" aria-hidden="true">View details</span>
            <p class="vehicle-plate-name">
                <small>${vehicle.manufacturer}</small>
                ${vehicle.model}
            </p>
        </div>
        <div class="vehicle-card-body">
            <div class="vehicle-card-buy">
                <span class="vehicle-price${vehicle.price ? "" : " is-request"}">${formatPrice(vehicle)}</span>
                <span class="status-badge status-${vehicle.status}">${STATUS[vehicle.status]}</span>
            </div>
            <p class="vehicle-condition">${conditionLine(vehicle)}</p>
            <dl class="vehicle-card-specs">
                <dt>Power</dt>
                <dd>${formatPower(vehicle)}</dd>
                <dt>0&ndash;100 km/h</dt>
                <dd>${formatZeroToHundred(vehicle)}</dd>
                <dt>Drivetrain</dt>
                <dd>${vehicle.drivetrain}</dd>
                <dt>Year</dt>
                <dd>${vehicle.year}</dd>
            </dl>
            <a class="vehicle-card-link" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}" aria-label="View details: ${name}, ${STATUS[vehicle.status].toLowerCase()}">
                <span>View details</span><span class="arrow" aria-hidden="true">&rarr;</span>
            </a>
        </div>
    `;

    const img = card.querySelector(".vehicle-plate-photo");
    if (img) watchImage(img, card.querySelector(".vehicle-plate"));
    return card;
}
