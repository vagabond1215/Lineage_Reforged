import test from "node:test";
import assert from "node:assert/strict";

const sampleSnapshot = {
  snapshotVersion: "0.1.0",
  capturedAtTick: 24,
  playerState: {
    playerId: "player-001",
    regionId: "region-001",
    stats: { STR: 10, DEX: 10, CON: 10 },
    flags: ["started"]
  },
  worldState: {
    activeRegions: ["region-001"],
    weatherState: { climateProfileId: "climate.standard" }
  },
  civilizationState: {
    settlements: ["settlement-001"],
    markets: ["market-001"]
  },
  sessionState: {
    activeEvents: ["event.weather.shift"],
    flags: ["tutorial.complete"],
    triggers: ["trigger.first_camp"],
    completedEvents: []
  }
};

test("save snapshot roundtrip preserves state", () => {
  const serialized = JSON.stringify(sampleSnapshot);
  const restored = JSON.parse(serialized);

  assert.deepEqual(restored, sampleSnapshot);
});