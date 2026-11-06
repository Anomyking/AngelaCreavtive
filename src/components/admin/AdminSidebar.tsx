"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin",          label: "Dashboard", icon: "📊" },
  { href: "/admin/orders",   label: "Orders",    icon: "🛒" },
  { href: "/admin/quotes",   label: "Quotes",    icon: "📋" },
  { href: "/admin/products", label: "Products",  icon: "🧾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

/**
 * Admin navigation.
 *  - lg and up: fixed sidebar on the left.
 *  - below lg:  sticky top bar with a menu button that opens a slide-in drawer.
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // While the drawer is open: lock page scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* ── Mobile / tablet top bar ─────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-30 h-14 px-4 flex items-center justify-between bg-brand-950 border-b border-brand-900">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center text-white shrink-0">🖨️</div>
          <p className="text-sm font-semibold text-brand-300 truncate">Angela Admin</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="admin-drawer"
          className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-white hover:bg-brand-900 transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="7"  x2="20" y2="7"  />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </header>

      {/* ── Mobile / tablet drawer ──────────────────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-[visibility] duration-200 ${open ? "visible" : "invisible"}`}
        aria-hidden={!open}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          id="admin-drawer"
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-brand-950 text-brand-300 flex flex-col shadow-2xl transition-transform duration-200 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SidebarContent isActive={isActive} onNavigate={closeDrawer} onClose={closeDrawer} />
        </aside>
      </div>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 bg-brand-950 text-brand-300 flex-col shrink-0 sticky top-0 h-screen self-start">
        <SidebarContent isActive={isActive} />
      </aside>
    </>
  );
}

function SidebarContent({
  isActive,
  onNavigate,
  onClose,
}: {
  isActive:    (href: string) => boolean;
  onNavigate?: () => void;
  onClose?:    () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-brand-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center text-white shrink-0">🖨️</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-300">Angela</p>
            <p className="text-[10px] text-brand-600 -mt-0.5">Admin · v1.0</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-white hover:bg-brand-900 transition-colors shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6"  x2="18" y2="18" />
              <line x1="18" y1="6" x2="6"  y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-brand-700 text-white font-medium"
                  : "text-brand-500 hover:bg-brand-900 hover:text-brand-300"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-brand-900 space-y-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 lg:py-2 text-xs text-brand-600 hover:text-brand-400 transition-colors">
          ↗ View live site
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 lg:py-2 text-xs text-brand-600 hover:text-red-400 transition-colors text-left">
            🚪 Sign out
          </button>
        </form>
      </div>
    </>
  );
}
