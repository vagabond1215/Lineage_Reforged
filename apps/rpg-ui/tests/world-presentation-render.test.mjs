import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('real Welcome/World component renders authenticated, unavailable and disabled boundaries', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { WelcomeWorldPresentation } = await vite.ssrLoadModule('/src/game-shell/components/WelcomeWorldPresentation.tsx');
    let calls = 0;
    const props = {profile:{accountId:'synthetic-render',displayName:'Verified <Name>'},busy:false,
      clockLabel:'10:15 AM',clockTitle:'Local clock',themeMode:'dark',
      onToggleThemeMode:()=>calls++,onContinue:()=>calls++,onBack:()=>calls++,onLogout:()=>calls++};
    const welcome = renderToStaticMarkup(React.createElement(WelcomeWorldPresentation, {...props,worlds:false}));
    assert.match(welcome,/Welcome back, Verified &lt;Name&gt;/);
    assert.match(welcome,/data-world-presentation="welcome"/);
    assert.match(welcome,/disabled=""[^>]*><span[^>]*>Persistent/);
    assert.match(welcome,/Local time 10:15 AM/);
    assert.doesNotMatch(welcome,/<aside|World time|View Characters/);
    const library = renderToStaticMarkup(React.createElement(WelcomeWorldPresentation, {...props,worlds:true}));
    assert.match(library,/World registry unavailable/);
    assert.match(library,/No Worlds available/);
    assert.match(library,/Create World/);
    assert.doesNotMatch(library,/View Characters|World created|worldInstanceId/);
    assert.equal(calls,0,'render must not invoke account or navigation owners');
  } finally { await vite.close(); }
});
