import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

function stripBom(raw) {
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

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
  "packages/schemas/world/religion.schema.json",
  "packages/schemas/world/settlement.schema.json",
  "packages/schemas/world/travel-network.schema.json",
  "packages/schemas/world/transport-profile.schema.json",
  "packages/schemas/world/magic-infrastructure.schema.json",
  "packages/schemas/world/crystal-catalog.schema.json",
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
  "packages/schemas/player/progression-track.schema.json",
  "packages/schemas/player/knowledge-track.schema.json",
  "packages/schemas/player/skill-effect.schema.json",
  "packages/schemas/player/title.schema.json",
  "packages/schemas/player/spell.schema.json",
  "packages/schemas/player/ability.schema.json",
  "packages/schemas/player/trait.schema.json",
  "packages/schemas/player/backstory.schema.json",
  "packages/schemas/player/starting-bundle.schema.json",
  "packages/schemas/player/trial.schema.json",
  "packages/schemas/player/resource.schema.json",
  "packages/schemas/game/combat-role.schema.json",
  "packages/schemas/game/tactics-preset.schema.json",
  "packages/schemas/game/global-rule.schema.json",
  "packages/schemas/world/encounter-template.schema.json",
  "packages/schemas/items/item.schema.json",
  "packages/schemas/world/spawn-profile.schema.json"
];

for (const schemaFile of schemaFiles) {
  test(`schema file is parseable and has type: ${schemaFile}`, async () => {
    const raw = await readFile(schemaFile, "utf8");
    const parsed = JSON.parse(stripBom(raw));

    assert.equal(typeof parsed.$schema, "string");
    assert.equal(typeof parsed.type, "string");
  });
}
