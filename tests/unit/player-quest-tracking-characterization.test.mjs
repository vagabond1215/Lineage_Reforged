import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { toggleTrackedQuest } from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const ACTIVE_ID = "quest.ashen_reef_survey";
const CONTRACT_ID = "quest.rivet_shortfall_relief";

const TRACKED_SNAPSHOT_HASH = "bdb4202b3c8b1b59c1539dfd38fc505f5922b6f557827cdd970ce3205da0946f";
const TRACKED_NOTICE_HASH = "6d364c85f4e69f804651d203ee9cab00124d913549ff328f5eeda9dc3624d5a1";
const UNTRACKED_SNAPSHOT_HASH = "88668c3cb3b72cc87779f7fa053bdab1a2e383c2963f403ffa690b3b1fb75601";
const UNTRACKED_NOTICE_HASH = "e6ceb7fdb1ead4388efeaab157b4fddae04debb67bfc9756262964c9be7bee74";

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
