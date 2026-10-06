import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Accounts — Angela",
  description: "Open a Angela business account. Monthly invoicing, dedicated account manager, bulk pricing and 30-day credit terms for registered businesses.",
};

const perks = [
  { icon: "🧾", title: "Monthly invoicing",        desc: "One invoice at end of month for all orders. No paying per order."              },
  { icon: "💳", title: "30-day credit terms",       desc: "Place orders now, pay at the end of the month. Available after credit approval." },
  { icon: "👤", title: "Dedicated account manager", desc: "One person who knows your brand, files, and delivery preferences."             },
  { icon: "💰", title: "Bulk pricing",              desc: "Locked-in rates lower than retail — the more you print, the more you save."     },
  { icon: "📁", title: "Brand asset storage",       desc: "We store your logos, templates and artwork so you never re-upload."            },
  { icon: "⚡", title: "Priority production",       desc: "Business orders jump the queue during busy periods."                           },
  { icon: "📊", title: "Order history & reports",   desc: "Full spend history and reports for your finance team."                         },
  { icon: "🖨️", title: "Unlimited print jobs",      desc: "No minimum per order — mix and match products as you need them."              },
];

const plans = [
  {
    name:     "Starter",
    price:    "Free",
    sub:      "No monthly fee",
    features: ["Standard pricing", "Email support", "Order tracking", "Basic invoicing"],
    cta:      "Register free",
    highlight: false,
  },
  {
    name:     "Business",
    price:    "KES 0",
    sub:      "Apply — subject to approval",
    features: ["Bulk pricing", "30-day credit terms", "Dedicated account manager", "Brand asset storage", "Monthly invoice", "Priority production", "Spend reports"],
    cta:      "Apply for business account",
    highlight: true,
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-4">For businesses</p>
          <h1 className="text-3xl sm:text-4xl font-medium text-brand-300 mb-4">
            Print more, spend less, stress never
          </h1>
          <p className="text-sm text-brand-600 leading-relaxed max-w-xl mx-auto mb-8">
            Open a Angela business account and get bulk pricing, monthly invoicing, a dedicated account manager and 30-day credit terms — all at no extra cost.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/contact?type=business" className="inline-flex bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              Apply for an account →
            </Link>
            <Link href="/quote" className="inline-flex border border-brand-800 hover:border-brand-700 text-brand-500 text-sm px-6 py-3 rounded-full transition-colors">
              Get a bulk quote
            </Link>
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-2">Business benefits</p>
          <h2 className="text-2xl font-medium text-brand-950">Everything your team needs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p) => (
            <div key={p.title} className="bg-brand-50 border border-brand-100 rounded-2xl p-5 hover:border-brand-300 transition-colors">
              <span className="text-2xl block mb-3">{p.icon}</span>
              <p className="text-sm font-medium text-brand-900 mb-1">{p.title}</p>
              <p className="text-xs text-brand-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who it's for */}
      <div className="bg-brand-50 border-y border-brand-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-brand-700 mb-6">Who uses Angela business accounts</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Marketing agencies","Law firms","NGOs & charities","Schools & universities","Restaurants & hospitality","Real estate companies","Political campaigns","Event companies","Tech startups","Churches & religious orgs"].map((i) => (
              <span key={i} className="text-xs bg-white border border-brand-100 text-brand-600 px-4 py-2 rounded-full">{i}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-medium text-brand-950 mb-4">Ready to open an account?</h2>
        <p className="text-sm text-brand-600 mb-8">Fill in your details and we&apos;ll be in touch within 1 business day to set up your account.</p>
        <Link href="/contact?type=business" className="inline-flex bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-8 py-4 rounded-full transition-colors">
          Apply for a business account →
        </Link>
        <p className="text-xs text-brand-400 mt-4">Or call us on <a href="tel:+254700000000" className="text-brand-600 hover:underline">+254 700 000 000</a></p>
      </div>
    </div>
  );
}

