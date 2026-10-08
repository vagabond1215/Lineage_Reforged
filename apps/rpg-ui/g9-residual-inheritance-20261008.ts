import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { retainRetiredRun, resolveRunHistorySourceId } from './src/game-shell/runLifecycle.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;let assertions=0;const steps:string[]=[];
const name=`lineage.g9.residual.inheritance.${crypto.randomUUID()}`;
const password='synthetic-inheritance-password';
function check(v:unknown,label:string):asserts v{assertions++;if(!v)throw Error(label);}
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
function form(slotId:'slot-1'|'slot-2'|'slot-3'){
  const initial=createDefaultCharacterCreationFormState(slotId);
  const identity=getLineageIdentityCatalog(initial.lineageId)!;const bundle=startingBundleOptions[0]!;
  const continent=getWorldContinentOptions()[0]!;const region=getWorldRegionOptions(continent.id)[0]!;
  const settlement=getWorldSettlementOptions({continentId:continent.id,regionId:region.id,backstoryId:''})[0]!;
  return {...initial,playerName:`Heir ${crypto.randomUUID().slice(0,6)}`,
    hairColorId:identity.hairColorOptions[0]!.id,eyeColorId:identity.eyeColorOptions[0]!.id,
    skinToneId:identity.skinToneOptions[0]!.id,startingBundleId:bundle.id,
    startingBundleChoiceSelections:createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId:continent.id,regionId:region.id,startingSettlementId:settlement.id};}
async function bytes(id:string){const opening=indexedDB.open(name);const db=await new Promise<IDBDatabase>((resolve,reject)=>{
  opening.onsuccess=()=>resolve(opening.result);opening.onerror=()=>reject(opening.error);});
  try{const rows:unknown[]=[];for(const family of ['accounts','accountLifecycle','newCampaignAttempts',
    'pendingPublicationRecoveries','descendantPublicationRecoveries','terminalLifecycleRecoveries',
    'campaignAttemptsV6','firstPublicationRecoveriesV6','currentSlotGenerations','addressDeletionReceipts',
    'artifacts','controls','slots','witnesses']){
    const query=db.transaction(family).objectStore(family).getAll();
    const result=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
      query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]);query.onerror=()=>reject(query.error);});
    rows.push([family,result.filter(item=>item.accountId===id)]);}
    return JSON.stringify(rows);
  }finally{db.close();}}
async function main(){const firstOwner=await openCleanEpochAccountStore({name});
  const rival=await openCleanEpochAccountStore({name});
  try{
    step('E2 synthetic retained retired source with one use through production source resolver');
    const id=`account.local.residual.heir.${crypto.randomUUID()}`;
    const registration=await new CleanEpochAccountAdapter(firstOwner).register({accountId:id,
      displayName:'Synthetic inheritance source',password,confirmPassword:password,stayLoggedIn:false});
    check(registration.status==='ready','inheritance account registered');
    const original=await new CleanEpochFirstCampaignAdapter(firstOwner).start(id,form('slot-1'),false);
    check(original.status==='ready','production first source published');
    const prior=(await firstOwner.readSelected(id))!;
    const retained=retainRetiredRun({accountId:id,accountProfile:prior.profile,
      snapshot:original.value.loaded.snapshot,fallbackSlotId:'slot-1',
      inheritanceUsesRemaining:1,recordedAt:new Date().toISOString()});
    check(retained.accountProfile.history.runRecords.some(record=>record.outcome==='retired'&&
      record.inheritanceUsesRemaining===1),'synthetic retired source eligible');
    const stored=await firstOwner.updateProfile(id,prior.revision,retained.accountProfile);
    check(stored.status==='committed','retained source profile stored by production CAS');
    const source=stored.readback.profile.history.runRecords.find(record=>record.outcome==='retired')!;
    const sourceId=resolveRunHistorySourceId(source);
    const heirForm={...form('slot-2'),sourceRunId:sourceId};
    const rivalForm={...form('slot-3'),sourceRunId:sourceId};
    const observed=await bytes(id);
    const prepared=await new CleanEpochFirstCampaignAdapter(firstOwner).prepare(id,heirForm,false);
    check(prepared.status==='ready','first heir prepared with exact source ID');
    const competing=await new CleanEpochFirstCampaignAdapter(rival).prepare(id,rivalForm,false);
    check(competing.status==='ready',`competing two-owner heir prepared same one-use source: ${JSON.stringify(competing)}`);
    const completed=await new CleanEpochFirstCampaignAdapter(firstOwner).resume(id,'slot-2');
    check(completed.status==='ready','first heir completed');
    const after=(await rival.readSelected(id))!;
    const sourceAfter=after.profile.history.runRecords.find(record=>record.characterId===source.characterId)!;
    check(sourceAfter.inheritanceUsesRemaining===0,'one inheritance use consumed exactly');
    const loserBefore=await bytes(id);
    const loser=await new CleanEpochFirstCampaignAdapter(rival).resume(id,'slot-3');
    check(loser.status==='blocked'&&await bytes(id)===loserBefore,
      'later competing heir denied with exact graph unchanged');
    check(after.revision>stored.readback.revision&&observed!==loserBefore,
      'consumption advanced durable account revision');
    const restarted=await openCleanEpochAccountStore({name});
    const sourceRestart=(await restarted.readSelected(id))?.profile.history.runRecords
      .find(record=>record.characterId===source.characterId);
    check(sourceRestart?.inheritanceUsesRemaining===0,'restarted owner retained consumed source');
    restarted.close();
  }finally{rival.close();firstOwner.close();}
}
main().then(()=>output.textContent=`PASS ${assertions} independent inheritance assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
