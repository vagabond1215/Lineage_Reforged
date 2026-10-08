import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochLegacyActionAdapter } from './src/game-shell/cleanEpochLegacyActionAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const name = `lineage.g9.residual.owner.${crypto.randomUUID()}`;
const password = 'residual-audit-password';
let assertions = 0;
const steps: string[] = [];
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function step(label: string) { steps.push(label); output.textContent = `RUNNING ${label} (${assertions})`; }
function form() {
  const initial = createDefaultCharacterCreationFormState('slot-1');
  const identity = getLineageIdentityCatalog(initial.lineageId)!;
  const bundle = startingBundleOptions[0]!;
  const continent = getWorldContinentOptions()[0]!;
  const region = getWorldRegionOptions(continent.id)[0]!;
  const settlement = getWorldSettlementOptions({ continentId: continent.id, regionId: region.id, backstoryId: '' })[0]!;
  return { ...initial, playerName: `Residual ${crypto.randomUUID().slice(0, 6)}`,
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId: continent.id, regionId: region.id, startingSettlementId: settlement.id };
}
async function rows(accountId: string) {
  const request = indexedDB.open(name);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  try {
    const all: unknown[] = [];
    for (const family of ['accounts','accountLifecycle','newCampaignAttempts','pendingPublicationRecoveries',
      'descendantPublicationRecoveries','terminalLifecycleRecoveries','campaignAttemptsV6',
      'firstPublicationRecoveriesV6','currentSlotGenerations','addressDeletionReceipts',
      'artifacts','controls','slots','witnesses']) {
      const query = db.transaction(family).objectStore(family).getAll();
      const value = await new Promise<Record<string,unknown>[]>((resolve,reject) => {
        query.onsuccess=()=>resolve(query.result as Record<string,unknown>[]); query.onerror=()=>reject(query.error);
      });
      all.push([family,value.filter(item=>item.accountId===accountId)]);
    }
    return JSON.stringify(all);
  } finally { db.close(); }
}
async function main() {
  const owner = await openCleanEpochAccountStore({name});
  const second = await openCleanEpochAccountStore({name});
  const otherId = `account.local.residual.other.${crypto.randomUUID()}`;
  const id = `account.local.residual.${crypto.randomUUID()}`;
  try {
    const adapter = new CleanEpochAccountAdapter(owner);
    check((await adapter.register({accountId:otherId,displayName:'Other',password,confirmPassword:password,stayLoggedIn:false})).status==='ready','other registration');
    check((await adapter.register({accountId:id,displayName:'Subject',password,confirmPassword:password,stayLoggedIn:false})).status==='ready','subject registration');
    const otherBefore = await rows(otherId);
    const unearned = (await owner.readSelected(id))!;
    const earned = grantLegacy(unearned.profile,{amount:10,summary:'Synthetic residual eligibility',
      sourceType:'synthetic_audit',sourceId:'dev-0.7.1.13',recordedAt:new Date().toISOString()});
    check(earned.ok,'synthetic grant resolved through production');
    check((await adapter.updateProfile(id,unearned.revision,earned.profile)).status==='ready','synthetic eligible profile stored');
    step('C1 pending prepared publication blocks account and Legacy writes prewrite');
    const prepared = await new CleanEpochFirstCampaignAdapter(owner).prepare(id,form(),false);
    check(prepared.status==='ready','prepared first attempt');
    const source = await owner.readSelected(id); check(!!source,'account source');
    const before = await rows(id);
    let writes=0;
    const counted = await openCleanEpochAccountStore({name,beforeWrite:()=>{writes++;}});
    const account = new CleanEpochAccountAdapter(counted);
    const profile = await account.updateProfile(id,source.revision,{...source.profile,displayName:'Blocked edit'});
    check(profile.status==='blocked','prepared profile edit refused');
    const credential = await account.changePassword({accountId:id,expectedRevision:source.revision,
      currentPassword:password,newPassword:'changed-password',confirmPassword:'changed-password'});
    check(credential.status==='blocked','prepared credential edit refused');
    const legacy = await new CleanEpochLegacyActionAdapter(counted).apply({accountId:id,
      expectedRevision:source.revision,expectedProfile:source.profile,
      action:{kind:'purchase',unlockId:'legacy.unlock.lineage.prepared_lineage',recordedAt:new Date().toISOString()}});
    check(legacy.status==='blocked',`prepared Legacy edit refused: ${JSON.stringify(legacy)}`);
    check(writes===0 && await rows(id)===before,'all prepared refusals prewrite and exact bytes');
    counted.close();
    step('C1 accepted-pending first publication also fences profile, credential and Legacy edits');
    let publicationTx: IDBTransaction | null=null;
    const interrupted=await openCleanEpochAccountStore({name,beforeWrite:tx=>{
      if(!publicationTx) publicationTx=tx;
      else if(tx!==publicationTx) throw Error('Synthetic first consumer write interruption');
    }});
    const pendingResult=await new CleanEpochFirstCampaignAdapter(interrupted).resume(id,'slot-1');
    check(pendingResult.status==='blocked','first consumer interruption retained accepted publication');
    interrupted.close();
    const accepted=await owner.readRecovery(id,'slot-1');
    check(accepted?.status==='accepted_pending_consumers','accepted pending recovery read back');
    const acceptedBefore=await rows(id);
    writes=0;
    const pendingCounted=await openCleanEpochAccountStore({name,beforeWrite:()=>{writes++;}});
    const pendingAdapter=new CleanEpochAccountAdapter(pendingCounted);
    const pendingSource=(await owner.readSelected(id))!;
    check((await pendingAdapter.updateProfile(id,pendingSource.revision,
      {...pendingSource.profile,displayName:'Blocked pending edit'})).status==='blocked',
      'accepted pending profile edit refused');
    check((await pendingAdapter.changePassword({accountId:id,expectedRevision:pendingSource.revision,
      currentPassword:password,newPassword:'changed-password',confirmPassword:'changed-password'})).status==='blocked',
      'accepted pending credential edit refused');
    check((await new CleanEpochLegacyActionAdapter(pendingCounted).apply({accountId:id,
      expectedRevision:pendingSource.revision,expectedProfile:pendingSource.profile,
      action:{kind:'purchase',unlockId:'legacy.unlock.lineage.prepared_lineage',recordedAt:new Date().toISOString()}})).status==='blocked',
      'accepted pending Legacy edit refused');
    check(writes===0&&await rows(id)===acceptedBefore,'accepted pending fences prewrite with exact bytes');
    pendingCounted.close();
    step('D2 newer independently published head blocks captured old retirement');
    const completed = await new CleanEpochFirstCampaignAdapter(owner).resume(id,'slot-1');
    check(completed.status==='ready','first publication completed');
    const old = await owner.readSlot(id,'slot-1'); check(old.status==='ready','old ready source');
    const prior = (await owner.readSelected(id))!;
    const oldControl = old.loaded.sessionControl;
    const request = {accountId:id,sourceSlotId:'slot-1' as const,expectedAccountRevision:prior.revision,
      snapshot:old.loaded.snapshot,control:oldControl,
      expectedSourceAddress:{artifactId:oldControl.loadedArtifactId,publicationId:oldControl.loadedPublicationId}};
    const next = await new CleanEpochDescendantAdapter(second).save({accountId:id,sourceSlotId:'slot-1',
      destinationSlotId:'slot-1',expectedDestinationAddress:request.expectedSourceAddress,
      expectedAccountRevision:prior.revision,snapshot:old.loaded.snapshot,control:oldControl});
    check(next.status==='ready','independent newer ordinary head');
    const newerBytes = await rows(id);
    writes=0;
    const staleOwner = await openCleanEpochAccountStore({name,beforeWrite:()=>{writes++;}});
    const stale = await new CleanEpochTerminalAdapter(staleOwner).retire(request);
    check(stale.status==='blocked' && stale.code==='stale_head','old terminal source blocks after newer head');
    check(writes===0 && await rows(id)===newerBytes,'stale terminal cannot rewind newer graph');
    staleOwner.close();
    check(await rows(otherId)===otherBefore,'other account stable');
    step('E1/X2 historical exact address receipt survives same-campaign slot reoccupation');
    const moved = await owner.readSlot(id,'slot-1'); check(moved.status==='ready','new head ready');
    const moveControl = moved.loaded.sessionControl;
    const copied = await new CleanEpochDescendantAdapter(second).save({accountId:id,
      sourceSlotId:'slot-1',destinationSlotId:'slot-2',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:moved.loaded.snapshot,control:moveControl});
    check(copied.status==='ready','same campaign addressed in second slot');
    const priorPointer = await owner.readSlotGeneration(id,'slot-1');
    check(priorPointer?.status==='published','old slot generation published');
    const oldAddress = {artifactId:moveControl.loadedArtifactId,publicationId:moveControl.loadedPublicationId};
    const deleteInput = {accountId:id,slotId:'slot-1' as const,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      expectedSlotGenerationId:priorPointer.slotGenerationId,expectedAddress:oldAddress,
      deletedAt:new Date().toISOString()};
    const deleted = await owner.deleteSlotAddress(deleteInput);
    check(deleted.status==='committed' && (await owner.readSlot(id,'slot-1')).status==='empty',
      'one selected address deleted');
    const surviving = await owner.readSlot(id,'slot-2'); check(surviving.status==='ready','second address survives');
    const renewed = await new CleanEpochDescendantAdapter(second).save({accountId:id,
      sourceSlotId:'slot-2',destinationSlotId:'slot-1',expectedDestinationAddress:null,
      expectedAccountRevision:(await owner.readSelected(id))!.revision,
      snapshot:surviving.loaded.snapshot,control:surviving.loaded.sessionControl});
    check(renewed.status==='ready','same campaign reoccupied old physical slot');
    const occupant = await owner.readSlot(id,'slot-1'); check(occupant.status==='ready','new occupant ready');
    const occupantBefore = await rows(id);
    const exact = await owner.deleteSlotAddress(deleteInput);
    check(exact.status==='same_source_retry' && exact.receipt.slotGenerationId===priorPointer.slotGenerationId,
      'historical exact deletion receipt returned');
    check(await rows(id)===occupantBefore,'old receipt did not disturb reoccupied generation');
    let changedRejected=false;
    try { await owner.deleteSlotAddress({...deleteInput,deletedAt:new Date(Date.now()+60000).toISOString()}); }
    catch { changedRejected=true; }
    check(changedRejected && await rows(id)===occupantBefore,'changed old request conflicts without write');
    check(await rows(otherId)===otherBefore,'historical retry left other account fixed');
    step('D1 positive earned progression payout through production descendant and terminal adapters');
    const payoutId=`account.local.residual.payout.${crypto.randomUUID()}`;
    check((await adapter.register({accountId:payoutId,displayName:'Synthetic earned-depth account',
      password,confirmPassword:password,stayLoggedIn:false})).status==='ready','payout subject registered');
    const payoutFirst=await new CleanEpochFirstCampaignAdapter(owner).start(payoutId,form(),false);
    check(payoutFirst.status==='ready','payout source first campaign');
    const payoutLoaded=await owner.readSlot(payoutId,'slot-1');check(payoutLoaded.status==='ready','payout first ready');
    const progression=payoutLoaded.loaded.snapshot.playerState.progression;
    const earnedSnapshot={...payoutLoaded.loaded.snapshot,playerState:{...payoutLoaded.loaded.snapshot.playerState,
      progression:{...progression,level:progression.level+3}}};
    const earnedSaved=await new CleanEpochDescendantAdapter(second).save({accountId:payoutId,
      sourceSlotId:'slot-1',destinationSlotId:'slot-1',
      expectedAccountRevision:(await owner.readSelected(payoutId))!.revision,
      snapshot:earnedSnapshot,control:payoutLoaded.loaded.sessionControl});
    check(earnedSaved.status==='ready',`synthetic earned progression publication: ${JSON.stringify(earnedSaved)}`);
    const payoutSource=await owner.readSlot(payoutId,'slot-1');check(payoutSource.status==='ready','earned head ready');
    const payoutControl=payoutSource.loaded.sessionControl;
    const retired=await new CleanEpochTerminalAdapter(owner).retire({accountId:payoutId,
      sourceSlotId:'slot-1',expectedAccountRevision:(await owner.readSelected(payoutId))!.revision,
      snapshot:payoutSource.loaded.snapshot,control:payoutControl,
      expectedSourceAddress:{artifactId:payoutControl.loadedArtifactId,publicationId:payoutControl.loadedPublicationId}});
    check(retired.status==='completed',`positive terminal settlement ${JSON.stringify(retired)}`);
    check(!!retired.recovery.payoutTransactionId,'positive earned payout has one transaction');
    const payoutRun=retired.account.profile.history.runRecords.find(r=>r.characterId===payoutSource.loaded.snapshot.playerState.playerId);
    check((payoutRun?.legacyGranted??0)>0 && payoutRun?.payoutEligible===true,
      'positive earned payout read back on exact archived run');
    check(retired.account.profile.legacy.legacyTransactions.filter(t=>t.id===retired.recovery.payoutTransactionId).length===1,
      'positive payout transaction unique');
    check(await rows(otherId)===otherBefore,'positive payout left other account fixed');
  } finally { second.close(); owner.close(); }
}
main().then(()=>output.textContent=`PASS ${assertions} independent residual assertions\n${steps.join('\n')}`)
  .catch(error=>output.textContent=`FAIL ${assertions}: ${error instanceof Error?error.stack:error}\n${steps.join('\n')}`);
