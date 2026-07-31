import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../../../packages/shared/persistence/src/index.js";
import type {
  SaveSnapshot
} from "../../../../packages/shared/types/src/index.js";
import {
  createAuthorityId,
  isTargetCampaignSnapshot
} from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import {
  inspectCampaignPublicationRecoveryForSlot,
  loadSaveWithAuthority,
  type CampaignPublicationConsumerPlan,
  type LoadedCampaignSave
} from "./saveManager.js";
import type { SaveSlotId } from "./state.js";

type StoredNewCampaignAttempt = {
  version: 1;
  attemptId: string;
  accountId: string;
  slotId: SaveSlotId;
  inputFingerprint: string;
  snapshotRaw: string;
  consumerPlans: CampaignPublicationConsumerPlan[];
  createdAt: string;
};

export type PreparedNewCampaignAttempt = {
  attemptId: string;
  accountId: string;
  slotId: SaveSlotId;
  inputFingerprint: string;
  snapshot: SaveSnapshot;
  consumerPlans: CampaignPublicationConsumerPlan[];
  recoveredPublication: LoadedCampaignSave | null;
};

const ATTEMPT_PREFIX = "cataclysm-rpg-ui.new-campaign-attempts.v1";

function getStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error(
      "New-campaign attempt storage is only available in the browser."
    );
  }
  return window.localStorage;
}

function getAttemptKey(accountId: string, slotId: SaveSlotId): string {
  return `${ATTEMPT_PREFIX}.account.${accountId}.slot.${slotId}`;
}

function normalizeForFingerprint(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForFingerprint);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalizeForFingerprint(entry)])
    );
  }
  return value;
}

export function buildNewCampaignAttemptInputFingerprint(
  normalizedInput: unknown
): string {
  return JSON.stringify(normalizeForFingerprint(normalizedInput));
}

function isConsumerPlan(value: unknown): value is CampaignPublicationConsumerPlan {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.kind === "active_history" ||
      candidate.kind === "account_achievements" ||
      candidate.kind === "legacy_rewards" ||
      candidate.kind === "preparation_consumption" ||
      candidate.kind === "inheritance_consumption" ||
      candidate.kind === "retirement_settlement" ||
      candidate.kind === "estate" ||
      candidate.kind === "last_played") &&
    typeof candidate.payloadFingerprint === "string"
  );
}

function readStoredAttempt(
  accountId: string,
  slotId: SaveSlotId
): StoredNewCampaignAttempt | null {
  const raw = getStorage().getItem(getAttemptKey(accountId, slotId));
  if (!raw) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("New-campaign attempt evidence is malformed.");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("New-campaign attempt evidence is invalid.");
  }
  const attempt = parsed as Record<string, unknown>;
  if (
    attempt.version !== 1 ||
    typeof attempt.attemptId !== "string" ||
    attempt.accountId !== accountId ||
    attempt.slotId !== slotId ||
    typeof attempt.inputFingerprint !== "string" ||
    typeof attempt.snapshotRaw !== "string" ||
    !Array.isArray(attempt.consumerPlans) ||
    !attempt.consumerPlans.every(isConsumerPlan) ||
    typeof attempt.createdAt !== "string"
  ) {
    throw new Error("New-campaign attempt evidence is invalid.");
  }
  return attempt as StoredNewCampaignAttempt;
}

function writeStoredAttempt(attempt: StoredNewCampaignAttempt): void {
  const storage = getStorage();
  const key = getAttemptKey(attempt.accountId, attempt.slotId);
  const raw = JSON.stringify(attempt);
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) {
    throw new Error("New-campaign attempt evidence failed exact readback.");
  }
}

function findRecoveredPublication(
  attempt: StoredNewCampaignAttempt,
  snapshot: SaveSnapshot
): LoadedCampaignSave | null {
  const loaded = loadSaveWithAuthority(attempt.accountId, attempt.slotId);
  if (!loaded) {
    return null;
  }
  const expected = snapshot.campaignIdentity;
  const actual = loaded.snapshot.campaignIdentity;
  if (
    !expected ||
    !actual ||
    actual.campaignId !== expected.campaignId ||
    actual.continuityId !== expected.continuityId ||
    loaded.snapshot.playerState.playerId !== snapshot.playerState.playerId
  ) {
    return null;
  }
  return loaded;
}

export function prepareNewCampaignAttempt(params: {
  accountId: string;
  slotId: SaveSlotId;
  normalizedInput: unknown;
  prepare: () => {
    snapshot: SaveSnapshot;
    consumerPlans: CampaignPublicationConsumerPlan[];
  };
}): PreparedNewCampaignAttempt {
  const inputFingerprint = buildNewCampaignAttemptInputFingerprint(
    params.normalizedInput
  );
  const retained = readStoredAttempt(params.accountId, params.slotId);

  if (retained && retained.inputFingerprint !== inputFingerprint) {
    throw new Error(
      `Save slot '${params.slotId}' has an unfinished new-campaign attempt with different normalized input.`
    );
  }

  const recoveryPosture = inspectCampaignPublicationRecoveryForSlot(
    params.accountId,
    params.slotId,
    retained?.attemptId ?? null
  );
  if (
    recoveryPosture.kind === "multiple" ||
    recoveryPosture.kind === "incompatible"
  ) {
    throw new Error(recoveryPosture.reason);
  }

  let attempt = retained;
  if (!attempt) {
    const prepared = params.prepare();
    if (
      prepared.snapshot.accountId !== params.accountId ||
      !isTargetCampaignSnapshot(prepared.snapshot)
    ) {
      throw new Error(
        "New-campaign preparation did not produce target campaign authority."
      );
    }
    const uniqueConsumerKinds = new Set(
      prepared.consumerPlans.map((plan) => plan.kind)
    );
    if (uniqueConsumerKinds.size !== prepared.consumerPlans.length) {
      throw new Error(
        "New-campaign preparation produced duplicate consumer plans."
      );
    }
    const createdAt = new Date().toISOString();
    attempt = {
      version: 1,
      attemptId: createAuthorityId("new_campaign_attempt"),
      accountId: params.accountId,
      slotId: params.slotId,
      inputFingerprint,
      snapshotRaw: serializeSnapshot(prepared.snapshot),
      consumerPlans: prepared.consumerPlans,
      createdAt
    };
    writeStoredAttempt(attempt);
  }

  const snapshot = deserializeSnapshot(attempt.snapshotRaw);
  if (
    snapshot.accountId !== attempt.accountId ||
    !isTargetCampaignSnapshot(snapshot)
  ) {
    throw new Error("New-campaign attempt snapshot authority is invalid.");
  }
  const recoveredPublication = findRecoveredPublication(attempt, snapshot);
  return {
    attemptId: attempt.attemptId,
    accountId: attempt.accountId,
    slotId: attempt.slotId,
    inputFingerprint: attempt.inputFingerprint,
    snapshot,
    consumerPlans: attempt.consumerPlans,
    recoveredPublication
  };
}

export function completeNewCampaignAttempt(
  accountId: string,
  slotId: SaveSlotId,
  attemptId: string
): void {
  const retained = readStoredAttempt(accountId, slotId);
  if (!retained) {
    return;
  }
  if (retained.attemptId !== attemptId) {
    throw new Error(
      `New-campaign attempt '${attemptId}' conflicts with retained attempt authority.`
    );
  }
  const storage = getStorage();
  const key = getAttemptKey(accountId, slotId);
  storage.removeItem(key);
  if (storage.getItem(key) !== null) {
    throw new Error("New-campaign attempt completion failed.");
  }
}
