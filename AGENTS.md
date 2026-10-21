<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules

- Only `src/lib/companyRepository.ts` may read seed data; UI goes through it so a database swap is a one-file change.
- Normalizers in `src/lib/companyData.ts` stay pure and accept raw `short_json` / `full_json` / skill-level row shapes, matching future table columns.
- Intelligence section/field schema lives only in `src/data/intelligenceData.tsx`; add fields there, not in page components.
- Selected company is persisted via `CompanyContext` to localStorage and read in an effect (SSR-safe); company pages use `useRequireCompany` to redirect home instead of rendering NotFound.
- Category / Bloom / criticality class names live in `src/lib/styleMaps.ts` as literals so Tailwind keeps them.
- College name/tag come only from `src/config/college.ts`.
