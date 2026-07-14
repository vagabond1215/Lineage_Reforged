import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { setCurrentActivityFromRecord } from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const RECORD_ID = "job.harbor_surveyor";
const MISSING_ID = "activity.missing";

const SELECTED_SNAPSHOT_HASH = "1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40";
const SELECTED_NOTICE_HASH = "ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee";
const MISSING_NOTICE_HASH = "31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77";

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

test("current activity selection success and missing behavior remain fully characterized", () => {
  const selectedSnapshot = structuredClone(demoSnapshot);
  const selectedBefore = structuredClone(selectedSnapshot);
  const selected = setCurrentActivityFromRecord(selectedSnapshot, RECORD_ID);

  assert.deepEqual(selectedSnapshot, selectedBefore);
  assert.notEqual(selected.snapshot, selectedSnapshot);
  assert.equal(hash(selected.snapshot), SELECTED_SNAPSHOT_HASH);
  assert.equal(hash(selected.notice), SELECTED_NOTICE_HASH);

  const missingSnapshot = structuredClone(demoSnapshot);
  const missingBefore = structuredClone(missingSnapshot);
  const missing = setCurrentActivityFromRecord(missingSnapshot, MISSING_ID);

  assert.equal(missing.snapshot, missingSnapshot);
  assert.deepEqual(missingSnapshot, missingBefore);
  assert.equal(hash(missing.notice), MISSING_NOTICE_HASH);
});
