"use client";

import Link from "next/link";
import { categories } from "@/data";
import { heroImages } from "@/data/heroImages";
import WorkTicker from "./WorkTicker";
import QuoteBento from "./QuoteBento";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ── Animated counter ────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18, mass: 0.8 });

  useEffect(() => {
    if (inView) {
      mv.set(0);
      const ctrl = animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] });
      return ctrl.stop;
    }
  }, [inView, mv, to]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ── Text reveal — word-by-word or letter-by-letter ─────────────────── */
function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const isLong = text.split(" ").length > 3;
  const units = isLong ? text.split(" ") : text.split("");

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(4px)" }}
          transition={{ delay: i * (isLong ? 0.07 : 0.035), duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="inline-block"
        >
          {unit}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Bento types ─────────────────────────────────────────────────────── */
type BentoItem = {
  id: string; name: string; href: string; description: string;
  emoji: string; bgClass: string; badge: string;
  images: string[]; big?: boolean;
  featured?: { label: string; pulse?: boolean };
};

const categoryVisuals: Record<string, { emoji: string; bgClass: string }> = {
  brand:     { emoji: "🏷️", bgClass: "bg-brand-800" },
  events:    { emoji: "📣", bgClass: "bg-brand-700" },
  apparel:   { emoji: "👕", bgClass: "bg-brand-900" },
  gifts:     { emoji: "🎁", bgClass: "bg-brand-800" },
  packaging: { emoji: "📦", bgClass: "bg-brand-900" },
  print:     { emoji: "🖼️", bgClass: "bg-brand-800" },
};

const stats = [
  { number: 500, suffix: "+",   label: "Happy clients"    },
  { number: 54,  suffix: "",    label: "Products"         },
  { number: 47,  suffix: "",    label: "Counties covered" },
  { number: 1,   suffix: " day",label: "Turnaround"      },
];

const trust = [
  { icon: "🚚", title: "Free delivery",     sub: "Orders over KES 7,000"         },
  { icon: "⚡", title: "Same-day printing", sub: "Order before 12 PM"             },
  { icon: "📱", title: "Pay via M-Pesa",    sub: "Instant & secure"               },
  { icon: "🛡️", title: "Reprint guarantee", sub: "If it's not right, we redo it"  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ── Bento Card — photo slideshow at rest, clean brand card on hover ── */
function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Stagger each tile's slideshow start so they don't all flip in unison —
  // creates a rolling "wave" across the grid instead of a single flash.
  useEffect(() => {
    if (item.images.length < 2) return;
    const staggerDelay = index * 300;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % item.images.length);
      }, 3400);
    }, staggerDelay);
    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [index, item.images.length]);

  return (
    <motion.div variants={cardVariants} className={`h-full ${item.big ? "col-span-2 row-span-2" : ""}`}>
      <Link
        href={item.href}
        className="relative group flex flex-col justify-between rounded-2xl border border-brand-800 overflow-hidden hover:border-brand-500 transition-colors duration-300 h-full"
      >
        {/* Photo layer — default state */}
        <div className="absolute inset-0">
          {item.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out group-hover:opacity-0 ${
                i === imgIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Bottom caption so mobile users (no hover) still know what this tile is */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
          <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity duration-300 group-hover:opacity-0">
            <p className="text-xs font-medium text-white drop-shadow-sm">{item.name}</p>
          </div>
        </div>

        {/* Clean brand card — revealed on hover */}
        <div
          className={`absolute inset-0 ${item.bgClass} p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        >
          {/* Watermark number */}
          <div className="absolute top-2 right-3 text-6xl font-bold text-white/[0.04] select-none leading-none pointer-events-none">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className={`rounded-xl bg-black/20 flex items-center justify-center shrink-0 ${item.big ? "w-12 h-12 text-2xl" : "w-9 h-9 text-lg"}`}>
              {item.emoji}
            </div>
            <span className="text-[10px] font-medium bg-black/20 text-brand-400 rounded-full px-2.5 py-1">
              {item.badge}
            </span>
          </div>

          <div className="relative z-10 mt-auto">
            {item.featured && (
              <span className="inline-flex items-center gap-1.5 bg-brand-600 text-brand-950 text-[10px] font-medium rounded-full px-2.5 py-1 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full bg-brand-300 inline-block ${item.featured.pulse ? "animate-pulse" : ""}`} />
                {item.featured.label}
              </span>
            )}
            <p className={`font-medium text-brand-300 ${item.big ? "text-lg" : "text-sm"}`}>{item.name}</p>
            <p className={`text-brand-500 mt-1 leading-relaxed ${item.big ? "text-xs max-w-xs" : "text-[11px]"}`}>{item.description}</p>
            <p className="text-[11px] text-brand-600 mt-2 group-hover:text-brand-400 transition-colors">
              {item.badge === "Service" ? "Learn more" : "Shop now"} →
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HeroSection() {
  const bentoItems: BentoItem[] = [
    {
      id: "web-design", name: "Web design", href: "/services/web",
      description: "Fast Kenyan sites with M-Pesa built in",
      emoji: "💻", bgClass: "bg-brand-900", badge: "Service",
      images: heroImages["web-design"] ?? [],
      featured: { label: "New", pulse: true },
      big: true,
    },
    ...categories.map<BentoItem>((cat, i) => {
      const v = categoryVisuals[cat.id] ?? { emoji: "🖨️", bgClass: "bg-brand-900" };
      return {
        id: cat.id, name: cat.name, href: `/shop/${cat.slug}`,
        description: cat.description, emoji: v.emoji, bgClass: v.bgClass,
        badge: `${cat.productCount} products`,
        images: heroImages[cat.id] ?? [],
        featured: i === 0 ? { label: "Most ordered" } : undefined,
      };
    }),
    {
      id: "signage", name: "Signage & branding", href: "/services/signage",
      description: "3D LED, vehicle wraps, neon & pylon signage",
      emoji: "🪧", bgClass: "bg-brand-800", badge: "Service",
      images: heroImages["signage"] ?? [],
      featured: { label: "Since 2010" },
    },
    {
      id: "graphic-design", name: "Graphic design", href: "/services/design",
      description: "Logos, brand identity & social media",
      emoji: "🎨", bgClass: "bg-brand-700", badge: "Service",
      images: heroImages["graphic-design"] ?? [],
    },
  ];

  return (
    <section className="bg-brand-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">

        {/*
          Bento grid — one big 2×2 tile (Web design) + eight equal 1×1 tiles.
          grid-flow-row-dense lets the browser auto-pack the small tiles into
          every gap left by the big one, so both breakpoints tile exactly:
          mobile 2 cols → 4(big) + 8(small) = 12 cells = 6 rows.
          desktop 4 cols → 4(big) + 8(small) = 12 cells = 3 rows.
        */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 auto-rows-[130px] grid-flow-row-dense"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}
        >
          {bentoItems.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </motion.div>

        {/* Work ticker */}
        <motion.div
          className="hidden md:block mb-4 min-h-[140px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <WorkTicker />
        </motion.div>

        {/* Quote bento */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <QuoteBento />
        </motion.div>

        {/* Headline + CTAs */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end py-10 border-t border-brand-900"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest uppercase text-brand-900 mb-4">
              Nairobi&apos;s premium print house
            </p>
            <h1 className="text-3xl sm:text-4xl font-medium text-brand-950 leading-tight mb-4">
              <RevealText text="Print that makes your brand impossible to ignore" />
            </h1>
            <p className="text-sm text-brand-900 leading-relaxed max-w-md">
              From same-day <span className="text-brand-950 font-medium">business cards</span> to
              large-format <span className="text-brand-950 font-medium">event banners</span> and{" "}
              <span className="text-brand-950 font-medium">branded apparel</span> — precision
              printing delivered across all 47 counties.
            </p>
          </motion.div>

          <motion.div className="flex flex-col items-start lg:items-end gap-6" variants={fadeUp}>
            <div className="flex gap-6">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  className="text-right"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xl font-medium text-black">
                    <Counter to={s.number} suffix={s.suffix} />
                  </p>
                  <p className="text-[11px] text-black">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link href="/#products" className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-700 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
                  Browse all products
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link href="/quote" className="inline-flex items-center gap-2 border border-brand-900 hover:border-brand-800 text-brand-950 text-sm px-6 py-3 rounded-full transition-colors">
                  Get a free quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust bar */}
      <div className="bg-brand-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}
          >
            {trust.map((t) => (
              <motion.div
                key={t.title}
                className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-brand-100 shadow-sm"
                variants={fadeUp}
                whileHover={{ y: -3 }}
              >
                <span className="text-2xl shrink-0">{t.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-brand-950">{t.title}</p>
                  <p className="text-xs text-brand-600 mt-1">{t.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}