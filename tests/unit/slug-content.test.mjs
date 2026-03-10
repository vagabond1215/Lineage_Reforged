import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const files = [
  "packages/content/base/world/flora.json",
  "packages/content/base/world/fauna.json",
  "packages/content/base/world/minerals.json"
];

const slugPattern = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const geoQualifierPattern = /\b(american|european|asian|african|oregon|texas|california|alaskan)\b/i;

for (const file of files) {
  test(`slug and naming rules: ${file}`, async () => {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw);

    assert.ok(Array.isArray(parsed.records));

    const seen = new Set();

    for (const record of parsed.records) {
      assert.equal(typeof record.slug, "string", `${record.id} missing slug`);
      assert.match(record.slug, slugPattern, `${record.id} has invalid slug`);
      assert.equal(seen.has(record.slug), false, `${record.id} duplicate slug ${record.slug}`);
      seen.add(record.slug);

      assert.equal(geoQualifierPattern.test(record.name), false, `${record.id} should not be geo-qualified`);
    }
  });
}