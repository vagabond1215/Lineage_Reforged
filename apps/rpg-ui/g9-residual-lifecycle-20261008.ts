import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration } from './src/game-shell/cleanEpochAccountStore.ts';

const output=document.querySelector<HTMLPreElement>('#audit')!;
const name=`lineage.g9.residual.lifecycle.${crypto.randomUUID()}`;
const password='synthetic-residual-lifecycle-password';
let assertions=0;const steps:string[]=[];
function check(v:unknown,label:string):asserts v {assertions++;if(!v)throw Error(label);}
function step(label:string){steps.push(label);output.textContent=`RUNNING ${label} (${assertions})`;}
async function rawReceipt(id:string,change:(value:Record<string,unknown>)=>Record<string,unknown>|null){
  const request=indexedDB.open(name);const db=await new Promise<IDBDatabase>((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  try{const tx=db.transaction('accountLifecycle','readwrite');const store=tx.objectStore('accountLifecycle');
    const query=store.get(id);const value=await new Promise<Record<string,unknown>>((resolve,reject)=>{
      query.onsuccess=()=>resolve(query.result as Record<string,unknown>);query.onerror=()=>reject(query.error);});
    check(!!value,'raw lifecycle fixture exists');
    const next=change(value);if(next===null)store.delete(id);else store.put(next);
    await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
  }finally{db.close();}}
async function bytes(id:string){const request=indexedDB.open(name);
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  try{const all:unknown[]=[];for(const family of ['accounts','accountLifecycle','newCampaignAttempts',
    'pendingPublicationRecoveries','descendantPublicationRecoveries','terminalLifecycleRecoveries',
    'campaignAttemptsV6','firstPublicationRecoveriesV6','currentSlotGenerations','addressDeletionReceipts',
    'artifacts','controls','slots','witnesses']){
    const query=db.transaction(family).objectStore(family).getAll();
    const values=await new Promise<Record<string,unknown>[]>((resolve,reject)=>{
      query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]);query.onerror=()=>reject(query.error);});
    all.push([family,values.filter(row=>row.accountId===id)]);}
    return JSON.stringify(all);
  }finally{db.close();}}
async function register(owner:Awaited<ReturnType<typeof openCleanEpochAccountStore>>){
  const id=`account.local.residual.lifecycle.${crypto.randomUUID()}`;
  const result=await new CleanEpochAccountAdapter(owner).register({accountId:id,
    displayName:'Residual lifecycle',password,confirmPassword:password,stayLoggedIn:false});
  check(result.status==='ready','lifecycle registration');return id;
}
async function main(){const owner=await openCleanEpochAccountStore({name});
  const other=await openCleanEpochAccountStore({name});
  try{
    const otherId=await register(owner);const otherBefore=await bytes(otherId);
    step('F4 delete lost postcommit receipt readback and exact restarted owner retry');
    const id=await register(owner);const account=(await owner.readSelected(id))!;
    const input={accountId:id,expectedRevision:account.revision,
      expectedGeneration:accountLifecycleGeneration(account),currentPassword:password,
      requestId:crypto.randomUUID()};
    const unreliable=await openCleanEpochAccountStore({name});
    const original=unreliable.readLifecycleReceipt.bind(unreliable);let lost=false;
    unreliable.readLifecycleReceipt=async(accountId)=>{
      const value=await original(accountId);
      if(!lost&&accountId===id&&value?.kind==='delete'){
        lost=true;throw Error('Synthetic lifecycle receipt acknowledgement lost');}
      return value;};
    let threw=false;try{await unreliable.transitionAccount('delete',input);}catch{threw=true;}
    check(threw&&lost,'postcommit lifecycle readback interrupted');
    const committed=await owner.readLifecycleReceipt(id);
    check((await owner.read(id))===null&&committed?.kind==='delete'&&committed.version===2&&
      committed.requestId===input.requestId,'lost acknowledgement retained exact v2 tombstone');
    unreliable.close();
    const replay=await other.transitionAccount('delete',input);
    check(replay.status==='same_source_retry'&&replay.receipt.requestId===input.requestId,
      'restarted second owner exact retry');
    let changed=false;try{await owner.transitionAccount('delete',{...input,requestId:crypto.randomUUID()});}
      catch{changed=true;}
    check(changed,'changed request cannot claim prior tombstone');
    const reentry=await new CleanEpochAccountAdapter(other).register({accountId:id,
      displayName:'Fresh attempt',password,confirmPassword:password,stayLoggedIn:false});
    check(reentry.status==='blocked','fresh same-ID registration refused');
    check(await bytes(otherId)===otherBefore,'lifecycle retry preserved other account');
    step('F4 reset lost postcommit receipt readback and exact restarted owner retry');
    const resetId=await register(owner);const resetAccount=(await owner.readSelected(resetId))!;
    const resetInput={accountId:resetId,expectedRevision:resetAccount.revision,
      expectedGeneration:accountLifecycleGeneration(resetAccount),currentPassword:password};
    const resetUnreliable=await openCleanEpochAccountStore({name});
    const resetOriginal=resetUnreliable.readLifecycleReceipt.bind(resetUnreliable);let resetLost=false;
    resetUnreliable.readLifecycleReceipt=async(accountId)=>{
      const value=await resetOriginal(accountId);
      if(!resetLost&&accountId===resetId&&value?.kind==='reset'){
        resetLost=true;throw Error('Synthetic reset receipt acknowledgement lost');}
      return value;};
    let resetThrew=false;try{await resetUnreliable.transitionAccount('reset',resetInput);}catch{resetThrew=true;}
    check(resetThrew&&resetLost,'reset postcommit receipt readback interrupted');
    const resetReceipt=await owner.readLifecycleReceipt(resetId);
    const resetCurrent=await owner.readSelected(resetId);
    check(resetReceipt?.kind==='reset'&&!!resetCurrent&&
      accountLifecycleGeneration(resetCurrent)===accountLifecycleGeneration(resetAccount)+1,
      'lost reset acknowledgement retains one new generation');
    resetUnreliable.close();
    const resetRetry=await other.transitionAccount('reset',resetInput);
    check(resetRetry.status==='same_source_retry'&&
      resetRetry.receipt.completedGeneration===resetReceipt.completedGeneration,
      'restarted second owner returns exact reset receipt');
    check(await bytes(otherId)===otherBefore,'reset retry preserved other account');
    step('F4 malformed, absent and legacy lifecycle receipt controls');
    for(const variant of ['malformed-version','malformed-generation','malformed-request','legacy-v1','missing'] as const){
      const candidate=await register(owner);const selected=(await owner.readSelected(candidate))!;
      const request={accountId:candidate,expectedRevision:selected.revision,
        expectedGeneration:accountLifecycleGeneration(selected),currentPassword:password,requestId:crypto.randomUUID()};
      check((await owner.transitionAccount('delete',request)).status==='committed','variant coherent delete');
      await rawReceipt(candidate,value=>variant==='missing'?null:variant==='malformed-version'?{...value,version:99}:
        variant==='malformed-generation'?{...value,completedGeneration:0}:
        variant==='malformed-request'?{...value,requestId:'not-a-uuid'}:{...value,version:1,requestId:undefined});
      const before=await bytes(candidate);let writes=0;
      const counted=await openCleanEpochAccountStore({name,beforeWrite:()=>{writes++;}});
      let readDenied=false;try{await counted.readLifecycleReceipt(candidate);}catch{readDenied=true;}
      check(variant==='missing'||variant==='legacy-v1'||readDenied,
        `${variant} malformed receipt read unexpectedly succeeded`);
      let retryDenied=false;try{await counted.transitionAccount('delete',request);}catch{retryDenied=true;}
      check(retryDenied&&writes===0&&await bytes(candidate)===before,
        `${variant} exact retry escaped prewrite receipt fence`);
      counted.close();
    }
    check(await bytes(otherId)===otherBefore,'receipt variants retained other account bytes');
  }finally{other.close();owner.close();}
}
main().then(()=>output.textContent=`PASS ${assertions} independent lifecycle assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
