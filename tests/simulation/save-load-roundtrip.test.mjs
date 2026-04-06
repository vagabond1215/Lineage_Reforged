import test from "node:test";
import assert from "node:assert/strict";

const sampleSnapshot = {
  snapshotVersion: "0.1.0",
  capturedAtTick: 24,
  clock: {
    tick: 24,
    subday: 1,
    day: 6,
    month: 2,
    season: "Thaw",
    year: 1
  },
  gameState: {
    worldVersion: "0.1.0",
    activeScenario: "bootstrap",
    mode: {
      id: "normal",
      combatPauseAllowed: true
    },
    party: {
      leaderCombatantId: null,
      members: []
    },
    activeEncounter: null,
    combatHistory: []
  },
  playerState: {
    playerId: "player-001",
    regionId: "region.kaelvar",
    coreData: {
      playerName: "Sehir",
      lineageId: "lineage.human",
      sexId: "male",
      classId: null,
      jobId: null,
      backstoryId: "backstory.local_hero",
      startingBundleId: "starting_bundle.traveler"
    },
    attributes: {
      STR: 11,
      DEX: 10,
      AGI: 9,
      CON: 10,
      VIT: 10,
      WIS: 10,
      INT: 10,
      SPT: 10,
      CHA: 10
    },
    resources: {
      hp: { current: 120, max: 124 },
      mp: { current: 60, max: 62 },
      stamina: { current: 100, max: 104 },
      xp: { current: 0, total: 240, toNextLevel: 100 }
    },
    resourceRuntime: {
      modifiers: [
        {
          id: "effect.campfire_meal",
          label: "Campfire Meal",
          sourceType: "food",
          sourceId: "item.stew",
          maxFlat: {},
          maxPercent: {},
          tickDeltaFlat: {
            hp: 1,
            stamina: 2
          },
          expiresAtTick: 30,
          notes: ["Fresh food supports recovery after travel."]
        }
      ],
      pendingChanges: [],
      lastBreakdown: {
        appliedTick: 24,
        activeModifierIds: ["effect.campfire_meal"],
        resources: {
          hp: {
            max: 124,
            before: 119,
            after: 120,
            naturalRegen: 2,
            assistedRegen: 1,
            degeneration: 0,
            directChange: -2,
            clampAdjustment: 0
          },
          mp: {
            max: 62,
            before: 61,
            after: 60,
            naturalRegen: 1,
            assistedRegen: 0,
            degeneration: 0,
            directChange: -2,
            clampAdjustment: 0
          },
          stamina: {
            max: 104,
            before: 97,
            after: 100,
            naturalRegen: 3,
            assistedRegen: 2,
            degeneration: 0,
            directChange: -2,
            clampAdjustment: 0
          }
        }
      },
      history: [
        {
          id: "natural.24.hp",
          label: "Natural HP regeneration",
          resource: "hp",
          amount: 2,
          kind: "natural_regen",
          sourceType: "system",
          sourceId: null,
          appliedTick: 24,
          before: 119,
          after: 121
        },
        {
          id: "change.training_bruise",
          label: "Training Bruise",
          resource: "hp",
          amount: -1,
          kind: "damage",
          sourceType: "system",
          sourceId: "event.training",
          appliedTick: 24,
          before: 121,
          after: 120
        },
        {
          id: "change.mana_bolt",
          label: "Mana Bolt",
          resource: "mp",
          amount: -2,
          kind: "spell_cost",
          sourceType: "spell",
          sourceId: "spell.fire.elemental.firebolt",
          appliedTick: 24,
          before: 62,
          after: 60
        }
      ]
    },
    progression: {
      level: 3,
      classLevel: 0,
      unspentAttributePoints: 2,
      unspentSkillPoints: 1
    },
    skills: [
      { id: "skill.combat.weapon.sword", rank: 2, source: "trained" },
      { id: "skill.combat.defense.evasion", rank: 1, source: "trained" }
    ],
    spells: [
      {
        id: "spell.fire.elemental.firebolt",
        school: "elemental",
        element: "fire",
        rank: 2,
        source: "learned"
      }
    ],
    abilities: [
      {
        id: "ability.melee.guard_break",
        category: "melee",
        rank: 1,
        source: "learned"
      }
    ],
    traits: [
      { id: "trait.lineage.human.adaptable", source: "lineage" }
    ],
    equipment: {
      "slot.weapon.left": null,
      "slot.weapon.right": {
        itemId: "item.arming_sword",
        itemKey: "arming_sword",
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
            { itemId: "item.field_bandage", itemKey: "field_bandage", quantity: 3 }
          ]
        }
      ],
      overflow: []
    },
    activeEffects: [],
    location: {
      settlementId: "settlement.aurelis",
      siteLabel: "Harbor Quarter",
      worldMapId: "world_map.first_world",
      knownSettlementIds: ["settlement.aurelis"]
    },
    currency: {
      gold: 12,
      silver: 5,
      copper: 9
    },
    originProfile: {
      lineageId: "lineage.human",
      lineageLabel: "Human",
      classId: null,
      classLabel: null,
      sexId: "male",
      attributeAdjustments: {
        STR: 1,
        AGI: -1
      },
      resourceBaseAdjustments: {
        hp: 0,
        mp: 0,
        stamina: 0
      },
      lineageResourceGrowthPerLevel: {
        hp: 2,
        mp: 1,
        stamina: 2
      },
      classResourceGrowthPerClassLevel: {
        hp: 0,
        mp: 0,
        stamina: 0
      },
      resolvedResourceMaxima: {
        hp: 124,
        mp: 62,
        stamina: 104
      },
      notes: [
        "Human growth stays broadly balanced across all three pools.",
        "Only humans currently use a small sex-based STR/AGI tradeoff, and the total adjustment stays net-neutral.",
        "No class growth applied."
      ]
    },
    reputation: [
      {
        id: "rep.harbor_office",
        label: "Harbor Office",
        standingLabel: "Known",
        score: 12,
        effects: ["inspection_access"]
      }
    ],
    titles: [
      {
        id: "title.combat.sword.novice",
        name: "Novice",
        family: "combat",
        trackId: "title_track.combat.sword",
        sourceSkillId: "skill.combat.weapon.sword",
        milestone: {
          threshold: 50,
          requiresMasteryTrial: false,
          trialId: null
        },
        equipped: true,
        effects: ["combat.sword.accuracy"]
      }
    ],
    knowledgeFamiliarity: [
      { trackId: "knowledge_track.resources_universal", level: 25 }
    ],
    discoveryChronicle: {
      entries: [],
      lastUpdatedTick: null
    },
    discoveredRegions: ["region.kaelvar", "region.valtherion"],
    activeQuestIds: ["quest.arrive_westfall"],
    completedQuestIds: ["quest.intro"],
    flags: ["tutorial.complete"],
    combatProfile: {
      preferredMode: "normal",
      memberPreferences: []
    },
    saveMeta: {
      totalPlayTicks: 240,
      lastRestAtTick: 18,
      lastSavedAtTick: 24
    }
  },
  worldState: {
    activeRegions: ["region.kaelvar"],
    weatherState: { climateProfileId: "climate.standard" }
  },
  civilizationState: {
    settlements: ["settlement.aurelis"],
    markets: ["market.aurelis"],
    economy: {
      nodes: [],
      lastSnapshots: [],
      lastLevelTotals: [],
      marketStates: []
    },
    transport: {
      caravans: [],
      stockAdjustments: [],
      nextCaravanOrdinal: 1,
      assetReservations: [],
      lastEvaluatedOpportunities: [],
      lastProcessedTick: 24
    },
    quests: {
      activeOffers: [],
      lastGeneratedTick: 24
    }
  },
  sessionState: {
    activeEvents: ["event.weather.shift"],
    flags: ["tutorial.complete"],
    triggers: ["trigger.first_camp"],
    completedEvents: [],
    trackedQuestId: "quest.arrive_westfall",
    currentActivity: {
      id: "activity.resting",
      label: "Resting",
      category: "Recovery"
    },
    pinnedRecordIds: ["quest.arrive_westfall"],
    notifications: [],
    knownLocations: [],
    worldRecords: [],
    activityRecords: [],
    operations: [],
    codexEntries: [],
    questJournal: [],
    chronicle: [],
    combatUi: {
      selectedPartyMemberId: null,
      selectedEnemyTargetId: null,
      stagedCommand: null,
      lastIssuedCommand: null
    }
  }
};

test("save snapshot roundtrip preserves state", () => {
  const serialized = JSON.stringify(sampleSnapshot);
  const restored = JSON.parse(serialized);

  assert.deepEqual(restored, sampleSnapshot);
});
