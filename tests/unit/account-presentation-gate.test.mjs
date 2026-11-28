import test from 'node:test';
import assert from 'node:assert/strict';
import { canSelectSplashUiVersion, isAccountPresentationEnabled, isWorldPresentationEnabled,
  splashUiVersionUrl } from '../../apps/rpg-ui/src/game-shell/accountPresentationGate.ts';

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

test('splash selector requires the ordinary development entry on either presentation loopback host', () => {
  for (const host of ['localhost', '127.0.0.1']) {
    assert.equal(canSelectSplashUiVersion(true, host, false, false), true);
    assert.equal(canSelectSplashUiVersion(false, host, false, false), false);
    assert.equal(canSelectSplashUiVersion(true, host, true, false), false);
    assert.equal(canSelectSplashUiVersion(true, host, false, true), false);
  }
  for (const host of ['[::1]', 'example.test', 'localhost.example.test'])
    assert.equal(canSelectSplashUiVersion(true, host, false, false), false);
});

test('splash selection round-trips both local entry paths and preserves unrelated URL state', () => {
  for (const entry of ['http://127.0.0.1:53223/', 'http://localhost:53223/index.html']) {
    const classic = new URL(entry + '?tag=one&tag=two&label=two%20words#section');
    assert.equal(splashUiVersionUrl(classic, 'classic').href, classic.href);
    const preview = splashUiVersionUrl(classic, 'preview');
    assert.equal(splashUiVersionUrl(preview, 'preview').href, preview.href);
    const rollback = splashUiVersionUrl(preview, 'classic');
    for (const target of [preview, rollback]) {
      assert.equal(target.origin, classic.origin);
      assert.equal(target.pathname, classic.pathname);
      assert.equal(target.hash, classic.hash);
      assert.deepEqual(target.searchParams.getAll('tag'), ['one', 'two']);
      assert.equal(target.searchParams.get('label'), 'two words');
    }
    for (const key of ['welcomeL1', 'accountPresentation', 'worldPresentation']) {
      assert.deepEqual(preview.searchParams.getAll(key), ['1']);
      assert.equal(rollback.searchParams.has(key), false);
    }
    assert.equal(preview.searchParams.has('familyPresentation'), false);
    assert.equal(classic.searchParams.has('welcomeL1'), false);
  }
});

test('partial and duplicate presentation flags are canonicalized or removed without affecting other flags', () => {
  const partial = new URL('http://localhost/?welcomeL1=0&welcomeL1=1&accountPresentation=1&familyPresentation=1&familyPresentation=0&otherPresentation=1');
  const preview = splashUiVersionUrl(partial, 'preview');
  for (const flag of ['welcomeL1', 'accountPresentation', 'worldPresentation'])
    assert.deepEqual(preview.searchParams.getAll(flag), ['1']);
  const classic = splashUiVersionUrl(partial, 'classic');
  assert.equal(classic.search, '?otherPresentation=1');
});
