import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  validateQuestArchetypeActionTrees,
  validateQuestDefinitionActionTrees
} from "../../tools/content-lint/quest-action-trees.mjs";

const ROOT = process.cwd();
const DEFINITION_PATH = "packages/content/base/civilization/quest_definitions.json";
const ARCHETYPE_PATH = "packages/content/base/civilization/quest_archetypes.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const attributeWrapper = await readJson("packages/content/base/player/attributes.json");
const skillWrapper = await readJson("packages/content/base/player/skills.json");
const abilityWrapper = await readJson("packages/content/base/player/abilities.json");
const spellWrapper = await readJson("packages/content/base/player/spells.json");
const itemWrapper = await readJson("packages/content/base/items/items.json");

function authorities() {
  return {
    attributes: structuredClone(attributeWrapper.records),
    skills: structuredClone(skillWrapper.records),
    abilities: structuredClone(abilityWrapper.records),
    spells: structuredClone(spellWrapper.records),
    items: structuredClone(itemWrapper.records)
  };
}

function deployment(overrides = {}) {
  return {
    minPartySize: 1,
    recommendedPartySize: 2,
    maxPartySize: 3,
    soloAllowed: true,
    roleSlots: [
      {
        slotId: "lead",
        label: "Lead",
        minPeople: 1,
        maxPeople: 1,
        preferredChecks: ["attr.WIS", "skill.knowledge.general_lore"],
        notes: "Owner-local role slot for the focused validator fixture."
      },
      {
        slotId: "support",
        label: "Support",
        minPeople: 0,
        maxPeople: 2,
        preferredChecks: ["basket"],
        notes: "Optional helper slot."
      }
    ],
    partySizeRules: [
      {
        condition: "ifBelowRecommended",
        effect: "Descriptive only."
      }
    ],
    ...overrides
  };
}

function actionTree(overrides = {}) {
  return {
    entryNodeId: "plan",
    completionNodeIds: ["finish"],
    nodes: [
      {
        id: "plan",
        label: "Plan",
        phase: "planning",
        summary: "Choose the route and tools.",
        estimatedHours: 1,
        assignedRoles: ["lead"],
        participantRange: {
          min: 1,
          max: 2
        },
        checks: [
          {
            kind: "attribute",
            targetId: "attr.WIS",
            minValue: 1,
            weight: 1,
            optional: false,
            notes: "Valid attribute check."
          }
        ],
        branches: {
          success: {
            nextNodeId: "finish",
            questState: "advance",
            summary: "Move to completion.",
            effects: ["plan:stable"]
          }
        }
      },
      {
        id: "finish",
        label: "Finish",
        phase: "resolution",
        summary: "Deliver the result.",
        estimatedHours: 1,
        assignedRoles: ["lead"],
        participantRange: {
          min: 1,
          max: 2
        },
        checks: [
          {
            kind: "skill",
            targetId: "skill.knowledge.general_lore",
            minValue: 1,
            weight: 1,
            optional: false,
            notes: "Valid skill check."
          }
        ],
        branches: {
          success: {
            nextNodeId: null,
            questState: "complete",
            summary: "Quest completes.",
            effects: ["result:complete"]
          }
        }
      }
    ],
    ...overrides
  };
}

function definitionRecord(overrides = {}) {
  return {
    id: "quest_definition.test_branching_contract",
    slug: "test_branching_contract",
    deployment: deployment(),
    actionTree: actionTree(),
    ...overrides
  };
}

function archetypeRecord(overrides = {}) {
  return {
    id: "quest_archetype.test_branching_family",
    slug: "test_branching_family",
    deployment: deployment(),
    actionTree: actionTree(),
    ...overrides
  };
}

function makeDefinitionInput(records = [definitionRecord()]) {
  return {
    relativePath: DEFINITION_PATH,
    records: structuredClone(records),
    ...authorities()
  };
}

function makeArchetypeInput(records = [archetypeRecord()]) {
  return {
    relativePath: ARCHETYPE_PATH,
    records: structuredClone(records),
    ...authorities()
  };
}

function validateDefinitions(input = makeDefinitionInput()) {
  return validateQuestDefinitionActionTrees(input);
}

function validateArchetypes(input = makeArchetypeInput()) {
  return validateQuestArchetypeActionTrees(input);
}

function firstRecord(input) {
  return input.records[0];
}

function firstNode(input) {
  return firstRecord(input).actionTree.nodes[0];
}

function firstCheck(input) {
  return firstNode(input).checks[0];
}

function expectDefinitionFailure(mutate, expected) {
  const input = makeDefinitionInput();
  mutate(input);
  assert.throws(() => validateDefinitions(input), expected);
}

function expectArchetypeFailure(mutate, expected) {
  const input = makeArchetypeInput();
  mutate(input);
  assert.throws(() => validateArchetypes(input), expected);
}

test("accepts valid minimal definition-style action tree", () => {
  assert.deepEqual(validateDefinitions(), {
    ok: true,
    questDefinitionIds: ["quest_definition.test_branching_contract"]
  });
});

test("accepts valid minimal archetype-style action tree", () => {
  assert.deepEqual(validateArchetypes(), {
    ok: true,
    questArchetypeIds: ["quest_archetype.test_branching_family"]
  });
});

test("does not mutate inputs", () => {
  const input = makeDefinitionInput();
  const before = structuredClone(input);
  validateDefinitions(input);
  assert.deepEqual(input, before);
});

test("rejects graph and role coherence failures", async (t) => {
  const cases = [
    ["missing entry node", (input) => { firstRecord(input).actionTree.entryNodeId = "missing"; }, /entryNodeId 'missing' missing action node/],
    ["missing completion node", (input) => { firstRecord(input).actionTree.completionNodeIds = ["missing"]; }, /completionNodeId 'missing' missing action node/],
    ["duplicate action node id", (input) => { firstRecord(input).actionTree.nodes[1].id = "plan"; }, /duplicate id 'plan'/],
    ["branch next node missing", (input) => { firstNode(input).branches.success.nextNodeId = "missing"; }, /branch nextNodeId 'missing' missing action node/],
    ["assigned role missing", (input) => { firstNode(input).assignedRoles = ["missing_role"]; }, /assignedRoles 'missing_role' missing deployment roleSlot/],
    ["duplicate role slot id", (input) => { firstRecord(input).deployment.roleSlots[1].slotId = "lead"; }, /duplicate slotId 'lead'/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectDefinitionFailure(mutate, expected));
  }
});

test("rejects range and party-size ordering failures", async (t) => {
  await t.test("participant range", () => {
    expectDefinitionFailure(
      (input) => { firstNode(input).participantRange = { min: 3, max: 2 }; },
      /participantRange min must be <= max/
    );
  });
  await t.test("deployment party size", () => {
    expectDefinitionFailure(
      (input) => { firstRecord(input).deployment = deployment({ minPartySize: 3, recommendedPartySize: 2, maxPartySize: 4 }); },
      /minPartySize <= recommendedPartySize <= maxPartySize/
    );
  });
  await t.test("role slot people range", () => {
    expectDefinitionFailure(
      (input) => { firstRecord(input).deployment.roleSlots[0].minPeople = 2; },
      /roleSlot 'lead' must satisfy minPeople <= maxPeople/
    );
  });
});

test("rejects malformed action checks and authority targets", async (t) => {
  const cases = [
    ["invalid check kind", { kind: "standing", targetId: "standing.local" }, /check kind 'standing' is unsupported/],
    ["malformed attribute target", { kind: "attribute", targetId: "attr.MISSING" }, /missing attribute definition/],
    ["malformed skill target", { kind: "skill", targetId: "skill.missing" }, /missing skill definition/],
    ["malformed ability target", { kind: "ability", targetId: "ability.missing" }, /missing ability definition/],
    ["malformed spell target", { kind: "spell", targetId: "spell.missing" }, /missing spell definition/],
    ["missing tool item key", { kind: "tool", targetId: "missing_tool" }, /missing item definition/],
    ["missing item key", { kind: "item", targetId: "missing_item" }, /missing item definition/],
    ["negative minValue", { minValue: -1 }, /minValue must be a finite number >= 0/],
    ["negative weight", { weight: -1 }, /weight must be a finite number >= 0/],
    ["non-boolean optional", { optional: "false" }, /optional must be boolean/]
  ];

  for (const [name, overrides, expected] of cases) {
    await t.test(name, () => {
      expectDefinitionFailure(
        (input) => { Object.assign(firstCheck(input), overrides); },
        expected
      );
    });
  }
});

test("accepts local descriptive target checks without promoting global authority", () => {
  const input = makeDefinitionInput();
  firstNode(input).checks = [
    {
      kind: "equipment_tag",
      targetId: "shield_ready",
      minValue: 1,
      weight: 0.2,
      optional: true,
      notes: "Local descriptive equipment posture."
    },
    {
      kind: "party_size",
      targetId: "recommended_crew",
      minValue: 2,
      weight: 0.2,
      optional: false,
      notes: "Local party size posture."
    },
    {
      kind: "rng",
      targetId: "weather_window",
      minValue: 40,
      weight: 0.2,
      optional: false,
      notes: "Local randomizer token."
    }
  ];

  assert.equal(validateDefinitions(input).ok, true);

  expectDefinitionFailure(
    (badInput) => {
      firstCheck(badInput).kind = "party_size";
      firstCheck(badInput).targetId = "skill.knowledge.general_lore";
    },
    /party_size targetId 'skill\.knowledge\.general_lore' must be an owner-local descriptive token/
  );
});

test("rejects forbidden global objective, condition, runtime, reward, and presentation fields", async (t) => {
  const cases = [
    ["global objective id field", (input) => { firstNode(input).objectiveId = "quest_objective.global"; }, /objectiveId is forbidden/],
    ["global condition id field", (input) => { firstCheck(input).conditionId = "quest_condition.global"; }, /conditionId is forbidden/],
    ["runtime progress field", (input) => { firstRecord(input).progressState = {}; }, /progressState is forbidden/],
    ["reward execution field", (input) => { firstNode(input).rewardExecution = {}; }, /rewardExecution is forbidden/],
    ["journal mutation field", (input) => { firstRecord(input).journalMutation = {}; }, /journalMutation is forbidden/],
    ["Chronicle mutation field", (input) => { firstRecord(input).chronicleMutation = {}; }, /chronicleMutation is forbidden/],
    ["UI field", (input) => { firstRecord(input).uiState = {}; }, /uiState is forbidden/],
    ["storage field", (input) => { firstRecord(input).storageState = {}; }, /storageState is forbidden/],
    ["gameplay field", (input) => { firstRecord(input).gameplayEffects = []; }, /gameplayEffects is forbidden/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectDefinitionFailure(mutate, expected));
  }
});

test("rejects definition and archetype identity incoherence", async (t) => {
  await t.test("definition id slug mismatch", () => {
    expectDefinitionFailure(
      (input) => { firstRecord(input).slug = "renamed_contract"; },
      /id must equal quest_definition\.renamed_contract/
    );
  });
  await t.test("duplicate definition slug", () => {
    expectDefinitionFailure(
      (input) => {
        const duplicate = structuredClone(firstRecord(input));
        duplicate.id = "quest_definition.other_contract";
        input.records.push(duplicate);
      },
      /duplicate slug 'test_branching_contract'/
    );
  });
  await t.test("archetype id slug mismatch", () => {
    expectArchetypeFailure(
      (input) => { firstRecord(input).slug = "renamed_family"; },
      /id must equal quest_archetype\.renamed_family/
    );
  });
});

test("template generation validation remains separate from action-tree validation", async () => {
  const source = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");
  const templateStart = source.indexOf("async function validateQuestTemplatesAgainstWorldData()");
  const archetypeStart = source.indexOf("async function validateQuestArchetypesAgainstWorldData()");
  const templateSource = source.slice(templateStart, archetypeStart);

  assert.ok(templateStart >= 0);
  assert.ok(archetypeStart > templateStart);
  assert.doesNotMatch(templateSource, /validateQuestDefinitionActionTrees/);
  assert.doesNotMatch(templateSource, /validateQuestArchetypeActionTrees/);
  assert.match(source, /validateQuestDefinitionActionTrees/);
  assert.match(source, /validateQuestArchetypeActionTrees/);
});
