# Legacy Upgrade Catalog Draft

This directory contains a non-runtime planning draft for the future ranked Legacy Upgrade Catalog.

`legacy-upgrade-catalog-draft.json` is not a live content file. It must not be imported by gameplay code, account storage, purchase logic, preparation selection, run-start effect application, run-end payout, or UI presentation. It exists only to keep the future hierarchy, currencies, scopes, durations, breakthrough intent, and balance risks visible while the runtime remains account-scoped.

Live implementation must be split into later small prompts. Each slice should first add the owning storage or runtime contract, then strict validation, then focused tests, and only then migrate specific records into `packages/content/base/player/legacy_unlocks.json` when they are safe to expose.

The `implementationPriority` field is descriptive metadata only. In the current live catalog, this field does not hide, disable, filter, or expose entries by itself.

