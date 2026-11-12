import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const ROOT = new URL("../../packages/content/base/world/", import.meta.url);
const load = (path) =>
  JSON.parse(readFileSync(new URL(path, ROOT), "utf8").replace(/^\uFEFF/, ""));
const template = load("templates/starfall_port_chronicle_v1.json");
const features = load("world_map_features.json").records[0];
const settlementRows = load("settlements.json").records;
const map = load("world_maps.json").records.find((row) => row.id === "world_map.first_world");

function pointOnSegment(p, a, b) {
  const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
  return Math.abs(cross) < 1e-8 && (p.x - a.x) * (p.x - b.x) <= 0 &&
    (p.y - a.y) * (p.y - b.y) <= 0;
}

function pointInPolygon(p, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    if (pointOnSegment(p, a, b)) return true;
    if ((a.y > p.y) !== (b.y > p.y) &&
        p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function containingParts(point, polygons) {
  return polygons.filter((polygon) => pointInPolygon(point, polygon.points));
}

function pngDimensions(assetPath) {
  const bytes = readFileSync(new URL(assetPath, new URL("../../", import.meta.url)));
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "not PNG");
  assert.equal(bytes.toString("ascii", 12, 16), "IHDR");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test("Starfall Port is truly inside the authored Myridian island/chaparral/climate polygons", () => {
  assert.ok(map);
  const align = template.sourceGeography.rasterAlignment;
  const port = settlementRows.find((row) => row.id === "settlement.starfall_port");
  assert.deepEqual(
    { x: port.visualMapRef.pixelX + .5, y: port.visualMapRef.pixelY + .5 },
    align.settlementPixelCenter);
  assert.equal(port.visualMapRef.biomeZoneId, align.visualBiomeZoneId);
  const point = align.settlementPixelCenter;
  assert.deepEqual(containingParts(point, features.regionFootprints).map((p) => p.id),
    [align.sourceRegionFootprintPartId]);
  const biome = containingParts(point, features.biomeZones);
  assert.deepEqual(biome.map((p) => p.id), [align.visualBiomePartId]);
  assert.equal(biome[0].biomeId, "biome.shrublands.chaparral");
  assert.deepEqual(containingParts(point, features.climateZones).map((p) => p.id),
    [align.visualClimateZoneId]);
  const xs = biome[0].points.map((p) => p.x), ys = biome[0].points.map((p) => p.y);
  assert.deepEqual(align.visualBiomePartBoundsPx, {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys)
  });
  assert.equal(template.sourceGeography.macroBiome, "mixed_forest_archipelago",
    "world-hex semantics remain distinct from authored visual biome");
});

test("all five regional settlements resolve to real Myridian land-biome geometry", () => {
  for (const id of [
    "settlement.starfall_port", "settlement.harbormast_quay",
    "settlement.foammarket_ferry", "settlement.pearlwake",
    "settlement.chainlight_bastion"
  ]) {
    const record = settlementRows.find((row) => row.id === id);
    assert.ok(record, `missing settlement: ${id}`);
    const point = { x: record.visualMapRef.pixelX + .5, y: record.visualMapRef.pixelY + .5 };
    const regions = containingParts(point, features.regionFootprints);
    const biomes = containingParts(point, features.biomeZones);
    const climate = containingParts(point, features.climateZones);
    assert.equal(regions.length, 1, `missing/ambiguous island geometry: ${id}`);
    assert.equal(biomes.length, 1, `missing/ambiguous visual biome: ${id}`);
    assert.equal(biomes[0].biomeId, "biome.shrublands.chaparral");
    assert.equal(climate.length, 1);
    assert.equal(climate[0].id, "map_climate.first_world.myridian_chain");
  }
});

test("both source rasters exist at canonical 2048x1152 dimensions, height interpretation remains pending", () => {
  assert.equal(features.referenceImageWidthPx, 2048);
  assert.equal(features.referenceImageHeightPx, 1152);
  const align = template.sourceGeography.rasterAlignment;
  for (const asset of [align.heightRasterPath, align.biomeRasterPath]) {
    const relative = asset.replace(/^packages\//, "packages/");
    const result = pngDimensions(relative);
    assert.deepEqual(result, { width: 2048, height: 1152 }, asset);
  }
  assert.equal(align.elevationSample, null, "do not fabricate pixel elevations");
  assert.equal(align.localAreaFootprintOnRaster, null, "local tile grid is not measured raster footprint");
  assert.equal(align.status, "macro_anchor_verified_local_extent_and_height_unverified");
});

test("Foammarket's ferry is a mapped crossing with Pearlwake trade, not a confirmed two-terminal travel route", () => {
  const f = template.sourceGeography.unresolvedFerryConnection;
  const crossing = features.crossingFeatures.find((row) => row.id === f.crossingFeatureId);
  assert.ok(crossing);
  assert.deepEqual(crossing.point, f.crossingMapPixel);
  assert.equal(crossing.crossingType, "ferry");
  const foammarket = settlementRows.find((row) => row.id === f.settlementId);
  assert.ok(foammarket.domesticTradeFlows.some((flow) =>
    flow.partnerSettlementId === f.documentedTradePartnerSettlementId));
  const network = load("travel_networks.json").records.find((row) => row.id === "travel_network.first_world");
  const links = [...network.routeRecords, ...network.interPortShipRoutes];
  assert.equal(links.some((row) =>
    row.fromSettlementId === f.settlementId || row.toSettlementId === f.settlementId), false);
  assert.equal(f.executableTravelRouteId, null);
  assert.equal(f.confirmedVesselTerminalSettlementIds, null);
});


test("the PNG audit actually decodes both original rasters at Starfall macro cross-sections", () => {
  const run = spawnSync(process.execPath, ["scripts/audit-starfall-raster.mjs"], {
    cwd: new URL("../../", import.meta.url), encoding: "utf8", timeout: 90000
  });
  assert.equal(run.error, undefined, run.error?.message);
  assert.equal(run.status, 0, run.stderr || "raster audit failed");
  assert.match(run.stdout, /"layer": "biome"/);
  assert.match(run.stdout, /"layer": "elevation"/);
  assert.equal((run.stdout.match(/"starfallMacroCrossSections"/g) ?? []).length, 2);
  assert.equal((run.stdout.match(/"mapScaleKilometersPerPixel": 9\.765625/g) ?? []).length, 2);
  assert.equal((run.stdout.match(/"eastWestAtY245"/g) ?? []).length, 2);
  assert.equal((run.stdout.match(/"northSouthAtX825"/g) ?? []).length, 2);
});
