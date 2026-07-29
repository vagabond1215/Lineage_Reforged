const LOWER_SNAKE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const LETHAL_PROCESS_ID_PATTERN = /^lethal_process\.(hemorrhage|airway|respiratory|thermal)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;

const OWNER_DETAILS_BY_PATH = new Map([
  [
    "packages/content/base/game/lethal_process_hemorrhage_definitions.json",
    {
      ownerDomain: "hemorrhage_process",
      ownerSegment: "hemorrhage",
      processFamily: "hemorrhage",
      expectedIds: [
        "lethal_process.hemorrhage.external_hemorrhage",
        "lethal_process.hemorrhage.internal_hemorrhage"
      ]
    }
  ],
  [
    "packages/content/base/game/lethal_process_airway_definitions.json",
    {
      ownerDomain: "airway_process",
      ownerSegment: "airway",
      processFamily: "airway",
      expectedIds: ["lethal_process.airway.obstruction"]
    }
  ],
  [
    "packages/content/base/game/lethal_process_respiratory_definitions.json",
    {
      ownerDomain: "respiratory_process",
      ownerSegment: "respiratory",
      processFamily: "respiratory",
      expectedIds: [
        "lethal_process.respiratory.post_submersion_compromise"
      ]
    }
  ],
  [
    "packages/content/base/game/lethal_process_thermal_definitions.json",
    {
      ownerDomain: "thermal_process",
      ownerSegment: "thermal",
      processFamily: "thermal",
      expectedIds: [
        "lethal_process.thermal.systemic_hypothermia",
        "lethal_process.thermal.hot_altered_crisis"
      ]
    }
  ]
]);

const REQUIRED_WRAPPER_FIELDS = ["ownerDomain", "records"];
const REQUIRED_RECORD_FIELDS = [
  "id",
  "slug",
  "name",
  "definitionOwner",
  "processFamily",
  "catalogLifecycle",
  "semanticVersion",
  "summary",
  "references",
  "tags",
  "sourceAuthorityNotes",
  "notes"
];
const REQUIRED_REFERENCE_FIELDS = ["relation", "targetDomain", "targetId"];

const FORBIDDEN_FIELD_KEYS = [
  "actor",
  "actorId",
  "patient",
  "patientId",
  "body",
  "encounter",
  "episode",
  "instance",
  "instanceId",
  "saveSlot",
  "stage",
  "severity",
  "direction",
  "progression",
  "recurrence",
  "stabilization",
  "suppression",
  "resolution",
  "active",
  "duration",
  "timer",
  "tick",
  "interval",
  "deadline",
  "rate",
  "threshold",
  "temperature",
  "quantity",
  "probability",
  "roll",
  "randomChannel",
  "formula",
  "modifier",
  "damage",
  "healing",
  "symptom",
  "symptoms",
  "diagnosis",
  "assessment",
  "confidence",
  "observer",
  "observerKnowledge",
  "urgency",
  "prognosis",
  "outcome",
  "care",
  "careRequirement",
  "capability",
  "attempt",
  "treatment",
  "procedure",
  "materials",
  "cost",
  "access",
  "consent",
  "destination",
  "provider",
  "service",
  "command",
  "occurrence",
  "result",
  "receipt",
  "event",
  "persistence",
  "save",
  "migration",
  "correction",
  "supersession",
  "death",
  "restoration",
  "resurrection",
  "closure",
  "stakes",
  "account",
  "reward",
  "legacy",
  "runtime",
  "runtimeHook",
  "effect",
  "effects",
  "import",
  "imports",
  "ui",
  "display",
  "displayLabel",
  "dialogue",
  "narrative",
  "chronicle",
  "telemetry",
  "gameplay"
];

const TARGET_ID_PATTERNS = {
  injury: /^combat_injury\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  body_state: /^body_state\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  hazard: /^hazard_profile\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  environment: /^environment\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  poison: /^poison\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  respiratory_process: /^lethal_process\.respiratory\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  magic: /^(?:magic\.[a-z0-9]+(?:_[a-z0-9]+)*|spell(?:\.[a-z0-9]+(?:_[a-z0-9]+)*){2,})$/,
  lethal_process: LETHAL_PROCESS_ID_PATTERN
};

const FORBIDDEN_NORMALIZED_KEYS = new Set(
  FORBIDDEN_FIELD_KEYS.map(normalizeKey)
);

function normalizeKey(value) {
  return String(value).replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${key}:${stableValueKey(value[key])}`)
      .join(",")}}`;
  }
  return `${typeof value}:${JSON.stringify(value)}`;
}

function assertExactKeys(value, expectedKeys, valuePath) {
  if (!isObject(value)) {
    throw new Error(`${valuePath} must be an object`);
  }
  for (const key of expectedKeys) {
    if (!Object.hasOwn(value, key)) {
      throw new Error(
        `${valuePath} structural validation failed: missing required property '${key}'`
      );
    }
  }
  const expected = new Set(expectedKeys);
  for (const key of Object.keys(value)) {
    if (!expected.has(key)) {
      throw new Error(
        `${valuePath} structural validation failed: unsupported property '${key}'`
      );
    }
  }
}

function assertString(value, valuePath) {
  if (typeof value !== "string") {
    throw new Error(`${valuePath} must be type string`);
  }
}

function assertNonEmptyString(value, valuePath) {
  assertString(value, valuePath);
  if (value.length < 1) {
    throw new Error(`${valuePath} must have length at least 1`);
  }
}

function assertUniqueArray(value, valuePath) {
  if (!Array.isArray(value)) {
    throw new Error(`${valuePath} must be type array`);
  }
  const seen = new Set();
  for (const entry of value) {
    const key = stableValueKey(entry);
    if (seen.has(key)) {
      throw new Error(`${valuePath} must contain unique items`);
    }
    seen.add(key);
  }
}

function assertEnum(value, allowed, valuePath) {
  if (!allowed.has(value)) {
    throw new Error(`${valuePath} must be one of the schema enum values`);
  }
}

function enumSet(schema, defName) {
  const values = schema?.$defs?.[defName]?.enum;
  if (!Array.isArray(values) || values.some((value) => typeof value !== "string")) {
    throw new Error(
      `lethal-process schema $defs.${defName}.enum must be an array of strings`
    );
  }
  return new Set(values);
}

function assertLocalReferences(value, valuePath = "schema") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertLocalReferences(entry, `${valuePath}[${index}]`)
    );
    return;
  }
  if (!isObject(value)) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "$ref" && (typeof child !== "string" || !child.startsWith("#/"))) {
      throw new Error(`${valuePath} must use local $ref values only`);
    }
    assertLocalReferences(child, `${valuePath}.${key}`);
  }
}

function assertSchema(schema) {
  if (!isObject(schema)) {
    throw new Error("lethal-process schema must be an object");
  }
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    throw new Error("lethal-process schema must use draft 2020-12");
  }
  if (Object.hasOwn(schema, "$id")) {
    throw new Error("lethal-process schema must not define $id");
  }
  if (
    schema.title !== "LethalProcessDefinitionCatalog" ||
    schema.type !== "object" ||
    schema.additionalProperties !== false
  ) {
    throw new Error("lethal-process schema must define the strict catalog wrapper");
  }
  if (
    !Array.isArray(schema.required) ||
    stableValueKey(schema.required) !== stableValueKey(REQUIRED_WRAPPER_FIELDS)
  ) {
    throw new Error(
      "lethal-process schema wrapper must require ownerDomain and records"
    );
  }
  const recordSchema = schema?.$defs?.lethalProcessDefinition;
  if (
    !isObject(recordSchema) ||
    recordSchema.type !== "object" ||
    recordSchema.additionalProperties !== false ||
    stableValueKey(recordSchema.required) !==
      stableValueKey(REQUIRED_RECORD_FIELDS)
  ) {
    throw new Error("lethal-process schema must define the strict record shape");
  }
  const referenceSchema = schema?.$defs?.reference;
  if (
    !isObject(referenceSchema) ||
    referenceSchema.type !== "object" ||
    referenceSchema.additionalProperties !== false ||
    stableValueKey(referenceSchema.required) !==
      stableValueKey(REQUIRED_REFERENCE_FIELDS)
  ) {
    throw new Error("lethal-process schema must define the strict reference shape");
  }
  assertLocalReferences(schema);
  return {
    owners: enumSet(schema, "definitionOwner"),
    families: enumSet(schema, "processFamily"),
    lifecycles: enumSet(schema, "catalogLifecycle"),
    relations: enumSet(schema, "referenceRelation"),
    targetDomains: enumSet(schema, "referenceTargetDomain")
  };
}

function validateReferenceShape(reference, valuePath, schemaEnums) {
  assertExactKeys(reference, REQUIRED_REFERENCE_FIELDS, valuePath);
  assertEnum(reference.relation, schemaEnums.relations, `${valuePath}.relation`);
  assertEnum(
    reference.targetDomain,
    schemaEnums.targetDomains,
    `${valuePath}.targetDomain`
  );
  assertNonEmptyString(reference.targetId, `${valuePath}.targetId`);
}

function validateRecordShape(record, valuePath, schemaEnums) {
  assertExactKeys(record, REQUIRED_RECORD_FIELDS, valuePath);
  assertNonEmptyString(record.id, `${valuePath}.id`);
  assertNonEmptyString(record.slug, `${valuePath}.slug`);
  if (!LOWER_SNAKE_PATTERN.test(record.slug)) {
    throw new Error(`${valuePath}.slug must match lower-snake pattern`);
  }
  assertNonEmptyString(record.name, `${valuePath}.name`);
  assertEnum(
    record.definitionOwner,
    schemaEnums.owners,
    `${valuePath}.definitionOwner`
  );
  assertEnum(
    record.processFamily,
    schemaEnums.families,
    `${valuePath}.processFamily`
  );
  assertEnum(
    record.catalogLifecycle,
    schemaEnums.lifecycles,
    `${valuePath}.catalogLifecycle`
  );
  if (!Number.isInteger(record.semanticVersion) || record.semanticVersion < 1) {
    throw new Error(`${valuePath}.semanticVersion must be an integer of at least 1`);
  }
  assertNonEmptyString(record.summary, `${valuePath}.summary`);
  assertUniqueArray(record.references, `${valuePath}.references`);
  record.references.forEach((reference, index) =>
    validateReferenceShape(
      reference,
      `${valuePath}.references[${index}]`,
      schemaEnums
    )
  );
  assertUniqueArray(record.tags, `${valuePath}.tags`);
  if (record.tags.length < 1) {
    throw new Error(`${valuePath}.tags must contain at least 1 item`);
  }
  record.tags.forEach((tag, index) => {
    assertString(tag, `${valuePath}.tags[${index}]`);
    if (!LOWER_SNAKE_PATTERN.test(tag)) {
      throw new Error(`${valuePath}.tags[${index}] must match lower-snake pattern`);
    }
  });
  assertNonEmptyString(
    record.sourceAuthorityNotes,
    `${valuePath}.sourceAuthorityNotes`
  );
  assertNonEmptyString(record.notes, `${valuePath}.notes`);
}

function assertNoForbiddenKeys(value, valuePath) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertNoForbiddenKeys(entry, `${valuePath}[${index}]`)
    );
    return;
  }
  if (!isObject(value)) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_NORMALIZED_KEYS.has(normalizeKey(key))) {
      throw new Error(`${valuePath} must not define forbidden field '${key}'`);
    }
    assertNoForbiddenKeys(child, `${valuePath}.${key}`);
  }
}

function assertUniqueField(records, field, label) {
  const seen = new Set();
  for (const record of records) {
    const value = record[field];
    if (seen.has(value)) {
      throw new Error(`lethal-process catalogs have duplicate ${label} '${value}'`);
    }
    seen.add(value);
  }
}

function assertSameMembers(actualValues, expectedValues, label) {
  const actual = [...actualValues].sort();
  const expected = [...expectedValues].sort();
  if (stableValueKey(actual) !== stableValueKey(expected)) {
    throw new Error(
      `${label} must be exactly ${expected.join(", ")}; received ${actual.join(", ")}`
    );
  }
}

function canonicalReferenceSets(authority, schemaEnums) {
  if (!isObject(authority)) {
    throw new Error("canonicalReferenceIdsByTargetDomain must be an object");
  }
  const result = new Map();
  for (const [targetDomain, values] of Object.entries(authority)) {
    assertEnum(
      targetDomain,
      schemaEnums.targetDomains,
      "canonicalReferenceIdsByTargetDomain key"
    );
    assertUniqueArray(
      values,
      `canonicalReferenceIdsByTargetDomain.${targetDomain}`
    );
    const pattern = TARGET_ID_PATTERNS[targetDomain];
    for (const [index, value] of values.entries()) {
      assertNonEmptyString(
        value,
        `canonicalReferenceIdsByTargetDomain.${targetDomain}[${index}]`
      );
      if (!pattern.test(value)) {
        throw new Error(
          `canonicalReferenceIdsByTargetDomain.${targetDomain}[${index}] does not match ${targetDomain} target id pattern`
        );
      }
    }
    result.set(targetDomain, new Set(values));
  }
  return result;
}

function validateReferences(records, referenceSets) {
  const liveIds = new Set(records.map((record) => record.id));
  for (const record of records) {
    for (const reference of record.references) {
      const pattern = TARGET_ID_PATTERNS[reference.targetDomain];
      if (!pattern?.test(reference.targetId)) {
        throw new Error(
          `${record.id} reference targetId '${reference.targetId}' does not match ${reference.targetDomain} target id pattern`
        );
      }
      const injectedTargets = referenceSets.get(reference.targetDomain);
      const isLocalTarget =
        (reference.targetDomain === "lethal_process" ||
          reference.targetDomain === "respiratory_process") &&
        liveIds.has(reference.targetId);
      if (!isLocalTarget && !injectedTargets?.has(reference.targetId)) {
        throw new Error(
          `${record.id} has unresolved ${reference.targetDomain} reference '${reference.targetId}'`
        );
      }
    }
  }
}

export function validateLethalProcessDefinitionCatalogs({
  catalogs,
  schema,
  canonicalReferenceIdsByTargetDomain = {}
}) {
  const schemaEnums = assertSchema(schema);

  if (!Array.isArray(catalogs)) {
    throw new Error("lethal-process catalogs must be an array");
  }

  const seenPaths = new Set();
  const seenOwners = new Set();
  const allRecords = [];

  for (const [catalogIndex, catalog] of catalogs.entries()) {
    assertExactKeys(
      catalog,
      ["relativePath", "wrapper"],
      `catalogs[${catalogIndex}]`
    );
    assertNonEmptyString(
      catalog.relativePath,
      `catalogs[${catalogIndex}].relativePath`
    );
    if (seenPaths.has(catalog.relativePath)) {
      throw new Error(`duplicate lethal-process catalog path '${catalog.relativePath}'`);
    }
    seenPaths.add(catalog.relativePath);

    const expected = OWNER_DETAILS_BY_PATH.get(catalog.relativePath);
    if (!expected) {
      throw new Error(
        `unrecognized lethal-process catalog path '${catalog.relativePath}'`
      );
    }

    assertExactKeys(
      catalog.wrapper,
      REQUIRED_WRAPPER_FIELDS,
      `${catalog.relativePath} wrapper`
    );
    assertEnum(
      catalog.wrapper.ownerDomain,
      schemaEnums.owners,
      `${catalog.relativePath} wrapper.ownerDomain`
    );
    if (!Array.isArray(catalog.wrapper.records)) {
      throw new Error(`${catalog.relativePath} wrapper.records must be type array`);
    }
    if (catalog.wrapper.records.length < 1) {
      throw new Error(`${catalog.relativePath} wrapper.records must not be empty`);
    }
    catalog.wrapper.records.forEach((record, recordIndex) =>
      validateRecordShape(
        record,
        `${catalog.relativePath} wrapper.records[${recordIndex}]`,
        schemaEnums
      )
    );
    allRecords.push(
      ...catalog.wrapper.records.map((record) => ({
        record,
        relativePath: catalog.relativePath,
        expected
      }))
    );
  }

  assertSameMembers(
    seenPaths,
    OWNER_DETAILS_BY_PATH.keys(),
    "lethal-process catalog paths"
  );

  for (const { record, relativePath, expected } of allRecords) {
    assertNoForbiddenKeys(record, `${relativePath} record ${record.id}`);
    if (record.definitionOwner !== expected.ownerDomain) {
      throw new Error(
        `${relativePath} record ${record.id} definitionOwner must match wrapper/path owner '${expected.ownerDomain}'`
      );
    }
    if (record.processFamily !== expected.processFamily) {
      throw new Error(
        `${relativePath} record ${record.id} processFamily must be '${expected.processFamily}'`
      );
    }
    const idMatch = LETHAL_PROCESS_ID_PATTERN.exec(record.id);
    if (!idMatch) {
      throw new Error(`${relativePath} record ${record.id} has invalid lethal-process id`);
    }
    if (idMatch[1] !== expected.ownerSegment) {
      throw new Error(
        `${relativePath} record ${record.id} id owner segment must be '${expected.ownerSegment}'`
      );
    }
    if (idMatch[2] !== record.slug) {
      throw new Error(
        `${relativePath} record ${record.id} slug must match id suffix '${idMatch[2]}'`
      );
    }
    if (record.catalogLifecycle !== "canonical") {
      throw new Error(
        `${relativePath} record ${record.id} catalogLifecycle must be 'canonical'`
      );
    }
    if (record.semanticVersion !== 1) {
      throw new Error(
        `${relativePath} record ${record.id} semanticVersion must be 1`
      );
    }
  }

  for (const catalog of catalogs) {
    if (seenOwners.has(catalog.wrapper.ownerDomain)) {
      throw new Error(
        `duplicate lethal-process catalog owner '${catalog.wrapper.ownerDomain}'`
      );
    }
    seenOwners.add(catalog.wrapper.ownerDomain);
    const expected = OWNER_DETAILS_BY_PATH.get(catalog.relativePath);
    if (catalog.wrapper.ownerDomain !== expected.ownerDomain) {
      throw new Error(
        `${catalog.relativePath} wrapper.ownerDomain must be '${expected.ownerDomain}'`
      );
    }
    assertSameMembers(
      catalog.wrapper.records.map((record) => record.id),
      expected.expectedIds,
      `${catalog.relativePath} record inventory`
    );
  }

  const records = allRecords.map(({ record }) => record);
  assertUniqueField(records, "id", "definition id");
  assertUniqueField(records, "slug", "definition slug");
  assertUniqueField(records, "name", "definition name");

  const referenceSets = canonicalReferenceSets(
    canonicalReferenceIdsByTargetDomain,
    schemaEnums
  );
  validateReferences(records, referenceSets);

  return {
    ok: true,
    definitionIds: records.map((record) => record.id).sort()
  };
}
