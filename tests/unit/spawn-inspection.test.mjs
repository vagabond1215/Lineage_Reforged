import test from "node:test";
import assert from "node:assert/strict";
import { inspectSpawnEligibility } from "../../packages/engines/world-engine/src/spawn/index.ts";

test("spawn inspection reports authored profile gates and repeats deterministically", () => {
  const state = {
    activeRegions: ["region.kaelvar"], weatherState: {},
    encounterContext: {
      regionId: "region.kaelvar", settlementId: null, siteId: null, worldHexId: null,
      habitatTags: ["frontier_track"], hazardPressure: 35
    }
  };
  const first = inspectSpawnEligibility(state, 1, 0);
  assert.deepEqual(inspectSpawnEligibility(state, 1, 0), first);
  assert.equal(first.contextError, null);
  assert.equal(first.profiles.find((profile) => profile.id === "spawn.kaelvar.frontier_tracks")?.passed, true);
  assert.deepEqual(first.profiles.find((profile) => profile.id === "spawn.kaelvar.brushland")?.failures, ["habitat"]);
  assert.deepEqual(first.unsupportedFilters, ["time of day", "season", "weather"]);
  assert.deepEqual(state.weatherState, {});

  const missing = inspectSpawnEligibility({ activeRegions: ["region.kaelvar"], weatherState: {} }, 1, 0);
  assert.equal(missing.contextError, "No authored encounter context is active.");
  assert.deepEqual(missing.candidates, []);
});
