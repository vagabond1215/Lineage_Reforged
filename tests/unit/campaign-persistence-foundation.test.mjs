import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  admitCampaignMutation,
  createCampaignSessionControl,
  createDefaultAccountProfileState,
  evaluateAchievementProgress,
  hasPendingMandatoryCampaignConsumers,
  initializeTargetCampaignSnapshot,
  isTargetCampaignSnapshot,
  mapLegacyDifficulty,
  recordCampaignPublicationConsumer,
  resolveNormalDefeat
} from "../../packages/engines/game-engine/src/index.ts";
import { serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  loadAccountProfile,
  saveAccountProfile
} from "../../apps/rpg-ui/src/game-shell/accountProfileManager.ts";
import {
  buildSaveMetadata,
  completeCampaignPublicationConsumers,
  deleteSave,
  loadSaveWithAuthority,
  publishSave,
  recoverPendingCampaignPublications
} from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import {
  archiveActiveRun
} from "../../apps/rpg-ui/src/game-shell/runLifecycle.ts";

function createMockStorage(fault = null) {
  const values = new Map();

  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    getItem(key) {
      const normalized = String(key);
      return values.has(normalized) ? values.get(normalized) : null;
    },
    setItem(key, value) {
      const normalized = String(key);
      const raw = String(value);
      const faultResult = fault?.(normalized, raw);
      if (
        faultResult &&
        typeof faultResult === "object" &&
        faultResult.throwAfterWrite
      ) {
        values.set(normalized, faultResult.raw ?? raw);
        throw new Error(faultResult.message);
      }
      values.set(normalized, faultResult ?? raw);
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    }
  };
}

function withMockWindow(run, fault = null) {
  const originalWindow = globalThis.window;
  const localStorage = createMockStorage(fault);
  globalThis.window = { localStorage };

  try {
    return run(localStorage);
  } finally {
    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  }
}

function createLegacySnapshot(accountId, playerId = "player.persistence_test") {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.accountId = accountId;
  snapshot.snapshotVersion = "0.6.0";
  snapshot.playerState.playerId = playerId;
  snapshot.playerState.coreData.playerName = "Persistence Test";
  snapshot.playerState.achievements = { unlocked: [] };
  delete snapshot.campaignRules;
  delete snapshot.campaignIdentity;
  delete snapshot.authorityLedger;
  delete snapshot.normalDefeatReceipts;
  return snapshot;
}

function createTargetSnapshot(accountId) {
  return initializeTargetCampaignSnapshot(
    createLegacySnapshot(accountId),
    { source: "new_campaign" }
  );
}

function legacyEnvelope(accountId, slotId, snapshot, savedAt) {
  return JSON.stringify({
    version: 6,
    accountId,
    slotId,
    savedAt,
    metadata: {
      ...buildSaveMetadata(slotId, snapshot),
      slotId,
      lastSavedAt: savedAt
    },
    snapshot: serializeSnapshot(snapshot)
  });
}

function createLegacyAccountProfile(
  accountId,
  snapshot,
  slotEntries,
  lastPlayedAt
) {
  let profile = createDefaultAccountProfileState({ accountId });
  for (const entry of slotEntries) {
    profile = evaluateAchievementProgress(snapshot, profile, {
      slotId: entry.slotId,
      recordedAt: entry.savedAt,
      touchHistory: true,
      suppressLegacyRewards: true
    }).nextAccountProfile;
  }
  return {
    ...profile,
    lastPlayedAt
  };
}

function mutation(control, source, proposed, mutationId, overrides = {}) {
  return admitCampaignMutation(control, {
    mutationId,
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: "legacy_bridge",
    accepted: true,
    sourceSnapshot: source,
    proposedSnapshot: proposed,
    ...overrides
  });
}

test("campaign rules v2 map legacy difficulty and keep format identities distinct", () => {
  assert.equal(mapLegacyDifficulty({ tier: "easy", hardcore: false }), "favored");
  assert.equal(mapLegacyDifficulty({ tier: "normal", hardcore: false }), "mortal");
  assert.equal(mapLegacyDifficulty({ tier: "hard", hardcore: false }), "forsaken");
  assert.equal(mapLegacyDifficulty({ tier: "brutal", hardcore: true }), "forsaken");

  const target = createTargetSnapshot("account.rules");
  assert.equal(target.snapshotVersion, "lineage.save_snapshot.v2");
  assert.equal(target.campaignRules.version, 2);
  assert.equal(target.campaignRules.policyRevision, 1);
  assert.equal(target.campaignRules.worldRules, "heroic_world");
  assert.equal(target.campaignRules.stakesRules, "normal_stakes");
  assert.equal(target.campaignIdentity.characterId, target.playerState.playerId);
  assert.equal(isTargetCampaignSnapshot(target), true);

  const legacy = createLegacySnapshot("account.rules.legacy");
  legacy.gameState.runDifficulty = { tier: "brutal", hardcore: true };
  const migrated = initializeTargetCampaignSnapshot(legacy, {
    source: "legacy_migration",
    recordedAt: "2026-07-30T00:00:00.000Z"
  });
  assert.equal(migrated.campaignRules.difficultyPreset, "forsaken");
  assert.equal(migrated.campaignRules.migration.legacyHardcore, true);
  assert.equal(migrated.campaignRules.overrides[0].key, "legacy_brutal");
});

test("non-head first accepted mutation creates one child continuity and rejects inert submissions", () => {
  const source = createTargetSnapshot("account.session");
  const control = createCampaignSessionControl({
    accountId: source.accountId,
    campaignId: source.campaignIdentity.campaignId,
    artifactId: "artifact.loaded",
    publicationId: "publication.loaded",
    artifactRevision: 1,
    continuityId: source.campaignIdentity.continuityId,
    headArtifactId: "artifact.head",
    headRevision: 2
  });

  const rejected = admitCampaignMutation(control, {
    mutationId: "mutation.rejected",
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: "engine_result",
    accepted: false,
    sourceSnapshot: source,
    proposedSnapshot: structuredClone(source)
  });
  assert.equal(rejected.reason, "rejected");
  assert.equal(rejected.control, control);

  const unchanged = admitCampaignMutation(control, {
    mutationId: "mutation.no_change",
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: "persisted_preference",
    accepted: true,
    sourceSnapshot: source,
    proposedSnapshot: source
  });
  assert.equal(unchanged.reason, "no_change");

  const proposed = structuredClone(source);
  proposed.sessionState.pinnedRecordIds = ["record.one"];
  const first = mutation(control, source, proposed, "mutation.first", {
    ownerKind: "persisted_preference"
  });
  assert.equal(first.accepted, true);
  assert.equal(first.control.posture, "forked_unpublished");
  assert.equal(first.snapshot.campaignIdentity.parentContinuityId, control.loadedContinuityId);
  assert.notEqual(first.snapshot.campaignIdentity.continuityId, control.loadedContinuityId);
  assert.equal(first.control.pendingContinuityId, first.snapshot.campaignIdentity.continuityId);

  const proposedAgain = structuredClone(first.snapshot);
  proposedAgain.playerState.currency.copper += 1;
  const second = mutation(
    first.control,
    first.snapshot,
    proposedAgain,
    "mutation.second",
    { ownerKind: "engine_result", resultId: "event.second" }
  );
  assert.equal(second.snapshot.campaignIdentity.continuityId, first.control.pendingContinuityId);
  assert.equal(
    second.snapshot.authorityLedger.entries.filter((entry) => entry.kind === "continuity_fork").length,
    1
  );

  const duplicate = admitCampaignMutation(second.control, {
    mutationId: "mutation.second",
    sourceArtifactId: first.control.loadedArtifactId,
    sourceRevision: first.control.sessionRevision,
    ownerKind: "engine_result",
    accepted: true,
    sourceSnapshot: first.snapshot,
    proposedSnapshot: proposedAgain,
    resultId: "event.second"
  });
  assert.equal(duplicate.reason, "duplicate");
  assert.deepEqual(duplicate.snapshot, second.snapshot);
  assert.equal(duplicate.resultId, "event.second");
  assert.equal(
    duplicate.control.sessionRevision,
    second.control.sessionRevision
  );
  assert.throws(
    () =>
      admitCampaignMutation(second.control, {
        mutationId: "mutation.second",
        sourceArtifactId: second.control.loadedArtifactId,
        sourceRevision: second.control.sessionRevision,
        ownerKind: "engine_result",
        accepted: true,
        sourceSnapshot: second.snapshot,
        proposedSnapshot: structuredClone(second.snapshot),
        resultId: "event.conflict"
      }),
    /conflicting input/
  );

  const stale = admitCampaignMutation(second.control, {
    mutationId: "mutation.stale",
    sourceArtifactId: second.control.loadedArtifactId,
    sourceRevision: second.control.sessionRevision - 1,
    ownerKind: "legacy_bridge",
    accepted: true,
    sourceSnapshot: second.snapshot,
    proposedSnapshot: structuredClone(second.snapshot)
  });
  assert.equal(stale.reason, "stale_revision");
});

test("Normal defeat is nonterminal, exact, preserving, and idempotent for combat and legacy sources", () => {
  const source = createTargetSnapshot("account.defeat");
  source.playerState.resources.hp.current = 0;
  source.playerState.resources.hp.max = 41;
  source.playerState.resources.stamina.current = 5;
  source.playerState.resources.stamina.max = 10;
  source.playerState.resources.mp.current = 7;
  source.playerState.location.settlementId = "settlement.test_haven";
  const preserved = {
    body: structuredClone(source.playerState.body),
    inventory: structuredClone(source.playerState.inventory),
    equipment: structuredClone(source.playerState.equipment),
    currency: structuredClone(source.playerState.currency),
    quests: structuredClone(source.sessionState.quests),
    party: structuredClone(source.sessionState.party)
  };
  const startTick = source.clock.tick;

  const combat = resolveNormalDefeat(source, {
    sourceMutationId: "combat.result.one",
    sourceKind: "accepted_mutation"
  });
  assert.equal(combat.snapshot.clock.tick, startTick + 4);
  assert.equal(combat.snapshot.playerState.resources.hp.current, 11);
  assert.equal(combat.snapshot.playerState.resources.stamina.current, 10);
  assert.equal(combat.snapshot.playerState.resources.mp.current, 7);
  assert.equal(combat.receipt.posture, "playable");
  assert.equal(combat.snapshot.gameState.activeEncounter, null);
  assert.deepEqual(combat.snapshot.playerState.body, preserved.body);
  assert.deepEqual(combat.snapshot.playerState.inventory, preserved.inventory);
  assert.deepEqual(combat.snapshot.playerState.equipment, preserved.equipment);
  assert.deepEqual(combat.snapshot.playerState.currency, preserved.currency);
  assert.deepEqual(combat.snapshot.sessionState.quests, preserved.quests);
  assert.deepEqual(combat.snapshot.sessionState.party, preserved.party);

  const duplicate = resolveNormalDefeat(combat.snapshot, {
    sourceMutationId: "combat.result.one",
    sourceKind: "accepted_mutation"
  });
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.snapshot, combat.snapshot);
  assert.equal(duplicate.snapshot.normalDefeatReceipts.length, 1);

  const legacy = createTargetSnapshot("account.legacy_defeat");
  legacy.playerState.resources.hp.current = 0;
  legacy.playerState.location.settlementId = null;
  legacy.playerState.flags = legacy.playerState.flags.filter(
    (flag) => !flag.startsWith("player.start.")
  );
  const pending = resolveNormalDefeat(legacy, {
    sourceMutationId: "legacy.unknown",
    sourceKind: "unknown_or_legacy"
  });
  assert.equal(pending.receipt.posture, "recovery_pending");
  assert.equal(pending.receipt.recoveryTicks, 0);
  assert.equal(pending.snapshot.clock.tick, legacy.clock.tick);
});

test("recovery-pending defeats block ordinary admission and repair exactly once", () => {
  const source = createTargetSnapshot("account.recovery_pending");
  source.playerState.location.settlementId = null;
  source.playerState.flags = source.playerState.flags.filter(
    (flag) => !flag.startsWith("player.start.")
  );
  const control = createCampaignSessionControl({
    accountId: source.accountId,
    campaignId: source.campaignIdentity.campaignId,
    artifactId: "artifact.pending",
    publicationId: "publication.pending",
    artifactRevision: 1,
    continuityId: source.campaignIdentity.continuityId,
    headArtifactId: "artifact.pending",
    headRevision: 1
  });
  const defeated = structuredClone(source);
  defeated.playerState.resources.hp.current = 0;
  const admitted = mutation(
    control,
    source,
    defeated,
    "mutation.pending_defeat",
    { ownerKind: "engine_result", resultId: "result.pending_defeat" }
  );
  const pendingReceipt = admitted.snapshot.normalDefeatReceipts[0];
  assert.equal(pendingReceipt.posture, "recovery_pending");

  const ordinary = structuredClone(admitted.snapshot);
  ordinary.playerState.currency.copper += 1;
  const blocked = mutation(
    admitted.control,
    admitted.snapshot,
    ordinary,
    "mutation.blocked_while_pending"
  );
  assert.equal(blocked.reason, "recovery_pending");
  assert.equal(blocked.control, admitted.control);

  const repaired = admitCampaignMutation(admitted.control, {
    mutationId: "mutation.recovery_repair",
    sourceArtifactId: admitted.control.loadedArtifactId,
    sourceRevision: admitted.control.sessionRevision,
    ownerKind: "recovery_repair",
    accepted: true,
    sourceSnapshot: admitted.snapshot,
    proposedSnapshot: admitted.snapshot,
    explicitRecoveryDestinationId: "settlement.repair_haven",
    resultId: "result.recovery_repair"
  });
  assert.equal(repaired.accepted, true);
  assert.equal(
    repaired.snapshot.normalDefeatReceipts.length,
    1
  );
  assert.equal(
    repaired.snapshot.normalDefeatReceipts[0].receiptId,
    pendingReceipt.receiptId
  );
  assert.equal(
    repaired.snapshot.normalDefeatReceipts[0].posture,
    "playable"
  );
  assert.equal(
    repaired.snapshot.playerState.location.settlementId,
    "settlement.repair_haven"
  );
  assert.equal(
    repaired.snapshot.clock.tick,
    admitted.snapshot.clock.tick + 4
  );

  withMockWindow((storage) => {
    const persistedSource = createTargetSnapshot(
      "account.loaded_recovery_pending"
    );
    persistedSource.playerState.location.settlementId = null;
    persistedSource.playerState.flags =
      persistedSource.playerState.flags.filter(
        (flag) => !flag.startsWith("player.start.")
      );
    const published = publishSave(
      persistedSource.accountId,
      "slot-1",
      persistedSource,
      buildSaveMetadata("slot-1", persistedSource)
    );
    const defeatedSource = structuredClone(persistedSource);
    defeatedSource.playerState.resources.hp.current = 0;
    const pending = mutation(
      published.sessionControl,
      persistedSource,
      defeatedSource,
      "mutation.loaded_pending"
    );
    assert.throws(
      () =>
        publishSave(
          persistedSource.accountId,
          "slot-1",
          pending.snapshot,
          buildSaveMetadata("slot-1", pending.snapshot),
          { sessionControl: pending.control }
        ),
      /recovery is pending/
    );

    const addressKey =
      `cataclysm-rpg-ui.saves.v7.account.${persistedSource.accountId}.slot.slot-1`;
    const address = JSON.parse(storage.getItem(addressKey));
    address.snapshot = serializeSnapshot(pending.snapshot);
    const raw = JSON.stringify(address);
    storage.setItem(addressKey, raw);
    storage.setItem(
      `cataclysm-rpg-ui.saves.v7.account.${persistedSource.accountId}.artifact.${address.artifactId}`,
      raw
    );
    const loaded = loadSaveWithAuthority(
      persistedSource.accountId,
      "slot-1"
    );
    assert.equal(
      loaded.snapshot.normalDefeatReceipts[0].posture,
      "recovery_pending"
    );
    const loadedProposed = structuredClone(loaded.snapshot);
    loadedProposed.playerState.currency.copper += 1;
    assert.equal(
      mutation(
        loaded.sessionControl,
        loaded.snapshot,
        loadedProposed,
        "mutation.loaded_pending_blocked"
      ).reason,
      "recovery_pending"
    );
  });
});

test("version 7 publication verifies head state and unchanged non-head save copies identity", () =>
  withMockWindow((storage) => {
    const accountId = "account.publication";
    saveAccountProfile(createDefaultAccountProfileState({ accountId }));
    const initial = createTargetSnapshot(accountId);
    const first = publishSave(
      accountId,
      "slot-1",
      initial,
      buildSaveMetadata("slot-1", initial)
    );
    assert.ok(first.publication);
    const firstAddress = JSON.parse(
      storage.getItem(`cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-1`)
    );
    assert.equal(firstAddress.version, 7);
    assert.equal(firstAddress.snapshotFormatId, "lineage.save_snapshot.v2");

    const next = structuredClone(initial);
    next.playerState.currency.copper += 1;
    const admission = mutation(
      first.sessionControl,
      initial,
      next,
      "mutation.head"
    );
    const second = publishSave(
      accountId,
      "slot-2",
      admission.snapshot,
      buildSaveMetadata("slot-2", admission.snapshot),
      { sessionControl: admission.control }
    );
    assert.equal(second.sessionControl.campaignHeadRevision, 2);

    const loadedOld = loadSaveWithAuthority(accountId, "slot-1");
    assert.equal(loadedOld.sessionControl.posture, "non_head_unmutated");
    const rebound = publishSave(
      accountId,
      "slot-3",
      loadedOld.snapshot,
      buildSaveMetadata("slot-3", loadedOld.snapshot),
      { sessionControl: loadedOld.sessionControl }
    );
    assert.equal(rebound.boundExistingArtifact, true);
    assert.equal(rebound.publication, null);
    const copied = JSON.parse(
      storage.getItem(`cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-3`)
    );
    assert.equal(copied.artifactId, firstAddress.artifactId);
    assert.equal(copied.publicationId, firstAddress.publicationId);
    assert.equal(copied.generationId, firstAddress.generationId);
  }));

test("candidate exact-readback failure aborts before a campaign head is published", () =>
  withMockWindow((storage) => {
    const accountId = "account.candidate_failure";
    const snapshot = createTargetSnapshot(accountId);
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-1",
          snapshot,
          buildSaveMetadata("slot-1", snapshot)
        ),
      /write verification failed/
    );
    assert.equal(
      Array.from({ length: storage.length }, (_, index) => storage.key(index))
        .some((key) => key?.endsWith(".control")),
      false
    );
  }, (key, raw) => key.includes(".candidate.") ? `${raw} ` : raw));

test("campaign-control failure retains the prior verified head", () => {
  let failControlWrite = false;
  withMockWindow((storage) => {
    const accountId = "account.control_failure";
    const initial = createTargetSnapshot(accountId);
    const first = publishSave(
      accountId,
      "slot-1",
      initial,
      buildSaveMetadata("slot-1", initial)
    );
    const proposed = structuredClone(initial);
    proposed.playerState.currency.copper += 2;
    const admitted = mutation(
      first.sessionControl,
      initial,
      proposed,
      "mutation.control_failure"
    );

    failControlWrite = true;
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-2",
          admitted.snapshot,
          buildSaveMetadata("slot-2", admitted.snapshot),
          { sessionControl: admitted.control }
        ),
      /injected control failure/
    );
    failControlWrite = false;

    const retained = loadSaveWithAuthority(accountId, "slot-1");
    assert.equal(retained.publication.publicationId, first.publication.publicationId);
    assert.equal(retained.sessionControl.posture, "at_head");
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-2`
      ),
      null
    );
  }, (key, raw) => {
    if (failControlWrite && key.endsWith(".control")) {
      throw new Error("injected control failure");
    }
    return raw;
  });
});

test("post-head address failure retries the exact publication without minting another head", () => {
  let failAddress = false;
  withMockWindow((storage) => {
    const accountId = "account.address_recovery";
    const initial = createTargetSnapshot(accountId);
    const first = publishSave(
      accountId,
      "slot-1",
      initial,
      buildSaveMetadata("slot-1", initial)
    );
    const proposed = structuredClone(initial);
    proposed.playerState.currency.copper += 7;
    const admitted = mutation(
      first.sessionControl,
      initial,
      proposed,
      "mutation.address_recovery"
    );
    const consumerPlans = [
      {
        kind: "account_achievements",
        payloadFingerprint: "payload.address_recovery"
      }
    ];

    failAddress = true;
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-2",
          admitted.snapshot,
          buildSaveMetadata("slot-2", admitted.snapshot),
          {
            sessionControl: admitted.control,
            consumerPlans
          }
        ),
      /injected post-head address failure/
    );
    failAddress = false;

    const recoveryKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.campaign.${initial.campaignIdentity.campaignId}.publication-recovery`;
    const pending = JSON.parse(storage.getItem(recoveryKey));
    const controlKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.campaign.${initial.campaignIdentity.campaignId}.control`;
    const publishedControl = JSON.parse(storage.getItem(controlKey));
    assert.equal(pending.status, "head_verified");
    assert.equal(
      publishedControl.headPublicationId,
      pending.publicationId
    );
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-2`
      ),
      null
    );

    const retried = publishSave(
      accountId,
      "slot-2",
      admitted.snapshot,
      buildSaveMetadata("slot-2", admitted.snapshot),
      {
        sessionControl: admitted.control,
        consumerPlans
      }
    );
    assert.equal(
      retried.publication.publicationId,
      pending.publicationId
    );
    assert.equal(
      retried.sessionControl.campaignHeadRevision,
      pending.headRevision
    );
    assert.equal(
      JSON.parse(storage.getItem(controlKey)).headRevision,
      pending.headRevision
    );
    assert.equal(
      loadSaveWithAuthority(accountId, "slot-2").publication
        .publicationId,
      pending.publicationId
    );
    completeCampaignPublicationConsumers(
      accountId,
      pending.publicationId,
      ["account_achievements"]
    );
    assert.equal(storage.getItem(recoveryKey), null);
  }, (key, raw) => {
    if (
      failAddress &&
      key ===
        "cataclysm-rpg-ui.saves.v7.account.account.address_recovery.slot.slot-2"
    ) {
      throw new Error("injected post-head address failure");
    }
    return raw;
  });
});

test("target addresses fail closed on immutable artifact divergence and recover from retained authority", () =>
  withMockWindow((storage) => {
    const accountId = "account.address_authority";
    const snapshot = createTargetSnapshot(accountId);
    const consumerPlans = [
      {
        kind: "active_history",
        payloadFingerprint: "payload.address_authority"
      }
    ];
    const published = publishSave(
      accountId,
      "slot-1",
      snapshot,
      buildSaveMetadata("slot-1", snapshot),
      { consumerPlans }
    );
    const addressKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-1`;
    const address = JSON.parse(storage.getItem(addressKey));
    address.publicationId = "publication.tampered";
    storage.setItem(addressKey, JSON.stringify(address));
    assert.equal(loadSaveWithAuthority(accountId, "slot-1"), null);

    const recovered = recoverPendingCampaignPublications(accountId);
    assert.equal(recovered.length, 1);
    assert.equal(
      recovered[0].publication.publicationId,
      published.publication.publicationId
    );
    assert.equal(
      loadSaveWithAuthority(accountId, "slot-1").publication
        .publicationId,
      published.publication.publicationId
    );

    const repairedAddress = JSON.parse(storage.getItem(addressKey));
    repairedAddress.snapshot = `${repairedAddress.snapshot} `;
    storage.setItem(addressKey, JSON.stringify(repairedAddress));
    assert.equal(loadSaveWithAuthority(accountId, "slot-1"), null);
  }));

test("session publication rejects missing malformed closed and changed campaign control", () =>
  withMockWindow((storage) => {
    const accountId = "account.control_guards";
    const snapshot = createTargetSnapshot(accountId);
    const first = publishSave(
      accountId,
      "slot-1",
      snapshot,
      buildSaveMetadata("slot-1", snapshot)
    );
    const controlKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.campaign.${snapshot.campaignIdentity.campaignId}.control`;
    const originalControl = storage.getItem(controlKey);
    const next = structuredClone(snapshot);
    next.playerState.currency.copper += 1;
    const admitted = mutation(
      first.sessionControl,
      snapshot,
      next,
      "mutation.control_guards"
    );

    storage.removeItem(controlKey);
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-2",
          admitted.snapshot,
          buildSaveMetadata("slot-2", admitted.snapshot),
          { sessionControl: admitted.control }
        ),
      /missing or invalid/
    );

    storage.setItem(controlKey, "{}");
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-2",
          admitted.snapshot,
          buildSaveMetadata("slot-2", admitted.snapshot),
          { sessionControl: admitted.control }
        ),
      /missing or invalid/
    );

    const closed = JSON.parse(originalControl);
    closed.closed = true;
    storage.setItem(controlKey, JSON.stringify(closed));
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-2",
          admitted.snapshot,
          buildSaveMetadata("slot-2", admitted.snapshot),
          { sessionControl: admitted.control }
        ),
      /closed/
    );

    const changed = JSON.parse(originalControl);
    changed.headArtifactId = "artifact.changed";
    changed.headRevision += 1;
    storage.setItem(controlKey, JSON.stringify(changed));
    assert.throws(
      () =>
        publishSave(
          accountId,
          "slot-2",
          admitted.snapshot,
          buildSaveMetadata("slot-2", admitted.snapshot),
          { sessionControl: admitted.control }
        ),
      /Campaign head changed/
    );
  }));

test("version 6 migration retains source, proves one unique head, repairs HP zero, and retries idempotently", () =>
  withMockWindow((storage) => {
    const accountId = "account.migration";
    const headAt = "2026-07-30T10:00:00.000Z";
    const oldAt = "2026-07-29T10:00:00.000Z";
    const head = createLegacySnapshot(accountId);
    const old = structuredClone(head);
    old.playerState.resources.hp.current = 0;
    saveAccountProfile(
      createLegacyAccountProfile(
        accountId,
        head,
        [
          { slotId: "slot-1", savedAt: headAt },
          { slotId: "slot-2", savedAt: oldAt }
        ],
        headAt
      )
    );
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-1`,
      legacyEnvelope(accountId, "slot-1", head, headAt)
    );
    const oldRaw = legacyEnvelope(accountId, "slot-2", old, oldAt);
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-2`,
      oldRaw
    );

    const loaded = loadSaveWithAuthority(accountId, "slot-2");
    assert.equal(loaded.migratedLegacy, true);
    assert.equal(loaded.repairedLegacyDefeat, true);
    assert.equal(loaded.sessionControl.posture, "non_head_unmutated");
    assert.equal(loaded.snapshot.playerState.resources.hp.current > 0, true);
    const migratedProfile = loadAccountProfile(accountId);
    assert.equal(
      migratedProfile.history.runRecords.some(
        (record) =>
          record.characterId === loaded.snapshot.campaignIdentity.characterId
      ),
      true
    );
    assert.equal(
      migratedProfile.history.runRecords.some(
        (record) => record.characterId === "player.persistence_test"
      ),
      false
    );
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.migration-source.player.persistence_test.slot-2`
      ),
      oldRaw
    );
    const retry = loadSaveWithAuthority(accountId, "slot-2");
    assert.equal(retry.snapshot.campaignIdentity.campaignId, loaded.snapshot.campaignIdentity.campaignId);
    assert.equal(retry.publication.publicationId, loaded.publication.publicationId);
  }));

test("separately loaded migrated HP-zero head and non-head repair exactly once without head promotion", () => {
  withMockWindow((storage) => {
    const accountId = "account.deferred_non_head_repair";
    const headAt = "2026-07-30T10:00:00.000Z";
    const oldAt = "2026-07-29T10:00:00.000Z";
    const head = createLegacySnapshot(accountId);
    const old = structuredClone(head);
    old.playerState.resources.hp.current = 0;
    saveAccountProfile(
      createLegacyAccountProfile(
        accountId,
        head,
        [
          { slotId: "slot-1", savedAt: headAt },
          { slotId: "slot-2", savedAt: oldAt }
        ],
        headAt
      )
    );
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-1`,
      legacyEnvelope(accountId, "slot-1", head, headAt)
    );
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-2`,
      legacyEnvelope(accountId, "slot-2", old, oldAt)
    );

    const migratedHead = loadSaveWithAuthority(accountId, "slot-1");
    const originalHeadPublication =
      migratedHead.publication.publicationId;
    const repairedNonHead = loadSaveWithAuthority(
      accountId,
      "slot-2"
    );
    assert.equal(repairedNonHead.repairedLegacyDefeat, true);
    assert.equal(
      repairedNonHead.sessionControl.posture,
      "non_head_unmutated"
    );
    assert.equal(
      repairedNonHead.sessionControl.campaignHeadArtifactId,
      migratedHead.sessionControl.campaignHeadArtifactId
    );
    assert.equal(
      repairedNonHead.snapshot.normalDefeatReceipts.length,
      1
    );
    assert.equal(
      loadSaveWithAuthority(accountId, "slot-2").snapshot
        .normalDefeatReceipts.length,
      1
    );
    assert.equal(
      loadSaveWithAuthority(accountId, "slot-1").publication
        .publicationId,
      originalHeadPublication
    );
  });

  withMockWindow((storage) => {
    const accountId = "account.deferred_head_repair";
    const headAt = "2026-07-30T11:00:00.000Z";
    const oldAt = "2026-07-29T11:00:00.000Z";
    const head = createLegacySnapshot(accountId);
    head.playerState.resources.hp.current = 0;
    const old = structuredClone(head);
    old.playerState.resources.hp.current = 10;
    saveAccountProfile(
      createLegacyAccountProfile(
        accountId,
        head,
        [
          { slotId: "slot-1", savedAt: headAt },
          { slotId: "slot-2", savedAt: oldAt }
        ],
        headAt
      )
    );
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-1`,
      legacyEnvelope(accountId, "slot-1", head, headAt)
    );
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-2`,
      legacyEnvelope(accountId, "slot-2", old, oldAt)
    );

    loadSaveWithAuthority(accountId, "slot-2");
    const migratedHeadAddress = JSON.parse(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-1`
      )
    );
    const repairedHead = loadSaveWithAuthority(accountId, "slot-1");
    assert.equal(repairedHead.repairedLegacyDefeat, true);
    assert.equal(repairedHead.sessionControl.posture, "at_head");
    assert.equal(
      repairedHead.sessionControl.campaignHeadRevision,
      2
    );
    assert.notEqual(
      repairedHead.publication.publicationId,
      migratedHeadAddress.publicationId
    );
    assert.equal(
      repairedHead.snapshot.normalDefeatReceipts.length,
      1
    );
    assert.equal(
      loadSaveWithAuthority(accountId, "slot-1").snapshot
        .normalDefeatReceipts.length,
      1
    );
  });
});

test("ambiguous version 6 groups remain quarantined with original bytes intact", () =>
  withMockWindow((storage) => {
    const accountId = "account.ambiguous";
    const source = createLegacySnapshot(accountId);
    saveAccountProfile(
      createLegacyAccountProfile(
        accountId,
        source,
        [
          { slotId: "slot-1", savedAt: "2026-07-28T00:00:00.000Z" },
          { slotId: "slot-2", savedAt: "2026-07-29T00:00:00.000Z" }
        ],
        undefined
      )
    );
    const one = legacyEnvelope(accountId, "slot-1", source, "2026-07-28T00:00:00.000Z");
    const two = legacyEnvelope(accountId, "slot-2", source, "2026-07-29T00:00:00.000Z");
    const oneKey = `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-1`;
    const twoKey = `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-2`;
    storage.setItem(oneKey, one);
    storage.setItem(twoKey, two);

    assert.equal(loadSaveWithAuthority(accountId, "slot-1"), null);
    assert.equal(storage.getItem(oneKey), one);
    assert.equal(storage.getItem(twoKey), two);
  }));

test("interrupted legacy migration reuses pending identities and retains playable source", () => {
  let failAccountRekey = false;
  withMockWindow((storage) => {
    const accountId = "account.migration_interrupt";
    const savedAt = "2026-07-30T08:00:00.000Z";
    const source = createLegacySnapshot(accountId);
    saveAccountProfile(
      createLegacyAccountProfile(
        accountId,
        source,
        [{ slotId: "slot-1", savedAt }],
        savedAt
      )
    );
    const sourceKey =
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-1`;
    const sourceRaw = legacyEnvelope(
      accountId,
      "slot-1",
      source,
      savedAt
    );
    storage.setItem(sourceKey, sourceRaw);

    failAccountRekey = true;
    assert.throws(
      () => loadSaveWithAuthority(accountId, "slot-1"),
      /injected account rekey failure/
    );
    failAccountRekey = false;
    assert.equal(storage.getItem(sourceKey), sourceRaw);
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-1`
      ),
      null
    );
    const receiptKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.migration.player.persistence_test`;
    const pending = JSON.parse(storage.getItem(receiptKey));
    assert.equal(pending.status, "pending");
    const artifactKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.artifact.${pending.artifacts["slot-1"].artifactId}`;
    const retainedArtifactRaw = storage.getItem(artifactKey);

    const retried = loadSaveWithAuthority(accountId, "slot-1");
    const applied = JSON.parse(storage.getItem(receiptKey));
    assert.equal(applied.status, "applied");
    assert.equal(
      retried.publication.publicationId,
      pending.artifacts["slot-1"].publicationId
    );
    assert.equal(storage.getItem(artifactKey), retainedArtifactRaw);
    assert.equal(storage.getItem(sourceKey), null);
  }, (key, raw) => {
    if (
      failAccountRekey &&
      key ===
        "cataclysm-rpg-ui.accounts.v1.account.account.migration_interrupt"
    ) {
      throw new Error("injected account rekey failure");
    }
    return raw;
  });
});

test("legacy address-projection interruption rolls back addresses and retries after history rekey", () => {
  let failSecondAddress = false;
  withMockWindow((storage) => {
    const accountId = "account.migration_projection_interrupt";
    const headAt = "2026-07-30T09:00:00.000Z";
    const oldAt = "2026-07-29T09:00:00.000Z";
    const source = createLegacySnapshot(accountId);
    saveAccountProfile(
      createLegacyAccountProfile(
        accountId,
        source,
        [
          { slotId: "slot-1", savedAt: headAt },
          { slotId: "slot-2", savedAt: oldAt }
        ],
        headAt
      )
    );
    const v6One =
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-1`;
    const v6Two =
      `cataclysm-rpg-ui.saves.v6.account.${accountId}.slot.slot-2`;
    storage.setItem(
      v6One,
      legacyEnvelope(accountId, "slot-1", source, headAt)
    );
    storage.setItem(
      v6Two,
      legacyEnvelope(accountId, "slot-2", source, oldAt)
    );

    failSecondAddress = true;
    assert.throws(
      () => loadSaveWithAuthority(accountId, "slot-1"),
      /injected address projection failure/
    );
    failSecondAddress = false;
    assert.notEqual(storage.getItem(v6One), null);
    assert.notEqual(storage.getItem(v6Two), null);
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-1`
      ),
      null
    );
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-2`
      ),
      null
    );

    const retried = loadSaveWithAuthority(accountId, "slot-1");
    assert.equal(retried.migratedLegacy, true);
    assert.equal(retried.sessionControl.posture, "at_head");
    assert.equal(storage.getItem(v6One), null);
    assert.equal(storage.getItem(v6Two), null);
  }, (key, raw) => {
    if (
      failSecondAddress &&
      key ===
        "cataclysm-rpg-ui.saves.v7.account.account.migration_projection_interrupt.slot.slot-2"
    ) {
      throw new Error("injected address projection failure");
    }
    return raw;
  });
});

test("publication consumers are stable, retryable, mandatory-aware, and conflict closed", () => {
  const publication = {
    publicationId: "publication.consumer",
    campaignId: "campaign.consumer",
    continuityId: "continuity.consumer",
    characterId: "character.consumer",
    publishedAt: "2026-07-30T12:00:00.000Z"
  };
  const profile = createDefaultAccountProfileState({
    accountId: "account.consumer"
  });
  const pending = recordCampaignPublicationConsumer(
    profile,
    publication,
    "preparation_consumption",
    "payload.one",
    { status: "pending", error: "injected" }
  );
  assert.equal(hasPendingMandatoryCampaignConsumers(pending), true);
  const applied = recordCampaignPublicationConsumer(
    pending,
    publication,
    "preparation_consumption",
    "payload.one",
    { status: "applied" }
  );
  assert.equal(hasPendingMandatoryCampaignConsumers(applied), false);
  assert.equal(
    recordCampaignPublicationConsumer(
      applied,
      publication,
      "preparation_consumption",
      "payload.one",
      { status: "applied" }
    ),
    applied
  );
  assert.throws(
    () =>
      recordCampaignPublicationConsumer(
        applied,
        publication,
        "preparation_consumption",
        "payload.conflict",
        { status: "applied" }
      ),
    /conflicting payload/
  );
});

test("durable publication plans survive observed account-write failure and reconcile idempotently", () => {
  let failAfterAccountWrite = false;
  withMockWindow((storage) => {
    const accountId = "account.durable_consumer";
    let profile = createDefaultAccountProfileState({ accountId });
    saveAccountProfile(profile);
    const snapshot = createTargetSnapshot(accountId);
    const consumerPlans = [
      {
        kind: "preparation_consumption",
        payloadFingerprint: "payload.durable"
      },
      {
        kind: "inheritance_consumption",
        payloadFingerprint: "payload.durable"
      }
    ];
    const published = publishSave(
      accountId,
      "slot-1",
      snapshot,
      buildSaveMetadata("slot-1", snapshot),
      { consumerPlans }
    );
    profile = recordCampaignPublicationConsumer(
      profile,
      published.publication,
      "preparation_consumption",
      "payload.durable",
      { status: "applied" }
    );

    failAfterAccountWrite = true;
    assert.throws(
      () => saveAccountProfile(profile),
      /observed account persistence failure/
    );
    failAfterAccountWrite = false;

    const persisted = loadAccountProfile(accountId);
    assert.equal(
      persisted.campaignPublicationReceipts.find(
        (receipt) =>
          receipt.kind === "preparation_consumption"
      ).status,
      "applied"
    );
    const recoveries = recoverPendingCampaignPublications(accountId);
    assert.equal(recoveries.length, 1);
    assert.deepEqual(
      recoveries[0].consumerPlans.map((plan) => plan.kind),
      ["preparation_consumption", "inheritance_consumption"]
    );
    const unchanged = recordCampaignPublicationConsumer(
      persisted,
      published.publication,
      "preparation_consumption",
      "payload.durable",
      { status: "pending" }
    );
    assert.equal(unchanged, persisted);
    completeCampaignPublicationConsumers(
      accountId,
      published.publication.publicationId,
      ["preparation_consumption", "inheritance_consumption"]
    );
    const recoveryKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.campaign.${snapshot.campaignIdentity.campaignId}.publication-recovery`;
    assert.equal(storage.getItem(recoveryKey), null);
  }, (key, raw) => {
    if (
      failAfterAccountWrite &&
      key ===
        "cataclysm-rpg-ui.accounts.v1.account.account.durable_consumer"
    ) {
      return {
        raw,
        throwAfterWrite: true,
        message: "observed account persistence failure"
      };
    }
    return raw;
  });
});

test("terminal publication stays closed and address cleanup waits for durable account consumers", () => {
  let failAfterAccountWrite = false;
  withMockWindow((storage) => {
    const accountId = "account.terminal_repair";
    const profile = createDefaultAccountProfileState({ accountId });
    saveAccountProfile(profile);
    const snapshot = createTargetSnapshot(accountId);
    const consumerPlans = [
      {
        kind: "retirement_settlement",
        payloadFingerprint: "payload.terminal"
      },
      {
        kind: "estate",
        payloadFingerprint: "payload.terminal"
      }
    ];
    const published = publishSave(
      accountId,
      "slot-1",
      snapshot,
      buildSaveMetadata("slot-1", snapshot),
      { terminal: true, consumerPlans }
    );
    const archived = archiveActiveRun({
      accountId,
      accountProfile: profile,
      snapshot: published.snapshot,
      archiveReason: "retired",
      fallbackSlotId: "slot-1",
      verifiedTerminalPublication: published.publication,
      persistAccountProfile: false,
      deferSlotDeletion: true
    });
    let accountWithReceipts = recordCampaignPublicationConsumer(
      archived.accountProfile,
      published.publication,
      "retirement_settlement",
      "payload.terminal",
      { status: "applied" }
    );
    accountWithReceipts = recordCampaignPublicationConsumer(
      accountWithReceipts,
      published.publication,
      "estate",
      "payload.terminal",
      { status: "applied" }
    );

    assert.equal(loadSaveWithAuthority(accountId, "slot-1"), null);
    assert.ok(
      loadSaveWithAuthority(accountId, "slot-1", {
        allowClosed: true
      })
    );

    failAfterAccountWrite = true;
    assert.throws(
      () => saveAccountProfile(accountWithReceipts),
      /observed terminal account failure/
    );
    failAfterAccountWrite = false;

    const persisted = loadAccountProfile(accountId);
    assert.equal(
      persisted.campaignPublicationReceipts.filter(
        (receipt) =>
          receipt.publicationId ===
            published.publication.publicationId &&
          receipt.status === "applied"
      ).length,
      2
    );
    for (const slotId of archived.clearedSlotIds) {
      deleteSave(accountId, slotId);
    }
    completeCampaignPublicationConsumers(
      accountId,
      published.publication.publicationId,
      ["retirement_settlement", "estate"]
    );

    const controlKey =
      `cataclysm-rpg-ui.saves.v7.account.${accountId}.campaign.${snapshot.campaignIdentity.campaignId}.control`;
    const control = JSON.parse(storage.getItem(controlKey));
    assert.equal(control.closed, true);
    assert.equal(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.slot.slot-1`
      ),
      null
    );
    assert.ok(
      storage.getItem(
        `cataclysm-rpg-ui.saves.v7.account.${accountId}.artifact.${control.headArtifactId}`
      )
    );
    assert.equal(
      recoverPendingCampaignPublications(accountId).length,
      0
    );
  }, (key, raw) => {
    if (
      failAfterAccountWrite &&
      key ===
        "cataclysm-rpg-ui.accounts.v1.account.account.terminal_repair"
    ) {
      return {
        raw,
        throwAfterWrite: true,
        message: "observed terminal account failure"
      };
    }
    return raw;
  });
});

test("UI ordering and source guards prevent eager account writes and ordinary HP-zero archival", () => {
  const appSource = readFileSync(
    new URL("../../apps/rpg-ui/src/App.tsx", import.meta.url),
    "utf8"
  );
  const sessionSource = readFileSync(
    new URL("../../apps/rpg-ui/src/runtime/GameSessionContext.tsx", import.meta.url),
    "utf8"
  );
  const lifecycleSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/runLifecycle.ts", import.meta.url),
    "utf8"
  );
  const defeatSource = readFileSync(
    new URL("../../packages/engines/game-engine/src/normal-defeat.ts", import.meta.url),
    "utf8"
  );
  const retirementStart = appSource.indexOf("const handleRetireCharacter");
  const retirementSource = appSource.slice(retirementStart);

  assert.doesNotMatch(
    appSource,
    /onSnapshotChange[\s\S]{0,500}evaluateAchievementProgress/
  );
  assert.match(sessionSource, /admitCampaignMutation/);
  assert.match(lifecycleSource, /normal_stakes/);
  assert.match(lifecycleSource, /return null/);
  assert.doesNotMatch(defeatSource, /publishSave|archiveActiveRun|deleteSave/);
  assert.equal(
    retirementSource.indexOf("publishSave(") <
      retirementSource.indexOf("archiveActiveRun("),
    true
  );
});

test("new campaign owner modules keep JavaScript mirrors and public exports aligned", () => {
  for (const name of [
    "campaign-rules",
    "campaign-session",
    "normal-defeat",
    "account-publication"
  ]) {
    const mirror = readFileSync(
      new URL(`../../packages/engines/game-engine/src/${name}.js`, import.meta.url),
      "utf8"
    );
    assert.equal(mirror.trim(), `export * from "./${name}.ts";`);
  }

  const indexSource = readFileSync(
    new URL("../../packages/engines/game-engine/src/index.ts", import.meta.url),
    "utf8"
  );
  assert.match(indexSource, /from "\.\/campaign-rules\.js"/);
  assert.match(indexSource, /from "\.\/campaign-session\.js"/);
  assert.match(indexSource, /from "\.\/normal-defeat\.js"/);
  assert.match(indexSource, /from "\.\/account-publication\.js"/);
});
