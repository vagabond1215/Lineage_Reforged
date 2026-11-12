import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.js";
import {
  buildStarfallBaseEconomyPreview,
  STARFALL_ECONOMY_FOCUS,
  STARFALL_STARTING_SETTLEMENT_IDS,
  STARFALL_EXTERNAL_TRADE_CONTEXT_IDS
} from "../../packages/engines/civilization-engine/src/starfall-base-economy.js";
import { loadSettlementContent } from "../../packages/engines/civilization-engine/src/content.js";

function posture(preview, settlementId, category) {
  const match = preview.authoredPosture.filter((row) =>
    row.settlementId === settlementId && row.category === category);
  assert.equal(match.length, 1, `ambiguous economy posture: ${settlementId}/${category}`);
  return match[0];
}

test("Starfall economy derives focused supply/demand from exactly five existing Myridian settlements", () => {
  const preview = buildStarfallBaseEconomyPreview(createInitialClock());
  const ids = [...STARFALL_STARTING_SETTLEMENT_IDS, ...STARFALL_EXTERNAL_TRADE_CONTEXT_IDS];
  assert.equal(ids.length, 5);
  assert.equal(new Set(ids).size, 5);
  assert.deepEqual(preview.localSettlementIds, [...STARFALL_STARTING_SETTLEMENT_IDS]);
  assert.deepEqual(preview.externalContextSettlementIds, [...STARFALL_EXTERNAL_TRADE_CONTEXT_IDS]);
  assert.equal(preview.authoredPosture.length, ids.length * STARFALL_ECONOMY_FOCUS.length);
  const known = new Map(loadSettlementContent().map((row) => [row.id, row]));
  for (const id of ids) assert.equal(known.get(id)?.macroRegionId, "region.myridian_chain");
  assert.deepEqual(posture(preview, "settlement.starfall_port", "fish").supplyKeys,
    ["salted_fish"]);
  assert.deepEqual(posture(preview, "settlement.starfall_port", "grain").demandKeys,
    ["grain"]);
  assert.deepEqual(posture(preview, "settlement.starfall_port", "rope").supplyKeys,
    ["rope", "ship_rigging"]);
  assert.deepEqual(posture(preview, "settlement.starfall_port", "timber").demandKeys,
    ["timber", "bulk_timber"]);
  assert.deepEqual(posture(preview, "settlement.starfall_port", "metal").demandKeys,
    ["metal"]);
  assert.deepEqual(posture(preview, "settlement.foammarket_ferry", "fish").supplyKeys,
    ["fish"]);
  assert.deepEqual(posture(preview, "settlement.chainlight_bastion", "rope").demandKeys,
    ["rope"]);
});

test("Starfall economy reuses the civilization engine but never commits a World market or advances time", () => {
  const clock = createInitialClock();
  const before = JSON.stringify(clock);
  const first = buildStarfallBaseEconomyPreview(clock);
  const again = buildStarfallBaseEconomyPreview(clock);
  assert.equal(JSON.stringify(clock), before, "economy bootstrap must not move time");
  assert.equal(first.kind, "starfall_base_economy_read_only_preview_v1");
  assert.equal(first.committed, false);
  assert.equal(first.sourceWorldTemplateId, "world_template.first_world.starfall_port.chronicle_v1");
  assert.equal(first.economyTick, clock.tick);
  assert.deepEqual(first, again, "same authored data and clock must make the same projection");
  assert.ok(first.projection.snapshots.some((s) =>
    s.level === "settlement" && s.settlementId === "settlement.starfall_port"));
  assert.ok(first.projection.marketStates.some((s) =>
    s.settlementId === "settlement.starfall_port"));
  assert.ok(first.projection.simulationStates.some((s) =>
    s.settlementId === "settlement.starfall_port"));
  assert.ok(first.limitations.some((note) => /not available player goods/.test(note)));
});

test("Starfall category labels are a source-backed view, not invented item keys or merchant offers", () => {
  const preview = buildStarfallBaseEconomyPreview(createInitialClock());
  assert.deepEqual(STARFALL_ECONOMY_FOCUS.map((f) => f.category),
    ["fish", "grain", "rope", "timber", "metal"]);
  const source = new Map(loadSettlementContent().map((row) => [row.id, row]));
  for (const row of preview.authoredPosture) {
    const settlement = source.get(row.settlementId);
    const actualSupply = new Set([
      ...settlement.economicModel.localSupplyStrengths,
      ...settlement.domesticResourceProfile.primaryGoods,
      ...settlement.domesticResourceProfile.secondaryGoods,
      ...settlement.tradeDependencyProfile.exportFocus
    ]);
    const actualDemand = new Set([
      ...settlement.economicModel.demandPressures,
      ...settlement.domesticResourceProfile.demandedGoods,
      ...settlement.tradeDependencyProfile.stapleImports
    ]);
    assert.ok(row.supplyKeys.every((k) => actualSupply.has(k)));
    assert.ok(row.demandKeys.every((k) => actualDemand.has(k)));
    assert.equal(row.source, "canonical_settlement_profiles");
  }
  assert.equal(preview.committed, false);
  assert.ok(!("shopInventory" in preview));
  assert.ok(!("stockSnapshot" in preview));
  assert.ok(!("worldInstanceId" in preview));
});
