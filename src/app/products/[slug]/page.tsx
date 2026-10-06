import { notFound } from "next/navigation";
import { products, categories, getProductBySlug, getProductsByCategory, formatPrice } from "@/data";
import type { Metadata } from "next";
import ProductClient from "@/components/product/ProductClient";
import ProductCard   from "@/components/product/ProductCard";
import StructuredData from "@/components/ui/StructuredData";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://angela.co.ke";

// Tell Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Dynamic SEO metadata per product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const url      = `${BASE_URL}/products/${product.slug}`;
  const imageUrl = `${BASE_URL}/images/products/${product.id}.jpg`;
  const priceStr = product.basePrice ? ` From ${formatPrice(product.basePrice)}.` : "";
  const desc     = `${product.description}${priceStr} ${product.isSameDay ? "Same-day printing available." : ""} Order online or get a quote from Angela Nairobi.`;

  return {
    title:       product.name,
    description: desc,
    keywords:    [product.name.toLowerCase(), `${product.name.toLowerCase()} nairobi`, `${product.name.toLowerCase()} kenya`, "printing nairobi"],
    alternates:  { canonical: `/products/${product.slug}` },
    openGraph: {
      title:       `${product.name} | Angela Nairobi`,
      description: desc,
      url,
      images:      [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
      type:        "website",
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${product.name} | Angela`,
      description: desc,
      images:      [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product  = getProductBySlug(slug);
  if (!product) notFound();

  const category      = categories.find((c) => c.id === product.categoryId);
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      <StructuredData product={{
        name:        product.name,
        description: product.description,
        image:       `${BASE_URL}/images/products/${product.id}.jpg`,
        price:       product.basePrice,
        sku:         product.id,
        url:         `${BASE_URL}/products/${product.slug}`,
      }} />
      {/* Breadcrumb */}
      <div className="border-b border-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-brand-400">
            <a href="/" className="hover:text-brand-700 transition-colors">Home</a>
            <span>›</span>
            <a href="/#products" className="hover:text-brand-700 transition-colors">Products</a>
            <span>›</span>
            {category && (
              <>
                <a href={`/shop/${category.slug}`} className="hover:text-brand-700 transition-colors">{category.name}</a>
                <span>›</span>
              </>
            )}
            <span className="text-brand-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductClient product={product} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-brand-50 bg-brand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-lg font-medium text-brand-950 mb-6">
              More from{" "}
              <span className="text-brand-700">{category?.name}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

