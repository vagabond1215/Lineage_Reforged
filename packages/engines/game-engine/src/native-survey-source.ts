import type {
  AshenReefSurveyMaterialFactsState,
  AshenReefSurveyOwnerInputsState,
  AshenReefSurveyStage
} from '../../../shared/types/src/index.js';
import { getWornGear, type GearItemInstance } from './gear-instance-owner.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import { getCurrentPlayerTravelLocationId } from './player-travel-rules.js';

const QUEST_ID = 'quest.ashen_reef_survey';
const SECTOR_PREFIX = 'gameplay.quest.ashen_reef_survey.sector.';
const RUINS_FLAG = 'gameplay.quest.ashen_reef_survey.ruins_confirmed';
const DISCOVERY_FLAG = 'gameplay.discovery.stormglass_bloom';
const OPERATION_ID = 'operation.quest.ashen_reef_survey';
const DISCOVERY_ID = 'discovery.stormglass_bloom';
const CODEX_ID = 'flora.unknown_bloom';

type NativeSurveyOwnerInputs = Omit<AshenReefSurveyOwnerInputsState, 'equipment'> & {
  gearRevision: number;
  worn: readonly GearItemInstance[];
};

/** Source evidence only: no survey mutation or retained result is authorized here. */
export type NativeSurveySourceWitness = {
  version: 1;
  snapshotFormat: 'lineage.save_snapshot.v3';
  accountId: string;
  campaignId: string;
  continuityId: string;
  characterId: string;
  sourceArtifactId: string;
  sourcePublicationId: string;
  sourceRevision: number;
  expectedTick: number;
  stage: AshenReefSurveyStage;
  materialFacts: AshenReefSurveyMaterialFactsState;
  ownerInputs: NativeSurveyOwnerInputs;
};

export type NativeSurveySourceIdentity = {
  accountId: string;
  campaignId: string;
  continuityId: string;
  artifactId: string;
  publicationId: string;
  revision: number;
};

export type NativeSurveySourcePreparation =
  | { accepted: true; witness: NativeSurveySourceWitness }
  | { accepted: false; code: 'invalid_source' | 'quest_not_ready' | 'wrong_location' | 'progress_incoherent' | 'already_complete' };

const clone = <T>(value: T): T => structuredClone(value);
const nonblank = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && value.trim() === value;

/** Capture the real creator/quest/travel caller state without synthesizing a v2 equipment map. */
export function prepareNativeSurveySource(
  value: unknown,
  source: NativeSurveySourceIdentity
): NativeSurveySourcePreparation {
  if (!isNativeTargetCampaignSnapshot(value) || !source ||
    !nonblank(source.artifactId) || !nonblank(source.publicationId) ||
    !Number.isSafeInteger(source.revision) || source.revision < 1) {
    return { accepted: false, code: 'invalid_source' };
  }
  const snapshot: NativeFreshCampaignSnapshot = value;
  if (source.accountId !== snapshot.accountId ||
    source.campaignId !== snapshot.campaignIdentity!.campaignId ||
    source.continuityId !== snapshot.campaignIdentity!.continuityId) {
    return { accepted: false, code: 'invalid_source' };
  }
  const quest = snapshot.sessionState.questJournal.find(entry => entry.id === QUEST_ID);
  if (!quest || quest.category !== 'active' || quest.tracked !== true ||
    snapshot.sessionState.trackedQuestId !== QUEST_ID ||
    snapshot.sessionState.currentActivity?.id !== 'activity.survey.ashen_reef') {
    return { accepted: false, code: 'quest_not_ready' };
  }
  if (getCurrentPlayerTravelLocationId(snapshot) !== 'location.ashen_reef') {
    return { accepted: false, code: 'wrong_location' };
  }
  const sectorFlags = snapshot.sessionState.flags.filter(flag => flag.startsWith(SECTOR_PREFIX));
  const expectedFlags = Array.from({ length: sectorFlags.length }, (_, index) => `${SECTOR_PREFIX}${index + 1}`);
  if (sectorFlags.length > 3 || JSON.stringify(sectorFlags) !== JSON.stringify(expectedFlags) ||
    snapshot.sessionState.flags.filter(flag => flag === RUINS_FLAG).length > 1) {
    return { accepted: false, code: 'progress_incoherent' };
  }
  if (snapshot.sessionState.flags.includes(RUINS_FLAG)) {
    return { accepted: false, code: 'already_complete' };
  }
  const player = snapshot.playerState;
  const operation = snapshot.sessionState.operations.find(row => row.id === OPERATION_ID) ?? null;
  const discovery = player.discoveryChronicle.entries.find(row => row.id === DISCOVERY_ID) ?? null;
  const codex = snapshot.sessionState.codexEntries.find(row => row.id === CODEX_ID) ?? null;
  const relevantSkills = (['skill.knowledge.general_lore', 'skill.resource.identify.flora'] as const)
    .map(id => clone(player.skills.find(row => row.id === id) ?? null)) as NativeSurveyOwnerInputs['relevantSkills'];
  const materialFacts: AshenReefSurveyMaterialFactsState = {
    sectorFlags: clone(sectorFlags), sectorCount: sectorFlags.length, ruinsConfirmed: false,
    discoveryEntryState: discovery ? 'matching' : 'absent',
    discoveryFlagPresent: snapshot.sessionState.flags.includes(DISCOVERY_FLAG),
    codexRowState: !codex ? 'source_record_absent' : codex.locked ? 'locked' : 'unlocked',
    operationProgress: operation?.progress ?? null,
    currentActivityId: snapshot.sessionState.currentActivity.id
  };
  const stage: AshenReefSurveyStage =
    (['sector_1', 'sector_2', 'sector_3', 'ruins_confirmation'] as const)[sectorFlags.length]!;
  return {
    accepted: true,
    witness: {
      version: 1, snapshotFormat: 'lineage.save_snapshot.v3',
      accountId: snapshot.accountId, campaignId: snapshot.campaignIdentity!.campaignId,
      continuityId: snapshot.campaignIdentity!.continuityId,
      characterId: snapshot.campaignIdentity!.characterId,
      sourceArtifactId: source.artifactId, sourcePublicationId: source.publicationId,
      sourceRevision: source.revision, expectedTick: snapshot.clock.tick, stage,
      materialFacts,
      ownerInputs: {
        clock: clone(snapshot.clock), totalPlayTicks: player.saveMeta.totalPlayTicks,
        lastReputationDecayDay: player.saveMeta.lastReputationDecayDay ?? null,
        questPosture: { category: 'active', tracked: true },
        runDifficulty: clone(snapshot.gameState.runDifficulty),
        playerName: player.coreData.playerName, lineageId: player.coreData.lineageId,
        bodyState: clone(player.bodyState), resources: clone(player.resources),
        resourceRuntime: clone(player.resourceRuntime), attributes: clone(player.attributes),
        statGrowth: clone(player.statGrowth), skills: clone(player.skills), relevantSkills,
        progression: clone(player.progression), reputation: clone(player.reputation),
        originProfile: clone(player.originProfile), gearRevision: player.gear.revision,
        worn: clone(getWornGear(player.gear)),
        currentActivity: clone(snapshot.sessionState.currentActivity),
        surveyOperation: clone(operation), stormglassDiscovery: clone(discovery),
        stormglassCodexEntry: clone(codex)
      }
    }
  };
}
