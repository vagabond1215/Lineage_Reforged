export function getGeographicKnowledgeTierLabel(level) {
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

export function isVisibleGeographicKnowledgeLevel(level) {
  return level > 0;
}

export function getGeographicKnowledgeSectionLabel(scope) {
  switch (scope) {
    case "continent":
      return "Known Lands";
    case "region":
      return "Known Regions";
    case "settlement":
      return "Known Settlements";
  }
}

export function compareGeographicKnowledgeEntries(left, right) {
  if (left.level !== right.level) {
    return right.level - left.level;
  }
  return left.geographyId.localeCompare(right.geographyId);
}
