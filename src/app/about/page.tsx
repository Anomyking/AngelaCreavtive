import Link from "next/link";
import type { Metadata } from "next";
import { Lightbulb, HandHeart, Users, Zap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Angela",
  description: "Established in 2010, Angela is a Nairobi-based signage, branding and print house serving corporates across Kenya. Our story, mission, vision and clients.",
};

const coreValues = [
  { icon: Lightbulb,   title: "Innovation & Creativity", desc: "Fresh thinking on every brief, not templated defaults." },
  { icon: HandHeart,   title: "Honesty",                 desc: "Straight quotes, straight timelines, no surprises." },
  { icon: Users,       title: "Loyalty",                 desc: "We grow when our clients grow — that's the whole point." },
  { icon: Zap,         title: "Efficiency",               desc: "Latest technology and processes, no wasted time." },
  { icon: ShieldCheck, title: "Reliability",              desc: "If we say it'll be ready, it'll be ready." },
];

const approach = [
  { title: "Promotional Items",     items: ["Corporate giveaways", "Executive gifts", "Keyrings", "Apparel & tech items", "Pens & drinkware", "Bags"] },
  { title: "Packaging",             items: ["Calendars", "Diaries", "Notebooks", "Customised gift hampers"] },
  { title: "Offset & Digital Print",items: ["Corporate stationery", "Posters & fliers", "Brochures & folders", "Gift cards", "Carrier bags"] },
  { title: "Publications",          items: ["Magazines", "Annual reports", "Text books", "Coffee table books", "Newsletters"] },
  { title: "POS Materials",         items: ["Banners", "Wobblers", "Shelf strips", "Danglers", "On-site branding"] },
  { title: "Z-Card",                items: ["Information guides", "Sales generators", "Maps & directories", "Product catalogues"] },
  { title: "Stationery Management", items: ["Printed & office stationery", "Consumables", "On-site facility service"] },
];

const clients = [
  "EABL", "Renault", "Hyundai", "Vivo Energy", "MacCoffee", "MacTea",
  "SafeCare Healthcare Standards", "PharmAccess Foundation",
  "Kenya Wildlife Conservancies Association", "RentCo", "Medical Credit Fund Africa",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero — brushed indigo-on-navy, echoes the brand deck cover */}
      <div
        className="relative overflow-hidden py-20"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 85% 20%, rgba(48,42,120,0.55), transparent 60%), linear-gradient(135deg, #051B39 0%, #030F22 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #F7F3EA 0px, #F7F3EA 2px, transparent 2px, transparent 14px)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-white">About us</span>
          </nav>

          <p className="text-xs font-medium tracking-widest uppercase text-white/60 mb-4">
            DESIGN · SIGNAGE · BRANDING · PRINTING · PROMOTIONAL MATERIALS · POS · DIGITAL MARKETING
          </p>

          <h1 className="leading-[0.95]">
            {["We", "make", "heads", "turn."].map((word) => (
              <span key={word} className="block border-l-4 border-white/50 pl-4 sm:pl-6 mb-1 text-4xl sm:text-6xl font-semibold text-white">
                {word}
              </span>
            ))}
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl mt-8">
            Since 2010, Angela has been Nairobi&apos;s home for bold signage, branding and print —
            for businesses that don&apos;t take chances with their image.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Our story</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Est. 2010</h2>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-brand-700 leading-relaxed mb-4">
              Angela Ltd was established in 2010 with a vision to make a difference in the
              branding, signage and promotional materials industry in Kenya. Since our first year of
              operation we&apos;ve maintained a healthy growth pattern, and we&apos;re working towards
              expanding our operations to cover the region while extending our product lines.
            </p>
            <p className="text-sm text-brand-700 leading-relaxed">
              Our team of dedicated print professionals, backed by the latest technology, ensures we
              deliver innovative, quality-driven solutions that keep pace with our clients&apos; growing
              business needs.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-brand-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-brand-100 rounded-2xl p-7">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-2">Mission</p>
            <h3 className="text-lg font-medium text-brand-950 mb-3">Grow your business, not just your print run</h3>
            <p className="text-sm text-brand-600 leading-relaxed">
              Committed to providing the best solutions in advertising and seeing growth in our
              clients&apos; businesses through a competent, focused and motivated team.
            </p>
          </div>
          <div className="bg-brand-950 rounded-2xl p-7">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-2">Vision</p>
            <h3 className="text-lg font-medium text-white mb-3">Quality that&apos;s never compromised</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Produce the best quality signage our clients can afford — where quality, creativity and
              time-to-market are never compromised. We highlight the long-term value of our products
              over acquisition cost, and stay ahead by bringing the latest technology, materials and
              processes to our market, our communities and our stakeholders.
            </p>
          </div>
        </div>
      </div>

      {/* Core values */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">What we stand for</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Core values</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {coreValues.map((v) => (
            <div key={v.title} className="bg-white border border-brand-100 rounded-2xl p-5 hover:border-brand-300 transition-colors">
              <v.icon size={20} className="text-brand-700 mb-3" />
              <p className="text-sm font-medium text-brand-950">{v.title}</p>
              <p className="text-xs text-brand-500 mt-1 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 360 approach */}
      <div className="bg-brand-950 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">One roof</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-white">Our 360° approach to print</h2>
            <p className="text-sm text-white/60 mt-3 max-w-xl mx-auto">
              We&apos;re a combined solution for commercial print, packaging, signage and promotional
              items — all produced under one roof in Nairobi.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approach.map((a) => (
              <div key={a.title} className="bg-brand-900/50 border border-brand-800 rounded-2xl p-5">
                <p className="text-sm font-medium text-white mb-3">{a.title}</p>
                <ul className="space-y-1.5">
                  {a.items.map((it) => (
                    <li key={it} className="text-xs text-brand-500 flex items-start gap-2">
                      <span className="text-brand-700 mt-0.5">·</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              href="/services/signage"
              className="flex flex-col justify-center items-start bg-brand-800 hover:bg-brand-700 border border-brand-700 rounded-2xl p-5 transition-colors group"
            >
              <p className="text-sm font-medium text-brand-300 mb-1">Signage & Branding</p>
              <p className="text-xs text-brand-500 leading-relaxed mb-3">3D LED, vehicle branding, neon, pylon signage & more</p>
              <span className="text-xs text-brand-400 group-hover:text-white transition-colors">See our signage work →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Clients */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Trusted by</p>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-950">Our clients</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {clients.map((c) => (
            <div key={c} className="flex items-center justify-center text-center bg-brand-50 border border-brand-100 rounded-xl px-4 py-6 hover:border-brand-300 transition-colors">
              <p className="text-sm font-medium text-brand-800">{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-brand-700 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl font-medium text-white mb-3">Ready to make your brand impossible to ignore?</h3>
          <p className="text-sm text-brand-100 mb-6">Tell us what you need and we&apos;ll quote you within an hour.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/quote" className="inline-flex items-center gap-2 bg-white hover:bg-brand-50 text-brand-800 text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Get a quote →
            </Link>
            <a href="https://wa.me/254727796104" className="inline-flex items-center gap-2 border border-brand-400 hover:border-white text-white text-sm px-6 py-3 rounded-full transition-colors">
              💬 WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
