import test from "node:test";
import assert from "node:assert/strict";
import { preparePlayerSoundingsTurnInCommand, executePlayerSoundingsTurnInCommand, resolvePlayerSoundingsTurnIn } from "../../packages/engines/game-engine/src/player-soundings-turn-in.ts";
import { isTargetCampaignSnapshot } from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { createPlayerQuestTrackingCommand, executePlayerQuestTrackingCommand } from "../../packages/engines/game-engine/src/player-quest-tracking.ts";
import { admitResult, createOrdinarySoundingsCampaign, withCampaignStorage, QUEST_ID, REQUEST_ID } from "../helpers/soundings-ordinary-campaign.mjs";

const ready = () => withCampaignStorage(() => createOrdinarySoundingsCampaign());
function prepared(state, requestId = REQUEST_ID) {
  const preparation = preparePlayerSoundingsTurnInCommand(state.snapshot, state.control, requestId);
  assert.equal(preparation.kind, "prepared", preparation.notice?.detail);
  return preparation.command;
}
function assertRejected(state, command, code) {
  const before = structuredClone(state.snapshot);
  const result = executePlayerSoundingsTurnInCommand(state.snapshot, state.control, command);
  assert.equal(result.accepted, false);
  assert.equal(result.duplicate, false);
  if (code) assert.equal(result.code, code);
  assert.equal(result.snapshot, state.snapshot);
  assert.equal(result.control, state.control);
  assert.deepEqual(state.snapshot, before);
  return result;
}

test("accepted submission applies only authored consequences and preserves all nested player/survey owners", () => {
  const state = ready();
  const before = structuredClone(state.snapshot);
  assert.equal(resolvePlayerSoundingsTurnIn(state.snapshot).accepted, true);
  const result = executePlayerSoundingsTurnInCommand(state.snapshot, state.control, prepared(state));
  assert.equal(result.accepted, true, result.code);
  assert.equal(isTargetCampaignSnapshot(result.snapshot), true);
  assert.deepEqual(state.snapshot, before);
  assert.deepEqual(result.result.payment, { gold: 5, silver: 0 });
  assert.equal(result.snapshot.playerState.currency.gold, before.playerState.currency.gold + 5);
  for (const key of Object.keys(before.playerState).filter(key => !["currency", "activeQuestIds", "completedQuestIds", "flags"].includes(key))) {
    assert.deepEqual(result.snapshot.playerState[key], before.playerState[key], `nested player owner ${key}`);
  }
  assert.deepEqual(result.snapshot.authorityLedger.ashenReefSurvey, before.authorityLedger.ashenReefSurvey);
  assert.equal(result.snapshot.sessionState.trackedQuestId, null);
  assert.equal(result.snapshot.sessionState.questJournal.find(row => row.id === QUEST_ID).category, "completed");
  assert.equal(result.snapshot.sessionState.operations.some(row => row.id === "operation.quest.ashen_reef_survey"), false);
  assert.notEqual(result.snapshot.sessionState.currentActivity.id, before.sessionState.currentActivity.id);
  assert.equal(result.snapshot.clock.tick, before.clock.tick);
  const ledger = result.snapshot.authorityLedger.soundingsTurnIn;
  assert.equal(ledger.requests.length, 1);
  assert.equal(ledger.occurrences.length, 1);
  assert.equal(ledger.results.length, 1);
  assert.deepEqual(ledger.consequenceReceipts.map(row => row.kind).sort(), ["quest_completion", "currency_credit", "tracking_clear", "operation_close", "activity_transition", "chronicle_projection", "notification_projection"].sort());
  for (const [kind, collection] of [["chronicle_projection", "chronicle"], ["notification_projection", "notifications"]]) {
    const receipt = ledger.consequenceReceipts.find(row => row.kind === kind);
    const rows = result.snapshot.sessionState[collection].filter(row => row.id === receipt.effect.projectionId);
    assert.equal(rows.length, 1, `${kind} exactly once`);
    assert.deepEqual(rows[0], receipt.effect.row);
    assert.match(JSON.stringify(rows[0]), /5 gold/);
  }
});

test("malformed command and malformed request identity reject unchanged", () => {
  const state = ready();
  for (const command of [null, {}, { type: "wrong" }, { ...prepared(state), commandId: "command.forged" }]) assertRejected(state, command, "malformed_command");
  assert.notEqual(preparePlayerSoundingsTurnInCommand(state.snapshot, state.control, "invalid").kind, "prepared");
});

test("submission preserves an intentionally untracked journal without choosing a replacement", () => {
  let state = ready();
  const trackingCommand = createPlayerQuestTrackingCommand(state.snapshot, QUEST_ID);
  state = admitResult(state.snapshot, state.control, executePlayerQuestTrackingCommand(state.snapshot, trackingCommand), trackingCommand.commandId);
  assert.equal(state.snapshot.sessionState.trackedQuestId, null);
  const accepted = executePlayerSoundingsTurnInCommand(state.snapshot, state.control, prepared(state));
  assert.equal(accepted.accepted, true, accepted.code);
  assert.equal(accepted.snapshot.sessionState.trackedQuestId, null);
  const receipt = accepted.snapshot.authorityLedger.soundingsTurnIn.consequenceReceipts.find(row => row.kind === "tracking_clear");
  assert.deepEqual(receipt.effect, { before: null, after: null });
});

test("stale revision, stale snapshot and wrong campaign/player/account fail closed", () => {
  const state = ready();
  const command = prepared(state);
  for (const [label, mutate] of [
    ["revision", next => { next.control.sessionRevision += 1; }],
    ["snapshot", next => { next.snapshot.clock.tick += 1; }],
    ["player", next => { next.snapshot.playerState.playerId = "character.other"; }],
    ["campaign", next => { next.snapshot.campaignIdentity.campaignId = "campaign.other"; }],
    ["account", next => { next.snapshot.accountId = "account.other"; }]
  ]) {
    const next = structuredClone(state);
    mutate(next);
    const result = assertRejected(next, command);
    assert.notEqual(result.code, "duplicate", label);
  }
});

test("readiness rejects missing, inactive, already consumed and wrong-location quests without trusting UI flags", () => {
  const state = ready();
  for (const [code, mutate] of [
    ["quest_missing", snapshot => { snapshot.sessionState.questJournal = snapshot.sessionState.questJournal.filter(row => row.id !== QUEST_ID); }],
    ["quest_not_active", snapshot => { snapshot.sessionState.questJournal.find(row => row.id === QUEST_ID).category = "contracts"; }],
    ["already_consumed", snapshot => { snapshot.sessionState.questJournal.find(row => row.id === QUEST_ID).category = "completed"; }],
    ["wrong_location", snapshot => { snapshot.playerState.location.siteLabel = "Survey Anchorage"; }]
  ]) {
    const next = structuredClone(state);
    mutate(next.snapshot);
    assert.equal(resolvePlayerSoundingsTurnIn(next.snapshot).code, code);
    assertRejected(next, prepared(state));
  }
  const incomplete = withCampaignStorage(() => createOrdinarySoundingsCampaign({ shifts: 3 }));
  assert.equal(resolvePlayerSoundingsTurnIn(incomplete.snapshot).code, "incomplete_survey");
  incomplete.snapshot.sessionState.flags.push("gameplay.quest.ashen_reef_survey.ruins_confirmed");
  assert.equal(resolvePlayerSoundingsTurnIn(incomplete.snapshot).accepted, false);
});

test("deep survey corruption, missing receipts and pending/conflicting corrections cannot authorize payment", () => {
  const state = ready();
  for (const mutate of [
    ledger => { ledger.results[3].stage = "sector_1"; },
    ledger => { ledger.consequenceReceipts.pop(); },
    ledger => { ledger.requests[1].normalizedIntent.materialVersions.surveyContent = 999; },
    ledger => { ledger.results[0].requiredReceiptIds.reverse(); },
    ledger => { ledger.occurrences[1].requestId = ledger.occurrences[0].requestId; }
  ]) {
    const next = structuredClone(state);
    mutate(next.snapshot.authorityLedger.ashenReefSurvey);
    assert.equal(isTargetCampaignSnapshot(next.snapshot), false);
    assert.equal(resolvePlayerSoundingsTurnIn(next.snapshot).accepted, false);
    assertRejected(next, prepared(state));
  }
  const pending = structuredClone(state);
  const ledger = pending.snapshot.authorityLedger.ashenReefSurvey;
  const result = ledger.results.at(-1);
  ledger.corrections.push({ version: 1, correctionId: "survey_correction.00000000-0000-4000-8000-00000000c101", campaignId: result.campaignId, continuityId: result.continuityId, characterId: result.characterId, supersededResultId: result.resultId, replacementResultId: null, reason: "Pending owner reconciliation probe.", evidenceIds: ["evidence.soundings.correction"], createdAtTick: pending.snapshot.clock.tick, reconciliations: ledger.consequenceReceipts.filter(row => row.resultId === result.resultId).map(row => ({ owner: row.owner, kind: row.kind, status: "pending" })) });
  assert.equal(isTargetCampaignSnapshot(pending.snapshot), true);
  assert.equal(resolvePlayerSoundingsTurnIn(pending.snapshot).code, "correction_pending");
  assertRejected(pending, prepared(state));
  const conflicting = structuredClone(pending);
  conflicting.snapshot.authorityLedger.ashenReefSurvey.corrections[0].replacementResultId = "survey_result.missing";
  assert.equal(resolvePlayerSoundingsTurnIn(conflicting.snapshot).accepted, false);
  assertRejected(conflicting, prepared(state));
  const missingProjection = structuredClone(state);
  const finalSurvey = missingProjection.snapshot.authorityLedger.ashenReefSurvey.results.at(-1);
  missingProjection.snapshot.sessionState.chronicle = missingProjection.snapshot.sessionState.chronicle.filter(row => row.id !== finalSurvey.projectionIds.chronicle);
  assert.equal(isTargetCampaignSnapshot(missingProjection.snapshot), true, "projection drift does not erase valid retained survey authority");
  assert.equal(resolvePlayerSoundingsTurnIn(missingProjection.snapshot).code, "correction_pending");
  assertRejected(missingProjection, prepared(state));
});

test("accepted request retries are durable duplicates and changed normalized intent is never a duplicate", () => {
  const state = ready();
  const command = prepared(state);
  const accepted = executePlayerSoundingsTurnInCommand(state.snapshot, state.control, command);
  assert.equal(accepted.accepted, true, accepted.code);
  const current = { snapshot: accepted.snapshot, control: accepted.control };
  const before = structuredClone(current.snapshot);
  const duplicate = executePlayerSoundingsTurnInCommand(current.snapshot, current.control, command);
  assert.equal(duplicate.code, "duplicate");
  assert.equal(duplicate.accepted, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.snapshot, current.snapshot);
  assert.deepEqual(current.snapshot, before);
  const conflict = structuredClone(command);
  conflict.normalizedIntent.expectedRevision += 1;
  const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
  conflict.canonicalIntent = JSON.stringify(canonical(conflict.normalizedIntent));
  assertRejected(current, conflict);
  assert.equal(preparePlayerSoundingsTurnInCommand(current.snapshot, current.control, REQUEST_ID.replace(/1$/, "2")).kind, "expected_rejection");
});
