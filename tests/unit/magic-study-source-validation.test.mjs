import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateMagicStudySources } from "../../tools/content-lint/magic-study-sources.mjs";

const ROOT = process.cwd();
const MAGIC_STUDY_SOURCE_PATH = "packages/content/base/player/magic_study_sources.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson("packages/schemas/player/magic_study_source.schema.json");
const spellsWrapper = await readJson("packages/content/base/player/spells.json");
const knowledgeDomainRegistryWrapper = await readJson("packages/content/base/player/knowledge_domain_registry.json");
const itemsWrapper = await readJson("packages/content/base/items/items.json");
const magicInfrastructureWrapper = await readJson("packages/content/base/world/magic_infrastructure.json");
const sacredSitesWrapper = await readJson("packages/content/base/world/sacred_sites.json");
const guildsWrapper = await readJson("packages/content/base/civilization/guilds.json");

function source(overrides = {}) {
  return {
    id: "magic_study_source.firebolt_field_notes",
    slug: "firebolt_field_notes",
    name: "Firebolt Field Notes",
    summary: "In-memory magic study source fixture for static validation.",
    sourceMode: "textual_study",
    sourceKind: "book",
    subjectRefs: [
      {
        type: "spell",
        refId: "spell.fire.elemental.firebolt"
      }
    ],
    sourceAnchorRefs: [
      {
        type: "item",
        refId: "reference_book"
      }
    ],
    accessPosture: "study_candidate",
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live magic study source content is authored by this test."
    ],
    notes: [
      "Static source metadata only; no study policy, known-spell acquisition, runtime, UI, storage, rewards, events, or commands."
    ],
    ...overrides
  };
}

function makeInput(records = [source()], overrides = {}) {
  return {
    relativePath: MAGIC_STUDY_SOURCE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    spells: structuredClone(spellsWrapper.records),
    knowledgeDomains: structuredClone(knowledgeDomainRegistryWrapper.records),
    items: structuredClone(itemsWrapper.records),
    magicInfrastructure: structuredClone(magicInfrastructureWrapper.records),
    sacredSites: structuredClone(sacredSitesWrapper.records),
    guilds: structuredClone(guildsWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateMagicStudySources(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts valid minimal planned magic study source fixtures", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    sourceIds: ["magic_study_source.firebolt_field_notes"]
  });
});

test("accepts active spell, spell-family, and spell-school sources with resolvable anchors", async (t) => {
  const cases = [
    [
      "active spell source",
      {
        status: "active",
        subjectRefs: [{ type: "spell", refId: "spell.fire.elemental.firebolt" }]
      }
    ],
    [
      "spell family source",
      {
        subjectRefs: [{ type: "spell_family", refId: "fire" }]
      }
    ],
    [
      "spell school source",
      {
        subjectRefs: [{ type: "spell_school", refId: "elemental" }]
      }
    ],
    [
      "active Knowledge domain source",
      {
        subjectRefs: [{ type: "knowledge_domain", refId: "knowledge_domain.flora" }]
      }
    ],
    [
      "magic infrastructure source",
      {
        sourceAnchorRefs: [{ type: "magic_infrastructure", refId: "magic_service.adventurer_magic" }]
      }
    ],
    [
      "active sacred site source",
      {
        sourceMode: "ritual_context",
        sourceKind: "sacred_site_context",
        sourceAnchorRefs: [
          {
            type: "sacred_site",
            refId: "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine"
          }
        ]
      }
    ],
    [
      "guild source",
      {
        sourceAnchorRefs: [{ type: "guild", refId: "guild.adventurers_guild" }]
      }
    ]
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      const input = makeInput([source(overrides)]);
      assert.equal(validateInput(input).ok, true);
    });
  }
});

test("does not mutate magic study source validation inputs", () => {
  const input = makeInput();
  const before = structuredClone(input);

  validateInput(input);

  assert.deepEqual(input, before);
});

test("rejects invalid wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "runtime field",
      (input) => { record(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects magic study source identity and vocabulary failures", async (t) => {
  await t.test("duplicate source id", () => {
    expectFailure(
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate magic study source id 'magic_study_source\.firebolt_field_notes'/
    );
  });
  await t.test("duplicate source slug", () => {
    expectFailure(
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "magic_study_source.other_notes";
        input.wrapper.records.push(duplicate);
      },
      /duplicate magic study source slug 'firebolt_field_notes'/
    );
  });
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => { record(input).slug = "other_notes"; },
      /id must equal magic_study_source\.other_notes/
    );
  });
  await t.test("invalid status", () => {
    expectFailure(
      (input) => { record(input).status = "draft"; },
      /status must be one of the schema enum values/
    );
  });
  await t.test("invalid access posture", () => {
    expectFailure(
      (input) => { record(input).accessPosture = "available"; },
      /accessPosture must be one of the schema enum values/
    );
  });
  await t.test("invalid source mode", () => {
    expectFailure(
      (input) => { record(input).sourceMode = "self_teaching"; },
      /sourceMode must be one of the schema enum values/
    );
  });
  await t.test("incompatible source kind", () => {
    expectFailure(
      (input) => { record(input).sourceKind = "teacher_instruction"; },
      /sourceKind 'teacher_instruction' is not compatible with sourceMode 'textual_study'/
    );
  });
  await t.test("empty subject refs", () => {
    expectFailure(
      (input) => { record(input).subjectRefs = []; },
      /subjectRefs must contain at least 1 items/
    );
  });
  await t.test("empty anchor refs", () => {
    expectFailure(
      (input) => { record(input).sourceAnchorRefs = []; },
      /sourceAnchorRefs must contain at least 1 items/
    );
  });
  await t.test("duplicate subject refs", () => {
    expectFailure(
      (input) => {
        record(input).subjectRefs.push(structuredClone(record(input).subjectRefs[0]));
      },
      /subjectRefs must contain unique items/
    );
  });
  await t.test("duplicate anchor refs", () => {
    expectFailure(
      (input) => {
        record(input).sourceAnchorRefs.push(structuredClone(record(input).sourceAnchorRefs[0]));
      },
      /sourceAnchorRefs must contain unique items/
    );
  });
});

test("rejects unresolved or inactive magic study subjects", async (t) => {
  const cases = [
    [
      "missing spell id",
      [{ type: "spell", refId: "spell.fire.elemental.missing" }],
      /subjectRef spell 'spell\.fire\.elemental\.missing' is missing/
    ],
    [
      "missing spell family",
      [{ type: "spell_family", refId: "stormfire" }],
      /subjectRef spell_family 'stormfire' is missing/
    ],
    [
      "missing spell school",
      [{ type: "spell_school", refId: "summoning" }],
      /subjectRef spell_school 'summoning' is missing/
    ],
    [
      "missing Knowledge domain",
      [{ type: "knowledge_domain", refId: "knowledge_domain.missing" }],
      /knowledge_domain 'knowledge_domain\.missing' is missing or inactive/
    ],
    [
      "planned Knowledge domain",
      [{ type: "knowledge_domain", refId: "knowledge_domain.arcane_lore" }],
      /knowledge_domain 'knowledge_domain\.arcane_lore' is missing or inactive/
    ]
  ];

  for (const [name, subjectRefs, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input).subjectRefs = subjectRefs; },
        expected
      );
    });
  }
});

test("rejects unresolved, inactive, unsupported, and free-form source anchors", async (t) => {
  const cases = [
    [
      "missing item",
      [{ type: "item", refId: "missing_book" }],
      /sourceAnchorRef item 'missing_book' is missing/
    ],
    [
      "free-form document item",
      [{ type: "item", refId: "document.firebolt_notes" }],
      /sourceAnchorRef item 'document\.firebolt_notes' is missing/
    ],
    [
      "missing magic infrastructure",
      [{ type: "magic_infrastructure", refId: "magic_service.missing" }],
      /magic_infrastructure 'magic_service\.missing' is missing/
    ],
    [
      "missing sacred site",
      [{ type: "sacred_site", refId: "sacred_site.missing.shrine" }],
      /sacred_site 'sacred_site\.missing\.shrine' is missing or inactive/
    ],
    [
      "missing guild",
      [{ type: "guild", refId: "guild.missing" }],
      /sourceAnchorRef guild 'guild\.missing' is missing/
    ],
    [
      "person fails closed when absent",
      [{ type: "person", refId: "person.elda_mire" }],
      /sourceAnchorRef person 'person\.elda_mire' is missing or inactive/
    ],
    [
      "free-form person teacher",
      [{ type: "person", refId: "teacher.elda_mire" }],
      /sourceAnchorRef person 'teacher\.elda_mire' is missing or inactive/
    ],
    [
      "NPC fails closed when absent",
      [{ type: "npc", refId: "npc.elda_mire" }],
      /sourceAnchorRef npc 'npc\.elda_mire' is missing or inactive/
    ],
    [
      "institution fails closed",
      [{ type: "institution", refId: "institution.arcane_college" }],
      /institution anchors are not enabled/
    ],
    [
      "ritual fails closed",
      [{ type: "ritual", refId: "ritual.fire_attunement" }],
      /ritual anchors are not enabled/
    ],
    [
      "trial fails closed",
      [{ type: "trial", refId: "trial.firebolt_practice" }],
      /trial anchors are not enabled/
    ]
  ];

  for (const [name, sourceAnchorRefs, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input).sourceAnchorRefs = sourceAnchorRefs; },
        expected
      );
    });
  }

  await t.test("inactive sacred site authority", () => {
    expectFailure(
      (input) => {
        input.sacredSites[0].status = "planned";
        record(input).sourceMode = "ritual_context";
        record(input).sourceKind = "sacred_site_context";
        record(input).sourceAnchorRefs = [
          {
            type: "sacred_site",
            refId: "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine"
          }
        ];
      },
      /sacred_site 'sacred_site\.glasswake_shrine_lantern_gardens\.glasswake_shrine' is missing or inactive/
    );
  });
});

test("rejects future policy, progress, runtime, acquisition, inventory, UI, and event fields", async (t) => {
  const forbiddenFields = [
    "studyPolicyId",
    "policyRef",
    "prerequisites",
    "progress",
    "evidenceRequirements",
    "completion",
    "rewards",
    "knownSpellAcquisitionRoute",
    "knownSpellGrants",
    "spellbookState",
    "readiness",
    "castingCosts",
    "itemConsumption",
    "craftingOutputs",
    "inventoryMutation",
    "uiState",
    "storageState",
    "commandRefs",
    "eventRefs",
    "gameplayEffects"
  ];

  for (const field of forbiddenFields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("schema is registered while live content and normal lint registration remain absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/player\/magic_study_source\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, MAGIC_STUDY_SOURCE_PATH)), false);
  assert.doesNotMatch(contentLintSource, /magic_study_sources\.json/);
  assert.doesNotMatch(contentLintSource, /magic-study-sources\.mjs/);
});
