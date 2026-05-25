# Final recheck: AI technical assistant after developer fixes

Date: 2026-05-25  
Scope: follow-up after developer response claiming all 10 recheck items were addressed.

## Verdict

Partially accepted.

The implementation is now buildable and the main TypeScript blocker is fixed. The assistant UI is materially improved: localized strings are used in many components, the API returns real non-200 errors, Zod validation was added around Claude output, draft order totals are recalculated server-side, the hardcoded 10% discount is no longer applied, and cart transfer now has a confirmation step.

However, this should still be treated as an MVP/prototype, not as a finished technical consultant. Several important issues remain before production acceptance.

## Verification Results

```powershell
npx.cmd tsc --noEmit
```

Result: passed.

```powershell
npm.cmd run lint
```

Result: completed with warnings, no errors.

Warnings:

```text
src/components/assistant/assistant-panel.tsx
  _isSpeaking is assigned a value but never used

src/components/layout/header.tsx
  useCallback / Phone / ChevronDown / categories / prevPathname / setPrevPathname unused
```

```powershell
npm.cmd run build
```

Result: passed.

Build warnings:

- CSS warning: `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap')` in `src/app/globals.css` must precede all rules except `@charset` / `@layer`.
- Existing PostgreSQL SSL warning remains.

## Confirmed Fixed / Improved

- Missing `AssistantOrderComparison` import in `src/lib/assistant/claude.ts` is fixed.
- `npx tsc --noEmit` now passes.
- `npm run build` now passes.
- `/api/assistant/chat` now returns `429` for too-fast repeat requests.
- `/api/assistant/chat` now returns `500` on exceptions instead of hiding server errors behind `200`.
- Claude output now goes through a Zod schema before use.
- Recommended products and draft items are rehydrated from Prisma records before being returned to the UI.
- Draft order total no longer applies the fabricated 10% discount. `discount` is currently `0`.
- Cart transfer now requires user confirmation before pushing draft items into the real cart.
- Cart transfer now tracks per-item add failures.
- Browser `alert()` calls were mostly replaced by panel/toast state.
- Brand spelling in the prompt is corrected to `Elektronom`.
- Locale files contain valid Ukrainian/Russian values when read as UTF-8.

## Remaining Findings

### P1: Client-side comparison still contains mock commercial data

File: `src/components/assistant/assistant-panel.tsx`

The client comparison flow still falls back to fake/default values:

```ts
const currentPrice = matchItem ? Number(matchItem.price) : 5200;
const currentName = matchItem ? matchItem.name : 'Vitals Master Standard 500';
```

This reintroduces the same class of problem as the previous fake fallback products. The assistant must not invent a previous product, old price, or product name. If there is no existing draft item, the UI should ask the user to first add/select a product for comparison.

Required fix:

- remove fallback `5200`;
- remove fallback `Vitals Master Standard 500`;
- disable comparison when there is no real previous draft item;
- show a localized empty state: “Спочатку додайте товар у підбір”.

### P1: Client-side comparison contains hardcoded technical claims

File: `src/components/assistant/assistant-panel.tsx`

The comparison text claims LiFePO4 serves 5 times longer, supports 4000 cycles, and charges in 2 hours:

```ts
LiFePO4 ... служить у 5 разів довше ... підтримує до 4000 циклів ... заряджається за 2 години
```

This may be true for some products, but not universally. These claims must come from product attributes, technical documentation, or verified assistant response sources. Otherwise they are hallucinated technical claims.

Required fix:

- generate comparison summaries server-side from validated product data and documentation;
- or show neutral text such as “Перевірте характеристики товарів у таблиці нижче” until RAG/data is available.

### P1: Fallback matcher still contains hardcoded advice instead of true technical calculation

File: `src/lib/assistant/claude.ts`

Fallback responses still include hardcoded statements like:

```text
понад 8 годин автономної роботи при середній потужності 10-15 Вт
```

and hardcoded advice for boiler/automation scenarios.

This is acceptable only as a clearly labeled demo, not as a production technical consultant. For production, the assistant must calculate from user-provided parameters and verified product/document data.

### P1: Rate limiting is too weak for a paid AI endpoint

File: `src/app/api/assistant/chat/route.ts`

The current rate limit is an in-memory Map with a 2-second threshold. This is useful for a dev preview, but not enough for production:

- memory resets on serverless cold start;
- no per-user/session quota;
- no daily/monthly cost control;
- no body schema validation;
- no protection against distributed abuse.

Required production fix:

- use a durable rate limit store such as Redis/Upstash or database-backed throttling;
- validate request body with Zod;
- add max history length;
- add request/cost logging.

### P2: Model-output validation exists, but `JSON.parse` is still fragile

File: `src/lib/assistant/claude.ts`

`JSON.parse(textContent)` is wrapped by the general try/catch, so it will not crash the route permanently. Still, production quality should handle:

- Claude wrapping JSON in markdown fences;
- malformed JSON;
- schema mismatch;
- empty content.

Required improvement:

- add a safe JSON extractor/parser;
- return a controlled “need clarification / temporary AI error” response when parsing fails;
- log parse failures separately from network/API failures.

### P2: Lint is not fully clean

`npm run lint` exits without errors, but warnings remain. The developer report claimed lint was clean. It is not clean yet.

Required fix:

- remove unused `_isSpeaking` or display speaking state in UI;
- clean unused imports/state in `src/components/layout/header.tsx`.

### P2: CSS import warning in production build

File: `src/app/globals.css`

The build reports:

```text
@import rules must precede all rules aside from @charset and @layer statements
```

Move the `Press Start 2P` import to the very top of the stylesheet, or replace it with a Next/font/local-font strategy. Since this is a commerce frontend, avoid adding external font imports that can slow or block rendering unless truly needed.

### P2: RAG/inventory/supplier availability is still MVP only

The code now marks documentation/inventory as MVP preview, which is honest. But the production requirement remains open:

- no real technical document ingestion;
- no vector search/embeddings;
- no inventory file/API matching;
- no supplier availability verification;
- no admin UI for assistant docs/inventory;
- no persisted assistant logs/feedback.

This is not a blocker for a UI prototype, but it is a blocker for calling the assistant “real technical consultant”.

## Required Developer Follow-Up

1. Remove fake comparison fallback values from `assistant-panel.tsx`.
2. Move comparison generation to the server or make it strictly data-driven.
3. Replace hardcoded technical claims with verified attributes/docs or neutral text.
4. Add Zod validation for the incoming API request body and history.
5. Add durable production rate limiting and cost logging before deploying Claude access publicly.
6. Clean remaining ESLint warnings.
7. Fix the `@import` CSS warning in `globals.css`.
8. Keep the current feature labelled as MVP until real RAG, inventory, and supplier verification are connected.

## Acceptance Status

Code quality gate: mostly passed, with warnings.  
Functional MVP UI: accepted for internal preview.  
Production technical assistant: not accepted yet.
