# Homepage Banner Integration Review

Date: 2026-05-24
Project: Elektronom

## Verdict

Not accepted yet.

The interactive homepage banner is integrated into the working homepage and the production build passes. However, the standard lint command fails, and there are several implementation gaps against the original acceptance requirements.

## What Is Confirmed

### Integrated into homepage

Files:

- `src/components/home/hero-section.tsx`
- `src/components/home/hero-carousel.tsx`
- `src/app/[locale]/page.tsx`

Confirmed:

- `hero-section.tsx` now renders `<HeroCarousel locale={locale} />`.
- `/uk` and `/ru` return HTTP 200 locally.
- HTML contains `carousel-eb` and localized banner text.
- There are 4 active banner slides:
  - relay LY2;
  - INTERTOOL jack stand;
  - Kraft ATS;
  - Trinix battery.

### Build passes

Confirmed:

```powershell
npx.cmd tsc --noEmit
npx.cmd prisma validate
npm.cmd run build
```

Results:

- TypeScript: pass.
- Prisma schema validation: pass.
- Next.js production build: pass.

Build still prints PostgreSQL SSL mode warnings; this is unrelated to the banner integration.

### Localization files are valid UTF-8

Files:

- `src/i18n/messages/uk.json`
- `src/i18n/messages/ru.json`

PowerShell displays some Cyrillic as mojibake, but Node UTF-8 reads show valid Ukrainian/Russian codepoints for `home.banners.*` strings.

## Blocking Findings

### P1. `npm.cmd run lint` fails

The repository does not pass the standard lint command.

Current failing files:

- `delivery/design-canvas.jsx`
- `scripts/get-slugs.js`

Representative errors:

```text
delivery/design-canvas.jsx:511
Expected the dependency list to be an array of simple expressions

delivery/design-canvas.jsx:931
Cannot create components during render

scripts/get-slugs.js:1
A require() style import is forbidden
```

Impact:

- the developer report says the project builds successfully, but the agreed acceptance also requires clean lint;
- prototype files in `delivery/` are now part of the repo and are being linted.

Required fix:

- move `delivery/` outside the linted project tree, or exclude it intentionally via ESLint config if it is purely an artifact folder;
- remove/convert `scripts/get-slugs.js`, or exclude throwaway scripts from lint;
- rerun `npm.cmd run lint` and provide clean output.

### P1. Prototype artifact report is not saved in the project

Developer referenced:

`homepage_banner_integration_report.md`

But the file is not present in the project root. The provided report exists outside the project at:

`C:\Users\sevri\.gemini\antigravity\brain\a6b22576-0483-4f91-aa86-4956a875fd59\homepage_banner_integration_report.md.resolved`

Required fix:

- copy or save the final integration report into the project root or `delivery/`;
- recommended path: `HOMEPAGE_BANNER_INTEGRATION_REPORT.md`.

## High-Priority Findings

### P2. Inline styles remain in the working homepage components

Files:

- `src/components/home/hero-section.tsx`
- `src/components/home/hero-carousel.tsx`

Examples:

- `hero-section.tsx:15`
- `hero-section.tsx:22`
- `hero-section.tsx:27`
- `hero-carousel.tsx:471`
- `hero-carousel.tsx:479`
- `hero-carousel.tsx:828`
- `hero-carousel.tsx:843`

Impact:

- violates project rule: "NO inline styles";
- makes future design-token maintenance harder;
- several positions/sizes are now embedded in TSX instead of CSS/Tailwind.

Required fix:

- move stat positioning and image wrapper sizes into CSS classes or CSS variables set through class variants;
- refactor old CTA card inline styles in `hero-section.tsx` to Tailwind v4 token classes.

### P2. Stats labels are hardcoded in TSX instead of locale files

File:

`src/components/home/hero-carousel.tsx`

Examples:

- `labelUk: 'Напруга'`
- `labelRu: 'Напряжение'`
- `labelUk: 'Знижка'`
- `labelRu: 'Скидка'`

Impact:

- not all banner text is truly localized through `src/i18n/messages`;
- contradicts the requirement to move banner text, CTA, alt, and aria labels to locale files.

Required fix:

- move stat labels/units to `home.banners.<slide>.stats.*`;
- keep slide data in TSX only for IDs, slugs, images, fallback type, and layout variant.

### P2. Product image alt text is too generic

File:

`src/components/home/hero-carousel.tsx`

Current:

```tsx
alt={t(`${key}.badge`)}
```

Impact:

- image alt becomes labels like "Top sales" instead of the actual product name;
- weaker accessibility and SEO.

Required fix:

- add localized `imageAlt` or `productName` per slide;
- use `alt={t(`${key}.imageAlt`)}`.

### P2. Visual verification was not independently completed in this review

The in-app browser automation runtime failed in this session, so I could not take fresh desktop/mobile screenshots myself.

Confirmed by HTTP:

- `/uk`: 200 and contains banner markup/text.
- `/ru`: 200 and contains banner markup/text.

Required from developer:

- provide desktop screenshot for `/uk`;
- provide mobile screenshot for `/uk`;
- provide `/ru` screenshot or at least visible text proof;
- confirm no text overlap at 390px mobile width.

## Acceptance Checklist Before Closing

Developer should provide:

1. `npm.cmd run lint` clean.
2. `npx.cmd tsc --noEmit` clean.
3. `npx.cmd prisma validate` clean.
4. `npm.cmd run build` clean.
5. Saved report inside project.
6. Desktop/mobile screenshots.
7. Confirmation that inactive carousel slides are not keyboard-focusable.
8. Refactor or explicitly justify remaining inline styles.
9. Move stat labels and product image alt text into locale dictionaries.

## Current Status

Status: not accepted yet.

The banner itself is present and the production build works, but the sprint cannot be closed while standard lint fails and localization/style requirements are only partially met.
