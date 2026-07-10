import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateCombatHealthVocabularyContent } from "../../tools/content-lint/combat-health-vocabulary.mjs";

const ROOT = process.cwd();
const CONTENT_PATH = "packages/content/base/game/combat_health_vocabulary.json";
const SCHEMA_PATH = "packages/schemas/game/combat-health-vocabulary.schema.json";
const VALIDATOR_PATH = "tools/content-lint/combat-health-vocabulary.mjs";
const INDEX_PATH = "tools/content-lint/index.mjs";
const SCHEMA_FILES_TEST_PATH = "tests/unit/schema-files.test.mjs";

const RELATIONSHIP_AND_DEFERRED_FIELDS = [
  "relatedAbilityIds",
  "relatedSpellIds",
  "relatedSkillEffectIds",
  "relatedItemKeys",
  "relatedMonsterIds",
  "relatedStatusIds",
  "relatedConditionIds",
  "relatedInjuryIds",
  "conditionClass",
  "injuryClass",
  "severityBand",
  "combatPhaseTags"
];

const FORBIDDEN_RUNTIME_FIELDS = [
  "duration",
  "durationTurns",
  "tickRate",
  "stackCount",
  "stacks",
  "maxStacks",
  "magnitude",
  "sourceActorId",
  "targetActorId",
  "startedAtTick",
  "expiresAtTick",
  "damageFormula",
  "damagePerTick",
  "healingFormula",
  "healingPerTick",
  "cureRule",
  "cureItem",
  "immunity",
  "resistance",
  "vulnerability",
  "combatRollModifier",
  "hitChance",
  "critChance",
  "runtimeState",
  "saveState",
  "accountState",
  "uiState",
  "command",
  "event",
  "reward",
  "migration",
  "gameplayEffects"
];

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  const raw = await readText(relativePath);
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson(SCHEMA_PATH);

function record(overrides = {}) {
  return {
    id: "combat_status.stagger",
    slug: "stagger",
    name: "Stagger",
    kind: "status",
    status: "planned",
    family: "control",
    summary: "Static vocabulary for a non-executing stagger combat status.",
    allowedOwnerTypes: ["combat_runtime", "ability"],
    tags: ["control", "interrupt"],
    sourceAuthorityNotes: "In-memory fixture only; no live combat health vocabulary content is authored by this test.",
    notes: "Descriptive vocabulary only; no duration, stacks, damage, healing, runtime state, UI, save state, or gameplay behavior.",
    ...overrides
  };
}

function input(records = [record()], overrides = {}) {
  return {
    relativePath: CONTENT_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    ...overrides
  };
}

function firstRecord(validationInput) {
  return validationInput.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const validationInput = input();
  mutate(validationInput);
  assert.throws(
    () => validateCombatHealthVocabularyContent(validationInput),
    expected
  );
}

function assertNoKeyDeep(value, forbiddenKeys, valuePath = "schema") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoKeyDeep(entry, forbiddenKeys, `${valuePath}[${index}]`));
    return;
  }
  if (typeof value !== "object" || value === null) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    assert.equal(forbiddenKeys.includes(key), false, `${valuePath}.${key} must be absent`);
    assertNoKeyDeep(child, forbiddenKeys, `${valuePath}.${key}`);
  }
}

test("keeps combat health vocabulary content absent and unregistered from normal lint", async () => {
  assert.equal(existsSync(path.join(ROOT, CONTENT_PATH)), false);

  const indexSource = await readText(INDEX_PATH);
  assert.doesNotMatch(indexSource, /combat-health-vocabulary\.mjs/);
  assert.doesNotMatch(indexSource, /combat_health_vocabulary\.json/);
  assert.doesNotMatch(indexSource, /validateCombatHealthVocabularyContent/);
});

test("defines strict combined schema shape without relationship or class fields", () => {
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["records"]);
  assert.equal(schema.properties.records.type, "array");

  const recordSchema = schema.$defs.combatHealthVocabularyRecord;
  assert.equal(recordSchema.additionalProperties, false);
  assert.deepEqual(recordSchema.required, [
    "id",
    "slug",
    "name",
    "kind",
    "status",
    "family",
    "summary",
    "allowedOwnerTypes",
    "tags",
    "sourceAuthorityNotes",
    "notes"
  ]);
  assert.equal(recordSchema.properties.sourceAuthorityNotes.$ref, "#/$defs/nonEmptyString");
  assert.equal(recordSchema.properties.notes.$ref, "#/$defs/nonEmptyString");
  assert.deepEqual(schema.$defs.kind.enum, ["status", "condition", "injury"]);
  assert.deepEqual(schema.$defs.status.enum, ["planned", "active", "retired"]);
  assert.ok(schema.$defs.family.enum.includes("control"));
  assert.ok(schema.$defs.family.enum.includes("recovery"));
  assert.ok(schema.$defs.family.enum.includes("maiming"));
  assert.ok(schema.$defs.allowedOwnerType.enum.includes("future_health_runtime"));
  assert.match(JSON.stringify(recordSchema.allOf), /combat_status/);
  assert.match(JSON.stringify(recordSchema.allOf), /combat_condition/);
  assert.match(JSON.stringify(recordSchema.allOf), /combat_injury/);
  assertNoKeyDeep(recordSchema.properties, RELATIONSHIP_AND_DEFERRED_FIELDS);
});

test("accepts empty wrapper during schema-validator-only phase", () => {
  assert.deepEqual(validateCombatHealthVocabularyContent(input([])), {
    ok: true,
    recordIds: []
  });
});

test("accepts valid status, condition, and injury records and returns sorted ids", () => {
  const records = [
    record({
      id: "combat_injury.cut",
      slug: "cut",
      name: "Cut",
      kind: "injury",
      family: "cut",
      allowedOwnerTypes: ["future_health_runtime"],
      tags: ["wound", "sharp"]
    }),
    record({
      id: "combat_status.stagger",
      slug: "stagger",
      name: "Stagger",
      kind: "status",
      family: "control",
      allowedOwnerTypes: ["combat_runtime", "ability"],
      tags: ["control", "interrupt"]
    }),
    record({
      id: "combat_condition.fatigue",
      slug: "fatigue",
      name: "Fatigue",
      kind: "condition",
      family: "fatigue",
      allowedOwnerTypes: ["body_state", "player_state"],
      tags: ["body", "strain"]
    })
  ];

  assert.deepEqual(validateCombatHealthVocabularyContent(input(records)), {
    ok: true,
    recordIds: [
      "combat_condition.fatigue",
      "combat_injury.cut",
      "combat_status.stagger"
    ]
  });
});

test("does not mutate validator inputs", () => {
  const validationInput = input();
  const before = structuredClone(validationInput);

  validateCombatHealthVocabularyContent(validationInput);

  assert.deepEqual(validationInput, before);
});

test("rejects invalid wrappers and schema objects", async (t) => {
  const cases = [
    ["missing schema", (validationInput) => { validationInput.schema = undefined; }, /schema must be an object/],
    ["non-object schema", (validationInput) => { validationInput.schema = []; }, /schema must be an object/],
    ["non-object wrapper", (validationInput) => { validationInput.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (validationInput) => { validationInput.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (validationInput) => { validationInput.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (validationInput) => { validationInput.wrapper.records = {}; }, /records must be an array/],
    ["non-object record", (validationInput) => { validationInput.wrapper.records = ["stagger"]; }, /records\[0\] must be an object/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects missing fields, extra fields, and non-string note fields", async (t) => {
  const cases = [
    ["missing required field", (validationInput) => { delete firstRecord(validationInput).allowedOwnerTypes; }, /missing required property 'allowedOwnerTypes'/],
    ["extra record property", (validationInput) => { firstRecord(validationInput).unexpectedField = true; }, /unsupported property 'unexpectedField'/],
    ["empty name", (validationInput) => { firstRecord(validationInput).name = ""; }, /name must have length at least 1/],
    ["empty summary", (validationInput) => { firstRecord(validationInput).summary = ""; }, /summary must have length at least 1/],
    ["array source authority notes", (validationInput) => { firstRecord(validationInput).sourceAuthorityNotes = ["fixture"]; }, /sourceAuthorityNotes must be type string/],
    ["empty source authority notes", (validationInput) => { firstRecord(validationInput).sourceAuthorityNotes = ""; }, /sourceAuthorityNotes must have length at least 1/],
    ["array notes", (validationInput) => { firstRecord(validationInput).notes = ["fixture"]; }, /notes must be type string/],
    ["empty notes", (validationInput) => { firstRecord(validationInput).notes = ""; }, /notes must have length at least 1/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects malformed ids, kind prefix mismatch, slug mismatch, and invalid vocabularies", async (t) => {
  const cases = [
    ["status id prefix mismatch", (validationInput) => { firstRecord(validationInput).id = "combat_condition.stagger"; }, /id must match combat_status\.<slug>/],
    ["condition id prefix mismatch", (validationInput) => {
      Object.assign(firstRecord(validationInput), { id: "combat_status.fatigue", slug: "fatigue", kind: "condition", family: "fatigue" });
    }, /id must match combat_condition\.<slug>/],
    ["injury id prefix mismatch", (validationInput) => {
      Object.assign(firstRecord(validationInput), { id: "combat_condition.cut", slug: "cut", kind: "injury", family: "cut" });
    }, /id must match combat_injury\.<slug>/],
    ["slug mismatch", (validationInput) => { firstRecord(validationInput).slug = "staggered"; }, /slug must match id suffix 'stagger'/],
    ["non-lower-snake slug", (validationInput) => { firstRecord(validationInput).slug = "Stagger"; }, /slug must match lower-snake pattern/],
    ["invalid kind", (validationInput) => { firstRecord(validationInput).kind = "effect"; }, /kind must be one of the schema enum values/],
    ["invalid status", (validationInput) => { firstRecord(validationInput).status = "draft"; }, /status must be one of the schema enum values/],
    ["invalid family", (validationInput) => { firstRecord(validationInput).family = "damage_over_time"; }, /family must be one of the schema enum values/],
    ["empty owner list", (validationInput) => { firstRecord(validationInput).allowedOwnerTypes = []; }, /allowedOwnerTypes must contain at least 1 items/],
    ["invalid owner", (validationInput) => { firstRecord(validationInput).allowedOwnerTypes = ["runtime"]; }, /allowedOwnerTypes\[0\] must be one of the schema enum values/],
    ["empty tag list", (validationInput) => { firstRecord(validationInput).tags = []; }, /tags must contain at least 1 items/],
    ["non-lower-snake tag", (validationInput) => { firstRecord(validationInput).tags = ["Status"]; }, /tags\[0\] must match lower-snake pattern/],
    ["forbidden tag", (validationInput) => { firstRecord(validationInput).tags = ["duration_rule"]; }, /tag 'duration_rule' implies forbidden/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects duplicate ids, slugs, names, owners, and tags", async (t) => {
  const cases = [
    ["duplicate ids", (validationInput) => { validationInput.wrapper.records.push(structuredClone(firstRecord(validationInput))); }, /duplicate combat health vocabulary id 'combat_status\.stagger'/],
    ["duplicate slugs", (validationInput) => {
      const duplicate = structuredClone(firstRecord(validationInput));
      duplicate.id = "combat_status.bind";
      validationInput.wrapper.records.push(duplicate);
    }, /duplicate combat health vocabulary slug 'stagger'/],
    ["duplicate names", (validationInput) => {
      const duplicate = structuredClone(firstRecord(validationInput));
      duplicate.id = "combat_status.bind";
      duplicate.slug = "bind";
      validationInput.wrapper.records.push(duplicate);
    }, /duplicate combat health vocabulary name 'Stagger'/],
    ["duplicate owners", (validationInput) => { firstRecord(validationInput).allowedOwnerTypes = ["ability", "ability"]; }, /allowedOwnerTypes must contain unique items/],
    ["duplicate tags", (validationInput) => { firstRecord(validationInput).tags = ["control", "control"]; }, /tags must contain unique items/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects relationship fields, class fields, and phase/severity fields", async (t) => {
  for (const field of RELATIONSHIP_AND_DEFERRED_FIELDS) {
    await t.test(field, () => {
      expectFailure(
        (validationInput) => { firstRecord(validationInput)[field] = ["future"]; },
        new RegExp(`forbidden field '${field}'`)
      );
    });
  }
});

test("recursively rejects runtime, formula, tick, stack, cure, UI, save, and gameplay fields", async (t) => {
  for (const field of FORBIDDEN_RUNTIME_FIELDS) {
    await t.test(field, () => {
      expectFailure(
        (validationInput) => {
          firstRecord(validationInput).notes = {
            text: "Nested forbidden-field fixture.",
            [field]: true
          };
        },
        new RegExp(`forbidden field '${field}'`)
      );
    });
  }
});

test("validator remains pure and outside normal content-lint wiring", async () => {
  const validatorSource = await readText(VALIDATOR_PATH);

  assert.match(validatorSource, /export function validateCombatHealthVocabularyContent/);
  assert.doesNotMatch(validatorSource, /^\s*import\s/m);
  assert.doesNotMatch(validatorSource, /readFile|existsSync|readdir|from "\.\.\/\.\.\/packages\/engines|from "\.\.\/\.\.\/apps|saveState import|accountState import/);
  assert.doesNotMatch(validatorSource, /packages\/engines|apps\/|game-engine|rpg-ui|save\/|account\//);
});

test("schema parse coverage includes the new combat health vocabulary schema", async () => {
  const schemaFilesTestSource = await readText(SCHEMA_FILES_TEST_PATH);
  assert.match(schemaFilesTestSource, new RegExp(SCHEMA_PATH.replaceAll("/", "\\/")));
});
