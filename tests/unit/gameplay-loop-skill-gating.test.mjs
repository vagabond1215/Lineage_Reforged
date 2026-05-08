import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceCurrentActivity,
  turnInQuest
} from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

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
}

function getSkill(snapshot, skillId) {
  return snapshot.playerState.skills.find((entry) => entry.id === skillId) ?? null;
}

function skillRank(snapshot, skillId) {
  return getSkill(snapshot, skillId)?.rank ?? 0;
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

function createRivetActivitySnapshot(skillRankValue, progression = undefined) {
  const snapshot = cloneDemoSnapshot();
  clearQuestProgressFlags(snapshot);
  activateQuest(snapshot, RIVET_QUEST_ID);
  moveToWestreach(snapshot);
  setSkill(snapshot, "skill.resource.identify.minerals", skillRankValue, progression);
  return snapshot;
}

test("noncombat activity skill gains below rank 30 still apply without touching unrelated skills", () => {
  const snapshot = createSurveyActivitySnapshot(20);
  const unrelatedBefore = otherSkillSignature(snapshot, "skill.knowledge.general_lore");

  const result = advanceCurrentActivity(snapshot);

  assert.equal(result.notice.tone, "success");
  assert.equal(skillRank(result.snapshot, "skill.knowledge.general_lore"), 21);
  assert.deepEqual(otherSkillSignature(result.snapshot, "skill.knowledge.general_lore"), unrelatedBefore);
});

test("noncombat repeated gains clamp at rank 30 without familiar unlocked", () => {
  const snapshot = createSurveyActivitySnapshot(29);

  const firstGain = advanceCurrentActivity(snapshot);
  assert.equal(skillRank(firstGain.snapshot, "skill.knowledge.general_lore"), 30);

  const secondGain = advanceCurrentActivity(firstGain.snapshot);
  assert.equal(secondGain.notice.tone, "success");
  assert.equal(skillRank(secondGain.snapshot, "skill.knowledge.general_lore"), 30);
});

test("noncombat skill gains honor unlocked and locked breakthrough bands", () => {
  const familiarProgression = {
    unlockedBandIds: ["familiar"],
    breakthroughProgress: 0
  };
  const familiarUnlocked = advanceCurrentActivity(createSurveyActivitySnapshot(30, familiarProgression));
  assert.equal(skillRank(familiarUnlocked.snapshot, "skill.knowledge.general_lore"), 31);
  assert.deepEqual(getSkill(familiarUnlocked.snapshot, "skill.knowledge.general_lore")?.progression, familiarProgression);

  const proficientLocked = advanceCurrentActivity(createSurveyActivitySnapshot(55, familiarProgression));
  assert.equal(skillRank(proficientLocked.snapshot, "skill.knowledge.general_lore"), 55);

  const skilledLocked = advanceCurrentActivity(
    createSurveyActivitySnapshot(80, {
      unlockedBandIds: ["familiar", "proficient"],
      breakthroughProgress: 0
    })
  );
  assert.equal(skillRank(skilledLocked.snapshot, "skill.knowledge.general_lore"), 80);

  const masteryLocked = advanceCurrentActivity(
    createSurveyActivitySnapshot(100, {
      unlockedBandIds: ["familiar", "proficient", "skilled"],
      breakthroughProgress: 0
    })
  );
  assert.equal(skillRank(masteryLocked.snapshot, "skill.knowledge.general_lore"), 100);

  const maximumRank = advanceCurrentActivity(
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

  const blockedSurveyTurnIn = turnInQuest(createSurveyTurnInSnapshot(30), SURVEY_QUEST_ID);
  assert.equal(blockedSurveyTurnIn.notice.tone, "success");
  assert.equal(skillRank(blockedSurveyTurnIn.snapshot, "skill.knowledge.general_lore"), 30);

  const rivetProcurement = advanceCurrentActivity(createRivetActivitySnapshot(29));
  assert.equal(rivetProcurement.notice.tone, "success");
  assert.equal(skillRank(rivetProcurement.snapshot, "skill.resource.identify.minerals"), 30);
});
