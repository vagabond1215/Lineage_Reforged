# Harbormast–Starfall passenger passage

Status: bounded implementation candidate on `codex/native-v3-harbormast-passage`; private staging publication and selected atomic activation held. Game `0.1.1-prealpha`.

## Authority and scope

The owner's 2026-11-04 direction admits an ordinary passenger from a lawful fresh Harbormast Quay campaign to Starfall Port. The existing `route.starfall_port_harbormast_quay` and `travel_mode.sea_vessel` are the route and mode authority. A passenger need not own a vessel. Boarding is the accepted player travel command, which commits destination knowledge and arrival. This does not relax Starfall's chartered **starting** restriction or establish general sea travel.

The route's authored 5.02-day estimate rounds to 120 ticks at 24 ticks per day. The passenger command charges no fare and no direct HP, MP or Stamina cost. The existing per-tick body owner still applies passive losses and daily rollover; the voyage grants no food, water, lodging, healing or rest. In the representative fresh Human/Local/Hunter case, arrival retains positive HP and valid native-v3 state but reaches severe dehydration with hydration 0. The accepted quest and onward reef travel remain executable in controlled owner tests. This is a material playability limitation for private selected review, not a new survival exception.

The command accepts only the exact authored route/mode from a new-campaign Harbormast origin with one known origin row and no active encounter. A pre-existing Starfall location row blocks the transition. On accepted arrival, the same travel mutation appends one known Starfall location, sets the Harbormaster's Office, and asks the existing Ashen Reef offer owner to stage the authored one-time offer. It neither accepts nor tracks the quest. The original Starfall new-campaign offer path remains separate.

## Verification boundary

Red-before-green selected-caller regression initially failed because Harbormast had no player-travel origin. The corrected test covers actual native creator, World option, accepted passage, one offer, quest acceptance, reef travel, 120 ticks, passive body consequences, gear/currency conservation, native Save reader round trip, duplicate/stale/malformed/conflicting rejection and the chartered-start boundary. A current v2 Harbormast campaign still uses the same travel owner and save format. Adjacent selected host, equipment, survey and persistence tests pass.

Local browser QA reached the real `EpochApp` creator but browser control could not activate a visible continent card; it did not complete the creator-to-arrival UI path. The private staging Site remains on maintenance v1. No authenticated selected-client, hosted Save/restart, or hosted survival/quest acceptance result is claimed.

## Deferred

Passenger fares, provisions, vessel ownership, voyage interruption, general maritime transport, hydration balancing and any broader travel network remain separate decisions. Publish only a separately approved exact new artifact, then rerun authenticated selected acceptance before any atomic activation or merge.
