import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { soundingsSha256 } from "../../packages/engines/game-engine/src/soundings-fingerprint.ts";
import { submitSoundingsTurnInCaller } from "../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts";
import { preparePlayerSoundingsTurnInCommand, executePlayerSoundingsTurnInCommand } from "../../packages/engines/game-engine/src/player-soundings-turn-in.ts";
import { isTargetCampaignSnapshot } from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { buildSoundingsReceipts, serializeSoundingsIntent } from "../../packages/engines/game-engine/src/soundings-turn-in-authority.ts";
import { admitCampaignMutation, createCampaignSessionControl, preparePlayerSurveyCampaignMutation, commitPreparedPlayerSurveyCampaignMutation } from "../../packages/engines/game-engine/src/campaign-session.ts";
import { resolveNormalDefeat } from "../../packages/engines/game-engine/src/normal-defeat.ts";
import { deserializeSnapshot, serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import { createOrdinarySoundingsCampaign, publishAndRestart, travelTo, withCampaignStorage, REQUEST_ID } from "../helpers/soundings-ordinary-campaign.mjs";

test("bounded Soundings fingerprints match independent SHA-256 across padding and Unicode boundaries", () => {
  for (const value of ["", "abc", "Starfall α😀", ...[55,56,63,64,65,1000,1000000].map(n => "a".repeat(n))]) {
    assert.equal(soundingsSha256(value), createHash("sha256").update(value).digest("hex"));
  }
});

test("turn-in authority survives first non-head submission, later forks and defeat ledger rewrites", () => {
  withCampaignStorage(() => {
    const state = createOrdinarySoundingsCampaign();
    const historical = snapshot => createCampaignSessionControl({
      accountId: snapshot.accountId, campaignId: snapshot.campaignIdentity.campaignId,
      artifactId: "artifact.historical", publicationId: "publication.historical", artifactRevision: 1,
      continuityId: snapshot.campaignIdentity.continuityId, headArtifactId: "artifact.newer", headRevision: 2
    });
    const submitted = submitSoundingsTurnInCaller(state.snapshot, historical(state.snapshot), REQUEST_ID, new Map()).acceptedState;
    assert.ok(submitted);
    assert.equal(submitted.control.posture, "forked_unpublished");
    const retained = structuredClone(submitted.snapshot.authorityLedger.soundingsTurnIn);
    const later = travelTo({ snapshot: submitted.snapshot, control: historical(submitted.snapshot) }, "location.ashen_reef");
    assert.equal(later.control.posture, "forked_unpublished");
    assert.deepEqual(later.snapshot.authorityLedger.soundingsTurnIn, retained);
    assert.equal(isTargetCampaignSnapshot(later.snapshot), true);
    const defeatedSource = structuredClone(later.snapshot);
    defeatedSource.playerState.resources.hp.current = 0;
    const defeated = resolveNormalDefeat(defeatedSource, {sourceMutationId:"mutation.soundings.defeat",sourceKind:"accepted_mutation"}).snapshot;
    assert.deepEqual(defeated.authorityLedger.soundingsTurnIn, retained);
    assert.equal(isTargetCampaignSnapshot(defeated), true);
    assert.deepEqual(deserializeSnapshot(serializeSnapshot(defeated)).authorityLedger.soundingsTurnIn, retained);
  });
});

test("prepared campaign admission cannot credit more than the accepted five gold", () => {
  withCampaignStorage(() => {
    const source = createOrdinarySoundingsCampaign();
    const command = preparePlayerSoundingsTurnInCommand(source.snapshot, source.control, REQUEST_ID).command;
    const accepted = executePlayerSoundingsTurnInCommand(source.snapshot, source.control, command);
    const intent = command.normalizedIntent;
    const preparation = preparePlayerSurveyCampaignMutation(source.control, {
      mutationId: REQUEST_ID, sourceArtifactId: intent.sourceArtifactId, sourcePublicationId: intent.sourcePublicationId,
      sourceRevision: intent.sourceRevision, sourceSnapshot: source.snapshot
    });
    const forged = structuredClone(accepted.snapshot);
    forged.playerState.currency.gold += 1;
    assert.equal(commitPreparedPlayerSurveyCampaignMutation(source.control, source.snapshot, preparation, forged, accepted.result.resultId).accepted, false);
  });
});

test("optional absent ledger stays compatible and accepted ledger roundtrips without changing worldVersion", () => {
  withCampaignStorage(() => {
    let state = createOrdinarySoundingsCampaign();
    const worldVersion = state.snapshot.gameState.worldVersion;
    delete state.snapshot.authorityLedger.soundingsTurnIn;
    const oldRoundtrip = deserializeSnapshot(serializeSnapshot(state.snapshot));
    assert.equal(oldRoundtrip.authorityLedger.soundingsTurnIn, undefined);
    assert.equal(isTargetCampaignSnapshot(oldRoundtrip), true);
    const outcome = submitSoundingsTurnInCaller(state.snapshot, state.control, REQUEST_ID, new Map());
    assert.equal(outcome.outcome.kind, "accepted", outcome.outcome.notice?.detail);
    state = outcome.acceptedState;
    const ledger = structuredClone(state.snapshot.authorityLedger);
    const roundtrip = deserializeSnapshot(serializeSnapshot(state.snapshot));
    assert.deepEqual(roundtrip.authorityLedger, ledger);
    assert.equal(roundtrip.gameState.worldVersion, worldVersion);
    assert.equal(isTargetCampaignSnapshot(roundtrip), true);
    state = publishAndRestart(state.snapshot, state.control);
    assert.deepEqual(state.snapshot.authorityLedger, ledger);
    const duplicate = submitSoundingsTurnInCaller(state.snapshot, state.control, REQUEST_ID, new Map());
    assert.equal(duplicate.outcome.result.code, "duplicate");
    assert.equal(duplicate.acceptedState, null);
    state = travelTo(state, "location.ashen_reef");
    assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, ledger.soundingsTurnIn);
    assert.deepEqual(state.snapshot.authorityLedger.ashenReefSurvey, ledger.ashenReefSurvey);
    state = publishAndRestart(state.snapshot, state.control);
    assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, ledger.soundingsTurnIn);
  });
});

test("deeply incoherent turn-in graphs fail validation, admission and retries before replay", () => {
  withCampaignStorage(() => {
    const source = createOrdinarySoundingsCampaign();
    const prepared = preparePlayerSoundingsTurnInCommand(source.snapshot, source.control, REQUEST_ID);
    assert.equal(prepared.kind, "prepared");
    const accepted = executePlayerSoundingsTurnInCommand(source.snapshot, source.control, prepared.command);
    assert.equal(accepted.accepted, true, accepted.code);
    const mutations = [
      ledger => { ledger.version = 99; },
      ledger => { ledger.requests.push(structuredClone(ledger.requests[0])); },
      ledger => { ledger.occurrences[0].requestId = "soundings_turn_in_request.missing"; },
      ledger => { ledger.results[0].payment.gold = 6; },
      ledger => { ledger.consequenceReceipts.pop(); },
      ledger => { ledger.consequenceReceipts.push(structuredClone(ledger.consequenceReceipts[0])); },
      ledger => { ledger.consequenceReceipts.find(row => row.kind === "currency_credit").resultId = "soundings_turn_in_result.missing"; },
      ledger => { ledger.requests[0].normalizedIntent.expectedRevision += 1; },
      ledger => { ledger.results[0].characterId = "character.other"; },
      ledger => { ledger.consequenceReceipts.find(row => row.kind === "currency_credit").effect.amount = 6; },
      ledger => { ledger.consequenceReceipts.find(row => row.kind === "currency_credit").effect.after.gold += 1; },
      ledger => { ledger.results[0].requiredReceiptIds.reverse(); },
      ledger => { ledger.requests[0].canonicalIntent = "{}"; },
      ledger => { ledger.results[0].currencyBefore.gold = Number.MAX_SAFE_INTEGER; },
      ledger => {
        ledger.results[0].currencyBefore.gold += 5;
        ledger.consequenceReceipts = buildSoundingsReceipts(ledger.results[0]);
      },
      ledger => {
        ledger.requests[0].normalizedIntent.snapshotFingerprint = "{}";
        ledger.requests[0].canonicalIntent = serializeSoundingsIntent(ledger.requests[0].normalizedIntent);
      }
    ];
    for (const [index, mutate] of mutations.entries()) {
      const corrupted = structuredClone(accepted.snapshot);
      mutate(corrupted.authorityLedger.soundingsTurnIn);
      assert.equal(isTargetCampaignSnapshot(corrupted), false, `deep graph mutation ${index}`);
      const before = structuredClone(corrupted);
      const duplicate = executePlayerSoundingsTurnInCommand(corrupted, accepted.control, prepared.command);
      assert.equal(duplicate.accepted, false);
      assert.equal(duplicate.duplicate, false);
      assert.equal(duplicate.snapshot, corrupted);
      assert.deepEqual(corrupted, before);
      const admission = admitCampaignMutation(source.control, {
        mutationId: `mutation.soundings.forged.${index}`, sourceArtifactId: source.control.loadedArtifactId,
        sourceRevision: source.control.sessionRevision, ownerKind: "engine_result", accepted: true,
        sourceSnapshot: source.snapshot, proposedSnapshot: corrupted
      });
      assert.equal(admission.accepted, false, `admission rejects deep graph mutation ${index}`);
    }
  });
});

test("caller exposes accepted state only after campaign admission and clears terminal identity", () => {
  withCampaignStorage(() => {
    const source = createOrdinarySoundingsCampaign();
    const cache = new Map();
    const accepted = submitSoundingsTurnInCaller(source.snapshot, source.control, REQUEST_ID, cache);
    assert.equal(accepted.outcome.kind, "accepted", accepted.outcome.notice?.detail);
    assert.ok(accepted.acceptedState);
    assert.equal(cache.size, 0);
    const duplicate = submitSoundingsTurnInCaller(accepted.acceptedState.snapshot, accepted.acceptedState.control, REQUEST_ID, cache);
    assert.equal(duplicate.outcome.result.code, "duplicate");
    assert.equal(duplicate.acceptedState, null);
    assert.equal(cache.size, 0);
    const wrongControl = structuredClone(source.control);
    wrongControl.accountId = "account.other";
    const rejected = submitSoundingsTurnInCaller(source.snapshot, wrongControl, REQUEST_ID, new Map());
    assert.notEqual(rejected.outcome.kind, "accepted");
    assert.equal(rejected.acceptedState, null);
  });
});

test("campaign admission rejects an extra wallet payout hidden behind a valid turn-in graph", () => {
  withCampaignStorage(() => {
    const source = createOrdinarySoundingsCampaign();
    const prepared = preparePlayerSoundingsTurnInCommand(source.snapshot, source.control, REQUEST_ID);
    assert.equal(prepared.kind, "prepared");
    const accepted = executePlayerSoundingsTurnInCommand(source.snapshot, source.control, prepared.command);
    assert.equal(accepted.accepted, true, accepted.code);
    const forged = structuredClone(accepted.snapshot);
    forged.playerState.currency.gold += 5;
    const admission = admitCampaignMutation(source.control, {
      mutationId: "mutation.soundings.forged_extra_payout", sourceArtifactId: source.control.loadedArtifactId,
      sourceRevision: source.control.sessionRevision, ownerKind: "engine_result", accepted: true,
      sourceSnapshot: source.snapshot, proposedSnapshot: forged
    });
    assert.equal(admission.accepted, false, "the new ledger cannot grant arbitrary direct-wallet permission");
    assert.deepEqual(source.snapshot.playerState.currency, accepted.snapshot.authorityLedger.soundingsTurnIn.results[0].currencyBefore);
  });
});

test("real context and quest UI route Soundings through accepted-only command ownership", () => {
  const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
  const context = read("../../apps/rpg-ui/src/runtime/GameSessionContext.tsx");
  const panel = read("../../apps/rpg-ui/src/features/QuestsPanel.tsx");
  const sync = read("../../packages/engines/game-engine/src/gameplay-snapshot-sync.ts");
  const caller = read("../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts");
  const contextAction = context.slice(context.indexOf("submitSoundingsTurnIn: (requestId) =>"), context.indexOf("dismissBodyStateToast: () =>", context.indexOf("submitSoundingsTurnIn: (requestId) =>")));
  assert.match(contextAction, /submitSoundingsTurnInCaller/);
  assert.match(contextAction, /if \(transition\.acceptedState\)\s*\{\s*onSnapshotChange\(transition\.acceptedState\.snapshot, transition\.acceptedState\.control\);\s*\}/);
  assert.equal((contextAction.match(/onSnapshotChange\(/g) ?? []).length, 1);
  assert.match(caller, /acceptedState: result\.accepted \? \{ snapshot: result\.snapshot, control: result\.control \} : null/);
  const soundingsAction = panel.slice(panel.indexOf("if (isSoundings) {"), panel.indexOf("const result = turnInQuest(snapshot"));
  assert.match(soundingsAction, /submitSoundingsTurnIn\(requestId\)/);
  assert.match(soundingsAction, /if \(outcome\.kind === 'accepted'\) setActiveSection\('completed'\)/);
  assert.match(soundingsAction, /return;\s*\}\s*$/);
  assert.doesNotMatch(soundingsAction, /updateSnapshot\(|turnInQuest\(/);
  const readinessBranch = sync.match(/if \(questId === "quest\.ashen_reef_survey"\) \{([^}]+)\}/)?.[1];
  assert.ok(readinessBranch);
  assert.match(readinessBranch, /return resolvePlayerSoundingsTurnIn\(snapshot\)\.accepted;/);
  assert.doesNotMatch(readinessBranch, /location\.saltmere|isSurveyComplete|hasFlag/);
});

test("missing completion projections repair through admitted retry without replaying payment", () => {
  withCampaignStorage(() => {
    const source = createOrdinarySoundingsCampaign();
    const submitted = submitSoundingsTurnInCaller(source.snapshot, source.control, REQUEST_ID, new Map()).acceptedState;
    assert.ok(submitted);
    const ledger = structuredClone(submitted.snapshot.authorityLedger);
    const currency = structuredClone(submitted.snapshot.playerState.currency);
    const damaged = structuredClone(submitted.snapshot);
    const result = ledger.soundingsTurnIn.results[0];
    for (const [kind, collection] of [["chronicle_projection", "chronicle"], ["notification_projection", "notifications"]]) {
      const id = ledger.soundingsTurnIn.consequenceReceipts.find(r => r.kind === kind).effect.projectionId;
      damaged.sessionState[collection] = damaged.sessionState[collection].filter(row => row.id !== id);
    }
    assert.equal(isTargetCampaignSnapshot(damaged), true, "missing presentation is not conflicting transaction authority");
    const restarted = publishAndRestart(damaged, submitted.control);
    const repair = submitSoundingsTurnInCaller(restarted.snapshot, restarted.control, REQUEST_ID, new Map());
    assert.equal(repair.outcome.result.code, "projections_repaired");
    assert.ok(repair.acceptedState);
    assert.deepEqual(repair.acceptedState.snapshot.playerState.currency, currency);
    assert.deepEqual(repair.acceptedState.snapshot.authorityLedger, ledger);
    const after = publishAndRestart(repair.acceptedState.snapshot, repair.acceptedState.control);
    const duplicate = submitSoundingsTurnInCaller(after.snapshot, after.control, REQUEST_ID, new Map());
    assert.equal(duplicate.outcome.result.code, "duplicate");
    assert.equal(duplicate.acceptedState, null);
    for (const receipt of ledger.soundingsTurnIn.consequenceReceipts.filter(r => r.kind.endsWith("_projection"))) {
      const rows = receipt.kind === "chronicle_projection" ? after.snapshot.sessionState.chronicle : after.snapshot.sessionState.notifications;
      assert.deepEqual(rows.filter(row => row.id === receipt.effect.projectionId), [receipt.effect.row]);
      const conflicting = structuredClone(after.snapshot);
      const entries = receipt.kind === "chronicle_projection" ? conflicting.sessionState.chronicle : conflicting.sessionState.notifications;
      entries.find(row => row.id === receipt.effect.projectionId).title = "Forged completion";
      assert.equal(isTargetCampaignSnapshot(conflicting), false);
    }
    assert.equal(result.payment.gold, 5);
  });
});

test("projection placement converges without moving opaque rows or evicting a full feed", () => {
  withCampaignStorage(() => {
    const source = createOrdinarySoundingsCampaign();
    const submitted = submitSoundingsTurnInCaller(source.snapshot, source.control, REQUEST_ID, new Map()).acceptedState;
    const snapshot = structuredClone(submitted.snapshot);
    const ledger = snapshot.authorityLedger.soundingsTurnIn;
    const currency = structuredClone(snapshot.playerState.currency);
    for (const collection of ["chronicle", "notifications"]) {
      const rows = snapshot.sessionState[collection];
      const row = rows.shift();
      assert.match(row.id, /soundings_turn_in/);
      rows.push(row);
    }
    const repaired = submitSoundingsTurnInCaller(snapshot, submitted.control, REQUEST_ID, new Map());
    assert.equal(repaired.outcome.result.code, "projections_repaired");
    assert.deepEqual(repaired.acceptedState.snapshot.playerState.currency, currency);
    assert.deepEqual(repaired.acceptedState.snapshot.authorityLedger.soundingsTurnIn, ledger);
    for (const collection of ["chronicle", "notifications"]) {
      assert.deepEqual(repaired.acceptedState.snapshot.sessionState[collection], submitted.snapshot.sessionState[collection]);
    }
    const full = structuredClone(submitted.snapshot);
    full.sessionState.notifications = Array.from({length:12}, (_,i) => ({id:`opaque.${i}`, title:"Later notice",detail:"Retain",tone:"info",timeLabel:"Later"}));
    const before = structuredClone(full);
    const blocked = submitSoundingsTurnInCaller(full, submitted.control, REQUEST_ID, new Map());
    assert.equal(blocked.acceptedState, null);
    assert.equal(blocked.outcome.result.code, "transition_failed");
    assert.deepEqual(full, before);
    const continued = travelTo({ snapshot: full, control: submitted.control }, "location.ashen_reef");
    assert.ok(continued.snapshot.clock.tick > full.clock.tick, "a full repair destination does not freeze ordinary play");
    assert.deepEqual(continued.snapshot.authorityLedger.soundingsTurnIn, ledger);
  });
});
