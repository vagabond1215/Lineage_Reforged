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
  "minimum",
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

const BLOCKED_POLICY_ID_TOKENS = new Set([
  "readiness",
  "attempt",
  "reward",
  "unlock",
  "checkpoint",
  "outcome",
  "run" + "time",
  "success",
  "failure"
]);

const ARCANE_DOMAIN_ID = "knowledge_domain.arcane_lore";
const REQUIRED_CURRENT_POLICY_ID = "knowledge_trial_policy.flora_tier_1";

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
  throw new Error(`knowledge trial policy schema ${schemaPath} ${message}`);
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
      assertSupportedSchema(
        propertySchema,
        rootSchema,
        `${schemaPath}.properties.${name}`,
        seen
      );
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
  if (
    schema.minimum !== undefined &&
    (typeof schema.minimum !== "number" || !Number.isFinite(schema.minimum))
  ) {
    schemaFailure(`${schemaPath}.minimum`, "must be a finite number");
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
  if (
    schema.minimum !== undefined &&
    (typeof value !== "number" || !Number.isFinite(value) || value < schema.minimum)
  ) {
    throw new Error(`${valuePath} must be at least ${schema.minimum}`);
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

function requireAuthorityWrapper(wrapper, source) {
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

function buildUniqueIndex(records, field, source, label) {
  const index = new Map();
  for (const [recordIndex, record] of records.entries()) {
    if (!isObject(record) || typeof record[field] !== "string") {
      throw new Error(`${source} records[${recordIndex}].${field} must be a string`);
    }
    const id = record[field];
    if (index.has(id)) {
      throw new Error(`${source} records[${recordIndex}].${field} duplicates ${label} '${id}'`);
    }
    index.set(id, record);
  }
  return index;
}

function requireActiveDomain(domainId, domainById, relativePath, location) {
  const domain = domainById.get(domainId);
  if (!domain) {
    throw new Error(`${relativePath} ${location} '${domainId}' is missing from domain registry`);
  }
  if (domainId === ARCANE_DOMAIN_ID || domain.status !== "active") {
    throw new Error(
      `${relativePath} ${location} '${domainId}' must reference an active non-Arcane domain`
    );
  }
  return domain;
}

function targetKey(target) {
  switch (target.scope) {
    case "snippet":
      return `snippet|${target.domainId}|${target.snippetId}|${target.requiredDecision}`;
    case "tier":
      return `tier|${target.domainId}|${target.tier}|${target.requiredDecision}`;
    case "domain":
      return `domain|${target.domainId}|${target.requiredDecision}`;
    default:
      return `unsupported|${stableValueKey(target)}`;
  }
}

function assertUniqueTargets(targets, seen, relativePath, path) {
  for (const [index, target] of targets.entries()) {
    const key = targetKey(target);
    if (seen.has(key)) {
      throw new Error(`${relativePath} ${path}[${index}] duplicates target '${key}'`);
    }
    seen.add(key);
  }
}

function assertSnippetRequirement(
  target,
  snippetById,
  policy,
  relativePath,
  targetPath
) {
  const snippet = snippetById.get(target.snippetId);
  if (!snippet) {
    throw new Error(
      `${relativePath} ${targetPath}.snippetId '${target.snippetId}' is missing from snippet authority`
    );
  }

  const domainSlug = target.domainId.slice("knowledge_domain.".length);
  const snippetSlug = target.snippetId.slice("knowledge_snippet.".length).split(".")[0];
  if (snippetSlug !== domainSlug) {
    throw new Error(
      `${relativePath} ${targetPath}.snippetId '${target.snippetId}' does not align with domainId '${target.domainId}'`
    );
  }
  if (snippet.domainId !== target.domainId || snippet.domainId !== policy.domainId) {
    throw new Error(
      `${relativePath} ${targetPath}.snippetId '${target.snippetId}' has domainId '${snippet.domainId}' that does not match policy domainId '${policy.domainId}'`
    );
  }
  if (snippet.status !== undefined && snippet.status !== "active") {
    throw new Error(
      `${relativePath} ${targetPath}.snippetId '${target.snippetId}' must reference status 'active'`
    );
  }
}

function assertPolicyId(policyId, relativePath, path) {
  const suffix = policyId.slice("knowledge_trial_policy.".length);
  const tokens = suffix.split("_");
  const blockedToken = tokens.find((token) => BLOCKED_POLICY_ID_TOKENS.has(token));
  if (blockedToken) {
    throw new Error(
      `${relativePath} ${path} '${policyId}' contains blocked authority token '${blockedToken}'`
    );
  }
}

export function validateKnowledgeTrialPolicies({
  relativePath = "packages/content/base/player/knowledge_trial_policies.json",
  wrapper,
  policySchema,
  domainRegistryWrapper,
  snippetWrapper
}) {
  const records = requireAuthorityWrapper(wrapper, relativePath);

  assertSupportedSchema(policySchema, policySchema);
  records.forEach((record, index) => {
    try {
      validateValue(record, policySchema, policySchema, `records[${index}]`);
    } catch (error) {
      throw new Error(`${relativePath} structural validation failed: ${error.message}`);
    }
  });

  const domainRecords = requireAuthorityWrapper(
    domainRegistryWrapper,
    "knowledge domain registry"
  );
  const snippetRecords = requireAuthorityWrapper(snippetWrapper, "knowledge snippets");
  const domainById = buildUniqueIndex(domainRecords, "id", "knowledge domain registry", "domain id");
  const snippetById = buildUniqueIndex(snippetRecords, "id", "knowledge snippets", "snippet id");
  const policyIds = new Set();

  for (const domain of domainRecords) {
    if (domain.trialPolicyRef !== null) {
      throw new Error(
        `knowledge domain registry domain '${domain.id}' trialPolicyRef must remain null`
      );
    }
  }

  for (const [recordIndex, policy] of records.entries()) {
    const recordPath = `records[${recordIndex}]`;
    if (policyIds.has(policy.policyId)) {
      throw new Error(
        `${relativePath} ${recordPath}.policyId duplicates '${policy.policyId}'`
      );
    }
    policyIds.add(policy.policyId);
    assertPolicyId(policy.policyId, relativePath, `${recordPath}.policyId`);
    requireActiveDomain(policy.domainId, domainById, relativePath, `${recordPath}.domainId`);

    if (policy.readinessPolicyId !== null) {
      throw new Error(`${relativePath} ${recordPath}.readinessPolicyId must remain null`);
    }
    if (policy.rewardRefs.length !== 0) {
      throw new Error(`${relativePath} ${recordPath}.rewardRefs must remain empty`);
    }

    const requiredSeen = new Set();
    const prerequisiteSeen = new Set();
    assertUniqueTargets(
      policy.requiredCompletionTargets,
      requiredSeen,
      relativePath,
      `${recordPath}.requiredCompletionTargets`
    );
    assertUniqueTargets(
      policy.prerequisiteCompletionTargets,
      prerequisiteSeen,
      relativePath,
      `${recordPath}.prerequisiteCompletionTargets`
    );
    for (const key of prerequisiteSeen) {
      if (requiredSeen.has(key)) {
        throw new Error(
          `${relativePath} ${recordPath}.prerequisiteCompletionTargets repeats required target '${key}'`
        );
      }
    }

    let hasMatchingPrimaryTarget = false;
    for (const [collectionName, targets] of [
      ["requiredCompletionTargets", policy.requiredCompletionTargets],
      ["prerequisiteCompletionTargets", policy.prerequisiteCompletionTargets]
    ]) {
      for (const [targetIndex, target] of targets.entries()) {
        const targetPath = `${recordPath}.${collectionName}[${targetIndex}]`;
        requireActiveDomain(
          target.domainId,
          domainById,
          relativePath,
          `${targetPath}.domainId`
        );
        if (target.domainId !== policy.domainId) {
          throw new Error(
            `${relativePath} ${targetPath}.domainId '${target.domainId}' must match policy domainId '${policy.domainId}'`
          );
        }

        if (
          (policy.scope === "tier" && target.scope === "domain") ||
          (policy.scope === "domain" && target.scope === "tier")
        ) {
          throw new Error(
            `${relativePath} ${targetPath}.scope '${target.scope}' is incompatible with policy scope '${policy.scope}'`
          );
        }
        if (policy.scope === "tier" && target.scope === "tier" && target.tier !== policy.tier) {
          throw new Error(
            `${relativePath} ${targetPath}.tier '${target.tier}' must match policy tier '${policy.tier}'`
          );
        }
        if (target.scope === "snippet") {
          assertSnippetRequirement(
            target,
            snippetById,
            policy,
            relativePath,
            targetPath
          );
        }

        if (
          collectionName === "requiredCompletionTargets" &&
          target.scope === policy.scope &&
          (policy.scope !== "tier" || target.tier === policy.tier)
        ) {
          hasMatchingPrimaryTarget = true;
        }
      }
    }

    if (!hasMatchingPrimaryTarget) {
      const expected =
        policy.scope === "tier"
          ? `tier target for '${policy.domainId}' tier '${policy.tier}'`
          : `domain target for '${policy.domainId}'`;
      throw new Error(
        `${relativePath} ${recordPath}.requiredCompletionTargets must contain a matching ${expected}`
      );
    }
  }

  if (!policyIds.has(REQUIRED_CURRENT_POLICY_ID)) {
    throw new Error(
      `${relativePath} must include current policy '${REQUIRED_CURRENT_POLICY_ID}'`
    );
  }

  return {
    ok: true,
    policyIds: [...policyIds].sort()
  };
}
