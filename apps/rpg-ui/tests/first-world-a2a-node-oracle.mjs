import { verifyWorldSourceV2 } from '../build/first-world-source-pack.mjs';
import { prepareWorldSourceCandidate } from '../src/game-shell/world-source/candidate.mjs';

const source = verifyWorldSourceV2();
const template = source.bytes.get(source.templatePath).toString('utf8');
const input = {
  account: { accountId: 'world.a1.account.alpha', revision: 1, lifecycleGeneration: 1 },
  expectedAccountRevision: 1,
  expectedAccountGeneration: 1,
  creationIntentId: 'world.create.a1.alpha',
  proposedWorldInstanceId: 'world.instance.a1.alpha',
  displayName: 'First World A1',
  createdAt: '2026-11-22T00:00:00.000Z',
};
const result = await prepareWorldSourceCandidate(source, template, { input });
const sourceBytes = source.contentPins.reduce((total, pin) => total + source.bytes.get(pin.path).byteLength, 0);
console.log(JSON.stringify({ input, expected: { ...result, sourceBytes } }));
