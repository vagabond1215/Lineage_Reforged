import assert from "node:assert/strict";
import { createDefaultCharacterCreationFormState } from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { completeNewCampaignAttempt, prepareNewCampaignAttempt } from "../../apps/rpg-ui/src/game-shell/newCampaignAttemptCoordinator.ts";
import { buildSaveMetadata, loadSaveWithAuthority, publishSave } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { saveAccountProfile } from "../../apps/rpg-ui/src/game-shell/accountProfileManager.ts";
import { advanceNearbyExplorationCaller } from "../../apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";

const LIMIT = 5 * 1024 * 1024;
const ACCOUNT = "account.ordinary_capacity_isolated_qa";
const SLOT = "slot-1";

function createStorage(limit = LIMIT) {
  const values = new Map();
  let peak = 0;
  let failedWrite = null;
  let failSlotOnce = false;
  const bytes = (entries = values) => [...entries].reduce((total, [key, value]) => total + 2 * (key.length + value.length), 0);
  return {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.get(String(key)) ?? null; },
    setItem(key, value) {
      const normalizedKey = String(key);
      const candidate = new Map(values).set(normalizedKey, String(value));
      const proposedBytes = bytes(candidate);
      peak = Math.max(peak, proposedBytes);
      if (failSlotOnce && normalizedKey.endsWith(`.slot.${SLOT}`)) {
        failSlotOnce = false;
        failedWrite = { key: normalizedKey, proposedBytes, kind: "injected_slot_failure" };
        throw new DOMException("Injected slot write failure", "QuotaExceededError");
      }
      if (proposedBytes > limit) {
        failedWrite = { key: normalizedKey, proposedBytes, kind: "quota" };
        throw new DOMException("Storage quota exceeded", "QuotaExceededError");
      }
      values.set(normalizedKey, String(value));
    },
    removeItem(key) { values.delete(String(key)); },
    clear() { values.clear(); },
    bytes,
    get peak() { return peak; },
    get failedWrite() { return failedWrite; },
    armSlotFailure() { failSlotOnce = true; },
    byKind() {
      const totals = {};
      for (const [key, value] of values) {
        const kind = key.includes(".artifact.") ? "artifact" : key.includes(".candidate.") ? "candidate"
          : key.includes(".publication-recovery") ? "recovery" : key.includes(".campaign.") ? "control"
          : key.includes(".new-campaign-attempts.") ? "attempt" : key.includes(".saves.v7.") ? "slot"
          : key.includes(".accounts.v1.") ? "account" : "other";
        totals[kind] = (totals[kind] ?? 0) + 2 * (key.length + value.length);
      }
      return totals;
    }
  };
}

function withStorage(run) {
  const previous = globalThis.window;
  const storage = createStorage();
  globalThis.window = { localStorage: storage };
  try { return run(storage); }
  finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
}

function creator() {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  const form = {
    ...createDefaultCharacterCreationFormState(SLOT), playerName: "Capacity Explorer QA",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child",
    continentId: "region.kaelvar", regionId: "region.auric_marches",
    startingSettlementId: "settlement.stonevein"
  };
  return { form, snapshot: createNewGameSnapshot(form, ACCOUNT) };
}

function publish(state) {
  const saved = publishSave(ACCOUNT, SLOT, state.snapshot, buildSaveMetadata(SLOT, state.snapshot), { sessionControl: state.control });
  const loaded = loadSaveWithAuthority(ACCOUNT, SLOT);
  assert.ok(loaded);
  const expectedRaw = serializeSnapshot(state.snapshot);
  const artifactKey = `cataclysm-rpg-ui.saves.v7.account.${ACCOUNT}.artifact.${saved.sessionControl.loadedArtifactId}`;
  const artifact = JSON.parse(window.localStorage.getItem(artifactKey));
  assert.equal(artifact.snapshot, expectedRaw);
  assert.equal(loaded.snapshot.clock.tick, state.snapshot.clock.tick);
  assert.equal(loaded.snapshot.playerState.resources.stamina.current, state.snapshot.playerState.resources.stamina.current);
  assert.deepEqual(loaded.snapshot.worldState.nearbyExplorationCandidate, state.snapshot.worldState.nearbyExplorationCandidate);
  assert.equal(loaded.publication.publicationId, saved.publication.publicationId);
  return { snapshot: loaded.snapshot, control: loaded.sessionControl, publication: loaded.publication };
}

function measure(storage, label, snapshot, extra = {}) {
  return {
    label, tick: snapshot.clock.tick, snapshotBytes: 2 * serializeSnapshot(snapshot).length,
    storedBytes: storage.bytes(), headroom: LIMIT - storage.bytes(),
    peakAttemptedBytes: storage.peak, byKind: storage.byKind(), ...extra
  };
}

const rows = withStorage((storage) => {
  const result = [];
  saveAccountProfile(createDefaultAccountProfileState({ accountId: ACCOUNT, displayName: "Capacity QA" }));
  const { form, snapshot } = creator();
  const attempt = prepareNewCampaignAttempt({
    accountId: ACCOUNT, slotId: SLOT, normalizedInput: { form, preparation: [] },
    prepare: () => ({ snapshot, consumerPlans: [] })
  });
  result.push(measure(storage, "prepared", attempt.snapshot));
  publishSave(ACCOUNT, SLOT, attempt.snapshot, buildSaveMetadata(SLOT, attempt.snapshot), { newCampaignAttemptId: attempt.attemptId });
  completeNewCampaignAttempt(ACCOUNT, SLOT, attempt.attemptId);
  let loaded = loadSaveWithAuthority(ACCOUNT, SLOT);
  assert.ok(loaded);
  let state = { snapshot: loaded.snapshot, control: loaded.sessionControl };
  result.push(measure(storage, "creator_saved", state.snapshot));
  let candidateCount = 0;
  let noCandidateCount = 0;
  for (let index = 1; index <= 70; index += 1) {
    const transition = advanceNearbyExplorationCaller(state.snapshot, state.control);
    assert.equal(transition.outcome.accepted, true, JSON.stringify(transition.outcome));
    assert.ok(transition.acceptedState);
    state = transition.acceptedState;
    if (transition.outcome.code === "candidate_pending") candidateCount += 1;
    else noCandidateCount += 1;
    assert.equal(state.snapshot.worldState.pendingSpawnCandidates?.length ?? 0, 0);
    assert.equal(state.snapshot.gameState.activeEncounter, null);
    const source = state;
    try {
      state = publish(state);
      result.push(measure(storage, `action_${index}_saved`, state.snapshot, { outcome: transition.outcome.code }));
    } catch (error) {
      if (error.name !== "QuotaExceededError") throw error;
      loaded = loadSaveWithAuthority(ACCOUNT, SLOT);
      assert.ok(loaded);
      assert.notEqual(serializeSnapshot(loaded.snapshot), serializeSnapshot(source.snapshot));
      assert.equal(loaded.sessionControl.campaignHeadRevision, source.control.campaignHeadRevision);
      const priorBytes = storage.bytes();
      const firstFailedWrite = storage.failedWrite;
      let retryError = null;
      try {
        publishSave(ACCOUNT, SLOT, source.snapshot, buildSaveMetadata(SLOT, source.snapshot), { sessionControl: source.control });
      } catch (retry) {
        retryError = retry;
      }
      assert.equal(retryError?.name, "QuotaExceededError");
      assert.equal(loadSaveWithAuthority(ACCOUNT, SLOT).sessionControl.campaignHeadRevision, source.control.campaignHeadRevision);
      result.push(measure(storage, `action_${index}_quota`, source.snapshot, {
        outcome: transition.outcome.code, failedWrite: firstFailedWrite,
        retainedHeadRevision: loaded.sessionControl.campaignHeadRevision,
        candidateCount, noCandidateCount,
        retry: { kind: retryError.name, bytesBefore: priorBytes, bytesAfter: storage.bytes() }
      }));
      break;
    }
  }
  assert.ok(candidateCount > 0 && noCandidateCount > 0);
  assert.ok(result.some((row) => row.label.endsWith("_quota")), "bounded sequence must encounter the storage ceiling");
  return result;
});

const postHeadRetry = withStorage((storage) => {
  saveAccountProfile(createDefaultAccountProfileState({ accountId: ACCOUNT, displayName: "Capacity Retry QA" }));
  const { form, snapshot } = creator();
  const attempt = prepareNewCampaignAttempt({
    accountId: ACCOUNT, slotId: SLOT, normalizedInput: { form, preparation: [] },
    prepare: () => ({ snapshot, consumerPlans: [] })
  });
  publishSave(ACCOUNT, SLOT, attempt.snapshot, buildSaveMetadata(SLOT, attempt.snapshot), { newCampaignAttemptId: attempt.attemptId });
  completeNewCampaignAttempt(ACCOUNT, SLOT, attempt.attemptId);
  const loaded = loadSaveWithAuthority(ACCOUNT, SLOT);
  assert.ok(loaded);
  const transition = advanceNearbyExplorationCaller(loaded.snapshot, loaded.sessionControl);
  assert.equal(transition.outcome.accepted, true);
  const next = transition.acceptedState;
  const campaignId = next.snapshot.campaignIdentity.campaignId;
  const recoveryKey = `cataclysm-rpg-ui.saves.v7.account.${ACCOUNT}.campaign.${campaignId}.publication-recovery`;
  storage.armSlotFailure();
  assert.throws(
    () => publishSave(ACCOUNT, SLOT, next.snapshot, buildSaveMetadata(SLOT, next.snapshot), { sessionControl: next.control }),
    { name: "QuotaExceededError" }
  );
  const pending = JSON.parse(storage.getItem(recoveryKey));
  assert.equal(pending.status, "head_verified");
  const artifactCountBefore = [...Array(storage.length).keys()].map((index) => storage.key(index)).filter((key) => key.includes(".artifact.")).length;
  const bytesBefore = storage.bytes();
  const retried = publishSave(ACCOUNT, SLOT, next.snapshot, buildSaveMetadata(SLOT, next.snapshot), { sessionControl: next.control });
  assert.equal(retried.publication.publicationId, pending.publicationId);
  const artifactCountAfter = [...Array(storage.length).keys()].map((index) => storage.key(index)).filter((key) => key.includes(".artifact.")).length;
  assert.equal(artifactCountAfter, artifactCountBefore);
  const afterRetry = loadSaveWithAuthority(ACCOUNT, SLOT);
  assert.equal(afterRetry.snapshot.clock.tick, 1);
  const retainedAfterRetry = storage.getItem(recoveryKey);
  assert.equal(retainedAfterRetry, null);
  const bytesAfterRetry = storage.bytes();
  const further = advanceNearbyExplorationCaller(afterRetry.snapshot, afterRetry.sessionControl);
  assert.equal(further.outcome.accepted, true);
  const following = publish(further.acceptedState);
  assert.equal(following.snapshot.clock.tick, 2);
  return { failedAt: "slot_address_after_head", pendingRevision: pending.headRevision,
    bytesBeforeRetry: bytesBefore, bytesAfterRetry,
    artifactCountBefore, artifactCountAfter, samePublication: true,
    recoveryAfterRetry: null, nextSaveTick: following.snapshot.clock.tick };
});

console.log(JSON.stringify({ limitBytes: LIMIT, sourceHead: "fead51012561ca584359fcadf51d801b196ac21d", rows, postHeadRetry }, null, 2));
