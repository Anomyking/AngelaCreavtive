"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", emoji: "🎨", title: "Choose & customise", description: "Browse 54 products, pick your specs — size, quantity, finish. Upload your design or let our team create one for you.", detail: "Free design on all starter bundles" },
  { number: "02", emoji: "🖨️", title: "We print with precision", description: "Your order goes straight to our Nairobi press. We check every file before printing and send you a proof to approve.", detail: "Same-day printing available" },
  { number: "03", emoji: "🚀", title: "Delivered to you", description: "Collect from our Westlands studio or we deliver via courier — anywhere in Kenya within 1–4 business days.", detail: "All 47 counties covered" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const stepVariants = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}   /* re-animates on scroll up */
        >
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Simple process</motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-medium text-brand-950">How it works</motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-brand-500 mt-3 max-w-md mx-auto">From upload to delivery in 3 steps — no confusion, no chasing</motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}   /* re-animates on scroll up */
        >
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-brand-950 flex flex-col items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                >
                  <span className="text-2xl mb-0.5">{step.emoji}</span>
                  <span className="text-[10px] font-medium text-brand-500">{step.number}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 items-center">
                    <div className="w-8 h-px bg-brand-100" />
                    <div className="text-brand-200 text-xs">›</div>
                  </div>
                )}
              </div>

              <motion.div
                className="bg-brand-50 border border-brand-100 rounded-2xl p-6 w-full group-hover:border-brand-300 transition-colors"
                whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(34,30,31,0.08)" }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-base font-medium text-brand-900 mb-3">{step.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed mb-4">{step.description}</p>
                <div className="inline-flex items-center gap-2 bg-white border border-brand-200 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
                  <span className="text-xs text-brand-600 font-medium">{step.detail}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}                    /* re-animates on scroll up */
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <a href="/how-to-order" className="text-sm text-brand-600 hover:text-brand-800 underline underline-offset-4 transition-colors">
            Read the full guide →
          </a>
        </motion.div>
      </div>
    </section>
  );
}