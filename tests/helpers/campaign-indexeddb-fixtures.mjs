import assert from "node:assert/strict";
import { initializeTargetCampaignSnapshot } from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import { buildSaveMetadata, publishSave } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { submitSoundingsTurnInCaller } from "../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts";
import { createOrdinarySoundingsCampaign, withCampaignStorage, ACCOUNT_ID, SLOT_ID, REQUEST_ID } from "./soundings-ordinary-campaign.mjs";

const entries = storage => Array.from({ length: storage.length }, (_, i) => storage.getItem(storage.key(i))).filter(Boolean);
const find = (storage, predicate) => {
  const match = entries(storage).map(raw => { try { return JSON.parse(raw); } catch { return null; } }).find(predicate);
  assert.ok(match, "expected actual save-owner fixture record");
  return match;
};

export function createCampaignIndexedDbFixtures() {
  const ordinary = withCampaignStorage(storage => {
    const source = structuredClone(demoSnapshot);
    source.accountId = "account.indexeddb.qa";
    source.playerState.playerId = "player.indexeddb.qa";
    const snapshot = initializeTargetCampaignSnapshot(source, { source: "new_campaign" });
    const published = publishSave(source.accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));
    const raw = JSON.stringify(find(storage, value => value?.version === 7 && value.publicationId === published.publication.publicationId));
    const control = find(storage, value => value?.version === 1 && value.headPublicationId === published.publication.publicationId);
    return { raw, control };
  });
  const soundings = withCampaignStorage(storage => {
    const before = createOrdinarySoundingsCampaign();
    const submitted = submitSoundingsTurnInCaller(before.snapshot, before.control, REQUEST_ID, new Map());
    assert.equal(submitted.outcome.kind, "accepted");
    assert.ok(submitted.acceptedState);
    const state = submitted.acceptedState;
    const published = publishSave(ACCOUNT_ID, SLOT_ID, state.snapshot, buildSaveMetadata(SLOT_ID, state.snapshot), { sessionControl: state.control });
    const raw = JSON.stringify(find(storage, value => value?.version === 7 && value.publicationId === published.publication.publicationId));
    const witness = find(storage, value => value?.version === 1 && value.requestId === REQUEST_ID && value.posture === "applied");
    const envelope = JSON.parse(raw);
    envelope.headRevision = 1;
    witness.firstDurableHeadRevision = 1;
    const control = {
      version: 1, accountId: ACCOUNT_ID, campaignId: envelope.campaignId,
      headArtifactId: envelope.artifactId, headPublicationId: envelope.publicationId,
      headRevision: 1, previousHeadArtifactId: null, previousHeadPublicationId: null,
      closed: false, updatedAt: envelope.savedAt
    };
    return { raw: JSON.stringify(envelope), control, witness };
  });
  return { ordinary, soundings };
}
