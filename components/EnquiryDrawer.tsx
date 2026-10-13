"use client";

import { DEV_FACTS, LOTS, pad } from "@/lib/content";
import { useSite } from "@/lib/site-state";

const USES = ["Primary residence", "Second home", "Investment", "Builder or developer", "Other"];
const TIMELINES = ["Within 6 months", "6–12 months", "12+ months", "Just exploring"];

/**
 * Enquiry drawer. This is a front-end prototype: submitting shows a confirmation
 * but sends nothing. Wire `onSubmit` to a form endpoint or CRM before launch.
 */
export default function EnquiryDrawer() {
  const { enq, setEnq, closeEnq } = useSite();
  if (!enq.open) return null;

  const emailOk = /^\S+@\S+\.\S+$/.test(enq.email.trim());
  const canSubmit = !!enq.name.trim() && emailOk && enq.status === "idle";
  const plotLabel = enq.plot === "any" ? "the development" : `Plot ${pad(+enq.plot)}`;

  const chipStyle = (on: boolean) => ({ background: on ? "#1d211f" : "transparent", color: on ? "#f3efe6" : "#1d211f", borderColor: on ? "#1d211f" : "rgba(29,33,31,.3)" });

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div onClick={closeEnq} className="absolute inset-0 bg-[rgba(12,24,18,.55)]" style={{ animation: "fl-fade .4s ease" }} />
      <aside role="dialog" aria-modal="true" aria-label="Plot enquiry" className="relative h-full w-[min(540px,100%)] overflow-y-auto bg-ivory px-[clamp(22px,4vw,44px)] pb-10 pt-7 text-ink" style={{ animation: "fl-drawer .55s cubic-bezier(.2,.7,.2,1)" }}>
        <div className="flex items-center justify-between">
          <span className="kicker !tracking-[.16em] text-mute">Enquiry · {DEV_FACTS.name}</span>
          <button type="button" onClick={closeEnq} aria-label="Close enquiry" className="h-11 w-11 cursor-pointer border border-ink bg-transparent text-lg text-ink hover:bg-ink hover:text-ivory">×</button>
        </div>

        {enq.status === "sent" ? (
          <div className="mt-14" style={{ animation: "fl-fade .5s ease" }}>
            <div className="serif text-[52px] leading-none">Thank you.</div>
            <p className="m-0 mt-5 text-base leading-[1.6] text-body">Your enquiry about {plotLabel} has been noted. This is a design prototype, so no information was sent.</p>
            <button type="button" onClick={closeEnq} className="btn btn-ink mt-8 !px-[22px] !py-4">Return to the site</button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              setEnq("status", "sending");
              setTimeout(() => setEnq("status", "sent"), 1100);
            }}
            className="mt-7 flex flex-col gap-[26px]"
          >
            <div>
              <div className="serif text-[44px] leading-none">Enquire About a Plot</div>
              <p className="m-0 mt-3 text-[14.5px] leading-[1.6] text-body">Tell us what you are looking for and we will follow up with the documentation available for the plots you select.</p>
            </div>
            <Field label="Full name *">
              <input value={enq.name} onChange={(e) => setEnq("name", e.target.value)} autoComplete="name" className="field" />
            </Field>
            <Field label="Email *">
              <input type="email" value={enq.email} onChange={(e) => setEnq("email", e.target.value)} autoComplete="email" className="field" />
              <span className="min-h-[14px] text-xs text-copper-dark">{enq.email && !emailOk ? "Enter a valid email address" : ""}</span>
            </Field>
            <Field label="Phone (optional)">
              <input type="tel" value={enq.phone} onChange={(e) => setEnq("phone", e.target.value)} autoComplete="tel" className="field" />
            </Field>

            <Group label="Plot of interest">
              <div role="group" aria-label="Plot of interest" className="grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-1.5">
                {[{ id: "any", label: "Any", sold: false }, ...LOTS.map((l) => ({ id: String(l.id), label: pad(l.id), sold: l.status === "sold" }))].map((c) => {
                  const on = enq.plot === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={c.sold}
                      aria-pressed={on}
                      aria-label={c.id === "any" ? "Any plot" : `Plot ${c.label}${c.sold ? ", sold" : ""}`}
                      onClick={() => setEnq("plot", c.id)}
                      className="mono h-11 border text-[11.5px] tracking-[.08em] transition-[background,color] duration-[.25s]"
                      style={c.sold ? { color: "#9a9c97", borderColor: "rgba(29,33,31,.14)", textDecoration: "line-through", cursor: "not-allowed", background: "transparent" } : { ...chipStyle(on), cursor: "pointer" }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </Group>
            <ChipGroup label="Intended use" options={USES} value={enq.use} onChange={(v) => setEnq("use", v)} chipStyle={chipStyle} />
            <ChipGroup label="Timeline" options={TIMELINES} value={enq.timeline} onChange={(v) => setEnq("timeline", v)} chipStyle={chipStyle} />
            <Field label="Message">
              <textarea value={enq.message} onChange={(e) => setEnq("message", e.target.value)} rows={3} className="field resize-y" />
            </Field>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center justify-between border-0 px-[22px] py-[18px] text-[14.5px] font-medium text-ivory transition-colors duration-300"
              style={{ background: canSubmit ? "#1d211f" : enq.status === "sending" ? "#5d625e" : "#a5a7a2", cursor: canSubmit ? "pointer" : "not-allowed" }}
            >
              {enq.status === "sending" ? "Sending…" : "Send Enquiry"} <span aria-hidden>→</span>
            </button>
            <span className="text-xs leading-[1.55] text-mute">Design prototype. Submissions are not sent anywhere.</span>
          </form>
        )}
      </aside>
      <style>{`.field{border:0;border-bottom:1px solid #1d211f;background:transparent;padding:10px 0;font-size:16px;outline:none;font-family:inherit;color:inherit}.field:focus{border-bottom-color:#b4703f}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="mono text-[10px] uppercase tracking-[.14em] text-mute">{label}</span>
      {children}
    </label>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="mono text-[10px] uppercase tracking-[.14em] text-mute">{label}</span>
      {children}
    </div>
  );
}

function ChipGroup({ label, options, value, onChange, chipStyle }: { label: string; options: string[]; value: string; onChange: (v: string) => void; chipStyle: (on: boolean) => React.CSSProperties }) {
  return (
    <Group label={label}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(value === o ? "" : o)} className="cursor-pointer border px-3.5 py-[11px] text-[13.5px] transition-[background,color] duration-[.25s]" style={chipStyle(value === o)}>
            {o}
          </button>
        ))}
      </div>
    </Group>
  );
}
