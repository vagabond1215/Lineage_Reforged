import { runGameTick } from "../../../packages/engines/game-engine/src/index.js";
import { createInitialClock } from "../../../packages/shared/time/src/index.js";
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
          lastLevelTotals: []
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
          xp: { current: 0, total: 0, toNextLevel: 100 }
        },
        progression: {
          level: 1,
          unspentAttributePoints: 0,
          unspentSkillPoints: 0
        },
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
          "slot.weapon.right": null,
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
              stacks: []
            }
          ],
          overflow: []
        },
        activeEffects: [],
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
  console.log("Sim tick complete", {
    tick: result.appliedTick,
    domain: result.domain,
    emittedEvents: result.emittedEvents.length,
    deltas: result.deltas.length
  });
}

runSingleTick();
