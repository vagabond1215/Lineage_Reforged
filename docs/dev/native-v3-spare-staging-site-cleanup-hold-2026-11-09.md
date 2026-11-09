# Native-v3 spare staging Site — deferred cleanup hold (2026-11-09)

**Disposition:** `NATIVE_V3_SPARE_SITE_CLEANUP_DEFERRED`. User-observed inventory reminder only. **No authorization to delete, edit, deploy, rebind, or activate any Site.**

The project owner reports that Codex created an additional Site during the native-v3 process. A screenshot supplied November 9 shows a Site tile titled **“Lineage: Reforged Native V3 Staging”**. This is the observed display title, **not a verified unique provider Site/project identifier**. The title and apparent spare status are user-supplied; the connector has **not** authenticated the Site object's ID, URL, underlying deployment, current bindings, usage, exact origin, nor its relationship to the established preview/production and native-v3 staging/rollback surfaces.

The live game/repository remains in `HOLD_SELECTED_ATOMIC_ACTIVATION`. Historic v2, selected accounts, Saves, deployed assets, native-v3 branch/release gates, stored rollback candidates and origin-specific persistence must be preserved.

## Safe cleanup gate, not a cleanup command

Only when a separate explicitly authorized infrastructure-maintenance task is opened:

1. Read current native-v3 deployment, staging, rollback, origin, and selected-account policy/records; list Sites objects through the provider's authenticated connection with their **exact immutable IDs**, display titles, URLs, created timestamps, deployment/source versions, bindings and dependency references.
2. Disambiguate the reported “Lineage: Reforged Native V3 Staging” tile from any canonical staging, preview, production, archive, rollback, test, or currently referenced Site. **Never use display name alone as deletion identity.**
3. Verify there are no active or held integration, QA, rollback, release, DNS, account, save/origin, evidence or historical references that depend on the candidate Site. Preserve any unique build/configuration/release evidence before proposing retirement.
4. Publish a read-only classification: `CONFIRMED_REDUNDANT`, `ACTIVE_OR_HELD_DEPENDENCY`, or `IDENTITY_UNRESOLVED`, with exact evidence and a separately proposed delete target if redundant.
5. Obtain explicit owner authorization for **that exact Site ID** before a later deletion task. Treat deletion and any provider/domain/origin cleanup as separate operations, with post-action verification; never remove account or Save data as a side effect.

**Current outcome:** `IDENTITY_UNRESOLVED; NO_PROVIDER_MUTATION; CLEANUP_DEFERRED`.

This is independent of historical UI PR #5–#16 retirement work. Do not activate native-v3, change current Codex prompts, or expand a UI branch cleanup into hosted infrastructure management.
