const FILE = "packages/content/base/world/encounter_action_contexts.json";
const FIELDS = [
  "id", "actionType", "originSettlementId", "localRegionId", "originWorldHexId",
  "worldHexEdgeId", "habitatTags", "hazardSource"
];
const PATTERNS = {
  id: /^encounter_action_context\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  actionType: /^player\.[a-z0-9]+(?:\.[a-z0-9]+)*$/,
  originSettlementId: /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  localRegionId: /^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  originWorldHexId: /^world_hex\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  worldHexEdgeId: /^world_hex_edge\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  habitatTag: /^[a-z0-9]+(?:_[a-z0-9]+)*$/
};

function fail(record, reason) {
  throw new Error(`${FILE} record ${record?.id ?? "<unknown>"}: ${reason}`);
}

function intersects(left, right) {
  return left.some((value) => right.includes(value));
}

function ancestryFor(regionId, regionsById, record) {
  const ancestry = [];
  const seen = new Set();
  let currentId = regionId;
  while (currentId) {
    if (seen.has(currentId)) fail(record, `region parent cycle at '${currentId}'`);
    seen.add(currentId);
    const region = regionsById.get(currentId);
    if (!region) fail(record, `missing region parent '${currentId}'`);
    ancestry.push(currentId);
    currentId = region.parentRegionId;
  }
  return ancestry;
}

function eligibleTemplate(template, profile, ancestry, habitats, monstersById) {
  if (!template || !intersects(template.regionIds, ancestry) ||
      !intersects(template.habitatTags, habitats) ||
      !profile.allowedMovementModes.includes(template.movementMode) ||
      !(profile.hostilityWeights[template.disposition] > 0) ||
      !Array.isArray(template.members) || template.members.length === 0) return false;
  return template.members.every((member) => {
    const monster = monstersById.get(member.monsterId);
    return monster && intersects(monster.habitatTags, habitats);
  });
}

export function validateEncounterActionContexts(records, world) {
  if (!Array.isArray(records)) throw new Error(`${FILE} records must be an array`);
  const regionsById = new Map(world.regions.map((item) => [item.id, item]));
  const settlementsById = new Map(world.settlements.map((item) => [item.id, item]));
  const hexesById = new Map(world.worldHexes.map((item) => [item.id, item]));
  const edgesById = new Map(world.worldHexEdges.map((item) => [item.id, item]));
  const templatesById = new Map(world.encounterTemplates.map((item) => [item.id, item]));
  const monstersById = new Map(world.monsters.map((item) => [item.id, item]));
  const ids = new Set();
  const tuples = new Set();

  for (const record of records) {
    if (!record || typeof record !== "object" || Array.isArray(record)) fail(record, "must be an object");
    if (Object.keys(record).length !== FIELDS.length ||
        FIELDS.some((field) => !Object.hasOwn(record, field))) fail(record, "fields must match the strict schema");
    for (const [field, pattern] of Object.entries(PATTERNS)) {
      if (field === "habitatTag") continue;
      if (typeof record[field] !== "string" || !pattern.test(record[field])) fail(record, `invalid ${field}`);
    }
    if (!Array.isArray(record.habitatTags) || record.habitatTags.length === 0 ||
        record.habitatTags.some((tag) => typeof tag !== "string" || !PATTERNS.habitatTag.test(tag)) ||
        new Set(record.habitatTags).size !== record.habitatTags.length) fail(record, "invalid or duplicate habitatTags");
    if (ids.has(record.id)) fail(record, "duplicate context id");
    ids.add(record.id);
    const tuple = JSON.stringify([record.actionType, record.originSettlementId, record.worldHexEdgeId]);
    if (tuples.has(tuple)) fail(record, "ambiguous action/origin/edge tuple");
    tuples.add(tuple);

    const region = regionsById.get(record.localRegionId);
    if (!region) fail(record, `missing local region '${record.localRegionId}'`);
    const ancestry = ancestryFor(region.id, regionsById, record);
    const settlement = settlementsById.get(record.originSettlementId);
    if (!settlement || settlement.regionId !== region.id ||
        (settlement.macroRegionId && !ancestry.includes(settlement.macroRegionId))) {
      fail(record, "origin settlement or region ancestry mismatch");
    }
    const originHex = hexesById.get(record.originWorldHexId);
    if (!originHex || settlement.hexAnchorId !== originHex.id ||
        originHex.regionId !== region.id ||
        !originHex.anchoredSettlementIds.includes(settlement.id)) fail(record, "origin hex anchor mismatch");
    const edge = edgesById.get(record.worldHexEdgeId);
    const destinationHex = edge && hexesById.get(edge.toHexId);
    if (!edge || edge.fromHexId !== originHex.id || !destinationHex ||
        destinationHex.id === originHex.id || destinationHex.regionId !== region.id ||
        !edge.allowedTravelModes.includes("travel_mode.foot")) fail(record, "edge endpoint or local region mismatch");

    const expectedHazardSource = `${region.id}.simulationProfile.hazardPressure`;
    const hazard = region.simulationProfile?.hazardPressure;
    if (record.hazardSource !== expectedHazardSource ||
        typeof hazard !== "number" || !Number.isFinite(hazard) || hazard < 0 || hazard > 100) {
      fail(record, "missing or invalid local region hazard source");
    }

    const eligible = world.spawnProfiles.some((profile) =>
      profile.regionIds.some((id) => ancestry.includes(id)) &&
      (profile.worldHexIds.length === 0 || profile.worldHexIds.includes(originHex.id)) &&
      (profile.settlementIds.length === 0 || profile.settlementIds.includes(settlement.id)) &&
      profile.siteIds.length === 0 &&
      intersects(profile.habitatTags, record.habitatTags) &&
      hazard >= profile.minHazardPressure && hazard <= profile.maxHazardPressure &&
      profile.spawnRatePerDay > 0 &&
      profile.encounterWeights.some((weight) =>
        weight.weight > 0 &&
        hazard >= (weight.minHazardPressure ?? 0) &&
        hazard <= (weight.maxHazardPressure ?? 100) &&
        eligibleTemplate(templatesById.get(weight.encounterTemplateId), profile, ancestry,
          record.habitatTags, monstersById)
      )
    );
    if (!eligible) fail(record, "no eligible spawn profile, template and member set");
  }
}
