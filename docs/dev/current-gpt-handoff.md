# Current GPT Handoff

Source version/run: Version 0.5.249 - First Polity Content Seed
Date: 2026-06-28
Status: first live planned-only polity content seed completed; no government, law, claim, border, control, diplomacy, conflict, tax, legal/player-state, runtime, UI, storage, command, event, reward, migration, or gameplay behavior changed

## Current Polity Authority

- `world.polities` is static authored political identity authority only.
- Live content now exists at `packages/content/base/world/polities.json`.
- The live seed contains exactly two `status: "planned"` records: `polity.valtherion` and `polity.draemor`.
- Normal content lint now registers `world.polities` narrowly through `tools/content-lint/polities.mjs` and validates the live seed against current region, region-locality, and settlement authority.
- Polity records remain descriptive and non-executing. They do not define government, ruler, jurisdiction, law, claim, border, control, diplomacy, conflict, faction, institution, force, tax, legal/player-state, Knowledge subject, runtime, UI, storage, command, event, reward, or gameplay behavior.

## Latest Result

Latest completed:

- `Version 0.5.249 - First Polity Content Seed`

Immediate next:

- `Version 0.5.250 - First World Map Feature Content Seed Plan`

## Polity Seed Result

- Fresh local audit reconfirmed both approved candidates from `docs/design/first-polity-content-seed-plan.md`.
- `polity.valtherion` is anchored to `region.valtherion` and `settlement.highcrown`; current authored evidence names Valtherion as the primary world civilization center and political center, and names Highcrown as Valtherion's imperial river capital with crown/empire seat wording.
- `polity.draemor` is anchored to `region.draemor` and `settlement.riverthrone`; current authored evidence names Draemor and names Riverthrone as the political and commercial throne city of Draemor.
- Normal content lint registration was added only for `packages/content/base/world/polities.json` through the existing `validatePolities` helper.
- Focused polity tests now validate the live seed and its normal-lint registration.

## Validation Notes

- `node --test tests\unit\polity-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes with `content-lint: ok (60 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` still parses the polity schema, then fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- Direct polity audit passed for id/slug uniqueness, anchor resolution, duplicate-anchor rejection, and forbidden-field absence.

## Next Route Guardrail

`Version 0.5.250 - First World Map Feature Content Seed Plan` should remain docs-first and narrow. Do not expand from the new polity seed into government, law, claims, borders, diplomacy, conflict, taxation, Knowledge polity subjects, runtime, UI, storage, commands, events, rewards, or gameplay behavior without a dedicated future decision.
