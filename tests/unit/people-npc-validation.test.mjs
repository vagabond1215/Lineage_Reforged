import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  validateNpcs,
  validatePeople
} from "../../tools/content-lint/people-npcs.mjs";

const ROOT = process.cwd();
const PEOPLE_PATH = "packages/content/base/civilization/people.json";
const NPCS_PATH = "packages/content/base/civilization/npcs.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const personSchema = await readJson("packages/schemas/civilization/person.schema.json");
const npcSchema = await readJson("packages/schemas/civilization/npc.schema.json");
const settlementWrapper = await readJson("packages/content/base/world/settlements.json");

function person(overrides = {}) {
  return {
    id: "person.elda_mire",
    slug: "elda_mire",
    name: "Elda Mire",
    aliases: ["Marsh Elda"],
    summary: "An authored named-person identity fixture for future people authority.",
    lifeStatus: "living",
    status: "planned",
    sourceAuthorityNotes: [
      "In-memory fixture only; no live person content is authored by this test."
    ],
    notes: [
      "Identity authority only; no roles, services, schedules, dialogue, runtime state, UI, storage, or gameplay behavior."
    ],
    ...overrides
  };
}

function npc(overrides = {}) {
  return {
    id: "npc.elda_mire",
    personId: "person.elda_mire",
    presenceMode: "resident",
    interactionPosture: "reference_only",
    status: "planned",
    sourceAuthorityNotes: [
      "In-memory fixture only; no live NPC content is authored by this test."
    ],
    notes: [
      "Presence overlay only; no dialogue, services, relationship mutation, AI, runtime state, UI, storage, or gameplay behavior."
    ],
    ...overrides
  };
}

function makePeopleInput(records = [person()], overrides = {}) {
  return {
    relativePath: PEOPLE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(personSchema),
    ...overrides
  };
}

function makeNpcInput(records = [npc()], overrides = {}) {
  return {
    relativePath: NPCS_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(npcSchema),
    people: [person()],
    ...overrides
  };
}

function validatePersonInput(input = makePeopleInput()) {
  return validatePeople(input);
}

function validateNpcInput(input = makeNpcInput()) {
  return validateNpcs(input);
}

function personRecord(input) {
  return input.wrapper.records[0];
}

function npcRecord(input) {
  return input.wrapper.records[0];
}

function expectPersonFailure(mutate, expected) {
  const input = makePeopleInput();
  mutate(input);
  assert.throws(() => validatePersonInput(input), expected);
}

function expectNpcFailure(mutate, expected) {
  const input = makeNpcInput();
  mutate(input);
  assert.throws(() => validateNpcInput(input), expected);
}

test("accepts valid minimal people fixtures", () => {
  assert.deepEqual(validatePersonInput(), {
    ok: true,
    personIds: ["person.elda_mire"]
  });
});

test("accepts person records with empty aliases and notes", () => {
  const input = makePeopleInput([
    person({
      aliases: [],
      notes: []
    })
  ]);
  assert.equal(validatePersonInput(input).ok, true);
});

test("accepts optional person lineage when a lineage fixture is supplied", () => {
  const input = makePeopleInput(
    [
      person({
        lineageId: "lineage.human"
      })
    ],
    {
      lineages: [
        {
          id: "lineage.human",
          name: "Human"
        }
      ]
    }
  );
  assert.equal(validatePersonInput(input).ok, true);
});

test("does not mutate people or NPC inputs", () => {
  const peopleInput = makePeopleInput();
  const npcInput = makeNpcInput();
  const peopleBefore = structuredClone(peopleInput);
  const npcBefore = structuredClone(npcInput);

  validatePersonInput(peopleInput);
  validateNpcInput(npcInput);

  assert.deepEqual(peopleInput, peopleBefore);
  assert.deepEqual(npcInput, npcBefore);
});

test("rejects invalid person wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "strict record rejection",
      (input) => { personRecord(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectPersonFailure(mutate, expected));
  }
});

test("rejects person id, slug, and vocabulary failures", async (t) => {
  await t.test("duplicate person id", () => {
    expectPersonFailure(
      (input) => { input.wrapper.records.push(structuredClone(personRecord(input))); },
      /duplicate person id 'person\.elda_mire'/
    );
  });
  await t.test("duplicate person slug", () => {
    expectPersonFailure(
      (input) => {
        const duplicate = structuredClone(personRecord(input));
        duplicate.id = "person.other_elda";
        input.wrapper.records.push(duplicate);
      },
      /duplicate person slug 'elda_mire'/
    );
  });
  await t.test("person id slug mismatch", () => {
    expectPersonFailure(
      (input) => { personRecord(input).slug = "elda_marsh"; },
      /id must equal person\.elda_marsh/
    );
  });
  await t.test("invalid person id pattern", () => {
    expectPersonFailure(
      (input) => { personRecord(input).id = "npc.elda_mire"; },
      /id must match pattern/
    );
  });
  await t.test("invalid slug pattern", () => {
    expectPersonFailure(
      (input) => { personRecord(input).slug = "EldaMire"; },
      /slug must match pattern/
    );
  });
  await t.test("invalid lifeStatus", () => {
    expectPersonFailure(
      (input) => { personRecord(input).lifeStatus = "undead"; },
      /lifeStatus must be one of the schema enum values/
    );
  });
  await t.test("invalid status", () => {
    expectPersonFailure(
      (input) => { personRecord(input).status = "draft"; },
      /status must be one of the schema enum values/
    );
  });
});

test("rejects unresolved optional person lineage when a lineage fixture is supplied", () => {
  const input = makePeopleInput(
    [
      person({
        lineageId: "lineage.missing"
      })
    ],
    {
      lineages: [
        {
          id: "lineage.human",
          name: "Human"
        }
      ]
    }
  );
  assert.throws(
    () => validatePersonInput(input),
    /lineageId 'lineage\.missing' is missing from player\.lineages/
  );
});

test("rejects forbidden person authority fields", async (t) => {
  const cases = [
    ["runtime field", "runtimeState"],
    ["role field", "roleIds"],
    ["workplace field", "workplaceId"],
    ["family field", "familyIds"],
    ["relationship field", "relationships"],
    ["schedule field", "scheduleId"],
    ["dialogue field", "dialogueId"],
    ["service field", "serviceIds"],
    ["quest field", "questIds"],
    ["Knowledge field", "knowledgeRefs"],
    ["combat field", "combatProfile"],
    ["generated-person metadata", "generatorSeed"]
  ];

  for (const [name, field] of cases) {
    await t.test(name, () => {
      expectPersonFailure(
        (input) => { personRecord(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("accepts valid NPC overlays for existing people", () => {
  assert.deepEqual(validateNpcInput(), {
    ok: true,
    npcIds: ["npc.elda_mire"]
  });
});

test("accepts NPC primarySettlementId when a settlement fixture is supplied", () => {
  const input = makeNpcInput(
    [
      npc({
        primarySettlementId: "settlement.aurelis"
      })
    ],
    {
      settlements: structuredClone(settlementWrapper.records)
    }
  );
  assert.equal(validateNpcInput(input).ok, true);
});

test("rejects invalid NPC wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "strict record rejection",
      (input) => { npcRecord(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectNpcFailure(mutate, expected));
  }
});

test("rejects NPC identity and reference failures", async (t) => {
  await t.test("duplicate NPC id", () => {
    expectNpcFailure(
      (input) => { input.wrapper.records.push(structuredClone(npcRecord(input))); },
      /duplicate NPC id 'npc\.elda_mire'/
    );
  });
  await t.test("duplicate NPC personId", () => {
    expectNpcFailure(
      (input) => {
        const duplicate = structuredClone(npcRecord(input));
        duplicate.id = "npc.other_elda";
        input.wrapper.records.push(duplicate);
      },
      /duplicate NPC personId 'person\.elda_mire'/
    );
  });
  await t.test("NPC id and personId suffix mismatch", () => {
    expectNpcFailure(
      (input) => { npcRecord(input).id = "npc.other_elda"; },
      /id must equal npc\.elda_mire for person\.elda_mire/
    );
  });
  await t.test("NPC referencing missing person", () => {
    expectNpcFailure(
      (input) => { input.people = []; },
      /personId 'person\.elda_mire' is missing from civilization\.people/
    );
  });
  await t.test("NPC referencing missing settlement", () => {
    expectNpcFailure(
      (input) => {
        npcRecord(input).primarySettlementId = "settlement.missing_harbor";
        input.settlements = structuredClone(settlementWrapper.records);
      },
      /primarySettlementId 'settlement\.missing_harbor' is missing from world\.settlements/
    );
  });
});

test("rejects NPC vocabulary failures", async (t) => {
  await t.test("invalid presenceMode", () => {
    expectNpcFailure(
      (input) => { npcRecord(input).presenceMode = "shopkeeper"; },
      /presenceMode must be one of the schema enum values/
    );
  });
  await t.test("invalid interactionPosture", () => {
    expectNpcFailure(
      (input) => { npcRecord(input).interactionPosture = "dialogue_vendor"; },
      /interactionPosture must be one of the schema enum values/
    );
  });
  await t.test("invalid NPC status", () => {
    expectNpcFailure(
      (input) => { npcRecord(input).status = "draft"; },
      /status must be one of the schema enum values/
    );
  });
});

test("rejects NPC duplicated identity fields and forbidden behavior fields", async (t) => {
  const cases = [
    ["name", "name"],
    ["aliases", "aliases"],
    ["lineageId", "lineageId"],
    ["lifeStatus", "lifeStatus"],
    ["schedule", "scheduleId"],
    ["dialogue", "dialogueId"],
    ["service", "serviceIds"],
    ["relationship", "relationshipValues"],
    ["current location", "currentLocation"],
    ["AI", "aiProfile"],
    ["runtime", "runtimeState"],
    ["storage", "storageState"],
    ["UI", "uiState"],
    ["gameplay", "gameplayEffects"]
  ];

  for (const [name, field] of cases) {
    await t.test(name, () => {
      expectNpcFailure(
        (input) => { npcRecord(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("rejects synthetic and quest-contact-shaped ids as person or NPC records", async (t) => {
  const personIds = [
    "npc_individual.glasswake.operator",
    "npc_household.glasswake.operator",
    "npc.corin_ash"
  ];
  for (const id of personIds) {
    await t.test(`person ${id}`, () => {
      expectPersonFailure(
        (input) => { personRecord(input).id = id; },
        /id must match pattern/
      );
    });
  }

  const npcIds = [
    "npc_individual.glasswake.operator",
    "npc_household.glasswake.operator",
    "person.corin_ash"
  ];
  for (const id of npcIds) {
    await t.test(`npc ${id}`, () => {
      expectNpcFailure(
        (input) => { npcRecord(input).id = id; },
        /id must match pattern/
      );
    });
  }
});

test("schemas are registered but live people/NPC content and normal lint registration are absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/civilization\/person\.schema\.json/);
  assert.match(schemaTestSource, /packages\/schemas\/civilization\/npc\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, PEOPLE_PATH)), false);
  assert.equal(existsSync(path.join(ROOT, NPCS_PATH)), false);
  assert.doesNotMatch(contentLintSource, /civilization\/people\.json/);
  assert.doesNotMatch(contentLintSource, /civilization\/npcs\.json/);
  assert.doesNotMatch(contentLintSource, /people-npcs\.mjs/);
});
