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
import { retainRetiredRun, resolveEligibleHeirSources } from './src/game-shell/runLifecycle.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const target = document.querySelector<HTMLDivElement>('#root')!;
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
    const account = await new CleanEpochAccountAdapter(owner).register({ accountId,
      displayName: `Eligible ${accountId.slice(-6)}`, password, confirmPassword: password, stayLoggedIn: true });
    if (account.status !== 'ready') throw Error(`Synthetic registration: ${account.message}`);
    const campaign = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form(), false);
    if (campaign.status !== 'ready') throw Error(`Synthetic first campaign: ${campaign.message}`);
    const prior = await owner.readSelected(accountId);
    if (!prior) throw Error('Synthetic account missing');
    const retained = retainRetiredRun({ accountId, accountProfile: prior.profile,
      snapshot: campaign.value.loaded.snapshot, fallbackSlotId: 'slot-1',
      inheritanceUsesRemaining: 1, recordedAt: new Date().toISOString() });
    const updated = await owner.updateProfile(accountId, prior.revision, retained.accountProfile);
    if (updated.status !== 'committed' || resolveEligibleHeirSources(updated.readback.profile).length !== 1)
      throw Error('Synthetic eligible source was not retained by production account CAS');
    createRoot(target).render(<App />);
    const slot = await until(() => [...target.querySelectorAll<HTMLElement>('.launcher-save-row')]
      .find(item => item.textContent?.trim().startsWith('2')) ?? null, 'selected empty second slot');
    slot.click();
    await until(() => target.innerText.includes('Forge A New Character') ? true : null, 'selected creator');
    const heirControl = [...target.querySelectorAll('button')]
      .find(item => item.textContent?.trim() === 'Heir Start');
    if (heirControl) throw Error('Unexpected: selected creator presented eligible source');
    output.textContent = 'REPRO: production account resolver returned one eligible source, but mounted default App creator has no Heir Start control. Eligibility fixture is synthetic; ordinary retirement grants zero uses.';
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL: ${error instanceof Error ? error.stack : error}`);
