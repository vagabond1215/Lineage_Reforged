# Compact Character Sheet UI and Inventory Dock

**Run:** 2026-10-24, unversioned UI presentation support on `master` from `ea8923fed2b48b71007635cc7c3eb755ea776b48`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; development milestone impact `none`; game-version impact `none`. DEV-0.7.2.13 remains parked.

## Scope and owner boundary

The existing `InGameShell` continues to own top bar, navigation and saved-session routing. `CharacterPanel` continues to use its existing equipment/inventory owner functions. This pass changes presentation and routes Inventory to a seventh primary dock item. It leaves knowledge, standing, reputation and discoveries in Character subsections, while the accepted UI boundary records their future information-architecture decision. Lineage art is labeled as illustration because no saved personal portrait exists. Season/watch pictograms are calendar projections; no current-weather state is inferred. Protein/Carbs/Fat remain marked illustrative prototype fills; owner-backed Energy, Water, HP, MP and ST are unchanged.

## Source changes

- Compact Character Overview grid with saved physical identifiers, nine clickable attributes, leading skills, traits/effects, growth, equipped slot summary and an authored lineage illustration. Preserve detailed Character subsections and their keyboard strip.
- Inventory has its own left-dock route and panel, with existing filter/sort, selection, Equip/Use, favorites, bag/overflow and notices. Equipment's carried-item action opens that route; focus moves to the Inventory heading.
- Top-bar outer padding shrinks; nutrition vertical tracks grow from 2 to 2.5 rem. Resource and prototype macro track groups share a 17 rem maximum width. The climate text becomes season/watch SVG pictograms with an accessible current-weather-unavailable label; the climate popup remains.

## Validation and limitations

Focused ten-file UI/owner suite: **34/34 pass**; after the final narrow-screen Inventory detail preservation edit, the directly affected four-file suite passed **10/10**. Character keyboard navigation unit: **1/1 pass**. `npm run typecheck:node`: pass. `npx vite build`: pass, 257 modules; current client assets `index--u9twb9N.js` and `index-BMaeRCF_.css`. Broad `npm run typecheck`: exit 2, **117 diagnostics**, matching the prior `master` count and with none in touched files. `git diff --check`: pass. Localhost request from this executor was denied by socket permissions, and no authenticated selected-client session was used; actual hosted Character/Inventory clicks, viewport measurements and Save/restart remain held. No change to nutrition, weather simulation, item rules, save schema, combat or Game version.

FP-001: `InGameShell` routes the same `CharacterPanel` Inventory owner view; owner-action tests pass. FP-002: SSR/build results are not selected-client acceptance. FP-009: source and deployment identities must be read back after publication. FP-016: live placement/overflow still need selected viewport review. No branch or PR is consumed by this bounded main change; draft #5–#16 and their evidence/acceptance holds remain. Review their dispositions only after exact-main selected acceptance and evidence promotion.

## Publication readback

Lineage implementation commit `5f735b816df4461d26db61d2000fc5134d1b4798` was pushed to and read back from `origin/master`. The separately authorized owner-private companion Site source was synchronized only for the ten changed UI source files, built and pushed as `ccb0e004584eeb0cf5c86cae416ef0211aa811d6`; remote `main` read back exactly. Lineage/Site `src` trees compare equal after line-ending normalization, and the built client JS/CSS SHA-256 values match (`46271D32A5C284B237107D985D77C95B6171E8381BB23557908F14F27AA11E2A` / `C948D28F88014FF97DE319DD45BE0383D70A3CF9A816D6EB2C824D52CD52F324`). Site version `appgprj_6a92239b7f5c8191a91bcf4ee1f0e136~appgver_1b31ca831de48191a072566849bfe77d` deployed successfully as `appgdep_6add699e55e081919c144ae099d663af` to `https://lineage-reforged-preview.vagabond1215.chatgpt.site`, retaining owner-private access. Its successful deployment does not close authenticated selected-client visual/action/Save acceptance.
