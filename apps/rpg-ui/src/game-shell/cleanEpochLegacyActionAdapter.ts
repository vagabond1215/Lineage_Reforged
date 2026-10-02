import {
  getLegacyPreparationChoiceLabel, purchaseLegacyUnlock, removeLegacyPreparation,
  resolveLegacyPreparationSelection, selectLegacyPreparation, setLegacyPreparationChoice
} from '../../../../packages/engines/game-engine/src/legacy-unlocks.js';
import type { AccountProfileState } from '../../../../packages/shared/types/src/index.js';
import { CampaignStoreError } from './campaignIndexedDbStore.js';
import type { CleanEpochAccountRecord, CleanEpochAccountStore } from './cleanEpochAccountStore.js';

export type EpochLegacyAction =
  | { kind: 'purchase'; unlockId: string; recordedAt: string }
  | { kind: 'select'; unlockId: string }
  | { kind: 'choice'; unlockId: string; choiceId: string }
  | { kind: 'remove'; unlockId: string };

export type EpochLegacyActionRequest = {
  accountId: string;
  expectedRevision: number;
  expectedProfile: AccountProfileState;
  action: EpochLegacyAction;
};

export type EpochLegacyActionResult =
  | { status: 'ready'; account: CleanEpochAccountRecord; title: string; detail: string;
      writeStatus: 'committed' | 'same_source_retry' }
  | { status: 'rejected'; message: string }
  | { status: 'blocked'; message: string; code: string };

const exact = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);
const rejected = (message: string): EpochLegacyActionResult => ({ status: 'rejected', message });

/**
 * A caller-owned action is calculated once from its captured profile. The account
 * transaction, rather than the React view, decides whether that exact result wins.
 */
export class CleanEpochLegacyActionAdapter {
  constructor(private readonly owner: CleanEpochAccountStore) {}

  async apply(request: EpochLegacyActionRequest): Promise<EpochLegacyActionResult> {
    const { accountId, expectedRevision, expectedProfile, action } = request;
    if (!accountId || expectedProfile?.accountId !== accountId ||
        !Number.isSafeInteger(expectedRevision) || expectedRevision < 1 ||
        !action || !action.unlockId?.trim() || action.unlockId !== action.unlockId.trim())
      return rejected('Legacy action input is invalid.');
    if (action.kind === 'choice' && (!action.choiceId?.trim() || action.choiceId !== action.choiceId.trim()))
      return rejected('Legacy preparation choice is invalid.');
    if (action.kind === 'purchase' && (!Number.isFinite(Date.parse(action.recordedAt)) ||
        new Date(action.recordedAt).toISOString() !== action.recordedAt))
      return rejected('Legacy purchase time is invalid.');

    try {
      let profile: AccountProfileState;
      let title: string;
      let detail: string;
      if (action.kind === 'purchase') {
        const outcome = purchaseLegacyUnlock(expectedProfile, action.unlockId, action.recordedAt);
        if (!outcome.ok) return rejected(`Legacy purchase is unavailable: ${outcome.error}.`);
        profile = outcome.profile;
        title = 'Legacy Purchased';
        detail = outcome.transaction.summary;
      } else if (action.kind === 'select') {
        const outcome = selectLegacyPreparation(expectedProfile, action.unlockId);
        if (!outcome.ok) return rejected(`Legacy preparation is unavailable: ${outcome.error}.`);
        profile = outcome.profile;
        title = 'Preparation Selected';
        detail = 'That preparation is set aside for the next heir.';
      } else if (action.kind === 'choice') {
        const priorChoice = resolveLegacyPreparationSelection(expectedProfile)
          .selectedChoicePayloads[action.unlockId] ?? null;
        const outcome = setLegacyPreparationChoice(expectedProfile, action.unlockId, action.choiceId);
        if (!outcome.ok) return rejected(`Legacy preparation choice is unavailable: ${outcome.error}.`);
        profile = outcome.profile;
        title = priorChoice && priorChoice !== action.choiceId ? 'Preparation Updated' : 'Preparation Selected';
        detail = `That preparation now favors ${getLegacyPreparationChoiceLabel(action.unlockId, action.choiceId) ?? action.choiceId} for the next heir.`;
      } else if (action.kind === 'remove') {
        if (!resolveLegacyPreparationSelection(expectedProfile).selectedUnlockIds.includes(action.unlockId))
          return rejected('That Legacy preparation is not selected.');
        const outcome = removeLegacyPreparation(expectedProfile, action.unlockId);
        profile = outcome.profile;
        title = 'Preparation Removed';
        detail = 'That preparation is no longer set aside for the next heir.';
      } else return rejected('Legacy action kind is invalid.');
      if (exact(profile, expectedProfile)) return rejected('Legacy preparation is already in that state.');

      const current = await this.owner.readSelected(accountId);
      if (!current) return { status: 'blocked', code: 'invalid_record', message: 'Retained account is missing.' };
      if (current.revision === expectedRevision && !exact(current.profile, expectedProfile))
        return { status: 'blocked', code: 'stale_head', message: 'Retained account profile changed.' };
      if (current.revision !== expectedRevision &&
          !(current.revision === expectedRevision + 1 && exact(current.profile, profile)))
        return { status: 'blocked', code: 'stale_head', message: 'Account revision changed.' };
      const written = await this.owner.updateProfile(accountId, expectedRevision, profile);
      if (!exact(written.readback.profile, profile) ||
          written.readback.revision !== expectedRevision + 1)
        return { status: 'blocked', code: 'readback_failed', message: 'Legacy action failed exact account readback.' };
      return { status: 'ready', account: written.readback, title, detail, writeStatus: written.status };
    } catch (error) {
      if (error instanceof CampaignStoreError)
        return { status: 'blocked', code: error.code, message: error.message };
      return { status: 'blocked', code: 'invalid_record',
        message: error instanceof Error ? error.message : 'Legacy action failed.' };
    }
  }
}
