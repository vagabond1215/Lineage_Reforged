import assert from 'node:assert/strict';
import {withCampaignStorage,createOrdinarySoundingsCampaign,publishAndRestart,travelTo,REQUEST_ID} from '../../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {submitSoundingsTurnInCaller} from '../../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
// Independently instrument every write, including temporary publication records.
const quota = 5 * 1024 * 1024;
withCampaignStorage(storage => {
  let peak = 0, writes = 0;
  const rows = () => Array.from({length:storage.length},(_,i)=>storage.key(i)).map(k=>[k,storage.getItem(k)]);
  const bytes = entries => entries.reduce((n,[k,v])=>n+2*(k.length+v.length),0);
  const set = storage.setItem.bind(storage);
  storage.setItem = (key,value) => {
    const candidate = new Map(rows()).set(String(key),String(value));
    const size = bytes([...candidate]);
    assert.ok(size <= quota, `intermediate write ${key} exceeds quota: ${size}`);
    set(key,value); writes++; peak = Math.max(peak,size);
  };
  let state = createOrdinarySoundingsCampaign({returnToStarfall:false});
  // Helper acquires all prerequisites through production creator, quest, travel,
  // and four shift callers, explicitly publishing/restarting after shift two.
  assert.equal(state.snapshot.authorityLedger.ashenReefSurvey.results.length,4);
  const startTick = state.snapshot.clock.tick;
  state = travelTo(state,'settlement.starfall_port');
  assert.equal(state.snapshot.clock.tick,startTick+4);
  const gold = state.snapshot.playerState.currency.gold;
  const silver = state.snapshot.playerState.currency.silver;
  const submitted = submitSoundingsTurnInCaller(state.snapshot,state.control,REQUEST_ID,new Map());
  assert.ok(submitted.acceptedState);
  state = submitted.acceptedState;
  assert.equal(state.snapshot.playerState.currency.gold,gold+5);
  assert.equal(state.snapshot.playerState.currency.silver,silver);
  state = publishAndRestart(state.snapshot,state.control);
  const witnessRows = rows().filter(([k])=>k.endsWith(`.soundings-witness.${REQUEST_ID}`));
  assert.equal(witnessRows.length,1);
  const witness = witnessRows[0][1];
  assert.equal(JSON.parse(witness).posture,'applied');
  assert.equal(submitSoundingsTurnInCaller(state.snapshot,state.control,REQUEST_ID,new Map()).outcome.result.code,'duplicate');
  state = travelTo(state,'location.ashen_reef');
  state = publishAndRestart(state.snapshot,state.control);
  assert.equal(storage.getItem(witnessRows[0][0]),witness);
  assert.equal(state.snapshot.playerState.currency.gold,gold+5);
  console.log(JSON.stringify({runtime:'7c8c980d01892b0f673afc5a5940aec33ad2d7a2',status:'BOUNDED_UTF16_STORAGE_PASS',quotaBytes:quota,writes,retainedBytes:bytes(rows()),peakIntermediateBytes:peak,witnessValueBytes:2*witness.length,witnessKeyAndValueBytes:bytes(witnessRows),keys:storage.length,limitation:'Finite ordinary sequence only; no claim of unlimited history.'},null,2));
},quota);
