import test from 'node:test';
import assert from 'node:assert/strict';
import { isAccountPresentationEnabled, isWorldPresentationEnabled } from '../../apps/rpg-ui/src/game-shell/accountPresentationGate.ts';

test('account presentation requires explicit opt-in on the development Welcome route', () => {
  for (const host of ['localhost', '127.0.0.1']) {
    assert.equal(isAccountPresentationEnabled(true, true, host, '?accountPresentation=1'), true);
    for (const query of ['', '?accountPresentation=0', '?accountPresentation=true']) {
      assert.equal(isAccountPresentationEnabled(true, true, host, query), false);
    }
    assert.equal(isAccountPresentationEnabled(false, true, host, '?accountPresentation=1'), false);
    assert.equal(isAccountPresentationEnabled(true, false, host, '?accountPresentation=1'), false);
  }
});

test('World presentation requires every account/Welcome/dev/host condition and its own opt-in', () => {
  const enabled = '?accountPresentation=1&worldPresentation=1';
  for (const host of ['localhost', '127.0.0.1']) {
    assert.equal(isWorldPresentationEnabled(true, true, host, enabled), true);
    for (const search of ['', '?accountPresentation=1', '?worldPresentation=1',
      '?accountPresentation=0&worldPresentation=1', '?accountPresentation=1&worldPresentation=true'])
      assert.equal(isWorldPresentationEnabled(true, true, host, search), false);
    assert.equal(isWorldPresentationEnabled(false, true, host, enabled), false);
    assert.equal(isWorldPresentationEnabled(true, false, host, enabled), false);
  }
  for (const host of ['example.com', 'localhost.example.com', '127.0.0.1.example.com'])
    assert.equal(isWorldPresentationEnabled(true, true, host, enabled), false);
});

test('hosted and lookalike origins cannot activate account presentation', () => {
  for (const host of ['example.com', 'localhost.example.com', '127.0.0.1.example.com', '']) {
    assert.equal(isAccountPresentationEnabled(true, true, host, '?accountPresentation=1'), false);
  }
});
