# TZ: Content Factory integration for Electronom admin

Date: 2026-05-27
Scope: `C:\Users\sevri\Сайт\elektronom` admin products module + local Content Factory API.

## Goal

Add a semi-automatic AI content production entry point inside the product admin table. The operator should be able to open a product row, choose a content task, send a product context package to the local Content Factory, and queue a local desktop agent job.

## MVP Contract

Electronom admin talks to Content Factory only from server actions, never directly from the browser.

Environment variables:

```env
CONTENT_FACTORY_API_URL=http://127.0.0.1:8028
CONTENT_FACTORY_TOKEN=
```

MVP launch sequence:

1. Admin UI opens AI Factory modal from product row.
2. Operator chooses:
   - action type: product description, main image infographic, description infographic, article, video, shorts;
   - provider mode: mock, manual, cheap, quality;
   - automation mode: safe human review or full auto smoke.
3. Electronom server action loads product facts from the site database.
4. Server action creates Content Factory run:

```http
POST /api/cms-admin/factory-runs
```

Payload uses:

```json
{
  "source_type": "custom",
  "source_id": "electronom:{productId}",
  "action_type": "main_image_infographic",
  "language": "uk-UA",
  "provider_mode": "mock",
  "operator_notes": "Markdown product context"
}
```

`source_type=custom` is intentional for the MVP because the Content Factory and Electronom currently have separate product databases. The full product facts are passed in `operator_notes`. A future version should add a dedicated product import/upsert endpoint in Content Factory and then use `source_type=product`.

5. Server action queues local agent job:

```http
POST /api/local-agent/jobs
```

Payload:

```json
{
  "job_type": "factory_run.execute",
  "target_type": "factory_run",
  "target_id": "{factoryRunId}",
  "payload_json": {
    "run_id": "{factoryRunId}",
    "auto_approve_brief": true,
    "generate_asset": true,
    "auto_approve_asset": false,
    "export_cms": false
  }
}
```

## Human Control Modes

Safe mode:

- auto-approve brief;
- generate draft/asset when allowed;
- stop at human review;
- no CMS export without operator approval.

Full-auto smoke mode:

- auto-approve brief;
- generate asset;
- auto-approve asset;
- export CMS draft;
- must show a confirmation before launch.

## Product Context Requirements

The server action must include:

- product ID, SKU, slug;
- Ukrainian and Russian names/descriptions;
- category and brand;
- price, compare price, cost price, stock;
- image URLs with provider metadata;
- storefront URL;
- operator notes.

Visual generation rules to include for infographic/image tasks:

- use real product image references;
- do not replace the product with a rendered substitute;
- avoid price badges unless explicitly requested;
- exact numeric claims must come from product facts or reviewed research;
- buyer pain must be stated as a problem to resolve, not as a fake claim.

## Current Limitations

- Factory status is returned after launch but not yet persisted in Electronom DB.
- Product import into Factory DB is not implemented yet.
- Generated CMS draft is not automatically written back into Electronom product fields.
- The local agent runner is started outside the Electronom app by CLI:

```powershell
python -m app.cli run-local-agent-loop --agent-id desktop-local-agent
```

## Next Integration Milestones

1. Add product upsert endpoint to Content Factory.
2. Persist `factoryRunId` and `localAgentJobId` per product in Electronom.
3. Add status polling in admin row.
4. Add result preview and approve/deny UI inside Electronom.
5. Add write-back actions:
   - update product description;
   - attach generated image;
   - create article draft;
   - attach video/shorts brief.
