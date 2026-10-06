import { Category, Product, Bundle } from "@/types";

// ─── Categories ──────────────────────────────────────────────────────────────
export const categories: Category[] = [
  { id: "brand",   name: "Brand my business",  slug: "brand-my-business",  description: "Business cards, signage & stationery", icon: "building-store", productCount: 9 },
  { id: "events",  name: "Promote an event",   slug: "promote-an-event",   description: "Banners, flyers, backdrops & more",   icon: "speakerphone",   productCount: 9 },
  { id: "apparel", name: "Dress my team",      slug: "dress-my-team",      description: "T-shirts, hoodies, caps & uniforms",  icon: "shirt",          productCount: 9 },
  { id: "gifts",   name: "Corporate gifts",    slug: "corporate-gifts",    description: "Mugs, notebooks, diaries & more",     icon: "gift",           productCount: 9 },
  { id: "packaging", name: "Package my product", slug: "packaging",        description: "Stickers, boxes, bags & labels",      icon: "package",        productCount: 9 },
  { id: "print",   name: "Print & frame",      slug: "print-and-frame",    description: "Photos, canvas, booklets & invites",  icon: "photo",          productCount: 9 },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const products: Product[] = [
  // Brand my business
  { id: "business-cards",     name: "Business Cards",          slug: "business-cards",     categoryId: "brand",     description: "Premium business cards in gloss, matte or soft-touch finish.",          pricingType: "fixed", basePrice: 800,   priceUnit: "per 100pcs", isSameDay: true,  isPopular: true,  isNew: false, turnaround: "Same day" },
  { id: "letterheads",        name: "Letterheads",             slug: "letterheads",        categoryId: "brand",     description: "Branded A4 letterheads for a professional look.",                       pricingType: "fixed", basePrice: 1200,  priceUnit: "per 100pcs", isSameDay: true,  isPopular: false, isNew: false, turnaround: "Same day" },
  { id: "presentation-folders", name: "Presentation Folders", slug: "presentation-folders", categoryId: "brand",   description: "A4 branded folders with pockets for proposals and reports.",             pricingType: "fixed", basePrice: 2500,  priceUnit: "per 50pcs",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "branded-pens",       name: "Branded Pens",            slug: "branded-pens",       categoryId: "brand",     description: "Custom logo pens, perfect for corporate gifting and events.",            pricingType: "fixed", basePrice: 45,    priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: true,  turnaround: "2–3 business days" },
  { id: "lanyards",           name: "Lanyards & Name Tags",    slug: "lanyards",           categoryId: "brand",     description: "Sublimation printed lanyards for events and staff.",                    pricingType: "fixed", basePrice: 150,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "signage",            name: "Signage & 3D Letters",    slug: "signage",            categoryId: "brand",     description: "Acrylic, metal or backlit signage for your office or shop.",            pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "3–5 business days" },
  { id: "envelopes",          name: "Branded Envelopes",       slug: "envelopes",          categoryId: "brand",     description: "DL, C5 and C4 envelopes printed with your brand.",                     pricingType: "fixed", basePrice: 950,   priceUnit: "per 100pcs", isSameDay: true,  isPopular: false, isNew: false, turnaround: "Same day" },
  { id: "door-plates",        name: "Door Plates",             slug: "door-plates",        categoryId: "brand",     description: "Acrylic and metal door plates for offices and rooms.",                 pricingType: "fixed", basePrice: 1800,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "rubber-stamps",      name: "Rubber Stamps",           slug: "rubber-stamps",      categoryId: "brand",     description: "Custom rubber stamps for official documents.",                         pricingType: "fixed", basePrice: 1200,  priceUnit: "per piece",  isSameDay: true,  isPopular: false, isNew: false, turnaround: "Same day" },

  // Promote an event
  { id: "flyers",             name: "Flyers & Leaflets",       slug: "flyers",             categoryId: "events",    description: "A5 and A4 flyers for events, promotions and marketing.",               pricingType: "fixed", basePrice: 1500,  priceUnit: "per 200pcs", isSameDay: true,  isPopular: true,  isNew: false, turnaround: "Same day" },
  { id: "posters",            name: "Posters",                 slug: "posters",            categoryId: "events",    description: "A3, A2 and A1 event posters in full colour.",                          pricingType: "fixed", basePrice: 500,   priceUnit: "per piece",  isSameDay: true,  isPopular: false, isNew: false, turnaround: "Same day" },
  { id: "rollup-banners",     name: "Roll-up Banners",         slug: "rollup-banners",     categoryId: "events",    description: "85×200cm pull-up banners for events and exhibitions.",                 pricingType: "fixed", basePrice: 4500,  priceUnit: "per piece",  isSameDay: false, isPopular: true,  isNew: false, turnaround: "1–2 business days" },
  { id: "backdrop-banners",   name: "Backdrop Banners",        slug: "backdrop-banners",   categoryId: "events",    description: "Large format backdrops for photo booths and stage branding.",          pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "x-banners",          name: "X-Banners",               slug: "x-banners",          categoryId: "events",    description: "Lightweight X-frame banners for retail and events.",                   pricingType: "fixed", basePrice: 3500,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "1–2 business days" },
  { id: "vinyl-banners",      name: "Vinyl Banners",           slug: "vinyl-banners",      categoryId: "events",    description: "Durable outdoor vinyl banners with eyelets.",                          pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "1–2 business days" },
  { id: "selfie-frames",      name: "Selfie Frames",           slug: "selfie-frames",      categoryId: "events",    description: "Branded photo frames for events and activations.",                     pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "table-cloths",       name: "Branded Table Cloths",   slug: "table-cloths",       categoryId: "events",    description: "Custom printed table covers for exhibitions and events.",               pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "3 business days" },
  { id: "button-badges",      name: "Button Badges",           slug: "button-badges",      categoryId: "events",    description: "Custom pin badges for campaigns, events and staff.",                   pricingType: "fixed", basePrice: 80,    priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },

  // Dress my team
  { id: "branded-tshirts",    name: "Branded T-Shirts",        slug: "branded-tshirts",    categoryId: "apparel",   description: "Screen or DTF printed t-shirts with your logo.",                       pricingType: "fixed", basePrice: 650,   priceUnit: "per piece",  isSameDay: false, isPopular: true,  isNew: false, turnaround: "2–3 business days" },
  { id: "hoodies",            name: "Branded Hoodies",         slug: "hoodies",            categoryId: "apparel",   description: "Premium hoodies with embroidery or screen print.",                     pricingType: "fixed", basePrice: 1800,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "3 business days" },
  { id: "polo-shirts",        name: "Polo Shirts",             slug: "polo-shirts",        categoryId: "apparel",   description: "Corporate polo shirts with embroidered logo.",                         pricingType: "fixed", basePrice: 900,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "aprons",             name: "Branded Aprons",          slug: "aprons",             categoryId: "apparel",   description: "Printed aprons for restaurants, salons and events.",                   pricingType: "fixed", basePrice: 700,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "reflector-jackets",  name: "Reflector Jackets",       slug: "reflector-jackets",  categoryId: "apparel",   description: "Hi-vis safety jackets with your brand logo.",                          pricingType: "fixed", basePrice: 1200,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "3 business days" },
  { id: "jerseys",            name: "Sports Jerseys",          slug: "jerseys",            categoryId: "apparel",   description: "Sublimation printed football and sports jerseys.",                     pricingType: "fixed", basePrice: 950,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "3–4 business days" },
  { id: "caps",               name: "Branded Caps",            slug: "caps",               categoryId: "apparel",   description: "Embroidered or printed caps for teams and events.",                    pricingType: "fixed", basePrice: 550,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "wristbands",         name: "Wristbands",              slug: "wristbands",         categoryId: "apparel",   description: "Silicone or fabric wristbands for events and campaigns.",              pricingType: "fixed", basePrice: 80,    priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "overalls",           name: "Branded Overalls",        slug: "overalls",           categoryId: "apparel",   description: "Work overalls with logo for industrial and service teams.",            pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "4–5 business days" },

  // Corporate gifts
  { id: "mugs",               name: "Branded Mugs",            slug: "mugs",               categoryId: "gifts",     description: "Sublimation printed ceramic and enamel mugs.",                        pricingType: "fixed", basePrice: 450,   priceUnit: "per piece",  isSameDay: false, isPopular: true,  isNew: false, turnaround: "2 business days" },
  { id: "flasks",             name: "Thermal Flasks",          slug: "flasks",             categoryId: "gifts",     description: "Branded stainless steel flasks for corporate gifting.",               pricingType: "fixed", basePrice: 1200,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "3 business days" },
  { id: "notebooks",          name: "Branded Notebooks",       slug: "notebooks",          categoryId: "gifts",     description: "A5 hardcover notebooks with your logo on the cover.",                 pricingType: "fixed", basePrice: 350,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "diaries",            name: "Diaries & Journals",      slug: "diaries",            categoryId: "gifts",     description: "Annual branded diaries for clients and staff.",                       pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "3–5 business days" },
  { id: "calendars",          name: "Wall Calendars",          slug: "calendars",          categoryId: "gifts",     description: "A3 custom wall calendars for the new year.",                          pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "3–5 business days" },
  { id: "key-holders",        name: "Key Holders",             slug: "key-holders",        categoryId: "gifts",     description: "Branded metal and leather key rings.",                                pricingType: "fixed", basePrice: 250,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "mousepads",          name: "Custom Mousepads",        slug: "mousepads",          categoryId: "gifts",     description: "Full-colour branded desk mousepads.",                                 pricingType: "fixed", basePrice: 500,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "water-bottles",      name: "Branded Water Bottles",   slug: "water-bottles",      categoryId: "gifts",     description: "Custom printed plastic and aluminium water bottles.",                 pricingType: "fixed", basePrice: 650,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: true,  turnaround: "2–3 business days" },
  { id: "gift-sets",          name: "Corporate Gift Sets",     slug: "gift-sets",          categoryId: "gifts",     description: "Curated branded gift sets for clients and staff.",                    pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "4–5 business days" },

  // Packaging
  { id: "label-stickers",     name: "Label Stickers",          slug: "label-stickers",     categoryId: "packaging", description: "Custom product labels in gloss, matte or kraft finish.",               pricingType: "fixed", basePrice: 2500,  priceUnit: "per 500pcs", isSameDay: false, isPopular: true,  isNew: false, turnaround: "1–2 business days" },
  { id: "vinyl-stickers",     name: "Vinyl Stickers",          slug: "vinyl-stickers",     categoryId: "packaging", description: "Waterproof vinyl stickers for products, laptops and branding.",       pricingType: "fixed", basePrice: 1500,  priceUnit: "per 100pcs", isSameDay: false, isPopular: false, isNew: false, turnaround: "1–2 business days" },
  { id: "die-cut-stickers",   name: "Die-Cut Stickers",        slug: "die-cut-stickers",   categoryId: "packaging", description: "Custom shape stickers cut to your exact design.",                     pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "packaging-boxes",    name: "Custom Packaging Boxes",  slug: "packaging-boxes",    categoryId: "packaging", description: "Branded product boxes for retail and e-commerce.",                   pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "4–5 business days" },
  { id: "kraft-bags",         name: "Kraft Paper Bags",        slug: "kraft-bags",         categoryId: "packaging", description: "Branded eco-friendly kraft paper bags for retail.",                  pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "3–4 business days" },
  { id: "tote-bags",          name: "Branded Tote Bags",       slug: "tote-bags",          categoryId: "packaging", description: "Canvas tote bags with screen printed logo.",                         pricingType: "fixed", basePrice: 450,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "jute-bags",          name: "Jute Bags",               slug: "jute-bags",          categoryId: "packaging", description: "Eco jute bags with printed or embroidered branding.",                pricingType: "fixed", basePrice: 550,   priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "3 business days" },
  { id: "floor-stickers",     name: "Floor Stickers",          slug: "floor-stickers",     categoryId: "packaging", description: "Anti-slip branded floor decals for retail and events.",               pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "vehicle-decals",     name: "Vehicle Decals",          slug: "vehicle-decals",     categoryId: "packaging", description: "Cut vinyl or printed decals for car and fleet branding.",             pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },

  // Print & frame
  { id: "photo-printing",     name: "Photo Printing",          slug: "photo-printing",     categoryId: "print",     description: "High quality photo prints from 4R to A0 size.",                       pricingType: "fixed", basePrice: 50,    priceUnit: "per 4R print", isSameDay: true,  isPopular: true,  isNew: false, turnaround: "Same day" },
  { id: "canvas-prints",      name: "Canvas Prints",           slug: "canvas-prints",      categoryId: "print",     description: "Gallery-quality canvas prints stretched and framed.",                 pricingType: "fixed", basePrice: 2500,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "2 business days" },
  { id: "mounted-photos",     name: "Mounted Prints",          slug: "mounted-photos",     categoryId: "print",     description: "Photos mounted on foamboard or aluminium for display.",               pricingType: "fixed", basePrice: 1500,  priceUnit: "per piece",  isSameDay: false, isPopular: false, isNew: false, turnaround: "1–2 business days" },
  { id: "booklets",           name: "Booklets & Magazines",    slug: "booklets",           categoryId: "print",     description: "Saddle-stitched or perfect-bound booklets in full colour.",           pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "2–3 business days" },
  { id: "document-printing",  name: "Document Printing",       slug: "document-printing",  categoryId: "print",     description: "A4 black & white and colour document printing.",                      pricingType: "fixed", basePrice: 5,     priceUnit: "per page",   isSameDay: true,  isPopular: false, isNew: false, turnaround: "Same day" },
  { id: "receipt-books",      name: "Receipt & Invoice Books", slug: "receipt-books",      categoryId: "print",     description: "NCR duplicate and triplicate receipt books.",                         pricingType: "fixed", basePrice: 1800,  priceUnit: "per book",   isSameDay: false, isPopular: false, isNew: false, turnaround: "1–2 business days" },
  { id: "funeral-programs",   name: "Funeral Programs",        slug: "funeral-programs",   categoryId: "print",     description: "Dignified and beautifully designed funeral programmes.",               pricingType: "fixed", basePrice: 2500,  priceUnit: "per 100pcs", isSameDay: true,  isPopular: false, isNew: false, turnaround: "Same day (urgent)" },
  { id: "wedding-cards",      name: "Wedding Cards",           slug: "wedding-cards",      categoryId: "print",     description: "Elegant wedding invitations, RSVP cards and programmes.",             pricingType: "quote", isSameDay: false, isPopular: false, isNew: false, turnaround: "3–5 business days" },
  { id: "invitation-cards",   name: "Invitation Cards",        slug: "invitation-cards",   categoryId: "print",     description: "Custom invitation cards for all occasions.",                         pricingType: "fixed", basePrice: 2000,  priceUnit: "per 100pcs", isSameDay: false, isPopular: false, isNew: false, turnaround: "1–2 business days" },
];

// ─── Bundles ──────────────────────────────────────────────────────────────────
export const bundles: Bundle[] = [
  {
    id: "hustler",
    name: "The Hustler Pack",
    tagline: "Solo entrepreneurs & side hustles",
    targetAudience: "Starting out and need the basics",
    items: ["100 business cards", "50 flyers (A5)", "1 roll-up banner", "Free design (1 revision)"],
    priceKES: 5500,
    originalPriceKES: 7800,
  },
  {
    id: "launch",
    name: "The Launch Pack",
    tagline: "New SMEs opening their doors",
    targetAudience: "Launching a business and making a first impression",
    items: ["250 business cards", "200 flyers (A5)", "2 roll-up banners", "1 branded t-shirt", "Free design (3 revisions)"],
    priceKES: 12000,
    originalPriceKES: 17500,
    isPopular: true,
  },
  {
    id: "office",
    name: "The Office Pack",
    tagline: "Small teams setting up shop",
    targetAudience: "Moving into an office or growing your team",
    items: ["500 business cards", "100 branded letterheads", "2 roll-up banners", "10 branded pens", "Free design (3 revisions)"],
    priceKES: 15000,
    originalPriceKES: 21000,
  },
  {
    id: "team",
    name: "The Team Starter Pack",
    tagline: "Uniform your crew from day one",
    targetAudience: "Businesses that need to look the part",
    items: ["10 branded t-shirts", "10 branded caps", "200 business cards", "1 backdrop banner (2×2m)", "Free design (2 revisions)"],
    priceKES: 22000,
    originalPriceKES: 30000,
  },
  {
    id: "seller",
    name: "The Product Seller Pack",
    tagline: "For shops, vendors & online sellers",
    targetAudience: "Selling products and want professional packaging",
    items: ["500 label stickers", "200 kraft paper bags", "100 business cards", "50 thank-you cards", "Free design (2 revisions)"],
    priceKES: 18000,
    originalPriceKES: 25000,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getProductsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId);

export const getPopularProducts = () =>
  products.filter((p) => p.isPopular).slice(0, 8);

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const formatPrice = (kes: number) =>
  `KES ${kes.toLocaleString("en-KE")}`;

