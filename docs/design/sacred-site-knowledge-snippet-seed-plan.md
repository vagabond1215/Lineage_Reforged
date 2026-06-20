# Sacred Site Knowledge Snippet Seed Plan

Version: `0.5.194 - Sacred Site Knowledge Snippet Seed Plan`

## 1. Decision Summary

Approve one future Tier 1 Religion Knowledge snippet for the active Glasswake Shrine sacred site. The snippet will target `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` and identify the named shrine authority itself.

The snippet is not implemented in this run. Religion registry alignment also does not happen in this run. Activation makes the canonical subject eligible, but live use remains unauthorized until Religion advertises both `sacred_site` and `world.sacred_sites` in the same narrow pass that adds the snippet.

The candidate is ready in principle but not ready for immediate seeding because the active site record retains stale `planned` wording. A content-text cleanup must land first.

## 2. Candidate Subject

| Field | Selected value |
| --- | --- |
| domain | `knowledge_domain.religion` |
| subject type | `sacred_site` |
| subject id | `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` |
| subject name | `Glasswake Shrine` |
| site status | `active` |
| parent hotspot | `religious_hotspot.glasswake_shrine_lantern_gardens` |
| religion | `religion.elemental_pantheon` |
| type | `shrine` |
| public posture | `tolerant` |
| pilgrimage status | `local` |

The canonical place anchor is:

- macro region: `region.lantern_isles`;
- region: `region.glasswake_quay`;
- region locality: `region_locality.lantern_shrine_gardens`;
- settlement: `settlement.glasswake_shrine`.

## 3. Non-Duplication Boundary

The existing `knowledge_snippet.religion.glasswake_shrine_lantern_gardens.identification` targets `religious_hotspot.glasswake_shrine_lantern_gardens`. It describes the broader religious concentration spanning the Glasswake Shrine settlement and its lantern shrine gardens, including settlement-and-gardens context.

The future sacred-site snippet must instead identify Glasswake Shrine as a separately named sacred-site authority inside Lantern Shrine Gardens. It must not repeat the hotspot snippet's broader settlement, gardens, traveler-relief, copied-record, herb-cultivation, or shrine-adjacent-pattern framing.

The snippet must not imply that the whole Lantern Shrine Gardens locality is an active sacred site. `religious_hotspot.lantern_shrine_gardens` remains planned and must remain unreferenced.

## 4. Active Content Wording Audit

The active record contains two stale activation references:

- its summary begins `A planned named shrine authority`;
- its first note begins `Planned descriptive authority only`.

Those phrases conflict with `status: "active"`. They do not invalidate the authority record, but live snippet seeding should not build on internally stale status prose.

Do not change the content in this planning run. A pre-seed cleanup is required, so the next run is:

`Version 0.5.195 - Sacred Site Active Text Cleanup`

That cleanup should replace only the stale status adjective in the summary and first note, preserve their descriptive/no-behavior meaning, update focused expectations if required, and leave registry/snippet seeding for a later run.

## 5. Future Snippet Record Shape

The future live record must use the existing Tier 1 Religion identification conventions: `book_study` with null source id, completion weight `1`, tier-completion participation enabled, trial unlock weight `0`, locked-until-discovered visibility, and subject identity reveal.

The following is non-live draft content only. It must not be added to `knowledge_snippets.json` in this run.

```json
{
  "id": "knowledge_snippet.religion.glasswake_shrine_lantern_gardens_glasswake_shrine.identification",
  "domainId": "knowledge_domain.religion",
  "subjectType": "sacred_site",
  "subjectId": "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing Glasswake Shrine",
  "summary": "Glasswake Shrine is a named sacred site within Lantern Shrine Gardens at Glasswake Quay, broadly associated with the Elemental Pantheon.",
  "discoverySources": [
    {
      "sourceType": "book_study",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified sacred site remains to be understood."
  },
  "notes": [
    "This snippet is authored Religion knowledge only and grants no deity dedication, religious-order stewardship, service, access, pilgrimage progress, favorability, alignment, law effect, spell access, Magic Study readiness, Prestige, family effect, runtime behavior, or gameplay behavior."
  ]
}
```

## 6. Draft Wording

- Title: `Recognizing Glasswake Shrine`
- Summary: `Glasswake Shrine is a named sacred site within Lantern Shrine Gardens at Glasswake Quay, broadly associated with the Elemental Pantheon.`
- Hidden summary: `An unidentified sacred site remains to be understood.`
- Note: use the descriptive-only boundary shown in the draft record.

The wording identifies the named site and broad religion association only. It claims no deity dedication, religious-order stewardship, services, access permission, law, pilgrimage route/progress/reward, favorability, alignment, spell access, Magic Study readiness, Prestige, family or inheritance effect, NPC, inventory, map/grid, travel, runtime, UI, storage, command, event, reward, or gameplay effect.

## 7. Religion Registry Alignment Timing

After active-text cleanup, Religion registry alignment and the first live snippet should land together in one later narrow content pass. That pass should:

1. add `sacred_site` to `knowledge_domain.religion.canonicalSubjectTypes`;
2. add `world.sacred_sites` to `knowledge_domain.religion.relatedContentCollections`;
3. keep `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` null;
4. add exactly the approved snippet record;
5. not create `knowledge_domain.sacred_sites`;
6. refresh Religion `schemaGapNotes` that still describe sacred-site schema vocabulary or validator authority as absent.

Registry alignment must not precede the snippet because that would advertise a direct subject with no live authored Knowledge record. The cleanup pass must not combine with alignment or seeding.

## 8. Future Validation Expectations

The later registry-and-snippet seed must prove:

- the new sacred-site snippet validates only after Religion advertises both the subject type and authority collection;
- the existing religious-hotspot snippet continues to validate unchanged;
- the live registry includes `sacred_site` and `world.sacred_sites` only in that implementation pass;
- the active Glasswake Shrine site is the only sacred-site subject referenced;
- no planned or deferred sacred-site subject is referenced;
- `religious_hotspot` and `sacred_site` ids remain non-interchangeable;
- policy refs remain null and no `knowledge_domain.sacred_sites` exists;
- normal content lint remains 58 checked files.

## 9. Non-Goals

- no `knowledge_snippets.json` change in this run;
- no `knowledge_domain_registry.json` change in this run;
- no `sacred_sites.json` change or status change in this run;
- no religious hotspot or religion content change;
- no schema, validator, or test change;
- no runtime, UI, storage, command, event, reward, gameplay, pilgrimage, favorability, alignment, law, service, access, donation, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, or travel behavior;
- no transition to `0.6.0`.
