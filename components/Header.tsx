"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/lib/site-state";
import { Wordmark } from "./ui";

const MENU = [
  ["#development", "Developments"],
  ["#plots", "Available Plots"],
  ["#approach", "Our Approach"],
  ["#about", "About"],
  ["#masterplan", "Master Plan"],
] as const;

export default function Header() {
  const { menuOpen, setMenuOpen, openEnq } = useSite();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const solid = scrolled && !menuOpen;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between gap-6 px-[clamp(20px,4vw,56px)] transition-[background,color,border-color] duration-500"
        style={{
          background: solid ? "#f3efe6" : "rgba(243,239,230,0)",
          color: solid ? "#1d211f" : "#f3efe6",
          borderBottom: `1px solid ${solid ? "rgba(29,33,31,.14)" : "rgba(243,239,230,0)"}`,
        }}
      >
        <a href="#top" aria-label="Fieldline Land Co., home" className="hover:!text-current">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-[clamp(20px,2.6vw,38px)] text-[13.5px] tracking-[.02em] min-[900px]:flex">
          {MENU.slice(0, 4).map(([href, label]) => (
            <a key={href} href={href} className="hover:text-copper-dark">{label}</a>
          ))}
          <button type="button" onClick={() => openEnq()} className="cursor-pointer border-0 bg-transparent p-0 text-[13.5px] tracking-[.02em] hover:text-copper-dark">
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#masterplan" className="inline-flex items-center gap-2.5 whitespace-nowrap bg-copper-dark px-[18px] py-3 text-[13px] max-[420px]:px-3 max-[420px]:text-[12px] font-medium tracking-[.03em] text-ivory transition-colors duration-300 hover:bg-[#7d4824]">
            Explore Properties
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[7px] border border-current bg-transparent p-0 min-[900px]:hidden"
          >
            <span className="block h-[1.25px] w-[18px] bg-current transition-transform duration-[.4s] ease-site" style={{ transform: menuOpen ? "translateY(4px) rotate(45deg)" : "none" }} />
            <span className="block h-[1.25px] w-[18px] bg-current transition-transform duration-[.4s] ease-site" style={{ transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[45] flex flex-col justify-between bg-evergreen px-7 pb-9 pt-[120px] text-ivory" style={{ animation: "fl-fade .35s ease" }}>
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {MENU.map(([href, label], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="serif text-[46px] leading-[1.15] text-ivory opacity-0"
                style={{ animation: "fl-in .6s cubic-bezier(.2,.7,.2,1) forwards", animationDelay: `${0.08 + i * 0.06}s` }}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                openEnq();
              }}
              className="serif text-[46px] leading-[1.15] text-ivory opacity-0"
              style={{ animation: "fl-in .6s cubic-bezier(.2,.7,.2,1) forwards", animationDelay: "0.44s" }}
            >
              Contact
            </a>
          </nav>
          <div className="mono text-[10.5px] uppercase leading-[1.8] tracking-[.14em] opacity-60">
            [Phone] · [Email]
            <br />
            [City, State]
          </div>
        </div>
      )}
    </>
  );
}
