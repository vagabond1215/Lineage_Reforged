import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('Codex Atlas presents the current character geographic knowledge without inventing map data', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ CodexPanel }, { GameSessionProvider }, { useUiViewModel }, { demoSnapshot }, { createDefaultAccountProfileState }] = await Promise.all([
      vite.ssrLoadModule('/src/features/CodexPanel.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/src/runtime/UiViewModelContext.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts')
    ]);
    const renderAtlas = (snapshot) => {
      let viewModel;
      const html = renderToStaticMarkup(React.createElement(GameSessionProvider, {
        accountProfile: createDefaultAccountProfileState(),
        snapshot,
        campaignSessionControl: {},
        onSnapshotChange: () => {}
      }, React.createElement(() => {
        viewModel = useUiViewModel();
        return React.createElement(CodexPanel, {
          accent: 'var(--color-codex)', searchQuery: '', pinnedIds: [], onTogglePin: () => {}, initialSection: 'atlas'
        });
      })));
      return { html, viewModel };
    };

    const before = JSON.stringify(demoSnapshot);
    const { html, viewModel } = renderAtlas(demoSnapshot);
    assert.equal(JSON.stringify(demoSnapshot), before);
    const atlas = viewModel.codex.sections.find((section) => section.id === 'atlas');
    assert.equal(atlas?.label, 'Atlas');
    assert.equal(atlas?.count, viewModel.character.lists.geographicKnowledge.length);
    assert.ok(atlas.count > 0);
    assert.match(html, /Known Lands/);
    assert.match(html, /Known Regions/);
    assert.match(html, /Known Settlements/);
    assert.doesNotMatch(html, /Geographic Knowledge Standards|Runtime Source|Projection Ref/);
    assert.doesNotMatch(html, /World Map|travel command|Explore Map/);

    const hidden = structuredClone(demoSnapshot);
    hidden.playerState.geographicKnowledge = hidden.playerState.geographicKnowledge.map((entry) => ({ ...entry, level: 0 }));
    const sparse = renderAtlas(hidden);
    assert.equal(sparse.viewModel.codex.sections.find((section) => section.id === 'atlas')?.count, 0);
    assert.match(sparse.html, /No known places match the active search/);
    assert.doesNotMatch(sparse.html, /Known Lands reflect broad awareness/);
  } finally {
    await vite.close();
  }
});
