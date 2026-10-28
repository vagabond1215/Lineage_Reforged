import { resolveExpectedSurveyOwnerEvidence } from './campaign-rules.js';
import { getAshenReefSurveyContent, CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION } from './ashen-reef-survey-content.js';
import { getWornGear } from './gear-instance-owner.js';
import { projectNativeEffectiveWornFromGear } from './native-effective-worn.js';
import { canonicalNativeSurveyJson } from './native-survey-material.js';
import { executeNativeSurveyShiftCandidate } from './native-survey-shift-candidate.js';
import type { NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import type { NativeSurveySourceIdentity, NativeSurveySourceWitness } from './native-survey-source.js';
import type { AshenReefSurveyStage } from '../../../shared/types/src/index.js';

const REQUEST_ID = /^survey_request\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SECTOR_FLAG = 'gameplay.quest.ashen_reef_survey.sector.1';
const OPERATION_ID = 'operation.quest.ashen_reef_survey';

const STAGES: readonly AshenReefSurveyStage[] = ['sector_1', 'sector_2', 'sector_3', 'ruins_confirmation'];
const exactKeys = (value: object, expected: readonly string[]): boolean =>
  Object.keys(value).sort().join('|') === [...expected].sort().join('|');

export type NativeSurveyResult = {
  version: 1;
  resultId: string;
  requestId: string;
  stage: AshenReefSurveyStage;
  sourceWitness: NativeSurveySourceWitness;
  material: ReturnType<typeof resolveExpectedSurveyOwnerEvidence>;
};

export type NativeSurveyReceipt = {
  version: 1;
  requestId: string;
  resultId: string;
  stage: AshenReefSurveyStage;
  sourceArtifactId: string;
  sourcePublicationId: string;
  sourceRevision: number;
  appliedTick: number;
  tickCount: 2;
  projectionIds: { notification: string; chronicle: string };
};

/** A bounded, ordered native survey history with one command receipt per accepted shift. */
export type NativeSurveyLedger = { version: 2; results: NativeSurveyResult[]; receipts: NativeSurveyReceipt[] };

/** Compute a durable result from a verified retained source, without mutating it. */
export function commitNativeSurveyFirstShift(source: {
  snapshot: NativeFreshCampaignSnapshot;
  sourceIdentity: NativeSurveySourceIdentity;
  witness: NativeSurveySourceWitness;
}, requestId: string): { snapshot: NativeFreshCampaignSnapshot; result: NativeSurveyResult } {
  if (source.witness.stage !== 'sector_1') throw new TypeError('First-shift command requires sector 1.');
  return commitNativeSurveyShift(source, requestId);
}

export function commitNativeSurveyShift(source: {
  snapshot: NativeFreshCampaignSnapshot;
  sourceIdentity: NativeSurveySourceIdentity;
  witness: NativeSurveySourceWitness;
}, requestId: string): { snapshot: NativeFreshCampaignSnapshot; result: NativeSurveyResult } {
  if (source.snapshot.nativeSurvey?.results.some(row => row.requestId === requestId))
    throw new TypeError('Native survey request ID already belongs to a retained result.');
  const candidate = executeNativeSurveyShiftCandidate(source, requestId);
  const uuid = requestId.slice('survey_request.'.length);
  const result: NativeSurveyResult = {
    version: 1, resultId: `survey_result.${uuid}`, requestId, stage: candidate.stage,
    sourceWitness: structuredClone(candidate.sourceWitness),
    material: structuredClone(candidate.material)
  };
  const receipt: NativeSurveyReceipt = {
    version: 1, requestId, resultId: result.resultId, stage: result.stage,
    sourceArtifactId: candidate.sourceArtifactId,
    sourcePublicationId: candidate.sourcePublicationId,
    sourceRevision: candidate.sourceRevision,
    appliedTick: candidate.snapshot.clock.tick, tickCount: 2,
    projectionIds: {
      notification: `notification.survey.${uuid}`,
      chronicle: `chronicle.survey.${uuid}`
    }
  };
  const prior = source.snapshot.nativeSurvey;
  const snapshot: NativeFreshCampaignSnapshot = { ...candidate.snapshot, nativeSurvey: {
    version: 2, results: [...(prior?.results ?? []), result],
    receipts: [...(prior?.receipts ?? []), receipt]
  } };
  if (!validateNativeSurveyLedger(snapshot)) throw new Error(`Native survey ${candidate.stage} result failed local replay.`);
  return { snapshot, result };
}

/** Deep local replay. Retained source identity must additionally be verified by the publication store. */
export function validateNativeSurveyLedger(snapshot: NativeFreshCampaignSnapshot): boolean {
  try {
    const flags = snapshot.sessionState.flags;
    const markers = flags.filter(flag => flag.startsWith('gameplay.quest.ashen_reef_survey.sector.') ||
      flag === 'gameplay.quest.ashen_reef_survey.ruins_confirmed' ||
      flag === 'gameplay.discovery.stormglass_bloom');
    const operation = snapshot.sessionState.operations.filter(row => row.id === OPERATION_ID);
    const hasDiscovery = snapshot.playerState.discoveryChronicle.entries.some(row =>
      row.sourceType === 'survey' && row.sourceId === 'quest.ashen_reef_survey');
    if (snapshot.nativeSurvey === undefined) return markers.length === 0 &&
      operation.every(row => row.progress === 0) && !hasDiscovery;
    const ledger = snapshot.nativeSurvey;
    if (!exactKeys(ledger, ['version', 'results', 'receipts']) ||
      ledger.version !== 2 || !Array.isArray(ledger.results) || !Array.isArray(ledger.receipts) ||
      ledger.results.length < 1 || ledger.results.length > 4 ||
      ledger.receipts.length !== ledger.results.length || operation.length !== 1) return false;
    const count = ledger.results.length;
    const expectedMarkers = Array.from({ length: Math.min(count, 3) }, (_, index) =>
      `gameplay.quest.ashen_reef_survey.sector.${index + 1}`);
    if (count === 4) expectedMarkers.push('gameplay.quest.ashen_reef_survey.ruins_confirmed',
      'gameplay.discovery.stormglass_bloom');
    if (canonicalNativeSurveyJson(markers) !== canonicalNativeSurveyJson(expectedMarkers) ||
      hasDiscovery !== (count === 4)) return false;
    for (let index = 0; index < count; index += 1) {
      const row = ledger.results[index]!;
      const receipt = ledger.receipts[index]!;
      const uuid = row.requestId.slice('survey_request.'.length);
      if (!exactKeys(row, ['version', 'resultId', 'requestId', 'stage', 'sourceWitness', 'material']) ||
        !exactKeys(receipt, ['version', 'requestId', 'resultId', 'stage', 'sourceArtifactId',
          'sourcePublicationId', 'sourceRevision', 'appliedTick', 'tickCount', 'projectionIds']) ||
        !exactKeys(receipt.projectionIds, ['notification', 'chronicle']) ||
        row.version !== 1 || row.stage !== STAGES[index] || !REQUEST_ID.test(row.requestId) ||
        row.resultId !== `survey_result.${uuid}` ||
        ledger.results.findIndex(other => other.requestId === row.requestId) !== index ||
        row.sourceWitness.stage !== row.stage || row.sourceWitness.materialFacts.sectorCount !== index ||
        canonicalNativeSurveyJson(row.sourceWitness.materialFacts.sectorFlags) !==
          canonicalNativeSurveyJson(expectedMarkers.slice(0, index)) ||
        receipt.version !== 1 || receipt.requestId !== row.requestId ||
        receipt.resultId !== row.resultId || receipt.stage !== row.stage ||
        receipt.sourceArtifactId !== row.sourceWitness.sourceArtifactId ||
        receipt.sourcePublicationId !== row.sourceWitness.sourcePublicationId ||
        receipt.sourceRevision !== row.sourceWitness.sourceRevision ||
        receipt.appliedTick !== row.material.endClock.tick || receipt.tickCount !== 2 ||
        receipt.projectionIds.notification !== `notification.survey.${uuid}` ||
        receipt.projectionIds.chronicle !== `chronicle.survey.${uuid}` ||
        (index > 0 && row.sourceWitness.sourceRevision <= ledger.results[index - 1]!.sourceWitness.sourceRevision))
        return false;
    }
    const result = ledger.results[count - 1]!;
    const witness = result.sourceWitness;
    if (result.version !== 1 || !REQUEST_ID.test(result.requestId) ||
      witness.version !== 1 || witness.snapshotFormat !== 'lineage.save_snapshot.v3' ||
      witness.stage !== STAGES[count - 1] || witness.materialFacts.sectorCount !== count - 1 ||
      witness.materialFacts.ruinsConfirmed || witness.materialFacts.discoveryFlagPresent ||
      (witness.materialFacts.operationProgress !== null &&
        witness.materialFacts.operationProgress !== (count - 1) * 25) ||
      witness.accountId !== snapshot.accountId ||
      witness.campaignId !== snapshot.campaignIdentity?.campaignId ||
      witness.continuityId !== snapshot.campaignIdentity?.continuityId ||
      witness.characterId !== snapshot.playerState.playerId ||
      !witness.sourceArtifactId || !witness.sourcePublicationId ||
      !Number.isSafeInteger(witness.sourceRevision) || witness.sourceRevision < 1 ||
      witness.expectedTick !== witness.ownerInputs.clock.tick ||
      witness.ownerInputs.gearRevision !== snapshot.playerState.gear.revision ||
      canonicalNativeSurveyJson(witness.ownerInputs.worn) !==
        canonicalNativeSurveyJson(getWornGear(snapshot.playerState.gear))) return false;
    const { gearRevision: _gearRevision, worn: _worn, ...nonphysical } = witness.ownerInputs;
    const expected = resolveExpectedSurveyOwnerEvidence(witness.characterId, result.stage, {
      ...nonphysical,
      wornResourceModifiers: projectNativeEffectiveWornFromGear(snapshot.playerState.gear).resourceModifiers
    });
    const equal = (left: unknown, right: unknown) => canonicalNativeSurveyJson(left) === canonicalNativeSurveyJson(right);
    const player = snapshot.playerState;
    const skill = player.skills.find(row => row.id === expected.skill.skillId);
    const content = getAshenReefSurveyContent(CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION);
    const expectedOperation = { id: OPERATION_ID, title: content.operationTitle,
      stage: count === 4 ? 'Chart packet ready for harbor turn-in' : `Survey sectors logged: ${count} / 3`,
      progress: count === 4 ? 100 : count * 25,
      etaLabel: count === 4 ? 'Ready now' : `${4 - count} shift(s)`,
      owner: player.coreData.playerName,
      output: count === 4 ? 'Verified reef chart packet' : 'Field chart updates', priority: 'High' };
    return equal(result.material, expected) && equal(snapshot.clock, expected.endClock) &&
      snapshot.capturedAtTick === expected.endClock.tick &&
      player.saveMeta.totalPlayTicks === witness.ownerInputs.totalPlayTicks + 2 &&
      equal(player.bodyState, expected.bodyAfter) && equal(player.statGrowth, expected.statGrowthAfter) &&
      equal(player.resources, expected.resourcesAfter) &&
      equal(player.resourceRuntime, expected.resourceRuntimeAfter) &&
      (skill?.rank ?? 0) === expected.skill.rankAfter &&
      equal(operation[0], expectedOperation) &&
      ledger.receipts.every(receipt => snapshot.sessionState.notifications.some(row =>
        row.id === receipt.projectionIds.notification) && snapshot.sessionState.chronicle.some(row =>
        row.id === receipt.projectionIds.chronicle)) &&
      (count !== 4 || (snapshot.sessionState.currentActivity?.id === 'activity.return.survey_packet' &&
        snapshot.playerState.discoveryChronicle.entries.some(row =>
          row.id === 'discovery.stormglass_bloom' && row.discoveredAtTick === snapshot.clock.tick) &&
        snapshot.sessionState.codexEntries.every(row => row.id !== 'flora.unknown_bloom' || row.locked === false))) &&
      snapshot.sessionState.questJournal.some(row => row.id === 'quest.ashen_reef_survey' &&
        row.category === 'active' && row.tracked) &&
      snapshot.sessionState.trackedQuestId === 'quest.ashen_reef_survey';
  } catch {
    return false;
  }
}
