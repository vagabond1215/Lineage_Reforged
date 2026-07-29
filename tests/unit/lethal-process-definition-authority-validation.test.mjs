import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateLethalProcessDefinitionCatalogs } from "../../tools/content-lint/lethal-process-definitions.mjs";

const ROOT = process.cwd();
const SCHEMA_PATH =
  "packages/schemas/game/lethal-process-definition.schema.json";
const VALIDATOR_PATH = "tools/content-lint/lethal-process-definitions.mjs";
const INDEX_PATH = "tools/content-lint/index.mjs";
const SCHEMA_TEST_PATH = "tests/unit/schema-files.test.mjs";
const COMBAT_HEALTH_PATHS = [
  "packages/content/base/game/combat_health_vocabulary.json",
  "packages/schemas/game/combat-health-vocabulary.schema.json",
  "tools/content-lint/combat-health-vocabulary.mjs",
  "tests/unit/combat-status-condition-injury-authority-validation.test.mjs"
];

const CATALOG_PATHS = [
  "packages/content/base/game/lethal_process_hemorrhage_definitions.json",
  "packages/content/base/game/lethal_process_airway_definitions.json",
  "packages/content/base/game/lethal_process_respiratory_definitions.json",
  "packages/content/base/game/lethal_process_thermal_definitions.json"
];

const EXPECTED_RECORDS = [
  {
    id: "lethal_process.hemorrhage.external_hemorrhage",
    slug: "external_hemorrhage",
    name: "External Hemorrhage",
    definitionOwner: "hemorrhage_process",
    processFamily: "hemorrhage",
    catalogLifecycle: "canonical",
    semanticVersion: 1,
    summary:
      "Static identity for an independently owned external hemorrhage process accepted from owner-certified causal facts; it defines no stage, rate, care, outcome, or display behavior.",
    references: [],
    tags: ["hemorrhage", "external"],
    sourceAuthorityNotes:
      "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan.",
    notes:
      "Causal injury remains injury-owned. This definition does not infer process truth from a wound, bleeding label, HP, or prose."
  },
  {
    id: "lethal_process.hemorrhage.internal_hemorrhage",
    slug: "internal_hemorrhage",
    name: "Internal Hemorrhage",
    definitionOwner: "hemorrhage_process",
    processFamily: "hemorrhage",
    catalogLifecycle: "canonical",
    semanticVersion: 1,
    summary:
      "Static identity for an independently owned internal hemorrhage process accepted as actual process truth; it defines no observation, diagnosis, stage, rate, care, outcome, or display behavior.",
    references: [],
    tags: ["hemorrhage", "internal"],
    sourceAuthorityNotes:
      "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan.",
    notes:
      "An instance represents owner-accepted actual internal hemorrhage. Suspicion and observer confidence remain assessment-owned."
  },
  {
    id: "lethal_process.airway.obstruction",
    slug: "obstruction",
    name: "Airway Obstruction",
    definitionOwner: "airway_process",
    processFamily: "airway",
    catalogLifecycle: "canonical",
    semanticVersion: 1,
    summary:
      "Static identity for an independently owned airway obstruction process accepted from owner-certified causal facts; it defines no cause, stage, care, resolution rule, outcome, or display behavior.",
    references: [],
    tags: ["airway", "obstruction"],
    sourceAuthorityNotes:
      "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan.",
    notes:
      "Airway obstruction remains distinct from later respiratory harm and does not absorb hazard, body, care, or observer authority."
  },
  {
    id: "lethal_process.respiratory.post_submersion_compromise",
    slug: "post_submersion_compromise",
    name: "Post-Submersion Respiratory Compromise",
    definitionOwner: "respiratory_process",
    processFamily: "respiratory",
    catalogLifecycle: "canonical",
    semanticVersion: 1,
    summary:
      "Static identity for an independently owned post-submersion respiratory process accepted from owner-certified source facts; it defines no hidden timer, stage, care, prognosis, outcome, or display behavior.",
    references: [],
    tags: ["respiratory", "post_submersion"],
    sourceAuthorityNotes:
      "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan.",
    notes:
      "Submersion and hazard sources remain separately owned. This definition creates no delayed-death timer or automatic diagnosis."
  },
  {
    id: "lethal_process.thermal.systemic_hypothermia",
    slug: "systemic_hypothermia",
    name: "Systemic Hypothermia",
    definitionOwner: "thermal_process",
    processFamily: "thermal",
    catalogLifecycle: "canonical",
    semanticVersion: 1,
    summary:
      "Static identity for an independently owned systemic cold process accepted from owner-certified thermal, body, and environment facts; it defines no temperature threshold, stage, care, outcome, or display behavior.",
    references: [],
    tags: ["thermal", "cold_exposure"],
    sourceAuthorityNotes:
      "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan.",
    notes:
      "This is a systemic thermal process only. Local freezing injury remains injury-owned, and environment and body facts remain source-owned."
  },
  {
    id: "lethal_process.thermal.hot_altered_crisis",
    slug: "hot_altered_crisis",
    name: "Hot-Altered Heat Crisis",
    definitionOwner: "thermal_process",
    processFamily: "thermal",
    catalogLifecycle: "canonical",
    semanticVersion: 1,
    summary:
      "Static identity for an independently owned hot-altered heat process accepted from owner-certified thermal, body, function, and environment facts; it defines no threshold, stage, care, outcome, or display behavior.",
    references: [],
    tags: ["thermal", "heat_exposure"],
    sourceAuthorityNotes:
      "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan.",
    notes:
      "This process requires a later owner-accepted transition; contextual heat illness remains body and environment evidence."
  }
];

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  const raw = await readText(relativePath);
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson(SCHEMA_PATH);
const liveCatalogs = await Promise.all(
  CATALOG_PATHS.map(async (relativePath) => ({
    relativePath,
    wrapper: await readJson(relativePath)
  }))
);

function input(overrides = {}) {
  return {
    catalogs: structuredClone(liveCatalogs),
    schema: structuredClone(schema),
    canonicalReferenceIdsByTargetDomain: {},
    ...overrides
  };
}

function catalog(validationInput, ownerDomain) {
  return validationInput.catalogs.find(
    (entry) => entry.wrapper.ownerDomain === ownerDomain
  );
}

function record(validationInput, id) {
  return validationInput.catalogs
    .flatMap((entry) => entry.wrapper.records)
    .find((entry) => entry.id === id);
}

function expectFailure(mutate, expected) {
  const validationInput = input();
  mutate(validationInput);
  assert.throws(
    () => validateLethalProcessDefinitionCatalogs(validationInput),
    expected
  );
}

async function productionSourceFiles(relativeRoot) {
  const rootPath = path.join(ROOT, relativeRoot);
  const entries = await readdir(rootPath, {
    recursive: true,
    withFileTypes: true
  });
  return entries
    .filter(
      (entry) =>
        entry.isFile() && /\.(?:js|mjs|cjs|ts|tsx|jsx)$/.test(entry.name)
    )
    .map((entry) => path.join(entry.parentPath, entry.name));
}

test("validates the exact six live records and two-one-one-two owner distribution", () => {
  for (const relativePath of CATALOG_PATHS) {
    assert.equal(existsSync(path.join(ROOT, relativePath)), true);
  }
  assert.deepEqual(
    liveCatalogs.flatMap((entry) => entry.wrapper.records),
    EXPECTED_RECORDS
  );
  assert.deepEqual(
    liveCatalogs.map((entry) => [
      entry.wrapper.ownerDomain,
      entry.wrapper.records.length
    ]),
    [
      ["hemorrhage_process", 2],
      ["airway_process", 1],
      ["respiratory_process", 1],
      ["thermal_process", 2]
    ]
  );
  assert.deepEqual(validateLethalProcessDefinitionCatalogs(input()), {
    ok: true,
    definitionIds: EXPECTED_RECORDS.map((entry) => entry.id).sort()
  });
  assert.equal(
    EXPECTED_RECORDS.every(
      (entry) =>
        entry.catalogLifecycle === "canonical" &&
        entry.semanticVersion === 1 &&
        entry.references.length === 0
    ),
    true
  );
});

test("registers all catalogs, the validator helper, and the schema exactly once", async () => {
  const indexSource = await readText(INDEX_PATH);
  const checksStart = indexSource.indexOf("const checks = [");
  const checksEnd = indexSource.indexOf("\n];", checksStart);
  const checksSource = indexSource.slice(checksStart, checksEnd);
  const helperStart = indexSource.indexOf(
    "async function validateLethalProcessDefinitionsAgainstDependencies()"
  );
  const helperEnd = indexSource.indexOf("\n}\n\n", helperStart) + 2;
  const helperSource = indexSource.slice(helperStart, helperEnd);
  const schemaTestSource = await readText(SCHEMA_TEST_PATH);

  assert.ok(checksStart >= 0 && checksEnd > checksStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart + 1);
  assert.equal(
    indexSource.match(
      /import \{ validateLethalProcessDefinitionCatalogs \} from "\.\/lethal-process-definitions\.mjs";/g
    )?.length,
    1
  );
  for (const relativePath of CATALOG_PATHS) {
    const pattern = new RegExp(relativePath.replaceAll("/", "\\/"), "g");
    assert.equal(checksSource.match(pattern)?.length, 1, relativePath);
    assert.equal(helperSource.match(pattern)?.length, 1, relativePath);
  }
  assert.equal(
    indexSource.match(/validateLethalProcessDefinitionCatalogs\(\{/g)?.length,
    1
  );
  assert.equal(
    indexSource.match(
      /await validateLethalProcessDefinitionsAgainstDependencies\(\);/g
    )?.length,
    1
  );
  assert.equal(
    helperSource.match(
      /packages\/schemas\/game\/lethal-process-definition\.schema\.json/g
    )?.length,
    1
  );
  assert.equal(
    schemaTestSource.match(
      /packages\/schemas\/game\/lethal-process-definition\.schema\.json/g
    )?.length,
    1
  );
  assert.doesNotMatch(
    helperSource,
    /packages\/(?:engines|apps|shared)|apps\/|save|combat_health|items|spells|roles|services|care|death|ui|gameplay/i
  );
});

test("defines the strict draft-2020-12 wrapper, record, and reference schema", () => {
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.title, "LethalProcessDefinitionCatalog");
  assert.equal(Object.hasOwn(schema, "$id"), false);
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["ownerDomain", "records"]);
  assert.equal(schema.properties.records.minItems, 1);

  const recordSchema = schema.$defs.lethalProcessDefinition;
  assert.equal(recordSchema.additionalProperties, false);
  assert.deepEqual(recordSchema.required, [
    "id",
    "slug",
    "name",
    "definitionOwner",
    "processFamily",
    "catalogLifecycle",
    "semanticVersion",
    "summary",
    "references",
    "tags",
    "sourceAuthorityNotes",
    "notes"
  ]);
  assert.deepEqual(schema.$defs.definitionOwner.enum, [
    "hemorrhage_process",
    "airway_process",
    "respiratory_process",
    "thermal_process"
  ]);
  assert.deepEqual(schema.$defs.processFamily.enum, [
    "hemorrhage",
    "airway",
    "respiratory",
    "thermal"
  ]);
  assert.deepEqual(schema.$defs.catalogLifecycle.enum, [
    "planned",
    "canonical",
    "retired"
  ]);
  assert.deepEqual(schema.$defs.referenceRelation.enum, [
    "causal_source",
    "contributing_source",
    "coexisting_process",
    "transition_source"
  ]);
  assert.deepEqual(schema.$defs.referenceTargetDomain.enum, [
    "injury",
    "body_state",
    "hazard",
    "environment",
    "poison",
    "respiratory_process",
    "magic",
    "lethal_process"
  ]);
});

test("rejects missing, extra, malformed, and unrecognized catalogs", async (t) => {
  const cases = [
    [
      "missing catalog",
      (value) => value.catalogs.pop(),
      /catalog paths must be exactly/
    ],
    [
      "duplicate catalog",
      (value) => value.catalogs.push(structuredClone(value.catalogs[0])),
      /duplicate lethal-process catalog path/
    ],
    [
      "unrecognized catalog",
      (value) => {
        value.catalogs[0].relativePath =
          "packages/content/base/game/lethal_process_other_definitions.json";
      },
      /unrecognized lethal-process catalog path/
    ],
    [
      "extra wrapper field",
      (value) => {
        value.catalogs[0].wrapper.version = 1;
      },
      /unsupported property 'version'/
    ],
    [
      "missing wrapper field",
      (value) => {
        delete value.catalogs[0].wrapper.ownerDomain;
      },
      /missing required property 'ownerDomain'/
    ],
    [
      "non-array records",
      (value) => {
        value.catalogs[0].wrapper.records = {};
      },
      /wrapper\.records must be type array/
    ]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects missing and unsupported record or reference fields", async (t) => {
  const cases = [
    [
      "missing record field",
      (value) => {
        delete value.catalogs[0].wrapper.records[0].summary;
      },
      /missing required property 'summary'/
    ],
    [
      "extra record field",
      (value) => {
        value.catalogs[0].wrapper.records[0].alias = "bleeding";
      },
      /unsupported property 'alias'/
    ],
    [
      "missing reference field",
      (value) => {
        value.catalogs[0].wrapper.records[0].references = [
          {
            relation: "causal_source",
            targetDomain: "injury"
          }
        ];
      },
      /missing required property 'targetId'/
    ],
    [
      "extra reference field",
      (value) => {
        value.catalogs[0].wrapper.records[0].references = [
          {
            relation: "causal_source",
            targetDomain: "injury",
            targetId: "combat_injury.cut",
            notes: "not allowed"
          }
        ];
      },
      /unsupported property 'notes'/
    ]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("enforces path, owner, id segment, family, and slug coherence", async (t) => {
  const cases = [
    [
      "wrapper owner",
      (value) => {
        value.catalogs[0].wrapper.ownerDomain = "airway_process";
      },
      /wrapper\.ownerDomain must be 'hemorrhage_process'/
    ],
    [
      "record owner",
      (value) => {
        value.catalogs[0].wrapper.records[0].definitionOwner =
          "airway_process";
      },
      /definitionOwner must match/
    ],
    [
      "record family",
      (value) => {
        value.catalogs[0].wrapper.records[0].processFamily = "airway";
      },
      /processFamily must be 'hemorrhage'/
    ],
    [
      "id owner segment",
      (value) => {
        const selected = value.catalogs[0].wrapper.records[0];
        selected.id = "lethal_process.airway.external_hemorrhage";
      },
      /id owner segment must be 'hemorrhage'/
    ],
    [
      "slug",
      (value) => {
        value.catalogs[0].wrapper.records[0].slug = "hemorrhage_external";
      },
      /slug must match id suffix/
    ]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects global id, slug, and internal-name collisions", async (t) => {
  const cases = [
    [
      "id",
      (value) => {
        value.catalogs[0].wrapper.records[1].id =
          value.catalogs[0].wrapper.records[0].id;
        value.catalogs[0].wrapper.records[1].slug =
          value.catalogs[0].wrapper.records[0].slug;
      }
    ],
    [
      "slug",
      (value) => {
        value.catalogs[0].wrapper.records[1].slug =
          value.catalogs[0].wrapper.records[0].slug;
      }
    ],
    [
      "name",
      (value) => {
        value.catalogs[0].wrapper.records[1].name =
          value.catalogs[0].wrapper.records[0].name;
      }
    ]
  ];
  for (const [name, mutate] of cases) {
    await t.test(name, () => expectFailure(mutate, /duplicate|inventory|slug/));
  }
});

test("enforces canonical lifecycle and semantic version one for the live inventory", async (t) => {
  for (const [name, field, value, expected] of [
    ["planned lifecycle", "catalogLifecycle", "planned", /must be 'canonical'/],
    ["retired lifecycle", "catalogLifecycle", "retired", /must be 'canonical'/],
    ["zero version", "semanticVersion", 0, /integer of at least 1/],
    ["future version", "semanticVersion", 2, /semanticVersion must be 1/]
  ]) {
    await t.test(name, () =>
      expectFailure(
        (validationInput) => {
          validationInput.catalogs[0].wrapper.records[0][field] = value;
        },
        expected
      )
    );
  }
});

test("does not mutate catalogs, schema, or reference authority", () => {
  const validationInput = input({
    canonicalReferenceIdsByTargetDomain: {
      injury: ["combat_injury.cut"]
    }
  });
  const before = structuredClone(validationInput);
  validateLethalProcessDefinitionCatalogs(validationInput);
  assert.deepEqual(validationInput, before);
});

test("accepts an injected canonical reference fixture without changing live references", () => {
  const validationInput = input({
    canonicalReferenceIdsByTargetDomain: {
      injury: ["combat_injury.cut"],
      hazard: ["hazard_profile.submersion"],
      magic: ["spell.water.healing.mend"]
    }
  });
  record(
    validationInput,
    "lethal_process.hemorrhage.external_hemorrhage"
  ).references = [
    {
      relation: "causal_source",
      targetDomain: "injury",
      targetId: "combat_injury.cut"
    },
    {
      relation: "contributing_source",
      targetDomain: "hazard",
      targetId: "hazard_profile.submersion"
    },
    {
      relation: "transition_source",
      targetDomain: "magic",
      targetId: "spell.water.healing.mend"
    }
  ];
  assert.equal(
    validateLethalProcessDefinitionCatalogs(validationInput).ok,
    true
  );
  assert.equal(
    liveCatalogs.every((entry) =>
      entry.wrapper.records.every((item) => item.references.length === 0)
    ),
    true
  );
});

test("rejects unresolved, invalid, mismatched, and duplicate references", async (t) => {
  const withReference = (value, reference) => {
    value.catalogs[0].wrapper.records[0].references = [reference];
  };
  const validReference = {
    relation: "causal_source",
    targetDomain: "injury",
    targetId: "combat_injury.cut"
  };
  const cases = [
    [
      "unresolved",
      (value) => withReference(value, validReference),
      /unresolved injury reference/
    ],
    [
      "invalid relation",
      (value) =>
        withReference(value, { ...validReference, relation: "treatment_source" }),
      /relation must be one of/
    ],
    [
      "invalid domain",
      (value) =>
        withReference(value, { ...validReference, targetDomain: "care" }),
      /targetDomain must be one of/
    ],
    [
      "mismatched pattern",
      (value) => {
        withReference(value, {
          ...validReference,
          targetId: "body_state.fatigue"
        });
        value.canonicalReferenceIdsByTargetDomain = {
          injury: ["combat_injury.cut"]
        };
      },
      /does not match injury target id pattern/
    ],
    [
      "duplicate",
      (value) => {
        value.catalogs[0].wrapper.records[0].references = [
          validReference,
          structuredClone(validReference)
        ];
      },
      /must contain unique items/
    ]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("recursively rejects mutable, mechanical, diagnosis, care, persistence, death, UI, and gameplay fields", async (t) => {
  for (const forbiddenField of [
    "stage",
    "damageFormula",
    "diagnosis",
    "careRequirement",
    "occurrence",
    "saveState",
    "death",
    "uiState",
    "gameplay"
  ]) {
    await t.test(forbiddenField, () =>
      expectFailure(
        (value) => {
          value.catalogs[0].wrapper.records[0].references = [
            {
              relation: "causal_source",
              targetDomain: "injury",
              targetId: "combat_injury.cut",
              nested: { [forbiddenField]: true }
            }
          ];
        },
        /unsupported property 'nested'/
      )
    );
  }
});

test("keeps the validator pure and free of filesystem, runtime, app, save, or dependency imports", async () => {
  const source = await readText(VALIDATOR_PATH);
  assert.match(
    source,
    /export function validateLethalProcessDefinitionCatalogs/
  );
  assert.doesNotMatch(source, /^\s*import\s/m);
  assert.doesNotMatch(
    source,
    /readFile|existsSync|readdir|node:fs|packages\/engines|packages\/shared|apps\/|game-engine|rpg-ui|save\/|dependency/i
  );
});

test("keeps current combat-health authority separate and unchanged in meaning", async () => {
  for (const relativePath of COMBAT_HEALTH_PATHS) {
    const source = await readText(relativePath);
    assert.doesNotMatch(source, /lethal[_-]process|lethal_process\./i);
  }
  const vocabulary = await readJson(COMBAT_HEALTH_PATHS[0]);
  assert.deepEqual(
    vocabulary.records.map((entry) => entry.id).sort(),
    ["combat_status.bind", "combat_status.stagger"]
  );
});

test("has no lethal-process import or reference in production engine or app source", async () => {
  const sourceFiles = [
    ...(await productionSourceFiles("packages/engines")),
    ...(await productionSourceFiles("apps"))
  ];
  for (const sourcePath of sourceFiles) {
    const source = await readFile(sourcePath, "utf8");
    assert.doesNotMatch(
      source,
      /lethal[_-]process|lethal_process\./i,
      path.relative(ROOT, sourcePath)
    );
  }
});
