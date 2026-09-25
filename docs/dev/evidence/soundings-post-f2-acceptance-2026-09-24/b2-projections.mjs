// Independent B2 projection acceptance; ordinary helper establishes prerequisites only.
// Runtime: 0383cedc99a4c3d5e2c9b47cf0665683720aef9e. Disposable storage.
import assert from 'node:assert/strict';
import {createOrdinarySoundingsCampaign,withCampaignStorage,publishAndRestart,REQUEST_ID} from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {submitSoundingsTurnInCaller as caller} from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import {preparePlayerSoundingsTurnInCommand as prepare,executePlayerSoundingsTurnInCommand as execute} from '../../../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import {isTargetCampaignSnapshot as valid} from '../../../../packages/engines/game-engine/src/campaign-rules.ts';
import {repairPlayerSurveyActivityProjection as repairSurvey} from '../../../../packages/engines/game-engine/src/player-survey-activity-advancement.ts';
let count=0;const pass=s=>{count++;console.log('PASS',s);};
withCampaignStorage(storage=>{
 const bytes=()=>Array.from({length:storage.length},(_,i)=>storage.key(i)).sort().map(k=>[k,storage.getItem(k)]);
 const ready=createOrdinarySoundingsCampaign();
 const accepted=caller(ready.snapshot,ready.control,REQUEST_ID,new Map()).acceptedState;assert.ok(accepted);
 const base=publishAndRestart(accepted.snapshot,accepted.control), saved=bytes();
 const reset=()=>{storage.clear();for(const [k,v]of saved)storage.setItem(k,v);return structuredClone(base);};
 const ids={chronicle:base.snapshot.sessionState.chronicle.find(r=>r.id.startsWith('soundings_turn_in_chronicle.')).id,notifications:base.snapshot.sessionState.notifications.find(r=>r.id.startsWith('soundings_turn_in_notification.')).id};
 const run=s=>execute(s.snapshot,s.control,prepare(s.snapshot,s.control,REQUEST_ID).command);
 for(const field of ['chronicle','notifications'])for(const mode of ['missing','misplaced']){
  let s=reset();const rows=s.snapshot.sessionState[field],idx=rows.findIndex(r=>r.id===ids[field]);const [row]=rows.splice(idx,1);if(mode==='misplaced')rows.push(row);
  const before=structuredClone(s), stored=bytes(), result=run(s);
  assert.equal(result.code,'projections_repaired');assert.equal(result.accepted,true);assert.deepEqual(s,before);assert.deepEqual(bytes(),stored);
  assert.deepEqual(result.snapshot.playerState.currency,base.snapshot.playerState.currency);assert.deepEqual(result.snapshot.authorityLedger.soundingsTurnIn,base.snapshot.authorityLedger.soundingsTurnIn);
  assert.deepEqual(result.snapshot.sessionState[field],base.snapshot.sessionState[field]);
  s=publishAndRestart(result.snapshot,result.control);assert.equal(run(s).code,'duplicate');
  pass(`${field} ${mode}, exact repair, publication/restart, idempotent no repayment`);
 }
 for(const field of ['chronicle','notifications']){
  const s=reset();s.snapshot.sessionState[field].find(r=>r.id===ids[field]).title+=' conflict';const before=structuredClone(s), stored=bytes();const result=run(s);
  assert.equal(result.accepted,false);assert.equal(result.duplicate,false);assert.deepEqual(s,before);assert.deepEqual(bytes(),stored);pass(`${field} same-id conflicting row fails closed unchanged`);
 }
 // Equal-tick opaque newer rows must stay ahead, older source rows retain order.
 for(const field of ['chronicle','notifications']){
  const s=reset(),rows=s.snapshot.sessionState[field],expected=rows.find(r=>r.id===ids[field]);
  s.snapshot.sessionState[field]=[{...expected,id:`opaque.equal-tick.${field}`,title:'Opaque later row'},...rows.filter(r=>r.id!==ids[field])];
  const r=run(s);assert.equal(r.code,'projections_repaired');assert.equal(r.snapshot.sessionState[field][0].id,`opaque.equal-tick.${field}`);assert.equal(r.snapshot.sessionState[field][1].id,ids[field]);pass(`${field} opaque equal-tick later row retained before historical completion`);
 }
 // Inspect the interaction with the existing independently authorized survey projection owner.
 // Control repairs the same missing row before Soundings completion; candidate repairs it after.
 for(const field of ['chronicle','notifications']){
  const kind=field==='notifications'?'notification':'chronicle';
  const prior=structuredClone(ready), sr=prior.snapshot.authorityLedger.ashenReefSurvey.results.at(-1), id=sr.projectionIds[kind];
  prior.snapshot.sessionState[field]=prior.snapshot.sessionState[field].filter(r=>r.id!==id);
  assert.equal(valid(prior.snapshot),true);
  const control=repairSurvey(prior.snapshot,prior.control,sr.resultId,kind);
  assert.equal(control.accepted,true,`pre-completion ${kind} repair control`);
  const s=reset();s.snapshot.sessionState[field]=s.snapshot.sessionState[field].filter(r=>r.id!==id);
  assert.equal(valid(s.snapshot),true);const before=structuredClone(s), stored=bytes();
  const result=repairSurvey(s.snapshot,s.control,sr.resultId,kind);
  console.log('SURVEY_REPAIR_OBSERVATION',JSON.stringify({kind,controlCode:control.code,controlAccepted:control.accepted,postCompletionCode:result.code,postCompletionAccepted:result.accepted,sourceValid:valid(s.snapshot),sourceUnchanged:JSON.stringify(s)===JSON.stringify(before),storageUnchanged:JSON.stringify(bytes())===JSON.stringify(stored)}));
  assert.deepEqual(s,before);assert.deepEqual(bytes(),stored);
  assert.equal(result.accepted,true,`post-completion ${kind} projection repair must remain available`);
  pass(`${kind} survey projection repair remains available after Soundings completion`);
 }
});
console.log(JSON.stringify({status:'B2_PROJECTION_PROBES_PASS',cases:count,runtime:'0383cedc99a4c3d5e2c9b47cf0665683720aef9e'}));
