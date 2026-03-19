import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const TIME_SOURCE_PATH = "packages/shared/time/src/index.ts";

function extractSeasonByMonth(source) {
  const mappingBlock = source.match(/const SEASON_BY_MONTH:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  assert.ok(mappingBlock, "SEASON_BY_MONTH mapping block not found");

  const entries = {};
  for (const match of mappingBlock[1].matchAll(/(\d+)\s*:\s*"([A-Za-z]+)"/g)) {
    entries[match[1]] = match[2];
  }

  return entries;
}

test("clock month-to-season mapping remains stable", async () => {
  const source = await readFile(TIME_SOURCE_PATH, "utf8");
  const mapping = extractSeasonByMonth(source);

  const expected = {
    "1": "Winter",
    "2": "Winter",
    "3": "Thaw",
    "4": "Spring",
    "5": "Spring",
    "6": "Summer",
    "7": "Summer",
    "8": "Harvest",
    "9": "Harvest",
    "10": "Withering",
    "11": "Withering",
    "12": "Winter",
    "13": "Thaw"
  };

  assert.deepEqual(mapping, expected);
  assert.equal(mapping["1"], "Winter");
  assert.equal(mapping["13"], "Thaw");

  assert.match(source, /season:\s*SEASON_BY_MONTH\[1\]/, "createInitialClock must derive season from month 1");
  assert.match(source, /season:\s*SEASON_BY_MONTH\[month\]/, "advanceClock must derive season from current month");
});
