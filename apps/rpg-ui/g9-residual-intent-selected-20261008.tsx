import { createRoot } from 'react-dom/client';
import { EpochApp } from './src/EpochApp.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration, CLEAN_EPOCH_DATABASE_NAME } from './src/game-shell/cleanEpochAccountStore.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;
const target=document.querySelector<HTMLDivElement>('#app')!;
const password='synthetic-residual-intent-password';
let assertions=0;const steps:string[]=[];
function check(v:unknown,label:string):asserts v{assertions++;if(!v)throw Error(label);}
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
async function until<T>(fn:()=>T|null,label:string){for(let i=0;i<240;i++){
  const found=fn();if(found)return found;await new Promise(resolve=>setTimeout(resolve,25));}
  throw Error(`Timeout ${label}: ${target.innerText.slice(-500)}`);}
function button(label:string){return Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
  .find(x=>x.textContent?.trim()===label)??null;}
function fill(input:HTMLInputElement,value:string){
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,value);
  input.dispatchEvent(new Event('input',{bubbles:true}));}
async function register(stay:boolean){const owner=await openCleanEpochAccountStore();
  const id=`account.local.residual.intent.${crypto.randomUUID()}`;
  const display=`Residual intent ${id.slice(-6)}`;
  try{check((await new CleanEpochAccountAdapter(owner).register({accountId:id,displayName:display,
    password,confirmPassword:password,stayLoggedIn:stay})).status==='ready','intent account registration');
    return {id,display};}finally{owner.close();}}
async function receipt(id:string){const owner=await openCleanEpochAccountStore();try{return await owner.readLifecycleReceipt(id);}
  finally{owner.close();}}
async function accountBytes(id:string){
  const request=indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  try{const snapshot:unknown[]=[];
    for(const family of ['accounts','accountLifecycle','newCampaignAttempts',
      'pendingPublicationRecoveries','descendantPublicationRecoveries','terminalLifecycleRecoveries',
      'campaignAttemptsV6','firstPublicationRecoveriesV6','currentSlotGenerations',
      'addressDeletionReceipts','artifacts','controls','slots','witnesses']){
      const read=db.transaction(family).objectStore(family).getAll();
      const rows=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
        read.onsuccess=()=>resolve(read.result as Record<string,unknown>[]);read.onerror=()=>reject(read.error);});
      snapshot.push([family,rows.filter(row=>row.accountId===id)]);
    }
    return JSON.stringify(snapshot);
  }finally{db.close();}
}
async function picker(display:string){const root=createRoot(target);root.render(<EpochApp/>);
  const entry=await until(()=>Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
    .find(x=>x.textContent?.trim().startsWith(display))??null,'picker account entry');entry.click();
  const input=await until(()=>target.querySelector<HTMLInputElement>('input[autocomplete="current-password"]'),
    'picker password');return {root,input};}
async function settings(display:string){const root=createRoot(target);root.render(<EpochApp/>);
  await until(()=>target.innerText.includes(display)&&button('Settings')?true:null,'selected Settings menu');
  button('Settings')!.click();await until(()=>button('Delete Account'),'Settings delete action');
  return root;}
async function submitSettings(){const list=Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
  .filter(x=>x.textContent?.trim()==='Delete Account');check(list.length>=2,'Settings delete confirmation');
  list.at(-1)!.click();}
async function main(){
  const original=CleanEpochAccountAdapter.prototype.deleteAccount;
  const seen:Array<{accountId:string;requestId:string}>=[];
  let lose=false;
  CleanEpochAccountAdapter.prototype.deleteAccount=async function(input){
    seen.push({accountId:input.accountId,requestId:input.requestId});
    const result=await original.call(this,input);
    if(lose&&result.status==='ready'){
      lose=false;return {status:'blocked',code:'readback_failed',
        message:'Synthetic lost selected acknowledgement'};}
    return result;
  };
  try{
    const other=await register(false);
    const otherBytes=await accountBytes(other.id);
    step('S1 selected picker wrong password, toggle and Create abandon request');
    const selected=await register(false);
    let {root,input}=await picker(selected.display);
    fill(input,'wrong-password');await new Promise(resolve=>setTimeout(resolve,0));
    button('Delete Account')!.click();
    await until(()=>target.innerText.includes('Current password')||target.innerText.includes('password did not match')?
      true:null,'picker wrong password blocked');
    check((await receipt(selected.id))===null,'wrong picker password made no tombstone');
    const wrongRequest=seen.at(-1)!.requestId;
    const toggle=Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .find(x=>x.textContent?.trim().startsWith(selected.display))!;
    toggle.click();toggle.click();
    fill(await until(()=>target.querySelector<HTMLInputElement>('input[autocomplete="current-password"]'),
      'picker reselected password'),password);
    await new Promise(resolve=>setTimeout(resolve,0));
    lose=true;button('Delete Account')!.click();
    await until(()=>target.innerText.includes('Synthetic lost selected acknowledgement')?true:null,
      'picker committed lost acknowledgement');
    const committed=seen.at(-1)!.requestId;
    check(committed!==wrongRequest&&(await receipt(selected.id))?.requestId===committed,
      'picker toggle minted distinct committed request');
    button('Create Account')!.click();
    await until(()=>button('Back'),'picker Create view');button('Back')!.click();
    const returnEntry=await until(()=>Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .find(x=>x.textContent?.trim().startsWith(selected.display))??null,'picker stale return entry');
    returnEntry.click();
    fill(await until(()=>target.querySelector<HTMLInputElement>('input[autocomplete="current-password"]'),
      'picker returned password'),password);
    await new Promise(resolve=>setTimeout(resolve,0));button('Delete Account')!.click();
    await until(()=>target.innerText.includes('Account changed before deletion')?true:null,
      'picker changed request refused old tombstone');
    check(seen.at(-1)!.requestId!==committed&&(await receipt(selected.id))?.requestId===committed,
      'Create path cannot claim old selected request');
    root.unmount();target.replaceChildren();
    root=createRoot(target);root.render(<EpochApp/>);
    await until(()=>target.innerText.includes('Account Login')?true:null,'remounted picker');
    check(!Array.from(target.querySelectorAll<HTMLButtonElement>('button'))
      .some(x=>x.textContent?.trim().startsWith(selected.display)),
      'remount cannot select deleted picker identity');
    root.unmount();target.replaceChildren();
    step('S2 selected Settings wrong password, changed revision and action switch');
    const settingsSubject=await register(true);
    root=await settings(settingsSubject.display);
    button('Delete Account')!.click();
    fill(await until(()=>target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'Settings wrong password'),'wrong-password');
    await new Promise(resolve=>setTimeout(resolve,0));await submitSettings();
    await until(()=>target.innerText.includes('Current password')||target.innerText.includes('password did not match')?
      true:null,'Settings wrong password refused');
    check((await receipt(settingsSubject.id))===null,'wrong Settings password made no tombstone');
    button('Cancel')!.click();button('Delete Account')!.click();
    fill(await until(()=>target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'Settings correct password'),password);
    await new Promise(resolve=>setTimeout(resolve,0));
    lose=true;await submitSettings();
    await until(()=>target.innerText.includes('Synthetic lost selected acknowledgement')?true:null,
      'Settings committed lost acknowledgement');
    const settingsCommitted=seen.at(-1)!.requestId;
    button('Reset Account')!.click();
    await until(()=>button('Reset Account'),'Settings reset switched');
    button('Delete Account')!.click();
    fill(await until(()=>target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'Settings switched password'),password);
    await new Promise(resolve=>setTimeout(resolve,0));await submitSettings();
    await until(()=>target.innerText.includes('Account changed before deletion')?true:null,
      'Settings switched request refused');
    check(seen.at(-1)!.requestId!==settingsCommitted&&
      (await receipt(settingsSubject.id))?.requestId===settingsCommitted,
      'Settings action switch cannot claim committed tombstone');
    root.unmount();target.replaceChildren();
    step('S1/S2 stale observed revision and reset generation refuse selected deletion');
    const stale=await register(true);root=await settings(stale.display);
    button('Delete Account')!.click();
    fill(await until(()=>target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'),
      'stale Settings password'),password);
    const competing=await openCleanEpochAccountStore();const source=(await competing.readSelected(stale.id))!;
    const reset=await new CleanEpochAccountAdapter(competing).resetAccount({accountId:stale.id,
      expectedRevision:source.revision,expectedGeneration:accountLifecycleGeneration(source),
      password,stayLoggedIn:true});check(reset.status==='ready','competing reset committed');
    await new Promise(resolve=>setTimeout(resolve,0));await submitSettings();
    await until(()=>target.innerText.includes('Account changed before deletion')?true:null,
      'stale selected Settings request refused');
    check((await competing.readLifecycleReceipt(stale.id))?.kind==='reset',
      'stale Settings delete could not replace reset receipt');
    competing.close();root.unmount();target.replaceChildren();
    step('S1 stale picker observed revision refuses competing reset generation');
    const pickerStale=await register(false);
    ({root,input}=await picker(pickerStale.display));
    fill(input,password);
    const pickerOwner=await openCleanEpochAccountStore();
    const pickerAccount=(await pickerOwner.readSelected(pickerStale.id))!;
    const pickerReset=await new CleanEpochAccountAdapter(pickerOwner).resetAccount({accountId:pickerStale.id,
      expectedRevision:pickerAccount.revision,expectedGeneration:accountLifecycleGeneration(pickerAccount),
      password,stayLoggedIn:false});
    check(pickerReset.status==='ready','competing picker reset committed');
    await new Promise(resolve=>setTimeout(resolve,0));button('Delete Account')!.click();
    await until(()=>target.innerText.includes('Account changed before deletion')?true:null,
      'stale selected picker deletion refused');
    check((await pickerOwner.readLifecycleReceipt(pickerStale.id))?.kind==='reset',
      'stale picker delete could not replace reset receipt');
    pickerOwner.close();root.unmount();target.replaceChildren();
    check(await accountBytes(other.id)===otherBytes,'all selected intents preserved every other-account family');
  }finally{CleanEpochAccountAdapter.prototype.deleteAccount=original;}
}
main().then(()=>output.textContent=`PASS ${assertions} independent selected intent assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions} after ${steps.at(-1)}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
