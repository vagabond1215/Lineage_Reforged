# Backstory Policy Metadata Draft

`backstory-policy-metadata.json` is non-runtime planning metadata for future Background Legacy unlock work.

It must not be imported by gameplay code, character creation, new-game snapshot creation, account storage, Legacy purchase logic, preparation selection, run-start effect application, run-end payout, combat, magic, progression, launcher UI, or live presentation code. It exists to keep current backstory tone decisions, future primary background skill recommendations, and unlock-evidence intent visible before a runtime-safe resolver is designed.

The `futureStatus` field is planning metadata only. It is not an executable creator availability state, and it is not a resolver contract. A future Background Legacy resolver must use a separately reviewed runtime-safe policy shape rather than consuming this draft field directly.

The `baseBackgroundSkillBonus` values describe the intended future small background skill bonus model. They do not change current starter skills, current backstory selection, progression gates, Legacy behavior, or saved/account state.

