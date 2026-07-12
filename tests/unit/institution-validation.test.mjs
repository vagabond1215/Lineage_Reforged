import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateInstitutions } from "../../tools/content-lint/institutions.mjs";

const ROOT = process.cwd();
const CONTENT_PATH = "packages/content/base/civilization/institutions.json";
const SCHEMA_PATH = "packages/schemas/civilization/institution.schema.json";
const VALIDATOR_PATH = "tools/content-lint/institutions.mjs";
const INDEX_PATH = "tools/content-lint/index.mjs";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

function institution(overrides = {}) {
  return {
    id: "institution.lantern_archive",
    slug: "lantern_archive",
    name: "Lantern Archive",
    status: "planned",
    category: "archival",
    publicPosture: "public",
    summary: "An in-memory static institution identity fixture.",
    sourceAuthorityNotes: [
      "In-memory fixture only; this test does not authorize live institution content."
    ],
    notes: [
      "Static identity only; no offices, facilities, people, services, Knowledge, runtime state, or gameplay behavior."
    ],
    ...overrides
  };
}

function wrapper(records = [institution()]) {
  return { records: structuredClone(records) };
}

function firstRecord(value) {
  return value.records[0];
}

function expectIssue(mutate, expected) {
  const value = wrapper();
  mutate(value);
  const issues = validateInstitutions(value);
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

test("accepts valid minimal and empty in-memory institution wrappers", () => {
  assert.deepEqual(validateInstitutions(wrapper()), []);
  assert.deepEqual(validateInstitutions({ records: [] }), []);
});

test("defines the strict planned institution schema", () => {
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["records"]);
  assert.equal(schema.properties.records.type, "array");
  assert.equal(schema.properties.records.minItems, undefined);

  const recordSchema = schema.$defs.institutionRecord;
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
    "civic",
    "administrative",
    "judicial",
    "scholarly",
    "charitable",
    "educational",
    "archival",
    "medical",
    "other"
  ]);
  assert.deepEqual(schema.$defs.publicPosture.enum, ["public", "semi_public", "secret", "unknown"]);
  assert.equal(schema.$defs.sourceAuthorityNotes.minItems, 1);
  assert.equal(schema.$defs.sourceAuthorityNotes.uniqueItems, true);
  assert.equal(schema.$defs.notes.uniqueItems, true);
  assert.equal(Object.hasOwn(schema.properties, "institutions"), false);
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
      assert.ok(validateInstitutions(value).some((issue) => expected.test(issue)));
    });
  }
});

test("rejects non-object records and every missing required field", async (t) => {
  await t.test("non-object record", () => {
    assert.ok(validateInstitutions({ records: [null] }).some((issue) => /records\[0\] must be an object/.test(issue)));
  });

  for (const field of schema.$defs.institutionRecord.required) {
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
    ["invalid id", (value) => { firstRecord(value).id = "office.lantern_archive"; }, /id must match/],
    ["invalid slug", (value) => { firstRecord(value).slug = "LanternArchive"; }, /slug must match/],
    ["id slug mismatch", (value) => { firstRecord(value).slug = "lantern_records"; }, /id must equal institution\.lantern_records/],
    ["duplicate id", (value) => { value.records.push(institution({ slug: "other_archive" })); }, /id duplicates 'institution\.lantern_archive'/],
    ["duplicate slug", (value) => { value.records.push(institution({ id: "institution.other_archive" })); }, /slug duplicates 'lantern_archive'/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }
});

test("rejects blank identity text and invalid vocabularies", async (t) => {
  const cases = [
    ["blank name", (value) => { firstRecord(value).name = "   "; }, /name must be non-empty/],
    ["blank summary", (value) => { firstRecord(value).summary = "\t"; }, /summary must be non-empty/],
    ["untrimmed name", (value) => { firstRecord(value).name = " Lantern Archive"; }, /name must not contain leading or trailing whitespace/],
    ["untrimmed summary", (value) => { firstRecord(value).summary += " "; }, /summary must not contain leading or trailing whitespace/],
    ["invalid status", (value) => { firstRecord(value).status = "draft"; }, /status must be one of/],
    ["invalid category", (value) => { firstRecord(value).category = "guild"; }, /category must be a supported/],
    ["invalid public posture", (value) => { firstRecord(value).publicPosture = "private"; }, /publicPosture must be one of/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }
});

test("accepts every planned category and public posture", () => {
  const categories = schema.$defs.category.enum;
  const postures = schema.$defs.publicPosture.enum;
  for (const category of categories) {
    assert.deepEqual(validateInstitutions(wrapper([institution({ category })])), []);
  }
  for (const publicPosture of postures) {
    assert.deepEqual(validateInstitutions(wrapper([institution({ publicPosture })])), []);
  }
});

test("rejects invalid provenance and notes", async (t) => {
  const cases = [
    ["empty provenance", (value) => { firstRecord(value).sourceAuthorityNotes = []; }, /sourceAuthorityNotes must contain at least 1 item/],
    ["non-array provenance", (value) => { firstRecord(value).sourceAuthorityNotes = "source"; }, /sourceAuthorityNotes must be an array/],
    ["blank provenance", (value) => { firstRecord(value).sourceAuthorityNotes = [" "]; }, /sourceAuthorityNotes\[0\] must be non-empty/],
    ["untrimmed provenance", (value) => { firstRecord(value).sourceAuthorityNotes = [" Source"]; }, /sourceAuthorityNotes\[0\] must not contain/],
    ["duplicate provenance", (value) => { firstRecord(value).sourceAuthorityNotes = ["Source", "Source"]; }, /sourceAuthorityNotes must contain unique items/],
    ["non-array notes", (value) => { firstRecord(value).notes = "note"; }, /notes must be an array/],
    ["blank note", (value) => { firstRecord(value).notes = [""]; }, /notes\[0\] must be non-empty/],
    ["untrimmed note", (value) => { firstRecord(value).notes = ["Note "]; }, /notes\[0\] must not contain/],
    ["duplicate notes", (value) => { firstRecord(value).notes = ["Note", "Note"]; }, /notes must contain unique items/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }

  assert.deepEqual(validateInstitutions(wrapper([institution({ notes: [] })])), []);
});

test("rejects forbidden institution field families through strict unknown-field handling", async (t) => {
  const fields = [
    "officeIds", "governmentId", "jurisdictionIds", "laws", "courtProcedures", "forceIds", "enforcement", "territory", "taxes",
    "polityId", "guildIds", "factionIds", "religionIds", "orderIds", "businessIds", "companyIds", "familyIds", "houseIds",
    "settlementId", "districtId", "siteIds", "buildingIds", "facilities", "location",
    "members", "memberIds", "leaders", "leaderIds", "staff", "employeeIds", "officeHolders", "teachers", "healers", "judges", "ranks", "affiliations", "relationships",
    "services", "providerTypes", "availability", "accessRules", "prices", "fees", "stock", "inventory", "contracts", "treasury", "schedule",
    "reputation", "standing", "favorability", "recognition", "membershipState", "employmentState", "accessState",
    "knowledgeSubjects", "knowledgeRewards", "magicStudySources", "curriculum", "spells", "quests", "dialogue",
    "runtime", "ai", "effects", "commands", "events", "saveState", "accountState", "ui", "personIds", "npcIds"
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

test("keeps the institution validator pure and normal registration absent", async () => {
  assert.equal(existsSync(path.join(ROOT, CONTENT_PATH)), false);

  const validatorSource = await readFile(path.join(ROOT, VALIDATOR_PATH), "utf8");
  assert.doesNotMatch(validatorSource, /node:fs|readFile|existsSync|index\.mjs/);

  const indexSource = await readFile(path.join(ROOT, INDEX_PATH), "utf8");
  assert.doesNotMatch(indexSource, /civilization\/institutions\.json/);
  assert.doesNotMatch(indexSource, /institutions\.mjs/);
  assert.doesNotMatch(indexSource, /validateInstitutions/);
  assert.doesNotMatch(indexSource, /institution\.schema/);
});

test("creates no live institution candidate ids in repository content", async () => {
  const contentFiles = await jsonFilesBelow("packages/content/base");
  for (const contentFile of contentFiles) {
    const source = await readFile(path.join(ROOT, contentFile), "utf8");
    assert.doesNotMatch(source, /"id"\s*:\s*"institution\.[a-z0-9_]+"/, contentFile);
  }
});
