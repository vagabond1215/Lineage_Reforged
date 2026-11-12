/**
 * Read-only, deterministic audit of every authored First World settlement.
 *
 * No generated population, race quotas, coastal elevations, route publication,
 * World Save mutation, or automatic settlement relocation.
 *
 * Run from repo root:
 *   node scripts/audit-settlement-map-consistency.mjs --json > settlement-audit.json
 *   node scripts/audit-settlement-map-consistency.mjs
 *
 * A nonzero exit status indicates HARD cross-reference/map-identity failure.
 * Advisory warnings require authored judgment and do not fail this source audit.
 */
import { readFileSync } from "node:fs";

const WORLD = new URL("../packages/content/base/world/", import.meta.url);
const load = (path) => JSON.parse(readFileSync(new URL(path, WORLD), "utf8").replace(/^\uFEFF/, ""));
const settlements = load("settlements.json").records;
const map = load("world_maps.json").records.find((r) => r.id === "world_map.first_world");
const features = load("world_map_features.json").records.find((r) => r.mapId === "world_map.first_world");
const regions = load("regions.json").records;
const localities = load("region_localities.json").records;
const hexes = load("world_hexes.json").records;
const edges = load("world_hex_edges.json").records;
const network = load("travel_networks.json").records.find((r) => r.mapId === "world_map.first_world");

if (!map || !features || !network) throw Error("Missing First World source authority.");
const scale = map.scaleProfile.kilometersPerPixel;
const byId = (rows) => new Map(rows.map((r) => [r.id, r]));
const S = byId(settlements), R = byId(regions), L = byId(localities), H = byId(hexes);
const warnings = [], hardFailures = [];

function emit(array, id, code, detail) { array.push({ id, code, detail }); }
function polygonContains(p, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[j], b = points[i];
    const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
    if (Math.abs(cross) < 1e-8 && (p.x - a.x) * (p.x - b.x) <= 0 &&
        (p.y - a.y) * (p.y - b.y) <= 0) return true;
    if ((a.y > p.y) !== (b.y > p.y) &&
        p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
const inside = (point, polygons) => polygons.filter((p) => polygonContains(point, p.points));
const km = (a, b) => scale * Math.hypot(
  a.visualMapRef.pixelX - b.visualMapRef.pixelX,
  a.visualMapRef.pixelY - b.visualMapRef.pixelY
);
const bands = { tiny: 0, small: 1, modest: 2, large: 3, major: 4 };
const perSettlement = [];

for (const site of settlements) {
  const id = site.id, anchor = site.visualMapRef;
  const point = { x: anchor.pixelX + .5, y: anchor.pixelY + .5 };
  const reg = R.get(site.regionId), parent = R.get(site.macroRegionId);
  const loc = L.get(site.localityBandId), hex = H.get(site.hexAnchorId);
  const footprint = inside(point, features.regionFootprints);
  const biome = inside(point, features.biomeZones);
  const climate = inside(point, features.climateZones);
  const expectedBiome = biome.filter((b) =>
    b.id === anchor.biomeZoneId || b.id.startsWith(anchor.biomeZoneId + ".part_"));
  const expectedClimate = climate.filter((c) => c.id === anchor.climateZoneId);
  const raceMixSum = site.racialMix.reduce((sum, r) => sum + r.percentage, 0);
  const racialMix = site.racialMix.toSorted((a, b) => b.percentage - a.percentage);

  if (!reg || !parent || !loc || !hex) emit(hardFailures, id, "unresolved_hierarchy", "Missing region, macro-region, locality or hex reference.");
  if (loc && (loc.regionId !== site.regionId || loc.macroRegionId !== site.macroRegionId))
    emit(hardFailures, id, "wrong_locality_parent", "Locality authority does not match settlement region/macro-region.");
  if (hex && (hex.localityBandId !== site.localityBandId || hex.regionId !== site.regionId ||
      !hex.anchoredSettlementIds.includes(id)))
    emit(hardFailures, id, "wrong_hex_parent", "Hex authority or reverse anchor disagrees.");
  if (anchor.mapId !== map.id || point.x < 0 || point.x >= features.referenceImageWidthPx ||
      point.y < 0 || point.y >= features.referenceImageHeightPx)
    emit(hardFailures, id, "invalid_map_coordinate", "Anchor map identity or bounds are invalid.");
  if (site.siteClass !== "underwater" &&
      (footprint.length !== 1 || !footprint[0].regionIds.some((v) => v === site.regionId || v === site.macroRegionId)))
    emit(hardFailures, id, "wrong_land_footprint", "Surface/subterranean anchor must belong to its single authored land footprint.");
  if (site.siteClass === "underwater" &&
      !biome.some((b) => b.biomeId.startsWith("biome.marine.")))
    emit(hardFailures, id, "wrong_marine_biome", "Underwater site lacks a marine biome.");
  if (expectedBiome.length !== 1) emit(hardFailures, id, "wrong_biome", "Declared biome layer does not uniquely contain the anchor.");
  if (expectedClimate.length !== 1) emit(hardFailures, id, "wrong_climate", "Declared climate zone does not contain the anchor.");
  if (loc && !loc.supportedSiteClasses.includes(site.siteClass))
    emit(hardFailures, id, "unsupported_site_class", "Locality does not support the settlement's site class.");
  if (raceMixSum !== 100 || new Set(site.racialMix.map((r) => r.race)).size !== site.racialMix.length)
    emit(hardFailures, id, "invalid_racial_mix", "Racial percentages do not total 100 or keys are duplicated.");
  for (const flow of site.domesticTradeFlows)
    if (!S.has(flow.partnerSettlementId))
      emit(hardFailures, id, "missing_trade_partner", flow.partnerSettlementId);
  if (loc && !loc.settlementSuitability.favoredSettlementTypes.includes(site.settlementType))
    emit(warnings, id, "unfavored_settlement_type", "Advisory only: a favored type list is not a closed enum.");
  if (loc && bands[site.populationBand] > bands[loc.settlementSuitability.maxPopulationBand])
    emit(warnings, id, "above_locality_population_band", loc.settlementSuitability.maxPopulationBand);
  if (climate.length > 1)
    emit(warnings, id, "climate_polygon_overlap", "Declared zone is present, but broad climate polygons overlap.");
  if (biome.length > 1 && site.siteClass === "subterranean")
    emit(warnings, id, "surface_and_subterranean_biomes", "Expected dual layer, not a placement error.");

  const neighbors = settlements
    .filter((candidate) => candidate.id !== id && candidate.macroRegionId === site.macroRegionId)
    .map((candidate) => ({ settlementId: candidate.id, distanceKilometers: Math.round(km(site, candidate)) }))
    .sort((a, b) => a.distanceKilometers - b.distanceKilometers);
  perSettlement.push({
    settlementId: id, name: site.name, macroRegionId: site.macroRegionId,
    regionId: site.regionId, localityBandId: site.localityBandId, hexAnchorId: site.hexAnchorId,
    siteClass: site.siteClass, settlementType: site.settlementType,
    pixel: [anchor.pixelX, anchor.pixelY], populationTotal: site.populationTotal,
    dominantRace: racialMix[0]?.race ?? null, dominantRacePercent: racialMix[0]?.percentage ?? null,
    racialMix, landFootprintIds: footprint.map((p) => p.id),
    biomeIds: biome.map((b) => b.id), climateIds: climate.map((c) => c.id),
    nearestSameMacroSettlement: neighbors[0] ?? null,
    findings: [...hardFailures, ...warnings].filter((issue) => issue.id === id).map((issue) => issue.code)
  });
}

for (const hex of hexes)
  for (const settlementId of hex.anchoredSettlementIds)
    if (!S.has(settlementId) || S.get(settlementId).hexAnchorId !== hex.id)
      emit(hardFailures, hex.id, "wrong_reverse_settlement_reference", settlementId);

const underwaterHexIds = new Set(settlements.filter((s) => s.siteClass === "underwater").map((s) => s.hexAnchorId));
const submergedFerryEdges = edges.filter((edge) =>
  edge.edgeType === "ferry" && (underwaterHexIds.has(edge.fromHexId) || underwaterHexIds.has(edge.toHexId)) &&
  !edge.allowedTravelModes.some((mode) => /sea_vessel|swim|underwater/.test(mode))
);
const terrestrialOnlyFerries = edges.filter((edge) =>
  edge.edgeType === "ferry" && edge.allowedTravelModes.every((mode) =>
    /foot|horseback|pack_animal|wagon/.test(mode))
);
const allFlows = settlements.flatMap((s) => s.domesticTradeFlows.map((flow) => ({
  fromSettlementId: s.id, toSettlementId: flow.partnerSettlementId,
  distanceKilometers: S.has(flow.partnerSettlementId) ? Math.round(km(s, S.get(flow.partnerSettlementId))) : null,
  modes: flow.routeModes
})));
const allRoutes = [...network.routeRecords, ...network.interPortShipRoutes];
const countBy = (array, key) => Object.fromEntries(
  [...new Set(array.map((v) => v[key]))].sort().map((v) => [v, array.filter((r) => r[key] === v).length])
);

const result = {
  format: "first-world-settlement-map-audit.v1",
  status: hardFailures.length ? "HARD_SOURCE_FAILURE" : "SOURCE_RELATIONSHIPS_VALID_WITH_DESIGN_WARNINGS",
  sourcePaths: [
    "packages/content/base/world/settlements.json",
    "packages/content/base/world/world_maps.json",
    "packages/content/base/world/world_map_features.json",
    "packages/content/base/world/regions.json",
    "packages/content/base/world/region_localities.json",
    "packages/content/base/world/world_hexes.json",
    "packages/content/base/world/world_hex_edges.json",
    "packages/content/base/world/travel_networks.json"
  ],
  scaleKilometersPerPixel: scale,
  summary: {
    settlementCount: settlements.length, byMacroRegion: countBy(settlements, "macroRegionId"),
    bySiteClass: countBy(settlements, "siteClass"),
    worldHexes: hexes.length, anchoredWorldHexes: hexes.filter((hex) => hex.anchoredSettlementIds.length > 0).length,
    landFootprintParts: features.regionFootprints.length,
    unoccupiedFootprintParts: features.regionFootprints.filter((part) =>
      !perSettlement.some((s) => s.landFootprintIds.includes(part.id))).length,
    climateOverlappingSettlementAnchors: perSettlement.filter((s) => s.climateIds.length > 1).length,
    extraSubterraneanBiomeLayers: perSettlement.filter((s) => s.biomeIds.length > 1).length,
    actualRouteRecords: allRoutes.length,
    authoredTradeFlows: allFlows.length,
    tradeFlowsLongerThan1000Km: allFlows.filter((f) => f.distanceKilometers > 1000).length,
    ferryEdges: edges.filter((edge) => edge.edgeType === "ferry").length,
    terrestrialOnlyFerryEdges: terrestrialOnlyFerries.map((edge) => edge.id),
    submergedFerryEdges: submergedFerryEdges.map((edge) => edge.id),
    noNamedFullOrcGoblinTrollMerfolkInCensus: ["orcs", "goblins", "trolls", "merfolk"]
      .every((race) => !settlements.some((site) => site.racialMix.some((r) => r.race === race)))
  },
  hardFailures, warnings, perSettlement
};

if (process.argv.includes("--json")) process.stdout.write(JSON.stringify(result, null, 2) + "\n");
else {
  const s = result.summary;
  console.log("First World settlements:", s.settlementCount, "hard failures:", hardFailures.length);
  console.log("Surface / subterranean / underwater:", JSON.stringify(s.bySiteClass));
  console.log("Mapped hexes:", s.anchoredWorldHexes + "/" + s.worldHexes);
  console.log("Unoccupied region-footprint parts:", s.unoccupiedFootprintParts, "(not a verified uninhabited-island count)");
  console.log("Climate overlaps:", s.climateOverlappingSettlementAnchors, "(design overlaps, not automatically errors)");
  console.log("Trade flows over 1000 km:", s.tradeFlowsLongerThan1000Km + "/" + s.authoredTradeFlows);
  console.log("Ferry edges lacking vessel semantics:", s.terrestrialOnlyFerryEdges.length);
  console.log("Underwater endpoints on these edges:", s.submergedFerryEdges.length);
  for (const failure of hardFailures) console.error("HARD", JSON.stringify(failure));
}
if (hardFailures.length > 0) process.exitCode = 1;
