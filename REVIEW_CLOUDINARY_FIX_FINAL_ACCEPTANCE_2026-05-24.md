# Cloudinary / Admin Images Final Acceptance Recheck

Date: 2026-05-24
Project: Elektronom

## Verdict

Accepted with one minor follow-up.

The blocking findings from `REVIEW_CLOUDINARY_FIX_RECHECK_2026-05-24.md` are resolved in the current working tree:

- the Cloudinary/product-image migration no longer drops `products_attributes_gin_idx`;
- the image uploader no longer hardcodes broken Cyrillic strings;
- uploader strings are read through `useTranslations('admin.imageUploader')`;
- LOCAL path validation is now inside `deleteProductImage()`;
- product image DB mutations are wrapped in a Prisma transaction;
- storage cleanup happens after successful DB commit.

## Verified Files

### Migration

File:

`prisma/migrations/20260524113422_add_product_image_metadata/migration.sql`

Confirmed:

- `DROP INDEX "products_attributes_gin_idx";` is no longer present.
- Previous migration `20260521130000_add_product_attributes_gin_index` still creates the index.

### Image Uploader

File:

`src/components/admin/image-uploader.tsx`

Confirmed:

- uses `useTranslations('admin.imageUploader')`;
- no hardcoded Ukrainian/Russian UI strings remain in the component;
- delete action only mutates React state;
- upload limits and MIME checks remain.

### Locale Messages

Files:

- `src/i18n/messages/uk.json`
- `src/i18n/messages/ru.json`

Confirmed with Node UTF-8 read:

- `admin.imageUploader.maxFilesError` is valid Ukrainian/Russian text at the codepoint level.
- PowerShell may display these files as mojibake, but the file contents are valid UTF-8.

### Storage Helper

File:

`src/lib/storage.ts`

Confirmed:

- `deleteProductImage()` now validates LOCAL paths internally;
- it requires `uploads/` prefix;
- it rejects `..`, backslash, and null byte;
- it resolves the final path and verifies it stays inside `public/uploads`.

### Product Save

File:

`src/actions/admin.ts`

Confirmed:

- product update + product image row replacement are inside `prisma.$transaction`;
- removed storage files are cleaned after successful DB commit;
- cleanup failures are logged instead of rolling back already-committed product changes.

## Verification Commands

Confirmed locally:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npx.cmd prisma validate
npx.cmd prisma migrate status
npm.cmd run build
```

Results:

- ESLint: pass.
- TypeScript: pass.
- Prisma validate: pass.
- Prisma migrate status: pass with network access to Neon; 4 migrations found, database schema is up to date.
- Next.js production build: pass.

Note: the build still prints PostgreSQL SSL mode warnings. They are unrelated to this Cloudinary sprint, but should be handled later by making the desired SSL behavior explicit in the DB connection string.

## Minor Follow-Up

The `ImageUploaderProps` interface still declares an optional `locale?: string`, but the component no longer uses it because translations come from `next-intl`.

Recommended cleanup:

- remove `locale?: string` from `ImageUploaderProps`;
- remove any now-unneeded `locale` prop passed to `<ImageUploader />`.

This is not a blocker because lint/type/build pass.

## Acceptance Status

Status: accepted.

The Cloudinary/admin image upload fixes can be considered closed after the minor unused prop cleanup is scheduled or handled opportunistically.
