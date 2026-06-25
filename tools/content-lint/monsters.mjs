const MONSTER_ID_PATTERN = /^monster\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const FAUNA_ID_PATTERN = /^fauna\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function buildIdSet(records, source, pattern) {
  if (!Array.isArray(records)) {
    throw new Error(`${source} records must be an array`);
  }
  const ids = new Set();
  records.forEach((record, index) => {
    if (!isObject(record) || typeof record.id !== "string" || (pattern && !pattern.test(record.id))) {
      throw new Error(`${source} records[${index}] must provide a canonical id`);
    }
    if (ids.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    ids.add(record.id);
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

function assertUniqueValues(values, field, record, relativePath) {
  const seen = new Set();
  for (const value of values ?? []) {
    if (seen.has(value)) {
      throw new Error(`${relativePath} has duplicate ${field} value '${value}' on record ${record.id}`);
    }
    seen.add(value);
  }
}

function assertUniqueItemKeys(entries, field, record, relativePath) {
  const seen = new Set();
  for (const entry of entries ?? []) {
    if (!isObject(entry) || typeof entry.itemKey !== "string") {
      continue;
    }
    if (seen.has(entry.itemKey)) {
      throw new Error(`${relativePath} has duplicate ${field}.itemKey '${entry.itemKey}' on record ${record.id}`);
    }
    seen.add(entry.itemKey);
  }
}

function assertItemRefs(entries, field, record, itemKeys, marketKeys, relativePath) {
  for (const entry of entries ?? []) {
    if (!isObject(entry) || typeof entry.itemKey !== "string") {
      continue;
    }
    if (!itemKeys.has(entry.itemKey)) {
      throw new Error(`${relativePath} ${field}.itemKey '${entry.itemKey}' is missing from items.items on record ${record.id}`);
    }
    if (!marketKeys.has(entry.itemKey)) {
      throw new Error(`${relativePath} ${field}.itemKey '${entry.itemKey}' is missing from market item values on record ${record.id}`);
    }
  }
}

function assertLineage(records, monsterIds, faunaIds, relativePath) {
  const parentById = new Map();
  for (const record of records) {
    if (record.baseFaunaId !== undefined) {
      if (typeof record.baseFaunaId !== "string" || !FAUNA_ID_PATTERN.test(record.baseFaunaId)) {
        throw new Error(`${relativePath} has invalid baseFaunaId '${record.baseFaunaId}' on record ${record.id}`);
      }
      if (!faunaIds.has(record.baseFaunaId)) {
        throw new Error(`${relativePath} baseFaunaId '${record.baseFaunaId}' is missing from world.fauna on record ${record.id}`);
      }
    }
    if (record.baseMonsterId !== undefined) {
      if (typeof record.baseMonsterId !== "string" || !MONSTER_ID_PATTERN.test(record.baseMonsterId)) {
        throw new Error(`${relativePath} has invalid baseMonsterId '${record.baseMonsterId}' on record ${record.id}`);
      }
      if (!monsterIds.has(record.baseMonsterId)) {
        throw new Error(`${relativePath} baseMonsterId '${record.baseMonsterId}' is missing from world.monsters on record ${record.id}`);
      }
      if (record.baseMonsterId === record.id) {
        throw new Error(`${relativePath} has self-referencing baseMonsterId on record ${record.id}`);
      }
      parentById.set(record.id, record.baseMonsterId);
    }

    if ((record.baseMonsterId !== undefined || record.baseFaunaId !== undefined) && record.variantType === undefined) {
      throw new Error(`${relativePath} record ${record.id} must define variantType when baseMonsterId or baseFaunaId is present`);
    }
    if (record.variantType !== undefined && record.baseMonsterId === undefined && record.baseFaunaId === undefined) {
      throw new Error(`${relativePath} record ${record.id} must define baseMonsterId or baseFaunaId when variantType is present`);
    }
  }

  for (const record of records) {
    const ancestry = new Set([record.id]);
    let parentId = parentById.get(record.id);
    while (parentId !== undefined) {
      if (ancestry.has(parentId)) {
        throw new Error(`${relativePath} baseMonsterId lineage cycle includes '${parentId}' on record ${record.id}`);
      }
      ancestry.add(parentId);
      parentId = parentById.get(parentId);
    }
  }
}

export function validateMonsterAuthority({
  relativePath = "packages/content/base/world/monsters.json",
  wrapper,
  items,
  marketItemValues,
  fauna,
  combatRoles,
  tacticsPresets
}) {
  const records = requireRecordsWrapper(wrapper, relativePath);
  const itemKeys = buildItemKeySet(items);
  const marketKeys = new Set((marketItemValues ?? []).map((record) => record.itemKey).filter((value) => typeof value === "string"));
  const faunaIds = buildIdSet(fauna, "world.fauna", FAUNA_ID_PATTERN);
  const roleIds = buildIdSet(combatRoles, "game.combat_roles");
  const presetIds = buildIdSet(tacticsPresets, "game.tactics_presets");

  const monsterIds = new Set();
  const slugs = new Set();
  for (const record of records) {
    const match = typeof record.id === "string" ? MONSTER_ID_PATTERN.exec(record.id) : null;
    if (!match) {
      throw new Error(`${relativePath} has invalid monster id '${record.id}' on record ${record.id ?? "<unknown>"}`);
    }
    if (monsterIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate monster id '${record.id}'`);
    }
    monsterIds.add(record.id);
    if (slugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate monster slug '${record.slug}'`);
    }
    slugs.add(record.slug);
    if (match[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal monster.${record.slug}`);
    }
  }

  for (const record of records) {
    assertUniqueValues(record.habitatTags, "habitatTags", record, relativePath);
    assertUniqueValues(record.behaviorTags, "behaviorTags", record, relativePath);
    assertUniqueItemKeys(record.drops, "drops", record, relativePath);
    assertUniqueItemKeys(record.loot, "loot", record, relativePath);
    assertItemRefs(record.drops, "drops", record, itemKeys, marketKeys, relativePath);
    assertItemRefs(record.loot, "loot", record, itemKeys, marketKeys, relativePath);

    if (!roleIds.has(record.defaultRole)) {
      throw new Error(`${relativePath} defaultRole '${record.defaultRole}' is missing from game.combat_roles on record ${record.id}`);
    }
    const expectedPresetId = `preset.enemy.${record.defaultRole}`;
    if (!presetIds.has(expectedPresetId)) {
      throw new Error(`${relativePath} defaultRole '${record.defaultRole}' requires tactics preset '${expectedPresetId}' on record ${record.id}`);
    }
  }

  assertLineage(records, monsterIds, faunaIds, relativePath);

  return {
    ok: true,
    monsterIds: [...monsterIds].sort()
  };
}
