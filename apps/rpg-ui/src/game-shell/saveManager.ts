import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../../../packages/shared/persistence/src/index.js";
import type { SaveSnapshot } from "../../../../packages/shared/types/src/index.js";
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

type StoredSaveEnvelope = {
  version: 6;
  accountId: string;
  slotId: SaveSlotId;
  savedAt: string;
  metadata: SaveSlotMetadata;
  snapshot: string;
};

const STORAGE_PREFIX = "cataclysm-rpg-ui.saves.v6";
const OBSOLETE_STORAGE_PREFIXES = [
  "cataclysm-rpg-ui.saves.v5",
  "cataclysm-rpg-ui.saves.v4",
  "cataclysm-rpg-ui.saves.v3",
  "cataclysm-rpg-ui.saves.v2",
  "cataclysm-rpg-ui.saves.v1",
  "cataclysm-rpg-ui.save-slot"
] as const;
const CURRENT_SNAPSHOT_VERSION = "0.6.0";
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
      envelope: StoredSaveEnvelope;
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
    value.version === 6 &&
    typeof value.accountId === "string" &&
    typeof value.slotId === "string" &&
    typeof value.savedAt === "string" &&
    typeof value.snapshot === "string" &&
    isSaveSlotMetadata(value.metadata)
  );
}

function migrateSnapshotForEcho(snapshot: SaveSnapshot): SaveSnapshot {
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
  const rawValue = storage.getItem(getStorageKey(accountId, slotId));

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

    if (
      !isStoredSaveEnvelope(parsed) ||
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

    const snapshot = migrateSnapshotForEcho(deserializeSnapshot(parsed.snapshot));

    if (!isSaveSnapshot(snapshot) || snapshot.accountId !== accountId) {
      return {
        status: "corrupt",
        envelope: null,
        snapshot: null
      };
    }

    if (snapshot.snapshotVersion !== CURRENT_SNAPSHOT_VERSION) {
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

export function createSave(
  accountId: string,
  slotId: SaveSlotId,
  snapshot: SaveSnapshot,
  metadata: SaveSlotMetadata
): SaveSlotSummary {
  const savedAt = new Date().toISOString();
  const profile = loadAccountProfile(accountId);
  const snapshotToPersist =
    snapshot.accountId === accountId ? snapshot : { ...snapshot, accountId };
  const envelope: StoredSaveEnvelope = {
    version: 6,
    accountId,
    slotId,
    savedAt,
    metadata: {
      ...metadata,
      slotId,
      lastSavedAt: savedAt
    },
    snapshot: serializeSnapshot(snapshotToPersist)
  };

  const storage = getStorage();
  storage.setItem(getStorageKey(accountId, slotId), JSON.stringify(envelope));

  for (const obsoleteKey of getObsoleteStorageKeys(slotId)) {
    storage.removeItem(obsoleteKey);
  }

  saveAccountProfile({
    ...profile,
    lastPlayedAt: savedAt
  });

  const slot = SAVE_SLOT_ORDER.find((entry) => entry.id === slotId) ?? {
    id: slotId,
    label: slotId,
    kind: "manual" as const
  };

  return createSlotSummary(slot, "ready", envelope.metadata);
}

export function loadSave(accountId: string, slotId: SaveSlotId): SaveSnapshot | null {
  const inspected = inspectStoredSave(accountId, slotId);
  return inspected.status === "ready" ? inspected.snapshot : null;
}

export function deleteSave(accountId: string, slotId: SaveSlotId): void {
  const storage = getStorage();
  storage.removeItem(getStorageKey(accountId, slotId));

  for (const obsoleteKey of getObsoleteStorageKeys(slotId)) {
    storage.removeItem(obsoleteKey);
  }
}

export function resetAllSaves(accountId: string): void {
  const storage = getStorage();
  const keysToRemove: string[] = [];
  const currentAccountPrefix = `${STORAGE_PREFIX}.account.${accountId}.`;

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) {
      continue;
    }

    if (
      key.startsWith(currentAccountPrefix) ||
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
