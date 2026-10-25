import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';

test('top bar presents owner resources and only meaningful condition alerts', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ TopStatusBar, TopConditionDetails }, { getResourceFillPercent }, { GameSessionProvider }, { useUiViewModel }, { demoSnapshot }, { createDefaultAccountProfileState }, { createBodyStatePresentationSnapshot }] = await Promise.all([
      vite.ssrLoadModule('/src/components/TopStatusBar.tsx'),
      vite.ssrLoadModule('/src/components/ui/TopResourceMeter.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/src/runtime/UiViewModelContext.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts'),
      vite.ssrLoadModule('/src/runtime/bodyStatePresentation.ts')
    ]);
    const bodyState = createBodyStatePresentationSnapshot(demoSnapshot);
    let ownerMeters;
    const renderBar = (conditionStrip, meters, settingsOpen = false, body = bodyState) => {
      function Probe() {
        const viewModel = useUiViewModel();
        ownerMeters = viewModel.topBarMeters;
        return React.createElement(TopStatusBar, {
          ...viewModel.topBar,
          conditionStrip: conditionStrip ?? viewModel.topBar.conditionStrip,
          meters: meters ?? ownerMeters,
          readinessCard: viewModel.character.readinessCard,
          bodyState: body,
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
    assert.doesNotMatch(html, /Condition: Stable|forged-meter|Fat reserve|Protein reserve/);
    assert.equal((html.match(/role="meter"/g) ?? []).length, 4);
    assert.doesNotMatch(html, /overflow-x-auto/, 'top resources must not introduce a horizontal scrollbar');
    assert.match(html, /class="top-status-layout"/);
    assert.match(html, /class="top-status-calendar/);
    assert.doesNotMatch(html, /Arden Voss/);
    assert.match(html, /src="\/seasons\/season-withering\.png"/);
    assert.match(html, /class="top-status-resources/);
    assert.match(html, /aria-label="Energy and hydration"/);
    assert.match(html, /aria-label="Illustrative energy balance with zero at the center; not tracked gameplay data"/);
    assert.match(html, new RegExp(`aria-label="Tracked energy ${Math.round(bodyState.values.energy)} of 100"`));
    assert.match(html, /class="nutrition-preview-zero-line"/);
    assert.match(html, /Protein, carbs and fat bars are a visual prototype, not tracked reserves/);
    assert.match(html, /PREVIEW/);
    assert.match(html, /Protein illustrative preview/);
    assert.match(html, /Carbs illustrative preview/);
    assert.match(html, /Fat illustrative preview/);
    assert.doesNotMatch(html, /aria-label="(?:Protein|Carbs|Fat)"[^>]*aria-valuenow/);
    assert.match(html, new RegExp(`aria-label="Water"[^>]*aria-valuenow="${bodyState.values.hydration}"`));
    assert.match(html, /Current weather is unavailable/);
    assert.match(html, /Weather unavailable/);
    assert.match(html, /class="top-status-controls/);
    assert.match(html, /aria-label="Character resources"[^>]*><div[^>]*grid-template-columns:minmax\(0, 1fr\)/);
    assert.match(html, /aria-label="Stamina">ST<\/span>/);
    assert.doesNotMatch(html, /warning resource level/, 'Stamina warning stays in meter accessibility text and condition alerts');
    const layoutStyles = readFileSync(new URL('../src/components/top-status-layout.css', import.meta.url), 'utf8');
    assert.match(layoutStyles, /--color-hp-fill:\s*#c33b50/);
    assert.match(layoutStyles, /--color-mp-fill:\s*#397ecb/);
    assert.match(layoutStyles, /--color-stamina-fill:\s*#2ca779/);
    assert.match(layoutStyles, /\.nutrition-preview\s*\{[^}]*height:\s*2\.5rem/s);
    assert.match(layoutStyles, /\.top-status-resources > div\s*\{[^}]*17rem/s);
    assert.match(layoutStyles, /\.nutrition-preview\s*\{[^}]*width:\s*min\(100%, 17rem\)/s);
    assert.match(layoutStyles, /\.nutrition-preview\s*\{[^}]*grid-template-columns:\s*3\.25rem minmax\(0, 1fr\) 4\.25rem/s);
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
    const dryHtml = renderBar(normal, undefined, false, {
      ...bodyState,
      values: { ...bodyState.values, hydration: 25 },
      labels: { ...bodyState.labels, hydration: 'Severe Dehydration' }
    });
    assert.match(dryHtml, /class="nutrition-preview-water severe"[^>]*aria-valuenow="25"/);
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
      { label: 'MP', current: 999, max: 100, color: 'var(--color-mp-fill)', visualState: 'warning' },
      { label: 'Stamina', current: -5, max: 100, color: 'var(--color-stamina-fill)', visualState: 'warning' }
    ]);
    assert.equal((edgeHtml.match(/role="meter"/g) ?? []).length, 3);
    assert.match(edgeHtml, /role="group" aria-label="HP"/);
    assert.match(edgeHtml, /0 \/ 0/);
    assert.match(edgeHtml, /999 \/ 100/);
    assert.match(edgeHtml, /data-visual-state="warning"/);
    assert.match(edgeHtml, /warning resource level/, 'Other resource warnings retain their existing visual marker');
    assert.doesNotMatch(edgeHtml, /aria-label="Stamina">ST<span/, 'Stamina does not append an exclamation mark');
    assert.match(edgeHtml, /width:100%/);
  } finally {
    await vite.close();
  }
});
