"use client";

import { useEffect, useRef } from "react";
import { DEV_FACTS, PHOTOS, SHOW_SURVEY_OVERLAY } from "@/lib/content";
import { Contours, Photo } from "./ui";

const draw = (delay: string, dur = "2.6s", ease = "cubic-bezier(.6,0,.2,1)") => ({
  strokeDashoffset: "calc(1 - var(--in,0))",
  transition: `stroke-dashoffset ${dur} ${ease} ${delay}`,
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    // two frames so the initial --in:0 state paints before the intro transitions run
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => el.style.setProperty("--in", "1")));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        el.style.setProperty("--hp", Math.min(1, scrollY / innerHeight).toFixed(4));
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  const facts: [string, string][] = [
    ["Location", DEV_FACTS.location],
    ["Site area", `±${DEV_FACTS.acres} acres`],
    ["Planned plots", String(DEV_FACTS.count)],
    ["Status", DEV_FACTS.status],
  ];

  return (
    <section id="top" ref={ref} data-screen-label="Hero" className="relative h-svh min-h-[680px] overflow-hidden bg-evergreen text-ivory">
      {/* Imagery — slow settle on load, gentle parallax on scroll */}
      <div className="absolute inset-x-0 -inset-y-[7%]" style={{ transform: "translate3d(0,calc(var(--hp,0) * 16vh),0)" }}>
        <div
          className="absolute inset-0"
          style={{
            opacity: "var(--in,0)",
            transform: "scale(calc(1.16 - var(--in,0) * 0.12))",
            transition: "opacity 2.2s ease, transform 18s cubic-bezier(.12,.6,.2,1)",
          }}
        >
          <Contours />
          <Photo src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} priority tint={0.32} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(12,24,18,.55) 0%,rgba(12,24,18,0) 26%,rgba(12,24,18,0) 46%,rgba(12,24,18,.8) 100%)" }} />

      {SHOW_SURVEY_OVERLAY && (
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
          <g fill="none" stroke="#f3efe6" strokeWidth={1}>
            {[
              [0, 166, 1600, 166, ".5s"],
              [0, 540, 1600, 540, ".7s"],
              [700, 0, 700, 1000, ".6s"],
              [1160, 0, 1160, 1000, ".8s"],
            ].map(([x1, y1, x2, y2, d]) => (
              <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={0.16} pathLength={1} strokeDasharray={1} style={draw(d as string)} />
            ))}
            <g transform="translate(700 140)">
              <path d="M 0 26 L 452 0 L 460 400 L 0 400 Z" strokeWidth={1.6} pathLength={1} strokeDasharray={1} style={draw("1s", "3.2s", "cubic-bezier(.65,0,.25,1)")} />
              <g style={{ opacity: "var(--in,0)", transition: "opacity 1s ease 3.4s" }}>
                <circle cx={0} cy={26} r={5} />
                <circle cx={452} cy={0} r={5} />
                <circle cx={460} cy={400} r={5} />
                <circle cx={0} cy={400} r={5} />
                <path d="M -9 26 L 9 26 M 0 17 L 0 35 M 443 0 L 461 0 M 452 -9 L 452 9 M 451 400 L 469 400 M 460 391 L 460 409 M -9 400 L 9 400 M 0 391 L 0 409" strokeOpacity={0.8} />
                <path d="M 0 -18 L 452 -44 M 0 -24 L 0 -12 M 452 -50 L 452 -38" strokeOpacity={0.55} />
              </g>
            </g>
          </g>
          <g fill="#f3efe6" className="mono" fontSize={12} letterSpacing={2} style={{ opacity: "var(--in,0)", transition: "opacity 1.2s ease 3.6s" }}>
            <text x={926} y={104} textAnchor="middle" fillOpacity={0.8} transform="rotate(-3.3 926 104)">± 452 FT</text>
            <text x={712} y={128} fillOpacity={0.8}>PARCEL 01 · ±{DEV_FACTS.acres} AC · ILLUSTRATIVE</text>
            <text x={1176} y={520} fillOpacity={0.55}>[LAT] N</text>
            <text x={1176} y={538} fillOpacity={0.55}>[LONG] W</text>
          </g>
        </svg>
      )}

      <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-between px-[clamp(20px,4vw,56px)] pb-[clamp(28px,4.5vw,52px)] pt-[116px]">
        <div className="self-end" style={{ width: "min(300px,100%)", opacity: "var(--in,0)", transform: "translateY(calc((1 - var(--in,0)) * 12px))", transition: "opacity 1.2s ease 1.6s, transform 1.2s ease 1.6s" }}>
          <div className="kicker flex justify-between border-t border-ivory/50 pt-3 !tracking-[.16em]">
            <span>Sample Development 01</span>
            <span className="opacity-60">Illustrative</span>
          </div>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-sm leading-[1.35]">
            {facts.map(([k, v]) => (
              <FactRow key={k} k={k} v={v} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-9">
          <div className="min-w-0 flex-[1_1_560px]">
            <div className="flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[.16em]" style={{ opacity: "var(--in,0)", transition: "opacity 1s ease .2s" }}>
              <span>Land development · United States</span>
              <span className="h-px w-12 bg-current opacity-50" />
            </div>
            <h1 className="serif m-0 mt-[22px] text-[clamp(68px,11vw,200px)] leading-[.88] tracking-[-.025em]">
              <span className="block overflow-hidden pb-[.06em]">
                <Rise delay=".3s">Land,</Rise>
              </span>
              <span className="block overflow-hidden pb-[.1em]">
                <Rise delay=".46s">With a</Rise> <Rise delay=".6s" italic>Vision.</Rise>
              </span>
            </h1>
          </div>
          <div className="pointer-events-auto flex flex-[0_1_380px] flex-col gap-7" style={{ opacity: "var(--in,0)", transform: "translateY(calc((1 - var(--in,0)) * 16px))", transition: "opacity 1.2s ease 1.1s, transform 1.2s cubic-bezier(.2,.7,.2,1) 1.1s" }}>
            <p className="m-0 text-[17px] leading-[1.6] text-ivory/88 [text-wrap:pretty]">
              Discover thoughtfully planned land developments. Explore the property, understand the layout, and find the right place for what comes next.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#development" className="btn btn-ivory">
                Explore the Development <span aria-hidden>→</span>
              </a>
              <a href="#approach" className="border-b border-ivory/50 py-1.5 text-sm text-ivory transition-colors duration-300 hover:border-ivory">
                Discover Our Approach
              </a>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute right-[clamp(20px,4vw,56px)] top-1/2 z-[2] flex flex-col items-center gap-3.5" style={{ opacity: "var(--in,0)", transition: "opacity 1s ease 2.4s" }}>
        <span className="mono text-[10px] uppercase tracking-[.3em] opacity-70 [writing-mode:vertical-rl]">Scroll</span>
        <div className="relative h-[72px] w-px overflow-hidden bg-ivory/22">
          <div className="absolute left-0 top-0 h-[26px] w-px bg-ivory" style={{ animation: "fl-cue 2.6s cubic-bezier(.6,0,.3,1) infinite" }} />
        </div>
      </div>
    </section>
  );
}

function Rise({ children, delay, italic }: { children: React.ReactNode; delay: string; italic?: boolean }) {
  return (
    <span
      className={`inline-block ${italic ? "italic" : ""}`}
      style={{ transform: "translateY(calc((1 - var(--in,0)) * 110%))", transition: `transform 1.5s cubic-bezier(.2,.75,.15,1) ${delay}` }}
    >
      {children}
    </span>
  );
}

function FactRow({ k, v }: { k: string; v: string }) {
  return (
    <>
      <span className="kicker pt-0.5 opacity-65">{k}</span>
      <span>{v}</span>
    </>
  );
}
