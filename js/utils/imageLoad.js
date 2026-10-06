// Fade an <img> in once it has actually loaded, so tiles show a skeleton
// (CSS shimmer on the wrapper) instead of an empty gradient. Handles
// images that are already cached/complete and images that fail.
export function watchImage(img, wrapper = img.parentElement) {
    const done = () => {
        img.classList.add("is-loaded");
        wrapper?.classList.remove("is-loading");
    };
    const failed = () => {
        wrapper?.classList.remove("is-loading");
        wrapper?.classList.add("has-error");
    };
    wrapper?.classList.add("is-loading");
    if (img.complete && img.naturalWidth > 0) done();
    else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", failed, { once: true });
    }
}
