import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng} from '../../scripts/lib/first-world-source-png.mjs';
import {buildKaelvarCandidateComparison,kaelvarCandidateComparisonSvg}
  from '../../scripts/lib/first-world-kaelvar-candidate-comparison.mjs';

const width=9,height=6;
const polygon=(id,regionId,x,y,w=1,h=1)=>({id,regionIds:[regionId],
  points:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}]});
const shattercap=Array.from({length:15},(_,i)=>
  polygon('feature.region_shattercap_isles.part_'+(i+1),
    'region.shattercap_isles',i%9,Math.floor(i/9)));
const footprints=[
  ...shattercap,
  polygon('feature.region_auric_marches.part_4','region.auric_marches',0,3,5,2),
  polygon('feature.region_verdant_thalos.part_1','region.verdant_thalos',4,4,5,2),
  polygon('feature.region_windward_spine.part_1','region.windward_spine',7,2),
];
const regions=[
  {id:'region.auric_marches',positionLabel:'kaelvar_western_interior',
    environmentProfile:{dominantBiomeMix:['steppe'],elevationProfile:'plateau'}},
  {id:'region.verdant_thalos',positionLabel:'kaelvar_southern_peninsula',
    environmentProfile:{dominantBiomeMix:['mixed_forest'],elevationProfile:'low_hills'}},
  {id:'region.shattercap_isles',positionLabel:'kaelvar_northern_coast',
    environmentProfile:{dominantBiomeMix:['conifer_islands'],elevationProfile:'rugged_islands'}},
  {id:'region.windward_spine',positionLabel:'serathyl_northern_mountains',
    environmentProfile:{dominantBiomeMix:['alpine'],elevationProfile:'mountain_chain'}},
];
const classification=new Uint8Array(width*height).fill(1);
classification[0]=0; // All-blue Part 1 source artifact test case.
const terrainLabels=new Uint32Array(width*height).fill(30);
terrainLabels[0]=0;terrainLabels[4]=91; // Preserve detached part 5 independently.
const biomeRgba=new Uint8Array(width*height*4);
const elevationRgba=new Uint8Array(width*height*4);
for(let i=0;i<width*height;i++){
  biomeRgba.set([55,145+(i%4)*10,82,255],i*4);
  elevationRgba.set([150+i%12,170,190,255],i*4);
}
const input={width,height,classification,terrainLabels,biomeRgba,elevationRgba,
  footprints,regions,mainlandReferenceId:30};

test('A/B hold is identical until explicitly approved borders; B has no fabricated candidate polygon',()=>{
  const unchanged=JSON.stringify(footprints);
  const r=buildKaelvarCandidateComparison(input);
  assert.equal(r.layoutA.proposedPolygons,null);
  assert.equal(r.layoutB.proposedPolygons,null);
  assert.equal(r.layoutB.id,'UNAPPROVED_EASTERN_MAINLAND_CANDIDATE');
  assert.equal(r.layoutB.easternSourceFootprintTestWindowMainlandCells,3);
  assert.equal(r.overlaysAreOriginalSourceFootprintsNotNewBorders,true);
  assert.equal(r.sourceWritable,false);
  assert.equal(JSON.stringify(footprints),unchanged);
});

test('All 15 Shattercap records retained, including blue artifact and independent island',()=>{
  const r=buildKaelvarCandidateComparison(input);
  const sh=r.sourcePartProvenance.filter(p=>p.authoredRegionId==='region.shattercap_isles');
  assert.equal(sh.length,15);
  assert.equal(sh.find(p=>p.sourcePartId.endsWith('.part_1')).terrainCandidateCells,0);
  assert.equal(sh.find(p=>p.sourcePartId.endsWith('.part_1')).sharedBlueCandidateCells,1);
  assert.deepEqual(sh.find(p=>p.sourcePartId.endsWith('.part_5'))
    .physicalComponentMemberships,[{componentId:91,cells:1}]);
  assert.equal(r.candidateHold.uniqueTerrainCellsAcrossShattercapAndWindward,15);
  assert.equal(r.candidateHold.heldDetachedCells,1);
  assert.equal(r.candidateHold.heldMainlandCells,14);
  assert.equal(r.candidateHold.shattercapWindwardJointMembershipTerrainCells,0);
});

test('Ecological cells retain raw source channels without inferring biomes or meters',()=>{
  const r=buildKaelvarCandidateComparison(input);
  for(const e of r.authoredExpectations){
    assert.equal(e.boundaryAccepted,false);
    assert.equal(e.observedSourceRaster.semanticBiomeClass,null);
    assert.equal(e.observedSourceRaster.physicalElevationMeters,null);
    assert.ok(e.observedSourceRaster.sourceBiomeExactRgbTop.length>0);
  }
  assert.equal(r.hardHolds.includes('E4_ECOTONE_BANDS'),true);
});

test('Svg uses registered embedded biome and elevation images in exactly four panels',()=>{
  const {svg,roi,proposedBorders}=kaelvarCandidateComparisonSvg(input);
  assert.equal(proposedBorders,null);
  assert.match(svg,/Existing source labels/);
  assert.match(svg,/Layout A: three-region review/);
  assert.match(svg,/Layout B: eastern eligibility review/);
  assert.match(svg,/Independent elevation source/);
  assert.match(svg,/not an eastern-region border/i);
  const matches=[...svg.matchAll(/<image href="data:image\/png;base64,([^"]+)"/g)];
  assert.equal(matches.length,4);
  const decoded=matches.map(m=>decodeSourcePng(Buffer.from(m[1],'base64')));
  for(const img of decoded){
    assert.equal(img.width,roi.width);
    assert.equal(img.height,roi.height);
  }
  assert.notEqual(matches[0][1],matches[3][1]);
  const raw=svg.replace('xmlns="http://www.w3.org/2000/svg"','');
  assert.doesNotMatch(raw,/<(?:script|foreignObject)\b|https?:/i);
});

test('Comparison refuses source registration drift, missing focus and wrong region records',()=>{
  assert.throws(()=>buildKaelvarCandidateComparison({...input,
    biomeRgba:new Uint8Array(3)}),/registration/);
  assert.throws(()=>buildKaelvarCandidateComparison({...input,
    footprints:footprints.filter(p=>!p.id.endsWith('windward_spine.part_1'))}),
  /Missing focal source part/);
  assert.throws(()=>buildKaelvarCandidateComparison({...input,
    regions:regions.slice(1)}),/Missing authored region/);
});

test('Runner reuses audited source PNG, 42 exclusions, separate component namespaces and no write',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const script=readFileSync(resolve(root,'scripts/first-world-kaelvar-candidate-comparison.mjs'),'utf8');
  assert.match(script,/verifyAuditedTextBlob/);
  assert.match(script,/source\.coastlines\.length!==68/);
  assert.match(script,/deduplicatedTerrainCells!==30938/);
  assert.match(script,/directSameMacroChildOverlapLandPixels!==88/);
  assert.match(script,/--compare/);
  assert.match(script,/--svg/);
  assert.doesNotMatch(script,/writeFileSync|createWriteStream|--write/);
});
