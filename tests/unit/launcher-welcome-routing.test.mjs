import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccountAccessState, gameShellReducer } from '../../apps/rpg-ui/src/game-shell/state.ts';

const signedOut = createAccountAccessState('create_first_account', [], null);
const profile = { accountId: 'synthetic-account', displayName: 'Synthetic Wayfarer' };
const session = { accountId: profile.accountId };
const authenticated = { type: 'SHOW_AUTHENTICATED_WELCOME', launcherSession: session,
  accountProfile: profile, slots: [], notice: null };

test('signed-out and legacy menu cannot open the gated Worlds boundary', () => {
  assert.equal(gameShellReducer(signedOut, { type: 'OPEN_WORLD_LIBRARY_GATE' }), signedOut);
  const menu = gameShellReducer(signedOut, { ...authenticated, type: 'SHOW_MAIN_MENU' });
  assert.equal(menu.screen, 'MAIN_MENU');
  assert.equal(gameShellReducer(menu, { type: 'OPEN_WORLD_LIBRARY_GATE' }), menu);
});

test('authenticated Welcome reaches only the ephemeral unavailable boundary and returns', () => {
  const welcome = gameShellReducer(signedOut, authenticated);
  assert.equal(welcome.screen, 'WELCOME_AUTHENTICATED');
  const worlds = gameShellReducer(welcome, { type: 'OPEN_WORLD_LIBRARY_GATE' });
  assert.equal(worlds.screen, 'WORLD_LIBRARY_GATE');
  assert.equal(worlds.accountProfile, profile);
  assert.equal(worlds.slots, welcome.slots);
  assert.equal(gameShellReducer(worlds, { type: 'RETURN_TO_AUTHENTICATED_WELCOME' }).screen,
    'WELCOME_AUTHENTICATED');
  assert.equal(gameShellReducer(signedOut, { type: 'RETURN_TO_AUTHENTICATED_WELCOME' }), signedOut);
});

test('logout route clears authenticated presentation state', () => {
  const welcome = gameShellReducer(signedOut, authenticated);
  const loggedOut = gameShellReducer(welcome, { type: 'SHOW_ACCOUNT_ACCESS',
    accessMode: 'pick_account', accounts: [], notice: null });
  assert.equal(loggedOut.screen, 'ACCOUNT_ACCESS');
  assert.equal('accountProfile' in loggedOut, false);
});
