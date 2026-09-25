// Independent B2 continuity audit. Fixture mutations are explicitly identified below.
// Production/runtime target 0383cedc99a4c3d5e2c9b47cf0665683720aef9e.
import assert from 'node:assert/strict';
import {createOrdinarySoundingsCampaign,withCampaignStorage,ACCOUNT_ID,SLOT_ID,REQUEST_ID,travelTo} from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {submitSoundingsTurnInCaller} from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import {publishSave,buildSaveMetadata,loadSaveWithAuthority} from '../../../../apps/rpg-ui/src/game-shell/saveManager.ts';
import {admitCampaignMutation,completePendingNormalDefeatRecovery} from '../../../../packages/engines/game-engine/src/campaign-session.ts';
import {repairSoundingsTurnInProjections} from '../../../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
let cases=0;const pass=s=>{cases++;console.log('PASS',s);};
withCampaignStorage(storage=>{
 const entries=()=>Array.from({length:storage.length},(_,i)=>storage.key(i)).sort().map(k=>[k,storage.getItem(k)]);
 const restore=rows=>{storage.clear();for(const[k,v]of rows)storage.setItem(k,v);};
 const witness=()=>entries().filter(([k])=>k.includes('.soundings-witness.'));
 const load=slot=>{const s=loadSaveWithAuthority(ACCOUNT_ID,slot);assert.ok(s);return {snapshot:s.snapshot,control:s.sessionControl};};
 const save=(s,slot=SLOT_ID)=>{publishSave(ACCOUNT_ID,slot,s.snapshot,buildSaveMetadata(slot,s.snapshot),{sessionControl:s.control});return load(slot);};
 const submit=s=>{const r=submitSoundingsTurnInCaller(s.snapshot,s.control,REQUEST_ID,new Map());assert.ok(r.acceptedState,JSON.stringify(r.outcome));return r.acceptedState;};
 const duplicate=s=>{const before=JSON.stringify(s);const r=submitSoundingsTurnInCaller(s.snapshot,s.control,REQUEST_ID,new Map());assert.equal(r.outcome.result.code,'duplicate');assert.equal(JSON.stringify(s),before);};
 // Explicit accepted-owner fixture for monetary deltas, not evidence of a particular shop/job UI.
 const admit=(s,label,mutate)=>{const proposed=structuredClone(s.snapshot);mutate(proposed);const r=admitCampaignMutation(s.control,{mutationId:`mutation.b2.${label}`,sourceArtifactId:s.control.loadedArtifactId,sourceRevision:s.control.sessionRevision,ownerKind:'engine_result',accepted:true,sourceSnapshot:s.snapshot,proposedSnapshot:proposed});assert.equal(r.accepted,true,r.reason);return {snapshot:r.snapshot,control:r.control};};
 let ready=save(createOrdinarySoundingsCampaign());
 const beforeStorage=entries(),beforeWallet=structuredClone(ready.snapshot.playerState.currency);
 let completed=submit(ready);assert.equal(completed.control.posture,'head_unpublished');
 assert.equal(completed.snapshot.playerState.currency.gold,beforeWallet.gold+5);assert.equal(completed.snapshot.playerState.currency.silver,beforeWallet.silver);
 completed=save(completed);duplicate(completed);const stableWitness=witness(),ledger=structuredClone(completed.snapshot.authorityLedger.soundingsTurnIn);
 assert.equal(stableWitness.length,1);assert.equal(JSON.parse(stableWitness[0][1]).posture,'applied');pass('current-head first submission publishes applied witness and restart duplicate without repayment');
 const completedStorage=entries();
 for(const [label,gold,silver]of [['spend',-3,-2],['earn',7,4]]){
  const wallet=structuredClone(completed.snapshot.playerState.currency);
  completed=admit(completed,label,s=>{s.playerState.currency.gold+=gold;s.playerState.currency.silver+=silver;});
  completed=save(completed);duplicate(completed);
  assert.deepEqual(completed.snapshot.playerState.currency,{...wallet,gold:wallet.gold+gold,silver:wallet.silver+silver});
  assert.deepEqual(witness(),stableWitness);assert.deepEqual(completed.snapshot.authorityLedger.soundingsTurnIn,ledger);pass(`admitted ${label} owner fixture persists latest wallet and exact witness/ledger across restart`);
 }
 // Preserve an old address, advance head elsewhere, then submit from the actual non-head load.
 restore(beforeStorage);ready=load(SLOT_ID);save(travelTo(ready,'location.ashen_reef'),'slot-2');
 const old=load(SLOT_ID);assert.equal(old.control.posture,'non_head_unmutated');
 let fork=submit(old);assert.equal(fork.control.posture,'forked_unpublished');
 assert.equal(fork.snapshot.campaignIdentity.parentContinuityId,old.snapshot.campaignIdentity.continuityId);
 fork=save(fork);duplicate(fork);const firstForkWitness=witness();
 assert.equal(JSON.parse(firstForkWitness[0][1]).acceptedContinuityId,fork.snapshot.campaignIdentity.continuityId);pass('non-head first submission creates child continuity and durable matching witness');
 const parentId=fork.snapshot.campaignIdentity.continuityId;
 save(travelTo(fork,'location.ashen_reef'),'slot-2');
 let descendant=load(SLOT_ID);assert.equal(descendant.control.posture,'non_head_unmutated');
 descendant=travelTo(descendant,'location.ashen_reef');assert.equal(descendant.snapshot.campaignIdentity.parentContinuityId,parentId);
 descendant=save(descendant);duplicate(descendant);assert.deepEqual(witness(),firstForkWitness);
 descendant=save(travelTo(descendant,'settlement.starfall_port'));duplicate(descendant);assert.deepEqual(witness(),firstForkWitness);pass('later descendant fork plus return and repeated restart retain original applied witness');
 // Legacy fixture deliberately represents pre-contract completion before any witness was persisted.
 restore(beforeStorage);let legacy=submit(load(SLOT_ID));legacy.snapshot.authorityLedger.soundingsTurnIn.version=1;delete legacy.control.soundingsAdmissionWitness;
 const legacyLedger=structuredClone(legacy.snapshot.authorityLedger.soundingsTurnIn),legacyWallet=structuredClone(legacy.snapshot.playerState.currency);
 legacy=save(legacy);assert.deepEqual(witness(),[]);const raw=JSON.stringify(legacy);
 assert.equal(submitSoundingsTurnInCaller(legacy.snapshot,legacy.control,REQUEST_ID,new Map()).outcome.result.code,'legacy_unverified');assert.equal(JSON.stringify(legacy),raw);
 const missing=structuredClone(legacy.snapshot);missing.sessionState.chronicle=[];missing.sessionState.notifications=[];const missingBefore=JSON.stringify(missing);
 assert.equal(repairSoundingsTurnInProjections(missing,true,legacy.control),false);assert.equal(JSON.stringify(missing),missingBefore);
 legacy=save(travelTo(legacy,'location.ashen_reef'));assert.deepEqual(witness(),[]);assert.deepEqual(legacy.snapshot.authorityLedger.soundingsTurnIn,legacyLedger);assert.deepEqual(legacy.snapshot.playerState.currency,legacyWallet);pass('legacy v1 no-witness load/play/save preserves wallet and ledger without synthesis, trusted duplicate or projection repair');
 restore(completedStorage);let defeat=load(SLOT_ID);
 assert.equal(defeat.snapshot.sessionState.knownLocations.find(l=>l.settlementId==='settlement.starfall_port').type,'harbor');
 defeat=admit(defeat,'ordinary-defeat',s=>{s.playerState.resources.hp.current=0;});
 assert.equal(defeat.snapshot.normalDefeatReceipts.at(-1).posture,'recovery_pending');
 const pendingStorage=entries(),pendingState=JSON.stringify(defeat);
 assert.throws(()=>save(defeat),/pending/);assert.deepEqual(entries(),pendingStorage);
 assert.throws(()=>completePendingNormalDefeatRecovery(defeat.control,defeat.snapshot,'settlement.starfall_port'),/safe settlement/);assert.equal(JSON.stringify(defeat),pendingState);
 assert.deepEqual(witness(),stableWitness);pass('ordinary harbor defeat is pending, publish and unsafe harbor recovery reject unchanged (known reachability limitation)');
 // A separate explicit safe-settlement fixture isolates witness retention from that authored-location limitation.
 restore(completedStorage);defeat=load(SLOT_ID);
 defeat=admit(defeat,'safe-fixture',s=>{const row=structuredClone(s.sessionState.knownLocations.find(l=>l.settlementId==='settlement.starfall_port'));row.id='settlement.b2_safe';row.settlementId='settlement.b2_safe';row.type='settlement';s.sessionState.knownLocations.push(row);});
 defeat=admit(defeat,'fixture-defeat',s=>{s.playerState.resources.hp.current=0;});assert.equal(defeat.snapshot.normalDefeatReceipts.at(-1).posture,'recovery_pending');
 const recovery=completePendingNormalDefeatRecovery(defeat.control,defeat.snapshot,'settlement.b2_safe');assert.equal(recovery.accepted,true);
 defeat={snapshot:recovery.snapshot,control:recovery.control};assert.equal(defeat.snapshot.normalDefeatReceipts.at(-1).posture,'playable');
 defeat=save(defeat);duplicate(defeat);assert.deepEqual(witness(),stableWitness);assert.deepEqual(defeat.snapshot.authorityLedger.soundingsTurnIn,ledger);
 defeat=save(defeat);duplicate(defeat);assert.deepEqual(witness(),stableWitness);pass('explicit safe-settlement fixture: real pending recovery completion, publication/restart preserve witness and trusted duplicate');
});
console.log(JSON.stringify({status:'B2_CONTINUITY_PROBES_PASS',runtime:'0383cedc99a4c3d5e2c9b47cf0665683720aef9e',cases}));
