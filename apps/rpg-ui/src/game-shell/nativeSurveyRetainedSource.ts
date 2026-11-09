import {
  prepareNativeSurveySource,
  type NativeSurveySourceIdentity
} from '../../../../packages/engines/game-engine/src/native-survey-source.js';
import { resolveNativeSurveyMaterialEvidence } from '../../../../packages/engines/game-engine/src/native-survey-material.js';
import {
  CampaignStoreError,
  type CampaignIndexedDbStore
} from './campaignIndexedDbStore.js';
import {
  isStoredCampaignControl,
  isStoredNativeGearEnvelope,
  readNativeFreshSaveSnapshot
} from './saveManager.js';

/** Read the current immutable v3 head before preparing any survey command. */
export async function readRetainedNativeSurveyMaterial(
  store: Pick<CampaignIndexedDbStore, 'read'>,
  accountId: string,
  campaignId: string,
  slotId: string
) {
  const retained = await store.read(accountId, campaignId, slotId);
  if (!retained || retained.artifactRaw !== retained.slotRaw || retained.witness !== null ||
      !isStoredCampaignControl(retained.control) || retained.control.closed ||
      retained.control.accountId !== accountId || retained.control.campaignId !== campaignId) {
    throw new CampaignStoreError('invalid_record', 'Native survey source lacks a coherent retained head.');
  }
  let parsed: unknown;
  try { parsed = JSON.parse(retained.artifactRaw); }
  catch { throw new CampaignStoreError('invalid_record', 'Native survey source artifact is malformed.'); }
  if (!isStoredNativeGearEnvelope(parsed) || parsed.accountId !== accountId ||
      parsed.campaignId !== campaignId || parsed.slotId !== slotId || parsed.terminal ||
      parsed.artifactId !== retained.control.headArtifactId ||
      parsed.publicationId !== retained.control.headPublicationId ||
      parsed.headRevision !== retained.control.headRevision) {
    throw new CampaignStoreError('invalid_record', 'Native survey source is not the retained current v3 head.');
  }
  let snapshot;
  try { snapshot = await readNativeFreshSaveSnapshot(parsed.snapshot); }
  catch { throw new CampaignStoreError('invalid_record', 'Native survey source snapshot is invalid.'); }
  if (snapshot.accountId !== accountId ||
      snapshot.campaignIdentity?.campaignId !== campaignId ||
      snapshot.campaignIdentity.continuityId !== parsed.continuityId ||
      snapshot.playerState.playerId !== parsed.characterId) {
    throw new CampaignStoreError('invalid_record', 'Native survey source identity differs from the retained artifact.');
  }
  const sourceIdentity: NativeSurveySourceIdentity = {
    accountId, campaignId, continuityId: parsed.continuityId,
    artifactId: parsed.artifactId, publicationId: parsed.publicationId,
    revision: parsed.headRevision
  };
  const preparation = prepareNativeSurveySource(snapshot, sourceIdentity);
  if (!preparation.accepted) {
    throw new CampaignStoreError('conflict', `Native survey source is not ready: ${preparation.code}.`);
  }
  const material = resolveNativeSurveyMaterialEvidence(snapshot, sourceIdentity, preparation.witness);
  return { snapshot, sourceIdentity, witness: preparation.witness, material };
}
