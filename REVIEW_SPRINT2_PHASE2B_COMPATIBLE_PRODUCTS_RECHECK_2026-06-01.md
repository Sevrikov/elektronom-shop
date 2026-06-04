# REVIEW: Sprint 2 Phase 2B — Compatible Products Recheck

Date: 2026-06-01  
Scope: `findCompatibleProducts`, DB-backed engineering tests, catalog compatibility lookup.

## Verdict

**Status: NOT ACCEPTED / STILL BLOCKED**

The implementation is improved compared with the previous recheck, but the claimed verification result is not reproducible locally. The command `npm run test:engineering` still exits with code `1`.

The current blocker is different from the previous Prisma JSON filter failure: the new DB-backed test tries to seed and delete data in the currently configured database, but the active database user does not have write permissions.

## Verification Results

| Check | Result | Notes |
| --- | --- | --- |
| `npx tsc --noEmit` | PASS | TypeScript compilation succeeds. |
| `npm run lint` | PASS with warnings | 0 errors, 7 existing warnings remain. |
| `npm run test:engineering` | FAIL | Fails during Phase 2B test seeding. |

Observed failure:

```text
Invalid `prisma.category.create()` invocation in
C:\Users\sevri\Сайт\elektronom\scripts\test-engineering.ts:664:27

code: 'EACCES'
meta: { modelName: 'Category' }
```

Cleanup also fails:

```text
Invalid `prisma.productImage.deleteMany()` invocation in
C:\Users\sevri\Сайт\elektronom\scripts\test-engineering.ts:843:33

code: 'EACCES'
meta: { modelName: 'ProductImage' }
```

## Blocking Findings

### P0 — `npm run test:engineering` is not green

File: `scripts/test-engineering.ts`

The report says the full suite passes, but the actual run fails while attempting:

- `prisma.category.create(...)`
- later, cleanup with `prisma.productImage.deleteMany(...)`

Required fix:

- Make the Phase 2B DB-backed test run against a dedicated writable test database, not the default development/production-like database.
- Gate destructive DB-backed integration tests behind an explicit environment variable, for example `ENGINEERING_DB_TESTS=1`.
- If the variable is absent, skip only the DB integration part and keep pure unit tests running.
- Prefer `TEST_DATABASE_URL` over `DATABASE_URL` for tests that create/delete rows.

### P0 — Current test design mutates the shared catalog database

File: `scripts/test-engineering.ts`

The test creates categories, brands, products, translations and images, then deletes them in `finally`. This is risky for a shared Neon/dev/staging database:

- If seeding partially succeeds and cleanup fails, orphan test data remains.
- If cleanup selectors are too broad later, real catalog data can be damaged.
- Running tests should not require write access to the normal application database.

Required fix:

- Use an isolated test DB or transaction-backed rollback strategy.
- Add a hard guard:

```ts
if (process.env.NODE_ENV !== 'test' && process.env.ENGINEERING_DB_TESTS !== '1') {
  // skip DB mutation test
}
```

- Use unique test prefixes plus a final audit query, but only inside the isolated test DB.

### P1 — The new action still is not proven end-to-end

File: `src/actions/engineering.ts`

The code now uses:

```ts
attributes: {
  path: ['engineeringRole'],
  string_contains: role,
}
```

This may be correct for Prisma 7 + PostgreSQL, and the in-memory exact role filter is a good safety net. However, because the test fails before calling the action with seeded data, the DB-backed lookup path still has not been verified in this environment.

Required fix:

- First make the test environment writable and isolated.
- Then prove that seeded breaker products are found, scored and sorted.

### P1 — Public attribute projection omits fields used by scoring

File: `src/actions/engineering.ts`

The compatibility scorer uses fields like `ratedCurrentA`, but the public projection allowlist currently includes `currentA` and not `ratedCurrentA`.

Impact:

- Scoring can happen internally.
- But the client does not receive the actual rated current field used to explain why a product matched.

Required fix:

- Align catalog engineering attribute names across:
  - product seed/admin forms;
  - `scoreProductCompatibility`;
  - `findCompatibleProducts` public projection;
  - UI display labels.
- Either expose `ratedCurrentA` as public engineering metadata or normalize it to `currentA` before returning.

### P2 — Error contract is only partially stable

File: `src/actions/engineering.ts`

Runtime errors now return `catalogLookupFailed`, which is good.

But invalid input still returns a localized text string:

```ts
error: 'Невалідні дані'
```

Required fix:

- Return stable error codes for all failures, for example:
  - `invalidInput`
  - `catalogLookupFailed`
- Localize display text in the UI layer.

### P2 — Report artifact is missing

The message references:

```text
REVIEW_SPRINT2_PHASE2B_COMPATIBLE_PRODUCTS_FIXED_2026-06-01.md
```

But this file was not found in the project root during inspection.

Required fix:

- Save the report into the repository if it is part of the handoff.
- Or remove the reference from the status update.

## Positive Changes Confirmed

These changes are directionally good:

- `findCompatibleProducts` now uses deterministic `orderBy: { id: 'asc' }` before `take: 200`.
- Raw runtime DB errors are logged server-side and returned as `catalogLookupFailed`.
- The action projects a public subset of attributes instead of returning the full `Product.attributes` object.
- The test intent is much stronger than before: it tries to verify seeded products, score ordering, quality gate shape and projection allowlist.

The problem is that this stronger test is currently not executable in the active environment.

## Acceptance Criteria For Next Recheck

Phase 2B can be accepted when:

1. `npm run test:engineering` exits with code `0` in the normal developer workflow.
2. DB-mutating tests are isolated behind `TEST_DATABASE_URL` or an explicit test flag.
3. The default test command does not attempt writes/deletes against the shared application DB.
4. `findCompatibleProducts` is verified with deterministic seeded data in the isolated DB path.
5. Error returns are stable codes, not localized UI strings.
6. Public engineering attributes are aligned with the scorer’s actual field names.

## Recommendation

Do not move to Phase 2C yet. First make the DB-backed catalog lookup test safe and reproducible. Otherwise the Scheme Builder UI will be built on a catalog recommendation path that still has not been accepted end-to-end.
