"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEV_FACTS, LOTS, PAL, PLAN_STYLE, SHOW_STATUS_LABELS, SITE, STATUS, VB0, acres, fmt, pad, type LotStatus } from "@/lib/content";
import { PLAN_CONTOURS, TREES } from "@/lib/geometry";
import { useSite } from "@/lib/site-state";
import { Eyebrow } from "./ui";

type View = { cx: number; cy: number; z: number };
const HOME: View = { cx: VB0.x + VB0.w / 2, cy: VB0.y + VB0.h / 2, z: 1 };
const MAX_Z = 6;

const clampView = (v: View): View => ({
  z: Math.min(MAX_Z, Math.max(1, v.z)),
  cx: Math.min(VB0.x + VB0.w, Math.max(VB0.x, v.cx)),
  cy: Math.min(VB0.y + VB0.h, Math.max(VB0.y, v.cy)),
});

export default function MasterPlan() {
  const { narrow, reducedMotion, selected, setSelected, mpFilter, setMpFilter, pickRequest, openEnq } = useSite();
  const pal = PAL[PLAN_STYLE];

  const [view, setView] = useState<View>(HOME);
  const [mapSize, setMapSize] = useState({ w: 900, h: 720 });
  const [hover, setHover] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [wheelHint, setWheelHint] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const sizeRef = useRef(mapSize);
  sizeRef.current = mapSize;
  const tween = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const pinch = useRef<{ d: number; z: number } | null>(null);
  const justDragged = useRef(false);

  /** pixels per plan unit (foot) at zoom z */
  const ppu = (z = viewRef.current.z) => {
    const { w, h } = sizeRef.current;
    return Math.min(w / (VB0.w / z), h / (VB0.h / z));
  };

  const animateTo = useCallback(
    (target: View, dur = 750) => {
      cancelAnimationFrame(tween.current);
      const from = { ...viewRef.current }, to = clampView(target);
      if (reducedMotion) return setView(to);
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const z = Math.exp(Math.log(from.z) + (Math.log(to.z) - Math.log(from.z)) * e);
        setView({ cx: from.cx + (to.cx - from.cx) * e, cy: from.cy + (to.cy - from.cy) * e, z });
        if (k < 1) tween.current = requestAnimationFrame(step);
      };
      tween.current = requestAnimationFrame(step);
    },
    [reducedMotion],
  );

  const zoomAt = useCallback(
    (factor: number, mx: number, my: number, animate: boolean) => {
      const v = viewRef.current, { w, h } = sizeRef.current, p = ppu(v.z);
      const sx = v.cx + (mx - w / 2) / p, sy = v.cy + (my - h / 2) / p;
      const z = Math.min(MAX_Z, Math.max(1, v.z * factor)), p2 = ppu(z);
      const nv = { z, cx: sx - (mx - w / 2) / p2, cy: sy - (my - h / 2) / p2 };
      if (animate) animateTo(nv, 480);
      else setView(clampView(nv));
    },
    [animateTo],
  );

  const pick = useCallback(
    (id: number, z = 2) => {
      const l = LOTS.find((x) => x.id === id)!;
      setSelected(id);
      setMpFilter((f) => (f[l.status] ? f : { ...f, [l.status]: true }));
      animateTo({ cx: l.cx, cy: l.cy + (narrow ? 60 / z : 0), z: Math.max(viewRef.current.z, z) });
    },
    [animateTo, narrow, setMpFilter, setSelected],
  );

  const step = (dir: 1 | -1) => {
    const list = LOTS.filter((l) => mpFilter[l.status]);
    const pool = list.length ? list : LOTS;
    let i = pool.findIndex((l) => l.id === selected);
    i = (i + dir + pool.length) % pool.length;
    pick(pool[i].id, viewRef.current.z);
  };

  // "View on Master Plan" from elsewhere on the page: wait for the scroll, then fly in.
  useEffect(() => {
    if (!pickRequest) return;
    const t = setTimeout(() => pick(pickRequest.id), reducedMotion ? 0 : 750);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickRequest]);

  // Size tracking + Ctrl/⌘-wheel zoom (plain wheel keeps scrolling the page)
  useEffect(() => {
    const m = mapRef.current!;
    const ro = new ResizeObserver(() => {
      const r = m.getBoundingClientRect();
      if (r.width) setMapSize((s) => (Math.abs(r.width - s.w) > 1 || Math.abs(r.height - s.h) > 1 ? { w: r.width, h: r.height } : s));
    });
    ro.observe(m);
    let hintT: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) {
        setWheelHint(true);
        clearTimeout(hintT);
        hintT = setTimeout(() => setWheelHint(false), 1300);
        return;
      }
      e.preventDefault();
      cancelAnimationFrame(tween.current);
      const r = m.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.004), e.clientX - r.left, e.clientY - r.top, false);
    };
    m.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      m.removeEventListener("wheel", onWheel);
      clearTimeout(hintT);
    };
  }, [zoomAt]);

  useEffect(() => () => cancelAnimationFrame(tween.current), []);

  // Drag to pan, two-finger pinch to zoom
  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2 && pinch.current) {
        const [a, b] = [...pointers.current.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y), r = mapRef.current!.getBoundingClientRect();
        zoomAt((pinch.current.z * d) / pinch.current.d / viewRef.current.z, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, false);
        if (drag.current) drag.current.moved = true;
        return;
      }
      const dr = drag.current;
      if (!dr) return;
      const dx = e.clientX - dr.x, dy = e.clientY - dr.y;
      if (!dr.moved && Math.hypot(dx, dy) < 4) return;
      if (!dr.moved) {
        dr.moved = true;
        setDragging(true);
      }
      const p = ppu();
      setView(clampView({ z: viewRef.current.z, cx: dr.cx - dx / p, cy: dr.cy - dy / p }));
    },
    [zoomAt],
  );

  const onUp = useCallback(
    (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) pinch.current = null;
      if (pointers.current.size === 0) {
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerup", onUp);
        removeEventListener("pointercancel", onUp);
        justDragged.current = !!drag.current?.moved;
        setTimeout(() => (justDragged.current = false), 0);
        drag.current = null;
        setDragging(false);
      } else if (pointers.current.size === 1) {
        const [a] = [...pointers.current.values()];
        drag.current = { x: a.x, y: a.y, cx: viewRef.current.cx, cy: viewRef.current.cy, moved: true };
      }
    },
    [onMove],
  );

  const onMapDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest?.("[data-map-ui]")) return;
    cancelAnimationFrame(tween.current);
    const first = pointers.current.size === 0;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) drag.current = { x: e.clientX, y: e.clientY, cx: viewRef.current.cx, cy: viewRef.current.cy, moved: false };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: viewRef.current.z };
    }
    if (first) {
      addEventListener("pointermove", onMove);
      addEventListener("pointerup", onUp);
      addEventListener("pointercancel", onUp);
    }
  };

  const onMapDbl = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest?.("[data-map-ui]")) return;
    const r = mapRef.current!.getBoundingClientRect();
    zoomAt(1.8, e.clientX - r.left, e.clientY - r.top, true);
  };

  // ——— derived ———
  const z = view.z, p = ppu(z);
  const sel = selected != null ? LOTS.find((l) => l.id === selected)! : null;
  const hov = hover != null ? LOTS.find((l) => l.id === hover)! : null;
  const k = 1 / Math.pow(z, 0.55), detail = z >= 1.35;
  const swFor = (st: LotStatus) => (st === "available" ? pal.avail : st === "reserved" ? "url(#mpRes)" : "url(#mpSold)");
  const counts = { available: 0, reserved: 0, sold: 0 };
  LOTS.forEach((l) => counts[l.status]++);
  const scaleFt = [10, 25, 50, 100, 200].find((o) => o * p >= 64) ?? 200;
  const readLot = hov || sel;
  const sheet = narrow && !!sel;
  const mapH = narrow ? "64svh" : "clamp(560px, 80vh, 880px)";
  const vb = `${(view.cx - VB0.w / z / 2).toFixed(2)} ${(view.cy - VB0.h / z / 2).toFixed(2)} ${(VB0.w / z).toFixed(2)} ${(VB0.h / z).toFixed(2)}`;

  const lots = LOTS.map((l) => {
    const vis = mpFilter[l.status], isSel = sel?.id === l.id, isHov = hov?.id === l.id;
    const sub: string[] = [];
    if (detail) sub.push(`${fmt(l.area)} SF`);
    if (SHOW_STATUS_LABELS) sub.push(STATUS[l.status].label.toUpperCase());
    return { l, vis, isSel, fill: l.status === "available" ? (isHov || isSel ? pal.availHover : pal.avail) : swFor(l.status), sub: sub.join(" · ") };
  });

  return (
    <section id="masterplan" data-screen-label="Master plan" className="bg-paper px-[clamp(16px,4vw,56px)] pb-[clamp(64px,8vw,120px)] pt-[clamp(96px,11vw,168px)]">
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
        <div data-reveal className="rv flex-[1_1_560px]">
          <Eyebrow n="03" className="text-mute">Interactive master plan</Eyebrow>
          <h2 className="display mt-7 max-w-[13ch] text-[clamp(46px,6vw,100px)]">
            One Landscape. <em>A World of Possibilities.</em>
          </h2>
        </div>
        <div data-reveal className="rv flex-[0_1_380px]" style={{ transitionDelay: ".12s" }}>
          <p className="m-0 text-[17px] leading-[1.6] text-body [text-wrap:pretty]">Explore the development from a broader perspective, then zoom in to discover individual plots.</p>
        </div>
      </div>

      <div id="mp-module" className="mt-[clamp(40px,5vw,64px)] flex flex-wrap border border-ink/28 bg-paper">
        {/* ── Map ── */}
        <div
          ref={mapRef}
          onPointerDown={onMapDown}
          onDoubleClick={onMapDbl}
          className="relative flex-[1_1_560px] select-none overflow-hidden"
          style={{ height: mapH, background: pal.bg, cursor: dragging ? "grabbing" : "grab", touchAction: narrow && z <= 1.01 ? "pan-y" : "none" }}
        >
          <svg viewBox={vb} preserveAspectRatio="xMidYMid meet" role="group" aria-label="Illustrative master plan of a sample four-acre development with ten plots" className="absolute inset-0 block h-full w-full">
            <defs>
              <pattern id="mpGrid" width={20} height={20} patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke={pal.grid} strokeWidth={0.5} /></pattern>
              <pattern id="mpGridL" width={100} height={100} patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke={pal.gridMajor} strokeWidth={0.8} /></pattern>
              <pattern id="mpSold" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={5} height={5} fill={pal.soldBg} /><line x1={0} y1={0} x2={0} y2={5} stroke={pal.soldLine} strokeWidth={1.2} /></pattern>
              <pattern id="mpRes" width={6} height={6} patternUnits="userSpaceOnUse"><rect width={6} height={6} fill={pal.resBg} /><circle cx={3} cy={3} r={0.9} fill={pal.resDot} /></pattern>
              <pattern id="mpWater" width={14} height={7} patternUnits="userSpaceOnUse"><rect width={14} height={7} fill={pal.swm} /><path d="M 1 4 Q 4.5 2 8 4" fill="none" stroke={pal.inkSoft} strokeWidth={0.5} /></pattern>
            </defs>
            <rect x={-2000} y={-2000} width={4500} height={4500} fill={pal.bg} />
            <rect x={-2000} y={-2000} width={4500} height={4500} fill="url(#mpGrid)" />
            <rect x={-2000} y={-2000} width={4500} height={4500} fill="url(#mpGridL)" />
            <g fill="none" stroke={pal.contour}>
              {PLAN_CONTOURS.map((c, i) => <path key={i} d={c.d} strokeWidth={c.w} />)}
            </g>
            <path d="M 0 26 L 0 -400 M 452 0 L 446 -400 M 0 400 L -600 400 M 460 400 L 1100 400 M 0 200 L -600 214 M 456 210 L 1100 200" fill="none" stroke={pal.inkSoft} strokeWidth={0.6} strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
            <rect x={-2000} y={400} width={4500} height={60} fill={pal.row} />
            <rect x={-2000} y={414} width={4500} height={32} fill={pal.pave} />
            <path d="M -2000 400 L 2500 400 M -2000 460 L 2500 460" stroke={pal.ink} strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
            <path d="M -2000 430 L 2500 430" stroke={pal.inkSoft} strokeWidth={0.7} strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
            <g fill={pal.tree} stroke={pal.inkSoft} strokeWidth={0.4}>
              {TREES.map((t, i) => <circle key={i} cx={t.x} cy={t.y} r={t.r} vectorEffect="non-scaling-stroke" />)}
            </g>
            <path d={SITE.swm} fill="url(#mpWater)" stroke={pal.ink} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            <path d={SITE.row} fill={pal.row} stroke={pal.ink} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            <path d={SITE.pave} fill={pal.pave} />
            <path d="M 189 414 Q 209 414 209 394 L 209 414 Z M 253 414 Q 233 414 233 394 L 233 414 Z" fill={pal.pave} />
            <circle cx={221} cy={178} r={13} fill={pal.avail} stroke={pal.ink} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
            <path d="M 221 412 L 221 200" stroke={pal.inkSoft} strokeWidth={0.7} strokeDasharray="8 6" vectorEffect="non-scaling-stroke" />

            <g>
              {lots.map(({ l, vis, isSel, fill }) => (
                <path
                  key={l.id}
                  d={l.d}
                  fill={fill}
                  stroke={pal.ink}
                  strokeWidth={0.9}
                  vectorEffect="non-scaling-stroke"
                  opacity={vis ? 1 : 0.22}
                  tabIndex={0}
                  role="button"
                  aria-label={`Plot ${l.id}, ${fmt(l.area)} square feet, ${STATUS[l.status].label}`}
                  aria-pressed={isSel}
                  onClick={() => !justDragged.current && setSelected(l.id)}
                  onMouseEnter={() => setHover(l.id)}
                  onMouseLeave={() => setHover((h) => (h === l.id ? null : h))}
                  onFocus={() => setHover(l.id)}
                  onBlur={() => setHover((h) => (h === l.id ? null : h))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pick(l.id);
                    }
                  }}
                  className="cursor-pointer outline-none transition-[fill,opacity] duration-300"
                />
              ))}
            </g>
            <path d="M 20 25 L 20 338 M 20 34.85 L 442 10.6 M 442.04 2 L 450 400" fill="none" stroke={pal.inkSoft} strokeWidth={0.7} strokeDasharray="4 3" pointerEvents="none" vectorEffect="non-scaling-stroke" />
            <path d={SITE.boundary} fill="none" stroke={pal.ink} strokeWidth={1.8} strokeDasharray="16 4 3 4" vectorEffect="non-scaling-stroke" pointerEvents="none" />
            <g fill={pal.bg} stroke={pal.ink} strokeWidth={0.9} pointerEvents="none">
              {[[0, 26], [452, 0], [460, 400], [0, 400]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={3.2} vectorEffect="non-scaling-stroke" />)}
            </g>
            {hov && hov.id !== sel?.id && <path d={hov.d} fill="none" stroke={pal.ink} strokeWidth={2.2} vectorEffect="non-scaling-stroke" pointerEvents="none" />}
            {sel && <path d={sel.d} fill={pal.selFill} stroke={pal.sel} strokeWidth={3.2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" pointerEvents="none" />}
            <g pointerEvents="none">
              {lots.map(({ l, vis, isSel, sub }) => (
                <g key={l.id} transform={`translate(${l.cx} ${(l.cy - 6 * k).toFixed(2)}) scale(${k.toFixed(3)})`} opacity={vis ? 1 : 0.35}>
                  <circle r={10.5} fill={pal.labelBg} stroke={isSel ? pal.sel : pal.ink} strokeWidth={isSel ? 2.2 : 0.9} vectorEffect="non-scaling-stroke" />
                  <text y={4.2} textAnchor="middle" className="serif" fontSize={12.5} fill={pal.ink}>{pad(l.id)}</text>
                  <text y={20} textAnchor="middle" className="mono" fontSize={6.4} letterSpacing={0.5} fill={pal.ink}>{sub}</text>
                </g>
              ))}
            </g>
            <g pointerEvents="none" className="mono" fill={pal.inkSoft} letterSpacing={0.6}>
              <text x={221} y={330} textAnchor="middle" fontSize={6.2} fill={pal.ink} transform="rotate(-90 221 330)">[LANE NAME] · 50′ ROW</text>
              <text x={560} y={433} textAnchor="middle" fontSize={6.6} fill={pal.ink}>[COUNTY ROAD] · PUBLIC RIGHT-OF-WAY</text>
              <text x={-80} y={433} textAnchor="middle" fontSize={6.6} fill={pal.ink}>[COUNTY ROAD]</text>
              <text x={98} y={367} textAnchor="middle" fontSize={6.6} fill={pal.ink}>STORMWATER AREA</text>
              <text x={98} y={377} textAnchor="middle" fontSize={5.4}>COMMON · ILLUSTRATIVE</text>
              <text x={12} y={260} textAnchor="middle" fontSize={5} transform="rotate(-90 12 260)">20′ D&amp;U EASEMENT</text>
              <text x={447} y={300} textAnchor="middle" fontSize={5} transform="rotate(90 447 300)">10′ UTILITY EASEMENT</text>
              <text x={226} y={-6} textAnchor="middle" fontSize={6.4} transform="rotate(-3.3 226 -6)">± 452′</text>
              <text x={474} y={200} textAnchor="middle" fontSize={6.4} transform="rotate(90 474 200)">± 400′</text>
              <text x={-30} y={300} textAnchor="middle" fontSize={6.4} transform="rotate(-90 -30 300)">± 374′</text>
              <text x={40} y={-26} fontSize={5.4}>EXISTING TREE LINE · ADJACENT · ILLUSTRATIVE</text>
              <text x={-60} y={150} textAnchor="middle" fontSize={5.4} transform="rotate(-90 -60 150)">ADJACENT PARCEL</text>
              <text x={500} y={110} textAnchor="middle" fontSize={5.4} transform="rotate(90 500 110)">ADJACENT PARCEL</text>
              <path d="M 221 448 L 221 466" stroke={pal.ink} strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
              <text x={221} y={476} textAnchor="middle" fontSize={6.6} fill={pal.ink}>PRIMARY SITE ACCESS</text>
            </g>
            <path d="M 221 392 L 226.5 403 L 215.5 403 Z" fill={pal.sel} pointerEvents="none" />
          </svg>

          <div data-map-ui className="absolute left-3.5 top-3.5 flex flex-col border border-ink/30 bg-chalk">
            <MapBtn label="Zoom in" disabled={z >= MAX_Z - 0.01} onClick={() => zoomAt(1.6, mapSize.w / 2, mapSize.h / 2, true)} className="border-b border-ink/20 text-xl">+</MapBtn>
            <MapBtn label="Zoom out" disabled={z <= 1.01} onClick={() => zoomAt(1 / 1.6, mapSize.w / 2, mapSize.h / 2, true)} className="border-b border-ink/20 text-xl">−</MapBtn>
            <MapBtn label="Reset view" onClick={() => animateTo(HOME)} className="mono text-[8.5px] tracking-[.08em]">RESET</MapBtn>
          </div>
          <div data-map-ui aria-live="polite" className="kicker pointer-events-none absolute right-3.5 top-3.5 max-w-[calc(100%-90px)] border border-ink/30 bg-chalk px-3.5 py-2.5 !tracking-[.12em] text-ink">
            {readLot ? `Plot ${pad(readLot.id)} · ${fmt(readLot.area)} sf · ${STATUS[readLot.status].label}` : narrow ? "Tap a plot for details" : "Hover a plot · click for details"}
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-end gap-[18px]" style={{ color: pal.ink }}>
            <svg width={22} height={46} viewBox="0 0 22 46" aria-label="North">
              <path d="M 11 3 L 17 28 L 11 24 Z" fill="currentColor" />
              <path d="M 11 3 L 5 28 L 11 24 Z" fill="none" stroke="currentColor" strokeWidth={1} />
              <text x={11} y={43} textAnchor="middle" className="mono" fontSize={10} fill="currentColor">N</text>
            </svg>
            <div className="flex flex-col gap-[5px]">
              <div className="flex h-1.5 border border-current" style={{ width: Math.round(scaleFt * p) }}>
                <span className="flex-1 bg-current" />
                <span className="flex-1" />
              </div>
              <div className="mono flex justify-between text-[9.5px] tracking-[.06em]" style={{ width: Math.round(scaleFt * p) }}>
                <span>0</span>
                <span>{scaleFt} FT</span>
              </div>
            </div>
          </div>
          <div className="mono pointer-events-none absolute bottom-3.5 right-3.5 max-w-[min(270px,calc(100%-200px))] px-3 py-[9px] text-[9px] uppercase leading-[1.5] tracking-[.08em]" style={{ border: `1px solid ${pal.ink}`, color: pal.ink, background: pal.bg }}>
            Illustrative sample layout. Not a survey, recorded plat, or approved site plan.
          </div>
          <div className="kicker pointer-events-none absolute bottom-[72px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink px-4 py-2.5 !tracking-[.1em] text-ivory transition-opacity duration-300" style={{ opacity: wheelHint ? 1 : 0 }}>
            Hold Ctrl or ⌘ and scroll to zoom
          </div>
        </div>

        {/* ── Panel (side on desktop, bottom sheet on mobile when a plot is selected) ── */}
        <div
          className="flex flex-col overflow-hidden bg-paper"
          style={{
            flex: narrow ? "1 1 100%" : "0 0 400px",
            position: sheet ? "fixed" : "relative",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: sheet ? 40 : "auto",
            maxHeight: sheet ? "76svh" : narrow ? "none" : mapH,
            height: narrow ? "auto" : mapH,
            borderLeft: narrow ? 0 : "1px solid rgba(29,33,31,.28)",
            borderTop: narrow && !sheet ? "1px solid rgba(29,33,31,.28)" : sheet ? "1px solid #1d211f" : 0,
            boxShadow: sheet ? "0 -24px 60px rgba(15,28,22,.22)" : "none",
            animation: sheet ? "fl-up .45s cubic-bezier(.2,.7,.2,1)" : "none",
          }}
        >
          {sel ? (
            <div className="flex min-h-0 flex-1 flex-col" style={{ animation: "fl-in .5s cubic-bezier(.2,.7,.2,1)" }}>
              {narrow && (
                <div className="flex justify-center pt-2.5">
                  <span className="h-[3px] w-10 bg-ink/25" />
                </div>
              )}
              <div className="flex items-center justify-between gap-3 border-b border-ink/16 px-5 py-3.5">
                <button type="button" onClick={() => setSelected(null)} className="kicker cursor-pointer border-0 bg-transparent px-0 py-2 text-ink hover:text-copper-dark">← All plots</button>
                <div className="flex gap-1.5">
                  <SquareBtn label="Previous plot" onClick={() => step(-1)}>‹</SquareBtn>
                  <SquareBtn label="Next plot" onClick={() => step(1)}>›</SquareBtn>
                  <button type="button" onClick={() => setSelected(null)} aria-label="Close plot details" className="h-9 w-9 cursor-pointer border border-ink bg-ink text-[15px] text-ivory hover:bg-copper-dark">×</button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-6 pb-2 pt-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="kicker !tracking-[.16em] text-mute">Plot</div>
                    <div className="serif mt-2 text-[clamp(84px,8vw,116px)] leading-[.82] tracking-[-.03em]">{pad(sel.id)}</div>
                  </div>
                  <StatusBadge status={sel.status} sw={swFor(sel.status)} />
                </div>
                <div className="mt-6 border-t border-ink">
                  {[
                    ["Lot area", `${fmt(sel.area)} sq ft`, `${acres(sel.area)} acres · approximate`],
                    ["Asking price", sel.price ? `$${fmt(sel.price)}` : "To be announced", "USD · placeholder"],
                    ["Lot type", sel.type, ""],
                    ["Access", sel.access, ""],
                    ["Easements", sel.easement, "Illustrative"],
                    ["Documents", "Survey and plat not yet available", "Placeholder"],
                  ].map(([key, val, sub]) => (
                    <div key={key} className="grid grid-cols-[118px_1fr] gap-3.5 border-b border-ink/14 py-[13px]">
                      <span className="mono pt-[3px] text-[10px] uppercase tracking-[.13em] text-mute">{key}</span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] leading-[1.4]">{val}</span>
                        {sub && <span className="text-[12.5px] text-mute">{sub}</span>}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mb-2 mt-4 text-[12.5px] leading-[1.55] text-mute">Sample data for demonstration. Boundaries, areas and status are illustrative and do not represent recorded or approved parcels.</p>
              </div>
              <div className="flex flex-col gap-2.5 border-t border-ink/16 px-6 pb-[22px] pt-4">
                {sel.status !== "sold" ? (
                  <button type="button" onClick={() => openEnq(sel.id)} className="btn btn-ink w-full justify-between !px-5">
                    Enquire About Plot {pad(sel.id)} <span aria-hidden>→</span>
                  </button>
                ) : (
                  <>
                    <button type="button" disabled className="w-full cursor-not-allowed border border-dashed border-ink/40 bg-transparent px-5 py-[17px] text-left text-sm text-[#6b6f69]">This plot is sold</button>
                    <button type="button" onClick={() => openEnq(sel.id)} className="cursor-pointer border-0 bg-transparent px-0 py-1 text-left text-[13.5px] text-ink underline underline-offset-4 hover:text-copper-dark">Ask about similar plots</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-ink/16 px-6 py-[22px]">
                <div className="kicker flex justify-between gap-3 !tracking-[.16em] text-mute">
                  <span>Sheet MP-01</span>
                  <span>Illustrative</span>
                </div>
                <div className="serif mt-3 text-[30px] leading-[1.05]">{DEV_FACTS.name}</div>
                <div className="mt-4 grid grid-cols-3 border-t border-ink/16">
                  <MiniStat k="Site" v={`±${DEV_FACTS.acres} ac`} />
                  <MiniStat k="Plots" v={String(DEV_FACTS.count)} border />
                  <MiniStat k="Status" v={DEV_FACTS.statusShort} border small />
                </div>
              </div>
              <div className="px-6 pb-1.5 pt-[18px]">
                <div className="kicker !tracking-[.16em] text-mute">Availability · filter</div>
                <div role="group" aria-label="Filter plots by availability" className="mt-2 flex flex-col">
                  {(["available", "reserved", "sold"] as const).map((st) => {
                    const on = mpFilter[st];
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setMpFilter((f) => ({ ...f, [st]: !f[st] }))}
                        aria-pressed={on}
                        className="flex w-full cursor-pointer items-center gap-3 border-0 border-b border-ink/12 bg-transparent py-[11px] text-left transition-opacity duration-300"
                        style={{ opacity: on ? 1 : 0.5 }}
                      >
                        <Swatch fill={swFor(st)} size={16} />
                        <span className="flex-1 text-[14.5px]">{STATUS[st].label}</span>
                        <span className="mono text-[11px] text-mute">{pad(counts[st])}</span>
                        <span className="h-4 w-4 border border-ink text-center text-[11px] leading-[14px] text-ivory" style={{ background: on ? "#1d211f" : "transparent" }}>{on ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-6 pb-5 pt-2">
                <div className="kicker pb-1 pt-2.5 !tracking-[.16em] text-mute">Plots</div>
                {lots.map(({ l, vis, fill }) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => pick(l.id)}
                    onMouseEnter={() => setHover(l.id)}
                    onMouseLeave={() => setHover((h) => (h === l.id ? null : h))}
                    className="grid w-full cursor-pointer grid-cols-[14px_64px_1fr_auto] items-center gap-3 border-0 border-b border-ink/10 bg-transparent py-[11px] pr-1.5 text-left hover:bg-ink/[.045]"
                    style={{ opacity: vis ? 1 : 0.22 }}
                  >
                    <Swatch fill={fill} size={14} />
                    <span className="serif text-[21px] leading-none">Plot {pad(l.id)}</span>
                    <span className="text-[13px] text-body">{fmt(l.area)} sq ft</span>
                    <span className="mono text-[10px] uppercase tracking-[.12em]" style={{ color: STATUS[l.status].ink }}>{STATUS[l.status].label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mono mt-3.5 flex flex-wrap justify-between gap-x-6 gap-y-2 text-[10px] uppercase tracking-[.12em] text-mute">
        <span>Drag to pan · Double-click or Ctrl/⌘ + scroll to zoom · Tab to step through plots</span>
        <span>Status shown is sample data</span>
      </div>
    </section>
  );
}

/** Pattern fills (reserved/sold) live in the map SVG; this swatch carries its own copies so it renders anywhere. */
function Swatch({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} aria-hidden>
      <SwatchDefs />
      <rect x={0.5} y={0.5} width={size - 1} height={size - 1} fill={fill.replace("#mp", "#sw")} stroke="#1d211f" strokeWidth={1} />
    </svg>
  );
}

function SwatchDefs() {
  const pal = PAL[PLAN_STYLE];
  return (
    <defs>
      <pattern id="swSold" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={5} height={5} fill={pal.soldBg} /><line x1={0} y1={0} x2={0} y2={5} stroke={pal.soldLine} strokeWidth={1.2} /></pattern>
      <pattern id="swRes" width={6} height={6} patternUnits="userSpaceOnUse"><rect width={6} height={6} fill={pal.resBg} /><circle cx={3} cy={3} r={0.9} fill={pal.resDot} /></pattern>
    </defs>
  );
}

function StatusBadge({ status, sw }: { status: LotStatus; sw: string }) {
  const ink = STATUS[status].ink;
  return (
    <div className="kicker flex items-center gap-[9px] px-3 py-2 !tracking-[.14em]" style={{ border: `1px solid ${ink}`, color: ink }}>
      <svg width={12} height={12} aria-hidden>
        <SwatchDefs />
        <rect width={12} height={12} fill={sw.replace("#mp", "#sw")} stroke="currentColor" strokeWidth={1} />
      </svg>
      {STATUS[status].label}
    </div>
  );
}

function MiniStat({ k, v, border, small }: { k: string; v: string; border?: boolean; small?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 pt-3 ${border ? "border-l border-ink/16 pl-3" : "pr-2.5"}`}>
      <span className="mono text-[9.5px] uppercase tracking-[.12em] text-mute">{k}</span>
      <span className={small ? "text-[13px] leading-[1.3]" : "text-[15px]"}>{v}</span>
    </div>
  );
}

function MapBtn({ label, onClick, disabled, className = "", children }: { label: string; onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`h-[42px] w-[42px] cursor-pointer border-0 bg-transparent leading-none text-ink hover:bg-[#ebe5d8] disabled:cursor-default disabled:opacity-30 ${className}`}
    >
      {children}
    </button>
  );
}

function SquareBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="h-9 w-9 cursor-pointer border border-ink/30 bg-transparent text-ink hover:bg-[#e5dfd2]">
      {children}
    </button>
  );
}
