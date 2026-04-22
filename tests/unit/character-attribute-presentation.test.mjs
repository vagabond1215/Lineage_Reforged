import test from "node:test";
import assert from "node:assert/strict";

const {
  CHARACTER_ATTRIBUTE_ORDER,
  CHARACTER_ATTRIBUTE_PRESENTATIONS,
  getCharacterAttributeTooltipContent,
  parsePresentedAttributeValues
} = await import("../../apps/rpg-ui/src/game-shell/characterAttributes.ts");

test("canonical attribute order matches the compact UI policy", () => {
  assert.deepEqual(CHARACTER_ATTRIBUTE_ORDER, [
    "STR",
    "DEX",
    "AGI",
    "CON",
    "VIT",
    "INT",
    "WIS",
    "SPT",
    "CHA"
  ]);
});

test("attribute presentations expose compact labels, full names, and narrative tooltips", () => {
  assert.equal(CHARACTER_ATTRIBUTE_PRESENTATIONS.STR.abbr, "STR");
  assert.equal(CHARACTER_ATTRIBUTE_PRESENTATIONS.STR.fullName, "Strength");
  assert.match(
    CHARACTER_ATTRIBUTE_PRESENTATIONS.STR.tooltip.body,
    /force of muscle and frame/i
  );
  assert.match(
    CHARACTER_ATTRIBUTE_PRESENTATIONS.STR.tooltip.footer,
    /Major systems:/i
  );
});

test("INT, WIS, and SPT tooltips stay clearly differentiated", () => {
  assert.match(getCharacterAttributeTooltipContent("INT").body, /theory|advanced spellcraft|precise control/i);
  assert.match(getCharacterAttributeTooltipContent("WIS").body, /healing hands|insight|right flow of life and magic/i);
  assert.match(getCharacterAttributeTooltipContent("SPT").body, /inner power|mana|sustains magic/i);
});

test("presented attribute parsing preserves the canonical compact order", () => {
  const parsed = parsePresentedAttributeValues(
    "WIS 12 / STR 10 / INT 11 / CHA 9 / AGI 13 / CON 8 / DEX 14 / SPT 7 / VIT 6"
  );

  assert.deepEqual(
    parsed.map((entry) => entry.key),
    ["STR", "DEX", "AGI", "CON", "VIT", "INT", "WIS", "SPT", "CHA"]
  );
});
