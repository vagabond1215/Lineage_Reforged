import type {
  KnownLocationState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";

export const ASHEN_REEF_SURVEY_ACCESS_LOCATION: KnownLocationState = {
  id: "location.ashen_reef",
  name: "Ashen Reef",
  regionId: "region.starfall_isle",
  regionLabel: "Starfall Isle",
  type: "ruin",
  x: 68,
  y: 58,
  note: "Survey anchorage and reef approach authorized for Soundings of Ashen Reef.",
  known: true
};

export interface AshenReefSurveyTravelAccessFacts {
  locationId: "location.ashen_reef";
  posture: "established" | "already_known";
}

export type AshenReefSurveyTravelAccessResult =
  | {
      accepted: true;
      applies: boolean;
      facts: AshenReefSurveyTravelAccessFacts | null;
      snapshot: SaveSnapshot;
    }
  | {
      accepted: false;
      applies: true;
      code: "travel_access_conflict";
      reason: string;
      facts: null;
      snapshot: SaveSnapshot;
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

export function establishAshenReefSurveyTravelAccess(
  snapshot: SaveSnapshot,
  questId: string
): AshenReefSurveyTravelAccessResult {
  if (questId !== "quest.ashen_reef_survey") {
    return { accepted: true, applies: false, facts: null, snapshot };
  }
  const matches = snapshot.sessionState.knownLocations.filter(
    (entry) => entry.id === ASHEN_REEF_SURVEY_ACCESS_LOCATION.id
  );
  if (matches.length > 1) {
    return {
      accepted: false,
      applies: true,
      code: "travel_access_conflict",
      reason: "Duplicate Ashen Reef access rows conflict with quest acceptance.",
      facts: null,
      snapshot
    };
  }
  const existing = matches[0];
  if (existing) {
    const expectedUnknown = { ...ASHEN_REEF_SURVEY_ACCESS_LOCATION, known: false };
    if (
      stable(existing) !== stable(ASHEN_REEF_SURVEY_ACCESS_LOCATION) &&
      stable(existing) !== stable(expectedUnknown)
    ) {
      return {
        accepted: false,
        applies: true,
        code: "travel_access_conflict",
        reason: "Existing Ashen Reef access facts conflict with the accepted survey authority.",
        facts: null,
        snapshot
      };
    }
    if (existing.known) {
      return {
        accepted: true,
        applies: true,
        facts: { locationId: "location.ashen_reef", posture: "already_known" },
        snapshot
      };
    }
    return {
      accepted: true,
      applies: true,
      facts: { locationId: "location.ashen_reef", posture: "established" },
      snapshot: {
        ...snapshot,
        sessionState: {
          ...snapshot.sessionState,
          knownLocations: snapshot.sessionState.knownLocations.map((entry) =>
            entry.id === ASHEN_REEF_SURVEY_ACCESS_LOCATION.id
              ? { ...entry, known: true }
              : entry
          )
        }
      }
    };
  }
  return {
    accepted: true,
    applies: true,
    facts: { locationId: "location.ashen_reef", posture: "established" },
    snapshot: {
      ...snapshot,
      sessionState: {
        ...snapshot.sessionState,
        knownLocations: [
          ...snapshot.sessionState.knownLocations,
          structuredClone(ASHEN_REEF_SURVEY_ACCESS_LOCATION)
        ]
      }
    }
  };
}
