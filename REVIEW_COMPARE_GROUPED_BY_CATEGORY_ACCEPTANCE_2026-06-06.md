# REVIEW: Compare Grouping By Category Acceptance

Date: 2026-06-06  
Branch: `Project_Alpha_V1.1`  
Scope: comparison drawer, grouped compare data, category-specific characteristic columns, remove button styling.

## Verdict

**Accepted with minor backlog notes.**

The comparison flow was updated from a single global compare table to grouped category compare tables. This matches the requested behavior: products from different categories no longer share one bloated column set with many empty cells.

## Confirmed Changes

### Server action

File: `src/actions/compare.ts`

- `getCompareData()` now returns:

```ts
{
  groups: CompareGroup[]
}
```

- `CompareGroup` contains:
  - `categoryId`;
  - `categoryName`;
  - category-specific `products`;
  - category-specific `columns`.
- Attribute keys are collected and filtered independently inside each category group.
- Attribute key/value translation uses the shared transliteration helper:
  - `translateAttributeKey`;
  - `translateAttributeValue`.

### Drawer UI

File: `src/components/compare/compare-drawer.tsx`

- The drawer renders each category as a separate block.
- Each block has a category heading and product count.
- Tables are separated with a subtle divider.
- The previously fixed keyed data strategy is preserved, so stale compare data is not shown after product list changes.

### Table remove button

File: `src/components/compare/compare-table.tsx`

- The remove button is now a small muted `X`.
- It changes to destructive color on hover.
- This is visually cleaner than the previous red circular delete control.

## Verification

Commands run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Results:

- TypeScript: PASS.
- ESLint: PASS with 9 existing warnings, no errors.
- Production build: PASS.

Runtime HTTP check:

- Started production server with `npm run start -- -p 3222`.
- `http://localhost:3222/uk` returned `200`.
- `http://localhost:3222/uk/compare-demo` returned `200`.

Full browser-click QA was not completed because the local project does not have the Playwright package installed in this environment. The server-rendered route check passed.

## Remaining Warnings

Existing lint warnings remain in unrelated files:

- unused imports in several info/blog/catalog components;
- missing hook dependency in `assistant-panel.tsx`;
- unused eslint-disable in `claude.ts`;
- unused `_threshold` in `transparent-image.tsx`.

These warnings do not block the compare grouping change but should be handled in a separate hygiene pass.

## Minor Backlog

1. Empty returned groups state:
   - If compare store contains items but `getCompareData()` returns `groups: []` because products are inactive or unavailable, the drawer can show an empty content area.
   - Add an explicit fallback message such as "Selected products are no longer available for comparison."

2. Ordering:
   - Prisma `findMany({ id: { in: productIds } })` does not guarantee preserving the compare-store order.
   - If user-defined order matters, sort `dbProducts` after fetch according to `productIds`.

3. Visual QA:
   - Manually verify in Chrome: add products from two different categories, open compare drawer, confirm two category sections and no excessive empty cells.

## Acceptance Criteria Status

| Requirement | Status |
| --- | --- |
| Group products by category | PASS |
| Build independent characteristic columns per group | PASS |
| Render grouped sections in drawer | PASS |
| Cleaner remove button | PASS |
| TypeScript/lint/build | PASS |
| Manual browser interaction | Pending manual QA |

