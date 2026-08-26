import type {
  AshenReefSurveyMaterialVersionsState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";

export type AshenReefSurveyContentVersion =
  AshenReefSurveyMaterialVersionsState["surveyContent"];

export const CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION = 2 as const;

export interface AshenReefSurveyContentFacts {
  version: AshenReefSurveyContentVersion;
  questTitle: string;
  questRegionLabel: string;
  questRewardLabel: string;
  questSummary: string;
  questRewards: string[];
  questRelatedLocations: string[];
  questTags: string[];
  operationTitle: string;
  returnOffice: string;
  regionLabel: string;
  completionNotificationDetail: string;
  completionNoticeDetail: string;
  returnActivityDetail: string;
  codexTags: string[];
  codexRegionTags: string[];
}

const CONTENT_BY_VERSION: Record<
  AshenReefSurveyContentVersion,
  AshenReefSurveyContentFacts
> = {
  1: {
    version: 1,
    questTitle: "Ashen Reef Survey",
    questRegionLabel: "Glasswater",
    questRewardLabel: "580 crown + salvage rights",
    questSummary: "Survey the reef lanes, confirm ruin coordinates, and file a safe-draft chart.",
    questRewards: ["580 crown", "Registered salvage rights"],
    questRelatedLocations: ["Saltmere", "Ashen Reef"],
    questTags: ["Exploration", "Naval"],
    operationTitle: "Ashen Reef Survey",
    returnOffice: "Saltmere Harbor Office",
    regionLabel: "Glasswater",
    completionNotificationDetail:
      "All sectors and ruin markers are logged. Return to Saltmere for payment and codex credit.",
    completionNoticeDetail:
      "Return to Saltmere Harbor Office to turn in the completed chart packet.",
    returnActivityDetail:
      "The field chart is complete and ready to be taken back to Saltmere Harbor Office.",
    codexTags: ["Glasswater", "Alchemy", "Flora"],
    codexRegionTags: ["Glasswater", "Sable Coast"]
  },
  2: {
    version: 2,
    questTitle: "Soundings of Ashen Reef",
    questRegionLabel: "Starfall Isle",
    questRewardLabel: "Paid civic contract - terms set at later turn-in",
    questSummary:
      "After a major seasonal storm, Starfall Harbormaster's Office commissions fresh soundings of Ashen Reef's channels, breakers, draft-safe approaches, and ruin markers before fishing and commercial traffic intensify.",
    questRewards: ["Paid civic contract; exact turn-in terms remain deferred."],
    questRelatedLocations: ["settlement.starfall_port", "location.ashen_reef"],
    questTags: ["Survey", "Starfall Isle", "Civic contract"],
    operationTitle: "Soundings of Ashen Reef",
    returnOffice: "Starfall Harbormaster's Office",
    regionLabel: "Starfall Isle",
    completionNotificationDetail:
      "All sectors and ruin markers are logged. Return the chart packet to Starfall Harbormaster's Office for later turn-in.",
    completionNoticeDetail:
      "Return the completed chart packet to Starfall Harbormaster's Office.",
    returnActivityDetail:
      "The field chart is complete and ready to be taken back to Starfall Harbormaster's Office.",
    codexTags: ["Starfall Isle", "Alchemy", "Flora"],
    codexRegionTags: ["Starfall Isle"]
  }
};

export function getAshenReefSurveyContent(
  version: AshenReefSurveyContentVersion
): AshenReefSurveyContentFacts {
  const content = CONTENT_BY_VERSION[version];
  return {
    ...content,
    questRewards: [...content.questRewards],
    questRelatedLocations: [...content.questRelatedLocations],
    questTags: [...content.questTags],
    codexTags: [...content.codexTags],
    codexRegionTags: [...content.codexRegionTags]
  };
}

export function resolveAshenReefSurveyContentVersion(
  snapshot: SaveSnapshot,
  explicitVersion?: AshenReefSurveyContentVersion
): AshenReefSurveyContentVersion {
  if (explicitVersion !== undefined) return explicitVersion;
  const requests = snapshot.authorityLedger?.ashenReefSurvey?.requests ?? [];
  return requests[requests.length - 1]?.normalizedIntent.materialVersions.surveyContent ??
    CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION;
}

export function buildAshenReefSurveyQuestObjectives(
  version: AshenReefSurveyContentVersion,
  sectorCount: number,
  ruinsConfirmed: boolean,
  readyToTurnIn = false
): string[] {
  const content = getAshenReefSurveyContent(version);
  if (version === 1) {
    return [
      `Survey reef lanes: ${sectorCount} / 3 sectors complete`,
      `Confirm ruin markers: ${ruinsConfirmed ? "complete" : "pending"}`,
      readyToTurnIn
        ? `Return chart packet to ${content.returnOffice}: ready to turn in`
        : `Return chart packet to ${content.returnOffice}`
    ];
  }
  const state = (complete: boolean) => complete ? "complete" : "pending";
  return [
    `Record the Inshore Approach soundings: ${state(sectorCount >= 1)}`,
    `Survey the Working Reef: ${state(sectorCount >= 2)}`,
    `Survey the Outer Passage: ${state(sectorCount >= 3)}`,
    `Verify the Ruin Markers: ${state(ruinsConfirmed)}`,
    readyToTurnIn
      ? `Return chart packet to ${content.returnOffice}: ready to turn in`
      : `Return chart packet to ${content.returnOffice}`
  ];
}
