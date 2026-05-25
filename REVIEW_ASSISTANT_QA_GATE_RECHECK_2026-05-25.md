# Recheck: assistant QA gate after latest developer update

Date: 2026-05-25  
Scope: latest developer update about clean build/lint and `take: 100` in `src/app/api/assistant/chat/route.ts`.

## Verdict

Accepted for code quality gate.

The latest update fixes the previous build/lint blockers. The technical assistant can now be accepted as an internal MVP preview from a compile/lint/build perspective.

It is still not a full production RAG technical consultant until real documentation ingestion, inventory matching, supplier availability verification, and stronger production rate limiting are completed.

## Verified Commands

```powershell
npm.cmd run lint
```

Result: passed with exit code 0 and no warnings.

```powershell
npx.cmd tsc --noEmit
```

Result: passed with exit code 0.

```powershell
npm.cmd run build
```

Result: passed with exit code 0.

The previous CSS `@import` build warning is resolved. The `Press Start 2P` import now appears before Tailwind imports in `src/app/globals.css`.

The existing PostgreSQL SSL warning remains and should stay in the infrastructure backlog.

## Confirmed Code Changes

`src/app/api/assistant/chat/route.ts` now validates the request body with Zod:

```ts
const ChatRequestBodySchema = z.object({
  message: z.string().min(1).max(800),
  history: z.array(ChatHistoryItemSchema).optional(),
  locale: z.string().optional(),
  sessionId: z.string().optional(),
});
```

The assistant route now persists sessions/messages and performs DB-backed request throttling.

The collection query for recent messages now includes `take: 100`, satisfying the project rule against unbounded collection reads:

```ts
const recentMessages = await prisma.assistantMessage.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 5000),
    },
  },
  take: 100,
  select: {
    createdAt: true,
    structured: true,
  },
});
```

## Remaining Follow-Up

### P2: Add deterministic ordering to the rate-limit query

The recent-message query has `take: 100`, but no `orderBy`. Because this query is used for rate limiting, it should explicitly read the newest messages first:

```ts
orderBy: { createdAt: 'desc' },
take: 100,
```

Without `orderBy`, the database is not required to return rows in a deterministic newest-first order. In high traffic, this can make the rate-limit check less reliable.

### P2: Tighten request schema

`history.role` and `locale` are currently generic strings. Prefer stricter schemas:

```ts
role: z.enum(['user', 'assistant'])
locale: z.enum(['uk', 'ru']).default('uk')
```

This avoids silently mapping unexpected roles to `assistant`.

### Backlog: Production AI consultant still requires real data pipelines

The feature is now good enough as an MVP assistant UI/API preview, but the original product goal still requires:

- technical document ingestion;
- document chunking and embeddings/vector search;
- inventory file/API synchronization;
- supplier availability verification;
- admin UI for assistant knowledge/inventory;
- real source citations;
- cost/rate limit hardening for production traffic.

## Acceptance Status

Code quality gate: accepted.  
Assistant MVP preview: accepted.  
Full production technical consultant: still pending data/RAG/inventory work.
