import test from "node:test";
import assert from "node:assert/strict";

import {
  ASHEN_REEF_SURVEY_ACCESS_LOCATION,
  ASHEN_REEF_SURVEY_NON_PROPOSALS,
  admitCampaignMutation,
  createPlayerQuestAcceptanceCommand,
  createPlayerTravelCommand,
  executePlayerQuestAcceptanceCommand,
  executePlayerTravelCommand,
  listPendingPlayerSurveyProjectionRepairs
} from "../../packages/engines/game-engine/src/index.ts";
import {
  createDefaultCharacterCreationFormState
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  createNewGameSnapshot
} from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import {
  completeNewCampaignAttempt,
  prepareNewCampaignAttempt
} from "../../apps/rpg-ui/src/game-shell/newCampaignAttemptCoordinator.ts";
import {
  buildSaveMetadata,
  loadSaveWithAuthority,
  publishSave
} from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import {
  advanceAshenReefSurveyCaller
} from "../../apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts";

const ACCOUNT_ID = "account.ashen_reef_representative";
const SLOT_ID = "slot-1";
const QUEST_ID = "quest.ashen_reef_survey";
const SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const RUINS_FLAG = "gameplay.quest.ashen_reef_survey.ruins_confirmed";
const REQUEST_IDS = [1, 2, 3, 4].map(
  (ordinal) =>
    `survey_request.00000000-0000-4000-8000-${ordinal
      .toString()
      .padStart(12, "0")}`
);

function createMockStorage() {
  const values = new Map();
  return {
    get length() { return values.size; },
    key(index) { return Array.from(values.keys())[index] ?? null; },
    getItem(key) {
      const normalized = String(key);
      return values.has(normalized) ? values.get(normalized) : null;
    },
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

function createStarfallForm() {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  return {
    ...createDefaultCharacterCreationFormState("slot-ashen-representative"),
    playerName: "Mara Soundinghand",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections:
      createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child",
    continentId: "region.myridian_chain",
    regionId: "region.starfall_isle",
    startingSettlementId: "settlement.starfall_port"
  };
}

function publishAndLoad(snapshot, sessionControl) {
  publishSave(
    ACCOUNT_ID,
    SLOT_ID,
    snapshot,
    buildSaveMetadata(SLOT_ID, snapshot),
    { sessionControl }
  );
  return loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
}

function admitEngineResult(snapshot, control, proposedSnapshot, mutationId) {
  const admission = admitCampaignMutation(control, {
    mutationId,
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: "engine_result",
    accepted: true,
    sourceSnapshot: snapshot,
    proposedSnapshot
  });
  assert.equal(admission.accepted, true);
  return admission;
}

test("ordinary creator reaches and completes the Ashen survey through production authority", () => {
  withMockWindow(() => {
    const form = createStarfallForm();
    let prepareCount = 0;
    const attempt = prepareNewCampaignAttempt({
      accountId: ACCOUNT_ID,
      slotId: SLOT_ID,
      normalizedInput: { form, preparation: [] },
      prepare: () => {
        prepareCount += 1;
        return {
          snapshot: createNewGameSnapshot(form, ACCOUNT_ID),
          consumerPlans: []
        };
      }
    });
    assert.equal(prepareCount, 1);

    const initialOffers = attempt.snapshot.sessionState.questJournal.filter(
      (entry) => entry.id === QUEST_ID
    );
    assert.equal(initialOffers.length, 1);
    assert.equal(initialOffers[0].category, "contracts");
    assert.equal(initialOffers[0].title, "Soundings of Ashen Reef");
    assert.equal(
      attempt.snapshot.sessionState.knownLocations.some(
        (entry) => entry.id === "location.ashen_reef"
      ),
      false
    );

    const initialPublication = publishSave(
      ACCOUNT_ID,
      SLOT_ID,
      attempt.snapshot,
      buildSaveMetadata(SLOT_ID, attempt.snapshot),
      { newCampaignAttemptId: attempt.attemptId }
    );
    assert.match(initialPublication.publication.publicationId, /^publication\./);
    completeNewCampaignAttempt(ACCOUNT_ID, SLOT_ID, attempt.attemptId);
    let loaded = loadSaveWithAuthority(ACCOUNT_ID, SLOT_ID);
    let snapshot = loaded.snapshot;
    let control = loaded.sessionControl;
    const baselineCurrency = structuredClone(snapshot.playerState.currency);
    const baselineStanding = structuredClone(snapshot.playerState.standing);
    const baselineInventory = structuredClone(snapshot.playerState.inventory);
    const baselineKnowledge = structuredClone(snapshot.playerState.geographicKnowledge);
    const baselineGeneralLoreRank = snapshot.playerState.skills.find(
      (entry) => entry.id === "skill.knowledge.general_lore"
    )?.rank ?? 0;

    const acceptCommand = createPlayerQuestAcceptanceCommand(snapshot, QUEST_ID);
    const acceptance = executePlayerQuestAcceptanceCommand(snapshot, acceptCommand);
    assert.equal(acceptance.accepted, true);
    assert.deepEqual(acceptance.facts.travelAccess, {
      locationId: "location.ashen_reef",
      posture: "established"
    });
    let admission = admitEngineResult(
      snapshot,
      control,
      acceptance.snapshot,
      `mutation.${acceptCommand.commandId}`
    );
    snapshot = admission.snapshot;
    control = admission.control;
    assert.equal(snapshot.sessionState.trackedQuestId, QUEST_ID);
    assert.deepEqual(
      snapshot.sessionState.knownLocations.find(
        (entry) => entry.id === "location.ashen_reef"
      ),
      ASHEN_REEF_SURVEY_ACCESS_LOCATION
    );
    assert.deepEqual(snapshot.playerState.geographicKnowledge, baselineKnowledge);

    loaded = publishAndLoad(snapshot, control);
    snapshot = loaded.snapshot;
    control = loaded.sessionControl;
    assert.equal(
      snapshot.sessionState.questJournal.filter((entry) => entry.id === QUEST_ID).length,
      1
    );
    assert.equal(
      snapshot.sessionState.questJournal.find((entry) => entry.id === QUEST_ID).category,
      "active"
    );

    const travelCommand = createPlayerTravelCommand(snapshot, "location.ashen_reef");
    const travel = executePlayerTravelCommand(snapshot, travelCommand);
    assert.equal(travel.accepted, true);
    assert.equal(travel.facts.name, "Ashen Reef");
    admission = admitEngineResult(
      snapshot,
      control,
      travel.snapshot,
      `mutation.${travelCommand.commandId}`
    );
    snapshot = admission.snapshot;
    control = admission.control;
    assert.equal(snapshot.playerState.location.siteLabel, "Survey Anchorage");
    assert.equal(snapshot.sessionState.currentActivity.id, "activity.survey.ashen_reef");
    assert.equal(
      snapshot.sessionState.operations.find(
        (entry) => entry.id === "operation.quest.ashen_reef_survey"
      ).title,
      "Soundings of Ashen Reef"
    );

    loaded = publishAndLoad(snapshot, control);
    snapshot = loaded.snapshot;
    control = loaded.sessionControl;
    let callerCache = new Map();
    let fourthAcceptedResult;

    for (let index = 0; index < REQUEST_IDS.length; index += 1) {
      const transition = advanceAshenReefSurveyCaller(
        snapshot,
        control,
        REQUEST_IDS[index],
        callerCache
      );
      assert.equal(transition.outcome.kind, "accepted");
      assert.ok(transition.acceptedState);
      snapshot = transition.acceptedState.snapshot;
      control = transition.acceptedState.control;
      if (index === 3) fourthAcceptedResult = transition.outcome.result;

      if (index === 1) {
        loaded = publishAndLoad(snapshot, control);
        snapshot = loaded.snapshot;
        control = loaded.sessionControl;
        callerCache = new Map();
      }
    }

    loaded = publishAndLoad(snapshot, control);
    snapshot = loaded.snapshot;
    control = loaded.sessionControl;
    callerCache = new Map();
    const beforeDuplicate = structuredClone(snapshot);
    const duplicate = advanceAshenReefSurveyCaller(
      snapshot,
      control,
      REQUEST_IDS[3],
      callerCache
    );
    assert.equal(duplicate.outcome.kind, "terminal_result");
    assert.equal(duplicate.outcome.result.accepted, false);
    assert.equal(duplicate.outcome.result.code, "duplicate");
    assert.deepEqual(duplicate.outcome.result.snapshot, snapshot);
    assert.deepEqual(snapshot, beforeDuplicate);

    const authority = snapshot.authorityLedger.ashenReefSurvey;
    assert.deepEqual(
      authority.requests.map((entry) => entry.requestId),
      REQUEST_IDS
    );
    assert.deepEqual(
      authority.occurrences.map((entry) => entry.stage),
      ["sector_1", "sector_2", "sector_3", "ruins_confirmation"]
    );
    assert.deepEqual(
      authority.results.map((entry) => entry.stage),
      ["sector_1", "sector_2", "sector_3", "ruins_confirmation"]
    );
    assert.equal(authority.requests.length, 4);
    assert.equal(authority.occurrences.length, 4);
    assert.equal(authority.results.length, 4);
    assert.equal(authority.consequenceReceipts.length, 48);
    assert.deepEqual(
      authority.requests.map(
        (entry) => entry.normalizedIntent.materialVersions.surveyContent
      ),
      [2, 2, 2, 2]
    );
    for (const result of authority.results) {
      assert.deepEqual(result.nonProposals, ASHEN_REEF_SURVEY_NON_PROPOSALS);
    }
    assert.deepEqual(authority.projectionRepairs, []);
    assert.deepEqual(authority.corrections, []);
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(snapshot), []);
    assert.equal(
      authority.consequenceReceipts.some(
        (entry) =>
          (entry.kind === "notification_projection" ||
            entry.kind === "chronicle_projection" ||
            entry.kind === "event_projection") &&
          entry.posture !== "applied"
      ),
      false
    );

    assert.deepEqual(
      snapshot.sessionState.flags.filter((entry) => entry.startsWith(SECTOR_PREFIX)),
      [
        `${SECTOR_PREFIX}1`,
        `${SECTOR_PREFIX}2`,
        `${SECTOR_PREFIX}3`
      ]
    );
    assert.equal(snapshot.sessionState.flags.includes(RUINS_FLAG), true);
    const operation = snapshot.sessionState.operations.find(
      (entry) => entry.id === "operation.quest.ashen_reef_survey"
    );
    assert.equal(operation.progress, 100);
    assert.equal(operation.title, "Soundings of Ashen Reef");
    assert.equal(snapshot.sessionState.currentActivity.id, "activity.return.survey_packet");
    assert.match(snapshot.sessionState.currentActivity.detail, /Starfall Harbormaster's Office/);
    const quest = snapshot.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
    assert.equal(quest.category, "active");
    assert.equal(quest.tracked, true);
    assert.equal(quest.title, "Soundings of Ashen Reef");
    assert.equal(quest.regionLabel, "Starfall Isle");
    assert.doesNotMatch(JSON.stringify(quest), /580 crown|salvage rights/i);
    assert.equal(snapshot.sessionState.trackedQuestId, QUEST_ID);
    assert.match(quest.objectives.at(-1), /Starfall Harbormaster's Office/);

    const discovery = snapshot.playerState.discoveryChronicle.entries.find(
      (entry) => entry.id === "discovery.stormglass_bloom"
    );
    assert.equal(discovery.regionLabel, "Starfall Isle");
    assert.equal(discovery.sourceId, QUEST_ID);
    assert.equal(
      snapshot.sessionState.codexEntries.some(
        (entry) => entry.id === "flora.unknown_bloom"
      ),
      false,
      "a fresh creator retains the honest source-record-absent Codex posture"
    );
    assert.equal(fourthAcceptedResult.result.codexOutcome, "source_record_absent");

    const expectedNotificationOrder = authority.results
      .map((entry) => entry.projectionIds.notification)
      .reverse();
    assert.deepEqual(
      snapshot.sessionState.notifications
        .filter((entry) => expectedNotificationOrder.includes(entry.id))
        .map((entry) => entry.id),
      expectedNotificationOrder
    );
    const expectedChronicleOrder = authority.results
      .map((entry) => entry.projectionIds.chronicle)
      .reverse();
    assert.deepEqual(
      snapshot.sessionState.chronicle
        .filter((entry) => expectedChronicleOrder.includes(entry.id))
        .map((entry) => entry.id),
      expectedChronicleOrder
    );

    assert.deepEqual(snapshot.playerState.currency, baselineCurrency);
    assert.deepEqual(snapshot.playerState.standing, baselineStanding);
    assert.deepEqual(snapshot.playerState.inventory, baselineInventory);
    const expectedGeneralLoreGain = authority.results
      .filter((entry) => entry.skill.skillId === "skill.knowledge.general_lore")
      .reduce((total, entry) => total + entry.skill.appliedDelta, 0);
    assert.equal(
      snapshot.playerState.skills.find(
        (entry) => entry.id === "skill.knowledge.general_lore"
      )?.rank ?? 0,
      baselineGeneralLoreRank + expectedGeneralLoreGain,
      "General Lore changes only through accepted survey shifts, never an excluded turn-in gain"
    );
    assert.equal(
      authority.consequenceReceipts.some((entry) => /turn_in|reward|payout/i.test(entry.kind)),
      false
    );
    assert.equal(
      snapshot.sessionState.questJournal.some(
        (entry) => entry.id === QUEST_ID && entry.category === "completed"
      ),
      false
    );
  });
});
