import test from "node:test";
import assert from "node:assert/strict";
import { submitSoundingsTurnInCaller } from "../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts";
import { buildSaveMetadata, loadSaveWithAuthority, publishSave, recoverPendingCampaignPublications } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { createOrdinarySoundingsCampaign, publishAndRestart, travelTo, withCampaignStorage, ACCOUNT_ID, SLOT_ID, REQUEST_ID } from "../helpers/soundings-ordinary-campaign.mjs";

const storageEntries = storage => Array.from({ length: storage.length }, (_, index) => {
  const key = storage.key(index);
  return [key, storage.getItem(key)];
}).sort(([left], [right]) => left.localeCompare(right));
const findEntry = (storage, suffix) => storageEntries(storage).find(([key]) => key.endsWith(suffix));
const witnessEntry = storage => findEntry(storage, `.soundings-witness.${REQUEST_ID}`);
const publish = state => publishSave(ACCOUNT_ID, SLOT_ID, state.snapshot, buildSaveMetadata(SLOT_ID, state.snapshot), { sessionControl: state.control });
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
