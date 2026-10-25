import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';

test('responsive shell retains seven keyboard-reachable gameplay destinations and main panel', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ AppLayout }, { SideNav }] = await Promise.all([
      vite.ssrLoadModule('/src/components/layout/AppLayout.tsx'),
      vite.ssrLoadModule('/src/components/SideNav.tsx')
    ]);
    const ids = ['character', 'inventory', 'world', 'activity', 'codex', 'quests', 'chronicle'];
    const items = ids.map((id) => ({ id, label: id, icon: id, accent: '#a0a0a0', hint: `Open ${id}` }));
    const html = renderToStaticMarkup(React.createElement(AppLayout, {
      topBar: React.createElement('header', null, 'Owner resources'),
      sideNav: React.createElement(SideNav, { items, activeTab: 'character', onChange: () => {} }),
      activePanel: React.createElement('main', { id: 'active-gameplay-panel' }, 'Character workspace')
    }));

    assert.equal((html.match(/<button\b/g) ?? []).length, 7);
    for (const id of ids) assert.match(html, new RegExp(`>${id}<`));
    assert.match(html, /<main id="active-gameplay-panel">Character workspace<\/main>/);
    assert.doesNotMatch(html, /aria-hidden="true"/);
    assert.match(html, /class="gameplay-main-grid /);
    assert.match(html, /class="gameplay-side-nav /);
    assert.match(html, /aria-label="Gameplay destinations"/);
    assert.match(html, /aria-current="page"/);
    assert.doesNotMatch(html, /forged-list-item|gameplay-domain-content[^\"]*border/);
    const styles = readFileSync(new URL('../src/styles/mobile-shell.css', import.meta.url), 'utf8');
    const landscape = styles.slice(styles.indexOf('@media (orientation: landscape)'));
    assert.match(landscape, /\.gameplay-shell \.gameplay-main-grid\s*\{[^}]*grid-template-columns:\s*108px minmax\(0, 1fr\)/s);
    assert.match(landscape, /\.gameplay-shell \.gameplay-domain-list\s*\{[^}]*flex-direction:\s*column/s);
    assert.match(landscape, /\.gameplay-shell \.gameplay-side-nav\s*\{[^}]*overflow-x:\s*hidden/s);
    assert.match(landscape, /\.gameplay-shell \.gameplay-content-frame\s*\{\s*padding:\s*0/s);
    assert.match(landscape, /\.gameplay-shell \.gameplay-side-nav\s*\{[^}]*border-right:\s*1px solid/s);
    assert.match(landscape, /\.gameplay-shell \.gameplay-domain-tooltip:not\(:last-child\)\s*\{[^}]*border-bottom:\s*1px solid/s);
  } finally {
    await vite.close();
  }
});

test('Character and Inventory mount distinct panel instances so subsection state cannot cross destinations', () => {
  const shell = readFileSync(new URL('../src/game-shell/InGameShell.tsx', import.meta.url), 'utf8');
  assert.match(shell, /activeTab === 'character'[\s\S]*?<CharacterPanel key="character"/);
  assert.match(shell, /activeTab === 'inventory'[\s\S]*?<CharacterPanel key="inventory"[^>]*initialSection="inventory" inventoryOnly/);
});
