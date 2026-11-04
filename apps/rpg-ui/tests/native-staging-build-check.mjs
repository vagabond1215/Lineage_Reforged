import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { CHARACTER_CREATOR_ASSET_BASE_URL, resolveCharacterCreatorAssetUrl } from '../src/game-shell/characterCreatorAssetUrl.ts';

const appRoot = resolve(import.meta.dirname, '..');
const stagingOrigin = 'https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site';
const publicRoot = resolve(appRoot, 'public');
const stagingOutput = resolve(appRoot, 'dist-native-v3-staging');

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = resolve(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : entry.isFile() ? [file] : [];
  });
}

function relativeFiles(directory) {
  return filesUnder(directory).map(file => relative(directory, file).replaceAll('\\', '/')).sort();
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

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

test('every authored creator image resolves to its pinned production source', () => {
  const catalogs = [
    readFileSync(resolve(appRoot, 'src/game-shell/characterCreationCatalog.ts'), 'utf8'),
    readFileSync(resolve(appRoot, 'src/game-shell/worldSelectionCatalog.ts'), 'utf8')
  ].join('\n');
  const paths = new Set([...catalogs.matchAll(/\/character-creator\/[\w/-]+\.png/g)].map(([match]) => match.slice(1)));
  const settlements = catalogs.match(/const SETTLEMENT_CARD_ART_IDS = \[([\s\S]*?)\] as const;/)?.[1];
  assert.ok(settlements, 'the dynamic settlement asset catalog is present');
  for (const [, slug] of settlements.matchAll(/"settlement\.([\w]+)"/g)) {
    paths.add(`character-creator/settlements/settlement-${slug.replaceAll('_', '-')}.png`);
  }
  const sourceFiles = relativeFiles(resolve(publicRoot, 'character-creator')).map(file => `character-creator/${file}`);
  assert.equal(paths.size, 128);
  assert.deepEqual([...paths].sort(), sourceFiles);
  for (const file of paths) {
    assert.equal(resolveCharacterCreatorAssetUrl(`/${file}`, { production: true }), `${CHARACTER_CREATOR_ASSET_BASE_URL}/${file}`);
    assert.equal(resolveCharacterCreatorAssetUrl(`/${file}`, { production: false }), `/${file}`);
  }
});

test('staging output retains every other public asset without duplicate creator images or QA entry', () => {
  const sourceFiles = relativeFiles(publicRoot);
  const retained = sourceFiles.filter(file => !file.startsWith('character-creator/'));
  const staged = relativeFiles(stagingOutput);
  assert.equal(sourceFiles.length - retained.length, 128);
  assert.ok(!existsSync(resolve(stagingOutput, 'character-creator')));
  for (const file of retained) {
    const output = resolve(stagingOutput, file);
    assert.ok(existsSync(output), `missing retained asset: ${file}`);
    assert.equal(sha256(output), sha256(resolve(publicRoot, file)), `changed retained asset: ${file}`);
  }
  assert.deepEqual(staged.filter(file => file.endsWith('.html')), ['index.html']);
  assert.deepEqual(staged.filter(file => !file.startsWith('assets/') && file !== 'index.html'), retained);
  assert.ok(!readFileSync(resolve(stagingOutput, 'index.html'), 'utf8').includes('\r'));
});
