import test from "node:test";
import assert from "node:assert/strict";
import { buildCombatSkillGainMessageItems } from "../../apps/rpg-ui/src/runtime/combatDeltaPresentation.ts";

test("combat delta presenter extracts applied skill gain messages", () => {
  const items = buildCombatSkillGainMessageItems([
    {
      kind: "combat",
      payload: {
        encounterId: "encounter.test",
        state: "active",
        skillGainMessages: ["Sword +1"]
      }
    }
  ]);

  assert.deepEqual(items, [
    {
      id: "combat.skill_gain.encounter.test.sword.1",
      title: "Training Improved",
      detail: "Sword +1",
      message: "Sword +1",
      tone: "success",
      encounterId: "encounter.test",
      source: "combat_delta"
    }
  ]);
});

test("combat delta presenter extracts blocked breakthrough messages", () => {
  const items = buildCombatSkillGainMessageItems([
    {
      kind: "combat",
      payload: {
        encounterId: "encounter.test",
        skillGainMessages: ["Sword progress requires a breakthrough"]
      }
    }
  ]);

  assert.deepEqual(items, [
    {
      id: "combat.skill_gain.encounter.test.sword.progress.requires.a.breakthrough",
      title: "Training Paused",
      detail: "Sword progress requires a breakthrough",
      message: "Sword progress requires a breakthrough",
      tone: "warning",
      encounterId: "encounter.test",
      source: "combat_delta"
    }
  ]);
});

test("combat delta presenter returns no items when skill gain messages are absent", () => {
  assert.deepEqual(
    buildCombatSkillGainMessageItems([
      { kind: "combat", payload: { encounterId: "encounter.empty", state: "active" } },
      {
        kind: "combat",
        payload: {
          encounterId: "encounter.invalid",
          skillGainMessages: ["", "   ", null, 1]
        }
      },
      {
        kind: "orchestration",
        payload: {
          skillGainMessages: ["Sword +1"]
        }
      }
    ]),
    []
  );
});

test("combat delta presenter dedupes repeated messages in the same encounter batch", () => {
  const items = buildCombatSkillGainMessageItems([
    {
      kind: "combat",
      payload: {
        encounterId: "encounter.same",
        skillGainMessages: ["Sword +1", "Sword +1"]
      }
    },
    {
      kind: "combat",
      payload: {
        encounterId: "encounter.same",
        skillGainMessages: ["Sword +1", "Archery +1"]
      }
    },
    {
      kind: "combat",
      payload: {
        encounterId: "encounter.other",
        skillGainMessages: ["Sword +1"]
      }
    }
  ]);

  assert.deepEqual(
    items.map((item) => `${item.encounterId}:${item.message}`),
    ["encounter.same:Sword +1", "encounter.same:Archery +1", "encounter.other:Sword +1"]
  );
});

test("combat delta presenter does not mutate deltas or persistent state", () => {
  const persistentState = {
    accountProfile: {
      accountId: "account.test",
      legacy: {
        balance: 12
      }
    },
    snapshot: {
      gameState: {
        combatHistory: []
      },
      sessionState: {
        notifications: [],
        chronicle: []
      }
    }
  };
  const deltas = [
    {
      kind: "combat",
      payload: {
        encounterId: "encounter.test",
        skillGainMessages: ["Sword +1"],
        notifications: persistentState.snapshot.sessionState.notifications,
        chronicle: persistentState.snapshot.sessionState.chronicle,
        combatHistory: persistentState.snapshot.gameState.combatHistory
      }
    }
  ];
  const persistentStateBefore = structuredClone(persistentState);
  const deltasBefore = structuredClone(deltas);

  assert.equal(buildCombatSkillGainMessageItems(deltas).length, 1);
  assert.deepEqual(deltas, deltasBefore);
  assert.deepEqual(persistentState, persistentStateBefore);
});
