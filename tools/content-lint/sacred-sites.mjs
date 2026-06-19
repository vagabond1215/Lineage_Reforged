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
  "items"
]);

const SUPPORTED_SCHEMA_TYPES = new Set(["array", "object", "string"]);
const SACRED_SITE_ID_PATTERN = /^sacred_site\.([a-z0-9]+(?:_[a-z0-9]+)*)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const RELIGION_ID_PATTERN = /^religion\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const DEITY_ID_PATTERN = /^deity\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const HOTSPOT_ID_PATTERN = /^religious_hotspot\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const REGION_ID_PATTERN = /^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const LOCALITY_ID_PATTERN = /^region_locality\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SETTLEMENT_ID_PATTERN = /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${key}:${stableValueKey(value[key])}`).join(",")}}`;
  }
  return `${typeof value}:${JSON.stringify(value)}`;
}

function schemaFailure(path, message) {
  throw new Error(`sacred site schema ${path} ${message}`);
}

function resolveLocalRef(rootSchema, reference, path) {
  if (typeof reference !== "string" || !reference.startsWith("#/")) {
    schemaFailure(path, `uses unsupported reference '${reference}'`);
  }
  let value = rootSchema;
  for (const segment of reference.slice(2).split("/")) {
    const decoded = segment.replaceAll("~1", "/").replaceAll("~0", "~");
    if (!isObject(value) || !Object.hasOwn(value, decoded)) {
      schemaFailure(path, `references missing location '${reference}'`);
    }
    value = value[decoded];
  }
  return value;
}

function assertSupportedSchema(schema, rootSchema, path = "$", seen = new Set()) {
  if (!isObject(schema)) {
    schemaFailure(path, "must be an object");
  }
  if (seen.has(schema)) {
    return;
  }
  seen.add(schema);

  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(keyword)) {
      schemaFailure(path, `uses unsupported keyword '${keyword}'`);
    }
  }
  if (schema.$ref !== undefined) {
    assertSupportedSchema(resolveLocalRef(rootSchema, schema.$ref, `${path}.$ref`), rootSchema, `${path}.$ref(${schema.$ref})`, seen);
  }
  if (schema.type !== undefined && !SUPPORTED_SCHEMA_TYPES.has(schema.type)) {
    schemaFailure(`${path}.type`, `declares unsupported type '${schema.type}'`);
  }
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) {
    schemaFailure(`${path}.additionalProperties`, "must be false for this adapter");
  }
  if (schema.required !== undefined && (!Array.isArray(schema.required) || schema.required.some((entry) => typeof entry !== "string"))) {
    schemaFailure(`${path}.required`, "must be an array of strings");
  }
  for (const [key, value] of Object.entries(schema.properties ?? {})) {
    assertSupportedSchema(value, rootSchema, `${path}.properties.${key}`, seen);
  }
  for (const [key, value] of Object.entries(schema.$defs ?? {})) {
    assertSupportedSchema(value, rootSchema, `${path}.$defs.${key}`, seen);
  }
  if (schema.items !== undefined) {
    assertSupportedSchema(schema.items, rootSchema, `${path}.items`, seen);
  }
  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    schemaFailure(`${path}.enum`, "must be an array");
  }
  for (const keyword of ["minLength", "minItems"]) {
    if (schema[keyword] !== undefined && (!Number.isInteger(schema[keyword]) || schema[keyword] < 0)) {
      schemaFailure(`${path}.${keyword}`, "must be a non-negative integer");
    }
  }
  if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
    schemaFailure(`${path}.uniqueItems`, "must be true for this adapter");
  }
}

function matchesType(value, type) {
  return type === "array" ? Array.isArray(value) : type === "object" ? isObject(value) : typeof value === type;
}

function validateValue(value, schema, rootSchema, valuePath, schemaPath = "$") {
  if (schema.$ref !== undefined) {
    validateValue(value, resolveLocalRef(rootSchema, schema.$ref, `${schemaPath}.$ref`), rootSchema, valuePath, `${schemaPath}.$ref(${schema.$ref})`);
  }
  if (schema.type !== undefined && !matchesType(value, schema.type)) {
    throw new Error(`${valuePath} must be type ${schema.type}`);
  }
  if (schema.enum !== undefined && !schema.enum.some((candidate) => stableValueKey(candidate) === stableValueKey(value))) {
    throw new Error(`${valuePath} must be one of the schema enum values`);
  }
  if (schema.pattern !== undefined && (typeof value !== "string" || !new RegExp(schema.pattern).test(value))) {
    throw new Error(`${valuePath} must match pattern ${schema.pattern}`);
  }
  if (schema.minLength !== undefined && (typeof value !== "string" || value.length < schema.minLength)) {
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
        validateValue(value[propertyName], propertySchema, rootSchema, `${valuePath}.${propertyName}`, `${schemaPath}.properties.${propertyName}`);
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
    value.forEach((entry, index) => {
      if (schema.items !== undefined) {
        validateValue(entry, schema.items, rootSchema, `${valuePath}[${index}]`, `${schemaPath}.items`);
      }
    });
  }
}

function requireRecordsWrapper(wrapper, relativePath) {
  if (!isObject(wrapper)) {
    throw new Error(`${relativePath} wrapper must be an object`);
  }
  const keys = Object.keys(wrapper);
  if (keys.length !== 1 || keys[0] !== "records") {
    throw new Error(`${relativePath} wrapper must contain exactly one top-level key: records`);
  }
  if (!Array.isArray(wrapper.records)) {
    throw new Error(`${relativePath} records must be an array`);
  }
  if (wrapper.records.length === 0) {
    throw new Error(`${relativePath} records must be non-empty`);
  }
  return wrapper.records;
}

function buildIndex(records, source, pattern) {
  if (!Array.isArray(records)) {
    throw new Error(`${source} records must be an array`);
  }
  const index = new Map();
  records.forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.id !== "string" || !pattern.test(record.id)) {
      throw new Error(`${source} records[${recordIndex}] must provide a canonical id`);
    }
    if (index.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    index.set(record.id, record);
  });
  return index;
}

function buildReligionIndexes(religions) {
  const religionsById = buildIndex(religions, "world religions", RELIGION_ID_PATTERN);
  const deitiesById = new Map();
  for (const religion of religionsById.values()) {
    for (const deity of religion.deities ?? []) {
      if (!isObject(deity) || typeof deity.id !== "string" || !DEITY_ID_PATTERN.test(deity.id)) {
        throw new Error(`world religion ${religion.id} has malformed deity authority`);
      }
      if (deitiesById.has(deity.id)) {
        throw new Error(`world religions have duplicate deity id '${deity.id}'`);
      }
      deitiesById.set(deity.id, { record: deity, parentReligionId: religion.id });
    }
  }
  return { religionsById, deitiesById };
}

function assertPlaceAnchor(record, regionsById, localitiesById, settlementsById, relativePath) {
  const { macroRegionId, regionId, regionLocalityId, settlementId } = record.placeAnchor;
  const macroRegion = regionsById.get(macroRegionId);
  const region = regionsById.get(regionId);
  if (!macroRegion) {
    throw new Error(`${relativePath} placeAnchor.macroRegionId '${macroRegionId}' is missing on record ${record.id}`);
  }
  if (!region) {
    throw new Error(`${relativePath} placeAnchor.regionId '${regionId}' is missing on record ${record.id}`);
  }
  if (!['continent', 'island_system'].includes(macroRegion.regionType)) {
    throw new Error(`${relativePath} placeAnchor.macroRegionId '${macroRegionId}' must reference a macro region on record ${record.id}`);
  }
  if (region.regionType !== "subregion" || region.parentRegionId !== macroRegionId) {
    throw new Error(`${relativePath} placeAnchor.regionId '${regionId}' must be a subregion of '${macroRegionId}' on record ${record.id}`);
  }
  const locality = regionLocalityId === undefined ? null : localitiesById.get(regionLocalityId);
  if (regionLocalityId !== undefined && !locality) {
    throw new Error(`${relativePath} placeAnchor.regionLocalityId '${regionLocalityId}' is missing on record ${record.id}`);
  }
  if (locality && (locality.regionId !== regionId || locality.macroRegionId !== macroRegionId)) {
    throw new Error(`${relativePath} placeAnchor.regionLocalityId '${regionLocalityId}' is incoherent on record ${record.id}`);
  }
  const settlement = settlementId === undefined ? null : settlementsById.get(settlementId);
  if (settlementId !== undefined && !settlement) {
    throw new Error(`${relativePath} placeAnchor.settlementId '${settlementId}' is missing on record ${record.id}`);
  }
  if (settlement && (settlement.regionId !== regionId || settlement.macroRegionId !== macroRegionId)) {
    throw new Error(`${relativePath} placeAnchor.settlementId '${settlementId}' is incoherent on record ${record.id}`);
  }
  if (settlement && locality && settlement.localityBandId !== regionLocalityId) {
    throw new Error(`${relativePath} placeAnchor.settlementId '${settlementId}' must share regionLocalityId '${regionLocalityId}' on record ${record.id}`);
  }
}

function assertParentCoherence(record, parent, relativePath) {
  for (const field of ["macroRegionId", "regionId", "regionLocalityId", "settlementId"]) {
    if (parent.placeAnchor?.[field] !== undefined && record.placeAnchor[field] !== parent.placeAnchor[field]) {
      throw new Error(`${relativePath} placeAnchor.${field} must match parent hotspot ${parent.id} on record ${record.id}`);
    }
  }
  if (record.status === "active" && parent.status !== "active") {
    throw new Error(`${relativePath} active record ${record.id} requires an active parent religious hotspot`);
  }
}

function assertReligionReferences(record, religionsById, deitiesById, relativePath) {
  for (const religionId of record.religionIds) {
    if (!religionsById.has(religionId)) {
      throw new Error(`${relativePath} religionIds '${religionId}' is missing from world.religions on record ${record.id}`);
    }
  }
  const religionIds = new Set(record.religionIds);
  for (const deityId of record.deityIds ?? []) {
    const deity = deitiesById.get(deityId);
    if (!deity) {
      throw new Error(`${relativePath} deityIds '${deityId}' is missing from world.religions on record ${record.id}`);
    }
    if (!religionIds.has(deity.parentReligionId)) {
      throw new Error(`${relativePath} deityIds '${deityId}' belongs to '${deity.parentReligionId}' which is absent from religionIds on record ${record.id}`);
    }
  }
  if (Object.hasOwn(record, "religiousOrderIds")) {
    throw new Error(`${relativePath} religiousOrderIds is unavailable until canonical religious-order authority exists on record ${record.id}`);
  }
}

export function validateSacredSites({
  relativePath = "packages/content/base/world/sacred_sites.json",
  wrapper,
  schema,
  religions,
  religiousHotspots,
  regions,
  regionLocalities,
  settlements
}) {
  assertSupportedSchema(schema, schema);
  const records = requireRecordsWrapper(wrapper, relativePath);
  try {
    validateValue(wrapper, schema, schema, "wrapper");
  } catch (error) {
    throw new Error(`${relativePath} structural validation failed: ${error.message}`);
  }

  const { religionsById, deitiesById } = buildReligionIndexes(religions);
  const hotspotsById = buildIndex(religiousHotspots, "world religious hotspots", HOTSPOT_ID_PATTERN);
  const regionsById = buildIndex(regions, "world regions", REGION_ID_PATTERN);
  const localitiesById = buildIndex(regionLocalities, "world region localities", LOCALITY_ID_PATTERN);
  const settlementsById = buildIndex(settlements, "world settlements", SETTLEMENT_ID_PATTERN);
  const ids = new Set();
  const slugs = new Set();

  for (const record of records) {
    if (ids.has(record.id)) {
      throw new Error(`${relativePath} has duplicate sacred site id '${record.id}'`);
    }
    if (slugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate sacred site slug '${record.slug}'`);
    }
    ids.add(record.id);
    slugs.add(record.slug);

    const idMatch = SACRED_SITE_ID_PATTERN.exec(record.id);
    const expectedSlug = idMatch ? `${idMatch[1]}_${idMatch[2]}` : null;
    if (record.slug !== expectedSlug) {
      throw new Error(`${relativePath} slug must equal '${expectedSlug}' for record ${record.id}`);
    }

    assertPlaceAnchor(record, regionsById, localitiesById, settlementsById, relativePath);
    const parent = hotspotsById.get(record.parentReligiousHotspotId);
    if (!parent) {
      throw new Error(`${relativePath} parentReligiousHotspotId '${record.parentReligiousHotspotId}' is missing on record ${record.id}`);
    }
    assertParentCoherence(record, parent, relativePath);
    assertReligionReferences(record, religionsById, deitiesById, relativePath);
  }

  return { ok: true, sacredSiteIds: [...ids].sort() };
}
