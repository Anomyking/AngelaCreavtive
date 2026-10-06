"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Printer, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Products", href: "/#products"        },
  { label: "Signage",  href: "/services/signage"  },
  { label: "About",    href: "/about"             },
  { label: "Business", href: "/business"          },
  { label: "Contact",  href: "/contact"           },
  { label: "Support",  href: "/faqs"              },
];

/* Indigo underline that slides left → right on hover */
function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      className="relative px-3 py-2 text-sm text-brand-600 hover:text-brand-800 rounded-lg hover:bg-brand-50 transition-colors overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      <motion.span
        className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-brand-700 origin-left"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      />
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [prevCount,    setPrevCount]    = useState(0);
  const [badgeBounce,  setBadgeBounce]  = useState(false);

  const { itemCount, openCart } = useCart();
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (itemCount > prevCount && prevCount !== 0) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 400);
    }
    setPrevCount(itemCount);
  }, [itemCount]);

  const runSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-brand-50"
      animate={{
        height: scrolled ? 52 : 64,
        boxShadow: scrolled ? "0 4px 24px rgba(34,30,31,0.10)" : "0 1px 0 rgba(34,30,31,0.06)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <motion.div
              className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Printer size={16} className="text-white" />
            </motion.div>
            <span className="font-semibold text-brand-950 text-lg tracking-tight">Angela</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-sm items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-2 focus-within:border-brand-400 transition-colors">
            <button onClick={runSearch} aria-label="Search" className="shrink-0">
              <Search size={14} className="text-brand-400 hover:text-brand-700" />
            </button>
            <input type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Search products — press Enter"
              className="flex-1 bg-transparent text-xs text-brand-700 placeholder:text-brand-400 outline-none" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-brand-400 hover:text-brand-700 text-xs">✕</button>
            )}
          </div>

          {/* Nav links with indigo underline */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink key={link.href} label={link.label} href={link.href} />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative hidden md:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors">
                  <User size={16} />
                  <span className="max-w-[80px] truncate">{user.email?.split("@")[0]}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-1 w-44 bg-white border border-brand-100 rounded-xl shadow-lg py-1 z-50"
                    >
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs text-brand-700 hover:bg-brand-50">📦 My orders</Link>
                      <Link href="/account?tab=profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs text-brand-700 hover:bg-brand-50">👤 Profile</Link>
                      <div className="border-t border-brand-50 mt-1 pt-1">
                        <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50">🚪 Sign out</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:block text-sm text-brand-600 hover:text-brand-800 px-3 py-2 transition-colors">Login</Link>
            )}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
              <Link href="/quote" className="hidden md:block text-sm bg-brand-700 hover:bg-brand-600 text-white px-4 py-2 rounded-full transition-colors">
                Get a quote
              </Link>
            </motion.div>

            {/* Cart with bounce badge */}
            <motion.button onClick={openCart} className="relative p-2 rounded-lg hover:bg-brand-50 transition-colors" whileTap={{ scale: 0.90 }}>
              <ShoppingCart size={20} className="text-brand-700" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={badgeBounce ? { scale: [1, 1.45, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-brand-700 text-white text-[10px] rounded-full flex items-center justify-center font-medium"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile toggle */}
            <motion.button className="lg:hidden p-2 rounded-lg hover:bg-brand-50" onClick={() => setMobileOpen(!mobileOpen)} whileTap={{ scale: 0.90 }}>
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}><X    size={20} className="text-brand-700" /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} className="text-brand-700" /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu slide */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-brand-50 bg-white overflow-hidden"
          >
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 bg-brand-50 rounded-full px-4 py-2 mb-4">
                <Search size={14} className="text-brand-400" />
                <input type="text" placeholder="Search products…"
                  className="flex-1 bg-transparent text-xs outline-none text-brand-700 placeholder:text-brand-400"
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.2 }}>
                    <Link href={link.href} className="block text-sm text-brand-700 px-3 py-3 rounded-lg hover:bg-brand-50 transition-colors" onClick={() => setMobileOpen(false)}>{link.label}</Link>
                  </motion.div>
                ))}
                {user ? (
                  <>
                    <Link href="/account" className="text-sm text-brand-700 px-3 py-3 rounded-lg hover:bg-brand-50" onClick={() => setMobileOpen(false)}>📦 My orders</Link>
                    <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-left text-sm text-red-500 px-3 py-3 rounded-lg hover:bg-red-50">🚪 Sign out</button>
                  </>
                ) : (
                  <Link href="/auth/login" className="text-sm text-brand-700 px-3 py-3 rounded-lg hover:bg-brand-50" onClick={() => setMobileOpen(false)}>Login</Link>
                )}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.2 }}>
                  <Link href="/quote" className="mt-2 flex items-center justify-center bg-brand-700 text-white text-sm font-medium px-6 py-3 rounded-full w-full" onClick={() => setMobileOpen(false)}>Get a quote</Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}