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
      onToggleThemeMode:()=>calls++,onContinue:()=>calls++,onBack:()=>calls++,onLogout:()=>calls++,
      onOpenExistingLauncher:()=>calls++};
    const welcome = renderToStaticMarkup(React.createElement(WelcomeWorldPresentation, {...props,worlds:false}));
    assert.match(welcome,/Welcome back, Verified &lt;Name&gt;/);
    assert.match(welcome,/data-world-presentation="welcome"/);
    assert.match(welcome,/disabled=""[^>]*><span[^>]*>Persistent/);
    assert.match(welcome,/Local time 10:15 AM/);
    assert.match(welcome,/>Sign Out<\/button>/);
    assert.match(welcome,/>Open existing launcher<\/button>/);
    const busy = renderToStaticMarkup(React.createElement(WelcomeWorldPresentation, {...props,worlds:false,busy:true}));
    assert.match(busy,/<button[^>]*disabled=""[^>]*>Open existing launcher<\/button>/);
    assert.doesNotMatch(welcome,/>Back<\/button>/);
    assert.doesNotMatch(welcome,/<aside|World time|View Characters/);
    const library = renderToStaticMarkup(React.createElement(WelcomeWorldPresentation, {...props,worlds:true}));
    assert.match(library,/World registry unavailable/);
    assert.match(library,/No Worlds available/);
    assert.match(library,/Create World/);
    assert.match(library,/aria-label="Back to Welcome"/);
    assert.doesNotMatch(library,/Open existing launcher/);
    assert.doesNotMatch(library,/View Characters|World created|worldInstanceId/);
    assert.equal(calls,0,'render must not invoke account or navigation owners');
  } finally { await vite.close(); }
});

test('gated picker displays real journey metadata and uniquely labels duplicate names', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { LocalAccountAccessScreen } = await vite.ssrLoadModule('/src/game-shell/components/LocalAccountAccessScreen.tsx');
    const name = 'Same ' + 'long name '.repeat(8).trim();
    const accounts = [
      { accountId: 'collision-1-0000', displayName: name },
      { accountId: 'collision-2-0000', displayName: name, lastPlayedAt: 'invalid' },
      { accountId: 'collision-3-0000', displayName: name, lastPlayedAt: '2020-01-05T12:00:00Z' },
      { accountId: 'collision-4-0000', displayName: name, lastPlayedAt: '2020-01-05T12:00:00Z' },
      { accountId: 'collision-5-0000', displayName: name, lastPlayedAt: '2020-02-10T12:00:00Z' },
    ];
    const render = (entries, preview = true) => renderToStaticMarkup(React.createElement(LocalAccountAccessScreen, {
      mode: 'pick_account', accounts: entries, notice: null, themeMode: 'dark', presentationPreview: preview,
    }));
    const options = markup => new Map([...markup.matchAll(/<option value="([^"]*)"[^>]*>([^<]+)<\/option>/g)]
      .map(([, id, label]) => [id, label]));
    const markup = render(accounts);
    const labels = options(markup);
    assert.equal(labels.get(''), 'Select an account');
    assert.match(markup, /<option value="" selected=""/);
    assert.deepEqual(options(render([...accounts].reverse())), labels);
    assert.equal(new Set(labels.values()).size, accounts.length + 1);
    const formatDate = new Intl.DateTimeFormat('en-US', {dateStyle:'medium', timeStyle:'short'});
    const firstDate = formatDate.format(new Date(accounts[2].lastPlayedAt));
    const secondDate = formatDate.format(new Date(accounts[4].lastPlayedAt));
    const expectedMetadata = ['No journey recorded yet.', 'No journey recorded yet.',
      `Last played: ${firstDate}`, `Last played: ${firstDate}`, `Last played: ${secondDate}`];
    for (const [index, account] of accounts.entries()) {
      const label = labels.get(account.accountId);
      assert.equal(label, `${name} — ${expectedMetadata[index]} (account ${index + 1})`);
      assert.ok(!label.includes(account.accountId));
    }
    assert.doesNotMatch(render(accounts, false), /<option|\(account [1-5]\)/);
    assert.deepEqual(options(render([])), new Map([['', 'Select an account']]));
  } finally { await vite.close(); }
});
