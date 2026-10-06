// Drives the mobile nav toggle purely through aria-expanded + a class,
// and lets CSS own the actual show/hide animation. That keeps this
// function testable without a real stylesheet and keeps the open/closed
// state in one accessible place (aria-expanded) instead of two.
export function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    // Both elements ship in the shared header markup on every page, but
    // guarding here means a future template edit that drops one of them
    // fails silently instead of throwing on every page load.
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        links.classList.toggle("is-open", !isOpen);
    });

    // Escape closes the open menu and hands focus back to the button.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
            toggle.setAttribute("aria-expanded", "false");
            links.classList.remove("is-open");
            toggle.focus();
        }
    });

    // Close the mobile menu whenever a link is chosen, so navigating to a
    // new page (or an in-page anchor) doesn't leave the menu open.
    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            toggle.setAttribute("aria-expanded", "false");
            links.classList.remove("is-open");
        });
    });
}

// Every page ships the identical header markup, so no single page's HTML
// can hardcode which link is "active" — this compares the URL to each
// link's href at runtime instead, which also means it keeps working if
// pages are ever renamed or reordered in the nav.
export function highlightCurrentPage() {
    // A path ending in "/" (visiting the site root) has no filename to
    // compare, so treat that as index.html rather than matching nothing.
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a[href]").forEach((link) => {
        const linkPath = link.getAttribute("href").split("/").pop();
        if (linkPath === currentPath) {
            link.setAttribute("aria-current", "page");
        }
    });
}
