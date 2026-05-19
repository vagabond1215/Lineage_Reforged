import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultAccountFamiliesState,
  createDefaultAccountProfileState,
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

test("default account family state starts empty", () => {
  assert.deepEqual(createDefaultAccountFamiliesState(), {
    families: [],
    prestigeTransactions: []
  });
  assert.deepEqual(createDefaultAccountProfileState().families, {
    families: [],
    prestigeTransactions: []
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
    ]
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
    ]
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
