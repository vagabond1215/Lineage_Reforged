import type { SaveSnapshot } from '../../../shared/types/src/index.js';
import { getAshenReefSurveyContent, CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION } from './ashen-reef-survey-content.js';
import { synchronizeGameplaySnapshot } from './gameplay-snapshot-sync.js';
import { resolveNativeSurveyMaterialEvidence } from './native-survey-material.js';
import type { NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import type { NativeSurveySourceIdentity, NativeSurveySourceWitness } from './native-survey-source.js';

const REQUEST_ID = /^survey_request\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SECTOR_FLAG = 'gameplay.quest.ashen_reef_survey.sector.1';
const OPERATION_ID = 'operation.quest.ashen_reef_survey';

/** An unpublishable native mutation candidate. No survey authority or retry receipt is retained yet. */
export function executeNativeSurveyShiftCandidate(
  source: {
    snapshot: NativeFreshCampaignSnapshot;
    sourceIdentity: NativeSurveySourceIdentity;
    witness: NativeSurveySourceWitness;
  },
  requestId: string
) {
  if (!REQUEST_ID.test(requestId)) throw new TypeError('Native survey request ID is malformed.');
  if (source.witness.stage !== 'sector_1') {
    throw new TypeError('Only the first native survey shift has a candidate mutation owner.');
  }
  const material = resolveNativeSurveyMaterialEvidence(
    source.snapshot, source.sourceIdentity, source.witness
  );
  const snapshot = structuredClone(source.snapshot);
  snapshot.clock = structuredClone(material.endClock);
  snapshot.capturedAtTick = material.endClock.tick;
  snapshot.playerState.saveMeta.totalPlayTicks += 2;
  snapshot.playerState.bodyState = structuredClone(material.bodyAfter);
  snapshot.playerState.statGrowth = structuredClone(material.statGrowthAfter);
  snapshot.playerState.resources = structuredClone(material.resourcesAfter);
  snapshot.playerState.resourceRuntime = structuredClone(material.resourceRuntimeAfter);

  const { skillId, appliedDelta, rankAfter } = material.skill;
  if (appliedDelta > 0) {
    const skill = snapshot.playerState.skills.find(row => row.id === skillId);
    snapshot.playerState.skills = skill
      ? snapshot.playerState.skills.map(row => row.id === skillId
          ? { ...row, rank: rankAfter, source: 'trained' as const } : row)
      : [...snapshot.playerState.skills, { id: skillId, rank: rankAfter, source: 'trained' as const }]
          .sort((left, right) => left.id.localeCompare(right.id));
  }
  snapshot.sessionState.flags.push(SECTOR_FLAG);
  const content = getAshenReefSurveyContent(CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION);
  const operation = {
    id: OPERATION_ID,
    title: content.operationTitle,
    stage: 'Survey sectors logged: 1 / 3',
    progress: 25,
    etaLabel: '3 shift(s)',
    owner: snapshot.playerState.coreData.playerName,
    output: 'Field chart updates',
    priority: 'High' as const
  };
  snapshot.sessionState.operations = snapshot.sessionState.operations.some(row => row.id === OPERATION_ID)
    ? snapshot.sessionState.operations.map(row => row.id === OPERATION_ID ? operation : row)
    : [operation, ...snapshot.sessionState.operations];
  const synchronized = synchronizeGameplaySnapshot(snapshot as unknown as SaveSnapshot,
    { ashenReefSurveyContentVersion: CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION }) as unknown as NativeFreshCampaignSnapshot;
  return {
    version: 1 as const,
    posture: 'unpublished_candidate' as const,
    requestId,
    stage: 'sector_1' as const,
    sourceArtifactId: source.sourceIdentity.artifactId,
    sourcePublicationId: source.sourceIdentity.publicationId,
    sourceRevision: source.sourceIdentity.revision,
    sourceWitness: structuredClone(source.witness),
    material,
    snapshot: synchronized
  };
}
