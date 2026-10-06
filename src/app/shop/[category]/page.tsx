import { notFound }                                from "next/navigation";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/data";
import { heroImages }                              from "@/data/heroImages";
import type { Metadata }                           from "next";
import ProductCard                                 from "@/components/product/ProductCard";
import BannerSlideshow                             from "@/components/ui/BannerSlideshow";

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.name} | Angela`,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat      = getCategoryBySlug(category);
  if (!cat) notFound();

  const products = getProductsByCategory(cat.id);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="relative bg-brand-950 py-12">
        <BannerSlideshow images={heroImages[cat.id] ?? []} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <a href="/" className="text-white/70 hover:text-brand-400">Home</a>
            <span>›</span>
            <a href="/#products" className="text-white/70 hover:text-brand-400">Products</a>
            <span>›</span>
            <span className="text-brand-400">{cat.name}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-medium text-brand-300 mb-2">{cat.name}</h1>
          <p className="text-sm text-brand-600">{cat.description} · {products.length} products</p>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-brand-500">
            Showing <span className="font-medium text-brand-800">{products.length} products</span>
          </p>
          <div className="flex gap-2">
            <button className="text-xs border border-brand-100 hover:border-brand-300 text-brand-600 rounded-full px-3 py-1.5">
              ⚡ Same-day only
            </button>
            <select className="text-xs border border-brand-100 text-brand-600 rounded-full px-3 py-1.5 outline-none bg-white">
              <option>Most popular</option>
              <option>Price: Low to high</option>
              <option>Price: High to low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Other categories */}
      <div className="border-t border-brand-50 bg-brand-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-brand-700 mb-4">Browse other categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.id !== cat.id).map((c) => (
              <a
                key={c.id}
                href={`/shop/${c.slug}`}
                className="text-sm border border-brand-100 bg-white hover:border-brand-400 text-brand-600 hover:text-brand-800 px-4 py-2 rounded-full transition-colors"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

