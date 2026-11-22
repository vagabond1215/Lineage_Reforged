import test from 'node:test';
import assert from 'node:assert/strict';
import { isAccountPresentationEnabled } from '../../apps/rpg-ui/src/game-shell/accountPresentationGate.ts';

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

test('hosted and lookalike origins cannot activate account presentation', () => {
  for (const host of ['example.com', 'localhost.example.com', '127.0.0.1.example.com', '']) {
    assert.equal(isAccountPresentationEnabled(true, true, host, '?accountPresentation=1'), false);
  }
});
