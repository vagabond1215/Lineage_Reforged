import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateKnowledgeSnippets } from "../../tools/content-lint/knowledge-snippets.mjs";

const ROOT = process.cwd();
const SNIPPET_PATH = "packages/content/base/player/knowledge_snippets.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const snippetWrapper = await readJson(SNIPPET_PATH);
const snippetSchema = await readJson("packages/schemas/player/knowledge_snippet.schema.json");
const registryWrapper = await readJson(
  "packages/content/base/player/knowledge_domain_registry.json"
);
const skillsWrapper = await readJson("packages/content/base/player/skills.json");
const floraWrapper = await readJson("packages/content/base/world/flora.json");
const faunaWrapper = await readJson("packages/content/base/world/fauna.json");
const mineralWrapper = await readJson("packages/content/base/world/minerals.json");
const religionWrapper = await readJson("packages/content/base/world/religions.json");
const religiousHotspotWrapper = await readJson(
  "packages/content/base/world/religious_hotspots.json"
);
const sacredSiteWrapper = await readJson(
  "packages/content/base/world/sacred_sites.json"
);
const settlementDistrictWrapper = await readJson(
  "packages/content/base/world/settlement_districts.json"
);
const settlementSiteWrapper = await readJson(
  "packages/content/base/world/settlement_sites.json"
);
const regionWrapper = await readJson("packages/content/base/world/regions.json");
const settlementWrapper = await readJson("packages/content/base/world/settlements.json");
const deityRecords = religionWrapper.records.flatMap((religion) => religion.deities ?? []);

const ACTIVE_DOMAIN_IDS = [
  "knowledge_domain.flora",
  "knowledge_domain.fauna",
  "knowledge_domain.minerals",
  "knowledge_domain.ecology",
  "knowledge_domain.ecology",
  "knowledge_domain.ecology",
  "knowledge_domain.religion",
  "knowledge_domain.religion",
  "knowledge_domain.religion",
  "knowledge_domain.religion",
  "knowledge_domain.general_lore",
  "knowledge_domain.general_lore",
  "knowledge_domain.general_lore"
];

const EXPECTED_SNIPPET_IDS = [
  "knowledge_snippet.flora.aloe.identification",
  "knowledge_snippet.fauna.badger.identification",
  "knowledge_snippet.minerals.iron_ore.identification",
  "knowledge_snippet.ecology.kaelvar.regional_variant",
  "knowledge_snippet.ecology.sheep.seasonality",
  "knowledge_snippet.ecology.grape_vine.habitat",
  "knowledge_snippet.religion.elemental_pantheon.identification",
  "knowledge_snippet.religion.light_lady.identification",
  "knowledge_snippet.religion.glasswake_shrine_lantern_gardens.identification",
  "knowledge_snippet.religion.glasswake_shrine_lantern_gardens_glasswake_shrine.identification",
  "knowledge_snippet.general_lore.kaelvar.cultural_context",
  "knowledge_snippet.general_lore.highcrown_archive_districts.identification",
  "knowledge_snippet.general_lore.highcrown_market_courts.identification"
];

function makeInput() {
  return {
    relativePath: SNIPPET_PATH,
    wrapper: structuredClone(snippetWrapper),
    snippetSchema: structuredClone(snippetSchema),
    registryRecords: structuredClone(registryWrapper.records),
    subjectAuthorities: {
      flora: {
        collectionId: "world.flora",
        idPrefix: "flora.",
        records: structuredClone(floraWrapper.records)
      },
      fauna: {
        collectionId: "world.fauna",
        idPrefix: "fauna.",
        records: structuredClone(faunaWrapper.records)
      },
      mineral: {
        collectionId: "world.minerals",
        idPrefix: "mineral.",
        records: structuredClone(mineralWrapper.records)
      },
      religion: {
        collectionId: "world.religions",
        idPrefix: "religion.",
        records: structuredClone(religionWrapper.records)
      },
      deity: {
        collectionId: "world.religions",
        idPrefix: "deity.",
        records: structuredClone(deityRecords)
      },
      religious_hotspot: {
        collectionId: "world.religious_hotspots",
        idPrefix: "religious_hotspot.",
        idPattern: /^religious_hotspot\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
        records: structuredClone(religiousHotspotWrapper.records)
      },
      sacred_site: {
        collectionId: "world.sacred_sites",
        idPrefix: "sacred_site.",
        idPattern: /^sacred_site\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
        records: structuredClone(sacredSiteWrapper.records)
      },
      settlement_district: {
        collectionId: "world.settlement_districts",
        idPrefix: "settlement_district.",
        idPattern: /^settlement_district\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
        records: structuredClone(settlementDistrictWrapper.records)
      },
      settlement_site: {
        collectionId: "world.settlement_sites",
        idPrefix: "settlement_site.",
        idPattern: /^settlement_site\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
        records: structuredClone(settlementSiteWrapper.records),
        parentDistrictAuthority: {
          records: structuredClone(settlementDistrictWrapper.records)
        }
      },
      region: {
        collectionId: "world.regions",
        idPrefix: "region.",
        records: structuredClone(regionWrapper.records)
      }
    },
    locationAuthorities: {
      regions: structuredClone(regionWrapper.records),
      settlements: structuredClone(settlementWrapper.records)
    },
    skillRecords: structuredClone(skillsWrapper.records),
    availableContentCollectionIds: new Set([
      "world.flora",
      "world.fauna",
      "world.minerals",
      "world.religions",
      "world.religious_hotspots",
      "world.sacred_sites",
      "world.settlement_districts",
      "world.settlement_sites",
      "world.regions"
    ])
  };
}

function validate(input = makeInput()) {
  return validateKnowledgeSnippets(input);
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

function snippet(input, id = EXPECTED_SNIPPET_IDS[0]) {
  return input.wrapper.records.find((record) => record.id === id);
}

function religionDomain(input) {
  return input.registryRecords.find(
    (record) => record.id === "knowledge_domain.religion"
  );
}

function generalLoreDomain(input) {
  return input.registryRecords.find(
    (record) => record.id === "knowledge_domain.general_lore"
  );
}

function activateReligionDomain(input) {
  religionDomain(input).status = "active";
}

function religionSnippet({
  id = "knowledge_snippet.religion.elemental_pantheon.identification",
  subjectType = "religion",
  subjectId = "religion.elemental_pantheon",
  title = "Recognizing the Elemental Pantheon"
} = {}) {
  return {
    id,
    domainId: "knowledge_domain.religion",
    subjectType,
    subjectId,
    tier: 1,
    category: "identification",
    title,
    summary: "The Elemental Pantheon is recognized as a balanced faith tradition centered on paired elemental opposition and cyclical dominance.",
    discoverySources: [
      {
        sourceType: "book_study",
        sourceId: null
      }
    ],
    progression: {
      completionWeight: 1,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    },
    visibility: {
      lockedUntilDiscovered: true,
      revealsSubjectIdentity: true,
      hiddenSummary: "An unidentified faith tradition remains to be understood."
    },
    notes: [
      "Religion snippets remain authored knowledge only and do not grant worship, favor, faction, magic, or runtime behavior."
    ]
  };
}

function settlementPlaceSnippet({
  id = "knowledge_snippet.general_lore.highcrown_place.identification",
  subjectType,
  subjectId,
  title = "Recognizing a Highcrown Place"
}) {
  return {
    id,
    domainId: "knowledge_domain.general_lore",
    subjectType,
    subjectId,
    tier: 1,
    category: "identification",
    title,
    summary: "This authored place knowledge identifies a validated Highcrown district or site without granting access, services, discovery state, rewards, or gameplay behavior.",
    discoverySources: [
      {
        sourceType: "book_study",
        sourceId: null
      }
    ],
    progression: {
      completionWeight: 1,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    },
    visibility: {
      lockedUntilDiscovered: true,
      revealsSubjectIdentity: true,
      hiddenSummary: "An unidentified Highcrown place remains to be understood."
    },
    notes: [
      "Settlement district and site snippets are authored knowledge only and do not create place authority, discovery, services, access, rewards, runtime behavior, or gameplay behavior."
    ]
  };
}

function addGeneralLorePlaceSubject(input, subjectType, collectionId) {
  const domain = generalLoreDomain(input);
  if (!domain.canonicalSubjectTypes.includes(subjectType)) {
    domain.canonicalSubjectTypes.push(subjectType);
  }
  if (!domain.relatedContentCollections.includes(collectionId)) {
    domain.relatedContentCollections.push(collectionId);
  }
}

function prepareSettlementDistrictSnippet(
  input,
  districtId = "settlement_district.highcrown.archive_districts"
) {
  addGeneralLorePlaceSubject(
    input,
    "settlement_district",
    "world.settlement_districts"
  );
  input.wrapper.records = [
    settlementPlaceSnippet({
      id: "knowledge_snippet.general_lore.highcrown_district.identification",
      subjectType: "settlement_district",
      subjectId: districtId,
      title: "Recognizing a Highcrown District"
    })
  ];
  return input.subjectAuthorities.settlement_district.records.find(
    (record) => record.id === districtId
  );
}

function prepareSettlementSiteSnippet(
  input,
  siteId = "settlement_site.highcrown.barge_quays"
) {
  addGeneralLorePlaceSubject(input, "settlement_site", "world.settlement_sites");
  input.wrapper.records = [
    settlementPlaceSnippet({
      id: "knowledge_snippet.general_lore.highcrown_site.identification",
      subjectType: "settlement_site",
      subjectId: siteId,
      title: "Recognizing a Highcrown Site"
    })
  ];
  return input.subjectAuthorities.settlement_site.records.find(
    (record) => record.id === siteId
  );
}

function activateDistrict(input, districtId = "settlement_district.highcrown.archive_districts") {
  const district = input.subjectAuthorities.settlement_district.records.find(
    (record) => record.id === districtId
  );
  district.status = "active";
  const parentDistrict = input.subjectAuthorities.settlement_site.parentDistrictAuthority.records.find(
    (record) => record.id === districtId
  );
  parentDistrict.status = "active";
  return district;
}

function prepareReligiousHotspotSnippet(
  input,
  hotspotId = "religious_hotspot.glasswake_shrine_lantern_gardens"
) {
  const domain = religionDomain(input);
  if (!domain.canonicalSubjectTypes.includes("religious_hotspot")) {
    domain.canonicalSubjectTypes.push("religious_hotspot");
  }
  if (!domain.relatedContentCollections.includes("world.religious_hotspots")) {
    domain.relatedContentCollections.push("world.religious_hotspots");
  }
  input.wrapper.records = [
    religionSnippet({
      id: "knowledge_snippet.religion.religious_hotspot_fixture.identification",
      subjectType: "religious_hotspot",
      subjectId: hotspotId,
      title: "Recognizing a Religious Hotspot"
    })
  ];
  return input.subjectAuthorities.religious_hotspot.records.find(
    (record) => record.id === hotspotId
  );
}

function prepareSacredSiteSnippet(
  input,
  siteId = "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine"
) {
  const domain = religionDomain(input);
  if (!domain.canonicalSubjectTypes.includes("sacred_site")) {
    domain.canonicalSubjectTypes.push("sacred_site");
  }
  if (!domain.relatedContentCollections.includes("world.sacred_sites")) {
    domain.relatedContentCollections.push("world.sacred_sites");
  }
  input.wrapper.records = [
    religionSnippet({
      id: "knowledge_snippet.religion.sacred_site_fixture.identification",
      subjectType: "sacred_site",
      subjectId: siteId,
      title: "Recognizing Glasswake Shrine"
    })
  ];
  return input.subjectAuthorities.sacred_site.records.find(
    (record) => record.id === siteId
  );
}

test("accepts the current thirteen-record snippet catalog", () => {
  const input = makeInput();
  assert.deepEqual(
    input.wrapper.records.map((record) => record.id),
    EXPECTED_SNIPPET_IDS
  );
  assert.equal(validate(input), true);
});

test("accepts active Flora, Fauna, Minerals, Ecology, Religion, and General Lore domains", () => {
  const input = makeInput();
  assert.deepEqual(
    input.wrapper.records.map((record) => record.domainId),
    ACTIVE_DOMAIN_IDS
  );
  assert.equal(validate(input), true);
});

test("accepts current canonical subject ids", () => {
  const input = makeInput();
  assert.deepEqual(
    input.wrapper.records.map((record) => record.subjectId),
    [
      "flora.aloe",
      "fauna.badger",
      "mineral.iron_ore",
      "region.kaelvar",
      "fauna.sheep",
      "flora.grape_vine",
      "religion.elemental_pantheon",
      "deity.light_lady",
      "religious_hotspot.glasswake_shrine_lantern_gardens",
      "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine",
      "region.kaelvar",
      "settlement_district.highcrown.archive_districts",
      "settlement_district.highcrown.market_courts"
    ]
  );
  assert.equal(validate(input), true);
});

test("accepts an active Religion fixture with religion and deity authorities", () => {
  const input = makeInput();
  activateReligionDomain(input);
  input.wrapper.records = [
    religionSnippet(),
    religionSnippet({
      id: "knowledge_snippet.religion.light_lady.identification",
      subjectType: "deity",
      subjectId: "deity.light_lady",
      title: "Recognizing the Lady of Light"
    })
  ];

  assert.equal(validate(input), true);
});

test("accepts the live Glasswake religious hotspot snippet only for the active settlement hotspot", () => {
  const input = makeInput();
  const hotspotSnippets = input.wrapper.records.filter(
    (record) => record.subjectType === "religious_hotspot"
  );

  assert.equal(hotspotSnippets.length, 1);
  assert.equal(
    hotspotSnippets[0].id,
    "knowledge_snippet.religion.glasswake_shrine_lantern_gardens.identification"
  );
  assert.equal(
    hotspotSnippets[0].subjectId,
    "religious_hotspot.glasswake_shrine_lantern_gardens"
  );
  assert.equal(
    input.wrapper.records.some(
      (record) => record.subjectId === "religious_hotspot.lantern_shrine_gardens"
    ),
    false
  );
  assert.equal(validate(input), true);
});

test("knowledge snippet schema includes direct religious hotspot vocabulary", () => {
  assert.ok(snippetSchema.properties.subjectType.enum.includes("religious_hotspot"));
  assert.ok(snippetSchema.properties.subjectType.enum.includes("sacred_site"));
  assert.ok(snippetSchema.properties.subjectType.enum.includes("settlement_district"));
  assert.ok(snippetSchema.properties.subjectType.enum.includes("settlement_site"));
  assert.equal(snippetSchema.properties.subjectType.enum.includes("shrine"), false);
});

test("adds only the selected live settlement district Knowledge snippets", () => {
  const input = makeInput();
  const districtSnippets = input.wrapper.records.filter(
    (record) => record.subjectType === "settlement_district"
  );

  assert.equal(
    districtSnippets.length,
    2
  );
  assert.deepEqual(
    districtSnippets.map((record) => record.id),
    [
      "knowledge_snippet.general_lore.highcrown_archive_districts.identification",
      "knowledge_snippet.general_lore.highcrown_market_courts.identification"
    ]
  );
  assert.deepEqual(
    districtSnippets.map((record) => record.subjectId),
    [
      "settlement_district.highcrown.archive_districts",
      "settlement_district.highcrown.market_courts"
    ]
  );
  assert.equal(
    input.wrapper.records.some((record) => record.subjectType === "settlement_site"),
    false
  );
  assert.equal(
    input.subjectAuthorities.settlement_district.records.find(
      (record) => record.id === "settlement_district.highcrown.archive_districts"
    )?.status,
    "active"
  );
  assert.equal(
    input.subjectAuthorities.settlement_district.records.find(
      (record) => record.id === "settlement_district.highcrown.market_courts"
    )?.status,
    "active"
  );
  assert.deepEqual(
    input.subjectAuthorities.settlement_site.records.map((record) => ({
      id: record.id,
      status: record.status,
      parentDistrictId: record.parentDistrictId
    })),
    [
      {
        id: "settlement_site.highcrown.barge_quays",
        status: "active",
        parentDistrictId: null
      },
      {
        id: "settlement_site.highcrown.palace_terraces",
        status: "active",
        parentDistrictId: null
      }
    ]
  );
  assert.equal(validate(input), true);
});

test("accepts active settlement district Knowledge fixtures", () => {
  const input = makeInput();
  const district = prepareSettlementDistrictSnippet(input);
  district.status = "active";

  assert.equal(validate(input), true);
});

test("accepts active settlement site Knowledge fixtures with null parentDistrictId", () => {
  const input = makeInput();
  const site = prepareSettlementSiteSnippet(input);
  site.status = "active";
  site.parentDistrictId = null;

  assert.equal(validate(input), true);
});

test("accepts active settlement site Knowledge fixtures with an active district anchor", () => {
  const input = makeInput();
  const site = prepareSettlementSiteSnippet(input);
  const district = activateDistrict(input);

  site.status = "active";
  site.parentDistrictId = district.id;

  assert.equal(validate(input), true);
});

test("rejects malformed settlement district and site subject ids", async (t) => {
  const cases = [
    {
      name: "district missing slug",
      prepare(input) {
        prepareSettlementDistrictSnippet(input, "settlement_district.highcrown");
      },
      expected: /is malformed for subjectType 'settlement_district'/
    },
    {
      name: "district extra segment",
      prepare(input) {
        prepareSettlementDistrictSnippet(
          input,
          "settlement_district.highcrown.archive.districts"
        );
      },
      expected: /is malformed for subjectType 'settlement_district'/
    },
    {
      name: "site missing slug",
      prepare(input) {
        prepareSettlementSiteSnippet(input, "settlement_site.highcrown");
      },
      expected: /is malformed for subjectType 'settlement_site'/
    },
    {
      name: "site extra segment",
      prepare(input) {
        prepareSettlementSiteSnippet(input, "settlement_site.highcrown.barge.quays");
      },
      expected: /is malformed for subjectType 'settlement_site'/
    }
  ];

  for (const validationCase of cases) {
    await t.test(validationCase.name, () => {
      expectFailure(validationCase.prepare, validationCase.expected);
    });
  }
});

test("rejects unresolved settlement district and site subject ids", async (t) => {
  const cases = [
    {
      name: "district",
      prepare(input) {
        prepareSettlementDistrictSnippet(
          input,
          "settlement_district.highcrown.missing_district"
        );
      },
      expected: /subjectId 'settlement_district\.highcrown\.missing_district' is missing from world\.settlement_districts/
    },
    {
      name: "site",
      prepare(input) {
        prepareSettlementSiteSnippet(input, "settlement_site.highcrown.missing_site");
      },
      expected: /subjectId 'settlement_site\.highcrown\.missing_site' is missing from world\.settlement_sites/
    }
  ];

  for (const validationCase of cases) {
    await t.test(validationCase.name, () => {
      expectFailure(validationCase.prepare, validationCase.expected);
    });
  }
});

test("rejects planned and retired settlement district and site subjects", async (t) => {
  const cases = [
    {
      name: "planned district",
      prepare(input) {
        const plannedDistrict = structuredClone(
          input.subjectAuthorities.settlement_district.records.find(
            (record) => record.id === "settlement_district.highcrown.market_courts"
          )
        );
        plannedDistrict.id = "settlement_district.highcrown.planned_market_courts";
        plannedDistrict.slug = "planned_market_courts";
        plannedDistrict.status = "planned";
        input.subjectAuthorities.settlement_district.records.push(plannedDistrict);
        prepareSettlementDistrictSnippet(input, plannedDistrict.id);
      },
      expected: /settlement_district subjectId '.+' must reference an active settlement district record/
    },
    {
      name: "retired district",
      prepare(input) {
        const district = prepareSettlementDistrictSnippet(input);
        district.status = "retired";
      },
      expected: /settlement_district subjectId '.+' must reference an active settlement district record/
    },
    {
      name: "planned site",
      prepare(input) {
        const plannedSite = structuredClone(
          input.subjectAuthorities.settlement_site.records.find(
            (record) => record.id === "settlement_site.highcrown.barge_quays"
          )
        );
        plannedSite.id = "settlement_site.highcrown.planned_barge_quays";
        plannedSite.slug = "planned_barge_quays";
        plannedSite.status = "planned";
        input.subjectAuthorities.settlement_site.records.push(plannedSite);
        prepareSettlementSiteSnippet(input, plannedSite.id);
      },
      expected: /settlement_site subjectId '.+' must reference an active settlement site record/
    },
    {
      name: "retired site",
      prepare(input) {
        const site = prepareSettlementSiteSnippet(input);
        site.status = "retired";
      },
      expected: /settlement_site subjectId '.+' must reference an active settlement site record/
    }
  ];

  for (const validationCase of cases) {
    await t.test(validationCase.name, () => {
      expectFailure(validationCase.prepare, validationCase.expected);
    });
  }
});

test("rejects settlement site district anchors without valid active district authority", async (t) => {
  const cases = [
    {
      name: "missing authority",
      prepare(input) {
        const site = prepareSettlementSiteSnippet(input);
        site.status = "active";
        site.parentDistrictId = "settlement_district.highcrown.archive_districts";
        delete input.subjectAuthorities.settlement_site.parentDistrictAuthority;
      },
      expected: /requires settlement_district authority for parentDistrictId/
    },
    {
      name: "unresolved district",
      prepare(input) {
        const site = prepareSettlementSiteSnippet(input);
        site.status = "active";
        site.parentDistrictId = "settlement_district.highcrown.missing_district";
      },
      expected: /parentDistrictId 'settlement_district\.highcrown\.missing_district' is missing from world\.settlement_districts/
    },
    {
      name: "planned district",
      prepare(input) {
        const site = prepareSettlementSiteSnippet(input);
        const plannedDistrict = structuredClone(
          input.subjectAuthorities.settlement_site.parentDistrictAuthority.records.find(
            (record) => record.id === "settlement_district.highcrown.market_courts"
          )
        );
        plannedDistrict.id = "settlement_district.highcrown.planned_market_courts";
        plannedDistrict.slug = "planned_market_courts";
        plannedDistrict.status = "planned";
        input.subjectAuthorities.settlement_site.parentDistrictAuthority.records.push(
          plannedDistrict
        );
        site.status = "active";
        site.parentDistrictId = plannedDistrict.id;
      },
      expected: /parentDistrictId 'settlement_district\.highcrown\.planned_market_courts' must reference an active settlement district record/
    },
    {
      name: "mismatched settlement slug",
      prepare(input) {
        const site = prepareSettlementSiteSnippet(input);
        site.status = "active";
        site.parentDistrictId = "settlement_district.glasswake.market_courts";
        input.subjectAuthorities.settlement_site.parentDistrictAuthority.records.push({
          ...structuredClone(input.subjectAuthorities.settlement_district.records[0]),
          id: "settlement_district.glasswake.market_courts",
          status: "active"
        });
      },
      expected: /parentDistrictId 'settlement_district\.glasswake\.market_courts' must share settlement slug 'highcrown'/
    },
    {
      name: "mismatched parent settlement",
      prepare(input) {
        const site = prepareSettlementSiteSnippet(input);
        const district = activateDistrict(input);
        site.status = "active";
        site.parentDistrictId = district.id;
        site.parentSettlementId = "settlement.glasswake_shrine";
      },
      expected: /parentSettlementId 'settlement\.glasswake_shrine' must share settlement slug 'highcrown'/
    }
  ];

  for (const validationCase of cases) {
    await t.test(validationCase.name, () => {
      expectFailure(validationCase.prepare, validationCase.expected);
    });
  }
});

test("does not infer settlement district or site subjects from parent settlement ids", async (t) => {
  const cases = [
    {
      name: "district",
      prepare(input) {
        prepareSettlementDistrictSnippet(input, "settlement.highcrown");
      },
      expected: /must use prefix 'settlement_district\.'/
    },
    {
      name: "site",
      prepare(input) {
        prepareSettlementSiteSnippet(input, "settlement.highcrown");
      },
      expected: /must use prefix 'settlement_site\.'/
    }
  ];

  for (const validationCase of cases) {
    await t.test(validationCase.name, () => {
      expectFailure(validationCase.prepare, validationCase.expected);
    });
  }
});

test("aligns live Religion with exactly one active sacred-site Knowledge snippet", () => {
  const input = makeInput();
  const religion = religionDomain(makeInput());
  const sacredSiteSnippets = input.wrapper.records.filter(
    (record) => record.subjectType === "sacred_site"
  );

  assert.ok(religion.canonicalSubjectTypes.includes("sacred_site"));
  assert.ok(religion.relatedContentCollections.includes("world.sacred_sites"));
  assert.equal(sacredSiteSnippets.length, 1);
  assert.equal(
    sacredSiteSnippets[0].id,
    "knowledge_snippet.religion.glasswake_shrine_lantern_gardens_glasswake_shrine.identification"
  );
  assert.equal(
    sacredSiteSnippets[0].subjectId,
    "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine"
  );
  assert.equal(sacredSiteSnippets[0].tier, 1);
  assert.equal(sacredSiteSnippets[0].category, "identification");
  assert.deepEqual(sacredSiteSnippets[0].discoverySources, [
    { sourceType: "book_study", sourceId: null }
  ]);
  assert.deepEqual(sacredSiteSnippets[0].notes, [
    "This snippet is authored Religion knowledge only and grants no deity dedication, religious-order stewardship, service, access, pilgrimage progress, favorability, alignment, law effect, spell access, Magic Study readiness, Prestige, family effect, runtime behavior, or gameplay behavior."
  ]);
  assert.equal(
    registryWrapper.records.some(
      (record) => record.id === "knowledge_domain.sacred_sites"
    ),
    false
  );
  assert.equal(
    input.wrapper.records.some(
      (record) => record.subjectId === "religious_hotspot.lantern_shrine_gardens"
    ),
    false
  );
  const nonActiveSacredSiteIds = new Set(
    input.subjectAuthorities.sacred_site.records
      .filter((record) => record.status === "planned" || record.status === "deferred")
      .map((record) => record.id)
  );
  assert.ok(
    sacredSiteSnippets.every(
      (record) => !nonActiveSacredSiteIds.has(record.subjectId)
    )
  );
  assert.equal(validate(input), true);
});

test("accepts a sacred-site fixture only when the cloned site is active and Religion is aligned", () => {
  const input = makeInput();
  const site = prepareSacredSiteSnippet(input);
  site.status = "active";
  assert.equal(validate(input), true);
});

test("rejects planned and deferred sacred-site subjects", async (t) => {
  for (const status of ["planned", "deferred"]) {
    await t.test(status, () => {
      const input = makeInput();
      const site = prepareSacredSiteSnippet(input);
      site.status = status;
      assert.throws(
        () => validate(input),
        /sacred_site subjectId '.+' must reference an active sacred-site record/
      );
    });
  }
});

test("rejects missing, malformed, and type-only sacred-site subject ids", async (t) => {
  const cases = [
    [
      "missing",
      "sacred_site.glasswake_shrine_lantern_gardens.missing_shrine",
      /is missing from world\.sacred_sites/
    ],
    [
      "malformed",
      "sacred_site.glasswake.shrine.extra",
      /is malformed for subjectType 'sacred_site'/
    ],
    [
      "type-only",
      "sacred_site.shrine",
      /is malformed for subjectType 'sacred_site'/
    ]
  ];

  for (const [name, siteId, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => {
          prepareSacredSiteSnippet(input, siteId);
        },
        expected
      );
    });
  }
});

test("rejects cross-type and settlement authority for sacred-site subjects", async (t) => {
  const cases = [
    [
      "religious hotspot",
      "religious_hotspot.glasswake_shrine_lantern_gardens",
      /must use prefix 'sacred_site\.'/
    ],
    [
      "settlement",
      "settlement.glasswake_shrine",
      /must use prefix 'sacred_site\.'/
    ]
  ];

  for (const [name, subjectId, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => {
          prepareSacredSiteSnippet(input, subjectId);
        },
        expected
      );
    });
  }

  await t.test("sacred site as religious hotspot", () => {
    expectFailure(
      (input) => {
        prepareReligiousHotspotSnippet(
          input,
          "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine"
        );
      },
      /must use prefix 'religious_hotspot\.'/
    );
  });
});

test("does not infer sacred-site authority from hotspot descriptive metadata", () => {
  const input = makeInput();
  const hotspot = input.subjectAuthorities.religious_hotspot.records.find(
    (record) => record.sacredSiteType === "shrine"
  );
  assert.ok(hotspot);
  prepareSacredSiteSnippet(input, hotspot.id);
  assert.throws(() => validate(input), /must use prefix 'sacred_site\.'/);
});

test("accepts religious hotspot fixtures when cloned authority records are active", async (t) => {
  for (const hotspotId of [
    "religious_hotspot.glasswake_shrine_lantern_gardens",
    "religious_hotspot.lantern_shrine_gardens"
  ]) {
    await t.test(hotspotId, () => {
      const input = makeInput();
      const hotspot = prepareReligiousHotspotSnippet(input, hotspotId);
      hotspot.status = "active";
      assert.equal(validate(input), true);
    });
  }
});

test("rejects religious hotspot snippets while locality authority remains planned", () => {
  expectFailure(
    (input) => {
      prepareReligiousHotspotSnippet(
        input,
        "religious_hotspot.lantern_shrine_gardens"
      );
    },
    /religious_hotspot subjectId 'religious_hotspot\.lantern_shrine_gardens' must reference an active hotspot record/
  );
});

test("rejects unresolved and malformed religious hotspot subject ids", async (t) => {
  await t.test("unresolved", () => {
    expectFailure(
      (input) => {
        prepareReligiousHotspotSnippet(input, "religious_hotspot.missing_shrine");
      },
      /subjectId 'religious_hotspot\.missing_shrine' is missing from world\.religious_hotspots/
    );
  });

  await t.test("malformed", () => {
    expectFailure(
      (input) => {
        prepareReligiousHotspotSnippet(input, "religious_hotspot.bad.shrine");
      },
      /subjectId 'religious_hotspot\.bad\.shrine' is malformed for subjectType 'religious_hotspot'/
    );
  });
});

test("rejects shortcut subjects for religious hotspot ids", async (t) => {
  const cases = [
    ["custom", /subjectType 'custom' is blocked/],
    ["shrine", /subjectType must be one of the schema enum values/],
    ["sacred_site", /subjectId '.+' must use prefix 'sacred_site\.'/],
    ["region", /subjectId '.+' must use prefix 'region\.'/],
    ["settlement", /subjectType 'settlement' is blocked/]
  ];

  for (const [subjectType, expected] of cases) {
    await t.test(subjectType, () => {
      const input = makeInput();
      const record = religionSnippet({
        id: `knowledge_snippet.religion.hotspot_${subjectType}.identification`,
        subjectType,
        subjectId: "religious_hotspot.glasswake_shrine_lantern_gardens"
      });
      religionDomain(input).canonicalSubjectTypes.push(subjectType);
      input.wrapper.records = [record];
      assert.throws(() => validate(input), expected);
    });
  }
});

test("keeps Religion snippets blocked while the domain remains planned", () => {
  expectFailure(
    (input) => {
      religionDomain(input).status = "planned";
      input.wrapper.records = [religionSnippet()];
    },
    /domainId 'knowledge_domain\.religion' must reference status 'active'/
  );
});

test("accepts null sourceId values", () => {
  const input = makeInput();
  assert.ok(
    input.wrapper.records.every((record) =>
      record.discoverySources.every((source) => source.sourceId === null)
    )
  );
  assert.equal(validate(input), true);
});

test("accepts records with no prerequisites", () => {
  const input = makeInput();
  assert.ok(input.wrapper.records.every((record) => record.prerequisites === undefined));
  assert.equal(validate(input), true);
});

test("accepts known subregion and settlement location ids", () => {
  const input = makeInput();
  const subregion = input.locationAuthorities.regions.find(
    (record) => record.regionType === "subregion"
  );
  const settlement = input.locationAuthorities.settlements[0];
  const source = snippet(
    input,
    "knowledge_snippet.general_lore.kaelvar.cultural_context"
  ).discoverySources[0];

  source.locationScope.regionId = subregion.id;
  source.locationScope.settlementId = settlement.id;
  assert.equal(validate(input), true);
});

test("rejects a missing records wrapper", () => {
  expectFailure(
    (input) => {
      input.wrapper = {};
    },
    /wrapper must contain exactly one top-level key: records/
  );
});

test("rejects a non-object top-level wrapper", () => {
  expectFailure(
    (input) => {
      input.wrapper = [];
    },
    /wrapper must be an object/
  );
});

test("rejects extra top-level wrapper keys", () => {
  expectFailure(
    (input) => {
      input.wrapper.version = 1;
    },
    /wrapper must contain exactly one top-level key: records/
  );
});

test("rejects non-array records", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = {};
    },
    /records must be an array/
  );
});

test("rejects empty records", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = [];
    },
    /records must be non-empty/
  );
});

test("rejects a structurally invalid record before semantic checks", () => {
  expectFailure(
    (input) => {
      const record = snippet(input);
      delete record.title;
      record.domainId = "knowledge_domain.missing";
    },
    /structural validation failed: records\[0\] is missing required property 'title'/
  );
});

test("rejects unsupported snippet schema keywords", () => {
  expectFailure(
    (input) => {
      input.snippetSchema.default = {};
    },
    /knowledge snippet schema \$ uses unsupported keyword 'default'/
  );
});

test("enforces snippet schema numeric bounds and finite values", async (t) => {
  const cases = [
    {
      name: "maximum tier",
      mutate(record) {
        record.tier = 11;
      },
      expected: /records\[0\]\.tier must be at most 10/
    },
    {
      name: "non-negative completion weight",
      mutate(record) {
        record.progression.completionWeight = -1;
      },
      expected: /records\[0\]\.progression\.completionWeight must be at least 0/
    },
    {
      name: "finite trial unlock weight",
      mutate(record) {
        record.progression.trialUnlockWeight = Number.NaN;
      },
      expected: /records\[0\]\.progression\.trialUnlockWeight must be type number/
    }
  ];

  for (const numericCase of cases) {
    await t.test(numericCase.name, () => {
      expectFailure(
        (input) => {
          numericCase.mutate(snippet(input));
        },
        numericCase.expected
      );
    });
  }
});

test("rejects duplicate snippet ids", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[1].id = input.wrapper.records[0].id;
    },
    /duplicate snippet id 'knowledge_snippet\.flora\.aloe\.identification'/
  );
});

test("rejects an unresolved domainId", () => {
  expectFailure(
    (input) => {
      snippet(input).domainId = "knowledge_domain.missing";
    },
    /domainId 'knowledge_domain\.missing' is missing/
  );
});

test("rejects a planned domainId including Arcane Lore", () => {
  expectFailure(
    (input) => {
      snippet(input).domainId = "knowledge_domain.arcane_lore";
    },
    /domainId 'knowledge_domain\.arcane_lore' must reference status 'active'/
  );
});

test("rejects a subjectType not supported by the domain", () => {
  expectFailure(
    (input) => {
      const record = snippet(input);
      record.subjectType = "fauna";
      record.subjectId = "fauna.badger";
    },
    /subjectType 'fauna' is not supported by domain knowledge_domain\.flora/
  );
});

test("rejects a category not supported by the domain", () => {
  expectFailure(
    (input) => {
      snippet(input).category = "behavior";
    },
    /category 'behavior' is not supported by domain knowledge_domain\.flora/
  );
});

test("rejects a sourceType not supported by the domain", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources[0].sourceType = "combat_observation";
    },
    /discovery sourceType 'combat_observation' is not supported by domain knowledge_domain\.flora/
  );
});

test("rejects an unresolved subjectId", () => {
  expectFailure(
    (input) => {
      snippet(input).subjectId = "flora.missing";
    },
    /subjectId 'flora\.missing' is missing from world\.flora/
  );
});

test("rejects a subjectId prefix mismatch", () => {
  expectFailure(
    (input) => {
      snippet(input).subjectId = "fauna.badger";
    },
    /subjectId 'fauna\.badger' must use prefix 'flora\.'/
  );
});

test("rejects unresolved religion and deity subject ids", async (t) => {
  const cases = [
    {
      name: "religion",
      record: religionSnippet({ subjectId: "religion.missing" }),
      expected: /subjectId 'religion\.missing' is missing from world\.religions/
    },
    {
      name: "deity",
      record: religionSnippet({
        id: "knowledge_snippet.religion.missing_deity.identification",
        subjectType: "deity",
        subjectId: "deity.missing"
      }),
      expected: /subjectId 'deity\.missing' is missing from world\.religions/
    }
  ];

  for (const authorityCase of cases) {
    await t.test(authorityCase.name, () => {
      expectFailure(
        (input) => {
          activateReligionDomain(input);
          input.wrapper.records = [authorityCase.record];
        },
        authorityCase.expected
      );
    });
  }
});

test("rejects duplicate religion and deity authority ids", async (t) => {
  const cases = [
    {
      name: "religion",
      subjectType: "religion",
      record: religionSnippet(),
      duplicate() {
        return structuredClone(religionWrapper.records[0]);
      },
      expected: /religion subject authority has duplicate id 'religion\.elemental_pantheon'/
    },
    {
      name: "deity",
      subjectType: "deity",
      record: religionSnippet({
        id: "knowledge_snippet.religion.light_lady.identification",
        subjectType: "deity",
        subjectId: "deity.light_lady"
      }),
      duplicate() {
        return structuredClone(deityRecords[0]);
      },
      expected: /deity subject authority has duplicate id 'deity\.light_lady'/
    }
  ];

  for (const authorityCase of cases) {
    await t.test(authorityCase.name, () => {
      expectFailure(
        (input) => {
          activateReligionDomain(input);
          input.wrapper.records = [authorityCase.record];
          input.subjectAuthorities[authorityCase.subjectType].records.push(
            authorityCase.duplicate()
          );
        },
        authorityCase.expected
      );
    });
  }
});

test("rejects malformed religion and deity authority records without canonical ids", async (t) => {
  const cases = [
    {
      name: "religion",
      subjectType: "religion",
      record: religionSnippet(),
      expected: /religion subject authority records\[1\] must provide a canonical id/
    },
    {
      name: "deity",
      subjectType: "deity",
      record: religionSnippet({
        id: "knowledge_snippet.religion.light_lady.identification",
        subjectType: "deity",
        subjectId: "deity.light_lady"
      }),
      expected: /deity subject authority records\[8\] must provide a canonical id/
    }
  ];

  for (const authorityCase of cases) {
    await t.test(authorityCase.name, () => {
      expectFailure(
        (input) => {
          activateReligionDomain(input);
          input.wrapper.records = [authorityCase.record];
          input.subjectAuthorities[authorityCase.subjectType].records.push({
            name: "Missing Canonical Id"
          });
        },
        authorityCase.expected
      );
    });
  }
});

test("rejects blocked subject types without authority", () => {
  expectFailure(
    (input) => {
      const record = snippet(
        input,
        "knowledge_snippet.general_lore.kaelvar.cultural_context"
      );
      record.subjectType = "settlement";
      record.subjectId = "settlement.aurelis";
    },
    /subjectType 'settlement' is blocked in the first validator/
  );
});

test("rejects a domain missing the subject authority collection", () => {
  expectFailure(
    (input) => {
      const domain = input.registryRecords.find(
        (record) => record.id === "knowledge_domain.flora"
      );
      domain.relatedContentCollections = domain.relatedContentCollections.filter(
        (collectionId) => collectionId !== "world.flora"
      );
    },
    /domain knowledge_domain\.flora must include 'world\.flora'/
  );
});

test("rejects a subject collection absent from current base content ids", () => {
  expectFailure(
    (input) => {
      input.availableContentCollectionIds.delete("world.flora");
    },
    /subject collection 'world\.flora' is not a current base content collection/
  );
});

test("rejects non-null sourceId", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources[0].sourceId = "flora.aloe";
    },
    /sourceId must remain null/
  );
});

test("rejects duplicate discovery source declarations regardless of key order", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources.push({
        sourceId: null,
        sourceType: "field_identification"
      });
    },
    /duplicate discovery source declarations/
  );
});

test("rejects empty discoverySources", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources = [];
    },
    /discoverySources must contain at least 1 items/
  );
});

test("rejects invalid continent, region, and settlement location ids", async (t) => {
  const generalLoreId = "knowledge_snippet.general_lore.kaelvar.cultural_context";
  const subregion = regionWrapper.records.find((record) => record.regionType === "subregion");

  const cases = [
    {
      name: "unknown continent",
      mutate(scope) {
        scope.continentId = "region.missing_continent";
      },
      expected: /continentId 'region\.missing_continent' is missing/
    },
    {
      name: "continent with subregion type",
      mutate(scope) {
        scope.continentId = subregion.id;
      },
      expected: /continentId '.+' must reference regionType 'continent'/
    },
    {
      name: "unknown region",
      mutate(scope) {
        scope.regionId = "region.missing_subregion";
      },
      expected: /regionId 'region\.missing_subregion' is missing/
    },
    {
      name: "region with continent type",
      mutate(scope) {
        scope.regionId = "region.kaelvar";
      },
      expected: /regionId 'region\.kaelvar' must reference regionType 'subregion'/
    },
    {
      name: "unknown settlement",
      mutate(scope) {
        scope.settlementId = "settlement.missing";
      },
      expected: /settlementId 'settlement\.missing' is missing/
    }
  ];

  for (const locationCase of cases) {
    await t.test(locationCase.name, () => {
      expectFailure(
        (input) => {
          const scope = snippet(input, generalLoreId).discoverySources[0].locationScope;
          locationCase.mutate(scope);
        },
        locationCase.expected
      );
    });
  }
});

test("rejects lockedUntilDiscovered true without hiddenSummary", () => {
  expectFailure(
    (input) => {
      delete snippet(input).visibility.hiddenSummary;
    },
    /visibility\.hiddenSummary is required when lockedUntilDiscovered is true/
  );
});

test("rejects prerequisite snippet self-reference", () => {
  expectFailure(
    (input) => {
      const record = snippet(input);
      record.prerequisites = { requiredSnippetIds: [record.id] };
    },
    /prerequisite snippet self-reference/
  );
});

test("rejects prerequisite snippet cycles", () => {
  expectFailure(
    (input) => {
      const first = input.wrapper.records[0];
      const second = input.wrapper.records[1];
      first.prerequisites = { requiredSnippetIds: [second.id] };
      second.prerequisites = { requiredSnippetIds: [first.id] };
    },
    /prerequisite cycle detected:/
  );
});

test("rejects an unresolved prerequisite snippet id", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {
        requiredSnippetIds: ["knowledge_snippet.flora.missing.identification"]
      };
    },
    /prerequisite snippet id 'knowledge_snippet\.flora\.missing\.identification' is missing/
  );
});

test("rejects an unresolved prerequisite skill id", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {
        requiredSkillRanks: [
          {
            skillId: "skill.knowledge.missing",
            minimumRank: 1
          }
        ]
      };
    },
    /prerequisite skill id 'skill\.knowledge\.missing' is missing/
  );
});

test("rejects duplicate and conflicting prerequisite skill ranks", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {
        requiredSkillRanks: [
          {
            skillId: "skill.knowledge.general_lore",
            minimumRank: 1
          },
          {
            skillId: "skill.knowledge.general_lore",
            minimumRank: 2
          }
        ]
      };
    },
    /duplicate prerequisite skill id 'skill\.knowledge\.general_lore'/
  );
});

test("rejects an empty prerequisites object", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {};
    },
    /prerequisites must be omitted when empty/
  );
});

test("rejects custom subject, category, and source values", async (t) => {
  const generalLoreId = "knowledge_snippet.general_lore.kaelvar.cultural_context";
  const cases = [
    {
      name: "subject",
      mutate(record) {
        record.subjectType = "custom";
        record.subjectId = "custom.kaelvar";
      },
      expected: /subjectType 'custom' is blocked/
    },
    {
      name: "category",
      mutate(record) {
        record.category = "custom";
      },
      expected: /category 'custom' is blocked/
    },
    {
      name: "source",
      mutate(record) {
        record.discoverySources[0].sourceType = "custom";
      },
      expected: /sourceType 'custom' is blocked/
    }
  ];

  for (const customCase of cases) {
    await t.test(customCase.name, () => {
      expectFailure(
        (input) => {
          customCase.mutate(snippet(input, generalLoreId));
        },
        customCase.expected
      );
    });
  }
});

test("rejects runtime and player-state fields", () => {
  expectFailure(
    (input) => {
      snippet(input).currentProgress = 50;
    },
    /structural validation failed: records\[0\] has unsupported property 'currentProgress'/
  );
});
