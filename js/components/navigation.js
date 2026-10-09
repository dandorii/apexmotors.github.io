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

    // Single place that changes open/closed state: aria-expanded stays the
    // source of truth, the class drives CSS, and a body class locks page
    // scroll behind the open menu.
    const setOpen = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        links.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);
    };

    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    // Close the mobile menu whenever a link is chosen, so navigating to a
    // new page (or an in-page anchor) doesn't leave the menu open.
    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setOpen(false));
    });

    // Escape closes the menu and returns focus to the toggle.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Tapping outside the header closes the menu.
    document.addEventListener("click", (event) => {
        if (isOpen() && !event.target.closest(".site-header")) setOpen(false);
    });

    // Growing the viewport past the mobile breakpoint resets the state so
    // the scroll lock never lingers on desktop.
    window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
        if (event.matches) setOpen(false);
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
