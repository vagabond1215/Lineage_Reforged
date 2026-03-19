type CoverageDimension =
  | "stapleCrops"
  | "herdAndGame"
  | "maritimeFoods"
  | "timberAndFiber"
  | "metalsAndStone"
  | "herbsAndReagents"
  | "luxuryGoods";

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

export function resolveResourceFamilies(itemKey: string): string[] {
  const key = itemKey.trim().toLowerCase();
  const families = new Set<string>();

  if (key.length === 0) {
    return [];
  }

  families.add(key);

  if (
    ["grain", "wheat", "barley", "rice", "flour", "barge_flour", "bread", "bread_loaf"].includes(key) ||
    key.endsWith("_flour")
  ) {
    families.add("grain");
  }

  if (["vegetables", "cave_fungus"].includes(key)) {
    families.add("vegetables");
  }

  if (
    ["fruit", "apples", "citrus_fruit"].includes(key) ||
    includesAny(key, ["apple", "pear", "grape", "mango", "papaya", "pineapple", "orange", "lemon", "fruit"])
  ) {
    families.add("fruit");
  }

  if (key === "tea" || key === "tea_leaf" || key.endsWith("_tea") || key.endsWith("_tea_leaf")) {
    families.add("tea");
  }

  if (
    key === "herbs" ||
    includesAny(key, ["herb", "mint", "sage", "lavender", "chamomile", "licorice", "lemongrass", "spice"])
  ) {
    families.add("herbs");
  }

  if (
    ["fish", "river_fish", "shellfish", "cod", "stormshoal_herring", "moonflat_halibut"].includes(key) ||
    includesAny(key, ["fish", "cod", "herring", "tuna", "halibut", "oyster", "clam", "mussel", "crab", "crawfish", "shrimp"])
  ) {
    families.add("fish");
  }

  if (key === "hides" || key === "leather" || key === "finished_leather" || key.endsWith("_hide")) {
    families.add("hides");
  }

  if (key === "fur" || key === "furs" || key.endsWith("_fur")) {
    families.add("fur");
  }

  if (
    key.endsWith("_meat") ||
    ["cured_meat", "dried_meat", "salted_meat", "smoked_meat", "smoked_game", "salt_pork"].includes(key)
  ) {
    families.add("meat");
  }

  if (
    ["cured_meat", "dried_meat", "salted_meat", "smoked_meat", "smoked_game", "salted_fish", "smoked_fish", "dried_fish"].includes(
      key
    )
  ) {
    families.add("cured_meat");
  }

  if (key === "horse_fodder" || key === "hay" || key === "fodder") {
    families.add("horse_fodder");
  }

  if (
    ["tools", "iron_tools", "metal_tools", "forged_tools", "smithing_tools", "steel_tools", "milling_parts"].includes(key) ||
    key.endsWith("_tools")
  ) {
    families.add("tools");
  }

  if (
    ["wine", "beer", "mead", "cider", "apple_cider", "olive_oil", "goat_cheese", "honey", "luxury_goods"].includes(key)
  ) {
    families.add("luxury_goods");
  }

  if (
    includesAny(key, ["timber", "lumber", "plank", "firewood", "charcoal", "tar", "pitch", "ropewood", "ship_timber"]) ||
    ["timber", "firewood", "charcoal", "hardwood_lumber", "hardwood_planks", "ship_timber"].includes(key)
  ) {
    families.add("wood");
  }

  if (
    includesAny(key, ["ore", "stone", "slate", "obsidian", "gem", "copper", "iron", "gold", "millstone", "quarry"]) ||
    ["ore", "stone", "worked_stone", "stone_blocks", "quarry_stone", "copper", "copper_ore", "iron_ore", "gold_ore", "gems"].includes(
      key
    )
  ) {
    families.add("minerals");
  }

  if (
    includesAny(key, ["cloth", "textile", "wool", "flax", "silk", "sailcloth"]) ||
    ["cloth", "finished_cloth", "mixed_textiles", "luxury_cloth", "winter_cloth", "wool", "flax", "flax_cloth", "silk"].includes(
      key
    )
  ) {
    families.add("textiles");
  }

  if (
    includesAny(key, ["ink", "paper", "book", "ledger", "scroll", "copywork"]) ||
    ["writing_ink", "paper_sheet", "fine_paper", "books", "ledgers", "blank_scroll", "record_scroll"].includes(key)
  ) {
    families.add("records");
  }

  if (
    ["cattle", "goose", "horses", "horse_stock", "livestock", "draft_animals", "pack_animals", "pack_mules", "pack_beasts"].includes(key)
  ) {
    families.add("livestock");
  }

  if (["salt", "sea_salt", "pearls", "whale_oil"].includes(key)) {
    families.add("maritime_goods");
  }

  return [...families];
}

export function matchesResourceTarget(targetItemKeys: string[], itemKey: string): boolean {
  if (targetItemKeys.length === 0) {
    return true;
  }

  const families = new Set(resolveResourceFamilies(itemKey));
  return targetItemKeys.some((targetKey) => targetKey === itemKey || families.has(targetKey));
}

export function resolveCoverageDimension(itemKey: string): CoverageDimension {
  const families = new Set(resolveResourceFamilies(itemKey));

  if (families.has("grain") || families.has("vegetables") || families.has("fruit") || families.has("horse_fodder")) {
    return "stapleCrops";
  }

  if (families.has("meat") || families.has("hides") || families.has("fur") || families.has("livestock")) {
    return "herdAndGame";
  }

  if (families.has("fish") || families.has("maritime_goods")) {
    return "maritimeFoods";
  }

  if (families.has("wood") || families.has("textiles")) {
    return "timberAndFiber";
  }

  if (families.has("minerals") || families.has("tools")) {
    return "metalsAndStone";
  }

  if (families.has("herbs") || families.has("tea") || families.has("records")) {
    return "herbsAndReagents";
  }

  return "luxuryGoods";
}
