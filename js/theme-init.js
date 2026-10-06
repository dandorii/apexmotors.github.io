// Classic (non-module) script loaded in <head> BEFORE the stylesheet paints,
// so the saved theme is applied immediately and the page never flashes the
// wrong colours. With no saved choice we set nothing and let the CSS
// prefers-color-scheme media query decide.
(function () {
    try {
        var saved = localStorage.getItem("apex-theme");
        if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
    } catch (e) {
        /* storage blocked (private mode): fall back to the system setting */
    }
})();
