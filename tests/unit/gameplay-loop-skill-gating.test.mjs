import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceCurrentActivity,
  turnInQuest
} from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  initializeTargetCampaignSnapshot,
  isTargetCampaignSnapshot
} from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { createCampaignSessionControl } from "../../packages/engines/game-engine/src/campaign-session.ts";
import { resolvePlayerEchoProgression } from "../../packages/engines/player-engine/src/progression.ts";
import {
  createPlayerSurveyActivityAdvancementCommand,
  executePlayerSurveyActivityAdvancementCommand
} from "../../packages/engines/game-engine/src/player-survey-activity-advancement.ts";

const SURVEY_QUEST_ID = "quest.ashen_reef_survey";
const RIVET_QUEST_ID = "quest.rivet_shortfall_relief";
const SURVEY_SECTOR_FLAG_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const SURVEY_RUINS_FLAG = "gameplay.quest.ashen_reef_survey.ruins_confirmed";
const RIVET_CARGO_FLAG = "gameplay.quest.rivet_shortfall_relief.crates_secured";

function cloneDemoSnapshot() {
  return structuredClone(demoSnapshot);
}

function activateQuest(snapshot, questId) {
  snapshot.sessionState.trackedQuestId = questId;
  snapshot.sessionState.questJournal = snapshot.sessionState.questJournal.map((entry) => ({
    ...entry,
    category: entry.id === questId ? "active" : entry.category,
    tracked: entry.id === questId
  }));
}

function clearQuestProgressFlags(snapshot) {
  snapshot.sessionState.flags = snapshot.sessionState.flags.filter(
    (flag) =>
      !flag.startsWith(SURVEY_SECTOR_FLAG_PREFIX) &&
      flag !== SURVEY_RUINS_FLAG &&
      flag !== RIVET_CARGO_FLAG
  );
}

function moveToAshenReef(snapshot) {
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.starfall_port",
    siteLabel: "Ashen Reef"
  };
}

function moveToWestreach(snapshot) {
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.stonevein",
    siteLabel: "Westreach"
  };
}

function moveToSaltmere(snapshot) {
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.aurelis",
    siteLabel: "Harbor Quarter"
  };
}

function setSkill(snapshot, skillId, rank, progression = undefined) {
  const nextSkill = {
    id: skillId,
    rank,
    source: "trained",
    ...(progression ? { progression } : {})
  };
  const withoutSkill = snapshot.playerState.skills.filter((entry) => entry.id !== skillId);
  snapshot.playerState.skills = [...withoutSkill, nextSkill].sort((left, right) => left.id.localeCompare(right.id));
  snapshot.playerState.progression = resolvePlayerEchoProgression(snapshot.playerState);
}

function getSkill(snapshot, skillId) {
  return snapshot.playerState.skills.find((entry) => entry.id === skillId) ?? null;
}

function skillRank(snapshot, skillId) {
  return getSkill(snapshot, skillId)?.rank ?? 0;
}

function latestChronicle(snapshot) {
  return snapshot.sessionState.chronicle[0] ?? null;
}

function otherSkillSignature(snapshot, excludedSkillId) {
  return snapshot.playerState.skills
    .filter((skill) => skill.id !== excludedSkillId)
    .map((skill) => ({
      id: skill.id,
      rank: skill.rank,
      source: skill.source,
      progression: skill.progression ?? null
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function createSurveyActivitySnapshot(skillRankValue, progression = undefined) {
  const snapshot = cloneDemoSnapshot();
  clearQuestProgressFlags(snapshot);
  activateQuest(snapshot, SURVEY_QUEST_ID);
  moveToAshenReef(snapshot);
  setSkill(snapshot, "skill.knowledge.general_lore", skillRankValue, progression);
  return snapshot;
}

function createSurveyTurnInSnapshot(skillRankValue, progression = undefined) {
  const snapshot = cloneDemoSnapshot();
  clearQuestProgressFlags(snapshot);
  activateQuest(snapshot, SURVEY_QUEST_ID);
  moveToSaltmere(snapshot);
  snapshot.sessionState.flags = [
    ...snapshot.sessionState.flags,
    `${SURVEY_SECTOR_FLAG_PREFIX}1`,
    `${SURVEY_SECTOR_FLAG_PREFIX}2`,
    `${SURVEY_SECTOR_FLAG_PREFIX}3`,
    SURVEY_RUINS_FLAG
  ];
  setSkill(snapshot, "skill.knowledge.general_lore", skillRankValue, progression);
  return snapshot;
}

function createSurveyDiscoverySnapshot(skillRankValue, progression = undefined) {
  const snapshot = cloneDemoSnapshot();
  clearQuestProgressFlags(snapshot);
  activateQuest(snapshot, SURVEY_QUEST_ID);
  moveToAshenReef(snapshot);
  snapshot.sessionState.flags = [
    ...snapshot.sessionState.flags,
    `${SURVEY_SECTOR_FLAG_PREFIX}1`,
    `${SURVEY_SECTOR_FLAG_PREFIX}2`,
    `${SURVEY_SECTOR_FLAG_PREFIX}3`
  ];
  setSkill(snapshot, "skill.resource.identify.flora", skillRankValue, progression);
  return snapshot;
}

function createRivetActivitySnapshot(skillRankValue, progression = undefined) {
  const snapshot = cloneDemoSnapshot();
  clearQuestProgressFlags(snapshot);
  activateQuest(snapshot, RIVET_QUEST_ID);
  moveToWestreach(snapshot);
  setSkill(snapshot, "skill.resource.identify.minerals", skillRankValue, progression);
  return snapshot;
}

function createRivetTurnInSnapshot(skillRankValue, progression = undefined) {
  const snapshot = cloneDemoSnapshot();
  clearQuestProgressFlags(snapshot);
  activateQuest(snapshot, RIVET_QUEST_ID);
  moveToSaltmere(snapshot);
  snapshot.sessionState.flags = [...snapshot.sessionState.flags, RIVET_CARGO_FLAG];
  setSkill(snapshot, "skill.knowledge.mineral_lore", skillRankValue, progression);
  return snapshot;
}

let surveyCommandOrdinal = 100;

function advanceSurvey(snapshotValue, existingControl = null) {
  const snapshot = isTargetCampaignSnapshot(snapshotValue)
    ? snapshotValue
    : initializeTargetCampaignSnapshot(snapshotValue, { source: "developer_fixture" });
  const identity = snapshot.campaignIdentity;
  const control = existingControl ?? createCampaignSessionControl({
    accountId: snapshot.accountId,
    campaignId: identity.campaignId,
    artifactId: "artifact.skill-gating",
    publicationId: "publication.skill-gating",
    artifactRevision: 1,
    continuityId: identity.continuityId,
    headArtifactId: "artifact.skill-gating",
    headRevision: 1
  });
  surveyCommandOrdinal += 1;
  const requestId = `survey_request.00000000-0000-4000-8000-${surveyCommandOrdinal
    .toString(16)
    .padStart(12, "0")}`;
  const command = createPlayerSurveyActivityAdvancementCommand(snapshot, control, requestId);
  return executePlayerSurveyActivityAdvancementCommand(snapshot, control, command);
}

test("noncombat activity skill gains below rank 30 still apply without touching unrelated skills", () => {
  const snapshot = createSurveyActivitySnapshot(20);
  const unrelatedBefore = otherSkillSignature(snapshot, "skill.knowledge.general_lore");

  const result = advanceSurvey(snapshot);

  assert.equal(result.notice.tone, "success");
  assert.equal(skillRank(result.snapshot, "skill.knowledge.general_lore"), 21);
  assert.deepEqual(latestChronicle(result.snapshot)?.statChanges, ["Navigation +1", "Stamina -10", "MP -3"]);
  assert.deepEqual(otherSkillSignature(result.snapshot, "skill.knowledge.general_lore"), unrelatedBefore);
});

test("noncombat repeated gains clamp at rank 30 without familiar unlocked", () => {
  const snapshot = createSurveyActivitySnapshot(29);

  const firstGain = advanceSurvey(snapshot);
  assert.equal(skillRank(firstGain.snapshot, "skill.knowledge.general_lore"), 30);
  assert.deepEqual(latestChronicle(firstGain.snapshot)?.statChanges, ["Navigation +1", "Stamina -10", "MP -3"]);

  const secondGain = advanceSurvey(firstGain.snapshot, firstGain.control);
  assert.equal(secondGain.notice.tone, "success");
  assert.equal(skillRank(secondGain.snapshot, "skill.knowledge.general_lore"), 30);
  assert.deepEqual(latestChronicle(secondGain.snapshot)?.statChanges, [
    "Navigation progress requires a breakthrough",
    "Stamina -10",
    "MP -3"
  ]);
  assert.equal(latestChronicle(secondGain.snapshot)?.statChanges.includes("Navigation +1"), false);
});

test("noncombat skill gains honor unlocked and locked breakthrough bands", () => {
  const familiarProgression = {
    unlockedBandIds: ["familiar"],
    breakthroughProgress: 0
  };
  const familiarUnlocked = advanceSurvey(createSurveyActivitySnapshot(30, familiarProgression));
  assert.equal(skillRank(familiarUnlocked.snapshot, "skill.knowledge.general_lore"), 31);
  assert.deepEqual(getSkill(familiarUnlocked.snapshot, "skill.knowledge.general_lore")?.progression, familiarProgression);

  const proficientLocked = advanceSurvey(createSurveyActivitySnapshot(55, familiarProgression));
  assert.equal(skillRank(proficientLocked.snapshot, "skill.knowledge.general_lore"), 55);
  assert.equal(
    latestChronicle(proficientLocked.snapshot)?.statChanges.includes("Navigation progress requires a breakthrough"),
    true
  );

  const skilledLocked = advanceSurvey(
    createSurveyActivitySnapshot(80, {
      unlockedBandIds: ["familiar", "proficient"],
      breakthroughProgress: 0
    })
  );
  assert.equal(skillRank(skilledLocked.snapshot, "skill.knowledge.general_lore"), 80);

  const masteryLocked = advanceSurvey(
    createSurveyActivitySnapshot(100, {
      unlockedBandIds: ["familiar", "proficient", "skilled"],
      breakthroughProgress: 0
    })
  );
  assert.equal(skillRank(masteryLocked.snapshot, "skill.knowledge.general_lore"), 100);

  const maximumRank = advanceSurvey(
    createSurveyActivitySnapshot(125, {
      unlockedBandIds: ["familiar", "proficient", "skilled", "mastery"],
      breakthroughProgress: 0
    })
  );
  assert.equal(skillRank(maximumRank.snapshot, "skill.knowledge.general_lore"), 125);
});

test("quest turn-in and procurement skill gains use the same noncombat gate policy", () => {
  const surveyTurnIn = turnInQuest(createSurveyTurnInSnapshot(29), SURVEY_QUEST_ID);
  assert.equal(surveyTurnIn.notice.tone, "success");
  assert.equal(skillRank(surveyTurnIn.snapshot, "skill.knowledge.general_lore"), 30);
  assert.deepEqual(latestChronicle(surveyTurnIn.snapshot)?.statChanges, [
    "Common Lore +1",
    "Harbor Office Standing +8",
    "Regional Fame +6"
  ]);

  const blockedSurveyTurnIn = turnInQuest(createSurveyTurnInSnapshot(30), SURVEY_QUEST_ID);
  assert.equal(blockedSurveyTurnIn.notice.tone, "success");
  assert.equal(skillRank(blockedSurveyTurnIn.snapshot, "skill.knowledge.general_lore"), 30);
  assert.deepEqual(latestChronicle(blockedSurveyTurnIn.snapshot)?.statChanges, [
    "Common Lore progress requires a breakthrough",
    "Harbor Office Standing +8",
    "Regional Fame +6"
  ]);

  const rivetProcurement = advanceCurrentActivity(createRivetActivitySnapshot(29));
  assert.equal(rivetProcurement.notice.tone, "success");
  assert.equal(skillRank(rivetProcurement.snapshot, "skill.resource.identify.minerals"), 30);
  assert.deepEqual(latestChronicle(rivetProcurement.snapshot)?.statChanges, ["Mercantile +1", "Stamina -7"]);
});

test("survey discovery and rivet turn-in messages reflect blocked skill gates", () => {
  const blockedSurveyDiscovery = advanceSurvey(createSurveyDiscoverySnapshot(30));
  assert.equal(blockedSurveyDiscovery.notice.tone, "accent");
  assert.equal(skillRank(blockedSurveyDiscovery.snapshot, "skill.resource.identify.flora"), 30);
  assert.deepEqual(latestChronicle(blockedSurveyDiscovery.snapshot)?.statChanges, [
    "Survival progress requires a breakthrough",
    "Stamina -10",
    "MP -3"
  ]);
  assert.equal(latestChronicle(blockedSurveyDiscovery.snapshot)?.statChanges.includes("Survival +1"), false);

  const blockedRivetTurnIn = turnInQuest(createRivetTurnInSnapshot(30), RIVET_QUEST_ID);
  assert.equal(blockedRivetTurnIn.notice.tone, "success");
  assert.equal(skillRank(blockedRivetTurnIn.snapshot, "skill.knowledge.mineral_lore"), 30);
  assert.deepEqual(latestChronicle(blockedRivetTurnIn.snapshot)?.statChanges, [
    "Earth Lore progress requires a breakthrough",
    "Guild Consortium Standing +6",
    "Local Fame +4"
  ]);
  assert.equal(latestChronicle(blockedRivetTurnIn.snapshot)?.statChanges.includes("Earth Lore +1"), false);
});
