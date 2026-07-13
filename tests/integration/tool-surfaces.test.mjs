import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

test("content lint executes with a valid success summary", () => {
  const entry = "tools/content-lint/index.mjs";
  const result = spawnSync(process.execPath, [entry], { encoding: "utf8" });

  assert.equal(result.status, 0, `Expected success for ${entry}. stderr: ${result.stderr}`);
  assert.match(result.stdout.trim(), /^content-lint: ok \([1-9]\d* files checked\)$/);
});
