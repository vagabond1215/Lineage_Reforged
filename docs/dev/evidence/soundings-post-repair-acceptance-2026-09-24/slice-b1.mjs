// Independently authored publication/recovery acceptance probe; disposable storage only.
// Runtime target: 0df87bb7afaa4d7fcc9f08b79b7528d60727c370.
import assert from 'node:assert/strict';
import {createOrdinarySoundingsCampaign,withCampaignStorage,ACCOUNT_ID,SLOT_ID,REQUEST_ID} from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {submitSoundingsTurnInCaller} from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import {publishSave,buildSaveMetadata,recoverPendingCampaignPublications,loadSaveWithAuthority,completeCampaignPublicationConsumers} from '../../../../apps/rpg-ui/src/game-shell/saveManager.ts';
let cases=0;
const pass=label=>{cases++;console.log('PASS',label);};
withCampaignStorage(storage=>{
 const entries=()=>Array.from({length:storage.length},(_,i)=>storage.key(i)).sort().map(k=>[k,storage.getItem(k)]);
 const restore=rows=>{storage.clear();for(const [k,v]of rows)storage.setItem(k,v);};
 const find=suffix=>entries().find(([k])=>k.endsWith(suffix));
 const ready=createOrdinarySoundingsCampaign();
 const completion=submitSoundingsTurnInCaller(ready.snapshot,ready.control,REQUEST_ID,new Map()).acceptedState;
 assert.ok(completion);
 const initial=entries();
 let consumerPlans=[];
 const publish=()=>publishSave(ACCOUNT_ID,SLOT_ID,completion.snapshot,buildSaveMetadata(SLOT_ID,completion.snapshot),{sessionControl:completion.control,consumerPlans});
 const stage=(key,raw)=>key.endsWith(`.soundings-witness.${REQUEST_ID}`)?JSON.parse(raw).posture:key.endsWith('.control')?'head':null;
 const interrupt=(boundary,mode)=>{
  let fired=false,armed=false;
  const set=storage.setItem.bind(storage),get=storage.getItem.bind(storage);
  storage.setItem=(key,raw)=>{
   if(!fired&&stage(key,raw)===boundary){
    if(mode==='before'){fired=true;throw Error('audit-interruption');}
    set(key,raw);
    if(mode==='after'){fired=true;throw Error('audit-interruption');}
    armed=true;return;
   }set(key,raw);
  };
  storage.getItem=key=>{
   const raw=get(key);
   if(!fired&&armed&&raw&&stage(key,raw)===boundary){fired=true;throw Error('audit-interruption');}
   return raw;
  };
  try{assert.throws(publish,/audit-interruption/);assert.equal(fired,true);}
  finally{storage.setItem=set;storage.getItem=get;}
 };
 for(const boundary of ['pending','head','applied'])for(const mode of ['before','after','readback']){
  restore(initial);interrupt(boundary,mode);
  const rec=JSON.parse(find('.publication-recovery')[1]);
  recoverPendingCampaignPublications(ACCOUNT_ID);
  const witness=JSON.parse(find(`.soundings-witness.${REQUEST_ID}`)[1]);
  assert.equal(witness.posture,'applied');
  assert.equal(witness.firstDurableArtifactId,rec.artifactId);
  assert.equal(witness.firstDurablePublicationId,rec.publicationId);
  assert.equal(witness.firstDurableHeadRevision,rec.headRevision);
  const loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);
  assert.deepEqual(loaded.snapshot.playerState.currency,completion.snapshot.playerState.currency);
  assert.deepEqual(loaded.snapshot.authorityLedger.soundingsTurnIn,completion.snapshot.authorityLedger.soundingsTurnIn);
  assert.equal(submitSoundingsTurnInCaller(loaded.snapshot,loaded.sessionControl,REQUEST_ID,new Map()).outcome.result.code,'duplicate');
  const stable=entries();assert.deepEqual(recoverPendingCampaignPublications(ACCOUNT_ID),[]);assert.deepEqual(entries(),stable);
  pass(`${boundary}/${mode}: recovered original witness, exactly-once completion and byte-idempotent startup`);
 }
 for(const collision of ['pending-witness','immutable-artifact','newer-head']){
  restore(initial);interrupt('head','before');
  const rec=JSON.parse(find('.publication-recovery')[1]);
  let key,changed;
  if(collision==='pending-witness'){
   [key]=find(`.soundings-witness.${REQUEST_ID}`);changed=JSON.parse(storage.getItem(key));changed.sourceArtifactId+='.conflict';
  }else if(collision==='immutable-artifact'){
   [key]=entries().find(([k])=>k.endsWith(`.artifact.${rec.artifactId}`));changed=JSON.parse(storage.getItem(key));changed.savedAt='1900-01-01T00:00:00.000Z';
  }else{
   [key]=find('.control');changed=JSON.parse(storage.getItem(key));changed.headRevision++;
  }
  storage.setItem(key,JSON.stringify(changed));const before=entries();
  assert.throws(()=>recoverPendingCampaignPublications(ACCOUNT_ID),/conflict|witness|head/i);assert.deepEqual(entries(),before);
  pass(`${collision}: recovery rejects without changing retained bytes`);
 }
 // The recovery record is the only edited evidence. Artifact/head and pending
 // stable witness are the exact ordinary crash outputs, not forged history.
 restore(initial);
 consumerPlans=[{kind:'active_history',payloadFingerprint:'audit.declared-active-history'}];
 interrupt('applied','before');
 const [recoveryKey,recoveryRaw]=find('.publication-recovery');
 const originalRecovery=JSON.parse(recoveryRaw);
 assert.equal(originalRecovery.status,'head_verified');
 assert.ok(originalRecovery.soundingsAdmissionWitness);
 const witnessKey=find(`.soundings-witness.${REQUEST_ID}`)[0];
 assert.equal(JSON.parse(storage.getItem(witnessKey)).posture,'pending');
 const controlBefore=entries();
 assert.throws(()=>completeCampaignPublicationConsumers(ACCOUNT_ID,originalRecovery.publicationId,['active_history']),/recovery must finish/);
 assert.deepEqual(entries(),controlBefore);
 pass('unchanged valid pre-applied recovery blocks premature declared consumer completion unchanged');
 const malformed=structuredClone(originalRecovery);
 delete malformed.soundingsAdmissionWitness;delete malformed.soundingsWitnessFingerprint;
 storage.setItem(recoveryKey,JSON.stringify(malformed));
 const before=entries();let error;
 try{completeCampaignPublicationConsumers(ACCOUNT_ID,malformed.publicationId,['active_history']);}catch(e){error=e;}
 const after=entries();
 const result={case:'recovery witness omission before consumer completion',recoveryStatus:originalRecovery.status,
  stableWitnessBefore:'pending',stableWitnessAfter:JSON.parse(storage.getItem(witnessKey)).posture,
  declaredConsumerKinds:malformed.consumerPlans.map(p=>p.kind),completedKinds:['active_history'],rejected:Boolean(error),recoveryRetained:storage.getItem(recoveryKey)!==null,storageUnchanged:JSON.stringify(before)===JSON.stringify(after),
  precedingCases:cases};
 console.log('CONSUMER_COMPLETION_OBSERVATION',JSON.stringify(result));
 if(!error||!result.recoveryRetained||!result.storageUnchanged){
  console.log('PERSISTENCE_OR_PROJECTION_DEFECT_FOUND: consumer completion discards first-publication recovery before applied witness durability when optional witness fields are absent.');
  process.exitCode=1;return;
 }
 pass('malformed recovery cannot clear pending witness recovery');
});
console.log(JSON.stringify({runtime:'0df87bb7afaa4d7fcc9f08b79b7528d60727c370',cases,status:process.exitCode?'PERSISTENCE_OR_PROJECTION_DEFECT_FOUND':'B1_PARTIAL_PASS'}));
