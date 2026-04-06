import {
  createDefaultGameState,
  createDefaultPlayerCombatProfile,
  createEmptySessionState,
  createSaveSnapshotFromGameContext,
  runGameTick
} from "../../../packages/engines/game-engine/src/index.js";
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
    classId: null,
    jobId: null,
    backstoryId: "backstory.local",
    startingBundleId: "starting_bundle.traveler"
  };
  const playerProgression = {
    level: 1,
    classLevel: 0,
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
      sourceId: "spell.light.enhancing.bless",
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
      sourceId: "spell.fire.elemental.firebolt"
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
    state: createDefaultGameState("normal"),
    worldContext: {
      clock,
      seed: 42,
      db,
      incomingEvents: [],
      climateProfileId: "standard",
      state: {
        activeRegions: ["region.kaelvar"],
        weatherState: {},
        encounterContext: {
          regionId: "region.kaelvar",
          settlementId: "settlement.aurelis",
          siteId: null,
          worldHexId: null,
          habitatTags: ["roadside_ditch", "frontier_track", "quarry_edge"],
          hazardPressure: 42
        }
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
        transport: {
          caravans: [],
          stockAdjustments: [],
          nextCaravanOrdinal: 1,
          assetReservations: [],
          lastEvaluatedOpportunities: [],
          lastProcessedTick: 0
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
        regionId: "region.kaelvar",
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
          { id: "skill.combat.weapon.sword", rank: 12, source: "trained" },
          { id: "skill.combat.defense.shield_handling", rank: 10, source: "trained" },
          { id: "skill.combat.defense.evasion", rank: 8, source: "trained" },
          { id: "skill.resource.spotting.fauna", rank: 6, source: "trained" }
        ],
        spells: [
          {
            id: "spell.fire.elemental.firebolt",
            school: "elemental",
            element: "fire",
            rank: 1,
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
          "slot.weapon.left": {
            itemId: "item.buckler_shield",
            itemKey: "buckler_shield",
            quantity: 1,
            durability: 0.9
          },
          "slot.weapon.right": {
            itemId: "item.arming_sword",
            itemKey: "arming_sword",
            quantity: 1,
            durability: 0.82
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
        discoveryChronicle: {
          entries: [],
          lastUpdatedTick: null
        },
        discoveredRegions: ["region.kaelvar"],
        activeQuestIds: [],
        completedQuestIds: [],
        flags: [],
        combatProfile: createDefaultPlayerCombatProfile(),
        saveMeta: {
          totalPlayTicks: 0,
          lastRestAtTick: 0,
          lastSavedAtTick: 0
        }
      }
    },
    sessionState: createEmptySessionState()
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
