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
        settlements: ["settlement-001"],
        markets: ["market-001"]
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
        stats: {
          STR: 10,
          DEX: 10,
          CON: 10
        },
        flags: []
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