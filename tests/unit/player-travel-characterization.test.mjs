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
    snapshotHash: "bfae227d04a6c791ea87309043d393a4436c97318233919f57540fe9bd61adda",
    previewHash: "94b981b2cdd85e01c41d975a3f7ea163aecb184de9339fe9cd991fc9dda37d10"
  },
  {
    id: "location.ashen_reef",
    snapshotHash: "b1989eeb2199cec39551ee9710784f8404aa67322334d5271a350e047717b0bf",
    previewHash: "e4c783091049535da537323c3f8f39b16b9181e636b56032816192af98bd840c"
  },
  {
    id: "location.crown_bastion",
    snapshotHash: "34f304444be411e8b266541051d259681a2b169c61f086b05b362cb0062764c1",
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
          ? "Starfall Port"
          : "Sunspire Reach"} is now the active location.`
    });
  }
});
