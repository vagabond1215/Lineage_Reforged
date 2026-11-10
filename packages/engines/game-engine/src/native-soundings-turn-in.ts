import type { SaveSnapshot } from '../../../shared/types/src/index.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import { getCurrentPlayerTravelLocationId } from './player-travel-rules.js';
import { synchronizeGameplaySnapshot } from './gameplay-snapshot-sync.js';
import { fingerprintSoundingsState, soundingsIds, soundingsCompletionActivity,
  soundingsChronicle, soundingsNotification, SOUNDINGS_REQUEST_PATTERN } from './soundings-turn-in-authority.js';
import type { NativeSurveySourceIdentity } from './native-survey-source.js';
import type { NativeSoundingsTurnInRecord } from './native-soundings-turn-in-record.js';

const QUEST = 'quest.ashen_reef_survey';
const OPERATION = 'operation.quest.ashen_reef_survey';

/** Readiness is derived from the native campaign and authored Starfall location. */
export function resolveNativeSoundingsTurnIn(snapshot: NativeFreshCampaignSnapshot):
  { accepted: boolean; code: string; reason: string } {
  const reject = (code: string, reason: string) => ({ accepted: false, code, reason });
  if (!isNativeTargetCampaignSnapshot(snapshot)) return reject('invalid_authority', 'Native campaign is invalid.');
  if (snapshot.nativeSoundingsTurnIn) return reject('already_completed', 'Soundings has already paid this campaign.');
  const quests = snapshot.sessionState.questJournal.filter(row => row.id === QUEST);
  if (quests.length !== 1 || quests[0]?.category !== 'active')
    return reject('quest_not_active', 'Accept Soundings before submitting the survey.');
  if (snapshot.nativeSurvey?.results.length !== 4 || snapshot.nativeSurvey.receipts.length !== 4)
    return reject('incomplete_survey', 'Complete all four survey shifts first.');
  if (getCurrentPlayerTravelLocationId(snapshot) !== 'settlement.starfall_port' ||
      snapshot.playerState.location.settlementId !== 'settlement.starfall_port')
    return reject('wrong_location', 'Return to the Starfall Harbormaster’s Office.');
  if (!Number.isSafeInteger(snapshot.playerState.currency.gold + 5))
    return reject('invalid_currency', 'The payment cannot be represented safely.');
  return { accepted: true, code: 'ready', reason: 'Submit the completed survey packet for 5 gold.' };
}

/** Pure owner transition. The version-8 store replays this against the retained source. */
export function executeNativeSoundingsTurnIn(source: NativeFreshCampaignSnapshot,
  identity: NativeSurveySourceIdentity & { slotId: string }, requestId: string):
  { snapshot: NativeFreshCampaignSnapshot; result: NativeSoundingsTurnInRecord } {
  if (!SOUNDINGS_REQUEST_PATTERN.test(requestId)) throw new TypeError('Malformed Soundings request ID.');
  const readiness = resolveNativeSoundingsTurnIn(source);
  if (!readiness.accepted) throw new TypeError(readiness.reason);
  if (identity.accountId !== source.accountId ||
      identity.campaignId !== source.campaignIdentity?.campaignId ||
      identity.continuityId !== source.campaignIdentity?.continuityId ||
      !identity.artifactId || !identity.publicationId || !identity.slotId ||
      !Number.isSafeInteger(identity.revision) || identity.revision < 1)
    throw new TypeError('Soundings source identity conflicts with the campaign.');
  const ids = soundingsIds(requestId);
  const result: NativeSoundingsTurnInRecord = {
    version: 1, requestId, resultId: `native_soundings_turn_in_result.${requestId.slice('soundings_turn_in_request.'.length)}`,
    source: { ...identity }, sourceFingerprint: fingerprintSoundingsState(source),
    surveyFingerprint: fingerprintSoundingsState(source.nativeSurvey),
    appliedTick: source.clock.tick, goldBefore: source.playerState.currency.gold,
    paymentGold: 5, timeLabel: `Day ${source.clock.day} · Tick ${source.clock.tick}`,
    chronicleId: ids.chronicleId, notificationId: ids.notificationId
  };
  const next = structuredClone(source);
  const quest = next.sessionState.questJournal.find(row => row.id === QUEST)!;
  quest.category = 'completed';
  quest.statusLabel = 'Turned in';
  if (next.sessionState.trackedQuestId === QUEST) next.sessionState.trackedQuestId = null;
  next.playerState.currency.gold += 5;
  next.sessionState.operations = next.sessionState.operations.filter(row => row.id !== OPERATION);
  next.sessionState.currentActivity = soundingsCompletionActivity();
  next.sessionState.chronicle.unshift(soundingsChronicle(result));
  next.sessionState.notifications.unshift(soundingsNotification(result));
  next.nativeSoundingsTurnIn = result;
  const synchronized = synchronizeGameplaySnapshot(next as unknown as SaveSnapshot) as unknown as NativeFreshCampaignSnapshot;
  if (!isNativeTargetCampaignSnapshot(synchronized))
    throw new TypeError('Soundings owner produced an invalid native campaign.');
  return { snapshot: synchronized, result };
}
