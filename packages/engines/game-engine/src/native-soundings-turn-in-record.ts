import type { NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import { soundingsChronicle, soundingsNotification, soundingsIds,
  serializeSoundingsIntent } from './soundings-turn-in-authority.js';

const REQUEST = /^soundings_turn_in_request\.([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
const QUEST = 'quest.ashen_reef_survey';
const OPERATION = 'operation.quest.ashen_reef_survey';
const exact = (value: object, keys: string[]) =>
  Object.keys(value).sort().join('|') === keys.sort().join('|');

/** One immutable native completion result. The retained source artifact is its durable witness. */
export type NativeSoundingsTurnInRecord = {
  version: 1;
  requestId: string;
  resultId: string;
  source: { accountId: string; campaignId: string; continuityId: string;
    artifactId: string; publicationId: string; revision: number; slotId: string };
  sourceFingerprint: string;
  surveyFingerprint: string;
  appliedTick: number;
  goldBefore: number;
  paymentGold: 5;
  timeLabel: string;
  chronicleId: string;
  notificationId: string;
};

export function isNativeSoundingsTurnInRecord(value: unknown): value is NativeSoundingsTurnInRecord {
  if (!value || typeof value !== 'object') return false;
  const row = value as NativeSoundingsTurnInRecord;
  const suffix = REQUEST.exec(row.requestId)?.[1];
  return !!suffix && exact(row, ['version', 'requestId', 'resultId', 'source',
    'sourceFingerprint', 'surveyFingerprint', 'appliedTick', 'goldBefore',
    'paymentGold', 'timeLabel', 'chronicleId', 'notificationId']) &&
    row.version === 1 && row.resultId === `native_soundings_turn_in_result.${suffix}` &&
    !!row.source && typeof row.source === 'object' &&
    exact(row.source, ['accountId', 'campaignId', 'continuityId', 'artifactId',
      'publicationId', 'revision', 'slotId']) &&
    [row.source.accountId, row.source.campaignId, row.source.continuityId,
      row.source.artifactId, row.source.publicationId, row.source.slotId].every(
      item => typeof item === 'string' && item.trim().length > 0 && item.trim() === item) &&
    Number.isSafeInteger(row.source.revision) && row.source.revision >= 1 &&
    [row.sourceFingerprint, row.surveyFingerprint].every(item =>
      typeof item === 'string' && /^[0-9a-f]{64}$/.test(item)) &&
    Number.isSafeInteger(row.appliedTick) && row.appliedTick >= 0 &&
    Number.isSafeInteger(row.goldBefore) && row.goldBefore >= 0 &&
    Number.isSafeInteger(row.goldBefore + 5) && row.paymentGold === 5 &&
    typeof row.timeLabel === 'string' && row.timeLabel.length > 0 &&
    row.chronicleId === soundingsIds(row.requestId).chronicleId &&
    row.notificationId === soundingsIds(row.requestId).notificationId;
}

/** Local shape/projection check; immutable-source replay belongs to the version-8 store. */
export function validateNativeSoundingsTurnInSnapshot(snapshot: NativeFreshCampaignSnapshot): boolean {
  const row = snapshot.nativeSoundingsTurnIn;
  const quests = snapshot.sessionState.questJournal.filter(item => item.id === QUEST);
  if (!row) return quests.every(item => item.category !== 'completed');
  return isNativeSoundingsTurnInRecord(row) &&
    snapshot.nativeSurvey?.results.length === 4 &&
    row.source.accountId === snapshot.accountId &&
    row.source.campaignId === snapshot.campaignIdentity?.campaignId &&
    row.source.continuityId === snapshot.campaignIdentity?.continuityId &&
    row.appliedTick <= snapshot.clock.tick &&
    quests.length === 1 && quests[0]?.category === 'completed' &&
    quests[0].statusLabel === 'Turned in' &&
    snapshot.sessionState.trackedQuestId !== QUEST &&
    !snapshot.sessionState.operations.some(item => item.id === OPERATION) &&
    snapshot.sessionState.chronicle.filter(item => item.id === row.chronicleId).length <= 1 &&
    snapshot.sessionState.notifications.filter(item => item.id === row.notificationId).length <= 1 &&
    snapshot.sessionState.chronicle.filter(item => item.id === row.chronicleId).every(item =>
      serializeSoundingsIntent(item) === serializeSoundingsIntent(soundingsChronicle(row))) &&
    snapshot.sessionState.notifications.filter(item => item.id === row.notificationId).every(item =>
      serializeSoundingsIntent(item) === serializeSoundingsIntent(soundingsNotification(row)));
}
