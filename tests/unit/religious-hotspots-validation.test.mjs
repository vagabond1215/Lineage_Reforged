import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateReligiousHotspots } from "../../tools/content-lint/religious-hotspots.mjs";

const ROOT = process.cwd();
const HOTSPOT_PATH = "packages/content/base/world/religious_hotspots.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const hotspotSchema = await readJson("packages/schemas/world/religious-hotspot.schema.json");
const religionWrapper = await readJson("packages/content/base/world/religions.json");
const regionWrapper = await readJson("packages/content/base/world/regions.json");
const localityWrapper = await readJson("packages/content/base/world/region_localities.json");
const settlementWrapper = await readJson("packages/content/base/world/settlements.json");

function hotspot(overrides = {}) {
  return {
    id: "religious_hotspot.glasswake_shrine_lantern_gardens",
    slug: "glasswake_shrine_lantern_gardens",
    name: "Glasswake Shrine Lantern Gardens",
    summary: "A descriptive religious hotspot authority for the Glasswake shrine gardens.",
    status: "planned",
    placeAnchor: {
      macroRegionId: "region.lantern_isles",
      regionId: "region.glasswake_quay",
      regionLocalityId: "region_locality.lantern_shrine_gardens",
      settlementId: "settlement.glasswake_shrine"
    },
    religionIds: ["religion.elemental_pantheon"],
    deityIds: ["deity.light_lady"],
    hotspotType: "settlement_shrine",
    sacredSiteType: "shrine",
    hotspotIntensity: "notable",
    publicPosture: "aligned",
    mismatchPressure: "social_discomfort",
    pilgrimageStatus: "local",
    sourceAuthorityNotes: [
      "Uses current Glasswake settlement, locality, subregion, and Lantern Isles macro-region authority."
    ],
    notes: [
      "Descriptive authority only; no runtime consequence, favorability, law, access, reward, command, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeInput(records = [hotspot()]) {
  return {
    relativePath: HOTSPOT_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(hotspotSchema),
    religions: structuredClone(religionWrapper.records),
    regions: structuredClone(regionWrapper.records),
    regionLocalities: structuredClone(localityWrapper.records),
    settlements: structuredClone(settlementWrapper.records)
  };
}

function validate(input = makeInput()) {
  return validateReligiousHotspots(input);
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

function record(input) {
  return input.wrapper.records[0];
}

test("accepts a valid planned hotspot fixture with deterministic output", () => {
  const expected = {
    ok: true,
    hotspotIds: ["religious_hotspot.glasswake_shrine_lantern_gardens"]
  };
  assert.deepEqual(validate(), expected);
  assert.deepEqual(validate(), expected);
});

test("accepts an active hotspot with dominant faith and descriptive boundary notes", () => {
  const input = makeInput([
    hotspot({
      status: "active",
      dominantFaithIds: ["religion.elemental_pantheon"]
    })
  ]);
  assert.equal(validate(input).ok, true);
});

test("does not mutate any input", () => {
  const input = makeInput();
  const before = structuredClone(input);
  validate(input);
  assert.deepEqual(input, before);
});

test("rejects invalid wrappers and schema-invalid records", async (t) => {
  const cases = [
    ["non-object", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "missing required field",
      (input) => { delete record(input).hotspotType; },
      /structural validation failed: wrapper\.records\[0\] is missing required property 'hotspotType'/
    ],
    [
      "additional record property",
      (input) => { record(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ],
    [
      "unsupported schema keyword",
      (input) => { input.schema.default = {}; },
      /religious hotspot schema \$ uses unsupported keyword 'default'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects duplicate hotspot ids and id-slug mismatch", async (t) => {
  await t.test("duplicate id", () => {
    expectFailure(
      (input) => {
        input.wrapper.records.push(structuredClone(record(input)));
      },
      /duplicate religious hotspot id 'religious_hotspot\.glasswake_shrine_lantern_gardens'/
    );
  });
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => {
        record(input).slug = "lantern_shrine_gardens";
      },
      /id must equal religious_hotspot\.lantern_shrine_gardens/
    );
  });
});

test("rejects unresolved religion and deity references", async (t) => {
  await t.test("religion", () => {
    expectFailure(
      (input) => {
        record(input).religionIds = ["religion.missing"];
      },
      /religionIds 'religion\.missing' is missing from world\.religions/
    );
  });
  await t.test("deity", () => {
    expectFailure(
      (input) => {
        record(input).deityIds = ["deity.missing"];
      },
      /deityIds 'deity\.missing' is missing from world\.religions/
    );
  });
});

test("rejects deity references outside the listed parent religions", () => {
  expectFailure(
    (input) => {
      input.religions.push({
        id: "religion.tide_cult",
        deities: [{ id: "deity.tide_saint" }]
      });
      record(input).deityIds = ["deity.tide_saint"];
    },
    /deityIds 'deity\.tide_saint' belongs to 'religion\.tide_cult' which is absent from religionIds/
  );
});

test("rejects duplicate and malformed religion and deity authority", async (t) => {
  await t.test("duplicate religion", () => {
    expectFailure(
      (input) => {
        input.religions.push(structuredClone(input.religions[0]));
      },
      /world religions has duplicate id 'religion\.elemental_pantheon'/
    );
  });
  await t.test("malformed religion", () => {
    expectFailure(
      (input) => {
        input.religions.push({ id: "faith.elemental", deities: [] });
      },
      /world religions records\[1\]\.id 'faith\.elemental' is malformed/
    );
  });
  await t.test("duplicate deity", () => {
    expectFailure(
      (input) => {
        input.religions[0].deities.push(structuredClone(input.religions[0].deities[0]));
      },
      /world religion deity authority has duplicate id 'deity\.light_lady'/
    );
  });
  await t.test("malformed deity", () => {
    expectFailure(
      (input) => {
        input.religions[0].deities.push({ name: "Missing Id" });
      },
      /world religion deity authority religion\.elemental_pantheon\.deities\[8\] must provide a canonical id/
    );
  });
});

test("rejects invalid dominant, tolerated, and restricted faith posture", async (t) => {
  await t.test("active missing dominant", () => {
    expectFailure(
      (input) => {
        record(input).status = "active";
      },
      /active record .* must list at least one dominantFaithIds entry/
    );
  });
  await t.test("unresolved tolerated faith", () => {
    expectFailure(
      (input) => {
        record(input).toleratedFaithIds = ["religion.missing"];
      },
      /toleratedFaithIds 'religion\.missing' is missing from world\.religions/
    );
  });
  await t.test("dominant faith outside religionIds", () => {
    expectFailure(
      (input) => {
        input.religions.push({
          id: "religion.tide_cult",
          deities: [{ id: "deity.tide_saint" }]
        });
        record(input).status = "active";
        record(input).dominantFaithIds = ["religion.tide_cult"];
      },
      /dominantFaithIds 'religion\.tide_cult' must also appear in religionIds/
    );
  });
  await t.test("contradictory posture arrays", () => {
    expectFailure(
      (input) => {
        record(input).dominantFaithIds = ["religion.elemental_pantheon"];
        record(input).restrictedFaithIds = ["religion.elemental_pantheon"];
      },
      /dominantFaithIds and restrictedFaithIds both list 'religion\.elemental_pantheon'/
    );
  });
});

test("rejects unresolved and mistyped place anchors", async (t) => {
  const cases = [
    [
      "missing required place scope",
      (anchor) => {
        delete anchor.regionId;
        delete anchor.regionLocalityId;
        delete anchor.settlementId;
      },
      /placeAnchor must include regionId, regionLocalityId, or settlementId/
    ],
    [
      "missing region",
      (anchor) => { anchor.regionId = "region.missing"; },
      /placeAnchor\.regionId 'region\.missing' is missing/
    ],
    [
      "region not subregion",
      (anchor) => { anchor.regionId = "region.lantern_isles"; },
      /placeAnchor\.regionId 'region\.lantern_isles' must reference regionType 'subregion'/
    ],
    [
      "macro not macro region",
      (anchor) => { anchor.macroRegionId = "region.glasswake_quay"; },
      /placeAnchor\.macroRegionId 'region\.glasswake_quay' must reference regionType 'continent' or 'island_system'/
    ],
    [
      "missing locality",
      (anchor) => { anchor.regionLocalityId = "region_locality.missing"; },
      /placeAnchor\.regionLocalityId 'region_locality\.missing' is missing/
    ],
    [
      "missing settlement",
      (anchor) => { anchor.settlementId = "settlement.missing"; },
      /placeAnchor\.settlementId 'settlement\.missing' is missing/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => {
          mutate(record(input).placeAnchor);
        },
        expected
      );
    });
  }
});

test("rejects incoherent place anchor hierarchy", async (t) => {
  await t.test("macro-region mismatch", () => {
    expectFailure(
      (input) => {
        record(input).placeAnchor.macroRegionId = "region.kaelvar";
      },
      /placeAnchor\.regionId 'region\.glasswake_quay' does not belong to macroRegionId 'region\.kaelvar'/
    );
  });
  await t.test("locality-to-region mismatch", () => {
    expectFailure(
      (input) => {
        record(input).placeAnchor.regionId = "region.lantern_crown";
      },
      /placeAnchor\.regionLocalityId 'region_locality\.lantern_shrine_gardens' must share regionId 'region\.lantern_crown'/
    );
  });
  await t.test("settlement-to-locality mismatch", () => {
    expectFailure(
      (input) => {
        input.regionLocalities.push({
          id: "region_locality.glasswake_false_gardens",
          macroRegionId: "region.lantern_isles",
          regionId: "region.glasswake_quay"
        });
        record(input).placeAnchor.regionLocalityId = "region_locality.glasswake_false_gardens";
      },
      /placeAnchor\.settlementId 'settlement\.glasswake_shrine' must share regionLocalityId 'region_locality\.glasswake_false_gardens'/
    );
  });
  await t.test("settlement-to-region mismatch", () => {
    expectFailure(
      (input) => {
        delete record(input).placeAnchor.regionLocalityId;
        record(input).placeAnchor.regionId = "region.deepglow_reef";
      },
      /placeAnchor\.settlementId 'settlement\.glasswake_shrine' must share regionId 'region\.deepglow_reef'/
    );
  });
});

test("rejects active hotspots without descriptive no-runtime boundary notes", () => {
  expectFailure(
    (input) => {
      record(input).status = "active";
      record(input).dominantFaithIds = ["religion.elemental_pantheon"];
      record(input).notes = ["Pilgrims gather here during local rites."];
    },
    /notes must include a descriptive no-runtime\/no-consequence boundary/
  );
});

test("keeps normal content lint unregistered until live seed content exists", async () => {
  const indexSource = await readFile("tools/content-lint/index.mjs", "utf8");
  assert.doesNotMatch(indexSource, /religious_hotspots\.json/);
  assert.doesNotMatch(indexSource, /religious-hotspots\.mjs/);
  await assert.rejects(
    () => access(HOTSPOT_PATH),
    /ENOENT/
  );
});
