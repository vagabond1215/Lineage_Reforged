import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  accumulateBreakthroughProgress,
  applyBreakthroughGating,
  evaluateTrialOutcome,
  resolveItemUseProfile,
  resolveKnowledgeAssistance,
  resolveSkillBand,
  validateSpellScalingChannelsForSchool
} from "../../packages/engines/player-engine/src/progression.ts";

test("resolveSkillBand returns the authored overlapping bands", () => {
  assert.equal(resolveSkillBand(20).id, "clumsy");
  assert.equal(resolveSkillBand(52).id, "familiar");
  assert.equal(resolveSkillBand(110).id, "mastery");
});

test("applyBreakthroughGating blocks rank gain above locked gates", () => {
  const blocked = applyBreakthroughGating(72, ["familiar"]);
  assert.equal(blocked.blocked, true);
  assert.equal(blocked.permittedRank, 55);
  assert.equal(blocked.requiredBandId, "proficient");

  const unlocked = applyBreakthroughGating(72, ["familiar", "proficient"]);
  assert.equal(unlocked.blocked, false);
  assert.equal(unlocked.permittedRank, 72);
});

test("accumulateBreakthroughProgress caps at 100 and reports unlock readiness", () => {
  const result = accumulateBreakthroughProgress({
    currentProgress: 82,
    performanceScore: 10,
    difficultyFactor: 1.3,
    trialBonus: 6
  });

  assert.equal(result.progress, 100);
  assert.equal(result.readyToUnlock, true);
});

test("evaluateTrialOutcome advances success and fails when max potential drops below threshold", () => {
  const trial = {
    id: "trial.test",
    name: "Test Trial",
    associatedSkillId: "skill.survival.fire_starting",
    thresholdToPass: 70,
    progress: 0,
    maxPotential: 100,
    checkpoints: [{ id: "checkpoint.1", label: "Start", progressRequired: 20 }],
    rewards: [],
    penalties: []
  };

  const success = evaluateTrialOutcome(trial, null, {
    successProgress: 72,
    failurePotentialLoss: 0,
    completedCheckpointIds: ["checkpoint.1"]
  });
  assert.equal(success.passed, true);
  assert.equal(success.failed, false);
  assert.deepEqual(success.completedCheckpointIds, ["checkpoint.1"]);

  const failure = evaluateTrialOutcome(trial, null, {
    successProgress: 20,
    failurePotentialLoss: 40
  });
  assert.equal(failure.failed, true);
  assert.equal(failure.maxPotential, 60);
});

test("resolveKnowledgeAssistance weights domain knowledge above universal support and spotting", () => {
  const track = {
    id: "knowledge_track.flora",
    knowledgeSkillId: "skill.knowledge.flora",
    spottingSkillId: "skill.resource.spotting.flora",
    identifySkillId: "skill.resource.identify.flora",
    universalSupportSkillId: "skill.knowledge.universal",
    supportWeights: {
      domainKnowledge: 0.7,
      universalKnowledge: 0.2,
      spotting: 0.1
    },
    identifyDifficulty: {
      common: 10,
      uncommon: 35,
      rare: 60,
      obscure: 85
    },
    autoIdentifyThresholds: {
      common: 25,
      uncommon: 50,
      rare: 75,
      obscure: 100
    }
  };

  const result = resolveKnowledgeAssistance({
    track,
    domainKnowledgeRank: 80,
    universalKnowledgeRank: 30,
    spottingRank: 20
  });

  assert.ok(result.contributions.domainKnowledge > result.contributions.universalKnowledge);
  assert.ok(result.contributions.universalKnowledge > result.contributions.spotting);
  assert.equal(result.autoIdentify.uncommon, true);
  assert.equal(result.autoIdentify.obscure, false);
});

test("resolveItemUseProfile selects the matching action profile", () => {
  const useProfile = resolveItemUseProfile(
    [
      {
        actionType: "utility.mining",
        primarySkillId: "skill.resource.mining",
        supportSkillIds: ["skill.knowledge.minerals"],
        requiredSkillRank: 1,
        masteryRank: 90,
        effectChannels: ["yield"]
      },
      {
        actionType: "combat.melee.improvised",
        primarySkillId: "skill.combat.weapon.axe",
        supportSkillIds: [],
        requiredSkillRank: 5,
        masteryRank: 70,
        effectChannels: ["damage"]
      }
    ],
    "combat.melee.improvised"
  );

  assert.ok(useProfile);
  assert.equal(useProfile.primarySkillId, "skill.combat.weapon.axe");
});

test("validateSpellScalingChannelsForSchool rejects channels outside the school profile", () => {
  const valid = validateSpellScalingChannelsForSchool("elemental", ["power", "radius", "manaEfficiency", "accuracy"]);
  assert.equal(valid.valid, true);

  const invalid = validateSpellScalingChannelsForSchool("healing", ["power", "accuracy"]);
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.invalidChannels, ["accuracy"]);
});

test("normalized placeholder spell catalog uses valid scaling channels for every authored record", () => {
  const spellCatalog = JSON.parse(readFileSync("packages/content/base/player/spells.json", "utf8"));

  for (const spell of spellCatalog.records) {
    const result = validateSpellScalingChannelsForSchool(spell.school, spell.scalingChannels);
    assert.equal(result.valid, true, `expected ${spell.id} to use valid scaling channels`);
  }

  const berry = spellCatalog.records.find((spell) => spell.id === "spell.druidic.healing.berry");
  assert.ok(berry, "expected druidic berry placeholder spell");
  assert.equal(berry.itemGenerationHooks?.[0]?.generatedItemId, "generated_item.druidic.berry");
  assert.equal(berry.itemGenerationHooks?.[0]?.partyLimited, true);
  assert.equal(berry.itemGenerationHooks?.[0]?.dissipatesOnChargeLoss, true);
});
