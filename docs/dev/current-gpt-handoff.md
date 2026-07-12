# Current GPT Handoff

Source version/run: Version 0.5.336 - Business Authority Schema Plan
Date: 2026-07-11

## Status

Latest completed primary:

- `Version 0.5.336 - Business Authority Schema Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.337 - Business Authority Schema And Validator`

## Accepted Contract

- Authority: `civilization.businesses`.
- Future content: `packages/content/base/civilization/businesses.json` (must remain absent in `0.5.337`).
- Schema: `packages/schemas/civilization/business.schema.json`.
- Pure validator: `tools/content-lint/businesses.mjs`.
- Focused tests: `tests/unit/business-validation.test.mjs`.
- Exact fields: `id`, `slug`, `name`, `status`, `form`, `publicPosture`, `summary`, `sourceAuthorityNotes`, `notes`.
- Identity: `business.<lower_snake_slug>` with exact coherence and uniqueness.
- Lifecycle: `planned|active|retired`.
- Form: `company|partnership|cooperative|other|unknown`.
- Public posture: `public|semi_public|secret|unknown` as visibility only.
- No category/industry/businessType/businessScale and no first-pass references.

## Guardrails

Implement schema, pure validator, focused tests, and schema parse coverage only. Do not create live content or edit normal content lint.

Exactly zero candidates carry forward. Ironwheel, Gannet Cutter, generated `company.*`, account assets, quest anchors, building/workplace vocabulary, settlement businesses, UI, demo, and tests remain unpromoted and separately owned.

Reject people/owner/organization, place/facility/branch, service/provider/access, workforce/production, inventory/economy/finance, property/account, narrative/social, runtime/storage, and deferred-commercial fields.

No Deep Research, explicit user question, or support-suffix run is required before `0.5.337`.

Suggested next commit:

`docs(economy): plan business authority schema`
