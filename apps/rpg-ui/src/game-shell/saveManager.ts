import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../../../packages/shared/persistence/src/index.js";
import type {
  CampaignIdentityState,
  CampaignPublicationConsumerKind,
  SaveSnapshot
} from "../../../../packages/shared/types/src/index.js";
import {
  TARGET_SNAPSHOT_FORMAT,
  createAuthorityId,
  initializeTargetCampaignSnapshot,
  isTargetCampaignSnapshot
} from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import {
  createCampaignSessionControl,
  type CampaignSessionControl
} from "../../../../packages/engines/game-engine/src/campaign-session.js";
import {
  hasPendingNormalDefeat,
  resolveNormalDefeat
} from "../../../../packages/engines/game-engine/src/normal-defeat.js";
import type {
  VerifiedCampaignPublication
} from "../../../../packages/engines/game-engine/src/account-publication.js";
import {
  createDefaultPlayerBodyState,
  createRunDifficultyState,
  syncPlayerRuntimeState
} from "../../../../packages/engines/player-engine/src/index.js";
import {
  loadAccountProfile,
  saveAccountProfile
} from "./accountProfileManager.js";
import {
  SAVE_SLOT_ORDER,
  type SaveSlotId,
  type SaveSlotKind,
  type SaveSlotMetadata,
  type SaveSlotStatus,
  type SaveSlotSummary
} from "./state.js";

type LegacyStoredSaveEnvelope = {
  version: 6;
  accountId: string;
  slotId: SaveSlotId;
  savedAt: string;
  metadata: SaveSlotMetadata;
  snapshot: string;
};

type StoredSaveEnvelope = {
  version: 7;
  accountId: string;
  slotId: SaveSlotId;
  savedAt: string;
  metadata: SaveSlotMetadata;
  snapshotFormatId: typeof TARGET_SNAPSHOT_FORMAT;
  campaignId: string;
  continuityId: string;
  characterId: string;
  artifactId: string;
  generationId: string;
  publicationId: string;
  headRevision: number;
  terminal: boolean;
  snapshot: string;
};

type StoredCampaignControl = {
  version: 1;
  accountId: string;
  campaignId: string;
  headArtifactId: string;
  headPublicationId: string;
  headRevision: number;
  previousHeadArtifactId: string | null;
  previousHeadPublicationId: string | null;
  closed: boolean;
  updatedAt: string;
};

export type CampaignPublicationConsumerPlan = {
  kind: CampaignPublicationConsumerKind;
  payloadFingerprint: string;
};

type StoredPublicationRecovery = {
  version: 1;
  accountId: string;
  campaignId: string;
  slotId: SaveSlotId;
  artifactId: string;
  generationId: string;
  publicationId: string;
  headRevision: number;
  terminal: boolean;
  envelopeRaw: string;
  status: "artifact_verified" | "head_verified" | "address_verified";
  consumerPlans: CampaignPublicationConsumerPlan[];
  completedConsumerKinds: CampaignPublicationConsumerKind[];
  createdAt: string;
  updatedAt: string;
};

type LegacyMigrationReceipt = {
  version: 1;
  accountId: string;
  legacyCharacterId: string;
  campaignIdentity: CampaignIdentityState;
  groupFingerprint: string;
  historyStartedAt: string;
  sourceSlotIds: SaveSlotId[];
  sourceFingerprints: Record<string, string>;
  headSlotId: SaveSlotId;
  artifacts: Record<
    string,
    {
      artifactId: string;
      generationId: string;
      publicationId: string;
    }
  >;
  status: "pending" | "applied";
  createdAt: string;
  appliedAt?: string;
};

export type LoadedCampaignSave = {
  snapshot: SaveSnapshot;
  sessionControl: CampaignSessionControl;
  publication: VerifiedCampaignPublication;
  migratedLegacy: boolean;
  repairedLegacyDefeat: boolean;
};

export type PublishedCampaignSave = {
  slot: SaveSlotSummary;
  snapshot: SaveSnapshot;
  sessionControl: CampaignSessionControl;
  publication: VerifiedCampaignPublication | null;
  boundExistingArtifact: boolean;
};

export type PendingCampaignPublicationRecovery = {
  publication: VerifiedCampaignPublication;
  slotId: SaveSlotId;
  terminal: boolean;
  snapshot: SaveSnapshot;
  consumerPlans: CampaignPublicationConsumerPlan[];
};

const STORAGE_PREFIX = "cataclysm-rpg-ui.saves.v7";
const LEGACY_STORAGE_PREFIX = "cataclysm-rpg-ui.saves.v6";
const OBSOLETE_STORAGE_PREFIXES = [
  "cataclysm-rpg-ui.saves.v5",
  "cataclysm-rpg-ui.saves.v4",
  "cataclysm-rpg-ui.saves.v3",
  "cataclysm-rpg-ui.saves.v2",
  "cataclysm-rpg-ui.saves.v1",
  "cataclysm-rpg-ui.save-slot"
] as const;
const CURRENT_SNAPSHOT_VERSION = TARGET_SNAPSHOT_FORMAT;
const monthNames = [
  "Deepfrost",
  "Thawrise",
  "Seedcall",
  "Rainmere",
  "Suncrest",
  "Highbloom",
  "Harvestfall",
  "Redleaf",
  "Frostwane",
  "Longnight",
  "Emberwane",
  "Stormwane",
  "Yearsend"
];

type SaveInspectResult =
  | {
      status: "empty";
      envelope: null;
      snapshot: null;
    }
  | {
      status: "ready";
      envelope: StoredSaveEnvelope | LegacyStoredSaveEnvelope;
      snapshot: SaveSnapshot;
    }
  | {
      status: "corrupt";
      envelope: null;
      snapshot: null;
    }
  | {
      status: "incompatible";
      envelope: null;
      snapshot: null;
    };

function getStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Local save storage is only available in the browser.");
  }

  return window.localStorage;
}

function getStorageKey(accountId: string, slotId: SaveSlotId): string {
  return `${STORAGE_PREFIX}.account.${accountId}.slot.${slotId}`;
}

function getLegacyStorageKey(accountId: string, slotId: SaveSlotId): string {
  return `${LEGACY_STORAGE_PREFIX}.account.${accountId}.slot.${slotId}`;
}

function getCampaignControlKey(accountId: string, campaignId: string): string {
  return `${STORAGE_PREFIX}.account.${accountId}.campaign.${campaignId}.control`;
}

function getPublicationRecoveryKey(
  accountId: string,
  campaignId: string
): string {
  return `${STORAGE_PREFIX}.account.${accountId}.campaign.${campaignId}.publication-recovery`;
}

function getArtifactStorageKey(accountId: string, artifactId: string): string {
  return `${STORAGE_PREFIX}.account.${accountId}.artifact.${artifactId}`;
}

function getCandidateStorageKey(accountId: string, generationId: string): string {
  return `${STORAGE_PREFIX}.account.${accountId}.candidate.${generationId}`;
}

function getMigrationReceiptKey(
  accountId: string,
  legacyCharacterId: string
): string {
  return `${STORAGE_PREFIX}.account.${accountId}.migration.${legacyCharacterId}`;
}

function getMigrationSourceKey(
  accountId: string,
  legacyCharacterId: string,
  slotId: SaveSlotId
): string {
  return `${STORAGE_PREFIX}.account.${accountId}.migration-source.${legacyCharacterId}.${slotId}`;
}

function getObsoleteStorageKeys(slotId: SaveSlotId): string[] {
  return [
    `${OBSOLETE_STORAGE_PREFIXES[0]}.slot.${slotId}`,
    `${OBSOLETE_STORAGE_PREFIXES[1]}.slot.${slotId}`,
    `${OBSOLETE_STORAGE_PREFIXES[2]}.${slotId}`,
    `${OBSOLETE_STORAGE_PREFIXES[3]}.${slotId}`,
    `${OBSOLETE_STORAGE_PREFIXES[4]}.${slotId}`
  ];
}

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return "Unknown";
  }

  const segments = value.split(".");
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split("_")
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatSavedAt(savedAt: string): string {
  const parsed = new Date(savedAt);

  if (Number.isNaN(parsed.valueOf())) {
    return "Unknown save time";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(parsed);
}

function formatPlaytime(totalPlayTicks: number): string {
  return `${new Intl.NumberFormat("en-US").format(totalPlayTicks)} ticks played`;
}

function formatInGameDate(snapshot: SaveSnapshot): string {
  const monthLabel = monthNames[snapshot.clock.month - 1] ?? `Month ${snapshot.clock.month}`;
  return `${snapshot.clock.day} ${monthLabel}, Year ${snapshot.clock.year}`;
}

function formatFunds(snapshot: SaveSnapshot): string {
  const { gold, silver, copper } = snapshot.playerState.currency;
  const numberFormat = new Intl.NumberFormat("en-US");
  const parts: string[] = [];

  if (gold > 0 || (silver === 0 && copper === 0)) {
    parts.push(`${numberFormat.format(gold)}g`);
  }

  if (silver > 0) {
    parts.push(`${numberFormat.format(silver)}s`);
  }

  if (copper > 0) {
    parts.push(`${numberFormat.format(copper)}c`);
  }

  return parts.join(" ");
}

function formatSexLabel(snapshot: SaveSnapshot): string {
  return humanizeId(snapshot.playerState.coreData.sexId);
}

function getStartingSettlementId(snapshot: SaveSnapshot): string | null {
  const startFlag = snapshot.playerState.flags.find(
    (flag) =>
      flag.startsWith("player.start.") &&
      !flag.startsWith("player.start_authority.") &&
      !flag.startsWith("player.start_mode.")
  );

  if (!startFlag) {
    return null;
  }

  return startFlag.slice("player.start.".length) || null;
}

function getStartingSettlementLabel(snapshot: SaveSnapshot): string | null {
  const startingSettlementId = getStartingSettlementId(snapshot);

  if (startingSettlementId) {
    return humanizeId(startingSettlementId);
  }

  const firstKnownLocation = snapshot.sessionState.knownLocations[0];

  if (firstKnownLocation?.name) {
    return firstKnownLocation.name;
  }

  return snapshot.playerState.location.settlementId
    ? humanizeId(snapshot.playerState.location.settlementId)
    : null;
}

function getCurrentLocationLabel(snapshot: SaveSnapshot): string | null {
  const siteLabel = snapshot.playerState.location.siteLabel?.trim() || null;
  const settlementLabel = snapshot.playerState.location.settlementId
    ? humanizeId(snapshot.playerState.location.settlementId)
    : null;

  if (siteLabel && settlementLabel && siteLabel !== settlementLabel) {
    return `${siteLabel}, ${settlementLabel}`;
  }

  return siteLabel ?? settlementLabel ?? humanizeId(snapshot.playerState.regionId);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSaveSnapshot(value: unknown): value is SaveSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.accountId === "string" &&
    typeof value.snapshotVersion === "string" &&
    typeof value.capturedAtTick === "number" &&
    isRecord(value.clock) &&
    typeof value.clock.tick === "number" &&
    typeof value.clock.day === "number" &&
    typeof value.clock.month === "number" &&
    typeof value.clock.year === "number" &&
    isRecord(value.gameState) &&
    typeof value.gameState.worldVersion === "string" &&
    typeof value.gameState.activeScenario === "string" &&
    isRecord(value.playerState) &&
    isRecord(value.playerState.coreData) &&
    typeof value.playerState.coreData.playerName === "string" &&
    isRecord(value.playerState.progression) &&
    typeof value.playerState.progression.level === "number" &&
    isRecord(value.playerState.location) &&
    isRecord(value.playerState.combatProfile) &&
    typeof value.playerState.combatProfile.preferredMode === "string" &&
    isRecord(value.playerState.saveMeta) &&
    typeof value.playerState.saveMeta.totalPlayTicks === "number" &&
    isRecord(value.sessionState) &&
    isRecord(value.sessionState.combatUi)
  );
}

function isSaveSlotMetadata(value: unknown): value is SaveSlotMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.slotId === "string" &&
    typeof value.characterName === "string" &&
    typeof value.level === "number" &&
    typeof value.regionLabel === "string" &&
    (typeof value.sexLabel === "string" || value.sexLabel === null || value.sexLabel === undefined) &&
    (typeof value.startingSettlementLabel === "string" ||
      value.startingSettlementLabel === null ||
      value.startingSettlementLabel === undefined) &&
    (typeof value.currentLocationLabel === "string" ||
      value.currentLocationLabel === null ||
      value.currentLocationLabel === undefined) &&
    (typeof value.gold === "number" || value.gold === undefined) &&
    (typeof value.fundsLabel === "string" || value.fundsLabel === undefined) &&
    typeof value.inGameDate === "string" &&
    typeof value.totalPlayTicks === "number" &&
    typeof value.capturedAtTick === "number" &&
    typeof value.lastSavedAt === "string" &&
    typeof value.snapshotVersion === "string"
  );
}

function isStoredSaveEnvelope(value: unknown): value is StoredSaveEnvelope {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 7 &&
    typeof value.accountId === "string" &&
    typeof value.slotId === "string" &&
    typeof value.savedAt === "string" &&
    typeof value.snapshot === "string" &&
    value.snapshotFormatId === TARGET_SNAPSHOT_FORMAT &&
    typeof value.campaignId === "string" &&
    typeof value.continuityId === "string" &&
    typeof value.characterId === "string" &&
    typeof value.artifactId === "string" &&
    typeof value.generationId === "string" &&
    typeof value.publicationId === "string" &&
    typeof value.headRevision === "number" &&
    typeof value.terminal === "boolean" &&
    isSaveSlotMetadata(value.metadata)
  );
}

function isLegacyStoredSaveEnvelope(
  value: unknown
): value is LegacyStoredSaveEnvelope {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 6 &&
    typeof value.accountId === "string" &&
    typeof value.slotId === "string" &&
    typeof value.savedAt === "string" &&
    typeof value.snapshot === "string" &&
    isSaveSlotMetadata(value.metadata)
  );
}

function isStoredCampaignControl(
  value: unknown
): value is StoredCampaignControl {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.accountId === "string" &&
    typeof value.campaignId === "string" &&
    typeof value.headArtifactId === "string" &&
    typeof value.headPublicationId === "string" &&
    typeof value.headRevision === "number" &&
    (typeof value.previousHeadArtifactId === "string" ||
      value.previousHeadArtifactId === null) &&
    (typeof value.previousHeadPublicationId === "string" ||
      value.previousHeadPublicationId === null) &&
    typeof value.closed === "boolean" &&
    typeof value.updatedAt === "string"
  );
}

function isCampaignPublicationConsumerKind(
  value: unknown
): value is CampaignPublicationConsumerKind {
  return (
    value === "active_history" ||
    value === "account_achievements" ||
    value === "legacy_rewards" ||
    value === "preparation_consumption" ||
    value === "inheritance_consumption" ||
    value === "retirement_settlement" ||
    value === "estate" ||
    value === "last_played"
  );
}

function isStoredPublicationRecovery(
  value: unknown
): value is StoredPublicationRecovery {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.accountId === "string" &&
    typeof value.campaignId === "string" &&
    typeof value.slotId === "string" &&
    typeof value.artifactId === "string" &&
    typeof value.generationId === "string" &&
    typeof value.publicationId === "string" &&
    typeof value.headRevision === "number" &&
    typeof value.terminal === "boolean" &&
    typeof value.envelopeRaw === "string" &&
    (value.status === "artifact_verified" ||
      value.status === "head_verified" ||
      value.status === "address_verified") &&
    Array.isArray(value.consumerPlans) &&
    value.consumerPlans.every(
      (plan) =>
        isRecord(plan) &&
        isCampaignPublicationConsumerKind(plan.kind) &&
        typeof plan.payloadFingerprint === "string"
    ) &&
    Array.isArray(value.completedConsumerKinds) &&
    value.completedConsumerKinds.every(isCampaignPublicationConsumerKind) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function readPublicationRecovery(
  accountId: string,
  campaignId: string
): StoredPublicationRecovery | null {
  const raw = getStorage().getItem(
    getPublicationRecoveryKey(accountId, campaignId)
  );
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !isStoredPublicationRecovery(parsed) ||
      parsed.accountId !== accountId ||
      parsed.campaignId !== campaignId
    ) {
      throw new Error("Campaign publication recovery evidence is invalid.");
    }
    return parsed;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Campaign publication recovery evidence is invalid.");
  }
}

function writePublicationRecovery(
  storage: Storage,
  recovery: StoredPublicationRecovery
): void {
  writeAndVerify(
    storage,
    getPublicationRecoveryKey(
      recovery.accountId,
      recovery.campaignId
    ),
    JSON.stringify(recovery)
  );
}

function readVerifiedArtifactForAddress(
  storage: Storage,
  accountId: string,
  address: StoredSaveEnvelope
): {
  envelope: StoredSaveEnvelope;
  snapshot: SaveSnapshot;
  raw: string;
} | null {
  const raw = storage.getItem(
    getArtifactStorageKey(accountId, address.artifactId)
  );
  if (!raw) {
    return null;
  }
  try {
    const artifact = JSON.parse(raw) as unknown;
    if (
      !isStoredSaveEnvelope(artifact) ||
      artifact.accountId !== accountId ||
      artifact.artifactId !== address.artifactId ||
      artifact.generationId !== address.generationId ||
      artifact.publicationId !== address.publicationId ||
      artifact.campaignId !== address.campaignId ||
      artifact.continuityId !== address.continuityId ||
      artifact.characterId !== address.characterId ||
      artifact.headRevision !== address.headRevision ||
      artifact.terminal !== address.terminal ||
      artifact.savedAt !== address.savedAt ||
      artifact.snapshotFormatId !== address.snapshotFormatId ||
      artifact.snapshot !== address.snapshot
    ) {
      return null;
    }
    const snapshot = deserializeSnapshot(artifact.snapshot);
    return isTargetCampaignSnapshot(snapshot)
      ? { envelope: artifact, snapshot, raw }
      : null;
  } catch {
    return null;
  }
}

function migrateSnapshotForEcho(snapshot: SaveSnapshot): SaveSnapshot {
  const persistedResourceCurrent = {
    hp: snapshot.playerState.resources.hp.current,
    mp: snapshot.playerState.resources.mp.current,
    stamina: snapshot.playerState.resources.stamina.current
  };
  snapshot.gameState.runDifficulty = createRunDifficultyState(snapshot.gameState.runDifficulty);
  snapshot.playerState.bodyState = snapshot.playerState.bodyState ?? createDefaultPlayerBodyState({
    tick: snapshot.clock.tick,
    day: snapshot.clock.day,
    lineageId: snapshot.playerState.coreData.lineageId,
    runDifficulty: snapshot.gameState.runDifficulty
  });
  syncPlayerRuntimeState(
    snapshot.playerState,
    snapshot.clock.tick,
    snapshot.clock.day,
    [],
    snapshot.gameState.runDifficulty
  );
  snapshot.playerState.resources.hp.current = persistedResourceCurrent.hp;
  snapshot.playerState.resources.mp.current = persistedResourceCurrent.mp;
  snapshot.playerState.resources.stamina.current =
    persistedResourceCurrent.stamina;
  return snapshot;
}

function createSlotSummary(
  slot: {
    id: SaveSlotId;
    label: string;
    kind: SaveSlotKind;
  },
  status: SaveSlotStatus,
  metadata: SaveSlotMetadata | null
): SaveSlotSummary {
  return {
    id: slot.id,
    label: slot.label,
    kind: slot.kind,
    status,
    hasSave: status === "ready" && metadata !== null,
    metadata,
    playerName: metadata?.characterName ?? null,
    lineageLabel: metadata?.lineageLabel ?? null,
    sexLabel: metadata?.sexLabel ?? null,
    classLabel: metadata?.classLabel ?? null,
    backstoryLabel: metadata?.backstoryLabel ?? null,
    startingBundleLabel: metadata?.startingBundleLabel ?? null,
    level: metadata?.level ?? null,
    regionLabel: metadata?.regionLabel ?? null,
    settlementLabel: metadata?.settlementLabel ?? null,
    startingSettlementLabel: metadata?.startingSettlementLabel ?? null,
    currentLocationLabel: metadata?.currentLocationLabel ?? null,
    gold: metadata?.gold ?? null,
    fundsLabel: metadata?.fundsLabel ?? null,
    inGameDate: metadata?.inGameDate ?? null,
    lastSavedAt: metadata?.lastSavedAt ?? null,
    lastSavedLabel: metadata ? formatSavedAt(metadata.lastSavedAt) : null,
    playtimeLabel: metadata ? formatPlaytime(metadata.totalPlayTicks) : null,
    capturedAtTick: metadata?.capturedAtTick ?? null,
    snapshotVersion: metadata?.snapshotVersion ?? null
  };
}

function normalizeSaveMetadata(
  slotId: SaveSlotId,
  snapshot: SaveSnapshot,
  metadata: SaveSlotMetadata,
  savedAt: string
): SaveSlotMetadata {
  const derivedMetadata = buildSaveMetadata(slotId, snapshot);

  return {
    ...derivedMetadata,
    ...metadata,
    slotId,
    sexLabel: metadata.sexLabel ?? derivedMetadata.sexLabel,
    startingSettlementLabel:
      metadata.startingSettlementLabel ?? derivedMetadata.startingSettlementLabel,
    currentLocationLabel:
      metadata.currentLocationLabel ?? derivedMetadata.currentLocationLabel,
    fundsLabel: metadata.fundsLabel ?? derivedMetadata.fundsLabel,
    lastSavedAt: metadata.lastSavedAt ?? savedAt
  };
}

function inspectStoredSave(accountId: string, slotId: SaveSlotId): SaveInspectResult {
  const storage = getStorage();
  const targetRawValue = storage.getItem(getStorageKey(accountId, slotId));
  const legacyRawValue = storage.getItem(getLegacyStorageKey(accountId, slotId));
  const rawValue = targetRawValue ?? legacyRawValue;

  if (!rawValue) {
    if (getObsoleteStorageKeys(slotId).some((key) => storage.getItem(key) !== null)) {
      return {
        status: "incompatible",
        envelope: null,
        snapshot: null
      };
    }

    return {
      status: "empty",
      envelope: null,
      snapshot: null
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    const isTargetEnvelope = isStoredSaveEnvelope(parsed);
    const isLegacyEnvelope = isLegacyStoredSaveEnvelope(parsed);

    if (
      (!isTargetEnvelope && !isLegacyEnvelope) ||
      parsed.accountId !== accountId ||
      parsed.slotId !== slotId ||
      parsed.metadata.slotId !== slotId
    ) {
      return {
        status: "corrupt",
        envelope: null,
        snapshot: null
      };
    }

    if (
      isTargetEnvelope &&
      !readVerifiedArtifactForAddress(storage, accountId, parsed)
    ) {
      return {
        status: "corrupt",
        envelope: null,
        snapshot: null
      };
    }

    const snapshot = migrateSnapshotForEcho(deserializeSnapshot(parsed.snapshot));

    if (!isSaveSnapshot(snapshot) || snapshot.accountId !== accountId) {
      return {
        status: "corrupt",
        envelope: null,
        snapshot: null
      };
    }

    if (
      isTargetEnvelope &&
      (!isTargetCampaignSnapshot(snapshot) ||
        snapshot.snapshotVersion !== CURRENT_SNAPSHOT_VERSION ||
        parsed.snapshotFormatId !== snapshot.snapshotVersion ||
        parsed.campaignId !== snapshot.campaignIdentity?.campaignId ||
        parsed.continuityId !== snapshot.campaignIdentity?.continuityId ||
        parsed.characterId !== snapshot.playerState.playerId)
    ) {
      return {
        status: "corrupt",
        envelope: null,
        snapshot: null
      };
    }

    if (
      isLegacyEnvelope &&
      snapshot.snapshotVersion !== "0.6.0"
    ) {
      return {
        status: "incompatible",
        envelope: null,
        snapshot: null
      };
    }

    return {
      status: "ready",
      envelope: {
        ...parsed,
        metadata: normalizeSaveMetadata(slotId, snapshot, parsed.metadata, parsed.savedAt)
      },
      snapshot
    };
  } catch {
    return {
      status: "corrupt",
      envelope: null,
      snapshot: null
    };
  }
}

export function buildSaveMetadata(slotId: SaveSlotId, snapshot: SaveSnapshot): SaveSlotMetadata {
  return {
    slotId,
    characterName: snapshot.playerState.coreData.playerName,
    level: snapshot.playerState.progression.level,
    lineageLabel:
      snapshot.playerState.originProfile.lineageLabel ??
      humanizeId(snapshot.playerState.coreData.lineageId),
    sexLabel: formatSexLabel(snapshot),
    classLabel:
      snapshot.playerState.originProfile.classLabel ??
      (snapshot.playerState.coreData.classId
        ? humanizeId(snapshot.playerState.coreData.classId)
        : null),
    backstoryLabel: snapshot.playerState.coreData.backstoryId
      ? humanizeId(snapshot.playerState.coreData.backstoryId)
      : null,
    startingBundleLabel: snapshot.playerState.coreData.startingBundleId
      ? humanizeId(snapshot.playerState.coreData.startingBundleId)
      : null,
    regionLabel: humanizeId(snapshot.playerState.regionId),
    settlementLabel: snapshot.playerState.location.settlementId
      ? humanizeId(snapshot.playerState.location.settlementId)
      : null,
    startingSettlementLabel: getStartingSettlementLabel(snapshot),
    currentLocationLabel: getCurrentLocationLabel(snapshot),
    gold: snapshot.playerState.currency.gold,
    fundsLabel: formatFunds(snapshot),
    inGameDate: formatInGameDate(snapshot),
    totalPlayTicks: snapshot.playerState.saveMeta.totalPlayTicks,
    capturedAtTick: snapshot.capturedAtTick,
    lastSavedAt: new Date().toISOString(),
    snapshotVersion: snapshot.snapshotVersion
  };
}

export function listSaves(accountId: string): SaveSlotSummary[] {
  getStorage();

  return SAVE_SLOT_ORDER.map((slot) => {
    const inspected = inspectStoredSave(accountId, slot.id);

    if (inspected.status === "ready") {
      return createSlotSummary(slot, "ready", inspected.envelope.metadata);
    }

    return createSlotSummary(slot, inspected.status, null);
  });
}

function writeAndVerify(storage: Storage, key: string, raw: string): void {
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) {
    throw new Error(`Save write verification failed for '${key}'.`);
  }
}

function readCampaignControl(
  accountId: string,
  campaignId: string
): StoredCampaignControl | null {
  const raw = getStorage().getItem(
    getCampaignControlKey(accountId, campaignId)
  );
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isStoredCampaignControl(parsed) &&
      parsed.accountId === accountId &&
      parsed.campaignId === campaignId
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function buildVerifiedPublication(
  envelope: StoredSaveEnvelope
): VerifiedCampaignPublication {
  return {
    publicationId: envelope.publicationId,
    campaignId: envelope.campaignId,
    continuityId: envelope.continuityId,
    characterId: envelope.characterId,
    publishedAt: envelope.savedAt
  };
}

function createStoredEnvelope(params: {
  accountId: string;
  slotId: SaveSlotId;
  snapshot: SaveSnapshot;
  metadata: SaveSlotMetadata;
  artifactId: string;
  generationId: string;
  publicationId: string;
  headRevision: number;
  terminal: boolean;
  savedAt: string;
}): StoredSaveEnvelope {
  if (!isTargetCampaignSnapshot(params.snapshot)) {
    throw new Error("Cannot publish a non-target campaign snapshot.");
  }

  return {
    version: 7,
    accountId: params.accountId,
    slotId: params.slotId,
    savedAt: params.savedAt,
    metadata: {
      ...params.metadata,
      slotId: params.slotId,
      lastSavedAt: params.savedAt,
      snapshotVersion: TARGET_SNAPSHOT_FORMAT
    },
    snapshotFormatId: TARGET_SNAPSHOT_FORMAT,
    campaignId: params.snapshot.campaignIdentity!.campaignId,
    continuityId: params.snapshot.campaignIdentity!.continuityId,
    characterId: params.snapshot.playerState.playerId,
    artifactId: params.artifactId,
    generationId: params.generationId,
    publicationId: params.publicationId,
    headRevision: params.headRevision,
    terminal: params.terminal,
    snapshot: serializeSnapshot(params.snapshot)
  };
}

function readRecoveryEnvelope(
  recovery: StoredPublicationRecovery
): StoredSaveEnvelope {
  const parsed = JSON.parse(recovery.envelopeRaw) as unknown;
  if (
    !isStoredSaveEnvelope(parsed) ||
    parsed.accountId !== recovery.accountId ||
    parsed.slotId !== recovery.slotId ||
    parsed.campaignId !== recovery.campaignId ||
    parsed.artifactId !== recovery.artifactId ||
    parsed.generationId !== recovery.generationId ||
    parsed.publicationId !== recovery.publicationId ||
    parsed.headRevision !== recovery.headRevision ||
    parsed.terminal !== recovery.terminal
  ) {
    throw new Error("Publication recovery evidence is inconsistent.");
  }
  return parsed;
}

function recoverPublicationAddress(
  storage: Storage,
  recovery: StoredPublicationRecovery
): StoredPublicationRecovery {
  if (
    recovery.status !== "head_verified" &&
    recovery.status !== "address_verified"
  ) {
    throw new Error("Publication recovery has no verified campaign head.");
  }
  const envelope = readRecoveryEnvelope(recovery);
  const control = readCampaignControl(
    recovery.accountId,
    recovery.campaignId
  );
  if (
    !control ||
    control.headArtifactId !== recovery.artifactId ||
    control.headPublicationId !== recovery.publicationId ||
    control.headRevision !== recovery.headRevision ||
    control.closed !== recovery.terminal
  ) {
    throw new Error(
      "Publication recovery no longer matches campaign-head authority."
    );
  }
  if (
    !readVerifiedArtifactForAddress(
      storage,
      recovery.accountId,
      envelope
    )
  ) {
    throw new Error(
      "Publication recovery artifact failed immutable verification."
    );
  }

  writeAndVerify(
    storage,
    getStorageKey(recovery.accountId, recovery.slotId),
    recovery.envelopeRaw
  );
  const projectedRaw = storage.getItem(
    getStorageKey(recovery.accountId, recovery.slotId)
  );
  const projected = projectedRaw
    ? (JSON.parse(projectedRaw) as unknown)
    : null;
  if (
    !isStoredSaveEnvelope(projected) ||
    !readVerifiedArtifactForAddress(
      storage,
      recovery.accountId,
      projected
    )
  ) {
    throw new Error(
      "Recovered playable address failed immutable artifact verification."
    );
  }

  const next: StoredPublicationRecovery = {
    ...recovery,
    status: "address_verified",
    updatedAt: new Date().toISOString()
  };
  writePublicationRecovery(storage, next);
  return next;
}

function listStoredPublicationRecoveries(
  accountId: string
): StoredPublicationRecovery[] {
  const storage = getStorage();
  const prefix = `${STORAGE_PREFIX}.account.${accountId}.campaign.`;
  const suffix = ".publication-recovery";
  const recoveries: StoredPublicationRecovery[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(prefix) || !key.endsWith(suffix)) {
      continue;
    }
    const raw = storage.getItem(key);
    if (!raw) {
      continue;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(
        "Campaign publication recovery evidence is malformed."
      );
    }
    if (
      !isStoredPublicationRecovery(parsed) ||
      parsed.accountId !== accountId
    ) {
      throw new Error(
        "Campaign publication recovery evidence is invalid."
      );
    }
    recoveries.push(parsed);
  }
  return recoveries;
}

export function recoverPendingCampaignPublications(
  accountId: string
): PendingCampaignPublicationRecovery[] {
  const storage = getStorage();
  const recovered: PendingCampaignPublicationRecovery[] = [];
  for (const stored of listStoredPublicationRecoveries(accountId)) {
    if (stored.status === "artifact_verified") {
      continue;
    }
    const recovery = recoverPublicationAddress(storage, stored);
    const envelope = readRecoveryEnvelope(recovery);
    const verified = readVerifiedArtifactForAddress(
      storage,
      accountId,
      envelope
    );
    if (!verified) {
      throw new Error(
        "Recovered publication lost immutable artifact authority."
      );
    }
    const consumerPlans = recovery.consumerPlans.filter(
      (plan) =>
        !recovery.completedConsumerKinds.includes(plan.kind)
    );
    recovered.push({
      publication: buildVerifiedPublication(envelope),
      slotId: recovery.slotId,
      terminal: recovery.terminal,
      snapshot: migrateSnapshotForEcho(verified.snapshot),
      consumerPlans
    });
    if (consumerPlans.length === 0) {
      storage.removeItem(
        getPublicationRecoveryKey(accountId, recovery.campaignId)
      );
    }
  }
  return recovered;
}

export function completeCampaignPublicationConsumers(
  accountId: string,
  publicationId: string,
  kinds: CampaignPublicationConsumerKind[]
): void {
  const storage = getStorage();
  const recovery = listStoredPublicationRecoveries(accountId).find(
    (entry) => entry.publicationId === publicationId
  );
  if (!recovery) {
    return;
  }
  const completedConsumerKinds = Array.from(
    new Set([
      ...recovery.completedConsumerKinds,
      ...kinds
    ])
  );
  if (
    recovery.consumerPlans.every((plan) =>
      completedConsumerKinds.includes(plan.kind)
    )
  ) {
    storage.removeItem(
      getPublicationRecoveryKey(accountId, recovery.campaignId)
    );
    return;
  }
  writePublicationRecovery(storage, {
    ...recovery,
    completedConsumerKinds,
    updatedAt: new Date().toISOString()
  });
}

function readLegacyEnvelope(
  accountId: string,
  slotId: SaveSlotId
): {
  raw: string;
  envelope: LegacyStoredSaveEnvelope;
  snapshot: SaveSnapshot;
} | null {
  const raw = getStorage().getItem(getLegacyStorageKey(accountId, slotId));
  if (!raw) {
    return null;
  }

  try {
    const envelope = JSON.parse(raw) as unknown;
    if (
      !isLegacyStoredSaveEnvelope(envelope) ||
      envelope.accountId !== accountId ||
      envelope.slotId !== slotId
    ) {
      return null;
    }

    const snapshot = migrateSnapshotForEcho(
      deserializeSnapshot(envelope.snapshot)
    );
    return isSaveSnapshot(snapshot) && snapshot.snapshotVersion === "0.6.0"
      ? { raw, envelope, snapshot }
      : null;
  } catch {
    return null;
  }
}

function buildLegacyGroupFingerprint(snapshot: SaveSnapshot): string {
  const startFlag =
    snapshot.playerState.flags.find(
      (flag) =>
        flag.startsWith("player.start.") &&
        !flag.startsWith("player.start_authority.") &&
        !flag.startsWith("player.start_mode.")
    ) ?? "";

  return JSON.stringify({
    accountId: snapshot.accountId,
    playerId: snapshot.playerState.playerId,
    playerName: snapshot.playerState.coreData.playerName,
    lineageId: snapshot.playerState.coreData.lineageId,
    regionId: snapshot.playerState.regionId,
    startFlag,
    runDifficulty: snapshot.gameState.runDifficulty
  });
}

function resolveLegacyStartingSettlementId(snapshot: SaveSnapshot): string {
  const startFlag = snapshot.playerState.flags.find(
    (flag) =>
      flag.startsWith("player.start.") &&
      !flag.startsWith("player.start_authority.") &&
      !flag.startsWith("player.start_mode.")
  );
  return (
    startFlag?.slice("player.start.".length) ||
    snapshot.playerState.location.settlementId ||
    "unknown.start.settlement"
  );
}

function resolveLegacyStartingContinentId(snapshot: SaveSnapshot): string {
  return (
    snapshot.playerState.geographicKnowledge.find(
      (entry) => entry.scope === "continent" && entry.level > 0
    )?.geographyId ?? "unknown.start.continent"
  );
}

function readMigrationReceipt(
  accountId: string,
  legacyCharacterId: string
): LegacyMigrationReceipt | null {
  const raw = getStorage().getItem(
    getMigrationReceiptKey(accountId, legacyCharacterId)
  );
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as LegacyMigrationReceipt;
    return parsed.version === 1 &&
      parsed.accountId === accountId &&
      parsed.legacyCharacterId === legacyCharacterId &&
      parsed.campaignIdentity?.campaignId &&
      parsed.campaignIdentity?.continuityId &&
      parsed.campaignIdentity?.characterId
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function migrateLegacySaveGroup(
  accountId: string,
  loadedSlotId: SaveSlotId
): LoadedCampaignSave | null {
  const loadedSource = readLegacyEnvelope(accountId, loadedSlotId);
  if (!loadedSource) {
    return null;
  }

  const profile = loadAccountProfile(accountId);
  const legacyCharacterId = loadedSource.snapshot.playerState.playerId;
  const existingReceipt = readMigrationReceipt(
    accountId,
    legacyCharacterId
  );
  const matchingHistoryRecords = profile.history.runRecords.filter(
    (record) =>
      (record.characterId === legacyCharacterId ||
        record.characterId ===
          existingReceipt?.campaignIdentity.characterId) &&
      record.outcome === "active" &&
      record.name === loadedSource.snapshot.playerState.coreData.playerName &&
      record.lineageId === loadedSource.snapshot.playerState.coreData.lineageId &&
      record.startingRegionId === loadedSource.snapshot.playerState.regionId &&
      record.startingSettlementId ===
        resolveLegacyStartingSettlementId(loadedSource.snapshot) &&
      record.startingContinentId ===
        resolveLegacyStartingContinentId(loadedSource.snapshot)
  );
  if (matchingHistoryRecords.length !== 1) {
    return null;
  }
  const activeHistory = matchingHistoryRecords[0]!;
  const groupFingerprint = buildLegacyGroupFingerprint(loadedSource.snapshot);
  const group = SAVE_SLOT_ORDER.flatMap((slot) => {
    const source = readLegacyEnvelope(accountId, slot.id);
    return source &&
      buildLegacyGroupFingerprint(source.snapshot) === groupFingerprint
      ? [{ slotId: slot.id, ...source }]
      : [];
  });
  const exactLastPlayedMatches = group.filter(
    (source) => source.envelope.savedAt === profile.lastPlayedAt
  );
  const headSource =
    group.length === 1
      ? group[0]
      : exactLastPlayedMatches.length === 1
        ? exactLastPlayedMatches[0]
        : null;

  if (!headSource) {
    return null;
  }

  const now = new Date().toISOString();
  const receipt: LegacyMigrationReceipt =
    existingReceipt ?? {
      version: 1,
      accountId,
      legacyCharacterId,
      campaignIdentity: {
        campaignId: createAuthorityId("campaign"),
        continuityId: createAuthorityId("continuity"),
        characterId: createAuthorityId("character")
      },
      groupFingerprint,
      historyStartedAt: activeHistory.startedAt,
      sourceSlotIds: group.map((source) => source.slotId),
      sourceFingerprints: Object.fromEntries(
        group.map((source) => [source.slotId, source.raw])
      ),
      headSlotId: headSource.slotId,
      artifacts: Object.fromEntries(
        group.map((source) => [
          source.slotId,
          {
            artifactId: createAuthorityId("artifact"),
            generationId: createAuthorityId("generation"),
            publicationId: createAuthorityId("publication")
          }
        ])
      ),
      status: "pending",
      createdAt: now
    };

  if (
    receipt.groupFingerprint !== groupFingerprint ||
    receipt.historyStartedAt !== activeHistory.startedAt ||
    receipt.headSlotId !== headSource.slotId ||
    group.some(
      (source) =>
        receipt.sourceFingerprints[source.slotId] !== source.raw
    )
  ) {
    return null;
  }

  const storage = getStorage();
  writeAndVerify(
    storage,
    getMigrationReceiptKey(accountId, legacyCharacterId),
    JSON.stringify(receipt)
  );

  const migrated = group.map((source) => {
    const ids = receipt.artifacts[source.slotId];
    if (!ids) {
      throw new Error(
        `Legacy migration receipt lacks '${source.slotId}' identity.`
      );
    }

    const retainedRaw =
      storage.getItem(
        getArtifactStorageKey(accountId, ids.artifactId)
      ) ??
      storage.getItem(
        getCandidateStorageKey(accountId, ids.generationId)
      );
    if (retainedRaw) {
      const retainedEnvelope = JSON.parse(retainedRaw) as unknown;
      if (
        !isStoredSaveEnvelope(retainedEnvelope) ||
        retainedEnvelope.accountId !== accountId ||
        retainedEnvelope.slotId !== source.slotId ||
        retainedEnvelope.campaignId !==
          receipt.campaignIdentity.campaignId ||
        retainedEnvelope.continuityId !==
          receipt.campaignIdentity.continuityId ||
        retainedEnvelope.characterId !==
          receipt.campaignIdentity.characterId ||
        retainedEnvelope.artifactId !== ids.artifactId ||
        retainedEnvelope.generationId !== ids.generationId ||
        retainedEnvelope.publicationId !== ids.publicationId
      ) {
        throw new Error(
          `Retained legacy migration artifact '${ids.artifactId}' conflicts with its receipt.`
        );
      }
      const retainedSnapshot = deserializeSnapshot(
        retainedEnvelope.snapshot
      );
      if (!isTargetCampaignSnapshot(retainedSnapshot)) {
        throw new Error(
          `Retained legacy migration artifact '${ids.artifactId}' is not a target snapshot.`
        );
      }
      writeAndVerify(
        storage,
        getCandidateStorageKey(accountId, ids.generationId),
        retainedRaw
      );
      writeAndVerify(
        storage,
        getArtifactStorageKey(accountId, ids.artifactId),
        retainedRaw
      );
      return {
        slotId: source.slotId,
        envelope: retainedEnvelope,
        snapshot: retainedSnapshot,
        raw: retainedRaw,
        repairedLegacyDefeat:
          retainedSnapshot.normalDefeatReceipts?.some(
            (entry) =>
              entry.sourceMutationId ===
              `legacy-migration.${ids.publicationId}`
          ) ?? false
      };
    }

    let snapshot = initializeTargetCampaignSnapshot(
      {
        ...structuredClone(source.snapshot),
        accountId,
        playerState: {
          ...structuredClone(source.snapshot.playerState),
          playerId: receipt.campaignIdentity.characterId
        }
      },
      {
        source: "legacy_migration",
        identity: receipt.campaignIdentity,
        recordedAt: receipt.createdAt
      }
    );
    snapshot.authorityLedger = {
      version: 1,
      entries: [
        ...(snapshot.authorityLedger?.entries ?? []),
        {
          entryId: `migration.${ids.publicationId}`,
          kind: "migration",
          sourceId: `${legacyCharacterId}.${source.slotId}`,
          acceptedAtTick: snapshot.clock.tick
        }
      ]
    };

    let repairedLegacyDefeat = false;
    if (
      source.slotId === loadedSlotId &&
      snapshot.playerState.resources.hp.current <= 0
    ) {
      snapshot = resolveNormalDefeat(snapshot, {
        sourceMutationId: `legacy-migration.${ids.publicationId}`,
        sourceKind: "unknown_or_legacy"
      }).snapshot;
      repairedLegacyDefeat = true;
    }

    const envelope = createStoredEnvelope({
      accountId,
      slotId: source.slotId,
      snapshot,
      metadata: normalizeSaveMetadata(
        source.slotId,
        snapshot,
        source.envelope.metadata,
        source.envelope.savedAt
      ),
      artifactId: ids.artifactId,
      generationId: ids.generationId,
      publicationId: ids.publicationId,
      headRevision: source.slotId === receipt.headSlotId ? 1 : 0,
      terminal: false,
      savedAt: source.envelope.savedAt
    });
    const raw = JSON.stringify(envelope);
    writeAndVerify(
      storage,
      getCandidateStorageKey(accountId, ids.generationId),
      raw
    );
    writeAndVerify(
      storage,
      getArtifactStorageKey(accountId, ids.artifactId),
      raw
    );

    return {
      slotId: source.slotId,
      envelope,
      snapshot,
      raw,
      repairedLegacyDefeat
    };
  });
  const head = migrated.find(
    (entry) => entry.slotId === receipt.headSlotId
  )!;
  const control: StoredCampaignControl = {
    version: 1,
    accountId,
    campaignId: receipt.campaignIdentity.campaignId,
    headArtifactId: head.envelope.artifactId,
    headPublicationId: head.envelope.publicationId,
    headRevision: 1,
    previousHeadArtifactId: null,
    previousHeadPublicationId: null,
    closed: false,
    updatedAt: now
  };
  const controlRaw = JSON.stringify(control);
  writeAndVerify(
    storage,
    getCampaignControlKey(accountId, control.campaignId),
    controlRaw
  );
  if (
    JSON.stringify(readCampaignControl(accountId, control.campaignId)) !==
    controlRaw
  ) {
    throw new Error("Legacy campaign-head publication verification failed.");
  }

  const rekeyedProfile = {
    ...profile,
    history: {
      ...profile.history,
      runRecords: profile.history.runRecords.map((record) =>
        record === activeHistory
          ? {
              ...record,
              characterId: receipt.campaignIdentity.characterId
            }
          : record
      )
    }
  };
  saveAccountProfile(rekeyedProfile);

  const projectedAddressKeys: string[] = [];
  try {
    for (const entry of migrated) {
      const addressKey = getStorageKey(accountId, entry.slotId);
      projectedAddressKeys.push(addressKey);
      writeAndVerify(storage, addressKey, entry.raw);
      const source = group.find(
        (candidate) => candidate.slotId === entry.slotId
      )!;
      writeAndVerify(
        storage,
        getMigrationSourceKey(
          accountId,
          legacyCharacterId,
          entry.slotId
        ),
        source.raw
      );
    }
  } catch (error) {
    for (const addressKey of projectedAddressKeys) {
      storage.removeItem(addressKey);
    }
    throw error;
  }
  for (const entry of migrated) {
    storage.removeItem(
      getLegacyStorageKey(accountId, entry.slotId)
    );
  }

  writeAndVerify(
    storage,
    getMigrationReceiptKey(accountId, legacyCharacterId),
    JSON.stringify({
      ...receipt,
      status: "applied",
      appliedAt: now
    } satisfies LegacyMigrationReceipt)
  );

  const loaded = migrated.find((entry) => entry.slotId === loadedSlotId)!;
  return {
    snapshot: loaded.snapshot,
    sessionControl: createCampaignSessionControl({
      accountId,
      campaignId: loaded.envelope.campaignId,
      artifactId: loaded.envelope.artifactId,
      publicationId: loaded.envelope.publicationId,
      artifactRevision: loaded.envelope.headRevision,
      continuityId: loaded.envelope.continuityId,
      headArtifactId: control.headArtifactId,
      headRevision: control.headRevision
    }),
    publication: buildVerifiedPublication(loaded.envelope),
    migratedLegacy: true,
    repairedLegacyDefeat: loaded.repairedLegacyDefeat
  };
}

export function publishSave(
  accountId: string,
  slotId: SaveSlotId,
  snapshot: SaveSnapshot,
  metadata: SaveSlotMetadata,
  options: {
    sessionControl?: CampaignSessionControl;
    terminal?: boolean;
    consumerPlans?: CampaignPublicationConsumerPlan[];
  } = {}
): PublishedCampaignSave {
  if (!isTargetCampaignSnapshot(snapshot)) {
    throw new Error(
      "Version 7 publication requires a target campaign snapshot."
    );
  }
  if (hasPendingNormalDefeat(snapshot)) {
    throw new Error(
      "Campaign publication is blocked while Normal defeat recovery is pending."
    );
  }

  const storage = getStorage();
  const campaignId = snapshot.campaignIdentity!.campaignId;
  const existingControl = readCampaignControl(accountId, campaignId);
  const sessionControl = options.sessionControl;
  const consumerPlans = options.consumerPlans ?? [];
  const duplicatePlanKind = consumerPlans.find(
    (plan, index) =>
      consumerPlans.findIndex(
        (candidate) => candidate.kind === plan.kind
      ) !== index
  );
  if (duplicatePlanKind) {
    throw new Error(
      `Duplicate campaign consumer plan '${duplicatePlanKind.kind}'.`
    );
  }

  const pendingRecovery = readPublicationRecovery(
    accountId,
    campaignId
  );
  if (
    pendingRecovery &&
    pendingRecovery.status !== "artifact_verified"
  ) {
    const recoveryEnvelope = readRecoveryEnvelope(pendingRecovery);
    const requestedSnapshot =
      snapshot.accountId === accountId
        ? snapshot
        : { ...snapshot, accountId };
    const requestedPlans = JSON.stringify(consumerPlans);
    const retainedPlans = JSON.stringify(
      pendingRecovery.consumerPlans
    );
    const sessionMatchesPriorHead =
      !sessionControl ||
      (sessionControl.campaignHeadArtifactId ===
        existingControl?.previousHeadArtifactId &&
        sessionControl.campaignHeadRevision ===
          pendingRecovery.headRevision - 1);
    if (
      pendingRecovery.slotId !== slotId ||
      pendingRecovery.terminal !== (options.terminal === true) ||
      recoveryEnvelope.snapshot !==
        serializeSnapshot(requestedSnapshot) ||
      (consumerPlans.length > 0 &&
        requestedPlans !== retainedPlans) ||
      !sessionMatchesPriorHead
    ) {
      throw new Error(
        "Pending campaign publication conflicts with this retry."
      );
    }
    const recovered = recoverPublicationAddress(
      storage,
      pendingRecovery
    );
    const envelope = readRecoveryEnvelope(recovered);
    const slot = SAVE_SLOT_ORDER.find(
      (entry) => entry.id === slotId
    ) ?? {
      id: slotId,
      label: slotId,
      kind: "manual" as const
    };
    return {
      slot: createSlotSummary(slot, "ready", envelope.metadata),
      snapshot: requestedSnapshot,
      sessionControl: createCampaignSessionControl({
        accountId,
        campaignId,
        artifactId: envelope.artifactId,
        publicationId: envelope.publicationId,
        artifactRevision: envelope.headRevision,
        continuityId: envelope.continuityId,
        headArtifactId: envelope.artifactId,
        headRevision: envelope.headRevision
      }),
      publication: buildVerifiedPublication(envelope),
      boundExistingArtifact: false
    };
  }

  if (sessionControl) {
    if (!existingControl) {
      throw new Error(
        "Campaign control is missing or invalid for this session."
      );
    }
    if (existingControl.closed) {
      throw new Error("Campaign control is closed for this session.");
    }
    if (
      sessionControl.campaignHeadArtifactId !==
        existingControl.headArtifactId ||
      sessionControl.campaignHeadRevision !==
        existingControl.headRevision
    ) {
      throw new Error("Campaign head changed after this session was loaded.");
    }
  } else if (existingControl?.closed) {
    throw new Error("Closed campaign authority cannot be reopened.");
  }

  if (
    sessionControl?.posture === "non_head_unmutated" &&
    !sessionControl.hasUnpublishedGameplayState
  ) {
    const artifactRaw = storage.getItem(
      getArtifactStorageKey(accountId, sessionControl.loadedArtifactId)
    );
    if (!artifactRaw) {
      throw new Error("Loaded non-head artifact is no longer available.");
    }

    const artifact = JSON.parse(artifactRaw) as unknown;
    if (
      !isStoredSaveEnvelope(artifact) ||
      artifact.campaignId !== campaignId ||
      artifact.artifactId !== sessionControl.loadedArtifactId
    ) {
      throw new Error("Loaded non-head artifact failed verification.");
    }

    const rebound: StoredSaveEnvelope = {
      ...artifact,
      slotId,
      metadata: {
        ...buildSaveMetadata(slotId, snapshot),
        slotId,
        lastSavedAt: new Date().toISOString(),
        snapshotVersion: TARGET_SNAPSHOT_FORMAT
      }
    };
    writeAndVerify(
      storage,
      getStorageKey(accountId, slotId),
      JSON.stringify(rebound)
    );
    const slot = SAVE_SLOT_ORDER.find((entry) => entry.id === slotId) ?? {
      id: slotId,
      label: slotId,
      kind: "manual" as const
    };
    return {
      slot: createSlotSummary(slot, "ready", rebound.metadata),
      snapshot,
      sessionControl,
      publication: null,
      boundExistingArtifact: true
    };
  }

  const savedAt = new Date().toISOString();
  const artifactId = createAuthorityId("artifact");
  const generationId = createAuthorityId("generation");
  const publicationId = createAuthorityId("publication");
  const headRevision = (existingControl?.headRevision ?? 0) + 1;
  const envelope = createStoredEnvelope({
    accountId,
    slotId,
    snapshot:
      snapshot.accountId === accountId
        ? snapshot
        : { ...snapshot, accountId },
    metadata,
    artifactId,
    generationId,
    publicationId,
    headRevision,
    terminal: options.terminal === true,
    savedAt
  });
  const raw = JSON.stringify(envelope);
  writeAndVerify(
    storage,
    getCandidateStorageKey(accountId, generationId),
    raw
  );
  const candidateReadback = storage.getItem(
    getCandidateStorageKey(accountId, generationId)
  );
  if (candidateReadback !== raw) {
    throw new Error("Candidate save readback did not match exact bytes.");
  }
  const candidate = JSON.parse(candidateReadback) as unknown;
  if (
    !isStoredSaveEnvelope(candidate) ||
    !isTargetCampaignSnapshot(deserializeSnapshot(candidate.snapshot))
  ) {
    throw new Error("Candidate save failed semantic validation.");
  }

  writeAndVerify(
    storage,
    getArtifactStorageKey(accountId, artifactId),
    raw
  );
  const recovery: StoredPublicationRecovery = {
    version: 1,
    accountId,
    campaignId,
    slotId,
    artifactId,
    generationId,
    publicationId,
    headRevision,
    terminal: options.terminal === true,
    envelopeRaw: raw,
    status: "artifact_verified",
    consumerPlans,
    completedConsumerKinds: [],
    createdAt: savedAt,
    updatedAt: savedAt
  };
  writePublicationRecovery(storage, recovery);
  const nextControl: StoredCampaignControl = {
    version: 1,
    accountId,
    campaignId,
    headArtifactId: artifactId,
    headPublicationId: publicationId,
    headRevision,
    previousHeadArtifactId: existingControl?.headArtifactId ?? null,
    previousHeadPublicationId:
      existingControl?.headPublicationId ?? null,
    closed: options.terminal === true,
    updatedAt: savedAt
  };
  const controlRaw = JSON.stringify(nextControl);
  writeAndVerify(
    storage,
    getCampaignControlKey(accountId, campaignId),
    controlRaw
  );
  if (
    JSON.stringify(readCampaignControl(accountId, campaignId)) !==
    controlRaw
  ) {
    throw new Error("Campaign-head publication verification failed.");
  }

  const headRecovery: StoredPublicationRecovery = {
    ...recovery,
    status: "head_verified",
    updatedAt: new Date().toISOString()
  };
  writePublicationRecovery(storage, headRecovery);
  const addressRecovery = recoverPublicationAddress(
    storage,
    headRecovery
  );
  for (const obsoleteKey of getObsoleteStorageKeys(slotId)) {
    storage.removeItem(obsoleteKey);
  }
  if (consumerPlans.length === 0) {
    storage.removeItem(
      getPublicationRecoveryKey(accountId, campaignId)
    );
  } else if (addressRecovery.status !== "address_verified") {
    throw new Error("Campaign address projection remains pending.");
  }

  const slot = SAVE_SLOT_ORDER.find((entry) => entry.id === slotId) ?? {
    id: slotId,
    label: slotId,
    kind: "manual" as const
  };
  const nextSessionControl = createCampaignSessionControl({
    accountId,
    campaignId,
    artifactId,
    publicationId,
    artifactRevision: headRevision,
    continuityId: envelope.continuityId,
    headArtifactId: artifactId,
    headRevision
  });

  return {
    slot: createSlotSummary(slot, "ready", envelope.metadata),
    snapshot,
    sessionControl: nextSessionControl,
    publication: buildVerifiedPublication(envelope),
    boundExistingArtifact: false
  };
}

export function createSave(
  accountId: string,
  slotId: SaveSlotId,
  snapshot: SaveSnapshot,
  metadata: SaveSlotMetadata
): SaveSlotSummary {
  const targetSnapshot = isTargetCampaignSnapshot(snapshot)
    ? snapshot
    : initializeTargetCampaignSnapshot(snapshot, {
        source: "developer_fixture"
      });
  return publishSave(
    accountId,
    slotId,
    targetSnapshot,
    metadata
  ).slot;
}

export function loadSave(accountId: string, slotId: SaveSlotId): SaveSnapshot | null {
  return loadSaveWithAuthority(accountId, slotId)?.snapshot ?? null;
}

function repairLoadedMigratedDefeat(
  accountId: string,
  slotId: SaveSlotId,
  envelope: StoredSaveEnvelope,
  snapshot: SaveSnapshot,
  control: StoredCampaignControl
): LoadedCampaignSave {
  const repaired = resolveNormalDefeat(snapshot, {
    sourceMutationId: `legacy-migration.${envelope.publicationId}`,
    sourceKind: "unknown_or_legacy"
  }).snapshot;
  const loadedControl = createCampaignSessionControl({
    accountId,
    campaignId: envelope.campaignId,
    artifactId: envelope.artifactId,
    publicationId: envelope.publicationId,
    artifactRevision: envelope.headRevision,
    continuityId: envelope.continuityId,
    headArtifactId: control.headArtifactId,
    headRevision: control.headRevision
  });

  if (envelope.artifactId === control.headArtifactId) {
    const published = publishSave(
      accountId,
      slotId,
      repaired,
      buildSaveMetadata(slotId, repaired),
      { sessionControl: loadedControl }
    );
    if (!published.publication) {
      throw new Error(
        "Legacy head repair did not create verified authority."
      );
    }
    return {
      snapshot: published.snapshot,
      sessionControl: published.sessionControl,
      publication: published.publication,
      migratedLegacy: false,
      repairedLegacyDefeat: true
    };
  }

  const storage = getStorage();
  const savedAt = new Date().toISOString();
  const artifactId = createAuthorityId("artifact");
  const generationId = createAuthorityId("generation");
  const publicationId = createAuthorityId("publication");
  const repairedEnvelope = createStoredEnvelope({
    accountId,
    slotId,
    snapshot: repaired,
    metadata: buildSaveMetadata(slotId, repaired),
    artifactId,
    generationId,
    publicationId,
    headRevision: envelope.headRevision,
    terminal: false,
    savedAt
  });
  const raw = JSON.stringify(repairedEnvelope);
  writeAndVerify(
    storage,
    getCandidateStorageKey(accountId, generationId),
    raw
  );
  writeAndVerify(
    storage,
    getArtifactStorageKey(accountId, artifactId),
    raw
  );
  writeAndVerify(storage, getStorageKey(accountId, slotId), raw);
  if (
    !readVerifiedArtifactForAddress(
      storage,
      accountId,
      repairedEnvelope
    )
  ) {
    throw new Error(
      "Legacy non-head repair failed immutable artifact verification."
    );
  }
  return {
    snapshot: repaired,
    sessionControl: createCampaignSessionControl({
      accountId,
      campaignId: repairedEnvelope.campaignId,
      artifactId,
      publicationId,
      artifactRevision: repairedEnvelope.headRevision,
      continuityId: repairedEnvelope.continuityId,
      headArtifactId: control.headArtifactId,
      headRevision: control.headRevision
    }),
    publication: buildVerifiedPublication(repairedEnvelope),
    migratedLegacy: false,
    repairedLegacyDefeat: true
  };
}

export function loadSaveWithAuthority(
  accountId: string,
  slotId: SaveSlotId,
  options: {
    allowClosed?: boolean;
  } = {}
): LoadedCampaignSave | null {
  const inspected = inspectStoredSave(accountId, slotId);
  if (inspected.status !== "ready") {
    return null;
  }

  if (inspected.envelope.version === 6) {
    return migrateLegacySaveGroup(accountId, slotId);
  }

  const envelope = inspected.envelope;
  const control = readCampaignControl(accountId, envelope.campaignId);
  if (
    !control ||
    (!options.allowClosed &&
      (control.closed || envelope.terminal))
  ) {
    return null;
  }

  if (
    envelope.headRevision > control.headRevision ||
    (envelope.artifactId === control.headArtifactId &&
      (envelope.publicationId !== control.headPublicationId ||
        envelope.headRevision !== control.headRevision))
  ) {
    return null;
  }

  if (
    inspected.snapshot.campaignRules?.source ===
      "legacy_migration" &&
    inspected.snapshot.playerState.resources.hp.current <= 0
  ) {
    const profile = loadAccountProfile(accountId);
    const active = profile.history.runRecords.some(
      (record) =>
        record.characterId === envelope.characterId &&
        record.outcome === "active"
    );
    if (active) {
      return repairLoadedMigratedDefeat(
        accountId,
        slotId,
        envelope,
        inspected.snapshot,
        control
      );
    }
  }

  return {
    snapshot: inspected.snapshot,
    sessionControl: createCampaignSessionControl({
      accountId,
      campaignId: envelope.campaignId,
      artifactId: envelope.artifactId,
      publicationId: envelope.publicationId,
      artifactRevision: envelope.headRevision,
      continuityId: envelope.continuityId,
      headArtifactId: control.headArtifactId,
      headRevision: control.headRevision
    }),
    publication: buildVerifiedPublication(envelope),
    migratedLegacy: false,
    repairedLegacyDefeat: false
  };
}

export function deleteSave(accountId: string, slotId: SaveSlotId): void {
  const storage = getStorage();
  storage.removeItem(getStorageKey(accountId, slotId));
  storage.removeItem(getLegacyStorageKey(accountId, slotId));

  for (const obsoleteKey of getObsoleteStorageKeys(slotId)) {
    storage.removeItem(obsoleteKey);
  }
}

export function resetAllSaves(accountId: string): void {
  const storage = getStorage();
  const keysToRemove: string[] = [];
  const currentAccountPrefix = `${STORAGE_PREFIX}.account.${accountId}.`;
  const legacyAccountPrefix = `${LEGACY_STORAGE_PREFIX}.account.${accountId}.`;

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) {
      continue;
    }

    if (
      key.startsWith(currentAccountPrefix) ||
      key.startsWith(legacyAccountPrefix) ||
      OBSOLETE_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))
    ) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    storage.removeItem(key);
  }
}

export function quickSave(accountId: string, snapshot: SaveSnapshot): SaveSlotSummary {
  return createSave(accountId, "quick-save", snapshot, buildSaveMetadata("quick-save", snapshot));
}
