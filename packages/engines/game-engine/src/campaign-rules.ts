import type {
  CampaignIdentityState,
  CampaignRulesState,
  RunDifficultyState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";

export const TARGET_SNAPSHOT_FORMAT = "lineage.save_snapshot.v2";
export const CAMPAIGN_RULES_VERSION = 2 as const;
export const STAKES_POLICY_REVISION = 1 as const;

export function createAuthorityId(scope: string): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID !== "function") {
    throw new Error(`Cannot create ${scope}: crypto.randomUUID() is unavailable.`);
  }

  return `${scope}.${randomUUID.call(globalThis.crypto)}`;
}

export function mapLegacyDifficulty(
  value: RunDifficultyState | null | undefined
): CampaignRulesState["difficultyPreset"] {
  switch (value?.tier) {
    case "easy":
      return "favored";
    case "hard":
    case "brutal":
      return "forsaken";
    case "normal":
    default:
      return "mortal";
  }
}

export function createCampaignRules(params: {
  source: CampaignRulesState["source"];
  legacyDifficulty?: RunDifficultyState | null;
  recordedAt?: string;
}): CampaignRulesState {
  const legacyDifficulty = params.legacyDifficulty ?? null;
  const difficultyPreset = mapLegacyDifficulty(legacyDifficulty);

  return {
    version: CAMPAIGN_RULES_VERSION,
    policyRevision: STAKES_POLICY_REVISION,
    difficultyPreset,
    worldRules: "heroic_world",
    stakesRules: "normal_stakes",
    source: params.source,
    overrides:
      legacyDifficulty?.tier === "brutal"
        ? [
            {
              owner: "difficulty",
              key: "legacy_brutal",
              value: true,
              source:
                params.source === "developer_fixture"
                  ? "developer_fixture"
                  : "legacy_migration",
              basePreset: "forsaken",
              rulesVersion: CAMPAIGN_RULES_VERSION
            }
          ]
        : [],
    ...(params.source === "legacy_migration"
      ? {
          migration: {
            source: "legacy_v6" as const,
            sourceDifficulty:
              legacyDifficulty?.tier ?? "missing_or_invalid",
            legacyHardcore: legacyDifficulty?.hardcore === true,
            migratedAt: params.recordedAt ?? new Date().toISOString(),
            targetRulesVersion: CAMPAIGN_RULES_VERSION
          }
        }
      : {})
  };
}

export function createCampaignIdentity(
  characterId: string
): CampaignIdentityState {
  return {
    campaignId: createAuthorityId("campaign"),
    continuityId: createAuthorityId("continuity"),
    characterId
  };
}

export function initializeTargetCampaignSnapshot(
  snapshot: SaveSnapshot,
  params: {
    source: CampaignRulesState["source"];
    identity?: CampaignIdentityState;
    recordedAt?: string;
  }
): SaveSnapshot {
  const identity =
    params.identity ?? createCampaignIdentity(snapshot.playerState.playerId);

  return {
    ...snapshot,
    snapshotVersion: TARGET_SNAPSHOT_FORMAT,
    campaignRules: createCampaignRules({
      source: params.source,
      legacyDifficulty: snapshot.gameState.runDifficulty,
      ...(params.recordedAt ? { recordedAt: params.recordedAt } : {})
    }),
    campaignIdentity: identity,
    authorityLedger: snapshot.authorityLedger ?? {
      version: 1,
      entries: []
    },
    normalDefeatReceipts: snapshot.normalDefeatReceipts ?? []
  };
}

export function isTargetCampaignSnapshot(
  snapshot: SaveSnapshot
): boolean {
  const rules = snapshot.campaignRules;
  return (
    snapshot.snapshotVersion === TARGET_SNAPSHOT_FORMAT &&
    rules?.version === CAMPAIGN_RULES_VERSION &&
    rules.policyRevision === STAKES_POLICY_REVISION &&
    (rules.difficultyPreset === "favored" ||
      rules.difficultyPreset === "mortal" ||
      rules.difficultyPreset === "forsaken") &&
    rules.worldRules === "heroic_world" &&
    rules.stakesRules === "normal_stakes" &&
    (rules.source === "new_campaign" ||
      rules.source === "legacy_migration" ||
      rules.source === "developer_fixture") &&
    Array.isArray(rules.overrides) &&
    rules.overrides.every(
      (override) =>
        override.owner === "difficulty" &&
        override.key === "legacy_brutal" &&
        override.value === true &&
        (override.source === "legacy_migration" ||
          override.source === "developer_fixture") &&
        override.basePreset === "forsaken" &&
        override.rulesVersion === CAMPAIGN_RULES_VERSION
    ) &&
    (rules.source !== "legacy_migration" ||
      (rules.migration?.source === "legacy_v6" &&
        rules.migration.targetRulesVersion ===
          CAMPAIGN_RULES_VERSION &&
        typeof rules.migration.legacyHardcore === "boolean" &&
        typeof rules.migration.migratedAt === "string")) &&
    snapshot.campaignIdentity?.characterId === snapshot.playerState.playerId &&
    snapshot.campaignIdentity.campaignId.length > 0 &&
    snapshot.campaignIdentity.continuityId.length > 0 &&
    snapshot.authorityLedger?.version === 1 &&
    Array.isArray(snapshot.authorityLedger.entries) &&
    Array.isArray(snapshot.normalDefeatReceipts)
  );
}
