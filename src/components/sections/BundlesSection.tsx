"use client";

import Link from "next/link";
import { bundles } from "@/data";
import { formatPrice, discountPercent } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function BundlesSection() {
  return (
    <section id="bundles" className="bg-brand-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Starter bundles</motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-medium text-brand-950">Everything you need to launch</motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-brand-500 mt-3">Curated print packs — better value than ordering separately</motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {bundles.slice(0, 3).map((bundle) => (
            <motion.div
              key={bundle.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
              className={`relative flex flex-col rounded-2xl p-6 ${bundle.isPopular ? "bg-brand-700 border-2 border-brand-600" : "bg-white border border-brand-100"}`}
            >
              {bundle.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-950 text-white text-xs font-medium px-4 py-1 rounded-full shadow-sm ring-1 ring-white/10">Most popular</span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${bundle.isPopular ? "bg-brand-600" : "bg-brand-50"}`}>
                {bundle.id === "hustler" ? "🌱" : bundle.id === "launch" ? "🚀" : "🏢"}
              </div>
              <h3 className={`text-base font-medium mb-1 ${bundle.isPopular ? "text-white" : "text-brand-950"}`}>{bundle.name}</h3>
              <p className={`text-xs mb-4 ${bundle.isPopular ? "text-brand-300" : "text-brand-500"}`}>{bundle.tagline}</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {bundle.items.map((item) => (
                  <li key={item} className={`flex items-start gap-2 text-xs ${bundle.isPopular ? "text-brand-300" : "text-brand-600"}`}>
                    <span className="mt-0.5 text-brand-500">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-xl font-medium ${bundle.isPopular ? "text-white" : "text-brand-900"}`}>{formatPrice(bundle.priceKES)}</span>
                <span className={`text-xs line-through ${bundle.isPopular ? "text-brand-500" : "text-brand-300"}`}>{formatPrice(bundle.originalPriceKES)}</span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${bundle.isPopular ? "bg-brand-600 text-brand-200" : "bg-brand-50 text-brand-600"}`}>
                  Save {discountPercent(bundle.originalPriceKES, bundle.priceKES)}%
                </span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link href={`/bundles/${bundle.id}`} className={`w-full text-center text-sm font-medium py-2.5 rounded-full transition-colors block ${bundle.isPopular ? "bg-white text-brand-700 hover:bg-brand-100" : "bg-brand-700 text-white hover:bg-brand-600"}`}>
                  Order this pack
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {bundles.slice(3).map((bundle) => (
            <motion.div
              key={bundle.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="flex flex-col bg-white border border-brand-100 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xl">
                  {bundle.id === "team" ? "👕" : "📦"}
                </div>
                <div>
                  <h3 className="text-base font-medium text-brand-950">{bundle.name}</h3>
                  <p className="text-xs text-brand-500 mt-0.5">{bundle.tagline}</p>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 flex-1">
                {bundle.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-brand-600">
                    <span className="text-brand-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-brand-50">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-medium text-brand-900">{formatPrice(bundle.priceKES)}</span>
                  <span className="text-xs line-through text-brand-300">{formatPrice(bundle.originalPriceKES)}</span>
                </div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href={`/bundles/${bundle.id}`} className="text-sm font-medium bg-brand-700 text-white hover:bg-brand-600 px-5 py-2 rounded-full transition-colors">
                    Order this pack
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-xs text-brand-400 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          All bundles include free delivery within Nairobi ·{" "}
          <Link href="/quote" className="text-brand-600 hover:text-brand-800 underline underline-offset-2">Custom quantities? Get a tailored quote →</Link>
        </motion.p>
      </div>
    </section>
  );
}