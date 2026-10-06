import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { bundles } from "@/data";
import { formatPrice, discountPercent } from "@/lib/utils";

export async function generateStaticParams() {
  return bundles.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const bundle = bundles.find((b) => b.id === id);
  if (!bundle) return {};
  return {
    title: `${bundle.name} | Angela`,
    description: `${bundle.tagline}. ${bundle.items.join(", ")} for ${formatPrice(bundle.priceKES)}.`,
  };
}

const bundleEmojis: Record<string, string> = {
  hustler: "🌱", launch: "🚀", office: "🏢", team:    "👥", seller:  "🛍️",
};

export default async function BundlePage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bundle = bundles.find((b) => b.id === id);
  if (!bundle) notFound();

  const savings = bundle.originalPriceKES - bundle.priceKES;
  const otherBundles = bundles.filter((b) => b.id !== bundle.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-brand-950 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
            <span>›</span>
            <Link href="/#bundles" className="text-white/70 hover:text-brand-400">Bundles</Link>
            <span>›</span>
            <span className="text-brand-400">{bundle.name}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-brand-800 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              {bundleEmojis[bundle.id] ?? "🎁"}
            </div>
            <div className="flex-1">
              {bundle.isPopular && (
                <span className="inline-flex bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                  ⭐ Most popular pack
                </span>
              )}
              <h1 className="text-3xl font-medium text-brand-300">{bundle.name}</h1>
              <p className="text-sm text-brand-500 mt-2">{bundle.tagline}</p>
              <p className="text-xs text-brand-600 mt-1">For {bundle.targetAudience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: what's included */}
          <div className="lg:col-span-3 space-y-6">
            <section>
              <h2 className="text-lg font-medium text-brand-950 mb-4">What&apos;s included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bundle.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
                    <span className="text-brand-500 mt-0.5">✓</span>
                    <span className="text-sm text-brand-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-sm font-medium text-amber-800 mb-2">🎨 Free design support</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Don&apos;t have artwork yet? Our team will design everything in this pack for you —
                3 revisions included at no extra cost. Just request a quote.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-medium text-brand-900 mb-3">Why this bundle?</h3>
              <p className="text-sm text-brand-600 leading-relaxed">
                Save <strong>{formatPrice(savings)}</strong> ({discountPercent(bundle.originalPriceKES, bundle.priceKES)}% off)
                compared to ordering each item separately. Perfect for {bundle.targetAudience.toLowerCase()} who want professional branding without breaking the bank.
              </p>
            </section>

            <section className="border-t border-brand-100 pt-6">
              <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Other bundles you might like</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {otherBundles.map((b) => (
                  <Link key={b.id} href={`/bundles/${b.id}`}
                    className="bg-brand-50 hover:bg-brand-100 border border-brand-100 hover:border-brand-300 rounded-xl p-3 transition-colors">
                    <p className="text-xl mb-1">{bundleEmojis[b.id] ?? "🎁"}</p>
                    <p className="text-xs font-medium text-brand-900">{b.name}</p>
                    <p className="text-[10px] text-brand-500 mt-1">{formatPrice(b.priceKES)}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right: order panel (sticky) */}
          <div className="lg:col-span-2">
            <div className="bg-brand-950 rounded-2xl p-6 lg:sticky lg:top-24">
              <p className="text-xs text-brand-600 mb-1">Bundle price</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-medium text-brand-300">{formatPrice(bundle.priceKES)}</span>
                <span className="text-sm line-through text-brand-700">{formatPrice(bundle.originalPriceKES)}</span>
              </div>
              <span className="inline-flex bg-emerald-900/30 border border-emerald-700/50 text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full mb-5">
                Save {formatPrice(savings)} · {discountPercent(bundle.originalPriceKES, bundle.priceKES)}% off
              </span>

              <div className="space-y-3 mb-5 text-xs">
                <p className="flex items-center gap-2 text-brand-500">
                  <span className="text-brand-400">✓</span> Free design support · 3 revisions
                </p>
                <p className="flex items-center gap-2 text-brand-500">
                  <span className="text-brand-400">✓</span> Free delivery (Nairobi)
                </p>
                <p className="flex items-center gap-2 text-brand-500">
                  <span className="text-brand-400">✓</span> Reprint guarantee
                </p>
                <p className="flex items-center gap-2 text-brand-500">
                  <span className="text-brand-400">✓</span> Ready in 3–5 business days
                </p>
              </div>

              <Link
                href={`/quote?bundle=${bundle.id}`}
                className="block w-full text-center bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium py-3.5 rounded-full mb-2 transition-colors"
              >
                Order this pack →
              </Link>

              <a
                href={`https://wa.me/254700000000?text=Hi, I'd like to order the ${bundle.name} (${formatPrice(bundle.priceKES)})`}
                target="_blank" rel="noopener noreferrer"
                className="block w-full text-center border border-brand-800 hover:border-brand-700 text-brand-400 text-sm py-3 rounded-full transition-colors"
              >
                💬 Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}