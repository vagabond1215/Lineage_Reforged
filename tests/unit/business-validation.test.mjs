import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateBusinesses } from "../../tools/content-lint/businesses.mjs";

const ROOT = process.cwd();
const CONTENT_PATH = "packages/content/base/civilization/businesses.json";
const SCHEMA_PATH = "packages/schemas/civilization/business.schema.json";
const VALIDATOR_PATH = "tools/content-lint/businesses.mjs";
const INDEX_PATH = "tools/content-lint/index.mjs";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

function business(overrides = {}) {
  return {
    id: "business.lantern_freight",
    slug: "lantern_freight",
    name: "Lantern Freight",
    status: "planned",
    form: "company",
    publicPosture: "public",
    summary: "An in-memory static business identity fixture.",
    sourceAuthorityNotes: [
      "In-memory fixture only; this test does not authorize live business content."
    ],
    notes: [
      "Static identity only; no owners, facilities, providers, property, finance, runtime state, or gameplay behavior."
    ],
    ...overrides
  };
}

function wrapper(records = [business()]) {
  return { records: structuredClone(records) };
}

function firstRecord(value) {
  return value.records[0];
}

function expectIssue(mutate, expected) {
  const value = wrapper();
  mutate(value);
  const issues = validateBusinesses(value);
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

test("accepts valid minimal and empty in-memory business wrappers", () => {
  assert.deepEqual(validateBusinesses(wrapper()), []);
  assert.deepEqual(validateBusinesses({ records: [] }), []);
});

test("defines the strict planned business schema", () => {
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["records"]);
  assert.equal(schema.properties.records.type, "array");
  assert.equal(schema.properties.records.minItems, undefined);

  const recordSchema = schema.$defs.businessRecord;
  assert.equal(recordSchema.additionalProperties, false);
  assert.deepEqual(recordSchema.required, [
    "id", "slug", "name", "status", "form", "publicPosture", "summary", "sourceAuthorityNotes", "notes"
  ]);
  assert.deepEqual(schema.$defs.status.enum, ["planned", "active", "retired"]);
  assert.deepEqual(schema.$defs.form.enum, ["company", "partnership", "cooperative", "other", "unknown"]);
  assert.deepEqual(schema.$defs.publicPosture.enum, ["public", "semi_public", "secret", "unknown"]);
  assert.equal(schema.$defs.sourceAuthorityNotes.minItems, 1);
  assert.equal(schema.$defs.sourceAuthorityNotes.uniqueItems, true);
  assert.equal(schema.$defs.notes.uniqueItems, true);
  assert.equal(Object.hasOwn(schema.properties, "businesses"), false);
  assert.equal(Object.hasOwn(schema.properties, "companies"), false);
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
      assert.ok(validateBusinesses(value).some((issue) => expected.test(issue)));
    });
  }
});

test("rejects non-object records and every missing required field", async (t) => {
  await t.test("non-object record", () => {
    assert.ok(validateBusinesses({ records: [null] }).some((issue) => /records\[0\] must be an object/.test(issue)));
  });
  for (const field of schema.$defs.businessRecord.required) {
    await t.test(`missing ${field}`, () => {
      expectIssue((value) => { delete firstRecord(value)[field]; }, new RegExp(`missing required field '${field}'`));
    });
  }
});

test("rejects unknown fields, invalid identities, and duplicate identities", async (t) => {
  const cases = [
    ["unknown record field", (value) => { firstRecord(value).schemaVersion = 1; }, /unknown field 'schemaVersion'/],
    ["invalid id", (value) => { firstRecord(value).id = "company.lantern_freight"; }, /id must match/],
    ["invalid slug", (value) => { firstRecord(value).slug = "LanternFreight"; }, /slug must match/],
    ["id slug mismatch", (value) => { firstRecord(value).slug = "lantern_cargo"; }, /id must equal business\.lantern_cargo/],
    ["duplicate id", (value) => { value.records.push(business({ slug: "other_freight" })); }, /id duplicates 'business\.lantern_freight'/],
    ["duplicate slug", (value) => { value.records.push(business({ id: "business.other_freight" })); }, /slug duplicates 'lantern_freight'/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }
});

test("rejects blank identity text and invalid vocabularies", async (t) => {
  const cases = [
    ["blank name", (value) => { firstRecord(value).name = "   "; }, /name must be non-empty/],
    ["blank summary", (value) => { firstRecord(value).summary = "\t"; }, /summary must be non-empty/],
    ["untrimmed name", (value) => { firstRecord(value).name = " Lantern Freight"; }, /name must not contain leading or trailing whitespace/],
    ["untrimmed summary", (value) => { firstRecord(value).summary += " "; }, /summary must not contain leading or trailing whitespace/],
    ["invalid status", (value) => { firstRecord(value).status = "closed"; }, /status must be one of/],
    ["invalid form", (value) => { firstRecord(value).form = "sole_trader"; }, /form must be one of/],
    ["invalid public posture", (value) => { firstRecord(value).publicPosture = "private"; }, /publicPosture must be one of/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectIssue(mutate, expected));
  }
});

test("accepts every planned lifecycle, form, and public posture", () => {
  for (const status of schema.$defs.status.enum) {
    assert.deepEqual(validateBusinesses(wrapper([business({ status })])), []);
  }
  for (const form of schema.$defs.form.enum) {
    assert.deepEqual(validateBusinesses(wrapper([business({ form })])), []);
  }
  for (const publicPosture of schema.$defs.publicPosture.enum) {
    assert.deepEqual(validateBusinesses(wrapper([business({ publicPosture })])), []);
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
  assert.deepEqual(validateBusinesses(wrapper([business({ notes: [] })])), []);
});

test("rejects forbidden business field families through strict unknown-field handling", async (t) => {
  const fields = [
    "category", "industry", "businessType", "businessScale",
    "ownerIds", "founderIds", "shareholderIds", "partnerIds", "managerIds", "contactIds", "employeeIds", "members", "leadership", "governance",
    "guildId", "institutionId", "factionId", "polityId", "governmentId", "religionId", "orderId", "familyId", "householdId",
    "settlementId", "districtId", "siteIds", "buildingIds", "workplaceIds", "propertyIds", "branchIds", "locations", "headquarters",
    "services", "serviceIds", "providerTypes", "availability", "serviceArea", "accessRules", "licenses", "permissions",
    "workforce", "jobs", "staffing", "payroll", "schedules", "inputs", "outputs", "production", "upgrades",
    "inventory", "stock", "storage", "prices", "sales", "purchases", "contracts", "shipments", "routes", "revenue", "expenses", "profit", "treasury", "debt", "valuation", "taxes",
    "ownershipState", "operatingState", "estateAssetId", "sourceRunId", "inheritance", "claimState", "storedValueSummary",
    "questIds", "giverType", "contactName", "reputation", "trust", "standing", "favorability", "legalStatus", "recognition", "dialogue", "events", "rewards",
    "runtime", "ledger", "health", "ai", "effects", "commands", "currentActivity", "ui", "saveState", "accountState",
    "parentBusinessId", "brandIds", "ventureIds", "merchantHouseId", "soleTraderPersonId", "generatedCompanyId"
  ];
  for (const field of fields) {
    await t.test(field, () => {
      expectIssue((value) => { firstRecord(value)[field] = {}; }, new RegExp(`unknown field '${field}'`));
    });
  }
});

test("keeps the business validator pure and normal registration absent", async () => {
  assert.equal(existsSync(path.join(ROOT, CONTENT_PATH)), false);

  const validatorSource = await readFile(path.join(ROOT, VALIDATOR_PATH), "utf8");
  assert.doesNotMatch(validatorSource, /node:fs|readFile|existsSync|index\.mjs/);

  const indexSource = await readFile(path.join(ROOT, INDEX_PATH), "utf8");
  assert.doesNotMatch(indexSource, /civilization\/businesses\.json/);
  assert.doesNotMatch(indexSource, /businesses\.mjs/);
  assert.doesNotMatch(indexSource, /validateBusinesses/);
  assert.doesNotMatch(indexSource, /business\.schema/);
});

test("creates no live canonical business record ids in repository content", async () => {
  const contentFiles = await jsonFilesBelow("packages/content/base");
  for (const contentFile of contentFiles) {
    const source = await readFile(path.join(ROOT, contentFile), "utf8");
    assert.doesNotMatch(source, /"id"\s*:\s*"business\.[a-z0-9_]+"/, contentFile);
  }
});

test("does not promote existing quest, demo, account, or generated company strings", async () => {
  const [schemaSource, validatorSource, questSource, demoSource, generatedSource] = await Promise.all([
    readFile(path.join(ROOT, SCHEMA_PATH), "utf8"),
    readFile(path.join(ROOT, VALIDATOR_PATH), "utf8"),
    readFile(path.join(ROOT, "packages/content/base/civilization/quest_definitions.json"), "utf8"),
    readFile(path.join(ROOT, "apps/rpg-ui/src/runtime/demoSnapshot.ts"), "utf8"),
    readFile(path.join(ROOT, "packages/shared/types/src/settlement-institutions.ts"), "utf8")
  ]);

  assert.match(questSource, /business\.ironwheel_haulage_coppergate/);
  assert.match(demoSource, /business\.gannet_cutter/);
  assert.match(generatedSource, /company\.\$\{params\.settlement\.id\}/);
  assert.doesNotMatch(schemaSource, /ironwheel|gannet_cutter|company\.\$\{/i);
  assert.doesNotMatch(validatorSource, /ironwheel|gannet_cutter|company\.\$\{/i);
});
