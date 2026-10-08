import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration, type CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;
const name=`lineage.g9.residual.graphs.${crypto.randomUUID()}`;
const password='synthetic-residual-graph-password';
const families=['newCampaignAttempts','pendingPublicationRecoveries','descendantPublicationRecoveries',
  'terminalLifecycleRecoveries','campaignAttemptsV6','firstPublicationRecoveriesV6',
  'currentSlotGenerations','addressDeletionReceipts','artifacts','controls','slots','witnesses'];
type Mode='prepared'|'accepted-pending'|'descendant'|'terminal'|'deleted-address'|'reused-slot';
let assertions=0;const steps:string[]=[];
function check(v:unknown,label:string):asserts v{assertions++;if(!v)throw Error(label);}
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
function form(){const initial=createDefaultCharacterCreationFormState('slot-1');
  const identity=getLineageIdentityCatalog(initial.lineageId)!;const bundle=startingBundleOptions[0]!;
  const continent=getWorldContinentOptions()[0]!;const region=getWorldRegionOptions(continent.id)[0]!;
  const settlement=getWorldSettlementOptions({continentId:continent.id,regionId:region.id,backstoryId:''})[0]!;
  return {...initial,playerName:`Graph ${crypto.randomUUID().slice(0,6)}`,
    hairColorId:identity.hairColorOptions[0]!.id,eyeColorId:identity.eyeColorOptions[0]!.id,
    skinToneId:identity.skinToneOptions[0]!.id,startingBundleId:bundle.id,
    startingBundleChoiceSelections:createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId:continent.id,regionId:region.id,startingSettlementId:settlement.id};}
async function database(){const open=indexedDB.open(name);return await new Promise<IDBDatabase>((resolve,reject)=>{
  open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error);});}
async function rows(id:string){const db=await database();try{const output:unknown[]=[];
  for(const family of ['accounts','accountLifecycle',...families]){
    const query=db.transaction(family).objectStore(family).getAll();
    const values=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
      query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]);query.onerror=()=>reject(query.error);});
    output.push([family,values.filter(row=>row.accountId===id)]);}
  return JSON.stringify(output);
}finally{db.close();}}
async function dataCount(id:string){const db=await database();try{let count=0;
  for(const family of families){const query=db.transaction(family).objectStore(family).getAll();
    const values=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
      query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]);query.onerror=()=>reject(query.error);});
    count+=values.filter(row=>row.accountId===id).length;}
  return count;
}finally{db.close();}}
async function mutate(id:string,mode:Mode){
  const family=mode==='prepared'?'campaignAttemptsV6':
    mode==='accepted-pending'?'firstPublicationRecoveriesV6':
    mode==='descendant'?'descendantPublicationRecoveries':
    mode==='terminal'?'terminalLifecycleRecoveries':'addressDeletionReceipts';
  const db=await database();try{const tx=db.transaction(family,'readwrite');const store=tx.objectStore(family);
    const query=store.getAll();const found=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
      query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]);query.onerror=()=>reject(query.error);});
    const row=found.find(value=>value.accountId===id);check(!!row,`${mode} corruption target exists`);
    if(mode==='prepared'||mode==='accepted-pending'||mode==='descendant'){
      const key=(store.keyPath as string[]).map(field=>row[field] as IDBValidKey);
      store.delete(key);
    }else if(mode==='terminal')store.put({...row,expectedAccountRevision:-1});
    else store.put({...row,expectedAccountRevision:-1});
    await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
  }finally{db.close();}}
async function setup(owner:CleanEpochAccountStore,mode:Mode){
  const id=`account.local.residual.graph.${crypto.randomUUID()}`;
  check((await new CleanEpochAccountAdapter(owner).register({accountId:id,displayName:'Synthetic graph',
    password,confirmPassword:password,stayLoggedIn:false})).status==='ready',`${mode} registration`);
  const first=new CleanEpochFirstCampaignAdapter(owner);
  if(mode==='prepared'){
    check((await first.prepare(id,form(),false)).status==='ready','prepared graph created');return id;}
  if(mode==='accepted-pending'){
    check((await first.prepare(id,form(),false)).status==='ready','pending graph prepared');
    const original=owner.completePreparedAttemptConsumers.bind(owner);
    owner.completePreparedAttemptConsumers=async()=>{throw Error('Synthetic pending consumer interruption');};
    const interrupted=await first.resume(id,'slot-1');
    owner.completePreparedAttemptConsumers=original;
    check(interrupted.status==='blocked'&&
      (await owner.readSlot(id,'slot-1')).status==='pending_consumers','accepted pending graph retained');
    return id;
  }
  const firstResult=await first.start(id,form(),false);
  check(firstResult.status==='ready',`${mode} first campaign ready`);
  if(mode==='descendant'){
    const source=await owner.readSlot(id,'slot-1');check(source.status==='ready','descendant source');
    check((await new CleanEpochDescendantAdapter(owner).save({accountId:id,sourceSlotId:'slot-1',
      destinationSlotId:'slot-2',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:source.loaded.snapshot,control:source.loaded.sessionControl})).status==='ready',
      'descendant second address published');return id;
  }
  if(mode==='terminal'){
    const source=await owner.readSlot(id,'slot-1');check(source.status==='ready','terminal source');
    const control=source.loaded.sessionControl;
    const terminal=await new CleanEpochTerminalAdapter(owner).retire({accountId:id,sourceSlotId:'slot-1',
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:source.loaded.snapshot,control,
      expectedSourceAddress:{artifactId:control.loadedArtifactId,publicationId:control.loadedPublicationId}});
    check(terminal.status==='completed','terminal graph settled');return id;
  }
  if(mode==='reused-slot'){
    const source=await owner.readSlot(id,'slot-1');check(source.status==='ready','reused source');
    check((await new CleanEpochDescendantAdapter(owner).save({accountId:id,sourceSlotId:'slot-1',
      destinationSlotId:'slot-2',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:source.loaded.snapshot,control:source.loaded.sessionControl})).status==='ready',
      'reused graph second address');
  }
  const old=await owner.readSlot(id,'slot-1');check(old.status==='ready','deleted address source');
  const pointer=await owner.readSlotGeneration(id,'slot-1');check(pointer?.status==='published','deleted generation');
  check((await owner.deleteSlotAddress({accountId:id,slotId:'slot-1',
    expectedAccountRevision:(await owner.readSelected(id))!.revision,
    expectedSlotGenerationId:pointer.slotGenerationId,
    expectedAddress:{artifactId:old.loaded.sessionControl.loadedArtifactId,
      publicationId:old.loaded.sessionControl.loadedPublicationId},deletedAt:new Date().toISOString()})).status==='committed',
    'deleted address graph retained');
  if(mode==='reused-slot'){
    const survivor=await owner.readSlot(id,'slot-2');check(survivor.status==='ready','reused survivor');
    check((await new CleanEpochDescendantAdapter(owner).save({accountId:id,sourceSlotId:'slot-2',
      destinationSlotId:'slot-1',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:survivor.loaded.snapshot,control:survivor.loaded.sessionControl})).status==='ready',
      'same-campaign slot reoccupied');
  }
  return id;
}
async function main(){const owner=await openCleanEpochAccountStore({name});
  try{const otherId=`account.local.residual.graph.other.${crypto.randomUUID()}`;
    check((await new CleanEpochAccountAdapter(owner).register({accountId:otherId,displayName:'Other',
      password,confirmPassword:password,stayLoggedIn:false})).status==='ready','other graph account');
    const otherBefore=await rows(otherId);
    for(const mode of ['prepared','accepted-pending','descendant','terminal','deleted-address','reused-slot'] as const)
      for(const kind of ['reset','delete'] as const){
        step(`F3/X1 paired ${mode} ${kind} coherent and corrupt graph`);
        const coherent=await setup(owner,mode);const corrupt=await setup(owner,mode);
        await mutate(corrupt,mode);
        const corruptedBytes=await rows(corrupt);const current=(await owner.readSelected(corrupt))!;
        let writes=0;const counted=await openCleanEpochAccountStore({name,beforeWrite:()=>{writes++;}});
        let blocked=false;try{await counted.transitionAccount(kind,{accountId:corrupt,
          expectedRevision:current.revision,expectedGeneration:accountLifecycleGeneration(current),
          currentPassword:password,...(kind==='delete'?{requestId:crypto.randomUUID()}:{})});}
        catch{blocked=true;}
        check(blocked&&writes===0&&await rows(corrupt)===corruptedBytes,
          `${mode}/${kind} corruption escaped prewrite graph fence`);
        counted.close();
        const clean=(await owner.readSelected(coherent))!;
        const resolved=await owner.transitionAccount(kind,{accountId:coherent,
          expectedRevision:clean.revision,expectedGeneration:accountLifecycleGeneration(clean),
          currentPassword:password,...(kind==='delete'?{requestId:crypto.randomUUID()}:{})});
        check(resolved.status==='committed'&&await dataCount(coherent)===0,
          `${mode}/${kind} coherent graph did not erase all owned rows`);
        check(await rows(otherId)===otherBefore,`${mode}/${kind} touched other account`);
      }
  }finally{owner.close();}}
main().then(()=>output.textContent=`PASS ${assertions} independent paired graph assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions} after ${steps.at(-1)}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
