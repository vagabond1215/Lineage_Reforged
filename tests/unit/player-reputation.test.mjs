import test from "node:test";
import assert from "node:assert/strict";
import {
  applyReputationAward,
  grantSettlementGeographicKnowledge,
  loadReputationBalanceRule,
  normalizePlayerGeographicKnowledge,
  resolveScopedReputation,
  syncPlayerReputation
} from "../../packages/engines/player-engine/src/reputation.ts";

function createEmptyReputation() {
  return {
    fame: [],
    notoriety: [],
    notorietyEvents: []
  };
}

function resolveReputation(reputation) {
  return resolveScopedReputation({ reputation });
}

function createFameAward(overrides = {}) {
  return {
    axis: "fame",
    branchId: "civic",
    directEarnedScope: "local",
    baseValue: 4,
    originSettlementIds: ["settlement.aurelis"],
    ...overrides
  };
}

function createNotorietyAward(overrides = {}) {
  return {
    axis: "notoriety",
    categoryId: "theft",
    severity: "minor",
    modifiers: [],
    directEarnedScope: "local",
    baseValue: 4,
    originSettlementIds: ["settlement.aurelis"],
    exposureRequirement: "witnessed_or_reported",
    attributionRequired: true,
    allowCredibleLink: false,
    ...overrides
  };
}

function meaningfulFameEvaluation(overrides = {}) {
  return {
    meaningful: true,
    exposureSatisfied: true,
    attributionSatisfied: true,
    sociallyValued: true,
    tick: 10,
    ...overrides
  };
}

function meaningfulNotorietyEvaluation(overrides = {}) {
  return {
    meaningful: true,
    exposureSatisfied: true,
    attributionSatisfied: true,
    condemnedAct: true,
    credibleLinkSatisfied: false,
    tick: 10,
    ...overrides
  };
}

function findResolvedFame(resolution, scope, scopeId) {
  return resolution.fame.find((entry) => entry.scope === scope && entry.scopeId === scopeId);
}

function findResolvedNotoriety(resolution, scope, scopeId) {
  return resolution.notoriety.find((entry) => entry.scope === scope && entry.scopeId === scopeId);
}

function withSuppressedWarnings(callback) {
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    return callback();
  } finally {
    console.warn = originalWarn;
  }
}

const SERIOUSNESS_ORDER = [
  "nuisance",
  "offender",
  "outlaw",
  "menace",
  "infamous",
  "atrocity_marked"
];

test("grantSettlementGeographicKnowledge adds settlement plus parent region and continent", () => {
  const entries = grantSettlementGeographicKnowledge([], "settlement.aurelis");

  assert.deepEqual(entries, [
    { scope: "continent", geographyId: "region.kaelvar", level: 1 },
    { scope: "region", geographyId: "region.verdant_thalos", level: 1 },
    { scope: "settlement", geographyId: "settlement.aurelis", level: 1 }
  ]);
});

test("normalizePlayerGeographicKnowledge rejects duplicate scope and geography pairs", () => {
  assert.throws(
    () =>
      normalizePlayerGeographicKnowledge([
        { scope: "region", geographyId: "region.verdant_thalos", level: 1 },
        { scope: "region", geographyId: "region.verdant_thalos", level: 2 }
      ]),
    /must not repeat/i
  );
});

test("fame awards require meaningful public recognition", () => {
  const denied = applyReputationAward(
    createEmptyReputation(),
    createFameAward(),
    meaningfulFameEvaluation({ exposureSatisfied: false })
  );

  assert.deepEqual(denied, createEmptyReputation());

  const granted = applyReputationAward(
    createEmptyReputation(),
    createFameAward({ branchId: "trade" }),
    meaningfulFameEvaluation()
  );

  assert.equal(granted.fame.length, 1);
  assert.deepEqual(granted.fame[0], {
    scope: "local",
    scopeId: "settlement.aurelis",
    branchId: "trade",
    earned: 4,
    currentEarned: 4,
    historical: 4,
    lastMeaningfulGainTick: 10
  });
});

test("local fame does not mint direct regional fame", () => {
  const reputation = applyReputationAward(
    createEmptyReputation(),
    createFameAward({ branchId: "folk", baseValue: 6 }),
    meaningfulFameEvaluation()
  );

  assert.equal(reputation.fame.length, 1);
  assert.equal(reputation.fame[0].scope, "local");
  assert.equal(reputation.fame.some((entry) => entry.scope === "regional"), false);
});

test("widespread local fame creates threshold regional fame without direct branch history", () => {
  let reputation = createEmptyReputation();
  reputation = applyReputationAward(
    reputation,
    createFameAward({ branchId: "civic", baseValue: 10, originSettlementIds: ["settlement.aurelis"] }),
    meaningfulFameEvaluation({ tick: 12 })
  );
  reputation = applyReputationAward(
    reputation,
    createFameAward({ branchId: "folk", baseValue: 8, originSettlementIds: ["settlement.vinecross"] }),
    meaningfulFameEvaluation({ tick: 13 })
  );

  const resolved = resolveReputation(reputation);
  const regional = findResolvedFame(resolved, "regional", "region.verdant_thalos");

  assert.ok(regional);
  assert.equal(regional.currentEarned, 0);
  assert.ok(regional.currentThreshold > 0);
  assert.equal(regional.currentTotal, regional.currentThreshold);
});

test("direct regional fame persists longer than threshold-only regional fame", () => {
  const thresholdSource = {
    reputation: {
      fame: [
        {
          scope: "local",
          scopeId: "settlement.aurelis",
          branchId: "civic",
          earned: 12,
          currentEarned: 12,
          historical: 12,
          lastMeaningfulGainTick: 1
        },
        {
          scope: "local",
          scopeId: "settlement.vinecross",
          branchId: "folk",
          earned: 12,
          currentEarned: 12,
          historical: 12,
          lastMeaningfulGainTick: 1
        }
      ],
      notoriety: [],
      notorietyEvents: []
    },
    saveMeta: {
      totalPlayTicks: 0,
      lastReputationDecayDay: 1
    }
  };
  const directSource = {
    reputation: {
      fame: [
        {
          scope: "regional",
          scopeId: "region.verdant_thalos",
          branchId: "heroic",
          earned: 12,
          currentEarned: 12,
          historical: 12,
          lastMeaningfulGainTick: 1
        }
      ],
      notoriety: [],
      notorietyEvents: []
    },
    saveMeta: {
      totalPlayTicks: 0,
      lastReputationDecayDay: 1
    }
  };

  const thresholdAfterDecay = syncPlayerReputation(thresholdSource, 5);
  const directAfterDecay = syncPlayerReputation(directSource, 5);

  const thresholdRegional = findResolvedFame(resolveReputation(thresholdAfterDecay), "regional", "region.verdant_thalos");
  const directRegional = findResolvedFame(resolveReputation(directAfterDecay), "regional", "region.verdant_thalos");

  assert.ok(thresholdRegional);
  assert.ok(directRegional);
  assert.equal(thresholdRegional.currentEarned, 0);
  assert.ok(directRegional.currentEarned > 0);
  assert.ok(directRegional.currentTotal > thresholdRegional.currentTotal);
});

test("world threshold requires multiple continents", () => {
  const oneContinent = resolveReputation({
    fame: [
      {
        scope: "continental",
        scopeId: "region.kaelvar",
        branchId: "legendary",
        earned: 20,
        currentEarned: 20,
        historical: 20,
        lastMeaningfulGainTick: 1
      }
    ],
    notoriety: [],
    notorietyEvents: []
  });

  assert.equal(Boolean(findResolvedFame(oneContinent, "world", "world")), false);

  const twoContinents = resolveReputation({
    fame: [
      {
        scope: "continental",
        scopeId: "region.kaelvar",
        branchId: "legendary",
        earned: 20,
        currentEarned: 20,
        historical: 20,
        lastMeaningfulGainTick: 1
      },
      {
        scope: "continental",
        scopeId: "region.valtherion",
        branchId: "legendary",
        earned: 20,
        currentEarned: 20,
        historical: 20,
        lastMeaningfulGainTick: 1
      }
    ],
    notoriety: [],
    notorietyEvents: []
  });

  const world = findResolvedFame(twoContinents, "world", "world");
  assert.ok(world);
  assert.ok(world.currentThreshold > 0);
});

test("fame branch catalogs stay aligned with the authored rule", () => {
  const rule = loadReputationBalanceRule();

  assert.deepEqual(rule.fameBranchValidation.local, ["civic", "folk", "trade", "martial"]);
  assert.deepEqual(rule.fameBranchValidation.regional, ["heroic", "martial", "political", "commercial"]);
  assert.deepEqual(rule.fameBranchValidation.continental, ["historical", "legendary", "political"]);
  assert.deepEqual(rule.fameBranchValidation.world, ["legendary", "mythic"]);
});

test("invalid fame branch for scope returns unchanged state", () => {
  const reputation = withSuppressedWarnings(() =>
    applyReputationAward(
      createEmptyReputation(),
      createFameAward({ branchId: "mythic", directEarnedScope: "local" }),
      meaningfulFameEvaluation({ sourceId: "quest.invalid_fame_branch" })
    )
  );

  assert.deepEqual(reputation, createEmptyReputation());
});

test("non-world awards with no origin settlements skip mutation", () => {
  const fame = withSuppressedWarnings(() =>
    applyReputationAward(
      createEmptyReputation(),
      createFameAward({ originSettlementIds: [] }),
      meaningfulFameEvaluation({ sourceId: "quest.empty_origins.fame" })
    )
  );
  assert.deepEqual(fame, createEmptyReputation());

  const notoriety = withSuppressedWarnings(() =>
    applyReputationAward(
      createEmptyReputation(),
      createNotorietyAward({ originSettlementIds: [] }),
      meaningfulNotorietyEvaluation({ sourceId: "quest.empty_origins.notoriety" })
    )
  );
  assert.deepEqual(notoriety, createEmptyReputation());
});

test("same category with different severity creates separate aggregate rows", () => {
  let reputation = createEmptyReputation();
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ severity: "minor" }),
    meaningfulNotorietyEvaluation()
  );
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ severity: "standard" }),
    meaningfulNotorietyEvaluation({ tick: 11 })
  );

  assert.equal(reputation.notoriety.length, 2);
  assert.deepEqual(
    reputation.notoriety.map((entry) => entry.severity),
    ["minor", "standard"]
  );
});

test("same category and severity with different modifier sets creates separate aggregate rows", () => {
  let reputation = createEmptyReputation();
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ modifiers: ["organized"] }),
    meaningfulNotorietyEvaluation()
  );
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ modifiers: ["public"] }),
    meaningfulNotorietyEvaluation({ tick: 11 })
  );

  assert.equal(reputation.notoriety.length, 2);
  assert.deepEqual(
    reputation.notoriety.map((entry) => entry.modifiersSignature),
    ["organized", "public"]
  );
});

test("identical modifier sets in different order normalize to one aggregate-row identity", () => {
  let reputation = createEmptyReputation();
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ modifiers: ["public", "organized"] }),
    meaningfulNotorietyEvaluation()
  );
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ modifiers: ["organized", "public"] }),
    meaningfulNotorietyEvaluation({ tick: 11 })
  );

  assert.equal(reputation.notoriety.length, 1);
  assert.equal(reputation.notoriety[0].modifiersSignature, "organized|public");
  assert.equal(reputation.notoriety[0].currentEarned, 8);
  assert.equal(reputation.notoriety[0].repeatCount, 2);
});

test("persisted serious events are not duplicated into aggregate rows", () => {
  const reputation = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({
      categoryId: "murder",
      severity: "major",
      baseValue: 12
    }),
    meaningfulNotorietyEvaluation()
  );

  assert.equal(reputation.notoriety.length, 0);
  assert.equal(reputation.notorietyEvents.length, 1);
  assert.equal(reputation.notorietyEvents[0].categoryId, "murder");
});

test("selective persistence stores only the approved serious subset", () => {
  const routine = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ categoryId: "theft", severity: "minor", modifiers: ["organized"] }),
    meaningfulNotorietyEvaluation()
  );
  assert.equal(routine.notoriety.length, 1);
  assert.equal(routine.notorietyEvents.length, 0);

  const violent = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ categoryId: "violent", severity: "standard" }),
    meaningfulNotorietyEvaluation()
  );
  assert.equal(violent.notoriety.length, 0);
  assert.equal(violent.notorietyEvents.length, 1);

  const mass = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ categoryId: "theft", severity: "minor", modifiers: ["mass"] }),
    meaningfulNotorietyEvaluation()
  );
  assert.equal(mass.notoriety.length, 0);
  assert.equal(mass.notorietyEvents.length, 1);

  const regional = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ directEarnedScope: "regional" }),
    meaningfulNotorietyEvaluation()
  );
  assert.equal(regional.notoriety.length, 0);
  assert.equal(regional.notorietyEvents.length, 1);
});

test("routine aggregate-only crime resolves correctly", () => {
  const reputation = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ categoryId: "fraud", severity: "minor", modifiers: ["organized"] }),
    meaningfulNotorietyEvaluation()
  );

  const resolved = resolveReputation(reputation);
  const local = findResolvedNotoriety(resolved, "local", "settlement.aurelis");

  assert.ok(local);
  assert.equal(local.currentEarned, 4);
  assert.equal(local.topCategoryId, "fraud");
  assert.equal(local.highestSeverity, "minor");
  assert.deepEqual(local.activeFlags, ["organized"]);
});

test("resolver combines aggregate rows and persisted serious events without double counting", () => {
  let reputation = createEmptyReputation();
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ categoryId: "theft", severity: "minor", baseValue: 3 }),
    meaningfulNotorietyEvaluation()
  );
  reputation = applyReputationAward(
    reputation,
    createNotorietyAward({ categoryId: "murder", severity: "major", baseValue: 10 }),
    meaningfulNotorietyEvaluation({ tick: 11 })
  );

  const resolved = resolveReputation(reputation);
  const local = findResolvedNotoriety(resolved, "local", "settlement.aurelis");

  assert.ok(local);
  assert.equal(local.currentEarned, 13);
  assert.equal(local.historical, 13);
  assert.equal(local.highestSeverity, "major");
  assert.equal(local.topCategoryId, "murder");
});

test("petty theft spam does not outrank murder or mass violence in seriousness", () => {
  let pettyReputation = createEmptyReputation();
  for (let index = 0; index < 12; index += 1) {
    pettyReputation = applyReputationAward(
      pettyReputation,
      createNotorietyAward({
        categoryId: "theft",
        severity: "minor",
        modifiers: ["repeat"],
        baseValue: 4
      }),
      meaningfulNotorietyEvaluation({ tick: 20 + index })
    );
  }

  const violentReputation = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({
      categoryId: "murder",
      severity: "major",
      modifiers: ["mass", "public"],
      baseValue: 16,
      directEarnedScope: "continental"
    }),
    meaningfulNotorietyEvaluation()
  );

  const pettyLocal = findResolvedNotoriety(resolveReputation(pettyReputation), "local", "settlement.aurelis");
  const violentContinental = findResolvedNotoriety(resolveReputation(violentReputation), "continental", "region.kaelvar");

  assert.ok(pettyLocal);
  assert.ok(violentContinental);
  assert.ok(
    SERIOUSNESS_ORDER.indexOf(pettyLocal.seriousnessClass) <
      SERIOUSNESS_ORDER.indexOf(violentContinental.seriousnessClass)
  );
});

test("unseen or unidentified crimes do not attach direct notoriety", () => {
  const unseen = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward(),
    meaningfulNotorietyEvaluation({ exposureSatisfied: false })
  );
  assert.deepEqual(unseen, createEmptyReputation());

  const unidentified = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ allowCredibleLink: false }),
    meaningfulNotorietyEvaluation({ attributionSatisfied: false })
  );
  assert.deepEqual(unidentified, createEmptyReputation());
});

test("credible linkage grants notoriety when authored", () => {
  const linked = applyReputationAward(
    createEmptyReputation(),
    createNotorietyAward({ allowCredibleLink: true }),
    meaningfulNotorietyEvaluation({
      attributionSatisfied: false,
      credibleLinkSatisfied: true
    })
  );

  assert.equal(linked.notoriety.length, 1);
  assert.equal(linked.notoriety[0].currentEarned, 4);
});
