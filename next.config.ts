import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images — Next 16 syntax
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "angela.co.ke" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Headers — only set in production to avoid dev warnings
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection",       value: "1; mode=block" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Catch common typo — /auth/admin → /admin
      { source: "/auth/admin", destination: "/admin",     permanent: true },
      // www → non-www
      {
        source:      "/(.*)",
        has:         [{ type: "host", value: "www.angela.co.ke" }],
        destination: "https://angela.co.ke/:path*",
        permanent:   true,
      },
    ];
  },
};

export default nextConfig;

