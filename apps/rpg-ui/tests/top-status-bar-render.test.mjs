import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('top bar presents owner resources and only meaningful condition alerts', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ TopStatusBar, TopConditionDetails }, { getResourceFillPercent }, { GameSessionProvider }, { useUiViewModel }, { demoSnapshot }, { createDefaultAccountProfileState }] = await Promise.all([
      vite.ssrLoadModule('/src/components/TopStatusBar.tsx'),
      vite.ssrLoadModule('/src/components/ui/TopResourceMeter.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/src/runtime/UiViewModelContext.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts')
    ]);
    let ownerMeters;
    const renderBar = (conditionStrip, meters, settingsOpen = false) => {
      function Probe() {
        const viewModel = useUiViewModel();
        ownerMeters = viewModel.topBarMeters;
        return React.createElement(TopStatusBar, {
          ...viewModel.topBar,
          conditionStrip: conditionStrip ?? viewModel.topBar.conditionStrip,
          meters: meters ?? ownerMeters,
          readinessCard: viewModel.character.readinessCard,
          notifications: viewModel.notifications,
          settingsOpen,
          onToggleSettings: () => {},
          settingsContent: React.createElement('button', null, 'Save controls test')
        });
      }
      return renderToStaticMarkup(React.createElement(GameSessionProvider, {
        accountProfile: createDefaultAccountProfileState(),
        snapshot: demoSnapshot,
        campaignSessionControl: {},
        onSnapshotChange: () => {}
      }, React.createElement(Probe)));
    };
    const normal = { primary: [], secondary: [], collapsedLabel: 'Condition: Stable', expandedByDefault: false };
    const html = renderBar(normal);
    assert.doesNotMatch(html, /Condition: Stable|forged-meter|Carbs|Fat reserve|Protein reserve/);
    assert.equal((html.match(/role="meter"/g) ?? []).length, 3);
    assert.doesNotMatch(html, /overflow-x-auto/, 'top resources must not introduce a horizontal scrollbar');
    assert.match(html, /aria-label="Character resources"[^>]*><div[^>]*grid-template-columns:minmax\(0, 1fr\)/);
    assert.match(html, /aria-label="Stamina">ST/);
    for (const meter of ownerMeters) {
      assert.match(html, new RegExp(`${meter.label}.*?${meter.current} / ${meter.max}`, 's'));
      assert.match(html, new RegExp(`aria-label="${meter.label}"`));
    }
    assert.match(html, /Open calendar and climate context/);
    assert.match(html, /Open settings/);

    const active = {
      ...normal,
      primary: [{ id: 'hydration', label: 'Thirsty', severity: 'warning', tooltip: 'Water needed', trend: 'declining' }],
      secondary: [{ id: 'fatigue', label: 'Exhausted', severity: 'critical', tooltip: 'Rest needed', trend: 'declining' }],
      expandedByDefault: true
    };
    const alertHtml = renderBar(active, undefined, true);
    assert.match(alertHtml, /Thirsty/);
    assert.match(alertHtml, /Exhausted/);
    assert.match(alertHtml, /warning/i);
    assert.match(alertHtml, /critical/i);
    assert.match(alertHtml, /Save controls test/);
    assert.doesNotMatch(alertHtml, /Condition: Stable/);
    const detailHtml = renderToStaticMarkup(React.createElement(TopConditionDetails, { strip: active }));
    assert.match(detailHtml, /Thirsty/);
    assert.match(detailHtml, /Water needed/);
    assert.match(detailHtml, /warning · declining/);
    assert.match(detailHtml, /Exhausted/);
    assert.match(detailHtml, /Rest needed/);
    assert.equal(getResourceFillPercent(0, 0), 0);
    assert.equal(getResourceFillPercent(150, 100), 100);
    assert.equal(getResourceFillPercent(-5, 100), 0);
    assert.equal(getResourceFillPercent(25, 100), 25);
    const edgeHtml = renderBar(normal, [
      { label: 'HP', current: 0, max: 0, color: 'var(--color-hp-fill)' },
      { label: 'MP', current: 999, max: 100, color: 'var(--color-mp-fill)' },
      { label: 'Stamina', current: -5, max: 100, color: 'var(--color-stamina-fill)', visualState: 'warning' }
    ]);
    assert.equal((edgeHtml.match(/role="meter"/g) ?? []).length, 2);
    assert.match(edgeHtml, /role="group" aria-label="HP"/);
    assert.match(edgeHtml, /0 \/ 0/);
    assert.match(edgeHtml, /999 \/ 100/);
    assert.match(edgeHtml, /data-visual-state="warning"/);
    assert.match(edgeHtml, /width:100%/);
  } finally {
    await vite.close();
  }
});
