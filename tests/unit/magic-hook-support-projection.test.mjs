import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMagicHookSupportProjection
} from "../../packages/engines/game-engine/src/index.ts";
import {
  AUTHORED_SPELL_HOOK_SUPPORT
} from "../../packages/shared/types/src/spell-hook-support.js";

async function loadSpellRecords() {
  const raw = await readFile("packages/content/base/player/spells.json", "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function uniqueAuthoredHookIds(spells) {
  return {
    resolutionHookIds: [
      ...new Set(spells.flatMap((spell) => spell.resolutionHooks ?? []))
    ],
    itemGenerationHookIds: [
      ...new Set(
        spells.flatMap((spell) =>
          (spell.itemGenerationHooks ?? []).map((hook) => hook.generatedItemId)
        )
      )
    ]
  };
}

test("authored hook support projects the audited inventory without implying execution", async () => {
  const spells = await loadSpellRecords();
  const hookIds = uniqueAuthoredHookIds(spells);

  const projection = buildMagicHookSupportProjection({
    ...hookIds,
    hookSupport: AUTHORED_SPELL_HOOK_SUPPORT
  });

  assert.equal(projection.allHooksSupported, false);
  assert.equal(projection.hooks.length, 57);
  assert.equal(projection.blockingHooks.length, 28);
  assert.deepEqual(
    projection.hooks.reduce((counts, hook) => {
      counts[hook.classification] = (counts[hook.classification] ?? 0) + 1;
      return counts;
    }, {}),
    {
      runtime: 11,
      classifier: 18,
      deferred: 28
    }
  );
  assert.equal(
    projection.hooks.filter((hook) => hook.sourceField === "resolutionHooks").length,
    56
  );
  assert.deepEqual(
    projection.hooks.find((hook) => hook.hookId === "generated_item.druidic.berry"),
    {
      hookId: "generated_item.druidic.berry",
      sourceField: "itemGenerationHooks",
      classification: "deferred",
      classificationAuthority: "deferredItemGenerationHookIds",
      readinessEffect: "blocking",
      executable: false,
      blockerReason: "deferred_hook"
    }
  );
  assert.equal(projection.hooks.every((hook) => hook.executable === false), true);
});

test("projection preserves the explicit six-class precedence chain", () => {
  const projection = buildMagicHookSupportProjection({
    resolutionHookIds: [
      "hook.map",
      "hook.runtime",
      "hook.classifier",
      "hook.supported",
      "hook.deferred",
      "hook.unsupported",
      "hook.unknown"
    ],
    hookSupport: {
      resolutionHooks: {
        "hook.map": "unsupported"
      },
      runtimeResolutionHooks: ["hook.map", "hook.runtime"],
      classifierResolutionHooks: [
        "hook.map",
        "hook.runtime",
        "hook.classifier"
      ],
      supportedResolutionHooks: [
        "hook.map",
        "hook.runtime",
        "hook.classifier",
        "hook.supported"
      ],
      deferredResolutionHooks: [
        "hook.map",
        "hook.runtime",
        "hook.classifier",
        "hook.supported",
        "hook.deferred"
      ],
      unsupportedResolutionHooks: [
        "hook.map",
        "hook.runtime",
        "hook.classifier",
        "hook.supported",
        "hook.deferred",
        "hook.unsupported"
      ]
    }
  });

  assert.deepEqual(projection.hooks, [
    {
      hookId: "hook.map",
      sourceField: "resolutionHooks",
      classification: "unsupported",
      classificationAuthority: "resolutionHooks",
      readinessEffect: "blocking",
      executable: false,
      blockerReason: "unsupported_hook"
    },
    {
      hookId: "hook.runtime",
      sourceField: "resolutionHooks",
      classification: "runtime",
      classificationAuthority: "runtimeResolutionHooks",
      readinessEffect: "supported",
      executable: false
    },
    {
      hookId: "hook.classifier",
      sourceField: "resolutionHooks",
      classification: "classifier",
      classificationAuthority: "classifierResolutionHooks",
      readinessEffect: "supported",
      executable: false
    },
    {
      hookId: "hook.supported",
      sourceField: "resolutionHooks",
      classification: "supported",
      classificationAuthority: "supportedResolutionHooks",
      readinessEffect: "supported",
      executable: false
    },
    {
      hookId: "hook.deferred",
      sourceField: "resolutionHooks",
      classification: "deferred",
      classificationAuthority: "deferredResolutionHooks",
      readinessEffect: "blocking",
      executable: false,
      blockerReason: "deferred_hook"
    },
    {
      hookId: "hook.unsupported",
      sourceField: "resolutionHooks",
      classification: "unsupported",
      classificationAuthority: "unsupportedResolutionHooks",
      readinessEffect: "blocking",
      executable: false,
      blockerReason: "unsupported_hook"
    },
    {
      hookId: "hook.unknown",
      sourceField: "resolutionHooks",
      classification: "unknown",
      classificationAuthority: "unknown_fallback",
      readinessEffect: "blocking",
      executable: false,
      blockerReason: "unknown_hook"
    }
  ]);
  assert.deepEqual(
    projection.blockingHooks.map((hook) => hook.hookId),
    ["hook.map", "hook.deferred", "hook.unsupported", "hook.unknown"]
  );
});

test("item-generation projection reports item policy authority separately", () => {
  const projection = buildMagicHookSupportProjection({
    itemGenerationHookIds: [
      "generated_item.map",
      "generated_item.runtime",
      "generated_item.unknown"
    ],
    hookSupport: {
      itemGenerationHooks: {
        "generated_item.map": "supported"
      },
      runtimeItemGenerationHookIds: [
        "generated_item.map",
        "generated_item.runtime"
      ],
      deferredItemGenerationHookIds: [
        "generated_item.map",
        "generated_item.runtime"
      ]
    }
  });

  assert.deepEqual(
    projection.hooks.map((hook) => ({
      hookId: hook.hookId,
      sourceField: hook.sourceField,
      classification: hook.classification,
      classificationAuthority: hook.classificationAuthority,
      readinessEffect: hook.readinessEffect,
      executable: hook.executable,
      blockerReason: hook.blockerReason
    })),
    [
      {
        hookId: "generated_item.map",
        sourceField: "itemGenerationHooks",
        classification: "supported",
        classificationAuthority: "itemGenerationHooks",
        readinessEffect: "supported",
        executable: false,
        blockerReason: undefined
      },
      {
        hookId: "generated_item.runtime",
        sourceField: "itemGenerationHooks",
        classification: "runtime",
        classificationAuthority: "runtimeItemGenerationHookIds",
        readinessEffect: "supported",
        executable: false,
        blockerReason: undefined
      },
      {
        hookId: "generated_item.unknown",
        sourceField: "itemGenerationHooks",
        classification: "unknown",
        classificationAuthority: "unknown_fallback",
        readinessEffect: "blocking",
        executable: false,
        blockerReason: "unknown_hook"
      }
    ]
  );
});

test("projection is deterministic, preserves hook occurrence order, and does not mutate inputs", () => {
  const params = {
    resolutionHookIds: [
      " damage.magic ",
      null,
      "damage.magic",
      "",
      42,
      "damage.future.unmapped"
    ],
    itemGenerationHookIds: new Set([
      "generated_item.druidic.berry"
    ]),
    hookSupport: {
      ...AUTHORED_SPELL_HOOK_SUPPORT,
      supportedResolutionHooks: ["spell.fixture.supported"]
    }
  };
  const before = {
    resolutionHookIds: [...params.resolutionHookIds],
    itemGenerationHookIds: [...params.itemGenerationHookIds],
    hookSupport: JSON.stringify(params.hookSupport)
  };

  const first = buildMagicHookSupportProjection(params);
  const second = buildMagicHookSupportProjection(params);

  assert.deepEqual(first, second);
  assert.deepEqual(
    first.hooks.map((hook) => hook.hookId),
    [
      "damage.magic",
      "damage.magic",
      "damage.future.unmapped",
      "generated_item.druidic.berry"
    ]
  );
  assert.deepEqual(
    first.hooks.find((hook) => hook.hookId === "damage.future.unmapped"),
    {
      hookId: "damage.future.unmapped",
      sourceField: "resolutionHooks",
      classification: "unknown",
      classificationAuthority: "unknown_fallback",
      readinessEffect: "blocking",
      executable: false,
      blockerReason: "unknown_hook"
    }
  );
  assert.deepEqual(params.resolutionHookIds, before.resolutionHookIds);
  assert.deepEqual([...params.itemGenerationHookIds], before.itemGenerationHookIds);
  assert.equal(JSON.stringify(params.hookSupport), before.hookSupport);
});
