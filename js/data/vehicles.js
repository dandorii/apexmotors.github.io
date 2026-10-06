// The single source of truth for every vehicle on the site. Every page
// that shows vehicle data (home, inventory, detail, gallery) imports from
// here, so a spec only ever needs updating in one place.
//
// STORAGE FORMAT (v8): specs are stored as plain NUMBERS in one unit each
// and formatted for display by js/utils/format.js. That is what keeps the
// site consistent (hp / Nm / km/h / kg / seconds everywhere) and lets the
// detail-page meters work without parsing text.
//
//   powerHp        mechanical horsepower. Metric figures were converted
//                  (1 PS = 1 CV = 0.98632 hp) and rounded.
//   torqueNm       newton-metres only (lb-ft was converted)
//   zeroToHundred  seconds
//   topSpeedKmh    km/h
//   weightKg       kg; weightNote says which weight it is ("dry",
//                  "kerb (DIN)", "approx.") because they are not comparable
//   powerNote / torqueNote / topSpeedNote   optional qualifiers
//
// BUYING INFO (v8) -- ALL DEMO PLACEHOLDERS, NOT REAL STOCK:
//   price        number in PHP, or null => shown as "Price on request"
//   condition    "new" | "pre-owned"
//   mileageKm    number for pre-owned, null for new
//   status       "available" | "reserved" | "sold"
// Replace these with real figures before this site is used for anything
// beyond a demonstration.
//
// PHOTOS:
//   image        main photo (used on cards, hero, gallery)
//   views        optional [{ label, src }] -- real extra photos (rear,
//                interior, detail). Without it the detail page falls back
//                to labelled crops of the main photo.
//   photoCheck   optional note: set when the main photo does not clearly
//                match the listed model/generation. Shown on the detail
//                page until the photo is replaced. Delete it once fixed.

export const vehicles = [
    {
        "id": "porsche-911-gt3-rs",
        "manufacturer": "Porsche",
        "model": "911 GT3 RS",
        "year": 2023,
        "category": "Track Weapon",
        "engine": "4.0L naturally aspirated flat-six",
        "powerHp": 518,
        "torqueNm": 465,
        "transmission": "7-speed PDK",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 3.2,
        "topSpeedKmh": 296,
        "weightKg": 1450,
        "weightNote": "kerb (DIN)",
        "price": 21800000,
        "condition": "pre-owned",
        "mileageKm": 4200,
        "status": "available",
        "description": "The most extreme road-legal 911 Porsche builds, developed with technology drawn directly from GT racing. Active aerodynamics, a motorsport-derived chassis, and a screaming naturally aspirated flat-six make it one of the purest driver's cars available today.",
        "image": "assets/images/porsche-911-gt3-rs.jpg"
    },
    {
        "id": "porsche-718-cayman-gt4-rs",
        "manufacturer": "Porsche",
        "model": "718 Cayman GT4 RS",
        "year": 2022,
        "category": "Track Weapon",
        "engine": "4.0L naturally aspirated flat-six",
        "powerHp": 493,
        "torqueNm": 450,
        "transmission": "7-speed PDK",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 3.4,
        "topSpeedKmh": 315,
        "weightKg": 1415,
        "weightNote": "kerb (DIN)",
        "price": 15900000,
        "condition": "pre-owned",
        "mileageKm": 6800,
        "status": "reserved",
        "description": "A mid-engined evolution of the Cayman GT4 built for lap times above all else. It borrows its heart from the 911 GT3 and pairs it with a lighter, more compact chassis for razor-sharp turn-in.",
        "image": "assets/images/porsche-718-cayman-gt4-rs.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/porsche-718-cayman-gt4-rs-rear.jpg" },
            { "label": "Interior", "src": "assets/images/porsche-718-cayman-gt4-rs-interior.jpg" }
        ]
    },
    {
        "id": "ferrari-296-gtb",
        "manufacturer": "Ferrari",
        "model": "296 GTB",
        "year": 2022,
        "category": "Supercar",
        "engine": "3.0L twin-turbo V6 plug-in hybrid",
        "powerHp": 819,
        "powerNote": "combined",
        "torqueNm": 740,
        "torqueNote": "combustion engine only",
        "transmission": "8-speed dual-clutch",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 2.9,
        "topSpeedKmh": 330,
        "weightKg": 1470,
        "weightNote": "dry",
        "price": null,
        "condition": "pre-owned",
        "mileageKm": 3100,
        "status": "available",
        "description": "Ferrari's compact V6 hybrid berlinetta, blending electrified torque-fill with a high-revving combustion engine. The result is startling in-gear acceleration wrapped in a shape shaped almost entirely by aerodynamics.",
        "image": "assets/images/ferrari-296-gtb.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/ferrari-296-gtb-rear.jpg" },
            { "label": "Interior", "src": "assets/images/ferrari-296-gtb-interior.jpg" }
        ]
    },
    {
        "id": "lamborghini-revuelto",
        "manufacturer": "Lamborghini",
        "model": "Revuelto",
        "year": 2023,
        "category": "Supercar",
        "engine": "6.5L naturally aspirated V12 plug-in hybrid",
        "powerHp": 1001,
        "powerNote": "combined",
        "torqueNm": 725,
        "torqueNote": "combustion engine only",
        "transmission": "8-speed dual-clutch",
        "drivetrain": "All-wheel drive",
        "zeroToHundred": 2.5,
        "topSpeedKmh": 350,
        "weightKg": 1772,
        "weightNote": "dry",
        "price": null,
        "condition": "new",
        "mileageKm": null,
        "status": "available",
        "description": "The successor to the Aventador and Lamborghini's first hybrid V12. Three electric motors work alongside the naturally aspirated engine to deliver four-figure combined output and near four-wheel torque vectoring.",
        "image": "assets/images/lamborghini-revuelto.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/lamborghini-revuelto-rear.jpg" },
            { "label": "Interior", "src": "assets/images/lamborghini-revuelto-interior.jpg" }
        ]
    },
    {
        "id": "lamborghini-huracan-sto",
        "manufacturer": "Lamborghini",
        "model": "Huracán STO",
        "year": 2021,
        "category": "Track Weapon",
        "engine": "5.2L naturally aspirated V10",
        "powerHp": 631,
        "torqueNm": 565,
        "transmission": "7-speed dual-clutch",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 3.0,
        "topSpeedKmh": 310,
        "weightKg": 1339,
        "weightNote": "dry",
        "price": null,
        "condition": "pre-owned",
        "mileageKm": 9500,
        "status": "sold",
        "description": "Super Trofeo Omologata: a road-legal distillation of Lamborghini's GT3 race program. A single-piece front clamshell, motorsport aero, and rear-wheel-only drive make it the sharpest Huracán ever offered.",
        "image": "assets/images/lamborghini-huracan-sto.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/lamborghini-huracan-sto-rear.jpg" },
            { "label": "Interior", "src": "assets/images/lamborghini-huracan-sto-interior.jpg" }
        ]
    },
    {
        "id": "mclaren-750s",
        "manufacturer": "McLaren",
        "model": "750S",
        "year": 2023,
        "category": "Supercar",
        "engine": "4.0L twin-turbo V8",
        "powerHp": 740,
        "torqueNm": 800,
        "transmission": "7-speed dual-clutch",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 2.8,
        "topSpeedKmh": 332,
        "weightKg": 1389,
        "weightNote": "kerb (DIN)",
        "price": 23500000,
        "condition": "pre-owned",
        "mileageKm": 2400,
        "status": "available",
        "description": "An evolution of the 720S focused on lightness and driver feedback. A carbon monocoque tub, hydraulic steering, and one of the lightest curb weights in its class define the 750S experience.",
        "image": "assets/images/mclaren-750s.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/mclaren-750s-rear.jpg" },
            { "label": "Interior", "src": "assets/images/mclaren-750s-interior.jpg" }
        ]
    },
    {
        "id": "chevrolet-corvette-z06",
        "manufacturer": "Chevrolet",
        "model": "Corvette Z06",
        "year": 2023,
        "category": "Supercar",
        "engine": "5.5L naturally aspirated flat-plane V8 (LT6)",
        "powerHp": 670,
        "torqueNm": 623,
        "transmission": "8-speed dual-clutch",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 2.6,
        "topSpeedKmh": 314,
        "weightKg": 1560,
        "weightNote": "approx.",
        "price": 11900000,
        "condition": "new",
        "mileageKm": null,
        "status": "available",
        "description": "America's answer to the Italian supercar establishment. A flat-plane-crank V8 revving to 8,600 rpm, a mid-engine layout, and race-proven aerodynamics deliver exotic-car performance at a fraction of the price.",
        "image": "assets/images/chevrolet-corvette-z06.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/chevrolet-corvette-z06-rear.jpg" },
            { "label": "Interior", "src": "assets/images/chevrolet-corvette-z06-interior.jpg" }
        ]
    },
    {
        "id": "ford-mustang-dark-horse",
        "manufacturer": "Ford",
        "model": "Mustang Dark Horse",
        "year": 2024,
        "category": "Muscle",
        "engine": "5.0L naturally aspirated V8 (Coyote)",
        "powerHp": 500,
        "torqueNm": 540,
        "transmission": "6-speed manual",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 4.4,
        "topSpeedKmh": 260,
        "topSpeedNote": "electronically limited",
        "weightKg": 1730,
        "weightNote": "approx.",
        "price": 6900000,
        "condition": "new",
        "mileageKm": null,
        "status": "available",
        "description": "The most track-focused Mustang in the current lineup. MagneRide dampers, a Torsen limited-slip differential, and a naturally aspirated V8 keep the analog muscle car formula alive.",
        "image": "assets/images/ford-mustang-dark-horse.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/ford-mustang-dark-horse-rear.jpg" },
            { "label": "Interior", "src": "assets/images/ford-mustang-dark-horse-interior.jpg" }
        ]
    },
    {
        "id": "mercedes-amg-gt-63-s",
        "manufacturer": "Mercedes-AMG",
        "model": "GT 63 S",
        "year": 2023,
        "category": "Grand Tourer",
        "engine": "4.0L twin-turbo V8",
        "powerHp": 630,
        "torqueNm": 900,
        "transmission": "9-speed automatic",
        "drivetrain": "All-wheel drive",
        "zeroToHundred": 3.2,
        "topSpeedKmh": 315,
        "weightKg": 1985,
        "weightNote": "approx.",
        "price": 14500000,
        "condition": "pre-owned",
        "mileageKm": 11200,
        "status": "available",
        "description": "A four-door grand tourer that trades none of AMG's theater for practicality. Rear-axle steering and a biturbo V8 make it equally at home on a fast cross-country run or a track day.",
        "image": "assets/images/mercedes-amg-gt-63-s.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/mercedes-amg-gt-63-s-rear.jpg" },
            { "label": "Interior", "src": "assets/images/mercedes-amg-gt-63-s-interior.jpg" }
        ]
    },
    {
        "id": "bmw-m4-csl",
        "manufacturer": "BMW",
        "model": "M4 CSL",
        "year": 2022,
        "category": "Track Weapon",
        "engine": "3.0L twin-turbo inline-six",
        "powerHp": 542,
        "torqueNm": 650,
        "transmission": "8-speed automatic",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 3.7,
        "topSpeedKmh": 307,
        "weightKg": 1625,
        "weightNote": "kerb (DIN)",
        "price": null,
        "condition": "pre-owned",
        "mileageKm": 5600,
        "status": "reserved",
        "description": "Coupe, Sport, Leichtbau: BMW's lightest and most powerful M4 to date. Nearly 100 kg lighter than a standard M4, with a rear seat delete and carbon-shell front seats underlining its track intent.",
        "image": "assets/images/bmw-m4-csl.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/bmw-m4-csl-rear.jpg" },
            { "label": "Interior", "src": "assets/images/bmw-m4-csl-interior.jpg" }
        ]
    },
    {
        "id": "nissan-gt-r-nismo",
        "manufacturer": "Nissan",
        "model": "GT-R NISMO",
        "year": 2023,
        "category": "Track Weapon",
        "engine": "3.8L twin-turbo V6",
        "powerHp": 592,
        "torqueNm": 652,
        "transmission": "6-speed dual-clutch",
        "drivetrain": "All-wheel drive",
        "zeroToHundred": 2.8,
        "topSpeedKmh": 315,
        "weightKg": 1720,
        "weightNote": "kerb",
        "price": 17800000,
        "condition": "pre-owned",
        "mileageKm": 3900,
        "status": "sold",
        "description": "Godzilla in its most focused form. Motorsport-derived aerodynamics and a hand-built engine give the NISMO the pace to embarrass cars costing several times as much.",
        "image": "assets/images/nissan-gt-r-nismo.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/nissan-gt-r-nismo-rear.jpg" },
            { "label": "Interior", "src": "assets/images/nissan-gt-r-nismo-interior.jpg" }
        ]
    },
    {
        "id": "aston-martin-vantage",
        "manufacturer": "Aston Martin",
        "model": "Vantage",
        "year": 2024,
        "category": "Grand Tourer",
        "engine": "4.0L twin-turbo V8",
        "powerHp": 647,
        "torqueNm": 800,
        "transmission": "8-speed automatic",
        "drivetrain": "Rear-wheel drive",
        "zeroToHundred": 3.4,
        "topSpeedKmh": 325,
        "weightKg": 1660,
        "weightNote": "approx.",
        "price": 15200000,
        "condition": "new",
        "mileageKm": null,
        "status": "available",
        "description": "A significant step up from the outgoing Vantage, with a substantial power increase and a chassis retuned for both circuit pace and long-distance comfort.",
        "image": "assets/images/aston-martin-vantage.jpg",
        "views": [
            { "label": "Rear", "src": "assets/images/aston-martin-vantage-rear.jpg" },
            { "label": "Interior", "src": "assets/images/aston-martin-vantage-interior.jpg" }
        ]
    }
];

export const STATUS = {
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
};

// Looks up a single vehicle by id. Returns undefined for an unknown id so
// vehicleDetail.js can show its "not found" state instead of throwing.
export function getVehicleById(id) {
    return vehicles.find((vehicle) => vehicle.id === id);
}

// Unique, sorted values for a field -- used to build the filter dropdowns
// straight from the data.
export function getUniqueValues(key) {
    return [...new Set(vehicles.map((vehicle) => vehicle[key]))].sort();
}
