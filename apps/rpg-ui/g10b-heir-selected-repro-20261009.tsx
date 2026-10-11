import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions,
  createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions,
  getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { retainRetiredRun, resolveEligibleHeirSources,
  resolveRunHistorySourceId } from './src/game-shell/runLifecycle.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const target = document.querySelector<HTMLDivElement>('#root')!;
let assertions = 0;
function check(value: unknown, label: string): asserts value {
  assertions++;
  if (!value) throw Error(label);
}
async function until<T>(read: () => T | null, label: string): Promise<T> {
  for (let index = 0; index < 240; index++) {
    const value = read(); if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out: ${label}; ${target.innerText.slice(0, 300)}`);
}
function form() {
  const initial = createDefaultCharacterCreationFormState('slot-1');
  const identity = getLineageIdentityCatalog(initial.lineageId)!;
  const bundle = startingBundleOptions[0]!;
  const continent = getWorldContinentOptions()[0]!;
  const region = getWorldRegionOptions(continent.id)[0]!;
  const settlement = getWorldSettlementOptions({ continentId: continent.id, regionId: region.id, backstoryId: '' })[0]!;
  return { ...initial, playerName: 'Synthetic Eligible Source',
    hairColorId: identity.hairColorOptions[0]!.id,
    eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id,
    startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId: continent.id, regionId: region.id, startingSettlementId: settlement.id };
}
async function main() {
  const owner = await openCleanEpochAccountStore();
  const accountId = `account.local.g10b.heir.${crypto.randomUUID()}`;
  try {
    const password = 'synthetic-eligible-source-password';
    const unrelatedId = `account.local.g10b.unrelated.${crypto.randomUUID()}`;
    const unrelated = await new CleanEpochAccountAdapter(owner).register({ accountId: unrelatedId,
      displayName: `Unrelated ${unrelatedId.slice(-6)}`, password, confirmPassword: password, stayLoggedIn: true });
    check(unrelated.status === 'ready', 'synthetic unrelated account registration');
    const unrelatedBefore = JSON.stringify(await owner.readSelected(unrelatedId));
    const account = await new CleanEpochAccountAdapter(owner).register({ accountId,
      displayName: `Eligible ${accountId.slice(-6)}`, password, confirmPassword: password, stayLoggedIn: true });
    check(account.status === 'ready', `synthetic target registration: ${account.message}`);
    const campaign = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form(), false);
    check(campaign.status === 'ready', `synthetic first campaign: ${campaign.message}`);
    const prior = await owner.readSelected(accountId);
    check(prior, 'synthetic target account exists');
    const retained = retainRetiredRun({ accountId, accountProfile: prior.profile,
      snapshot: campaign.value.loaded.snapshot, fallbackSlotId: 'slot-1',
      inheritanceUsesRemaining: 1, recordedAt: new Date().toISOString() });
    const updated = await owner.updateProfile(accountId, prior.revision, retained.accountProfile);
    check(updated.status === 'committed', 'synthetic eligible source retained by production account CAS');
    const source = resolveEligibleHeirSources(updated.readback.profile);
    check(source.length === 1, 'exactly one synthetic eligible retired source');
    const sourceId = resolveRunHistorySourceId(source[0]!);
    check(sourceId.length > 0 && source[0]!.outcome === 'retired' &&
      source[0]!.inheritanceUsesRemaining === 1, 'exact source identity and eligible policy');
    const initialTarget = JSON.stringify(await owner.readSelected(accountId));
    let root = createRoot(target);
    root.render(<App />);
    const openCreator = async () => {
      const slot = await until(() => [...target.querySelectorAll<HTMLElement>('.launcher-save-row')]
        .find(item => item.textContent?.trim().startsWith('2')) ?? null, 'selected empty second slot');
      slot.click();
      await until(() => target.innerText.includes('Forge A New Character') ? true : null, 'selected creator');
      const randomize = await until(() => [...target.querySelectorAll<HTMLButtonElement>('button')]
        .find(item => item.textContent?.trim() === 'Randomize Character') ?? null,
      'creator randomize control');
      for (let attempt = 0; attempt < 30; attempt++) {
        randomize.click();
        await new Promise(resolve => setTimeout(resolve, 0));
        if ([...target.querySelectorAll('button')].some(item => /\dFinalize/.test(item.textContent ?? ''))) break;
      }
      const finalize = await until(() => [...target.querySelectorAll<HTMLButtonElement>('button')]
        .find(item => /\dFinalize/.test(item.textContent ?? '')) ?? null, 'complete creator Finalize');
      finalize.click();
      await until(() => [...target.querySelectorAll('button')].some(item => item.textContent?.includes('Begin Journey'))
        ? true : null, 'creator Finalize screen');
    };
    const heirButton = () => [...target.querySelectorAll<HTMLButtonElement>('button')]
      .find(item => item.textContent?.trim() === 'Heir Start') ?? null;
    const returnMenu = async () => {
      const back = [...target.querySelectorAll<HTMLButtonElement>('button')]
        .find(item => item.title === 'Return to main menu');
      check(back, 'creator return action');
      back.click();
      await until(() => target.querySelector('.launcher-save-row') ? true : null, 'epoch menu readback');
    };
    const replaceSource = async (outcome: 'retired' | 'archived', uses: number) => {
      const read = await owner.readSelected(accountId);
      check(read, 'target profile before policy case');
      const profile = { ...read.profile, history: { ...read.profile.history,
        runRecords: read.profile.history.runRecords.map(record =>
          resolveRunHistorySourceId(record) === sourceId
            ? { ...record, outcome, inheritanceUsesRemaining: uses } : record) } };
      const result = await owner.updateProfile(accountId, read.revision, profile);
      check(result.status === 'committed', `synthetic ${outcome}/${uses} policy profile CAS`);
      return result.readback.profile;
    };

    await openCreator();
    check(heirButton(), 'eligible source presents Heir Start in mounted default App');
    heirButton()!.click();
    await until(() => target.innerText.includes(`Selected source: ${source[0]!.name}`) ? true : null,
      'exact source selected in creator');
    check(target.innerText.includes('1 use left'), 'selected source displays retained use');
    check(JSON.stringify(await owner.readSelected(accountId)) === initialTarget,
      'source selection makes no account/campaign write before accepted action');
    check(JSON.stringify(await owner.readSelected(unrelatedId)) === unrelatedBefore,
      'unrelated account unchanged after source selection');

    await returnMenu();
    check(resolveEligibleHeirSources(await replaceSource('retired', 0)).length === 0,
      'zero-use retired source is ineligible');
    await openCreator();
    check(!heirButton(), 'zero-use profile hides Heir Start in selected creator');
    await returnMenu();
    check(resolveEligibleHeirSources(await replaceSource('archived', 1)).length === 0,
      'archived source remains ineligible despite a use');
    await openCreator();
    check(!heirButton(), 'archived profile hides Heir Start in selected creator');
    await returnMenu();
    check(resolveEligibleHeirSources(await replaceSource('retired', 1)).length === 1,
      'restored synthetic eligible source resolves');
    root.unmount();
    root = createRoot(target);
    root.render(<App />);
    await openCreator();
    check(heirButton(), 'restart reads eligible source from epoch account authority');
    heirButton()!.click();
    await until(() => target.innerText.includes(`Selected source: ${source[0]!.name}`) ? true : null,
      'restarted creator binds selected source');
    check(resolveEligibleHeirSources((await owner.readSelected(accountId))!.profile).length === 1,
      'retained source remains eligible before accepted campaign action');
    check(JSON.stringify(await owner.readSelected(unrelatedId)) === unrelatedBefore,
      'unrelated account stable after negative cases and restart');
    const begin = [...target.querySelectorAll<HTMLButtonElement>('button')]
      .find(item => item.textContent?.trim() === 'Begin Journey');
    check(begin, 'selected heir campaign action available');
    begin.click();
    await until(() => target.innerText.includes('Campaign Ready') ? true : null,
      'accepted selected heir campaign readback');
    const heirSlot = await owner.readSlot(accountId, 'slot-2');
    check(heirSlot.status === 'ready' && heirSlot.loaded.snapshot.playerState.saveMeta.sourceRunId === sourceId,
      'accepted heir campaign binds exact source ID');
    check(JSON.stringify(await owner.readSelected(unrelatedId)) === unrelatedBefore,
      'unrelated account stable after accepted heir campaign');
    output.textContent = `PASS ${assertions}/${assertions}: synthetic eligible source presented and exact source ID bound; zero-use/archived hidden; restart and unrelated account stable. Ordinary retirement eligibility remains unproven.`;
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL: ${error instanceof Error ? error.stack : error}`);
