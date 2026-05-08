import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  accumulateBreakthroughProgress,
  applyBreakthroughGating,
  calculatePlayerEcho,
  canAttemptTrial,
  createPlayerProgressionState,
  evaluateTrialOutcome,
  meetsEchoRequirement,
  meetsGlobalRuleEchoRequirement,
  normalizePlayerProgression,
  resolvePlayerEchoProgression,
  resolveKnowledgeProgressionDifficultyThresholds,
  resolveItemUseProfile,
  resolveKnowledgeAssistance,
  resolveSkillRankGainPolicy,
  resolveSkillProgressionDifficultyThresholds,
  resolveSkillBand,
  validateSpellScalingChannelsForSchool
} from "../../packages/engines/player-engine/src/progression.ts";
import { resolveRunDifficultyModifiers } from "../../packages/engines/player-engine/src/difficulty.ts";

function createEchoPlayerFixture(overrides = {}) {
  return {
    attributes: {
      STR: 10,
      DEX: 10,
      AGI: 10,
      CON: 10,
      VIT: 10,
      WIS: 10,
      INT: 10,
      SPT: 10,
      CHA: 10,
      ...(overrides.attributes ?? {})
    },
    skills: overrides.skills ?? [],
    progression: overrides.progression ?? createPlayerProgressionState()
  };
}

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

test("resolveSkillRankGainPolicy applies gains below the first breakthrough gate", () => {
  const result = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 10,
    rankDelta: 5,
    sourceLabel: "training yard",
    sourceType: "test"
  });

  assert.deepEqual(
    {
      previousRank: result.previousRank,
      requestedRank: result.requestedRank,
      appliedRank: result.appliedRank,
      appliedDelta: result.appliedDelta,
      blockedGate: result.blockedGate,
      requiredBand: result.requiredBand,
      maximumRank: result.maximumRank,
      previousBand: result.previousBand,
      appliedBand: result.appliedBand,
      sourceLabel: result.sourceLabel,
      sourceType: result.sourceType
    },
    {
      previousRank: 10,
      requestedRank: 15,
      appliedRank: 15,
      appliedDelta: 5,
      blockedGate: null,
      requiredBand: null,
      maximumRank: 125,
      previousBand: "clumsy",
      appliedBand: "clumsy",
      sourceLabel: "training yard",
      sourceType: "test"
    }
  );
});

test("resolveSkillRankGainPolicy clamps rank gains at locked breakthrough gates", () => {
  const firstGate = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 29,
    rankDelta: 10
  });
  assert.equal(firstGate.requestedRank, 39);
  assert.equal(firstGate.appliedRank, 30);
  assert.equal(firstGate.appliedDelta, 1);
  assert.equal(firstGate.blockedGate, 30);
  assert.equal(firstGate.requiredBand, "familiar");

  const secondGate = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 50,
    requestedRank: 72,
    unlockedBandIds: ["familiar"]
  });
  assert.equal(secondGate.appliedRank, 55);
  assert.equal(secondGate.blockedGate, 55);
  assert.equal(secondGate.requiredBand, "proficient");

  const thirdGate = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 75,
    requestedRank: 88,
    unlockedBandIds: ["familiar", "proficient"]
  });
  assert.equal(thirdGate.appliedRank, 80);
  assert.equal(thirdGate.blockedGate, 80);
  assert.equal(thirdGate.requiredBand, "skilled");

  const fourthGate = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 95,
    requestedRank: 110,
    unlockedBandIds: ["familiar", "proficient", "skilled"]
  });
  assert.equal(fourthGate.appliedRank, 100);
  assert.equal(fourthGate.blockedGate, 100);
  assert.equal(fourthGate.requiredBand, "mastery");
});

test("resolveSkillRankGainPolicy allows growth through unlocked bands only", () => {
  const result = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentSkill: {
      id: "skill.combat.weapon.sword",
      rank: 29,
      progression: {
        unlockedBandIds: ["familiar"],
        breakthroughProgress: 0
      }
    },
    rankDelta: 10
  });

  assert.equal(result.requestedRank, 39);
  assert.equal(result.appliedRank, 39);
  assert.equal(result.appliedDelta, 10);
  assert.equal(result.blockedGate, null);
  assert.equal(result.requiredBand, null);
  assert.equal(result.appliedBand, "familiar");
});

test("resolveSkillRankGainPolicy clamps at authored maximum rank", () => {
  const result = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 124,
    rankDelta: 10,
    unlockedBandIds: ["familiar", "proficient", "skilled", "mastery"]
  });

  assert.equal(result.requestedRank, 134);
  assert.equal(result.maximumRank, 125);
  assert.equal(result.appliedRank, 125);
  assert.equal(result.appliedDelta, 1);
  assert.equal(result.blockedGate, null);
  assert.equal(result.requiredBand, null);
});

test("resolveSkillRankGainPolicy treats invalid or non-increasing requests as no-ops", () => {
  const zeroDelta = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 12,
    rankDelta: 0
  });
  assert.equal(zeroDelta.requestedRank, 12);
  assert.equal(zeroDelta.appliedRank, 12);
  assert.equal(zeroDelta.appliedDelta, 0);

  const invalidDelta = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 12,
    rankDelta: Number.NaN
  });
  assert.equal(invalidDelta.requestedRank, 12);
  assert.equal(invalidDelta.appliedRank, 12);
  assert.equal(invalidDelta.appliedDelta, 0);

  const lowerTarget = resolveSkillRankGainPolicy({
    skillId: "skill.combat.weapon.sword",
    currentRank: 12,
    requestedRank: 5
  });
  assert.equal(lowerTarget.requestedRank, 5);
  assert.equal(lowerTarget.appliedRank, 12);
  assert.equal(lowerTarget.appliedDelta, 0);
});

test("accumulateBreakthroughProgress scales requirement instead of gain under difficulty", () => {
  const result = accumulateBreakthroughProgress({
    currentProgress: 82,
    performanceScore: 10,
    requirementScalar: 1.3,
    trialBonus: 6
  });

  assert.equal(result.progress, 98);
  assert.equal(result.requiredProgress, 130);
  assert.equal(result.readyToUnlock, false);
});

test("progression difficulty helpers scale requirements and gates without changing gain meaning", () => {
  const base = {
    requirement: 100,
    meaningfulActionThreshold: 10,
    antiTrivialityThreshold: 5,
    trainingGate: 8,
    retentionPressure: 4
  };

  const easySkill = resolveSkillProgressionDifficultyThresholds(base, { tier: "easy", hardcore: false });
  const brutalKnowledge = resolveKnowledgeProgressionDifficultyThresholds(base, {
    tier: "brutal",
    hardcore: false
  });

  assert.deepEqual(easySkill, {
    requirement: 85,
    meaningfulActionThreshold: 8.5,
    antiTrivialityThreshold: 4.5,
    trainingGate: 7.2,
    retentionPressure: 3.6
  });
  assert.deepEqual(brutalKnowledge, {
    requirement: 130,
    meaningfulActionThreshold: 12,
    antiTrivialityThreshold: 6,
    trainingGate: 9.6,
    retentionPressure: 4.8
  });
});

test("difficulty echo requirement scalar is reserved and throws in development-style access", () => {
  const modifiers = resolveRunDifficultyModifiers({ tier: "hard", hardcore: false });

  assert.throws(
    () => modifiers.echo.requirementScalar,
    /reserved for future use/i
  );
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

test("resolveKnowledgeAssistance weights domain knowledge above general lore support and spotting", () => {
  const track = {
    id: "knowledge_domain.flora",
    knowledgeSkillId: "skill.knowledge.flora_lore",
    spottingSkillId: "skill.resource.spotting.flora",
    identifySkillId: "skill.resource.identify.flora",
    generalSupportSkillId: "skill.knowledge.general_lore",
    supportWeights: {
      domainKnowledge: 0.7,
      generalLore: 0.2,
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
    generalLoreRank: 30,
    spottingRank: 20
  });

  assert.ok(result.contributions.domainKnowledge > result.contributions.generalLore);
  assert.ok(result.contributions.generalLore > result.contributions.spotting);
  assert.equal(result.autoIdentify.uncommon, true);
  assert.equal(result.autoIdentify.obscure, false);
});

test("resolveItemUseProfile selects the matching action profile", () => {
  const useProfile = resolveItemUseProfile(
    [
      {
        actionType: "utility.mining",
        primarySkillId: "skill.resource.mining",
        supportSkillIds: ["skill.knowledge.mineral_lore"],
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

test("calculatePlayerEcho only counts stats above authored defaults", () => {
  const baseline = calculatePlayerEcho(createEchoPlayerFixture());
  const stronger = calculatePlayerEcho(
    createEchoPlayerFixture({
      attributes: {
        STR: 15,
        AGI: 8
      }
    })
  );

  assert.equal(baseline.statContribution, 0);
  assert.equal(baseline.echoAdjusted, 0);
  assert.ok(stronger.statContribution > 0);
  assert.ok(stronger.echoAdjusted > baseline.echoAdjusted);
});

test("calculatePlayerEcho uses stable skill references with diminishing returns", () => {
  const novice = calculatePlayerEcho(
    createEchoPlayerFixture({
      skills: [{ id: "skill.combat.weapon.sword", rank: 25, source: "trained" }]
    })
  );
  const veteran = calculatePlayerEcho(
    createEchoPlayerFixture({
      skills: [{ id: "skill.combat.weapon.sword", rank: 100, source: "trained" }]
    })
  );

  assert.ok(veteran.skillContribution > novice.skillContribution);
  assert.ok(veteran.skillContribution < novice.skillContribution * 4);
});

test("calculatePlayerEcho only uses lore skills for knowledge contribution", () => {
  const knowledgeSkillSpecialist = calculatePlayerEcho(
    createEchoPlayerFixture({
      skills: [{ id: "skill.knowledge.flora_lore", rank: 100, source: "trained" }]
    })
  );
  const nonKnowledgeSpecialist = calculatePlayerEcho(
    createEchoPlayerFixture({
      skills: [{ id: "skill.resource.spotting.flora", rank: 100, source: "trained" }]
    })
  );

  assert.ok(knowledgeSkillSpecialist.knowledgeContribution > 0);
  assert.equal(nonKnowledgeSpecialist.knowledgeContribution, 0);
});

test("calculatePlayerEcho caps the diversity bonus at the authored multiplier", () => {
  const versatile = calculatePlayerEcho(
    createEchoPlayerFixture({
      skills: Array.from({ length: 30 }, (_, index) => ({
        id: `skill.synthetic.${index}`,
        rank: 25,
        source: "trained"
      }))
    })
  );

  assert.equal(versatile.diversityCount, 30);
  assert.equal(versatile.diversityBonus, 1.25);
});

test("normalizePlayerProgression migrates legacy power scaffolding into legacyGrowth", () => {
  const normalized = normalizePlayerProgression({
    level: 7,
    classLevel: 2,
    unspentAttributePoints: 3,
    unspentSkillPoints: 4
  });

  assert.equal(normalized.level, 7);
  assert.equal(normalized.legacyGrowth.resourceGrowthLevel, 7);
  assert.equal(normalized.legacyGrowth.classLevel, 2);
  assert.equal(normalized.legacyGrowth.unspentAttributePoints, 3);
  assert.equal(normalized.legacyGrowth.unspentSkillPoints, 4);
  assert.equal(normalized.echo.echoAdjusted, 0);
});

test("resolvePlayerEchoProgression and gating honor echo-derived requirements", () => {
  const playerState = createEchoPlayerFixture({
    attributes: {
      STR: 16,
      DEX: 13,
      AGI: 12,
      INT: 14
    },
    skills: [
      { id: "skill.combat.weapon.sword", rank: 65, source: "trained" },
      { id: "skill.magic.school.elemental", rank: 55, source: "trained" },
      { id: "skill.knowledge.arcane_lore", rank: 70, source: "trained" },
      { id: "skill.crafting.blacksmithing", rank: 25, source: "trained" }
    ],
    progression: {
      level: 0,
      classLevel: 1,
      unspentAttributePoints: 1,
      unspentSkillPoints: 2
    }
  });
  const progression = resolvePlayerEchoProgression(playerState);
  const permissiveRequirement = {
    minLevel: progression.level,
    minEchoAdjusted: progression.echo.echoAdjusted
  };
  const blockedRequirement = {
    minLevel: progression.level + 1,
    minEchoAdjusted: progression.echo.echoAdjusted + 0.5
  };

  assert.equal(meetsEchoRequirement(progression, permissiveRequirement), true);
  assert.equal(
    canAttemptTrial({ echoRequirement: permissiveRequirement }, progression),
    true
  );
  assert.equal(meetsEchoRequirement(progression, blockedRequirement), false);
  assert.equal(canAttemptTrial({ echoRequirement: blockedRequirement }, progression), false);
});

test("global-rule echo requirements gate the enchanter profession without using legacy power level", () => {
  const qualified = resolvePlayerEchoProgression(
    createEchoPlayerFixture({
      attributes: {
        STR: 16,
        DEX: 15,
        AGI: 14,
        CON: 14,
        VIT: 14,
        WIS: 15,
        INT: 17,
        SPT: 15,
        CHA: 13
      },
      skills: [
        { id: "skill.magic.school.elemental", rank: 100, source: "trained" },
        { id: "skill.crafting.blacksmithing", rank: 90, source: "trained" },
        { id: "skill.crafting.weaving", rank: 80, source: "trained" },
        { id: "skill.knowledge.arcane_lore", rank: 95, source: "trained" },
        { id: "skill.knowledge.general_lore", rank: 90, source: "trained" },
        { id: "skill.leadership.authority", rank: 50, source: "trained" }
      ],
      progression: createPlayerProgressionState({
        legacyGrowth: {
          resourceGrowthLevel: 1,
          classLevel: 0
        }
      })
    })
  );
  const blocked = {
    ...qualified,
    legacyGrowth: {
      ...qualified.legacyGrowth,
      resourceGrowthLevel: 99,
      classLevel: 99
    },
    level: 1,
    echo: {
      ...qualified.echo,
      echoAdjusted: 1
    }
  };

  assert.equal(meetsGlobalRuleEchoRequirement("rule.enchanter_profession", qualified), true);
  assert.equal(meetsGlobalRuleEchoRequirement("rule.enchanter_profession", blocked), false);
});



