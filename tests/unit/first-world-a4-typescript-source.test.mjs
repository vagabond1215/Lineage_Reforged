import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { repository } from '../../apps/rpg-ui/build/first-world-source-pack.mjs';
import { verifyWorldSourceV4 } from '../../apps/rpg-ui/build/first-world-source-v4.mjs';

const v4 = verifyWorldSourceV4();

test('the TypeScript successor pins current and archived inputs without changing persisted World bindings', () => {
  assert.equal(v4.count, 9);
  assert.equal(v4.owner.count, 55);
  assert.equal(v4.owner.runtimeFingerprint, 'sha256:90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33');
  assert.equal(v4.workerSource.runtimeFingerprint, v4.owner.parentFingerprint);
  assert.notEqual(v4.sourceFingerprint, v4.owner.runtimeFingerprint);
  for (const changed of [
    'packages/engines/civilization-engine/src/economy.ts',
    'docs/design/first-world-source-history/economy.ts.source',
    'apps/rpg-ui/build/first-world-source-worker.mjs'
  ]) {
    assert.throws(() => verifyWorldSourceV4(path => {
      const bytes = readFileSync(resolve(repository, path));
      return path === changed ? Buffer.concat([bytes, Buffer.from(' ')]) : bytes;
    }), /does not match its pin/);
  }
});

// Run each pack in its own realm. The engine caches loaded content and
// derived state. Historical source is loaded at its original module URL.
const witness = String.raw`
  import { registerHooks } from 'node:module';
  import { fileURLToPath } from 'node:url';
  import { relative } from 'node:path';
  import { createHash } from 'node:crypto';
  import { repository, verifyWorldSourceV2 } from './apps/rpg-ui/build/first-world-source-pack.mjs';
  import { historicalWorldSourceReader, verifyWorldSourceV4 } from './apps/rpg-ui/build/first-world-source-v4.mjs';

  const historical = process.argv[1] === 'historical';
  const source = historical ? verifyWorldSourceV2(historicalWorldSourceReader()) : verifyWorldSourceV4().workerSource;
  if (historical) {
    registerHooks({
      load(url, context, nextLoad) {
        if (url.startsWith('file:') && url.endsWith('.ts')) {
          const path = relative(repository, fileURLToPath(url)).replaceAll('\\', '/');
          const bytes = source.bytes.get(path);
          if (bytes) return { format: 'module-typescript', source: bytes.toString('utf8'), shortCircuit: true };
        }
        return nextLoad(url, context);
      },
    });
  }

  const { prepareDurableChronicleWorld } = await import('./apps/rpg-ui/src/game-shell/firstWorldDurableRegistry.ts');
  const { prepareWorldSourceCandidate } = await import('./apps/rpg-ui/src/game-shell/world-source/candidate.mjs');
  const { createInitialClock } = await import('./packages/shared/time/src/index.js');
  const { buildStarfallBaseEconomyPreview } = await import('./packages/engines/civilization-engine/src/starfall-base-economy.js');
  const template = source.bytes.get(source.templatePath).toString('utf8');
  const raw = buildStarfallBaseEconomyPreview(createInitialClock());
  const result = [];
  for (const generation of [1, 3]) {
    const input = {
      account: { accountId: 'a4.equivalence', revision: 4, lifecycleGeneration: generation },
      expectedAccountRevision: 4,
      expectedAccountGeneration: generation,
      creationIntentId: 'world.create.a4.equivalence.' + generation,
      proposedWorldInstanceId: 'world.instance.a4.equivalence.' + generation,
      displayName: 'Equivalence world ' + generation,
      createdAt: '2026-11-23T12:00:00.000Z',
    };
    const durable = await prepareDurableChronicleWorld({ ...input, sourceTemplateJson: template });
    const prepared = await prepareWorldSourceCandidate(source, template, { input });
    const rebuilt = await prepareWorldSourceCandidate(source, template, { retained: prepared.compact });
    result.push({ durable, prepared, rebuilt });
  }
  // Preserve keys with explicit undefined values in the raw engine projection.
  const output = JSON.stringify({ raw, result }, (_, value) =>
    value === undefined ? { $explicitUndefined: true } : value);
  process.stdout.write(createHash('sha256').update(output).digest('hex') + '\n' + output);
`;

test('archived and successor engines produce exact raw, portable and rebuilt genesis output', () => {
  const run = mode => execFileSync(process.execPath,
    [...process.execArgv, '--input-type=module', '-e', witness, mode],
    { cwd: repository, maxBuffer: 32 * 1024 * 1024, encoding: 'utf8' });
  const before = run('historical');
  const after = run('successor');
  const divider = before.indexOf('\n');
  assert.ok(divider > 0);
  const digest = output => output.slice(0, output.indexOf('\n'));
  assert.equal(digest(after), digest(before), 'full, raw and portable projection digest changed');
  assert.equal(after, before, 'canonical output differs despite matching digests');
  const witnessResult = JSON.parse(after.slice(divider + 1));
  for (const { durable, prepared, rebuilt } of witnessResult.result) {
    assert.equal(durable.world.economyState.economyTick, 0);
    assert.deepEqual(durable.world.economyState.projection.economy, prepared.compact.economy.ledger);
    assert.equal(rebuilt.projectionFingerprint, prepared.projectionFingerprint);
    assert.equal(rebuilt.portableProjectionFingerprint, prepared.portableProjectionFingerprint);
  }
});
