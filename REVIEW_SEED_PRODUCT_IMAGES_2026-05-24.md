# Review: product seed images and developer report

Date: 2026-05-24

## Scope

Reviewed the developer report about replacing `placehold.co` seed product images with local assets in `prisma/seed.ts`.

Checked:

- `prisma/seed.ts`
- `public/images/products/`
- TypeScript, ESLint, Prisma schema validation, production build
- generated `.next/server/app` output for leftover `placehold.co` and `localhost:3000`

## Verdict

The image replacement itself is accepted after one correction.

The developer correctly replaced product image URLs in `PRODUCTS` with local paths under `/images/products/`, and all referenced files exist in `public/images/products/`.

However, the submitted version had an ESLint regression caused by `as any` in `prisma/seed.ts`. I fixed it by adding explicit seed types for category translations and categories, then replaced `(t as any).description` with `t.description ?? null`.

## Changes applied during review

File: `prisma/seed.ts`

- Added `CategoryTranslationSeed` and `CategorySeed` types.
- Changed `const CATEGORIES = [...]` to `const CATEGORIES: CategorySeed[] = [...]`.
- Removed `as any` from category translation upserts.
- Fixed typo in Russian Mannol description: `Синтеческое` -> `Синтетическое`.

## Verification Results

Passed:

- `npm.cmd run lint`
- `npx.cmd tsc --noEmit`
- `npx.cmd prisma validate`
- `npm.cmd run build`

Asset path check:

- All `/images/products/...` paths referenced in `prisma/seed.ts` exist in `public/images/products/`.

Generated build output:

- No `placehold.co` references found in `.next/server/app`.
- No `localhost:3000` references found in `.next/server/app`.

## Important Note

I did not run `npm run db:seed` during review because the local `.env` points to a remote Neon database host and Algolia credentials are present. Running seed would mutate remote data and may sync Algolia. This should be executed only intentionally by the developer/operator against the intended database.

## Residual Warnings

The production build still prints:

- `metadataBase property in metadata export is not set... using "http://localhost:3000"`

Even though `rg` did not find `localhost:3000` in generated `.next/server/app` output after this build, the warning indicates that some metadata generation path still lacks `metadataBase`, likely in `src/app/[locale]/layout.tsx`.

Recommended follow-up:

- Add `metadataBase: new URL(getSiteUrl())` to the locale layout metadata generation, then re-run build and smoke-check OpenGraph/Twitter metadata.

Build also prints Prisma/Postgres SSL mode warnings. They are not caused by this task, but should be handled before production hardening by making SSL mode explicit in the database URL/config.

## Acceptance Decision

Accepted with follow-up.

The seed image task is functionally complete and now passes local quality checks, but the developer report was inaccurate when it claimed lint/build quality was fully clean before the `as any` issue was fixed.
