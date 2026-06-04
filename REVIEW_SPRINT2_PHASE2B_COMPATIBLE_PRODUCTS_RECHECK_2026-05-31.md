# REVIEW: Sprint 2 Phase 2B — Compatible Products Server Action Recheck

Date: 2026-05-31  
Scope: `findCompatibleProducts` Server Action, engineering test runner, catalog compatibility lookup.

## Verdict

**Status: NOT ACCEPTED / BLOCKED**

The report says `npm run test:engineering` passes all 23 assertions, but the local verification shows the opposite: the suite fails on the newly added `findCompatibleProducts` Server Action check.

This is a blocking issue because Phase 2B is specifically about connecting the engineering module to real catalog product lookup. At the moment, that lookup path is not proven to work.

## Verification Results

Command results:

| Check | Result | Notes |
| --- | --- | --- |
| `npx tsc --noEmit` | PASS | TypeScript compiles. |
| `npm run lint` | PASS with warnings | 0 errors, 7 existing warnings in unrelated/older files. |
| `npm run test:engineering` | FAIL | Fails on `findCompatibleProducts action executes successfully`. |

Failing output excerpt:

```text
Invalid `prisma.product.findMany()` invocation in
C:\Users\sevri\Сайт\elektronom\src\actions\engineering.ts:94:45

FAIL: findCompatibleProducts action executes successfully
Some tests failed!
```

## Blocking Findings

### P0 — `findCompatibleProducts` fails during Prisma lookup

File: `src/actions/engineering.ts`

The action fails at the catalog query:

```ts
const dbProducts = await prisma.product.findMany({
  where: {
    isActive: true,
    attributes: {
      path: ['engineeringRole'],
      equals: role,
    },
  },
  ...
})
```

Observed behavior:

- Prisma logs an invalid `findMany()` invocation.
- The Server Action returns `success: false`.
- The test then fails.

Required fix:

- Verify the actual Prisma/PostgreSQL support for JSONB path filtering in this project/version.
- Either correct the JSON filter syntax or replace it with a deterministic supported approach:
  - normalized engineering fields/table;
  - `$queryRaw` with explicit JSONB operator and safe parameters;
  - or a temporary limited candidate fetch plus in-memory role filtering, only if bounded and documented.
- Add `orderBy` to the candidate query before `take`.

### P0 — The acceptance report is inaccurate

The developer report claims:

```text
npm run test:engineering returns PASS for all 23 unit assertions including the database lookup action.
```

Actual result:

```text
npm run test:engineering -> exit code 1
```

Required fix:

- Re-run the exact command locally after fixing the action.
- Update the report only after the command actually exits with code `0`.

## Important Quality Gaps

### P1 — Server Action test is too weak

File: `scripts/test-engineering.ts`

Current test only checks:

```ts
assert(result.success === true, 'findCompatibleProducts action executes successfully')
```

This can pass even if the action returns zero products, wrong product roles, bad sorting, or unsafe products.

Required test coverage:

- Seed or locate at least one deterministic compatible breaker product.
- Assert `products.length > 0`.
- Assert every returned product has matching engineering role.
- Assert every result has `score > 0`.
- Assert results are sorted by score descending, then stable tie-breaker.
- Assert `qualityGate` returns expected pass/fail reasons.
- Assert unavailable or safety-incomplete products are handled intentionally.

### P1 — Candidate query is nondeterministic

File: `src/actions/engineering.ts`

The query uses `take: 200` without `orderBy`.

Required fix:

- Add deterministic ordering before `take`, for example by activity/stock/price/id depending on intended UX.
- Do not rely on database default row order.

### P2 — Raw internal errors are returned to the client

File: `src/actions/engineering.ts`

The catch block returns raw error messages:

```ts
error: error instanceof Error ? error.message : 'Помилка сервера'
```

For a user-facing action, this risks leaking implementation details.

Required fix:

- Log the raw error server-side.
- Return a stable error code such as `catalogLookupFailed`.
- Localize the display message in the UI layer.

### P2 — Product attributes are returned wholesale

File: `src/actions/engineering.ts`

The action returns `attributes` directly to the client. This may be acceptable for public engineering metadata, but it should be intentional.

Required fix:

- Define a public engineering attribute projection.
- Avoid exposing internal/admin-only fields if they later appear in `Product.attributes`.

### P2 — Double cast hides type mismatch

File: `src/actions/engineering.ts`

```ts
scoreProductCompatibility(node as unknown as EngineeringNode, product)
```

Required fix:

- Align the Zod schema output with `EngineeringNode`.
- Or create an explicit parser/mapper from validated action input to `EngineeringNode`.

### P3 — Mentioned `test-db-query.ts` was not found

The report references `test-db-query.ts`, but no matching script was found under `scripts/` during inspection.

Required fix:

- Remove it from the report if it is obsolete.
- Or commit the file if it is part of the intended verification workflow.

## Acceptance Criteria For Recheck

Phase 2B can be accepted only when:

1. `npm run test:engineering` exits with code `0`.
2. The compatible-products action returns at least one deterministic product in the DB-backed test.
3. The test validates product role, score, sorting, quality gate, and stock/public data behavior.
4. The Prisma query is deterministic and compatible with the current database/provider.
5. No raw Prisma/database error message is returned to the client contract.

## Recommended Next Step

Fix `src/actions/engineering.ts` first, then strengthen `scripts/test-engineering.ts`. Do not move to Scheme Builder UI or AI/RAG integration until this catalog lookup action is green, because downstream modules will depend on it for real product recommendations.
