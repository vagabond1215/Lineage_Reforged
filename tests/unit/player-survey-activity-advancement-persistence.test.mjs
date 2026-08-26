import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  buildSaveMetadata,
  loadSaveWithAuthority,
  publishSave
} from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import {
  initializeTargetCampaignSnapshot,
  isTargetCampaignSnapshot,
  serializeAshenReefSurveyNormalizedIntent
} from "../../packages/engines/game-engine/src/campaign-rules.ts";
import {
  buildAshenReefSurveyQuestObjectives,
  getAshenReefSurveyContent
} from "../../packages/engines/game-engine/src/ashen-reef-survey-content.ts";
import { createCampaignSessionControl } from "../../packages/engines/game-engine/src/campaign-session.ts";
import { resolveNormalDefeat } from "../../packages/engines/game-engine/src/normal-defeat.ts";
import {
  createPlayerProgressionState
} from "../../packages/engines/player-engine/src/progression.ts";
import {
  createPlayerSurveyActivityAdvancementCommand,
  executePlayerSurveyActivityAdvancementCommand,
  listPendingPlayerSurveyProjectionRepairs,
  repairPlayerSurveyActivityProjection
} from "../../packages/engines/game-engine/src/player-survey-activity-advancement.ts";
import {
  createPlayerTravelCommand,
  executePlayerTravelCommand
} from "../../packages/engines/game-engine/src/player-travel.ts";
import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../packages/shared/persistence/src/index.ts";

const QUEST_ID = "quest.ashen_reef_survey";
const SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";

function createMockStorage() {
  const values = new Map();
  return {
    get length() { return values.size; },
    key(index) { return Array.from(values.keys())[index] ?? null; },
    getItem(key) { return values.has(String(key)) ? values.get(String(key)) : null; },
    setItem(key, value) { values.set(String(key), String(value)); },
    removeItem(key) { values.delete(String(key)); },
    clear() { values.clear(); }
  };
}

function withMockWindow(run) {
  const originalWindow = globalThis.window;
  globalThis.window = { localStorage: createMockStorage() };
  try {
    return run(globalThis.window.localStorage);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
}

function uncheckedCanonicalIntent(value) {
  const normalize = (entry) => {
    if (Array.isArray(entry)) return entry.map(normalize);
    if (!entry || typeof entry !== "object") return entry;
    return Object.keys(entry)
      .sort()
      .reduce((result, key) => {
        result[key] = normalize(entry[key]);
        return result;
      }, {});
  };
  return JSON.stringify(normalize(value));
}

function createSurveySource(accountId = "account.survey_persistence") {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.accountId = accountId;
  snapshot.sessionState.trackedQuestId = QUEST_ID;
  snapshot.sessionState.questJournal = snapshot.sessionState.questJournal.map((entry) => ({
    ...entry,
    category: entry.id === QUEST_ID ? "active" : entry.category,
    tracked: entry.id === QUEST_ID
  }));
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.starfall_port",
    siteLabel: "Ashen Reef"
  };
  snapshot.sessionState.flags = snapshot.sessionState.flags.filter(
    (flag) =>
      !flag.startsWith(SECTOR_PREFIX) &&
      flag !== "gameplay.quest.ashen_reef_survey.ruins_confirmed" &&
      flag !== "gameplay.discovery.stormglass_bloom"
  );
  snapshot.playerState.discoveryChronicle.entries =
    snapshot.playerState.discoveryChronicle.entries.filter(
      (entry) => entry.id !== "discovery.stormglass_bloom"
    );
  return initializeTargetCampaignSnapshot(snapshot, { source: "developer_fixture" });
}

function createControl(snapshot, revision = 1) {
  return createCampaignSessionControl({
    accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId,
    artifactId: "artifact.survey.persistence",
    publicationId: "publication.survey.persistence",
    artifactRevision: revision,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: "artifact.survey.persistence",
    headRevision: revision
  });
}

function executeSurvey(snapshot, control, suffix, options = {}) {
  const requestId = `survey_request.00000000-0000-4000-8000-${suffix.padStart(12, "0")}`;
  const command = createPlayerSurveyActivityAdvancementCommand(snapshot, control, requestId);
  return executePlayerSurveyActivityAdvancementCommand(snapshot, control, command, options);
}

function rewriteSurveyAuthorityContentVersion(snapshot, version) {
  const rewritten = structuredClone(snapshot);
  const authority = rewritten.authorityLedger.ashenReefSurvey;
  const content = getAshenReefSurveyContent(version);
  assert.equal(authority.requests.length, authority.occurrences.length);
  assert.equal(authority.requests.length, authority.results.length);

  authority.requests.forEach((request, index) => {
    const occurrence = authority.occurrences[index];
    const result = authority.results[index];
    assert.ok(occurrence);
    assert.ok(result);
    const objectives = buildAshenReefSurveyQuestObjectives(
      version,
      result.materialAfter.sectorCount,
      result.materialAfter.ruinsConfirmed
    );

    request.normalizedIntent.materialVersions.surveyContent = version;
    if (request.normalizedIntent.ownerInputs.surveyOperation) {
      request.normalizedIntent.ownerInputs.surveyOperation.title = content.operationTitle;
    }
    request.canonicalIntent = serializeAshenReefSurveyNormalizedIntent(
      request.normalizedIntent
    );
    occurrence.materialVersions.surveyContent = version;
    result.operation.title = content.operationTitle;

    const receipts = authority.consequenceReceipts.filter(
      (entry) => entry.resultId === result.resultId
    );
    const operationReceipt = receipts.find((entry) => entry.kind === "survey_operation");
    const questReceipt = receipts.find((entry) => entry.kind === "quest_progress_sync");
    assert.ok(operationReceipt);
    assert.ok(questReceipt);
    if (operationReceipt.effect.before) {
      operationReceipt.effect.before.title = content.operationTitle;
    }
    operationReceipt.effect.after.title = content.operationTitle;
    questReceipt.effect.objectives = objectives;

    if (result.stage === "ruins_confirmation") {
      result.notice.detail = content.completionNoticeDetail;
      result.currentActivityOutcome.detail = content.returnActivityDetail;
      const notificationReceipt = receipts.find(
        (entry) => entry.kind === "notification_projection"
      );
      const discoveryReceipt = receipts.find(
        (entry) => entry.kind === "player_discovery"
      );
      const activityReceipt = receipts.find(
        (entry) => entry.kind === "activity_transition"
      );
      assert.ok(notificationReceipt);
      assert.ok(discoveryReceipt);
      assert.ok(activityReceipt);
      notificationReceipt.effect.row.detail = content.completionNotificationDetail;
      discoveryReceipt.effect.after.regionLabel = content.regionLabel;
      activityReceipt.effect.after.detail = content.returnActivityDetail;
      const liveNotification = rewritten.sessionState.notifications.find(
        (entry) => entry.id === result.projectionIds.notification
      );
      assert.ok(liveNotification);
      liveNotification.detail = content.completionNotificationDetail;
    }
  });

  const latestResult = authority.results.at(-1);
  assert.ok(latestResult);
  const objectives = buildAshenReefSurveyQuestObjectives(
    version,
    latestResult.materialAfter.sectorCount,
    latestResult.materialAfter.ruinsConfirmed
  );

  const liveOperation = rewritten.sessionState.operations.find(
    (entry) => entry.id === "operation.quest.ashen_reef_survey"
  );
  const liveQuest = rewritten.sessionState.questJournal.find(
    (entry) => entry.id === QUEST_ID
  );
  assert.ok(liveOperation);
  assert.ok(liveQuest);
  liveOperation.title = content.operationTitle;
  liveQuest.title = content.questTitle;
  liveQuest.regionLabel = content.questRegionLabel;
  liveQuest.rewardLabel = content.questRewardLabel;
  liveQuest.summary = content.questSummary;
  liveQuest.rewards = structuredClone(content.questRewards);
  liveQuest.relatedLocations = structuredClone(content.questRelatedLocations);
  liveQuest.tags = structuredClone(content.questTags);
  liveQuest.objectives = objectives;
  const liveDiscovery = rewritten.playerState.discoveryChronicle.entries.find(
    (entry) => entry.id === "discovery.stormglass_bloom"
  );
  if (liveDiscovery) liveDiscovery.regionLabel = content.regionLabel;
  if (rewritten.sessionState.currentActivity?.id === "activity.return.survey_packet") {
    rewritten.sessionState.currentActivity.detail = content.returnActivityDetail;
  }
  const liveCodex = rewritten.sessionState.codexEntries.find(
    (entry) => entry.id === "flora.unknown_bloom" && entry.locked === false
  );
  if (liveCodex) {
    liveCodex.tags = structuredClone(content.codexTags);
    liveCodex.regionTags = structuredClone(content.codexRegionTags);
  }
  return rewritten;
}

test("raw serialization preserves every persisted survey authority collection exactly", () => {
  const source = createSurveySource();
  const first = executeSurvey(source, createControl(source), "a001", {
    failProjections: ["notification"]
  });
  assert.equal(first.accepted, true);
  const repaired = repairPlayerSurveyActivityProjection(
    first.snapshot,
    first.control,
    first.result.resultId,
    "notification"
  );
  assert.equal(repaired.accepted, true);

  const snapshot = structuredClone(repaired.snapshot);
  const receipts = snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.filter(
    (entry) => entry.resultId === first.result.resultId
  );
  snapshot.authorityLedger.ashenReefSurvey.corrections.push({
    version: 1,
    correctionId: "survey_correction.00000000-0000-4000-8000-00000000d001",
    campaignId: snapshot.campaignIdentity.campaignId,
    continuityId: snapshot.campaignIdentity.continuityId,
    characterId: snapshot.campaignIdentity.characterId,
    supersededResultId: first.result.resultId,
    replacementResultId: null,
    reason: "Persistence shape verification.",
    evidenceIds: ["evidence.persistence.1"],
    createdAtTick: snapshot.clock.tick,
    reconciliations: receipts.map((receipt) => ({
      owner: receipt.owner,
      kind: receipt.kind,
      status: "confirmed_no_change",
      evidenceId: "evidence.persistence.1"
    }))
  });
  assert.equal(isTargetCampaignSnapshot(snapshot), true);
  const roundtrip = deserializeSnapshot(serializeSnapshot(snapshot));
  assert.deepEqual(
    roundtrip.authorityLedger.ashenReefSurvey,
    snapshot.authorityLedger.ashenReefSurvey
  );
  assert.equal(serializeSnapshot(roundtrip), serializeSnapshot(snapshot));
});

test("version-7 publication and restart preserve exact survey evidence and durable duplicate lookup", () => {
  withMockWindow(() => {
    const source = createSurveySource("account.survey_publish");
    const initial = publishSave(
      source.accountId,
      "slot-1",
      source,
      buildSaveMetadata("slot-1", source)
    );
    const requestId = "survey_request.00000000-0000-4000-8000-00000000a002";
    const command = createPlayerSurveyActivityAdvancementCommand(
      initial.snapshot,
      initial.sessionControl,
      requestId
    );
    const accepted = executePlayerSurveyActivityAdvancementCommand(
      initial.snapshot,
      initial.sessionControl,
      command
    );
    assert.equal(accepted.accepted, true);
    const published = publishSave(
      source.accountId,
      "slot-1",
      accepted.snapshot,
      buildSaveMetadata("slot-1", accepted.snapshot),
      { sessionControl: accepted.control }
    );
    const loaded = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(loaded);
    assert.deepEqual(
      loaded.snapshot.authorityLedger.ashenReefSurvey,
      accepted.snapshot.authorityLedger.ashenReefSurvey
    );
    assert.equal(
      serializeSnapshot(loaded.snapshot.authorityLedger.ashenReefSurvey),
      serializeSnapshot(published.snapshot.authorityLedger.ashenReefSurvey)
    );
    const duplicate = executePlayerSurveyActivityAdvancementCommand(
      loaded.snapshot,
      loaded.sessionControl,
      command
    );
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.snapshot, loaded.snapshot);
    assert.equal(duplicate.snapshot.clock.tick, accepted.snapshot.clock.tick);
  });
});

test("persisted survey-content v1 remains byte-stable while later shifts author v2 evidence", () => {
  withMockWindow(() => {
    const source = createSurveySource("account.survey_content_versions");
    const legacyContent = getAshenReefSurveyContent(1);
    const sourceQuest = source.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
    assert.ok(sourceQuest);
    sourceQuest.title = legacyContent.questTitle;
    sourceQuest.objectives = buildAshenReefSurveyQuestObjectives(1, 0, false);

    const initial = publishSave(
      source.accountId,
      "slot-1",
      source,
      buildSaveMetadata("slot-1", source)
    );
    const legacyRequestId = "survey_request.00000000-0000-4000-8000-00000000a030";
    const currentCommand = createPlayerSurveyActivityAdvancementCommand(
      initial.snapshot,
      initial.sessionControl,
      legacyRequestId
    );
    assert.equal(currentCommand.normalizedIntent.materialVersions.surveyContent, 2);
    const currentResult = executePlayerSurveyActivityAdvancementCommand(
      initial.snapshot,
      initial.sessionControl,
      currentCommand
    );
    assert.equal(currentResult.accepted, true);

    const legacySnapshot = rewriteSurveyAuthorityContentVersion(
      currentResult.snapshot,
      1
    );
    assert.equal(isTargetCampaignSnapshot(legacySnapshot), true);
    const legacyAuthorityBefore = structuredClone(
      legacySnapshot.authorityLedger.ashenReefSurvey
    );
    publishSave(
      source.accountId,
      "slot-1",
      legacySnapshot,
      buildSaveMetadata("slot-1", legacySnapshot),
      { sessionControl: currentResult.control }
    );

    const legacyReload = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(legacyReload);
    assert.deepEqual(
      legacyReload.snapshot.authorityLedger.ashenReefSurvey,
      legacyAuthorityBefore
    );
    const retainedLegacyCommand = createPlayerSurveyActivityAdvancementCommand(
      legacyReload.snapshot,
      legacyReload.sessionControl,
      legacyRequestId
    );
    assert.equal(
      retainedLegacyCommand.normalizedIntent.materialVersions.surveyContent,
      1
    );
    const durableLegacyDuplicate = executePlayerSurveyActivityAdvancementCommand(
      legacyReload.snapshot,
      legacyReload.sessionControl,
      retainedLegacyCommand
    );
    assert.equal(durableLegacyDuplicate.code, "duplicate");
    assert.equal(durableLegacyDuplicate.duplicate, true);

    const firstProjectionBytes = {
      notification: JSON.stringify(
        legacyReload.snapshot.sessionState.notifications.find(
          (entry) => entry.id === legacyAuthorityBefore.results[0].projectionIds.notification
        )
      ),
      chronicle: JSON.stringify(
        legacyReload.snapshot.sessionState.chronicle.find(
          (entry) => entry.id === legacyAuthorityBefore.results[0].projectionIds.chronicle
        )
      )
    };
    const next = executeSurvey(
      legacyReload.snapshot,
      legacyReload.sessionControl,
      "a031"
    );
    assert.equal(next.accepted, true);
    assert.deepEqual(
      next.snapshot.authorityLedger.ashenReefSurvey.requests[0],
      legacyAuthorityBefore.requests[0]
    );
    assert.deepEqual(
      next.snapshot.authorityLedger.ashenReefSurvey.occurrences[0],
      legacyAuthorityBefore.occurrences[0]
    );
    assert.deepEqual(
      next.snapshot.authorityLedger.ashenReefSurvey.results[0],
      legacyAuthorityBefore.results[0]
    );
    assert.deepEqual(
      next.snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.slice(
        0,
        legacyAuthorityBefore.consequenceReceipts.length
      ),
      legacyAuthorityBefore.consequenceReceipts
    );
    assert.equal(
      next.snapshot.authorityLedger.ashenReefSurvey.requests[1]
        .normalizedIntent.materialVersions.surveyContent,
      2
    );
    const mixedQuest = next.snapshot.sessionState.questJournal.find(
      (entry) => entry.id === QUEST_ID
    );
    assert.equal(mixedQuest.title, "Soundings of Ashen Reef");
    assert.equal(mixedQuest.regionLabel, "Starfall Isle");
    assert.doesNotMatch(JSON.stringify(mixedQuest), /580 crown|salvage rights/i);
    assert.deepEqual(
      next.snapshot.authorityLedger.ashenReefSurvey.occurrences.map(
        (entry) => entry.materialVersions.surveyContent
      ),
      [1, 2]
    );
    assert.equal(
      JSON.stringify(next.snapshot.sessionState.notifications.find(
        (entry) => entry.id === legacyAuthorityBefore.results[0].projectionIds.notification
      )),
      firstProjectionBytes.notification
    );
    assert.equal(
      JSON.stringify(next.snapshot.sessionState.chronicle.find(
        (entry) => entry.id === legacyAuthorityBefore.results[0].projectionIds.chronicle
      )),
      firstProjectionBytes.chronicle
    );

    publishSave(
      source.accountId,
      "slot-1",
      next.snapshot,
      buildSaveMetadata("slot-1", next.snapshot),
      { sessionControl: next.control }
    );
    const mixedReload = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(mixedReload);
    assert.equal(isTargetCampaignSnapshot(mixedReload.snapshot), true);
    assert.deepEqual(
      mixedReload.snapshot.authorityLedger.ashenReefSurvey.requests.map(
        (entry) => entry.normalizedIntent.materialVersions.surveyContent
      ),
      [1, 2]
    );
    const duplicateAfterMixedRestart = executePlayerSurveyActivityAdvancementCommand(
      mixedReload.snapshot,
      mixedReload.sessionControl,
      retainedLegacyCommand
    );
    assert.equal(duplicateAfterMixedRestart.code, "duplicate");
    assert.equal(duplicateAfterMixedRestart.duplicate, true);
  });
});

test("complete survey-content v1 authority publishes, restarts, duplicates, and repairs with legacy presentation", () => {
  withMockWindow(() => {
    const source = createSurveySource("account.survey_content_v1_complete");
    const initial = publishSave(
      source.accountId,
      "slot-1",
      source,
      buildSaveMetadata("slot-1", source)
    );
    let snapshot = initial.snapshot;
    let control = initial.sessionControl;
    const requestIds = [];
    for (const suffix of ["a040", "a041", "a042", "a043"]) {
      const result = executeSurvey(snapshot, control, suffix);
      assert.equal(result.accepted, true);
      snapshot = result.snapshot;
      control = result.control;
      requestIds.push(result.requestId);
    }

    const legacySnapshot = rewriteSurveyAuthorityContentVersion(snapshot, 1);
    assert.equal(isTargetCampaignSnapshot(legacySnapshot), true);
    const forgedCodexPresentation = structuredClone(legacySnapshot);
    const forgedCodex = forgedCodexPresentation.sessionState.codexEntries.find(
      (entry) => entry.id === "flora.unknown_bloom"
    );
    assert.ok(forgedCodex);
    forgedCodex.tags = getAshenReefSurveyContent(2).codexTags;
    forgedCodex.regionTags = getAshenReefSurveyContent(2).codexRegionTags;
    assert.equal(
      isTargetCampaignSnapshot(forgedCodexPresentation),
      false,
      "v1 authority rejects a forged v2 live Codex projection"
    );
    const rawRoundtrip = deserializeSnapshot(serializeSnapshot(legacySnapshot));
    assert.deepEqual(
      rawRoundtrip.authorityLedger.ashenReefSurvey,
      legacySnapshot.authorityLedger.ashenReefSurvey
    );
    publishSave(
      source.accountId,
      "slot-1",
      legacySnapshot,
      buildSaveMetadata("slot-1", legacySnapshot),
      { sessionControl: control }
    );
    const loaded = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(loaded);
    assert.deepEqual(
      loaded.snapshot.authorityLedger.ashenReefSurvey.requests.map(
        (entry) => entry.normalizedIntent.materialVersions.surveyContent
      ),
      [1, 1, 1, 1]
    );
    assert.equal(
      loaded.snapshot.sessionState.operations.find(
        (entry) => entry.id === "operation.quest.ashen_reef_survey"
      ).title,
      "Ashen Reef Survey"
    );
    assert.equal(
      loaded.snapshot.sessionState.questJournal.find(
        (entry) => entry.id === QUEST_ID
      ).regionLabel,
      "Glasswater"
    );
    assert.equal(
      loaded.snapshot.playerState.discoveryChronicle.entries.find(
        (entry) => entry.id === "discovery.stormglass_bloom"
      ).regionLabel,
      "Glasswater"
    );
    assert.match(
      loaded.snapshot.sessionState.currentActivity.detail,
      /Saltmere Harbor Office/
    );
    const legacyTravelSource = structuredClone(loaded.snapshot);
    legacyTravelSource.playerState.location.siteLabel = "Starfall Harbor";
    const legacyTravelCommand = createPlayerTravelCommand(
      legacyTravelSource,
      "location.ashen_reef"
    );
    const legacyTravel = executePlayerTravelCommand(
      legacyTravelSource,
      legacyTravelCommand
    );
    assert.equal(legacyTravel.accepted, true);
    assert.equal(
      legacyTravel.snapshot.sessionState.operations.find(
        (entry) => entry.id === "operation.quest.ashen_reef_survey"
      ).title,
      "Ashen Reef Survey"
    );
    assert.deepEqual(
      loaded.snapshot.sessionState.questJournal.find(
        (entry) => entry.id === QUEST_ID
      ).objectives,
      buildAshenReefSurveyQuestObjectives(1, 3, true)
    );

    const retainedFinalCommand = createPlayerSurveyActivityAdvancementCommand(
      loaded.snapshot,
      loaded.sessionControl,
      requestIds.at(-1)
    );
    const duplicate = executePlayerSurveyActivityAdvancementCommand(
      loaded.snapshot,
      loaded.sessionControl,
      retainedFinalCommand
    );
    assert.equal(duplicate.code, "duplicate");
    assert.equal(duplicate.duplicate, true);

    const finalResult = loaded.snapshot.authorityLedger.ashenReefSurvey.results.at(-1);
    const drifted = structuredClone(loaded.snapshot);
    drifted.sessionState.notifications = drifted.sessionState.notifications.filter(
      (entry) => entry.id !== finalResult.projectionIds.notification
    );
    assert.equal(isTargetCampaignSnapshot(drifted), true);
    publishSave(
      source.accountId,
      "slot-1",
      drifted,
      buildSaveMetadata("slot-1", drifted),
      { sessionControl: loaded.sessionControl }
    );
    const driftedReload = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(driftedReload);
    assert.equal(
      listPendingPlayerSurveyProjectionRepairs(driftedReload.snapshot).some(
        (entry) =>
          entry.resultId === finalResult.resultId &&
          entry.projectionKind === "notification"
      ),
      true
    );
    const repaired = repairPlayerSurveyActivityProjection(
      driftedReload.snapshot,
      driftedReload.sessionControl,
      finalResult.resultId,
      "notification"
    );
    assert.equal(repaired.accepted, true);
    assert.equal(repaired.repair.outcome, "inserted");
    assert.equal(
      repaired.snapshot.sessionState.notifications.find(
        (entry) => entry.id === finalResult.projectionIds.notification
      ).detail,
      getAshenReefSurveyContent(1).completionNotificationDetail
    );
    assert.equal(isTargetCampaignSnapshot(repaired.snapshot), true);
  });
});

test("survey-content version serialization admits only retained v1 and current v2", () => {
  const source = createSurveySource("account.survey_content_version_guard");
  const command = createPlayerSurveyActivityAdvancementCommand(
    source,
    createControl(source),
    "survey_request.00000000-0000-4000-8000-00000000a032"
  );
  assert.equal(command.normalizedIntent.materialVersions.surveyContent, 2);
  assert.equal(
    serializeAshenReefSurveyNormalizedIntent(command.normalizedIntent),
    command.canonicalIntent
  );
  for (const forgedVersion of [0, 3]) {
    const forged = structuredClone(command.normalizedIntent);
    forged.materialVersions.surveyContent = forgedVersion;
    assert.throws(
      () => serializeAshenReefSurveyNormalizedIntent(forged),
      /not valid canonical authority/
    );
  }
});

test("version-7 publication quarantines owner-incoherent retained progression without replacing valid authority", () => {
  withMockWindow(() => {
    const source = createSurveySource("account.survey_progression_coherence");
    const initial = publishSave(
      source.accountId,
      "slot-1",
      source,
      buildSaveMetadata("slot-1", source)
    );
    const requestId = "survey_request.00000000-0000-4000-8000-00000000a020";
    const command = createPlayerSurveyActivityAdvancementCommand(
      initial.snapshot,
      initial.sessionControl,
      requestId
    );
    const accepted = executePlayerSurveyActivityAdvancementCommand(
      initial.snapshot,
      initial.sessionControl,
      command
    );
    assert.equal(accepted.accepted, true);
    publishSave(
      source.accountId,
      "slot-1",
      accepted.snapshot,
      buildSaveMetadata("slot-1", accepted.snapshot),
      { sessionControl: accepted.control }
    );
    const loaded = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(loaded);

    const forgedCommand = structuredClone(command);
    forgedCommand.normalizedIntent.ownerInputs.progression = createPlayerProgressionState({
      legacyGrowth: command.normalizedIntent.ownerInputs.progression.legacyGrowth
    });
    forgedCommand.canonicalIntent = uncheckedCanonicalIntent(forgedCommand.normalizedIntent);
    const forgedRetry = executePlayerSurveyActivityAdvancementCommand(
      loaded.snapshot,
      loaded.sessionControl,
      forgedCommand
    );
    assert.equal(forgedRetry.code, "malformed_command");
    assert.equal(forgedRetry.snapshot, loaded.snapshot);

    const corrupted = structuredClone(loaded.snapshot);
    const retained = corrupted.authorityLedger.ashenReefSurvey.requests[0];
    retained.normalizedIntent.ownerInputs.progression = structuredClone(
      forgedCommand.normalizedIntent.ownerInputs.progression
    );
    retained.canonicalIntent = uncheckedCanonicalIntent(retained.normalizedIntent);
    assert.equal(isTargetCampaignSnapshot(corrupted), false);
    assert.throws(
      () => publishSave(
        source.accountId,
        "slot-1",
        corrupted,
        buildSaveMetadata("slot-1", corrupted),
        { sessionControl: loaded.sessionControl }
      ),
      /target campaign snapshot/
    );

    const reloaded = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.deepEqual(
      reloaded.snapshot.authorityLedger.ashenReefSurvey,
      loaded.snapshot.authorityLedger.ashenReefSurvey
    );
    const duplicate = executePlayerSurveyActivityAdvancementCommand(
      reloaded.snapshot,
      reloaded.sessionControl,
      command
    );
    assert.equal(duplicate.code, "duplicate");
    assert.equal(duplicate.duplicate, true);
  });
});

test("version-7 restart discovers and durably repairs byte-correct projection placement drift", () => {
  withMockWindow(() => {
    const source = createSurveySource("account.survey_projection_order");
    const initial = publishSave(
      source.accountId,
      "slot-1",
      source,
      buildSaveMetadata("slot-1", source)
    );
    const first = executeSurvey(initial.snapshot, initial.sessionControl, "a021");
    const second = executeSurvey(first.snapshot, first.control, "a022");
    assert.equal(first.accepted, true);
    assert.equal(second.accepted, true);

    const drifted = structuredClone(second.snapshot);
    const opaqueEvidence = {};
    for (const projectionKind of ["notification", "chronicle"]) {
      const destinationName = projectionKind === "notification" ? "notifications" : "chronicle";
      const ids = new Set([
        first.result.projectionIds[projectionKind],
        second.result.projectionIds[projectionKind]
      ]);
      const indices = drifted.sessionState[destinationName]
        .map((entry, index) => ids.has(entry.id) ? index : -1)
        .filter((index) => index >= 0);
      const firstRow = drifted.sessionState[destinationName][indices[0]];
      drifted.sessionState[destinationName][indices[0]] =
        drifted.sessionState[destinationName][indices[1]];
      drifted.sessionState[destinationName][indices[1]] = firstRow;
      opaqueEvidence[destinationName] = drifted.sessionState[destinationName]
        .map((entry, index) => ids.has(entry.id) ? null : [index, JSON.stringify(entry)])
        .filter(Boolean);
    }
    assert.equal(isTargetCampaignSnapshot(drifted), true);
    publishSave(
      source.accountId,
      "slot-1",
      drifted,
      buildSaveMetadata("slot-1", drifted),
      { sessionControl: second.control }
    );
    const loaded = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(loaded);
    assert.deepEqual(loaded.snapshot.sessionState.notifications, drifted.sessionState.notifications);
    assert.deepEqual(loaded.snapshot.sessionState.chronicle, drifted.sessionState.chronicle);
    assert.equal(listPendingPlayerSurveyProjectionRepairs(loaded.snapshot).length, 4);

    const notificationRepair = repairPlayerSurveyActivityProjection(
      loaded.snapshot,
      loaded.sessionControl,
      first.result.resultId,
      "notification"
    );
    assert.equal(notificationRepair.accepted, true);
    assert.equal(notificationRepair.repair.observed, "misordered");
    assert.equal(notificationRepair.repair.outcome, "reordered");
    const chronicleRepair = repairPlayerSurveyActivityProjection(
      notificationRepair.snapshot,
      notificationRepair.control,
      second.result.resultId,
      "chronicle"
    );
    assert.equal(chronicleRepair.accepted, true);
    assert.equal(chronicleRepair.repair.observed, "misordered");
    assert.equal(chronicleRepair.repair.outcome, "reordered");

    for (const projectionKind of ["notification", "chronicle"]) {
      const destinationName = projectionKind === "notification" ? "notifications" : "chronicle";
      assert.deepEqual(
        chronicleRepair.snapshot.sessionState[destinationName]
          .filter((entry) =>
            entry.id === first.result.projectionIds[projectionKind] ||
            entry.id === second.result.projectionIds[projectionKind]
          )
          .map((entry) => entry.id),
        [
          second.result.projectionIds[projectionKind],
          first.result.projectionIds[projectionKind]
        ]
      );
      for (const [index, bytes] of opaqueEvidence[destinationName]) {
        assert.equal(
          JSON.stringify(chronicleRepair.snapshot.sessionState[destinationName][index]),
          bytes
        );
      }
    }

    publishSave(
      source.accountId,
      "slot-1",
      chronicleRepair.snapshot,
      buildSaveMetadata("slot-1", chronicleRepair.snapshot),
      { sessionControl: chronicleRepair.control }
    );
    const repairedReload = loadSaveWithAuthority(source.accountId, "slot-1");
    assert.ok(repairedReload);
    assert.equal(
      repairedReload.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.filter(
        (entry) => entry.outcome === "reordered"
      ).length,
      2
    );
    assert.equal(
      serializeSnapshot(deserializeSnapshot(serializeSnapshot(repairedReload.snapshot))),
      serializeSnapshot(repairedReload.snapshot)
    );
    for (const [resultId, projectionKind] of [
      [second.result.resultId, "notification"],
      [first.result.resultId, "chronicle"]
    ]) {
      const duplicate = repairPlayerSurveyActivityProjection(
        repairedReload.snapshot,
        repairedReload.sessionControl,
        resultId,
        projectionKind
      );
      assert.equal(duplicate.code, "projection_already_correct");
      assert.equal(duplicate.duplicate, true);
    }
  });
});

test("publication rejects semantically corrupted survey authority even when bytes are serializable", () => {
  withMockWindow(() => {
    const source = createSurveySource("account.survey_corrupt");
    const first = publishSave(
      source.accountId,
      "slot-1",
      source,
      buildSaveMetadata("slot-1", source)
    );
    const accepted = executeSurvey(first.snapshot, first.sessionControl, "a003");
    const corrupted = structuredClone(accepted.snapshot);
    corrupted.authorityLedger.ashenReefSurvey.results[0].requiredReceiptIds.reverse();
    assert.doesNotThrow(() => serializeSnapshot(corrupted));
    assert.equal(isTargetCampaignSnapshot(corrupted), false);
    assert.throws(
      () => publishSave(
        source.accountId,
        "slot-1",
        corrupted,
        buildSaveMetadata("slot-1", corrupted),
        { sessionControl: accepted.control }
      ),
      /target campaign snapshot/
    );
  });
});

test("empty initialization is explicit while an existing absent target container remains absent", () => {
  const initialized = createSurveySource("account.survey_empty");
  assert.deepEqual(initialized.authorityLedger.ashenReefSurvey, {
    version: 1,
    requests: [],
    occurrences: [],
    results: [],
    consequenceReceipts: [],
    projectionRepairs: [],
    corrections: []
  });

  const existing = structuredClone(initialized);
  delete existing.authorityLedger.ashenReefSurvey;
  const before = serializeSnapshot(existing);
  assert.equal(isTargetCampaignSnapshot(existing), true);
  assert.equal(serializeSnapshot(existing), before);
  withMockWindow(() => {
    publishSave(
      existing.accountId,
      "slot-1",
      existing,
      buildSaveMetadata("slot-1", existing)
    );
    const loaded = loadSaveWithAuthority(existing.accountId, "slot-1");
    assert.equal(loaded.snapshot.authorityLedger.ashenReefSurvey, undefined);
  });
});

test("survey authority survives same-command and later Normal defeat ledger rewrites", () => {
  const source = createSurveySource("account.survey_defeat");
  source.playerState.resources.hp.current = 1;
  source.playerState.resourceRuntime.modifiers.push({
    id: "effect.survey_defeat_probe",
    label: "Survey Defeat Probe",
    sourceType: "system",
    sourceId: "test.survey_defeat_probe",
    maxFlat: {},
    maxPercent: {},
    tickDeltaFlat: { hp: -999 },
    notes: ["Forces the bounded campaign commit defeat seam in this test."]
  });
  const sameCommand = executeSurvey(source, createControl(source), "a004");
  assert.equal(sameCommand.accepted, true);
  assert.equal(sameCommand.snapshot.authorityLedger.ashenReefSurvey.results.length, 1);
  assert.equal(sameCommand.snapshot.normalDefeatReceipts.length, 1);
  assert.equal(isTargetCampaignSnapshot(sameCommand.snapshot), true);

  const laterSource = structuredClone(sameCommand.snapshot);
  laterSource.playerState.resources.hp.current = 0;
  const beforeAuthority = structuredClone(laterSource.authorityLedger.ashenReefSurvey);
  const laterDefeat = resolveNormalDefeat(laterSource, {
    sourceMutationId: "mutation.survey_later_defeat",
    sourceKind: "accepted_mutation"
  }).snapshot;
  assert.deepEqual(laterDefeat.authorityLedger.ashenReefSurvey, beforeAuthority);
  assert.equal(isTargetCampaignSnapshot(laterDefeat), true);
});

test("real caller source guards enforce engine-result admission, accepted-only state, stable request identity, and mirrors", () => {
  const gameplayLoop = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/gameplayLoop.ts", import.meta.url),
    "utf8"
  );
  const panel = readFileSync(
    new URL("../../apps/rpg-ui/src/features/ActivityPanel.tsx", import.meta.url),
    "utf8"
  );
  const context = readFileSync(
    new URL("../../apps/rpg-ui/src/runtime/GameSessionContext.tsx", import.meta.url),
    "utf8"
  );
  const caller = readFileSync(
    new URL("../../apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts", import.meta.url),
    "utf8"
  );
  const surveyModule = readFileSync(
    new URL("../../packages/engines/game-engine/src/player-survey-activity-advancement.ts", import.meta.url),
    "utf8"
  );
  const surveyMirror = readFileSync(
    new URL("../../packages/engines/game-engine/src/player-survey-activity-advancement.js", import.meta.url),
    "utf8"
  );
  const engineIndex = readFileSync(
    new URL("../../packages/engines/game-engine/src/index.ts", import.meta.url),
    "utf8"
  );

  const advanceStart = gameplayLoop.indexOf("export function advanceCurrentActivity");
  const rivetStart = gameplayLoop.indexOf("if (trackedQuestId === 'quest.rivet_shortfall_relief'", advanceStart);
  const surveyAdapter = gameplayLoop.slice(advanceStart, rivetStart);
  assert.doesNotMatch(surveyAdapter, /advanceSnapshotClock|applyResourceDelta|addOrUpdateSkill|addDiscoveryEntry|buildSurveyOperation/);
  assert.match(surveyAdapter, /resolvePlayerSurveyActivityAdvancementPlan/);
  assert.match(panel, /surveyRequestIdRef\.current \?\?= createAuthorityId\('survey_request'\)/);
  assert.match(panel, /shouldRetainAshenReefSurveyCallerRequestId\(outcome\)/);
  assert.match(panel, /surveyRequestIdRef\.current = null/);
  assert.doesNotMatch(panel, /shouldRetainPlayerSurveyRequestIdentity/);
  assert.match(panel, /disabled=\{advanceDisabled\}/);
  assert.match(panel, /isAshenReefSurveyAdvanceDisabled\(surveyPlan\)/);
  assert.match(panel, /resolveAshenReefSurveyPanelFacts\(surveyPlan\)/);
  assert.match(panel, /surveyPanelFacts\.staminaCost/);
  assert.match(panel, /surveyPanelFacts\.skillDetail/);
  assert.match(caller, /executePlayerSurveyActivityAdvancementCommand/);
  assert.match(caller, /preparePlayerSurveyActivityAdvancementCommand/);
  assert.match(caller, /shouldRetainPlayerSurveyRequestIdentity\(result\)/);
  assert.match(caller, /export function advanceAshenReefSurveyCaller/);
  assert.match(caller, /export function shouldRetainAshenReefSurveyCallerRequestId/);
  assert.match(caller, /export function isAshenReefSurveyAdvanceDisabled/);
  assert.match(caller, /export function resolveAshenReefSurveyPanelFacts/);
  assert.match(context, /advanceAshenReefSurveyCaller\(/);
  assert.match(context, /if \(transition\.acceptedState\) \{\s*onSnapshotChange\(/);
  assert.match(caller, /acceptedState: null/);
  assert.match(caller, /kind: 'technical_retry'/);
  assert.match(caller, /kind: 'terminal_result'/);
  assert.doesNotMatch(context, /advanceAshenReefSurvey:[\s\S]{0,250}=> PlayerSurveyActivityAdvancementResult \| null/);
  assert.doesNotMatch(context, /catch \{\s*return null/);
  assert.doesNotMatch(surveyModule, /notification\.\$\{.*clock\.tick|chronicle\.\$\{.*length/);
  assert.match(surveyModule, /compareProjectionAuthority/);
  assert.match(surveyModule, /stableId: result\.resultId/);
  assert.match(surveyModule, /inspectPlayerSurveyProjectionRepair/);
  assert.doesNotMatch(surveyModule, /createEvent\(/);
  assert.match(surveyModule, /event\.player\.activity\.survey\.\$\{uuid\}/);
  assert.equal(surveyMirror.trim(), 'export * from "./player-survey-activity-advancement.ts";');
  assert.match(engineIndex, /from "\.\/player-survey-activity-advancement\.js"/);
});
