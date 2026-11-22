import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldReviewState, worldReviewReducer } from '../../apps/rpg-ui/src/game-shell/worldPresentationState.ts';

test('review draft cannot be edited outside configuration and never gains a runtime identity', () => {
  const initial = createWorldReviewState();
  assert.equal(worldReviewReducer(initial, {type:'EDIT',field:'name',value:'Injected'}), initial);
  const config = worldReviewReducer(initial, {type:'OPEN_CONFIGURATION'});
  const edited = worldReviewReducer(config, {type:'EDIT',field:'name',value:'Visual review'});
  assert.equal(edited.draft.name, 'Visual review');
  assert.equal(config.draft.name, '');
  assert.deepEqual(Object.keys(edited).sort(), ['draft','view']);
  assert.deepEqual(Object.keys(edited.draft).sort(), ['name','rainfall','season','temperature']);
});

test('Back, reopening and a new component instance discard the whole illustrative draft', () => {
  let review = worldReviewReducer(createWorldReviewState(), {type:'OPEN_CONFIGURATION'});
  for (const [field,value] of [['name','Discard me'],['temperature','Hot'],['rainfall','Wet'],['season','Harvest']])
    review = worldReviewReducer(review, {type:'EDIT',field,value});
  assert.deepEqual(worldReviewReducer(review, {type:'BACK'}), createWorldReviewState());
  const reopened = worldReviewReducer(review, {type:'OPEN_CONFIGURATION'});
  assert.deepEqual(reopened.draft, createWorldReviewState().draft);
  const fresh = createWorldReviewState();
  assert.notEqual(fresh.draft, review.draft);
  assert.equal(fresh.draft.name, '');
});
