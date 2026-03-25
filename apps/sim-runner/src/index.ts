import { createSaveSnapshotFromGameContext, runGameTick } from "../../../packages/engines/game-engine/src/index.js";
import { createInitialClock } from "../../../packages/shared/time/src/index.js";
import {
  applyAttributeAdjustments,
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile
} from "../../../packages/shared/types/src/index.js";
import type {
  DomainDbHandles,
  GameTickContext,
  SqliteDbHandle
} from "../../../packages/shared/types/src/index.js";

function createNoopDbHandle(filePath: string): SqliteDbHandle {
  return {
    filePath,
    async query() {
      return [];
    },
    async execute() {
      return undefined;
    }
  };
}

function createDbHandles(): DomainDbHandles {
  return {
    worldDb: createNoopDbHandle("packages/db/build/world.sqlite"),
    civilizationDb: createNoopDbHandle("packages/db/build/civilization.sqlite"),
    playerDb: createNoopDbHandle("packages/db/build/player.sqlite"),
    simViewDb: createNoopDbHandle("packages/db/build/sim_view.sqlite")
  };
}

export function runSingleTick(): void {
  const clock = createInitialClock();
  const db = createDbHandles();
  const playerCoreData = {
    playerName: "Sehir",
    lineageId: "lineage.human",
    sexId: "male" as const,
    classId: "class.explorer",
    jobId: "job.royal_advisor"
  };
  const playerProgression = {
    level: 1,
    classLevel: 1,
    unspentAttributePoints: 0,
    unspentSkillPoints: 0
  };
  const playerOriginProfile = resolvePlayerOriginProfile(playerCoreData, playerProgression);
  const playerAttributes = applyAttributeAdjustments(
    {
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
    playerOriginProfile.attributeAdjustments
  );
  const playerResourceRuntime = createEmptyPlayerResourceRuntimeState();
  playerResourceRuntime.modifiers = [
    {
      id: "effect.inn_meal",
      label: "Inn Meal",
      sourceType: "food",
      sourceId: "item.hearty_stew",
      maxFlat: {},
      maxPercent: {},
      tickDeltaFlat: { hp: 1, stamina: 2 },
      expiresAtTick: clock.tick + 6,
      notes: ["Fresh food boosts steady recovery while the rest bonus lasts."]
    },
    {
      id: "effect.arcane_focus",
      label: "Arcane Focus",
      sourceType: "buff",
      sourceId: "spell.arcane.focused_breath",
      maxFlat: { mp: 10 },
      maxPercent: {},
      tickDeltaFlat: { mp: 2 },
      expiresAtTick: clock.tick + 4,
      notes: ["Short-duration magical focus improves mana recovery."]
    }
  ];
  playerResourceRuntime.pendingChanges = [
    {
      id: "change.scrape_damage",
      label: "Cliffside Scrape",
      resource: "hp",
      amount: -7,
      kind: "damage",
      sourceType: "system",
      sourceId: "event.scrape"
    },
    {
      id: "change.mana_bolt",
      label: "Mana Bolt",
      resource: "mp",
      amount: -4,
      kind: "spell_cost",
      sourceType: "spell",
      sourceId: "spell.arcane.mana_bolt"
    },
    {
      id: "change.dock_sprint",
      label: "Dock Sprint",
      resource: "stamina",
      amount: -6,
      kind: "scripted",
      sourceType: "system",
      sourceId: "activity.dock_run"
    }
  ];
  const seededSettlements = [
    "settlement.aurelis",
    "settlement.vinecross",
    "settlement.stonevein",
    "settlement.silvergrove",
    "settlement.verdeward",
    "settlement.passglass_hold",
    "settlement.riverthrone",
    "settlement.sunspire_reach",
    "settlement.starfall_port"
  ];

  const context: GameTickContext = {
    clock,
    seed: 42,
    db,
    incomingEvents: [],
    state: {
      worldVersion: "0.1.0",
      activeScenario: "bootstrap"
    },
    worldContext: {
      clock,
      seed: 42,
      db,
      incomingEvents: [],
      climateProfileId: "standard",
      state: {
        activeRegions: ["region-001"],
        weatherState: {}
      }
    },
    civilizationContext: {
      clock,
      seed: 42,
      db,
      incomingEvents: [],
      economyProfileId: "baseline",
      state: {
        settlements: seededSettlements,
        markets: seededSettlements.map((settlementId) => settlementId.replace("settlement.", "market.")),
        economy: {
          nodes: [],
          lastSnapshots: [],
          lastLevelTotals: [],
          marketStates: []
        },
        quests: {
          activeOffers: [],
          lastGeneratedTick: 0
        }
      }
    },
    playerContext: {
      clock,
      seed: 42,
      db,
      incomingEvents: [],
      saveSlotId: "slot-001",
      state: {
        playerId: "player-001",
        regionId: "region-001",
        coreData: playerCoreData,
        attributes: playerAttributes,
        resources: {
          hp: {
            current: playerOriginProfile.resolvedResourceMaxima.hp - 8,
            max: playerOriginProfile.resolvedResourceMaxima.hp
          },
          mp: {
            current: playerOriginProfile.resolvedResourceMaxima.mp - 2,
            max: playerOriginProfile.resolvedResourceMaxima.mp
          },
          stamina: {
            current: playerOriginProfile.resolvedResourceMaxima.stamina - 12,
            max: playerOriginProfile.resolvedResourceMaxima.stamina
          },
          xp: { current: 0, total: 0, toNextLevel: 100 }
        },
        resourceRuntime: playerResourceRuntime,
        progression: playerProgression,
        skills: [
          { id: "skill.innate.dodge", rank: 1, source: "innate" },
          { id: "skill.innate.block", rank: 1, source: "innate" },
          { id: "skill.innate.parry", rank: 1, source: "innate" },
          { id: "skill.innate.climb", rank: 1, source: "innate" },
          { id: "skill.innate.jump", rank: 1, source: "innate" },
          { id: "skill.innate.throw", rank: 1, source: "innate" }
        ],
        spells: [
          {
            id: "spell.arcane.mana_bolt",
            school: "arcane",
            element: "arcane",
            rank: 1,
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
            itemId: "item.cadet_blade",
            itemKey: "cadet_blade",
            quantity: 1,
            durability: 0.82
          },
          "slot.armor.head": null,
          "slot.armor.shoulder": null,
          "slot.armor.chest": {
            itemId: "item.field_harness",
            itemKey: "field_harness",
            quantity: 1,
            durability: 0.91,
            resourceModifiers: [
              {
                id: "equipment.field_harness",
                label: "Field Harness",
                sourceType: "equipment",
                sourceId: "item.field_harness",
                maxFlat: { hp: 8, stamina: 10 },
                maxPercent: {},
                tickDeltaFlat: { stamina: 1 },
                notes: ["Travel harness improves endurance and reduces passive fatigue."]
              }
            ]
          },
          "slot.armor.arm": null,
          "slot.armor.hand": null,
          "slot.armor.waist": null,
          "slot.armor.leg": null,
          "slot.armor.foot": null,
          "slot.accessory.ear": null,
          "slot.accessory.eyes": null,
          "slot.accessory.neck": {
            itemId: "item.mana_prism",
            itemKey: "mana_prism",
            quantity: 1,
            durability: 0.96,
            resourceModifiers: [
              {
                id: "equipment.mana_prism",
                label: "Mana Prism",
                sourceType: "equipment",
                sourceId: "item.mana_prism",
                maxFlat: { mp: 12 },
                maxPercent: {},
                tickDeltaFlat: { mp: 1 },
                notes: ["A small prism steadily feeds mana back into the bearer."]
              }
            ]
          },
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
              stacks: []
            }
          ],
          overflow: []
        },
        activeEffects: ["Inn Meal", "Arcane Focus"],
        location: {
          settlementId: "settlement.sunspire_reach",
          siteLabel: "Harbor Quarter",
          worldMapId: "world_map.first_world",
          knownSettlementIds: [
            "settlement.sunspire_reach",
            "settlement.aurelis",
            "settlement.vinecross",
            "settlement.starfall_port"
          ]
        },
        currency: {
          gold: 24,
          silver: 18,
          copper: 42
        },
        originProfile: playerOriginProfile,
        reputation: [
          {
            id: "rep.scribes_guild",
            label: "Scribes Guild",
            standingLabel: "Trusted",
            score: 64,
            effects: ["archives_access", "priority_copywork"]
          }
        ],
        titles: [
          {
            id: "title.royal_advisor",
            label: "Royal Advisor",
            source: "court_service",
            equipped: true,
            effects: ["audience_access", "civic_authority"]
          }
        ],
        discoveryChronicle: {
          entries: [],
          lastUpdatedTick: null
        },
        discoveredRegions: ["region-001"],
        activeQuestIds: [],
        completedQuestIds: [],
        flags: [],
        saveMeta: {
          totalPlayTicks: 0,
          lastRestAtTick: 0,
          lastSavedAtTick: 0
        }
      }
    }
  };

  const result = runGameTick(context);
  const snapshot = createSaveSnapshotFromGameContext(context);
  console.log("Sim tick complete", {
    tick: result.appliedTick,
    domain: result.domain,
    emittedEvents: result.emittedEvents.length,
    deltas: result.deltas.length,
    snapshotPlayer: snapshot.playerState.coreData.playerName,
    snapshotNotifications: snapshot.sessionState.notifications.length
  });
}

runSingleTick();
