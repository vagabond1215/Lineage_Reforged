import test from "node:test";
import assert from "node:assert/strict";

const {
  formatAgeBandDisplayLine,
  formatAgeBandRange,
  formatFocusDisplayLine,
  formatNatureDisplayLine,
  formatPhysiqueDisplayLine,
  getAgeBandOption,
  getAgeBandOptions,
  getFocusOption,
  getFocusOptions,
  getNatureOption,
  getNatureOptions,
  getPhysiqueOption,
  getPhysiqueOptions,
  getSexOption
} = await import("../../apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts");

test("human age ranges use the exact authored four-band values", () => {
  assert.equal(formatAgeBandRange("lineage.human", "male", "young_adult"), "16–24");
  assert.equal(formatAgeBandRange("lineage.human", "male", "prime"), "25–39");
  assert.equal(formatAgeBandRange("lineage.human", "male", "mature"), "40–54");
  assert.equal(formatAgeBandRange("lineage.human", "male", "senior"), "55–69");
  assert.equal(formatAgeBandRange("lineage.human", "female", "young_adult"), "16–24");
  assert.equal(formatAgeBandRange("lineage.human", "female", "prime"), "25–39");
  assert.equal(formatAgeBandRange("lineage.human", "female", "mature"), "40–54");
  assert.equal(formatAgeBandRange("lineage.human", "female", "senior"), "55–69");
});

test("non-human age ranges stay lineage-aware and contiguous after scaling", () => {
  const ranges = [
    formatAgeBandRange("lineage.elf", "male", "young_adult"),
    formatAgeBandRange("lineage.elf", "male", "prime"),
    formatAgeBandRange("lineage.elf", "male", "mature"),
    formatAgeBandRange("lineage.elf", "male", "senior")
  ];

  assert.deepEqual(ranges, ["40–86", "87–164", "165–242", "243–320"]);
});

test("physique, nature, and focus catalogs expose the approved counts and moved identities", () => {
  assert.equal(getPhysiqueOptions().length, 10);
  assert.equal(getNatureOptions().length, 7);
  assert.equal(getFocusOptions().length, 5);

  assert.equal(getPhysiqueOption("graceful"), null);
  assert.equal(getPhysiqueOption("poised"), null);
  assert.equal(getPhysiqueOption("comely"), null);

  assert.equal(getNatureOption("graceful")?.label, "Graceful");
  assert.equal(getNatureOption("poised")?.label, "Poised");
  assert.equal(getNatureOption("comely")?.label, "Comely");
});

test("display lines and sex tooltips stay aligned with the shared identity data", () => {
  assert.equal(
    formatAgeBandDisplayLine("lineage.human", "male", "prime"),
    "Prime (25–39) — +1 STR / -1 AGI"
  );
  assert.equal(formatPhysiqueDisplayLine("athletic"), "Athletic — STR / AGI / DEX / CON / VIT");
  assert.equal(formatNatureDisplayLine("disciplined"), "Disciplined — WIS / SPT / INT / VIT");
  assert.equal(formatFocusDisplayLine("martial"), "Martial — Strong physical leaning");
  assert.equal(
    getSexOption("lineage.human", "female").tooltipText,
    "Female. +1 AGI, -1 STR."
  );
  assert.equal(
    getSexOption("lineage.human", "male").tooltipText,
    "Male. No attribute change."
  );
});

test("age and profile descriptions are bespoke lore copy rather than mechanical stat text", () => {
  const ageOptions = getAgeBandOptions();
  const physiqueOptions = getPhysiqueOptions();
  const natureOptions = getNatureOptions();
  const focusOptions = getFocusOptions();

  assert.equal(new Set(ageOptions.map((option) => option.description)).size, ageOptions.length);
  assert.equal(new Set(physiqueOptions.map((option) => option.description)).size, physiqueOptions.length);
  assert.equal(new Set(natureOptions.map((option) => option.description)).size, natureOptions.length);
  assert.equal(new Set(focusOptions.map((option) => option.description)).size, focusOptions.length);

  for (const option of [...ageOptions, ...physiqueOptions, ...natureOptions, ...focusOptions]) {
    assert.ok(option.description.length > 60);
    assert.equal(/[+-]\d/.test(option.description), false);
  }

  assert.match(getAgeBandOption("young_adult")?.description ?? "", /restless energy/i);
  assert.match(getPhysiqueOption("athletic")?.description ?? "", /training|drills|exertion/i);
  assert.match(getNatureOption("comely")?.description ?? "", /immediately memorable/i);
  assert.match(getFocusOption("mystic")?.description ?? "", /inward and unseen/i);
});

test("sluggish remains a durable deliberate physique rather than reading as frail or sickly", () => {
  const sluggish = getPhysiqueOption("sluggish");

  assert.ok(sluggish);
  assert.match(sluggish.description, /heavy through the frame/i);
  assert.match(sluggish.description, /deliberate force/i);
  assert.match(sluggish.description, /stubborn endurance/i);
  assert.equal(/frail|sickly|weak/i.test(sluggish.description), false);
});

test("profile authoring keeps physique physical and nature mental-social", () => {
  const physicalKeys = new Set(["STR", "DEX", "AGI", "CON", "VIT"]);
  const mentalSocialKeys = new Set(["INT", "WIS", "SPT", "CHA"]);

  for (const option of getPhysiqueOptions()) {
    const weightedKeys = Object.entries(option.weights)
      .filter(([, value]) => (value ?? 0) > 0)
      .map(([key]) => key);
    assert.ok(weightedKeys.some((key) => physicalKeys.has(key)), option.label);
  }

  for (const option of getNatureOptions()) {
    const weightedKeys = Object.entries(option.weights)
      .filter(([, value]) => (value ?? 0) > 0)
      .map(([key]) => key);
    assert.ok(weightedKeys.some((key) => mentalSocialKeys.has(key)), option.label);
  }

  for (const option of getFocusOptions()) {
    assert.ok(option.physiqueShareShift >= -0.25 && option.physiqueShareShift <= 0.25);
  }
});
