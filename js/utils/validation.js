// Small, dependency-free validation helpers.
//
// Each function returns an error message string when the value is invalid,
// or an empty string when it's fine — that keeps call sites simple, since
// `if (message)` alone tells you whether a field failed, and the same
// string can be dropped straight into the UI without a separate lookup.
//
// `value` is normalized to a string first. Form fields always hand us a
// string in practice, but treating validators as a public, reusable module
// (rather than assuming they're only ever fed a real <input>.value) means
// they shouldn't throw if something else — a test, a future data import —
// passes null/undefined.

function toSafeString(value) {
    return value == null ? "" : String(value);
}

export function validateRequired(value, label) {
    return toSafeString(value).trim() === "" ? `${label} is required.` : "";
}

export function validateEmail(value) {
    const trimmed = toSafeString(value).trim();
    if (trimmed === "") return "Email is required.";

    // A pragmatic (not exhaustive) shape check — enough to catch obvious
    // typos like a missing "@" without rejecting real addresses that a
    // fully strict pattern would choke on (plus-tags, uncommon TLDs, etc.).
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(trimmed) ? "" : "Enter a valid email address.";
}

export function validatePhone(value) {
    const trimmed = toSafeString(value).trim();
    if (trimmed === "") return "Phone number is required.";

    // Count digits only, so formatting the person happens to type —
    // spaces, dashes, parentheses, a leading "+" — never causes a
    // rejection; only a phone number that's actually too short does.
    const digitCount = trimmed.replace(/\D/g, "").length;
    return digitCount >= 7 ? "" : "Enter a valid phone number.";
}

// -- v8: scheduling validators for test-drive requests ----------------------
// The showroom hours on the contact page are Tuesday-Sunday, so a request
// for a Monday or a past date is caught here instead of being "accepted".

export function validatePreferredDate(value, now = new Date()) {
    const v = toSafeString(value).trim();
    if (v === "") return "Choose a preferred date.";
    // Parse yyyy-mm-dd as a LOCAL date (new Date("2026-10-06") would be UTC).
    const [y, m, d] = v.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (Number.isNaN(date.getTime())) return "Enter a valid date.";
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date < today) return "Choose today or a future date.";
    if (date.getDay() === 1) return "The showroom is closed on Mondays. Please choose Tuesday to Sunday.";
    return "";
}

export function validateChoice(value, message) {
    return toSafeString(value).trim() === "" ? message : "";
}
