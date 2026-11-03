import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const appRoot = resolve(import.meta.dirname, '..');
const stagingOrigin = 'https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site';

function builtEntry(directory) {
  const output = directory === 'native-staging'
    ? resolve(appRoot, 'dist-native-v3-staging') : resolve(appRoot, 'dist', 'client');
  const html = readFileSync(resolve(output, 'index.html'), 'utf8');
  const script = readdirSync(resolve(output, 'assets')).find(name => name.endsWith('.js'));
  assert.ok(script, `${directory} has a client entry`);
  return { html, javascript: readFileSync(resolve(output, 'assets', script), 'utf8') };
}

test('native staging and default v2 builds have distinct entry artifacts', () => {
  const staging = builtEntry('native-staging');
  const normal = builtEntry('client');
  assert.match(staging.html, /Native V3 Staging/);
  assert.match(normal.html, /Lineage: Reforged RPG UI/);
  assert.notEqual(staging.html, normal.html);
  assert.ok(staging.javascript.includes(stagingOrigin));
  assert.ok(!normal.javascript.includes(stagingOrigin));
  assert.ok(!staging.javascript.includes('synthetic-only-password'));
  assert.ok(!staging.javascript.includes('account.native.selected.qa.'));
  assert.ok(!normal.html.includes('native-v3-staging'));
});
