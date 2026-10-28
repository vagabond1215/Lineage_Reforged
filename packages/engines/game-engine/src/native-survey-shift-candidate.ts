import type { SaveSnapshot } from '../../../shared/types/src/index.js';
import { getAshenReefSurveyContent, CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION } from './ashen-reef-survey-content.js';
import { synchronizeGameplaySnapshot } from './gameplay-snapshot-sync.js';
import { resolveNativeSurveyMaterialEvidence } from './native-survey-material.js';
import type { NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import type { NativeSurveySourceIdentity, NativeSurveySourceWitness } from './native-survey-source.js';

const REQUEST_ID = /^survey_request\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SECTOR_FLAG = 'gameplay.quest.ashen_reef_survey.sector.1';
const RUINS_FLAG = 'gameplay.quest.ashen_reef_survey.ruins_confirmed';
const DISCOVERY_FLAG = 'gameplay.discovery.stormglass_bloom';
const OPERATION_ID = 'operation.quest.ashen_reef_survey';
const WATCH_LABELS: Record<number, string> = { 1: 'Dawn Watch', 2: 'High Sun', 3: 'Dusk Watch', 4: 'Night Watch' };

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
  const stage = source.witness.stage;
  const sector = stage === 'ruins_confirmation' ? null :
    stage === 'sector_1' ? 1 : stage === 'sector_2' ? 2 : 3;
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
  const content = getAshenReefSurveyContent(CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION);
  if (sector !== null) snapshot.sessionState.flags.push(sector === 1 ? SECTOR_FLAG :
    `gameplay.quest.ashen_reef_survey.sector.${sector}`);
  else {
    snapshot.sessionState.flags.push(RUINS_FLAG, DISCOVERY_FLAG);
    snapshot.playerState.discoveryChronicle.entries = [{
      id: 'discovery.stormglass_bloom', codexEntryId: 'flora.unknown_bloom',
      category: 'flora', title: 'Stormglass Bloom', discoveredAtTick: snapshot.clock.tick,
      discoveredAtLabel: `Day ${snapshot.clock.day}, ${WATCH_LABELS[snapshot.clock.subday] ?? 'Unknown Watch'}`,
      regionLabel: content.regionLabel, sourceType: 'survey', sourceId: 'quest.ashen_reef_survey',
      notes: [
        'Logged during the Ashen Reef survey while the crew marked ruin shelves.',
        'The petals refract storm light and dry into brittle crystalline veins.'
      ]
    }, ...snapshot.playerState.discoveryChronicle.entries];
    snapshot.playerState.discoveryChronicle.lastUpdatedTick = snapshot.clock.tick;
    snapshot.sessionState.currentActivity = {
      id: 'activity.return.survey_packet', label: 'Returning Chart Packet',
      category: 'Contract', detail: content.returnActivityDetail
    };
  }
  const operation = {
    id: OPERATION_ID,
    title: content.operationTitle,
    stage: sector === null ? 'Chart packet ready for harbor turn-in' :
      `Survey sectors logged: ${sector} / 3`,
    progress: sector === null ? 100 : sector * 25,
    etaLabel: sector === null ? 'Ready now' : `${4 - sector} shift(s)`,
    owner: snapshot.playerState.coreData.playerName,
    output: sector === null ? 'Verified reef chart packet' : 'Field chart updates',
    priority: 'High' as const
  };
  snapshot.sessionState.operations = snapshot.sessionState.operations.some(row => row.id === OPERATION_ID)
    ? snapshot.sessionState.operations.map(row => row.id === OPERATION_ID ? operation : row)
    : [operation, ...snapshot.sessionState.operations];
  const synchronized = synchronizeGameplaySnapshot(snapshot as unknown as SaveSnapshot,
    { ashenReefSurveyContentVersion: CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION }) as unknown as NativeFreshCampaignSnapshot;
  const uuid = requestId.slice('survey_request.'.length);
  const timeLabel = `Day ${synchronized.clock.day}, ${WATCH_LABELS[synchronized.clock.subday] ?? 'Unknown Watch'}`;
  const notification = sector === null ? {
    id: `notification.survey.${uuid}`, title: 'Survey packet complete',
    detail: content.completionNotificationDetail, timeLabel, tone: 'accent' as const
  } : {
    id: `notification.survey.${uuid}`, title: 'Survey sector logged',
    detail: `Ashen Reef sector ${sector} is now charted and filed into the packet.`,
    timeLabel, tone: 'success' as const
  };
  const skillChange = material.skill.appliedDelta > 0 ?
    `${sector === null ? 'Survival' : 'Navigation'} +${material.skill.appliedDelta}` :
    `${sector === null ? 'Survival' : 'Navigation'} unchanged`;
  const chronicle = sector === null ? {
    id: `chronicle.survey.${uuid}`, category: 'discovery' as const,
    title: 'Ashen Reef survey packet completed', timeLabel,
    summary: 'The crew verified the ruin markers and logged a new flora sample for the reef archive.',
    statusLabel: 'Packet complete',
    entities: [synchronized.playerState.coreData.playerName, 'Ashen Reef', 'Stormglass Bloom'],
    results: ['Chart packet finalized', 'New discovery recorded'],
    statChanges: [skillChange, 'Stamina -10', 'MP -3'], tags: ['Exploration', 'Discovery', 'Survey']
  } : {
    id: `chronicle.survey.${uuid}`, category: 'discovery' as const,
    title: `Survey sector ${sector} logged at Ashen Reef`, timeLabel,
    summary: 'The crew marked channels, breakers, and draft-safe approaches for the charter packet.',
    statusLabel: `Sector ${sector} / 3`,
    entities: [synchronized.playerState.coreData.playerName, 'Ashen Reef'],
    results: ['Survey packet expanded'],
    statChanges: [skillChange, 'Stamina -10', 'MP -3'], tags: ['Exploration', 'Survey']
  };
  if (synchronized.sessionState.notifications.length >= 8 ||
      synchronized.sessionState.chronicle.length >= 48 ||
      synchronized.sessionState.notifications.some(row => row.id === notification.id) ||
      synchronized.sessionState.chronicle.some(row => row.id === chronicle.id)) {
    throw new Error('Native survey projection destination is full or conflicts with retained rows.');
  }
  synchronized.sessionState.notifications = [notification, ...synchronized.sessionState.notifications];
  synchronized.sessionState.chronicle = [chronicle, ...synchronized.sessionState.chronicle];
  return {
    version: 1 as const,
    posture: 'unpublished_candidate' as const,
    requestId,
    stage,
    sourceArtifactId: source.sourceIdentity.artifactId,
    sourcePublicationId: source.sourceIdentity.publicationId,
    sourceRevision: source.sourceIdentity.revision,
    sourceWitness: structuredClone(source.witness),
    material,
    snapshot: synchronized
  };
}
