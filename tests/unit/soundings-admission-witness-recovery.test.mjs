import test from "node:test";
import assert from "node:assert/strict";
import { submitSoundingsTurnInCaller } from "../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts";
import { buildSaveMetadata, completeCampaignPublicationConsumers, deleteSave, loadSaveWithAuthority, publishSave, recoverPendingCampaignPublications } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { createOrdinarySoundingsCampaign, publishAndRestart, travelTo, withCampaignStorage, ACCOUNT_ID, SLOT_ID, REQUEST_ID } from "../helpers/soundings-ordinary-campaign.mjs";

const storageEntries = storage => Array.from({ length: storage.length }, (_, index) => {
  const key = storage.key(index);
  return [key, storage.getItem(key)];
}).sort(([left], [right]) => left.localeCompare(right));
const findEntry = (storage, suffix) => storageEntries(storage).find(([key]) => key.endsWith(suffix));
const witnessEntry = storage => findEntry(storage, `.soundings-witness.${REQUEST_ID}`);
const publish = state => publishSave(ACCOUNT_ID, SLOT_ID, state.snapshot, buildSaveMetadata(SLOT_ID, state.snapshot), { sessionControl: state.control });
const completionPlans = [
  { kind: "active_history", payloadFingerprint: "f2.active-history" },
  { kind: "estate", payloadFingerprint: "f2.estate" }
];
const completionKinds = completionPlans.map(plan => plan.kind);
const publishWithConsumers = (state, options = {}) => publishSave(
  ACCOUNT_ID, SLOT_ID, state.snapshot, buildSaveMetadata(SLOT_ID, state.snapshot),
  { sessionControl: state.control, consumerPlans: completionPlans, ...options }
);
function interruptBeforeApplied(storage, state) {
  const originalSet = storage.setItem.bind(storage);
  let interrupted = false;
  storage.setItem = (key, raw) => {
    if (key.endsWith(`.soundings-witness.${REQUEST_ID}`) && JSON.parse(raw).posture === "applied") {
      interrupted = true;
      throw new Error("F2 before applied witness");
    }
    originalSet(key, raw);
  };
  try { assert.throws(() => publishWithConsumers(state), /F2 before applied witness/); }
  finally { storage.setItem = originalSet; }
  assert.equal(interrupted, true);
  assert.equal(JSON.parse(witnessEntry(storage)[1]).posture, "pending");
}
function rejectCompletionUnchanged(storage, publicationId) {
  // The first call would persist a partial set; the second would delete recovery.
  for (const kinds of [["active_history"], completionKinds]) {
    const before = storageEntries(storage);
    assert.throws(() => completeCampaignPublicationConsumers(ACCOUNT_ID, publicationId, kinds), /witness|provenance|recovery|publication|artifact/i);
    assert.deepEqual(storageEntries(storage), before, "rejection must preserve every stored byte before partial writes and final cleanup");
  }
}
function finishConsumersExactly(storage, publicationId) {
  const [key, raw] = findEntry(storage, ".publication-recovery");
  const before = storageEntries(storage);
  completeCampaignPublicationConsumers(ACCOUNT_ID, publicationId, ["active_history"]);
  const partial = JSON.parse(storage.getItem(key));
  assert.deepEqual(partial.completedConsumerKinds, ["active_history"]);
  assert.deepEqual(partial.consumerPlans, JSON.parse(raw).consumerPlans);
  assert.deepEqual(storageEntries(storage).filter(([entry]) => entry !== key), before.filter(([entry]) => entry !== key));
  const partialBytes = storageEntries(storage);
  completeCampaignPublicationConsumers(ACCOUNT_ID, publicationId, completionKinds);
  assert.equal(storage.getItem(key), null);
  assert.deepEqual(storageEntries(storage), partialBytes.filter(([entry]) => entry !== key));
  const finished = storageEntries(storage);
  completeCampaignPublicationConsumers(ACCOUNT_ID, publicationId, completionKinds);
  assert.deepEqual(storageEntries(storage), finished, "repeated completion cannot resurrect recovery or any save address");
}
function completed() {
  const source = createOrdinarySoundingsCampaign();
  const submitted = submitSoundingsTurnInCaller(source.snapshot, source.control, REQUEST_ID, new Map());
  assert.equal(submitted.outcome.kind, "accepted", submitted.outcome.notice?.detail);
  assert.ok(submitted.acceptedState);
  return submitted.acceptedState;
}
function assertCompletedOnce(state, original) {
  assert.deepEqual(state.snapshot.playerState.currency, original.snapshot.playerState.currency);
  assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, original.snapshot.authorityLedger.soundingsTurnIn);
  assert.equal(state.snapshot.authorityLedger.soundingsTurnIn.consequenceReceipts.length, 7);
  const duplicate = submitSoundingsTurnInCaller(state.snapshot, state.control, REQUEST_ID, new Map());
  assert.equal(duplicate.outcome.result.code, "duplicate");
  assert.equal(duplicate.acceptedState, null);
}

for (const boundary of ["pending-before", "pending-after", "head-before", "head-after", "applied-before", "applied-after"]) {
  test(`Soundings publication recovers exact witness after interruption at ${boundary}`, () => {
    withCampaignStorage(storage => {
      const state = completed();
      const originalSet = storage.setItem.bind(storage);
      let interrupted = false;
      storage.setItem = (key, raw) => {
        const record = JSON.parse(raw);
        const witness = key.endsWith(`.soundings-witness.${REQUEST_ID}`);
        const stage = witness ? record.posture : key.endsWith(".control") ? "head" : null;
        if (!interrupted && boundary.startsWith(`${stage}-`)) {
          interrupted = true;
          if (boundary.endsWith("after")) originalSet(key, raw);
          throw new Error(`Simulated interruption ${boundary}`);
        }
        originalSet(key, raw);
      };
      assert.throws(() => publish(state), /Simulated interruption/);
      storage.setItem = originalSet;
      assert.equal(interrupted, true);
      const retained = findEntry(storage, ".publication-recovery");
      assert.ok(retained, "interrupted witness publication must retain recovery");
      const recovery = JSON.parse(retained[1]);
      recoverPendingCampaignPublications(ACCOUNT_ID);
      const applied = JSON.parse(witnessEntry(storage)[1]);
      assert.equal(applied.posture, "applied");
      assert.equal(applied.firstDurableArtifactId, recovery.artifactId);
      assert.equal(applied.firstDurablePublicationId, recovery.publicationId);
      assert.equal(applied.firstDurableHeadRevision, recovery.headRevision);
      const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
      assertCompletedOnce({ snapshot: loaded.snapshot, control: loaded.sessionControl }, state);
      const bytes = storageEntries(storage);
      assert.deepEqual(recoverPendingCampaignPublications(ACCOUNT_ID), []);
      assert.deepEqual(storageEntries(storage), bytes, "repeated recovery is byte-idempotent");
    });
  });
}

test("Soundings applied witness collision blocks republishing without storage mutation", () => {
  withCampaignStorage(storage => {
    const source = completed();
    const state = publishAndRestart(source.snapshot, source.control);
    const [key, raw] = witnessEntry(storage);
    const conflict = JSON.parse(raw);
    conflict.sourceArtifactId = "artifact.conflicting.original";
    storage.setItem(key, JSON.stringify(conflict));
    const before = storageEntries(storage);
    assert.throws(() => publish(state), /witness|provenance/i);
    assert.deepEqual(storageEntries(storage), before);
    assert.throws(() => loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID), /witness|provenance/i);
    assert.deepEqual(storageEntries(storage), before);
  });
});

for (const posture of ["missing", "pending"]) {
  test(`Soundings provenance-required restart never downgrades ${posture} witness to legacy`, () => {
    withCampaignStorage(storage => {
      const source = completed();
      publishAndRestart(source.snapshot, source.control);
      const [key, raw] = witnessEntry(storage);
      if (posture === "missing") storage.removeItem(key);
      else {
        const pending = JSON.parse(raw);
        pending.posture = "pending";
        storage.setItem(key, JSON.stringify(pending));
      }
      const before = storageEntries(storage);
      recoverPendingCampaignPublications(ACCOUNT_ID);
      assert.throws(() => loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID), /witness|provenance/i);
      assert.deepEqual(storageEntries(storage), before, "missing authority must not delete save bytes or synthesize a witness");
    });
  });
}

test("legacy v1 completion remains playable and saveable without witness synthesis or historical repair", () => {
  withCampaignStorage(storage => {
    const source = completed();
    source.snapshot.authorityLedger.soundingsTurnIn.version = 1;
    delete source.control.soundingsAdmissionWitness;
    const ledger = structuredClone(source.snapshot.authorityLedger.soundingsTurnIn);
    const wallet = structuredClone(source.snapshot.playerState.currency);
    let state = publishAndRestart(source.snapshot, source.control);
    assert.equal(witnessEntry(storage), undefined);
    const bytes = storageEntries(storage);
    const before = structuredClone(state);
    const retry = submitSoundingsTurnInCaller(state.snapshot, state.control, REQUEST_ID, new Map());
    assert.equal(retry.outcome.result.code, "legacy_unverified");
    assert.equal(retry.acceptedState, null);
    assert.deepEqual(state, before);
    assert.deepEqual(storageEntries(storage), bytes);
    const projection = ledger.consequenceReceipts.find(row => row.kind === "notification_projection");
    state.snapshot.sessionState.notifications = state.snapshot.sessionState.notifications.filter(row => row.id !== projection.effect.projectionId);
    const damaged = structuredClone(state);
    const repair = submitSoundingsTurnInCaller(state.snapshot, state.control, REQUEST_ID, new Map());
    assert.equal(repair.outcome.result.code, "legacy_unverified");
    assert.equal(repair.acceptedState, null);
    assert.deepEqual(state, damaged);
    state = travelTo(state, "location.ashen_reef");
    state = publishAndRestart(state.snapshot, state.control);
    assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn, ledger);
    assert.deepEqual(state.snapshot.playerState.currency, wallet);
    assert.equal(witnessEntry(storage), undefined);
  });
});

test("conflicting pending witness blocks startup recovery without overwriting retained evidence", () => {
  withCampaignStorage(storage => {
    const state = completed();
    const originalSet = storage.setItem.bind(storage);
    storage.setItem = (key, raw) => {
      if (key.endsWith(".control")) throw new Error("Simulated pre-head interruption");
      originalSet(key, raw);
    };
    assert.throws(() => publish(state), /Simulated pre-head/);
    storage.setItem = originalSet;
    const [key, raw] = witnessEntry(storage);
    const conflict = JSON.parse(raw);
    assert.equal(conflict.posture, "pending");
    conflict.sourceArtifactId = "artifact.conflicting.pending";
    storage.setItem(key, JSON.stringify(conflict));
    const before = storageEntries(storage);
    assert.throws(() => recoverPendingCampaignPublications(ACCOUNT_ID), /witness|provenance/i);
    assert.deepEqual(storageEntries(storage), before);
  });
});

test("pre-head recovery preserves a conflicting retained immutable artifact without any storage writes", () => {
  withCampaignStorage(storage => {
    const state = completed();
    const originalSet = storage.setItem.bind(storage);
    storage.setItem = (key, raw) => {
      if (key.endsWith(".control")) throw new Error("Simulated pre-head interruption");
      originalSet(key, raw);
    };
    assert.throws(() => publish(state), /Simulated pre-head/);
    storage.setItem = originalSet;
    const recovery = JSON.parse(findEntry(storage, ".publication-recovery")[1]);
    const artifact = storageEntries(storage).find(([key, raw]) => key.includes(".artifact.") && JSON.parse(raw).artifactId === recovery.artifactId);
    assert.ok(artifact, "publication retained its immutable artifact before interrupted head write");
    const changed = JSON.parse(artifact[1]);
    changed.savedAt = "1900-01-01T00:00:00.000Z";
    storage.setItem(artifact[0], JSON.stringify(changed));
    const before = storageEntries(storage);
    assert.throws(() => recoverPendingCampaignPublications(ACCOUNT_ID), /artifact|immutable|conflict/i);
    assert.deepEqual(storageEntries(storage), before, "recovery must not overwrite artifact, witness, head, or recovery evidence");
  });
});

test("first publication retains and reads back pending witness before head, then applied before clearing recovery", () => {
  withCampaignStorage(storage => {
    const state = completed();
    const originalSet = storage.setItem.bind(storage);
    const originalGet = storage.getItem.bind(storage);
    const originalRemove = storage.removeItem.bind(storage);
    const events = [];
    const recordEvent = (operation, key, raw) => {
      const record = raw ? JSON.parse(raw) : null;
      if (key.endsWith(`.soundings-witness.${REQUEST_ID}`) && record) events.push(`${operation}:${record.posture}`);
      if (key.endsWith(".control")) events.push(`${operation}:head`);
      if (key.endsWith(".publication-recovery")) events.push(`${operation}:recovery`);
    };
    storage.setItem = (key, raw) => { originalSet(key, raw); recordEvent("write", key, raw); };
    storage.getItem = key => { const raw = originalGet(key); recordEvent("read", key, raw); return raw; };
    storage.removeItem = key => { recordEvent("remove", key, null); originalRemove(key); };
    publish(state);
    const requiredOrder = ["write:recovery", "read:recovery", "write:pending", "read:pending", "write:head", "read:head", "write:applied", "read:applied", "remove:recovery"];
    let previous = -1;
    for (const event of requiredOrder) {
      const index = events.indexOf(event, previous + 1);
      assert.ok(index > previous, `${event} must follow ${requiredOrder[requiredOrder.indexOf(event) - 1] ?? "publication start"}: ${events.join(", ")}`);
      previous = index;
    }
  });
});

for (const stage of ["pending", "applied"]) {
  for (const omitted of [["soundingsAdmissionWitness"], ["soundingsWitnessFingerprint"], ["soundingsAdmissionWitness", "soundingsWitnessFingerprint"]]) {
    test(`F2 ${stage} first publication rejects omitted ${omitted.join(" and ")} before consumer effects`, () => {
      withCampaignStorage(storage => {
        const state = completed();
        if (stage === "pending") interruptBeforeApplied(storage, state);
        else publishWithConsumers(state);
        const [key, raw] = findEntry(storage, ".publication-recovery");
        const recovery = JSON.parse(raw);
        assert.ok(recovery.soundingsAdmissionWitness);
        assert.ok(recovery.soundingsWitnessFingerprint);
        for (const field of omitted) delete recovery[field];
        storage.setItem(key, JSON.stringify(recovery));
        rejectCompletionUnchanged(storage, recovery.publicationId);
      });
    });
  }
}

for (const corruption of ["unchanged pending", "pending with address_verified", "malformed witness", "conflicting witness", "wrong fingerprint", "missing stable witness", "pending stable witness", "conflicting stable source", "conflicting first artifact", "conflicting first publication", "conflicting first revision"]) {
  test(`F2 consumer completion rejects ${corruption} without partial writes or cleanup`, () => {
    withCampaignStorage(storage => {
      const state = completed();
      if (corruption.startsWith("unchanged pending") || corruption === "pending with address_verified") interruptBeforeApplied(storage, state);
      else publishWithConsumers(state);
      const [key, raw] = findEntry(storage, ".publication-recovery");
      const recovery = JSON.parse(raw);
      const [stableKey, stableRaw] = witnessEntry(storage);
      const stable = JSON.parse(stableRaw);
      if (corruption === "pending with address_verified") recovery.status = "address_verified";
      if (corruption === "malformed witness") recovery.soundingsAdmissionWitness = {};
      if (corruption === "conflicting witness") recovery.soundingsAdmissionWitness.sourceArtifactId += ".conflict";
      if (corruption === "wrong fingerprint") recovery.soundingsWitnessFingerprint = "wrong-fingerprint";
      if (corruption === "missing stable witness") storage.removeItem(stableKey);
      if (corruption === "pending stable witness") stable.posture = "pending";
      if (corruption === "conflicting stable source") stable.sourceArtifactId += ".conflict";
      if (corruption === "conflicting first artifact") stable.firstDurableArtifactId += ".conflict";
      if (corruption === "conflicting first publication") stable.firstDurablePublicationId += ".conflict";
      if (corruption === "conflicting first revision") stable.firstDurableHeadRevision += 1;
      if (corruption === "pending stable witness" || corruption.startsWith("conflicting stable") || corruption.startsWith("conflicting first")) storage.setItem(stableKey, JSON.stringify(stable));
      storage.setItem(key, JSON.stringify(recovery));
      rejectCompletionUnchanged(storage, recovery.publicationId);
    });
  });
}

test("F2 valid first and later descendant publications complete exactly with immutable applied witness", () => {
  withCampaignStorage(storage => {
    const source = completed();
    const first = publishWithConsumers(source);
    const originalWitness = witnessEntry(storage);
    assert.equal(JSON.parse(originalWitness[1]).posture, "applied");
    finishConsumersExactly(storage, first.publication.publicationId);
    const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
    const later = travelTo({ snapshot: loaded.snapshot, control: loaded.sessionControl }, "location.ashen_reef");
    const descendant = publishWithConsumers(later);
    const recovery = JSON.parse(findEntry(storage, ".publication-recovery")[1]);
    assert.equal(recovery.soundingsAdmissionWitness, undefined, "later publication legitimately has no first-publication sidecar");
    assert.equal(recovery.soundingsWitnessFingerprint, undefined);
    assert.notEqual(descendant.publication.publicationId, first.publication.publicationId);
    finishConsumersExactly(storage, descendant.publication.publicationId);
    assert.deepEqual(witnessEntry(storage), originalWitness);
  });
});

test("F2 descendant without sidecar still requires matching applied stable provenance", () => {
  withCampaignStorage(storage => {
    const source = completed();
    const first = publishWithConsumers(source);
    finishConsumersExactly(storage, first.publication.publicationId);
    const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
    const later = travelTo({ snapshot: loaded.snapshot, control: loaded.sessionControl }, "location.ashen_reef");
    const descendant = publishWithConsumers(later);
    const recovery = JSON.parse(findEntry(storage, ".publication-recovery")[1]);
    assert.equal(recovery.soundingsAdmissionWitness, undefined);
    const [key, raw] = witnessEntry(storage);
    for (const corruption of ["missing", "pending", "conflicting"]) {
      const stable = JSON.parse(raw);
      if (corruption === "missing") storage.removeItem(key);
      else {
        if (corruption === "pending") stable.posture = "pending";
        else stable.sourceArtifactId += ".conflict";
        storage.setItem(key, JSON.stringify(stable));
      }
      rejectCompletionUnchanged(storage, descendant.publication.publicationId);
      storage.setItem(key, raw);
    }
    finishConsumersExactly(storage, descendant.publication.publicationId);
  });
});

for (const kind of ["ordinary no-Soundings completion", "legacy v1 completion"]) {
  test(`F2 ${kind} preserves no-witness consumer compatibility`, () => {
    withCampaignStorage(storage => {
      const state = kind.startsWith("ordinary") ? createOrdinarySoundingsCampaign() : completed();
      if (kind.startsWith("legacy")) {
        state.snapshot.authorityLedger.soundingsTurnIn.version = 1;
        delete state.control.soundingsAdmissionWitness;
      }
      const ledger = structuredClone(state.snapshot.authorityLedger.soundingsTurnIn);
      const wallet = structuredClone(state.snapshot.playerState.currency);
      const result = publishWithConsumers(state);
      assert.equal(witnessEntry(storage), undefined);
      finishConsumersExactly(storage, result.publication.publicationId);
      const loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
      assert.deepEqual(loaded.snapshot.authorityLedger.soundingsTurnIn, ledger);
      assert.deepEqual(loaded.snapshot.playerState.currency, wallet);
      assert.equal(witnessEntry(storage), undefined);
    });
  });
}

test("F2 verified terminal Soundings completion cleans consumers after address deletion without resurrection", () => {
  withCampaignStorage(storage => {
    const source = completed();
    const terminal = publishWithConsumers(source, { terminal: true });
    const retainedWitness = witnessEntry(storage);
    deleteSave(ACCOUNT_ID, SLOT_ID);
    assert.equal(loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID, { allowClosed: true }), null);
    finishConsumersExactly(storage, terminal.publication.publicationId);
    assert.equal(loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID, { allowClosed: true }), null);
    assert.deepEqual(witnessEntry(storage), retainedWitness);
    const after = storageEntries(storage);
    assert.deepEqual(recoverPendingCampaignPublications(ACCOUNT_ID), []);
    assert.deepEqual(storageEntries(storage), after);
  });
});
