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

function resolveCampaignStartSettlement(snapshot: SaveSnapshot): string | null {
  const startFlag = snapshot.playerState.flags.find(
    (flag) =>
      flag.startsWith("player.start.") &&
      !flag.startsWith("player.start_authority.") &&
      !flag.startsWith("player.start_mode.")
  );

  return startFlag?.slice("player.start.".length) || null;
}

function resolveDestination(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): {
  id: string | null;
  source: NormalDefeatReceiptState["destinationSource"];
} {
  if (explicitDestinationId?.trim()) {
    return { id: explicitDestinationId.trim(), source: "explicit_context" };
  }

  const currentSettlement = snapshot.playerState.location.settlementId;
  if (currentSettlement) {
    return { id: currentSettlement, source: "current_settlement" };
  }

  const campaignStart = resolveCampaignStartSettlement(snapshot);
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
  const pending = findPendingNormalDefeat(snapshot);
  const destinationId = explicitDestinationId?.trim();
  if (!pending) {
    throw new Error("Normal defeat recovery repair requires a pending receipt.");
  }
  if (!destinationId) {
    throw new Error(
      "Normal defeat recovery repair requires an explicit safe destination."
    );
  }

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
