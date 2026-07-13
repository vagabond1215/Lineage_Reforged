import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import type {
  CodexEntryState,
  PanelRecordState,
  QuestJournalEntryState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import {
  resolvePlayerEchoProgression,
  syncPlayerBodyState
} from "../../player-engine/src/index.js";
import { getCurrentPlayerTravelLocationId } from "./player-travel-rules.js";

const FLAG_SURVEY_SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const FLAG_SURVEY_RUINS_CONFIRMED = "gameplay.quest.ashen_reef_survey.ruins_confirmed";
const FLAG_PORTER_CRATES_SECURED = "gameplay.quest.rivet_shortfall_relief.crates_secured";
const FLAG_DISCOVERY_STORMGLASS_BLOOM = "gameplay.discovery.stormglass_bloom";

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function hasFlag(snapshot: SaveSnapshot, flag: string): boolean {
  return snapshot.sessionState.flags.includes(flag);
}

function getSurveySectorCount(snapshot: SaveSnapshot): number {
  return [1, 2, 3].filter((index) =>
    hasFlag(snapshot, `${FLAG_SURVEY_SECTOR_PREFIX}${index}`)
  ).length;
}

function isSurveyComplete(snapshot: SaveSnapshot): boolean {
  return getSurveySectorCount(snapshot) >= 3 && hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
}

function hasRivetCargo(snapshot: SaveSnapshot): boolean {
  return hasFlag(snapshot, FLAG_PORTER_CRATES_SECURED);
}

function findQuest(snapshot: SaveSnapshot, questId: string): QuestJournalEntryState | undefined {
  return snapshot.sessionState.questJournal.find((entry) => entry.id === questId);
}

function isQuestReadyToTurnIn(snapshot: SaveSnapshot, questId: string): boolean {
  const quest = findQuest(snapshot, questId);
  if (!quest || quest.category !== "active") return false;
  if (questId === "quest.ashen_reef_survey") {
    return isSurveyComplete(snapshot) && getCurrentPlayerTravelLocationId(snapshot) === "location.saltmere";
  }
  if (questId === "quest.rivet_shortfall_relief") {
    return hasRivetCargo(snapshot) && getCurrentPlayerTravelLocationId(snapshot) === "location.saltmere";
  }
  return false;
}

function syncQuestJournal(snapshot: SaveSnapshot): QuestJournalEntryState[] {
  return snapshot.sessionState.questJournal.map((entry) => {
    if (entry.id === "quest.ashen_reef_survey") {
      const sectorCount = getSurveySectorCount(snapshot);
      const ruinsConfirmed = hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
      const readyToTurnIn = isQuestReadyToTurnIn(snapshot, entry.id);
      const tracked = snapshot.sessionState.trackedQuestId === entry.id;

      if (entry.category === "completed") {
        return {
          ...entry,
          tracked: false,
          statusLabel: "Turned in",
          objectives: [
            "Survey reef lanes: 3 / 3 sectors complete",
            "Confirm ruin markers: complete",
            "Return chart packet to Saltmere Harbor Office"
          ]
        };
      }

      return {
        ...entry,
        tracked,
        statusLabel: tracked
          ? readyToTurnIn
            ? "Tracked - Ready to turn in"
            : "Tracked"
          : readyToTurnIn
            ? "Ready to turn in"
            : "In progress",
        objectives: [
          `Survey reef lanes: ${sectorCount} / 3 sectors complete`,
          `Confirm ruin markers: ${ruinsConfirmed ? "complete" : "pending"}`,
          readyToTurnIn
            ? "Return chart packet to Saltmere Harbor Office: ready to turn in"
            : "Return chart packet to Saltmere Harbor Office"
        ]
      };
    }

    if (entry.id === "quest.rivet_shortfall_relief") {
      const tracked = snapshot.sessionState.trackedQuestId === entry.id;
      const secured = hasRivetCargo(snapshot);
      const readyToTurnIn = isQuestReadyToTurnIn(snapshot, entry.id);

      if (entry.category === "completed") {
        return {
          ...entry,
          tracked: false,
          statusLabel: "Turned in",
          objectives: [
            "Acquire rivets: 6 / 6 crates",
            "Escort shipment for optional bonus",
            "Return cargo to Saltmere Drydock"
          ]
        };
      }

      if (entry.category === "contracts") {
        return {
          ...entry,
          tracked,
          statusLabel: tracked ? "Tracked - Open contract" : "Open contract"
        };
      }

      return {
        ...entry,
        tracked,
        statusLabel: tracked
          ? readyToTurnIn
            ? "Tracked - Ready to turn in"
            : secured
              ? "Tracked - Cargo secured"
              : "Tracked - Procurement active"
          : readyToTurnIn
            ? "Ready to turn in"
            : secured
              ? "Cargo secured"
              : "In progress",
        objectives: [
          `Acquire rivets: ${secured ? "6 / 6 crates" : "0 / 6 crates"}`,
          `Escort shipment for optional bonus: ${secured ? "cargo loaded" : "pending"}`,
          readyToTurnIn
            ? "Return cargo to Saltmere Drydock: ready to turn in"
            : "Return cargo to Saltmere Drydock"
        ]
      };
    }

    return {
      ...entry,
      tracked: snapshot.sessionState.trackedQuestId === entry.id
    };
  });
}

function syncWorldRecords(snapshot: SaveSnapshot): PanelRecordState[] {
  const surveyComplete = isSurveyComplete(snapshot);
  const rivetSecured = hasRivetCargo(snapshot);
  const rivetCompleted = findQuest(snapshot, "quest.rivet_shortfall_relief")?.category === "completed";

  return snapshot.sessionState.worldRecords.map((record) => {
    if (record.id === "route.aurelis_starfall_port" && surveyComplete) {
      return {
        ...record,
        status: "Risk: charted",
        summary: "The lane is still dangerous, but the major reefs and ruin markers are now charted.",
        detailEntries: [
          { label: "Distance", value: "83 nautical miles" },
          { label: "Travel Time", value: "13 hours by cutter" },
          { label: "Risk", value: "Moderate after verified charting" }
        ]
      };
    }

    if (record.id === "travel.scout_starfall_port") {
      return {
        ...record,
        status: surveyComplete
          ? "Survey complete"
          : getCurrentPlayerTravelLocationId(snapshot) === "location.ashen_reef"
            ? "On site"
            : "Ready to depart",
        summary: surveyComplete
          ? "The charter has enough field data to finalize and return for payment."
          : record.summary
      };
    }

    if (record.id === "market.iron_rivets") {
      if (rivetCompleted) {
        return {
          ...record,
          status: "Stabilizing",
          summary: "Emergency cargo eased the drydock shortage, softening immediate price pressure.",
          detailEntries: [
            { label: "Price", value: "39 crown / crate" },
            { label: "Demand", value: "High" },
            { label: "Supply", value: "Recovering" }
          ]
        };
      }

      if (rivetSecured) {
        return {
          ...record,
          status: "Relief cargo inbound",
          summary: "Six crates are already moving toward the Saltmere drydock on emergency priority.",
          detailEntries: record.detailEntries
        };
      }
    }

    return record;
  });
}

function syncActivityRecords(snapshot: SaveSnapshot): PanelRecordState[] {
  const surveyQuest = findQuest(snapshot, "quest.ashen_reef_survey");
  const rivetQuest = findQuest(snapshot, "quest.rivet_shortfall_relief");
  const surveyReady = isQuestReadyToTurnIn(snapshot, "quest.ashen_reef_survey");
  const rivetReady = isQuestReadyToTurnIn(snapshot, "quest.rivet_shortfall_relief");

  return snapshot.sessionState.activityRecords.map((record) => {
    if (record.id === "contract.ashen_reef") {
      return {
        ...record,
        status:
          surveyQuest?.category === "completed"
            ? "Completed"
            : surveyReady
              ? "Ready to turn in"
              : surveyQuest?.category === "active"
                ? "In progress"
                : "Available"
      };
    }

    if (record.id === "trade.amber_salt_convoy" && rivetQuest?.category === "active") {
      return {
        ...record,
        status: rivetReady
          ? "Cargo returned"
          : hasRivetCargo(snapshot)
            ? "Return leg active"
            : "Loading relief cargo",
        summary: hasRivetCargo(snapshot)
          ? "The convoy charter is now focused on returning rivets to Saltmere as fast as possible."
          : "Westreach handlers are staging deepiron rivets for an urgent drydock run."
      };
    }

    return record;
  });
}

function syncCodexEntries(snapshot: SaveSnapshot): CodexEntryState[] {
  return snapshot.sessionState.codexEntries.map((entry) => {
    if (entry.id !== "flora.unknown_bloom" || !hasFlag(snapshot, FLAG_DISCOVERY_STORMGLASS_BLOOM)) {
      return entry;
    }

    return {
      ...entry,
      title: "Stormglass Bloom",
      subtitle: "Catalogued reef flora",
      status: "Catalogued",
      summary: "A reef-edge bloom whose crystalline petals harden under salt spray and dusk light.",
      tags: ["Glasswater", "Alchemy", "Flora"],
      habitat: "Salt-lashed reef shelves with intermittent ruin shade",
      uses: "Lamp-glass flux, delicate varnish blends, and survey marking dyes",
      valueDescription: "Moderate value when fresh, high value when preserved for alchemical buyers",
      regionTags: ["Glasswater", "Sable Coast"],
      locked: false
    };
  });
}

function syncQuestIds(snapshot: SaveSnapshot) {
  snapshot.playerState.activeQuestIds = snapshot.sessionState.questJournal
    .filter((entry) => entry.category === "active")
    .map((entry) => entry.id);
  snapshot.playerState.completedQuestIds = snapshot.sessionState.questJournal
    .filter((entry) => entry.category === "completed")
    .map((entry) => entry.id);
}

export function synchronizeGameplaySnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  const nextSnapshot = cloneSnapshot(snapshot);

  nextSnapshot.sessionState.questJournal = syncQuestJournal(nextSnapshot);
  nextSnapshot.sessionState.worldRecords = syncWorldRecords(nextSnapshot);
  nextSnapshot.sessionState.activityRecords = syncActivityRecords(nextSnapshot);
  nextSnapshot.sessionState.codexEntries = syncCodexEntries(nextSnapshot);
  syncQuestIds(nextSnapshot);
  syncPlayerBodyState(
    nextSnapshot.playerState,
    nextSnapshot.clock.tick,
    nextSnapshot.clock.day,
    nextSnapshot.gameState.runDifficulty
  );
  nextSnapshot.playerState.progression = resolvePlayerEchoProgression(nextSnapshot.playerState);

  if (
    nextSnapshot.sessionState.trackedQuestId &&
    !nextSnapshot.sessionState.questJournal.some(
      (entry) => entry.id === nextSnapshot.sessionState.trackedQuestId && entry.category !== "failed"
    )
  ) {
    nextSnapshot.sessionState.trackedQuestId = null;
  }

  return nextSnapshot;
}
