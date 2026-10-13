"use client";

import { useEffect, useRef, useState } from "react";
import { DEV_FACTS, LOTS, PHOTOS, SITE, STAGES, fmt, pad } from "@/lib/content";
import { Contours, Eyebrow, Photo } from "./ui";

const HIGHLIGHT = [3, 7, 10];
const SELECTED = LOTS[6];
const ease = (t: number) => {
  t = Math.min(1, Math.max(0, t));
  return t * t * (3 - 2 * t);
};

/**
 * A 440svh scroll track with a sticky stage. Scroll progress is written to CSS
 * variables (--p, --s1…--s4, --s2l) that drive every line and fade below.
 */
export default function LandToPlots() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const s = ref.current!;
    let ticking = false;
    const update = () => {
      const r = s.getBoundingClientRect();
      const total = Math.max(1, r.height - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / total));
      s.style.setProperty("--p", p.toFixed(4));
      for (let i = 0; i < 4; i++) s.style.setProperty(`--s${i + 1}`, ease((p - i * 0.25 + (i === 0 ? 0.04 : 0)) / 0.19).toFixed(4));
      s.style.setProperty("--s2l", ease((p - 0.4) / 0.06).toFixed(3));
      setStage(Math.min(3, Math.floor(p * 4)));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="process" ref={ref} data-screen-label="Land to plots" className="relative h-[440svh] bg-evergreen text-ivory">
      <div className="sticky top-0 flex h-svh flex-col-reverse gap-[clamp(20px,4vw,64px)] px-[clamp(20px,4vw,56px)] pb-[clamp(20px,5vh,52px)] pt-[clamp(92px,11vh,120px)] min-[900px]:flex-row">
        <div className="flex min-w-0 flex-[0_1_410px] flex-col justify-between gap-6">
          <div>
            <Eyebrow n="02" className="text-ivory/70">From land to individual plots</Eyebrow>
            <h2 className="display mt-6 hidden text-[clamp(34px,3.3vw,54px)] !leading-none tracking-[-.015em] min-[900px]:block">
              Explore the Land. Discover Your Plot. <em className="text-copper-light">Imagine What Comes Next.</em>
            </h2>
          </div>
          <div className="relative pl-6">
            <div className="absolute bottom-1.5 left-0 top-1.5 w-px bg-ivory/18">
              <div className="w-px bg-copper-light" style={{ height: "calc(var(--p,0) * 100%)" }} />
            </div>
            <ol className="m-0 flex list-none flex-col gap-5 p-0" aria-live="polite">
              {STAGES.map((st, i) => {
                const on = i === stage;
                return (
                  <li key={st.n} data-active={on} className="seq-stage flex flex-col gap-2.5 transition-opacity duration-500" style={{ opacity: on ? 1 : 0.34 }}>
                    <div className="flex items-baseline gap-4">
                      <span className="mono text-[11px] tracking-[.14em]" style={{ color: on ? "#d9a777" : "inherit" }}>{st.n}</span>
                      <span className="serif text-[27px] leading-[1.05]">{st.title}</span>
                    </div>
                    {on && <p className="m-0 ml-[34px] max-w-[36ch] text-[15px] leading-[1.55] text-ivory/78 [text-wrap:pretty]">{st.desc}</p>}
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="flex flex-col items-start gap-4">
            <a
              href="#masterplan"
              className="btn btn-ivory !px-[22px] !py-4"
              style={{
                opacity: stage === 3 ? 1 : 0,
                pointerEvents: stage === 3 ? "auto" : "none",
                transform: `translateY(${stage === 3 ? "0px" : "10px"})`,
                transition: "opacity .5s ease, transform .6s cubic-bezier(.2,.7,.2,1), background .3s, color .3s",
              }}
            >
              Find Your Plot <span aria-hidden>→</span>
            </a>
            <span className="mono text-[10px] uppercase leading-[1.6] tracking-[.12em] text-ivory/62">
              Sequence is illustrative. Approval steps vary by jurisdiction and project.
            </span>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-auto flex-col gap-3">
          <div className="kicker flex justify-between gap-4 text-ivory/72">
            <span>Fig. 02 · Sample parcel, ±{DEV_FACTS.acres} ac</span>
            <span>Stage {pad(stage + 1)} / 04</span>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden border border-ivory/20 bg-pine">
            <div
              className="absolute inset-0"
              style={{ opacity: "calc(1 - var(--s4,0))", transform: "scale(calc(1.1 - var(--p,0) * 0.1))", filter: "saturate(calc(1 - var(--s2,0) * 0.5))" }}
            >
              <Contours />
              <Photo src={PHOTOS.sequence.src} alt={PHOTOS.sequence.alt} sizes="(min-width: 900px) 65vw, 100vw" tint={0.2} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[#0f1f18]" style={{ opacity: "calc((0.12 + var(--s2,0) * 0.38) * (1 - var(--s4,0)))" }} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: "var(--s4,0)",
                backgroundColor: "#efeae0",
                backgroundImage: "linear-gradient(rgba(29,33,31,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(29,33,31,.06) 1px,transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <svg
              viewBox="-50 -50 560 520"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
              className="pointer-events-none absolute left-[5%] top-[5%] h-[90%] w-[90%] overflow-visible"
              style={{ color: "color-mix(in srgb,#1d211f calc(var(--s4,0) * 100%),#f3efe6)" }}
            >
              <g fill="none" stroke="currentColor">
                <path d={SITE.row} strokeWidth={1} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: "calc(1 - var(--s2,0))" }} />
                {LOTS.map((l, i) => (
                  <path key={l.id} d={l.d} strokeWidth={0.9} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: `calc(1 - clamp(0, var(--s2,0) * 1.7 - ${(i * 0.07).toFixed(2)}, 1))` }} />
                ))}
                <path d={SITE.swm} strokeWidth={0.8} strokeDasharray="3 3" style={{ opacity: "var(--s2l,0)" }} />
                <path d={SITE.boundary} strokeWidth={2.2} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: "calc(1 - var(--s1,0))" }} />
                <g style={{ opacity: "var(--s1,0)" }} strokeWidth={1.2}>
                  <circle cx={0} cy={26} r={4} />
                  <circle cx={452} cy={0} r={4} />
                  <circle cx={460} cy={400} r={4} />
                  <circle cx={0} cy={400} r={4} />
                </g>
              </g>
              <g fill="currentColor" className="mono" fontSize={9} letterSpacing={1.5} style={{ opacity: "var(--s1,0)" }}>
                <text x={226} y={-2} textAnchor="middle" transform="rotate(-3.3 226 -2)">± 452 FT</text>
                <text x={476} y={200} textAnchor="middle" transform="rotate(90 476 200)">± 400 FT</text>
                <text x={-14} y={213} textAnchor="middle" transform="rotate(-90 -14 213)">± 374 FT</text>
              </g>
              <text x={230} y={222} textAnchor="middle" className="serif" fontSize={52} fill="currentColor" style={{ opacity: "calc(var(--s1,0) * (1 - var(--s2,0)))" }}>
                ±{DEV_FACTS.acres} acres
              </text>
              <g style={{ opacity: "calc(var(--s3,0) * (1 - var(--s4,0) * 0.55))" }}>
                {LOTS.filter((l) => HIGHLIGHT.includes(l.id)).map((l) => (
                  <path key={l.id} d={l.d} fill="#b4703f" fillOpacity={0.34} stroke="#d9a777" strokeWidth={2.4} />
                ))}
              </g>
              <g fill="currentColor" style={{ opacity: "var(--s2l,0)" }}>
                {LOTS.map((l) => (
                  <text key={l.id} x={l.cx} y={l.cy + 5} textAnchor="middle" className="serif" fontSize={17}>{pad(l.id)}</text>
                ))}
              </g>
              <g style={{ opacity: "var(--s3,0)" }} className="mono" letterSpacing={1}>
                {LOTS.filter((l) => HIGHLIGHT.includes(l.id)).map((l) => (
                  <text key={l.id} x={l.cx} y={l.cy + 20} textAnchor="middle" fontSize={8} fill="currentColor">{fmt(l.area)} SF</text>
                ))}
              </g>
              <path d={SELECTED.d} fill="none" stroke="#b4703f" strokeWidth={3} style={{ opacity: "var(--s4,0)" }} />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
