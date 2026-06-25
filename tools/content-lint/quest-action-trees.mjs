const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const LOCAL_TOKEN_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const CHECK_KINDS = new Set([
  "ability",
  "attribute",
  "equipment_tag",
  "item",
  "party_size",
  "rng",
  "skill",
  "spell",
  "tool"
]);
const LOCAL_CHECK_KINDS = new Set(["equipment_tag", "party_size", "rng"]);
const BRANCH_KEYS = new Set([
  "criticalFailure",
  "criticalSuccess",
  "failure",
  "partial",
  "success"
]);
const QUEST_STATES = new Set(["advance", "complete", "fail"]);
const FORBIDDEN_FIELD_NAMES = new Set([
  "objectiveId",
  "objectiveIds",
  "conditionId",
  "conditionIds",
  "objectiveRegistryId",
  "conditionRegistryId",
  "progress",
  "progressState",
  "currentProgress",
  "runtimeState",
  "playerQuestState",
  "generatedOfferState",
  "rewardExecution",
  "rewardPayout",
  "executeReward",
  "grantItems",
  "journalState",
  "journalMutation",
  "chronicleState",
  "chronicleMutation",
  "uiState",
  "storageState",
  "commandState",
  "eventState",
  "gameplayEffects"
]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function buildIdSet(records, source, field = "id") {
  if (!Array.isArray(records)) {
    throw new Error(`${source} records must be an array`);
  }
  const ids = new Set();
  records.forEach((record, index) => {
    const value = record?.[field];
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`${source} records[${index}] must provide ${field}`);
    }
    if (ids.has(value)) {
      throw new Error(`${source} has duplicate ${field} '${value}'`);
    }
    ids.add(value);
  });
  return ids;
}

function buildItemKeySet(items) {
  if (!Array.isArray(items)) {
    throw new Error("items.items records must be an array");
  }
  const itemKeys = new Set();
  items.forEach((record, index) => {
    if (!isObject(record) || typeof record.itemKey !== "string") {
      throw new Error(`items.items records[${index}] must provide itemKey`);
    }
    if (itemKeys.has(record.itemKey)) {
      throw new Error(`items.items has duplicate itemKey '${record.itemKey}'`);
    }
    itemKeys.add(record.itemKey);
  });
  return itemKeys;
}

function assertFiniteNumber(relativePath, recordId, fieldPath, value, minimum = 0) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum) {
    throw new Error(`${relativePath} ${fieldPath} must be a finite number >= ${minimum} on record ${recordId}`);
  }
}

function assertInteger(relativePath, recordId, fieldPath, value, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${relativePath} ${fieldPath} must be an integer >= ${minimum} on record ${recordId}`);
  }
}

function assertNoForbiddenFields(value, relativePath, recordId, path = "record") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      assertNoForbiddenFields(entry, relativePath, recordId, `${path}[${index}]`);
    });
    return;
  }
  if (!isObject(value)) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_FIELD_NAMES.has(key)) {
      throw new Error(`${relativePath} ${path}.${key} is forbidden quest runtime/objective-condition authority on record ${recordId}`);
    }
    assertNoForbiddenFields(child, relativePath, recordId, `${path}.${key}`);
  }
}

function assertUniqueStringField(entries, field, relativePath, recordId, ownerPath) {
  const seen = new Set();
  for (const entry of entries ?? []) {
    const value = entry?.[field];
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`${relativePath} ${ownerPath}.${field} must be a non-empty string on record ${recordId}`);
    }
    if (seen.has(value)) {
      throw new Error(`${relativePath} ${ownerPath} has duplicate ${field} '${value}' on record ${recordId}`);
    }
    seen.add(value);
  }
  return seen;
}

function validateCheckTarget({ check, authorities, relativePath, recordId, nodeId }) {
  const checkPath = `actionTree node ${nodeId} check targetId '${check.targetId}'`;

  if (!CHECK_KINDS.has(check.kind)) {
    throw new Error(`${relativePath} actionTree check kind '${check.kind}' is unsupported on record ${recordId}, node ${nodeId}`);
  }
  if (typeof check.targetId !== "string" || check.targetId.length === 0) {
    throw new Error(`${relativePath} ${checkPath} must be a non-empty string on record ${recordId}`);
  }
  assertFiniteNumber(relativePath, recordId, `actionTree node ${nodeId} check minValue`, check.minValue, 0);
  assertFiniteNumber(relativePath, recordId, `actionTree node ${nodeId} check weight`, check.weight, 0);
  if (typeof check.optional !== "boolean") {
    throw new Error(`${relativePath} actionTree node ${nodeId} check optional must be boolean on record ${recordId}`);
  }

  if (check.kind === "attribute" && !authorities.attributeIds.has(check.targetId)) {
    throw new Error(`${relativePath} actionTree check targetId '${check.targetId}' missing attribute definition on record ${recordId}, node ${nodeId}`);
  }
  if (check.kind === "skill" && !authorities.skillIds.has(check.targetId)) {
    throw new Error(`${relativePath} actionTree check targetId '${check.targetId}' missing skill definition on record ${recordId}, node ${nodeId}`);
  }
  if (check.kind === "ability" && !authorities.abilityIds.has(check.targetId)) {
    throw new Error(`${relativePath} actionTree check targetId '${check.targetId}' missing ability definition on record ${recordId}, node ${nodeId}`);
  }
  if (check.kind === "spell" && !authorities.spellIds.has(check.targetId)) {
    throw new Error(`${relativePath} actionTree check targetId '${check.targetId}' missing spell definition on record ${recordId}, node ${nodeId}`);
  }
  if ((check.kind === "tool" || check.kind === "item") && !authorities.itemKeys.has(check.targetId)) {
    throw new Error(`${relativePath} actionTree check targetId '${check.targetId}' missing item definition on record ${recordId}, node ${nodeId}`);
  }
  if (LOCAL_CHECK_KINDS.has(check.kind) && !LOCAL_TOKEN_PATTERN.test(check.targetId)) {
    throw new Error(`${relativePath} actionTree ${check.kind} targetId '${check.targetId}' must be an owner-local descriptive token on record ${recordId}, node ${nodeId}`);
  }
}

function validateDeployment(record, relativePath) {
  const recordId = record.id ?? "<unknown>";
  const deployment = record.deployment;
  if (!isObject(deployment)) {
    throw new Error(`${relativePath} deployment must be an object on record ${recordId}`);
  }

  assertInteger(relativePath, recordId, "deployment.minPartySize", deployment.minPartySize, 1);
  assertInteger(relativePath, recordId, "deployment.recommendedPartySize", deployment.recommendedPartySize, 1);
  assertInteger(relativePath, recordId, "deployment.maxPartySize", deployment.maxPartySize, 1);
  if (
    deployment.minPartySize > deployment.recommendedPartySize ||
    deployment.recommendedPartySize > deployment.maxPartySize
  ) {
    throw new Error(`${relativePath} deployment party size must satisfy minPartySize <= recommendedPartySize <= maxPartySize on record ${recordId}`);
  }

  const roleSlotIds = assertUniqueStringField(
    deployment.roleSlots ?? [],
    "slotId",
    relativePath,
    recordId,
    "deployment.roleSlots"
  );
  for (const slot of deployment.roleSlots ?? []) {
    assertInteger(relativePath, recordId, `deployment.roleSlots.${slot.slotId}.minPeople`, slot.minPeople, 0);
    assertInteger(relativePath, recordId, `deployment.roleSlots.${slot.slotId}.maxPeople`, slot.maxPeople, 0);
    if (slot.minPeople > slot.maxPeople) {
      throw new Error(`${relativePath} deployment roleSlot '${slot.slotId}' must satisfy minPeople <= maxPeople on record ${recordId}`);
    }
  }
  return roleSlotIds;
}

function validateActionTree(record, authorities, relativePath) {
  const recordId = record.id ?? "<unknown>";
  const tree = record.actionTree;
  if (!isObject(tree) || !Array.isArray(tree.nodes)) {
    throw new Error(`${relativePath} actionTree must contain nodes on record ${recordId}`);
  }

  const nodeIds = assertUniqueStringField(tree.nodes, "id", relativePath, recordId, "actionTree.nodes");
  if (!nodeIds.has(tree.entryNodeId)) {
    throw new Error(`${relativePath} entryNodeId '${tree.entryNodeId}' missing action node on record ${recordId}`);
  }
  for (const completionNodeId of tree.completionNodeIds ?? []) {
    if (!nodeIds.has(completionNodeId)) {
      throw new Error(`${relativePath} completionNodeId '${completionNodeId}' missing action node on record ${recordId}`);
    }
  }

  const roleSlotIds = validateDeployment(record, relativePath);
  for (const node of tree.nodes) {
    const nodeId = node.id ?? "<unknown>";
    if (!isObject(node.participantRange)) {
      throw new Error(`${relativePath} participantRange must be an object on record ${recordId}, node ${nodeId}`);
    }
    assertInteger(relativePath, recordId, `actionTree node ${nodeId} participantRange.min`, node.participantRange.min, 0);
    assertInteger(relativePath, recordId, `actionTree node ${nodeId} participantRange.max`, node.participantRange.max, 0);
    if (node.participantRange.min > node.participantRange.max) {
      throw new Error(`${relativePath} participantRange min must be <= max on record ${recordId}, node ${nodeId}`);
    }

    for (const assignedRole of node.assignedRoles ?? []) {
      if (!roleSlotIds.has(assignedRole)) {
        throw new Error(`${relativePath} assignedRoles '${assignedRole}' missing deployment roleSlot on record ${recordId}, node ${nodeId}`);
      }
    }
    for (const check of node.checks ?? []) {
      validateCheckTarget({ check, authorities, relativePath, recordId, nodeId });
    }
    for (const [branchKey, branch] of Object.entries(node.branches ?? {})) {
      if (!BRANCH_KEYS.has(branchKey)) {
        throw new Error(`${relativePath} branch '${branchKey}' is unsupported on record ${recordId}, node ${nodeId}`);
      }
      if (!QUEST_STATES.has(branch.questState)) {
        throw new Error(`${relativePath} branch questState '${branch.questState}' is unsupported on record ${recordId}, node ${nodeId}`);
      }
      if (branch.nextNodeId !== null && branch.nextNodeId !== undefined && !nodeIds.has(branch.nextNodeId)) {
        throw new Error(`${relativePath} branch nextNodeId '${branch.nextNodeId}' missing action node on record ${recordId}, node ${nodeId}`);
      }
    }
  }
}

function validateQuestRecords({ relativePath, records, idPrefix, authorities }) {
  if (!Array.isArray(records)) {
    throw new Error(`${relativePath} records must be an array`);
  }
  const ids = new Set();
  const slugs = new Set();
  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    assertNoForbiddenFields(record, relativePath, recordId);

    if (typeof record.id !== "string" || !record.id.startsWith(`${idPrefix}.`)) {
      throw new Error(`${relativePath} has invalid ${idPrefix} id '${record.id}' on record ${recordId}`);
    }
    if (ids.has(record.id)) {
      throw new Error(`${relativePath} has duplicate ${idPrefix} id '${record.id}'`);
    }
    ids.add(record.id);

    if (typeof record.slug !== "string" || !SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid slug '${record.slug}' on record ${recordId}`);
    }
    if (slugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate slug '${record.slug}'`);
    }
    slugs.add(record.slug);

    if (record.id !== `${idPrefix}.${record.slug}`) {
      throw new Error(`${relativePath} record ${record.id} id must equal ${idPrefix}.${record.slug}`);
    }
    validateActionTree(record, authorities, relativePath);
  }
  return [...ids].sort();
}

function buildAuthorities({ attributes, skills, abilities, spells, items }) {
  return {
    attributeIds: buildIdSet(attributes, "player.attributes"),
    skillIds: buildIdSet(skills, "player.skills"),
    abilityIds: buildIdSet(abilities, "player.abilities"),
    spellIds: buildIdSet(spells, "player.spells"),
    itemKeys: buildItemKeySet(items)
  };
}

export function validateQuestDefinitionActionTrees({
  relativePath = "packages/content/base/civilization/quest_definitions.json",
  records,
  attributes,
  skills,
  abilities,
  spells,
  items
}) {
  const questDefinitionIds = validateQuestRecords({
    relativePath,
    records,
    idPrefix: "quest_definition",
    authorities: buildAuthorities({ attributes, skills, abilities, spells, items })
  });

  return {
    ok: true,
    questDefinitionIds
  };
}

export function validateQuestArchetypeActionTrees({
  relativePath = "packages/content/base/civilization/quest_archetypes.json",
  records,
  attributes,
  skills,
  abilities,
  spells,
  items
}) {
  const questArchetypeIds = validateQuestRecords({
    relativePath,
    records,
    idPrefix: "quest_archetype",
    authorities: buildAuthorities({ attributes, skills, abilities, spells, items })
  });

  return {
    ok: true,
    questArchetypeIds
  };
}
