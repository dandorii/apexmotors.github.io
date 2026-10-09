import { validateRequired, validateEmail, validatePhone } from "../utils/validation.js";

const INQUIRY_TYPES = ["general", "price", "test-drive", "sourcing", "trade-in", "consultation"];

// Showroom hours (Tuesday - Sunday, 10:00 AM - 7:00 PM) from the contact page.
const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 19 * 60;
const CLOSED_DAY = 1; // Monday

const isTestDrive = (form) => form.elements.inquiryType?.value === "test-drive";

function validateDate(value) {
    if (!value) return "Preferred date is required.";
    const date = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(date.getTime()) || date < today) return "Choose today or a future date.";
    if (date.getDay() === CLOSED_DAY) return "The showroom is closed on Mondays. Choose Tuesday to Sunday.";
    return "";
}

function validateTime(value) {
    if (!value) return "Preferred time is required.";
    const [h, m] = value.split(":").map(Number);
    const minutes = h * 60 + m;
    return minutes >= OPEN_MINUTES && minutes <= CLOSE_MINUTES
        ? ""
        : "Choose a time between 10:00 AM and 7:00 PM.";
}

// Which fields are checked depends on the inquiry type: date and time only
// matter for test drives, and the message is optional for price and test
// drive requests (the vehicle and details already say what is needed).
function getValidators(form) {
    const type = form.elements.inquiryType?.value;
    const validators = {
        inquiryType: (value) => validateRequired(value, "Inquiry type"),
        name: (value) => validateRequired(value, "Name"),
        email: (value) => validateEmail(value),
        phone: (value) => validatePhone(value),
    };
    if (type === "test-drive") {
        validators.preferredDate = validateDate;
        validators.preferredTime = validateTime;
    }
    if (type !== "price" && type !== "test-drive") {
        validators.message = (value) => validateRequired(value, "Message");
    }
    return validators;
}

const ALL_FIELDS = ["inquiryType", "name", "email", "phone", "preferredDate", "preferredTime", "message"];

function showFieldError(form, fieldName, message) {
    const field = form.elements[fieldName];
    const wrapper = field?.closest(".form-field");
    const errorEl = wrapper?.querySelector(".form-error");

    if (!field || !wrapper || !errorEl) return;

    wrapper.setAttribute("data-invalid", message ? "true" : "false");
    errorEl.textContent = message;
}

function validateForm(form) {
    let isValid = true;
    const validators = getValidators(form);
    ALL_FIELDS.forEach((fieldName) => {
        const validate = validators[fieldName];
        const message = validate ? validate(form.elements[fieldName]?.value) : "";
        if (message) isValid = false;
        showFieldError(form, fieldName, message);
    });
    return isValid;
}

// Shows the date/time fields only for test-drive requests and marks the
// message as required or optional to match.
function updateTypeFields(form) {
    const testDrive = isTestDrive(form);
    form.querySelectorAll("[data-test-drive]").forEach((el) => {
        el.hidden = !testDrive;
    });
    const type = form.elements.inquiryType.value;
    const messageOptional = type === "price" || type === "test-drive";
    const star = form.querySelector("#message-required");
    if (star) star.hidden = messageOptional;
    if (!testDrive) {
        ["preferredDate", "preferredTime"].forEach((name) => showFieldError(form, name, ""));
    }
}

function prefillFromUrl(form) {
    const params = new URLSearchParams(window.location.search);
    const vehicle = params.get("vehicle");
    if (vehicle && form.elements.vehicleInterest) {
        form.elements.vehicleInterest.value = vehicle;
    }
    const inquiry = params.get("inquiry");
    if (INQUIRY_TYPES.includes(inquiry)) {
        form.elements.inquiryType.value = inquiry;
    }
}

const SUCCESS_MESSAGES = {
    "test-drive":
        "Thank you. Your test drive request has been received. It is not a confirmed booking: a member of our team will contact you by phone or email to confirm the date and time.",
    price:
        "Thank you. Your price request has been received and a member of our team will contact you by phone or email.",
    default:
        "Thank you. Your inquiry has been received and a member of our team will contact you by phone or email.",
};

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const statusEl = document.querySelector("#form-status");
    if (!statusEl) return;

    if (!validateForm(form)) {
        statusEl.textContent = "Please fix the highlighted fields and try again.";
        statusEl.className = "form-status is-visible is-error";
        return;
    }

    const type = form.elements.inquiryType.value;
    statusEl.textContent = "Sending your request...";
    statusEl.className = "form-status is-visible";

    window.setTimeout(() => {
        statusEl.textContent = SUCCESS_MESSAGES[type] || SUCCESS_MESSAGES.default;
        statusEl.className = "form-status is-visible is-success";
        form.reset();
        updateTypeFields(form);
    }, 700);
}

export function initContactPage() {
    const form = document.querySelector("#contact-form");
    if (!form) return; // Guard: only run on the contact page.

    // Earliest selectable test drive date is today.
    const dateInput = form.elements.preferredDate;
    if (dateInput) {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        dateInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }

    prefillFromUrl(form);
    updateTypeFields(form);
    form.addEventListener("submit", handleSubmit);
    form.elements.inquiryType.addEventListener("change", () => {
        updateTypeFields(form);
        showFieldError(form, "inquiryType", "");
    });

    ALL_FIELDS.forEach((fieldName) => {
        form.elements[fieldName]?.addEventListener("input", () => {
            showFieldError(form, fieldName, "");
        });
    });
}
