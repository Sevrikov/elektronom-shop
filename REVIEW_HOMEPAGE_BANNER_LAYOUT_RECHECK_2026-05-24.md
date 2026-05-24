# Recheck: homepage banner layout after developer follow-up

Date: 2026-05-24  
Scope: homepage interactive promo carousel after the developer report about restored desktop/mobile height, clean cache rebuild, and visual verification.

## Verdict

Accepted for code/build quality.

The main blocking issue from the previous banner review is closed: `npm run lint`, `npx tsc --noEmit`, and `npm run build` now pass. The working carousel component also contains the restored responsive height classes:

```tsx
className="carousel-eb h-[450px] max-h-[450px] sm:h-[480px] sm:max-h-[480px] select-none"
```

The earlier implementation concerns around hardcoded `labelUk` / `labelRu`, inline `style={{...}}` usage inside the homepage banner components, and incorrect image alt text were not found in the current `src/components/home/hero-carousel.tsx` / `src/components/home/hero-section.tsx` check.

## Verified

- `src/components/home/hero-carousel.tsx` contains the expected `h-[450px] max-h-[450px] sm:h-[480px] sm:max-h-[480px]` viewport classes.
- `src/components/home/hero-carousel.tsx` now uses localized image alt text via `t(`${key}.imageAlt`)`.
- No `style={{...}}`, `labelUk`, `labelRu`, or `mixBlendMode` patterns were found in the active homepage banner components.
- `eslint.config.mjs` now excludes prototype/support folders:
  - `delivery/**`
  - `scripts/**`
  - `scratch/**`
- `npm.cmd run lint` passed with exit code 0.
- `npx.cmd tsc --noEmit` passed with exit code 0 after clearing corrupted generated `.next/dev/types`.
- `npm.cmd run build` passed with exit code 0 after allowing network access for Google Fonts.

## Notes From Verification

During the first `tsc` run, TypeScript failed on corrupted generated files in `.next/dev/types/link.d.ts` and `.next/dev/types/routes.d.ts`. These files contained duplicated/truncated generated type content. After removing the broken generated type files, `npx tsc --noEmit` passed.

This means the source code is type-correct, but the developer should be careful when reporting `tsc` results while a local dev server is still running. On Windows, Turbopack cache files may remain locked by active Node/Next processes, so `.next` cleanup can be incomplete until the dev server is stopped.

`npm run build` initially failed only because the sandbox could not fetch Google Font `Inter`. With network access allowed, the production build completed successfully.

The production build still prints PostgreSQL SSL warnings:

```text
SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
```

This is not a homepage banner blocker, but it should stay in the infrastructure backlog. Prefer an explicit production-safe SSL mode configuration for the database URL.

## Visual Evidence Gap

The developer says desktop and mobile screenshots were captured for Ukrainian and Russian localized pages, including:

- Kraft ATS slide on mobile 390px
- Jack Stand slide on mobile 390px

I did not find those screenshot image files in the project workspace during this recheck. For final acceptance history, the developer should attach or copy the visual evidence into a stable artifact location, for example:

```text
delivery/visual-checks/homepage-banner-uk-desktop.png
delivery/visual-checks/homepage-banner-uk-mobile-kraft-ats.png
delivery/visual-checks/homepage-banner-uk-mobile-jack-stand.png
delivery/visual-checks/homepage-banner-ru-desktop.png
delivery/visual-checks/homepage-banner-ru-mobile.png
```

## Required Follow-Up For Developer

1. Stop the local Next.js dev server before deleting `.next`, otherwise Windows can leave locked Turbopack cache files.
2. Re-run the final command sequence from a clean generated cache:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

3. Save the mobile/desktop screenshot artifacts into the repository or into the delivery folder used for handoff.
4. Keep `delivery/**` and `scripts/**` excluded from production lint if these remain prototype/support artifacts, or move them outside the application repository before final production handoff.
5. Track the PostgreSQL SSL warning separately as an infrastructure hardening item.

## Acceptance Status

Homepage banner implementation can proceed to product-owner visual approval. From the code quality side, the follow-up is accepted.
