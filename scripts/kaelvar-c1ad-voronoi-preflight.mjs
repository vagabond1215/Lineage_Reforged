#!/usr/bin/env node
/** C1-AD Voronoi provenance and original-source-native read-only gates. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateC1ADVoronoiPreflight}
 from './lib/kaelvar-c1ad-voronoi-preflight.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=p=>JSON.parse(readFileSync(join(root,p),'utf8').replace(/^\uFEFF/,''));
const sha256=p=>createHash('sha256').update(readFileSync(join(root,p))).digest('hex');
export function runVoronoiPreflight(){
 const policy=read('docs/design/kaelvar-c1ad-voronoi-provenance-and-geographic-region-preflight-2026-11-15.json');
 const c1ac=read('docs/design/kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json');
 const c1aa=read('docs/design/kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json');
 validateC1ADVoronoiPreflight(policy,c1ac,c1aa);
 const b='packages/content/base/world/map_assets/First World Biome.png',
   e='packages/content/base/world/map_assets/First World Elevation.png',
   s=policy.ownerOverlay.referenceSvg;
 if(sha256(b)!==policy.exactSource.originalBiomeSha256||
  sha256(e)!==policy.exactSource.originalElevationSha256||
  sha256(s)!==policy.ownerOverlay.referenceSvgSha256)
  throw Error('C1-AD VORONOI HOLD: original source PNG or screenshot ink reference SVG drifted');
 return {
  status:'C1AD_VORONOI_CELL_PROVENANCE_DOCUMENTED_SAVE_AND_REGION_ADOPTION_HELD',
  originalSourceRasterWitnessesVerified:true,
  sourceMatchedVoronoiMesh:false,
  screenshotDistrictInkPrimaryGeometryAuthority:false,
  simulatorProvenance:policy.sourceEvidence.generator,
  hierarchy:policy.sourceEvidence.hierarchy.map(x=>x.level),
  recoveredVoronoiCellCount:null,
  noProvisionalBorderSelection:true,
  acceptedC1PAssignedCandidateCells:policy.exactSource.acceptedC1PAssigned,
  acceptedC1PUnassignedCandidateCells:policy.exactSource.acceptedC1PUnassigned,
  detachedComponentClaims:0,
  canonicalWritable:false
 };
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv[2]!=='--check')
  throw Error('Usage: node scripts/kaelvar-c1ad-voronoi-preflight.mjs --check');
 process.stdout.write(JSON.stringify(runVoronoiPreflight(),null,2)+'\n');
}
