import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import { createDefaultCharacterCreationFormState } from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { getDefaultWorldSelection } from "../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts";
import {
  advanceAshenReefSurveyCaller,
  isAshenReefSurveyAdvanceDisabled,
  resolveAshenReefSurveyPanelFacts,
  shouldRetainAshenReefSurveyCallerRequestId
} from "../../apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts";
import { resolvePlayerOriginProfile } from "../../packages/shared/types/src/player-origins.ts";
import { normalizePlayerBodyState } from "../../packages/engines/player-engine/src/body-state.ts";
import {
  initializeTargetCampaignSnapshot,
  isTargetCampaignSnapshot,
  serializeAshenReefSurveyNormalizedIntent
} from "../../packages/engines/game-engine/src/campaign-rules.ts";
import {
  admitCampaignMutation,
  commitPreparedPlayerSurveyCampaignMutation,
  createCampaignSessionControl,
  preparePlayerSurveyCampaignMutation
} from "../../packages/engines/game-engine/src/campaign-session.ts";
import {
  createPlayerSurveyActivityAdvancementCommand,
  executePlayerSurveyActivityAdvancementCommand,
  isAshenReefSurveyActivityAdvancementIntent,
  listPendingPlayerSurveyProjectionRepairs,
  preparePlayerSurveyActivityAdvancementCommand,
  repairPlayerSurveyActivityProjection,
  resolvePlayerSurveyActivityAdvancementPlan,
  resolvePlayerSurveySkillPresentation,
  shouldRetainPlayerSurveyRequestIdentity
} from "../../packages/engines/game-engine/src/player-survey-activity-advancement.ts";

const QUEST_ID = "quest.ashen_reef_survey";
const SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const RUINS_FLAG = "gameplay.quest.ashen_reef_survey.ruins_confirmed";
const DISCOVERY_FLAG = "gameplay.discovery.stormglass_bloom";

let requestOrdinal = 1000;

function nextRequestId() {
  requestOrdinal += 1;
  return `survey_request.00000000-0000-4000-8000-${requestOrdinal
    .toString(16)
    .padStart(12, "0")}`;
}

function reverseObjectKeyOrder(value) {
  if (Array.isArray(value)) return value.map(reverseObjectKeyOrder);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value)
    .reverse()
    .reduce((result, key) => {
      result[key] = reverseObjectKeyOrder(value[key]);
      return result;
    }, {});
}

function prepareSnapshot(stage = 1, { codex = "locked", initialize = true } = {}) {
  const snapshot = structuredClone(demoSnapshot);
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
    (flag) => !flag.startsWith(SECTOR_PREFIX) && flag !== RUINS_FLAG && flag !== DISCOVERY_FLAG
  );
  snapshot.playerState.discoveryChronicle.entries =
    snapshot.playerState.discoveryChronicle.entries.filter(
      (entry) => entry.id !== "discovery.stormglass_bloom"
    );
  for (let sector = 1; sector < stage; sector += 1) {
    snapshot.sessionState.flags.push(`${SECTOR_PREFIX}${sector}`);
  }
  if (codex === "absent") {
    snapshot.sessionState.codexEntries = snapshot.sessionState.codexEntries.filter(
      (entry) => entry.id !== "flora.unknown_bloom"
    );
  }
  return initialize
    ? initializeTargetCampaignSnapshot(snapshot, { source: "developer_fixture" })
    : snapshot;
}

function createControl(snapshot, { atHead = true, revision = 4 } = {}) {
  const identity = snapshot.campaignIdentity;
  return createCampaignSessionControl({
    accountId: snapshot.accountId,
    campaignId: identity.campaignId,
    artifactId: "artifact.survey.source",
    publicationId: "publication.survey.source",
    artifactRevision: revision,
    continuityId: identity.continuityId,
    headArtifactId: atHead ? "artifact.survey.source" : "artifact.survey.head",
    headRevision: atHead ? revision : revision + 1
  });
}

function execute(snapshot, control = createControl(snapshot), requestId = nextRequestId(), options = {}) {
  const command = createPlayerSurveyActivityAdvancementCommand(snapshot, control, requestId);
  const result = executePlayerSurveyActivityAdvancementCommand(snapshot, control, command, options);
  return { command, result };
}

function createFreshCharacterSurveyFinalSource() {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  const backstoryId = "backstory.local";
  const world = getDefaultWorldSelection(backstoryId);
  const form = {
    ...createDefaultCharacterCreationFormState("slot-survey-fresh"),
    playerName: "Fresh Surveyor",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId,
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId
  };
  const snapshot = createNewGameSnapshot(form, "account.fresh_survey");
  const surveyQuest = structuredClone(
    demoSnapshot.sessionState.questJournal.find((entry) => entry.id === QUEST_ID)
  );
  snapshot.sessionState.questJournal = [
    ...snapshot.sessionState.questJournal.filter((entry) => entry.id !== QUEST_ID),
    { ...surveyQuest, category: "active", tracked: true }
  ];
  snapshot.sessionState.trackedQuestId = QUEST_ID;
  snapshot.sessionState.currentActivity = {
    id: "activity.survey.ashen_reef",
    label: "Ashen Reef Survey",
    category: "Contract"
  };
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.starfall_port",
    siteLabel: "Ashen Reef"
  };
  snapshot.sessionState.flags.push(
    `${SECTOR_PREFIX}1`,
    `${SECTOR_PREFIX}2`,
    `${SECTOR_PREFIX}3`
  );
  return snapshot;
}

function assertIdentityStableRejection(snapshot, control, result, code) {
  assert.equal(result.accepted, false);
  assert.equal(result.duplicate, false);
  assert.equal(result.code, code);
  assert.equal(result.snapshot, snapshot);
  assert.equal(result.control, control);
  assert.equal(snapshot.authorityLedger.ashenReefSurvey.requests.length, 0);
}

test("one pure plan drives complete preview and accepted execution for all four stages", () => {
  for (let stage = 1; stage <= 4; stage += 1) {
    const snapshot = prepareSnapshot(stage);
    const control = createControl(snapshot);
    const plan = resolvePlayerSurveyActivityAdvancementPlan(snapshot);
    assert.equal(plan.accepted, true);
    const { result } = execute(snapshot, control);
    assert.equal(result.accepted, true);
    assert.equal(result.result.stage, plan.stage);
    assert.equal(result.result.appliedTick, snapshot.clock.tick + plan.tickCount);
    assert.deepEqual(result.snapshot.playerState.bodyState, plan.projectedBodyState);
    assert.deepEqual(result.snapshot.playerState.resources, plan.projectedResources);
    assert.deepEqual(result.result.resourceCosts, plan.resourceCosts);
    assert.deepEqual(result.result.nonProposals, plan.nonProposals);
    assert.deepEqual(plan.nonProposals, {
      geographicKnowledge: "no_proposal",
      knownLocationAuthority: "no_proposal",
      mapAuthority: "no_proposal",
      travelAccess: "no_proposal",
      currency: "no_proposal",
      standing: "no_proposal",
      inventory: "no_proposal",
      reputationBeyondOrdinarySynchronization: "no_proposal",
      turnInRewards: "no_proposal"
    });
    assert.deepEqual(result.receipts.find((entry) => entry.kind === "body_advance").effect.profile, plan.metabolicProfile);
    assert.deepEqual(result.receipts.find((entry) => entry.kind === "attribute_load").effect.profile, plan.attributeLoadProfile);
    assert.deepEqual(result.result.skill, plan.skill);
    assert.deepEqual(result.result.materialBefore, plan.materialBefore);
    assert.deepEqual(result.result.materialAfter, plan.materialAfter);
    assert.deepEqual(result.result.operation, plan.operation);
    assert.deepEqual(result.result.notice, plan.notice);
    assert.deepEqual(
      { ...result.receipts.find((entry) => entry.kind === "notification_projection").effect.row, id: "notification.survey.preview" },
      plan.notification
    );
    assert.deepEqual(
      { ...result.receipts.find((entry) => entry.kind === "chronicle_projection").effect.row, id: "chronicle.survey.preview" },
      plan.chronicle
    );
    assert.equal(plan.eventFacts.atTick, result.result.appliedTick);
    assert.equal(plan.eventFacts.resultCode, result.result.code);
    assert.equal(result.result.projectionIds.event.startsWith("event.player.activity.survey."), true);
    assert.equal(result.result.projectionIds.notification.startsWith("notification.survey."), true);
    assert.equal(result.result.projectionIds.chronicle.startsWith("chronicle.survey."), true);
    assert.equal(isTargetCampaignSnapshot(result.snapshot), true);
  }
});

test("command rejects malformed identity and wrong account/player/campaign/control without mutation", () => {
  const snapshot = prepareSnapshot();
  const control = createControl(snapshot);
  const valid = createPlayerSurveyActivityAdvancementCommand(snapshot, control, nextRequestId());

  assertIdentityStableRejection(
    snapshot,
    control,
    executePlayerSurveyActivityAdvancementCommand(snapshot, control, {}),
    "malformed_command"
  );

  for (const [field, value, code] of [
    ["accountId", "account.other", "wrong_account"],
    ["characterId", "character.other", "wrong_player"],
    ["campaignId", "campaign.other", "wrong_campaign"]
  ]) {
    const command = structuredClone(valid);
    command.normalizedIntent[field] = value;
    command.canonicalIntent = serializeAshenReefSurveyNormalizedIntent(command.normalizedIntent);
    const result = executePlayerSurveyActivityAdvancementCommand(snapshot, control, command);
    assertIdentityStableRejection(snapshot, control, result, code);
  }

  const wrongControl = { ...control, campaignId: "campaign.other" };
  const result = executePlayerSurveyActivityAdvancementCommand(snapshot, wrongControl, valid);
  assert.equal(result.code, "wrong_control");
  assert.equal(result.snapshot, snapshot);
});

test("artifact, publication, revision, tick, and continuity mismatches are distinct transient rejections", () => {
  const snapshot = prepareSnapshot();
  const control = createControl(snapshot);
  const command = createPlayerSurveyActivityAdvancementCommand(snapshot, control, nextRequestId());
  const cases = [
    [{ ...control, loadedArtifactId: "artifact.other" }, snapshot, "wrong_artifact"],
    [{ ...control, loadedPublicationId: "publication.other" }, snapshot, "wrong_publication"],
    [{ ...control, sessionRevision: control.sessionRevision + 1 }, snapshot, "stale_revision"],
    [control, { ...snapshot, capturedAtTick: snapshot.capturedAtTick + 1 }, "stale_snapshot"],
    [control, {
      ...snapshot,
      campaignIdentity: { ...snapshot.campaignIdentity, continuityId: "continuity.other" }
    }, "wrong_control"]
  ];
  for (const [caseControl, caseSnapshot, code] of cases) {
    const result = executePlayerSurveyActivityAdvancementCommand(caseSnapshot, caseControl, command);
    assert.equal(result.accepted, false);
    assert.equal(result.code, code);
    assert.equal(result.snapshot, caseSnapshot);
    assert.equal(shouldRetainPlayerSurveyRequestIdentity(result), false);
  }
});

test("normalized intent certifies every bounded owner input consumed by the shift", () => {
  const source = prepareSnapshot();
  const control = createControl(source);
  const command = createPlayerSurveyActivityAdvancementCommand(source, control, nextRequestId());
  const mutations = [
    (snapshot) => {
      snapshot.playerState.bodyState.fatigue += 1;
      snapshot.playerState.bodyState = normalizePlayerBodyState(
        snapshot.playerState.bodyState,
        {
          tick: snapshot.playerState.bodyState.lastAdvancedTick,
          day: snapshot.playerState.bodyState.lastDailyRolloverDay,
          lineageId: snapshot.playerState.coreData.lineageId,
          runDifficulty: snapshot.gameState.runDifficulty
        }
      );
    },
    (snapshot) => { snapshot.playerState.resources.stamina.current -= 1; },
    (snapshot) => { snapshot.playerState.resourceRuntime.history.reverse(); },
    (snapshot) => { snapshot.playerState.attributes.AGI += 1; },
    (snapshot) => { snapshot.playerState.statGrowth.load.AGI += 0.25; },
    (snapshot) => {
      snapshot.playerState.skills = snapshot.playerState.skills.map((entry) =>
        entry.id === "skill.knowledge.general_lore" ? { ...entry, rank: entry.rank + 1 } : entry
      );
    },
    (snapshot) => {
      snapshot.playerState.skills = snapshot.playerState.skills.map((entry, index) =>
        index === 0 && entry.id !== "skill.knowledge.general_lore" && entry.id !== "skill.resource.identify.flora"
          ? { ...entry, rank: entry.rank + 1 }
          : entry
      );
    },
    (snapshot) => {
      snapshot.playerState.progression.legacyGrowth.resourceGrowthLevel += 1;
      snapshot.playerState.originProfile = resolvePlayerOriginProfile(
        {
          lineageId: snapshot.playerState.originProfile.lineageId,
          classId: snapshot.playerState.originProfile.classId,
          sexId: snapshot.playerState.originProfile.sexId
        },
        snapshot.playerState.progression
      );
    },
    (snapshot) => {
      snapshot.playerState.reputation.fame[0].earned += 1;
      snapshot.playerState.reputation.fame[0].historical += 1;
    },
    (snapshot) => { snapshot.playerState.saveMeta.lastReputationDecayDay = 0; },
    (snapshot) => {
      snapshot.gameState.runDifficulty = { tier: "easy", hardcore: false };
      snapshot.playerState.bodyState = normalizePlayerBodyState(
        snapshot.playerState.bodyState,
        {
          tick: snapshot.playerState.bodyState.lastAdvancedTick,
          day: snapshot.playerState.bodyState.lastDailyRolloverDay,
          lineageId: snapshot.playerState.coreData.lineageId,
          runDifficulty: snapshot.gameState.runDifficulty
        }
      );
    },
    (snapshot) => {
      snapshot.playerState.coreData.lineageId = "lineage.elf";
      snapshot.playerState.originProfile = resolvePlayerOriginProfile(
        {
          lineageId: snapshot.playerState.coreData.lineageId,
          classId: snapshot.playerState.originProfile.classId,
          sexId: snapshot.playerState.originProfile.sexId
        },
        snapshot.playerState.progression
      );
      snapshot.playerState.bodyState = normalizePlayerBodyState(
        snapshot.playerState.bodyState,
        {
          tick: snapshot.playerState.bodyState.lastAdvancedTick,
          day: snapshot.playerState.bodyState.lastDailyRolloverDay,
          lineageId: snapshot.playerState.coreData.lineageId,
          runDifficulty: snapshot.gameState.runDifficulty
        }
      );
    }
  ];
  for (const [mutationIndex, mutate] of mutations.entries()) {
    const changed = structuredClone(source);
    mutate(changed);
    const rejected = executePlayerSurveyActivityAdvancementCommand(changed, control, command);
    assert.equal(rejected.code, "stale_snapshot", `owner-input mutation ${mutationIndex}`);
    assert.equal(rejected.snapshot, changed);
  }

  const untracked = structuredClone(source);
  untracked.sessionState.questJournal = untracked.sessionState.questJournal.map((entry) =>
    entry.id === QUEST_ID ? { ...entry, tracked: false } : entry
  );
  assert.equal(
    executePlayerSurveyActivityAdvancementCommand(untracked, control, command).code,
    "survey_quest_untracked"
  );

  const accepted = executePlayerSurveyActivityAdvancementCommand(source, control, command);
  for (const mutate of [
    (intent) => {
      intent.ownerInputs.bodyState.fatigue += 1;
      intent.ownerInputs.bodyState = normalizePlayerBodyState(
        intent.ownerInputs.bodyState,
        {
          tick: intent.ownerInputs.bodyState.lastAdvancedTick,
          day: intent.ownerInputs.bodyState.lastDailyRolloverDay,
          lineageId: intent.ownerInputs.lineageId,
          runDifficulty: intent.ownerInputs.runDifficulty
        }
      );
    },
    (intent) => {
      intent.ownerInputs.progression.legacyGrowth.resourceGrowthLevel += 1;
      intent.ownerInputs.originProfile = resolvePlayerOriginProfile(
        {
          lineageId: intent.ownerInputs.lineageId,
          classId: intent.ownerInputs.originProfile.classId,
          sexId: intent.ownerInputs.originProfile.sexId
        },
        intent.ownerInputs.progression
      );
    },
    (intent) => { intent.ownerInputs.reputation.fame[0].earned += 1; }
  ]) {
    const conflictingOwnerInput = structuredClone(command);
    mutate(conflictingOwnerInput.normalizedIntent);
    conflictingOwnerInput.canonicalIntent = serializeAshenReefSurveyNormalizedIntent(
      conflictingOwnerInput.normalizedIntent
    );
    assert.equal(
      executePlayerSurveyActivityAdvancementCommand(
        accepted.snapshot,
        accepted.control,
        conflictingOwnerInput
      ).code,
      "conflicting_retry"
    );
  }
});

test("normalized intent is recursively canonical while malformed deep owner inputs fail closed", () => {
  const source = prepareSnapshot();
  const control = createControl(source);
  const command = createPlayerSurveyActivityAdvancementCommand(source, control, nextRequestId());
  const reordered = {
    ...command,
    normalizedIntent: reverseObjectKeyOrder(command.normalizedIntent)
  };
  assert.equal(
    serializeAshenReefSurveyNormalizedIntent(reordered.normalizedIntent),
    command.canonicalIntent
  );
  const accepted = executePlayerSurveyActivityAdvancementCommand(source, control, reordered);
  assert.equal(accepted.accepted, true, accepted.notice.detail);
  const reorderedRetry = {
    ...command,
    normalizedIntent: reverseObjectKeyOrder(command.normalizedIntent)
  };
  const durableDuplicate = executePlayerSurveyActivityAdvancementCommand(
    structuredClone(accepted.snapshot),
    structuredClone(accepted.control),
    reorderedRetry
  );
  assert.equal(durableDuplicate.code, "duplicate");
  assert.equal(durableDuplicate.duplicate, true);

  for (const mutate of [
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression = {}; },
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression = []; },
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression = null; },
    (snapshot) => { delete snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression.legacyGrowth; },
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.reputation = {}; },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.resourceRuntime.lastBreakdown = {};
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression.unexpected = undefined;
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.stormglassDiscovery = Number.NaN;
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.originProfile.lineageLabel = "Fabricated Lineage";
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression.echo.balanceRuleId = "rule.fabricated_echo";
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression.echo.diversityBonus = 0;
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.progression.legacyGrowth.resourceGrowthLevel = 0;
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.reputation.fame.reverse();
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.requests[0].normalizedIntent.ownerInputs.reputation.notoriety.push({
        scope: "local",
        scopeId: "settlement.aurelis",
        categoryId: "theft",
        severity: "minor",
        modifiers: ["organized", "mass"],
        modifiersSignature: "organized|mass",
        earned: 2,
        currentEarned: 2,
        historical: 2,
        lastMeaningfulGainTick: null,
        repeatCount: 1
      });
    }
  ]) {
    const corrupted = structuredClone(accepted.snapshot);
    mutate(corrupted);
    const retained = corrupted.authorityLedger.ashenReefSurvey.requests[0];
    assert.throws(() => serializeAshenReefSurveyNormalizedIntent(retained.normalizedIntent));
    assert.doesNotThrow(() => isTargetCampaignSnapshot(corrupted));
    assert.equal(isTargetCampaignSnapshot(corrupted), false);
  }

  for (const mutate of [
    (intent) => { intent.ownerInputs.progression.unexpected = undefined; },
    (intent) => { intent.ownerInputs.stormglassDiscovery = Number.NaN; }
  ]) {
    const collidingRetry = structuredClone(command);
    mutate(collidingRetry.normalizedIntent);
    assert.equal(collidingRetry.canonicalIntent, command.canonicalIntent);
    assert.equal(
      executePlayerSurveyActivityAdvancementCommand(
        accepted.snapshot,
        accepted.control,
        collidingRetry
      ).code,
      "malformed_command"
    );
  }
});

test("command preparation classifies terminal, technical-retry, and unclassified outcomes", () => {
  const source = prepareSnapshot();
  const control = createControl(source);

  const wrongLocation = structuredClone(source);
  wrongLocation.playerState.location = {
    ...wrongLocation.playerState.location,
    settlementId: "settlement.aurelis",
    siteLabel: "Harbor Quarter"
  };
  const expected = preparePlayerSurveyActivityAdvancementCommand(
    wrongLocation,
    control,
    nextRequestId()
  );
  assert.equal(expected.kind, "expected_rejection");
  assert.equal(expected.code, "survey_wrong_location");

  const invalidResources = structuredClone(source);
  invalidResources.playerState.resources = null;
  const invalidAuthority = preparePlayerSurveyActivityAdvancementCommand(
    invalidResources,
    control,
    nextRequestId()
  );
  assert.equal(invalidAuthority.kind, "expected_rejection");
  assert.equal(invalidAuthority.code, "invalid_authority");

  const missingIdentity = structuredClone(source);
  delete missingIdentity.campaignIdentity;
  const invalidIdentity = preparePlayerSurveyActivityAdvancementCommand(
    missingIdentity,
    control,
    nextRequestId()
  );
  assert.equal(invalidIdentity.kind, "expected_rejection");
  assert.equal(invalidIdentity.code, "invalid_authority");

  const thrownSource = new Proxy(source, {
    get(target, property, receiver) {
      if (property === "authorityLedger") throw new Error("Injected preparation access failure.");
      return Reflect.get(target, property, receiver);
    }
  });
  const unclassified = preparePlayerSurveyActivityAdvancementCommand(
    thrownSource,
    control,
    nextRequestId()
  );
  assert.equal(unclassified.kind, "unclassified_failure");

  const cryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    enumerable: true,
    value: undefined
  });
  try {
    const unavailableIdentity = preparePlayerSurveyActivityAdvancementCommand(
      source,
      control
    );
    assert.equal(unavailableIdentity.kind, "unclassified_failure");
  } finally {
    Object.defineProperty(globalThis, "crypto", cryptoDescriptor);
  }

  const transientSource = structuredClone(source);
  const stableResources = structuredClone(transientSource.playerState.resources);
  let resourceReads = 0;
  Object.defineProperty(transientSource.playerState, "resources", {
    configurable: true,
    enumerable: true,
    get() {
      resourceReads += 1;
      if (resourceReads === 1) throw new Error("Injected transient plan failure.");
      return stableResources;
    }
  });
  const technical = preparePlayerSurveyActivityAdvancementCommand(
    transientSource,
    control,
    nextRequestId()
  );
  assert.equal(technical.kind, "technical_retry");
  assert.equal(technical.code, "transition_failed");

  const accepted = execute(source, control).result;
  const unavailableRetry = structuredClone(accepted.snapshot);
  unavailableRetry.sessionState.questJournal = unavailableRetry.sessionState.questJournal.filter(
    (entry) => entry.id !== QUEST_ID
  );
  const retained = preparePlayerSurveyActivityAdvancementCommand(
    unavailableRetry,
    accepted.control,
    accepted.result.requestId
  );
  assert.equal(retained.kind, "prepared");
  assert.equal(retained.command.requestId, accepted.result.requestId);
});

test("production caller keeps only technical retries and exposes accepted state only after acceptance", () => {
  const source = prepareSnapshot();
  const control = createControl(source);
  const requestId = nextRequestId();
  const cache = new Map();

  const wrongLocation = structuredClone(source);
  wrongLocation.playerState.location = {
    ...wrongLocation.playerState.location,
    settlementId: "settlement.aurelis",
    siteLabel: "Harbor Quarter"
  };
  const expected = advanceAshenReefSurveyCaller(
    wrongLocation,
    control,
    requestId,
    cache
  );
  assert.equal(expected.outcome.kind, "expected_rejection");
  assert.equal(shouldRetainAshenReefSurveyCallerRequestId(expected.outcome), false);
  assert.equal(expected.acceptedState, null);
  assert.equal(cache.has(requestId), false);

  const invalidResources = structuredClone(source);
  invalidResources.playerState.resources = null;
  const invalidAuthority = advanceAshenReefSurveyCaller(
    invalidResources,
    control,
    requestId,
    cache
  );
  assert.equal(invalidAuthority.outcome.kind, "expected_rejection");
  assert.equal(invalidAuthority.outcome.notice.title, "Survey not advanced");
  assert.equal(shouldRetainAshenReefSurveyCallerRequestId(invalidAuthority.outcome), false);
  assert.equal(invalidAuthority.acceptedState, null);
  assert.equal(cache.has(requestId), false);

  const thrownSource = new Proxy(source, {
    get(target, property, receiver) {
      if (property === "authorityLedger") throw new Error("Injected caller preparation failure.");
      return Reflect.get(target, property, receiver);
    }
  });
  const unclassified = advanceAshenReefSurveyCaller(
    thrownSource,
    control,
    requestId,
    cache
  );
  assert.equal(unclassified.outcome.kind, "unclassified_failure");
  assert.equal(shouldRetainAshenReefSurveyCallerRequestId(unclassified.outcome), false);
  assert.equal(unclassified.acceptedState, null);
  assert.equal(cache.has(requestId), false);

  const transientSource = structuredClone(source);
  const stableResources = structuredClone(transientSource.playerState.resources);
  let resourceReads = 0;
  Object.defineProperty(transientSource.playerState, "resources", {
    configurable: true,
    enumerable: true,
    get() {
      resourceReads += 1;
      if (resourceReads === 1) throw new Error("Injected transient caller failure.");
      return stableResources;
    }
  });
  const technical = advanceAshenReefSurveyCaller(
    transientSource,
    control,
    requestId,
    cache
  );
  assert.equal(technical.outcome.kind, "technical_retry");
  assert.equal(shouldRetainAshenReefSurveyCallerRequestId(technical.outcome), true);
  assert.equal(technical.acceptedState, null);
  assert.equal(cache.has(requestId), false);

  const accepted = advanceAshenReefSurveyCaller(source, control, requestId, cache);
  assert.equal(accepted.outcome.kind, "accepted");
  assert.equal(shouldRetainAshenReefSurveyCallerRequestId(accepted.outcome), false);
  assert.notEqual(accepted.acceptedState, null);
  assert.equal(cache.has(requestId), false);

  const duplicate = advanceAshenReefSurveyCaller(
    accepted.acceptedState.snapshot,
    accepted.acceptedState.control,
    requestId,
    cache
  );
  assert.equal(duplicate.outcome.kind, "terminal_result");
  assert.equal(shouldRetainAshenReefSurveyCallerRequestId(duplicate.outcome), false);
  assert.equal(duplicate.outcome.result.code, "duplicate");
  assert.equal(duplicate.acceptedState, null);
  assert.equal(cache.has(requestId), false);
});

test("month thirteen is valid survey clock authority", () => {
  const source = prepareSnapshot();
  source.clock = { ...source.clock, month: 13, season: "Thaw" };
  const plan = resolvePlayerSurveyActivityAdvancementPlan(source);
  assert.equal(plan.accepted, true);
  const accepted = execute(source).result;
  assert.equal(accepted.accepted, true, accepted.notice.detail);
  assert.equal(accepted.result.startTick, source.clock.tick);
  assert.equal(isTargetCampaignSnapshot(accepted.snapshot), true);
});

test("survey skill presentation distinguishes applied, blocked, and unchanged", () => {
  assert.deepEqual(
    resolvePlayerSurveySkillPresentation({ appliedDelta: 1, blockedGate: null }),
    { status: "applied", detail: "+1" }
  );
  assert.deepEqual(
    resolvePlayerSurveySkillPresentation({ appliedDelta: 0, blockedGate: 30 }),
    { status: "blocked_at_gate", detail: "blocked at breakthrough gate 30" }
  );
  assert.deepEqual(
    resolvePlayerSurveySkillPresentation({ appliedDelta: 0, blockedGate: null }),
    { status: "unchanged", detail: "unchanged" }
  );

  const positivePlan = resolvePlayerSurveyActivityAdvancementPlan(prepareSnapshot());
  assert.equal(positivePlan.accepted, true);
  assert.equal(positivePlan.skill.appliedDelta, 1);
  assert.equal(resolveAshenReefSurveyPanelFacts(positivePlan).skillDetail, "+1");

  const gateBlocked = prepareSnapshot();
  gateBlocked.playerState.skills = gateBlocked.playerState.skills.map((skill) =>
    skill.id === "skill.knowledge.general_lore"
      ? {
          ...skill,
          rank: 30,
          progression: {
            progressionTrackId: "progression.knowledge",
            currentBandId: "clumsy",
            unlockedBandIds: ["clumsy"],
            breakthroughProgress: 0,
            lastBreakthroughRank: null
          }
        }
      : skill
  );
  const blockedPlan = resolvePlayerSurveyActivityAdvancementPlan(gateBlocked);
  assert.equal(blockedPlan.accepted, true);
  assert.equal(blockedPlan.skill.appliedDelta, 0);
  assert.equal(blockedPlan.skill.blockedGate, 30);
  assert.equal(
    resolveAshenReefSurveyPanelFacts(blockedPlan).skillDetail,
    "blocked at breakthrough gate 30"
  );

  const maxRank = prepareSnapshot();
  maxRank.playerState.skills = maxRank.playerState.skills.map((skill) =>
    skill.id === "skill.knowledge.general_lore"
      ? {
          ...skill,
          rank: 125,
          progression: {
            progressionTrackId: "progression.knowledge",
            currentBandId: "mastery",
            unlockedBandIds: ["clumsy", "familiar", "proficient", "skilled", "mastery"],
            breakthroughProgress: 0,
            lastBreakthroughRank: 120
          }
        }
      : skill
  );
  const plan = resolvePlayerSurveyActivityAdvancementPlan(maxRank);
  assert.equal(plan.accepted, true);
  assert.equal(isAshenReefSurveyAdvanceDisabled(plan), false);
  assert.equal(plan.skill.appliedDelta, 0);
  assert.equal(plan.skill.blockedGate, null);
  assert.equal(resolvePlayerSurveySkillPresentation(plan.skill).status, "unchanged");
  assert.deepEqual(resolveAshenReefSurveyPanelFacts(plan), {
    stageLabel: "sector 1",
    staminaCost: 10,
    mpCost: 3,
    skillId: "skill.knowledge.general_lore",
    skillDetail: "unchanged",
    operationProgress: 25
  });
});

test("survey non-proposals are required persisted authority and unavailable plans propose nothing", () => {
  const unavailable = prepareSnapshot();
  unavailable.playerState.location = {
    ...unavailable.playerState.location,
    settlementId: "settlement.aurelis",
    siteLabel: "Harbor Quarter"
  };
  const rejectedPlan = resolvePlayerSurveyActivityAdvancementPlan(unavailable);
  assert.equal(rejectedPlan.accepted, false);
  assert.equal(isAshenReefSurveyAdvanceDisabled(rejectedPlan), true);
  assert.equal(resolveAshenReefSurveyPanelFacts(rejectedPlan), null);
  assert.equal(rejectedPlan.nonProposals, null);

  const accepted = execute(prepareSnapshot()).result;
  const corrupted = structuredClone(accepted.snapshot);
  corrupted.authorityLedger.ashenReefSurvey.results[0].nonProposals.mapAuthority = "proposed";
  assert.equal(isTargetCampaignSnapshot(corrupted), false);

  const missing = structuredClone(accepted.snapshot);
  delete missing.authorityLedger.ashenReefSurvey.results[0].nonProposals;
  assert.equal(isTargetCampaignSnapshot(missing), false);
});

test("quest, location, progress, completion, discovery, and activity rejections are fail-closed", () => {
  const base = prepareSnapshot();
  const baseControl = createControl(base);
  const command = createPlayerSurveyActivityAdvancementCommand(base, baseControl, nextRequestId());
  const cases = [];

  const missing = structuredClone(base);
  missing.sessionState.questJournal = missing.sessionState.questJournal.filter((entry) => entry.id !== QUEST_ID);
  cases.push([missing, "survey_quest_missing"]);
  const inactive = structuredClone(base);
  inactive.sessionState.questJournal = inactive.sessionState.questJournal.map((entry) =>
    entry.id === QUEST_ID ? { ...entry, category: "contracts" } : entry
  );
  cases.push([inactive, "survey_quest_inactive"]);
  const untracked = structuredClone(base);
  untracked.sessionState.trackedQuestId = null;
  cases.push([untracked, "survey_quest_untracked"]);
  const wrongLocation = structuredClone(base);
  wrongLocation.playerState.location = {
    ...wrongLocation.playerState.location,
    settlementId: "settlement.aurelis",
    siteLabel: "Harbor Quarter"
  };
  cases.push([wrongLocation, "survey_wrong_location"]);
  const missingActivity = structuredClone(base);
  missingActivity.sessionState.currentActivity = null;
  cases.push([missingActivity, "survey_activity_missing"]);
  const noncontiguous = structuredClone(base);
  noncontiguous.sessionState.flags.push(`${SECTOR_PREFIX}2`);
  cases.push([noncontiguous, "survey_progress_incoherent"]);
  const unknown = structuredClone(base);
  unknown.sessionState.flags.push(`${SECTOR_PREFIX}9`);
  cases.push([unknown, "survey_progress_incoherent"]);
  const ruinsEarly = structuredClone(base);
  ruinsEarly.sessionState.flags.push(RUINS_FLAG);
  cases.push([ruinsEarly, "survey_progress_incoherent"]);
  const duplicatedRuins = structuredClone(base);
  duplicatedRuins.sessionState.flags.push(RUINS_FLAG, RUINS_FLAG);
  cases.push([duplicatedRuins, "survey_progress_incoherent"]);
  const complete = structuredClone(base);
  complete.sessionState.flags.push(
    `${SECTOR_PREFIX}1`,
    `${SECTOR_PREFIX}2`,
    `${SECTOR_PREFIX}3`,
    RUINS_FLAG,
    DISCOVERY_FLAG
  );
  complete.playerState.discoveryChronicle.entries.unshift({
    id: "discovery.stormglass_bloom",
    codexEntryId: "flora.unknown_bloom",
    category: "flora",
    title: "Stormglass Bloom",
    discoveredAtTick: complete.clock.tick,
    discoveredAtLabel: "Day 1, Dawn Watch",
    regionLabel: "Glasswater",
    sourceType: "survey",
    sourceId: QUEST_ID,
    notes: []
  });
  cases.push([complete, "survey_already_complete"]);
  const entryOnly = structuredClone(base);
  entryOnly.playerState.discoveryChronicle.entries.unshift({
    id: "discovery.stormglass_bloom",
    codexEntryId: "flora.unknown_bloom",
    category: "flora",
    title: "Stormglass Bloom",
    discoveredAtTick: entryOnly.clock.tick,
    discoveredAtLabel: "Day 1, Dawn Watch",
    regionLabel: "Glasswater",
    sourceType: "survey",
    sourceId: QUEST_ID,
    notes: []
  });
  cases.push([entryOnly, "survey_discovery_incoherent"]);
  const flagOnly = structuredClone(base);
  flagOnly.sessionState.flags.push(DISCOVERY_FLAG);
  cases.push([flagOnly, "survey_discovery_incoherent"]);
  const duplicatedDiscoveryFlag = structuredClone(base);
  duplicatedDiscoveryFlag.sessionState.flags.push(DISCOVERY_FLAG, DISCOVERY_FLAG);
  cases.push([duplicatedDiscoveryFlag, "survey_discovery_incoherent"]);
  const conflicting = structuredClone(base);
  conflicting.sessionState.flags.push(DISCOVERY_FLAG);
  conflicting.playerState.discoveryChronicle.entries.unshift({
    id: "discovery.stormglass_bloom",
    codexEntryId: "flora.wrong",
    category: "flora",
    title: "Stormglass Bloom",
    discoveredAtTick: conflicting.clock.tick,
    discoveredAtLabel: "Day 1, Dawn Watch",
    regionLabel: "Glasswater",
    sourceType: "survey",
    sourceId: QUEST_ID,
    notes: []
  });
  cases.push([conflicting, "survey_discovery_incoherent"]);

  for (const [snapshot, code] of cases) {
    const control = createControl(snapshot);
    const result = executePlayerSurveyActivityAdvancementCommand(snapshot, control, command);
    assert.equal(result.accepted, false, code);
    assert.equal(result.code, code);
    assert.equal(result.snapshot, snapshot);
    assert.equal(snapshot.authorityLedger.ashenReefSurvey.requests.length, 0);
  }

  const completeUntracked = structuredClone(complete);
  completeUntracked.sessionState.trackedQuestId = null;
  completeUntracked.sessionState.questJournal = completeUntracked.sessionState.questJournal.map((entry) =>
    entry.id === QUEST_ID ? { ...entry, tracked: false } : entry
  );
  completeUntracked.sessionState.currentActivity = {
    id: "activity.return.survey_packet",
    label: "Returning Chart Packet",
    category: "Contract"
  };
  assert.equal(isAshenReefSurveyActivityAdvancementIntent(completeUntracked), true);
  assert.equal(
    resolvePlayerSurveyActivityAdvancementPlan(completeUntracked).code,
    "survey_already_complete"
  );
});

test("durable exact duplicates never repeat effects or roll back a later authoritative snapshot", () => {
  const source = prepareSnapshot();
  const control = createControl(source);
  const requestId = nextRequestId();
  const { command, result: accepted } = execute(source, control, requestId);
  assert.equal(accepted.accepted, true);

  const sameProcess = executePlayerSurveyActivityAdvancementCommand(
    accepted.snapshot,
    accepted.control,
    command
  );
  assert.equal(sameProcess.duplicate, true);
  assert.equal(sameProcess.snapshot, accepted.snapshot);
  assert.equal(sameProcess.emittedEvents.length, 0);

  const later = structuredClone(accepted.snapshot);
  later.playerState.currency.gold += 77;
  const laterDuplicate = executePlayerSurveyActivityAdvancementCommand(later, accepted.control, command);
  assert.equal(laterDuplicate.duplicate, true);
  assert.equal(laterDuplicate.snapshot, later);
  assert.equal(laterDuplicate.snapshot.playerState.currency.gold, accepted.snapshot.playerState.currency.gold + 77);

  const rebuilt = createPlayerSurveyActivityAdvancementCommand(later, accepted.control, requestId);
  assert.deepEqual(rebuilt, command);
  assert.equal(
    executePlayerSurveyActivityAdvancementCommand(later, accepted.control, rebuilt).duplicate,
    true
  );

  const restartControl = createCampaignSessionControl({
    accountId: accepted.snapshot.accountId,
    campaignId: accepted.snapshot.campaignIdentity.campaignId,
    artifactId: "artifact.published.accepted",
    publicationId: "publication.published.accepted",
    artifactRevision: 5,
    continuityId: accepted.snapshot.campaignIdentity.continuityId,
    headArtifactId: "artifact.published.accepted",
    headRevision: 5
  });
  assert.equal(
    executePlayerSurveyActivityAdvancementCommand(accepted.snapshot, restartControl, command).duplicate,
    true
  );

  const conflict = structuredClone(command);
  conflict.normalizedIntent.sourceArtifactId = "artifact.survey.conflicting";
  conflict.canonicalIntent = serializeAshenReefSurveyNormalizedIntent(conflict.normalizedIntent);
  const conflicting = executePlayerSurveyActivityAdvancementCommand(
    accepted.snapshot,
    accepted.control,
    conflict
  );
  assert.equal(conflicting.code, "conflicting_retry");
  assert.equal(conflicting.snapshot, accepted.snapshot);
});

test("missing, duplicated, orphaned, and reordered accepted evidence is quarantined", () => {
  const { result: accepted, command } = execute(prepareSnapshot());
  const mutations = [
    (snapshot) => snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.pop(),
    (snapshot) => snapshot.authorityLedger.ashenReefSurvey.requests.push(
      structuredClone(snapshot.authorityLedger.ashenReefSurvey.requests[0])
    ),
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.occurrences[0].requestId = nextRequestId(); },
    (snapshot) => snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.reverse(),
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts[0].effect = {}; },
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.results[0].appliedTick = Number.POSITIVE_INFINITY; },
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.results[0].resourceCosts = null; },
    (snapshot) => { snapshot.authorityLedger.ashenReefSurvey.requests[0] = null; },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.find(
        (entry) => entry.kind === "resource_cost"
      ).effect.after.stamina.current += 1;
    },
    (snapshot) => {
      snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.find(
        (entry) => entry.kind === "notification_projection"
      ).effect.row.title = "Tampered retained projection";
    },
    (snapshot) => {
      const result = snapshot.authorityLedger.ashenReefSurvey.results[0];
      result.materialAfter.discoveryEntryState = "matching";
      result.materialAfter.discoveryFlagPresent = true;
      snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.find(
        (entry) => entry.kind === "survey_progress"
      ).effect.after = structuredClone(result.materialAfter);
    },
    (snapshot) => {
      const orphanContinuityId = "continuity.00000000-0000-4000-8000-00000000dead";
      snapshot.authorityLedger.entries.push({
        entryId: "continuity_fork.00000000-0000-4000-8000-00000000dead",
        kind: "continuity_fork",
        sourceId: "mutation.orphan",
        acceptedAtTick: snapshot.clock.tick,
        parentContinuityId: "continuity.00000000-0000-4000-8000-00000000beef",
        childContinuityId: orphanContinuityId,
        forkedFromArtifactId: "artifact.orphan",
        forkedFromPublicationId: "publication.orphan"
      });
      const authority = snapshot.authorityLedger.ashenReefSurvey;
      authority.requests[0].acceptedContinuityId = orphanContinuityId;
      authority.occurrences[0].continuityId = orphanContinuityId;
      authority.results[0].continuityId = orphanContinuityId;
      authority.consequenceReceipts.forEach((entry) => { entry.continuityId = orphanContinuityId; });
    },
    (snapshot) => snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.push({
      version: 1,
      repairId: "survey_projection_repair.00000000-0000-4000-8000-000000000001.notification.1",
      requestId: snapshot.authorityLedger.ashenReefSurvey.requests[0].requestId,
      resultId: "survey_result.orphan",
      receiptId: snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts[0].receiptId,
      campaignId: snapshot.campaignIdentity.campaignId,
      continuityId: snapshot.campaignIdentity.continuityId,
      characterId: snapshot.campaignIdentity.characterId,
      projectionKind: "notification",
      ordinal: 1,
      observed: "missing",
      outcome: "inserted",
      appliedTick: snapshot.clock.tick
    })
  ];
  for (const mutate of mutations) {
    const corrupted = structuredClone(accepted.snapshot);
    mutate(corrupted);
    assert.doesNotThrow(() => isTargetCampaignSnapshot(corrupted));
    assert.equal(isTargetCampaignSnapshot(corrupted), false);
    const result = executePlayerSurveyActivityAdvancementCommand(corrupted, accepted.control, command);
    assert.equal(result.code, "invalid_authority");
    assert.equal(result.snapshot, corrupted);
  }
});

test("non-head preparation binds every record to one child and later survey stages reuse it", () => {
  const source = prepareSnapshot();
  const control = createControl(source, { atHead: false });
  const first = execute(source, control).result;
  assert.equal(first.accepted, true);
  const child = first.snapshot.campaignIdentity.continuityId;
  assert.notEqual(child, source.campaignIdentity.continuityId);
  assert.equal(first.control.pendingContinuityId, child);
  assert.equal(first.snapshot.authorityLedger.entries.filter((entry) => entry.kind === "continuity_fork").length, 1);
  assert.equal(first.result.continuityId, child);
  assert.equal(first.receipts.every((receipt) => receipt.continuityId === child), true);

  const mismatchedFork = structuredClone(first.snapshot);
  const surveyFork = mismatchedFork.authorityLedger.entries.find(
    (entry) => entry.kind === "continuity_fork" && entry.childContinuityId === child
  );
  surveyFork.sourceId = "survey_request.00000000-0000-4000-8000-00000000bad0";
  assert.equal(isTargetCampaignSnapshot(mismatchedFork), false);

  const second = execute(first.snapshot, first.control).result;
  assert.equal(second.accepted, true);
  assert.equal(second.snapshot.campaignIdentity.continuityId, child);
  assert.equal(second.snapshot.authorityLedger.entries.filter((entry) => entry.kind === "continuity_fork").length, 1);
  assert.equal(second.result.continuityId, child);
});

test("prepared commit rejects changed control, changed source, and candidates without exact survey evidence", () => {
  const source = prepareSnapshot();
  const control = createControl(source);
  const requestId = nextRequestId();
  const preparation = preparePlayerSurveyCampaignMutation(control, {
    mutationId: requestId,
    sourceArtifactId: control.loadedArtifactId,
    sourcePublicationId: control.loadedPublicationId,
    sourceRevision: control.sessionRevision,
    sourceSnapshot: source
  });
  assert.equal(preparation.accepted, true);

  const accepted = execute(source, control, requestId).result;
  assert.equal(accepted.accepted, true);
  const changedControl = structuredClone(control);
  changedControl.loadedContinuityId = "continuity.00000000-0000-4000-8000-00000000bad0";
  const rejectedControl = commitPreparedPlayerSurveyCampaignMutation(
    changedControl,
    source,
    preparation,
    accepted.snapshot,
    accepted.result.resultId
  );
  assert.equal(rejectedControl.accepted, false);
  assert.equal(rejectedControl.snapshot, source);

  const changedSource = structuredClone(source);
  changedSource.clock.tick += 1;
  const rejectedSource = commitPreparedPlayerSurveyCampaignMutation(
    control,
    changedSource,
    preparation,
    accepted.snapshot,
    accepted.result.resultId
  );
  assert.equal(rejectedSource.accepted, false);
  assert.equal(rejectedSource.snapshot, changedSource);

  const candidateWithoutEvidence = structuredClone(preparation.candidateSnapshot);
  const rejectedCandidate = commitPreparedPlayerSurveyCampaignMutation(
    control,
    source,
    preparation,
    candidateWithoutEvidence,
    accepted.result.resultId
  );
  assert.equal(rejectedCandidate.accepted, false);
  assert.equal(rejectedCandidate.snapshot, source);

  const acceptedPreparation = preparePlayerSurveyCampaignMutation(accepted.control, {
    mutationId: nextRequestId(),
    sourceArtifactId: accepted.control.loadedArtifactId,
    sourcePublicationId: accepted.control.loadedPublicationId,
    sourceRevision: accepted.control.sessionRevision,
    sourceSnapshot: accepted.snapshot
  });
  assert.equal(acceptedPreparation.accepted, true);
  const changedRetainedControl = structuredClone(accepted.control);
  changedRetainedControl.retainedMutationResults[0].snapshot.clock.tick += 1;
  const rejectedRetainedSnapshot = commitPreparedPlayerSurveyCampaignMutation(
    changedRetainedControl,
    accepted.snapshot,
    acceptedPreparation,
    accepted.snapshot,
    "survey_result.00000000-0000-4000-8000-000000000000"
  );
  assert.equal(rejectedRetainedSnapshot.accepted, false);
  assert.equal(rejectedRetainedSnapshot.reason, "stale_revision");
  assert.equal(rejectedRetainedSnapshot.snapshot, accepted.snapshot);
});

test("later accepted activity changes do not invalidate immutable survey history", () => {
  const first = execute(prepareSnapshot()).result;
  const proposed = structuredClone(first.snapshot);
  proposed.sessionState.currentActivity = {
    id: "activity.other.accepted",
    label: "Accepted other work",
    category: "Employment"
  };
  const admission = admitCampaignMutation(first.control, {
    mutationId: "mutation.activity.other.accepted",
    sourceArtifactId: first.control.loadedArtifactId,
    sourceRevision: first.control.sessionRevision,
    ownerKind: "engine_result",
    accepted: true,
    sourceSnapshot: first.snapshot,
    proposedSnapshot: proposed,
    resultId: "result.activity.other.accepted"
  });
  assert.equal(admission.accepted, true);
  assert.equal(isTargetCampaignSnapshot(admission.snapshot), true);
  const second = execute(admission.snapshot, admission.control).result;
  assert.equal(second.accepted, true);
  assert.equal(second.result.stage, "sector_2");
  assert.equal(second.result.materialBefore.currentActivityId, "activity.other.accepted");
});

test("owner failure is atomic while projection failure retains gameplay truth for bounded repair", () => {
  const source = prepareSnapshot();
  const control = createControl(source);
  const command = createPlayerSurveyActivityAdvancementCommand(source, control, nextRequestId());
  const before = JSON.stringify(source);
  const ownerFailure = executePlayerSurveyActivityAdvancementCommand(source, control, command, {
    failOwner: "resource_cost"
  });
  assertIdentityStableRejection(source, control, ownerFailure, "transition_failed");
  assert.equal(shouldRetainPlayerSurveyRequestIdentity(ownerFailure), true);
  assert.equal(JSON.stringify(source), before);

  const pending = executePlayerSurveyActivityAdvancementCommand(source, control, command, {
    failProjections: ["notification", "event"]
  });
  assert.equal(pending.accepted, true);
  assert.deepEqual(pending.projectionPending, ["notification", "event"]);
  assert.equal(pending.snapshot.sessionState.flags.includes(`${SECTOR_PREFIX}1`), true);
  assert.equal(
    pending.snapshot.sessionState.notifications.some(
      (entry) => entry.id === pending.result.projectionIds.notification
    ),
    false
  );
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(pending.snapshot), [
    { resultId: pending.result.resultId, projectionKind: "notification" },
    { resultId: pending.result.resultId, projectionKind: "event" }
  ]);

  const repairedNotification = repairPlayerSurveyActivityProjection(
    pending.snapshot,
    pending.control,
    pending.result.resultId,
    "notification"
  );
  assert.equal(repairedNotification.accepted, true);
  assert.equal(repairedNotification.repair.outcome, "inserted");
  assert.equal(
    repairedNotification.snapshot.sessionState.notifications[0].id,
    pending.result.projectionIds.notification
  );
  assert.equal(repairedNotification.snapshot.clock.tick, pending.snapshot.clock.tick);
  assert.equal(
    repairPlayerSurveyActivityProjection(
      repairedNotification.snapshot,
      repairedNotification.control,
      pending.result.resultId,
      "notification"
    ).duplicate,
    true
  );

  const repairedEvent = repairPlayerSurveyActivityProjection(
    repairedNotification.snapshot,
    repairedNotification.control,
    pending.result.resultId,
    "event"
  );
  assert.equal(repairedEvent.accepted, true);
  assert.equal(repairedEvent.emittedEvents[0].id, pending.result.projectionIds.event);
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(repairedEvent.snapshot), []);
  const repairCount = repairedEvent.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length;
  const duplicateEventRepair = repairPlayerSurveyActivityProjection(
    repairedEvent.snapshot,
    repairedEvent.control,
    pending.result.resultId,
    "event"
  );
  assert.equal(duplicateEventRepair.duplicate, true);
  assert.deepEqual(duplicateEventRepair.emittedEvents, []);
  assert.equal(
    duplicateEventRepair.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length,
    repairCount
  );
  const duplicateAcceptedResult = executePlayerSurveyActivityAdvancementCommand(
    repairedEvent.snapshot,
    repairedEvent.control,
    command
  );
  assert.equal(duplicateAcceptedResult.duplicate, true);
  assert.deepEqual(duplicateAcceptedResult.projectionPending, []);
});

test("an already-applied event projection cannot be re-emitted as repair", () => {
  const accepted = execute(prepareSnapshot()).result;
  const repaired = repairPlayerSurveyActivityProjection(
    accepted.snapshot,
    accepted.control,
    accepted.result.resultId,
    "event"
  );
  assert.equal(repaired.accepted, false);
  assert.equal(repaired.duplicate, true);
  assert.deepEqual(repaired.emittedEvents, []);
  assert.equal(repaired.snapshot, accepted.snapshot);
  assert.deepEqual(repaired.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs, []);
});

test("projection repair replaces only same-id malformed rows and records deterministic ordinals", () => {
  const accepted = execute(prepareSnapshot()).result;
  const resultId = accepted.result.resultId;
  const projectionId = accepted.result.projectionIds.notification;
  const malformed = structuredClone(accepted.snapshot);
  malformed.sessionState.notifications = malformed.sessionState.notifications.map((entry) =>
    entry.id === projectionId ? { ...entry, detail: "tampered" } : entry
  );
  const firstRepair = repairPlayerSurveyActivityProjection(
    malformed,
    accepted.control,
    resultId,
    "notification"
  );
  assert.equal(firstRepair.accepted, true);
  assert.equal(firstRepair.repair.outcome, "replaced");
  assert.equal(firstRepair.repair.ordinal, 1);

  const malformedAgain = structuredClone(firstRepair.snapshot);
  malformedAgain.sessionState.notifications = malformedAgain.sessionState.notifications.map((entry) =>
    entry.id === projectionId ? { ...entry, title: "tampered again" } : entry
  );
  const secondRepair = repairPlayerSurveyActivityProjection(
    malformedAgain,
    firstRepair.control,
    resultId,
    "notification"
  );
  assert.equal(secondRepair.accepted, true);
  assert.equal(secondRepair.repair.ordinal, 2);
  assert.equal(
    secondRepair.repair.repairId.endsWith(".notification.2"),
    true
  );
  assert.equal(isTargetCampaignSnapshot(secondRepair.snapshot), true);
});

test("production repair discovery finds applied notification and Chronicle drift deterministically", () => {
  const accepted = execute(prepareSnapshot()).result;
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(accepted.snapshot), []);

  for (const projectionKind of ["notification", "chronicle"]) {
    const destinationName = projectionKind === "notification" ? "notifications" : "chronicle";
    const projectionId = accepted.result.projectionIds[projectionKind];

    const missing = structuredClone(accepted.snapshot);
    missing.sessionState[destinationName] = missing.sessionState[destinationName].filter(
      (entry) => entry.id !== projectionId
    );
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(missing), [
      { resultId: accepted.result.resultId, projectionKind }
    ]);
    const inserted = repairPlayerSurveyActivityProjection(
      missing,
      accepted.control,
      accepted.result.resultId,
      projectionKind
    );
    assert.equal(inserted.accepted, true);
    assert.equal(inserted.repair.outcome, "inserted");

    const driftedAgain = structuredClone(inserted.snapshot);
    driftedAgain.sessionState[destinationName] = driftedAgain.sessionState[destinationName].map(
      (entry) => entry.id === projectionId ? { ...entry, title: "drifted after repair" } : entry
    );
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(driftedAgain), [
      { resultId: accepted.result.resultId, projectionKind }
    ]);
    const replacedAgain = repairPlayerSurveyActivityProjection(
      driftedAgain,
      inserted.control,
      accepted.result.resultId,
      projectionKind
    );
    assert.equal(replacedAgain.accepted, true);
    assert.equal(replacedAgain.repair.outcome, "replaced");
    assert.equal(replacedAgain.repair.ordinal, 2);

    const malformed = structuredClone(accepted.snapshot);
    malformed.sessionState[destinationName] = malformed.sessionState[destinationName].map(
      (entry) => entry.id === projectionId ? { ...entry, detail: "malformed applied row" } : entry
    );
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(malformed), [
      { resultId: accepted.result.resultId, projectionKind }
    ]);
    const replaced = repairPlayerSurveyActivityProjection(
      malformed,
      accepted.control,
      accepted.result.resultId,
      projectionKind
    );
    assert.equal(replaced.repair.outcome, "replaced");

    const reorderedProperties = structuredClone(accepted.snapshot);
    reorderedProperties.sessionState[destinationName] = reorderedProperties.sessionState[destinationName].map(
      (entry) => entry.id === projectionId ? reverseObjectKeyOrder(entry) : entry
    );
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(reorderedProperties), []);

    const duplicated = structuredClone(accepted.snapshot);
    const row = duplicated.sessionState[destinationName].find((entry) => entry.id === projectionId);
    duplicated.sessionState[destinationName].push(structuredClone(row));
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(duplicated), []);
    assert.equal(
      repairPlayerSurveyActivityProjection(
        duplicated,
        accepted.control,
        accepted.result.resultId,
        projectionKind
      ).code,
      "projection_invalid"
    );
  }

  const pendingSource = prepareSnapshot();
  const pendingControl = createControl(pendingSource);
  const pendingCommand = createPlayerSurveyActivityAdvancementCommand(
    pendingSource,
    pendingControl,
    nextRequestId()
  );
  const pendingBoth = executePlayerSurveyActivityAdvancementCommand(
    pendingSource,
    pendingControl,
    pendingCommand,
    { failProjections: ["notification", "chronicle"] }
  );
  assert.equal(pendingBoth.accepted, true);
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(pendingBoth.snapshot), [
    { resultId: pendingBoth.result.resultId, projectionKind: "notification" },
    { resultId: pendingBoth.result.resultId, projectionKind: "chronicle" }
  ]);
});

test("older projection repair preserves newer survey order and never resurrects expired rows", () => {
  const first = execute(prepareSnapshot()).result;
  const second = execute(first.snapshot, first.control).result;
  const missingOlder = structuredClone(second.snapshot);
  missingOlder.sessionState.notifications = missingOlder.sessionState.notifications.filter(
    (entry) => entry.id !== first.result.projectionIds.notification
  );
  const repaired = repairPlayerSurveyActivityProjection(
    missingOlder,
    second.control,
    first.result.resultId,
    "notification"
  );
  assert.equal(repaired.accepted, true);
  const newerIndex = repaired.snapshot.sessionState.notifications.findIndex(
    (entry) => entry.id === second.result.projectionIds.notification
  );
  const olderIndex = repaired.snapshot.sessionState.notifications.findIndex(
    (entry) => entry.id === first.result.projectionIds.notification
  );
  assert.equal(newerIndex >= 0 && olderIndex > newerIndex, true);

  const expiredSource = structuredClone(second.snapshot);
  expiredSource.sessionState.notifications = Array.from({ length: 8 }, (_, index) => ({
    id: `notification.unrelated.newer.${index}`,
    title: "Newer unrelated truth",
    detail: "This row has no survey provenance and is retained conservatively.",
    timeLabel: "Later",
    tone: "neutral"
  }));
  const expired = repairPlayerSurveyActivityProjection(
    expiredSource,
    second.control,
    first.result.resultId,
    "notification"
  );
  assert.equal(expired.accepted, true);
  assert.equal(expired.code, "projection_retention_expired");
  assert.equal(
    expired.snapshot.sessionState.notifications.some(
      (entry) => entry.id === first.result.projectionIds.notification
    ),
    false
  );
  const expiredRepairCount = expired.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length;
  const duplicateExpired = repairPlayerSurveyActivityProjection(
    expired.snapshot,
    expired.control,
    first.result.resultId,
    "notification"
  );
  assert.equal(duplicateExpired.duplicate, true);
  assert.equal(duplicateExpired.code, "projection_retention_expired");
  assert.equal(
    duplicateExpired.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length,
    expiredRepairCount
  );
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(expired.snapshot), [
    { resultId: second.result.resultId, projectionKind: "notification" }
  ]);
});

test("opaque capped projection rows fail closed without evicting a genuine newer tail", () => {
  const first = execute(prepareSnapshot()).result;
  const second = execute(first.snapshot, first.control).result;

  for (const projectionKind of ["notification", "chronicle"]) {
    const destinationName = projectionKind === "notification" ? "notifications" : "chronicle";
    const cap = projectionKind === "notification" ? 8 : 48;
    const newerRow = structuredClone(
      second.snapshot.sessionState[destinationName].find(
        (entry) => entry.id === second.result.projectionIds[projectionKind]
      )
    );
    const template = structuredClone(
      first.receipts.find((entry) => entry.kind === `${projectionKind}_projection`).effect.row
    );
    const capped = structuredClone(second.snapshot);
    const opaqueRows = Array.from({ length: cap - 1 }, (_, index) => ({
      ...structuredClone(template),
      id: `${projectionKind}.${first.result.appliedTick + 10 + index}.${index}`
    }));
    capped.sessionState[destinationName] = [...opaqueRows, newerRow];
    const beforeRows = structuredClone(capped.sessionState[destinationName]);
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(capped), [
      { resultId: first.result.resultId, projectionKind }
    ]);
    const expired = repairPlayerSurveyActivityProjection(
      capped,
      second.control,
      first.result.resultId,
      projectionKind
    );
    assert.equal(expired.accepted, true);
    assert.equal(expired.code, "projection_retention_expired");
    assert.deepEqual(expired.snapshot.sessionState[destinationName], beforeRows);
    assert.equal(
      expired.snapshot.sessionState[destinationName].at(-1).id,
      second.result.projectionIds[projectionKind]
    );
    assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(expired.snapshot), []);
  }
});

test("initial survey publication leaves full opaque destinations byte-equivalent and records pending projections", () => {
  const source = prepareSnapshot();
  const notificationTemplate = structuredClone(source.sessionState.notifications[0]);
  const chronicleTemplate = structuredClone(source.sessionState.chronicle[0]);
  source.sessionState.notifications = Array.from({ length: 8 }, (_, index) => ({
    ...structuredClone(notificationTemplate),
    id: `notification.${source.clock.tick + 100 + index}.opaque`
  })).reverse();
  source.sessionState.chronicle = Array.from({ length: 48 }, (_, index) => ({
    ...structuredClone(chronicleTemplate),
    id: `chronicle.${source.clock.tick + 100 + index}.opaque`
  })).reverse();
  const beforeNotifications = structuredClone(source.sessionState.notifications);
  const beforeChronicle = structuredClone(source.sessionState.chronicle);

  const accepted = execute(source).result;
  assert.equal(accepted.accepted, true, accepted.notice.detail);
  assert.deepEqual(accepted.projectionPending, ["notification", "chronicle"]);
  assert.deepEqual(accepted.snapshot.sessionState.notifications, beforeNotifications);
  assert.deepEqual(accepted.snapshot.sessionState.chronicle, beforeChronicle);
  for (const projectionKind of ["notification", "chronicle"]) {
    assert.equal(
      accepted.receipts.find((entry) => entry.kind === `${projectionKind}_projection`).posture,
      "projection_pending"
    );
  }
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(accepted.snapshot), [
    { resultId: accepted.result.resultId, projectionKind: "notification" },
    { resultId: accepted.result.resultId, projectionKind: "chronicle" }
  ]);

  for (const projectionKind of ["notification", "chronicle"]) {
    const destinationName = projectionKind === "notification" ? "notifications" : "chronicle";
    const repaired = repairPlayerSurveyActivityProjection(
      accepted.snapshot,
      accepted.control,
      accepted.result.resultId,
      projectionKind
    );
    assert.equal(repaired.accepted, true);
    assert.equal(repaired.code, "projection_retention_expired");
    assert.deepEqual(
      repaired.snapshot.sessionState[destinationName],
      projectionKind === "notification" ? beforeNotifications : beforeChronicle
    );
  }
});

test("genuine same-tick survey projections converge across both repair invocation orders", () => {
  const source = prepareSnapshot();
  const first = execute(source).result;
  const rewoundCandidate = structuredClone(first.snapshot);
  rewoundCandidate.clock = structuredClone(source.clock);
  rewoundCandidate.capturedAtTick = source.capturedAtTick;
  rewoundCandidate.playerState = structuredClone(source.playerState);
  const rewind = admitCampaignMutation(first.control, {
    mutationId: "mutation.survey.same_tick.reconciliation",
    sourceArtifactId: first.control.loadedArtifactId,
    sourceRevision: first.control.sessionRevision,
    ownerKind: "engine_result",
    accepted: true,
    sourceSnapshot: first.snapshot,
    proposedSnapshot: rewoundCandidate,
    resultId: "result.survey.same_tick.reconciliation"
  });
  assert.equal(rewind.accepted, true);
  assert.equal(isTargetCampaignSnapshot(rewind.snapshot), true);
  const second = execute(rewind.snapshot, rewind.control).result;
  assert.equal(second.accepted, true, second.notice.detail);
  assert.equal(second.result.appliedTick, first.result.appliedTick);

  for (const projectionKind of ["notification", "chronicle"]) {
    const destinationName = projectionKind === "notification" ? "notifications" : "chronicle";
    const missingBoth = structuredClone(second.snapshot);
    const projectionIds = new Set([
      first.result.projectionIds[projectionKind],
      second.result.projectionIds[projectionKind]
    ]);
    missingBoth.sessionState[destinationName] = missingBoth.sessionState[destinationName].filter(
      (entry) => !projectionIds.has(entry.id)
    );
    const finalDestinations = [];
    for (const order of [
      [first.result.resultId, second.result.resultId],
      [second.result.resultId, first.result.resultId]
    ]) {
      let currentSnapshot = structuredClone(missingBoth);
      let currentControl = structuredClone(second.control);
      for (const resultId of order) {
        const repaired = repairPlayerSurveyActivityProjection(
          currentSnapshot,
          currentControl,
          resultId,
          projectionKind
        );
        assert.equal(repaired.accepted, true);
        currentSnapshot = repaired.snapshot;
        currentControl = repaired.control;
      }
      finalDestinations.push(currentSnapshot.sessionState[destinationName]);
    }
    assert.deepEqual(finalDestinations[0], finalDestinations[1]);
    assert.deepEqual(
      finalDestinations[0].filter((entry) => projectionIds.has(entry.id)).map((entry) => entry.id),
      [first, second]
        .sort((left, right) => left.result.resultId < right.result.resultId ? -1 : 1)
        .map((entry) => entry.result.projectionIds[projectionKind])
    );
  }
});

test("coherent pre-receipt progress creates one baseline without inventing history", () => {
  const source = prepareSnapshot(3);
  delete source.authorityLedger.ashenReefSurvey;
  assert.equal(isTargetCampaignSnapshot(source), true);
  const accepted = execute(source, createControl(source)).result;
  assert.equal(accepted.accepted, true);
  const authority = accepted.snapshot.authorityLedger.ashenReefSurvey;
  assert.equal(authority.legacyBaseline.materialFacts.sectorCount, 2);
  assert.equal(authority.requests.length, 1);
  assert.equal(authority.occurrences.length, 1);
  assert.equal(authority.results.length, 1);

  const missingBaseline = structuredClone(accepted.snapshot);
  delete missingBaseline.authorityLedger.ashenReefSurvey.legacyBaseline;
  assert.equal(isTargetCampaignSnapshot(missingBaseline), false);

  const mismatchedBaseline = structuredClone(accepted.snapshot);
  mismatchedBaseline.authorityLedger.ashenReefSurvey.legacyBaseline.sourceRevision += 1;
  assert.equal(isTargetCampaignSnapshot(mismatchedBaseline), false);

  const baselineOnly = prepareSnapshot();
  baselineOnly.authorityLedger.ashenReefSurvey.legacyBaseline = structuredClone(
    authority.legacyBaseline
  );
  assert.equal(isTargetCampaignSnapshot(baselineOnly), false);
});

test("final survey keeps missing Codex rows absent, unlocks existing rows, and grants no excluded effects", () => {
  for (const codex of ["absent", "locked"]) {
    const source = prepareSnapshot(4, { codex });
    const before = {
      geographicKnowledge: structuredClone(source.playerState.geographicKnowledge),
      knownLocations: structuredClone(source.sessionState.knownLocations),
      location: structuredClone(source.playerState.location),
      currency: structuredClone(source.playerState.currency),
      standing: structuredClone(source.playerState.standing),
      reputation: structuredClone(source.playerState.reputation),
      inventory: structuredClone(source.playerState.inventory),
      generalLore: structuredClone(
        source.playerState.skills.find((entry) => entry.id === "skill.knowledge.general_lore")
      ),
      quest: structuredClone(
        source.sessionState.questJournal.find((entry) => entry.id === QUEST_ID)
      )
    };
    const accepted = execute(source).result;
    assert.equal(accepted.accepted, true);
    const codexRow = accepted.snapshot.sessionState.codexEntries.find(
      (entry) => entry.id === "flora.unknown_bloom"
    );
    if (codex === "absent") {
      assert.equal(codexRow, undefined);
      assert.equal(accepted.result.codexOutcome, "source_record_absent");
    } else {
      assert.equal(codexRow.locked, false);
      assert.equal(accepted.result.codexOutcome, "unlocked_existing");
    }
    assert.deepEqual(accepted.snapshot.playerState.geographicKnowledge, before.geographicKnowledge);
    assert.deepEqual(accepted.snapshot.sessionState.knownLocations, before.knownLocations);
    assert.deepEqual(accepted.snapshot.playerState.location, before.location);
    assert.deepEqual(accepted.snapshot.playerState.currency, before.currency);
    assert.deepEqual(accepted.snapshot.playerState.standing, before.standing);
    assert.deepEqual(accepted.snapshot.playerState.reputation, before.reputation);
    assert.deepEqual(accepted.snapshot.playerState.inventory, before.inventory);
    assert.deepEqual(
      accepted.snapshot.playerState.skills.find(
        (entry) => entry.id === "skill.knowledge.general_lore"
      ),
      before.generalLore
    );
    const questAfter = accepted.snapshot.sessionState.questJournal.find(
      (entry) => entry.id === QUEST_ID
    );
    assert.equal(questAfter.category, "active");
    assert.notEqual(questAfter.statusLabel, "Turned in");
    assert.equal(questAfter.rewardLabel, before.quest.rewardLabel);
    assert.deepEqual(questAfter.rewards, before.quest.rewards);
  }
});

test("a real fresh-character snapshot does not invent the absent Stormglass Codex row", () => {
  const source = createFreshCharacterSurveyFinalSource();
  assert.deepEqual(source.sessionState.codexEntries, []);
  const accepted = execute(source, createControl(source)).result;
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.result.stage, "ruins_confirmation");
  assert.equal(accepted.result.codexOutcome, "source_record_absent");
  assert.equal(
    accepted.snapshot.sessionState.codexEntries.some((entry) => entry.id === "flora.unknown_bloom"),
    false
  );
});

test("valid pending correction loads but blocks a later survey command; cycles and orphans fail validation", () => {
  const first = execute(prepareSnapshot()).result;
  const reconciliationsFor = (receipts, status) => receipts.map((receipt) => ({
    owner: receipt.owner,
    kind: receipt.kind,
    status
  }));
  const correction = {
    version: 1,
    correctionId: "survey_correction.00000000-0000-4000-8000-00000000c001",
    campaignId: first.result.campaignId,
    continuityId: first.result.continuityId,
    characterId: first.result.characterId,
    supersededResultId: first.result.resultId,
    replacementResultId: null,
    reason: "Independent audit requires owner reconciliation.",
    evidenceIds: ["evidence.audit.1"],
    createdAtTick: first.snapshot.clock.tick,
    reconciliations: reconciliationsFor(first.receipts, "pending")
  };
  const pending = structuredClone(first.snapshot);
  pending.authorityLedger.ashenReefSurvey.corrections.push(correction);
  assert.equal(isTargetCampaignSnapshot(pending), true);
  assert.equal(
    isTargetCampaignSnapshot(JSON.parse(JSON.stringify(pending))),
    true
  );
  assert.equal(resolvePlayerSurveyActivityAdvancementPlan(pending).code, "correction_pending");
  const pendingWithDrift = structuredClone(pending);
  pendingWithDrift.sessionState.notifications = pendingWithDrift.sessionState.notifications.filter(
    (entry) => entry.id !== first.result.projectionIds.notification
  );
  assert.deepEqual(listPendingPlayerSurveyProjectionRepairs(pendingWithDrift), []);

  const invalidEvidenceSets = [
    undefined,
    null,
    {},
    [],
    ["evidence.audit.1", "evidence.audit.1"],
    [""],
    [" evidence.audit.1"],
    [42]
  ];
  for (const evidenceIds of invalidEvidenceSets) {
    const malformedEvidence = structuredClone(first.snapshot);
    const malformedCorrection = structuredClone(correction);
    if (evidenceIds === undefined) delete malformedCorrection.evidenceIds;
    else malformedCorrection.evidenceIds = evidenceIds;
    malformedEvidence.authorityLedger.ashenReefSurvey.corrections.push(malformedCorrection);
    assert.doesNotThrow(() => isTargetCampaignSnapshot(malformedEvidence));
    assert.equal(isTargetCampaignSnapshot(malformedEvidence), false);
  }

  const undeclaredReconciliationEvidence = structuredClone(first.snapshot);
  undeclaredReconciliationEvidence.authorityLedger.ashenReefSurvey.corrections.push({
    ...structuredClone(correction),
    reconciliations: correction.reconciliations.map((entry, index) =>
      index === 0 ? { ...entry, evidenceId: "evidence.audit.undeclared" } : entry
    )
  });
  assert.equal(isTargetCampaignSnapshot(undeclaredReconciliationEvidence), false);

  const control = first.control;
  const command = createPlayerSurveyActivityAdvancementCommand(first.snapshot, control, nextRequestId());
  const blocked = executePlayerSurveyActivityAdvancementCommand(pending, control, command);
  assert.equal(blocked.code, "correction_pending");
  assert.equal(blocked.snapshot, pending);

  const orphan = structuredClone(pending);
  orphan.authorityLedger.ashenReefSurvey.corrections[0].supersededResultId = "survey_result.missing";
  assert.equal(isTargetCampaignSnapshot(orphan), false);

  const omittedOwner = structuredClone(first.snapshot);
  omittedOwner.authorityLedger.ashenReefSurvey.corrections.push({
    ...correction,
    reconciliations: reconciliationsFor(first.receipts, "confirmed_no_change").slice(0, -1)
  });
  assert.equal(isTargetCampaignSnapshot(omittedOwner), false);

  const duplicatedCorrection = structuredClone(pending);
  duplicatedCorrection.authorityLedger.ashenReefSurvey.corrections.push({
    ...correction,
    correctionId: "survey_correction.00000000-0000-4000-8000-00000000c002"
  });
  assert.equal(isTargetCampaignSnapshot(duplicatedCorrection), false);

  const cycleBase = execute(first.snapshot, first.control).result;
  const cyclic = structuredClone(cycleBase.snapshot);
  const [resultA, resultB] = cyclic.authorityLedger.ashenReefSurvey.results;
  cyclic.authorityLedger.ashenReefSurvey.corrections = [
    {
      ...correction,
      supersededResultId: resultA.resultId,
      replacementResultId: resultB.resultId,
      reconciliations: reconciliationsFor(
        cyclic.authorityLedger.ashenReefSurvey.consequenceReceipts.filter(
          (entry) => entry.resultId === resultA.resultId
        ),
        "superseded"
      )
    },
    {
      ...correction,
      correctionId: "survey_correction.00000000-0000-4000-8000-00000000c002",
      supersededResultId: resultB.resultId,
      replacementResultId: resultA.resultId,
      reconciliations: reconciliationsFor(
        cyclic.authorityLedger.ashenReefSurvey.consequenceReceipts.filter(
          (entry) => entry.resultId === resultB.resultId
        ),
        "superseded"
      )
    }
  ];
  assert.equal(isTargetCampaignSnapshot(cyclic), false);
});
