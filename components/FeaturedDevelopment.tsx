"use client";

import { useState } from "react";
import { DEV_FACTS, LOTS, PHOTOS, SITE, pad } from "@/lib/content";
import { Eyebrow, Photo } from "./ui";

export default function FeaturedDevelopment() {
  const [view, setView] = useState<"aerial" | "plan">("aerial");
  const plan = view === "plan";
  const cap = plan ? "#1d211f" : "#f3efe6";

  return (
    <section id="development" data-screen-label="Featured development" className="relative bg-ivory">
      <div className="flex min-h-svh flex-wrap">
        {/* Visual */}
        <div
          data-reveal
          className="relative min-h-[min(92svh,880px)] flex-[1.35_1_560px] overflow-hidden bg-pine text-ivory"
          style={{ clipPath: "inset(calc((1 - var(--r,1)) * 9%) 0 calc((1 - var(--r,1)) * 9%) 0)", transition: "clip-path 1.6s cubic-bezier(.7,0,.2,1)" }}
        >
          <div className="absolute inset-0" style={{ transform: "scale(calc(1.08 - var(--r,1) * 0.08))", transition: "transform 2.4s cubic-bezier(.2,.7,.2,1)" }}>
            <Photo src={PHOTOS.featured.src} alt={PHOTOS.featured.alt} sizes="(min-width: 900px) 58vw, 100vw" tint={0.28} />
          </div>
          <svg viewBox="-90 -90 640 580" preserveAspectRatio="xMidYMid meet" aria-hidden className="pointer-events-none absolute inset-[8%] h-[84%] w-[84%]">
            <path d={SITE.boundary} fill="none" stroke="#f3efe6" strokeWidth={1.6} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: "calc(1 - var(--r,1))", transition: "stroke-dashoffset 2.6s cubic-bezier(.65,0,.25,1) .9s" }} />
            <text x={230} y={215} textAnchor="middle" className="serif" fontSize={44} fill="#f3efe6" style={{ opacity: "var(--r,1)", transition: "opacity 1.2s ease 2.6s" }}>
              ±{DEV_FACTS.acres} ac
            </text>
            <text x={230} y={240} textAnchor="middle" className="mono" fontSize={10} letterSpacing={2} fill="#f3efe6" fillOpacity={0.75} style={{ opacity: "var(--r,1)", transition: "opacity 1.2s ease 2.8s" }}>
              PARCEL BOUNDARY · ILLUSTRATIVE
            </text>
          </svg>

          {/* Site-plan sheet wipes across the aerial */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: "#efeae0",
              backgroundImage: "linear-gradient(rgba(29,33,31,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(29,33,31,.06) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
              clipPath: plan ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1.1s cubic-bezier(.7,0,.2,1)",
            }}
          >
            <svg viewBox="-60 -60 580 540" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-[7%] h-[86%] w-[86%]">
              <path d={SITE.swm} fill="#dfe3d6" stroke="#1d211f" strokeWidth={0.8} />
              <path d={SITE.row} fill="#f7f4ed" stroke="#1d211f" strokeWidth={0.8} />
              <path d={SITE.pave} fill="#dcd5c5" />
              <circle cx={221} cy={178} r={13} fill="#d3dccd" stroke="#1d211f" strokeWidth={0.6} />
              {LOTS.map((l) => (
                <path key={l.id} d={l.d} fill="#e7e8dc" stroke="#1d211f" strokeWidth={0.8} />
              ))}
              <path d={SITE.boundary} fill="none" stroke="#1d211f" strokeWidth={1.8} strokeDasharray="14 4 3 4" />
              <rect x={-60} y={412} width={580} height={34} fill="#dcd5c5" />
              {LOTS.map((l) => (
                <text key={l.id} x={l.cx} y={l.cy + 5} textAnchor="middle" className="serif" fontSize={15} fill="#1d211f">
                  {pad(l.id)}
                </text>
              ))}
            </svg>
          </div>

          <div className="kicker pointer-events-none absolute left-[clamp(16px,2.4vw,32px)] top-[clamp(16px,2.4vw,32px)] !tracking-[.16em] transition-colors duration-[.6s]" style={{ color: cap }}>
            Fig. 01 · {DEV_FACTS.name}
          </div>
          <div
            role="group"
            aria-label="Image view"
            className="absolute bottom-[clamp(16px,2.4vw,32px)] left-[clamp(16px,2.4vw,32px)] flex transition-[border-color,background] duration-[.6s]"
            style={{ border: `1px solid ${cap}`, background: plan ? "rgba(239,234,224,.9)" : "rgba(19,36,29,.35)" }}
          >
            <ToggleBtn on={!plan} onClick={() => setView("aerial")} bg="#f3efe6" fg="#1d211f" offFg="#1d211f">Aerial</ToggleBtn>
            <ToggleBtn on={plan} onClick={() => setView("plan")} bg="#1d211f" fg="#f3efe6" offFg="#f3efe6">Site plan</ToggleBtn>
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-[1_1_420px] flex-col justify-between gap-14 px-[clamp(24px,5vw,88px)] pb-[clamp(48px,6vw,96px)] pt-[clamp(56px,8vw,128px)]">
          <div data-reveal className="rv">
            <Eyebrow n="01" className="text-mute">Featured development</Eyebrow>
            <h2 className="display mt-7 text-[clamp(48px,5.6vw,92px)]">
              A Place
              <br />
              Taking <em>Shape.</em>
            </h2>
            <div className="mt-7 flex flex-col gap-1.5">
              <span className="text-xl font-medium">{DEV_FACTS.name}</span>
              <span className="mono text-[11px] uppercase tracking-[.14em] text-mute">{DEV_FACTS.location}</span>
            </div>
            <p className="m-0 mt-7 max-w-[46ch] text-[16.5px] leading-[1.65] text-body [text-wrap:pretty]">
              A sample four-acre parcel shown as ten individual plots arranged around a single internal road, with a shared stormwater area at the entrance. Replace this description with verified project details.
            </p>
          </div>
          <div data-reveal className="rv" style={{ transitionDelay: ".15s" }}>
            <div className="flex flex-col border-t border-ink">
              <Stat k="Total site area">
                <span className="serif text-[clamp(30px,2.6vw,40px)] leading-none">
                  ±{DEV_FACTS.acres}
                  <span className="ml-1.5 text-[.5em]">acres*</span>
                </span>
              </Stat>
              <Stat k="Planned plots">
                <span className="serif text-[clamp(30px,2.6vw,40px)] leading-none">
                  {DEV_FACTS.count}
                  <span className="ml-1.5 text-[.5em]">*</span>
                </span>
              </Stat>
              <Stat k="Plot sizes">
                <span className="serif text-[clamp(24px,2vw,30px)] leading-none">{DEV_FACTS.range}</span>
              </Stat>
              <Stat k="Status">
                <span className="text-right text-base">{DEV_FACTS.status}</span>
              </Stat>
            </div>
            <p className="m-0 mt-3.5 text-[12.5px] text-mute">*Derived from the illustrative sample plan shown on this page.</p>
            <a href="#process" className="btn btn-ink mt-9">
              Explore This Development <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-5 border-b border-ink/16 py-4">
      <span className="kicker text-mute">{k}</span>
      {children}
    </div>
  );
}

function ToggleBtn({ on, onClick, bg, fg, offFg, children }: { on: boolean; onClick: () => void; bg: string; fg: string; offFg: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="mono cursor-pointer border-0 px-[18px] py-[11px] text-[11px] uppercase tracking-[.14em] transition-[background,color] duration-[.4s]"
      style={{ background: on ? bg : "transparent", color: on ? fg : offFg }}
    >
      {children}
    </button>
  );
}
