import {
    validateRequired,
    validateEmail,
    validatePhone,
    validatePreferredDate,
    validateChoice,
} from "../utils/validation.js";

const TYPE_LABELS = {
    general: "General inquiry",
    "test-drive": "Test drive request",
    "trade-in": "Trade-in consultation",
    sourcing: "Vehicle sourcing",
};

// Validators depend on the inquiry type: date/time only matter for a test
// drive, and the trade-in vehicle only for a trade-in. Fields that are not
// shown are disabled, so they are neither validated nor "submitted".
function getValidators(type) {
    const v = {
        name: (x) => validateRequired(x, "Name"),
        email: (x) => validateEmail(x),
        phone: (x) => validatePhone(x),
    };
    if (type === "test-drive") {
        v.vehicleInterest = (x) => validateRequired(x, "Vehicle of interest");
        v.preferredDate = (x) => validatePreferredDate(x);
        v.preferredTime = (x) => validateChoice(x, "Choose a preferred time.");
        // message stays optional for a test drive
    } else {
        v.message = (x) => validateRequired(x, "Message");
        if (type === "trade-in") v.tradeInVehicle = (x) => validateRequired(x, "Your current vehicle");
    }
    return v;
}

const fieldWrapper = (form, name) => form.elements[name]?.closest(".form-field");

// Writes or clears one field's error and keeps ARIA in sync, so the error
// is announced to assistive tech and the field is marked invalid.
function showFieldError(form, name, message) {
    const field = form.elements[name];
    const wrapper = fieldWrapper(form, name);
    const errorEl = wrapper?.querySelector(".form-error");
    if (!field || !wrapper || !errorEl) return;
    wrapper.setAttribute("data-invalid", message ? "true" : "false");
    errorEl.textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
}

function labelFor(form, name) {
    const label = fieldWrapper(form, name)?.querySelector("label");
    return label ? label.firstChild.textContent.trim() : name;
}

// Validates every field, marks each, and shows a summary with links that
// jump to the first problem (important on long/mobile forms).
function validateForm(form, type) {
    const validators = getValidators(type);
    const errors = [];
    Object.keys(form.elements).forEach((k) => {
        if (isNaN(k) && form.elements[k]?.closest?.(".form-field")) showFieldError(form, k, "");
    });
    Object.entries(validators).forEach(([name, validate]) => {
        const message = validate(form.elements[name]?.value);
        showFieldError(form, name, message);
        if (message) errors.push({ name, message });
    });

    const summary = document.querySelector("#form-summary");
    if (summary) {
        if (errors.length) {
            summary.innerHTML = `<strong>Please fix ${errors.length === 1 ? "this field" : `these ${errors.length} fields`} and send again:</strong><ul>${errors
                .map((e) => `<li><a href="#${e.name}" data-focus="${e.name}">${labelFor(form, e.name)}: ${e.message}</a></li>`)
                .join("")}</ul>`;
            summary.hidden = false;
        } else {
            summary.hidden = true;
            summary.innerHTML = "";
        }
    }
    return errors;
}

function prefill(form) {
    const params = new URLSearchParams(window.location.search);
    const vehicle = params.get("vehicle");
    if (vehicle && form.elements.vehicleInterest) form.elements.vehicleInterest.value = vehicle;
    const type = params.get("type");
    if (type && TYPE_LABELS[type]) form.elements.inquiryType.value = type;
}

// Shows the groups that belong to the chosen type and updates button copy.
function applyType(form) {
    const type = form.elements.inquiryType.value;
    form.querySelectorAll("[data-for]").forEach((group) => {
        const show = group.dataset.for.split(" ").includes(type);
        group.hidden = !show;
        group.querySelectorAll("input, select, textarea").forEach((el) => (el.disabled = !show));
    });

    const submitLabel = form.querySelector("[data-submit-label]");
    submitLabel.textContent = type === "test-drive" ? "Request a Test Drive" : "Send Inquiry";

    const msg = form.elements.message;
    const msgLabel = fieldWrapper(form, "message")?.querySelector("label");
    const required = type !== "test-drive";
    if (msgLabel) {
        msgLabel.innerHTML = required ? 'Message <span class="required" aria-hidden="true">*</span>' : "Message (optional)";
    }
    msg.required = required;
    msg.placeholder =
        type === "sourcing"
            ? "Tell us the make, model, year and budget you have in mind."
            : type === "trade-in"
              ? "Anything we should know about the condition or history of your car?"
              : type === "test-drive"
                ? "Anything we should know before your visit?"
                : "How can we help?";

    document.querySelector("#type-hint").textContent =
        type === "test-drive"
            ? "A test drive is a request, not a confirmed booking. Our team will confirm a time with you by phone or email."
            : "";

    // Date picker can't offer past days.
    const date = form.elements.preferredDate;
    if (date) {
        const t = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        date.min = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
    }
}

function showConfirmation(form, data) {
    const panel = document.querySelector("#form-confirmation");
    const type = data.inquiryType;
    const rows = [
        ["Request type", TYPE_LABELS[type]],
        ["Name", data.name],
        ["Vehicle", data.vehicleInterest],
        type === "test-drive" ? ["Preferred date", formatDate(data.preferredDate)] : null,
        type === "test-drive" ? ["Preferred time", data.preferredTime] : null,
        type === "trade-in" ? ["Your vehicle", data.tradeInVehicle] : null,
    ].filter((r) => r && r[1]);

    panel.querySelector("[data-confirm-title]").textContent = type === "test-drive" ? "Test drive request recorded (demo)" : "Inquiry recorded (demo)";
    panel.querySelector("[data-confirm-rows]").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd></dd></div>`).join("");
    panel.querySelectorAll("[data-confirm-rows] dd").forEach((dd, i) => (dd.textContent = rows[i][1]));
    panel.querySelector("[data-confirm-next]").textContent =
        type === "test-drive"
            ? "In a live version, our team would now contact you to confirm the time. Nothing is booked until they do."
            : "In a live version, a consultant would reply to the email and phone number you gave.";
    form.hidden = true;
    panel.hidden = false;
    panel.focus();
}

function formatDate(value) {
    if (!value) return "";
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function initContactPage() {
    const form = document.querySelector("#contact-form");
    if (!form) return; // Guard: only run on the contact page.

    const confirmation = document.querySelector("#form-confirmation");
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = document.querySelector("#form-status");

    prefill(form);
    applyType(form);
    form.elements.inquiryType.addEventListener("change", () => {
        applyType(form);
        document.querySelector("#form-summary").hidden = true;
    });

    // Clear a field's error as soon as the person edits it.
    form.addEventListener("input", (event) => {
        const name = event.target.name;
        if (name && fieldWrapper(form, name)?.getAttribute("data-invalid") === "true") showFieldError(form, name, "");
    });

    // Summary links focus the field (an in-page # jump would not focus inputs reliably).
    document.querySelector("#form-summary").addEventListener("click", (event) => {
        const link = event.target.closest("[data-focus]");
        if (!link) return;
        event.preventDefault();
        form.elements[link.dataset.focus]?.focus();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (submitBtn.disabled) return; // ignore double submits while "sending"
        const type = form.elements.inquiryType.value;
        const errors = validateForm(form, type);
        if (errors.length) {
            statusEl.textContent = "";
            document.querySelector("#form-summary").focus();
            return;
        }

        // Loading state. There is no backend: this is simulated, and the
        // confirmation says so plainly.
        const data = Object.fromEntries(new FormData(form).entries());
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.classList.add("is-loading");
        statusEl.textContent = "Sending your request…";

        window.setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.removeAttribute("aria-busy");
            submitBtn.classList.remove("is-loading");
            statusEl.textContent = "";
            showConfirmation(form, data);
        }, 1100);
    });

    confirmation.querySelector("[data-again]").addEventListener("click", () => {
        form.reset();
        form.querySelectorAll("[data-invalid]").forEach((w) => w.setAttribute("data-invalid", "false"));
        applyType(form);
        confirmation.hidden = true;
        form.hidden = false;
        form.elements.inquiryType.focus();
    });
}
