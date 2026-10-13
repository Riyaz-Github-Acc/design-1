"use client";

import { useRef, useState } from "react";
import { DEV_FACTS, LOTS, PAL, PLAN_STYLE, SITE, STATUS, acres, fmt, pad, type LotStatus } from "@/lib/content";
import { useSite } from "@/lib/site-state";
import { Eyebrow } from "./ui";

type FilterKey = "all" | LotStatus;
const FILTERS: [FilterKey, string][] = [["all", "All"], ["available", "Available"], ["reserved", "Reserved"], ["sold", "Sold"]];

export default function PlotDiscovery() {
  const { requestPick, showAvailable, reducedMotion } = useSite();
  const [filter, setFilter] = useState<FilterKey>("all");
  const track = useRef<HTMLDivElement>(null);
  const plots = LOTS.filter((l) => filter === "all" || l.status === filter);

  const scroll = (dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const card = t.firstElementChild as HTMLElement | null;
    t.scrollBy({ left: dir * ((card?.getBoundingClientRect().width ?? 340) + 32), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section id="plots" data-screen-label="Plot discovery" className="bg-ivory pb-[clamp(80px,9vw,140px)] pt-[clamp(96px,11vw,168px)]">
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-7 px-[clamp(20px,4vw,56px)]">
        <div data-reveal className="rv flex-[1_1_520px]">
          <Eyebrow n="04" className="text-mute">Plot discovery</Eyebrow>
          <h2 className="display mt-7 text-[clamp(46px,5.6vw,92px)]">
            Plot by <em>Plot.</em>
          </h2>
        </div>
        <div className="flex flex-[0_1_auto] flex-wrap items-center gap-x-7 gap-y-3.5">
          <div role="group" aria-label="Filter plots" className="flex border border-ink/30">
            {FILTERS.map(([key, label]) => {
              const on = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setFilter(key);
                    track.current?.scrollTo({ left: 0, behavior: "smooth" });
                  }}
                  className="mono cursor-pointer border-0 px-[15px] py-[11px] text-[10.5px] uppercase tracking-[.12em] transition-[background,color] duration-300"
                  style={{ background: on ? "#1d211f" : "transparent", color: on ? "#f3efe6" : "#1d211f" }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="mono text-[11px] tracking-[.12em] text-mute">
            {pad(plots.length)} / {pad(LOTS.length)} plots
          </span>
          <div className="flex gap-1.5">
            <ArrowBtn label="Scroll plots left" onClick={() => scroll(-1)}>←</ArrowBtn>
            <ArrowBtn label="Scroll plots right" onClick={() => scroll(1)}>→</ArrowBtn>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-[clamp(40px,5vw,64px)] flex snap-x snap-mandatory gap-[clamp(24px,2.6vw,40px)] overflow-x-auto px-[clamp(20px,4vw,56px)] pb-7 pt-1 scroll-pl-[clamp(20px,4vw,56px)]"
      >
        {plots.map((l) => (
          <PlotCard key={l.id} id={l.id} onView={() => requestPick(l.id)} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 px-[clamp(20px,4vw,56px)] pt-5">
        <a href="#masterplan" onClick={showAvailable} className="btn btn-ink">
          Explore All Available Plots <span aria-hidden>→</span>
        </a>
        <span className="max-w-[52ch] text-[12.5px] text-mute">Example plots shown for demonstration only. Pricing and availability will be published from verified project data.</span>
      </div>
    </section>
  );
}

function PlotCard({ id, onView }: { id: number; onView: () => void }) {
  const l = LOTS.find((x) => x.id === id)!;
  const pal = PAL[PLAN_STYLE];
  const st = STATUS[l.status];
  const sw = l.status === "available" ? pal.avail : l.status === "reserved" ? pal.resBg : pal.soldBg;
  const rows: [string, string][] = [
    ["Lot area", `${fmt(l.area)} sq ft · ${acres(l.area)} ac`],
    ["Asking price", l.price ? `$${fmt(l.price)}` : "To be announced"],
    ["Location", DEV_FACTS.location],
    ["Lot type", l.type],
  ];
  return (
    <article className="flex flex-[0_0_clamp(290px,27vw,380px)] snap-start flex-col border-t border-ink pt-4">
      <div className="mono flex items-center justify-between gap-3 text-[10px] uppercase tracking-[.14em]">
        <span className="truncate text-mute">{DEV_FACTS.name}</span>
        <span className="flex items-center gap-[7px] whitespace-nowrap" style={{ color: st.ink }}>
          <svg width={10} height={10} aria-hidden><rect x={0.5} y={0.5} width={9} height={9} fill={sw} stroke="currentColor" strokeWidth={1} /></svg>
          {st.label}
        </span>
      </div>
      <div className="mt-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-[.16em] text-mute">Plot</div>
          <div className="serif mt-2.5 text-[clamp(84px,7.4vw,112px)] leading-[.8] tracking-[-.03em]">{pad(l.id)}</div>
        </div>
        <div className="aspect-[1.12] w-1/2 border border-ink/14 bg-[#ebe5d8]">
          <svg viewBox="-16 -16 492 432" preserveAspectRatio="xMidYMid meet" aria-hidden className="block h-full w-full">
            <path d={SITE.row} fill="#f7f4ed" stroke="rgba(29,33,31,.45)" strokeWidth={2} />
            {LOTS.map((m) => (
              <path key={m.id} d={m.d} fill={m.id === l.id ? "#c98d5e" : "transparent"} stroke={m.id === l.id ? "#9b5c31" : "rgba(29,33,31,.4)"} strokeWidth={m.id === l.id ? 3 : 1.4} />
            ))}
            <path d={SITE.boundary} fill="none" stroke="#1d211f" strokeWidth={3} />
          </svg>
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-ink/14 py-[11px]">
            <span className="mono text-[10px] uppercase tracking-[.13em] text-mute">{k}</span>
            <span className="text-right text-[14.5px]">{v}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={onView} className="mt-5 flex cursor-pointer items-center justify-between border-0 border-b border-ink bg-transparent px-0 py-3.5 text-left text-sm font-medium text-ink transition-colors duration-300 hover:text-copper-dark">
        View on Master Plan <span aria-hidden>→</span>
      </button>
    </article>
  );
}

function ArrowBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="h-11 w-11 cursor-pointer border border-ink bg-transparent text-base text-ink transition-colors hover:bg-ink hover:text-ivory">
      {children}
    </button>
  );
}
