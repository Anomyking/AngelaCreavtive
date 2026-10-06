"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data";
import ProductImage from "@/components/product/ProductImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, deliveryFee, total, itemCount } = useCart();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-50">
          <div>
            <h2 className="text-base font-medium text-brand-950">Your cart</h2>
            <p className="text-xs text-brand-500 mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <motion.button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-brand-50 hover:bg-brand-100 flex items-center justify-center text-brand-600 transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.18 }}
          >
            ✕
          </motion.button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.p
                className="text-4xl mb-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
              >🛒</motion.p>
              <p className="text-sm font-medium text-brand-700 mb-2">Your cart is empty</p>
              <p className="text-xs text-brand-400 mb-6">Add products to get started</p>
              <motion.button
                onClick={closeCart}
                className="text-sm bg-brand-700 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                Browse products
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.finish}`}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    className="flex gap-4 pb-4 border-b border-brand-50 last:border-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-brand-50 overflow-hidden shrink-0">
                      <ProductImage productId={item.product.id} productName={item.product.name} size="thumb" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-brand-400 mt-0.5 capitalize">{item.finish} finish</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-brand-100 rounded-lg overflow-hidden">
                          <motion.button
                            onClick={() => item.quantity > 50 && updateQty(item.product.id, Math.max(50, item.quantity - 50))}
                            className="px-3 py-1.5 text-brand-600 hover:bg-brand-50 text-sm transition-colors"
                            whileTap={{ scale: 0.88 }}
                          >−</motion.button>
                          <span className="px-3 py-1.5 text-xs font-medium text-brand-800 border-x border-brand-100 min-w-[50px] text-center">
                            {item.quantity.toLocaleString()}
                          </span>
                          <motion.button
                            onClick={() => updateQty(item.product.id, item.quantity + 50)}
                            className="px-3 py-1.5 text-brand-600 hover:bg-brand-50 text-sm transition-colors"
                            whileTap={{ scale: 0.88 }}
                          >+</motion.button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-brand-400 hover:text-red-500 transition-colors ml-1"
                        >Remove</button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-brand-900">
                        {formatPrice(Math.round(item.unitPrice * (item.quantity / 100)))}
                      </p>
                      <p className="text-[10px] text-brand-400 mt-0.5">
                        {formatPrice(Math.round(item.unitPrice))} / 100pcs
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="border-t border-brand-50 px-6 py-5 space-y-4"
            >
              {deliveryFee > 0 ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-amber-700">
                    Add <strong>{formatPrice(7000 - subtotal)}</strong> more for free delivery 🚚
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-emerald-700">🎉 You qualify for free delivery!</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-500">Subtotal</span>
                  <span className="text-brand-800 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-500">Delivery (Nairobi)</span>
                  <span className={deliveryFee === 0 ? "text-emerald-600 font-medium" : "text-brand-800 font-medium"}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-brand-50">
                  <span className="text-brand-950">Total</span>
                  <span className="text-brand-950">{formatPrice(total)}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium py-4 rounded-full transition-colors"
                >
                  Proceed to checkout →
                </Link>
              </motion.div>
              <a
                href="https://wa.me/254700000000"
                className="block w-full text-center border border-brand-100 hover:border-brand-300 text-brand-600 text-sm py-3 rounded-full transition-colors"
              >
                💬 Complete order via WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}