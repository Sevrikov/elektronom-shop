# Recheck: AI technical product assistant implementation

Date: 2026-05-25  
Scope: developer report about assistant widget, live draft order, comparison panel, voice mode, `/assistant` page, and quality checks.

## Verdict

Not accepted yet.

The UI skeleton and several required components were added, but the implementation is currently not production-ready and does not pass TypeScript verification in this workspace. The feature is closer to an interactive prototype than the technical consultant described in the task.

## Verification Results

```powershell
npx.cmd tsc --noEmit
```

Result: failed.

```text
src/lib/assistant/claude.ts(102,19): error TS2304: Cannot find name 'AssistantOrderComparison'.
```

```powershell
npm.cmd run lint
```

Result: failed by Node out-of-memory during ESLint execution.

Because TypeScript fails, `npm run build` should not be considered clean until the type error and lint memory issue are resolved and the full build is re-run.

## Confirmed Implemented

- `src/components/assistant/assistant-widget.tsx`
- `src/components/assistant/assistant-panel.tsx`
- `src/components/assistant/assistant-character.tsx`
- `src/components/assistant/assistant-message.tsx`
- `src/components/assistant/assistant-product-card.tsx`
- `src/components/assistant/assistant-draft-order.tsx`
- `src/components/assistant/assistant-order-comparison.tsx`
- `src/app/[locale]/assistant/page.tsx`
- `src/app/api/assistant/chat/route.ts`
- `src/lib/assistant/claude.ts`
- `src/lib/assistant/draft-order.ts`
- `src/lib/assistant/prompts.ts`
- `src/lib/assistant/types.ts`

The component structure roughly matches the requested direction: character, chat panel, draft order, comparison panel, voice controls, and standalone assistant route.

## Findings

### P0: TypeScript does not compile

File: `src/lib/assistant/claude.ts`

`AssistantOrderComparison` is used but not imported.

Current import:

```ts
import type { AssistantResponse, RecommendedProduct, AssistantDraftOrderItem, AssistantSource } from './types';
```

Required fix:

```ts
import type {
  AssistantResponse,
  RecommendedProduct,
  AssistantDraftOrderItem,
  AssistantSource,
  AssistantOrderComparison,
} from './types';
```

After fixing, rerun:

```powershell
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

### P0: User-facing text is corrupted mojibake

Many visible strings are stored as broken text such as:

```text
Р’Р°С€ РїС–РґР±С–СЂ
РџРµСЂРµРЅРµСЃС‚Рё РІ РєРѕС€РёРє СЃР°Р№С‚Сѓ
РќРµ РІРґР°Р»РѕСЃСЏ...
```

Affected files include:

- `src/app/api/assistant/chat/route.ts`
- `src/lib/assistant/claude.ts`
- `src/lib/assistant/prompts.ts`
- `src/components/assistant/assistant-panel.tsx`
- `src/components/assistant/assistant-widget.tsx`
- `src/components/assistant/assistant-draft-order.tsx`
- `src/components/assistant/assistant-order-comparison.tsx`

This will be visible to users and also breaks keyword matching in the fallback assistant logic. All strings must be restored as valid Ukrainian/Russian text and moved into locale files where appropriate.

### P1: Assistant API hides server failures behind HTTP 200

File: `src/app/api/assistant/chat/route.ts`

The catch block returns status 200 on API failure:

```ts
{ status: 200 }
```

This makes the client think the request succeeded even when the assistant failed. Return a real error status such as 500/503 with a structured error payload, then render a friendly fallback on the client.

### P1: Claude response is parsed as trusted JSON without validation

File: `src/lib/assistant/claude.ts`

The code does:

```ts
const parsed: AssistantResponse = JSON.parse(textContent);
return parsed;
```

This is unsafe and fragile:

- Claude may return non-JSON text.
- JSON may be structurally invalid.
- Product IDs/prices/stock can be hallucinated.
- Draft order totals can be manipulated by model output.

Required fix:

- Validate the response with Zod.
- Never trust prices/totals from Claude.
- Rehydrate product IDs from the database.
- Recalculate totals server-side after validation.
- If JSON parsing fails, return a controlled assistant fallback.

### P1: It is not a real RAG/documentation assistant yet

The current `queryAssistant()` only fetches the first 6 active products from Prisma:

```ts
take: 6
```

There is no actual:

- technical document ingestion;
- document chunking;
- embeddings/vector search;
- file остатки/inventory matching;
- supplier availability check;
- source citation from real documents;
- admin UI for documents/inventory;
- persisted assistant logs/feedback.

The current sources are hardcoded/fake text. This should be clearly labelled as MVP prototype until real RAG and inventory integration are implemented.

### P1: Hardcoded discount invents commercial terms

File: `src/lib/assistant/draft-order.ts`

The draft order applies a 10% discount automatically when subtotal is greater than 3000:

```ts
const discount = subtotal > 3000 ? Math.round(subtotal * 0.1) : 0;
```

This violates the product rule that the assistant must not invent prices, discounts, delivery, VAT, or commercial terms. Discounts must come from real promotion/pricing rules or be omitted.

### P1: Public assistant route lacks rate limiting and abuse controls

File: `src/app/api/assistant/chat/route.ts`

The endpoint is public and can trigger paid Claude API calls. It currently has no visible:

- rate limiting;
- request size limit;
- schema validation;
- prompt-injection guard;
- abuse throttling;
- cost logging;
- origin/session controls.

This is risky before production deployment.

### P2: The prompt/schema and TypeScript types do not match

File: `src/lib/assistant/prompts.ts`

The prompt asks for partial shapes like:

```json
"draftOrder": { "items": [...] }
"orderComparison": { "proposedItems": [...] }
```

But the TypeScript types require full `AssistantDraftOrder` and `AssistantOrderComparison` shapes with totals, previous/proposed orders, changed items, etc.

Required fix:

- Create a model-output schema separate from internal UI/domain schema.
- Convert model output into validated internal objects on the server.
- Recalculate totals and comparison deltas from trusted product data.

### P2: Fallback matcher contains fake products and fake technical claims

File: `src/lib/assistant/claude.ts`

The fallback branch constructs fake products like:

```ts
id: 'prod_1'
name: '... AGM 12V 100Ah'
price: 4500
```

The assistant must not recommend fake products. If no matching catalog products exist, it should ask a clarifying question or return “потрібне уточнення”.

### P2: UX uses browser `alert()` placeholders

File: `src/components/assistant/assistant-panel.tsx`

There are `alert()` placeholders for unsupported voice and detailed comparison. Replace these with in-panel UI states/toasts consistent with the design system.

### P2: Brand typo appears in assistant UI/prompt

Several strings use `Elektrononom` / `Electrononom` instead of `Elektronom` / `Electronom`.

Fix all assistant copy, prompt text, and UI labels to use the correct brand spelling.

### P2: Cart sync is explicit but needs stronger confirmation

File: `src/components/assistant/assistant-draft-order.tsx`

The panel copies the draft order into the real cart only when the user clicks the button, which is directionally correct. However, before adding multiple items to the real cart, show a confirmation/clear CTA:

```text
Додати всі товари в кошик
```

Also handle partial failures: if one item fails to add, show which item failed and do not display global success.

## Required Developer Fix Plan

1. Fix the TypeScript import error and rerun `tsc`.
2. Restore all corrupted Ukrainian/Russian strings and move UI copy into locale files.
3. Replace fake fallback products and hardcoded technical claims with catalog-only recommendations or clarification questions.
4. Remove hardcoded 10% discount unless it comes from real pricing rules.
5. Add Zod validation for request and Claude response payloads.
6. Separate Claude model output schema from trusted internal order/comparison schema.
7. Recalculate all prices, totals, availability, and comparisons on the server from trusted product data.
8. Return real API error statuses instead of HTTP 200 on server failure.
9. Add rate limiting, request size limits, and basic prompt-injection protection.
10. Add real RAG/inventory/supplier integration or explicitly mark the current version as an MVP UI prototype.
11. Replace `alert()` with UI toasts/panel states.
12. Add visual QA screenshots after the feature compiles.

## Acceptance Status

Not ready for acceptance. The implementation has a useful UI direction, but the feature currently fails type checking and lacks the technical-data backbone required for a real product-selection consultant.
