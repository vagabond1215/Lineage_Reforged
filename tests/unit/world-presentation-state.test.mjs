import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldIntent, createWorldReviewState, validatedWorldName, worldReviewReducer }
  from '../../apps/rpg-ui/src/game-shell/worldPresentationState.ts';

test('only a verified result from the Creator highlights the matching World in the Library', () => {
  const initial = createWorldReviewState();
  const verified = {type:'VERIFIED',worldInstanceId:'world.instance.synthetic'};
  assert.equal(worldReviewReducer(initial, verified), initial);
  const creator = worldReviewReducer(initial, {type:'OPEN_CONFIGURATION'});
  assert.deepEqual(worldReviewReducer(creator, verified),
    {view:'library',highlightedWorldId:verified.worldInstanceId});
  assert.deepEqual(worldReviewReducer(creator, {type:'BACK'}), initial);
});

test('Creator names follow the owner length, trimming and control-character limits', () => {
  for (const invalid of ['', '   ', 'x'.repeat(81), 'bad\u0000name', '\tname', 'name\u007f']) {
    assert.equal(validatedWorldName(invalid), null);
  }
  assert.equal(validatedWorldName('  River & Stone  '), 'River & Stone');
  assert.equal(validatedWorldName('x'.repeat(80)), 'x'.repeat(80));
});

test('the form intent carries only supported fields and generates distinct stable identities per request', () => {
  const first = createWorldIntent('Same name');
  const second = createWorldIntent('Same name');
  assert.deepEqual(Object.keys(first).sort(), ['creationIntentId','displayName','proposedWorldInstanceId']);
  assert.match(first.creationIntentId, /^world\.create\./);
  assert.match(first.proposedWorldInstanceId, /^world\.instance\./);
  assert.notEqual(first.creationIntentId, second.creationIntentId);
  assert.notEqual(first.proposedWorldInstanceId, second.proposedWorldInstanceId);
});
