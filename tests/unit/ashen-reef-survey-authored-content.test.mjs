import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

import { getAshenReefSurveyContent } from "../../packages/engines/game-engine/src/ashen-reef-survey-content.ts";
import { ASHEN_REEF_SURVEY_OFFER } from "../../packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts";

const definitions = JSON.parse(
  await readFile(
    "packages/content/base/civilization/quest_definitions.json",
    "utf8"
  )
);
const schema = JSON.parse(
  await readFile(
    "packages/schemas/civilization/quest-definition.schema.json",
    "utf8"
  )
);

const existingIds = [
  "quest_definition.brineharbor_reef_soundings",
  "quest_definition.coppergate_ore_train_relief",
  "quest_definition.highcrown_catacomb_quietus",
  "quest_definition.aurelis_counterfeit_ring",
  "quest_definition.gullsreach_smokehouse_extortion"
];
const ashen = definitions.records.find(
  (entry) => entry.id === "quest_definition.starfall_ashen_reef_soundings"
);

test("authored Ashen soundings record is exact, nullable, and distinct", () => {
  assert.equal(definitions.records.length, 6);
  assert.deepEqual(
    definitions.records.slice(0, 5).map((entry) => entry.id),
    existingIds
  );
  assert.ok(ashen);
  assert.equal(ashen.slug, "starfall_ashen_reef_soundings");
  assert.equal(ashen.name, "Soundings of Ashen Reef");
  assert.equal(ashen.category, "survey");
  assert.equal(
    ashen.summary,
    "After a major seasonal storm, Starfall Harbormaster's Office commissions fresh soundings of Ashen Reef's channels, breakers, draft-safe approaches, and ruin markers before fishing and commercial traffic intensify."
  );
  assert.deepEqual(ashen.giver, {
    type: "government",
    entityId: null,
    displayName: "Starfall Harbormaster's Office",
    contactName: "Duty Harbormaster",
    settlementId: "settlement.starfall_port"
  });
  assert.equal(ashen.requirements.levelMin, 0);
  for (const key of [
    "classTagsAny",
    "requiredSkills",
    "requiredAbilities",
    "requiredSpells",
    "requiredTraits",
    "requiredItems",
    "standingRequirements"
  ]) {
    assert.deepEqual(ashen.requirements[key], []);
  }
  assert.deepEqual(
    [
      ashen.scheduling.expectedDurationHours,
      ashen.scheduling.dueWithinHours,
      ashen.scheduling.planningWindowHours,
      ashen.rewards.coinBase,
      ashen.rewards.coinBonusOnPerfect,
      ashen.rewards.standingBase
    ],
    [null, null, null, null, null, null]
  );
  assert.equal(ashen.scheduling.repeatable, false);
  assert.equal(ashen.classification.rank, "rank.d");
  assert.deepEqual(
    [
      ashen.deployment.minPartySize,
      ashen.deployment.recommendedPartySize,
      ashen.deployment.maxPartySize
    ],
    [1, 1, 1]
  );
  assert.deepEqual(ashen.logistics, {
    requiredTools: [],
    recommendedTools: [],
    requiredEquipmentTags: [],
    recommendedSpells: [],
    consumedItems: []
  });
  assert.deepEqual(ashen.rewards.itemRewards, []);
  assert.deepEqual(ashen.rewards.unlocks, []);
  assert.deepEqual(ashen.rewards.reputationAwards, []);
  assert.notEqual(
    ashen.id,
    definitions.records[0].id,
    "Brineharbor remains a separate definition"
  );
  assert.doesNotMatch(JSON.stringify(ashen), /580 crown|salvage rights/i);
});

test("Ashen action tree is four sequential descriptive no-check shifts", () => {
  const nodes = ashen.actionTree.nodes;
  assert.equal(ashen.actionTree.entryNodeId, "record_inshore_approach");
  assert.deepEqual(ashen.actionTree.completionNodeIds, ["verify_ruin_markers"]);
  assert.deepEqual(
    nodes.map((node) => node.label),
    ["Inshore Approach", "Working Reef", "Outer Passage", "Ruin Markers"]
  );
  assert.deepEqual(
    nodes.map((node) => node.branches.success.nextNodeId),
    ["survey_working_reef", "survey_outer_passage", "verify_ruin_markers", null]
  );
  for (const node of nodes) {
    assert.equal(node.estimatedHours, null);
    assert.deepEqual(node.assignedRoles, []);
    assert.deepEqual(node.checks, []);
    assert.deepEqual(node.branches.success.effects, []);
    assert.deepEqual(node.participantRange, { min: 1, max: 1 });
  }
  assert.doesNotMatch(
    nodes.map((node) => `${node.label} ${node.summary}`).join(" "),
    /Stormglass Bloom/
  );
});

test("quest schema admits only the bounded authored null semantics", () => {
  assert.equal(schema.$defs.requirements.properties.levelMin.minimum, 0);
  assert.deepEqual(schema.$defs.giver.properties.entityId.type, ["string", "null"]);
  for (const key of [
    "expectedDurationHours",
    "dueWithinHours",
    "planningWindowHours"
  ]) {
    assert.deepEqual(schema.$defs.scheduling.properties[key].type, ["number", "null"]);
  }
  for (const key of ["coinBase", "coinBonusOnPerfect", "standingBase"]) {
    assert.deepEqual(schema.$defs.rewards.properties[key].type, ["integer", "null"]);
  }
  assert.deepEqual(schema.$defs.actionNode.properties.estimatedHours.type, ["number", "null"]);
});

test("version-two runtime presentation stays aligned with the authored offer", () => {
  const content = getAshenReefSurveyContent(2);
  assert.deepEqual(
    {
      title: content.questTitle,
      regionLabel: content.questRegionLabel,
      rewardLabel: content.questRewardLabel,
      summary: content.questSummary,
      rewards: content.questRewards,
      relatedLocations: content.questRelatedLocations,
      tags: content.questTags
    },
    {
      title: ASHEN_REEF_SURVEY_OFFER.title,
      regionLabel: ASHEN_REEF_SURVEY_OFFER.regionLabel,
      rewardLabel: ASHEN_REEF_SURVEY_OFFER.rewardLabel,
      summary: ashen.summary,
      rewards: ASHEN_REEF_SURVEY_OFFER.rewards,
      relatedLocations: ASHEN_REEF_SURVEY_OFFER.relatedLocations,
      tags: ASHEN_REEF_SURVEY_OFFER.tags
    }
  );
});

test("versioned presentation facts do not expose mutable shared arrays", () => {
  const first = getAshenReefSurveyContent(2);
  first.questRewards.push("forged reward");
  first.codexTags.push("forged tag");
  first.codexRegionTags.splice(0, first.codexRegionTags.length, "forged region");

  const fresh = getAshenReefSurveyContent(2);
  assert.deepEqual(fresh.questRewards, [
    "Paid civic contract; exact turn-in terms remain deferred."
  ]);
  assert.deepEqual(fresh.codexTags, ["Starfall Isle", "Alchemy", "Flora"]);
  assert.deepEqual(fresh.codexRegionTags, ["Starfall Isle"]);
});
