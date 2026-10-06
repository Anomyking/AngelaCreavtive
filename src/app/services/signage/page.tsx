import Link from "next/link";
import type { Metadata } from "next";
import { heroImages } from "@/data/heroImages";
import BannerSlideshow from "@/components/ui/BannerSlideshow";

export const metadata: Metadata = {
  title: "Signage & Branding | Angela",
  description: "3D LED signage, vehicle branding, neon signs, pylon signage and more — designed, fabricated and installed in Nairobi by Angela.",
};

const signageTypes = [
  { title: "Safety signage",           desc: "Wayfinding, fire exit & compliance signs",        emoji: "🧯" },
  { title: "Building signage",         desc: "Hotels, offices & storefronts",                    emoji: "🏢" },
  { title: "3D LED signage",           desc: "Illuminated letters that stand out day or night",  emoji: "💡" },
  { title: "Vehicle branding",         desc: "Full wraps for cars, vans & delivery fleets",       emoji: "🚚" },
  { title: "Window branding",          desc: "Vinyl graphics for storefront glass",               emoji: "🪟" },
  { title: "Pylon signage",            desc: "Tall roadside signs for visibility from a distance",emoji: "🛣️" },
  { title: "Internal displays branding", desc: "In-store fixtures, counters & displays",          emoji: "🏬" },
  { title: "Floor graphics",           desc: "Directional & promotional floor decals",            emoji: "👣" },
  { title: "Neon signs",               desc: "Custom LED-neon for a modern glow",                 emoji: "✨" },
  { title: "General engraving",        desc: "Laser-engraved plaques, awards & door plates",      emoji: "🔧" },
];

const process = [
  { step: "01", title: "Brief & site visit",       desc: "We assess the space, substrate and any regulatory requirements before quoting" },
  { step: "02", title: "Design & mock-up",          desc: "Render designs help evaluate size, material, dimensions, colour and layout before we fabricate anything" },
  { step: "03", title: "Fabrication",                desc: "Produced in-house using our own fabrication technology — laser engraving, 3D letters, LED, print" },
  { step: "04", title: "Installation",               desc: "Our team installs on-site across Nairobi and beyond" },
  { step: "05", title: "Maintenance",                desc: "Ongoing servicing so your signage keeps looking sharp" },
];

const useCases = [
  {
    name: "Small business signage",
    sub: "Storefronts, shop signs & door plates",
    items: ["Illuminated or non-illuminated shop signs", "Window branding", "Door plates", "Safety signage"],
    href: "/quote?service=signage&type=small-business",
  },
  {
    name: "Retail & POS branding",
    sub: "In-store fixtures that sell",
    items: ["Internal displays & counters", "Floor graphics", "Wobblers, danglers & shelf strips", "Banners"],
    href: "/quote?service=signage&type=retail-pos",
    badge: "Popular",
  },
  {
    name: "Corporate & fleet branding",
    sub: "Vehicles, pylons & building signage",
    items: ["Full & partial vehicle wraps", "Pylon signage", "3D LED building signage", "Multi-site rollouts"],
    href: "/quote?service=signage&type=corporate-fleet",
  },
];

export default function SignageServicePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative bg-brand-950 py-16">
        <BannerSlideshow images={heroImages["signage"]} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
            <span>›</span>
            <span className="text-brand-400">Signage & branding</span>
          </nav>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-brand-800 text-brand-400 text-[10px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Nairobi&apos;s signage manufacturer
              </span>
              <h1 className="text-3xl sm:text-4xl font-medium text-brand-300 leading-tight mb-4">
                We make heads turn
              </h1>
              <p className="text-sm text-brand-500 leading-relaxed mb-6">
                From a single door plate to a full delivery fleet wrap, we design, fabricate and install
                signage that makes companies impossible to ignore. It&apos;s the companies that don&apos;t
                take chances with their image that stand out.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/quote?service=signage" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
                  Get a signage quote →
                </Link>
                <a href="https://wa.me/254727796104?text=Hi, I'd like to ask about signage & branding"
                  className="inline-flex items-center gap-2 border border-brand-800 hover:border-brand-700 text-brand-500 hover:text-brand-400 text-sm px-6 py-3 rounded-full transition-colors">
                  💬 Chat with our team
                </a>
              </div>
            </div>
            <div className="bg-brand-900/50 border border-brand-800 rounded-2xl p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-brand-600 mb-4">Why our signage</p>
              <div className="space-y-3">
                {[
                  ["✓", "In-house design, fabrication & installation"],
                  ["✓", "Laser engraving & 3D LED capability"],
                  ["✓", "Trusted by EABL, Renault, Hyundai & Vivo Energy"],
                  ["✓", "Mock-ups & renders before we fabricate anything"],
                  ["✓", "Since 2010 — a decade of signage across Nairobi"],
                ].map(([icon, text]) => (
                  <p key={text} className="flex items-start gap-2.5 text-sm text-brand-400">
                    <span className="text-emerald-400 mt-0.5">{icon}</span> {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signage types */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">All kinds of signage</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Every way your brand shows up in the real world</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {signageTypes.map((s) => (
            <div key={s.title} className="bg-white border border-brand-100 rounded-xl p-4 hover:border-brand-300 transition-colors">
              <p className="text-2xl mb-2">{s.emoji}</p>
              <p className="text-sm font-medium text-brand-900">{s.title}</p>
              <p className="text-xs text-brand-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle branding spotlight */}
      <div className="bg-brand-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Vehicle branding</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-brand-950 mb-4">Turn your fleet into a moving billboard</h2>
            <p className="text-sm text-brand-600 leading-relaxed mb-4">
              From a single company car to a full delivery fleet, we design and apply vehicle wraps that
              hold up outdoors and travel your brand across the city. We handle single-vehicle jobs and
              multi-vehicle rollouts with consistent branding across every unit.
            </p>
            <Link href="/quote?service=signage&type=vehicle-branding" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Quote a vehicle wrap →
            </Link>
          </div>
          <div className="bg-brand-950 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">🚛</p>
            <p className="text-sm text-white/70 leading-relaxed">
              Cars · Vans · Trucks · Delivery fleets<br />Full wraps, partial wraps & window decals
            </p>
          </div>
        </div>
      </div>

      {/* Use cases / packages */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Get started</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Tell us what kind of signage you need</h2>
          <p className="text-sm text-brand-500 mt-3">Every job is quoted individually — send us the details and we&apos;ll come back within an hour.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {useCases.map((u) => (
            <div key={u.name} className={`relative bg-white border rounded-2xl p-6 ${u.badge ? "border-brand-400 ring-2 ring-brand-400" : "border-brand-100"}`}>
              {u.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-700 text-white text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest">
                  {u.badge}
                </span>
              )}
              <h3 className="text-base font-medium text-brand-950 mb-1">{u.name}</h3>
              <p className="text-xs text-brand-500 mb-4">{u.sub}</p>
              <ul className="space-y-2 mb-5">
                {u.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-brand-600">
                    <span className="text-brand-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href={u.href} className="block w-full text-center text-sm font-medium bg-brand-700 hover:bg-brand-600 text-white py-2.5 rounded-full transition-colors">
                Get a quote →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="bg-brand-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">From brief to installation</h2>
          </div>
          <div className="space-y-4">
            {process.map((p) => (
              <div key={p.step} className="flex gap-4 bg-white border border-brand-100 rounded-2xl p-5">
                <span className="text-xs font-mono text-brand-400 shrink-0">{p.step}</span>
                <div>
                  <p className="text-sm font-medium text-brand-900">{p.title}</p>
                  <p className="text-xs text-brand-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl font-medium text-brand-300 mb-3">Ready to get noticed?</h3>
          <p className="text-sm text-brand-500 mb-6">Tell us what you need and we&apos;ll quote you within an hour.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/quote?service=signage" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Get a quote →
            </Link>
            <a href="https://wa.me/254727796104" className="inline-flex items-center gap-2 border border-brand-800 hover:border-brand-700 text-brand-500 hover:text-brand-400 text-sm px-6 py-3 rounded-full transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
