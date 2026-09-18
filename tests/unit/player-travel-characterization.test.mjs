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
    snapshotHash: "87ba29b3504c44cad50cc6b548157a0117682ea8158c8b83a6b4aab649c3ed6e",
    previewHash: "94b981b2cdd85e01c41d975a3f7ea163aecb184de9339fe9cd991fc9dda37d10"
  },
  {
    id: "location.ashen_reef",
    snapshotHash: "6626768d21906b44684f03885061b7ac5088d720a45decd71ed33aede9714e73",
    previewHash: "e4c783091049535da537323c3f8f39b16b9181e636b56032816192af98bd840c"
  },
  {
    id: "location.crown_bastion",
    snapshotHash: "51cf40eb1f0511470b37ee1834793fc872cbfabe959c9b43bf5ec112a533779e",
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
