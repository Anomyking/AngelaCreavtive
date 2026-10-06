import type { Metadata } from "next";
import Link from "next/link";
import { products, categories } from "@/data";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "All products | Angela",
  description: `Browse all ${products.length} printing products at Angela — business cards, banners, branded apparel, packaging, gifts and more.`,
};

// Simple scoring: prioritize name matches over description/category matches
function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/);

  const scored = products
    .map((p) => {
      const hay = `${p.name} ${p.description} ${p.categoryId}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (p.name.toLowerCase().includes(t))        score += 10;
        if (p.description.toLowerCase().includes(t)) score += 3;
        if (p.categoryId.toLowerCase().includes(t))  score += 5;
        if (!hay.includes(t)) return null; // every term must match somewhere
      }
      return { product: p, score };
    })
    .filter((x): x is { product: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.product);
}

export default async function ShopIndexPage({
  searchParams,
}: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim();
  const matches = query ? searchProducts(query) : null;

  // SEARCH MODE — show filtered results
  if (query !== undefined && query !== "") {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-brand-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
              <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
              <span>›</span>
              <Link href="/shop" className="text-white/70 hover:text-brand-400">All products</Link>
              <span>›</span>
              <span className="text-brand-400">Search</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-medium text-brand-300 mb-2">
              {(matches?.length ?? 0) > 0
                ? `${matches!.length} result${matches!.length === 1 ? "" : "s"} for "${query}"`
                : `No matches for "${query}"`}
            </h1>
            <p className="text-sm text-brand-600">
              <Link href="/shop" className="text-brand-600 hover:text-brand-300 underline underline-offset-2">← Clear search</Link>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {matches && matches.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {matches.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4 opacity-60">🔍</p>
              <h2 className="text-lg font-medium text-brand-800 mb-2">Nothing matched your search</h2>
              <p className="text-sm text-brand-500 mb-8 max-w-md mx-auto">
                Try a different keyword, or request a custom quote — we can probably print whatever you need.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/shop" className="inline-flex bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full">
                  Browse all products →
                </Link>
                <Link href="/quote" className="inline-flex border border-brand-100 hover:border-brand-400 text-brand-700 text-sm px-5 py-2.5 rounded-full">
                  Get a custom quote
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // BROWSE MODE — show all products grouped by category
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
            <span>›</span>
            <span className="text-brand-400">All products</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-medium text-brand-300 mb-2">All products</h1>
          <p className="text-sm text-brand-600">{products.length} products across {categories.length} categories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <a key={c.id} href={`#${c.slug}`}
              className="text-xs border border-brand-100 hover:border-brand-400 text-brand-600 hover:text-brand-800 px-4 py-2 rounded-full transition-colors">
              {c.name} ({c.productCount})
            </a>
          ))}
        </div>

        {categories.map((cat) => {
          const items = products.filter((p) => p.categoryId === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} id={cat.slug} className="mb-12 scroll-mt-24">
              <div className="flex items-end justify-between mb-4 pb-2 border-b border-brand-50">
                <div>
                  <h2 className="text-lg font-medium text-brand-950">{cat.name}</h2>
                  <p className="text-xs text-brand-500 mt-0.5">{cat.description}</p>
                </div>
                <Link href={`/shop/${cat.slug}`} className="text-xs text-brand-600 hover:text-brand-800">
                  View category →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

