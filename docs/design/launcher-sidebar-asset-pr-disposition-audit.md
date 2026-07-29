# Launcher Sidebar Asset PR Disposition Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Reviewed pull request: `#2 - Add launcher asset contract and sidebar metadata`

Status: connector-only, read-only PR disposition audit; no PR edit, merge, rebase, source, asset, test, UI, or roadmap change

## 1. Decision

Do not merge PR #2 as-is.

Disposition:

`REAUTHOR_SMALLER_CURRENT_HEAD_CHANGE`

The pull request contains useful intent:

- a typed sidebar-asset shape;
- an explicit 7:2 aspect-ratio constant;
- QA-oriented launcher metadata;
- paired active/inactive asset requirements;
- a durable asset-path contract.

However, its two new SVG files contradict the contract they are intended to satisfy, the branch is based on an old repository state, and no local UI or asset validation was run.

The safest posture is to preserve the useful design and metadata ideas through a fresh current-head pass, regenerate or revise the Bloodlines assets after a user-facing label decision, and then validate the narrow UI change locally.

## 2. Pull Request State

PR #2 is:

- open;
- not merged;
- currently reported mergeable by GitHub;
- based on old master SHA `e71f8f6b625f7b6744492cc8b19ab695f788d89c`;
- headed by `main-menu-asset-contract-pass` at `e78dc645cfb658685be12f45f46d34b7c0da1119`;
- ten commits;
- four changed files;
- 196 additions and two deletions;
- explicitly marked as having no tests run.

Current accepted master has advanced substantially beyond the PR base, including runtime ownership transitions, UI information-architecture authority, static-content milestones, health foundations, and the proactive connector policy.

GitHub mergeability only means a merge commit can currently be calculated. It does not establish semantic currency, test readiness, accessibility compliance, or design consistency.

## 3. Changed Files

The PR changes exactly:

1. `apps/rpg-ui/public/launcher/bloodlines-active-soft.svg`;
2. `apps/rpg-ui/public/launcher/bloodlines-inactive-soft.svg`;
3. `apps/rpg-ui/src/game-shell/components/AppShell.tsx`;
4. `docs/design/main-menu-launcher-asset-contract.md`.

## 4. Current Master Baseline

Current `AppShell.tsx`:

- defines a launcher asset map for Characters, Legacy, Chronicles, and Settings;
- uses paired inactive/active image paths;
- renders image-backed labels as screen-reader-only live React text;
- leaves unknown sections such as Bloodlines on the visible text fallback;
- contains no exported aspect-ratio constant;
- contains no launcher-section or asset-availability data attributes.

Current master does not contain:

- either Bloodlines SVG;
- the proposed launcher asset contract document.

Therefore the PR is not redundant, but it is stale and internally inconsistent.

## 5. `AppShell.tsx` Patch Disposition

### Proposed changes

The PR would:

- introduce `LauncherSidebarAsset`;
- change the map to `Partial<Record<string, LauncherSidebarAsset>>`;
- export `LAUNCHER_SIDEBAR_ART_ASPECT_RATIO = '7 / 2'`;
- add a comment documenting paired asset behavior;
- add Bloodlines SVG paths;
- add:
  - `data-launcher-section`;
  - `data-launcher-has-art`;
  - `data-launcher-art-aspect`;
- use a named `hasAssets` boolean.

### Assessment

| Change | Disposition | Reason |
| --- | --- | --- |
| Typed asset object | `REUSE` | Improves clarity without changing behavior. |
| Partial record map | `REUSE` | Correctly represents text-fallback sections. |
| Exported aspect ratio | `REUSE_WITH_REVIEW` | Useful for CSS/tests, but confirm whether string CSS ratio or numeric tuple is preferred. |
| Paired-asset comment | `REWRITE` | Current wording forbids baked labels while proposed assets contain them. |
| Bloodlines map entry | `DEFER` | Depends on corrected/accepted asset pair. |
| Section and asset data attributes | `REUSE_WITH_LOCAL_TEST` | Useful for QA/source guards; ensure they are genuinely needed and stable. |
| Aspect data attribute | `OPTIONAL` | Useful for QA but duplicates an implementation constant on every button. |
| `hasAssets` local | `REUSE` | Clear and behavior-neutral. |

### Behavior boundary

The source patch appears narrow and does not intentionally change save, account, navigation, progression, or unlock behavior.

Nevertheless, a current-head implementation should locally verify:

- image-backed and text-fallback sections;
- active/inactive image switching;
- disabled items;
- responsive horizontal/vertical navigation;
- accessible names;
- no duplicate visible text;
- no missing asset requests;
- no CSS regression.

## 6. Asset Contract Contradiction

The proposed code comment and design document say:

- live labels should remain in React;
- assets should not include baked readable labels, logos, or UI text.

Both proposed SVGs contain embedded text nodes spelling:

`Bloodlines`

The active asset includes three overlaid text nodes. The inactive asset includes two.

This is a direct contract violation, not a subjective visual preference.

### Consequences

- localization cannot replace the embedded word;
- visual and accessible labels can diverge;
- font rendering depends on `EB Garamond` or fallback availability;
- the same label is represented in both asset bytes and live React accessibility text;
- future renaming requires asset regeneration;
- visual QA cannot truthfully certify “no baked labels.”

### Required resolution

Choose one explicit policy before implementation:

#### Policy A — label-free art

- remove all `<text>` from the SVGs;
- keep live visible React labels over the art;
- retain localization and typography control;
- update CSS and stacking accordingly.

This is the stronger long-term contract.

#### Policy B — authored text-bearing plates

- explicitly allow embedded display labels;
- keep live accessible names in React;
- accept that each localized label needs its own asset or the launcher is single-language;
- remove the false no-baked-text rule;
- define font and fallback reproducibility.

Do not merge while the repository claims Policy A but implements Policy B.

## 7. SVG Technical Review

### Positive findings

Both SVGs:

- use a `700 x 200` viewBox, matching 7:2;
- provide active/inactive variants;
- include no external image dependency;
- use deterministic inline gradients and filters;
- fit the intended dark medieval-fantasy launcher treatment;
- contain explicit role/label metadata inside the SVG.

### Issues requiring local review or re-authoring

1. Embedded readable label contradicts the contract.
2. SVG internal `role="img"` and `aria-label` are unnecessary when the parent image is rendered with empty alt and an `aria-hidden` wrapper; accessibility ownership should remain with the button.
3. `EB Garamond` is not the accepted baseline UI font token and may render differently or fall back across systems.
4. Filter-heavy SVG appearance and performance have not been checked in target browsers.
5. Active and inactive contrast has not been tested against dark/light themes or high-contrast settings.
6. No reduced-motion issue is present, but no forced-colors or image-disabled fallback was verified.
7. No local screenshot or responsive QA evidence exists.

### Asset disposition

`REGENERATE_OR_EDIT_BEFORE_USE`

Do not cherry-pick the current SVGs unchanged.

## 8. Design Document Disposition

The proposed `main-menu-launcher-asset-contract.md` has useful structure:

- exact paths;
- paired state requirements;
- dimensions;
- future background paths;
- optional overlay paths;
- QA checklist.

### Keep

- paired active/inactive rule;
- path ownership;
- 7:2 button aspect;
- live accessibility requirement;
- no behavior implication;
- fallback requirement;
- QA checklist.

### Revise

- resolve label-free versus text-bearing policy;
- distinguish committed assets from proposed future paths;
- state that asset existence does not activate a section;
- align typography with current UI policy;
- add high-contrast, image-disabled, loading-error, and localization posture;
- avoid presenting optional save-row/background filenames as approved production requirements without a selected visual direction;
- identify source-art/provenance and generated-asset retention posture;
- state whether SVG is accepted or PNG is the preferred production format;
- require local visual regression or focused UI tests before activation.

### Document disposition

`REAUTHOR_ON_CURRENT_HEAD`

The document should not be copied verbatim because its central no-baked-label rule is contradicted by its own asset table and implementation.

## 9. Merge And Commit Strategy

Do not merge or rebase the ten-commit branch directly.

Recommended path:

1. obtain the user's label/art direction;
2. create a fresh branch from accepted current master;
3. add a corrected documentation-only asset contract first;
4. separately create or regenerate the Bloodlines pair;
5. apply the small `AppShell.tsx` metadata/map change;
6. add focused source or component tests;
7. run local UI/type/build checks appropriate to the package;
8. inspect visual output at representative widths and themes;
9. close PR #2 as superseded after the replacement is accepted.

This avoids importing ten historical commits and makes each decision reviewable.

## 10. Smallest Safe Replacement Packages

### Package 1 — documentation only

`Launcher Sidebar Asset And Live-Label Contract Decision`

Decide:

- label-free versus embedded-label art;
- supported formats;
- dimensions and crop;
- paths and state pairing;
- localization;
- accessibility ownership;
- loading/missing/unknown behavior;
- theme/high-contrast behavior;
- source/provenance requirements.

### Package 2 — asset pair

Add only the accepted Bloodlines inactive/active files.

No source activation.

### Package 3 — narrow source activation

Update only the asset map/metadata and focused tests after both files exist and local QA passes.

## 11. User Input Required

Before replacement asset work, ask:

1. Should launcher art contain the section name, or should all readable labels remain live UI text?
2. Should the launcher remain English-only for the foreseeable future, or preserve localization-ready assets?
3. Is the current Bloodlines visual motif direction acceptable, or should a new crest/lineage-tree concept be produced?
4. Should all existing launcher buttons eventually move to label-free art for consistency?
5. Are the proposed full-screen background and save-row overlays desired, or should the contract stay limited to current sidebar assets?

These choices materially affect asset production and should not be inferred from the stale PR.

## 12. Final Per-File Disposition

| File | Disposition |
| --- | --- |
| `bloodlines-active-soft.svg` | regenerate/edit before use |
| `bloodlines-inactive-soft.svg` | regenerate/edit before use |
| `AppShell.tsx` patch | selectively re-author on current head with tests |
| `main-menu-launcher-asset-contract.md` | re-author after label policy decision |

Overall result:

`DO_NOT_MERGE_AS_IS`

No current master change is required solely to dispose of the PR. Close it only after a replacement path is accepted or the user decides to abandon the asset lane.
