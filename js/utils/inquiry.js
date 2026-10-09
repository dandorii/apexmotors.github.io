// Shared helpers for linking a vehicle to the contact form and for the
// availability badge, so cards and the detail page stay consistent.

// type: "test-drive" | "price" | "sourcing" | "general" ...
export function inquiryUrl(vehicle, type) {
    const name = encodeURIComponent(`${vehicle.manufacturer} ${vehicle.model}`);
    return `contact.html?inquiry=${type}&vehicle=${name}`;
}

export function isSold(vehicle) {
    return vehicle.availability === "Sold";
}

export function statusBadge(vehicle) {
    if (!vehicle.availability) return "";
    const key = vehicle.availability.toLowerCase();
    return `<span class="status-badge status-${key}">${vehicle.availability}</span>`;
}
