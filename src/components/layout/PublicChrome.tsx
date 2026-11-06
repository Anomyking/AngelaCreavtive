"use client";

import { usePathname } from "next/navigation";

/**
 * Renders its children (navbar, footer, cart drawer, WhatsApp button…) on the
 * public site only. The admin dashboard has its own navigation, so showing the
 * storefront chrome there would stack two headers on phones and let the sticky
 * public navbar cover the admin menu button.
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
