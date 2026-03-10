import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

function runScenarioOutput() {
  const result = spawnSync(process.execPath, ["tools/scenario-runner/index.mjs"], { encoding: "utf8" });
  assert.equal(result.status, 0, `scenario runner failed: ${result.stderr}`);
  return result.stdout.trim();
}

test("scenario runner is deterministic for same seed", () => {
  const first = runScenarioOutput();
  const second = runScenarioOutput();

  assert.equal(first, second);
});