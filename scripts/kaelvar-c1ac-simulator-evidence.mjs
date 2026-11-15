#!/usr/bin/env node
/**
 * C1-AC owner-supplied Fantasy Map Simulator screenshot witness.
 * Read-only; never assigns physical terrain, regions, islands or canonical owners.
 * --check validates committed source/semantic receipt without screenshot bytes.
 * --verify-dir <directory> verifies 11 original PNGs from owner review archive.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng} from './lib/kaelvar-c1f-source-png.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=path=>JSON.parse(readFileSync(join(root,path),'utf8').replace(/^\uFEFF/,''));
const sha256=buf=>createHash('sha256').update(buf).digest('hex');
const expectSource={
 biome:'9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
 elevation:'02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d',
 vector:'9cd6752e9dbca00796e5a96175'
};
// Keep the exact source vector SHA in the manifest separate from this
// script's registered PNG checks; never infer meaning from generated ink.
const expectedNames=[
 '01-world-biome-no-heavy-outline.png',
 '02-world-biome-heavy-outline.png',
 '03-world-biome-thin-outline.png',
 '04-world-elevation-gray-thin-outline.png',
 '05-world-elevation-gray-no-outline.png',
 '06-world-elevation-gray-heavy-outline.png',
 '07-kaelvar-elevation-gray-crop.png',
 '08-kaelvar-biome-crop.png',
 '09-kaelvar-biome-high-detail.png',
 '10-kaelvar-elevation-gray-high-detail.png',
 '11-kaelvar-owner-district-proposal.png'
];
const expectedRegions=[
 ['region.veyrholm_shore',[6,0,112],7312],
 ['region.auric_marches',[191,71,0],7121],
 ['region.kharuun_drylands',[191,0,0],1052],
 ['region.verdant_thalos',[0,89,15],7802],
 ['region.shattercap_isles',[188,16,107],8241]
];
const expectedHeld=[
 'KHARUUN_OPTION_B_35_58','VEYRHOLM_EXCLUSIONS','VERDANT_SE_PENINSULA',
 'NORTHEAST_HEADLAND_75_115','PHYSICAL_COMPONENT_51','SHATTERCAP_DETACHED_ISLANDS',
 'LARGE_NORTHEAST_ISLAND','ALL_OTHER_DETACHED_PHYSICAL_COMPONENTS','COAST_40',
 'SERATHYL_WINDWARD','CANONICAL_PUBLICATION'
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=s=>{throw Error('C1-AC simulator evidence HOLD: '+s);};
export function validateC1ACOwnerViewManifest(m,c1aa){
 const s=m?.sourceProvenance,editor=m?.districtEditor,r=m?.registration,
  a=m?.authoringPolicy,c=m?.provisionalCandidateComparison;
 if(m?.schemaVersion!==1||
  m.type!=='KAELVAR_C1AC_OWNER_SIMULATOR_MULTI_VIEW_SOURCE_EVIDENCE_V1'||
  m.status!=='OWNER_PROPOSED_SIMULATOR_DISTRICT_VISUAL_REGISTERED_NOT_NATIVE_POLYGON_AUTHORITY'||
  m.repositorySourceBase!=='8739aa02431f6ed61a5f4076c4af9be7881cd55a'||
  s?.application!=='Fantasy Map Simulator'||s.platform!=='Steam'||
  s.steamAppId!==3035500||
  s.originalFirstWorldBiomeSHA256!==expectSource.biome||
  s.originalFirstWorldElevationSHA256!==expectSource.elevation||
  s.originalVectorBlob!=='9cd6752e9dbca00796e5a96175'||
  !same(s.sourceOriginalPngSize,[4096,2355])||
  !same(s.originalCrop,[60,60,3976,2235])||
  !same(s.referenceGrid,[2048,1152])||
  s.referenceRasterFilesChanged!==false||
  s.simulatorSaveMatchedToSource!==false||
  s.ordinalHeightOwnerAssumption!=='ORANGE_RED_RELATIVELY_HIGHER_CREAM_RELATIVELY_LOWER'||
  s.calibratedHeightAvailable!==false||
  s.registeredRidgeOrWatershedCertified!==false||
  m.screenshotBytesPersistedInGit!==false||
  m.screenshotArchiveSha256!=='b3f564438c3f18bc802818e4667024fc2e0654dd0f3387ff94a0308f77473be4'||
  m.screenshotManifest?.length!==11||
  !same(m.screenshotManifest.map(x=>x.filename),expectedNames)||
  m.screenshotManifest.some((x,i)=>x.order!==i+1||
    !/^[a-f0-9]{64}$/.test(x.sha256)||x.sizeBytes<200000||
    x.dimensions?.length!==2||x.dimensions.some(v=>!Number.isInteger(v)||v<1000)||
    x.source!=='USER_UPLOAD_ORIGINAL_PNG_BYTES')||
  editor?.screenshotOrder!==11||
  editor.toolTitle!=='MAP EDITOR'||editor.selector!=='Edit District'||
  editor.visiblePageLabel!=='Page 11 of 11'||
  !same(editor.legend?.map(x=>[x.regionId,x.exactScreenshotInkRGB,x.restrictedRoiInkPixels]),
    expectedRegions)||
  editor.lineIsInkNotOwnerResolvedPolygon!==true||
  editor.visibleLegendNotProofOfCompleteGlobalDistrictList!==true||
  r?.method!=='SIFT feature matching with affine-partial RANSAC, source-raster-corroborated'||
  r.stages?.length!==4||
  r.stages.some(x=>x.inliers<180||x.p95ResidualPixels>2||
    x.affine?.length!==3)||
  !same(r.editorToSourceReferenceApprox,[
    [0.363452,-0.000010,30.606672],
    [0.000010,0.363805,99.900773],
    [0,0,1]])||
  r.sourceImageRegistrationStatus!=='HIGH_CONFIDENCE_VIEW_ALIGNMENT_NOT_POLYGON_OR_LANDFORM_CERTIFICATION'||
  r.pixelLevelTraceRequiresIndependentVisualReview!==true||
  c?.sourceProposal!=='docs/design/kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json'||
  !same(c.nearestMatchingEditorInkScreenshotPixelDistance, {
    northVeyrholmAtCandidateVertices:[68.1,41.0,20.0,11.0],
    southVerdantAtCandidateVertices:[44.0,5.8,9.4,3.2]})||
  c.replaceEarlierSharedSeamsAutomatically!==false||
  a?.regionNotPoliticalTerritory!==true||
  a.eventualPrimaryRegionPerFinalizedLandPoint!=='EXACTLY_ONE'||
  a.optionalEnvironmentalTransitionInfluences!==true||
  a.noAutomaticTransitionBandWidth!==true||
  a.sourceRasterOrVectorMutations!==0||
  a.acceptedC1POrC1AASharedChainMutations!==0||
  a.originalTerrainComponentRelabels!==0||
  a.newlyAssignedIslands!==0||
  a.canonicalPublication!==false||
  a.ownerVisualReconciliationStillRequired!==true||
  !same(m.holds,expectedHeld))
  fail('screenshot identities, transformation, source hashes or geography holds drifted');
 if(c1aa?.type!=='C1AA_RELATIVE_RELIEF_SHARED_SEAMS_REVIEW_ONLY'||
  c1aa.canonicalWritable!==false||
  c1aa.acceptedC1PChanged!==false||
  c1aa.physicalLabelsChanged!==false||
  !same(c1aa.candidates.map(x=>[x.id,x.sharedChain]),[
   ['NORTH_APPROXIMATE_COASTAL_TRANSITION',[[279,197],[291,192],[301,188],[308,185]]],
   ['SOUTH_APPROXIMATE_UPLAND_APRON',[[304,330],[320,331],[338,332],[352,333]]]
  ]))
  fail('preceding C1-AA native trial geometry changed under screenshot evidence');
 return true;
}
export function verifyC1ACOriginalScreenshots(m,dir){
 if(typeof dir!=='string'||!dir.trim())fail('owner screenshot extraction directory required');
 const base=resolve(dir);
 if(!lstatSync(base).isDirectory())fail('not a screenshot directory');
 const results=[];
 for(const w of m.screenshotManifest){
  const path=join(base,w.filename),st=lstatSync(path);
  if(!st.isFile()||st.isSymbolicLink()||st.size!==w.sizeBytes)
   fail('screenshot missing, symlinked or byte-size mismatched: '+w.filename);
  const bytes=readFileSync(path);
  if(sha256(bytes)!==w.sha256)fail('screenshot exact SHA256 changed: '+w.filename);
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
  if(!same([width,height],w.dimensions))
   fail('screenshot PNG original dimensions changed: '+w.filename);
  results.push({name:w.filename,bytes:bytes.length,sha256:w.sha256,dimensions:w.dimensions});
 }
 const editor=decodeSourcePng(readFileSync(join(base,expectedNames[10])));
 if(editor.width!==1919||editor.height!==1079)
  fail('district source screenshot unrecognized');
 const found=[];
 for(const row of m.districtEditor.legend){
  const [R,G,B]=row.exactScreenshotInkRGB;
  let count=0;
  for(let y=5;y<900;y++)for(let x=10;x<1415;x++){
   const p=(y*editor.width+x)*4;
   if(editor.rgba[p]===R&&editor.rgba[p+1]===G&&editor.rgba[p+2]===B)
    count++;
  }
  if(count!==row.restrictedRoiInkPixels)
   fail('district ink RGB sample mismatch '+row.regionId);
  found.push({regionId:row.regionId,exactRgbLinePixels:count});
 }
 return {status:'EXACT_ELEVEN_OWNER_SCREENSHOTS_VERIFIED_NOT_CANONICAL',
  verifiedScreenshotBytes:results.reduce((a,b)=>a+b.bytes,0),
  originalScreenshots:results,registeredDistrictInk:found,
  regionAssignmentChanged:false,physicalComponentsChanged:false,sourcePngChanged:false};
}
function run(){
 const m=json('docs/design/kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json');
 const c=json('docs/design/kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json');
 validateC1ACOwnerViewManifest(m,c);
 for(const [layer,expected] of [
  ['Biome',expectSource.biome],['Elevation',expectSource.elevation]
 ]){
  const bytes=readFileSync(join(root,'packages/content/base/world/map_assets/First World '+layer+'.png'));
  if(sha256(bytes)!==expected)fail('original registered '+layer+' PNG hash changed');
 }
 const out={
  status:'C1AC_OWNER_SIMULATOR_VISUAL_REVIEW_ONLY_ORIGINAL_SOURCE_VERIFIED',
  sourceOriginalRasterHashesVerified:true,
  registrationMethod:m.registration.method,
  stageCounts:m.registration.stages.map(x=>x.inliers),
  colorRegionNames:m.districtEditor.legend.map(x=>x.regionId),
  sourceImageFilesChanged:false,
  originalC1AARegionChainsChanged:false,
  canonicalWritable:false
 };
 if(process.argv[2]==='--verify-dir'){
  Object.assign(out,{verifiedCapture:verifyC1ACOriginalScreenshots(m,process.argv[3])});
 } else if(process.argv[2]!=='--check'){
  throw Error('Usage: node scripts/kaelvar-c1ac-simulator-evidence.mjs --check | --verify-dir <unpacked_owner_png_directory>');
 }
 process.stdout.write(JSON.stringify(out,null,2)+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))run();
