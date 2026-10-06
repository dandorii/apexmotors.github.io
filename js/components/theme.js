const KEY = "apex-theme";

function currentTheme() {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function syncButton(button) {
    const theme = currentTheme();
    const next = theme === "light" ? "dark" : "light";
    button.setAttribute("aria-label", `Switch to ${next} mode`);
    button.setAttribute("title", `Switch to ${next} mode`);
    button.setAttribute("aria-pressed", String(theme === "light"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#ffffff" : "#0a0a0b");
}

export function initTheme() {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    syncButton(button);

    button.addEventListener("click", () => {
        const next = currentTheme() === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem(KEY, next);
        } catch (e) {
            /* choice just won't persist */
        }
        syncButton(button);
    });

    // Follow OS changes only while the user has not made an explicit choice.
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
        if (!document.documentElement.hasAttribute("data-theme")) syncButton(button);
    });
}
