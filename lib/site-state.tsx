"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LotStatus } from "./content";

export type Filter = Record<LotStatus, boolean>;

export interface Enquiry {
  open: boolean;
  plot: string; // "any" or a lot id
  name: string;
  email: string;
  phone: string;
  use: string;
  timeline: string;
  message: string;
  status: "idle" | "sending" | "sent";
}

interface SiteState {
  narrow: boolean;
  reducedMotion: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean | ((v: boolean) => boolean)) => void;
  selected: number | null;
  setSelected: (id: number | null) => void;
  mpFilter: Filter;
  setMpFilter: (f: Filter | ((f: Filter) => Filter)) => void;
  /** Ask the master plan to select a plot and fly to it. */
  pickRequest: { id: number; tick: number } | null;
  requestPick: (id: number) => void;
  /** Filter the master plan to available plots only. */
  showAvailable: () => void;
  enq: Enquiry;
  setEnq: <K extends keyof Enquiry>(k: K, v: Enquiry[K]) => void;
  openEnq: (plot?: number) => void;
  closeEnq: () => void;
  scrollToId: (id: string, offset?: number) => void;
}

const Ctx = createContext<SiteState | null>(null);

const EMPTY_ENQ: Enquiry = { open: false, plot: "any", name: "", email: "", phone: "", use: "", timeline: "", message: "", status: "idle" };

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [narrow, setNarrow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [mpFilter, setMpFilter] = useState<Filter>({ available: true, reserved: true, sold: true });
  const [pickRequest, setPickRequest] = useState<{ id: number; tick: number } | null>(null);
  const [enq, setEnqState] = useState<Enquiry>(EMPTY_ENQ);

  useEffect(() => {
    const mq = matchMedia("(max-width: 899px)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setNarrow(mq.matches);
      if (!mq.matches) setMenuOpen(false);
      setReducedMotion(rm.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  const setEnq = useCallback(<K extends keyof Enquiry>(k: K, v: Enquiry[K]) => setEnqState((e) => ({ ...e, [k]: v })), []);
  const openEnq = useCallback((plot?: number) => {
    setMenuOpen(false);
    setEnqState((e) => ({ ...e, open: true, status: e.status === "sent" ? "idle" : e.status, plot: plot != null ? String(plot) : e.plot }));
  }, []);
  const closeEnq = useCallback(() => setEnqState((e) => ({ ...e, open: false })), []);

  const scrollToId = useCallback(
    (id: string, offset = 0) => {
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  const requestPick = useCallback(
    (id: number) => {
      scrollToId("mp-module", 92);
      setPickRequest((p) => ({ id, tick: (p?.tick ?? 0) + 1 }));
    },
    [scrollToId],
  );

  const showAvailable = useCallback(() => {
    setMpFilter({ available: true, reserved: false, sold: false });
    setSelected(null);
  }, []);

  // Escape closes the top-most layer: enquiry → menu → plot selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (enq.open) closeEnq();
      else if (menuOpen) setMenuOpen(false);
      else if (selected != null) setSelected(null);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [enq.open, menuOpen, selected, closeEnq]);

  const value = useMemo<SiteState>(
    () => ({ narrow, reducedMotion, menuOpen, setMenuOpen, selected, setSelected, mpFilter, setMpFilter, pickRequest, requestPick, showAvailable, enq, setEnq, openEnq, closeEnq, scrollToId }),
    [narrow, reducedMotion, menuOpen, selected, mpFilter, pickRequest, requestPick, showAvailable, enq, setEnq, openEnq, closeEnq, scrollToId],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used inside <SiteProvider>");
  return v;
}
