import { MetadataRoute } from "next";
import { products, categories } from "@/data";

const BASE_URL = "https://angela.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/quote`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/faqs`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/how-to-order`,lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/delivery`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/business`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`,       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/templates`,   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // ── Category pages ────────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url:             `${BASE_URL}/shop/${cat.slug}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.9,
  }));

  // ── Product pages ─────────────────────────────────────────────────────────
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url:             `${BASE_URL}/products/${product.slug}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}

