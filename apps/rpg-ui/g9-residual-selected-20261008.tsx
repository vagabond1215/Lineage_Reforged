import { createRoot } from 'react-dom/client';
import { EpochApp } from './src/EpochApp.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration, CLEAN_EPOCH_SESSION_STORAGE_KEY } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;
const target=document.querySelector<HTMLDivElement>('#app')!;
const password='synthetic-residual-selected-password';
let assertions=0;
const steps:string[]=[];
function check(ok:unknown,label:string):asserts ok { assertions++; if(!ok) throw Error(label); }
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
async function until<T>(read:()=>T|null,label:string):Promise<T>{
  for(let i=0;i<240;i++){const result=read();if(result)return result;await new Promise(resolve=>setTimeout(resolve,25));}
  throw Error(`Timeout ${label}: ${target.innerText.slice(-700)}`);
}
function button(label:string){return Array.from(target.querySelectorAll('button')).find(x=>x.textContent?.trim()===label)??null;}
function form(slotId:'slot-1'|'slot-2'='slot-1'){const initial=createDefaultCharacterCreationFormState(slotId);
  const identity=getLineageIdentityCatalog(initial.lineageId)!;const bundle=startingBundleOptions[0]!;
  const continent=getWorldContinentOptions()[0]!;const region=getWorldRegionOptions(continent.id)[0]!;
  const settlement=getWorldSettlementOptions({continentId:continent.id,regionId:region.id,backstoryId:''})[0]!;
  return {...initial,playerName:`Selected ${crypto.randomUUID().slice(0,6)}`,
    hairColorId:identity.hairColorOptions[0]!.id,eyeColorId:identity.eyeColorOptions[0]!.id,
    skinToneId:identity.skinToneOptions[0]!.id,startingBundleId:bundle.id,
    startingBundleChoiceSelections:createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId:continent.id,regionId:region.id,startingSettlementId:settlement.id};}
async function seed(){const owner=await openCleanEpochAccountStore();
  const id=`account.local.g9.residual.selected.${crypto.randomUUID()}`;
  try {const accounts=new CleanEpochAccountAdapter(owner);
    const registered=await accounts.register({accountId:id,displayName:`Residual ${id.slice(-6)}`,
      password,confirmPassword:password,stayLoggedIn:true});check(registered.status==='ready','selected register');
    const started=await new CleanEpochFirstCampaignAdapter(owner).start(id,form(),false);
    check(started.status==='ready',`selected production first ${JSON.stringify(started)}`);
    return {id,player:started.value.loaded.snapshot.playerState.coreData.playerName};
  } finally {owner.close();}}
function mount(){const root=createRoot(target);root.render(<EpochApp/>);return root;}
async function main(){
  const owner=await openCleanEpochAccountStore();
  try{
    step('C2 mounted selected Legacy action over campaign-bearing account');
    const subject=await seed();
    const before=await owner.readSelected(subject.id);check(!!before,'selected campaign account');
    const earned=grantLegacy(before.profile,{amount:12,summary:'Synthetic selected eligibility',
      sourceType:'synthetic_audit',sourceId:'dev-0.7.1.13',recordedAt:new Date().toISOString()});
    check(earned.ok,'selected synthetic grant');
    check((await new CleanEpochAccountAdapter(owner).updateProfile(subject.id,before.revision,earned.profile)).status==='ready','grant stored');
    const ready=await owner.readSlot(subject.id,'slot-1');check(ready.status==='ready','campaign ready');
    const artifact=JSON.stringify(ready.loaded);
    const root=mount();
    await until(()=>button('Legacy'),'selected menu Legacy');button('Legacy')!.click();
    const preparedCard=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.creator-forged-card'))
      .find(x=>x.textContent?.includes('Prepared Lineage')&&x.querySelector('button'))??null,
      'selected Prepared Lineage card');
    const purchased=await owner.readSelected(subject.id);check(!!purchased,'prepurchase selected');
    preparedCard.querySelector<HTMLButtonElement>('button')!.click();
    await until(()=>target.innerText.includes('Legacy Purchased')?true:null,'selected purchase confirmation');
    const after=await owner.readSelected(subject.id);check(!!after,'postpurchase selected');
    check(after.profile.legacy.legacyPoints<purchased.profile.legacy.legacyPoints,'selected purchase spent once');
    const storehouse=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.creator-forged-card'))
      .find(x=>x.textContent?.includes('Storehouse Keys')&&x.querySelector('button'))??null,
      'selected preparation purchase card');
    storehouse.querySelector<HTMLButtonElement>('button')!.click();
    await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.creator-forged-card'))
      .find(x=>x.textContent?.includes('Storehouse Keys')&&
        Array.from(x.querySelectorAll('button')).some(b=>b.textContent?.trim()==='Select'))??null,
      'selected preparation Select control');
    const beforeSelect=(await owner.readSelected(subject.id))!;
    const selectedPreparation=Array.from(target.querySelectorAll<HTMLElement>('.creator-forged-card'))
      .find(x=>x.textContent?.includes('Storehouse Keys'))!;
    Array.from(selectedPreparation.querySelectorAll('button'))
      .find(x=>x.textContent?.trim()==='Select')!.click();
    await until(()=>target.innerText.includes('Preparation Selected')?true:null,
      'selected preparation durable notice');
    const afterSelect=(await owner.readSelected(subject.id))!;
    check(afterSelect.revision>beforeSelect.revision&&
      afterSelect.profile.legacy.selectedPreparationUnlockIds?.includes('legacy.unlock.preparation.storehouse_keys'),
      'selected preparation persisted exact unlock');
    const stable=await owner.readSlot(subject.id,'slot-1');
    check(stable.status==='ready'&&JSON.stringify(stable.loaded)===artifact,'Legacy purchase preserves campaign artifact/control');
    step('D1 mounted selected retirement closes head after durable settlement');
    button('Characters')?.click();
    const slot=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .find(x=>x.textContent?.includes(subject.player))??null,'selected ready character card');
    check(slot.textContent?.includes(subject.player),'selected ready character identity');slot.click();
    await until(()=>target.querySelector<HTMLButtonElement>('button[aria-label="Open settings"]'),'in-game settings opener');
    target.querySelector<HTMLButtonElement>('button[aria-label="Open settings"]')!.click();
    await until(()=>button('Retire Character'),'in-game retirement control');
    const originalConfirm=window.confirm;window.confirm=()=>true;
    button('Retire Character')!.click();
    await until(()=>target.innerText.includes('Character Retired')?true:null,'selected retired notice');
    window.confirm=originalConfirm;
    const terminal=await owner.readSlot(subject.id,'slot-1');
    check(terminal.status==='empty','selected retirement removed addressed slot after closure');
    const recovery=await owner.readTerminalForSource(subject.id,ready.loaded.sessionControl.campaignId,
      ready.loaded.sessionControl.loadedPublicationId);
    check(recovery?.status==='settlement_completed'&&!!recovery.addressClosure,
      'selected retirement settled terminal and closed address');
    const settled=await owner.readSelected(subject.id);check(!!settled,'settled account');
    check(settled.profile.history.runRecords.some(r=>r.archiveReason==='retired'&&r.outcome==='archived'),
      'selected retirement archived run');
    root.unmount();target.replaceChildren();
    step('E1 mounted selected address deletion retains other address and campaign artifacts');
    const deletion=await seed();
    const initial=await owner.readSlot(deletion.id,'slot-1');check(initial.status==='ready','selected deletion source ready');
    const duplicate=await new CleanEpochDescendantAdapter(owner).save({accountId:deletion.id,
      sourceSlotId:'slot-1',destinationSlotId:'slot-2',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(deletion.id))!.revision,
      snapshot:initial.loaded.snapshot,control:initial.loaded.sessionControl});
    check(duplicate.status==='ready','selected deletion other address ready');
    const survivor=await owner.readSlot(deletion.id,'slot-2');check(survivor.status==='ready','selected survivor readback');
    const survivorRaw=JSON.stringify(survivor.loaded);
    const originalFirst=await owner.readHistoricalFirstRecovery(deletion.id,initial.loaded.sessionControl.campaignId);
    const deletionRoot=mount();
    const deleteControl=await until(()=>target.querySelector<HTMLButtonElement>(`button[aria-label="Delete ${deletion.player}"]`),
      'selected menu address delete control');
    deleteControl.click();
    await until(()=>Array.from(target.querySelectorAll('button')).filter(x=>x.textContent?.trim()==='Delete Save').length>0?true:null,
      'selected delete modal');
    button('Delete Save')!.click();
    await until(()=>target.innerText.includes('Save Address Removed')?true:null,'selected deletion completion');
    check((await owner.readSlot(deletion.id,'slot-1')).status==='empty','selected slot only became empty');
    const survivorAfter=await owner.readSlot(deletion.id,'slot-2');
    check(survivorAfter.status==='ready'&&JSON.stringify(survivorAfter.loaded)===survivorRaw,
      'selected deletion preserved other address bytes');
    const historical=await owner.readHistoricalFirstRecovery(deletion.id,initial.loaded.sessionControl.campaignId);
    check(JSON.stringify(historical)===JSON.stringify(originalFirst),'selected deletion preserved first authority');
    deletionRoot.unmount();target.replaceChildren();
    step('F1 old mounted tab cannot select a reset generation');
    const stale=await seed();
    const staleRoot=mount();
    const staleRow=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .find(x=>x.textContent?.includes(stale.player))??null,'stale mounted tab row');
    const staleAccount=(await owner.readSelected(stale.id))!;
    const resetOwner=await openCleanEpochAccountStore();
    const reset=await new CleanEpochAccountAdapter(resetOwner).resetAccount({accountId:stale.id,
      expectedRevision:staleAccount.revision,expectedGeneration:accountLifecycleGeneration(staleAccount),
      password,stayLoggedIn:true});
    check(reset.status==='ready','competing owner reset committed');
    resetOwner.close();
    staleRow.click();
    await new Promise(resolve=>setTimeout(resolve,100));
    check(!target.innerText.includes('Create Your Character')&&
      !target.innerText.includes('Character Creation'),
      `stale selected tab crossed reset generation: ${target.innerText.slice(0,350)}`);
    staleRoot.unmount();target.replaceChildren();
    step('F1 actual selected Settings reset erases prepared publication and fences old session');
    const resetSubject=await seed();
    const pending=await new CleanEpochFirstCampaignAdapter(owner).prepare(resetSubject.id,form('slot-2'),false);
    check(pending.status==='ready','prepared second slot before selected reset');
    const signed=await new CleanEpochAccountAdapter(owner).signIn({accountId:resetSubject.id,
      password,stayLoggedIn:true});check(signed.status==='ready','old session captured');
    const oldSession=signed.value.session;
    const oldHint=window.localStorage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
    check(!!oldHint&&JSON.parse(oldHint).accountId===resetSubject.id,'old persisted hint captured');
    const beforeReset=(await owner.readSelected(resetSubject.id))!;
    const resetRoot=mount();
    await until(()=>button('Settings'),'selected Settings navigation');button('Settings')!.click();
    await until(()=>button('Reset Account'),'selected Settings reset action');button('Reset Account')!.click();
    const resetPassword=await until(()=>target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'selected reset password');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(resetPassword,password);
    resetPassword.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(resolve=>setTimeout(resolve,0));
    const resetButtons=Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .filter(x=>x.textContent?.trim()==='Reset Account');
    check(resetButtons.length>=2,'selected reset confirmation open');resetButtons.at(-1)!.click();
    await until(()=>target.innerText.includes('Account Reset')?true:null,'selected reset readback notice');
    const afterReset=(await owner.readSelected(resetSubject.id))!;
    check(accountLifecycleGeneration(afterReset)===accountLifecycleGeneration(beforeReset)+1&&
      afterReset.revision===beforeReset.revision+1,'selected reset generation and revision readback');
    check(afterReset.profile.history.runRecords.length===0&&
      (await owner.readSlot(resetSubject.id,'slot-2')).status==='empty',
      'selected reset erased prepared and campaign history');
    let oldDenied=false;try{await new CleanEpochAccountAdapter(owner).validateSession(oldSession);}catch{oldDenied=true;}
    check(oldDenied,'old live session fenced after selected reset');
    const oldResume=await new CleanEpochFirstCampaignAdapter(owner).resume(resetSubject.id,'slot-2');
    check(oldResume.status==='blocked','old prepared publication cannot resume');
    resetRoot.unmount();target.replaceChildren();
    window.localStorage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY,oldHint!);
    const hintRoot=mount();
    await until(()=>target.innerText.includes('Epoch session lifecycle generation changed')?true:null,
      'old persisted hint blocked on remount');
    check(target.innerText.includes('Campaign data is unavailable')&&
      !target.innerText.includes('Campaign Ready'),
      'old persisted hint did not select reset generation');
    hintRoot.unmount();target.replaceChildren();
    window.localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
    step('F2 actual selected Settings delete fences retained stale tab and session');
    const deleteSubject=await seed();
    const secondSlot=await owner.readSlot(deleteSubject.id,'slot-1');check(secondSlot.status==='ready','delete source ready');
    check((await new CleanEpochDescendantAdapter(owner).save({accountId:deleteSubject.id,
      sourceSlotId:'slot-1',destinationSlotId:'slot-2',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(deleteSubject.id))!.revision,
      snapshot:secondSlot.loaded.snapshot,control:secondSlot.loaded.sessionControl})).status==='ready',
      'delete subject has two addressed slots');
    const oldSignIn=await new CleanEpochAccountAdapter(owner).signIn({accountId:deleteSubject.id,
      password,stayLoggedIn:true});check(oldSignIn.status==='ready','delete old session captured');
    const oldDeleteSession=oldSignIn.value.session;
    const otherId=`account.local.g9.residual.other.${crypto.randomUUID()}`;
    check((await new CleanEpochAccountAdapter(owner).register({accountId:otherId,displayName:'Other residual',
      password,confirmPassword:password,stayLoggedIn:false})).status==='ready','other delete account registered');
    const otherBefore=JSON.stringify(await owner.read(otherId));
    check((await new CleanEpochAccountAdapter(owner).signIn({accountId:deleteSubject.id,
      password,stayLoggedIn:true})).status==='ready','delete subject reselected after other setup');
    const oldTab=mount();
    const oldRow=await until(()=>Array.from(target.querySelectorAll<HTMLElement>('.launcher-save-row'))
      .find(x=>x.textContent?.includes(deleteSubject.player))??null,'old selected tab ready row');
    const deletingHost=document.createElement('div');document.body.appendChild(deletingHost);
    const deletingTab=createRoot(deletingHost);deletingTab.render(<EpochApp/>);
    const settings=await until(()=>Array.from(deletingHost.querySelectorAll<HTMLButtonElement>('button'))
      .find(x=>x.textContent?.trim()==='Settings')??null,'second selected Settings');
    settings.click();
    const begin=await until(()=>Array.from(deletingHost.querySelectorAll<HTMLButtonElement>('button'))
      .find(x=>x.textContent?.trim()==='Delete Account')??null,'second selected delete');
    begin.click();
    const field=await until(()=>deletingHost.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'selected delete password');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(field,password);
    field.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(resolve=>setTimeout(resolve,0));
    const confirmation=Array.from(deletingHost.querySelectorAll<HTMLButtonElement>('button'))
      .filter(x=>x.textContent?.trim()==='Delete Account').at(-1)!;
    confirmation.click();
    await until(()=>deletingHost.innerText.includes('Account Login')?true:null,'selected delete returned picker');
    const deletedReceipt=await owner.readLifecycleReceipt(deleteSubject.id);
    check((await owner.read(deleteSubject.id))===null&&deletedReceipt?.kind==='delete'&&
      deletedReceipt.version===2&&!!deletedReceipt.requestId,'selected delete exact v2 tombstone');
    let staleDenied=false;try{await new CleanEpochAccountAdapter(owner).validateSession(oldDeleteSession);}
      catch{staleDenied=true;}
    check(staleDenied,'old deleted session cannot reenter');
    oldRow.click();
    await new Promise(resolve=>setTimeout(resolve,100));
    check(!target.innerText.includes('Campaign Ready')&&
      (await owner.read(deleteSubject.id))===null,'old selected tab cannot revive deleted campaign');
    check(JSON.stringify(await owner.read(otherId))===otherBefore,'selected delete retained other account bytes');
    oldTab.unmount();deletingTab.unmount();deletingHost.remove();target.replaceChildren();
  }finally{owner.close();}
}
main().then(()=>output.textContent=`PASS ${assertions} independent selected assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
