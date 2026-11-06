import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turnaround Times | Angela",
  description: "How long Angela orders take — same-day printing, standard turnaround, bulk timelines, and rush requests across all 47 Kenyan counties.",
};

const standardItems = [
  { name: "Business cards",          fast: "Same day",        std: "1 business day"  },
  { name: "Flyers & leaflets",       fast: "Same day",        std: "1 business day"  },
  { name: "Letterheads",             fast: "Same day",        std: "1 business day"  },
  { name: "Envelopes",               fast: "Same day",        std: "1 business day"  },
  { name: "Posters (A3-A1)",         fast: "Same day",        std: "1 business day"  },
  { name: "Rubber stamps",           fast: "Same day",        std: "1 business day"  },
  { name: "Roll-up banners",         fast: "1 business day",  std: "2 business days" },
  { name: "Vinyl banners",           fast: "1 business day",  std: "2 business days" },
  { name: "Branded apparel",         fast: "2 business days", std: "3-5 business days" },
  { name: "Embroidery",              fast: "3 business days", std: "5 business days" },
  { name: "Mugs & flasks",           fast: "1 business day",  std: "2-3 business days" },
  { name: "Notebooks & diaries",     fast: "2 business days", std: "3-5 business days" },
  { name: "Packaging boxes",         fast: "3 business days", std: "5-7 business days" },
  { name: "Stickers & labels",       fast: "1 business day",  std: "2 business days" },
  { name: "Canvas prints",           fast: "2 business days", std: "3 business days" },
  { name: "Wedding cards",           fast: "2 business days", std: "3-5 business days" },
];

const sameDayChecklist = [
  { check: "Order placed before 12 PM", important: true },
  { check: "Payment confirmed with our team", important: true },
  { check: "Print-ready artwork submitted with order", important: true },
  { check: "Standard product (not custom size or special finish)", important: false },
  { check: "Collection from Westlands studio (vs delivery)", important: false },
];

const delivery = [
  { zone: "Studio collection",  area: "Westlands, Nairobi",                 time: "From 5 PM same day", price: "Free" },
  { zone: "Nairobi delivery",   area: "Within 25km of CBD",                  time: "Within 2-4 hours", price: "KES 450 · Free over KES 7,000" },
  { zone: "Nairobi metro",      area: "Kiambu, Ruiru, Athi River, Ngong",   time: "Same day or next day", price: "KES 650 · Free over KES 7,000" },
  { zone: "Major cities",       area: "Mombasa, Kisumu, Nakuru, Eldoret",   time: "1-2 business days",   price: "KES 850" },
  { zone: "Nationwide",         area: "All other counties",                   time: "2-4 business days",   price: "KES 850 · Free over KES 7,000" },
];

export default function TurnaroundPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link href="/" className="text-white/70 hover:text-brand-400">Home</Link>
            <span>›</span>
            <span className="text-brand-400">Turnaround times</span>
          </nav>
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">How fast?</p>
          <h1 className="text-3xl sm:text-4xl font-medium text-brand-300 leading-tight mb-3">
            Turnaround times that actually mean something
          </h1>
          <p className="text-sm text-brand-500 max-w-2xl">
            We hate vague delivery promises. Here&apos;s exactly how long each product takes — from order to your hands.
            We clock production from the moment payment clears and your artwork is approved.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-brand-50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { stat: "Same day",      label: "Order before 12 PM" },
            { stat: "1-2 days",       label: "Standard turnaround" },
            { stat: "Free",           label: "Delivery over KES 7,000" },
            { stat: "47 counties",    label: "Nationwide coverage" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-brand-100 rounded-2xl p-5 text-center">
              <p className="text-xl sm:text-2xl font-medium text-brand-900">{s.stat}</p>
              <p className="text-xs text-brand-500 mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Same-day promise */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-7 sm:p-10 text-brand-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-medium uppercase tracking-widest rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Available now
              </span>
              <h2 className="text-2xl font-medium text-white mb-3">Same-day printing</h2>
              <p className="text-sm text-brand-300 leading-relaxed mb-5">
                Order before <strong className="text-white">12 PM</strong>, collect by <strong className="text-white">5 PM</strong>.
                Works for business cards, flyers, letterheads, stamps, and posters when artwork is print-ready.
              </p>
              <Link href="/services/same-day"
                className="inline-flex bg-white hover:bg-brand-100 text-brand-900 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
                Order same-day →
              </Link>
            </div>
            <div className="bg-brand-950/40 border border-brand-700 rounded-xl p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-3">All these must be true</p>
              <ul className="space-y-2.5">
                {sameDayChecklist.map((item, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-sm ${item.important ? "text-white/90" : "text-white/50"}`}>
                    <span className={`mt-0.5 ${item.important ? "text-emerald-400" : "text-white/50"}`}>{item.important ? "✓" : "•"}</span>
                    {item.check}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Per-product timing table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="text-center mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-2">Per product</p>
          <h2 className="text-2xl font-medium text-brand-950">How long does it take?</h2>
        </div>
        <div className="bg-white border border-brand-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-100">
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider text-brand-600 px-5 py-3.5">Product</th>
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider text-brand-600 px-5 py-3.5">Rush (extra fee)</th>
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider text-brand-600 px-5 py-3.5">Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {standardItems.map((item) => (
                  <tr key={item.name} className="hover:bg-brand-50/50 transition-colors">
                    <td className="px-5 py-3 text-brand-900 font-medium">{item.name}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${item.fast === "Same day" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                        {item.fast}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-brand-600">{item.std}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-brand-400 text-center mt-4">
          Bulk orders (1,000+ pieces) may need additional time — we&apos;ll always confirm before starting production.
        </p>
      </div>

      {/* Delivery zones */}
      <div className="bg-brand-50 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-2">After printing</p>
            <h2 className="text-2xl font-medium text-brand-950">Delivery times by zone</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {delivery.map((d) => (
              <div key={d.zone} className="bg-white border border-brand-100 rounded-2xl p-5 hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-medium text-brand-950">{d.zone}</p>
                    <p className="text-xs text-brand-500 mt-0.5">{d.area}</p>
                  </div>
                  <span className="text-[10px] font-medium bg-brand-700 text-white rounded-full px-2.5 py-1 shrink-0">
                    {d.time}
                  </span>
                </div>
                <p className="text-xs text-brand-600 pt-3 border-t border-brand-50">{d.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rush options */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-7">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">⚡</div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-amber-950 mb-2">Need it faster?</h3>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                We do rush jobs. <strong>Same-day for most products</strong> when ordered before noon.
                Outside that window, we&apos;ll quote a rush fee (typically <strong>+30-50% of order value</strong>) and tell you exactly when it&apos;ll be ready.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="https://wa.me/254700000000?text=Hi, I need a rush print order — when can you do it?"
                  className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
                  💬 WhatsApp for rush
                </a>
                <Link href="/quote?timeline=urgent"
                  className="inline-flex items-center gap-2 border border-amber-300 hover:border-amber-500 text-amber-900 text-sm px-5 py-2.5 rounded-full transition-colors">
                  Request a quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What "business day" means */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h3 className="text-base font-medium text-brand-950 mb-4">Important notes</h3>
        <div className="space-y-3 text-sm text-brand-600 leading-relaxed">
          <p>
            <strong className="text-brand-800">Business days</strong> are Monday-Saturday, 8 AM to 6 PM. Sundays and public holidays don&apos;t count.
          </p>
          <p>
            <strong className="text-brand-800">Production starts</strong> when payment clears AND your print-ready artwork is approved by you on the digital proof we send.
            Late approvals push the clock back.
          </p>
          <p>
            <strong className="text-brand-800">Approval delays</strong> are the most common reason for missed turnarounds. Reply fast to keep your job moving.
          </p>
          <p>
            <strong className="text-brand-800">Reprints</strong> for printing errors caused by us are produced at top priority — usually same day or next day.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-950 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl font-medium text-brand-300 mb-3">Ready to start?</h3>
          <p className="text-sm text-brand-500 mb-6">Place your order or request a quote — we&apos;ll confirm timing before starting.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Browse products →
            </Link>
            <Link href="/quote" className="inline-flex items-center gap-2 border border-brand-800 hover:border-brand-700 text-brand-500 hover:text-brand-400 text-sm px-6 py-3 rounded-full transition-colors">
              Get a quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}