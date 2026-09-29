import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateEncounterActionContexts } from "../../tools/content-lint/encounter-action-contexts.mjs";

const base = "packages/content/base/world/";
async function load(name) {
  return JSON.parse((await readFile(`${base}${name}.json`, "utf8")).replace(/^\uFEFF/, "")).records;
}
const fixture = {
  records: await load("encounter_action_contexts"),
  world: {
    regions: await load("regions"),
    settlements: await load("settlements"),
    worldHexes: await load("world_hexes"),
    worldHexEdges: await load("world_hex_edges"),
    spawnProfiles: await load("spawn_profiles"),
    encounterTemplates: await load("encounter_templates"),
    monsters: await load("monsters")
  }
};

function check(mutate) {
  const { records, world } = structuredClone(fixture);
  mutate(records, world);
  validateEncounterActionContexts(records, world);
}

test("authored Stonevein exploration context has a supported frontier encounter", () => {
  check(() => {});
  assert.equal(fixture.records.length, 1);
  assert.equal(fixture.records[0].hazardSource, "region.auric_marches.simulationProfile.hazardPressure");
});

for (const [name, mutate, error] of [
  ["wrong origin", (r) => { r[0].originSettlementId = "settlement.aurelis"; }, /origin settlement or region ancestry mismatch/],
  ["wrong origin hex", (r) => { r[0].originWorldHexId = "world_hex.auric_marches_caravan_marches"; }, /origin hex anchor mismatch/],
  ["wrong edge", (r) => { r[0].worldHexEdgeId = "world_hex_edge.aurelis_stonevein"; }, /edge endpoint or local region mismatch/],
  ["reversed edge", (r, w) => { const e = w.worldHexEdges.find((x) => x.id === r[0].worldHexEdgeId); [e.fromHexId, e.toHexId] = [e.toHexId, e.fromHexId]; }, /edge endpoint or local region mismatch/],
  ["cross-region endpoint", (r, w) => { w.worldHexes.find((x) => x.id === "world_hex.auric_marches_caravan_marches").regionId = "region.kaelvar"; }, /edge endpoint or local region mismatch/],
  ["missing parent", (r, w) => { w.regions.find((x) => x.id === r[0].localRegionId).parentRegionId = "region.missing"; }, /missing region parent/],
  ["wrong region ancestry", (r, w) => { w.regions.find((x) => x.id === r[0].localRegionId).parentRegionId = "region.valtherion"; }, /origin settlement or region ancestry mismatch/],
  ["wrong hazard source", (r) => { r[0].hazardSource = "region.kaelvar.simulationProfile.hazardPressure"; }, /missing or invalid local region hazard source/],
  ["missing hazard", (r, w) => { delete w.regions.find((x) => x.id === r[0].localRegionId).simulationProfile.hazardPressure; }, /missing or invalid local region hazard source/],
  ["non-numeric hazard", (r, w) => { w.regions.find((x) => x.id === r[0].localRegionId).simulationProfile.hazardPressure = "46"; }, /missing or invalid local region hazard source/],
  ["unsupported habitat", (r) => { r[0].habitatTags = ["unknown_habitat"]; }, /no eligible spawn profile, template and member set/],
  ["profile region mismatch", (r, w) => { w.spawnProfiles.find((x) => x.id === "spawn.kaelvar.frontier_tracks").regionIds = ["region.valtherion"]; }, /no eligible spawn profile, template and member set/],
  ["profile hazard mismatch", (r, w) => { w.spawnProfiles.find((x) => x.id === "spawn.kaelvar.frontier_tracks").maxHazardPressure = 40; }, /no eligible spawn profile, template and member set/],
  ["template habitat mismatch", (r, w) => { w.encounterTemplates.find((x) => x.id === "encounter.kaelvar.roadside_kobold_patrol").habitatTags = ["quarry_edge"]; }, /no eligible spawn profile, template and member set/],
  ["template disposition mismatch", (r, w) => { w.spawnProfiles.find((x) => x.id === "spawn.kaelvar.frontier_tracks").hostilityWeights.hostile = 0; }, /no eligible spawn profile, template and member set/],
  ["template movement mismatch", (r, w) => { w.spawnProfiles.find((x) => x.id === "spawn.kaelvar.frontier_tracks").allowedMovementModes = ["fixed"]; }, /no eligible spawn profile, template and member set/],
  ["member habitat mismatch", (r, w) => { w.monsters.find((x) => x.id === "monster.kobold_scout").habitatTags = ["quarry_edge"]; }, /no eligible spawn profile, template and member set/],
  ["missing member", (r, w) => { w.monsters = w.monsters.filter((x) => x.id !== "monster.kobold_scout"); }, /no eligible spawn profile, template and member set/],
  ["duplicate id", (r) => { r.push(structuredClone(r[0])); }, /duplicate context id/],
  ["ambiguous tuple", (r) => { r.push({ ...structuredClone(r[0]), id: "encounter_action_context.other" }); }, /ambiguous action\/origin\/edge tuple/],
  ["duplicate habitat", (r) => { r[0].habitatTags.push("frontier_track"); }, /invalid or duplicate habitatTags/],
  ["unknown field", (r) => { r[0].encounterTemplateId = "encounter.kaelvar.roadside_kobold_patrol"; }, /fields must match the strict schema/]
]) {
  test(`rejects ${name}`, () => assert.throws(() => check(mutate), error));
}
