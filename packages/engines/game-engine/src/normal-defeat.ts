import type {
  ChronicleEventState,
  NormalDefeatReceiptState,
  NotificationState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import { createEmptyCombatUiState } from "./combat/state.js";
import { createAuthorityId } from "./campaign-rules.js";

export type NormalDefeatResolution = {
  snapshot: SaveSnapshot;
  receipt: NormalDefeatReceiptState;
  duplicate: boolean;
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return structuredClone(snapshot);
}

function readCampaignStartSettlement(snapshot: SaveSnapshot): string | null {
  const startFlags = snapshot.playerState.flags.filter(
    (flag) =>
      flag.startsWith("player.start.") &&
      !flag.startsWith("player.start_authority.") &&
      !flag.startsWith("player.start_mode.")
  );
  if (startFlags.length > 1) {
    throw new Error(
      "Normal defeat recovery campaign-start settlement authority is conflicting."
    );
  }

  return startFlags[0]?.slice("player.start.".length) ?? null;
}

function normalizeRecoveryDestinationId(
  value: string | null | undefined,
  sourceLabel: string
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = value.trim();
  if (!normalized || normalized !== value) {
    throw new Error(
      `Normal defeat recovery ${sourceLabel} settlement authority is malformed.`
    );
  }
  return normalized;
}

function requireKnownSafeSettlement(
  snapshot: SaveSnapshot,
  destinationId: string,
  sourceLabel: string
): string {
  const matches = snapshot.sessionState.knownLocations.filter(
    (location) =>
      location.settlementId?.trim() === destinationId
  );
  if (
    matches.length !== 1 ||
    matches[0]!.known !== true ||
    matches[0]!.type !== "settlement" ||
    matches[0]!.settlementId !== destinationId
  ) {
    throw new Error(
      `Normal defeat recovery ${sourceLabel} '${destinationId}' is not an authoritative known safe settlement.`
    );
  }
  return destinationId;
}

function resolveCurrentRecoverySettlement(
  snapshot: SaveSnapshot
): string | null {
  const current = normalizeRecoveryDestinationId(
    snapshot.playerState.location.settlementId,
    "current-location"
  );
  return current
    ? requireKnownSafeSettlement(snapshot, current, "current-location")
    : null;
}

function resolveCampaignStartRecoverySettlement(
  snapshot: SaveSnapshot
): string | null {
  const campaignStart = normalizeRecoveryDestinationId(
    readCampaignStartSettlement(snapshot),
    "campaign-start"
  );
  return campaignStart
    ? requireKnownSafeSettlement(
        snapshot,
        campaignStart,
        "campaign-start settlement"
      )
    : null;
}

function listKnownSafeRecoverySettlements(
  snapshot: SaveSnapshot
): string[] {
  const candidates = snapshot.sessionState.knownLocations
    .filter(
      (location) =>
        location.known === true &&
        location.type === "settlement" &&
        location.settlementId !== null &&
        location.settlementId !== undefined
    )
    .map((location) =>
      normalizeRecoveryDestinationId(
        location.settlementId,
        "known-location"
      )
    )
    .filter((candidate): candidate is string => candidate !== null);
  return [...new Set(candidates)]
    .map((candidate) =>
      requireKnownSafeSettlement(
        snapshot,
        candidate,
        "destination"
      )
    )
    .sort();
}

export function resolvePendingNormalDefeatRecoveryDestination(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): string {
  const currentSettlement =
    resolveCurrentRecoverySettlement(snapshot);
  const requested = normalizeRecoveryDestinationId(
    explicitDestinationId,
    "destination"
  );
  if (requested) {
    return requireKnownSafeSettlement(
      snapshot,
      requested,
      "destination"
    );
  }
  if (explicitDestinationId !== undefined) {
    throw new Error(
      "Normal defeat recovery destination is malformed."
    );
  }
  if (currentSettlement) {
    return currentSettlement;
  }
  const campaignStartSettlement =
    resolveCampaignStartRecoverySettlement(snapshot);
  if (campaignStartSettlement) {
    return campaignStartSettlement;
  }
  const knownSettlements =
    listKnownSafeRecoverySettlements(snapshot);
  if (knownSettlements.length > 1) {
    throw new Error(
      "Normal defeat recovery has multiple authoritative known safe settlements and no accepted precedence."
    );
  }
  const destinationId = knownSettlements[0];
  if (!destinationId) {
    throw new Error(
      "Normal defeat recovery has no authoritative known safe settlement."
    );
  }
  return destinationId;
}

function resolveDestination(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): {
  id: string | null;
  source: NormalDefeatReceiptState["destinationSource"];
} {
  if (explicitDestinationId !== undefined) {
    return {
      id: resolvePendingNormalDefeatRecoveryDestination(
        snapshot,
        explicitDestinationId
      ),
      source: "explicit_context"
    };
  }

  const currentSettlement = snapshot.playerState.location.settlementId;
  if (currentSettlement) {
    return { id: currentSettlement, source: "current_settlement" };
  }

  const campaignStart = readCampaignStartSettlement(snapshot);
  if (campaignStart) {
    return { id: campaignStart, source: "campaign_start" };
  }

  return { id: null, source: "none" };
}

export function findPendingNormalDefeat(
  snapshot: SaveSnapshot
): NormalDefeatReceiptState | null {
  return (
    (snapshot.normalDefeatReceipts ?? []).find(
      (receipt) => receipt.posture === "recovery_pending"
    ) ?? null
  );
}

export function hasPendingNormalDefeat(
  snapshot: SaveSnapshot
): boolean {
  return findPendingNormalDefeat(snapshot) !== null;
}

export function repairPendingNormalDefeat(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): NormalDefeatResolution {
  const pendingReceipts = (
    snapshot.normalDefeatReceipts ?? []
  ).filter((receipt) => receipt.posture === "recovery_pending");
  if (pendingReceipts.length !== 1) {
    throw new Error(
      `Normal defeat recovery repair requires exactly one pending receipt; found ${pendingReceipts.length}.`
    );
  }
  const pending = pendingReceipts[0]!;
  const receiptMatches = (
    snapshot.normalDefeatReceipts ?? []
  ).filter((receipt) => receipt.receiptId === pending.receiptId);
  const originalLedgerMatches = (
    snapshot.authorityLedger?.entries ?? []
  ).filter(
    (entry) =>
      entry.entryId === pending.receiptId &&
      entry.kind === "normal_defeat" &&
      entry.sourceId === pending.sourceMutationId &&
      entry.supersedesEntryId === undefined
  );
  const repairLedgerEntryId =
    `normal_defeat_recovery.${pending.receiptId}`;
  const retainedRepairEntries = (
    snapshot.authorityLedger?.entries ?? []
  ).filter(
    (entry) =>
      entry.entryId === repairLedgerEntryId ||
      entry.supersedesEntryId === pending.receiptId
  );
  const chronicleMatches =
    snapshot.sessionState.chronicle.filter(
      (entry) => entry.id === pending.chronicleEntryId
    );
  const notificationMatches =
    snapshot.sessionState.notifications.filter(
      (entry) => entry.id === pending.notificationId
    );
  const campaignIdentity = snapshot.campaignIdentity;
  if (
    !campaignIdentity ||
    pending.campaignId !== campaignIdentity.campaignId ||
    pending.continuityId !== campaignIdentity.continuityId ||
    pending.characterId !== campaignIdentity.characterId ||
    pending.rulesVersion !== 2 ||
    pending.policyRevision !== 1 ||
    pending.recoveryTicks !== 0 ||
    pending.destinationId !== null ||
    receiptMatches.length !== 1 ||
    originalLedgerMatches.length !== 1 ||
    retainedRepairEntries.length !== 0 ||
    chronicleMatches.length !== 1 ||
    notificationMatches.length !== 1
  ) {
    throw new Error(
      "Normal defeat recovery repair provenance is missing, duplicated, or conflicting."
    );
  }
  const destinationId = resolvePendingNormalDefeatRecoveryDestination(
    snapshot,
    explicitDestinationId
  );

  const nextSnapshot = cloneSnapshot(snapshot);
  for (let index = 0; index < 4; index += 1) {
    nextSnapshot.clock = advanceClock(nextSnapshot.clock, 1);
    nextSnapshot.capturedAtTick = nextSnapshot.clock.tick;
    nextSnapshot.playerState.saveMeta.totalPlayTicks += 1;
  }
  nextSnapshot.playerState.location = {
    ...nextSnapshot.playerState.location,
    settlementId: destinationId,
    siteLabel:
      nextSnapshot.sessionState.knownLocations.find(
        (location) => location.settlementId === destinationId
      )?.name ?? nextSnapshot.playerState.location.siteLabel
  };

  const repaired: NormalDefeatReceiptState = {
    ...pending,
    resolvedTick: nextSnapshot.clock.tick,
    recoveryTicks: 4,
    destinationId,
    destinationSource: "explicit_context",
    posture: "playable"
  };
  nextSnapshot.normalDefeatReceipts = (
    nextSnapshot.normalDefeatReceipts ?? []
  ).map((receipt) =>
    receipt.receiptId === repaired.receiptId ? repaired : receipt
  );
  nextSnapshot.sessionState.chronicle =
    nextSnapshot.sessionState.chronicle.map((entry) =>
      entry.id === repaired.chronicleEntryId
        ? {
            ...entry,
            timeLabel: `Tick ${nextSnapshot.clock.tick}`,
            summary: `Recovered at ${destinationId} after deterministic recovery repair.`,
            statusLabel: "Recovered",
            tags: entry.tags.map((tag) =>
              tag === "recovery_pending" ? "playable" : tag
            )
          }
        : entry
    );
  nextSnapshot.sessionState.notifications =
    nextSnapshot.sessionState.notifications.map((entry) =>
      entry.id === repaired.notificationId
        ? {
            ...entry,
            title: "Defeat Recovery Repaired",
            detail: `You recovered at ${destinationId}. The campaign remains active and unsaved.`,
            timeLabel: `Tick ${nextSnapshot.clock.tick}`,
            tone: "warning"
          }
        : entry
    );
  nextSnapshot.authorityLedger = {
    version: 1,
    entries: [
      ...(nextSnapshot.authorityLedger?.entries ?? []),
      {
        entryId: repairLedgerEntryId,
        kind: "normal_defeat",
        sourceId:
          `mutation.recovery_repair.${pending.receiptId}`,
        acceptedAtTick: nextSnapshot.clock.tick,
        supersedesEntryId: pending.receiptId
      }
    ]
  };

  return {
    snapshot: nextSnapshot,
    receipt: repaired,
    duplicate: false
  };
}

export function resolveNormalDefeat(
  snapshot: SaveSnapshot,
  params: {
    sourceMutationId: string;
    sourceKind: NormalDefeatReceiptState["sourceKind"];
    explicitDestinationId?: string | null;
  }
): NormalDefeatResolution {
  if (!snapshot.campaignIdentity || !snapshot.campaignRules) {
    throw new Error("Normal defeat requires target campaign identity and rules.");
  }

  const existing = (snapshot.normalDefeatReceipts ?? []).find(
    (receipt) => receipt.sourceMutationId === params.sourceMutationId
  );
  if (existing) {
    return {
      snapshot,
      receipt: existing,
      duplicate: true
    };
  }

  if (snapshot.playerState.resources.hp.current > 0) {
    throw new Error("Normal defeat requires an HP-zero snapshot.");
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  const campaignIdentity = nextSnapshot.campaignIdentity;
  if (!campaignIdentity) {
    throw new Error("Normal defeat lost campaign identity while cloning.");
  }
  const sourceTick = nextSnapshot.clock.tick;
  const destination = resolveDestination(
    nextSnapshot,
    params.explicitDestinationId
  );
  const posture = destination.id ? "playable" : "recovery_pending";
  const recoveryTicks = destination.id ? 4 : 0;

  nextSnapshot.gameState.activeEncounter = null;
  nextSnapshot.sessionState.combatUi = createEmptyCombatUiState();

  for (let index = 0; index < recoveryTicks; index += 1) {
    nextSnapshot.clock = advanceClock(nextSnapshot.clock, 1);
    nextSnapshot.capturedAtTick = nextSnapshot.clock.tick;
    nextSnapshot.playerState.saveMeta.totalPlayTicks += 1;
  }

  if (destination.id) {
    nextSnapshot.playerState.location = {
      ...nextSnapshot.playerState.location,
      settlementId: destination.id,
      siteLabel:
        nextSnapshot.sessionState.knownLocations.find(
          (location) => location.settlementId === destination.id
        )?.name ?? nextSnapshot.playerState.location.siteLabel
    };
  }

  const hp = nextSnapshot.playerState.resources.hp;
  const stamina = nextSnapshot.playerState.resources.stamina;
  const mp = nextSnapshot.playerState.resources.mp;
  hp.current = Math.min(hp.max, Math.max(1, Math.ceil(hp.max * 0.25)));
  stamina.current = Math.min(stamina.max, Math.max(stamina.current, 12));

  const receiptId = createAuthorityId("normal_defeat");
  const chronicleEntryId = `${receiptId}.chronicle`;
  const notificationId = `${receiptId}.notice`;
  const receipt: NormalDefeatReceiptState = {
    receiptId,
    sourceMutationId: params.sourceMutationId,
    sourceKind: params.sourceKind,
    campaignId: campaignIdentity.campaignId,
    continuityId: campaignIdentity.continuityId,
    characterId: campaignIdentity.characterId,
    rulesVersion: 2,
    policyRevision: 1,
    sourceTick,
    resolvedTick: nextSnapshot.clock.tick,
    recoveryTicks,
    destinationId: destination.id,
    destinationSource: destination.source,
    hpRestoredTo: hp.current,
    staminaRestoredTo: stamina.current,
    mpPreservedAt: mp.current,
    posture,
    chronicleEntryId,
    notificationId
  };

  nextSnapshot.normalDefeatReceipts = [
    ...(nextSnapshot.normalDefeatReceipts ?? []),
    receipt
  ];
  nextSnapshot.authorityLedger = {
    version: 1,
    entries: [
      ...(nextSnapshot.authorityLedger?.entries ?? []),
      {
        entryId: receiptId,
        kind: "normal_defeat",
        sourceId: params.sourceMutationId,
        acceptedAtTick: nextSnapshot.clock.tick
      }
    ]
  };
  const chronicleEntry: ChronicleEventState = {
      id: chronicleEntryId,
      category: "combat",
      title: "Defeated, Not Ended",
      timeLabel: `Tick ${nextSnapshot.clock.tick}`,
      summary:
        posture === "playable"
          ? `Recovered at ${destination.id} after being defeated.`
          : "Defeat was resolved, but no safe recovery settlement could be verified.",
      statusLabel:
        posture === "playable" ? "Recovered" : "Recovery Pending",
      entities: [nextSnapshot.playerState.coreData.playerName],
      results: [
        `HP restored to ${hp.current}.`,
        `Stamina restored to ${stamina.current}.`
      ],
      statChanges: [],
      tags: ["normal_stakes", "defeat", posture]
  };
  nextSnapshot.sessionState.chronicle = [
    chronicleEntry,
    ...nextSnapshot.sessionState.chronicle
  ].slice(0, 160);
  const notification: NotificationState = {
      id: notificationId,
      title:
        posture === "playable"
          ? "Defeat Resolved"
          : "Recovery Pending",
      detail:
        posture === "playable"
          ? `You recovered at ${destination.id}. The campaign remains active and unsaved.`
          : "The campaign remains active, but play is blocked until a safe recovery location is repaired.",
      timeLabel: `Tick ${nextSnapshot.clock.tick}`,
      tone: posture === "playable" ? "warning" : "danger"
  };
  nextSnapshot.sessionState.notifications = [
    notification,
    ...nextSnapshot.sessionState.notifications
  ].slice(0, 20);

  return {
    snapshot: nextSnapshot,
    receipt,
    duplicate: false
  };
}
