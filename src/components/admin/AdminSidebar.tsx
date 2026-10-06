"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin",          label: "Dashboard", icon: "📊" },
  { href: "/admin/orders",   label: "Orders",    icon: "🛒" },
  { href: "/admin/quotes",   label: "Quotes",    icon: "📋" },
  { href: "/admin/products", label: "Products",  icon: "🧾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="w-60 bg-brand-950 text-brand-300 flex flex-col shrink-0 min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-brand-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center text-white">🖨️</div>
          <div>
            <p className="text-sm font-semibold text-brand-300">Angela</p>
            <p className="text-[10px] text-brand-600 -mt-0.5">Admin · v1.0</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
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
          className="flex items-center gap-3 px-3 py-2 text-xs text-brand-600 hover:text-brand-400 transition-colors">
          ↗ View live site
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-brand-600 hover:text-red-400 transition-colors text-left">
            🚪 Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

