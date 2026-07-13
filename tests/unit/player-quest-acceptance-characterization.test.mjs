import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { acceptQuest } from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const CONTRACT_ID = "quest.rivet_shortfall_relief";
const ACCEPTED_SNAPSHOT_HASH = "44c15faaf28b238323cdb3cd67746482fea8128fd66bea05dddc20b09dadff04";
const ACCEPTED_NOTICE_HASH = "2e0341fb706ec430a27a84151c916de0e251158fd2d3556d79c3a923a1886a90";

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

test("current quest acceptance snapshot and notice remain fully characterized", () => {
  const snapshot = structuredClone(demoSnapshot);
  const before = structuredClone(snapshot);
  const result = acceptQuest(snapshot, CONTRACT_ID);

  assert.deepEqual(snapshot, before);
  assert.equal(hash(result.snapshot), ACCEPTED_SNAPSHOT_HASH);
  assert.equal(hash(result.notice), ACCEPTED_NOTICE_HASH);
});
