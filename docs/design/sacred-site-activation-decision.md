# Sacred Site Activation Decision

Version: `0.5.192 - Sacred Site Activation Decision`

## 1. Decision Summary

`sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` is ready for a later narrow content-only activation pass.

The live record remains `planned` in this run. Activation must be implemented separately and must change only the approved record's status unless focused validation requires a minimal note correction. Activation alone must not add a Knowledge snippet, align the Religion registry, or introduce any behavior.

Active status will mean only that the authoritative named sacred-site record is live authored world content. It will not imply Knowledge availability, pilgrimage mechanics, services, access rules, favorability, law, religious-order stewardship, spell access, Magic Study, runtime, UI, storage, or gameplay behavior.

## 2. Candidate Under Review

| Field | Current value |
| --- | --- |
| id | `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` |
| name | `Glasswake Shrine` |
| status | `planned` |
| parent hotspot | `religious_hotspot.glasswake_shrine_lantern_gardens` |
| religion | `religion.elemental_pantheon` |
| sacred-site type | `shrine` |
| public posture | `tolerant` |
| pilgrimage status | `local` |

The complete place anchor is:

- macro region: `region.lantern_isles`;
- region: `region.glasswake_quay`;
- region locality: `region_locality.lantern_shrine_gardens`;
- settlement: `settlement.glasswake_shrine`.

## 3. Readiness Evidence

The candidate is ready for later activation because:

- `packages/schemas/world/sacred-site.schema.json` defines the sacred-site record contract and permits active status;
- `tools/content-lint/sacred-sites.mjs` provides pure structural and semantic validation;
- `world.sacred_sites` is registered in normal content lint, which remains at 58 checked files;
- the current planned record validates in focused and normal content validation;
- its parent `religious_hotspot.glasswake_shrine_lantern_gardens` exists and is active;
- its macro-region, region, locality, and settlement anchor matches the parent hotspot;
- `religion.elemental_pantheon` exists as canonical religion authority;
- the record does not claim an unsupported deity dedication;
- the record does not claim an unsupported religious-order id or stewardship relationship;
- no dominant, tolerated, restricted, or other faith-posture arrays are present;
- no runtime, state, access, service, reward, command, event, or gameplay fields are present;
- Knowledge subject support now resolves `world.sacred_sites` and distinguishes planned/deferred rejection from active eligibility.

The active parent does not itself activate the child. It only satisfies the parent-status prerequisite for the later explicit child activation.

## 4. Activation Meaning

Active status will mean:

- Glasswake Shrine is a live authored named sacred-site authority;
- its canonical id becomes eligible for future direct Knowledge subject references;
- its content remains descriptive only.

Active status will not create services, access permissions, pilgrimage routes or progress, favorability, alignment, law, donations, rewards, runtime state, UI, storage, commands, events, or gameplay.

Eligibility is not authorization. A future Knowledge snippet must still satisfy the Religion registry and authored snippet requirements below.

## 5. Knowledge Boundary

The activation pass must not add a snippet or update `knowledge_domain.religion`. Religion must continue not to advertise `sacred_site` or `world.sacred_sites` immediately after activation.

A first live sacred-site snippet still requires:

1. live Religion registry alignment with `sacred_site` and `world.sacred_sites`;
2. one active canonical sacred-site subject;
3. a separate snippet seed plan selecting exact, non-duplicative wording and discovery posture;
4. a later narrow registry-and-snippet seed pass.

## 6. Remaining Snippet Blockers

Activation will not resolve these blockers:

- live Religion registry content does not advertise `sacred_site`;
- live Religion registry content does not advertise `world.sacred_sites`;
- no snippet seed plan has selected final wording or discovery details;
- no sacred-site Knowledge snippet exists;
- no site-specific deity dedication authority exists;
- no canonical site-specific religious-order authority or stewardship exists;
- no pilgrimage-route authority exists;
- no services, access, favorability, alignment, law, donation, reward, runtime, UI, storage, command, event, or gameplay systems exist for the site.

## 7. Activation Run Recommendation

The next recommended run is:

`Version 0.5.193 - Sacred Site Content Status Activation`

That implementation must:

1. change only `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine.status` from `planned` to `active`;
2. keep every other record field unchanged unless focused tests require a minimal note update;
3. run sacred-site focused validation and normal content lint;
4. update coordination docs;
5. leave Religion registry content, Knowledge snippets, Knowledge registry alignment, and religious hotspots unchanged;
6. add no runtime, UI, storage, command, event, reward, or gameplay behavior.

## 8. Non-Goals

- no `packages/content/base/world/sacred_sites.json` change in this run;
- no sacred-site status change in this run;
- no Knowledge schema or validator change;
- no Knowledge snippet change;
- no Religion registry change;
- no religious hotspot or religion content change;
- no deity or religious-order authority change;
- no pilgrimage route, favorability, alignment, law, service, access, donation, reward, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, command, event, or gameplay behavior;
- no transition to `0.6.0`.
