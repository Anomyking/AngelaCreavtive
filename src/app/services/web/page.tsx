import Link from "next/link";
import type { Metadata } from "next";
import { heroImages } from "@/data/heroImages";
import BannerSlideshow from "@/components/ui/BannerSlideshow";

export const metadata: Metadata = {
  title: "Web Design & Development | Angela",
  description: "Custom websites for Kenyan businesses — fast, mobile-friendly, M-Pesa ready, and built to convert. From simple landing pages to full e-commerce stores.",
};

const packages = [
  {
    name:       "Landing Page",
    price:      "From KES 25,000",
    sub:        "Single-page site, 5-7 days",
    color:      "border-brand-100",
    items:      ["1-page custom design", "Mobile responsive", "Contact form to WhatsApp/email", "Domain setup (.co.ke)", "SEO basics & meta tags", "Hosting setup (1st year free)"],
    cta:        "Book a landing page",
    href:       "/quote?service=web&type=landing",
  },
  {
    name:       "Business Website",
    price:      "From KES 65,000",
    sub:        "5-10 pages, 2-3 weeks",
    color:      "border-brand-400 ring-2 ring-brand-400",
    badge:      "Most chosen",
    items:      ["Up to 10 custom pages", "Blog or news section", "Service & pricing pages", "Lead capture forms", "Google Analytics + Search Console", "Mobile + tablet optimized", "1 month free support", "Hosting + SSL (1st year free)"],
    cta:        "Build my site",
    href:       "/quote?service=web&type=business",
  },
  {
    name:       "E-commerce Store",
    price:      "From KES 140,000",
    sub:        "Online shop, 3-5 weeks",
    color:      "border-brand-100",
    items:      ["Product catalogue (unlimited items)", "M-Pesa STK + card payments", "Order management dashboard", "Stock tracking", "Customer accounts & wishlists", "Email order notifications", "WhatsApp checkout option", "Admin training included"],
    cta:        "Sell online",
    href:       "/quote?service=web&type=ecommerce",
  },
];

const services = [
  { title: "Landing pages",         desc: "High-converting single pages for campaigns",         emoji: "🎯" },
  { title: "Business websites",     desc: "Multi-page sites with your services & contact",     emoji: "🏢" },
  { title: "E-commerce shops",      desc: "M-Pesa-ready online stores like this one",          emoji: "🛒" },
  { title: "Booking systems",       desc: "Salons, clinics, restaurants — let clients book",   emoji: "📅" },
  { title: "Portfolio sites",       desc: "Photographers, designers, freelancers",             emoji: "📷" },
  { title: "Restaurant menus",      desc: "Interactive menus with WhatsApp ordering",          emoji: "🍽️" },
  { title: "Property listings",     desc: "Real estate sites with filters & maps",             emoji: "🏠" },
  { title: "Custom dashboards",     desc: "Internal tools to track your business",             emoji: "📊" },
];

const tech = [
  { name: "Next.js",     desc: "Same framework Vercel, Walmart, TikTok use" },
  { name: "M-Pesa",      desc: "Direct STK push integration via IntaSend" },
  { name: "Cloudflare",  desc: "Fast loading anywhere in Africa" },
  { name: "Vercel",      desc: "99.99% uptime, never goes down" },
];

const process = [
  { step: "01", title: "Strategy call",     desc: "30-min Zoom or in-studio chat. We learn your business and define the goal" },
  { step: "02", title: "Design mockup",     desc: "We send a Figma design within 5-7 days. You see exactly what you'll get" },
  { step: "03", title: "Build it out",      desc: "Once approved, we code the site. Daily progress updates via WhatsApp" },
  { step: "04", title: "You test & approve", desc: "We hand over a staging URL. You click everything and request tweaks" },
  { step: "05", title: "Launch + handover", desc: "Site goes live. We train you on managing content. 30 days free support" },
];

const faqs = [
  { q: "Do you handle hosting?",       a: "Yes — we set up hosting, SSL, and your domain. First year is included free. After that ~KES 3,500/year for typical sites." },
  { q: "Can I edit the site myself?", a: "Yes. We build sites with a simple content editor. Add blog posts, change prices, update photos — no code needed." },
  { q: "What about ongoing support?", a: "Monthly support plans from KES 5,000/month cover updates, fixes, content changes, and analytics reports." },
  { q: "Do you do redesigns?",         a: "Absolutely. If your current site is dated, we'll modernize it without changing your domain or losing SEO." },
];

export default function WebServicePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative bg-brand-950 py-16">
        <BannerSlideshow images={heroImages["web-design"]} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
            <span>›</span>
            <span className="text-brand-400">Web design</span>
          </nav>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-brand-800 text-brand-400 text-[10px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                New service · taking bookings
              </span>
              <h1 className="text-3xl sm:text-4xl font-medium text-brand-300 leading-tight mb-4">
                Websites built for{" "}
                <span className="bg-brand-800 text-brand-400 px-2 py-0.5 rounded-lg">Kenyan businesses</span>
              </h1>
              <p className="text-sm text-brand-500 leading-relaxed mb-6">
                Fast, mobile-first websites that load in under 2 seconds on Safaricom. M-Pesa built in.
                Designed by people who understand the local market — because we&apos;re from here too.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/quote?service=web" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
                  Start your project →
                </Link>
                <a href="https://wa.me/254700000000?text=Hi, I'd like to discuss a web design project"
                  className="inline-flex items-center gap-2 border border-brand-800 hover:border-brand-700 text-brand-500 hover:text-brand-400 text-sm px-6 py-3 rounded-full transition-colors">
                  💬 Book a call
                </a>
              </div>
            </div>
            <div className="bg-brand-900/50 border border-brand-800 rounded-2xl p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-brand-600 mb-4">What you get</p>
              <div className="space-y-3">
                {[
                  ["⚡", "Loads in under 2 seconds"],
                  ["📱", "Mobile-first design (most KE traffic)"],
                  ["💳", "M-Pesa & card payment integration"],
                  ["🇰🇪", ".co.ke domain set up for you"],
                  ["🔒", "Free SSL & daily backups"],
                  ["🎯", "Built for Google search ranking"],
                ].map(([icon, text]) => (
                  <p key={text} className="flex items-start gap-2.5 text-sm text-brand-400">
                    <span className="text-base mt-0.5">{icon}</span> {text}
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
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Pick the size that fits</h2>
          <p className="text-sm text-brand-500 mt-3">All prices include design, build, hosting (1 year), and domain setup.</p>
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
        <p className="text-center text-xs text-brand-400 mt-6">
          Need something custom? <a href="https://wa.me/254700000000" className="text-brand-600 hover:underline">WhatsApp us</a> for a tailored quote.
        </p>
      </div>

      {/* What we build */}
      <div className="bg-brand-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">What we build</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">From simple sites to complex platforms</h2>
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
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">From idea to launch in 5 steps</h2>
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

      {/* Stack */}
      <div className="bg-brand-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-4 text-center">Built with proven tech</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tech.map((t) => (
              <div key={t.name} className="bg-white border border-brand-100 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-brand-900">{t.name}</p>
                <p className="text-[10px] text-brand-500 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Common questions</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Things people ask us</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="bg-white border border-brand-100 rounded-2xl px-5 py-4 group">
              <summary className="text-sm font-medium text-brand-950 cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-brand-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-xs text-brand-500 mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl font-medium text-brand-300 mb-3">Let&apos;s build your site</h3>
          <p className="text-sm text-brand-500 mb-6">Free strategy call. No pressure. We&apos;ll tell you honestly if we&apos;re a fit.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/quote?service=web" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Book a call →
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

