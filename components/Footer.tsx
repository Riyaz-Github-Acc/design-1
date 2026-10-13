"use client";

import { useSite } from "@/lib/site-state";
import { Wordmark } from "./ui";

export default function Footer() {
  const { openEnq } = useSite();
  return (
    <footer id="about" data-screen-label="Footer" className="bg-deep px-[clamp(20px,4vw,56px)] pb-9 pt-[clamp(72px,8vw,120px)] text-[#e9e4d8]">
      <div className="flex flex-wrap justify-between gap-x-16 gap-y-12">
        <div className="max-w-[440px] flex-[1_1_340px]">
          <Wordmark size="lg" />
          <p className="serif m-0 mt-7 text-[26px] leading-[1.25] text-ivory">
            We acquire and plan land, then present each development with clear boundaries and an honest account of its status.
          </p>
          <div className="mt-7 text-sm leading-[1.8] text-[#e9e4d8]/70">
            [Street Address]
            <br />
            [City, State ZIP]
            <br />
            [Phone] · [Email]
          </div>
        </div>
        <div className="grid flex-[1_1_420px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8">
          <FooterNav label="Explore" links={[["#development", "Developments"], ["#plots", "Available Plots"], ["#masterplan", "Master Plan"]]} />
          <nav aria-label="Company" className="flex flex-col gap-3 text-[14.5px]">
            <NavHead>Company</NavHead>
            <a href="#about" className="hover:text-copper-light">About</a>
            <a href="#approach" className="hover:text-copper-light">Our Approach</a>
            <button type="button" onClick={() => openEnq()} className="cursor-pointer border-0 bg-transparent p-0 text-left text-[14.5px] text-inherit hover:text-copper-light">Contact</button>
          </nav>
          <FooterNav label="Legal" links={[["#about", "Privacy Policy"], ["#about", "Terms of Use"], ["#disclosures", "Property Disclosures"]]} />
        </div>
      </div>
      <div id="disclosures" className="mt-[clamp(56px,6vw,88px)] flex flex-wrap justify-between gap-x-16 gap-y-6 border-t border-[#e9e4d8]/16 pt-6">
        <p className="m-0 max-w-[92ch] flex-[1_1_520px] text-[12.5px] leading-[1.7] text-[#e9e4d8]/62">
          Property disclosures: site plans, plot boundaries, areas, prices and statuses shown on this website are illustrative unless identified as recorded or approved. They do not constitute a survey, plat, or offer to sell, and no plot is represented as approved, buildable, or ready for construction unless supporting documentation is provided. Pricing and availability are subject to change. Prospective buyers should review official documents and consult qualified professionals.
        </p>
        <div className="mono flex flex-[0_1_auto] flex-col gap-1.5 text-[10px] uppercase tracking-[.14em] text-[#e9e4d8]/55">
          <span>© 2026 [Company Legal Name]</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

function NavHead({ children }: { children: React.ReactNode }) {
  return <span className="mono mb-1.5 text-[10px] uppercase tracking-[.16em] text-[#e9e4d8]/55">{children}</span>;
}

function FooterNav({ label, links }: { label: string; links: [string, string][] }) {
  return (
    <nav aria-label={label} className="flex flex-col gap-3 text-[14.5px]">
      <NavHead>{label}</NavHead>
      {links.map(([href, text]) => (
        <a key={text} href={href} className="hover:text-copper-light">{text}</a>
      ))}
    </nav>
  );
}
