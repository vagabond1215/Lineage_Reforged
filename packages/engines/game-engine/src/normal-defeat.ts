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

export type NormalDefeatRecoveryDestination = {
  id: string;
  source: Exclude<
    NormalDefeatReceiptState["destinationSource"],
    "none"
  >;
};

type AutomaticRecoverySettlementCandidate =
  | { status: "absent" }
  | { status: "invalid" }
  | { status: "valid"; id: string };

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return structuredClone(snapshot);
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
    (location) => location.settlementId?.trim() === destinationId
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

function inspectAutomaticRecoverySettlement(
  snapshot: SaveSnapshot,
  value: string | null | undefined,
  sourceLabel: string
): AutomaticRecoverySettlementCandidate {
  if (value === null || value === undefined) {
    return { status: "absent" };
  }
  try {
    const normalized = normalizeRecoveryDestinationId(value, sourceLabel);
    if (!normalized) {
      return { status: "invalid" };
    }
    return {
      status: "valid",
      id: requireKnownSafeSettlement(snapshot, normalized, sourceLabel)
    };
  } catch {
    return { status: "invalid" };
  }
}

function inspectAutomaticCampaignStartSettlement(
  snapshot: SaveSnapshot
): AutomaticRecoverySettlementCandidate {
  const startFlags = snapshot.playerState.flags.filter(
    (flag) =>
      flag.startsWith("player.start.") &&
      !flag.startsWith("player.start_authority.") &&
      !flag.startsWith("player.start_mode.")
  );
  if (startFlags.length === 0) {
    return { status: "absent" };
  }
  if (startFlags.length !== 1) {
    return { status: "invalid" };
  }
  return inspectAutomaticRecoverySettlement(
    snapshot,
    startFlags[0]!.slice("player.start.".length),
    "campaign-start settlement"
  );
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
      normalizeRecoveryDestinationId(location.settlementId, "known-location")
    )
    .filter((candidate): candidate is string => candidate !== null);
  return [...new Set(candidates)]
    .map((candidate) =>
      requireKnownSafeSettlement(snapshot, candidate, "destination")
    )
    .sort();
}

export function resolvePendingNormalDefeatRecoveryDestinationWithSource(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): NormalDefeatRecoveryDestination {
  const requested = normalizeRecoveryDestinationId(
    explicitDestinationId,
    "destination"
  );
  if (requested) {
    return {
      id: requireKnownSafeSettlement(snapshot, requested, "destination"),
      source: "explicit_context"
    };
  }
  if (explicitDestinationId !== undefined) {
    throw new Error("Normal defeat recovery destination is malformed.");
  }

  const current = resolveCurrentRecoverySettlement(snapshot);
  if (current) {
    return { id: current, source: "current_settlement" };
  }
  const campaignStart = resolveCampaignStartRecoverySettlement(snapshot);
  if (campaignStart) {
    return { id: campaignStart, source: "campaign_start" };
  }
  const knownSettlements = listKnownSafeRecoverySettlements(snapshot);
  if (knownSettlements.length > 1) {
    throw new Error(
      "Normal defeat recovery has multiple authoritative known safe settlements and no accepted precedence."
    );
  }
  if (knownSettlements.length === 0) {
    throw new Error(
      "Normal defeat recovery has no authoritative known safe settlement."
    );
  }
  return {
    id: knownSettlements[0]!,
    source: "sole_known_settlement"
  };
}

export function resolvePendingNormalDefeatRecoveryDestination(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): string {
  return resolvePendingNormalDefeatRecoveryDestinationWithSource(
    snapshot,
    explicitDestinationId
  ).id;
}

function resolveInitialDestination(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): {
  id: string | null;
  source: NormalDefeatReceiptState["destinationSource"];
} {
  if (explicitDestinationId !== undefined) {
    const requested = normalizeRecoveryDestinationId(
      explicitDestinationId,
      "destination"
    );
    if (!requested) {
      throw new Error("Normal defeat recovery destination is malformed.");
    }
    return {
      id: requireKnownSafeSettlement(snapshot, requested, "destination"),
      source: "explicit_context"
    };
  }

  const current = inspectAutomaticRecoverySettlement(
    snapshot,
    snapshot.playerState.location.settlementId,
    "current-location"
  );
  if (current.status !== "absent") {
    return current.status === "valid"
      ? { id: current.id, source: "current_settlement" }
      : { id: null, source: "none" };
  }

  const campaignStart = inspectAutomaticCampaignStartSettlement(snapshot);
  if (campaignStart.status !== "absent") {
    return campaignStart.status === "valid"
      ? { id: campaignStart.id, source: "campaign_start" }
      : { id: null, source: "none" };
  }
  return { id: null, source: "none" };
}

function isExactNonblankId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value
  );
}

function isFiniteIntegerResource(
  resource: { current: number; max: number },
  requirePositiveMaximum = false
): boolean {
  return (
    Number.isFinite(resource.current) &&
    Number.isInteger(resource.current) &&
    Number.isFinite(resource.max) &&
    Number.isInteger(resource.max) &&
    resource.max >= (requirePositiveMaximum ? 1 : 0) &&
    resource.current >= 0 &&
    resource.current <= resource.max
  );
}

function requireExactInitialResources(snapshot: SaveSnapshot): void {
  const { hp, stamina, mp } = snapshot.playerState.resources;
  if (
    !isFiniteIntegerResource(hp, true) ||
    !isFiniteIntegerResource(stamina) ||
    !isFiniteIntegerResource(mp) ||
    hp.current !== 0
  ) {
    throw new Error(
      "Normal defeat requires exact finite integer resource authority with HP current equal to zero."
    );
  }
}

function sameStrings(actual: string[], expected: string[]): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function isExactChronicleProjection(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState,
  mode: "pending" | "initial_playable" | "repaired"
): boolean {
  const matches = snapshot.sessionState.chronicle.filter(
    (entry) => entry.id === receipt.chronicleEntryId
  );
  if (matches.length !== 1) {
    return false;
  }
  const entry = matches[0]!;
  const pending = mode === "pending";
  const repaired = mode === "repaired";
  return (
    entry.category === "combat" &&
    entry.title === "Defeated, Not Ended" &&
    entry.timeLabel === `Tick ${receipt.resolvedTick}` &&
    entry.summary ===
      (pending
        ? "Defeat was resolved, but no safe recovery settlement could be verified."
        : repaired
          ? `Recovered at ${receipt.destinationId} after deterministic recovery repair.`
          : `Recovered at ${receipt.destinationId} after being defeated.`) &&
    entry.statusLabel === (pending ? "Recovery Pending" : "Recovered") &&
    sameStrings(entry.entities, [snapshot.playerState.coreData.playerName]) &&
    sameStrings(entry.results, [
      `HP restored to ${receipt.hpRestoredTo}.`,
      `Stamina restored to ${receipt.staminaRestoredTo}.`
    ]) &&
    entry.statChanges.length === 0 &&
    sameStrings(entry.tags, [
      "normal_stakes",
      "defeat",
      pending ? "recovery_pending" : "playable"
    ])
  );
}

function isExactNotificationProjection(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState,
  mode: "pending" | "initial_playable" | "repaired"
): boolean {
  const matches = snapshot.sessionState.notifications.filter(
    (entry) => entry.id === receipt.notificationId
  );
  if (matches.length !== 1) {
    return false;
  }
  const entry = matches[0]!;
  const pending = mode === "pending";
  const repaired = mode === "repaired";
  return (
    entry.title ===
      (pending
        ? "Recovery Pending"
        : repaired
          ? "Defeat Recovery Repaired"
          : "Defeat Resolved") &&
    entry.detail ===
      (pending
        ? "The campaign remains active, but play is blocked until a safe recovery location is repaired."
        : `You recovered at ${receipt.destinationId}. The campaign remains active and unsaved.`) &&
    entry.timeLabel === `Tick ${receipt.resolvedTick}` &&
    entry.tone === (pending ? "danger" : "warning")
  );
}

function hasExactReceiptIdentity(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState
): boolean {
  const receipts = snapshot.normalDefeatReceipts ?? [];
  return (
    receipts.filter((candidate) => candidate.receiptId === receipt.receiptId)
      .length === 1 &&
    receipts.filter(
      (candidate) =>
        candidate.sourceMutationId === receipt.sourceMutationId
    ).length === 1
  );
}

function hasExactBaseAuthority(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState
): boolean {
  const identity = snapshot.campaignIdentity;
  const rules = snapshot.campaignRules;
  return (
    !!identity &&
    !!rules &&
    rules.version === 2 &&
    rules.policyRevision === 1 &&
    rules.stakesRules === "normal_stakes" &&
    receipt.campaignId === identity.campaignId &&
    receipt.characterId === identity.characterId &&
    receipt.characterId === snapshot.playerState.playerId &&
    receipt.rulesVersion === rules.version &&
    receipt.policyRevision === rules.policyRevision &&
    (receipt.sourceKind === "accepted_mutation" ||
      receipt.sourceKind === "unknown_or_legacy") &&
    isExactNonblankId(receipt.receiptId) &&
    isExactNonblankId(receipt.sourceMutationId) &&
    isExactNonblankId(receipt.continuityId) &&
    isExactNonblankId(receipt.chronicleEntryId) &&
    isExactNonblankId(receipt.notificationId) &&
    Number.isInteger(receipt.sourceTick) &&
    receipt.sourceTick >= 0 &&
    Number.isInteger(receipt.resolvedTick) &&
    receipt.resolvedTick >= receipt.sourceTick &&
    hasExactReceiptIdentity(snapshot, receipt)
  );
}

function hasExactOriginalLedger(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState,
  acceptedAtTick: number
): boolean {
  const matches = (snapshot.authorityLedger?.entries ?? []).filter(
    (entry) => entry.entryId === receipt.receiptId
  );
  const sourceMatches = (snapshot.authorityLedger?.entries ?? []).filter(
    (entry) =>
      entry.kind === "normal_defeat" &&
      entry.sourceId === receipt.sourceMutationId &&
      entry.supersedesEntryId === undefined
  );
  return (
    matches.length === 1 &&
    sourceMatches.length === 1 &&
    sourceMatches[0] === matches[0] &&
    matches[0]!.kind === "normal_defeat" &&
    matches[0]!.sourceId === receipt.sourceMutationId &&
    matches[0]!.acceptedAtTick === acceptedAtTick &&
    matches[0]!.supersedesEntryId === undefined
  );
}

function listCorrectionEntries(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState
) {
  const correctionId = `normal_defeat_recovery.${receipt.receiptId}`;
  return (snapshot.authorityLedger?.entries ?? []).filter(
    (entry) =>
      entry.entryId === correctionId ||
      entry.supersedesEntryId === receipt.receiptId
  );
}

export function validatePendingNormalDefeatRecoveryProvenance(
  snapshot: SaveSnapshot,
  targetReceiptId?: string
): NormalDefeatReceiptState {
  const pendingReceipts = (snapshot.normalDefeatReceipts ?? []).filter(
    (receipt) => receipt.posture === "recovery_pending"
  );
  if (pendingReceipts.length !== 1) {
    throw new Error(
      `Normal defeat recovery repair requires exactly one pending receipt; found ${pendingReceipts.length}.`
    );
  }
  const pending = pendingReceipts[0]!;
  const { hp, stamina, mp } = snapshot.playerState.resources;
  const expectedHp = isFiniteIntegerResource(hp, true)
    ? Math.min(hp.max, Math.max(1, Math.ceil(hp.max * 0.25)))
    : Number.NaN;
  const minimumStamina = isFiniteIntegerResource(stamina)
    ? Math.min(stamina.max, 12)
    : Number.NaN;
  const inferredCompletionContinuity =
    pending.recoveryCompletionContinuityId === undefined
      ? null
      : pending.recoveryCompletionContinuityId;

  if (
    (targetReceiptId !== undefined && pending.receiptId !== targetReceiptId) ||
    !hasExactBaseAuthority(snapshot, pending) ||
    pending.continuityId !== snapshot.campaignIdentity!.continuityId ||
    pending.posture !== "recovery_pending" ||
    pending.recoveryTicks !== 0 ||
    pending.destinationId !== null ||
    pending.destinationSource !== "none" ||
    inferredCompletionContinuity !== null ||
    pending.sourceTick !== pending.resolvedTick ||
    snapshot.clock.tick !== pending.resolvedTick ||
    snapshot.capturedAtTick !== pending.resolvedTick ||
    !isFiniteIntegerResource(hp, true) ||
    !isFiniteIntegerResource(stamina) ||
    !isFiniteIntegerResource(mp) ||
    pending.hpRestoredTo !== hp.current ||
    pending.hpRestoredTo !== expectedHp ||
    pending.staminaRestoredTo !== stamina.current ||
    pending.staminaRestoredTo < minimumStamina ||
    pending.staminaRestoredTo > stamina.max ||
    pending.mpPreservedAt !== mp.current ||
    !hasExactOriginalLedger(snapshot, pending, pending.resolvedTick) ||
    listCorrectionEntries(snapshot, pending).length !== 0 ||
    !isExactChronicleProjection(snapshot, pending, "pending") ||
    !isExactNotificationProjection(snapshot, pending, "pending")
  ) {
    throw new Error(
      "Normal defeat recovery repair provenance is missing, duplicated, or conflicting."
    );
  }
  return pending;
}

export function validateCompletedNormalDefeatRecoveryProvenance(
  snapshot: SaveSnapshot,
  targetReceiptId: string
): NormalDefeatReceiptState {
  const matches = (snapshot.normalDefeatReceipts ?? []).filter(
    (receipt) => receipt.receiptId === targetReceiptId
  );
  const receipt = matches[0] ?? null;
  const completionContinuity =
    receipt?.recoveryCompletionContinuityId === undefined
      ? receipt?.continuityId
      : receipt.recoveryCompletionContinuityId;
  const compatibleCompletionContinuities = new Set([
    receipt?.continuityId,
    snapshot.campaignIdentity?.continuityId,
    snapshot.campaignIdentity?.parentContinuityId
  ]);
  const correction = receipt ? listCorrectionEntries(snapshot, receipt) : [];
  const entry = correction[0] ?? null;
  const validDestinationSource =
    receipt?.destinationSource === "explicit_context" ||
    receipt?.destinationSource === "current_settlement" ||
    receipt?.destinationSource === "campaign_start" ||
    receipt?.destinationSource === "sole_known_settlement";
  const hp = snapshot.playerState.resources.hp;
  const stamina = snapshot.playerState.resources.stamina;
  const mp = snapshot.playerState.resources.mp;
  const expectedHp = isFiniteIntegerResource(hp, true)
    ? Math.min(hp.max, Math.max(1, Math.ceil(hp.max * 0.25)))
    : Number.NaN;
  const minimumStamina = isFiniteIntegerResource(stamina)
    ? Math.min(stamina.max, 12)
    : Number.NaN;

  if (
    matches.length !== 1 ||
    !receipt ||
    !hasExactBaseAuthority(snapshot, receipt) ||
    receipt.posture !== "playable" ||
    receipt.recoveryTicks !== 4 ||
    receipt.resolvedTick !== receipt.sourceTick + 4 ||
    snapshot.clock.tick < receipt.resolvedTick ||
    snapshot.capturedAtTick !== snapshot.clock.tick ||
    !isExactNonblankId(receipt.destinationId) ||
    !validDestinationSource ||
    !isExactNonblankId(completionContinuity) ||
    !compatibleCompletionContinuities.has(completionContinuity) ||
    !isFiniteIntegerResource(hp, true) ||
    !isFiniteIntegerResource(stamina) ||
    !isFiniteIntegerResource(mp) ||
    receipt.hpRestoredTo !== expectedHp ||
    !Number.isInteger(receipt.staminaRestoredTo) ||
    receipt.staminaRestoredTo < minimumStamina ||
    receipt.staminaRestoredTo > stamina.max ||
    !Number.isInteger(receipt.mpPreservedAt) ||
    receipt.mpPreservedAt < 0 ||
    receipt.mpPreservedAt > mp.max ||
    !hasExactOriginalLedger(snapshot, receipt, receipt.sourceTick) ||
    correction.length !== 1 ||
    !entry ||
    entry.entryId !== `normal_defeat_recovery.${receipt.receiptId}` ||
    entry.kind !== "normal_defeat" ||
    entry.sourceId !== `mutation.recovery_repair.${receipt.receiptId}` ||
    entry.acceptedAtTick !== receipt.resolvedTick ||
    entry.supersedesEntryId !== receipt.receiptId ||
    !isExactChronicleProjection(snapshot, receipt, "repaired") ||
    !isExactNotificationProjection(snapshot, receipt, "repaired")
  ) {
    throw new Error(
      "Normal defeat recovery completed receipt provenance is missing, duplicated, or conflicting."
    );
  }
  requireKnownSafeSettlement(snapshot, receipt.destinationId, "destination");
  return receipt;
}

function validateInitialDuplicateEvidence(
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState,
  params: {
    sourceMutationId: string;
    sourceKind: NormalDefeatReceiptState["sourceKind"];
    explicitDestinationId?: string | null;
  }
): void {
  if (receipt.sourceKind !== params.sourceKind) {
    throw new Error(
      "Normal defeat duplicate provenance is missing, duplicated, or conflicting."
    );
  }
  if (receipt.posture === "recovery_pending") {
    if (params.explicitDestinationId !== undefined) {
      throw new Error(
        "Normal defeat duplicate provenance is missing, duplicated, or conflicting."
      );
    }
    validatePendingNormalDefeatRecoveryProvenance(snapshot, receipt.receiptId);
    return;
  }

  if (listCorrectionEntries(snapshot, receipt).length > 0) {
    validateCompletedNormalDefeatRecoveryProvenance(
      snapshot,
      receipt.receiptId
    );
  } else {
    const completionContinuity =
      receipt.recoveryCompletionContinuityId === undefined
        ? receipt.continuityId
        : receipt.recoveryCompletionContinuityId;
    const validSource =
      receipt.destinationSource === "explicit_context" ||
      receipt.destinationSource === "current_settlement" ||
      receipt.destinationSource === "campaign_start";
    if (
      !hasExactBaseAuthority(snapshot, receipt) ||
      receipt.posture !== "playable" ||
      receipt.recoveryTicks !== 4 ||
      receipt.resolvedTick !== receipt.sourceTick + 4 ||
      !isExactNonblankId(receipt.destinationId) ||
      !validSource ||
      completionContinuity !== receipt.continuityId ||
      !hasExactOriginalLedger(snapshot, receipt, receipt.resolvedTick) ||
      !isExactChronicleProjection(snapshot, receipt, "initial_playable") ||
      !isExactNotificationProjection(snapshot, receipt, "initial_playable")
    ) {
      throw new Error(
        "Normal defeat duplicate provenance is missing, duplicated, or conflicting."
      );
    }
    requireKnownSafeSettlement(snapshot, receipt.destinationId, "destination");
  }

  if (params.explicitDestinationId !== undefined) {
    const requested = resolvePendingNormalDefeatRecoveryDestination(
      snapshot,
      params.explicitDestinationId
    );
    if (
      receipt.destinationSource !== "explicit_context" ||
      requested !== receipt.destinationId
    ) {
      throw new Error(
        "Normal defeat duplicate provenance is missing, duplicated, or conflicting."
      );
    }
  }
}

export function findPendingNormalDefeat(
  snapshot: SaveSnapshot
): NormalDefeatReceiptState | null {
  const pendingReceipts = (snapshot.normalDefeatReceipts ?? []).filter(
    (receipt) => receipt.posture === "recovery_pending"
  );
  return pendingReceipts.length === 1 ? pendingReceipts[0]! : null;
}

export function hasPendingNormalDefeat(snapshot: SaveSnapshot): boolean {
  return (snapshot.normalDefeatReceipts ?? []).some(
    (receipt) => receipt.posture === "recovery_pending"
  );
}

export function applyValidatedPendingNormalDefeatRecovery(
  snapshot: SaveSnapshot,
  pendingReceiptId: string,
  destination: NormalDefeatRecoveryDestination,
  completionContinuityId: string
): NormalDefeatResolution {
  const nextSnapshot = snapshot;
  const pending = (nextSnapshot.normalDefeatReceipts ?? []).find(
    (receipt) => receipt.receiptId === pendingReceiptId
  );
  if (!pending) {
    throw new Error("Validated Normal defeat recovery target was lost.");
  }
  for (let index = 0; index < 4; index += 1) {
    nextSnapshot.clock = advanceClock(nextSnapshot.clock, 1);
    nextSnapshot.capturedAtTick = nextSnapshot.clock.tick;
    nextSnapshot.playerState.saveMeta.totalPlayTicks += 1;
  }
  nextSnapshot.playerState.location = {
    ...nextSnapshot.playerState.location,
    settlementId: destination.id,
    siteLabel:
      nextSnapshot.sessionState.knownLocations.find(
        (location) => location.settlementId === destination.id
      )?.name ?? nextSnapshot.playerState.location.siteLabel
  };

  const repaired: NormalDefeatReceiptState = {
    ...pending,
    recoveryCompletionContinuityId: completionContinuityId,
    resolvedTick: nextSnapshot.clock.tick,
    recoveryTicks: 4,
    destinationId: destination.id,
    destinationSource: destination.source,
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
            summary: `Recovered at ${destination.id} after deterministic recovery repair.`,
            statusLabel: "Recovered",
            tags: ["normal_stakes", "defeat", "playable"]
          }
        : entry
    );
  nextSnapshot.sessionState.notifications =
    nextSnapshot.sessionState.notifications.map((entry) =>
      entry.id === repaired.notificationId
        ? {
            ...entry,
            title: "Defeat Recovery Repaired",
            detail: `You recovered at ${destination.id}. The campaign remains active and unsaved.`,
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
        entryId: `normal_defeat_recovery.${pending.receiptId}`,
        kind: "normal_defeat",
        sourceId: `mutation.recovery_repair.${pending.receiptId}`,
        acceptedAtTick: nextSnapshot.clock.tick,
        supersedesEntryId: pending.receiptId
      }
    ]
  };
  return { snapshot: nextSnapshot, receipt: repaired, duplicate: false };
}

export function repairPendingNormalDefeat(
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null
): NormalDefeatResolution {
  const pending = validatePendingNormalDefeatRecoveryProvenance(snapshot);
  const destination =
    resolvePendingNormalDefeatRecoveryDestinationWithSource(
      snapshot,
      explicitDestinationId
    );
  const completionContinuityId = snapshot.campaignIdentity?.continuityId;
  if (!completionContinuityId) {
    throw new Error("Normal defeat recovery lost campaign continuity.");
  }
  return applyValidatedPendingNormalDefeatRecovery(
    cloneSnapshot(snapshot),
    pending.receiptId,
    destination,
    completionContinuityId
  );
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
  if (
    snapshot.campaignRules.version !== 2 ||
    snapshot.campaignRules.policyRevision !== 1 ||
    snapshot.campaignRules.stakesRules !== "normal_stakes" ||
    snapshot.campaignIdentity.characterId !==
      snapshot.playerState.playerId ||
    !isExactNonblankId(snapshot.campaignIdentity.campaignId) ||
    !isExactNonblankId(snapshot.campaignIdentity.continuityId) ||
    !Number.isInteger(snapshot.clock.tick) ||
    snapshot.clock.tick < 0 ||
    snapshot.capturedAtTick !== snapshot.clock.tick
  ) {
    throw new Error("Normal defeat campaign authority is conflicting.");
  }
  if (
    !isExactNonblankId(params.sourceMutationId) ||
    (params.sourceKind !== "accepted_mutation" &&
      params.sourceKind !== "unknown_or_legacy")
  ) {
    throw new Error("Normal defeat source authority is malformed.");
  }

  const existingMatches = (snapshot.normalDefeatReceipts ?? []).filter(
    (receipt) => receipt.sourceMutationId === params.sourceMutationId
  );
  if (existingMatches.length > 0) {
    if (existingMatches.length !== 1) {
      throw new Error(
        "Normal defeat duplicate provenance is missing, duplicated, or conflicting."
      );
    }
    const existing = existingMatches[0]!;
    validateInitialDuplicateEvidence(snapshot, existing, params);
    return { snapshot, receipt: existing, duplicate: true };
  }

  requireExactInitialResources(snapshot);
  const destination = resolveInitialDestination(
    snapshot,
    params.explicitDestinationId
  );
  const nextSnapshot = cloneSnapshot(snapshot);
  const campaignIdentity = nextSnapshot.campaignIdentity;
  if (!campaignIdentity) {
    throw new Error("Normal defeat lost campaign identity while cloning.");
  }
  const sourceTick = nextSnapshot.clock.tick;
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

  const { hp, stamina, mp } = nextSnapshot.playerState.resources;
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
    recoveryCompletionContinuityId:
      posture === "playable" ? campaignIdentity.continuityId : null,
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
    statusLabel: posture === "playable" ? "Recovered" : "Recovery Pending",
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
    title: posture === "playable" ? "Defeat Resolved" : "Recovery Pending",
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

  return { snapshot: nextSnapshot, receipt, duplicate: false };
}
