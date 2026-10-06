"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  productId:   string;
  productName: string;
  size?: "card" | "detail" | "thumb";
  className?:  string;
}

const sizeMap = {
  card:   { width: 400, height: 300, sizes: "(max-width: 768px) 50vw, 25vw" },
  detail: { width: 800, height: 800, sizes: "(max-width: 1024px) 100vw, 50vw" },
  thumb:  { width: 64,  height: 64,  sizes: "64px" },
};

const fallbackEmojis: Record<string, string> = {
  "business-cards":"💳","letterheads":"📄","presentation-folders":"📁","branded-pens":"✒️","lanyards":"🪪","signage":"🏢","envelopes":"✉️","door-plates":"🚪","rubber-stamps":"🔏",
  "flyers":"📋","posters":"🗺️","rollup-banners":"🚩","backdrop-banners":"🎭","x-banners":"📐","vinyl-banners":"🏳️","selfie-frames":"🤳","table-cloths":"🍽️","button-badges":"🔘",
  "branded-tshirts":"👕","hoodies":"🧥","polo-shirts":"👔","aprons":"🧑‍🍳","reflector-jackets":"🦺","jerseys":"⚽","caps":"🧢","wristbands":"📿","overalls":"👷",
  "mugs":"☕","flasks":"🫙","notebooks":"📓","diaries":"📅","calendars":"🗓️","key-holders":"🔑","mousepads":"🖱️","water-bottles":"💧","gift-sets":"🎀",
  "label-stickers":"🏷️","vinyl-stickers":"⭐","die-cut-stickers":"✂️","packaging-boxes":"📦","kraft-bags":"🛍️","tote-bags":"👜","jute-bags":"🌿","floor-stickers":"🔵","vehicle-decals":"🚗",
  "photo-printing":"📸","canvas-prints":"🖼️","mounted-photos":"🖼️","booklets":"📚","document-printing":"🖨️","receipt-books":"🧾","funeral-programs":"📜","wedding-cards":"💍","invitation-cards":"💌",
};

export default function ProductImage({ productId, productName, size = "card", className = "" }: Props) {
  const [errored, setErrored] = useState(false);
  const dimensions = sizeMap[size];
  const src = `/images/products/${productId}.jpg`;
  const emoji = fallbackEmojis[productId] ?? "🖨️";

  // Render BOTH on the server — fallback hidden initially via CSS.
  // This guarantees server and client HTML match exactly = no hydration error.
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src}
        alt={productName}
        width={dimensions.width}
        height={dimensions.height}
        sizes={dimensions.sizes}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover ${errored ? "hidden" : ""}`}
      />
      {errored && (
        <div className="absolute inset-0 bg-brand-50 flex items-center justify-center">
          <span style={{ fontSize: size === "detail" ? "5rem" : size === "thumb" ? "1.5rem" : "2.5rem" }}>
            {emoji}
          </span>
        </div>
      )}
    </div>
  );
}

