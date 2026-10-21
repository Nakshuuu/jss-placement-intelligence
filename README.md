# JSS Academy of Technical Education, Noida — Companies Research & Placement Analytics Portal

a.k.a. **JSSATEN Placement Intelligence Hub**

- **College used:** `COLLEGE_NAME = JSS Academy of Technical Education, Noida`, `COLLEGE_SHORT = JSSATEN` (see `src/config/college.ts`).
- **Phase 1 is UI-only.** All data comes from the hardcoded seed in `src/data/seedCompanies.ts` (one company: Accenture) and the 10-level skill ladders in `src/data/skillTopics.ts`. There is no database, no backend and no college logo file.
- **Fully public.** There is no login, no auth, no protected routes. Every page is reachable directly.
- **Never shown:** CTC, stipend or selection ratio.

## Pages

| URL | Page |
| --- | --- |
| `/` | Company grid with search (200 ms debounce) and category filters |
| `/company` | Redirects to `/company/intelligence` |
| `/company/intelligence` | 22-section company research profile with scroll-spy tabs |
| `/company/skills` | Skill Intelligence: Bloom levels, criticality, 10-level roadmaps |

The selected company is saved to `localStorage["selected-company"]` (`{ companyId, companyName, logoUrl }`) so company pages survive a browser refresh. If nothing is selected, company pages send the visitor back to `/`.

## Stack note

This project runs on the Lovable stack: TanStack Start / TanStack Router (file routes in `src/routes`) and Tailwind CSS v4 (tokens in `src/styles.css`). The brief's React Router 6 nested route tree is implemented 1:1 with file routes (`company.tsx` = AppLayout with `<Outlet />`).

## Data layer & Phase 2

- `src/lib/companyData.ts` — pure normalizers: `normalizeCompanySummary(short_json)`, `normalizeCompanyProfile(full_json, short_json)`, `normalizeDashboardSkills(skillLevels[])` + helpers.
- `src/lib/companyRepository.ts` — the only file that reads the seed. Phase 2 swaps its bodies for database queries returning the same `short_json` / `full_json` / skill-level row shapes; the normalizers and UI stay unchanged.

## Env

- `VITE_LOGO_DEV_PUBLISHABLE_KEY` (optional) — recruiter logos via Logo.dev. Fallback: seed `logo_url`, then an initial-letter badge.

## Tests

`bunx vitest run`
