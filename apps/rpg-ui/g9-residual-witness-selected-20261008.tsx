import { createRoot } from 'react-dom/client';
import { EpochApp } from './src/EpochApp.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import { preparePlayerSurveyActivityAdvancementCommand, executePlayerSurveyActivityAdvancementCommand } from '../../packages/engines/game-engine/src/player-survey-activity-advancement.ts';
import { preparePlayerSoundingsTurnInCommand, executePlayerSoundingsTurnInCommand } from '../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import { admitCampaignMutation, type CampaignSessionControl } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { verifySoundingsAdmissionProvenance } from '../../packages/engines/game-engine/src/soundings-admission-witness.ts';
import type { SaveSnapshot } from '../../packages/shared/types/src/index.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;
const target=document.querySelector<HTMLDivElement>('#app')!;
const dataFamilies=['newCampaignAttempts','pendingPublicationRecoveries',
  'descendantPublicationRecoveries','terminalLifecycleRecoveries','campaignAttemptsV6',
  'firstPublicationRecoveriesV6','currentSlotGenerations','addressDeletionReceipts',
  'artifacts','controls','slots','witnesses'];
const password='synthetic-witness-selected-password';
let assertions=0;const steps:string[]=[];
function check(v:unknown,label:string):asserts v{assertions++;if(!v)throw Error(label);}
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
function form(slotId:'slot-1'|'slot-2'='slot-1'){
  const initial=createDefaultCharacterCreationFormState(slotId);
  const identity=getLineageIdentityCatalog(initial.lineageId)!;
  return {...initial,playerName:`Witness ${crypto.randomUUID().slice(0,6)}`,
    hairColorId:identity.hairColorOptions[0]!.id,eyeColorId:identity.eyeColorOptions[0]!.id,
    skinToneId:identity.skinToneOptions[0]!.id,startingBundleId:'starting_bundle.traveler',
    startingBundleChoiceSelections:createDefaultStartingBundleChoiceSelections('starting_bundle.traveler'),
    backstoryId:'backstory.craftsmans_child',continentId:'region.myridian_chain',
    regionId:'region.starfall_isle',startingSettlementId:'settlement.starfall_port'};
}
async function db(){const opening=indexedDB.open('lineage.campaigns.epoch1');
  return await new Promise<IDBDatabase>((resolve,reject)=>{
    opening.onsuccess=()=>resolve(opening.result);opening.onerror=()=>reject(opening.error);});}
async function familyRows(family:string,id:string){const database=await db();try{
  const query=database.transaction(family).objectStore(family).getAll();
  const values=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
    query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]);query.onerror=()=>reject(query.error);});
  return values.filter(row=>row.accountId===id);
}finally{database.close();}}
async function mirror(family:string,value:unknown){const database=await db();try{
  const tx=database.transaction(family,'readwrite');tx.objectStore(family).put(value);
  await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
}finally{database.close();}}
async function until<T>(fn:()=>T|null,label:string){for(let i=0;i<240;i++){
  const found=fn();if(found)return found;await new Promise(resolve=>setTimeout(resolve,25));}
  throw Error(`Timeout ${label}: ${target.innerText.slice(-500)}`);}
async function main(){const owner=await openCleanEpochAccountStore();
  const id=`account.local.residual.witness.${crypto.randomUUID()}`;
  const otherId=`account.local.residual.witness.other.${crypto.randomUUID()}`;
  try{
    step('F2 construct fresh production-authorized witnessed Soundings graph');
    const accounts=new CleanEpochAccountAdapter(owner);
    check((await accounts.register({accountId:otherId,displayName:'Other witness account',
      password,confirmPassword:password,stayLoggedIn:false})).status==='ready','other witness account');
    const otherBefore=JSON.stringify(await owner.read(otherId));
    check((await accounts.register({accountId:id,displayName:'Selected witnessed account',
      password,confirmPassword:password,stayLoggedIn:true})).status==='ready','witness subject registration');
    const first=await new CleanEpochFirstCampaignAdapter(owner).start(id,form(),false);
    check(first.status==='ready','witness first campaign');
    let snapshot:SaveSnapshot=first.value.loaded.snapshot;
    let control:CampaignSessionControl=first.value.loaded.sessionControl;
    const admit=(candidate:SaveSnapshot)=>{
      const result=admitCampaignMutation(control,{mutationId:`residual.witness.${crypto.randomUUID()}`,
        sourceArtifactId:control.loadedArtifactId,sourceRevision:control.sessionRevision,
        ownerKind:'engine_result',accepted:true,sourceSnapshot:snapshot,proposedSnapshot:candidate});
      check(result.accepted,`production session admission ${result.reason}`);
      snapshot=result.snapshot;control=result.control;
    };
    const accepted=executePlayerQuestAcceptanceCommand(snapshot,
      createPlayerQuestAcceptanceCommand(snapshot,'quest.ashen_reef_survey'));
    check(accepted.accepted,'authored quest accepted');admit(accepted.snapshot);
    const outward=executePlayerTravelCommand(snapshot,
      createPlayerTravelCommand(snapshot,'location.ashen_reef'));
    check(outward.accepted,'authored reef travel');admit(outward.snapshot);
    for(let index=0;index<4;index++){
      const prepared=preparePlayerSurveyActivityAdvancementCommand(snapshot,control,
        `survey_request.${crypto.randomUUID()}`);
      check(prepared.kind==='prepared',`survey shift ${index} prepared`);
      const progress=executePlayerSurveyActivityAdvancementCommand(snapshot,control,prepared.command);
      check(progress.accepted,`survey shift ${index} admitted: ${progress.code}`);
      snapshot=progress.snapshot;control=progress.control;
    }
    const returning=executePlayerTravelCommand(snapshot,
      createPlayerTravelCommand(snapshot,'settlement.starfall_port'));
    check(returning.accepted,'authored return travel');admit(returning.snapshot);
    const turnIn=preparePlayerSoundingsTurnInCommand(snapshot,control,
      `soundings_turn_in_request.${crypto.randomUUID()}`);
    check(turnIn.kind==='prepared','production Soundings turn-in prepared');
    const submitted=executePlayerSoundingsTurnInCommand(snapshot,control,turnIn.command);
    check(submitted.accepted,'production Soundings turn-in admitted');
    snapshot=submitted.snapshot;control=submitted.control;
    check(verifySoundingsAdmissionProvenance(snapshot,control)==='verified',
      'session witness verified before publication');
    const witnessed=await new CleanEpochDescendantAdapter(owner).save({accountId:id,
      sourceSlotId:'slot-1',destinationSlotId:'slot-1',
      expectedDestinationAddress:{artifactId:first.value.loaded.sessionControl.loadedArtifactId,
        publicationId:first.value.loaded.sessionControl.loadedPublicationId},
      expectedAccountRevision:(await owner.readSelected(id))!.revision,snapshot,control});
    check(witnessed.status==='ready'&&verifySoundingsAdmissionProvenance(witnessed.value.loaded.snapshot,
      witnessed.value.loaded.sessionControl)==='verified','witnessed durable head readback');
    check((await familyRows('witnesses',id)).length===1,'one independently minted durable witness');
    step('F2 fill all twelve owned families through production publications and retained mirrors');
    const quick=await new CleanEpochDescendantAdapter(owner).save({accountId:id,
      sourceSlotId:'slot-1',destinationSlotId:'quick-save',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:witnessed.value.loaded.snapshot,control:witnessed.value.loaded.sessionControl});
    check(quick.status==='ready','second witnessed address');
    const pointer=await owner.readSlotGeneration(id,'slot-1');check(pointer?.status==='published','witness slot generation');
    check((await owner.deleteSlotAddress({accountId:id,slotId:'slot-1',
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      expectedSlotGenerationId:pointer.slotGenerationId,
      expectedAddress:{artifactId:witnessed.value.loaded.sessionControl.loadedArtifactId,
        publicationId:witnessed.value.loaded.sessionControl.loadedPublicationId},
      deletedAt:new Date().toISOString()})).status==='committed','witness address deletion');
    const next=await new CleanEpochFirstCampaignAdapter(owner).start(id,form('slot-2'),false);
    check(next.status==='ready','second production campaign');
    const terminalControl=next.value.loaded.sessionControl;
    const retired=await new CleanEpochTerminalAdapter(owner).retire({accountId:id,
      sourceSlotId:'slot-2',expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:next.value.loaded.snapshot,control:terminalControl,
      expectedSourceAddress:{artifactId:terminalControl.loadedArtifactId,
        publicationId:terminalControl.loadedPublicationId}});
    check(retired.status==='completed','second campaign terminal settled');
    const firstAttempt=(await familyRows('campaignAttemptsV6',id))
      .find(row=>row.campaignId===control.campaignId);
    const firstRecovery=(await familyRows('firstPublicationRecoveriesV6',id))
      .find(row=>row.campaignId===control.campaignId);
    check(!!firstAttempt&&!!firstRecovery,'first authority retained for legacy mirror');
    await mirror('newCampaignAttempts',firstAttempt);
    await mirror('pendingPublicationRecoveries',firstRecovery);
    const counts=await Promise.all(dataFamilies.map(async family=>(await familyRows(family,id)).length));
    check(counts.every(count=>count>0),`all twelve families populated ${counts}`);
    step('F2 mounted selected delete over fully populated witness graph');
    const root=createRoot(target);root.render(<EpochApp/>);
    const settings=await until(()=>Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .find(button=>button.textContent?.trim()==='Settings')??null,'selected witnessed Settings');
    settings.click();
    const begin=await until(()=>Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .find(button=>button.textContent?.trim()==='Delete Account')??null,'selected witnessed delete');
    begin.click();
    const input=await until(()=>target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'selected witness password');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,password);
    input.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(resolve=>setTimeout(resolve,0));
    Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .filter(button=>button.textContent?.trim()==='Delete Account').at(-1)!.click();
    await until(()=>target.innerText.includes('Account Login')?true:null,'selected witnessed deletion readback');
    check((await owner.read(id))===null,'witnessed selected account absent after delete');
    const receipt=await owner.readLifecycleReceipt(id);
    check(receipt?.kind==='delete'&&receipt.version===2&&!!receipt.requestId,
      'witnessed selected v2 request tombstone');
    for(const family of dataFamilies)check((await familyRows(family,id)).length===0,
      `witnessed selected deletion retained ${family}`);
    check(JSON.stringify(await owner.read(otherId))===otherBefore,'witnessed selected delete preserved other account');
    root.unmount();
  }finally{owner.close();}}
main().then(()=>output.textContent=`PASS ${assertions} independent selected witnessed assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions} after ${steps.at(-1)}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
