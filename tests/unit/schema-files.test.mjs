import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const schemaFiles = [
  "packages/schemas/world/biome.schema.json",
  "packages/schemas/world/habitat.schema.json",
  "packages/schemas/world/flora.schema.json",
  "packages/schemas/world/fauna.schema.json",
  "packages/schemas/world/mineral.schema.json",
  "packages/schemas/world/climate-profile.schema.json",
  "packages/schemas/civilization/workplace.schema.json",
  "packages/schemas/player/equipment.schema.json",
  "packages/schemas/game/global-rule.schema.json",
  "packages/schemas/items/item.schema.json"
];

for (const schemaFile of schemaFiles) {
  test(`schema file is parseable and has type: ${schemaFile}`, async () => {
    const raw = await readFile(schemaFile, "utf8");
    const parsed = JSON.parse(raw);

    assert.equal(typeof parsed.$schema, "string");
    assert.equal(typeof parsed.type, "string");
  });
}
