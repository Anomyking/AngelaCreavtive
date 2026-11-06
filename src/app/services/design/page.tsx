import Link from "next/link";
import type { Metadata } from "next";
import { heroImages } from "@/data/heroImages";
import BannerSlideshow from "@/components/ui/BannerSlideshow";

export const metadata: Metadata = {
  title: "Graphic Design Service | Angela",
  description: "Professional graphic design for logos, business cards, branding, social media graphics, and marketing materials — done by Nairobi-based designers.",
};

const packages = [
  {
    name:       "Quick Design",
    price:      "From KES 1,500",
    sub:        "Single asset, 24-48 hr turnaround",
    color:      "border-brand-100",
    items:      ["1 design concept", "2 revision rounds", "Final files in PDF + PNG", "Print-ready output", "WhatsApp delivery"],
    cta:        "Quick fix",
    href:       "/quote?service=design&type=quick",
  },
  {
    name:       "Brand Identity",
    price:      "From KES 12,000",
    sub:        "Complete branding package",
    color:      "border-brand-400 ring-2 ring-brand-400",
    badge:      "Most chosen",
    items:      ["Logo design (3 concepts)", "Brand colours & fonts", "Business card design", "Letterhead + invoice template", "Brand guideline PDF", "Source files (AI, PSD)", "Unlimited revisions for 14 days"],
    cta:        "Brand me",
    href:       "/quote?service=design&type=brand",
  },
  {
    name:       "Marketing Pack",
    price:      "From KES 6,500",
    sub:        "Social media + ads",
    color:      "border-brand-100",
    items:      ["10 social media post designs", "Story templates (IG + WhatsApp)", "Cover image (FB/LinkedIn)", "Editable templates in Canva", "3 revision rounds", "Optimized for each platform"],
    cta:        "Marketing pack",
    href:       "/quote?service=design&type=marketing",
  },
];

const services = [
  { title: "Logo design",          desc: "Memorable marks that grow with your business",   emoji: "✨" },
  { title: "Business cards",       desc: "Designs print-ready for our same-day production", emoji: "💳" },
  { title: "Flyers & posters",     desc: "Event marketing that gets attention",             emoji: "📋" },
  { title: "Social media",         desc: "Instagram, FB, LinkedIn — branded & consistent", emoji: "📱" },
  { title: "Packaging design",     desc: "Boxes, labels, bags that customers remember",     emoji: "📦" },
  { title: "Menu & catalogue",     desc: "Restaurants, salons, retailers — looks pro",      emoji: "📖" },
  { title: "Event materials",      desc: "Programs, invitations, save-the-dates",            emoji: "💌" },
  { title: "Apparel graphics",     desc: "T-shirt prints, embroidery files, uniform marks",  emoji: "👕" },
];

const process = [
  { step: "01", title: "Tell us what you need",  desc: "Brief us via the form, WhatsApp, or in-studio — share inspiration if you have any" },
  { step: "02", title: "Pay 50% to start",        desc: "Arranged with our team (M-Pesa or bank transfer). Balance due on approval. Refundable if we can't deliver" },
  { step: "03", title: "Review the first draft", desc: "We send 1-3 design directions within the timeline. You pick one to refine" },
  { step: "04", title: "Revisions until you love it", desc: "Free revisions within scope. Quick edits in hours, not days" },
  { step: "05", title: "Get your files",          desc: "All formats delivered: print-ready PDFs, social PNGs, source files if package includes them" },
];

export default function DesignServicePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative bg-brand-950 py-16">
        <BannerSlideshow images={heroImages["graphic-design"]} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
            <span>›</span>
            <span className="text-brand-400">Graphic design</span>
          </nav>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-brand-800 text-brand-400 text-[10px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Open for bookings
              </span>
              <h1 className="text-3xl sm:text-4xl font-medium text-brand-300 leading-tight mb-4">
                Design that prints beautifully —{" "}
                <span className="bg-brand-800 text-brand-400 px-2 py-0.5 rounded-lg">because we print it ourselves</span>
              </h1>
              <p className="text-sm text-brand-500 leading-relaxed mb-6">
                Most agencies design for screen, then your printer says &quot;this won&apos;t print well.&quot; Not us.
                Our designers know exactly how their files will print, because they walk over to our press
                and check.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/quote?service=design" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
                  Start a project →
                </Link>
                <a href="https://wa.me/254700000000?text=Hi, I'd like to discuss a graphic design project"
                  className="inline-flex items-center gap-2 border border-brand-800 hover:border-brand-700 text-brand-500 hover:text-brand-400 text-sm px-6 py-3 rounded-full transition-colors">
                  💬 Chat with a designer
                </a>
              </div>
            </div>
            <div className="bg-brand-900/50 border border-brand-800 rounded-2xl p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-brand-600 mb-4">Why our design</p>
              <div className="space-y-3">
                {[
                  ["✓", "Print-ready files, every time"],
                  ["✓", "Local studio — meet your designer"],
                  ["✓", "Free re-design within 14 days"],
                  ["✓", "M-Pesa friendly pricing"],
                  ["✓", "Source files included on most packages"],
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

      {/* Packages */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Packages</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Pick what fits your project</h2>
          <p className="text-sm text-brand-500 mt-3">Custom scope? Just ask — we&apos;ll quote you in an hour.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.name} className={`relative bg-white border rounded-2xl p-6 ${pkg.color}`}>
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-700 text-white text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest">
                  {pkg.badge}
                </span>
              )}
              <h3 className="text-base font-medium text-brand-950 mb-1">{pkg.name}</h3>
              <p className="text-xs text-brand-500 mb-3">{pkg.sub}</p>
              <p className="text-2xl font-medium text-brand-900 mb-5">{pkg.price}</p>
              <ul className="space-y-2 mb-5">
                {pkg.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-brand-600">
                    <span className="text-brand-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href={pkg.href} className="block w-full text-center text-sm font-medium bg-brand-700 hover:bg-brand-600 text-white py-2.5 rounded-full transition-colors">
                {pkg.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* What we design */}
      <div className="bg-brand-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">What we design</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Everything visual for your business</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.map((s) => (
              <div key={s.title} className="bg-white border border-brand-100 rounded-xl p-4 hover:border-brand-300 transition-colors">
                <p className="text-2xl mb-2">{s.emoji}</p>
                <p className="text-sm font-medium text-brand-900">{s.title}</p>
                <p className="text-xs text-brand-500 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">From brief to brand in 5 steps</h2>
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

      {/* Bottom CTA */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl font-medium text-brand-300 mb-3">Ready to start?</h3>
          <p className="text-sm text-brand-500 mb-6">Tell us what you need and we&apos;ll quote you within an hour.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/quote?service=design" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Get a quote →
            </Link>
            <a href="https://wa.me/254700000000" className="inline-flex items-center gap-2 border border-brand-800 hover:border-brand-700 text-brand-500 hover:text-brand-400 text-sm px-6 py-3 rounded-full transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

