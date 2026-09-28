// Independent post-F3 owner-boundary acceptance; no production/test mutations.
import assert from 'node:assert/strict';
import {createOrdinarySoundingsCampaign,withCampaignStorage,publishAndRestart,travelTo,REQUEST_ID,ACCOUNT_ID,SLOT_ID} from '../../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {preparePlayerSoundingsTurnInCommand as prepare,executePlayerSoundingsTurnInCommand as execute} from '../../../../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import {submitSoundingsTurnInCaller as submit} from '../../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import {serializeSoundingsIntent as canonical,fingerprintSoundingsState as hash,buildSoundingsReceipts,repairSoundingsTurnInProjections as repair} from '../../../../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
import {verifySoundingsAdmissionProvenance as verify} from '../../../../../packages/engines/game-engine/src/soundings-admission-witness.ts';
import {isTargetCampaignSnapshot as structural} from '../../../../../packages/engines/game-engine/src/campaign-rules.ts';
import {publishSave,buildSaveMetadata,loadSaveWithAuthority,completeCampaignPublicationConsumers as complete,recoverPendingCampaignPublications as recover,deleteSave} from '../../../../../apps/rpg-ui/src/game-shell/saveManager.ts';
const RUNTIME='7c8c980d01892b0f673afc5a5940aec33ad2d7a2';
let count=0; const pass=name=>{count++;console.log('PASS',name);};
const plans=[{kind:'active_history',payloadFingerprint:'audit.f3.history'},{kind:'estate',payloadFingerprint:'audit.f3.estate'}];
withCampaignStorage(storage=>{
 const bytes=()=>Array.from({length:storage.length},(_,i)=>storage.key(i)).sort().map(k=>[k,storage.getItem(k)]);
 const restore=rows=>{storage.clear();for(const [k,v] of rows)storage.setItem(k,v);};
 const find=suffix=>bytes().find(([k])=>k.endsWith(suffix));
 const witness=()=>find(`.soundings-witness.${REQUEST_ID}`);
 const recovery=()=>find('.publication-recovery');
 const publish=(state,extra={})=>publishSave(ACCOUNT_ID,SLOT_ID,state.snapshot,buildSaveMetadata(SLOT_ID,state.snapshot),{sessionControl:state.control,consumerPlans:plans,...extra});
 const ready=createOrdinarySoundingsCampaign(),readyBytes=bytes();
 const cmd=prepare(ready.snapshot,ready.control,REQUEST_ID).command; assert.ok(cmd);
 const before=structuredClone(ready);
 const session=submit(ready.snapshot,ready.control,REQUEST_ID,new Map()).acceptedState;assert.ok(session);assert.deepEqual(ready,before);
 assert.equal(session.control.soundingsAdmissionWitness.sourceSnapshotFingerprint,hash(ready.snapshot));
 assert.equal(session.control.soundingsAdmissionWitness.surveyFingerprint,hash(ready.snapshot.authorityLedger.ashenReefSurvey));
 pass('accepted witness binds independently prepared original snapshot; caller leaves inputs untouched');
 const storedWindow=Object.getOwnPropertyDescriptor(globalThis,'window');
 Object.defineProperty(globalThis,'window',{configurable:true,get(){throw Error('engine accessed browser');}});
 try{assert.equal(execute(session.snapshot,session.control,cmd).code,'duplicate');assert.equal(verify(session.snapshot,session.control),'verified');}
 finally{Object.defineProperty(globalThis,'window',storedWindow);}
 pass('pure engine duplicate and provenance execute with browser access forbidden');
 const restart=publishAndRestart(session.snapshot,session.control),restartBytes=bytes();
 for(const [label,base,stored] of [['session',session,readyBytes],['restart',restart,restartBytes]]){
  restore(stored);
  for(const variant of ['wallet','nonexistent-source']){
   const state=structuredClone(base),a=state.snapshot.authorityLedger.soundingsTurnIn,r=a.requests[0],intent=r.normalizedIntent;
   if(variant==='wallet'){
    const source=JSON.parse(intent.sourceSnapshot);assert.equal(source.playerState.currency.gold,16);source.playerState.currency.gold=116;
    intent.sourceSnapshot=canonical(source);source.authorityLedger.ashenReefSurvey=state.snapshot.authorityLedger.ashenReefSurvey;intent.snapshotFingerprint=hash(source);
    a.results[0].currencyBefore.gold=116;a.consequenceReceipts=buildSoundingsReceipts(a.results[0]);
   }else{intent.sourceArtifactId='artifact.f3.audit.never-existed';intent.sourcePublicationId='publication.f3.audit.never-existed';}
   r.canonicalIntent=canonical(intent);const forged={...cmd,normalizedIntent:intent,canonicalIntent:r.canonicalIntent};
   assert.equal(structural(state.snapshot),true,'must reach independent provenance boundary');
   const stable=structuredClone(state),saved=bytes();
   assert.equal(verify(state.snapshot,state.control),'invalid_witness');
   const result=execute(state.snapshot,state.control,forged);assert.equal(result.accepted,false);assert.equal(result.duplicate,false);assert.equal(result.code,'invalid_provenance');
   assert.equal(submit(state.snapshot,state.control,REQUEST_ID,new Map()).acceptedState,null);
   const damaged=structuredClone(state.snapshot);damaged.sessionState.chronicle=damaged.sessionState.chronicle.filter(x=>!x.id.startsWith('soundings_turn_in_chronicle.'));
   const damageBefore=structuredClone(damaged);assert.equal(repair(damaged,true,state.control),false);assert.deepEqual(damaged,damageBefore);
   assert.throws(()=>publish(state),/provenance/);assert.deepEqual(state,stable);assert.deepEqual(bytes(),saved);
   pass(`${label}: coherent ${variant} rejects at provenance before duplicate, repair and publication`);
  }
 }
 restore(readyBytes);
 for(const variant of ['missing-retained','duplicate-retained','changed-retained','missing-witness','pending-witness']){
  const state=structuredClone(session);
  if(variant==='missing-retained')state.control.retainedMutationResults=state.control.retainedMutationResults.filter(x=>x.mutationId!==REQUEST_ID);
  if(variant==='duplicate-retained')state.control.retainedMutationResults.push(structuredClone(state.control.retainedMutationResults.find(x=>x.mutationId===REQUEST_ID)));
  if(variant==='changed-retained')state.control.retainedMutationResults.find(x=>x.mutationId===REQUEST_ID).resultId+='different';
  if(variant==='missing-witness')delete state.control.soundingsAdmissionWitness;
  if(variant==='pending-witness')state.control.soundingsAdmissionWitness={...restart.control.soundingsAdmissionWitness,posture:'pending'};
  const original=structuredClone(state),saved=bytes();assert.notEqual(verify(state.snapshot,state.control),'verified');
  const result=execute(state.snapshot,state.control,cmd);assert.equal(result.accepted,false);assert.equal(result.duplicate,false);assert.deepEqual(state,original);assert.deepEqual(bytes(),saved);
  pass(`session ${variant} cannot establish accepted history`);
 }
 // Independent interruption harness classifies exact observed writes, including
 // the candidate/recovery/artifact/address seams omitted by the old B1 probe.
 const oldAddress=find('.slot-1')?.[0] ?? readyBytes.find(([,v])=>{try{return JSON.parse(v).slotId===SLOT_ID&&JSON.parse(v).snapshot;}catch{return false;}})?.[0];
 assert.ok(oldAddress,'locate ordinary save address');
 function interrupt(stage,when){
  let fired=false,armedKey=null;const set=storage.setItem.bind(storage),get=storage.getItem.bind(storage);
  const classify=(k,v)=>k.includes('.candidate.')?'candidate':k.endsWith('.publication-recovery')?'recovery':k.endsWith(`.soundings-witness.${REQUEST_ID}`)?JSON.parse(v).posture:k.includes('.artifact.')?'artifact':k.endsWith('.control')?'head':k===oldAddress?'address':null;
  storage.setItem=(k,v)=>{if(!fired&&classify(k,v)===stage){if(when==='before'){fired=true;throw Error('audit-cut');}set(k,v);if(when==='after'){fired=true;throw Error('audit-cut');}armedKey=k;return;}set(k,v);};
  storage.getItem=k=>{const raw=get(k);if(!fired&&armedKey===k){fired=true;throw Error('audit-cut');}return raw;};
  try{assert.throws(()=>publish(session),/audit-cut/);assert.ok(fired,`${stage}/${when} reached`);}finally{storage.setItem=set;storage.getItem=get;}
 }
 for(const stage of ['candidate','recovery','pending','artifact','head','applied','address'])for(const when of ['before','after','readback']){
  restore(readyBytes);interrupt(stage,when);const pending=recovery();
  if(!pending){assert.deepEqual(recover(ACCOUNT_ID),[]);const loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);assert.notEqual(loaded.snapshot.authorityLedger.soundingsTurnIn?.requests.length,1);assert.equal(witness(),undefined);publish(session);}
  else recover(ACCOUNT_ID);
  const rec=JSON.parse(recovery()[1]);const stableWitness=JSON.parse(witness()[1]);assert.equal(stableWitness.posture,'applied');assert.equal(stableWitness.firstDurableArtifactId,rec.artifactId);assert.equal(stableWitness.firstDurablePublicationId,rec.publicationId);assert.equal(stableWitness.firstDurableHeadRevision,rec.headRevision);
  const loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);assert.deepEqual(loaded.snapshot.playerState.currency,session.snapshot.playerState.currency);assert.equal(submit(loaded.snapshot,loaded.sessionControl,REQUEST_ID,new Map()).outcome.result.code,'duplicate');
  complete(ACCOUNT_ID,rec.publicationId,['active_history','estate']);const stable=bytes();assert.deepEqual(recover(ACCOUNT_ID),[]);assert.deepEqual(bytes(),stable);
  pass(`publication ${stage}/${when}: retry or bounded recovery preserves exactly-once payment and applied identity`);
 }
 // Additional exact candidate, immutable collision and address boundaries.
 for(const variant of ['missing-candidate','changed-candidate','artifact-collision','newer-head']){
  restore(readyBytes);interrupt('head','before');const r=JSON.parse(recovery()[1]);
  const candidate=bytes().find(([k])=>k.endsWith(`.candidate.${r.generationId}`))[0];
  const artifact=bytes().find(([k])=>k.endsWith(`.artifact.${r.artifactId}`))[0];
  if(variant==='missing-candidate')storage.removeItem(candidate);
  if(variant==='changed-candidate')storage.setItem(candidate,storage.getItem(candidate)+' ');
  if(variant==='artifact-collision'){const a=JSON.parse(storage.getItem(artifact));a.savedAt='1900-01-01T00:00:00.000Z';storage.setItem(artifact,JSON.stringify(a));}
  if(variant==='newer-head'){const [k,raw]=find('.control'),c=JSON.parse(raw);c.headRevision++;storage.setItem(k,JSON.stringify(c));}
  const stable=bytes();assert.throws(()=>recover(ACCOUNT_ID));assert.deepEqual(bytes(),stable);
  pass(`${variant}: interrupted first publication rejects byte-unchanged`);
 }
 for(const variant of ['stale','newer','malformed']){
  restore(readyBytes);interrupt('address','before');const r=JSON.parse(recovery()[1]);
  if(variant==='newer'){const a=JSON.parse(r.envelopeRaw);a.headRevision++;a.artifactId+='.newer';a.publicationId+='.newer';storage.setItem(oldAddress,JSON.stringify(a));}
  if(variant==='malformed')storage.setItem(oldAddress,'{');
  const stable=bytes();
  if(variant==='stale'){recover(ACCOUNT_ID);assert.equal(storage.getItem(oldAddress),r.envelopeRaw);const loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);assert.deepEqual(loaded.snapshot.playerState.currency,session.snapshot.playerState.currency);}
  else {assert.throws(()=>recover(ACCOUNT_ID));assert.deepEqual(bytes(),stable);}
  pass(`${variant} address: ${variant==='stale'?'verified head supersedes old address':'recovery rejects without replacing address'}`);
 }
 restore(restartBytes);const staleBytes=bytes();assert.throws(()=>publish(ready),/head changed/);assert.deepEqual(bytes(),staleBytes);pass('stale loaded session cannot publish over a newer campaign head');
 // Snapshot independently captured first publication at pending and applied seams.
 restore(readyBytes);interrupt('applied','before');const pendingBytes=bytes();
 restore(readyBytes);publish(session);const appliedBytes=bytes();
 const mutations=[
  ['missing-witness',r=>delete r.soundingsAdmissionWitness],['missing-fingerprint',r=>delete r.soundingsWitnessFingerprint],['missing-both',r=>{delete r.soundingsAdmissionWitness;delete r.soundingsWitnessFingerprint;}],
  ['null-witness',r=>r.soundingsAdmissionWitness=null],['deep-empty',r=>r.soundingsAdmissionWitness={}],['coherent-sidecar-substitution',r=>{r.soundingsAdmissionWitness.sourceArtifactId+='changed';r.soundingsWitnessFingerprint=hash(r.soundingsAdmissionWitness);}]
 ];
 for(const [posture,base] of [['pending',pendingBytes],['applied',appliedBytes]])for(const [name,mutate] of mutations){
  restore(base);const [key,raw]=recovery(),r=JSON.parse(raw);mutate(r);storage.setItem(key,JSON.stringify(r));
  for(const kinds of [['active_history'],['active_history','estate']]){const stable=bytes();assert.throws(()=>complete(ACCOUNT_ID,r.publicationId,kinds));assert.deepEqual(bytes(),stable);}
  pass(`F2 ${posture}/${name}: partial and final cleanup reject byte-unchanged`);
 }
 for(const variant of ['pending-forged-status','stable-missing','stable-pending','stable-source','stable-first-artifact','stable-first-publication','stable-first-revision','envelope-substitution']){
  restore(variant==='pending-forged-status'?pendingBytes:appliedBytes);const [key,raw]=recovery(),r=JSON.parse(raw),[wk,wr]=witness(),w=JSON.parse(wr);
  if(variant==='pending-forged-status')r.status='address_verified';
  else if(variant==='stable-missing')storage.removeItem(wk);
  else if(variant==='envelope-substitution')r.envelopeRaw=readyBytes.find(([k])=>k===oldAddress)[1];
  else {const field={'stable-pending':'posture','stable-source':'sourceArtifactId','stable-first-artifact':'firstDurableArtifactId','stable-first-publication':'firstDurablePublicationId','stable-first-revision':'firstDurableHeadRevision'}[variant];w[field]=field==='posture'?'pending':typeof w[field]==='number'?w[field]+1:w[field]+'.other';storage.setItem(wk,JSON.stringify(w));}
  storage.setItem(key,JSON.stringify(r));for(const kinds of [['active_history'],['active_history','estate']]){const stable=bytes();assert.throws(()=>complete(ACCOUNT_ID,r.publicationId,kinds));assert.deepEqual(bytes(),stable);}
  pass(`F2 ${variant}: no promotion or consumer cleanup`);
 }
 function finish(){const [key,raw]=recovery(),r=JSON.parse(raw),original=bytes();complete(ACCOUNT_ID,r.publicationId,['active_history']);assert.deepEqual(JSON.parse(storage.getItem(key)).completedConsumerKinds,['active_history']);assert.deepEqual(bytes().filter(([k])=>k!==key),original.filter(([k])=>k!==key));complete(ACCOUNT_ID,r.publicationId,['estate']);assert.equal(storage.getItem(key),null);const end=bytes();complete(ACCOUNT_ID,r.publicationId,['active_history','estate']);assert.deepEqual(bytes(),end);}
 restore(appliedBytes);const originalWitness=witness();finish();assert.deepEqual(witness(),originalWitness);pass('F2 valid first publication partial/final/repeat changes only recovery');
 let loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);let later=travelTo({snapshot:loaded.snapshot,control:loaded.sessionControl},'location.ashen_reef');publish(later);const laterBytes=bytes();assert.equal(JSON.parse(recovery()[1]).soundingsAdmissionWitness,undefined);
 for(const bad of ['missing','pending','conflicting']){restore(laterBytes);const [k,v]=witness(),w=JSON.parse(v);if(bad==='missing')storage.removeItem(k);else{if(bad==='pending')w.posture='pending';else w.sourceArtifactId+='wrong';storage.setItem(k,JSON.stringify(w));}const r=JSON.parse(recovery()[1]),stable=bytes();assert.throws(()=>complete(ACCOUNT_ID,r.publicationId,['active_history','estate']));assert.deepEqual(bytes(),stable);pass(`later sidecar-free publication still rejects ${bad} applied provenance`);}
 restore(laterBytes);finish();assert.deepEqual(witness(),originalWitness);pass('later sidecar-free publication completes while preserving original applied witness');
 for(const label of ['ordinary','legacy']){restore(readyBytes);const state=structuredClone(label==='ordinary'?ready:session);if(label==='legacy'){state.snapshot.authorityLedger.soundingsTurnIn.version=1;delete state.control.soundingsAdmissionWitness;}publish(state);finish();loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID);assert.equal(witness(),undefined);assert.deepEqual(loaded.snapshot.playerState.currency,state.snapshot.playerState.currency);if(label==='legacy'){const r=submit(loaded.snapshot,loaded.sessionControl,REQUEST_ID,new Map());assert.equal(r.outcome.result.code,'legacy_unverified');assert.equal(r.acceptedState,null);}pass(`${label} no-witness consumer compatibility preserves wallet and no witness synthesis`);}
 restore(readyBytes);publish(session,{terminal:true});const terminalWitness=witness();deleteSave(ACCOUNT_ID,SLOT_ID);finish();assert.equal(loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID,{allowClosed:true}),null);assert.deepEqual(witness(),terminalWitness);const terminal=bytes();assert.deepEqual(recover(ACCOUNT_ID),[]);assert.deepEqual(bytes(),terminal);pass('terminal consumer cleanup after address deletion never resurrects save or modifies witness');
});
console.log(JSON.stringify({status:'INDEPENDENT_A_B1_PROBES_PASS',runtime:RUNTIME,cases:count}));
