# Fieldline Land Co. — Homepage

Editorial land-development homepage: survey-style hero, featured development with an aerial / site-plan toggle, a scroll-driven "land to plots" sequence, an interactive master plan, plot cards, location, approach, and an enquiry drawer.

Ported from the *Fieldline Homepage* design (Hanken Grotesk · Instrument Serif · JetBrains Mono; ivory, evergreen and copper palette).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `next/image`

## Run it

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # production build
npm start          # serve the build on :3100
```

## Where things live

| Path | What it is |
| --- | --- |
| `lib/content.ts` | All project data: development facts, parcel and lot geometry, statuses, stages, approach pillars, location context, master-plan palettes, photography |
| `lib/geometry.ts` | Seeded topographic contours and tree line (identical on server and client) |
| `lib/site-state.tsx` | Shared state: plot selection, master-plan filters, "View on Master Plan", enquiry drawer, mobile menu |
| `components/Hero.tsx` | Hero with survey overlay that draws itself on load |
| `components/FeaturedDevelopment.tsx` | Aerial ↔ site-plan toggle and development facts |
| `components/LandToPlots.tsx` | Sticky 4-stage scroll sequence (CSS variables `--p`, `--s1…--s4`) |
| `components/MasterPlan.tsx` | Pan / zoom / pinch plan, plot details, filters, mobile bottom sheet |
| `components/PlotDiscovery.tsx` | "Plot by Plot" cards with filters and "View on Master Plan" |
| `components/Location.tsx`, `Approach.tsx`, `ClosingCta.tsx`, `Footer.tsx`, `EnquiryDrawer.tsx` | Remaining sections |
| `app/globals.css` | Design tokens, shared type and button styles, animations |

## Settings

In `lib/content.ts`:

- `PLAN_STYLE`: master-plan colourway, `"evergreen"` (default) or `"ivory"`
- `SHOW_STATUS_LABELS`: status text under each plot number on the plan
- `SHOW_SURVEY_OVERLAY`: the boundary / coordinate overlay on the hero

## Before launch

- **Replace the bracketed placeholders** (`[Development Name]`, `[City, State]`, `[Phone]`, `[Company Legal Name]` …) and the sample lot data with verified project details.
- **Photography** comes from Unsplash stand-ins. Each entry in `PHOTOS` says which shot the design calls for.
- **The enquiry form sends nothing.** It's a front-end prototype; connect it to a form endpoint or CRM in `components/EnquiryDrawer.tsx`.
- The page is set to `noindex` (`app/layout.tsx`) while it shows sample data. Remove that when it goes live.
