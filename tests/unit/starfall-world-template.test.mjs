import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function records(relativePath) {
  const source = readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8');
  return JSON.parse(source.replace(/^\uFEFF/, '')).records;
}

const template = JSON.parse(readFileSync(
  new URL('../../packages/content/base/world/templates/starfall_port_chronicle_v1.json', import.meta.url), 'utf8'
));
const find = (rows, id) => rows.find(record => record.id === id);
const identity = template.immutableIdentity;

test('Starfall World seed references the existing First World and canonical place owners', () => {
  assert.equal(template.format, 'lineage-reborn.starfall-world-seed.v1');
  assert.equal(template.lifecycle, 'authored_draft_unregistered');
  assert.equal(template.runtimeEligible, false);
  const map = find(records('packages/content/base/world/world_maps.json'), identity.worldBlueprintId);
  const region = find(records('packages/content/base/world/regions.json'), identity.startRegionId);
  const locality = find(records('packages/content/base/world/region_localities.json'), identity.startLocalityBandId);
  const hex = find(records('packages/content/base/world/world_hexes.json'), identity.startWorldHexId);
  const settlement = find(records('packages/content/base/world/settlements.json'), identity.startSettlementId);
  assert.ok(map && region && locality && hex && settlement, 'all source geography exists');
  assert.equal(region.parentRegionId, template.sourceGeography.parentMacroRegionId);
  assert.equal(locality.regionId, region.id);
  assert.equal(locality.macroRegionId, region.parentRegionId);
  assert.equal(hex.regionId, region.id);
  assert.equal(hex.localityBandId, locality.id);
  assert.ok(hex.anchoredSettlementIds.includes(settlement.id));
  assert.equal(settlement.regionId, region.id);
  assert.equal(settlement.hexAnchorId, hex.id);
  assert.equal(settlement.localityBandId, locality.id);
  assert.equal(identity.worldKind, 'individual');
  assert.equal(identity.progressionMode, 'chronicle');
});

test('all travel links exist but none is promoted into a local executable exit', () => {
  const hexEdges = records('packages/content/base/world/world_hex_edges.json');
  const travelNetwork = find(records('packages/content/base/world/travel_networks.json'), 'travel_network.first_world');
  assert.ok(travelNetwork);
  const routes = [...(travelNetwork.routeRecords ?? []), ...(travelNetwork.interPortShipRoutes ?? [])];
  assert.equal(template.travelLinks.length, 5);
  for (const link of template.travelLinks) {
    const record = find(link.kind === 'macro_hex_road' ? hexEdges : routes, link.id);
    assert.ok(record, `missing canonical travel link: ${link.id}`);
    assert.equal(link.localExitEnabled, false);
    if (link.kind === 'macro_hex_road') {
      assert.equal(record.fromHexId, identity.startWorldHexId);
      assert.equal(record.toHexId, link.toHexId);
    } else {
      assert.ok(
        record.fromSettlementId === identity.startSettlementId ||
          record.toSettlementId === identity.startSettlementId,
        'sea route must touch the starting settlement'
      );
      assert.ok(link.allowedModeIds.every(mode => record.availableModeIds.includes(mode)));
    }
  }
  assert.ok(template.localAreaBlueprint.exitCandidates.every(exit =>
    exit.targetTemplateId === null && exit.status.startsWith('disabled_')));
});

test('local authored grid is rectangular and completely walk-connected from the start', () => {
  const { grid, entry, landmarkMarkers } = template.localAreaBlueprint;
  assert.equal(grid.width, 28);
  assert.equal(grid.height, 18);
  assert.equal(grid.rows.length, grid.height);
  assert.ok(grid.rows.every(row => row.length === grid.width));
  const isWalk = (x, y) => Boolean(grid.palette[grid.rows[y]?.[x]]?.walkable);
  assert.ok(isWalk(entry.x, entry.y));
  for (const marker of landmarkMarkers) {
    assert.ok(isWalk(marker.x, marker.y), `unreachable marker tile: ${marker.id}`);
    assert.equal(marker.usable, false);
  }
  const total = grid.rows.flatMap(row => [...row]).filter(char => grid.palette[char]?.walkable).length;
  const found = new Set();
  const queue = [[entry.x, entry.y]];
  while (queue.length) {
    const [x, y] = queue.pop();
    if (x < 0 || y < 0 || x >= grid.width || y >= grid.height ||
        !isWalk(x, y) || found.has(`${x},${y}`)) continue;
    found.add(`${x},${y}`);
    queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }
  assert.equal(found.size, total, 'the static area must not include isolated walkable islands');
  assert.ok(total > 250);
  assert.equal(grid.palette['~'].walkable, false, 'water is not a footpath');
  assert.equal(grid.palette['#'].walkable, false, 'building footprints are not assumed interiors');
});

test('a fresh Starfall seed is empty, and unsupported services/spawns remain unavailable', () => {
  const init = template.proposedInstanceSeed;
  for (const key of ['accountId', 'worldInstanceId', 'creationIntentId', 'createdAt',
    'displayName', 'sourceManifestFingerprint']) assert.equal(init[key], null);
  assert.equal(init.sourceTemplateId, template.templateId);
  assert.equal(init.sourceTemplateVersion, template.templateVersion);
  assert.equal(init.worldRevision, 0);
  assert.equal(init.clock.elapsedWorldSeconds, 0);
  assert.equal(init.rules.progressionMode, 'chronicle');
  assert.equal(init.rules.hardcore, false);
  assert.equal(init.rules.timePolicy.allowsPlayerTimeSkip, false);
  for (const [key, value] of Object.entries(init)) {
    if (Array.isArray(value)) assert.deepEqual(value, [], `${key} must start empty`);
  }
  const area = template.localAreaBlueprint;
  for (const key of ['placedNpcInstances', 'placedResourceInstances', 'placedMonsterInstances',
    'activeEncounterSpawnZones', 'craftingStations', 'serviceProviders', 'interactableSiteInstances']) {
    assert.deepEqual(area[key], [], `${key} cannot be fabricated from macro data`);
  }
  assert.ok(!records('packages/content/base/world/spawn_profiles.json').some(profile =>
    profile.regionIds?.includes(identity.startRegionId)));
  assert.equal(template.sourceGeography.actualCurrentWeather, null);
  assert.equal(area.localWeatherOverride, null);
  assert.ok(template.pendingOwners.length > 0, 'record outstanding runtime owners');
});
