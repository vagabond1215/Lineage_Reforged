import test from "node:test";
import assert from "node:assert/strict";

const sampleSnapshot = {
  snapshotVersion: "0.1.0",
  capturedAtTick: 24,
  playerState: {
    playerId: "player-001",
    regionId: "region-001",
    coreData: {
      playerName: "Sehir",
      lineageId: "lineage.human",
      classId: null,
      jobId: "job.royal_advisor"
    },
    attributes: {
      STR: 10,
      DEX: 10,
      AGI: 10,
      CON: 10,
      VIT: 10,
      WIS: 10,
      INT: 10,
      SPT: 10,
      CHA: 10
    },
    resources: {
      hp: { current: 120, max: 120 },
      mp: { current: 60, max: 60 },
      stamina: { current: 100, max: 100 },
      xp: { current: 0, total: 240, toNextLevel: 100 }
    },
    progression: {
      level: 3,
      unspentAttributePoints: 2,
      unspentSkillPoints: 1
    },
    skills: [
      { id: "skill.innate.dodge", rank: 2, source: "innate" },
      { id: "skill.innate.parry", rank: 1, source: "innate" }
    ],
    spells: [
      {
        id: "spell.arcane.mana_bolt",
        school: "arcane",
        element: "arcane",
        rank: 2,
        source: "learned"
      }
    ],
    abilities: [
      {
        id: "ability.combat.shield_bash",
        category: "weapon",
        rank: 1,
        source: "learned"
      }
    ],
    traits: [
      { id: "trait.hardy", source: "innate" }
    ],
    equipment: {
      "slot.weapon.left": null,
      "slot.weapon.right": {
        itemId: "item.shortsword",
        itemKey: "shortsword",
        quantity: 1,
        durability: 0.92
      },
      "slot.armor.head": null,
      "slot.armor.shoulder": null,
      "slot.armor.chest": null,
      "slot.armor.arm": null,
      "slot.armor.hand": null,
      "slot.armor.waist": null,
      "slot.armor.leg": null,
      "slot.armor.foot": null,
      "slot.accessory.ear": null,
      "slot.accessory.eyes": null,
      "slot.accessory.neck": null,
      "slot.accessory.arms": null,
      "slot.accessory.fingers": null,
      "slot.accessory.waist": null,
      "slot.accessory.ankle": null
    },
    inventory: {
      bags: [
        {
          id: "bag.starter",
          label: "Starter Satchel",
          slotCapacity: 16,
          stacks: [
            { itemId: "item.bandage", itemKey: "bandage", quantity: 3 }
          ]
        }
      ],
      overflow: []
    },
    activeEffects: [],
    discoveredRegions: ["region-001", "region-002"],
    activeQuestIds: ["quest.arrive_westfall"],
    completedQuestIds: ["quest.intro"],
    flags: ["tutorial.complete"],
    saveMeta: {
      totalPlayTicks: 240,
      lastRestAtTick: 18,
      lastSavedAtTick: 24
    }
  },
  worldState: {
    activeRegions: ["region-001"],
    weatherState: { climateProfileId: "climate.standard" }
  },
  civilizationState: {
    settlements: ["settlement-001"],
    markets: ["market-001"]
  },
  sessionState: {
    activeEvents: ["event.weather.shift"],
    flags: ["tutorial.complete"],
    triggers: ["trigger.first_camp"],
    completedEvents: []
  }
};

test("save snapshot roundtrip preserves state", () => {
  const serialized = JSON.stringify(sampleSnapshot);
  const restored = JSON.parse(serialized);

  assert.deepEqual(restored, sampleSnapshot);
});
