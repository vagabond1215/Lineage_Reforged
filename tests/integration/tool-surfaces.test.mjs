import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

const commands = [
  {
    entry: "tools/content-lint/index.mjs",
    expectedStdout: "content-lint: ok (56 files checked)"
  },
  { entry: "tools/db-build/index.mjs" },
  { entry: "tools/scenario-runner/index.mjs" }
];

for (const { entry, expectedStdout } of commands) {
  test(`tool command executes: ${entry}`, () => {
    const result = spawnSync(process.execPath, [entry], { encoding: "utf8" });

    assert.equal(result.status, 0, `Expected success for ${entry}. stderr: ${result.stderr}`);
    if (expectedStdout) {
      assert.match(
        result.stdout,
        new RegExp(
          `^${expectedStdout.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "m"
        )
      );
    }
  });
}
