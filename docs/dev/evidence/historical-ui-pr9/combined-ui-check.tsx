import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState } from '../../../packages/engines/game-engine/src/legacy-account';
import { createCampaignSessionControl } from '../../../packages/engines/game-engine/src/campaign-session';
import { createDefaultPlayerBodyState, resolveBodyState } from '../../../packages/engines/player-engine/src/body-state';
import type { SaveSnapshot } from '../../../packages/shared/types/src/index';
import { InGameShell } from '../src/game-shell/InGameShell';
import { demoSnapshot } from '../src/runtime/demoSnapshot';
import '../src/index.css';

const accountProfile = createDefaultAccountProfileState({ accountId: demoSnapshot.accountId });
const makeControl = (snapshot: SaveSnapshot) => createCampaignSessionControl({
  accountId: snapshot.accountId,
  campaignId: 'campaign.combined_fixture',
  artifactId: 'artifact.combined_fixture',
  publicationId: 'publication.combined_fixture',
  artifactRevision: 1,
  continuityId: 'continuity.combined_fixture',
  headArtifactId: 'artifact.combined_fixture',
  headRevision: 1
});

function Fixture() {
  const [snapshot, setSnapshot] = useState<SaveSnapshot>(() => structuredClone(demoSnapshot));
  const [control, setControl] = useState(() => makeControl(demoSnapshot));
  const [saveCount, setSaveCount] = useState(0);
  const [quickSaveCount, setQuickSaveCount] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [notice, setNotice] = useState<null>(null);
  const warning = () => setSnapshot((current) => {
    const next = structuredClone(current);
    next.playerState.bodyState.hydrationLevel = 18;
    next.playerState.bodyState.resolved = resolveBodyState(next.playerState.bodyState, next.playerState.coreData.lineageId, next.gameState.runDifficulty);
    return next;
  });
  const normal = () => setSnapshot((current) => ({
    ...current,
    playerState: {
      ...current.playerState,
      bodyState: createDefaultPlayerBodyState({ tick: current.clock.tick, day: current.clock.day, lineageId: current.playerState.coreData.lineageId, runDifficulty: current.gameState.runDifficulty })
    }
  }));
  const longName = () => setSnapshot((current) => ({
    ...current,
    playerState: { ...current.playerState, coreData: { ...current.playerState.coreData, playerName: 'Arden Voss of the Western Marches and the Long Northern Road' } }
  }));
  return <>
    {controlsVisible && <div id="fixture-controls" style={{ position: 'fixed', right: 4, bottom: 4, zIndex: 200, display: 'flex', gap: 4, padding: 4, background: '#202823', color: '#fff', fontSize: 12 }}>
      <button onClick={normal}>Normal state</button><button onClick={warning}>Fixture warning</button><button onClick={longName}>Long name</button>
      <button onClick={() => { setSnapshot(structuredClone(demoSnapshot)); setControl(makeControl(demoSnapshot)); }}>Reset</button>
      <span>Save {saveCount} / Quick {quickSaveCount}</span>
      <button onClick={() => setControlsVisible(false)}>Hide fixture controls</button>
    </div>}
    <InGameShell accountProfile={accountProfile} snapshot={snapshot} campaignSessionControl={control}
      slots={[]} activeSlotId={'slot.fixture'} hasUnsavedChanges={true} notice={notice} onDismissNotice={() => setNotice(null)}
      onSnapshotChange={(next, nextControl) => { setSnapshot(next); setControl(nextControl); }}
      onSave={() => setSaveCount((value) => value + 1)} onQuickSave={() => setQuickSaveCount((value) => value + 1)}
      onRetireCharacter={() => {}} onReturnToMainMenu={() => {}} />
  </>;
}

createRoot(document.getElementById('root')!).render(<Fixture />);
