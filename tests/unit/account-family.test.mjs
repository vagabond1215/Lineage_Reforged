import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultAccountFamiliesState,
  createDefaultAccountProfileState,
  hasFamilyUnlock,
  listFamilyUnlockIds,
  listFamilyUnlocks,
  resolveFamilyUnlocksByFamily,
  resolveFamilyPrestigeTotals,
  resolveFamilyPrestigeTotalsByFamily
} from "../../packages/engines/game-engine/src/index.ts";

function createFamilyRecord(familyId, familyName) {
  return {
    familyId,
    familyName,
    rootCharacterId: null,
    status: "active",
    createdAt: "2026-05-19T12:00:00.000Z",
    updatedAt: "2026-05-19T12:00:00.000Z",
    memberCharacterIds: [],
    notes: []
  };
}

function createTransaction(transactionId, familyId, kind, amount, categoryTag) {
  return {
    transactionId,
    familyId,
    kind,
    amount,
    categoryTag,
    sourceType: "test",
    sourceId: `test.${transactionId}`,
    recordedAt: "2026-05-19T12:05:00.000Z",
    summary: `Test ${kind} ${amount}`
  };
}

function createFamilyUnlock(unlockId, familyId, sourceTransactionId, rank = 1) {
  return {
    unlockId,
    familyId,
    unlockedAt: "2026-05-19T12:10:00.000Z",
    sourceTransactionId,
    rank
  };
}

test("default account family state starts empty", () => {
  assert.deepEqual(createDefaultAccountFamiliesState(), {
    families: [],
    prestigeTransactions: [],
    familyUnlocks: []
  });
  assert.deepEqual(createDefaultAccountProfileState().families, {
    families: [],
    prestigeTransactions: [],
    familyUnlocks: []
  });
});

test("family prestige totals derive grants and spends without mutating ledger state", () => {
  const state = {
    families: [
      createFamilyRecord("family.arden", "Arden Line"),
      createFamilyRecord("family.mira", "Mira Line")
    ],
    prestigeTransactions: [
      createTransaction("family.transaction.1", "family.arden", "grant", 12, "renown"),
      createTransaction("family.transaction.2", "family.arden", "spend", 5, "renown"),
      createTransaction("family.transaction.3", "family.arden", "grant", 4, "martial"),
      createTransaction("family.transaction.4", "family.mira", "grant", 9, "commerce")
    ],
    familyUnlocks: []
  };
  const before = structuredClone(state);

  assert.deepEqual(resolveFamilyPrestigeTotals(state, "family.arden"), {
    earned: 16,
    spent: 5,
    available: 11,
    byCategory: {
      renown: {
        earned: 12,
        spent: 5,
        available: 7
      },
      martial: {
        earned: 4,
        spent: 0,
        available: 4
      }
    }
  });
  assert.deepEqual(state, before);
});

test("family prestige totals by family isolate known family records", () => {
  const state = {
    families: [
      createFamilyRecord("family.arden", "Arden Line"),
      createFamilyRecord("family.mira", "Mira Line")
    ],
    prestigeTransactions: [
      createTransaction("family.transaction.1", "family.arden", "grant", 12, "renown"),
      createTransaction("family.transaction.2", "family.mira", "grant", 6, "commerce")
    ],
    familyUnlocks: []
  };

  assert.deepEqual(resolveFamilyPrestigeTotalsByFamily(state), {
    "family.arden": {
      earned: 12,
      spent: 0,
      available: 12,
      byCategory: {
        renown: {
          earned: 12,
          spent: 0,
          available: 12
        }
      }
    },
    "family.mira": {
      earned: 6,
      spent: 0,
      available: 6,
      byCategory: {
        commerce: {
          earned: 6,
          spent: 0,
          available: 6
        }
      }
    }
  });
});

test("family unlock helpers isolate ownership by family without mutating state", () => {
  const state = {
    families: [
      createFamilyRecord("family.arden", "Arden Line"),
      createFamilyRecord("family.mira", "Mira Line")
    ],
    prestigeTransactions: [
      createTransaction("family.transaction.1", "family.arden", "grant", 12, "renown"),
      createTransaction("family.transaction.2", "family.mira", "grant", 6, "commerce")
    ],
    familyUnlocks: [
      createFamilyUnlock("legacy.backstory.militia_levy", "family.arden", "family.transaction.1"),
      createFamilyUnlock("legacy.backstory.street_vendor", "family.arden", "family.transaction.1"),
      createFamilyUnlock("legacy.backstory.gatherer", "family.mira", "family.transaction.2")
    ]
  };
  const before = structuredClone(state);

  assert.equal(hasFamilyUnlock(state, "family.arden", "legacy.backstory.militia_levy"), true);
  assert.equal(hasFamilyUnlock(state, "family.mira", "legacy.backstory.militia_levy"), false);
  assert.deepEqual(listFamilyUnlockIds(state, "family.arden"), [
    "legacy.backstory.militia_levy",
    "legacy.backstory.street_vendor"
  ]);
  assert.deepEqual(listFamilyUnlocks(state, "family.mira"), [
    createFamilyUnlock("legacy.backstory.gatherer", "family.mira", "family.transaction.2")
  ]);
  assert.deepEqual(resolveFamilyUnlocksByFamily(state), {
    "family.arden": [
      createFamilyUnlock("legacy.backstory.militia_levy", "family.arden", "family.transaction.1"),
      createFamilyUnlock("legacy.backstory.street_vendor", "family.arden", "family.transaction.1")
    ],
    "family.mira": [
      createFamilyUnlock("legacy.backstory.gatherer", "family.mira", "family.transaction.2")
    ]
  });
  assert.deepEqual(state, before);
});

test("family unlock helpers do not infer ownership from prestige transaction unlock ids", () => {
  const state = {
    families: [createFamilyRecord("family.arden", "Arden Line")],
    prestigeTransactions: [
      {
        ...createTransaction("family.transaction.1", "family.arden", "grant", 12, "renown"),
        unlockId: "legacy.backstory.militia_levy"
      }
    ],
    familyUnlocks: []
  };

  assert.equal(hasFamilyUnlock(state, "family.arden", "legacy.backstory.militia_levy"), false);
  assert.deepEqual(listFamilyUnlockIds(state, "family.arden"), []);
});
