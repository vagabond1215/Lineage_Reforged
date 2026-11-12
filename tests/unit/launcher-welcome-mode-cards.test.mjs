import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const welcome = readFileSync(new URL('../../apps/rpg-ui/src/game-shell/components/WelcomeScreen.tsx', import.meta.url), 'utf8');

test('authenticated Welcome offers one explicit preview route and one truthful disabled mode', () => {
  assert.match(welcome, /Welcome back, \{profile\.displayName\}/);
  assert.match(welcome, /Choose your journey/);
  const route = welcome.indexOf('onClick={onContinue}');
  assert.ok(route >= 0);
  const chronicle = welcome.slice(route, welcome.indexOf('</button>', route));
  assert.match(chronicle, /Chronicle/);
  assert.match(chronicle, /preview/);
  const persistentStart = welcome.indexOf('<button', welcome.indexOf('</button>', route));
  const persistent = welcome.slice(persistentStart, welcome.indexOf('</button>', persistentStart));
  assert.match(persistent, /\bdisabled\b/);
  assert.match(persistent, /Persistent/);
  assert.match(persistent, /Coming Soon/);
  assert.doesNotMatch(persistent, /onClick/);
});

test('mode cards are readable choices across viewport sizes with retained exit controls', () => {
  assert.match(welcome, /grid gap-4 text-left md:grid-cols-2/);
  assert.match(welcome, /min-h-\[15rem\]/);
  assert.match(welcome, /focus-visible:outline/);
  assert.match(welcome, /onClick=\{onLogout\}/);
  assert.match(welcome, /World Library not ready/);
  assert.match(welcome, /onClick=\{onBack\}/);
});

test('mode preview is presentational and does not create/persist any World or Save', () => {
  assert.doesNotMatch(welcome, /localStorage|sessionStorage|indexedDB|createWorld|worldInstanceId|publishSave|loadLatest|createCampaign/);
  assert.match(welcome, /L1 visual preview only/);
});
