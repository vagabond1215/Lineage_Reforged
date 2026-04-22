import type { GeographicKnowledgeScope, PlayerGeographicKnowledgeState } from "../../../../packages/shared/types/src/contracts.js";

export type GeographicKnowledgeTierId =
  | "unaware"
  | "unfamiliar"
  | "familiar"
  | "knowledgeable"
  | "seasoned"
  | "intimate";

export function getGeographicKnowledgeTierLabel(level: number): string {
  if (level <= 0) {
    return "Unaware";
  }

  if (level === 1) {
    return "Unfamiliar";
  }

  if (level === 2) {
    return "Familiar";
  }

  if (level === 3) {
    return "Knowledgeable";
  }

  if (level === 4) {
    return "Seasoned";
  }

  return "Intimate";
}

export function isVisibleGeographicKnowledgeLevel(level: number): boolean {
  return level > 0;
}

export function getGeographicKnowledgeSectionLabel(scope: GeographicKnowledgeScope): string {
  switch (scope) {
    case "continent":
      return "Known Lands";
    case "region":
      return "Known Regions";
    case "settlement":
      return "Known Settlements";
  }
}

export function compareGeographicKnowledgeEntries(
  left: PlayerGeographicKnowledgeState,
  right: PlayerGeographicKnowledgeState
): number {
  if (left.level !== right.level) {
    return right.level - left.level;
  }

  return left.geographyId.localeCompare(right.geographyId);
}
