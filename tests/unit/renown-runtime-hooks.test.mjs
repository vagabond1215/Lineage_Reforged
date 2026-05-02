import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  buildBodyStatePresentation,
  createInitialBodyStatePresentationMemory
} from "../../apps/rpg-ui/src/runtime/bodyStatePresentation.ts";
import { createUiViewModel } from "../../apps/rpg-ui/src/runtime/uiViewModel.ts";
import {
  createDefaultAccountProfileState,
  grantLegacy,
  getLegacyUnlockDefinitions,
  purchaseLegacyUnlock
} from "../../packages/engines/game-engine/src/index.ts";

function grantProfile(amount = 1000) {
  const granted = grantLegacy(createDefaultAccountProfileState(), {
    amount,
    summary: "Renown test grant",
    sourceType: "test",
    sourceId: "test.renown",
    recordedAt: "2026-04-23T12:00:00.000Z"
  });

  assert.equal(granted.ok, true);
  return granted.profile;
}

function purchaseUnlockIds(profile, unlockIds, startMinute = 0) {
  let nextProfile = profile;

  unlockIds.forEach((unlockId, index) => {
    const purchased = purchaseLegacyUnlock(
      nextProfile,
      unlockId,
      `2026-04-23T12:${(startMinute + index).toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    nextProfile = purchased.profile;
  });

  return nextProfile;
}

function getVerdantThalosSupportUnlockIds() {
  const regionDefinition = getLegacyUnlockDefinitions().find(
    (definition) => definition.id === "legacy.unlock.renown.region.verdant_thalos"
  );

  assert.ok(regionDefinition?.renownNode?.supportUnlockIds);
  return [...regionDefinition.renownNode.supportUnlockIds];
}

function buildUi(snapshot, profile) {
  const bodyStatePresentation = buildBodyStatePresentation(
    snapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );

  return createUiViewModel(snapshot, bodyStatePresentation, profile);
}

test("current-location Renown appears in the top bar, overview, world note, and activity note", () => {
  let profile = grantProfile(500);
  profile = purchaseUnlockIds(profile, ["legacy.unlock.renown.settlement.aurelis"]);
  profile = {
    ...profile,
    legacy: {
      ...profile.legacy,
      legacyUnlocks: [
        ...profile.legacy.legacyUnlocks,
        {
          unlockId: "legacy.unlock.renown.village_name",
          unlockedAt: "2026-04-23T12:30:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260423123000000.1"
        }
      ]
    }
  };

  const uiViewModel = buildUi(structuredClone(demoSnapshot), profile);
  const renownMetric = uiViewModel.character.overviewMetrics.find((metric) => metric.id === "renown");
  const aurelisLocation = uiViewModel.world.locations.find((location) => location.name === "Aurelis");

  assert.equal(uiViewModel.topBar.renownLabel, "Name known in Aurelis");
  assert.equal(renownMetric?.value, "Settlement I");
  assert.match(renownMetric?.detail ?? "", /Primary reach: Aurelis\./);
  assert.equal(
    uiViewModel.activity.renownNote,
    "Reception: a known family name smooths the room."
  );
  assert.match(aurelisLocation?.note ?? "", /Recognition: Aurelis knows the family name\./);
  assert.match(
    aurelisLocation?.note ?? "",
    /Current player location with major harbor access\./
  );
});

test("local Renown stays local first while regional Renown broadens only within matching geography", () => {
  let profile = grantProfile(2000);
  profile = purchaseUnlockIds(profile, [
    ...getVerdantThalosSupportUnlockIds(),
    "legacy.unlock.renown.region.verdant_thalos"
  ]);

  const snapshot = structuredClone(demoSnapshot);
  snapshot.sessionState.knownLocations.push({
    id: "location.vine_road",
    name: "Vine Road",
    regionLabel: "Verdant Thalos",
    regionId: "region.verdant_thalos",
    type: "settlement",
    x: 22,
    y: 36,
    note: "Quiet road station.",
    known: true
  });

  const uiViewModel = buildUi(snapshot, profile);
  const aurelisLocation = uiViewModel.world.locations.find((location) => location.name === "Aurelis");
  const vineRoadLocation = uiViewModel.world.locations.find((location) => location.name === "Vine Road");
  const stoneveinLocation = uiViewModel.world.locations.find((location) => location.name === "Stonevein");

  assert.match(aurelisLocation?.note ?? "", /Recognition: Aurelis knows the line\./);
  assert.match(
    vineRoadLocation?.note ?? "",
    /Recognition: Verdant Thalos knows the line here\./
  );
  assert.equal((stoneveinLocation?.note ?? "").includes("Recognition:"), false);
});

test("older saves missing optional geography ids fail safely and still surface universal Renown", () => {
  let profile = grantProfile(2500);
  profile = purchaseUnlockIds(profile, [
    ...getVerdantThalosSupportUnlockIds(),
    "legacy.unlock.renown.region.verdant_thalos",
    "legacy.unlock.renown.continent.kaelvar",
    "legacy.unlock.renown.universal"
  ]);

  const snapshot = structuredClone(demoSnapshot);
  snapshot.playerState.location.settlementId = null;
  snapshot.playerState.regionId = "region.unknown";
  snapshot.sessionState.knownLocations = snapshot.sessionState.knownLocations.map((location) => ({
    id: location.id,
    name: location.name,
    regionLabel: location.regionLabel,
    type: location.type,
    x: location.x,
    y: location.y,
    note: location.note,
    known: location.known
  }));

  const uiViewModel = buildUi(snapshot, profile);
  const renownMetric = uiViewModel.character.overviewMetrics.find((metric) => metric.id === "renown");

  assert.equal(uiViewModel.topBar.renownLabel, "Known widely");
  assert.equal(renownMetric?.value, "Universal I");
  assert.match(uiViewModel.world.locations[0]?.note ?? "", /Recognition: The line is known even this far from home\./);
});

test("Renown runtime hooks do not grant direct combat, stat, or resource power", () => {
  let profile = grantProfile(1000);
  profile = purchaseUnlockIds(profile, ["legacy.unlock.renown.settlement.aurelis"]);
  profile = {
    ...profile,
    legacy: {
      ...profile.legacy,
      legacyUnlocks: [
        ...profile.legacy.legacyUnlocks,
        {
          unlockId: "legacy.unlock.renown.veteran_reputation",
          unlockedAt: "2026-04-23T12:45:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260423124500000.1"
        }
      ]
    }
  };

  const snapshot = structuredClone(demoSnapshot);
  const attributesBefore = structuredClone(snapshot.playerState.attributes);
  const resourcesBefore = structuredClone(snapshot.playerState.resources);

  buildUi(snapshot, profile);

  assert.deepEqual(snapshot.playerState.attributes, attributesBefore);
  assert.deepEqual(snapshot.playerState.resources, resourcesBefore);
});
