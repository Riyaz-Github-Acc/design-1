/**
 * PROJECT DATA — illustrative sample. Replace with verified development details.
 *
 * Geometry is in feet on a ±4.05-acre sample parcel (x → east, y → south).
 * Everything rendered on the page — the hero overlay, the land-to-plots
 * sequence, the master plan and the plot cards — reads from this file.
 */

export const DEV = {
  name: "[Development Name]",
  location: "[City, State]",
  status: "[Status — to be confirmed]",
  statusShort: "[TBC]",
};

export const SITE = {
  boundary: "M 0 26 L 452 0 L 460 400 L 0 400 Z",
  row: "M 196 400 L 196 221.3 A 50 50 0 1 1 246 221.3 L 246 400 Z",
  pave: "M 209 414 L 209 214.06 A 38 38 0 1 1 233 214.06 L 233 414 Z",
  swm: "M 0 338 L 196 338 L 196 400 L 0 400 Z",
  areaSf: 176524,
};

export type LotStatus = "available" | "reserved" | "sold";

export interface Lot {
  id: number;
  d: string;
  area: number;
  cx: number;
  cy: number;
  status: LotStatus;
  type: string;
  access: string;
  easement: string;
  /** USD; null renders as "To be announced". */
  price: number | null;
}

const E_W = "20′ drainage & utility easement along rear line";
const E_E = "10′ utility easement along rear line";
const E_N = "Rear utility easement; adjacent tree line";

export const LOTS: Lot[] = [
  { id: 1, d: "M 0 280 L 196 280 L 196 338 L 0 338 Z", area: 11368, cx: 98, cy: 309, status: "available", type: "Interior lot", access: "Internal road frontage", easement: E_W, price: null },
  { id: 2, d: "M 0 221.3 L 196 221.3 L 196 280 L 0 280 Z", area: 11505, cx: 98, cy: 250.7, status: "reserved", type: "Interior lot", access: "Internal road frontage", easement: E_W, price: null },
  { id: 3, d: "M 0 221.3 L 196 221.3 A 50 50 0 0 1 172.7 165.06 L 0 118.8 Z", area: 13934, cx: 79.6, cy: 181.1, status: "available", type: "Cul-de-sac lot", access: "Cul-de-sac frontage", easement: E_W, price: null },
  { id: 4, d: "M 0 118.8 L 172.7 165.06 A 50 50 0 0 1 196 134.7 L 128.96 18.58 L 0 26 Z", area: 19893, cx: 90.6, cy: 87.3, status: "available", type: "Corner cul-de-sac lot", access: "Cul-de-sac frontage", easement: E_N, price: null },
  { id: 5, d: "M 196 134.7 A 50 50 0 0 1 246 134.7 L 319.4 7.65 L 128.96 18.58 Z", area: 14373, cx: 223.3, cy: 61, status: "sold", type: "Cul-de-sac lot", access: "Cul-de-sac frontage", easement: E_N, price: null },
  { id: 6, d: "M 246 134.7 L 319.4 7.65 L 452 0 L 454.31 115.49 L 269.3 165.06 A 50 50 0 0 0 246 134.7 Z", area: 23482, cx: 360.2, cy: 78.6, status: "available", type: "Corner cul-de-sac lot", access: "Cul-de-sac frontage", easement: E_N, price: null },
  { id: 7, d: "M 246 221.3 L 456.43 221.3 L 454.31 115.49 L 269.3 165.06 A 50 50 0 0 1 246 221.3 Z", area: 15329, cx: 370.2, cy: 180.1, status: "reserved", type: "Cul-de-sac lot", access: "Cul-de-sac frontage", easement: E_E, price: null },
  { id: 8, d: "M 246 221.3 L 456.43 221.3 L 457.62 280.9 L 246 280.9 Z", area: 12577, cx: 351.5, cy: 251.1, status: "available", type: "Interior lot", access: "Internal road frontage", easement: E_E, price: null },
  { id: 9, d: "M 246 280.9 L 457.62 280.9 L 458.81 340.5 L 246 340.5 Z", area: 12648, cx: 352.1, cy: 310.7, status: "sold", type: "Interior lot", access: "Internal road frontage", easement: E_E, price: null },
  { id: 10, d: "M 246 340.5 L 458.81 340.5 L 460 400 L 246 400 Z", area: 12698, cx: 352.7, cy: 370.3, status: "available", type: "Corner lot", access: "Internal road; frontage on [County Road]", easement: E_E, price: null },
];

export const STATUS: Record<LotStatus, { label: string; ink: string }> = {
  available: { label: "Available", ink: "#2f5242" },
  reserved: { label: "Reserved", ink: "#7a5a1c" },
  sold: { label: "Sold", ink: "#5f5e59" },
};

export const STAGES = [
  { n: "01", title: "The Original Land", desc: "Every development begins as a single parcel, defined by its recorded boundary." },
  { n: "02", title: "The Development Plan", desc: "A proposed layout introduces roads, access, shared areas and individual plot lines. Layouts and approvals vary by project and jurisdiction." },
  { n: "03", title: "Explore Individual Plots", desc: "Each plot carries its own area, frontage and status, so it can be understood on its own terms." },
  { n: "04", title: "Find Your Plot", desc: "Open the interactive master plan to compare plots and enquire about the one that fits." },
];

export const PILLARS = [
  { title: "Site layout & parcel boundaries", body: "Plot lines and the overall site boundary, drawn to scale, with areas stated in square feet and acres." },
  { title: "Access & road layout", body: "How each plot is reached, including internal roads, access points and connections to public rights-of-way." },
  { title: "Property documentation", body: "Surveys, plats, title materials and disclosures, listed for each plot as they become available." },
  { title: "Zoning & land use", body: "The applicable zoning designation and permitted uses, with a reference to the governing local authority." },
  { title: "Easements & restrictions", body: "Recorded easements, covenants and restrictions that affect a plot, identified on the plan where they apply." },
  { title: "Development & approval status", body: "Where each project stands, stated plainly. No plot is described as approved or buildable without documentation." },
];

export const CONTEXT = [
  { k: "Nearby towns & cities", v: "[Town names]", d: "To be verified" },
  { k: "Roads & transport", v: "[Highways, routes, transit]", d: "To be verified" },
  { k: "Local amenities", v: "[Schools, services, retail]", d: "To be verified" },
  { k: "Natural features", v: "[Rivers, parks, terrain]", d: "To be verified" },
];

/** Master-plan colourways. The page uses `evergreen`; `ivory` is kept as an alternative. */
export const PAL = {
  ivory: { bg: "#efeae0", grid: "rgba(29,33,31,.055)", gridMajor: "rgba(29,33,31,.1)", ink: "#1d211f", inkSoft: "rgba(29,33,31,.5)", contour: "rgba(29,33,31,.09)", row: "#f7f4ed", pave: "#dcd5c5", avail: "#d3dccd", availHover: "#b9c8b1", resBg: "#ecdcb6", resDot: "#a8823a", soldBg: "#dedbd3", soldLine: "#a3a098", swm: "#dfe3d6", labelBg: "#f7f4ed", sel: "#b4703f", selFill: "rgba(180,112,63,.14)", tree: "rgba(61,92,78,.16)" },
  evergreen: { bg: "#15271f", grid: "rgba(243,239,230,.045)", gridMajor: "rgba(243,239,230,.09)", ink: "#efeae0", inkSoft: "rgba(239,234,224,.55)", contour: "rgba(243,239,230,.08)", row: "#1c3128", pave: "#283d33", avail: "#2b4a3c", availHover: "#3a6150", resBg: "#4a4127", resDot: "#d1aa5c", soldBg: "#2b302c", soldLine: "#626760", swm: "#1f3a30", labelBg: "#15271f", sel: "#d9a777", selFill: "rgba(217,167,119,.16)", tree: "rgba(210,220,200,.1)" },
} as const;

export const PLAN_STYLE: keyof typeof PAL = "evergreen";
/** Show "AVAILABLE / RESERVED / SOLD" under each plot number on the master plan. */
export const SHOW_STATUS_LABELS = true;
/** Draw the survey overlay (boundary, ticks, coordinates) over the hero photograph. */
export const SHOW_SURVEY_OVERLAY = true;

/** Default master-plan viewBox, in feet. */
export const VB0 = { x: -50, y: -50, w: 560, h: 540 };

const unsplash = (id: string, w = 2400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * Stand-in photography (Unsplash). Each slot notes the shot the design calls for —
 * replace with real photography of the development.
 */
export const PHOTOS = {
  hero: { src: unsplash("1523741543316-beb7fc7023d8"), alt: "Rolling open land seen from above", brief: "Aerial photograph: the full parcel, wide and high" },
  featured: { src: unsplash("1476231682828-37e571bc172f", 2000), alt: "Aerial view of a road winding through woodland", brief: "Aerial photograph of the development site" },
  sequence: { src: unsplash("1473773508845-188df298d2d1", 2000), alt: "Top-down view of tree canopy", brief: "Top-down aerial of the same parcel" },
  location: { src: unsplash("1500534314209-a25ddb2bd429", 1600), alt: "Soft layered hills fading into haze", brief: "Photograph of the surrounding landscape" },
  cta: { src: unsplash("1500382017468-9049fed747ef"), alt: "Open field at sunset with a low sun", brief: "Landscape photograph: open land, low sun" },
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const fmt = (n: number) => n.toLocaleString("en-US");
export const acres = (a: number) => (a / 43560).toFixed(2);

const sizes = LOTS.map((l) => l.area);
export const DEV_FACTS = {
  ...DEV,
  acres: acres(SITE.areaSf),
  count: LOTS.length,
  range: `${acres(Math.min(...sizes))}–${acres(Math.max(...sizes))} ac`,
};
