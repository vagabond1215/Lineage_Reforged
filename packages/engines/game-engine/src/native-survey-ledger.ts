import { resolveExpectedSurveyOwnerEvidence } from './campaign-rules.js';
import { getAshenReefSurveyContent, CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION } from './ashen-reef-survey-content.js';
import { getWornGear } from './gear-instance-owner.js';
import { projectNativeEffectiveWornFromGear } from './native-effective-worn.js';
import { canonicalNativeSurveyJson } from './native-survey-material.js';
import { executeNativeSurveyShiftCandidate } from './native-survey-shift-candidate.js';
import type { NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import type { NativeSurveySourceIdentity, NativeSurveySourceWitness } from './native-survey-source.js';

const REQUEST_ID = /^survey_request\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SECTOR_FLAG = 'gameplay.quest.ashen_reef_survey.sector.1';
const OPERATION_ID = 'operation.quest.ashen_reef_survey';

export type NativeSurveyResult = {
  version: 1;
  requestId: string;
  stage: 'sector_1';
  sourceWitness: NativeSurveySourceWitness;
  material: ReturnType<typeof resolveExpectedSurveyOwnerEvidence>;
};

/** First-shift native authority. More stages require their own replay contract. */
export type NativeSurveyLedger = { version: 1; results: [NativeSurveyResult] };

/** Compute a durable result from a verified retained source, without mutating it. */
export function commitNativeSurveyFirstShift(source: {
  snapshot: NativeFreshCampaignSnapshot;
  sourceIdentity: NativeSurveySourceIdentity;
  witness: NativeSurveySourceWitness;
}, requestId: string): { snapshot: NativeFreshCampaignSnapshot; result: NativeSurveyResult } {
  const candidate = executeNativeSurveyShiftCandidate(source, requestId);
  const result: NativeSurveyResult = {
    version: 1, requestId, stage: 'sector_1',
    sourceWitness: structuredClone(candidate.sourceWitness),
    material: structuredClone(candidate.material)
  };
  const snapshot = { ...candidate.snapshot, nativeSurvey: { version: 1 as const, results: [result] as [NativeSurveyResult] } };
  if (!validateNativeSurveyLedger(snapshot)) throw new Error('Native survey result failed local replay.');
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
    if (ledger.version !== 1 || !Array.isArray(ledger.results) || ledger.results.length !== 1 ||
      markers.length !== 1 || markers[0] !== SECTOR_FLAG || hasDiscovery || operation.length !== 1) return false;
    const result = ledger.results[0];
    const witness = result.sourceWitness;
    if (result.version !== 1 || result.stage !== 'sector_1' || !REQUEST_ID.test(result.requestId) ||
      witness.version !== 1 || witness.snapshotFormat !== 'lineage.save_snapshot.v3' ||
      witness.stage !== 'sector_1' || witness.materialFacts.sectorCount !== 0 ||
      witness.materialFacts.sectorFlags.length !== 0 || witness.materialFacts.ruinsConfirmed ||
      witness.materialFacts.discoveryFlagPresent ||
      (witness.materialFacts.operationProgress !== null && witness.materialFacts.operationProgress !== 0) ||
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
    const expected = resolveExpectedSurveyOwnerEvidence(witness.characterId, 'sector_1', {
      ...nonphysical,
      wornResourceModifiers: projectNativeEffectiveWornFromGear(snapshot.playerState.gear).resourceModifiers
    });
    const equal = (left: unknown, right: unknown) => canonicalNativeSurveyJson(left) === canonicalNativeSurveyJson(right);
    const player = snapshot.playerState;
    const skill = player.skills.find(row => row.id === expected.skill.skillId);
    const content = getAshenReefSurveyContent(CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION);
    const expectedOperation = {
      id: OPERATION_ID, title: content.operationTitle, stage: 'Survey sectors logged: 1 / 3',
      progress: 25, etaLabel: '3 shift(s)', owner: player.coreData.playerName,
      output: 'Field chart updates', priority: 'High'
    };
    return equal(result.material, expected) && equal(snapshot.clock, expected.endClock) &&
      snapshot.capturedAtTick === expected.endClock.tick &&
      player.saveMeta.totalPlayTicks === witness.ownerInputs.totalPlayTicks + 2 &&
      equal(player.bodyState, expected.bodyAfter) && equal(player.statGrowth, expected.statGrowthAfter) &&
      equal(player.resources, expected.resourcesAfter) &&
      equal(player.resourceRuntime, expected.resourceRuntimeAfter) &&
      (skill?.rank ?? 0) === expected.skill.rankAfter &&
      equal(operation[0], expectedOperation) &&
      snapshot.sessionState.questJournal.some(row => row.id === 'quest.ashen_reef_survey' &&
        row.category === 'active' && row.tracked) &&
      snapshot.sessionState.trackedQuestId === 'quest.ashen_reef_survey';
  } catch {
    return false;
  }
}
