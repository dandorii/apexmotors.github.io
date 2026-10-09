// Scroll-driven motion: reveal-on-scroll, header state, progress bar and a
// light parallax on the hero photo. Every effect checks the visitor's
// reduced-motion preference, and the reveal falls back to "everything
// visible" when IntersectionObserver is missing.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// selector -> how it reveals. `stagger` spaces siblings apart in ms.
// Selectors only need to exist on some pages; missing ones are ignored.
const REVEAL_TARGETS = [
    { selector: ".page-header > *", stagger: 90 },
    { selector: ".section-head", variant: "up" },
    { selector: ".filter-bar", variant: "up" },
    { selector: ".why-item", stagger: 100 },
    { selector: ".service-chip", stagger: 80 },
    { selector: ".service-row", stagger: 80 },
    { selector: ".about-lead", variant: "up" },
    { selector: ".about-note", variant: "up" },
    { selector: ".about-section", stagger: 120 },
    { selector: ".process-step", stagger: 120 },
    { selector: ".about-grid > div", stagger: 120 },
    { selector: ".about-stats > div", stagger: 120 },
    { selector: ".contact-info-block", stagger: 90 },
    { selector: "#contact-form", variant: "right" },
    { selector: ".map-card", variant: "zoom" },
    { selector: ".cta-band .container > *", stagger: 110 },
    { selector: ".vehicle-card", stagger: 110 },
    { selector: ".gallery-item", stagger: 70, variant: "zoom" },
    { selector: ".vehicle-hero-plate", variant: "left" },
    { selector: ".vehicle-views", variant: "up" },
    { selector: ".vehicle-hero-info > *", stagger: 100 },
    { selector: ".spec-table tr", stagger: 45 },
    { selector: ".empty-state", variant: "fade" },
];

let observer = null;

function reveal(element) {
    element.classList.add("is-revealed");
    // Once the entrance is over, let hover transitions run at full speed.
    window.setTimeout(() => element.classList.add("is-settled"), 1400);
}

function createObserver() {
    if (!("IntersectionObserver" in window)) return null;
    return new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                reveal(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
}

// Tags elements inside `root`, giving siblings in the same parent an
// increasing delay so they cascade in rather than appearing all at once.
function tagTargets(root) {
    REVEAL_TARGETS.forEach(({ selector, stagger = 0, variant }) => {
        const matches = [
            ...(root.matches?.(selector) ? [root] : []),
            ...root.querySelectorAll(selector),
        ].filter((el) => !el.hasAttribute("data-reveal"));

        const perParent = new Map();
        matches.forEach((el) => {
            const index = perParent.get(el.parentElement) ?? 0;
            perParent.set(el.parentElement, index + 1);

            el.setAttribute("data-reveal", variant && variant !== "up" ? variant : "");
            // Cap the cascade so a long list never makes anyone wait.
            el.style.setProperty("--reveal-delay", `${Math.min(index, 8) * stagger}ms`);

            if (observer) observer.observe(el);
            else reveal(el);
        });
    });
}

function initReveal() {
    observer = createObserver();
    const main = document.querySelector("main");
    if (!main) return;

    tagTargets(main);

    // Cards, gallery tiles and spec rows are rendered by JS (and re-rendered
    // when inventory filters change), so watch for new nodes and reveal them
    // too.
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) tagTargets(node);
            });
        });
    }).observe(main, { childList: true, subtree: true });
}

function initScrollEffects() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    header.appendChild(progress);

    const heroImage = document.querySelector(".hero-visual img");
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        header.classList.toggle("is-scrolled", y > 8);
        progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

        // Slow the hero photo against the scroll for a sense of depth.
        if (heroImage && !reduceMotion.matches && y < window.innerHeight) {
            heroImage.style.translate = `0 ${Math.round(y * 0.06)}px`;
        }
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        },
        { passive: true }
    );
    update();
}

export function initAnimations() {
    initReveal();
    initScrollEffects();
}
