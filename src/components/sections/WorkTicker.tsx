"use client";

import Image from "next/image";
import { useState } from "react";

// Add your real images to /public/images/work/
// Files referenced below will fall back to a soft indigo gradient if missing
const works = [
  { id: "biz-cards-01",   title: "Luxury business cards",  category: "Brand my business" },
  { id: "tshirts-01",     title: "Branded team t-shirts",  category: "Dress my team"    },
  { id: "mugs-01",        title: "Corporate gift mugs",    category: "Corporate gifts"  },
  { id: "banner-01",      title: "Event roll-up banner",    category: "Promote an event"},
  { id: "boxes-01",       title: "Custom packaging boxes", category: "Package my product"},
  { id: "stickers-01",    title: "Die-cut stickers",        category: "Package my product"},
  { id: "canvas-01",      title: "Canvas print",            category: "Print & frame"    },
  { id: "wedding-01",     title: "Wedding invitations",     category: "Print & frame"    },
];

// Fallback gradients (used when image file missing — no broken images)
const fallbacks = [
  "linear-gradient(135deg, #302A7833, #051B3966)",
  "linear-gradient(135deg, #F7F3EA55, #302A7866)",
  "linear-gradient(135deg, #302A7822, #051B3966)",
  "linear-gradient(135deg, #051B3922, #302A78aa)",
];

export default function WorkTicker() {
  // Duplicate the list so the scroll loops seamlessly
  const loop = [...works, ...works];

  return (
    <div className="relative bg-brand-500 border border-brand-300 rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <p className="text-[10px] font-medium tracking-widest uppercase text-brand-950">
          ⭐ Our recent work
        </p>
        <p className="text-[10px] text-brand-900">live gallery</p>
      </div>

      {/* Scrolling strip */}
      <div className="ticker-mask flex-1 overflow-hidden">
        <div className="ticker-track flex gap-2 h-full items-center px-2 pb-3">
          {loop.map((work, i) => (
            <WorkTile key={`${work.id}-${i}`} work={work} fallback={fallbacks[i % fallbacks.length]} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .ticker-mask {
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .ticker-track {
          animation: scroll 35s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

function WorkTile({ work, fallback }: { work: { id: string; title: string; category: string }; fallback: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-brand-900 group cursor-pointer"
         style={errored ? { background: fallback } : undefined}
         title={`${work.title} — ${work.category}`}>
      {!errored && (
        <Image
          src={`/images/work/${work.id}.jpg`}
          alt={work.title}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setErrored(true)}
        />
      )}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl opacity-50">🖨️</span>
        </div>
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-brand-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center px-2 text-center">
        <p className="text-[10px] font-medium text-brand-300 leading-tight">{work.title}</p>
      </div>
    </div>
  );
}

