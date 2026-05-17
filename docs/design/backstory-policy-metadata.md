# Backstory Policy Metadata Draft

`backstory-policy-metadata.json` is non-runtime planning metadata for future Background Legacy unlock work.

It must not be imported by gameplay code, character creation, new-game snapshot creation, account storage, Legacy purchase logic, preparation selection, run-start effect application, run-end payout, combat, magic, progression, launcher UI, or live presentation code. It exists to keep current backstory tone decisions, future primary background skill recommendations, and unlock-evidence intent visible before a runtime-safe resolver is designed.

The `futureStatus` field is planning metadata only. It is not an executable creator availability state, and it is not a resolver contract. A future Background Legacy resolver must use a separately reviewed runtime-safe policy shape rather than consuming this draft field directly.

The `baseBackgroundSkillBonus` values describe the intended future small background skill bonus model. They do not change current starter skills, current backstory selection, progression gates, Legacy behavior, or saved/account state.

## Tier, Lane, And Upgrade Planning

The tier, lane, branch, precursor, alternate-unlock, cap, extra-effect, and upgrade-scale fields are planning-only annotations. They are not a resolver contract, do not create live availability rules, and do not require current runtime code to apply a stacking rule. Any future resolver must use a separately reviewed runtime-safe policy shape before it can affect character creation, Legacy purchasing, starter skills, account state, saves, or progression.

`records[]` describes current authored backstories only. It must continue to match the live `backstories.json` id set exactly. The separate `futureBackstoryLaneDrafts[]` array is concept planning only: those drafts are not live backstory records, must not be counted as current content ids, and must not be imported into the character creator or Legacy runtime.

`standalone` is intentionally not part of the normal planning vocabulary. Higher-tier origins without direct lower-tier precursors must still have meaningful previous-play evidence plus Legacy purchase, prestige, Echo, or equivalent requirements; Legacy points alone are not enough.

The upgrade-scale fields may eventually represent 30-100, hundreds, or 1000+ incremental upgrades depending on balance, Echo, prestige, and cost curves. In this draft they remain descriptive planning metadata and must not change caps, purchase costs, runtime effects, or UI presentation.
