import test from "node:test";
import assert from "node:assert/strict";
import { createOrdinarySoundingsCampaign, withCampaignStorage, publishAndRestart, travelTo, ACCOUNT_ID, SLOT_ID, REQUEST_ID } from "../helpers/soundings-ordinary-campaign.mjs";
import { submitSoundingsTurnInCaller as submit } from "../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts";
import { repairPlayerSurveyActivityProjection as repairSurvey } from "../../packages/engines/game-engine/src/player-survey-activity-advancement.ts";
import { isTargetCampaignSnapshot as valid } from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { verifySoundingsAdmissionProvenance } from "../../packages/engines/game-engine/src/soundings-admission-witness.ts";
import { publishSave, buildSaveMetadata, loadSaveWithAuthority } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";

const fieldFor = kind => kind === "notification" ? "notifications" : "chronicle";
const bytes = storage => Array.from({ length: storage.length }, (_, i) => storage.key(i)).sort().map(k => [k, storage.getItem(k)]);
const witnesses = storage => bytes(storage).filter(([k]) => k.includes(".soundings-witness."));
const invoke = state => submit(state.snapshot, state.control, REQUEST_ID, new Map());
function complete(state) {
  const result = invoke(state);
  assert.ok(result.acceptedState, JSON.stringify(result.outcome));
  return publishAndRestart(result.acceptedState.snapshot, result.acceptedState.control);
}
function removeSurveyRow(state, kind) {
  const result = state.snapshot.authorityLedger.ashenReefSurvey.results.at(-1);
  const field = fieldFor(kind);
  state.snapshot.sessionState[field] = state.snapshot.sessionState[field].filter(r => r.id !== result.projectionIds[kind]);
  return result.resultId;
}
function repaired(state, kind) {
  const resultId = removeSurveyRow(state, kind);
  // A below-cap missing-row fixture isolates successful insertion from the
  // separately tested retention-expired behavior of a full notification feed.
  const field = fieldFor(kind);
  const receipt = state.snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.find(r => r.resultId === resultId && r.kind === `${kind}_projection`);
  state.snapshot.sessionState[field] = state.snapshot.sessionState[field].slice(0, receipt.effect.cap - 1);
  const before = structuredClone(state);
  const result = repairSurvey(state.snapshot, state.control, resultId, kind);
  assert.deepEqual(state, before);
  assert.equal(result.accepted, true, result.code);
  assert.equal(result.code, "projection_repaired");
  return { snapshot: result.snapshot, control: result.control };
}
// The ordinary helper obtains every prerequisite through production owners. Only
// missing projections, adversarial ledger changes and capacity rows are fixtures.
function prefixReady() {
  let state = createOrdinarySoundingsCampaign();
  state = repaired(state, "chronicle");
  state = repaired(state, "notification");
  assert.equal(state.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length, 2);
  return state;
}

for (const kind of ["chronicle", "notification"]) {
  test(`F3 exact nonempty admission prefix survives same-tick ${kind} suffix, repeat and restart`, () => withCampaignStorage(storage => {
    let state = complete(prefixReady());
    const ledger = structuredClone(state.snapshot.authorityLedger.soundingsTurnIn);
    const wallet = structuredClone(state.snapshot.playerState.currency);
    const witness = witnesses(storage);
    const tick = state.snapshot.clock.tick;
    state = repaired(state, kind);
    assert.equal(state.snapshot.clock.tick, tick);
    assert.equal(state.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.at(-1).appliedTick, tick);
    assert.equal(state.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length, 3);
    state = publishAndRestart(state.snapshot, state.control);
    const resultId = state.snapshot.authorityLedger.ashenReefSurvey.results.at(-1).resultId;
    const repeated = repairSurvey(state.snapshot, state.control, resultId, kind);
    assert.equal(repeated.code, "projection_already_correct");
    assert.equal(repeated.accepted, false);
    state = repaired(state, kind);
    state = publishAndRestart(state.snapshot, state.control);
    state = publishAndRestart(state.snapshot, state.control);
    assert.equal(state.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length, 4);
    assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, ledger);
    assert.deepEqual(state.snapshot.playerState.currency, wallet);
    assert.deepEqual(witnesses(storage), witness);
    assert.equal(invoke(state).outcome.result.code, "duplicate");
  }));
}

for (const order of ["survey-first", "soundings-first"]) {
  test(`F3 projection owners remain available in ${order} order`, () => withCampaignStorage(storage => {
    let state = complete(prefixReady());
    const witness = witnesses(storage), ledger = structuredClone(state.snapshot.authorityLedger.soundingsTurnIn);
    const repairCompletion = () => {
      state.snapshot.sessionState.chronicle = state.snapshot.sessionState.chronicle.filter(r => !r.id.startsWith("soundings_turn_in_chronicle."));
      const result = invoke(state);
      assert.equal(result.outcome.result.code, "projections_repaired");
      assert.ok(result.acceptedState);
      state = result.acceptedState;
    };
    if (order === "soundings-first") repairCompletion();
    state = repaired(state, "chronicle");
    if (order === "survey-first") repairCompletion();
    state = publishAndRestart(state.snapshot, state.control);
    assert.equal(invoke(state).outcome.result.code, "duplicate");
    assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, ledger);
    assert.deepEqual(witnesses(storage), witness);
  }));
}

test("F3 later survey suffix survives actual non-head descendant fork and restart", () => withCampaignStorage(storage => {
  let state = complete(prefixReady());
  state = repaired(state, "notification");
  state = publishAndRestart(state.snapshot, state.control);
  const witness = witnesses(storage), repairs = structuredClone(state.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs);
  const parent = state.snapshot.campaignIdentity.continuityId;
  const advanced = travelTo(state, "location.ashen_reef");
  publishSave(ACCOUNT_ID, "slot-2", advanced.snapshot, buildSaveMetadata("slot-2", advanced.snapshot), { sessionControl: advanced.control });
  const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
  assert.equal(loaded.sessionControl.posture, "non_head_unmutated");
  state = travelTo({ snapshot: loaded.snapshot, control: loaded.sessionControl }, "location.ashen_reef");
  assert.equal(state.snapshot.campaignIdentity.parentContinuityId, parent);
  state = publishAndRestart(state.snapshot, state.control);
  assert.deepEqual(state.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs, repairs);
  assert.deepEqual(witnesses(storage), witness);
  assert.equal(invoke(state).outcome.result.code, "duplicate");
}));

const mutations = {
  "altered admission prefix": a => { a.projectionRepairs[0].observed = "malformed"; },
  "removed admission prefix": a => { a.projectionRepairs.splice(0, 1); },
  "reordered admission prefix": a => { [a.projectionRepairs[0], a.projectionRepairs[1]] = [a.projectionRepairs[1], a.projectionRepairs[0]]; },
  "inserted admission prefix": a => { a.projectionRepairs.unshift(structuredClone(a.projectionRepairs[0])); },
  "malformed suffix": a => { a.projectionRepairs.at(-1).ordinal = 999; },
  "conflicting suffix": a => { a.projectionRepairs.push(structuredClone(a.projectionRepairs.at(-1))); },
  "request drift": a => { a.requests[0].requestId += ".changed"; },
  "occurrence drift": a => { a.occurrences[0].occurrenceId += ".changed"; },
  "result drift": a => { a.results[0].resultId += ".changed"; },
  "receipt drift": a => { a.consequenceReceipts[0].receiptId += ".changed"; },
  "correction drift": a => { a.corrections.push({ version: 1, correctionId: "forged" }); }
};
for (const [label, mutate] of Object.entries(mutations)) {
  test(`F3 ${label} rejects without source or storage mutation`, () => withCampaignStorage(storage => {
    let state = complete(prefixReady());
    state = repaired(state, "chronicle");
    state = publishAndRestart(state.snapshot, state.control);
    mutate(state.snapshot.authorityLedger.ashenReefSurvey);
    const before = structuredClone(state), stored = bytes(storage);
    assert.equal(valid(state.snapshot), false);
    assert.equal(verifySoundingsAdmissionProvenance(state.snapshot, state.control), "invalid_witness");
    const refused = invoke(state);
    assert.equal(refused.acceptedState, null);
    assert.notEqual(refused.outcome.kind, "accepted");
    const resultId = state.snapshot.authorityLedger.ashenReefSurvey.results.at(-1).resultId;
    assert.equal(repairSurvey(state.snapshot, state.control, resultId, "chronicle").accepted, false);
    assert.throws(() => publishAndRestart(state.snapshot, state.control));
    assert.deepEqual(state, before);
    assert.deepEqual(bytes(storage), stored);
  }));
}

for (const kind of ["chronicle", "notification"]) {
  test(`F3 full ${kind} feed retains opaque truth, terminal repair is idempotent, ordinary play persists`, () => withCampaignStorage(storage => {
    let state = complete(prefixReady());
    const witness = witnesses(storage), ledger = structuredClone(state.snapshot.authorityLedger.soundingsTurnIn);
    const field = fieldFor(kind), resultId = removeSurveyRow(state, kind);
    const receipt = state.snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.find(r => r.resultId === resultId && r.kind === `${kind}_projection`);
    // Deliberately opaque newer accepted-row fixture, not an assertion of UI reachability.
    const template = state.snapshot.sessionState[field][0];
    const full = Array.from({ length: receipt.effect.cap }, (_, i) => ({ ...template, id: `opaque.f3.${kind}.${i}`, title: `Newer truth ${i}` }));
    state.snapshot.sessionState[field] = full;
    const result = repairSurvey(state.snapshot, state.control, resultId, kind);
    assert.equal(result.code, "projection_retention_expired");
    assert.equal(result.accepted, true); // Records the bounded terminal posture, never evicts a row.
    state = { snapshot: result.snapshot, control: result.control };
    assert.deepEqual(state.snapshot.sessionState[field], full);
    // Survey notifications retain ten rows; Soundings permits twelve. Fill the
    // latter independently after the survey owner has recorded its terminal cap.
    if (kind === "notification") {
      for (let i = full.length; i < 12; i += 1) state.snapshot.sessionState[field].push({ ...template, id: `opaque.f3.notification.${i}`, title: `Newer truth ${i}` });
    }
    state = publishAndRestart(state.snapshot, state.control);
    const before = structuredClone(state), stored = bytes(storage);
    const repeat = repairSurvey(state.snapshot, state.control, resultId, kind);
    assert.equal(repeat.code, "projection_retention_expired");
    assert.equal(repeat.accepted, false);
    const completion = invoke(state);
    assert.equal(completion.outcome.result.accepted, false); // Completion row is absent and capacity is full.
    assert.deepEqual(state, before);
    assert.deepEqual(bytes(storage), stored);
    state = travelTo(state, "location.ashen_reef");
    state = publishAndRestart(state.snapshot, state.control);
    assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, ledger);
    assert.deepEqual(witnesses(storage), witness);
  }));
}
