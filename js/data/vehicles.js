// The single source of truth for every vehicle on the site. Every page
// that shows vehicle data (home, inventory, detail, gallery) imports from
// here instead of holding its own copy, so a spec only ever needs
// updating in one place and can never drift out of sync between pages.
//
// Optional fields that aren't known are left out of the object entirely
// rather than filled with a placeholder, and vehicleDetail.js skips absent
// fields instead of rendering them as blank or "N/A".
//
// "condition" (Brand-new / Pre-owned), "mileage" and "availability"
// (Available / Reserved / Sold) are demonstration values for this fictional
// dealership; edit them here to change a listing's status everywhere.
//
// "image" is optional: a path (relative to the site root) to a photo in
// assets/images/. Vehicle cards, the detail page hero, and the gallery
// each fall back to a typographic "spec plate" for any vehicle without
// one, so entries can be added ahead of having a photo. See README.md
// "How to add vehicle images" for the full walkthrough.

export const vehicles = [
    {
        id: "porsche-911-gt3-rs",
        manufacturer: "Porsche",
        model: "911 GT3 RS",
        year: "2023",
        category: "Track Weapon",
        image: "assets/images/porsche-911-gt3-rs.jpg",
        condition: "Pre-owned",
        mileage: "3,800 km",
        availability: "Available",
        engine: "4.0L naturally aspirated flat-six",
        power: "525 hp (518 PS)",
        torque: "465 Nm",
        transmission: "7-speed PDK",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "3.2s",
        topSpeed: "296 km/h",
        weight: "1,450 kg",
        description:
            "The most extreme road-legal 911 Porsche builds, developed with technology drawn directly from GT racing. Active aerodynamics, a motorsport-derived chassis, and a screaming naturally aspirated flat-six make it one of the purest driver's cars available today.",
    },
    {
        id: "porsche-718-cayman-gt4-rs",
        manufacturer: "Porsche",
        model: "718 Cayman GT4 RS",
        year: "2022",
        category: "Track Weapon",
        image: "assets/images/porsche-718-cayman-gt4-rs.jpg",
        views: {
            interior: "assets/images/porsche-718-cayman-gt4-rs-interior.jpg",
            rear: "assets/images/porsche-718-cayman-gt4-rs-rear.jpg",
        },
        condition: "Pre-owned",
        mileage: "6,200 km",
        availability: "Reserved",
        engine: "4.0L naturally aspirated flat-six",
        power: "500 PS (493 hp)",
        torque: "450 Nm",
        transmission: "7-speed PDK",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "3.4s",
        topSpeed: "315 km/h",
        weight: "1,415 kg",
        description:
            "A mid-engined evolution of the Cayman GT4 built for lap times above all else. It borrows its heart from the 911 GT3 and pairs it with a lighter, more compact chassis for razor-sharp turn-in.",
    },
    {
        id: "ferrari-296-gtb",
        manufacturer: "Ferrari",
        model: "296 GTB",
        year: "2022",
        category: "Supercar",
        image: "assets/images/ferrari-296-gtb.jpg",
        views: {
            interior: "assets/images/ferrari-296-gtb-interior.jpg",
            rear: "assets/images/ferrari-296-gtb-rear.jpg",
        },
        condition: "Pre-owned",
        mileage: "2,900 km",
        availability: "Available",
        engine: "3.0L twin-turbo V6 plug-in hybrid",
        power: "830 CV combined",
        torque: "740 Nm (combustion engine)",
        transmission: "8-speed dual-clutch",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "2.9s",
        topSpeed: "330 km/h",
        weight: "1,470 kg (dry)",
        description:
            "Ferrari's compact V6 hybrid berlinetta, blending electrified torque-fill with a high-revving combustion engine. The result is startling in-gear acceleration wrapped in a shape shaped almost entirely by aerodynamics.",
    },
    {
        id: "lamborghini-revuelto",
        manufacturer: "Lamborghini",
        model: "Revuelto",
        year: "2023",
        category: "Supercar",
        image: "assets/images/lamborghini-revuelto.jpg",
        views: {
            interior: "assets/images/lamborghini-revuelto-interior.jpg",
            rear: "assets/images/lamborghini-revuelto-rear.jpg",
        },
        condition: "Brand-new",
        mileage: "0 km",
        availability: "Available",
        engine: "6.5L naturally aspirated V12 plug-in hybrid",
        power: "1,015 CV combined",
        torque: "725 Nm (combustion engine)",
        transmission: "8-speed dual-clutch",
        drivetrain: "All-wheel drive",
        zeroToHundred: "2.5s",
        topSpeed: "350 km/h",
        weight: "1,772 kg (dry)",
        description:
            "The successor to the Aventador and Lamborghini's first hybrid V12. Three electric motors work alongside the naturally aspirated engine to deliver four-figure combined output and near four-wheel torque vectoring.",
    },
    {
        id: "lamborghini-huracan-sto",
        manufacturer: "Lamborghini",
        model: "Huracán STO",
        year: "2021",
        category: "Track Weapon",
        image: "assets/images/lamborghini-huracan-sto.jpg",
        views: {
            interior: "assets/images/lamborghini-huracan-sto-interior.jpg",
            rear: "assets/images/lamborghini-huracan-sto-rear.jpg",
        },
        condition: "Pre-owned",
        mileage: "9,500 km",
        availability: "Sold",
        engine: "5.2L naturally aspirated V10",
        power: "640 CV (630 hp)",
        torque: "565 Nm",
        transmission: "7-speed dual-clutch",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "3.0s",
        topSpeed: "310 km/h",
        weight: "1,339 kg (dry)",
        description:
            "Super Trofeo Omologata: a road-legal distillation of Lamborghini's GT3 race program. A single-piece front clamshell, motorsport aero, and rear-wheel-only drive make it the sharpest Huracán ever offered.",
    },
    {
        id: "mclaren-750s",
        manufacturer: "McLaren",
        model: "750S",
        year: "2023",
        category: "Supercar",
        image: "assets/images/mclaren-750s.jpg",
        views: {
            interior: "assets/images/mclaren-750s-interior.jpg",
            rear: "assets/images/mclaren-750s-rear.jpg",
        },
        condition: "Brand-new",
        mileage: "0 km",
        availability: "Available",
        engine: "4.0L twin-turbo V8",
        power: "750 PS (740 hp)",
        torque: "800 Nm",
        transmission: "7-speed dual-clutch",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "2.8s",
        topSpeed: "332 km/h",
        weight: "1,389 kg (dry)",
        description:
            "An evolution of the 720S focused on lightness and driver feedback. A carbon monocoque tub, hydraulic steering, and one of the lightest curb weights in its class define the 750S experience.",
    },
    {
        id: "chevrolet-corvette-z06",
        manufacturer: "Chevrolet",
        model: "Corvette Z06",
        year: "2023",
        category: "Supercar",
        image: "assets/images/chevrolet-corvette-z06.jpg",
        views: {
            interior: "assets/images/chevrolet-corvette-z06-interior.jpg",
            rear: "assets/images/chevrolet-corvette-z06-rear.jpg",
        },
        condition: "Pre-owned",
        mileage: "5,100 km",
        availability: "Available",
        engine: "5.5L naturally aspirated flat-plane V8 (LT6)",
        power: "670 hp",
        torque: "623 Nm (460 lb-ft)",
        transmission: "8-speed dual-clutch",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "2.6s",
        topSpeed: "315 km/h (195 mph)",
        weight: "1,560 kg (approx.)",
        description:
            "America's answer to the Italian supercar establishment. A flat-plane-crank V8 revving to 8,600 rpm, a mid-engine layout, and race-proven aerodynamics deliver exotic-car performance at a fraction of the price.",
    },
    {
        id: "ford-mustang-dark-horse",
        manufacturer: "Ford",
        model: "Mustang Dark Horse",
        year: "2024",
        category: "Muscle",
        image: "assets/images/ford-mustang-dark-horse.jpg",
        views: {
            interior: "assets/images/ford-mustang-dark-horse-interior.jpg",
            rear: "assets/images/ford-mustang-dark-horse-rear.jpg",
        },
        condition: "Brand-new",
        mileage: "0 km",
        availability: "Reserved",
        engine: "5.0L naturally aspirated V8 (Coyote)",
        power: "500 hp",
        torque: "540 Nm (398 lb-ft)",
        transmission: "6-speed manual",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "4.4s",
        topSpeed: "260 km/h (electronically limited)",
        weight: "1,730 kg (approx.)",
        description:
            "The most track-focused Mustang in the current lineup. MagneRide dampers, a Torsen limited-slip differential, and a naturally aspirated V8 keep the analog muscle car formula alive.",
    },
    {
        id: "mercedes-amg-gt-63-s",
        manufacturer: "Mercedes-AMG",
        model: "GT 63 S",
        year: "2023",
        category: "Grand Tourer",
        image: "assets/images/mercedes-amg-gt-63-s.jpg",
        views: {
            interior: "assets/images/mercedes-amg-gt-63-s-interior.jpg",
            rear: "assets/images/mercedes-amg-gt-63-s-rear.jpg",
        },
        condition: "Pre-owned",
        mileage: "7,400 km",
        availability: "Available",
        engine: "4.0L twin-turbo V8",
        power: "630 hp",
        torque: "900 Nm",
        transmission: "9-speed automatic",
        drivetrain: "All-wheel drive",
        zeroToHundred: "3.2s",
        topSpeed: "315 km/h",
        weight: "1,985 kg (approx.)",
        description:
            "A four-door grand tourer that trades none of AMG's theater for practicality. Rear-axle steering and a biturbo V8 make it equally at home on a fast cross-country run or a track day.",
    },
    {
        id: "bmw-m4-csl",
        manufacturer: "BMW",
        model: "M4 CSL",
        year: "2022",
        category: "Track Weapon",
        image: "assets/images/bmw-m4-csl.jpg",
        views: {
            interior: "assets/images/bmw-m4-csl-interior.jpg",
            rear: "assets/images/bmw-m4-csl-rear.jpg",
        },
        condition: "Pre-owned",
        mileage: "4,300 km",
        availability: "Sold",
        engine: "3.0L twin-turbo inline-six",
        power: "550 hp",
        torque: "650 Nm",
        transmission: "8-speed automatic",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "3.7s",
        topSpeed: "307 km/h",
        weight: "1,625 kg",
        description:
            "Coupe, Sport, Leichtbau: BMW's lightest and most powerful M4 to date. Nearly 100 kg lighter than a standard M4, with a rear seat delete and carbon-shell front seats underlining its track intent.",
    },
    {
        id: "nissan-gt-r-nismo",
        manufacturer: "Nissan",
        model: "GT-R NISMO",
        year: "2023",
        category: "Track Weapon",
        image: "assets/images/nissan-gt-r-nismo.jpg",
        views: {
            interior: "assets/images/nissan-gt-r-nismo-interior.jpg",
            rear: "assets/images/nissan-gt-r-nismo-rear.jpg",
        },
        condition: "Brand-new",
        mileage: "0 km",
        availability: "Available",
        engine: "3.8L twin-turbo V6",
        power: "600 PS (592 hp)",
        torque: "652 Nm",
        transmission: "6-speed dual-clutch",
        drivetrain: "All-wheel drive",
        zeroToHundred: "2.8s",
        topSpeed: "315 km/h",
        weight: "1,720 kg",
        description:
            "Godzilla in its most focused form. Motorsport-derived aerodynamics and a hand-built engine give the NISMO the pace to embarrass cars costing several times as much.",
    },
    {
        id: "aston-martin-vantage",
        manufacturer: "Aston Martin",
        model: "Vantage",
        year: "2024",
        category: "Grand Tourer",
        image: "assets/images/aston-martin-vantage.jpg",
        views: {
            interior: "assets/images/aston-martin-vantage-interior.jpg",
            rear: "assets/images/aston-martin-vantage-rear.jpg",
        },
        condition: "Brand-new",
        mileage: "0 km",
        availability: "Available",
        engine: "4.0L twin-turbo V8",
        power: "656 PS (647 hp)",
        torque: "800 Nm",
        transmission: "8-speed automatic",
        drivetrain: "Rear-wheel drive",
        zeroToHundred: "3.4s",
        topSpeed: "325 km/h",
        weight: "1,660 kg",
        description:
            "A significant step up from the outgoing Vantage, with a substantial power increase and a chassis retuned for both circuit pace and long-distance comfort.",
    },
];

// Looks up a single vehicle by id. Returns undefined for an id that
// doesn't match anything, rather than throwing — vehicleDetail.js relies
// on that to distinguish "not found" (show a friendly message) from a
// genuine bug.
export function getVehicleById(id) {
    return vehicles.find((vehicle) => vehicle.id === id);
}

// Derives the unique set of values for a given field (category,
// manufacturer) straight from the data, so inventory.js can build its
// filter dropdowns without a second, hand-maintained list that could
// fall out of sync with what's actually in `vehicles`.
export function getUniqueValues(key) {
    return [...new Set(vehicles.map((vehicle) => vehicle[key]))].sort();
}

// The photo views available for a vehicle, in display order. The main
// "image" is the exterior; "views" (interior, rear) are optional extras.
// A vehicle with no extra views returns just its exterior photo.
export function getVehicleViews(vehicle) {
    const views = [];
    if (vehicle.image) views.push({ key: "exterior", label: "Exterior", src: vehicle.image });
    if (vehicle.views?.interior) views.push({ key: "interior", label: "Interior", src: vehicle.views.interior });
    if (vehicle.views?.rear) views.push({ key: "rear", label: "Rear", src: vehicle.views.rear });
    return views;
}
