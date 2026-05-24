# Cloudinary / Admin Images Fix Recheck

Date: 2026-05-24
Project: Elektronom

## Verdict

The developer report is only partially confirmed.

Build-related checks pass, and several security improvements are present. However, two previously reported issues are still visible in the current working tree:

1. the new Prisma migration still drops the JSONB GIN index;
2. the admin image uploader still contains mojibake UI strings.

These should be fixed before accepting the Cloudinary/admin-images sprint as closed.

## Verification Commands

Confirmed locally:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npx.cmd prisma validate
npm.cmd run build
```

Results:

- ESLint: pass.
- TypeScript: pass.
- Prisma schema validation: pass.
- Next.js production build: pass. Build still prints PostgreSQL SSL mode warnings; not related to this sprint, but should be addressed later by using explicit `sslmode=verify-full` if current behavior is desired.

Not re-run in this recheck:

```powershell
npx.cmd prisma migrate status
```

`migrate status` may depend on remote Neon access and should be repeated by the developer in the target environment.

## Confirmed Improvements

### Upload validation exists

File:

`src/app/api/admin/upload/route.ts`

Confirmed:

- POST validates MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`;
- POST enforces 10 MB max file size;
- DELETE validates params with Zod discriminated union;
- LOCAL delete route checks `uploads/` prefix and rejects `..`, backslash, and null byte.

### Client-side prechecks exist

File:

`src/components/admin/image-uploader.tsx`

Confirmed:

- max image count is checked at 15;
- file type and size are checked before upload;
- delete button only updates React state and does not immediately call DELETE.

### Cloudinary upload typing improved

File:

`src/lib/storage.ts`

Confirmed:

- `new Promise<UploadApiResponse>` is used instead of `Promise<any>`.

### Product deletion cleans media

File:

`src/actions/admin.ts`

Confirmed:

- `deleteProductAdmin` fetches product images and calls `deleteProductImage` for each before deleting the product.

## Remaining Findings

### P1. Migration still drops `products_attributes_gin_idx`

File:

`prisma/migrations/20260524113422_add_product_image_metadata/migration.sql`

Current content still contains:

```sql
-- DropIndex
DROP INDEX "products_attributes_gin_idx";
```

Impact:

- catalog filtering/search by JSONB product attributes can lose the GIN index;
- this reintroduces a regression already reported before.

Required fix:

If this migration has not been applied to production/staging, remove the `DROP INDEX` statement from the migration.

If it has already been applied, create a new migration:

```sql
CREATE INDEX IF NOT EXISTS "products_attributes_gin_idx"
ON "products" USING GIN ("attributes" jsonb_path_ops);
```

Acceptance:

```powershell
npx.cmd prisma migrate status
```

and a DB check proving the index exists.

### P1. Admin image uploader still has mojibake text

File:

`src/components/admin/image-uploader.tsx`

Examples still visible:

```tsx
РњР°РєСЃРёРјСѓРј ...
Р”РѕР·РІРѕР»РµРЅС– ...
Р—Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ...
```

Impact:

- admin UI labels/errors will render as broken text;
- this is especially bad for the image upload tool that content managers will use often.

Required fix:

- restore proper UTF-8 Ukrainian/Russian strings;
- preferably move these labels to the app locale dictionaries instead of hardcoding them in the component.

Acceptance:

- manual screenshot of product image uploader in `/uk/admin`;
- upload error messages readable in Ukrainian;
- Russian locale readable if supported.

### P2. Storage helper still trusts LOCAL url paths outside API route

File:

`src/lib/storage.ts`

The API route validates LOCAL deletion paths, but `deleteProductImage()` itself still does:

```ts
const relativePath = url.replace(/^\//, '')
const fullPath = path.join(process.cwd(), 'public', relativePath)
```

This helper is also called directly from server actions (`saveProductAdmin`, `deleteProductAdmin`) using DB values. If a bad LOCAL URL reaches the database, the helper has weaker protection than the API route.

Recommended fix:

- move LOCAL path validation into `deleteProductImage()` itself;
- resolve the final path and assert it stays inside `public/uploads`;
- keep the API route validation as an additional outer guard.

Suggested logic:

```ts
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
const cleanUrl = url.replace(/^\//, '')
if (!cleanUrl.startsWith('uploads/') || cleanUrl.includes('..') || cleanUrl.includes('\\') || cleanUrl.includes('\0')) {
  throw new Error('Invalid local image path')
}
const fullPath = path.resolve(process.cwd(), 'public', cleanUrl)
if (!fullPath.startsWith(uploadsDir + path.sep)) {
  throw new Error('Invalid local image path')
}
```

### P2. Product save is not fully transactional around image deletion

File:

`src/actions/admin.ts`

`saveProductAdmin` updates product fields first, then deletes removed files from storage, then deletes/recreates `product_images`.

Impact:

- if Cloudinary deletion fails after product base fields were already updated, product save can return an error with partial DB changes already applied;
- external storage cannot be truly included in a DB transaction, but the current ordering is still brittle.

Recommended fix:

- update DB image rows in a transaction first;
- attempt storage cleanup after successful DB commit;
- log cleanup failures instead of failing the entire product save after DB changes are committed;
- optionally add a scheduled orphan cleanup job later.

## Acceptance Checklist for Developer

Before calling this sprint closed, provide:

1. fixed migration or new migration restoring `products_attributes_gin_idx`;
2. proof that the DB index exists;
3. fixed readable strings in `image-uploader.tsx`;
4. screenshot/manual check of admin uploader;
5. `npm.cmd run lint`;
6. `npx.cmd tsc --noEmit`;
7. `npx.cmd prisma validate`;
8. `npx.cmd prisma migrate status`;
9. `npm.cmd run build`.

## Current Status

Status: not accepted yet.

Reason: functional/security improvements are present, but the migration regression and mojibake UI issue remain in the current working tree.
