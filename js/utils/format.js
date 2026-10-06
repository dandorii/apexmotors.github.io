// Display helpers shared by cards, the detail page, the gallery and the
// contact form. Keeping every unit/label rule here is what guarantees the
// same figure is written the same way on every page.

export const vehicleName = (v) => `${v.manufacturer} ${v.model}`;

const nf = new Intl.NumberFormat("en-US");

// Power is always hp. (v7 mixed hp / PS / CV, which made comparison hard.)
export function formatPower(v) {
    if (v.powerHp == null) return "";
    return `${nf.format(v.powerHp)} hp${v.powerNote ? ` (${v.powerNote})` : ""}`;
}

export const formatTorque = (v) =>
    v.torqueNm == null ? "" : `${nf.format(v.torqueNm)} Nm${v.torqueNote ? ` (${v.torqueNote})` : ""}`;

export const formatZeroToHundred = (v) => (v.zeroToHundred == null ? "" : `${v.zeroToHundred.toFixed(1)} s`);

export const formatTopSpeed = (v) =>
    v.topSpeedKmh == null ? "" : `${nf.format(v.topSpeedKmh)} km/h${v.topSpeedNote ? ` (${v.topSpeedNote})` : ""}`;

export const formatWeight = (v) =>
    v.weightKg == null ? "" : `${nf.format(v.weightKg)} kg${v.weightNote ? ` (${v.weightNote})` : ""}`;

// A missing price is shown as "Price on request" rather than hidden.
export const formatPrice = (v) => (v.price ? `₱${nf.format(v.price)}` : "Price on request");

export const conditionLabel = (v) => (v.condition === "new" ? "Brand new" : "Pre-owned");

// "Brand new" has no meaningful mileage, so say so instead of showing 0.
export const formatMileage = (v) => (v.mileageKm == null ? "Not applicable (new)" : `${nf.format(v.mileageKm)} km`);

// One short line for cards: "Pre-owned · 4,200 km" or "Brand new".
export const conditionLine = (v) =>
    v.condition === "new" || v.mileageKm == null ? conditionLabel(v) : `${conditionLabel(v)} · ${nf.format(v.mileageKm)} km`;

// Which contact-form inquiry type fits a vehicle's current availability.
export const inquiryTypeFor = (v) => (v.status === "available" ? "test-drive" : v.status === "sold" ? "sourcing" : "general");

export const contactHref = (v, type) =>
    `contact.html?vehicle=${encodeURIComponent(vehicleName(v))}&type=${type || inquiryTypeFor(v)}`;

// Gallery views. Real extra photos come from vehicle.views; until those
// exist we fall back to the main photo plus framed crops, and say so
// (see usesCrops) rather than implying they are separate photographs.
export function getViews(v) {
    if (!v.image) return [];
    if (Array.isArray(v.views) && v.views.length) {
        return [{ src: v.image, label: "Main", style: "" }, ...v.views.map((x) => ({ src: x.src, label: x.label, style: "" }))];
    }
    return [
        { src: v.image, label: "Full photo", style: "" },
        { src: v.image, label: "Detail crop: left", style: "object-position: 12% 68%; transform: scale(2.1); transform-origin: 12% 68%;" },
        { src: v.image, label: "Detail crop: centre", style: "object-position: 50% 55%; transform: scale(2.1); transform-origin: 50% 55%;" },
        { src: v.image, label: "Detail crop: right", style: "object-position: 88% 68%; transform: scale(2.1); transform-origin: 88% 68%;" },
    ];
}

export const usesCrops = (v) => !(Array.isArray(v.views) && v.views.length);
