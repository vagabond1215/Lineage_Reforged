function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecords(records, source) {
  if (!Array.isArray(records)) {
    throw new Error(`content cross-check failed: ${source} records are invalid`);
  }
  return records;
}

function buildIdIndex(records, source) {
  const index = new Map();
  for (const [recordIndex, record] of records.entries()) {
    if (!isObject(record) || typeof record.id !== "string" || record.id.length === 0) {
      throw new Error(`${source} records[${recordIndex}] must provide a canonical id`);
    }
    if (index.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    index.set(record.id, record);
  }
  return index;
}

function buildVisualFeatureIndex(worldMapFeatures) {
  const byMapId = new Map();

  for (const [recordIndex, record] of worldMapFeatures.entries()) {
    if (!isObject(record) || typeof record.mapId !== "string" || record.mapId.length === 0) {
      throw new Error(`world map feature records[${recordIndex}] must provide a mapId`);
    }
    if (byMapId.has(record.mapId)) {
      throw new Error(`world map features has duplicate mapId '${record.mapId}'`);
    }
    byMapId.set(record.mapId, {
      record,
      climateZoneIds: new Set((record.climateZones ?? []).map((zone) => zone.id)),
      biomeZoneIds: new Set((record.biomeZones ?? []).map((zone) => zone.id)),
      biomeZoneFamilies: new Set(
        (record.biomeZones ?? [])
          .map((zone) => (typeof zone.id === "string" ? zone.id.replace(/\.part_[0-9]+$/, "") : null))
          .filter((id) => typeof id === "string" && id.length > 0)
      )
    });
  }

  return byMapId;
}

function assertPixelWithinBounds(record, visualMapRef, worldMap, relativePath) {
  const width = worldMap.scaleProfile?.referenceImageWidthPx;
  const height = worldMap.scaleProfile?.referenceImageHeightPx;
  if (Number.isInteger(width) && visualMapRef.pixelX > width) {
    throw new Error(
      `${relativePath} visualMapRef.pixelX ${visualMapRef.pixelX} exceeds map width ${width} on record ${record.id}`
    );
  }
  if (Number.isInteger(height) && visualMapRef.pixelY > height) {
    throw new Error(
      `${relativePath} visualMapRef.pixelY ${visualMapRef.pixelY} exceeds map height ${height} on record ${record.id}`
    );
  }
}

export function validateSettlementVisualMapRefs({
  relativePath = "packages/content/base/world/settlements.json",
  settlements,
  worldMaps,
  worldMapFeatures
}) {
  const settlementRecords = requireRecords(settlements, "settlement");
  const worldMapRecords = requireRecords(worldMaps, "world map");
  const worldMapFeatureRecords = requireRecords(worldMapFeatures, "world map feature");
  const worldMapsById = buildIdIndex(worldMapRecords, "world maps");
  const visualFeaturesByMapId = buildVisualFeatureIndex(worldMapFeatureRecords);
  const checkedSettlementIds = [];

  for (const record of settlementRecords) {
    if (!isObject(record)) {
      continue;
    }
    const visualMapRef = record.visualMapRef;
    if (visualMapRef === undefined) {
      continue;
    }

    const recordId = record.id ?? "<unknown>";
    const worldMap = worldMapsById.get(visualMapRef.mapId);
    if (!worldMap) {
      throw new Error(`${relativePath} visualMapRef.mapId '${visualMapRef.mapId}' missing on record ${recordId}`);
    }

    assertPixelWithinBounds(record, visualMapRef, worldMap, relativePath);

    const visualFeature = visualFeaturesByMapId.get(visualMapRef.mapId);
    if (!visualFeature) {
      throw new Error(
        `${relativePath} visualMapRef.mapId '${visualMapRef.mapId}' has no world_map_features authority on record ${recordId}`
      );
    }
    if (!visualFeature.climateZoneIds.has(visualMapRef.climateZoneId)) {
      throw new Error(
        `${relativePath} visualMapRef.climateZoneId '${visualMapRef.climateZoneId}' missing for map '${visualMapRef.mapId}' on record ${recordId}`
      );
    }
    if (
      !visualFeature.biomeZoneIds.has(visualMapRef.biomeZoneId) &&
      !visualFeature.biomeZoneFamilies.has(visualMapRef.biomeZoneId)
    ) {
      throw new Error(
        `${relativePath} visualMapRef.biomeZoneId '${visualMapRef.biomeZoneId}' missing for map '${visualMapRef.mapId}' on record ${recordId}`
      );
    }

    checkedSettlementIds.push(recordId);
  }

  return {
    ok: true,
    checkedSettlementIds: checkedSettlementIds.sort()
  };
}
