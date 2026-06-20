import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateKnowledgeDomainRegistry } from "../../tools/content-lint/knowledge-domain-registry.mjs";

const ROOT = process.cwd();
const REGISTRY_PATH = "packages/content/base/player/knowledge_domain_registry.json";
const EXCLUDED_COLLECTION_SEGMENTS = new Set([
  ".cache",
  "build",
  "dist",
  "docs",
  "generated",
  "node_modules",
  "runtime",
  "schemas",
  "temp",
  "tmp",
  "vendor"
]);

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

async function deriveCollectionIds() {
  const baseRoot = path.join(ROOT, "packages/content/base");
  const ids = new Set();

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const lowerName = entry.name.toLowerCase();
      if (
        EXCLUDED_COLLECTION_SEGMENTS.has(lowerName) ||
        lowerName.endsWith(".generated.json")
      ) {
        continue;
      }

      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".json") {
        ids.add(
          path
            .relative(baseRoot, fullPath)
            .slice(0, -5)
            .split(path.sep)
            .join(".")
        );
      }
    }
  }

  await visit(baseRoot);
  return ids;
}

const registryWrapper = await readJson(REGISTRY_PATH);
const recordSchema = await readJson("packages/schemas/player/knowledge-domain-registry.schema.json");
const legacyPolicyWrapper = await readJson("packages/content/base/player/knowledge_domains.json");
const skillsWrapper = await readJson("packages/content/base/player/skills.json");
const snippetSchema = await readJson("packages/schemas/player/knowledge_snippet.schema.json");
const availableBaseCollectionIds = await deriveCollectionIds();

const snippetVocabularies = {
  subjectTypes: snippetSchema.properties.subjectType.enum,
  categories: snippetSchema.properties.category.enum,
  sourceTypes: snippetSchema.properties.discoverySources.items.properties.sourceType.enum
};

function makeInput() {
  return {
    relativePath: REGISTRY_PATH,
    wrapper: structuredClone(registryWrapper),
    recordSchema: structuredClone(recordSchema),
    legacyPolicyRecords: structuredClone(legacyPolicyWrapper.records),
    skills: structuredClone(skillsWrapper.records),
    availableBaseCollectionIds: new Set(availableBaseCollectionIds),
    snippetVocabularies: structuredClone(snippetVocabularies)
  };
}

function validate(input = makeInput()) {
  return validateKnowledgeDomainRegistry(input);
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

test("accepts the current registry", () => {
  assert.equal(validate(), true);
});

test("accepts the exact active Flora trial policy reference", () => {
  const input = makeInput();
  const flora = input.wrapper.records.find(
    (record) => record.id === "knowledge_domain.flora"
  );
  assert.equal(
    flora.trialPolicyRef,
    "knowledge_trial_policy.flora_tier_1"
  );
  assert.equal(validate(input), true);
});

test("accepts General Lore constrained custom support", () => {
  const input = makeInput();
  const generalLore = input.wrapper.records.find((record) => record.id === "knowledge_domain.general_lore");
  assert.ok(generalLore.canonicalSubjectTypes.includes("custom"));
  assert.equal(validate(input), true);
});

test("accepts Arcane Lore as planned without a legacy policy", () => {
  const input = makeInput();
  const arcaneLore = input.wrapper.records.find((record) => record.id === "knowledge_domain.arcane_lore");
  assert.equal(arcaneLore.status, "planned");
  assert.equal(input.legacyPolicyRecords.some((record) => record.id === arcaneLore.id), false);
  assert.equal(validate(input), true);
});

test("accepts active Religion with live hotspot and sacred-site registry alignment", () => {
  const input = makeInput();
  const religion = input.wrapper.records.find(
    (record) => record.id === "knowledge_domain.religion"
  );

  assert.equal(religion.status, "active");
  assert.ok(religion.canonicalSubjectTypes.includes("religion"));
  assert.ok(religion.canonicalSubjectTypes.includes("deity"));
  assert.ok(religion.canonicalSubjectTypes.includes("religious_hotspot"));
  assert.ok(religion.canonicalSubjectTypes.includes("sacred_site"));
  assert.ok(religion.relatedContentCollections.includes("world.religions"));
  assert.ok(
    religion.relatedContentCollections.includes("world.religious_hotspots")
  );
  assert.ok(religion.relatedContentCollections.includes("world.sacred_sites"));
  assert.equal(religion.trialPolicyRef, null);
  assert.equal(religion.completionPolicyRef, null);
  assert.equal(religion.visibilityPolicyRef, null);
  assert.equal(validate(input), true);
});

test("accepts religious hotspot vocabulary in an in-memory Religion fixture", () => {
  const input = makeInput();
  const religion = input.wrapper.records.find(
    (record) => record.id === "knowledge_domain.religion"
  );

  assert.ok(
    input.recordSchema.properties.canonicalSubjectTypes.items.enum.includes(
      "religious_hotspot"
    )
  );
  assert.equal(validate(input), true);
});

test("accepts live sacred-site vocabulary in Religion", () => {
  const input = makeInput();
  const religion = input.wrapper.records.find(
    (record) => record.id === "knowledge_domain.religion"
  );

  assert.ok(
    input.recordSchema.properties.canonicalSubjectTypes.items.enum.includes(
      "sacred_site"
    )
  );
  assert.equal(validate(input), true);
});

test("keeps live Religion aligned without a sacred-site-specific domain", () => {
  const religion = registryWrapper.records.find(
    (record) => record.id === "knowledge_domain.religion"
  );

  assert.ok(religion.canonicalSubjectTypes.includes("religion"));
  assert.ok(religion.canonicalSubjectTypes.includes("deity"));
  assert.ok(religion.canonicalSubjectTypes.includes("religious_hotspot"));
  assert.ok(religion.canonicalSubjectTypes.includes("sacred_site"));
  assert.ok(religion.relatedContentCollections.includes("world.religions"));
  assert.ok(religion.relatedContentCollections.includes("world.religious_hotspots"));
  assert.ok(religion.relatedContentCollections.includes("world.sacred_sites"));
  assert.equal(religion.trialPolicyRef, null);
  assert.equal(religion.completionPolicyRef, null);
  assert.equal(religion.visibilityPolicyRef, null);
  assert.ok(
    religion.schemaGapNotes.every(
      (note) =>
        !note.includes("sacred-site subject types remain absent") &&
        !note.includes("active religious_hotspot records; settlement")
    )
  );
  assert.equal(
    registryWrapper.records.some(
      (record) => record.id === "knowledge_domain.sacred_sites"
    ),
    false
  );
});

test("rejects religious hotspot registry vocabulary without snippet schema support", () => {
  expectFailure(
    (input) => {
      const religion = input.wrapper.records.find(
        (record) => record.id === "knowledge_domain.religion"
      );
      input.snippetVocabularies.subjectTypes =
        input.snippetVocabularies.subjectTypes.filter(
          (subjectType) => subjectType !== "religious_hotspot"
        );
    },
    /canonicalSubjectTypes 'religious_hotspot' is absent from the current snippet schema/
  );
});

test("keeps live Religion policy refs null without a hotspot-specific domain", () => {
  const religion = registryWrapper.records.find(
    (record) => record.id === "knowledge_domain.religion"
  );

  assert.ok(religion.canonicalSubjectTypes.includes("religion"));
  assert.ok(religion.canonicalSubjectTypes.includes("deity"));
  assert.ok(religion.canonicalSubjectTypes.includes("religious_hotspot"));
  assert.ok(
    religion.relatedContentCollections.includes("world.religious_hotspots")
  );
  assert.equal(religion.trialPolicyRef, null);
  assert.equal(religion.completionPolicyRef, null);
  assert.equal(religion.visibilityPolicyRef, null);
  assert.equal(
    registryWrapper.records.some(
      (record) => record.id === "knowledge_domain.religious_hotspots"
    ),
    false
  );
});

test("allows a broad registry id without a skill knowledgeDomainId reference", () => {
  const input = makeInput();
  const domainId = "knowledge_domain.arcane_lore";
  const referencingSkills = input.skills.filter((skill) => skill.knowledgeDomainId === domainId);
  assert.ok(referencingSkills.length > 0);
  for (const skill of referencingSkills) {
    delete skill.knowledgeDomainId;
  }
  assert.equal(input.skills.some((skill) => skill.knowledgeDomainId === domainId), false);
  assert.equal(validate(input), true);
});

test("allows structurally valid non-alphabetic authored record order", () => {
  const input = makeInput();
  input.wrapper.records.reverse();
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

test("rejects extra top-level wrapper keys", () => {
  expectFailure(
    (input) => {
      input.wrapper.version = 1;
    },
    /wrapper must contain exactly one top-level key: records/
  );
});

test("rejects a non-array records wrapper", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = {};
    },
    /records must be an array/
  );
});

test("rejects an empty records array", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = [];
    },
    /records must be non-empty/
  );
});

test("rejects a record that fails structural validation", () => {
  expectFailure(
    (input) => {
      delete input.wrapper.records[0].name;
    },
    /structural validation failed: records\[0\] is missing required property 'name'/
  );
});

test("rejects unsupported registry schema keywords", () => {
  expectFailure(
    (input) => {
      input.recordSchema.description = "unsupported by the narrow adapter";
    },
    /schema \$ uses unsupported keyword 'description'/
  );
});

test("rejects unsupported registry schema types", () => {
  expectFailure(
    (input) => {
      input.recordSchema.properties.name.type = "date";
    },
    /schema \$\.properties\.name\.type declares unsupported type 'date'/
  );
});

test("rejects duplicate ids", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[1].id = input.wrapper.records[0].id;
    },
    /duplicate domain id 'knowledge_domain\.flora'/
  );
});

test("rejects duplicate slugs", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[1].slug = input.wrapper.records[0].slug;
    },
    /duplicate domain slug 'flora'/
  );
});

test("rejects id and slug mismatch", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].slug = "botany";
    },
    /id must equal knowledge_domain\.botany/
  );
});

test("rejects a source type not covered by a declared family", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].supportedDiscoverySourceFamilies =
        input.wrapper.records[0].supportedDiscoverySourceFamilies.filter(
          (family) => family !== "event_record"
        );
    },
    /source type 'quest_event' requires family 'event_record'/
  );
});

test("rejects a declared family with no matching source type", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].supportedDiscoverySourceTypes =
        input.wrapper.records[0].supportedDiscoverySourceTypes.filter(
          (sourceType) => !["quest_event", "chronicle_record"].includes(sourceType)
        );
    },
    /source family 'event_record' has no matching source type/
  );
});

test("rejects mismatched custom source family and source type declarations", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].supportedDiscoverySourceFamilies.push("custom");
    },
    /custom source family and source type must appear together/
  );
});

test("rejects unresolved related skill ids", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].relatedSkillIds[0] = "skill.knowledge.missing";
    },
    /relatedSkillIds 'skill\.knowledge\.missing' is missing/
  );
});

test("rejects unresolved related magic-school ids", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[3].relatedMagicSchoolIds[0] = "skill.magic.school.missing";
    },
    /relatedMagicSchoolIds 'skill\.magic\.school\.missing' is missing/
  );
});

test("rejects a magic-school reference with the wrong id prefix", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[3].relatedMagicSchoolIds[0] = "skill.knowledge.arcane_lore";
    },
    /relatedMagicSchoolIds\[0\] must match pattern/
  );
});

test("rejects a referenced magic-school skill with the wrong category", () => {
  expectFailure(
    (input) => {
      const skill = input.skills.find((record) => record.id === "skill.magic.school.elemental");
      skill.category = "knowledge";
    },
    /must reference category 'magic'/
  );
});

test("rejects a referenced magic-school skill without a school domain", () => {
  expectFailure(
    (input) => {
      const skill = input.skills.find((record) => record.id === "skill.magic.school.elemental");
      skill.domain = "elemental";
    },
    /must reference a school\.\* domain/
  );
});

test("rejects a spell school slug as a magic-school id", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[3].relatedMagicSchoolIds[0] = "elemental";
    },
    /relatedMagicSchoolIds\[0\] must match pattern/
  );
});

test("rejects overlap between related skill arrays", () => {
  expectFailure(
    (input) => {
      const arcaneLore = input.wrapper.records.find(
        (record) => record.id === "knowledge_domain.arcane_lore"
      );
      arcaneLore.relatedSkillIds.push("skill.magic.school.elemental");
    },
    /cannot appear in both related skill arrays/
  );
});

test("rejects unresolved content collections", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].relatedContentCollections[0] = "world.missing";
    },
    /relatedContentCollections 'world\.missing' is missing/
  );
});

test("rejects broad registry self-reference", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].relatedContentCollections[0] = "player.knowledge_domain_registry";
    },
    /cannot self-reference/
  );
});

test("rejects trial policy references on non-active and Arcane domains", async (t) => {
  for (const status of ["planned", "draft", "deferred"]) {
    await t.test(status, () => {
      expectFailure(
        (input) => {
          const flora = input.wrapper.records.find(
            (record) => record.id === "knowledge_domain.flora"
          );
          flora.status = status;
        },
        /trialPolicyRef requires an active non-Arcane domain/
      );
    });
  }

  await t.test("inactive", () => {
    expectFailure(
      (input) => {
        const flora = input.wrapper.records.find(
          (record) => record.id === "knowledge_domain.flora"
        );
        flora.status = "inactive";
      },
      /structural validation failed: records\[0\]\.status must be one of the schema enum values/
    );
  });

  await t.test("Arcane Lore", () => {
    expectFailure(
      (input) => {
        const flora = input.wrapper.records.find(
          (record) => record.id === "knowledge_domain.flora"
        );
        const arcaneLore = input.wrapper.records.find(
          (record) => record.id === "knowledge_domain.arcane_lore"
        );
        flora.trialPolicyRef = null;
        arcaneLore.status = "active";
        arcaneLore.trialPolicyRef =
          "knowledge_trial_policy.arcane_lore_tier_1";
      },
      /trialPolicyRef requires an active non-Arcane domain/
    );
  });
});

test("continues rejecting non-null completion and visibility policy references", () => {
  for (const [field, value] of [
    ["completionPolicyRef", "knowledge_completion_policy.flora"],
    ["visibilityPolicyRef", "knowledge_visibility_policy.flora"]
  ]) {
    expectFailure(
      (input) => {
        input.wrapper.records[0][field] = value;
      },
      new RegExp(`${field} must remain null`)
    );
  }
});

test("rejects unjustified custom subject, category, source, and owner usage", async (t) => {
  const cases = [
    {
      name: "subject",
      mutate(record) {
        record.canonicalSubjectTypes.push("custom");
      }
    },
    {
      name: "category",
      mutate(record) {
        record.supportedSnippetCategories.push("custom");
      }
    },
    {
      name: "source family",
      mutate(record) {
        record.supportedDiscoverySourceFamilies.push("custom");
        record.supportedDiscoverySourceTypes.push("custom");
      }
    },
    {
      name: "source type",
      mutate(record) {
        record.supportedDiscoverySourceFamilies.push("custom");
        record.supportedDiscoverySourceTypes.push("custom");
      }
    },
    {
      name: "evidence owner",
      mutate(record) {
        record.defaultEvidenceOwnerScopes.push("custom");
      }
    }
  ];

  for (const customCase of cases) {
    await t.test(customCase.name, () => {
      expectFailure(
        (input) => {
          const record = input.wrapper.records[0];
          record.schemaGapNotes = [];
          record.notes = [];
          customCase.mutate(record);
        },
        /custom usage requires schemaGapNotes or notes containing 'custom'/
      );
    });
  }
});

test("rejects registry subject vocabulary absent from the snippet schema", () => {
  expectFailure(
    (input) => {
      input.snippetVocabularies.subjectTypes =
        input.snippetVocabularies.subjectTypes.filter(
          (subjectType) => subjectType !== "deity"
        );
    },
    /canonicalSubjectTypes 'deity' is absent from the current snippet schema on record knowledge_domain\.religion/
  );
});

test("rejects a legacy policy id absent from the broad registry", () => {
  expectFailure(
    (input) => {
      input.legacyPolicyRecords[0].id = "knowledge_domain.missing";
    },
    /knowledge_domains\.json id 'knowledge_domain\.missing' is absent from the broad registry/
  );
});

test("rejects a skill knowledgeDomainId absent from the broad registry", () => {
  expectFailure(
    (input) => {
      input.skills[0].knowledgeDomainId = "knowledge_domain.missing";
    },
    /skills\.json knowledgeDomainId 'knowledge_domain\.missing' is absent from the broad registry/
  );
});

test("rejects legacy identification-policy fields on broad records", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[0].supportWeights = {
        domainKnowledge: 1,
        generalLore: 0,
        spotting: 0
      };
    },
    /structural validation failed: records\[0\] has unsupported property 'supportWeights'/
  );
});
