"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { categories, products as allProducts, formatPrice } from "@/data";
import { Product } from "@/types";
import ProductImage from "@/components/product/ProductImage";
import { motion, AnimatePresence } from "framer-motion";

const categoryEmojis: Record<string, string> = {
  brand: "🏷️", events: "📣", apparel: "👕",
  gifts: "🎁", packaging: "📦", print: "🖼️",
};

type SortKey = "popular" | "price-asc" | "price-desc" | "turnaround";

/* ── Animated product card ───────────────────────────────────────────── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        delay: index * 0.07,
        duration: 0.52,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 48px rgba(34,30,31,0.13)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col bg-white border border-brand-100 rounded-2xl overflow-hidden hover:border-brand-400 transition-colors duration-200 h-full"
      >
        <div className="relative h-36 bg-brand-50 overflow-hidden">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <ProductImage productId={product.id} productName={product.name} size="card" />
          </motion.div>
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
            {product.isPopular && <span className="text-[9px] font-medium bg-brand-700 text-white rounded-full px-2 py-0.5">Popular</span>}
            {product.isSameDay && <span className="text-[9px] font-medium bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">Same-day</span>}
            {product.isNew     && <span className="text-[9px] font-medium bg-brand-100 text-brand-700 rounded-full px-2 py-0.5">New</span>}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-sm font-medium text-brand-950 mb-1 leading-snug">{product.name}</p>
          <p className="text-xs text-brand-400 leading-relaxed flex-1 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-50">
            <div>
              <p className="text-[10px] text-brand-400">{product.pricingType === "fixed" ? "From" : "Custom quote"}</p>
              <p className="text-sm font-medium text-brand-800">
                {product.pricingType === "fixed" && product.basePrice ? formatPrice(product.basePrice) : "Get a quote"}
              </p>
              {product.priceUnit && <p className="text-[10px] text-brand-400">{product.priceUnit}</p>}
            </div>
            <motion.div
              className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center shrink-0"
              whileHover={{ scale: 1.18, backgroundColor: "#241F66" }}
              whileTap={{ scale: 0.90 }}
              transition={{ duration: 0.18 }}
            >
              <span className="text-white text-sm">→</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Grid with stagger ───────────────────────────────────────────────── */
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={products.map(p => p.id).join("-")}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductCatalogue() {
  const [activeCat,   setActiveCat]   = useState(categories[0].id);
  const [search,      setSearch]      = useState("");
  const [sortKey,     setSortKey]     = useState<SortKey>("popular");
  const [sameDayOnly, setSameDayOnly] = useState(false);

  const displayedProducts = useMemo(() => {
    let list = allProducts.filter((p) => p.categoryId === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sameDayOnly) list = list.filter((p) => p.isSameDay);
    switch (sortKey) {
      case "price-asc":  list = [...list].sort((a, b) => (a.basePrice ?? 999999) - (b.basePrice ?? 999999)); break;
      case "price-desc": list = [...list].sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0)); break;
      case "turnaround": list = [...list].sort((a) => (a.isSameDay ? -1 : 1)); break;
      default:           list = [...list].sort((a) => (a.isPopular ? -1 : 1));
    }
    return list;
  }, [activeCat, search, sortKey, sameDayOnly]);

  const activeCategory = categories.find((c) => c.id === activeCat)!;
  const globalSearch = search.trim().length > 0;
  const globalResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allProducts.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [search]);

  return (
    <section id="products" className="bg-white py-16 md:py-24 border-t border-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-black mb-2">Product catalogue</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-black">Print by category</h2>
            <p className="text-sm text-black mt-1">Professional printing · Delivered across all 47 counties</p>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex text-sm text-black hover:text-black transition-colors">
            View all products →
          </Link>
        </motion.div>

        {/* Search */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 text-base">🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products — business cards, mugs, banners, t-shirts…"
            className="w-full pl-10 pr-4 py-3 text-sm border border-black focus:border-black rounded-full outline-none text-black placeholder:text-black bg-brand-50 focus:bg-white transition-colors" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700 text-lg">✕</button>
          )}
        </motion.div>

        {globalSearch ? (
          <div>
            <p className="text-sm text-brand-600 mb-4">
              {globalResults.length} result{globalResults.length !== 1 ? "s" : ""} for &ldquo;<strong>{search}</strong>&rdquo;
            </p>
            {globalResults.length === 0 ? (
              <div className="py-16 text-center bg-brand-50 rounded-2xl">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-sm font-medium text-brand-700">No products found</p>
                <p className="text-xs text-brand-500 mt-1">Try a different search, or <a href="https://wa.me/254700000000" className="text-brand-600 underline">WhatsApp us</a> for custom items</p>
              </div>
            ) : (
              <ProductGrid products={globalResults} />
            )}
          </div>
        ) : (
          <>
            {/* Category tabs */}
            <motion.div
              className="flex gap-2 flex-wrap mb-6 pb-6 border-b border-brand-50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeCat === cat.id
                      ? "bg-brand-700 text-white border-brand-700"
                      : "bg-white text-brand-600 border-brand-100 hover:border-brand-300"
                  }`}
                >
                  <span>{categoryEmojis[cat.id]}</span>
                  {cat.name}
                  <span className={`text-[10px] rounded-full px-2 py-0.5 ${activeCat === cat.id ? "bg-brand-600 text-brand-200" : "bg-brand-50 text-brand-500"}`}>
                    {cat.productCount}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Filter row */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-brand-500">
                <span className="font-medium text-brand-800">{displayedProducts.length}</span> products
                {sameDayOnly ? " — same-day only" : ""} in{" "}
                <span className="font-medium text-brand-800">{activeCategory.name}</span>
              </p>
              <div className="flex gap-2 items-center">
                <motion.button
                  onClick={() => setSameDayOnly(!sameDayOnly)}
                  whileTap={{ scale: 0.95 }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all border ${
                    sameDayOnly ? "bg-emerald-600 text-white border-emerald-600" : "border-brand-100 text-brand-600 hover:border-brand-300"
                  }`}
                >⚡ Same-day only</motion.button>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="text-xs border border-brand-100 text-brand-600 rounded-full px-3 py-1.5 outline-none bg-white cursor-pointer hover:border-brand-300">
                  <option value="popular">Most popular</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="turnaround">Fastest turnaround</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {displayedProducts.length === 0 ? (
              <div className="py-12 text-center bg-brand-50 rounded-2xl">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-sm text-brand-600">No same-day products in this category</p>
                <button onClick={() => setSameDayOnly(false)} className="text-xs text-brand-600 underline mt-2">Show all products</button>
              </div>
            ) : (
              <ProductGrid products={displayedProducts} />
            )}
          </>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="text-sm text-brand-600 underline underline-offset-4">View all products →</Link>
        </div>
      </div>
    </section>
  );
}