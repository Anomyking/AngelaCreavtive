"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Wanjiku M.", role: "Founder, Bloom Florist", quote: "Ordered 500 business cards and 100 flyers on a Thursday morning — had them by 5 PM the same day. Quality was exceptional and the design team nailed our brand colours.", rating: 5 },
  { name: "James O.", role: "Marketing Manager, TechBridge Kenya", quote: "We use Angela for all our corporate events. Roll-up banners, branded tees, notebooks — everything is consistent and always on time. They're the only printer we trust.", rating: 5 },
  { name: "Amina H.", role: "Owner, Amina's Kitchen", quote: "The packaging stickers and kraft bags completely transformed how my products look. Customers keep commenting on the branding. Worth every shilling.", rating: 5 },
  { name: "Peter K.", role: "Event Organiser, Nairobi Events Co.", quote: "Ordered backdrop banners for a corporate event with 48 hours notice. They delivered on time with zero errors. Will absolutely use again.", rating: 5 },
  { name: "Grace N.", role: "Director, Sunrise Academy", quote: "Printed branded t-shirts and caps for our school team. The embroidery quality is top notch and turnaround was 3 days. Very impressed.", rating: 5 },
  { name: "David M.", role: "CEO, Savanna Organics", quote: "The product seller bundle was perfect for our launch. Labels, bags and business cards all matched perfectly. The free design service saved us so much time.", rating: 5 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-widest uppercase text-brand-500 mb-3">Customer reviews</motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-medium text-brand-950">What our clients say</motion.h2>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">{Array(5).fill(0).map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
            <span className="text-sm text-brand-500">5.0 from 200+ reviews</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(34,30,31,0.09)", transition: { duration: 0.25 } }}
              className="bg-brand-50 border border-brand-100 rounded-2xl p-6 hover:border-brand-300 transition-colors cursor-default"
            >
              <div className="flex gap-0.5 mb-4">
                {Array(t.rating).fill(0).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.25, type: "spring", stiffness: 300 }}
                    className="text-yellow-400 text-sm"
                  >★</motion.span>
                ))}
              </div>
              <p className="text-sm text-brand-700 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-100">
                <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-900">{t.name}</p>
                  <p className="text-[11px] text-brand-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}