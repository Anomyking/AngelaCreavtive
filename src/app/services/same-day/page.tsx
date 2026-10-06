import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Same-Day Printing | Angela", description: "Order before 12 PM, collect by 5 PM." };
export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-950 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">Coming soon</p>
          <h1 className="text-3xl font-medium text-brand-300">Same-Day Printing</h1>
          <p className="text-sm text-brand-600 mt-3">Order before 12 PM, collect by 5 PM.</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-6xl mb-6">⚡</p>
        <h2 className="text-xl font-medium text-brand-950 mb-3">We are still filling in this page</h2>
        <p className="text-sm text-brand-600 leading-relaxed mb-8">
          In the meantime, WhatsApp or email us and we will help you out directly. Our team replies within 30 minutes during business hours.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="https://wa.me/254700000000" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">WhatsApp us</a>
          <a href="mailto:hello@angela.co.ke" className="inline-flex items-center gap-2 border border-brand-100 hover:border-brand-300 text-brand-600 text-sm px-6 py-3 rounded-full transition-colors">Email us</a>
          <Link href="/" className="inline-flex items-center gap-2 border border-brand-100 hover:border-brand-300 text-brand-600 text-sm px-6 py-3 rounded-full transition-colors">Back home</Link>
        </div>
      </div>
    </div>
  );
}

