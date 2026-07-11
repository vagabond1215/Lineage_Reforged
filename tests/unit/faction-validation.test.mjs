import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateFactions } from "../../tools/content-lint/factions.mjs";

const ROOT = process.cwd();
const CONTENT_PATH = "packages/content/base/civilization/factions.json";
const SCHEMA_PATH = "packages/schemas/civilization/faction.schema.json";
const INDEX_PATH = "tools/content-lint/index.mjs";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

function faction(overrides = {}) {
  return {
    id: "faction.river_compact",
    slug: "river_compact",
    name: "River Compact",
    status: "planned",
    category: "political",
    publicPosture: "public",
    summary: "An in-memory static faction identity fixture.",
    sourceAuthorityNotes: [
      "In-memory fixture only; this test does not authorize live faction content."
    ],
    notes: [
      "Static identity only; no membership, reputation, services, law, runtime state, or gameplay behavior."
    ],
    ...overrides
  };
}

function wrapper(records = [faction()]) {
  return { records: structuredClone(records) };
}

function firstRecord(value) {
  return value.records[0];
}

function expectIssue(mutate, expected) {
  const value = wrapper();
  mutate(value);
  const issues = validateFactions(value);
  assert.ok(issues.some((issue) => expected.test(issue)), `Expected ${expected}; received ${JSON.stringify(issues)}`);
}

async function jsonFilesBelow(relativeDirectory) {
  const absoluteDirectory = path.join(ROOT, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativeEntry = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await jsonFilesBelow(relativeEntry));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(relativeEntry);
    }
  }
  return files;
}

const schema = await readJson(SCHEMA_PATH);

test("accepts valid minimal and empty in-memory faction wrappers", () => {
  assert.deepEqual(validateFactions(wrapper()), []);
  assert.deepEqual(validateFactions({ records: [] }), []);
});

test("defines the strict planned faction schema", () => {
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["records"]);
  assert.equal(schema.properties.records.type, "array");
  assert.equal(schema.properties.records.minItems, undefined);

  const recordSchema = schema.$defs.factionRecord;
  assert.equal(recordSchema.additionalProperties, false);
  assert.deepEqual(recordSchema.required, [
    "id",
    "slug",
    "name",
    "status",
    "category",
    "publicPosture",
    "summary",
    "sourceAuthorityNotes",
    "notes"
  ]);
  assert.deepEqual(schema.$defs.status.enum, ["planned", "active", "retired"]);
  assert.deepEqual(schema.$defs.category.enum, [
    "political",
    "social",
    "ideological",
    "criminal",
    "rebel",
    "resistance",
    "advocacy",
    "pressure_group",
    "other"
  ]);
  assert.deepEqual(schema.$defs.publicPosture.enum, ["public", "semi_public", "secret", "unknown"]);
  assert.equal(schema.$defs.sourceAuthorityNotes.minItems, 1);
  assert.equal(schema.$defs.sourceAuthorityNotes.uniqueItems, true);
  assert.equal(schema.$defs.notes.uniqueItems, true);
  assert.equal(Object.hasOwn(schema.properties, "factions"), false);
  assert.equal(Object.hasOwn(schema.properties, "schemaVersion"), false);
});

test("rejects invalid wrapper shapes", async (t) => {
  const cases = [
    ["null wrapper", null, /wrapper must be an object/],
    ["array wrapper", [], /wrapper must be an object/],
    ["missing records", {}, /missing required field 'records'/],
    ["non-array records", { records: {} }, /records must be an array/],
    ["unknown wrapper field", { records: [], schemaVersion: 1 }, /unknown field 'schemaVersion'/]
  ];
  for (const [name, value, expected] of cases) {
    await t.test(name, () => {
      assert.ok(validateFactions(value).some((issue) => expected.test(issue)));
    });
  }
});

test("rejects non-object records and every missing required field", async (t) => {
  await t.test("non-object record", () => {
    assert.ok(validateFactions({ records: [null] }).some((issue) => /records\[0\] must be an object/.test(issue)));
  });

  for (const field of schema.$defs.factionRecord.required) {
    await t.test(`missing ${field}`, () => {
      expectIssue(
        (value) => { delete firstRecord(value)[field]; },
        new RegExp(`missing required field '${field}'`)
      );
    });
  }
});

test("rejects unknown fields, invalid identities, and duplicate identities", async (t) => {
  const cases = [
    ["unknown record field", (value) => { firstRecord(value).schemaVersion = 1; }, /unknown field 'schemaVersion'/],
    ["invalid id", (value) => { firstRecord(value).id = "guild.river_compact"; }, /id must match/],
    ["invalid slug", (value) => { firstRecord(value).slug = "RiverCompact"; }, /slug must match/],
    ["id slug mismatch", (value) => { firstRecord(value).slug = "river_council"; }, /id must equal faction\.river_council/],
    ["duplicate id", (value) => { value.records.push(faction({ slug: "other_compact" })); }, /id duplicates 'faction\.river_compact'/],
    ["duplicate slug", (value) => { value.records.push(faction({ id: "faction.other_compact" })); }, /slug duplicates 'river_compact'/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }
});

test("rejects blank identity text and invalid vocabularies", async (t) => {
  const cases = [
    ["blank name", (value) => { firstRecord(value).name = "   "; }, /name must be non-empty/],
    ["blank summary", (value) => { firstRecord(value).summary = "\t"; }, /summary must be non-empty/],
    ["untrimmed name", (value) => { firstRecord(value).name = " River Compact"; }, /name must not contain leading or trailing whitespace/],
    ["invalid status", (value) => { firstRecord(value).status = "draft"; }, /status must be one of/],
    ["invalid category", (value) => { firstRecord(value).category = "guild"; }, /category must be a supported/],
    ["invalid public posture", (value) => { firstRecord(value).publicPosture = "hidden"; }, /publicPosture must be one of/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }
});

test("rejects invalid provenance and notes", async (t) => {
  const cases = [
    ["empty provenance", (value) => { firstRecord(value).sourceAuthorityNotes = []; }, /sourceAuthorityNotes must contain at least 1 item/],
    ["non-array provenance", (value) => { firstRecord(value).sourceAuthorityNotes = "source"; }, /sourceAuthorityNotes must be an array/],
    ["blank provenance", (value) => { firstRecord(value).sourceAuthorityNotes = [" "]; }, /sourceAuthorityNotes\[0\] must be non-empty/],
    ["duplicate provenance", (value) => { firstRecord(value).sourceAuthorityNotes = ["Source", "Source"]; }, /sourceAuthorityNotes must contain unique items/],
    ["non-array notes", (value) => { firstRecord(value).notes = "note"; }, /notes must be an array/],
    ["blank note", (value) => { firstRecord(value).notes = [""]; }, /notes\[0\] must be non-empty/],
    ["duplicate notes", (value) => { firstRecord(value).notes = ["Note", "Note"]; }, /notes must contain unique items/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }

  assert.deepEqual(validateFactions(wrapper([faction({ notes: [] })])), []);
});

test("rejects forbidden faction field families through strict unknown-field handling", async (t) => {
  const fields = [
    "members",
    "memberIds",
    "leaders",
    "leaderIds",
    "officers",
    "officerIds",
    "ranks",
    "affiliations",
    "relationships",
    "primaryPolityId",
    "primaryReligionId",
    "relatedGuildIds",
    "organizationId",
    "institutionId",
    "governmentId",
    "officeIds",
    "businessIds",
    "companyIds",
    "familyIds",
    "houseIds",
    "lineageIds",
    "standing",
    "reputation",
    "favorability",
    "trust",
    "membershipState",
    "playerStanding",
    "services",
    "providers",
    "accessRules",
    "prices",
    "stock",
    "inventory",
    "contracts",
    "treasury",
    "quests",
    "laws",
    "jurisdictions",
    "diplomacy",
    "conflicts",
    "claims",
    "territory",
    "borders",
    "control",
    "taxes",
    "enforcement",
    "sites",
    "currentLocation",
    "runtime",
    "ai",
    "combatProfiles",
    "dialogue",
    "schedule",
    "effects",
    "saveState",
    "accountState",
    "personIds",
    "npcIds"
  ];

  for (const field of fields) {
    await t.test(field, () => {
      expectIssue(
        (value) => { firstRecord(value)[field] = {}; },
        new RegExp(`unknown field '${field}'`)
      );
    });
  }
});

test("keeps live faction content and normal content-lint registration absent", async () => {
  assert.equal(existsSync(path.join(ROOT, CONTENT_PATH)), false);

  const indexSource = await readFile(path.join(ROOT, INDEX_PATH), "utf8");
  assert.doesNotMatch(indexSource, /factions\.json/);
  assert.doesNotMatch(indexSource, /factions\.mjs/);
  assert.doesNotMatch(indexSource, /validateFactions/);
  assert.doesNotMatch(indexSource, /faction\.schema/);
});

test("creates no live faction candidate ids in repository content", async () => {
  const contentFiles = await jsonFilesBelow("packages/content/base");
  for (const contentFile of contentFiles) {
    const source = await readFile(path.join(ROOT, contentFile), "utf8");
    assert.doesNotMatch(source, /"id"\s*:\s*"faction\.[a-z0-9_]+"/, contentFile);
  }
});
