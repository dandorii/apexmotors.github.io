# Apex Motors — Dealership Website

A multi-page static website for **Apex Motors**, a fictional
automotive dealership in San Fernando, Pampanga, Philippines. Built with
plain HTML5, CSS3, and vanilla JavaScript (ES modules) — no frameworks,
no bundler, no build step.

> Apex Motors is not a real dealership. All copy, contact details, and
> staff names are placeholders for demonstration purposes, and the site
> is not affiliated with or endorsed by any vehicle manufacturer.

---

## Contents

- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [How the site is put together](#how-the-site-is-put-together)
- [Pages](#pages)
- [The vehicle dataset](#the-vehicle-dataset)
- [Common tasks](#common-tasks)
  - [Add a vehicle](#add-a-vehicle)
  - [Feature a vehicle on the home page](#feature-a-vehicle-on-the-home-page)
  - [Replace or add a vehicle photo](#replace-or-add-a-vehicle-photo)
  - [Re-theme the site](#re-theme-the-site)
- [Accessibility notes](#accessibility-notes)
- [Browser support notes](#browser-support-notes)
- [Known limitations](#known-limitations)

---

## Quick start

This is a static site with no build step or server-side requirement.

1. Unzip the project.
2. Open `index.html` directly in a browser, **or** serve the folder with
   any static file server for the most reliable experience:

   ```bash
   cd apex_motors_v5
   python3 -m http.server 8000
   ```

   Then visit `http://localhost:8000`.

A local server is the more reliable option: some browsers restrict
`type="module"` scripts on the `file://` protocol, which can leave the
inventory grid, home page, gallery, or vehicle detail page looking empty
when the HTML is opened directly instead of served.

---

## Project structure

```
apex_motors_v5/
├── index.html              Home page
├── inventory.html          Filterable vehicle inventory
├── vehicle.html            Single vehicle detail page (reads ?id=... from the URL)
├── about.html               Dealership story
├── services.html            Dealership services
├── gallery.html              Photo gallery with a lightbox
├── contact.html             Contact form + test-drive request
│
├── css/
│   ├── main.css              Design tokens, reset, typography, nav, footer
│   ├── components.css        Buttons, vehicle cards, forms, gallery, lightbox
│   └── pages.css              Page-specific layout (hero, about, services, etc.)
│
├── js/
│   ├── main.js                        Entry point loaded by every page
│   ├── data/
│   │   └── vehicles.js                 Centralized vehicle dataset + lookups
│   ├── components/
│   │   ├── navigation.js               Mobile nav toggle + active-link highlight
│   │   ├── vehicleCard.js              Vehicle card builder (home + inventory)
│   │   └── gallery.js                  Gallery grid + shared lightbox dialog
│   ├── pages/
│   │   ├── inventory.js                Inventory filtering logic
│   │   ├── vehicleDetail.js            Vehicle detail rendering
│   │   └── contact.js                  Form validation + simulated submit
│   └── utils/
│       └── validation.js               Reusable, dependency-free field validators
│
└── assets/
    ├── images/                One photo per vehicle (see below)
    └── icons/                 Favicons (.ico + PNG), Apple touch icon, and 192px app icon
```

---

## How the site is put together

**No build step, by design.** Every HTML file loads its CSS and a single
JS entry point (`js/main.js`) directly — there's nothing to compile,
bundle, or transpile. Opening `index.html` (or serving the folder) is the
entire setup process.

**One entry point, many pages.** `js/main.js` is the only script tag on
every page. On `DOMContentLoaded`, it calls every page module's `init*`
function unconditionally — `initInventoryPage()`, `initContactPage()`,
and so on. Each of those functions queries the DOM element it actually
needs (e.g. `#inventory-grid`) and returns immediately if that element
isn't present. That's what lets a single shared script safely run on
every page without a per-page script list: on the contact page, only
`initContactPage()` finds what it's looking for, so only the contact
form gets wired up.

**One dataset, several views.** All vehicle information lives in
`js/data/vehicles.js`. The home page, inventory grid, vehicle detail
page, and gallery all read from this one array — there's no duplicated
vehicle data anywhere else in the codebase. Updating a spec means
editing one object in one file.

**Missing fields are skipped.** A field that isn't set is left out of that
vehicle's object entirely rather than filled with a placeholder, and
`vehicleDetail.js` renders `SPEC_ROWS` accordingly: a missing field simply
produces no row, so the detail page never shows a blank value or "N/A".

**Photo or spec plate, automatically.** Every vehicle card, the vehicle
detail hero, and every gallery tile check for an `image` field on the
vehicle. If it's present, the photo is shown (with a gradient overlay
behind the name for legibility). If it's absent, the same element falls
back to a typographic "spec plate" — the manufacturer and model set in
large type over a dark panel. Both styles can appear side by side in the
same grid; nothing needs to be configured to enable this per vehicle
beyond adding or omitting the `image` field.

---

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero, a hero photo, a featured set of vehicles, "why us," a services preview, and a closing call to action. |
| Inventory | `inventory.html` | The full vehicle collection with category and manufacturer filters, built dynamically from the dataset. |
| Vehicle detail | `vehicle.html?id=<vehicle-id>` | One page that renders any vehicle, chosen via a `?id=` query parameter (e.g. `vehicle.html?id=porsche-911-gt3-rs`). Shows a "not found" state with a link back to inventory for an unknown or stale id. |
| Gallery | `gallery.html` | A photo grid of the whole collection; selecting a tile opens a shared lightbox dialog with the vehicle's name, category, and description. |
| About | `about.html` | Dealership story and philosophy. |
| Services | `services.html` | What the dealership offers (sales, test drives, sourcing, trade-in and vehicle consultation). |
| Contact | `contact.html` | A validated contact / test-drive request form. Arriving from a vehicle's "Request a Test Drive" link pre-fills the "vehicle of interest" field via a `?vehicle=` query parameter. |

---

## The vehicle dataset

`js/data/vehicles.js` exports:

- **`vehicles`** — an array of vehicle objects. Each has, at minimum,
  `id`, `manufacturer`, `model`, `category`, and `description`.
  Everything else (`year`, `image`, `engine`, `power`, `torque`,
  `transmission`, `drivetrain`, `zeroToHundred`, `topSpeed`, `weight`, `condition`, `mileage`, `availability`)
  is optional and optional.
- **`getVehicleById(id)`** — returns the matching vehicle object, or
  `undefined` if no vehicle has that id. `vehicleDetail.js` uses the
  `undefined` case to show its "vehicle not found" state rather than
  throwing.
- **`getUniqueValues(key)`** — returns the sorted, deduplicated set of
  values for a field across all vehicles (e.g.
  `getUniqueValues("category")`). `inventory.js` uses this to build the
  category and manufacturer filter dropdowns directly from the data, so
  a new category or manufacturer added to a vehicle automatically
  becomes filterable with no HTML changes.

The collection currently includes 12 vehicles spanning Track Weapon,
Supercar, Muscle, and Grand Tourer categories, each with a photo in
`assets/images/`.

---

## Common tasks

### Add a vehicle

1. Open `js/data/vehicles.js`.
2. Add a new object to the `vehicles` array, following the shape of the
   existing entries.
   - **Required:** `id` (unique, URL-safe — used in `vehicle.html?id=...`
     links), `manufacturer`, `model`, `category`, `description`.
   - **Optional:** `year`, `image`, `engine`, `power`, `torque`,
     `transmission`, `drivetrain`, `zeroToHundred`, `topSpeed`, `weight`.
     Only include specs you can actually verify — leave the rest out
     rather than guessing.
3. Save. The vehicle now appears automatically in:
   - the inventory grid, and its category/manufacturer become filter
     options if they're new,
   - its own detail page at `vehicle.html?id=<its-id>`,
   - the gallery.
4. To also show it on the home page, see the next section.

### Feature a vehicle on the home page

The home page shows a short, featured subset rather than the full
collection. Open `js/main.js` and add the vehicle's `id` to the
`FEATURED_VEHICLE_IDS` array near the top of the file:

```js
const FEATURED_VEHICLE_IDS = ["ferrari-296-gtb", "porsche-911-gt3-rs", "lamborghini-revuelto"];
```

An id in this list that no longer matches a vehicle in `vehicles.js`
(e.g. it was later removed) is silently skipped rather than producing a
broken card.

### Change a vehicle's status

Each vehicle has `condition` (Brand-new / Pre-owned), `mileage`, and
`availability` (Available / Reserved / Sold) in `js/data/vehicles.js`.
These are demonstration values. They appear as a badge on cards and in
the detail page specifications. Sold vehicles show "Ask About Similar
Vehicles" instead of price and test drive requests.

### Replace or add a vehicle photo

1. Get an image you have the rights to use. Landscape orientation, at
   least 1200px wide, works best; the shipped photos are 1600px wide
   JPEGs.
2. Save it into `assets/images/`, named after the vehicle — e.g.
   `assets/images/porsche-911-gt3-rs.jpg`.
3. In `js/data/vehicles.js`, set (or update) that vehicle's `image`
   field to the file's path relative to the site root:
   ```js
   {
     id: "porsche-911-gt3-rs",
     manufacturer: "Porsche",
     model: "911 GT3 RS",
     image: "assets/images/porsche-911-gt3-rs.jpg",
     // ...rest of the fields
   },
   ```
4. Save and refresh. That vehicle's card, detail-page hero, and gallery
   tile now show the photo — no other code changes needed. Removing the
   `image` field (or leaving it off a new entry) reverts that vehicle to
   the typographic spec-plate treatment.

### Re-theme the site

Design tokens (colors, fonts, spacing, corner radius, transition timing)
are custom properties on `:root` at the top of `css/main.css`. Changing a
token there updates every page that uses it, since components and pages
reference the tokens rather than hardcoded values:

```css
:root {
    --color-bg: #0a0a0b;
    --color-accent: #a11d2c;
    --font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
    --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    /* ...radius, motion, etc. */
}
```

Beyond tokens:

- **`css/main.css`** — reset, base typography, header/nav, footer.
- **`css/components.css`** — buttons, vehicle cards, filter bar, form
  fields and validation states, gallery tiles, the lightbox.
- **`css/pages.css`** — layout specific to one page or section (hero,
  about grid, services list, contact grid, vehicle detail hero, the
  "vehicle not found" state).

All page-specific inline styling has been moved into `pages.css` and
`components.css` (e.g. `.page-header .section-intro`, `.about-grid h2`,
`.lightbox-title`) so every page's spacing and typography stays
consistent and editable in one place instead of being scattered across
HTML `style` attributes.

---

## Accessibility notes

- The mobile nav toggle is a real `<button>` that manages
  `aria-expanded`; CSS (not JS) handles the actual show/hide animation.
- The current page's nav link gets `aria-current="page"`, computed at
  runtime by comparing the URL to each link's `href` — this works
  correctly even though every page shares the exact same header markup.
- Gallery tiles are `<button>` elements (not `<div>`s with click
  handlers), so the whole gallery is keyboard- and screen-reader
  navigable without extra `tabindex`/`role` wiring.
- The lightbox is a `role="dialog"` with `aria-modal="true"`; opening it
  moves focus to its close button, and `Escape` or a click on the
  backdrop closes it.
- Contact form fields report errors through an associated
  `role="alert"` element and a `data-invalid` attribute the stylesheet
  uses for the visible error state, so the error is available to
  assistive technology as well as sighted users.

---

## Browser support notes

The site relies on native ES modules (`<script type="module">`),
`URLSearchParams`, optional chaining (`?.`), and CSS custom properties —
all standard in current evergreen browsers (Chrome, Firefox, Safari,
Edge). No transpilation or polyfills are included, so it isn't intended
to support legacy browsers such as Internet Explorer.

---

## Known limitations

- **The contact form doesn't send anything anywhere.** There's no
  backend. Submitting a valid form simulates a network delay, then shows
  a success message and resets the form — nothing is stored or
  transmitted. Wiring it to a real endpoint would mean replacing the
  `window.setTimeout` in `js/pages/contact.js`'s `handleSubmit` with an
  actual request (e.g. `fetch`), and handling that request's failure
  case.
- **Client-side filtering only.** The inventory page filters the entire
  in-memory `vehicles` array, which is fine at the current scale
  (a dozen vehicles) but wouldn't be the right approach for a catalog of
  thousands.
- **No routing.** Each `.html` file is a separate page load; `vehicle.html`
  is the one exception, using its `?id=` query string to act as a single
  page for every vehicle.


---

## Update: theme, motion, typography and map

**Light / dark mode.** A sun/moon button in the header switches themes. The
choice is saved in `localStorage` (`apex-theme`); with no saved choice the
site follows the visitor's system setting. A small inline script in each
page's `<head>` sets `data-theme` before first paint, so there is no flash.
All colours are tokens in `css/main.css`: dark values on `:root`, light
overrides under `:root[data-theme="light"]`. Text that sits on photos uses
the `--color-on-photo*` tokens so it stays light in both themes. Logic lives
in `js/components/theme.js`.

**Animations** (`css/animations.css`, `js/components/animations.js`):
staggered hero entrance, scroll-reveal for sections/cards/rows (also for
cards re-rendered by the inventory filters), card lift and photo zoom,
button light-sweep, nav underline, header shrink and scroll-progress bar,
hero photo parallax, animated eyebrow rules, lightbox open, form error
shake, and a smooth colour cross-fade when switching themes. Everything is
disabled by `prefers-reduced-motion`, and content stays visible without JS.

**Typography.** One scale in `css/main.css` (`--fs-display`, `--fs-h1` to
`--fs-h4`, `--fs-lead`, `--fs-body`, `--fs-small`, `--fs-label`) with
matching line-height and tracking tokens. Page titles use `.page-title`
(h1), section headings `.section-heading` (h2), and eyebrows/labels are
uppercase with tracking. Bare `h1`-`h4` elements now have sensible defaults.

**Map.** `contact.html` has a "Find the showroom" section with an embedded
OpenStreetMap (no API key), directions and full-map links. The map is
inverted to match dark mode. The pin marks the centre of San Fernando,
Pampanga because the dealership is fictional; to point at a real address,
change the `bbox` and `marker` values in the iframe `src` and the links.

---

## Update: interior and rear photos

Each vehicle can now carry extra photos in a `views` object in
`js/data/vehicles.js`:

```js
views: {
    interior: "assets/images/ferrari-296-gtb-interior.jpg",
    rear: "assets/images/ferrari-296-gtb-rear.jpg",
},
```

Files follow the pattern `<vehicle-id>-interior.jpg` / `<vehicle-id>-rear.jpg`
in `assets/images/`. Vehicles with extra views get a **Photos** section on
their detail page (large stage + Exterior / Interior / Rear thumbnails,
`js/components/viewer.js`) and Exterior / Interior / Rear buttons in the
gallery lightbox. A vehicle without `views` simply shows its single photo.
Currently every vehicle has both extra views except the Porsche 911 GT3 RS,
which has none yet: drop `porsche-911-gt3-rs-interior.jpg` and
`porsche-911-gt3-rs-rear.jpg` into `assets/images/` and add a `views` entry.
