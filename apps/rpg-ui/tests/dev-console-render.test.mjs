import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('developer console exposes real diagnostics and truthful pending commands', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ DevConsole }, { demoSnapshot }] = await Promise.all([
      vite.ssrLoadModule('/src/game-shell/components/DevConsole.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts')
    ]);
    const html = renderToStaticMarkup(React.createElement(DevConsole, {
      snapshot: demoSnapshot,
      control: { sessionRevision: 3 }
    }));
    for (const label of ['Items', 'Time &amp; Calendar', 'Weather &amp; Climate', 'Spawns &amp; Encounters', 'Diagnostics']) {
      assert.match(html, new RegExp(label));
    }
    assert.match(html, /Session revision<\/dt><dd>3<\/dd>/);
    assert.match(html, /No item was granted/);
    assert.match(html, /No authored encounter context is active/);
    assert.match(html, /Time of day, season and weather filters are not implemented/);
    assert.doesNotMatch(html, /<button[^>]*>Advance/);
  } finally {
    await vite.close();
  }
});
