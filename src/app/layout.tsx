import type { Metadata } from "next";
import "./globals.css";
import Navbar          from "@/components/layout/Navbar";
import PublicChrome    from "@/components/layout/PublicChrome";
import Footer          from "@/components/layout/Footer";
import CartDrawer      from "@/components/cart/CartDrawer";
import WhatsAppButton  from "@/components/ui/WhatsAppButton";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";
import StructuredData  from "@/components/ui/StructuredData";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://angela.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "Angela — Premium Printing Services in Nairobi, Kenya", template: "%s | Angela" },
  description: "Professional printing services in Nairobi. Business cards, banners, branded apparel, packaging & more. Same-day printing. Delivered across all 47 counties in Kenya.",
  keywords: [
    "printing services nairobi", "business cards kenya", "banner printing nairobi",
    "branded apparel kenya", "flyers printing nairobi", "same day printing nairobi",
    "t-shirt printing kenya", "corporate gifts kenya", "rubber stamps nairobi",
    "graphic design kenya", "web design nairobi", "printing services kenya",
  ],
  authors: [{ name: "Angela", url: BASE_URL }],
  creator: "Angela",
  publisher: "Angela",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Angela — Premium Printing in Nairobi",
    description: "Same-day printing in Nairobi. Delivered across all 47 counties.",
    url: BASE_URL,
    siteName: "Angela",
    locale: "en_KE",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Angela — Premium Printing in Nairobi, Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Angela — Premium Printing in Nairobi",
    description: "Same-day printing in Nairobi. Free delivery on orders over KES 7,000.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg",    type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <PublicChrome>
              <Navbar />
              <CartDrawer />
            </PublicChrome>
            {/*
              main sits above the footer (z-10 vs footer's z-0).
              As the user scrolls, main slides UP revealing the sticky
              footer beneath it. Scrolling back up, main covers the
              footer again — natural curtain-reveal behaviour.
            */}
            <main className="relative z-10 bg-white">
              {children}
            </main>
            <PublicChrome>
              <Footer />
              <WhatsAppButton />
            </PublicChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}