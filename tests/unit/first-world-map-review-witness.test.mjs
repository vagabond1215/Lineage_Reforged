import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const content = join(repo, 'packages/content/base/world');
const ui = join(repo, 'apps/rpg-ui');
function json(name) {
  return JSON.parse(readFileSync(join(content, name), 'utf8').replace(/^\uFEFF/, ''));
}
const map = json('world_maps.json').records[0];
const settlements = json('settlements.json').records;
const routes = json('travel_networks.json').records[0];
const visual = json('world_map_features.json').records[0];
const byId = new Map(settlements.map((s) => [s.id,s]));
const W = 2048, H = 1152;
function pngDimensions(path) {
  const bytes = readFileSync(path);
  assert.equal(bytes.subarray(0,8).toString('hex'), '89504e470d0a1a0a', 'PNG file signature');
  assert.equal(bytes.toString('ascii',12,16),'IHDR','PNG IHDR chunk');
  return {w:bytes.readUInt32BE(16), h:bytes.readUInt32BE(20)};
}

test('reference frame, canonical marker points and route identities remain source-based', () => {
  assert.equal(map.scaleProfile.referenceImageWidthPx, W);
  assert.equal(map.scaleProfile.referenceImageHeightPx, H);
  assert.equal(settlements.length,88);
  assert.equal(routes.routeRecords.length,12);
  assert.equal(routes.interPortShipRoutes.length,8);
  for (const site of settlements) {
    assert.ok(Number.isFinite(site.visualMapRef?.pixelX),site.id+' pixelX');
    assert.ok(Number.isFinite(site.visualMapRef?.pixelY),site.id+' pixelY');
    assert.ok(site.visualMapRef.pixelX>=0 && site.visualMapRef.pixelX<W,site.id+' x in frame');
    assert.ok(site.visualMapRef.pixelY>=0 && site.visualMapRef.pixelY<H,site.id+' y in frame');
  }
  for (const route of [...routes.routeRecords,...routes.interPortShipRoutes]) {
    assert.ok(byId.has(route.fromSettlementId),route.id+' start identity');
    assert.ok(byId.has(route.toSettlementId),route.id+' end identity');
  }
});

test('raster images are either normalized source frame or explicit legacy source rectangle candidates', () => {
  const box=map.assetReferenceRectPx;
  for(const file of ['First World Biome.png','First World Elevation.png']){
    const {w,h}=pngDimensions(join(content,'map_assets',file));
    const normalized=w===W && h===H;
    const legacy=box && w>=box.x+box.width && h>=box.y+box.height;
    assert.ok(normalized||legacy,file+' requires manual registration: '+w+'x'+h);
  }
});

test('atlas source includes all authored visual classes, including non-point geographic identities', () => {
  assert.equal(visual.regionFootprints.length,159);
  assert.equal(visual.riverFeatures.length,8);
  assert.equal(visual.mountainFeatures.length,5);
  assert.equal(visual.passFeatures.length,4);
  assert.equal(visual.crossingFeatures.length,6);
});

test('review-only viewer entrypoints parse and stay isolated from the gameplay entrypoint', () => {
  const html=readFileSync(join(ui,'world-map-review.html'),'utf8');
  const js=readFileSync(join(ui,'world-map-review.js'),'utf8');
  assert.match(html,/id="cursor"/);
  assert.match(html,/id="baseLayer"/);
  assert.match(html,/id="addCheckpoint"/);
  assert.match(html,/world-map-review\.js/);
  assert.match(js,/domesticTradeFlows/);
  assert.match(js,/localStorage/);
  assert.match(js,/routeWaypoints/);
  assert.doesNotMatch(js,/fetch\s*\(\s*['"]\/api\/|saveGame|writeFileSync/);
  execFileSync(process.execPath,['--check',join(ui,'world-map-review.js')],{stdio:'pipe'});
});
