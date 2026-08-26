import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { toggleTrackedQuest } from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const ACTIVE_ID = "quest.ashen_reef_survey";
const CONTRACT_ID = "quest.rivet_shortfall_relief";

const TRACKED_SNAPSHOT_HASH = "0a60952d4b9c001bc9147ba32dfb48f84f00543ed0d1854fd0c7f03bd8118687";
const TRACKED_NOTICE_HASH = "6d364c85f4e69f804651d203ee9cab00124d913549ff328f5eeda9dc3624d5a1";
const UNTRACKED_SNAPSHOT_HASH = "1968629d26d1b8e108ccf3bda97b1a576ac64b66a701ced76dd2983198f4ed44";
const UNTRACKED_NOTICE_HASH = "339bb83cc0e08db15d34f0d994340944ae8100a81abf9c7917cba0602b19cbd3";

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

test("current quest track and untrack snapshots and notices remain fully characterized", () => {
  for (const [questId, snapshotHash, noticeHash] of [
    [CONTRACT_ID, TRACKED_SNAPSHOT_HASH, TRACKED_NOTICE_HASH],
    [ACTIVE_ID, UNTRACKED_SNAPSHOT_HASH, UNTRACKED_NOTICE_HASH]
  ]) {
    const snapshot = structuredClone(demoSnapshot);
    const before = structuredClone(snapshot);
    const result = toggleTrackedQuest(snapshot, questId);

    assert.deepEqual(snapshot, before);
    assert.equal(hash(result.snapshot), snapshotHash);
    assert.equal(hash(result.notice), noticeHash);
  }
});
