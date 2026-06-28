import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validatePolities } from "../../tools/content-lint/polities.mjs";

const ROOT = process.cwd();
const POLITY_PATH = "packages/content/base/world/polities.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

function readJsonSync(relativePath) {
  const raw = readFileSync(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson("packages/schemas/world/polity.schema.json");
const regionsWrapper = await readJson("packages/content/base/world/regions.json");
const regionLocalitiesWrapper = await readJson("packages/content/base/world/region_localities.json");
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");
const worldMapsWrapper = await readJson("packages/content/base/world/world_maps.json");
const guildsWrapper = await readJson("packages/content/base/civilization/guilds.json");
const religionsWrapper = await readJson("packages/content/base/world/religions.json");

function polity(overrides = {}) {
  return {
    id: "polity.kaelvar_crown",
    slug: "kaelvar_crown",
    name: "Kaelvar Crown",
    aliases: ["Crown of Kaelvar"],
    summary: "In-memory polity identity fixture for static validation.",
    polityForm: "kingdom",
    placeAnchors: [
      {
        placeType: "region",
        placeId: "region.kaelvar",
        anchorRole: "identity_anchor"
      }
    ],
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live polity content is authored by this test."
    ],
    notes: [
      "Static political identity only; no government, law, claim, diplomacy, tax, enforcement, runtime, UI, storage, reward, command, event, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeInput(records = [polity()], overrides = {}) {
  return {
    relativePath: POLITY_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    regions: structuredClone(regionsWrapper.records),
    regionLocalities: structuredClone(regionLocalitiesWrapper.records),
    settlements: structuredClone(settlementsWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validatePolities(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts valid minimal kingdom polity with a region anchor", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    polityIds: ["polity.kaelvar_crown"]
  });
});

test("accepts valid city-state, autonomous settlement, and locality anchored polities", async (t) => {
  const cases = [
    [
      "city-state settlement seat",
      {
        id: "polity.aurelis_city_state",
        slug: "aurelis_city_state",
        polityForm: "city_state",
        placeAnchors: [
          {
            placeType: "settlement",
            placeId: "settlement.aurelis",
            anchorRole: "seat_reference"
          }
        ]
      }
    ],
    [
      "autonomous settlement",
      {
        id: "polity.aurelis_free_harbor",
        slug: "aurelis_free_harbor",
        polityForm: "autonomous_settlement",
        placeAnchors: [
          {
            placeType: "settlement",
            placeId: "settlement.aurelis",
            anchorRole: "identity_anchor"
          }
        ]
      }
    ],
    [
      "locality anchor",
      {
        id: "polity.verdant_bays_compact",
        slug: "verdant_bays_compact",
        polityForm: "confederation",
        placeAnchors: [
          {
            placeType: "region_locality",
            placeId: "region_locality.verdant_thalos_coastal_bays",
            anchorRole: "associated_place"
          }
        ]
      }
    ]
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      const input = makeInput([polity(overrides)]);
      assert.equal(validateInput(input).ok, true);
    });
  }
});

test("does not mutate polity validation inputs", () => {
  const input = makeInput();
  const before = structuredClone(input);

  validateInput(input);

  assert.deepEqual(input, before);
});

test("rejects invalid wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "runtime field",
      (input) => { record(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects polity identity and vocabulary failures", async (t) => {
  await t.test("duplicate polity id", () => {
    expectFailure(
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate polity id 'polity\.kaelvar_crown'/
    );
  });
  await t.test("duplicate polity slug", () => {
    expectFailure(
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "polity.other_crown";
        input.wrapper.records.push(duplicate);
      },
      /duplicate polity slug 'kaelvar_crown'/
    );
  });
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => { record(input).slug = "other_crown"; },
      /id must equal polity\.other_crown/
    );
  });
  await t.test("invalid lifecycle status", () => {
    expectFailure(
      (input) => { record(input).status = "disputed"; },
      /status must be one of the schema enum values/
    );
  });
  await t.test("invalid polity form", () => {
    expectFailure(
      (input) => { record(input).polityForm = "duchy"; },
      /polityForm must be one of the schema enum values/
    );
  });
  for (const forbiddenForm of ["vassal_polity", "disputed_polity", "occupied_polity", "noble_domain"]) {
    await t.test(`forbidden form ${forbiddenForm}`, () => {
      expectFailure(
        (input) => { record(input).polityForm = forbiddenForm; },
        /polityForm must be one of the schema enum values/
      );
    });
  }
  await t.test("duplicate aliases", () => {
    expectFailure(
      (input) => { record(input).aliases = ["Crown", "Crown"]; },
      /aliases must contain unique items/
    );
  });
  await t.test("empty place anchors", () => {
    expectFailure(
      (input) => { record(input).placeAnchors = []; },
      /placeAnchors must contain at least 1 items/
    );
  });
  await t.test("duplicate place anchors", () => {
    expectFailure(
      (input) => {
        record(input).placeAnchors.push(structuredClone(record(input).placeAnchors[0]));
      },
      /placeAnchors must contain unique items/
    );
  });
});

test("rejects malformed, unresolved, inactive, and free-form place anchors", async (t) => {
  const cases = [
    [
      "invalid place type",
      [{ placeType: "guild", placeId: "guild.merchant_guild", anchorRole: "identity_anchor" }],
      /placeType must be one of the schema enum values/
    ],
    [
      "invalid anchor role",
      [{ placeType: "region", placeId: "region.kaelvar", anchorRole: "claim_scope" }],
      /anchorRole must be one of the schema enum values/
    ],
    [
      "missing region",
      [{ placeType: "region", placeId: "region.missing", anchorRole: "identity_anchor" }],
      /placeAnchor region 'region\.missing' is missing or inactive/
    ],
    [
      "missing region locality",
      [{ placeType: "region_locality", placeId: "region_locality.missing_bays", anchorRole: "associated_place" }],
      /placeAnchor region_locality 'region_locality\.missing_bays' is missing or inactive/
    ],
    [
      "missing settlement",
      [{ placeType: "settlement", placeId: "settlement.missing_city", anchorRole: "seat_reference" }],
      /placeAnchor settlement 'settlement\.missing_city' is missing or inactive/
    ],
    [
      "settlement administrative role is not polity proof",
      [{ placeType: "settlement", placeId: "settlement.regional_capital", anchorRole: "identity_anchor" }],
      /placeAnchor settlement 'settlement\.regional_capital' is missing or inactive/
    ],
    [
      "world-map conflict-zone name is not polity proof",
      [{ placeType: "region", placeId: "conflict_zone.kaelvar_interior", anchorRole: "identity_anchor" }],
      /placeAnchor region 'conflict_zone\.kaelvar_interior' is missing or inactive/
    ],
    [
      "guild id is not polity authority",
      [{ placeType: "region", placeId: guildsWrapper.records[0].id, anchorRole: "identity_anchor" }],
      /placeAnchor region 'guild\.merchant_guild' is missing or inactive/
    ],
    [
      "religion id is not polity authority",
      [{ placeType: "region", placeId: religionsWrapper.records[0].id, anchorRole: "identity_anchor" }],
      /placeAnchor region 'religion\.elemental_pantheon' is missing or inactive/
    ],
    [
      "family id is not polity authority",
      [{ placeType: "region", placeId: "family.crown_house", anchorRole: "identity_anchor" }],
      /placeAnchor region 'family\.crown_house' is missing or inactive/
    ],
    [
      "title id is not polity authority",
      [{ placeType: "region", placeId: "title.king", anchorRole: "identity_anchor" }],
      /placeAnchor region 'title\.king' is missing or inactive/
    ],
    [
      "backstory id is not polity authority",
      [{ placeType: "region", placeId: "backstory.exiled_noble", anchorRole: "identity_anchor" }],
      /placeAnchor region 'backstory\.exiled_noble' is missing or inactive/
    ],
    [
      "synthetic operator id is not polity authority",
      [{ placeType: "settlement", placeId: "operator.civil_authority.aurelis", anchorRole: "seat_reference" }],
      /placeAnchor settlement 'operator\.civil_authority\.aurelis' is missing or inactive/
    ],
    [
      "runtime projection string is not polity authority",
      [{ placeType: "region", placeId: "runtime.polity_projection.kaelvar", anchorRole: "identity_anchor" }],
      /placeAnchor region 'runtime\.polity_projection\.kaelvar' is missing or inactive/
    ]
  ];

  for (const [name, placeAnchors, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input).placeAnchors = placeAnchors; },
        expected
      );
    });
  }

  await t.test("active record fails on planned place authority", () => {
    expectFailure(
      (input) => {
        record(input).status = "active";
        input.regions[0].status = "planned";
      },
      /placeAnchor region 'region\.kaelvar' is missing or inactive/
    );
  });

  await t.test("active record fails on retired place authority", () => {
    expectFailure(
      (input) => {
        record(input).status = "active";
        input.regions[0].status = "retired";
      },
      /placeAnchor region 'region\.kaelvar' is missing or inactive/
    );
  });

  await t.test("autonomous settlement without settlement anchor", () => {
    expectFailure(
      (input) => { record(input).polityForm = "autonomous_settlement"; },
      /autonomous_settlement record polity\.kaelvar_crown must include at least one settlement placeAnchor/
    );
  });
});

test("world-map conflict zones remain display summaries only", () => {
  const [conflictZone] = worldMapsWrapper.records[0].conflictZones;
  const input = makeInput([
    polity({
      placeAnchors: [
        {
          placeType: "region",
          placeId: conflictZone.name,
          anchorRole: "identity_anchor"
        }
      ]
    })
  ]);

  assert.throws(
    () => validateInput(input),
    /placeAnchor region 'Kaelvar Interior' is missing or inactive/
  );
});

test("rejects government, law, claim, tax, player-state, runtime, and gameplay fields", async (t) => {
  const forbiddenFields = [
    "governmentId",
    "rulerPersonId",
    "officeIds",
    "jurisdictionIds",
    "lawIds",
    "citizenshipRules",
    "wantedState",
    "enforcementRules",
    "claimedRegionIds",
    "borderIds",
    "controlledSettlementIds",
    "vassalOf",
    "diplomacy",
    "conflictIds",
    "taxRates",
    "tollRates",
    "tariffRates",
    "customsRules",
    "factionIds",
    "institutionIds",
    "familyIds",
    "nobleHouseIds",
    "officialReligionId",
    "playerLegalState",
    "playerStanding",
    "bountyState",
    "caseState",
    "runtimeState",
    "uiState",
    "storageState",
    "commandRefs",
    "eventRefs",
    "rewardRefs",
    "gameplayEffects"
  ];

  for (const field of forbiddenFields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("live polity seed validates through the focused helper", () => {
  assert.deepEqual(
    validateInput({
      relativePath: POLITY_PATH,
      wrapper: readJsonSync(POLITY_PATH),
      schema: structuredClone(schema),
      regions: structuredClone(regionsWrapper.records),
      regionLocalities: structuredClone(regionLocalitiesWrapper.records),
      settlements: structuredClone(settlementsWrapper.records)
    }),
    {
      ok: true,
      polityIds: ["polity.draemor", "polity.valtherion"]
    }
  );
});

test("live polity seed stays planned and descriptive", () => {
  const liveSeed = readJsonSync(POLITY_PATH);

  assert.deepEqual(liveSeed.records.map((entry) => entry.id).sort(), [
    "polity.draemor",
    "polity.valtherion"
  ]);
  for (const record of liveSeed.records) {
    assert.equal(record.status, "planned");
    assert.equal(record.aliases.length, 0);
    assert.match(record.notes.join(" "), /does not define government, ruler, law, claim, border, control, diplomacy, tax, runtime, UI, storage, command, event, reward, or gameplay behavior/);
  }
});

test("schema and live polity content are registered in normal content lint", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/world\/polity\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, POLITY_PATH)), true);
  assert.match(contentLintSource, /packages\/content\/base\/world\/polities\.json/);
  assert.match(contentLintSource, /polities\.mjs/);
});
