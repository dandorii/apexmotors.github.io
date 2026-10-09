// Light / dark theme switch.
//
// The initial theme is applied by a tiny inline script in each page's <head>
// (before the CSS paints) so there is no flash of the wrong theme. This
// module wires up the toggle button and keeps the choice in localStorage.
// With no saved choice, the site follows the visitor's system setting and
// keeps following it if that changes.

const STORAGE_KEY = "apex-theme";
const META_COLORS = { dark: "#0a0a0b", light: "#f7f4ef" };

function savedTheme() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value === "light" || value === "dark" ? value : null;
    } catch {
        return null; // Storage can be blocked (private mode, file://).
    }
}

function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme, { animate = true } = {}) {
    const root = document.documentElement;

    if (animate) {
        root.classList.add("theme-transition");
        window.setTimeout(() => root.classList.remove("theme-transition"), 500);
    }

    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLORS[theme]);

    document.querySelectorAll(".theme-toggle").forEach((button) => {
        const next = theme === "light" ? "dark" : "light";
        button.setAttribute("aria-label", `Switch to ${next} mode`);
        button.setAttribute("aria-pressed", String(theme === "dark"));
        button.title = `Switch to ${next} mode`;
    });
}

export function initThemeToggle() {
    applyTheme(currentTheme(), { animate: false });

    document.querySelectorAll(".theme-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const next = currentTheme() === "light" ? "dark" : "light";
            applyTheme(next);
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                /* Choice just won't persist. */
            }
        });
    });

    // Follow the OS setting until the visitor makes an explicit choice.
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
        if (!savedTheme()) applyTheme(event.matches ? "light" : "dark");
    });
}
