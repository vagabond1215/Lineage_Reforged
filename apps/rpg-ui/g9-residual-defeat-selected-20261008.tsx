import { createRoot } from 'react-dom/client';
import { EpochApp } from './src/EpochApp.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { resolveNormalDefeat } from '../../packages/engines/game-engine/src/normal-defeat.ts';
import { evaluateAchievementProgress } from '../../packages/engines/game-engine/src/achievements.ts';
import { deserializeSnapshot, serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;
const target=document.querySelector<HTMLDivElement>('#app')!;
let assertions=0;const steps:string[]=[];
function check(v:unknown,label:string):asserts v {assertions++;if(!v)throw Error(label);}
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
async function until<T>(fn:()=>T|null,label:string){for(let i=0;i<240;i++){
  const result=fn();if(result)return result;await new Promise(resolve=>setTimeout(resolve,25));}
  throw Error(`Timeout ${label}: ${target.innerText.slice(-500)}`);}
function form(){const initial=createDefaultCharacterCreationFormState('slot-1');
  const identity=getLineageIdentityCatalog(initial.lineageId)!;const bundle=startingBundleOptions[0]!;
  const continent=getWorldContinentOptions()[0]!;const region=getWorldRegionOptions(continent.id)[0]!;
  const settlement=getWorldSettlementOptions({continentId:continent.id,regionId:region.id,backstoryId:''})[0]!;
  return {...initial,playerName:`Defeat ${crypto.randomUUID().slice(0,6)}`,
    hairColorId:identity.hairColorOptions[0]!.id,eyeColorId:identity.eyeColorOptions[0]!.id,
    skinToneId:identity.skinToneOptions[0]!.id,startingBundleId:bundle.id,
    startingBundleChoiceSelections:createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId:continent.id,regionId:region.id,startingSettlementId:settlement.id};}
async function main(){
  step('B2 production-resolved pending defeat fixture, selected App fault and retry');
  const owner=await openCleanEpochAccountStore();
  const id=`account.local.residual.defeat.${crypto.randomUUID()}`;
  const password='synthetic-residual-defeat-password';
  const originalPut=IDBObjectStore.prototype.put;
  let armed=false,interrupted=false;
  try{
    const registered=await new CleanEpochAccountAdapter(owner).register({accountId:id,
      displayName:`Residual defeat ${id.slice(-6)}`,password,confirmPassword:password,stayLoggedIn:true});
    check(registered.status==='ready','defeat registration');
    const first=new CleanEpochFirstCampaignAdapter(owner);
    const prepared=await first.prepare(id,form(),false);check(prepared.status==='ready','production first prepared');
    const candidate=deserializeSnapshot(prepared.value.snapshotRaw);
    candidate.playerState.resources.hp.current=0;
    candidate.playerState.location.settlementId=null;
    candidate.playerState.flags=candidate.playerState.flags.filter(flag=>!flag.startsWith('player.start.'));
    const resolved=resolveNormalDefeat(candidate,{sourceMutationId:`residual.defeat.${crypto.randomUUID()}`,
      sourceKind:'accepted_mutation'});
    check(resolved.receipt.posture==='recovery_pending','production defeat resolver pending');
    const projected=evaluateAchievementProgress(resolved.snapshot,registered.value.account.profile,
      {slotId:'slot-1',touchHistory:true,recordedAt:prepared.value.createdAt,suppressLegacyRewards:true}).nextSnapshot;
    const fingerprint=JSON.stringify({slotId:'slot-1',capturedAtTick:projected.capturedAtTick,
      characterAchievementIds:projected.playerState.achievements.unlocked.map(item=>item.achievementId)});
    const opening=indexedDB.open('lineage.campaigns.epoch1');
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      opening.onsuccess=()=>resolve(opening.result);opening.onerror=()=>reject(opening.error);});
    const tx=db.transaction('campaignAttemptsV6','readwrite');
    tx.objectStore('campaignAttemptsV6').put({...prepared.value,snapshotRaw:serializeSnapshot(projected),
      consumerPlans:prepared.value.consumerPlans.map(plan=>
        ['active_history','account_achievements','legacy_rewards','last_played'].includes(plan.kind)
          ? {...plan,payloadFingerprint:fingerprint}:plan)});
    await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});db.close();
    const published=await first.resume(id,'slot-1');check(published.status==='ready','pending defeat source published');
    const source=await owner.readSlot(id,'slot-1');check(source.status==='ready'&&
      source.loaded.snapshot.normalDefeatReceipts?.some(item=>item.receiptId===resolved.receipt.receiptId&&
        item.posture==='recovery_pending'),'exact pending source retained');
    const oldPublication=source.loaded.publication.publicationId;
    IDBObjectStore.prototype.put=function(value:unknown,key?:IDBValidKey){
      if(armed&&this.name==='descendantPublicationRecoveries'){
        armed=false;interrupted=true;throw new DOMException('Synthetic selected defeat quota','QuotaExceededError');}
      return key===undefined?originalPut.call(this,value):originalPut.call(this,value,key);
    };
    const root=createRoot(target);root.render(<EpochApp/>);
    const slot=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .find(row=>row.textContent?.includes('Defeat '))??null,'selected pending defeat row');
    armed=true;slot.click();
    await until(()=>target.innerText.includes('Campaign data is unavailable')?true:null,'selected blocked fault notice');
    check(interrupted,'selected path reached production IndexedDB write');
    const blocked=await owner.readSlot(id,'slot-1');
    check(blocked.status==='ready'&&blocked.loaded.publication.publicationId===oldPublication,
      'bounded fault retained exact source head');
    const retry=await until(()=>Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .find(row=>row.textContent?.trim()==='Retry campaign data')??null,'selected Retry campaign data control');
    retry.click();
    await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .some(row=>row.textContent?.includes('Defeat '))?true:null,'selected repaired menu');
    const repairedRow=Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .find(row=>row.textContent?.includes('Defeat '))!;
    repairedRow.click();
    await until(()=>target.innerText.includes('Campaign Ready')?true:null,'selected repaired ready campaign');
    const fixed=await owner.readSlot(id,'slot-1');check(fixed.status==='ready','repaired slot ready');
    check(fixed.loaded.publication.publicationId!==oldPublication&&
      fixed.loaded.snapshot.normalDefeatReceipts?.filter(item=>item.receiptId===resolved.receipt.receiptId&&
        item.posture==='playable').length===1,'one exact playable descendant receipt');
    const fixedPublication=fixed.loaded.publication.publicationId;
    root.unmount();target.replaceChildren();
    const restarted=createRoot(target);restarted.render(<EpochApp/>);
    const restarter=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .find(row=>row.textContent?.includes('Defeat '))??null,'restarted selected ready row');
    restarter.click();await until(()=>target.innerText.includes('Campaign Ready')?true:null,'restarted ready load');
    const reread=await owner.readSlot(id,'slot-1');
    check(reread.status==='ready'&&reread.loaded.publication.publicationId===fixedPublication,
      'restart kept exact repaired head');
    restarted.unmount();
  }finally{IDBObjectStore.prototype.put=originalPut;owner.close();}
}
main().then(()=>output.textContent=`PASS ${assertions} independent selected defeat assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
