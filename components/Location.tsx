import { CONTEXT, PHOTOS } from "@/lib/content";
import { Eyebrow, Photo } from "./ui";

// [marker x, marker y, label, note, label x, label y, anchor] — placeholders until verified map data exists
const PLACES: [number, number, string, string, number, number, "start" | "end" | "middle"][] = [
  [410, 193, "[NEAREST TOWN]", "DISTANCE TO BE VERIFIED", 424, 188, "start"],
  [128, 210, "[REGIONAL CITY]", "TO BE VERIFIED", 114, 205, "end"],
  [292, 360, "[HIGHWAY ACCESS]", "TO BE VERIFIED", 278, 380, "end"],
  [512, 390, "[NATURAL FEATURE]", "TO BE VERIFIED", 512, 414, "middle"],
];

export default function Location() {
  return (
    <section id="location" data-screen-label="Location" className="bg-evergreen px-[clamp(20px,4vw,56px)] py-[clamp(96px,11vw,168px)] text-ivory">
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-7">
        <div data-reveal className="rv flex-[1_1_520px]">
          <Eyebrow n="05" className="text-ivory/70">Location &amp; surroundings</Eyebrow>
          <h2 className="display mt-7 text-[clamp(46px,5.6vw,92px)]">
            The Lay of <em>the Land.</em>
          </h2>
        </div>
        <p data-reveal className="m-0 flex-[0_1_400px] text-[16.5px] leading-[1.6] text-ivory/80 [text-wrap:pretty]" style={{ opacity: "var(--r,1)", transition: "opacity 1.1s ease .12s" }}>
          Where a development sits shapes how it is lived in. Location details and travel distances are published once they have been verified against current map data.
        </p>
      </div>

      <div className="mt-[clamp(48px,6vw,88px)] flex flex-wrap gap-[clamp(32px,5vw,80px)]">
        <div data-reveal className="relative flex-[1.2_1_480px] border border-ivory/18" style={{ opacity: "var(--r,1)", transition: "opacity 1.4s ease" }}>
          <svg viewBox="0 0 640 600" role="img" aria-label="Location study diagram, awaiting verified map data" className="block h-auto w-full">
            <g fill="none" stroke="#f3efe6">
              <line x1={320} y1={0} x2={320} y2={600} strokeOpacity={0.14} />
              <line x1={0} y1={300} x2={640} y2={300} strokeOpacity={0.14} />
              <circle cx={320} cy={300} r={66} strokeOpacity={0.5} />
              <circle cx={320} cy={300} r={140} strokeOpacity={0.32} strokeDasharray="2 5" />
              <circle cx={320} cy={300} r={212} strokeOpacity={0.22} />
              <circle cx={320} cy={300} r={282} strokeOpacity={0.14} strokeDasharray="1 6" />
              <path d="M 312.5 292 L 327 291.2 L 327.3 304 L 312.5 304 Z" stroke="#d9a777" strokeWidth={1.4} />
            </g>
            <g fill="#f3efe6" className="mono" fontSize={10} letterSpacing={1.5} fillOpacity={0.6}>
              <text x={390} y={296}>1 MI</text>
              <text x={464} y={296}>5 MI</text>
              <text x={536} y={296}>10 MI</text>
              <text x={606} y={296} textAnchor="end">25 MI</text>
              <text x={320} y={16} textAnchor="middle" fillOpacity={0.9}>N</text>
            </g>
            <g stroke="#cdb995" fill="#13241d">
              {PLACES.map(([x, y]) => <rect key={`${x}${y}`} x={-4.5} y={-4.5} width={9} height={9} transform={`translate(${x} ${y}) rotate(45)`} />)}
            </g>
            <g className="mono" fontSize={11} letterSpacing={1.2} fill="#f3efe6">
              {PLACES.map(([, , name, note, lx, ly, anchor]) => (
                <g key={name}>
                  <text x={lx} y={ly} textAnchor={anchor}>{name}</text>
                  <text x={lx} y={ly + 16} textAnchor={anchor} fillOpacity={0.55} fontSize={9.5}>{note}</text>
                </g>
              ))}
            </g>
            <g className="mono" fontSize={9.5} letterSpacing={1.5} fill="#d9a777">
              <text x={334} y={322}>SITE</text>
              <text x={20} y={584}>LOCATION STUDY · AWAITING VERIFIED MAP DATA</text>
            </g>
          </svg>
        </div>
        <div className="flex flex-[1_1_360px] flex-col gap-9">
          <div className="border-t border-ivory/50">
            {CONTEXT.map((c) => (
              <div key={c.k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-1.5 border-b border-ivory/16 py-[18px]">
                <span className="serif text-2xl leading-[1.1]">{c.k}</span>
                <span className="mono pt-1.5 text-[10px] uppercase tracking-[.12em] text-copper-light">{c.d}</span>
                <span className="col-span-full text-[14.5px] text-ivory/72">{c.v}</span>
              </div>
            ))}
          </div>
          <div data-reveal className="relative aspect-[4/3] overflow-hidden" style={{ clipPath: "inset(calc((1 - var(--r,1)) * 12%) 0 0 0)", transition: "clip-path 1.5s cubic-bezier(.7,0,.2,1)" }}>
            <Photo src={PHOTOS.location.src} alt={PHOTOS.location.alt} sizes="(min-width: 900px) 40vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
