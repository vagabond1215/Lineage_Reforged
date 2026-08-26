import questDefinitions from "../../../content/base/civilization/quest_definitions.json" with { type: "json" };
import type {
  QuestJournalEntryState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "./campaign-rules.js";

export const ASHEN_REEF_SURVEY_DEFINITION_ID =
  "quest_definition.starfall_ashen_reef_soundings" as const;
export const ASHEN_REEF_SURVEY_RUNTIME_QUEST_ID =
  "quest.ashen_reef_survey" as const;

type AuthoredQuestDefinition = {
  id: string;
  name: string;
  category: string;
  summary: string;
  giver: { settlementId: string };
  actionTree: {
    nodes: Array<{ id: string; label: string; summary: string }>;
  };
};

const definition = (questDefinitions.records as AuthoredQuestDefinition[]).find(
  (entry) => entry.id === ASHEN_REEF_SURVEY_DEFINITION_ID
);

if (!definition) {
  throw new Error("The authored Soundings of Ashen Reef definition is missing.");
}

export const ASHEN_REEF_SURVEY_OFFER: QuestJournalEntryState = {
  id: ASHEN_REEF_SURVEY_RUNTIME_QUEST_ID,
  category: "contracts",
  title: definition.name,
  regionLabel: "Starfall Isle",
  rewardLabel: "Paid civic contract - terms set at later turn-in",
  summary: definition.summary,
  statusLabel: "Open contract",
  tracked: false,
  objectives: definition.actionTree.nodes.map((node) => node.summary),
  rewards: ["Paid civic contract; exact turn-in terms remain deferred."],
  relatedLocations: [definition.giver.settlementId, "location.ashen_reef"],
  tags: ["Survey", "Starfall Isle", "Civic contract"]
};

export type AshenReefSurveyOfferStagingCode =
  | "staged"
  | "duplicate"
  | "consumed"
  | "ineligible"
  | "conflict";

export type AshenReefSurveyOfferStagingResult =
  | {
      accepted: true;
      code: Exclude<AshenReefSurveyOfferStagingCode, "conflict">;
      snapshot: SaveSnapshot;
      offer: QuestJournalEntryState | null;
    }
  | {
      accepted: false;
      code: "conflict";
      reason: string;
      snapshot: SaveSnapshot;
      offer: null;
    };

function stable(value: unknown): string {
  const normalize = (entry: unknown): unknown => {
    if (Array.isArray(entry)) return entry.map(normalize);
    if (!entry || typeof entry !== "object") return entry;
    return Object.keys(entry as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = normalize((entry as Record<string, unknown>)[key]);
        return result;
      }, {});
  };
  return JSON.stringify(normalize(value));
}

function hasSurveyLifecycleResidue(snapshot: SaveSnapshot): boolean {
  const authority = snapshot.authorityLedger?.ashenReefSurvey;
  return (
    snapshot.sessionState.trackedQuestId === ASHEN_REEF_SURVEY_RUNTIME_QUEST_ID ||
    snapshot.playerState.activeQuestIds.includes(ASHEN_REEF_SURVEY_RUNTIME_QUEST_ID) ||
    snapshot.playerState.completedQuestIds.includes(ASHEN_REEF_SURVEY_RUNTIME_QUEST_ID) ||
    snapshot.sessionState.flags.some((entry) =>
      entry.startsWith("gameplay.quest.ashen_reef_survey.")
    ) ||
    snapshot.sessionState.knownLocations.some(
      (entry) => entry.id === "location.ashen_reef"
    ) ||
    snapshot.sessionState.operations.some(
      (entry) => entry.id === "operation.quest.ashen_reef_survey"
    ) ||
    snapshot.sessionState.currentActivity?.id === "activity.survey.ashen_reef" ||
    snapshot.sessionState.currentActivity?.id === "activity.return.survey_packet" ||
    Boolean(
      authority &&
        (authority.requests.length > 0 ||
          authority.occurrences.length > 0 ||
          authority.results.length > 0 ||
          authority.consequenceReceipts.length > 0 ||
          authority.projectionRepairs.length > 0 ||
          authority.corrections.length > 0 ||
          authority.legacyBaseline !== undefined)
    )
  );
}

function isEligibleStarfallNewCampaign(snapshot: SaveSnapshot): boolean {
  return (
    isTargetCampaignSnapshot(snapshot) &&
    snapshot.campaignRules?.source === "new_campaign" &&
    snapshot.sessionState.activeEvents.includes("event.campaign.started") &&
    snapshot.sessionState.flags.includes("character.start.settlement.starfall_port") &&
    snapshot.playerState.flags.includes("player.start.settlement.starfall_port") &&
    snapshot.playerState.location.settlementId === "settlement.starfall_port"
  );
}

export function stageAshenReefSurveyOffer(
  snapshot: SaveSnapshot
): AshenReefSurveyOfferStagingResult {
  const matches = snapshot.sessionState.questJournal.filter(
    (entry) => entry.id === ASHEN_REEF_SURVEY_RUNTIME_QUEST_ID
  );
  if (matches.length > 1) {
    return {
      accepted: false,
      code: "conflict",
      reason: "Duplicate Ashen Reef survey quest rows block one-time offer staging.",
      snapshot,
      offer: null
    };
  }
  const existing = matches[0];
  if (existing) {
    if (existing.category !== "contracts") {
      return { accepted: true, code: "consumed", snapshot, offer: existing };
    }
    if (stable(existing) === stable(ASHEN_REEF_SURVEY_OFFER)) {
      return { accepted: true, code: "duplicate", snapshot, offer: existing };
    }
    return {
      accepted: false,
      code: "conflict",
      reason: "The Ashen Reef survey offer conflicts with authored presentation.",
      snapshot,
      offer: null
    };
  }
  if (hasSurveyLifecycleResidue(snapshot)) {
    return {
      accepted: false,
      code: "conflict",
      reason: "Ashen Reef survey lifecycle residue exists without its quest row.",
      snapshot,
      offer: null
    };
  }
  if (!isEligibleStarfallNewCampaign(snapshot)) {
    return { accepted: true, code: "ineligible", snapshot, offer: null };
  }
  const offer = structuredClone(ASHEN_REEF_SURVEY_OFFER);
  return {
    accepted: true,
    code: "staged",
    offer,
    snapshot: {
      ...snapshot,
      sessionState: {
        ...snapshot.sessionState,
        questJournal: [...snapshot.sessionState.questJournal, offer]
      }
    }
  };
}
