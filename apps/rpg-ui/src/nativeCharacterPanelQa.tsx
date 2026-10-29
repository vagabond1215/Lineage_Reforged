import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createCampaignSessionControl, type CampaignSessionControl } from '../../../packages/engines/game-engine/src/campaign-session.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from '../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { createDefaultAccountProfileState } from '../../../packages/engines/game-engine/src/legacy-account.js';
import type { SaveSnapshot } from '../../../packages/shared/types/src/index.js';
import { createDefaultCharacterCreationFormState } from './game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './game-shell/worldSelectionCatalog.js';
import { createNativeNewGameSnapshot } from './game-shell/nativeNewGameSnapshot.js';
import { NativeCharacterPanel } from './features/NativeCharacterPanel.js';
import { InGameShell } from './game-shell/InGameShell.js';
import './index.css';

const identity = getLineageIdentityCatalog('lineage.human');
const world = getDefaultWorldSelection('backstory.local');
if (!identity?.hairColorOptions[0] || !identity.eyeColorOptions[0] || !identity.skinToneOptions[0])
  throw new Error('QA lineage identity is incomplete.');
const native = createNativeNewGameSnapshot({
  ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Native Panel QA Hunter',
  hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
  skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
  continentId: world.continentId, regionId: world.regionId,
  startingSettlementId: world.settlementId, startingBundleId: 'starting_bundle.hunter',
  startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
}, 'account.native.panel.qa');
if (!isNativeTargetCampaignSnapshot(native) || !native.campaignIdentity || !native.playerState.inventory.bags[0])
  throw new Error('QA native creator result is not admitted.');
native.playerState.inventory.bags[0].stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
const initial = { snapshot: native, control: createCampaignSessionControl({
  accountId: native.accountId, campaignId: native.campaignIdentity.campaignId,
  artifactId: 'artifact.native.panel.qa', publicationId: 'publication.native.panel.qa',
  artifactRevision: 1, continuityId: native.campaignIdentity.continuityId,
  headArtifactId: 'artifact.native.panel.qa', headRevision: 1
}) as CampaignSessionControl<NativeFreshCampaignSnapshot> };

function Qa() {
  const [campaign, setCampaign] = useState(initial);
  const [mode, setMode] = useState<'character' | 'inventory'>('character');
  const bow = campaign.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  const bread = campaign.snapshot.playerState.inventory.bags[0]?.stacks.find(stack => stack.itemId === 'item.bread_loaf');
  return <div className="h-screen bg-[color:var(--color-shell-bg)] text-[color:var(--color-text-primary)]">
    <nav aria-label="QA destinations" className="flex gap-2 p-2">
      <button type="button" onClick={() => setMode('character')}>Character</button>
      <button type="button" onClick={() => setMode('inventory')}>Inventory</button>
    </nav>
    <output id="native-qa-state" data-gear-revision={campaign.snapshot.playerState.gear.revision}
      data-bow-location={bow?.location.kind} data-bread-quantity={bread?.quantity ?? 0}
      data-retained-mutations={campaign.control.retainedMutationResults.length}>
      Owner revision {campaign.snapshot.playerState.gear.revision}
    </output>
    <div className="h-[calc(100%-5rem)]"><NativeCharacterPanel key={mode} mode={mode}
      snapshot={campaign.snapshot} control={campaign.control}
      onSnapshotChange={(snapshot, control) => setCampaign({ snapshot, control })} /></div>
  </div>;
}

function SelectedQa() {
  const [returned, setReturned] = useState(false);
  return <div data-returned={returned}>
    <InGameShell accountProfile={createDefaultAccountProfileState({ accountId: native.accountId })}
      snapshot={native as unknown as SaveSnapshot}
      campaignSessionControl={initial.control as unknown as CampaignSessionControl} slots={[]}
      activeSlotId="slot-1" hasUnsavedChanges={false} notice={null}
      onDismissNotice={() => {}} onSnapshotChange={() => {}}
      onSave={() => {}} onQuickSave={() => {}} onRetireCharacter={() => {}}
      onReturnToMainMenu={() => setReturned(true)} />
  </div>;
}

createRoot(document.getElementById('root')!).render(
  new URLSearchParams(location.search).has('selected') ? <SelectedQa /> : <Qa />);
