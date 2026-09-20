// Historical negative audit evidence at e14ae0db / runtime af0954c2.
// Intentionally confirms the defect; after repair add rejection regression tests.
// Uses disposable in-memory storage only. Never read or modify user browser saves.
import assert from 'node:assert/strict';
import { createOrdinarySoundingsCampaign, withCampaignStorage, REQUEST_ID, publishAndRestart } from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import { preparePlayerSoundingsTurnInCommand as prepare, executePlayerSoundingsTurnInCommand as execute } from '../../../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import { submitSoundingsTurnInCaller as caller } from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import { serializeSoundingsIntent as canon, fingerprintSoundingsState as hash, buildSoundingsReceipts } from '../../../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
import { isTargetCampaignSnapshot as valid } from '../../../../packages/engines/game-engine/src/campaign-rules.ts';
import { turnInQuest } from '../../../../apps/rpg-ui/src/game-shell/gameplayLoop.ts';

withCampaignStorage(() => {
 const state = createOrdinarySoundingsCampaign();
 const command = prepare(state.snapshot,state.control,REQUEST_ID).command;
 assert.ok(command);
 const before = structuredClone(state);
 const accepted = caller(state.snapshot,state.control,REQUEST_ID,new Map());
 assert.ok(accepted.acceptedState);
 assert.deepEqual(state,before);
 const done = publishAndRestart(accepted.acceptedState.snapshot,accepted.acceptedState.control);
 const reject = (label,s,c=command) => {
  const frozen = structuredClone(s);
  const r=execute(s.snapshot,s.control,c);
  assert.equal(r.accepted,false,label); assert.equal(r.duplicate,false,label);
  assert.equal(r.snapshot,s.snapshot); assert.equal(r.control,s.control); assert.deepEqual(s,frozen,label);
  console.log(label,r.code);
 };
 for(const [label,mutate] of [
  ['request',a=>a.requests[0].acceptedContinuityId='continuity.forged'],
  ['occurrence',a=>a.occurrences[0].occurrenceId+='bad'],
  ['payment',a=>a.results[0].payment.gold=6],
  ['receipt-owner',a=>a.consequenceReceipts[0].owner='forged'],
  ['missing-receipt',a=>a.consequenceReceipts.pop()],
  ['duplicate-receipt',a=>a.consequenceReceipts[1]=structuredClone(a.consequenceReceipts[0])],
  ['ancestry',a=>a.results[0].continuityId='continuity.forged'],
 ]){const s=structuredClone(done);mutate(s.snapshot.authorityLedger.soundingsTurnIn);reject(label,s);}
 const reorder=x=>Array.isArray(x)?x.map(reorder):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).reverse().map(k=>[k,reorder(x[k])])):x;
 const equivalent=execute(done.snapshot,done.control,reorder(command));
 assert.equal(equivalent.code,'duplicate'); console.log('key-order duplicate PASS');
 const conflict=structuredClone(command); conflict.normalizedIntent.sourceRevision++; conflict.normalizedIntent.expectedRevision++; conflict.canonicalIntent=canon(conflict.normalizedIntent); reject('semantic-conflict',done,conflict);
 for(const key of ['accountId','campaignId','characterId']){const c=structuredClone(command);c.normalizedIntent[key]+='.other';c.canonicalIntent=canon(c.normalizedIntent);reject(key,state,c);}
 for(const [label,mutate] of [['stale-revision',s=>s.control.sessionRevision++],['stale-tick',s=>s.snapshot.clock.tick++],['duplicate-quest',s=>s.snapshot.sessionState.questJournal.push(structuredClone(s.snapshot.sessionState.questJournal.find(q=>q.id==='quest.ashen_reef_survey')))]]){const s=structuredClone(state);mutate(s);reject(label,s);}
 const duplicate=caller(done.snapshot,done.control,REQUEST_ID,new Map());assert.equal(duplicate.acceptedState,null);assert.equal(duplicate.outcome.result.code,'duplicate');
 assert.equal(turnInQuest(state.snapshot,'quest.ashen_reef_survey').snapshot,state.snapshot);
 console.log('caller accepted-only and legacy block PASS');
 // Coordinate forged source facts with all exposed hashes/receipt strings.
 const forged=structuredClone(done);
 const a=forged.snapshot.authorityLedger.soundingsTurnIn;
 const intent=a.requests[0].normalizedIntent;
 const retained=JSON.parse(intent.sourceSnapshot);
 retained.playerState.currency.gold+=100;
 intent.sourceSnapshot=canon(retained);
 retained.authorityLedger.ashenReefSurvey=forged.snapshot.authorityLedger.ashenReefSurvey;
 intent.snapshotFingerprint=hash(retained);
 a.requests[0].canonicalIntent=canon(intent);
 a.results[0].currencyBefore.gold+=100;
 a.consequenceReceipts=buildSoundingsReceipts(a.results[0]);
 const forgedCommand={...command,normalizedIntent:intent,canonicalIntent:canon(intent)};
 const outcome=execute(forged.snapshot,forged.control,forgedCommand);
 console.log('RECOMPUTED_SOURCE_PROBE',JSON.stringify({valid:valid(forged.snapshot),code:outcome.code,duplicate:outcome.duplicate,wallet:forged.snapshot.playerState.currency,claimedBefore:a.results[0].currencyBefore,claimedAfter:a.consequenceReceipts.find(r=>r.kind==='currency_credit').effect.after}));
 assert.equal(valid(forged.snapshot),true);
 assert.equal(outcome.code,'duplicate');
 reject('original-command-vs-forged-history',forged,command);
 const restarted=publishAndRestart(forged.snapshot,forged.control);
 const retry=caller(restarted.snapshot,restarted.control,REQUEST_ID,new Map());
 assert.equal(retry.outcome.result.code,'duplicate');
 assert.equal(retry.acceptedState,null);
 assert.equal(restarted.snapshot.authorityLedger.soundingsTurnIn.results[0].currencyBefore.gold,116);
 console.log('FORGED_SOURCE_PUBLICATION_RESTART_CALLER',JSON.stringify({kind:retry.outcome.kind,code:retry.outcome.result.code,claimedBefore:restarted.snapshot.authorityLedger.soundingsTurnIn.results[0].currencyBefore.gold,wallet:restarted.snapshot.playerState.currency.gold}));
 const falseOrigin=structuredClone(restarted);
 falseOrigin.snapshot.authorityLedger.soundingsTurnIn=structuredClone(done.snapshot.authorityLedger.soundingsTurnIn);
 const r=falseOrigin.snapshot.authorityLedger.soundingsTurnIn.requests[0];
 r.normalizedIntent.sourceArtifactId='artifact.audit.nonexistent';
 r.normalizedIntent.sourcePublicationId='publication.audit.nonexistent';
 r.canonicalIntent=canon(r.normalizedIntent);
 assert.equal(valid(falseOrigin.snapshot),true);
 const originRestart=publishAndRestart(falseOrigin.snapshot,falseOrigin.control);
 const originRetry=caller(originRestart.snapshot,originRestart.control,REQUEST_ID,new Map());
 assert.equal(originRetry.outcome.result.code,'duplicate');
 assert.equal(originRetry.acceptedState,null);
 console.log('NONEXISTENT_SOURCE_IDENTITIES_PUBLICATION_RESTART',originRetry.outcome.result.code);
});
