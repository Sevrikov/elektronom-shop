# REPORT: Alpha 1.2 Guide QA (Verification Before Scaling)
**Date**: 2026-06-08  
**Scope**: QA validation of the first content guide page, layout elements, JSON-LD schemas, and gating controls under feature flags.

---

## 1. Goal & Methodology
The purpose of this QA cycle is to verify the technical correctness, UX layout, schema integrity, and gating mechanisms of the newly introduced electrical selection guide (*"Як вибрати автоматичний вимикач по струму, полюсах та характеристиці"* / *"Как выбрать автоматический выключатель по току, полюсам и характеристике"*) before scaling static article content.

### Methodology
1. **Environment Config**: Active feature flags configured in `.env` for local testing on port `3000`.
2. **Dynamic Gating Checks**: Fetching endpoints with flags enabled vs. disabled to verify HTTP status codes.
3. **DOM & Content Inspection**: Programmatic validation of the raw HTML content, table formatting, and cross-references.
4. **JSON-LD Schema Verification**: Extraction and validation of schema blocks (`BlogPosting`, `FAQPage`, `BreadcrumbList`) against search engine guidelines.

---

## 2. Test Case 1: Gating Controls (Flag Verification)

| Step | Feature Flags Configuration | Requested URL | Expected Status | Actual Status | Pass/Fail |
| :--- | :--- | :--- | :---: | :---: | :---: |
| 1.1 | `alpha12_content_guides_enabled="true"` | `/uk/blog/yak-vybraty-avtomatych-vymykach-po-strumu` | `200 OK` | `200 OK` | **PASS** |
| 1.2 | `alpha12_content_guides_enabled="true"` | `/ru/blog/yak-vybraty-avtomatych-vymykach-po-strumu` | `200 OK` | `200 OK` | **PASS** |
| 1.3 | `alpha12_content_guides_enabled="false"` | `/uk/blog/yak-vybraty-avtomatych-vymykach-po-strumu` | `404 Not Found` | `404 Not Found` | **PASS** |
| 1.4 | `alpha12_content_guides_enabled="false"` | `/ru/blog/yak-vybraty-avtomatych-vymykach-po-strumu` | `404 Not Found` | `404 Not Found` | **PASS** |

> [!NOTE]
> Gating correctly works at the router/page level. When the flag is disabled, both the page renderer and metadata generators bypass route parsing and return a standard `notFound()` response.

---

## 3. Test Case 2: Content & Layout Inspection

### 2.1. Direct Answer Block (AEO)
- **Ukrainian**: Container `bg-surface-alt p-5 rounded-2xl border border-border mb-6` is present as the very first content element. Text:
  > *"Швидка відповідь: Для вибору автоматичного вимикача підберіть його номінальний струм відповідно до перетину мідного кабелю проводки: 10А для 1.5 мм² та 16А для 2.5 мм²..."* (80 words, concise, high relevance, no outgoing links).
- **Russian**: Matches the design system. Word count (77 words) and density are correct.

### 2.2. Table of Contents (TOC)
- Navigation links (`#nominal`, `#poles`, `#curves`, `#table`, `#compatibility`, `#mistakes`) are correctly formatted as internal anchors, pointing directly to section IDs.

### 2.3. Parameters Selection Table
- **Alignment with Catalog Configuration**: Table headers and parameter keys are directly derived from the catalog filter config.
- **UK Headers**: `Параметр вибору` | `Технічні значення` | `Рекомендована сфера застосування`
- **UK Rows**:
  - *Номінальний струм, А* (values: `10А, 16А, 25А, 32А, 40А`)
  - *Кількість полюсів* (values: `1P, 2P, 3P, 4P`)
  - *Характеристика відкл.* (values: `B, C, D`)
  - *Відключна здатність, кА* (values: `4.5 кА, 6 кА, 10 кА`)
- **RU Headers & Rows**: Match RU translation keys.

### 2.4. Related Products & Categories
- **Keywords Query**: Prisma query returns 4 matching products using the keywords array (`['avtomat', 'vymykach', 'sh202', 'hager', 'abb', 'eaton', 'schneider']`).
- **Related Category**: Links point back to the dynamic catalog page `/uk/catalog` or category `/uk/catalog/avtomatychni-vymykachi`.

---

## 4. Test Case 3: JSON-LD Schema Verification

### 3.1. BlogPosting Schema
- **Publisher**: Uses `Organization` (`name: "Electronom"`, `logo: "http://localhost:3000/electronom.png"`).
- **URL / Canonical**: Emits absolute canonical IDs. For example:
  `"mainEntityOfPage": {"@type": "WebPage", "@id": "http://localhost:3000/uk/blog/yak-vybraty-avtomatych-vymykach-po-strumu"}`
- **E-E-A-T Author check**: `Person` schema is completely absent. No author details are leaked, respecting NAP guidelines until business verification occurs.
- **Status**: **PASS**

### 3.2. FAQPage Schema
- **Sync check**: The JSON-LD `FAQPage` schema is rendered only if `alpha12_faq_howto_schema_enabled` is active.
- **Alignment**: FAQ items in schema match the visual FAQ block exactly:
  1. *Який автомат потрібен для розеток?* / *Какой автомат нужен для розеток?*
  2. *Що захищає автоматичний вимикач?* / *Что защищает автоматический выключатель?*
  3. *У чому різниця між характеристиками B та C?* / *В чем разница между характеристиками B и C?*
- **HTML Sanitization**: All visual `<p>` tags inside `FAQPage.acceptedAnswer.text` are successfully stripped via regex `.replace(/<[^>]*>/g, '')` in `FAQSchema` before stringification.
- **Status**: **PASS**

---

## 5. Risks and Edge Cases Verified
1. **HTML Injections in JSON-LD**: Verified that titles, descriptions, and FAQ texts do not break the `<script>` tag. The `safeJsonLd` utility escapes symbols `<` into `\u003c`, `>` into `\u003e`, and `&` into `\u0026` successfully.
2. **Mobile Compatibility**: Content styles (`prose prose-blue max-w-none`) wrap text and tables cleanly. Tables use `overflow-x-auto` wrappers to prevent side-scrolling breakages.

---

## 6. Definition of Done Checklist
- [x] Guide responds with 200 OK when `alpha12_content_guides_enabled` is true.
- [x] Guide responds with 404 Not Found when `alpha12_content_guides_enabled` is false.
- [x] Micro-layouts (Direct Answer, TOC, Tables) conform to the template specification.
- [x] JSON-LD Article and FAQ schemas output correct metadata without exposing unapproved `Person` schemas.
- [x] No compilation warnings or typescript compilation errors (`npx tsc --noEmit` exit code: 0).
