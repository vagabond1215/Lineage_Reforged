import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

async function loadRecords(path) {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
  return parsed.records;
}

test("region-first world data exposes survivability and locality hierarchy", async () => {
  const regions = await loadRecords("packages/content/base/world/regions.json");
  const ecologyProfiles = await loadRecords("packages/content/base/world/regional_ecology_profiles.json");
  const localities = await loadRecords("packages/content/base/world/region_localities.json");
  const settlements = await loadRecords("packages/content/base/world/settlements.json");
  const hexes = await loadRecords("packages/content/base/world/world_hexes.json");

  assert.ok(regions.length > 0, "expected authored regions");
  assert.ok(ecologyProfiles.length > 0, "expected ecology profiles");
  assert.ok(localities.length > 0, "expected region locality bands");
  assert.ok(settlements.length > 0, "expected authored settlements");
  assert.ok(hexes.length > 0, "expected authored world hexes");

  for (const region of regions) {
    if (region.regionType === "ocean") {
      continue;
    }
    assert.ok(Array.isArray(region.environmentProfile?.dominantBiomeMix));
    assert.equal(typeof region.environmentProfile?.elevationProfile, "string");
    const climateTendencies = region.environmentProfile?.climateTendencies;
    assert.ok(Array.isArray(climateTendencies), `${region.id} climateTendencies must be an array`);
    assert.ok(climateTendencies.length > 0, `${region.id} climateTendencies must not be empty`);
    for (const tendency of climateTendencies) {
      assert.equal(typeof tendency, "string", `${region.id} climate tendency must be a string`);
      assert.match(tendency, /^[a-z0-9]+(?:_[a-z0-9]+)*$/, `${region.id} climate tendency must be normalized`);
    }
    assert.equal(typeof region.simulationProfile?.habitationScore, "number");
    assert.equal(typeof region.simulationProfile?.foodProductionCapacity, "number");
    assert.equal(typeof region.simulationProfile?.waterAvailability, "number");
    assert.equal(typeof region.simulationProfile?.climateBurden, "number");
    assert.equal(typeof region.simulationProfile?.hazardPressure, "number");
    assert.equal(typeof region.simulationProfile?.infrastructureDifficulty, "number");
    assert.equal(typeof region.populationProfile?.populationCapacity, "number");
    assert.equal(typeof region.populationProfile?.densityBand, "string");
    assert.ok(Array.isArray(region.economicProfile?.supplyStrengths));
    assert.ok(Array.isArray(region.economicProfile?.demandPressures));
    assert.equal(typeof region.settlementDistributionModel?.targetCounts?.city, "number");
    assert.equal(typeof region.settlementDistributionModel?.generationRules?.asymmetryMode, "string");
  }

  for (const ecology of ecologyProfiles) {
    assert.equal(typeof ecology.simulationProfile?.habitationScore, "number");
    assert.equal(typeof ecology.simulationProfile?.foodProductionCapacity, "number");
    assert.equal(typeof ecology.simulationProfile?.waterAvailability, "number");
    assert.equal(typeof ecology.simulationProfile?.climateBurden, "number");
    assert.equal(typeof ecology.simulationProfile?.hazardPressure, "number");
    assert.equal(typeof ecology.simulationProfile?.infrastructureDifficulty, "number");
    assert.ok(Array.isArray(ecology.supplyStrengths));
    assert.ok(Array.isArray(ecology.demandPressures));
  }
});

test("settlements derive from locality bands instead of pixel truth", async () => {
  const regions = await loadRecords("packages/content/base/world/regions.json");
  const localities = await loadRecords("packages/content/base/world/region_localities.json");
  const settlements = await loadRecords("packages/content/base/world/settlements.json");
  const hexes = await loadRecords("packages/content/base/world/world_hexes.json");

  const regionById = new Map(regions.map((region) => [region.id, region]));
  const localityById = new Map(localities.map((locality) => [locality.id, locality]));
  const hexById = new Map(hexes.map((hex) => [hex.id, hex]));

  for (const locality of localities) {
    const parentRegion = regionById.get(locality.regionId);
    assert.ok(parentRegion, `missing parent region for ${locality.id}`);
    assert.equal(locality.macroRegionId, parentRegion.parentRegionId ?? parentRegion.id);
    assert.equal(typeof locality.habitationScoreModifier, "number");
    assert.equal(typeof locality.settlementSuitability?.settlementWeight, "number");
    assert.ok(Array.isArray(locality.dominantIndustries));
    assert.ok(Array.isArray(locality.supportedSiteClasses));
  }

  for (const settlement of settlements) {
    const locality = localityById.get(settlement.localityBandId);
    assert.ok(locality, `missing locality ${settlement.localityBandId} for ${settlement.id}`);
    const hex = hexById.get(settlement.hexAnchorId);
    assert.ok(hex, `missing hex ${settlement.hexAnchorId} for ${settlement.id}`);
    assert.equal(settlement.regionId, locality.regionId, `${settlement.id} region mismatch`);
    assert.equal(settlement.macroRegionId, locality.macroRegionId, `${settlement.id} macro region mismatch`);
    assert.ok(locality.supportedSiteClasses.includes(settlement.siteClass), `${settlement.id} site class not supported`);
    assert.equal(settlement.terrainContext, locality.localityType, `${settlement.id} terrain context mismatch`);
    assert.equal(hex.regionId, settlement.regionId, `${settlement.id} hex region mismatch`);
    assert.equal(hex.localityBandId, settlement.localityBandId, `${settlement.id} hex locality mismatch`);
    assert.ok(hex.anchoredSettlementIds.includes(settlement.id), `${settlement.id} missing from anchoredSettlementIds`);
    assert.equal("mapLocation" in settlement, false, `${settlement.id} still exposes mapLocation`);
    assert.equal(typeof settlement.populationBand, "string");
    assert.equal(typeof settlement.settlementType, "string");
    assert.equal(typeof settlement.economicModel?.dominantRole, "string");
    assert.equal(typeof settlement.survivalModel?.habitationScore, "number");
    assert.equal(typeof settlement.tradeDependencyProfile?.importBias, "number");
  }
});