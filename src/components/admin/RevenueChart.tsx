"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  data: { date: string; total: number }[];
}

export default function RevenueChart({ data }: Props) {
  const hasData = !!data && data.length > 0;

  // Measure the container so the chart is drawn at its real size. Scaling a
  // fixed-size SVG down to phone width would shrink the labels and dots too.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const el = wrapRef.current;
    if (!hasData || !el) return;
    // ResizeObserver fires once on observe() and again on every resize.
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(Math.round(entry.contentRect.width), 240));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasData]);

  if (!hasData) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400">
        No revenue data yet
      </div>
    );
  }

  const height  = width < 420 ? 140 : 160;
  const padding = { top: 10, right: 10, bottom: 24, left: 10 };

  const max = Math.max(...data.map((d) => d.total), 1);
  const stepX = (width - padding.left - padding.right) / Math.max(data.length - 1, 1);
  const scaleY = (val: number) => height - padding.bottom - ((val / max) * (height - padding.top - padding.bottom));

  const points = data.map((d, i) => ({
    x: padding.left + i * stepX,
    y: scaleY(d.total),
    date: d.date,
    total: d.total,
  }));

  // Smooth area path
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block max-w-full">
        <defs>
          <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#302A78" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#302A78" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Baseline grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g}
            x1={padding.left}
            y1={padding.top + (height - padding.top - padding.bottom) * g}
            x2={width - padding.right}
            y2={padding.top + (height - padding.top - padding.bottom) * g}
            stroke="#E2E8F0" strokeDasharray="2 4" />
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#rev-grad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#302A78" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="3" fill="#302A78" />
            <title>{`${new Date(p.date).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}: KES ${p.total.toLocaleString()}`}</title>
          </g>
        ))}

        {/* X-axis labels (first, middle, last only — avoid crowding) */}
        {[0, Math.floor(points.length / 2), points.length - 1].map((i, n) => {
          if (!points[i]) return null;
          const d = new Date(points[i].date);
          // Keep the first/last labels inside the chart instead of centring them on the edge
          const anchor = n === 0 ? "start" : n === 2 ? "end" : "middle";
          return (
            <text key={i}
              x={points[i].x} y={height - 6}
              textAnchor={anchor} fill="#94A3B8" fontSize="10">
              {d.toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
