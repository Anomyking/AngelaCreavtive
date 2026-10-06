"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/data";
import ProductImage from "./ProductImage";
import StockBadge from "./StockBadge";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(34,30,31,0.10)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`}
        className="group flex flex-col bg-white border border-brand-100 rounded-2xl overflow-hidden hover:border-brand-400 transition-colors duration-200 h-full">
        <div className="relative h-36 bg-brand-50 overflow-hidden">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <ProductImage productId={product.id} productName={product.name} size="card" />
          </motion.div>
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
            {product.isPopular  && <span className="text-[9px] font-medium bg-brand-700 text-white rounded-full px-2 py-0.5">Popular</span>}
            {product.isSameDay  && <span className="text-[9px] font-medium bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">Same-day</span>}
            {product.isNew      && <span className="text-[9px] font-medium bg-brand-100 text-brand-700 rounded-full px-2 py-0.5">New</span>}
            <StockBadge productId={product.id} size="card" />
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-sm font-medium text-brand-950 mb-1 leading-snug">{product.name}</p>
          <p className="text-xs text-brand-400 leading-relaxed flex-1 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-50">
            <div>
              <p className="text-[10px] text-brand-400">{product.pricingType === "fixed" ? "From" : "Custom quote"}</p>
              <p className="text-sm font-medium text-brand-800">
                {product.pricingType === "fixed" && product.basePrice ? formatPrice(product.basePrice) : "Get a quote"}
              </p>
              {product.priceUnit && <p className="text-[10px] text-brand-400">{product.priceUnit}</p>}
            </div>
            <motion.div
              className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center shrink-0"
              whileHover={{ scale: 1.15, backgroundColor: "#241F66" }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.18 }}
            >
              <span className="text-white text-sm">→</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}