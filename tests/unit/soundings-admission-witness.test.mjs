import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrdinarySoundingsCampaign, withCampaignStorage, REQUEST_ID, ACCOUNT_ID, SLOT_ID, publishAndRestart, travelTo } from '../helpers/soundings-ordinary-campaign.mjs';
import { submitSoundingsTurnInCaller as caller } from '../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import { preparePlayerSoundingsTurnInCommand as prepare, executePlayerSoundingsTurnInCommand as execute } from '../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import { serializeSoundingsIntent as canon, fingerprintSoundingsState as hash, buildSoundingsReceipts } from '../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
import { isTargetCampaignSnapshot } from '../../packages/engines/game-engine/src/campaign-rules.ts';
import { admitCampaignMutation, completePendingNormalDefeatRecovery } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { buildSaveMetadata, publishSave, loadSaveWithAuthority } from '../../apps/rpg-ui/src/game-shell/saveManager.ts';

const contents = storage => Array.from({length:storage.length},(_,i)=>storage.key(i)).sort().map(key=>[key,storage.getItem(key)]);
function submit(source) {
  const transition=caller(source.snapshot,source.control,REQUEST_ID,new Map());
  assert.ok(transition.acceptedState, transition.outcome.notice.detail);
  return transition.acceptedState;
}
function forgedState(state, variant) {
  const copy=structuredClone(state), a=copy.snapshot.authorityLedger.soundingsTurnIn;
  const intent=a.requests[0].normalizedIntent;
  if(variant==='wallet') {
    const source=JSON.parse(intent.sourceSnapshot);
    source.playerState.currency.gold+=100;
    intent.sourceSnapshot=canon(source);
    source.authorityLedger.ashenReefSurvey=copy.snapshot.authorityLedger.ashenReefSurvey;
    intent.snapshotFingerprint=hash(source);
    a.results[0].currencyBefore.gold+=100;
    a.consequenceReceipts=buildSoundingsReceipts(a.results[0]);
  } else {
    intent.sourceArtifactId='artifact.audit.nonexistent';
    intent.sourcePublicationId='publication.audit.nonexistent';
  }
  a.requests[0].canonicalIntent=canon(intent);
  return copy;
}

for(const variant of ['wallet','source-identities']) test(`F1 ${variant}: independent witness rejects coherent rewritten history before duplicate, projection repair and publication`,()=>withCampaignStorage(storage=>{
  const source=createOrdinarySoundingsCampaign();
  const command=prepare(source.snapshot,source.control,REQUEST_ID).command;
  const accepted=submit(source);
  for(const state of [accepted, publishAndRestart(accepted.snapshot,accepted.control)]) {
    const forged=forgedState(state,variant);
    assert.equal(isTargetCampaignSnapshot(forged.snapshot),true,'structural consistency is deliberately insufficient');
    const intent=forged.snapshot.authorityLedger.soundingsTurnIn.requests[0].normalizedIntent;
    const forgedCommand={...command,normalizedIntent:intent,canonicalIntent:canon(intent)};
    const before=structuredClone(forged), persisted=contents(storage);
    const outcome=execute(forged.snapshot,forged.control,forgedCommand);
    assert.equal(outcome.accepted,false); assert.equal(outcome.duplicate,false);
    assert.equal(outcome.snapshot,forged.snapshot); assert.equal(outcome.control,forged.control);
    const fresh=caller(forged.snapshot,forged.control,REQUEST_ID,new Map());
    assert.equal(fresh.acceptedState,null);
    assert.notEqual(fresh.outcome.result?.code,'duplicate');
    const damaged=structuredClone(forged);
    damaged.snapshot.sessionState.chronicle=damaged.snapshot.sessionState.chronicle.filter(r=>!r.id.startsWith('soundings_turn_in_chronicle.'));
    const damagedBefore=structuredClone(damaged);
    const repair=caller(damaged.snapshot,damaged.control,REQUEST_ID,new Map());
    assert.equal(repair.acceptedState,null); assert.deepEqual(damaged,damagedBefore);
    assert.throws(()=>publishSave(ACCOUNT_ID,SLOT_ID,forged.snapshot,buildSaveMetadata(SLOT_ID,forged.snapshot),{sessionControl:forged.control}));
    assert.deepEqual(forged,before); assert.deepEqual(contents(storage),persisted);
  }
},5*1024*1024));

test('verified admission witness survives caller cache loss and semantic key order but changed intent conflicts',()=>withCampaignStorage(()=>{
  const source=createOrdinarySoundingsCampaign(), original=structuredClone(source);
  const command=prepare(source.snapshot,source.control,REQUEST_ID).command;
  const accepted=submit(source);
  assert.deepEqual(source,original);
  assert.equal(accepted.snapshot.authorityLedger.soundingsTurnIn.version,2);
  assert.ok(accepted.control.soundingsAdmissionWitness);
  const reordered=x=>Array.isArray(x)?x.map(reordered):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).reverse().map(k=>[k,reordered(x[k])])):x;
  for(const state of [accepted,publishAndRestart(accepted.snapshot,accepted.control)]) {
    assert.equal(execute(state.snapshot,state.control,reordered(command)).code,'duplicate');
    const changed=structuredClone(command);
    changed.normalizedIntent.sourceRevision++; changed.normalizedIntent.expectedRevision++;
    changed.canonicalIntent=canon(changed.normalizedIntent);
    const before=structuredClone(state);
    assert.equal(execute(state.snapshot,state.control,changed).code,'request_conflict');
    assert.deepEqual(state,before);
  }
}));

test('witness-backed completion cannot downgrade to legacy for same-session or restarted retry',()=>withCampaignStorage(()=>{
  const source=createOrdinarySoundingsCampaign();
  const command=prepare(source.snapshot,source.control,REQUEST_ID).command;
  const accepted=submit(source);
  for(const state of [accepted,publishAndRestart(accepted.snapshot,accepted.control)]) {
    const downgraded=structuredClone(state);
    downgraded.snapshot.authorityLedger.soundingsTurnIn.version=1;
    assert.equal(isTargetCampaignSnapshot(downgraded.snapshot),true);
    const before=structuredClone(downgraded);
    const direct=execute(downgraded.snapshot,downgraded.control,command);
    assert.equal(direct.code,'invalid_provenance');
    assert.equal(direct.duplicate,false);
    assert.equal(direct.accepted,false);
    const retry=caller(downgraded.snapshot,downgraded.control,REQUEST_ID,new Map());
    assert.equal(retry.outcome.result.code,'invalid_provenance');
    assert.equal(retry.acceptedState,null);
    assert.deepEqual(downgraded,before);
  }
}));

test('later admitted spending and earnings retain original witness and historical duplicate without wallet rollback',()=>withCampaignStorage(()=>{
  let state=createOrdinarySoundingsCampaign();
  state=submit(state); state=publishAndRestart(state.snapshot,state.control);
  const witness=structuredClone(state.control.soundingsAdmissionWitness);
  for(const delta of [-3,17]) {
    const next=structuredClone(state.snapshot); next.playerState.currency.gold+=delta;
    const admitted=admitCampaignMutation(state.control,{
      mutationId:`mutation.wallet.probe.${delta}`,sourceArtifactId:state.control.loadedArtifactId,
      sourceRevision:state.control.sessionRevision,ownerKind:'engine_result',accepted:true,
      sourceSnapshot:state.snapshot,proposedSnapshot:next
    });
    assert.equal(admitted.accepted,true);
    state={snapshot:admitted.snapshot,control:admitted.control};
    state=publishAndRestart(state.snapshot,state.control);
    assert.deepEqual(state.control.soundingsAdmissionWitness,witness);
    const before=structuredClone(state);
    assert.equal(caller(state.snapshot,state.control,REQUEST_ID,new Map()).outcome.result.code,'duplicate');
    assert.deepEqual(state,before);
  }
}));

test('real non-head first submission and later descendant fork preserve independently stored witness',()=>withCampaignStorage(()=>{
  let source=createOrdinarySoundingsCampaign();
  source=publishAndRestart(source.snapshot,source.control);
  const newer=travelTo(source,'location.ashen_reef');
  publishSave(ACCOUNT_ID,'slot-2',newer.snapshot,buildSaveMetadata('slot-2',newer.snapshot),{sessionControl:newer.control});
  const loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);
  assert.equal(loaded.sessionControl.posture,'non_head_unmutated');
  let completed=submit({snapshot:loaded.snapshot,control:loaded.sessionControl});
  assert.notEqual(completed.snapshot.campaignIdentity.continuityId,source.snapshot.campaignIdentity.continuityId);
  completed=publishAndRestart(completed.snapshot,completed.control);
  const witness=structuredClone(completed.control.soundingsAdmissionWitness);
  const continued=travelTo(completed,'location.ashen_reef');
  publishSave(ACCOUNT_ID,'slot-2',continued.snapshot,buildSaveMetadata('slot-2',continued.snapshot),{sessionControl:continued.control});
  const old=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);
  const fork=travelTo({snapshot:old.snapshot,control:old.sessionControl},'location.ashen_reef');
  const restarted=publishAndRestart(fork.snapshot,fork.control);
  assert.deepEqual(restarted.control.soundingsAdmissionWitness,witness);
  assert.equal(caller(restarted.snapshot,restarted.control,REQUEST_ID,new Map()).outcome.result.code,'duplicate');
}));

test('published v2 witness survives admitted Normal defeat, recovery and restart without rewriting history',()=>withCampaignStorage(storage=>{
  let state=submit(createOrdinarySoundingsCampaign());
  state=publishAndRestart(state.snapshot,state.control);
  const witness=structuredClone(state.control.soundingsAdmissionWitness);
  const witnessKey=contents(storage).find(([key])=>key.endsWith(`.soundings-witness.${REQUEST_ID}`))[0];
  const witnessBytes=storage.getItem(witnessKey);
  const completion=structuredClone(state.snapshot.authorityLedger.soundingsTurnIn);
  state=travelTo(state,'location.ashen_reef');
  // The ordinary fixture knows a harbor and a ruin; the existing defeat owner
  // requires type=settlement. Add a test-only recovery destination through
  // admission, without changing the historical completion or its source.
  const discovered=structuredClone(state.snapshot);
  discovered.sessionState.knownLocations.push({id:'location.witness_recovery_haven',name:'Recovery Haven',regionLabel:'Test March',settlementId:'settlement.witness_recovery_haven',regionId:'region.test_march',type:'settlement',x:1,y:1,note:'Test-only safe recovery destination.',known:true});
  const discovery=admitCampaignMutation(state.control,{
    mutationId:'mutation.soundings_witness.recovery_fixture',sourceArtifactId:state.control.loadedArtifactId,
    sourceRevision:state.control.sessionRevision,ownerKind:'engine_result',accepted:true,
    sourceSnapshot:state.snapshot,proposedSnapshot:discovered
  });
  assert.equal(discovery.accepted,true);
  state={snapshot:discovery.snapshot,control:discovery.control};
  const defeated=structuredClone(state.snapshot);
  defeated.playerState.resources.hp.current=0;
  // Campaign admission invokes the real Normal defeat owner for the accepted
  // zero-HP result; no recovery receipt or restored state is injected here.
  const admitted=admitCampaignMutation(state.control,{
    mutationId:'mutation.soundings_witness.normal_defeat',
    sourceArtifactId:state.control.loadedArtifactId,sourceRevision:state.control.sessionRevision,
    ownerKind:'engine_result',accepted:true,sourceSnapshot:state.snapshot,proposedSnapshot:defeated
  });
  assert.equal(admitted.accepted,true);
  assert.equal(admitted.snapshot.normalDefeatReceipts.length,1);
  assert.equal(admitted.snapshot.normalDefeatReceipts[0].posture,'recovery_pending');
  assert.ok(admitted.snapshot.playerState.resources.hp.current>0);
  assert.deepEqual(admitted.control.soundingsAdmissionWitness,witness);
  const recovered=completePendingNormalDefeatRecovery(admitted.control,admitted.snapshot,'settlement.witness_recovery_haven');
  assert.equal(recovered.accepted,true);
  assert.equal(recovered.snapshot.normalDefeatReceipts[0].posture,'playable');
  assert.equal(recovered.snapshot.normalDefeatReceipts[0].receiptId,admitted.snapshot.normalDefeatReceipts[0].receiptId);
  assert.deepEqual(recovered.control.soundingsAdmissionWitness,witness);
  state=publishAndRestart(recovered.snapshot,recovered.control);
  assert.deepEqual(state.control.soundingsAdmissionWitness,witness);
  assert.equal(storage.getItem(witnessKey),witnessBytes);
  assert.deepEqual(state.snapshot.authorityLedger.soundingsTurnIn,completion);
  const before=structuredClone(state);
  const duplicate=caller(state.snapshot,state.control,REQUEST_ID,new Map());
  assert.equal(duplicate.outcome.result.code,'duplicate');
  assert.equal(duplicate.acceptedState,null);
  assert.deepEqual(state,before);
  assert.equal(storage.getItem(witnessKey),witnessBytes);
}));
