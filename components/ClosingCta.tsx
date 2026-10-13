"use client";

import { PHOTOS } from "@/lib/content";
import { useSite } from "@/lib/site-state";
import { Contours, Photo } from "./ui";

export default function ClosingCta() {
  const { showAvailable } = useSite();
  return (
    <section data-screen-label="Call to action" className="relative h-[min(100svh,980px)] min-h-[600px] overflow-hidden bg-pine text-ivory">
      <div data-reveal className="absolute inset-0" style={{ clipPath: "inset(calc((1 - var(--r,1)) * 6%))", transition: "clip-path 1.8s cubic-bezier(.7,0,.2,1)" }}>
        <div className="absolute inset-0" style={{ transform: "scale(calc(1.1 - var(--r,1) * 0.1))", transition: "transform 3s cubic-bezier(.2,.7,.2,1)" }}>
          <Contours />
          <Photo src={PHOTOS.cta.src} alt={PHOTOS.cta.alt} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(12,24,18,.1) 30%,rgba(12,24,18,.72) 100%)" }} />
      <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-end p-[clamp(40px,6vw,88px)_clamp(20px,4vw,56px)]">
        <h2
          data-reveal
          className="display max-w-[14ch] text-[clamp(48px,7.4vw,128px)] !leading-[.92]"
          style={{ opacity: "var(--r,1)", transform: "translateY(calc((1 - var(--r,1)) * 40px))", transition: "opacity 1.2s ease .3s, transform 1.4s cubic-bezier(.2,.7,.2,1) .3s" }}
        >
          Your Next Chapter Starts With a <em>Piece of Land.</em>
        </h2>
        <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-5">
          <p className="m-0 max-w-[40ch] text-[17px] leading-[1.6] text-ivory/88">Explore the development. Understand the layout. Find a plot that fits your vision.</p>
          <a href="#masterplan" onClick={showAvailable} className="btn btn-ivory pointer-events-auto !px-[26px] !py-[18px]">
            Explore Available Plots <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
