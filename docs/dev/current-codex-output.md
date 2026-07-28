# Current Codex Output

Date: 2026-07-28

Source version/run: unversioned `Geographic Knowledge Taxonomy And Location Recognition Contract Plan`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean, fetched, and fast-forwarded from `f8fc9a42747cf57a786c9562220a7b369f98edac` to synchronized `origin/master` at `0872341b12ad5fced21cd725372447c6df1249be`; this report describes the validated working tree before the run commit.

## Result

The Geography/recognition plan is complete and accepted as documentation-only design authority.

`docs/design/location-recognition-and-geographic-knowledge-taxonomy.md` now separates domain metadata, taxonomy, authored recognition profiles/clues, source teaching, observation occurrences/results, mutable evidence/recognition, canonical place/political owners, and presentation. No content, schema, validator, helper, test, runtime, UI, save, map, overlay, dependency, or gameplay behavior changed.

## Reproduced Baseline

| Area | Verified result |
| --- | --- |
| Broad Knowledge registry | 7 records: 6 active plus planned Arcane Lore; no Geography record |
| Narrow Knowledge domains | 4 records: Flora, Fauna, Minerals, General Lore |
| Knowledge snippets | 28 tier-1 records; 18 General Lore; 24 `Recognizing ...` titles |
| Location subjects | region 2, settlement 4, settlement district 6, settlement site 7, sacred site 1, religious hotspot 1 |
| Knowledge contract gap | snippet/registry vocabularies include districts/sites; evidence/progress schemas do not |
| Evidence/progress runtime | pure validators/proposal helpers and fixtures only; no live mutable Knowledge evidence/progress store or accepted occurrence adapter |
| Geography-adjacent skills | Navigation, Common Lore, Civic Lore, Cultural Lore; none grants recognition |
| World place owners | 41 regions, 47 localities, 88 settlements, 14 active districts, 20 active sites |
| Map/travel owners | 8 planned semantic features, one visual aggregate, 47 hexes, 49 edges, one travel network with 12 route records and 8 ship lanes |
| Political owners | 2 planned polities; no claim, border, jurisdiction, or government collection/schema/content |
| Generic POIs | rejected and absent |
| Legacy runtime Geography | persisted continent/region/settlement numeric levels; seeded at new game and granted by accepted travel |

The isolated `origin/prep/integrated-gameplay-0-7-readiness-audit` branch remains unmerged and untouched.

## Accepted Decisions

- Future broad domain: `knowledge_domain.geography` in `player.knowledge_domain_registry`, planned wave 1.
- The narrow resource-identification domain collection does not own Geography.
- Future taxonomy owner: `player.knowledge_taxonomy_nodes`, initially one Geography root plus Physical Geography, Settlements And Places, Political Geography, and Cartography And Navigation.
- Future recognition owner: `player.location_recognition_profiles`, with profile-owned typed clues, independence, distinctiveness, interpretation, observation, and stability metadata.
- Future source relation owner: `player.knowledge_source_teachings`; access, possession, proximity, travel, catalog presence, or display does not teach clues.
- Observation follows the accepted request/admission/occurrence/result/evidence/acceptance/application separation.
- Canonical settlement, district, and site owners remain authoritative; null site districts remain valid; generic POIs remain prohibited.
- Regions, maps, routes, polities, claims, borders, jurisdictions, governments, and UI retain their existing owner boundaries.
- Existing `playerState.geographicKnowledge` levels remain preserved legacy behavior and are not mapped to future clue-based recognition states.
- Existing `Recognizing ...` snippets remain structural lore, not executable recognition criteria.

## Smallest Later Package

Selected future package: `Settlement District And Site Knowledge Evidence Subject Closure`.

This is a later current-band primary capability candidate in `0.6.x`, with no version number assigned here. It may add only district/site subject support and focused semantic closure to current Knowledge evidence/progress contracts. It must stop if generic POI authority, recognition/profile/source/occurrence runtime, storage, migration, UI, or weakened parent/lifecycle validation would be required.

The immediate next run remains the unversioned `Activity Resolution Existing-System Reuse Audit`; it was activated from the held prompt body after every prerequisite and route gate passed.

## Files Changed

- `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/design/static-content-expansion-program.md`

## Checks Run

- repository/branch/worktree/remote/tracking inspection;
- `git fetch --prune` and safe `git pull --ff-only`;
- isolated-branch merge-base and ancestor check;
- exact live Knowledge, place, map, route, polity, skill, runtime, save, UI, and occurrence-source inventory;
- referenced-path existence check;
- active-prompt title/body/hold-wrapper verification;
- source/test/content/runtime changed-path exclusion;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete changed-path and full-diff review.

No build, content lint, typecheck, test, server, generator, package installation, or gameplay command was run because this was a documentation-only contract plan and no repository-fact check required one.

## Suggested Commit Message

`docs(knowledge): define geography recognition contracts`

## Risks / Follow-Up Notes

- The live evidence/progress subject-vocabulary gap for 13 district/site snippets remains unimplemented.
- Geography domain, taxonomy, profiles, source teachings, occurrences, mutable recognition, migration, and UI remain future packages.
- The legacy numeric Geography state still grants through travel and must be characterized before any adapter or migration.
- The known lower `docs/dev/project-roadmap.md` `## 1. Current Anchor` block remains stale and noncontrolling; it was not rewritten from partial context.
- Workspace typecheck remains the separately classified 173-diagnostic baseline.

## Next Recommended Run

Unversioned `Activity Resolution Existing-System Reuse Audit`
