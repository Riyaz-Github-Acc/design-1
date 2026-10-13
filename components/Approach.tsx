import { PILLARS, pad } from "@/lib/content";
import { Eyebrow } from "./ui";

const KEY = [
  { dash: "1.5 5", width: 2, cap: "round" as const, title: "Illustrative plan", body: "A concept drawing for orientation only. Boundaries and areas are approximate." },
  { dash: "12 6", width: 2, title: "Proposed layout", body: "Submitted or intended for submission to the local authority. Subject to change and approval." },
  { dash: undefined, width: 2.4, title: "Recorded or approved", body: "Matches an officially recorded plat or approved plan, with its reference number provided." },
];

export default function Approach() {
  return (
    <section id="approach" data-screen-label="Approach" className="bg-ivory px-[clamp(20px,4vw,56px)] py-[clamp(96px,11vw,168px)]">
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-7">
        <div data-reveal className="rv flex-[1_1_560px]">
          <Eyebrow n="06" className="text-mute">Our approach</Eyebrow>
          <h2 className="display mt-7 max-w-[12ch] text-[clamp(46px,6vw,100px)]">
            Every Boundary Has a <em>Purpose.</em>
          </h2>
        </div>
        <p data-reveal className="m-0 flex-[0_1_420px] text-[17px] leading-[1.6] text-body [text-wrap:pretty]" style={{ opacity: "var(--r,1)", transition: "opacity 1.1s ease .12s" }}>
          We present each development with the information a buyer needs to understand it, and we label every drawing by its status so it is clear what has been recorded or approved and what has not.
        </p>
      </div>

      <div className="mt-[clamp(48px,6vw,88px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] border-t border-ink">
        {PILLARS.map((t, i) => (
          <div
            key={t.title}
            data-reveal
            className="flex flex-col gap-4 border-b border-ink/16 pb-10 pr-7 pt-7"
            style={{
              opacity: "var(--r,1)",
              transform: "translateY(calc((1 - var(--r,1)) * 24px))",
              transition: `opacity 1s cubic-bezier(.2,.7,.2,1) ${(i % 3) * 0.1}s, transform 1s cubic-bezier(.2,.7,.2,1) ${(i % 3) * 0.1}s`,
            }}
          >
            <div className="flex items-center gap-3.5">
              <span className="mono text-[11px] tracking-[.14em] text-copper-dark">{pad(i + 1)}</span>
              <span className="h-px flex-1 bg-ink/14" />
            </div>
            <h3 className="serif m-0 text-[30px] leading-[1.05]">{t.title}</h3>
            <p className="m-0 max-w-[38ch] text-[15px] leading-[1.6] text-body [text-wrap:pretty]">{t.body}</p>
          </div>
        ))}
      </div>

      <div data-reveal className="mt-[clamp(56px,6vw,96px)] flex flex-wrap gap-x-14 gap-y-9 bg-sand p-[clamp(28px,4vw,56px)]" style={{ opacity: "var(--r,1)", transition: "opacity 1.2s ease" }}>
        <div className="flex-[1_1_260px]">
          <div className="kicker !tracking-[.16em] text-mute">Document status key</div>
          <div className="serif mt-3.5 text-[clamp(30px,3vw,42px)] leading-[1.02]">How to read our plans</div>
          <p className="m-0 mt-4 max-w-[34ch] text-[14.5px] leading-[1.6] text-body">Line style tells you what a drawing is. Every plan currently shown on this website is illustrative.</p>
        </div>
        <div className="grid flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-7">
          {KEY.map((k) => (
            <div key={k.title} className="flex flex-col gap-3">
              <svg width="100%" height={14} aria-hidden preserveAspectRatio="none">
                <line x1={0} y1={7} x2="100%" y2={7} stroke="#1d211f" strokeWidth={k.width} strokeDasharray={k.dash} strokeLinecap={k.cap} />
              </svg>
              <span className="text-[17px] font-medium">{k.title}</span>
              <span className="text-sm leading-[1.55] text-body">{k.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
