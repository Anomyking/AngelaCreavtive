"use client";

import { useEffect, useState } from "react";

/**
 * Crossfading background slideshow for a hero banner. Absolutely fills its
 * parent (parent needs `relative`), so drop it in first and put your text
 * content in a sibling with `relative z-10`.
 */
export default function BannerSlideshow({
  images,
  intervalMs = 4000,
}: {
  images: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* dark wash so white/brand-300 text stays readable over any photo */}
      <div className="absolute inset-0 bg-brand-950/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-brand-950/70" />
    </div>
  );
}
