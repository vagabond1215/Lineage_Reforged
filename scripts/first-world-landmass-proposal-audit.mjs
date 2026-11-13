#!/usr/bin/env node
/**
 * R0-R3 pending-only Kaelvar proposal integrity check.
 * Usage: node scripts/first-world-landmass-proposal-audit.mjs --check > report.json
 * No raster interpretation, mask generation, canonical writes or owner approvals.
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {verifyAuditedTextBlob} from './lib/first-world-source-identity.mjs';
import {validateLandmassProposalLedger} from './lib/first-world-landmass-proposal-ledger.mjs';

if (process.argv.length !== 3 || process.argv[2] !== '--check') {
  console.error('Usage: --check (stdout JSON, no writes)');
  process.exit(2);
}
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = path => readFileSync(resolve(root,path));
const load = path => JSON.parse(read(path).toString('utf8').replace(/^\uFEFF/,''));
const ledger = load('docs/design/first-world-kaelvar-landmass-reconstruction-ledger-2026-11-13.json');
const sourceBytes = read('packages/content/base/world/world_map_features.json');
const source = JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(r=>r.mapId === 'world_map.first_world');
const map = load('packages/content/base/world/world_maps.json').records
  .find(r=>r.id === 'world_map.first_world');
const regions = load('packages/content/base/world/regions.json').records;
const exclusionsPath='docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json';
const exclusionBytes=read(exclusionsPath);
const exclusions=JSON.parse(exclusionBytes.toString('utf8').replace(/^\uFEFF/,'')).removedSourceFeatureIds;
const exclusionManifestIdentity=verifyAuditedTextBlob(
  exclusionBytes,'e3297ead12a6a5ce045418140b043c3fa2b8fcb3');
if (!map || !source || source.coastlines?.length !== 68 ||
    ![159,201].includes(source.regionFootprints?.length))
  throw Error('First World canonical source geometry inventory drift');
const sourceIdentity=verifyAuditedTextBlob(sourceBytes,ledger.immutableEvidence.sourceGeometryGitBlob);
const sourceImages={};
for (const layer of ['biome','elevation']) {
  const path = map.layerAssetPaths[layer];
  if (typeof path !== 'string' || !path.startsWith('packages/content/base/world/map_assets/'))
    throw Error('Source asset path drift: '+layer);
  const bytes = read(path);
  if (bytes.subarray(0,8).toString('hex') !== '89504e470d0a1a0a' ||
      bytes.toString('ascii',12,16) !== 'IHDR')
    throw Error('Invalid original PNG header: '+layer);
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const expected = ledger.immutableEvidence[layer+'PngSha256'];
  if (sha256 !== expected || width !== 4096 || height !== 2355)
    throw Error('Native source PNG identity changed: '+layer);
  sourceImages[layer] = {path,sha256,originalWidth:width,originalHeight:height};
}
if (map.assetReferenceRectPx?.x !== 60 || map.assetReferenceRectPx?.y !== 60 ||
    map.assetReferenceRectPx?.width !== 3976 ||
    map.assetReferenceRectPx?.height !== 2235 ||
    source.referenceImageWidthPx !== 2048 ||
    source.referenceImageHeightPx !== 1152)
  throw Error('Registration/crop reference drift');
const verdict = validateLandmassProposalLedger({
  ledger,regions,sourceFootprints:source.regionFootprints,
  approvedExclusionIds:exclusions,
});
process.stdout.write(JSON.stringify({
  ...verdict,
  sourceIdentity,
  exclusionManifestIdentity,
  sourceImages,
  registeredCrop:map.assetReferenceRectPx,
  sourceFeatureCount:source.regionFootprints.length,
  acceptedExclusions:exclusions.length,
  effectiveFootprints:source.regionFootprints.length-exclusions.length,
  coastlineRecords:source.coastlines.length,
  stage:'R0_R2_PENDING__R3_NO_MASKS',
  sourceWritable:false,
  testsNotExecutedByConnector:true,
},null,2)+'\n');
