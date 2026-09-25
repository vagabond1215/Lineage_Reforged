import assert from 'node:assert/strict';
import {createOrdinarySoundingsCampaign,withCampaignStorage,travelTo,publishAndRestart,REQUEST_ID,QUEST_ID} from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import {submitSoundingsTurnInCaller} from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import {createPlayerTravelCommand,executePlayerTravelCommand,getPlayerTravelDestinationFacts} from '../../../../packages/engines/game-engine/src/index.ts';
let cases=0;const pass=x=>{cases++;console.log('PASS',x);};
withCampaignStorage(()=>{
 const source=createOrdinarySoundingsCampaign({returnToStarfall:false});
 const returned=travelTo(source,'settlement.starfall_port');
 assert.equal(returned.snapshot.clock.tick-source.snapshot.clock.tick,4);
 assert.deepEqual(returned.snapshot.playerState.currency,source.snapshot.playerState.currency);
 assert.deepEqual(returned.snapshot.playerState.geographicKnowledge,source.snapshot.playerState.geographicKnowledge);
 assert.deepEqual(returned.snapshot.sessionState.knownLocations,source.snapshot.sessionState.knownLocations);
 assert.equal(getPlayerTravelDestinationFacts('settlement.starfall_port'),null);
 pass('ordinary exact four-tick return, no fare/knowledge/access grant, no global Starfall profile');
 for(const kind of ['unsupported origin','unaccepted quest','missing access']){
  const bad=structuredClone(source.snapshot);
  if(kind==='unsupported origin'){bad.playerState.location.settlementId='settlement.aurelis';bad.playerState.location.siteLabel='Harbor Quarter';}
  if(kind==='unaccepted quest')bad.sessionState.questJournal.find(q=>q.id===QUEST_ID).category='contracts';
  if(kind==='missing access')bad.sessionState.knownLocations=bad.sessionState.knownLocations.filter(l=>l.id!=='location.ashen_reef');
  const before=structuredClone(bad);const result=executePlayerTravelCommand(bad,createPlayerTravelCommand(bad,'settlement.starfall_port'));
  assert.equal(result.accepted,false);assert.deepEqual(bad,before);assert.deepEqual(result.emittedEvents,[]);pass(kind+' rejects unchanged');
 }
 const before=structuredClone(returned.snapshot);
 const completion=submitSoundingsTurnInCaller(returned.snapshot,returned.control,REQUEST_ID,new Map());assert.ok(completion.acceptedState);
 const next=completion.acceptedState.snapshot;
 assert.deepEqual(returned.snapshot,before);
 assert.equal(next.playerState.currency.gold,before.playerState.currency.gold+5);assert.equal(next.playerState.currency.silver,before.playerState.currency.silver);
 const expectedPlayer=structuredClone(before.playerState);expectedPlayer.currency.gold+=5;expectedPlayer.activeQuestIds=expectedPlayer.activeQuestIds.filter(id=>id!==QUEST_ID);expectedPlayer.completedQuestIds=[...expectedPlayer.completedQuestIds,QUEST_ID];assert.deepEqual(next.playerState,expectedPlayer,'all other player surfaces including items/skills/reputation/standing unchanged');
 assert.deepEqual(next.gameState,before.gameState);assert.deepEqual(next.authorityLedger.ashenReefSurvey,before.authorityLedger.ashenReefSurvey);
 assert.deepEqual(next.sessionState.knownLocations,before.sessionState.knownLocations);
 assert.equal(next.authorityLedger.soundingsTurnIn.consequenceReceipts.length,7);
 assert.equal(next.sessionState.questJournal.find(q=>q.id===QUEST_ID).category,'completed');assert.notEqual(next.sessionState.trackedQuestId,QUEST_ID);
 pass('exact +5g/+0s and seven receipts; all other player/game/survey/access surfaces unchanged');
 const loaded=publishAndRestart(next,completion.acceptedState.control);
 const retry=submitSoundingsTurnInCaller(loaded.snapshot,loaded.control,REQUEST_ID,new Map());assert.equal(retry.outcome.result.code,'duplicate');assert.equal(retry.acceptedState,null);
 assert.deepEqual(loaded.snapshot.authorityLedger.soundingsTurnIn,next.authorityLedger.soundingsTurnIn);
 pass('restart exact once-only consequences');
 const outward=travelTo(loaded,'location.ashen_reef');const returnAgain=travelTo(outward,'settlement.starfall_port');assert.equal(returnAgain.snapshot.clock.tick-outward.snapshot.clock.tick,4);assert.deepEqual(returnAgain.snapshot.playerState.currency,outward.snapshot.playerState.currency);
 pass('completed contract retains legitimate four-tick no-fare return');
});
console.log(JSON.stringify({status:'CONSEQUENCES_AND_TRAVEL_PASS',runtime:'0383cedc99a4c3d5e2c9b47cf0665683720aef9e',cases}));
