<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Elektronom AI-Agent Guidelines (Next.js 16 + Tailwind CSS v4 + Prisma)

This repository follows strict guidelines. Before writing any code, you must ensure compatibility with the rules below.

## 1. NEXT.JS 16 & ARCHITECTURE RULES
- ⛔ **NO Route Configs**: Do not write `export const revalidate = N` or `export const dynamic = 'force-dynamic'`.
- ✅ **'use cache'**: Cache data using `'use cache'` + `cacheLife()` / `cacheTag()` inside server functions (queries).
- ⛔ **NO unstable_cache / cache()**: Do not use `unstable_cache` or React `cache()`. Use `'use cache'`.
- ⛔ **NO middleware.ts**: All routing & auth middleware is inside `src/proxy.ts`. Do not modify or create `middleware.ts`.
- ⛔ **NO experimental.ppr**: The flag `cacheComponents: true` in `next.config.ts` handles partial pre-rendering.
- ⛔ **NO Edge runtime with Prisma**: Do not add `export const runtime = 'edge'` to pages/routes using Prisma.
- ✅ **Server/Client Component Split**: Keep pages as Server Components (default). Extract interactivity to small client components (`'use client'`) at the leaf level (e.g. `AddToCartButton`).

## 2. PRISMA & DATABASE RULES
- ⛔ **NO direct queries without limits**: Always specify `take` / `skip` when querying collections.
- ⛔ **NO include without select**: Always use `select` to specify the exact fields to return. Avoid leaking password hashes, cost price, etc.
- ⛔ **NO new Prisma instances**: Import `prisma` ONLY from `@/lib/prisma`.
- ✅ **Negative Stock Prevention**: When updating product inventory, always use `updateMany` checking `stock >= quantity`:
  ```typescript
  await tx.product.updateMany({
    where: { id: productId, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } }
  })
  ```
- ✅ **Decimal Arithmetic**: Never perform arithmetic operations directly on `Prisma.Decimal`. Convert to `Number(val)` or use `decimal.js`.

## 3. ZOD & VALIDATION
- ⛔ **NO z.string().cuid()**: Database uses `cuid2()`, which is incompatible with Zod's `.cuid()`. Always use `z.string().min(1)` (or custom regex) to validate identifiers.

## 4. STYLING (TAILWIND CSS v4)
- ⛔ **NO tailwind.config.ts**: Tailwind CSS v4 is configured entirely inside `src/app/globals.css` via `@theme`.
- ⛔ **NO inline styles**: Avoid `style={{}}`. Use Tailwind classes. Dynamic colors from `@theme` are available (e.g., `bg-surface-alt`, `text-text-primary`, `bg-accent`).

## 5. ALGOLIA SEARCH
- ⛔ **NO ALGOLIA_ADMIN_KEY in client**: Never expose admin key or prefix it with `NEXT_PUBLIC_`.
- ✅ **Sync Indexes**: Every product create/update/delete/toggleActive mutation must update the Algolia index (`indexProduct`, `syncProductPrice`, `removeProductFromIndex`).

## 6. ROUTE HANDLERS
- ✅ **LIQ PAY / Webhook body reading**: Always read request body as text `await req.text()` instead of `req.json()` to verify signatures correctly.
