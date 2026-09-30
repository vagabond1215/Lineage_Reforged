import { serializeSnapshot, deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import { prepareCharacterAchievementProgress } from "../../../../packages/engines/game-engine/src/achievements.js";
import { createAuthorityId, TARGET_SNAPSHOT_FORMAT } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { resolveLegacyPreparationSelection } from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";
import { verifySoundingsAdmissionProvenance } from "../../../../packages/engines/game-engine/src/soundings-admission-witness.js";
import { CampaignStoreError, type CampaignStoreFailureCode, type CampaignStorePublication } from "./campaignIndexedDbStore.js";
import type { CharacterCreationFormState } from "./characterCreationForm.js";
import { type CleanEpochAccountStore, type CleanEpochAttemptRecord, type CleanEpochSlotRead } from "./cleanEpochAccountStore.js";
import { buildNewCampaignAttemptInputFingerprint } from "./newCampaignAttemptCoordinator.js";
import { createNewGameSnapshot } from "./newGameSnapshot.js";
import { resolveHeirSourceById } from "./runLifecycle.js";
import { buildSaveMetadata, type CampaignPublicationConsumerPlan, type StoredSaveEnvelope } from "./saveManager.js";

export type EpochFirstCampaignResult<T> =
  | { status: "ready"; value: T }
  | { status: "blocked"; code: CampaignStoreFailureCode | "invalid_input"; message: string;
      accountId: string; slotId: string };

function blocked(error: unknown, accountId: string, slotId: string): EpochFirstCampaignResult<never> {
  if (error instanceof CampaignStoreError)
    return { status: "blocked", code: error.code, message: error.message, accountId, slotId };
  return { status: "blocked", code: "invalid_input", message: error instanceof Error ? error.message : String(error),
    accountId, slotId };
}

function requireCleanCreator(attempt: CleanEpochAttemptRecord): void {
  const snapshot = deserializeSnapshot(attempt.snapshotRaw);
  // A creator snapshot only stages the Soundings offer. Admission can occur after the first playable head.
  // There is no independent first-publication witness in this attempt contract.
  if (verifySoundingsAdmissionProvenance(snapshot) !== "not_completed")
    throw new CampaignStoreError("invalid_record", "First-campaign attempt claims completed Soundings without retained admission provenance.");
}

function normalizedForm(form: CharacterCreationFormState): CharacterCreationFormState {
  return { ...form, playerName: form.playerName.trim(), sourceRunId: form.sourceRunId.trim() };
}

function fingerprint(form: CharacterCreationFormState, hasSelectableBackstories: boolean | undefined,
  preparation: { selectedUnlockIds: string[]; selectedChoicePayloads: Record<string, string> }): string {
  return buildNewCampaignAttemptInputFingerprint({ form, preparationSelection: {
    unlockIds: preparation.selectedUnlockIds, choices: preparation.selectedChoicePayloads
  }, hasSelectableBackstories: hasSelectableBackstories ?? null });
}

function matchesRetainedInput(attempt: CleanEpochAttemptRecord, form: CharacterCreationFormState,
  hasSelectableBackstories: boolean | undefined, currentFingerprint: string,
  consumersCompleted: boolean): boolean {
  if (attempt.inputFingerprint === currentFingerprint) return true;
  if (!consumersCompleted) return false;
  // The accepted publication consumes selected preparation. Compare only caller input after completion.
  try {
    const retained = JSON.parse(attempt.inputFingerprint) as { form?: unknown; hasSelectableBackstories?: unknown };
    return buildNewCampaignAttemptInputFingerprint(retained.form) === buildNewCampaignAttemptInputFingerprint(form) &&
      retained.hasSelectableBackstories === (hasSelectableBackstories ?? null);
  } catch { return false; }
}

function publicationFromAttempt(attempt: CleanEpochAttemptRecord): CampaignStorePublication {
  requireCleanCreator(attempt);
  const snapshot = deserializeSnapshot(attempt.snapshotRaw);
  const campaign = snapshot.campaignIdentity;
  if (!campaign || campaign.campaignId !== attempt.campaignId)
    throw new CampaignStoreError("invalid_record", "Prepared first-campaign identity is invalid.");
  const artifactId = createAuthorityId("artifact");
  const generationId = createAuthorityId("generation");
  const publicationId = createAuthorityId("publication");
  const savedAt = attempt.createdAt;
  const metadata = { ...buildSaveMetadata(attempt.slotId as StoredSaveEnvelope["slotId"], snapshot),
    lastSavedAt: savedAt, snapshotVersion: TARGET_SNAPSHOT_FORMAT };
  const envelope: StoredSaveEnvelope = { version: 7, accountId: attempt.accountId,
    slotId: attempt.slotId as StoredSaveEnvelope["slotId"], savedAt, metadata,
    snapshotFormatId: TARGET_SNAPSHOT_FORMAT, campaignId: campaign.campaignId,
    continuityId: campaign.continuityId, characterId: snapshot.playerState.playerId,
    artifactId, generationId, publicationId, headRevision: 1, terminal: false,
    snapshot: attempt.snapshotRaw };
  return { accountId: attempt.accountId, campaignId: campaign.campaignId,
    slotId: attempt.slotId, expectedHead: null, artifactRaw: JSON.stringify(envelope),
    control: { version: 1, accountId: attempt.accountId, campaignId: campaign.campaignId,
      headArtifactId: artifactId, headPublicationId: publicationId, headRevision: 1,
      previousHeadArtifactId: null, previousHeadPublicationId: null, closed: false,
      updatedAt: savedAt } };
}

/** Inert first-campaign owner. App does not import or select this adapter. */
export class CleanEpochFirstCampaignAdapter {
  constructor(private readonly owner: CleanEpochAccountStore) {}

  async prepare(accountId: string, formInput: CharacterCreationFormState,
    hasSelectableBackstories?: boolean): Promise<EpochFirstCampaignResult<CleanEpochAttemptRecord>> {
    const form = normalizedForm(formInput);
    const slotId = form.saveSlotId;
    try {
      const account = await this.owner.readSelected(accountId);
      if (!account) throw new CampaignStoreError("invalid_record", "Creator account is missing.");
      const selection = resolveLegacyPreparationSelection(account.profile);
      const inputFingerprint = fingerprint(form, hasSelectableBackstories, selection);
      const retained = await this.owner.readAttempt(accountId, slotId);
      if (retained) {
        requireCleanCreator(retained);
        const recovery = await this.owner.readRecovery(accountId, slotId);
        if (!matchesRetainedInput(retained, form, hasSelectableBackstories, inputFingerprint,
          recovery?.status === "consumers_completed"))
          throw new CampaignStoreError("conflict", "Account slot is reserved by a different creator input.");
        return { status: "ready", value: retained };
      }
      const sourceRunId = form.sourceRunId;
      const source = sourceRunId ? resolveHeirSourceById(account.profile, sourceRunId) : null;
      if (sourceRunId && !source)
        throw new CampaignStoreError("conflict", "Selected lineage source is no longer available.");
      const createdAt = new Date().toISOString();
      const snapshot = createNewGameSnapshot(form, accountId, {
        appliedLegacyPreparationIds: selection.selectedUnlockIds,
        appliedLegacyPreparationChoices: selection.selectedChoicePayloads,
        accountProfile: account.profile,
        ...(typeof hasSelectableBackstories === "boolean" ? { hasSelectableBackstories } : {}),
        ...(source ? { sourceRunId } : {}),
        ...(source && source.lineageId !== form.lineageId ? { crossLineageStart: true } : {})
      });
      if (verifySoundingsAdmissionProvenance(snapshot) !== "not_completed")
        throw new CampaignStoreError("invalid_record", "Creator produced completed Soundings without independent witness.");
      const prepared = prepareCharacterAchievementProgress(snapshot, createdAt).snapshot;
      const coreFingerprint = JSON.stringify({ slotId, capturedAtTick: prepared.capturedAtTick,
        characterAchievementIds: prepared.playerState.achievements.unlocked.map(entry => entry.achievementId) });
      const preparationFingerprint = JSON.stringify({ selectedPreparationUnlockIds: selection.selectedUnlockIds,
        selectedPreparationChoicePayloads: selection.selectedChoicePayloads, sourceRunId: sourceRunId || null });
      const consumerPlans: CampaignPublicationConsumerPlan[] = [
        ...(["active_history", "account_achievements", "legacy_rewards", "last_played"] as const)
          .map(kind => ({ kind, payloadFingerprint: coreFingerprint })),
        { kind: "preparation_consumption", payloadFingerprint: preparationFingerprint },
        ...(source ? [{ kind: "inheritance_consumption" as const, payloadFingerprint: preparationFingerprint }] : [])
      ];
      const attempt: CleanEpochAttemptRecord = { version: 1, status: "prepared", accountId,
        slotId, campaignId: prepared.campaignIdentity!.campaignId,
        attemptId: createAuthorityId("new_campaign_attempt"), expectedAccountRevision: account.revision,
        expectedHead: null, inputFingerprint, snapshotRaw: serializeSnapshot(prepared),
        consumerPlans, createdAt };
      try { return { status: "ready", value: (await this.owner.prepareAttempt(attempt)).readback }; }
      catch (error) {
        // A second tab may have won this slot while this tab generated transient IDs.
        if (!(error instanceof CampaignStoreError) || !["conflict", "stale_head"].includes(error.code)) throw error;
        const winner = await this.owner.readAttempt(accountId, slotId);
        if (!winner) throw error;
        requireCleanCreator(winner);
        const recovery = await this.owner.readRecovery(accountId, slotId);
        if (!matchesRetainedInput(winner, form, hasSelectableBackstories, inputFingerprint,
          recovery?.status === "consumers_completed")) throw error;
        return { status: "ready", value: winner };
      }
    } catch (error) { return blocked(error, accountId, slotId); }
  }

  async resume(accountId: string, slotId: CharacterCreationFormState["saveSlotId"]):
    Promise<EpochFirstCampaignResult<CleanEpochSlotRead & { status: "ready" }>> {
    try {
      const attempt = await this.owner.readAttempt(accountId, slotId);
      if (!attempt) throw new CampaignStoreError("invalid_record", "Prepared first-campaign attempt is missing.");
      requireCleanCreator(attempt);
      let recovery = await this.owner.readRecovery(accountId, slotId);
      if (!recovery) {
        try { recovery = (await this.owner.publishPreparedAttempt(attempt.attemptId,
          publicationFromAttempt(attempt))).recovery; }
        catch (error) {
          recovery = await this.owner.readRecovery(accountId, slotId);
          if (!recovery) throw error;
        }
      }
      if (recovery.attemptId !== attempt.attemptId || recovery.campaignId !== attempt.campaignId)
        throw new CampaignStoreError("conflict", "Accepted publication differs from retained attempt.");
      if (recovery.status === "accepted_pending_consumers")
        await this.owner.completePreparedAttemptConsumers(accountId, slotId, attempt.attemptId, recovery.publicationId);
      const readback = await this.owner.readSlot(accountId, slotId);
      if (readback.status !== "ready")
        throw new CampaignStoreError("readback_failed", "First campaign is not ready after consumer completion.");
      return { status: "ready", value: readback };
    } catch (error) { return blocked(error, accountId, slotId); }
  }

  async start(accountId: string, form: CharacterCreationFormState, hasSelectableBackstories?: boolean):
    Promise<EpochFirstCampaignResult<CleanEpochSlotRead & { status: "ready" }>> {
    const prepared = await this.prepare(accountId, form, hasSelectableBackstories);
    if (prepared.status === "blocked") return prepared;
    return this.resume(accountId, form.saveSlotId);
  }
}
