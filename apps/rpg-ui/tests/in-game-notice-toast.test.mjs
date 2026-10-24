import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('in-game dismissible notices float over gameplay and use a bounded timer', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ InGameShell, getInGameNoticeAutoDismissMs }, { demoSnapshot }, { createDefaultAccountProfileState }] = await Promise.all([
      vite.ssrLoadModule('/src/game-shell/InGameShell.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts')
    ]);
    const notice = { tone: 'success', title: 'Campaign Ready', detail: 'Slot 1 read back from the campaign store.' };
    const html = renderToStaticMarkup(React.createElement(InGameShell, {
      accountProfile: createDefaultAccountProfileState(),
      snapshot: demoSnapshot,
      campaignSessionControl: {},
      slots: [],
      activeSlotId: 'slot-1',
      hasUnsavedChanges: false,
      notice,
      onDismissNotice: () => {},
      onSnapshotChange: () => {},
      onSave: () => {},
      onQuickSave: () => {},
      onRetireCharacter: () => {},
      onReturnToMainMenu: () => {}
    }));

    assert.match(html, /class="pointer-events-none fixed bottom-4 right-4 z-\[70\]/);
    assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
    assert.match(html, /aria-label="Dismiss Campaign Ready notification"/);
    assert.ok(html.indexOf('Campaign Ready') > html.indexOf('</header>'), 'toast follows the top bar rather than increasing its height');
    assert.equal(getInGameNoticeAutoDismissMs(notice), 8000);
    assert.equal(getInGameNoticeAutoDismissMs({ ...notice, autoDismissMs: 6000 }), 6000);
    assert.equal(getInGameNoticeAutoDismissMs({ ...notice, autoDismissMs: null }), null);
  } finally {
    await vite.close();
  }
});
