import {
  deserializeSnapshot,
  serializeSnapshot
} from '../../../../packages/shared/persistence/src/index.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import {
  SAVE_SLOT_ORDER,
  isManualSaveSlotId,
  type SaveSlotId,
  type SaveSlotKind,
  type SaveSlotMetadata,
  type SaveSlotStatus,
  type SaveSlotSummary
} from './state.js';

type StoredSaveEnvelope = {
  version: 1;
  slotId: SaveSlotId;
  savedAt: string;
  metadata: SaveSlotMetadata;
  snapshot: string;
};

type LegacyStoredSaveEnvelope = {
  slotId: SaveSlotId;
  savedAt: string;
  snapshot: string;
};

const STORAGE_PREFIX = 'cataclysm-rpg-ui.saves.v1';
const LEGACY_STORAGE_PREFIX = 'cataclysm-rpg-ui.save-slot';
const monthNames = [
  'Deepfrost',
  'Thawrise',
  'Seedcall',
  'Rainmere',
  'Suncrest',
  'Highbloom',
  'Harvestfall',
  'Redleaf',
  'Frostwane',
  'Longnight',
  'Emberwane',
  'Stormwane',
  'Yearsend'
];

type SaveInspectResult =
  | {
      status: 'empty';
      envelope: null;
      snapshot: null;
    }
  | {
      status: 'ready';
      envelope: StoredSaveEnvelope;
      snapshot: SaveSnapshot;
    }
  | {
      status: 'corrupt';
      envelope: null;
      snapshot: null;
    };

function getStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Local save storage is only available in the browser.');
  }

  return window.localStorage;
}

function getStorageKey(slotId: SaveSlotId): string {
  return `${STORAGE_PREFIX}.slot.${slotId}`;
}

function getLegacyStorageKey(slotId: SaveSlotId): string {
  return `${LEGACY_STORAGE_PREFIX}.${slotId}`;
}

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  const segments = value.split('.');
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split('_')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatSavedAt(savedAt: string): string {
  const parsed = new Date(savedAt);

  if (Number.isNaN(parsed.valueOf())) {
    return 'Unknown save time';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsed);
}

function formatPlaytime(totalPlayTicks: number): string {
  return `${new Intl.NumberFormat('en-US').format(totalPlayTicks)} ticks played`;
}

function formatInGameDate(snapshot: SaveSnapshot): string {
  const monthLabel = monthNames[snapshot.clock.month - 1] ?? `Month ${snapshot.clock.month}`;
  return `${snapshot.clock.day} ${monthLabel}, Year ${snapshot.clock.year}`;
}

function formatFunds(snapshot: SaveSnapshot): string {
  const { gold, silver, copper } = snapshot.playerState.currency;
  const numberFormat = new Intl.NumberFormat('en-US');
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

  return parts.join(' ');
}

function formatSexLabel(snapshot: SaveSnapshot): string {
  return humanizeId(snapshot.playerState.coreData.sexId);
}

function getStartingSettlementId(snapshot: SaveSnapshot): string | null {
  const startFlag = snapshot.playerState.flags.find(
    (flag) =>
      flag.startsWith('player.start.') &&
      !flag.startsWith('player.start_authority.') &&
      !flag.startsWith('player.start_mode.')
  );

  if (!startFlag) {
    return null;
  }

  return startFlag.slice('player.start.'.length) || null;
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
  return typeof value === 'object' && value !== null;
}

function isSaveSnapshot(value: unknown): value is SaveSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.snapshotVersion === 'string' &&
    typeof value.capturedAtTick === 'number' &&
    isRecord(value.clock) &&
    typeof value.clock.tick === 'number' &&
    typeof value.clock.day === 'number' &&
    typeof value.clock.month === 'number' &&
    typeof value.clock.year === 'number' &&
    isRecord(value.gameState) &&
    typeof value.gameState.worldVersion === 'string' &&
    typeof value.gameState.activeScenario === 'string' &&
    isRecord(value.playerState) &&
    isRecord(value.playerState.coreData) &&
    typeof value.playerState.coreData.playerName === 'string' &&
    isRecord(value.playerState.progression) &&
    typeof value.playerState.progression.level === 'number' &&
    isRecord(value.playerState.location) &&
    isRecord(value.playerState.combatProfile) &&
    typeof value.playerState.combatProfile.preferredMode === 'string' &&
    isRecord(value.playerState.saveMeta) &&
    typeof value.playerState.saveMeta.totalPlayTicks === 'number' &&
    isRecord(value.sessionState) &&
    isRecord(value.sessionState.combatUi)
  );
}

function isSaveSlotMetadata(value: unknown): value is SaveSlotMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.slotId === 'string' &&
    typeof value.characterName === 'string' &&
    typeof value.level === 'number' &&
    typeof value.regionLabel === 'string' &&
    (typeof value.sexLabel === 'string' || value.sexLabel === null || value.sexLabel === undefined) &&
    (typeof value.startingSettlementLabel === 'string' ||
      value.startingSettlementLabel === null ||
      value.startingSettlementLabel === undefined) &&
    (typeof value.currentLocationLabel === 'string' ||
      value.currentLocationLabel === null ||
      value.currentLocationLabel === undefined) &&
    (typeof value.gold === 'number' || value.gold === undefined) &&
    (typeof value.fundsLabel === 'string' || value.fundsLabel === undefined) &&
    typeof value.inGameDate === 'string' &&
    typeof value.totalPlayTicks === 'number' &&
    typeof value.capturedAtTick === 'number' &&
    typeof value.lastSavedAt === 'string' &&
    typeof value.snapshotVersion === 'string'
  );
}

function isStoredSaveEnvelope(value: unknown): value is StoredSaveEnvelope {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    typeof value.slotId === 'string' &&
    typeof value.savedAt === 'string' &&
    typeof value.snapshot === 'string' &&
    isSaveSlotMetadata(value.metadata)
  );
}

function isLegacyStoredSaveEnvelope(value: unknown): value is LegacyStoredSaveEnvelope {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.slotId === 'string' &&
    typeof value.savedAt === 'string' &&
    typeof value.snapshot === 'string'
  );
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
    hasSave: status === 'ready' && metadata !== null,
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

function inspectStoredSave(slotId: SaveSlotId): SaveInspectResult {
  const storage = getStorage();
  const rawValue = storage.getItem(getStorageKey(slotId));

  if (!rawValue) {
    if (!isManualSaveSlotId(slotId)) {
      return {
        status: 'empty',
        envelope: null,
        snapshot: null
      };
    }

    const legacyValue = storage.getItem(getLegacyStorageKey(slotId));

    if (!legacyValue) {
      return {
        status: 'empty',
        envelope: null,
        snapshot: null
      };
    }

    try {
      const parsed = JSON.parse(legacyValue) as unknown;

      if (!isLegacyStoredSaveEnvelope(parsed) || parsed.slotId !== slotId) {
        return {
          status: 'corrupt',
          envelope: null,
          snapshot: null
        };
      }

      const snapshot = deserializeSnapshot(parsed.snapshot);

      if (!isSaveSnapshot(snapshot)) {
        return {
          status: 'corrupt',
          envelope: null,
          snapshot: null
        };
      }

      return {
        status: 'ready',
        envelope: {
          version: 1,
          slotId,
          savedAt: parsed.savedAt,
          metadata: normalizeSaveMetadata(
            slotId,
            snapshot,
            {
              ...buildSaveMetadata(slotId, snapshot),
              lastSavedAt: parsed.savedAt
            },
            parsed.savedAt
          ),
          snapshot: parsed.snapshot
        },
        snapshot
      };
    } catch {
      return {
        status: 'corrupt',
        envelope: null,
        snapshot: null
      };
    }
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!isStoredSaveEnvelope(parsed) || parsed.slotId !== slotId || parsed.metadata.slotId !== slotId) {
      return {
        status: 'corrupt',
        envelope: null,
        snapshot: null
      };
    }

    const snapshot = deserializeSnapshot(parsed.snapshot);

    if (!isSaveSnapshot(snapshot)) {
      return {
        status: 'corrupt',
        envelope: null,
        snapshot: null
      };
    }

    return {
      status: 'ready',
      envelope: {
        ...parsed,
        metadata: normalizeSaveMetadata(slotId, snapshot, parsed.metadata, parsed.savedAt)
      },
      snapshot
    };
  } catch {
    return {
      status: 'corrupt',
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

export function listSaves(): SaveSlotSummary[] {
  getStorage();

  return SAVE_SLOT_ORDER.map((slot) => {
    const inspected = inspectStoredSave(slot.id);

    if (inspected.status === 'ready') {
      return createSlotSummary(slot, 'ready', inspected.envelope.metadata);
    }

    return createSlotSummary(slot, inspected.status, null);
  });
}

export function createSave(
  slotId: SaveSlotId,
  snapshot: SaveSnapshot,
  metadata: SaveSlotMetadata
): SaveSlotSummary {
  const savedAt = new Date().toISOString();
  const envelope: StoredSaveEnvelope = {
    version: 1,
    slotId,
    savedAt,
    metadata: {
      ...metadata,
      slotId,
      lastSavedAt: savedAt
    },
    snapshot: serializeSnapshot(snapshot)
  };

  const storage = getStorage();
  storage.setItem(getStorageKey(slotId), JSON.stringify(envelope));

  if (isManualSaveSlotId(slotId)) {
    storage.removeItem(getLegacyStorageKey(slotId));
  }

  const slot = SAVE_SLOT_ORDER.find((entry) => entry.id === slotId) ?? {
    id: slotId,
    label: slotId,
    kind: 'manual' as const
  };

  return createSlotSummary(slot, 'ready', envelope.metadata);
}

export function loadSave(slotId: SaveSlotId): SaveSnapshot | null {
  const inspected = inspectStoredSave(slotId);
  return inspected.status === 'ready' ? inspected.snapshot : null;
}

export function deleteSave(slotId: SaveSlotId): void {
  const storage = getStorage();
  storage.removeItem(getStorageKey(slotId));

  if (isManualSaveSlotId(slotId)) {
    storage.removeItem(getLegacyStorageKey(slotId));
  }
}

export function resetAllSaves(): void {
  const storage = getStorage();
  const keysToRemove: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (key?.startsWith(STORAGE_PREFIX) || key?.startsWith(LEGACY_STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    storage.removeItem(key);
  }
}

export function quickSave(snapshot: SaveSnapshot): SaveSlotSummary {
  return createSave('quick-save', snapshot, buildSaveMetadata('quick-save', snapshot));
}
