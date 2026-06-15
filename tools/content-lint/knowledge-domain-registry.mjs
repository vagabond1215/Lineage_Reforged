const SUPPORTED_SCHEMA_KEYWORDS = new Set([
  "$schema",
  "title",
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

const SOURCE_TYPES_BY_FAMILY = Object.freeze({
  field_observation: Object.freeze([
    "field_identification",
    "travel_observation",
    "combat_observation"
  ]),
  practical_use: Object.freeze(["resource_use", "crafting_use"]),
  textual_study: Object.freeze(["book_study", "scroll_study", "tome_study"]),
  instruction: Object.freeze(["teacher_instruction", "institutional_study"]),
  event_record: Object.freeze(["quest_event", "chronicle_record"]),
  custom: Object.freeze(["custom"])
});

const SOURCE_FAMILY_BY_TYPE = new Map(
  Object.entries(SOURCE_TYPES_BY_FAMILY).flatMap(([family, sourceTypes]) =>
    sourceTypes.map((sourceType) => [sourceType, family])
  )
);

const CUSTOM_FIELDS = [
  "canonicalSubjectTypes",
  "supportedSnippetCategories",
  "supportedDiscoverySourceFamilies",
  "supportedDiscoverySourceTypes",
  "defaultEvidenceOwnerScopes"
];

const ARCANE_DOMAIN_ID = "knowledge_domain.arcane_lore";
const NULL_ONLY_POLICY_FIELDS = ["completionPolicyRef", "visibilityPolicyRef"];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function valueKey(value) {
  return JSON.stringify(value);
}

function schemaFailure(schemaPath, message) {
  throw new Error(`knowledge-domain registry schema ${schemaPath} ${message}`);
}

function assertSupportedSchema(schema, schemaPath = "$") {
  if (!isObject(schema)) {
    schemaFailure(schemaPath, "must be an object");
  }

  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(keyword)) {
      schemaFailure(schemaPath, `uses unsupported keyword '${keyword}'`);
    }
  }

  if (schema.type !== undefined && typeof schema.type !== "string") {
    schemaFailure(`${schemaPath}.type`, "must be a string");
  }
  if (schema.type !== undefined && !SUPPORTED_SCHEMA_TYPES.has(schema.type)) {
    schemaFailure(`${schemaPath}.type`, `declares unsupported type '${schema.type}'`);
  }
  if (schema.required !== undefined && !Array.isArray(schema.required)) {
    schemaFailure(`${schemaPath}.required`, "must be an array");
  }
  if (schema.properties !== undefined) {
    if (!isObject(schema.properties)) {
      schemaFailure(`${schemaPath}.properties`, "must be an object");
    }
    for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
      assertSupportedSchema(propertySchema, `${schemaPath}.properties.${propertyName}`);
    }
  }
  if (schema.items !== undefined) {
    assertSupportedSchema(schema.items, `${schemaPath}.items`);
  }
  if (schema.oneOf !== undefined) {
    if (!Array.isArray(schema.oneOf) || schema.oneOf.length === 0) {
      schemaFailure(`${schemaPath}.oneOf`, "must be a non-empty array");
    }
    schema.oneOf.forEach((branch, index) => {
      assertSupportedSchema(branch, `${schemaPath}.oneOf[${index}]`);
    });
  }
}

function matchesType(value, type, schemaPath) {
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
      schemaFailure(schemaPath, `declares unsupported type '${type}'`);
  }
}

function validateValue(value, schema, valuePath, schemaPath = "$") {
  if (schema.oneOf !== undefined) {
    let matchingBranches = 0;
    for (const [index, branch] of schema.oneOf.entries()) {
      try {
        validateValue(value, branch, valuePath, `${schemaPath}.oneOf[${index}]`);
        matchingBranches += 1;
      } catch {
        // A oneOf branch mismatch is expected while testing alternatives.
      }
    }
    if (matchingBranches !== 1) {
      throw new Error(`${valuePath} must match exactly one oneOf branch`);
    }
  }

  if (schema.type !== undefined && !matchesType(value, schema.type, `${schemaPath}.type`)) {
    throw new Error(`${valuePath} must be type ${schema.type}`);
  }

  if (schema.enum !== undefined) {
    if (!Array.isArray(schema.enum)) {
      schemaFailure(`${schemaPath}.enum`, "must be an array");
    }
    const key = valueKey(value);
    if (!schema.enum.some((candidate) => valueKey(candidate) === key)) {
      throw new Error(`${valuePath} must be one of the schema enum values`);
    }
  }

  if (schema.pattern !== undefined) {
    if (typeof schema.pattern !== "string") {
      schemaFailure(`${schemaPath}.pattern`, "must be a string");
    }
    if (typeof value !== "string" || !new RegExp(schema.pattern).test(value)) {
      throw new Error(`${valuePath} must match pattern ${schema.pattern}`);
    }
  }

  if (schema.minLength !== undefined) {
    if (!Number.isInteger(schema.minLength) || schema.minLength < 0) {
      schemaFailure(`${schemaPath}.minLength`, "must be a non-negative integer");
    }
    if (typeof value !== "string" || value.length < schema.minLength) {
      throw new Error(`${valuePath} must have length at least ${schema.minLength}`);
    }
  }

  if (schema.type === "object") {
    const properties = schema.properties ?? {};
    const required = schema.required ?? [];
    for (const propertyName of required) {
      if (typeof propertyName !== "string") {
        schemaFailure(`${schemaPath}.required`, "must contain only strings");
      }
      if (!(propertyName in value)) {
        throw new Error(`${valuePath} is missing required property '${propertyName}'`);
      }
    }

    if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) {
      schemaFailure(`${schemaPath}.additionalProperties`, "must be false for this adapter");
    }
    if (schema.additionalProperties === false) {
      for (const propertyName of Object.keys(value)) {
        if (!(propertyName in properties)) {
          throw new Error(`${valuePath} has unsupported property '${propertyName}'`);
        }
      }
    }

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      if (propertyName in value) {
        validateValue(
          value[propertyName],
          propertySchema,
          `${valuePath}.${propertyName}`,
          `${schemaPath}.properties.${propertyName}`
        );
      }
    }
  }

  if (schema.type === "array") {
    if (schema.minItems !== undefined) {
      if (!Number.isInteger(schema.minItems) || schema.minItems < 0) {
        schemaFailure(`${schemaPath}.minItems`, "must be a non-negative integer");
      }
      if (value.length < schema.minItems) {
        throw new Error(`${valuePath} must contain at least ${schema.minItems} items`);
      }
    }

    if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
      schemaFailure(`${schemaPath}.uniqueItems`, "must be true for this adapter");
    }
    if (schema.uniqueItems === true) {
      const seen = new Set();
      for (const entry of value) {
        const key = valueKey(entry);
        if (seen.has(key)) {
          throw new Error(`${valuePath} must contain unique items`);
        }
        seen.add(key);
      }
    }

    if (schema.items !== undefined) {
      value.forEach((entry, index) => {
        validateValue(entry, schema.items, `${valuePath}[${index}]`, `${schemaPath}.items`);
      });
    }
  }
}

function assertVocabulary(record, field, allowedValues, recordId, relativePath) {
  const allowed = new Set(allowedValues);
  for (const value of record[field]) {
    if (!allowed.has(value)) {
      throw new Error(
        `${relativePath} ${field} '${value}' is absent from the current snippet schema on record ${recordId}`
      );
    }
  }
}

function assertCustomUsage(record, recordId, relativePath) {
  const usesCustom = CUSTOM_FIELDS.some((field) => record[field].includes("custom"));
  if (!usesCustom) {
    return;
  }

  const notes = [...record.schemaGapNotes, ...record.notes];
  if (!notes.some((note) => /\bcustom\b/i.test(note))) {
    throw new Error(
      `${relativePath} custom usage requires schemaGapNotes or notes containing 'custom' on record ${recordId}`
    );
  }
}

function assertSourceFamilies(record, recordId, relativePath) {
  const families = new Set(record.supportedDiscoverySourceFamilies);
  const sourceTypes = new Set(record.supportedDiscoverySourceTypes);
  const hasCustomFamily = families.has("custom");
  const hasCustomSourceType = sourceTypes.has("custom");

  if (hasCustomFamily !== hasCustomSourceType) {
    throw new Error(
      `${relativePath} custom source family and source type must appear together on record ${recordId}`
    );
  }

  for (const sourceType of sourceTypes) {
    const family = SOURCE_FAMILY_BY_TYPE.get(sourceType);
    if (!family) {
      throw new Error(`${relativePath} has unmapped source type '${sourceType}' on record ${recordId}`);
    }
    if (!families.has(family)) {
      throw new Error(
        `${relativePath} source type '${sourceType}' requires family '${family}' on record ${recordId}`
      );
    }
  }

  for (const family of families) {
    const matchingTypes = SOURCE_TYPES_BY_FAMILY[family];
    if (!matchingTypes) {
      throw new Error(`${relativePath} has unmapped source family '${family}' on record ${recordId}`);
    }
    if (!matchingTypes.some((sourceType) => sourceTypes.has(sourceType))) {
      throw new Error(
        `${relativePath} source family '${family}' has no matching source type on record ${recordId}`
      );
    }
  }
}

export function validateKnowledgeDomainRegistry({
  relativePath = "packages/content/base/player/knowledge_domain_registry.json",
  wrapper,
  recordSchema,
  legacyPolicyRecords,
  skills,
  availableBaseCollectionIds,
  snippetVocabularies
}) {
  if (!isObject(wrapper)) {
    throw new Error(`${relativePath} wrapper must be an object`);
  }

  const wrapperKeys = Object.keys(wrapper);
  if (wrapperKeys.length !== 1 || wrapperKeys[0] !== "records") {
    throw new Error(`${relativePath} wrapper must contain exactly one top-level key: records`);
  }
  if (!Array.isArray(wrapper.records)) {
    throw new Error(`${relativePath} records must be an array`);
  }
  if (wrapper.records.length === 0) {
    throw new Error(`${relativePath} records must be non-empty`);
  }

  assertSupportedSchema(recordSchema);
  wrapper.records.forEach((record, index) => {
    try {
      validateValue(record, recordSchema, `records[${index}]`);
    } catch (error) {
      throw new Error(`${relativePath} structural validation failed: ${error.message}`);
    }
  });

  const skillById = new Map(skills.map((skill) => [skill.id, skill]));
  const domainIds = new Set();
  const slugs = new Set();

  for (const record of wrapper.records) {
    const recordId = record.id;
    if (domainIds.has(recordId)) {
      throw new Error(`${relativePath} has duplicate domain id '${recordId}'`);
    }
    domainIds.add(recordId);

    if (slugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate domain slug '${record.slug}'`);
    }
    slugs.add(record.slug);

    if (record.id !== `knowledge_domain.${record.slug}`) {
      throw new Error(`${relativePath} id must equal knowledge_domain.${record.slug} on record ${recordId}`);
    }

    assertVocabulary(
      record,
      "canonicalSubjectTypes",
      snippetVocabularies.subjectTypes,
      recordId,
      relativePath
    );
    assertVocabulary(
      record,
      "supportedSnippetCategories",
      snippetVocabularies.categories,
      recordId,
      relativePath
    );
    assertVocabulary(
      record,
      "supportedDiscoverySourceTypes",
      snippetVocabularies.sourceTypes,
      recordId,
      relativePath
    );
    assertSourceFamilies(record, recordId, relativePath);
    assertCustomUsage(record, recordId, relativePath);

    for (const skillId of record.relatedSkillIds) {
      if (!skillById.has(skillId)) {
        throw new Error(`${relativePath} relatedSkillIds '${skillId}' is missing on record ${recordId}`);
      }
    }

    const relatedSkillIds = new Set(record.relatedSkillIds);
    for (const schoolSkillId of record.relatedMagicSchoolIds) {
      if (!schoolSkillId.startsWith("skill.magic.school.")) {
        throw new Error(
          `${relativePath} relatedMagicSchoolIds '${schoolSkillId}' must match skill.magic.school.* on record ${recordId}`
        );
      }

      const schoolSkill = skillById.get(schoolSkillId);
      if (!schoolSkill) {
        throw new Error(
          `${relativePath} relatedMagicSchoolIds '${schoolSkillId}' is missing on record ${recordId}`
        );
      }
      if (schoolSkill.category !== "magic") {
        throw new Error(
          `${relativePath} relatedMagicSchoolIds '${schoolSkillId}' must reference category 'magic' on record ${recordId}`
        );
      }
      if (typeof schoolSkill.domain !== "string" || !schoolSkill.domain.startsWith("school.")) {
        throw new Error(
          `${relativePath} relatedMagicSchoolIds '${schoolSkillId}' must reference a school.* domain on record ${recordId}`
        );
      }
      if (relatedSkillIds.has(schoolSkillId)) {
        throw new Error(
          `${relativePath} skill '${schoolSkillId}' cannot appear in both related skill arrays on record ${recordId}`
        );
      }
    }

    for (const collectionId of record.relatedContentCollections) {
      if (collectionId === "player.knowledge_domain_registry") {
        throw new Error(`${relativePath} cannot self-reference on record ${recordId}`);
      }
      if (!availableBaseCollectionIds.has(collectionId)) {
        throw new Error(
          `${relativePath} relatedContentCollections '${collectionId}' is missing on record ${recordId}`
        );
      }
    }

    if (
      record.trialPolicyRef !== null &&
      (record.status !== "active" || record.id === ARCANE_DOMAIN_ID)
    ) {
      throw new Error(
        `${relativePath} trialPolicyRef requires an active non-Arcane domain on record ${recordId}`
      );
    }

    for (const policyField of NULL_ONLY_POLICY_FIELDS) {
      if (record[policyField] !== null) {
        throw new Error(
          `${relativePath} ${policyField} must remain null until its policy authority exists on record ${recordId}`
        );
      }
    }
  }

  for (const legacyRecord of legacyPolicyRecords) {
    if (!domainIds.has(legacyRecord.id)) {
      throw new Error(
        `packages/content/base/player/knowledge_domains.json id '${legacyRecord.id}' is absent from the broad registry`
      );
    }
  }

  for (const skill of skills) {
    if (skill.knowledgeDomainId !== undefined && !domainIds.has(skill.knowledgeDomainId)) {
      throw new Error(
        `packages/content/base/player/skills.json knowledgeDomainId '${skill.knowledgeDomainId}' is absent from the broad registry on record ${skill.id}`
      );
    }
  }

  return true;
}

export { SOURCE_TYPES_BY_FAMILY };
