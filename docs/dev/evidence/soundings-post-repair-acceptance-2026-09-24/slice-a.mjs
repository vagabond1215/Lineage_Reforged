// Independent desired-behavior audit. Disposable storage; no browser saves.
// Runtime target: 0df87bb7afaa4d7fcc9f08b79b7528d60727c370.
import assert from 'node:assert/strict';
import {createOrdinarySoundingsCampaign,withCampaignStorage,publishAndRestart,REQUEST_ID,ACCOUNT_ID,SLOT_ID} from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {preparePlayerSoundingsTurnInCommand as prepare,executePlayerSoundingsTurnInCommand as execute} from '../../../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import {submitSoundingsTurnInCaller as caller} from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import {serializeSoundingsIntent as canon,fingerprintSoundingsState as hash,buildSoundingsReceipts,repairSoundingsTurnInProjections as repair} from '../../../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
import {isTargetCampaignSnapshot as valid} from '../../../../packages/engines/game-engine/src/campaign-rules.ts';
import {publishSave,buildSaveMetadata,loadSaveWithAuthority} from '../../../../apps/rpg-ui/src/game-shell/saveManager.ts';
import {turnInQuest} from '../../../../apps/rpg-ui/src/game-shell/gameplayLoop.ts';
let count=0;
const pass=label=>{count++;console.log('PASS',label);};
withCampaignStorage(storage=>{
 const bytes=()=>Array.from({length:storage.length},(_,i)=>storage.key(i)).sort().map(k=>[k,storage.getItem(k)]);
 const restore=entries=>{storage.clear();for(const [k,v] of entries)storage.setItem(k,v);};
 const ready=createOrdinarySoundingsCampaign();
 const command=prepare(ready.snapshot,ready.control,REQUEST_ID).command;
 assert.ok(command);
 const initial=structuredClone(ready);
 const transition=caller(ready.snapshot,ready.control,REQUEST_ID,new Map());
 assert.ok(transition.acceptedState);assert.deepEqual(ready,initial);
 const session=transition.acceptedState;
 assert.equal(session.control.soundingsAdmissionWitness.posture,'session');
 pass('ordinary acceptance applies only returned accepted state');
 assert.equal(turnInQuest(ready.snapshot,'quest.ashen_reef_survey').snapshot,ready.snapshot);
 pass('legacy helper cannot pay Soundings');
 const sessionStorage=bytes();
 const restarted=publishAndRestart(session.snapshot,session.control);
 assert.equal(restarted.control.soundingsAdmissionWitness.posture,'applied');
 const baseStorage=bytes();
 const reject=(label,state,cmd=command,publication=true)=>{
  const before=structuredClone(state),stored=bytes();
  const result=execute(state.snapshot,state.control,cmd);
  assert.equal(result.accepted,false,label);assert.equal(result.duplicate,false,label);
  assert.equal(result.snapshot,state.snapshot,label);assert.equal(result.control,state.control,label);
  const fresh=caller(state.snapshot,state.control,REQUEST_ID,new Map());
  assert.equal(fresh.acceptedState,null,label);assert.notEqual(fresh.outcome.result?.duplicate,true,label);
  const projection=structuredClone(state.snapshot);
  projection.sessionState.chronicle=projection.sessionState.chronicle.filter(r=>!r.id.startsWith('soundings_turn_in_chronicle.'));
  projection.sessionState.notifications=projection.sessionState.notifications.filter(r=>!r.id.startsWith('soundings_turn_in_notification.'));
  const projectionBefore=structuredClone(projection);
  assert.equal(repair(projection,true,state.control),false,label);assert.deepEqual(projection,projectionBefore,label);
  if(publication){
   let failure;
   try{publishSave(ACCOUNT_ID,SLOT_ID,state.snapshot,buildSaveMetadata(SLOT_ID,state.snapshot),{sessionControl:state.control});}catch(error){failure=error;}
   assert.ok(failure,label);
   if(label.includes('coherent F1'))assert.match(failure.message,/provenance rejected: invalid_witness/);
   console.log('PUBLICATION_REJECT',label,failure.message);
  }
  assert.deepEqual(state,before,label);assert.deepEqual(bytes(),stored,label);
  pass(`${label}: ${result.code}`);
 };
 for(const [stage,base] of [['session',session],['restart',restarted]]){
  restore(stage==='session'?sessionStorage:baseStorage);
  const reorder=x=>Array.isArray(x)?x.map(reorder):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).reverse().map(k=>[k,reorder(x[k])])):x;
  for(const cmd of [command,reorder(command)]){
   const before=structuredClone(base),stored=bytes(),r=execute(base.snapshot,base.control,cmd);
   assert.equal(r.code,'duplicate');assert.equal(r.accepted,false);assert.deepEqual(base,before);assert.deepEqual(bytes(),stored);
  }pass(`${stage} legitimate retry and nested key-order equivalence`);
  const conflicting=structuredClone(command);conflicting.normalizedIntent.sourceRevision++;conflicting.normalizedIntent.expectedRevision++;conflicting.canonicalIntent=canon(conflicting.normalizedIntent);
  const conflictBefore=structuredClone(base),conflict=execute(base.snapshot,base.control,conflicting);
  assert.equal(conflict.code,'request_conflict');assert.equal(conflict.accepted,false);assert.equal(conflict.duplicate,false);assert.deepEqual(base,conflictBefore);
  pass(`${stage} semantic changed intent conflict`);
  for(const variant of ['wallet','source_ids']){
   const state=structuredClone(base),a=state.snapshot.authorityLedger.soundingsTurnIn,intent=a.requests[0].normalizedIntent;
   if(variant==='wallet'){
    const source=JSON.parse(intent.sourceSnapshot);assert.equal(source.playerState.currency.gold,16);source.playerState.currency.gold=116;
    intent.sourceSnapshot=canon(source);source.authorityLedger.ashenReefSurvey=state.snapshot.authorityLedger.ashenReefSurvey;
    intent.snapshotFingerprint=hash(source);a.results[0].currencyBefore.gold=116;a.consequenceReceipts=buildSoundingsReceipts(a.results[0]);
   }else {intent.sourceArtifactId='artifact.audit.never-published';intent.sourcePublicationId='publication.audit.never-published';}
   a.requests[0].canonicalIntent=canon(intent);
   assert.equal(valid(state.snapshot),true,`${stage} ${variant} must reach provenance, not merely shape rejection`);
   reject(`${stage} coherent F1 ${variant}`,state,{...command,normalizedIntent:intent,canonicalIntent:canon(intent)});
  }
  for(const [label,mutate] of [
   ['downgrade',s=>s.snapshot.authorityLedger.soundingsTurnIn.version=1],
   ['empty-linked-authority',s=>{const a=s.snapshot.authorityLedger.soundingsTurnIn;for(const k of ['requests','occurrences','results','consequenceReceipts'])a[k]=[];}],
   ['deep-empty-result',s=>s.snapshot.authorityLedger.soundingsTurnIn.results[0]={}],
   ['orphan-result',s=>s.snapshot.authorityLedger.soundingsTurnIn.results[0].requestId+='x'],
   ['missing-source',s=>s.snapshot.authorityLedger.soundingsTurnIn.requests[0].normalizedIntent.sourceSnapshot='{}'],
   ['duplicate-request',s=>s.snapshot.authorityLedger.soundingsTurnIn.requests.push(structuredClone(s.snapshot.authorityLedger.soundingsTurnIn.requests[0]))],
   ['duplicate-occurrence',s=>s.snapshot.authorityLedger.soundingsTurnIn.occurrences.push(structuredClone(s.snapshot.authorityLedger.soundingsTurnIn.occurrences[0]))],
   ['duplicate-receipt',s=>s.snapshot.authorityLedger.soundingsTurnIn.consequenceReceipts[1]=structuredClone(s.snapshot.authorityLedger.soundingsTurnIn.consequenceReceipts[0])],
   ['wrong-owner',s=>s.snapshot.authorityLedger.soundingsTurnIn.consequenceReceipts[0].owner='survey'],
  ]){const state=structuredClone(base);mutate(state);reject(`${stage} ${label}`,state);}
  for(const key of ['accountId','campaignId','characterId','sourceArtifactId','sourcePublicationId','sourceRevision','sourceContinuityId','acceptedContinuityId','sourceSnapshotFingerprint','surveyFingerprint','canonicalIntentFingerprint','occurrenceId','resultId','acceptedTick']){
   const state=structuredClone(base),w=state.control.soundingsAdmissionWitness;
   w[key]=typeof w[key]==='number'?w[key]+1:w[key]+'.substitute';
   // Engine sees supplied context; persistence independently resolves its retained record.
   reject(`${stage} wrong witness ${key}`,state,command,false);
  }
  const missing=structuredClone(base);delete missing.control.soundingsAdmissionWitness;reject(`${stage} missing context`,missing,command,false);
  const pending=structuredClone(base);pending.control.soundingsAdmissionWitness={...restarted.control.soundingsAdmissionWitness,posture:'pending'};reject(`${stage} pending context`,pending,command,false);
 }
 for(const [label,change] of [['revision',s=>s.control.sessionRevision++],['tick',s=>s.snapshot.clock.tick++],['source-artifact',s=>s.control.loadedArtifactId+='stale']]){
  const changed=structuredClone(ready);change(changed);const before=structuredClone(changed),stored=bytes();
  const result=execute(changed.snapshot,changed.control,command);
  assert.equal(result.accepted,false,label);assert.equal(result.duplicate,false,label);assert.deepEqual(changed,before);assert.deepEqual(bytes(),stored);
  pass(`stale prepared ${label}: ${result.code}`);
 }
 const witnessKey=baseStorage.find(([,v])=>{try{return JSON.parse(v).posture==='applied'&&JSON.parse(v).requestId===REQUEST_ID;}catch{return false;}})?.[0];
 assert.ok(witnessKey);
 for(const [label,mutate] of [
  ['missing',()=>storage.removeItem(witnessKey)],
  ['pending',w=>{w.posture='pending';storage.setItem(witnessKey,JSON.stringify(w));}],
  ['wrong-first-artifact',w=>{w.firstDurableArtifactId+='absent';storage.setItem(witnessKey,JSON.stringify(w));}],
  ['wrong-first-publication',w=>{w.firstDurablePublicationId+='absent';storage.setItem(witnessKey,JSON.stringify(w));}],
  ['wrong-first-revision',w=>{w.firstDurableHeadRevision++;storage.setItem(witnessKey,JSON.stringify(w));}],
 ]){
  restore(baseStorage);mutate(JSON.parse(storage.getItem(witnessKey)));const before=bytes();
  assert.throws(()=>loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID),undefined,label);
  assert.deepEqual(bytes(),before,label);
  assert.throws(()=>publishSave(ACCOUNT_ID,SLOT_ID,restarted.snapshot,buildSaveMetadata(SLOT_ID,restarted.snapshot),{sessionControl:restarted.control}),undefined,label);
  assert.deepEqual(bytes(),before,label);pass(`durable ${label} load and publication reject unchanged`);
 }
 restore(baseStorage);
});
console.log(JSON.stringify({status:'CORE_AUTHORITY_PROBES_PASS',runtime:'0df87bb7afaa4d7fcc9f08b79b7528d60727c370',cases:count}));
