import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import {
  previewTravelToKnownLocation,
  travelToKnownLocation
} from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const CHARACTERIZED_DESTINATIONS = [
  {
    id: "location.westreach",
    snapshotHash: "c5bac68e1b544c93b9318b835d943eb4e4db8445f0d4aad584c8b9c19e735fb4",
    previewHash: "94b981b2cdd85e01c41d975a3f7ea163aecb184de9339fe9cd991fc9dda37d10"
  },
  {
    id: "location.ashen_reef",
    snapshotHash: "5c4658f3183f30dff453757bf9f9c3ab41680022f6def91058013ffea36d8ab1",
    previewHash: "e4c783091049535da537323c3f8f39b16b9181e636b56032816192af98bd840c"
  },
  {
    id: "location.crown_bastion",
    snapshotHash: "1f0b10466e205e7667705685efa36c6ba4e97b20a88b83c7eaf2e32b90d8198f",
    previewHash: "575194102b110bc877d671c131be467eee4b535baf77a4e22fc39d699e229036"
  }
];

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

test("current travel preview and accepted snapshot remain fully characterized", () => {
  for (const fixture of CHARACTERIZED_DESTINATIONS) {
    const snapshot = structuredClone(demoSnapshot);
    const preview = previewTravelToKnownLocation(snapshot, fixture.id);
    const result = travelToKnownLocation(snapshot, fixture.id);

    assert.equal(hash(preview), fixture.previewHash, `${fixture.id} preview drifted`);
    assert.equal(hash(result.snapshot), fixture.snapshotHash, `${fixture.id} accepted snapshot drifted`);
    assert.deepEqual(result.notice, {
      tone: "success",
      title: "Travel Complete",
      detail: `${result.snapshot.sessionState.currentActivity?.id === "activity.arrival.westreach"
        ? "Stonevein"
        : result.snapshot.sessionState.currentActivity?.id === "activity.survey.ashen_reef"
          ? "Ashen Reef"
          : "Sunspire Reach"} is now the active location.`
    });
  }
});
