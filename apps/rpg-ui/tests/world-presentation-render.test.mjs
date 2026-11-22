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
    assert.match(library,/World inventory unavailable/);
    assert.match(library,/Create New World/);
    assert.match(library,/>Home<\/button>/);
    assert.match(library,/aria-label="Back to Welcome"/);
    assert.doesNotMatch(library,/Open existing launcher/);
    assert.doesNotMatch(library,/View Characters|World created|worldInstanceId/);
    assert.equal(calls,0,'render must not invoke account or navigation owners');
  } finally { await vite.close(); }
});

test('Library separates unavailable, empty, blocked, verification failure and the owner-provided capacity card', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { WorldLibrary } = await vite.ssrLoadModule('/src/game-shell/components/WorldLibrary.tsx');
    const { WelcomeWorldPresentation } = await vite.ssrLoadModule('/src/game-shell/components/WelcomeWorldPresentation.tsx');
    const render = inventory => renderToStaticMarkup(React.createElement(WorldLibrary, {inventory}));
    assert.match(render({status:'loading'}), /role="status">Verifying World inventory/);
    assert.match(render({status:'empty'}), /No Worlds yet/);
    assert.match(render({status:'blocked',message:'World owner unavailable'}), /role="alert">World owner unavailable/);
    assert.match(render({status:'readback-failed',message:'Read again'}), /World verification failed/);
    const world = {worldInstanceId:'world.instance.fixture',displayName:'Owner fixture',
      rules:{ progressionMode:'chronicle',worldKind:'individual',difficulty:'mortal' },
      scenario:{id:'world_scenario.first_world.chronicle_default_v1',version:1},createdAt:'2026-11-22T00:00:00Z'};
    const inventory = {status:'ready',world};
    const ready = renderToStaticMarkup(React.createElement(WelcomeWorldPresentation, {
      profile:{displayName:'Fixture'},worlds:true,busy:false,themeMode:'dark',inventory,
    }));
    assert.match(ready,/Owner fixture/);
    assert.match(ready,/world\.instance\.fixture/);
    assert.match(ready,/disabled=""[^>]*>Create New World<\/button>/);
    assert.match(ready,/Pilot capacity reached/);
    assert.doesNotMatch(ready,/>Play<|>Open World<|World created\./);
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

test('both splash layouts render an optional non-submit selector for first account and existing picker', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { LocalAccountAccessScreen } = await vite.ssrLoadModule('/src/game-shell/components/LocalAccountAccessScreen.tsx');
    for (const mode of ['create_first_account', 'pick_account']) {
      for (const preview of [false, true]) {
        const props = { mode, notice: null, themeMode: 'dark', presentationPreview: preview,
          accounts: mode === 'pick_account' ? [{accountId:'synthetic', displayName:'Synthetic'}] : [] };
        const render = splashUiVersion => renderToStaticMarkup(React.createElement(LocalAccountAccessScreen,
          {...props, splashUiVersion}));
        assert.doesNotMatch(render(undefined), /aria-label="UI version"/);
        const active = preview ? 'preview' : 'classic';
        const markup = render({ active, busy: false, onSelect: assert.fail });
        const selector = markup.match(/<section aria-label="UI version"[^>]*>(.*?)<\/section>/)[1];
        for (const [version, label] of [['classic', 'Classic UI'], ['preview', 'New UI Preview']]) {
          const button = selector.match(new RegExp(`<button [^>]*>${label}</button>`))[0];
          assert.match(button, /type="button"/);
          assert.match(button, new RegExp(`aria-pressed="${version === active}"`));
        }
        const partial = render({active: null, busy: true, onSelect: assert.fail});
        const busySelector = partial.match(/<section aria-label="UI version"[^>]*>(.*?)<\/section>/)[1];
        assert.equal((busySelector.match(/aria-pressed="false" disabled=""/g) ?? []).length, 2);
        assert.match(busySelector, /clears unsent form entries/);
      }
    }
  } finally { await vite.close(); }
});
