import type { AccountProfileState, LegacyRenownTier } from "../../../../packages/shared/types/src/index.js";
import {
  resolveLegacyRenownPresence,
  type LegacyRenownPresenceState
} from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";
import regionsCatalog from "../../../../packages/content/base/world/regions.json" with { type: "json" };
import settlementsCatalog from "../../../../packages/content/base/world/settlements.json" with { type: "json" };

type SettlementRecord = {
  id: string;
  name: string;
  regionId?: string;
};

type RegionRecord = {
  id: string;
  name: string;
  regionType?: string;
  parentRegionId?: string;
};

type RenownContext = {
  settlementId?: string | null;
  regionId?: string | null;
  settlementName?: string | null;
  regionName?: string | null;
};

type ResolvedRenownRecognition = {
  tier: LegacyRenownTier;
  rank: number;
  displayName: string;
};

export type RenownPresentationState = {
  chipLabel: string | null;
  overviewValue: string;
  overviewDetail: string;
  worldNote: string | null;
  activityNote: string | null;
};

const settlementRecords = (
  (settlementsCatalog as { records?: unknown[] }).records ?? []
).filter((record): record is SettlementRecord => {
  return (
    typeof record === "object" &&
    record !== null &&
    typeof (record as SettlementRecord).id === "string" &&
    typeof (record as SettlementRecord).name === "string"
  );
});

const regionRecords = (
  (regionsCatalog as { records?: unknown[] }).records ?? []
).filter((record): record is RegionRecord => {
  return (
    typeof record === "object" &&
    record !== null &&
    typeof (record as RegionRecord).id === "string" &&
    typeof (record as RegionRecord).name === "string"
  );
});

const settlementById = new Map(settlementRecords.map((record) => [record.id, record]));
const regionById = new Map(regionRecords.map((record) => [record.id, record]));

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return "Unknown";
  }

  const tail = value.split(".").pop() ?? value;
  return tail
    .split(/[_-]+/)
    .filter(Boolean)
    .map((segment) => `${segment[0]?.toUpperCase() ?? ""}${segment.slice(1)}`)
    .join(" ");
}

function formatRomanNumeral(value: number): string {
  switch (value) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    default:
      return String(value);
  }
}

function resolveContinentIdFromRegion(regionId: string | null | undefined): string | null {
  if (!regionId) {
    return null;
  }

  let currentRegionId: string | undefined | null = regionId;
  let guard = 0;

  while (currentRegionId && guard < 16) {
    const region = regionById.get(currentRegionId);

    if (!region) {
      return null;
    }

    if (region.regionType === "continent" || region.regionType === "island_system") {
      return region.id;
    }

    currentRegionId = region.parentRegionId;
    guard += 1;
  }

  return null;
}

function resolveGeography(context: RenownContext) {
  const settlementId = context.settlementId ?? null;
  const regionId =
    context.regionId ??
    (settlementId ? settlementById.get(settlementId)?.regionId ?? null : null);
  const continentId =
    resolveContinentIdFromRegion(regionId) ??
    resolveContinentIdFromRegion(settlementId ? settlementById.get(settlementId)?.regionId ?? null : null);
  const settlementName =
    context.settlementName?.trim() ||
    (settlementId ? settlementById.get(settlementId)?.name : undefined) ||
    (settlementId ? humanizeId(settlementId) : "this settlement");
  const regionName =
    context.regionName?.trim() ||
    (regionId ? regionById.get(regionId)?.name : undefined) ||
    (regionId ? humanizeId(regionId) : "this region");
  const continentName =
    (continentId ? regionById.get(continentId)?.name : undefined) ||
    (continentId ? humanizeId(continentId) : "this continent");

  return {
    settlementId,
    regionId,
    continentId,
    settlementName,
    regionName,
    continentName
  };
}

function resolveRecognition(
  presence: LegacyRenownPresenceState,
  geography: ReturnType<typeof resolveGeography>
): ResolvedRenownRecognition | null {
  if (presence.settlement && geography.settlementId) {
    return {
      tier: "settlement",
      rank: presence.settlement.rank,
      displayName: presence.settlement.displayName || geography.settlementName
    };
  }

  if (presence.region && geography.regionId) {
    return {
      tier: "region",
      rank: presence.region.rank,
      displayName: presence.region.displayName || geography.regionName
    };
  }

  if (presence.continent && geography.continentId) {
    return {
      tier: "continent",
      rank: presence.continent.rank,
      displayName: presence.continent.displayName || geography.continentName
    };
  }

  if (presence.universalRank > 0) {
    return {
      tier: "universal",
      rank: presence.universalRank,
      displayName: "the wider world"
    };
  }

  return null;
}

function formatTierLabel(tier: LegacyRenownTier): string {
  switch (tier) {
    case "settlement":
      return "Settlement";
    case "region":
      return "Region";
    case "continent":
      return "Continent";
    case "universal":
      return "Universal";
  }
}

function buildBroaderScopeLabels(
  presence: LegacyRenownPresenceState,
  recognition: ResolvedRenownRecognition | null
): string[] {
  const labels: string[] = [];

  if (recognition?.tier !== "region" && presence.region) {
    labels.push(`${presence.region.displayName} ${formatRomanNumeral(presence.region.rank)}`);
  }
  if (recognition?.tier !== "continent" && presence.continent) {
    labels.push(`${presence.continent.displayName} ${formatRomanNumeral(presence.continent.rank)}`);
  }
  if (recognition?.tier !== "universal" && presence.universalRank > 0) {
    labels.push(`Universal ${formatRomanNumeral(presence.universalRank)}`);
  }

  if (recognition?.tier === "settlement" && presence.settlement) {
    return labels;
  }

  return labels.filter((label) => !label.startsWith(recognition?.displayName ?? ""));
}

function buildTopBarChip(
  recognition: ResolvedRenownRecognition | null,
  presence: LegacyRenownPresenceState
): string | null {
  if (!recognition) {
    return null;
  }

  switch (recognition.tier) {
    case "settlement":
      if (presence.flavorFlags.villageName) {
        return `Name known in ${recognition.displayName}`;
      }
      if (presence.flavorFlags.bannerRightsRank > 0) {
        return `Banner known in ${recognition.displayName}`;
      }
      return `Known in ${recognition.displayName}`;
    case "region":
      return presence.flavorFlags.bannerRightsRank > 0
        ? `Banner known in ${recognition.displayName}`
        : `Known in ${recognition.displayName}`;
    case "continent":
      return presence.flavorFlags.bannerRightsRank > 0
        ? `Banner known across ${recognition.displayName}`
        : `Known across ${recognition.displayName}`;
    case "universal":
      return presence.flavorFlags.veteranReputation ? "Veteran name known widely" : "Known widely";
  }
}

function buildWorldNote(
  recognition: ResolvedRenownRecognition | null,
  presence: LegacyRenownPresenceState
): string | null {
  if (!recognition) {
    return null;
  }

  switch (recognition.tier) {
    case "settlement":
      if (presence.flavorFlags.villageName) {
        return `Recognition: ${recognition.displayName} knows the family name.`;
      }
      if (presence.flavorFlags.bannerRightsRank > 0) {
        return `Recognition: ${recognition.displayName} knows the banner.`;
      }
      if (presence.flavorFlags.veteranReputation) {
        return `Recognition: ${recognition.displayName} remembers the line as proven.`;
      }
      return `Recognition: ${recognition.displayName} knows the line.`;
    case "region":
      if (presence.flavorFlags.bannerRightsRank > 0) {
        return `Recognition: ${recognition.displayName} knows the banner across the region.`;
      }
      if (presence.flavorFlags.veteranReputation) {
        return `Recognition: ${recognition.displayName} remembers the line beyond local roads.`;
      }
      return `Recognition: ${recognition.displayName} knows the line here.`;
    case "continent":
      return presence.flavorFlags.bannerRightsRank > 0
        ? `Recognition: ${recognition.displayName} still knows the banner.`
        : `Recognition: ${recognition.displayName} still knows the line.`;
    case "universal":
      return "Recognition: The line is known even this far from home.";
  }
}

function buildActivityNote(
  recognition: ResolvedRenownRecognition | null,
  presence: LegacyRenownPresenceState
): string | null {
  if (!recognition) {
    return null;
  }

  if (presence.flavorFlags.veteranReputation) {
    switch (recognition.tier) {
      case "settlement":
        return "Reception: service folk here take the line more seriously.";
      case "region":
        return "Reception: this region treats the line as proven.";
      case "continent":
      case "universal":
        return "Reception: the line earns a respectful hearing here.";
    }
  }

  if (presence.flavorFlags.villageName) {
    switch (recognition.tier) {
      case "settlement":
        return "Reception: a known family name smooths the room.";
      case "region":
        return "Reception: the family name already carries through this region.";
      case "continent":
      case "universal":
        return "Reception: the family name still opens doors here.";
    }
  }

  if (presence.flavorFlags.bannerRightsRank > 0) {
    switch (recognition.tier) {
      case "settlement":
        return "Reception: formal courtesies come easier here.";
      case "region":
      case "continent":
      case "universal":
        return "Reception: the banner still draws formal regard.";
    }
  }

  switch (recognition.tier) {
    case "settlement":
      return "Reception: the line is received more warmly here.";
    case "region":
      return "Reception: this region already knows the line.";
    case "continent":
      return "Reception: the line still earns a respectful hearing.";
    case "universal":
      return "Reception: even here, the line draws quiet recognition.";
  }
}

function buildOverview(
  recognition: ResolvedRenownRecognition | null,
  presence: LegacyRenownPresenceState
): { value: string; detail: string } {
  if (!recognition) {
    return {
      value: "None",
      detail: "No Renown applies at the current location."
    };
  }

  const broaderScopes = buildBroaderScopeLabels(presence, recognition);
  const detail =
    broaderScopes.length > 0
      ? `Primary reach: ${recognition.displayName}. Wider scope: ${broaderScopes.join(", ")}.`
      : recognition.tier === "universal"
        ? "Recognition extends beyond local geography."
        : `Primary reach: ${recognition.displayName}.`;

  return {
    value: `${formatTierLabel(recognition.tier)} ${formatRomanNumeral(recognition.rank)}`,
    detail
  };
}

export function resolveRenownPresentation(
  profile: AccountProfileState,
  context: RenownContext
): RenownPresentationState {
  const geography = resolveGeography(context);
  const presence = resolveLegacyRenownPresence(profile, {
    settlementId: geography.settlementId,
    regionId: geography.regionId,
    continentId: geography.continentId
  });
  const recognition = resolveRecognition(presence, geography);
  const overview = buildOverview(recognition, presence);

  return {
    chipLabel: buildTopBarChip(recognition, presence),
    overviewValue: overview.value,
    overviewDetail: overview.detail,
    worldNote: buildWorldNote(recognition, presence),
    activityNote: buildActivityNote(recognition, presence)
  };
}
