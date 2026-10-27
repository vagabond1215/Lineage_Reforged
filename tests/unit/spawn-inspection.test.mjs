import test from "node:test";
import assert from "node:assert/strict";
import { inspectSpawnEligibility } from "../../packages/engines/world-engine/src/spawn/index.ts";
import { loadSpawnFoundationContent } from "../../packages/engines/world-engine/src/spawn/content.ts";
import { resolveSpawnCandidates } from "../../packages/engines/world-engine/src/spawn/index.ts";

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

test("spawn inspection explains a passing profile with rejected encounter templates", () => {
  const source = loadSpawnFoundationContent();
  const profile = source.spawnProfiles.find((entry) => entry.id === "spawn.kaelvar.frontier_tracks");
  assert.ok(profile);
  const content = {
    ...source,
    spawnProfiles: [{ ...profile, spawnRatePerDay: 100, encounterWeights: [{
      encounterTemplateId: profile.encounterWeights[0].encounterTemplateId,
      weight: 0
    }] }]
  };
  const state = {
    activeRegions: ["region.kaelvar"], weatherState: {},
    encounterContext: {
      regionId: "region.kaelvar", settlementId: null, siteId: null, worldHexId: null,
      habitatTags: ["frontier_track"], hazardPressure: 35
    }
  };
  const inspection = inspectSpawnEligibility(state, 1, 0, { content, selectionKey: "stable-probe" });
  assert.equal(inspection.profiles[0].passed, true);
  assert.equal(inspection.profiles[0].spawnRollPassed, true);
  assert.deepEqual(inspection.profiles[0].encounters[0].failures, ["nonpositive encounter weight"]);
  assert.equal(inspection.profiles[0].noCandidateReason, "No encounter template passes its authored constraints.");
  assert.deepEqual(inspection.candidates, resolveSpawnCandidates(state, 1, 0, { strict: true, content, selectionKey: "stable-probe" }));
});
