import test from 'node:test';
import assert from 'node:assert/strict';
import { hasWorldReviewOptIn, isCompiledWorldReviewEntry } from '../../apps/rpg-ui/src/game-shell/accountPresentationGate.ts';
import { confirmWorldCreation, projectWorldCard, selectVerifiedWorld } from '../../apps/rpg-ui/src/game-shell/worldCreatorOwner.ts';
import { gameShellReducer } from '../../apps/rpg-ui/src/game-shell/state.ts';
import manifest from '../../docs/design/first-world-economy-source-manifest-v3.json' with { type: 'json' };

test('compiled pilot admission requires the review mode, compiled owner, loopback splash and exact opt-ins', () => {
  const flags = 'welcomeL1=1&accountPresentation=1&worldPresentation=1';
  assert.equal(hasWorldReviewOptIn(flags), true);
  for (const query of ['', 'welcomeL1=1&accountPresentation=1', flags + '&worldPresentation=1', flags.replace('=1', '=0')])
    assert.equal(hasWorldReviewOptIn(query), false);
  assert.equal(isCompiledWorldReviewEntry(true, 'world-owner-review', true, 'localhost', '/index.html'), true);
  assert.equal(isCompiledWorldReviewEntry(true, 'world-owner-review', true, '127.0.0.1', '/'), true);
  for (const input of [
    [false, 'world-owner-review', true, 'localhost', '/'],
    [true, 'production', true, 'localhost', '/'],
    [true, 'world-owner-review', false, 'localhost', '/'],
    [true, 'world-owner-review', true, 'localhost.example.com', '/'],
    [true, 'world-owner-review', true, '[::1]', '/'],
    [true, 'world-owner-review', true, 'localhost', '/world-source-review.html'],
  ]) assert.equal(isCompiledWorldReviewEntry(...input), false);
});

test('creation success requires a scoped World, receipt and identical fresh inventory', () => {
  const scope = { accountId: 'account.local.qa', generation: 2 };
  const request = { creationIntentId: 'world.create.qa', proposedWorldInstanceId: 'world.instance.qa',
    displayName: 'World QA', expectedAccountRevision: 4 };
  const projectionFingerprint = 'sha256:' + 'f'.repeat(64);
  const world = { version: 2, accountId: scope.accountId, accountLifecycleGeneration: scope.generation,
    worldRevision: 0, characterAssociations: [], campaignSaveAssociations: [],
    worldInstanceId: request.proposedWorldInstanceId, displayName: request.displayName,
    creationIntentId: request.creationIntentId, createdAt: '2026-11-22T00:00:00.000Z', projectionFingerprint,
    binding: { sourceFingerprint: manifest.runtimeFingerprint, economySourceFingerprint: manifest.parentFingerprint,
      scenario: { id: 'world_scenario.first_world.chronicle_default_v1', version: 1 },
      rules: { progressionMode: 'chronicle', worldKind: 'individual', difficulty: 'mortal', stakes: 'normal', hardcore: false } } };
  const receipt = { version: 2, state: 'COMMITTED', accountId: scope.accountId,
    accountLifecycleGeneration: scope.generation, worldInstanceId: request.proposedWorldInstanceId,
    initialDisplayName: request.displayName, creationIntentId: request.creationIntentId,
    expectedAccountRevision: request.expectedAccountRevision, projectionFingerprint };
  const committed = { status: 'committed', world, receipt };
  const reopened = { world, receipt, projectionFingerprint };
  const card = projectWorldCard(world, scope);
  assert.deepEqual(confirmWorldCreation(committed, reopened, world, scope, request), card);
  assert.deepEqual(confirmWorldCreation(null, reopened, world, scope, request), card);
  assert.throws(() => confirmWorldCreation(committed, null, world, scope, request));
  assert.throws(() => confirmWorldCreation(committed, reopened, { ...world, displayName: 'Other' }, scope, request));
  assert.throws(() => confirmWorldCreation(committed, reopened, world, { ...scope, generation: 3 }, request));
  assert.throws(() => confirmWorldCreation(committed, reopened, world, scope, { ...request, expectedAccountRevision: 5 }));
  assert.throws(() => confirmWorldCreation(committed, { ...reopened, projectionFingerprint: 'wrong' }, world, scope, request));
  assert.throws(() => projectWorldCard({ ...world, binding: { ...world.binding, sourceFingerprint: 'wrong' } }, scope));
  const selected = selectVerifiedWorld(reopened, scope, world.worldInstanceId);
  assert.deepEqual(selected, { ...scope, worldInstanceId: world.worldInstanceId, displayName: world.displayName,
    creationIntentId: world.creationIntentId, projectionFingerprint });
  assert.throws(() => selectVerifiedWorld(null, scope, world.worldInstanceId));
  assert.throws(() => selectVerifiedWorld(reopened, scope, 'world.instance.other'));
  assert.throws(() => selectVerifiedWorld(reopened, { ...scope, accountId: 'account.other' }, world.worldInstanceId));
  assert.throws(() => selectVerifiedWorld(reopened, { ...scope, generation: 3 }, world.worldInstanceId));
  assert.throws(() => selectVerifiedWorld({ ...reopened, receipt: { ...receipt, creationIntentId: 'other' } },
    scope, world.worldInstanceId));
  assert.throws(() => selectVerifiedWorld({ ...reopened, world: { ...world, characterAssociations: [{}] } },
    scope, world.worldInstanceId));
});

test('selected World state keeps the draft and scope ephemeral and never allocates a Save slot', () => {
  const accountId = 'account.qa';
  const library = { screen: 'WORLD_LIBRARY_GATE', accountProfile: { accountId },
    launcherSession: { accountId, metadata: { epochGeneration: '2' } }, slots: [], notice: null };
  const world = { accountId, generation: 2, worldInstanceId: 'world.instance.qa', displayName: 'QA',
    creationIntentId: 'world.create.qa', projectionFingerprint: 'sha256:' + 'f'.repeat(64) };
  assert.equal(gameShellReducer(library, { type: 'SELECT_WORLD', world: { ...world, accountId: 'other' } }), library);
  assert.equal(gameShellReducer(library, { type: 'SELECT_WORLD', world: { ...world, generation: 1 } }), library);
  const selected = gameShellReducer(library, { type: 'SELECT_WORLD', world });
  const creator = gameShellReducer(selected, { type: 'OPEN_WORLD_CHARACTER_CREATOR' });
  const edited = gameShellReducer(creator, { type: 'UPDATE_WORLD_CHARACTER_DRAFT', draft: { playerName: 'Edited' } });
  assert.equal(edited.world, world);
  assert.equal(edited.characterDraft.playerName, 'Edited');
  assert.equal(Object.hasOwn(edited.characterDraft, 'saveSlotId'), false);
  assert.equal(gameShellReducer(edited, { type: 'CLOSE_WORLD_CHARACTER_CREATOR' }).world, world);
  assert.deepEqual(gameShellReducer(edited, { type: 'LEAVE_SELECTED_WORLD' }), library);
  assert.equal(Object.hasOwn(gameShellReducer(edited, {
    type: 'SHOW_ACCOUNT_ACCESS', accessMode: 'pick_account', accounts: [], notice: null,
  }), 'world'), false);
});
