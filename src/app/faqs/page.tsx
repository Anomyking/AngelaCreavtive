import FAQSection from "@/components/sections/FAQSection";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "FAQs | Angela", description: "Common questions about ordering, design, delivery and payments." };
export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">Help centre</p>
          <h1 className="text-3xl font-medium text-brand-300">Frequently asked questions</h1>
          <p className="text-sm text-brand-600 mt-3">Everything you need to know about ordering from Angela</p>
        </div>
      </div>
      <FAQSection />
    </div>
  );
}

