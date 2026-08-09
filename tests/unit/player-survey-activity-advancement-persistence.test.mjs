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
  isTargetCampaignSnapshot
} from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { createCampaignSessionControl } from "../../packages/engines/game-engine/src/campaign-session.ts";
import { resolveNormalDefeat } from "../../packages/engines/game-engine/src/normal-defeat.ts";
import {
  createPlayerSurveyActivityAdvancementCommand,
  executePlayerSurveyActivityAdvancementCommand,
  repairPlayerSurveyActivityProjection
} from "../../packages/engines/game-engine/src/player-survey-activity-advancement.ts";
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
  assert.match(panel, /shouldRetainPlayerSurveyRequestIdentity\(result\)/);
  assert.match(panel, /disabled=\{!advancePreview\.available\}/);
  assert.match(panel, /surveyPlan\.resourceCosts\.stamina/);
  assert.match(context, /executePlayerSurveyActivityAdvancementCommand/);
  assert.match(context, /shouldRetainPlayerSurveyRequestIdentity\(result\)/);
  assert.match(context, /if \(result\.accepted\) \{\s*onSnapshotChange\(result\.snapshot, result\.control\)/);
  assert.doesNotMatch(surveyModule, /notification\.\$\{.*clock\.tick|chronicle\.\$\{.*length/);
  assert.doesNotMatch(surveyModule, /createEvent\(/);
  assert.match(surveyModule, /event\.player\.activity\.survey\.\$\{uuid\}/);
  assert.equal(surveyMirror.trim(), 'export * from "./player-survey-activity-advancement.ts";');
  assert.match(engineIndex, /from "\.\/player-survey-activity-advancement\.js"/);
});
