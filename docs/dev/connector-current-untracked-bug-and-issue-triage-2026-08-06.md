# Connector Current Untracked Bug And Issue Triage

Date: 2026-08-06

Inspected source head: `cc8807b284b4fac6dc8d3a5e83a87aee7ed51fc7`

Execution surface: ChatGPT through GitHub Connector only

Status: `CONNECTOR_TRIAGE_COMPLETE_ONE_NEW_BOUNDED_ASSET_VARIANT_ISSUE`

## Purpose

Inspect current hosted repository evidence for concrete bugs, defects, or maintenance issues that are not already recorded by the active prompt, current handoff/output, the three connector evidence indexes, open GitHub issues, or existing focused audits.

This is a static Connector triage, not executable validation. It does not change production source, tests, assets, content, schemas, persistence, migrations, dependencies, branches, or the active prompt.

## Inspections Performed

The Connector inspected:

- current `master` identity and recent commits;
- current prompt, handoff, output, workflow policies, and token-reset prestage;
- open GitHub issues and pull requests;
- hosted recursive repository tree;
- indexed source searches for `TODO`, `FIXME`, skipped-test markers, `Math.random`, and `Date.now`;
- character-creator continent art registration and consumption;
- all files under `apps/rpg-ui/public/character-creator/continents/`;
- repository search for an existing duplicate selected-art issue or decision.

At the inspected head:

- GitHub exposed no open issues;
- no indexed `TODO` or `FIXME` markers were found;
- no indexed `describe.skip`, `it.skip`, `test.skip`, `xdescribe`, `xit`, or `xtest` markers were found;
- no indexed `Math.random` or `Date.now` use was found;
- no existing repository document or issue was found that classifies the continent selected-art duplication below.

Search absence is not proof that no other defect exists. It only narrows this Connector-visible audit.

## New Bounded Issue — LR-UI-ASSET-001

### Title

Character-creator continent selected-image variants are byte-identical to their normal-image variants.

### Classification

`CONFIRMED_REPOSITORY_ASSET_VARIANT_DUPLICATION_PRODUCT_IMPACT_REQUIRES_VISUAL_REVIEW`

### Source contract

`apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` defines a distinct `selectedImageUrl` for every continent card:

- Kaelvar;
- Valtherion;
- Serathyl;
- Draemor;
- Talmyra;
- Myridian Chain;
- Lantern Isles;
- Serpent's Wake;
- Dawnreach Isles.

`apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx` calls `getContinentCardArt`, determines whether the option is selected, and chooses `selectedImageUrl` before falling back to `imageUrl`.

The source therefore contains a first-class selected-art channel and actively switches asset paths when selection changes.

### Binary evidence

GitHub's content metadata reports the same blob SHA and file size for each selected/default pair:

| Continent asset | Shared Git blob SHA | Shared size |
| --- | --- | ---: |
| Dawnreach Isles | `9c4febae17e4979250ce1e5880a697e5c024bd89` | 3,447,850 bytes |
| Draemor | `ba53bfb1ee60f9e689b441bdf12194e63b82fdd0` | 4,020,839 bytes |
| Kaelvar | `c5ae16e855c75c5c8d2c1aa815249539373eff8b` | 3,702,529 bytes |
| Lantern Isles | `b93d5e889ef409c3c4f4b2b9f63d07a841780214` | 3,134,923 bytes |
| Myridian Chain | `f26c635152faa26f5cc8941b9e24f956447443b0` | 4,134,968 bytes |
| Serathyl | `55bb267a740a9ed32e5ea589ee635309d0a45d39` | 3,886,699 bytes |
| Serpent's Wake | `41463961513046fe9a96be1ae69325b69ff41eed` | 3,649,255 bytes |
| Talmyra | `6d601856872c736b7cd400d9dfc12801844a9abb` | 3,764,727 bytes |
| Valtherion | `192a2f317713a69f7598d9b60e456b1f7fb48a12` | 3,630,571 bytes |

Matching Git blob SHAs prove that each selected file is byte-for-byte identical to its default counterpart.

### Confirmed effect

The selected-specific image path cannot provide any distinct image content because it resolves to identical bytes.

This audit does **not** conclude that the selected card has no visible or accessible state. CSS classes, border treatment, text, focus, or other semantic state may still distinguish selection. The confirmed issue is narrower:

> The explicit selected-image variant channel is ineffective for all nine continent cards and duplicates approximately 33.37 MB of logical file entries without delivering distinct selected artwork.

Git object storage may deduplicate identical blobs internally, so this audit does not claim that Git stores two physical copies of each image. Packaged/static-host output behavior requires local build inspection.

### Possible explanations requiring owner decision

The duplication may be:

1. an unfinished placeholder awaiting selected-state artwork;
2. intentional because CSS alone owns selected treatment, in which case `selectedImageUrl` and duplicate files are misleading or unnecessary;
3. an asset-generation or copy mistake;
4. an intentional future contract whose current incomplete state should be documented explicitly.

Repository evidence inspected by this pass did not resolve which explanation is intended.

### Current route impact

`NO_ACTIVE_ROUTE_IMPACT`

This issue does not affect the historical recovery-fork decision, parent `0.6.9` acceptance, or the blocked Ashen Reef route. It should not interrupt the next Codex persistence run.

### Recommended named consumer

A later consolidated character-creator visual asset and UI contract pass should decide one of two coherent outcomes:

#### Outcome A — Distinct selected artwork

- replace every selected file with intentionally distinct art;
- preserve exact catalog mappings;
- verify all nine normal and selected paths load;
- verify selected/default hashes differ intentionally;
- run the UI production build;
- perform browser visual checks at supported responsive widths;
- preserve keyboard, focus, and accessible selected-state behavior.

#### Outcome B — CSS/semantic selection owns the state

- remove or stop registering redundant selected-image variants;
- use the normal image consistently;
- document that visual selection is owned by CSS/semantic treatment;
- remove only assets proven unused after build and source search;
- run the UI production build and visual/accessibility checks.

Do not choose between these outcomes from Connector evidence alone. Product/visual direction and local browser/build validation are required.

### Recommended segmented execution

This is suitable for the bounded workflow in `docs/dev/codex-connector-segmentation-and-independent-review-policy.md`:

1. optional ChatGPT or creative-production asset-direction stage only if new selected artwork is desired;
2. one Codex run for current-source reconciliation, asset changes, UI/build/browser validation, and commit/push;
3. one Connector post-run review of path completeness, hash posture, documentation, and claim consistency.

It does not justify an immediate standalone Codex run while the active persistence decision is waiting.

## Existing Issues Not Reopened Here

The repository already contains extensive indexed evidence for gameplay ownership, persistence, economy, progression, UI state, accessibility, item use, travel, Knowledge, module integrity, content validation, combat AI, magic, activity advancement, quest action trees, civilization simulation, world spawning, tick orchestration, and character-panel mutation.

This triage does not duplicate those findings or convert them into new bugs. Their existing named consumers and applicability rules remain controlling.

The launcher asset PRs and branches also remain separately classified by the token-reset prestage and branch policy. This new character-creator finding does not change PR #2 or launcher branch disposition.

## No Other Newly Confirmed Defect

No second issue met all of these Connector-only proof requirements during this pass:

- concrete current repository evidence;
- not already covered by active authority or an indexed audit;
- bounded and accurately characterizable without local execution;
- sufficient confidence to record without guessing runtime behavior.

Potential runtime, build, test, packaging, browser, performance, or environment defects remain outside what static Connector inspection can prove.

## Codex Handling

The next active Codex run should:

- read this document only as a deferred issue inventory;
- not widen the historical recovery-fork decision to fix it;
- preserve the finding in current coordination documentation;
- leave implementation for the named character-creator visual asset/UI consumer;
- refresh the evidence before acting because source and assets may change.

## Validation And Limits

Performed:

- GitHub source and tree inspection;
- exact asset metadata comparison;
- source registration and selected-path consumer inspection;
- repository search for prior issue coverage.

Not performed:

- image decoding or visual comparison;
- local build or packaged-output size measurement;
- browser, responsive, keyboard, focus, contrast, or assistive-technology checks;
- source, test, asset, or content mutation;
- issue creation;
- product or art-direction decision.

## Disposition

`HOLD_NAMED_CONSUMER_CHARACTER_CREATOR_VISUAL_ASSET_UI_CONTRACT_PASS`

Retain this document until the selected-art ownership decision is implemented and independently reviewed, then fold the durable outcome into the applicable UI/asset documentation and retire or classify this triage according to repository artifact policy.
