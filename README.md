# Apex Motors — Dealership Website

A multi-page static website for **Apex Motors**, a fictional premium
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
   cd apex_motors_v8
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
apex_motors_v8/
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
    └── icons/                 Reserved for future icon assets (currently empty)
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

**Verified specs only.** Apex Motors' stated policy (see the comment at
the top of `vehicles.js`) is that only specifications the maintainer can
verify are included. A field that isn't confirmed is left out of that
vehicle's object entirely, rather than filled in with a guess or a
placeholder. `vehicleDetail.js` renders `SPEC_ROWS` accordingly: a
missing field simply produces no row, so the detail page never shows a
blank value or "N/A".

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
| Home | `index.html` | Hero, a hand-picked set of featured vehicles, "why us," a services preview, and a closing call to action. |
| Inventory | `inventory.html` | The full vehicle collection with category and manufacturer filters, built dynamically from the dataset. |
| Vehicle detail | `vehicle.html?id=<vehicle-id>` | One page that renders any vehicle, chosen via a `?id=` query parameter (e.g. `vehicle.html?id=porsche-911-gt3-rs`). Shows a "not found" state with a link back to inventory for an unknown or stale id. |
| Gallery | `gallery.html` | A photo grid of the whole collection; selecting a tile opens a shared lightbox dialog with the vehicle's name, category, and description. |
| About | `about.html` | Dealership story and philosophy. |
| Services | `services.html` | What the dealership offers (sales, test drives, sourcing, trade-in and vehicle consultation). |
| Contact | `contact.html` | A validated contact / test-drive request form. Arriving from a vehicle's "Book a Test Drive" link pre-fills the "vehicle of interest" field via a `?vehicle=` query parameter. |

---

## The vehicle dataset

`js/data/vehicles.js` exports `vehicles`, `STATUS`, `getVehicleById(id)` and
`getUniqueValues(key)`. The header comment of that file is the reference for
every field. In short (v8):

- **Specs are numbers in one unit each**: `powerHp` (hp), `torqueNm` (Nm),
  `zeroToHundred` (s), `topSpeedKmh` (km/h), `weightKg` (kg, with a
  `weightNote` such as "dry", "kerb (DIN)" or "approx."). Display text comes
  from `js/utils/format.js`, so every page writes a figure the same way.
  Metric PS/CV values were converted to hp (1 PS = 0.98632 hp).
- **Buying info**: `price` (PHP, or `null` for "Price on request"),
  `condition` (`"new"` or `"pre-owned"`), `mileageKm` (`null` for new) and
  `status` (`"available"`, `"reserved"`, `"sold"`).
  **These values are demo placeholders, not real stock.**
- **Photos**: `image` is the main photo. `views` is an optional list of
  `{ label, src }` for real extra photos (rear, interior, detail). Without
  `views` the detail page shows labelled crops of the main photo and says so.
  `photoCheck` is an optional note shown when the main photo may not match the
  listed model; delete it once the photo is replaced.

Cars with real extra photos (rear + interior): all except the 911 GT3 RS.

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

### Add rear / interior photos to a vehicle

Save the files in `assets/images/` (for example `ferrari-296-gtb-interior.jpg`)
and add to that vehicle in `vehicles.js`:

```js
views: [
    { label: "Rear", src: "assets/images/ferrari-296-gtb-rear.jpg" },
    { label: "Interior", src: "assets/images/ferrari-296-gtb-interior.jpg" },
],
```

The thumbnail switcher on the detail page and the thumbnails in the gallery
viewer update automatically. Use photos you have the right to publish;
1200 px wide or more looks best.

### Feature a vehicle on the home page

The home page shows a short, curated subset rather than the full
collection. Open `js/main.js` and add the vehicle's `id` to the
`FEATURED_VEHICLE_IDS` array near the top of the file:

```js
const FEATURED_VEHICLE_IDS = ["ferrari-296-gtb", "porsche-911-gt3-rs", "lamborghini-revuelto"];
```

An id in this list that no longer matches a vehicle in `vehicles.js`
(e.g. it was later removed) is silently skipped rather than producing a
broken card.

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

- **Contrast**: every text colour token is at least 4.5:1 against the
  background, surface and alt-surface tokens in both themes (large text 3:1).
  Red used for small text is the lighter `--color-accent-text`; the darker
  accent is for fills and decoration. A browser script that checks the rendered
  text on every page in both themes found no failures (text over photos is
  excluded and sits on fixed dark overlays with light text).
- **Themes**: dark is the default. With no saved choice the site follows the
  system setting (`prefers-color-scheme`). The nav toggle stores the choice in
  `localStorage` (key `apex-theme`); `js/theme-init.js` applies it before first
  paint to avoid a flash. Light and dark token sets live at the top of
  `css/main.css`; edit both together.
- **Keyboard**: skip link, visible focus on everything, Escape closes the mobile
  menu and the gallery viewer, the viewer traps focus and returns it to the tile,
  arrow keys move between vehicles in the viewer and photos on the detail page.
- **Forms**: errors appear in an error summary (focused on submit) and under each
  field, with `aria-invalid` and `aria-describedby`; status text is announced via
  `aria-live`. Status badges use text, not colour alone.
- Navigation toggle is a real `<button>` with `aria-expanded`; the current page's
  link has `aria-current="page"`.

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
  a confirmation that says plainly it was not sent — nothing is stored or
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

## v7 design pass

- **Red as a brand colour:** `--color-accent`/`--color-accent-bright` are brighter, with `--color-accent-glow` and `--shadow-red` tokens for glow.
- **Buttons:** `.btn-primary` is a gradient with glow and a hover sheen; `.btn-outline` turns red on hover. The nav "Book a Test Drive" is solid red.
- **Cards:** lift, red border and glow, image zoom, top bar and a "View details" pill on hover. The whole card is clickable.
- **Vehicle detail:** image gallery, key stats, booking card, performance meters (parsed from the specs) and related vehicles.
- **Real extra angles:** add `views: [{ label: "Front", src: "assets/images/<id>-front.jpg" }, ...]` to a vehicle in `js/data/vehicles.js`. Without `views`, the gallery shows the main photo plus close-up crops of it.
- **Favicon:** `assets/icons/favicon.svg` (plus PNG fallbacks), linked from every page.


---

## v8 changes (review follow-up)

Contrast and a light theme; image-led home hero; price, condition, mileage and
availability on every listing; one set of spec units; detail-page photo
switcher with real rear/interior photos for four cars; gallery viewer with a
large photo, details link and full keyboard support; image skeletons and
fade-in; contact form with inquiry types, date/time fields, validation,
loading and confirmation states and a demo notice; services process and
about-page process details. "Book a Test Drive" is now "Request a Test Drive"
everywhere because a test drive is a request until the team confirms it.

**Still needs real input**: real prices/mileage/availability; larger extra
photos for the other eight cars; confirmation of the process wording on the
Services and About pages (confirmation time, licence requirement, what is
inspected); a manufacturer-sheet check of the `approx.` weights and the 750S
kerb weight; the BMW M4 CSL main (front) photo.


---

## v9 changes

- **New hero photos** for all 12 cars replace the old main images (`assets/images/<id>.jpg`). This also fixes the earlier mismatches (Vantage, GT-R and 718 main photos, and the standard-M4 `photoCheck` note, which was removed).
- **Rear + interior photos** added for the Ferrari 296 GTB, Revuelto, Huracán STO, 750S, Corvette Z06, Mustang Dark Horse and AMG GT 63 S (`<id>-rear.jpg`, `<id>-interior.jpg`, wired through `views` in `js/data/vehicles.js`).
- **Page banners**: Inventory, Services, About, Gallery and Contact now have a photo banner (`.page-banner` in `css/pages.css`). Change the photo with the inline `background-image`, and the crop with `--banner-pos`.
- **Services**: "Request a test drive" is now a real `.btn.btn-primary` placed under the Test Drives paragraph.
