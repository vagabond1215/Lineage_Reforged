import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

const commands = [
  ["tools/content-lint/index.mjs"],
  ["tools/db-build/index.mjs"],
  ["tools/scenario-runner/index.mjs"]
];

for (const [entry] of commands) {
  test(`tool command executes: ${entry}`, () => {
    const result = spawnSync(process.execPath, [entry], { encoding: "utf8" });

    assert.equal(result.status, 0, `Expected success for ${entry}. stderr: ${result.stderr}`);
  });
}