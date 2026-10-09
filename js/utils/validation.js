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
