// JSON-LD structured data for Google rich results.
// Resolves to NEXT_PUBLIC_APP_URL when set, otherwise the production domain.

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://angela.co.ke";

interface Props {
  /** Optional product-specific schema for /products/[slug] pages */
  product?: {
    name:        string;
    description: string;
    image?:      string;
    price?:      number;
    sku?:        string;
    url:         string;
  };
}

export default function StructuredData({ product }: Props = {}) {
  const graph: Record<string, unknown>[] = [
    // ── Local Business ────────────────────────────────────────────────────
    {
      "@type":              "LocalBusiness",
      "@id":                `${BASE_URL}/#business`,
      "name": "angela",
      "description":        "Premium printing services in Nairobi — business cards, banners, branded apparel, packaging and more. Same-day printing, delivered across all 47 counties in Kenya.",
      "url":                BASE_URL,
      "telephone":          "+254700000000",
      "email":              "hello@angela.co.ke",
      "priceRange":         "KES 800 – KES 50,000",
      "currenciesAccepted": "KES",
      "paymentAccepted":    "M-Pesa, Bank transfer",
      "image":              `${BASE_URL}/og-image.png`,
      "logo":               `${BASE_URL}/icon.svg`,
      "address": {
        "@type":           "PostalAddress",
        "streetAddress":   "Westlands",
        "addressLocality": "Nairobi",
        "addressCountry":  "KE",
      },
      "geo": { "@type": "GeoCoordinates", "latitude": "-1.2631", "longitude": "36.8034" },
      "openingHoursSpecification": [{
        "@type":     "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens":     "08:00",
        "closes":    "18:00",
      }],
      "sameAs": [
        "https://www.instagram.com/angela.co.ke",
        "https://www.facebook.com/angelake",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name":  "Printing & Design Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business Card Printing"  } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Banner Printing"         } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Branded T-Shirt Printing"} },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flyer Printing"          } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Gift Printing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Packaging"        } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Graphic Design"          } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Design"              } },
        ],
      },
    },

    // ── WebSite (sitelinks searchbox) ─────────────────────────────────────
    {
      "@type":       "WebSite",
      "@id":         `${BASE_URL}/#website`,
      "url":         BASE_URL,
      "name": "angela",
      "description": "Premium printing services in Nairobi, Kenya",
      "potentialAction": {
        "@type":       "SearchAction",
        "target":      `${BASE_URL}/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  // ── Product-specific schema (for /products/[slug]) ─────────────────────
  if (product) {
    graph.push({
      "@type":       "Product",
      "name":        product.name,
      "description": product.description,
      ...(product.image && { "image": product.image }),
      ...(product.sku   && { "sku":   product.sku   }),
      "brand":       { "@type": "Brand", "name": "angela" },
      "url":         product.url,
      ...(product.price && {
        "offers": {
          "@type":         "Offer",
          "url":           product.url,
          "priceCurrency": "KES",
          "price":         product.price,
          "availability":  "https://schema.org/InStock",
          "seller":        { "@id": `${BASE_URL}/#business` },
        },
      }),
    });
  }

  const schema = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

