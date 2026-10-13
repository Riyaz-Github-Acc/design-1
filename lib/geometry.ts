/**
 * Deterministic generative linework: topographic contours and the adjacent tree line.
 * Seeded, so server and client render identical paths.
 */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function smooth(pts: [number, number][]) {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export interface Contour { d: string; o: number; w: number }

function contours(o: { x0: number; x1: number; y0: number; y1: number; step: number; slope: number; seed: number; amp: number; freq: number; o1: number; o2: number }): Contour[] {
  const { x0, x1, y0, y1, step, slope, seed, amp, freq, o1, o2 } = o;
  const r = rng(seed), p0 = r() * 6.28, p1 = r() * 6.28, out: Contour[] = [];
  const top = y0 - Math.max(0, slope) * (x1 - x0) - amp * 2;
  const bot = y1 - Math.min(0, slope) * (x1 - x0) + amp * 2;
  const n = Math.ceil((bot - top) / step);
  for (let k = 0; k < n; k++) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 26; i++) {
      const x = x0 + ((x1 - x0) * i) / 26;
      pts.push([x, top + k * step + slope * (x - x0) + amp * Math.sin(x * freq + p0 + k * 0.18) + amp * 0.5 * Math.sin(x * freq * 2.1 + p1 - k * 0.26)]);
    }
    out.push({ d: smooth(pts), o: k % 5 === 0 ? o1 : o2, w: k % 5 === 0 ? 1.1 : 0.7 });
  }
  return out;
}

function makeTrees() {
  const r = rng(7), t: { x: number; y: number; r: number }[] = [];
  for (let x = -40; x <= 500; x += 15 + r() * 6) {
    const rad = 6 + r() * 6;
    t.push({ x: +x.toFixed(1), y: +(26 - 0.0575 * x - 12 - rad * 0.4 - r() * 8).toFixed(1), r: +rad.toFixed(1) });
  }
  for (let y = 40; y <= 330; y += 16 + r() * 8) {
    const rad = 6 + r() * 5;
    t.push({ x: +(-14 - r() * 10).toFixed(1), y: +y.toFixed(1), r: +rad.toFixed(1) });
  }
  for (let y = 20; y <= 220; y += 16 + r() * 8) {
    const rad = 6 + r() * 5;
    t.push({ x: +(474 + r() * 10).toFixed(1), y: +y.toFixed(1), r: +rad.toFixed(1) });
  }
  return t;
}

export const HERO_CONTOURS = contours({ x0: -60, x1: 1660, y0: -60, y1: 1060, step: 30, slope: -0.26, seed: 11, amp: 52, freq: 0.0042, o1: 0.17, o2: 0.07 });
export const PLAN_CONTOURS = contours({ x0: -500, x1: 1000, y0: -400, y1: 900, step: 18, slope: 0.2, seed: 5, amp: 26, freq: 0.009, o1: 1, o2: 1 });
export const TREES = makeTrees();
