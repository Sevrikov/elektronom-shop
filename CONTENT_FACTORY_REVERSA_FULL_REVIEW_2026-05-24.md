# Content Factory Reversa Full Review

Date: 2026-05-24
Project: Elektronom

## Scope

This is a full Reversa-style review cycle for the planned AI Content Factory module:

1. Reconnaissance: what is actually present in the current codebase.
2. Excavation: current integration surfaces and reusable modules.
3. Interpretation: target architecture and publishing workflow.
4. Generation: implementation specification for the next sprint.
5. Review: blockers, risks, and acceptance criteria.

Detailed phase documents:

- `tools/reversa/_reversa_sdd/content-factory/01-reconnaissance.md`
- `tools/reversa/_reversa_sdd/content-factory/02-excavation.md`
- `tools/reversa/_reversa_sdd/content-factory/03-interpretation.md`
- `tools/reversa/_reversa_sdd/content-factory/04-generation-spec.md`
- `tools/reversa/_reversa_sdd/content-factory/05-review-findings.md`
- `tools/reversa/_reversa_sdd/content-factory/06-developer-task.md`

## Main Conclusion

The AI Content Factory is not implemented as code yet. The project has a good foundation: admin panel, products, translations, product images, Cloudinary, and Algolia. However, it does not yet have the production-safe AI pipeline: job, draft, review, approve, apply, and audit.

AI must not be connected as a "generate and save immediately" button. The correct workflow is:

`ContentJob -> AI generation -> ContentDraft -> Admin review -> Apply selected fields -> Revalidate + Algolia sync`

## Readiness

- MVP readiness for content factory: about 35-40%.
- Production-grade AI content platform readiness: about 15-20%.

## Verification Run

- `npm.cmd run lint`: pass.
- `npx.cmd tsc --noEmit`: pass.
- `npx.cmd prisma validate`: pass.
- `npm.cmd run build`: pass when network access is allowed for Google Fonts.
- `npx.cmd prisma migrate status`: failed locally with Prisma Schema Engine error against remote Neon DB; rerun in developer/staging DB environment.

## Critical Findings

### P0. No Content Factory models/actions/UI exist

Required additions:

- `ContentTemplate`
- `ContentJob`
- `ContentDraft`
- `GeneratedAsset`
- `src/actions/admin-content.ts`
- Admin tab: `AI Content`
- Server-only AI provider helper

### P0. No AI auto-publishing

AI output must create drafts only. Publication must require explicit admin approval.

### P1. Migration drops the JSONB GIN index again

File:

`prisma/migrations/20260524113422_add_product_image_metadata/migration.sql`

Problem:

```sql
DROP INDEX "products_attributes_gin_idx";
```

This must be fixed before production, otherwise catalog filtering by JSONB attributes may lose performance.

### P1. Admin UI has mojibake strings

File:

`src/components/admin/image-uploader.tsx`

Several Ukrainian/Russian UI strings are corrupted as mojibake. Fix text encoding or move strings to proper locale dictionaries.

## Recommended Next Sprint

Sprint CF-01:

1. Fix the GIN index migration and admin mojibake.
2. Add Prisma models for the content factory.
3. Add server actions.
4. Add the AI provider helper.
5. Add the admin tab.
6. Implement the first scenario only: `PRODUCT_COPY`.
7. Add `INFOGRAPHIC_BRIEF` second, but do not generate final images automatically yet.

## Acceptance

Developer must provide command results:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npx.cmd prisma validate
npx.cmd prisma migrate status
npm.cmd run build
```

Manual proof:

1. Create an AI product draft.
2. Preview and compare with current product content.
3. Approve the draft.
4. Apply only selected fields.
5. Verify the product page updates.
6. Verify Algolia sync.
7. Reject another draft without changing the product.
8. Show graceful error handling when the AI provider fails.
