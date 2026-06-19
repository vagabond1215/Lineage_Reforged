import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { validateSacredSites } from "../../tools/content-lint/sacred-sites.mjs";

const SITE_PATH = "packages/content/base/world/sacred_sites.json";
const schema = JSON.parse(await readFile("packages/schemas/world/sacred-site.schema.json", "utf8"));

function site(overrides = {}) {
  return {
    id: "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine",
    slug: "glasswake_shrine_lantern_gardens_glasswake_shrine",
    name: "Glasswake Shrine",
    summary: "A planned named shrine authority centered on the Glasswake Shrine community.",
    status: "planned",
    placeAnchor: {
      macroRegionId: "region.lantern_isles",
      regionId: "region.glasswake_quay",
      regionLocalityId: "region_locality.lantern_shrine_gardens",
      settlementId: "settlement.glasswake_shrine"
    },
    parentReligiousHotspotId: "religious_hotspot.glasswake_shrine_lantern_gardens",
    religionIds: ["religion.elemental_pantheon"],
    sacredSiteType: "shrine",
    publicPosture: "tolerant",
    pilgrimageStatus: "local",
    sourceAuthorityNotes: ["Current place and hotspot authority support this planned named shrine."],
    notes: ["Planned descriptive authority only; no runtime or gameplay behavior."],
    ...overrides
  };
}

function makeInput(records = [site()]) {
  return {
    relativePath: SITE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    religions: [
      {
        id: "religion.elemental_pantheon",
        deities: [{ id: "deity.light_lady" }]
      },
      {
        id: "religion.tide_cult",
        deities: [{ id: "deity.tide_saint" }]
      }
    ],
    religiousHotspots: [
      {
        id: "religious_hotspot.glasswake_shrine_lantern_gardens",
        status: "active",
        placeAnchor: {
          macroRegionId: "region.lantern_isles",
          regionId: "region.glasswake_quay",
          regionLocalityId: "region_locality.lantern_shrine_gardens",
          settlementId: "settlement.glasswake_shrine"
        }
      },
      {
        id: "religious_hotspot.lantern_shrine_gardens",
        status: "planned",
        placeAnchor: {
          macroRegionId: "region.lantern_isles",
          regionId: "region.glasswake_quay",
          regionLocalityId: "region_locality.lantern_shrine_gardens"
        }
      }
    ],
    regions: [
      { id: "region.lantern_isles", regionType: "island_system" },
      { id: "region.glasswake_quay", regionType: "subregion", parentRegionId: "region.lantern_isles" },
      { id: "region.other_quay", regionType: "subregion", parentRegionId: "region.lantern_isles" }
    ],
    regionLocalities: [
      {
        id: "region_locality.lantern_shrine_gardens",
        macroRegionId: "region.lantern_isles",
        regionId: "region.glasswake_quay"
      },
      {
        id: "region_locality.other_gardens",
        macroRegionId: "region.lantern_isles",
        regionId: "region.glasswake_quay"
      }
    ],
    settlements: [
      {
        id: "settlement.glasswake_shrine",
        macroRegionId: "region.lantern_isles",
        regionId: "region.glasswake_quay",
        localityBandId: "region_locality.lantern_shrine_gardens"
      }
    ]
  };
}

function validate(input = makeInput()) {
  return validateSacredSites(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

test("accepts the planned Glasswake Shrine draft deterministically without mutation", () => {
  const input = makeInput();
  const before = structuredClone(input);
  const expected = {
    ok: true,
    sacredSiteIds: ["sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine"]
  };
  assert.deepEqual(validate(input), expected);
  assert.deepEqual(validate(input), expected);
  assert.deepEqual(input, before);
});

test("rejects invalid wrapper shapes", async (t) => {
  const cases = [
    ["extra key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects duplicate ids and slugs", async (t) => {
  await t.test("duplicate id", () => {
    expectFailure(
      (input) => input.wrapper.records.push(structuredClone(record(input))),
      /duplicate sacred site id/
    );
  });
  await t.test("duplicate slug", () => {
    expectFailure(
      (input) => input.wrapper.records.push(site({
        id: "sacred_site.glasswake_shrine_lantern_gardens.second_shrine"
      })),
      /duplicate sacred site slug/
    );
  });
});

test("rejects malformed identities and slug mismatch", async (t) => {
  const cases = [
    ["invalid prefix", "site.glasswake_shrine_lantern_gardens.glasswake_shrine", /must match pattern/],
    ["type-only id", "sacred_site.shrine", /must match pattern/]
  ];
  for (const [name, id, expected] of cases) {
    await t.test(name, () => expectFailure((input) => { record(input).id = id; }, expected));
  }
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => { record(input).slug = "glasswake_shrine"; },
      /slug must equal 'glasswake_shrine_lantern_gardens_glasswake_shrine'/
    );
  });
});

test("rejects invalid enum values", async (t) => {
  const cases = [
    ["status", "status", "published"],
    ["sacred site type", "sacredSiteType", "chapel"],
    ["public posture", "publicPosture", "welcoming"],
    ["pilgrimage status", "pilgrimageStatus", "seasonal"]
  ];
  for (const [name, field, value] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input)[field] = value; },
        new RegExp(`records\\[0\\]\\.${field} must be one of the schema enum values`)
      );
    });
  }
});

test("rejects empty or unknown religion authority", async (t) => {
  await t.test("empty religionIds", () => {
    expectFailure((input) => { record(input).religionIds = []; }, /religionIds must contain at least 1 items/);
  });
  await t.test("unknown religion", () => {
    expectFailure(
      (input) => { record(input).religionIds = ["religion.missing"]; },
      /religionIds 'religion\.missing' is missing from world\.religions/
    );
  });
});

test("validates parent hotspot references and status", async (t) => {
  await t.test("unknown parent", () => {
    expectFailure(
      (input) => { record(input).parentReligiousHotspotId = "religious_hotspot.missing"; },
      /parentReligiousHotspotId 'religious_hotspot\.missing' is missing/
    );
  });
  await t.test("active site with planned parent", () => {
    expectFailure(
      (input) => {
        record(input).status = "active";
        record(input).parentReligiousHotspotId = "religious_hotspot.lantern_shrine_gardens";
        delete record(input).placeAnchor.settlementId;
      },
      /active record .* requires an active parent religious hotspot/
    );
  });
  await t.test("planned site with planned parent", () => {
    const input = makeInput();
    record(input).parentReligiousHotspotId = "religious_hotspot.lantern_shrine_gardens";
    delete record(input).placeAnchor.settlementId;
    assert.equal(validate(input).ok, true);
  });
});

test("rejects place anchors that contradict the parent hotspot", () => {
  expectFailure(
    (input) => {
      record(input).placeAnchor.regionLocalityId = "region_locality.other_gardens";
      delete record(input).placeAnchor.settlementId;
    },
    /placeAnchor\.regionLocalityId must match parent hotspot/
  );
});

test("rejects unknown place references", async (t) => {
  const cases = [
    ["region", "regionId", "region.missing", /placeAnchor\.regionId 'region\.missing' is missing/],
    ["locality", "regionLocalityId", "region_locality.missing", /placeAnchor\.regionLocalityId 'region_locality\.missing' is missing/],
    ["settlement", "settlementId", "settlement.missing", /placeAnchor\.settlementId 'settlement\.missing' is missing/]
  ];
  for (const [name, field, value, expected] of cases) {
    await t.test(name, () => expectFailure((input) => { record(input).placeAnchor[field] = value; }, expected));
  }
});

test("validates optional deity references", async (t) => {
  await t.test("unknown deity", () => {
    expectFailure(
      (input) => { record(input).deityIds = ["deity.missing"]; },
      /deityIds 'deity\.missing' is missing from world\.religions/
    );
  });
  await t.test("deity parent religion absent", () => {
    expectFailure(
      (input) => { record(input).deityIds = ["deity.tide_saint"]; },
      /deityIds 'deity\.tide_saint' belongs to 'religion\.tide_cult'/
    );
  });
});

test("rejects religiousOrderIds until order authority exists", () => {
  expectFailure(
    (input) => { record(input).religiousOrderIds = ["religious_order.elemental_pantheon.glasswake_order"]; },
    /religiousOrderIds is unavailable until canonical religious-order authority exists/
  );
});

test("rejects forbidden and unknown behavior fields", async (t) => {
  const fields = [
    "dominantFaithIds",
    "toleratedFaithIds",
    "restrictedFaithIds",
    "routeId",
    "accessRules",
    "serviceIds",
    "rewards",
    "favorabilityEffects",
    "alignmentEffects",
    "lawProfile",
    "runtimeState",
    "uiState",
    "storageState",
    "gameplayEffects"
  ];
  for (const field of fields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("rejects empty and duplicate authority notes", async (t) => {
  for (const field of ["sourceAuthorityNotes", "notes"]) {
    await t.test(`${field} empty`, () => {
      expectFailure(
        (input) => { record(input)[field] = []; },
        new RegExp(`${field} must contain at least 1 items`)
      );
    });
    await t.test(`${field} duplicate`, () => {
      expectFailure(
        (input) => { record(input)[field] = ["duplicate", "duplicate"]; },
        new RegExp(`${field} must contain unique items`)
      );
    });
  }
});

test("registers and validates exactly one planned sacred-site seed", async () => {
  const indexSource = await readFile("tools/content-lint/index.mjs", "utf8");
  const wrapper = JSON.parse(await readFile(SITE_PATH, "utf8"));
  assert.match(indexSource, /sacred_sites\.json/);
  assert.match(indexSource, /sacred-sites\.mjs/);
  assert.equal(wrapper.records.length, 1);
  assert.equal(wrapper.records[0].id, "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine");
  assert.equal(wrapper.records[0].status, "planned");
  assert.equal(Object.hasOwn(wrapper.records[0], "deityIds"), false);
  assert.equal(Object.hasOwn(wrapper.records[0], "religiousOrderIds"), false);
  assert.doesNotThrow(() => validate({ ...makeInput(), wrapper }));
});
