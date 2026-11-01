import { useState } from 'react';
import type { NativeFreshCampaignSnapshot } from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { AppLayout } from '../components/layout/AppLayout.js';
import { SideNav } from '../components/SideNav.js';
import { TopResourceMeter } from '../components/ui/TopResourceMeter.js';
import { NativeCharacterPanel } from '../features/NativeCharacterPanel.js';
import { NativeSelectedCandidatePanel, type NativeCandidateAction } from './NativeSelectedCandidatePanel.js';
import type { NavItem, TabId } from '../types.js';

const reviewDestinations: NavItem[] = [
  { id: 'character', label: 'Character', icon: 'character', accent: 'var(--color-character)', hint: 'Inspect native character' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory', accent: 'var(--color-character)', hint: 'Inspect native inventory' }
];
const candidateDestinations: NavItem[] = [
  ...reviewDestinations,
  { id: 'world', label: 'World', icon: 'world', accent: 'var(--color-character)', hint: 'Travel' },
  { id: 'quests', label: 'Quests', icon: 'quests', accent: 'var(--color-character)', hint: 'Quest journal' },
  { id: 'activity', label: 'Activity', icon: 'activity', accent: 'var(--color-character)', hint: 'Nearby activity' }
];

/** Default selected review remains read-only; local QA can bind the candidate owner route. */
export function NativeCharacterReviewShell({ snapshot, onReturnToMainMenu,
  control, onSnapshotChange, onSave, onQuickSave, onNativeAction, onRetireCharacter }: {
  snapshot: NativeFreshCampaignSnapshot;
  onReturnToMainMenu: () => void;
  control?: CampaignSessionControl<NativeFreshCampaignSnapshot>;
  onSnapshotChange?: (snapshot: NativeFreshCampaignSnapshot,
    control: CampaignSessionControl<NativeFreshCampaignSnapshot>) => void;
  onSave?: () => void;
  onQuickSave?: () => void;
  onNativeAction?: (action: NativeCandidateAction) => void;
  onRetireCharacter?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'character' | 'inventory' | 'world' | 'quests' | 'activity'>('character');
  const resources = snapshot.playerState.resources;
  const meters = [
    { label: 'HP', current: resources.hp.current, max: resources.hp.max, color: 'var(--color-hp-fill)' },
    { label: 'MP', current: resources.mp.current, max: resources.mp.max, color: 'var(--color-mp-fill)' },
    { label: 'ST', current: resources.stamina.current, max: resources.stamina.max, color: 'var(--color-stamina-fill)' }
  ];
  const candidate = !!control && !!onSnapshotChange && !!onSave && !!onNativeAction;
  return <div className="h-screen overflow-hidden" data-native-review="true"
    data-native-candidate={candidate ? 'true' : 'false'}>
    <AppLayout
      topBar={<header className="border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-shell-bar-bg)] px-3 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <strong>{snapshot.playerState.coreData.playerName}</strong>
            <span className="ml-2 text-xs text-[color:var(--color-text-secondary)]">Day {snapshot.clock.day} · {snapshot.clock.season}</span>
          </div>
          <div className="min-w-[12rem] flex-[2]" role="group" aria-label="Character resources">
            {meters.map(meter => <TopResourceMeter key={meter.label} meter={meter} />)}
          </div>
          <button type="button" onClick={onReturnToMainMenu}
            className="rounded border border-[color:var(--color-border-soft)] px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
            Return to menu
          </button>
          {candidate && <>
            <button type="button" onClick={onSave}
              className="rounded border border-[color:var(--color-border-soft)] px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Save</button>
            <button type="button" onClick={onQuickSave}
              className="rounded border border-[color:var(--color-border-soft)] px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Quick Save</button>
            {onRetireCharacter && <button type="button" onClick={onRetireCharacter}
              className="rounded border border-[color:var(--color-border-soft)] px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Retire Character</button>}
          </>}
        </div>
        <p role="status" className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
          {candidate ? 'Local native v3 candidate under test. Default gameplay activation remains held.' :
            'Native campaign review only. Gameplay actions and Save are held until the full v3 selected route is ready.'}
        </p>
      </header>}
      sideNav={<SideNav items={candidate ? candidateDestinations : reviewDestinations} activeTab={activeTab}
        onChange={(tab: TabId) => {
          if (tab === 'character' || tab === 'inventory' ||
              (candidate && (tab === 'world' || tab === 'quests' || tab === 'activity'))) setActiveTab(tab);
        }} />}
      activePanel={activeTab === 'character' || activeTab === 'inventory'
        ? <NativeCharacterPanel key={activeTab} snapshot={snapshot} mode={activeTab}
            {...(candidate ? { control, onSnapshotChange } : {})} />
        : candidate && onNativeAction
          ? <NativeSelectedCandidatePanel snapshot={snapshot} mode={activeTab} onAction={onNativeAction}
              hasUnpublishedState={control?.hasUnpublishedGameplayState ?? false} />
          : null}
    />
  </div>;
}
