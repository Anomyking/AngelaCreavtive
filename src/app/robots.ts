import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  ["/admin", "/api/", "/checkout/", "/api/admin/"],
      },
    ],
    sitemap: "https://angela.co.ke/sitemap.xml",
  };
}

