#!/usr/bin/env node
/** Verify the current Lineage Reforged standalone prototype and its tracked assets.
 * Usage: node docs/prototypes/verify-current-preview.mjs [--hash-assets]
 * No npm packages required. --hash-assets reads all referenced retained PNGs.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath = join(repository, 'docs/prototypes/lineage-reforged-current-preview.manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const previewPath = join(repository, manifest.primary.path);
const bytes = readFileSync(previewPath);
const html = bytes.toString('utf8');

function gitBlobSha(buffer) {
  const h = createHash('sha1');
  h.update(Buffer.from(`blob ${buffer.length}\0`, 'utf8'));
  h.update(buffer);
  return h.digest('hex');
}

assert.equal(bytes.length, manifest.primary.sizeBytes, 'Preview byte length changed; refresh manifest');
assert.equal(gitBlobSha(bytes), manifest.primary.gitBlobSha, 'Preview Git blob SHA changed; refresh manifest');
assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.primary.sha256, 'Preview SHA256 changed');
assert.match(html, /^<!doctype html>/i);
assert.match(html.trimEnd(), /<\/body>\s*<\/html>$/i);
assert.match(html, /<style>[\s\S]*?<\/style>/);
assert.doesNotMatch(html, /<iframe\b|<script\s+src=|<link\s+[^>]*rel=["']stylesheet["']/i,
  'Preview must not become an iframe or external JS/CSS wrapper');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert.equal(scripts.length, 1, 'Expected exactly one self-contained inline script');
new Script(scripts[0][1], { filename: 'lineage-reforged-current-interactive-preview.js' });
assert.ok(html.includes(manifest.images.pinnedImageCommit), 'Pinned artwork source changed');
for (const marker of [
  'const CREATOR_NAME_POOLS=', 'function randomName()', 'function paletteAnchors(key)',
  'function updateCreatorWeather()', 'id="creatorCalendar"', 'id="creatorWeather"',
  'function renderLineage()', 'function renderGeography()', 'const GEO_SETTLEMENT_META',
  'const WORLD_OPTION_GROUPS=', 'id="previewPassword"', 'id="previewStayLoggedIn"',
  'function renderSaveTile(c)', 'function heirDetails(p)', 'function familyTree(c)',
  'function recordPreviewCharacter()', 'Every life has a beginning.',
  'function renderFamilyLibrary(w)', 'function renderFamilyMembers(members)', 'function familyMemberCategory(c)', 'family-tree-button',
  'function familyTreeBody(id,selected)', 'family-tree-scroll', 'function familyResume(members)'
]) assert.ok(html.includes(marker), `Missing creator feature ${marker}`);

const artwork = manifest.images.retainedGeographyArt;
const resources = manifest.images.retainedResourceIcons;
const related = manifest.images.relatedLiveSeasonArtNotLoadedByStandalone;
assert.equal(artwork.length, 100, 'Expected all 100 preserved geographic images in manifest');
assert.equal(resources.length, 8, 'Expected eight resource icon files');
assert.equal(related.length, 6, 'Expected six live season art files');
const allAssets = [...artwork, ...resources, ...related];
assert.equal(new Set(allAssets.map((x) => x.path)).size, allAssets.length, 'Duplicate asset manifest path');
const missing = allAssets.filter((x) => !existsSync(join(repository, x.path)));
assert.deepEqual(missing.map((x) => x.path), [], 'Missing tracked artwork. Make sure repository assets are checked out');

if (process.argv.includes('--hash-assets')) {
  const mismatched = [];
  for (const asset of allAssets) {
    const sourcePath = join(repository, asset.path);
    const data = readFileSync(sourcePath);
    const sha = gitBlobSha(data);
    if (sha !== asset.sha) mismatched.push({ path: asset.path, expected: asset.sha, actual: sha });
    if (asset.bytes !== undefined && statSync(sourcePath).size !== asset.bytes)
      mismatched.push({ path: asset.path, expectedBytes: asset.bytes, actualBytes: statSync(sourcePath).size });
  }
  assert.deepEqual(mismatched, [], 'One or more tracked art assets no longer match the pinned manifest');
}
console.log(JSON.stringify({
  status: 'PASS',
  preview: manifest.primary.path,
  gitBlobSha: manifest.primary.gitBlobSha,
  bytes: bytes.length,
  inlineScript: 'syntax checked',
  assetsPresent: allAssets.length,
  assetHashesChecked: process.argv.includes('--hash-assets')
}, null, 2));
