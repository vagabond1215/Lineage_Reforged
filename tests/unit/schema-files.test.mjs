import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const schemaFiles = [
  "packages/schemas/world/biome.schema.json",
  "packages/schemas/world/habitat.schema.json",
  "packages/schemas/world/flora.schema.json",
  "packages/schemas/world/fauna.schema.json",
  "packages/schemas/world/monster.schema.json",
  "packages/schemas/world/mineral.schema.json",
  "packages/schemas/world/climate-profile.schema.json",
  "packages/schemas/world/region.schema.json",
  "packages/schemas/world/region-locality.schema.json",
  "packages/schemas/world/regional-ecology.schema.json",
  "packages/schemas/world/settlement.schema.json",
  "packages/schemas/world/travel-network.schema.json",
  "packages/schemas/world/transport-profile.schema.json",
  "packages/schemas/world/world-hex.schema.json",
  "packages/schemas/world/world-hex-edge.schema.json",
  "packages/schemas/world/world-map.schema.json",
  "packages/schemas/world/world-map-feature.schema.json",
  "packages/schemas/civilization/workplace.schema.json",
  "packages/schemas/civilization/workplace-abstraction.schema.json",
  "packages/schemas/civilization/building.schema.json",
  "packages/schemas/civilization/infrastructure.schema.json",
  "packages/schemas/civilization/market-item-value.schema.json",
  "packages/schemas/civilization/guild.schema.json",
  "packages/schemas/civilization/quest-archetype.schema.json",
  "packages/schemas/civilization/quest-definition.schema.json",
  "packages/schemas/civilization/quest-template.schema.json",
  "packages/schemas/player/player-attribute.schema.json",
  "packages/schemas/player/equipment.schema.json",
  "packages/schemas/player/skill.schema.json",
  "packages/schemas/player/spell.schema.json",
  "packages/schemas/player/ability.schema.json",
  "packages/schemas/player/trait.schema.json",
  "packages/schemas/player/resource.schema.json",
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
