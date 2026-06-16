const SUPPORTED_SCHEMA_KEYWORDS = new Set([
  "$schema",
  "$defs",
  "$ref",
  "title",
  "description",
  "type",
  "required",
  "additionalProperties",
  "properties",
  "pattern",
  "enum",
  "minLength",
  "minItems",
  "uniqueItems",
  "items",
  "oneOf"
]);

const SUPPORTED_SCHEMA_TYPES = new Set([
  "array",
  "boolean",
  "integer",
  "null",
  "number",
  "object",
  "string"
]);

const REGION_ID_PATTERN = /^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const REGION_LOCALITY_ID_PATTERN = /^region_locality\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SETTLEMENT_ID_PATTERN = /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const RELIGION_ID_PATTERN = /^religion\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const DEITY_ID_PATTERN = /^deity\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
      .join(",")}}`;
  }
  return `${typeof value}:${JSON.stringify(value)}`;
}

function schemaFailure(schemaPath, message) {
  throw new Error(`religious hotspot schema ${schemaPath} ${message}`);
}

function resolveLocalRef(rootSchema, reference, schemaPath) {
  if (typeof reference !== "string" || !reference.startsWith("#/")) {
    schemaFailure(schemaPath, `uses unsupported reference '${reference}'`);
  }

  let value = rootSchema;
  for (const segment of reference.slice(2).split("/")) {
    const decoded = segment.replaceAll("~1", "/").replaceAll("~0", "~");
    if (!isObject(value) || !Object.hasOwn(value, decoded)) {
      schemaFailure(schemaPath, `references missing location '${reference}'`);
    }
    value = value[decoded];
  }
  return value;
}

function assertSupportedSchema(schema, rootSchema, schemaPath = "$", seen = new Set()) {
  if (!isObject(schema)) {
    schemaFailure(schemaPath, "must be an object");
  }
  if (seen.has(schema)) {
    return;
  }
  seen.add(schema);

  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(keyword)) {
      schemaFailure(schemaPath, `uses unsupported keyword '${keyword}'`);
    }
  }

  for (const keyword of ["$schema", "$ref", "title", "description", "pattern"]) {
    if (schema[keyword] !== undefined && typeof schema[keyword] !== "string") {
      schemaFailure(`${schemaPath}.${keyword}`, "must be a string");
    }
  }

  if (schema.$ref !== undefined) {
    assertSupportedSchema(
      resolveLocalRef(rootSchema, schema.$ref, `${schemaPath}.$ref`),
      rootSchema,
      `${schemaPath}.$ref(${schema.$ref})`,
      seen
    );
  }

  if (schema.type !== undefined && !SUPPORTED_SCHEMA_TYPES.has(schema.type)) {
    schemaFailure(`${schemaPath}.type`, `declares unsupported type '${schema.type}'`);
  }
  if (
    schema.required !== undefined &&
    (!Array.isArray(schema.required) ||
      schema.required.some((entry) => typeof entry !== "string"))
  ) {
    schemaFailure(`${schemaPath}.required`, "must be an array of strings");
  }
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) {
    schemaFailure(`${schemaPath}.additionalProperties`, "must be false for this adapter");
  }
  if (schema.properties !== undefined) {
    if (!isObject(schema.properties)) {
      schemaFailure(`${schemaPath}.properties`, "must be an object");
    }
    for (const [name, propertySchema] of Object.entries(schema.properties)) {
      assertSupportedSchema(propertySchema, rootSchema, `${schemaPath}.properties.${name}`, seen);
    }
  }
  if (schema.$defs !== undefined) {
    if (!isObject(schema.$defs)) {
      schemaFailure(`${schemaPath}.$defs`, "must be an object");
    }
    for (const [name, definition] of Object.entries(schema.$defs)) {
      assertSupportedSchema(definition, rootSchema, `${schemaPath}.$defs.${name}`, seen);
    }
  }
  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    schemaFailure(`${schemaPath}.enum`, "must be an array");
  }
  for (const keyword of ["minLength", "minItems"]) {
    if (
      schema[keyword] !== undefined &&
      (!Number.isInteger(schema[keyword]) || schema[keyword] < 0)
    ) {
      schemaFailure(`${schemaPath}.${keyword}`, "must be a non-negative integer");
    }
  }
  if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
    schemaFailure(`${schemaPath}.uniqueItems`, "must be true for this adapter");
  }
  if (schema.items !== undefined) {
    assertSupportedSchema(schema.items, rootSchema, `${schemaPath}.items`, seen);
  }
  if (schema.oneOf !== undefined) {
    if (!Array.isArray(schema.oneOf) || schema.oneOf.length === 0) {
      schemaFailure(`${schemaPath}.oneOf`, "must be a non-empty array");
    }
    schema.oneOf.forEach((branch, index) => {
      assertSupportedSchema(branch, rootSchema, `${schemaPath}.oneOf[${index}]`, seen);
    });
  }
}

function matchesType(value, type) {
  switch (type) {
    case "array":
      return Array.isArray(value);
    case "boolean":
      return typeof value === "boolean";
    case "integer":
      return Number.isInteger(value);
    case "null":
      return value === null;
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "object":
      return isObject(value);
    case "string":
      return typeof value === "string";
    default:
      return false;
  }
}

function validateValue(value, schema, rootSchema, valuePath, schemaPath = "$") {
  if (schema.$ref !== undefined) {
    validateValue(
      value,
      resolveLocalRef(rootSchema, schema.$ref, `${schemaPath}.$ref`),
      rootSchema,
      valuePath,
      `${schemaPath}.$ref(${schema.$ref})`
    );
  }

  if (schema.type !== undefined && !matchesType(value, schema.type)) {
    throw new Error(`${valuePath} must be type ${schema.type}`);
  }
  if (
    schema.enum !== undefined &&
    !schema.enum.some((candidate) => stableValueKey(candidate) === stableValueKey(value))
  ) {
    throw new Error(`${valuePath} must be one of the schema enum values`);
  }
  if (
    schema.pattern !== undefined &&
    (typeof value !== "string" || !new RegExp(schema.pattern).test(value))
  ) {
    throw new Error(`${valuePath} must match pattern ${schema.pattern}`);
  }
  if (
    schema.minLength !== undefined &&
    (typeof value !== "string" || value.length < schema.minLength)
  ) {
    throw new Error(`${valuePath} must have length at least ${schema.minLength}`);
  }

  if (schema.type === "object") {
    const properties = schema.properties ?? {};
    for (const propertyName of schema.required ?? []) {
      if (!Object.hasOwn(value, propertyName)) {
        throw new Error(`${valuePath} is missing required property '${propertyName}'`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const propertyName of Object.keys(value)) {
        if (!Object.hasOwn(properties, propertyName)) {
          throw new Error(`${valuePath} has unsupported property '${propertyName}'`);
        }
      }
    }
    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, propertyName)) {
        validateValue(
          value[propertyName],
          propertySchema,
          rootSchema,
          `${valuePath}.${propertyName}`,
          `${schemaPath}.properties.${propertyName}`
        );
      }
    }
  }

  if (schema.type === "array") {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      throw new Error(`${valuePath} must contain at least ${schema.minItems} items`);
    }
    if (schema.uniqueItems === true) {
      const seen = new Set();
      for (const entry of value) {
        const key = stableValueKey(entry);
        if (seen.has(key)) {
          throw new Error(`${valuePath} must contain unique items`);
        }
        seen.add(key);
      }
    }
    if (schema.items !== undefined) {
      value.forEach((entry, index) => {
        validateValue(
          entry,
          schema.items,
          rootSchema,
          `${valuePath}[${index}]`,
          `${schemaPath}.items`
        );
      });
    }
  }

  if (schema.oneOf !== undefined) {
    let matches = 0;
    for (const [index, branch] of schema.oneOf.entries()) {
      try {
        validateValue(value, branch, rootSchema, valuePath, `${schemaPath}.oneOf[${index}]`);
        matches += 1;
      } catch {
        // Branch mismatches are expected while evaluating oneOf alternatives.
      }
    }
    if (matches !== 1) {
      throw new Error(`${valuePath} must match exactly one oneOf branch`);
    }
  }
}

function requireRecordWrapper(wrapper, source) {
  if (!isObject(wrapper)) {
    throw new Error(`${source} wrapper must be an object`);
  }
  const keys = Object.keys(wrapper);
  if (keys.length !== 1 || keys[0] !== "records") {
    throw new Error(`${source} wrapper must contain exactly one top-level key: records`);
  }
  if (!Array.isArray(wrapper.records)) {
    throw new Error(`${source} records must be an array`);
  }
  if (wrapper.records.length === 0) {
    throw new Error(`${source} records must be non-empty`);
  }
  return wrapper.records;
}

function requireAuthorityRecords(records, source) {
  if (!Array.isArray(records)) {
    throw new Error(`${source} records must be an array`);
  }
  if (records.length === 0) {
    throw new Error(`${source} records must be non-empty`);
  }
  return records;
}

function buildCanonicalIndex(records, source, pattern) {
  const index = new Map();
  requireAuthorityRecords(records, source).forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.id !== "string" || record.id.length === 0) {
      throw new Error(`${source} records[${recordIndex}] must provide a canonical id`);
    }
    if (!pattern.test(record.id)) {
      throw new Error(`${source} records[${recordIndex}].id '${record.id}' is malformed`);
    }
    if (index.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    index.set(record.id, record);
  });
  return index;
}

function buildReligionIndexes(religions) {
  const religionsById = buildCanonicalIndex(
    religions,
    "world religions",
    RELIGION_ID_PATTERN
  );
  const deitiesById = new Map();

  for (const religion of religionsById.values()) {
    if (!Array.isArray(religion.deities)) {
      throw new Error(`world religions record ${religion.id} deities must be an array`);
    }
    religion.deities.forEach((deity, deityIndex) => {
      const source = `world religion deity authority ${religion.id}.deities[${deityIndex}]`;
      if (!isObject(deity) || typeof deity.id !== "string" || deity.id.length === 0) {
        throw new Error(`${source} must provide a canonical id`);
      }
      if (!DEITY_ID_PATTERN.test(deity.id)) {
        throw new Error(`${source}.id '${deity.id}' is malformed`);
      }
      if (deitiesById.has(deity.id)) {
        throw new Error(`world religion deity authority has duplicate id '${deity.id}'`);
      }
      deitiesById.set(deity.id, {
        record: deity,
        parentReligionId: religion.id
      });
    });
  }

  return { religionsById, deitiesById };
}

function assertKnownReligionIds(ids, religionsById, field, record, relativePath) {
  for (const religionId of ids ?? []) {
    if (!religionsById.has(religionId)) {
      throw new Error(`${relativePath} ${field} '${religionId}' is missing from world.religions on record ${record.id}`);
    }
  }
}

function assertDisjointFaithArrays(record, relativePath) {
  const fields = ["dominantFaithIds", "toleratedFaithIds", "restrictedFaithIds"];
  for (let leftIndex = 0; leftIndex < fields.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < fields.length; rightIndex += 1) {
      const leftField = fields[leftIndex];
      const rightField = fields[rightIndex];
      const rightValues = new Set(record[rightField] ?? []);
      for (const value of record[leftField] ?? []) {
        if (rightValues.has(value)) {
          throw new Error(
            `${relativePath} ${leftField} and ${rightField} both list '${value}' on record ${record.id}`
          );
        }
      }
    }
  }
}

function assertReligionReferences(record, religionsById, deitiesById, relativePath) {
  assertKnownReligionIds(record.religionIds, religionsById, "religionIds", record, relativePath);
  assertKnownReligionIds(record.dominantFaithIds, religionsById, "dominantFaithIds", record, relativePath);
  assertKnownReligionIds(record.toleratedFaithIds, religionsById, "toleratedFaithIds", record, relativePath);
  assertKnownReligionIds(record.restrictedFaithIds, religionsById, "restrictedFaithIds", record, relativePath);

  if (record.status === "active" && (record.dominantFaithIds ?? []).length === 0) {
    throw new Error(`${relativePath} active record ${record.id} must list at least one dominantFaithIds entry`);
  }

  const religionIds = new Set(record.religionIds);
  for (const dominantFaithId of record.dominantFaithIds ?? []) {
    if (!religionIds.has(dominantFaithId)) {
      throw new Error(
        `${relativePath} dominantFaithIds '${dominantFaithId}' must also appear in religionIds on record ${record.id}`
      );
    }
  }
  assertDisjointFaithArrays(record, relativePath);

  for (const deityId of record.deityIds ?? []) {
    const deity = deitiesById.get(deityId);
    if (!deity) {
      throw new Error(`${relativePath} deityIds '${deityId}' is missing from world.religions on record ${record.id}`);
    }
    if (!religionIds.has(deity.parentReligionId)) {
      throw new Error(
        `${relativePath} deityIds '${deityId}' belongs to '${deity.parentReligionId}' which is absent from religionIds on record ${record.id}`
      );
    }
  }
}

function assertPlaceAnchor(record, regionsById, localitiesById, settlementsById, relativePath) {
  const anchor = record.placeAnchor;
  const { macroRegionId, regionId, regionLocalityId, settlementId } = anchor;

  if (regionId === undefined && regionLocalityId === undefined && settlementId === undefined) {
    throw new Error(
      `${relativePath} placeAnchor must include regionId, regionLocalityId, or settlementId on record ${record.id}`
    );
  }

  const macroRegion = macroRegionId === undefined ? null : regionsById.get(macroRegionId);
  if (macroRegionId !== undefined && !macroRegion) {
    throw new Error(`${relativePath} placeAnchor.macroRegionId '${macroRegionId}' is missing on record ${record.id}`);
  }
  if (macroRegion && !["continent", "island_system"].includes(macroRegion.regionType)) {
    throw new Error(
      `${relativePath} placeAnchor.macroRegionId '${macroRegionId}' must reference regionType 'continent' or 'island_system' on record ${record.id}`
    );
  }

  const region = regionId === undefined ? null : regionsById.get(regionId);
  if (regionId !== undefined && !region) {
    throw new Error(`${relativePath} placeAnchor.regionId '${regionId}' is missing on record ${record.id}`);
  }
  if (region && region.regionType !== "subregion") {
    throw new Error(
      `${relativePath} placeAnchor.regionId '${regionId}' must reference regionType 'subregion' on record ${record.id}`
    );
  }
  if (macroRegion && region && region.parentRegionId !== macroRegion.id) {
    throw new Error(
      `${relativePath} placeAnchor.regionId '${regionId}' does not belong to macroRegionId '${macroRegionId}' on record ${record.id}`
    );
  }

  const locality = regionLocalityId === undefined ? null : localitiesById.get(regionLocalityId);
  if (regionLocalityId !== undefined && !locality) {
    throw new Error(
      `${relativePath} placeAnchor.regionLocalityId '${regionLocalityId}' is missing on record ${record.id}`
    );
  }
  if (locality && region && locality.regionId !== region.id) {
    throw new Error(
      `${relativePath} placeAnchor.regionLocalityId '${regionLocalityId}' must share regionId '${regionId}' on record ${record.id}`
    );
  }
  if (locality && macroRegion && locality.macroRegionId !== macroRegion.id) {
    throw new Error(
      `${relativePath} placeAnchor.regionLocalityId '${regionLocalityId}' must share macroRegionId '${macroRegionId}' on record ${record.id}`
    );
  }

  const settlement = settlementId === undefined ? null : settlementsById.get(settlementId);
  if (settlementId !== undefined && !settlement) {
    throw new Error(`${relativePath} placeAnchor.settlementId '${settlementId}' is missing on record ${record.id}`);
  }
  if (settlement && region && settlement.regionId !== region.id) {
    throw new Error(
      `${relativePath} placeAnchor.settlementId '${settlementId}' must share regionId '${regionId}' on record ${record.id}`
    );
  }
  if (settlement && macroRegion && settlement.macroRegionId !== macroRegion.id) {
    throw new Error(
      `${relativePath} placeAnchor.settlementId '${settlementId}' must share macroRegionId '${macroRegionId}' on record ${record.id}`
    );
  }
  if (settlement && locality && settlement.localityBandId !== locality.id) {
    throw new Error(
      `${relativePath} placeAnchor.settlementId '${settlementId}' must share regionLocalityId '${regionLocalityId}' on record ${record.id}`
    );
  }
  if (settlement && locality && settlement.regionId !== locality.regionId) {
    throw new Error(
      `${relativePath} placeAnchor.settlementId '${settlementId}' and regionLocalityId '${regionLocalityId}' must share regionId on record ${record.id}`
    );
  }
  if (settlement && locality && settlement.macroRegionId !== locality.macroRegionId) {
    throw new Error(
      `${relativePath} placeAnchor.settlementId '${settlementId}' and regionLocalityId '${regionLocalityId}' must share macroRegionId on record ${record.id}`
    );
  }
}

function assertNoRuntimeBoundary(record, relativePath) {
  if (record.status !== "active") {
    return;
  }
  const notes = record.notes.join(" ");
  if (
    !/\bdescriptive\b/i.test(notes) ||
    !/\bno runtime\b/i.test(notes) ||
    !/\b(no|without)\b.*\b(consequence|consequences|favorability|law|access|reward|command|gameplay)\b/i.test(notes)
  ) {
    throw new Error(
      `${relativePath} active record ${record.id} notes must include a descriptive no-runtime/no-consequence boundary`
    );
  }
}

export function validateReligiousHotspots({
  relativePath = "packages/content/base/world/religious_hotspots.json",
  wrapper,
  schema,
  religions,
  regions,
  regionLocalities,
  settlements
}) {
  assertSupportedSchema(schema, schema);
  const records = requireRecordWrapper(wrapper, relativePath);
  try {
    validateValue(wrapper, schema, schema, "wrapper");
  } catch (error) {
    throw new Error(`${relativePath} structural validation failed: ${error.message}`);
  }

  const { religionsById, deitiesById } = buildReligionIndexes(religions);
  const regionsById = buildCanonicalIndex(regions, "world regions", REGION_ID_PATTERN);
  const localitiesById = buildCanonicalIndex(
    regionLocalities,
    "world region localities",
    REGION_LOCALITY_ID_PATTERN
  );
  const settlementsById = buildCanonicalIndex(settlements, "world settlements", SETTLEMENT_ID_PATTERN);

  const hotspotIds = new Set();
  for (const record of records) {
    if (hotspotIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate religious hotspot id '${record.id}'`);
    }
    hotspotIds.add(record.id);

    if (record.id !== `religious_hotspot.${record.slug}`) {
      throw new Error(`${relativePath} id must equal religious_hotspot.${record.slug} on record ${record.id}`);
    }

    assertReligionReferences(record, religionsById, deitiesById, relativePath);
    assertPlaceAnchor(record, regionsById, localitiesById, settlementsById, relativePath);
    assertNoRuntimeBoundary(record, relativePath);
  }

  return {
    ok: true,
    hotspotIds: [...hotspotIds].sort()
  };
}
