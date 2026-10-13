"use client";

import Image from "next/image";
import { useEffect } from "react";
import { HERO_CONTOURS } from "@/lib/geometry";

export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const lg = size === "lg";
  return (
    <span className="flex items-center" style={{ gap: lg ? 14 : 12 }}>
      <span className="relative block" style={{ width: lg ? 26 : 20, height: lg ? 26 : 20 }}>
        <span className="absolute rotate-45 border-current" style={{ inset: lg ? 4 : 3, borderWidth: lg ? 1.4 : 1.25, borderStyle: "solid" }} />
        <span className="absolute rounded-full bg-copper" style={lg ? { left: 10.5, top: 10.5, width: 5, height: 5 } : { left: 8, top: 8, width: 4, height: 4 }} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-semibold tracking-[.34em]" style={{ fontSize: lg ? 19 : 15 }}>FIELDLINE</span>
        <span className="mono tracking-[.42em] opacity-70" style={{ fontSize: lg ? 9.5 : 8.5, marginTop: lg ? 6 : 5 }}>LAND CO.</span>
      </span>
    </span>
  );
}

export function Eyebrow({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`eyebrow ${className}`}>
      <span>{n}</span>
      <span className="rule" />
      <span>{children}</span>
    </div>
  );
}

/** Topographic linework used behind photography (and as its fallback). */
export function Contours({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden className={`absolute inset-0 h-full w-full ${className}`}>
      <g fill="none" stroke="#f3efe6">
        {HERO_CONTOURS.map((c, i) => (
          <path key={i} d={c.d} strokeOpacity={c.o} strokeWidth={c.w} />
        ))}
      </g>
    </svg>
  );
}

/** Full-bleed photograph slot. `tint` darkens the image so linework on top stays legible. */
export function Photo({ src, alt, sizes = "100vw", priority, tint = 0 }: { src: string; alt: string; sizes?: string; priority?: boolean; tint?: number }) {
  return (
    <>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {tint > 0 && <div className="pointer-events-none absolute inset-0" style={{ background: `rgba(15,31,24,${tint})` }} />}
    </>
  );
}

/**
 * Scroll reveals: elements marked `data-reveal` that start below the fold get
 * `--r: 0`, then animate to `--r: 1` as they enter the viewport. Elements read
 * `var(--r, 1)`, so everything is visible without JavaScript.
 */
export function RevealController() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            (en.target as HTMLElement).style.setProperty("--r", "1");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-rv])").forEach((el) => {
        el.setAttribute("data-rv", "1");
        if (el.getBoundingClientRect().top > innerHeight * 0.94) {
          el.style.setProperty("--r", "0");
          io.observe(el);
        }
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
