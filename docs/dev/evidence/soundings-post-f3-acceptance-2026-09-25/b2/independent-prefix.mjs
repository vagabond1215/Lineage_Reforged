// Independently authored B2 audit. Uses ordinary setup only; all feed damage and
// capacity/opaque rows are explicit fixtures. Production remains read-only.
import assert from 'node:assert/strict';
import { createOrdinarySoundingsCampaign, withCampaignStorage, publishAndRestart, travelTo, REQUEST_ID, ACCOUNT_ID, SLOT_ID } from '../../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import { submitSoundingsTurnInCaller as submit } from '../../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import { repairPlayerSurveyActivityProjection as surveyRepair } from '../../../../../packages/engines/game-engine/src/player-survey-activity-advancement.ts';
import { verifySoundingsAdmissionProvenance as verify } from '../../../../../packages/engines/game-engine/src/soundings-admission-witness.ts';
import { validateAshenReefSurveyAuthority as surveyValid, isTargetCampaignSnapshot as valid } from '../../../../../packages/engines/game-engine/src/campaign-rules.ts';
import { publishSave, buildSaveMetadata, loadSaveWithAuthority } from '../../../../../apps/rpg-ui/src/game-shell/saveManager.ts';
const runtime = '7c8c980d01892b0f673afc5a5940aec33ad2d7a2';
let cases = 0;
const pass = label => { cases++; console.log('PASS', label); };
const copy = structuredClone;
const field = kind => kind === 'notification' ? 'notifications' : 'chronicle';
const invoke = s => submit(s.snapshot, s.control, REQUEST_ID, new Map());
const persist = s => publishAndRestart(s.snapshot, s.control);
withCampaignStorage(storage => {
 const bytes = () => Array.from({length:storage.length}, (_,i) => storage.key(i)).sort().map(k => [k,storage.getItem(k)]);
 const witness = () => bytes().filter(([k]) => k.includes('.soundings-witness.'));
 const restore = entries => { storage.clear(); for (const [k,v] of entries) storage.setItem(k,v); };
 const repair = (s, kind) => {
   const result = s.snapshot.authorityLedger.ashenReefSurvey.results.at(-1);
   const f = field(kind), id = result.projectionIds[kind];
   s.snapshot.sessionState[f] = s.snapshot.sessionState[f].filter(row => row.id !== id).slice(0,5);
   const before = copy(s), stored = bytes();
   const out = surveyRepair(s.snapshot,s.control,result.resultId,kind);
   assert.equal(out.code,'projection_repaired'); assert.equal(out.accepted,true);
   assert.deepEqual(s,before); assert.deepEqual(bytes(),stored);
   return {snapshot:out.snapshot, control:out.control};
 };
 // The admission prefix contains multiple repairs to the SAME projection at the
 // SAME tick. Matching a count by tick or deleting all repairs cannot satisfy it.
 let ready = createOrdinarySoundingsCampaign();
 for (const kind of ['chronicle','notification','chronicle']) ready = repair(ready,kind);
 const admission = copy(ready.snapshot.authorityLedger.ashenReefSurvey);
 assert.equal(admission.projectionRepairs.length,3);
 const accepted = invoke(ready); assert.ok(accepted.acceptedState);
 const base = persist(accepted.acceptedState), baseStorage = bytes();
 const frozen = copy(base.snapshot.authorityLedger.soundingsTurnIn), wallet = copy(base.snapshot.playerState.currency), originalWitness = witness();
 assert.equal(wallet.gold,ready.snapshot.playerState.currency.gold+5);
 assert.equal(wallet.silver,ready.snapshot.playerState.currency.silver);
 assert.equal(frozen.consequenceReceipts.length,7);
 assert.deepEqual(base.snapshot.authorityLedger.ashenReefSurvey,admission);
 const reset = () => { restore(baseStorage); return copy(base); };
 const invariants = s => {
   assert.equal(valid(s.snapshot),true); assert.equal(verify(s.snapshot,s.control),'verified');
   assert.deepEqual(s.snapshot.authorityLedger.soundingsTurnIn,frozen);
   assert.deepEqual(s.snapshot.playerState.currency,wallet); assert.deepEqual(witness(),originalWitness);
 };
 pass('ordinary admission preserves three-entry same-tick nonempty prefix; exact five gold and seven receipts');
 for (const kind of ['chronicle','notification']) {
   let s = reset();
   for(let n=0;n<3;n++) {
     s=repair(s,kind); assert.equal(s.snapshot.clock.tick,base.snapshot.clock.tick);
     assert.deepEqual(s.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.slice(0,3),admission.projectionRepairs);
     s=persist(s); invariants(s);
     const resultId=s.snapshot.authorityLedger.ashenReefSurvey.results.at(-1).resultId;
     assert.equal(surveyRepair(s.snapshot,s.control,resultId,kind).code,'projection_already_correct');
   }
   assert.equal(s.snapshot.authorityLedger.ashenReefSurvey.projectionRepairs.length,6);
   assert.equal(invoke(s).outcome.result.code,'duplicate');
   pass(`${kind}: three same-tick suffix repairs, restart each, exact frozen intent/source/witness and no repayment`);
 }
 for(const kind of ['chronicle','notification']) for(const order of ['survey-first','soundings-first']) {
   let s=reset(); const f=field(kind);
   const completionId=s.snapshot.sessionState[f].find(row=>row.id.startsWith(`soundings_turn_in_${kind}.`)).id;
   const completionRepair=()=>{
     s.snapshot.sessionState[f]=s.snapshot.sessionState[f].filter(row=>row.id!==completionId).slice(0,5);
     const r=invoke(s); assert.equal(r.outcome.result.code,'projections_repaired'); assert.ok(r.acceptedState); s=r.acceptedState;
   };
   if(order==='soundings-first') completionRepair();
   s=repair(s,kind);
   if(order==='survey-first') completionRepair();
   s=persist(s); invariants(s); assert.equal(invoke(s).outcome.result.code,'duplicate');
   pass(`${kind} ${order}: both independently authorized projection owners followed by restart`);
 }
 let suffix=repair(reset(),'chronicle'); suffix=persist(suffix);
 const suffixStorage=bytes();
 const mutations={
   'remove certified prefix': a=>a.projectionRepairs.splice(0,1),
   'swap certified distinct-owner rows': a=>{ [a.projectionRepairs[0],a.projectionRepairs[1]]=[a.projectionRepairs[1],a.projectionRepairs[0]]; },
   'insert certified prefix copy': a=>a.projectionRepairs.splice(1,0,copy(a.projectionRepairs[0])),
   'alter prefix observed state': a=>{ a.projectionRepairs[0].observed='conflict'; },
   'malformed suffix ordinal': a=>{ a.projectionRepairs.at(-1).ordinal=-1; },
   'duplicate suffix identity': a=>a.projectionRepairs.push(copy(a.projectionRepairs.at(-1))),
   'nonprojection result drift': a=>{ a.results.at(-1).resultId+='-forged'; },
   'nonprojection receipt drift': a=>{ a.consequenceReceipts.at(-1).receiptId+='-forged'; }
 };
 for(const [label,mutate] of Object.entries(mutations)) {
   restore(suffixStorage); const s=copy(suffix); mutate(s.snapshot.authorityLedger.ashenReefSurvey);
   const before=copy(s), stored=bytes();
   // A reordered array can be valid to the survey owner; the frozen admission
   // graph still must reject it. Report that distinction instead of assuming it.
   console.log('MUTATION',label,'surveyValid',surveyValid(s.snapshot));
   assert.equal(verify(s.snapshot,s.control),'invalid_witness'); assert.equal(valid(s.snapshot),false);
   assert.equal(invoke(s).acceptedState,null); assert.throws(()=>persist(s));
   assert.deepEqual(s,before); assert.deepEqual(bytes(),stored);
   pass(`${label}: direct provenance, campaign, caller and publication fail closed unchanged`);
 }
 for(const kind of ['chronicle','notification']) {
   let s=reset(); const f=field(kind), result=s.snapshot.authorityLedger.ashenReefSurvey.results.at(-1);
   const receipt=s.snapshot.authorityLedger.ashenReefSurvey.consequenceReceipts.find(r=>r.resultId===result.resultId&&r.kind===`${kind}_projection`);
   const template=s.snapshot.sessionState[f][0];
   const full=Array.from({length:receipt.effect.cap},(_,i)=>({...template,id:`opaque.audit.${kind}.${i}`,title:`Later opaque ${i}`}));
   s.snapshot.sessionState[f]=copy(full);
   const r=surveyRepair(s.snapshot,s.control,result.resultId,kind);
   assert.equal(r.accepted,true); assert.equal(r.code,'projection_retention_expired');
   assert.deepEqual(r.snapshot.sessionState[f],full); s={snapshot:r.snapshot,control:r.control};
   // Each owner has its own cap. Survey expiry is recorded at its receipt cap;
   // separately extend the opaque fixture to Soundings' notification cap.
   if(kind==='notification') for(let i=full.length;i<12;i++) s.snapshot.sessionState[f].push({...template,id:`opaque.audit.${kind}.${i}`,title:`Later opaque ${i}`});
   s=persist(s); invariants(s);
   const before=copy(s), stored=bytes();
   const again=surveyRepair(s.snapshot,s.control,result.resultId,kind);
   assert.equal(again.accepted,false); assert.equal(again.code,'projection_retention_expired');
   const refused=invoke(s); assert.equal(refused.acceptedState,null); assert.equal(refused.outcome.result.code,'transition_failed');
   assert.deepEqual(s,before); assert.deepEqual(bytes(),stored);
   s=persist(travelTo(s,'location.ashen_reef')); invariants(s);
   s=persist(travelTo(s,'settlement.starfall_port')); invariants(s);
   pass(`${kind}: full opaque feed retained, survey terminal expiry vs Soundings refusal, later ordinary travel/save/restart`);
 }
 // Actual old slot -> non-head -> child continuity after a suffix and restart.
 let s=persist(repair(reset(),'notification')); const parent=s.snapshot.campaignIdentity.continuityId;
 const advanced=travelTo(s,'location.ashen_reef');
 publishSave(ACCOUNT_ID,'slot-2',advanced.snapshot,buildSaveMetadata('slot-2',advanced.snapshot),{sessionControl:advanced.control});
 const loaded=loadSaveWithAuthority(ACCOUNT_ID,SLOT_ID); assert.equal(loaded.sessionControl.posture,'non_head_unmutated');
 s=travelTo({snapshot:loaded.snapshot,control:loaded.sessionControl},'location.ashen_reef');
 assert.equal(s.snapshot.campaignIdentity.parentContinuityId,parent);
 s=persist(s); invariants(s); assert.equal(invoke(s).outcome.result.code,'duplicate');
 pass('survey suffix survives actual non-head child continuity and restarted duplicate');
});
console.log(JSON.stringify({status:'INDEPENDENT_F3_PREFIX_B2_PASS',runtime,cases}));
