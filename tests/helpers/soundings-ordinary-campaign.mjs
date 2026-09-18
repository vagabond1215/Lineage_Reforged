import assert from "node:assert/strict";
import {
  admitCampaignMutation, createPlayerQuestAcceptanceCommand,
  executePlayerQuestAcceptanceCommand, createPlayerTravelCommand,
  executePlayerTravelCommand
} from "../../packages/engines/game-engine/src/index.ts";
import { createDefaultCharacterCreationFormState } from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { completeNewCampaignAttempt, prepareNewCampaignAttempt } from "../../apps/rpg-ui/src/game-shell/newCampaignAttemptCoordinator.ts";
import { buildSaveMetadata, loadSaveWithAuthority, publishSave } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { advanceAshenReefSurveyCaller } from "../../apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts";

export const ACCOUNT_ID = "account.soundings_completion";
export const SLOT_ID = "slot-1";
export const QUEST_ID = "quest.ashen_reef_survey";
export const REQUEST_ID = "soundings_turn_in_request.00000000-0000-4000-8000-000000000001";

export function withCampaignStorage(run, maxBytes = Infinity) {
  const original = globalThis.window;
  const values = new Map();
  globalThis.window = { localStorage: {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.get(String(key)) ?? null; },
    setItem(key, value) {
      const candidate = new Map(values).set(String(key), String(value));
      const bytes = [...candidate].reduce((sum, [k, v]) => sum + 2 * (k.length + v.length), 0);
      if (bytes > maxBytes) throw new DOMException("Storage quota exceeded", "QuotaExceededError");
      values.set(String(key), String(value));
    },
    removeItem(key) { values.delete(String(key)); },
    clear() { values.clear(); }
  } };
  try { return run(globalThis.window.localStorage); }
  finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
}

export function publishAndRestart(snapshot, control) {
  publishSave(ACCOUNT_ID, SLOT_ID, snapshot, buildSaveMetadata(SLOT_ID, snapshot), { sessionControl: control });
  const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
  return { snapshot: loaded.snapshot, control: loaded.sessionControl };
}

export function admitResult(snapshot, control, result, commandId) {
  assert.equal(result.accepted, true, result.code);
  const admitted = admitCampaignMutation(control, {
    mutationId: `mutation.${commandId}`,
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: "engine_result", accepted: true,
    sourceSnapshot: snapshot, proposedSnapshot: result.snapshot
  });
  assert.equal(admitted.accepted, true, admitted.code);
  return { snapshot: admitted.snapshot, control: admitted.control };
}

export function travelTo(state, destination) {
  const command = createPlayerTravelCommand(state.snapshot, destination);
  return admitResult(state.snapshot, state.control,
    executePlayerTravelCommand(state.snapshot, command), command.commandId);
}

// Every readiness prerequisite is acquired through ordinary production owners.
// Negative unit tests mutate copies only after this path has established authority.
export function createOrdinarySoundingsCampaign({ shifts = 4, returnToStarfall = true } = {}) {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  const form = {
    ...createDefaultCharacterCreationFormState("slot-soundings-completion"),
    playerName: "Mara Soundinghand",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child",
    continentId: "region.myridian_chain", regionId: "region.starfall_isle",
    startingSettlementId: "settlement.starfall_port"
  };
  const attempt = prepareNewCampaignAttempt({
    accountId: ACCOUNT_ID, slotId: SLOT_ID,
    normalizedInput: { form, preparation: [] },
    prepare: () => ({ snapshot: createNewGameSnapshot(form, ACCOUNT_ID), consumerPlans: [] })
  });
  const offer = attempt.snapshot.sessionState.questJournal.filter((entry) => entry.id === QUEST_ID);
  assert.equal(offer.length, 1);
  assert.equal(offer[0].category, "contracts");
  assert.equal(attempt.snapshot.sessionState.knownLocations.some((entry) => entry.id === "location.ashen_reef"), false);
  publishSave(ACCOUNT_ID, SLOT_ID, attempt.snapshot, buildSaveMetadata(SLOT_ID, attempt.snapshot), { newCampaignAttemptId: attempt.attemptId });
  completeNewCampaignAttempt(ACCOUNT_ID, SLOT_ID, attempt.attemptId);
  const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
  let state = { snapshot: loaded.snapshot, control: loaded.sessionControl };
  const command = createPlayerQuestAcceptanceCommand(state.snapshot, QUEST_ID);
  state = admitResult(state.snapshot, state.control,
    executePlayerQuestAcceptanceCommand(state.snapshot, command), command.commandId);
  assert.equal(state.snapshot.sessionState.trackedQuestId, QUEST_ID);
  assert.equal(state.snapshot.sessionState.knownLocations.some((entry) => entry.id === "location.ashen_reef"), true);
  state = publishAndRestart(state.snapshot, state.control);
  state = travelTo(state, "location.ashen_reef");
  assert.equal(state.snapshot.sessionState.currentActivity.id, "activity.survey.ashen_reef");
  let cache = new Map();
  for (let index = 1; index <= shifts; index += 1) {
    const request = `survey_request.00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
    const transition = advanceAshenReefSurveyCaller(state.snapshot, state.control, request, cache);
    assert.equal(transition.outcome.kind, "accepted", JSON.stringify(transition.outcome));
    assert.ok(transition.acceptedState);
    state = transition.acceptedState;
    if (index === 2) {
      state = publishAndRestart(state.snapshot, state.control);
      cache = new Map();
    }
  }
  state = publishAndRestart(state.snapshot, state.control);
  if (returnToStarfall) state = travelTo(state, "settlement.starfall_port");
  return state;
}
