#!/usr/bin/env node
/** C1-K reversible source-coast and inland guide interface review. */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {C1_SOURCE_VARIANTS} from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource}
  from './lib/world-source-git-witness.mjs';
import {validateC1JContract,selectC1JOriginalVectorEdges}
  from './lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1FPlacementGuides}
  from './lib/kaelvar-c1f-placement-intent.mjs';
import {validateC1KContract,buildC1KCoastInlandReview}
  from './lib/kaelvar-c1k-coast-informed-boundary-review.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
  console.error('Usage: --check|--svg (review only; no geography writes)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
const fail=s=>{throw Error('C1-K original coast review HOLD: '+s);};
const k=json('docs/design/kaelvar-c1k-coast-informed-boundary-review-2026-11-14.json');
const j=json(k.sourcePaths.c1j),f=json(k.sourcePaths.c1f);
const c1=json(j.sourcePaths.c1),g=json(j.sourcePaths.c1g);
validateC1JContract(j,c1,f,g);
validateC1FPlacementGuides(f,c1);
validateC1KContract(k,j,f);
const c1jCli=resolve(root,'scripts/kaelvar-c1j-coastline-review.mjs');
const callJ=flag=>execFileSync(process.execPath,[c1jCli,flag],{
  cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,
});
const prior=JSON.parse(callJ('--check'));
if(prior.status!=='C1J_VECTOR_COASTLINE_REVIEW_COMPLETE_SEMANTICS_HELD'||
  prior.originalSourceCoastlineReview?.originalSourceEdgesAccounted!==599||
  prior.originalSourceCoastlineReview?.otherSourceEdges!==289||
  prior.interpretationHolds?.canonicalWritable!==false||
  prior.sourceMainlandTerrainCandidates!==79419)
  fail('C1-J source PNG/vector or held geography has drifted');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
  repoRoot:root,sourcePath:j.sourceGeometryPath,
  acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
if(sourceBlob!==prior.sourceVectorBlob)fail('C1-J committed vector identity mismatch');
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(x=>x.mapId==='world_map.first_world');
const selected=selectC1JOriginalVectorEdges(source,j);
const r=buildC1KCoastInlandReview(selected,f,k);
const report={
  status:'C1K_COAST_REFERENCED_INLAND_REVIEW_COMPLETE_PUBLICATION_HELD',
  acceptedPredecessorStatus:prior.status,
  originalSourceVectorBlob:sourceBlob,
  sourcePngRegistrationVerified:prior.originalSourcePngsVerified,
  originalMainlandSourceId:k.originalMainlandSourceId,
  originalSourceEdges:r.originalSourceEdges,
  northernSourceEdges:r.northernSourceEdges,
  remainingOriginalSourceEdges:r.remainingOriginalSourceEdges,
  northernReview:r.northernSectors,
  provisionalInlandInterfaceGaps:r.inlandInterfaces,
  inheritedMainlandTerrainCandidateCells:prior.sourceMainlandTerrainCandidates,
  inheritedUnassignedMainlandCandidateCells:26795,
  sourceTraceReconstructed:r.sourceReconstructed,
  geographicPublication:{
    originalCoastIsNotCertifiedShore:true,
    guideMidpointIntersectionIsNotCoastalOwnership:true,
    inlandGapWitnessIsNotBorder:true,
    northeastVeyrholmKharuunCompetitionHeld:true,
    largeNortheastIslandHeldWhole:true,
    shattercapComponentsAssigned:0,
    kharuunPortsApproved:0,
    saltBasinsPlaced:0,
    riverAndOceanSemanticsCalibrated:false,
    coast40Held:true,
    foreignWindwardRemainsSerathyl:true,
    approvedInlandBorders:r.approvedInlandBorders,
    assignedCoastlineEdges:r.assignedCoastlineEdges,
    canonicalWritable:r.canonicalWritable,
  },
};
if(mode==='--check')process.stdout.write(JSON.stringify(report,null,2)+'\n');
else{
  const base=callJ('--svg');
  if(!base.trimEnd().endsWith('</svg>'))fail('C1-J SVG has unexpected shape');
  const path=ps=>ps.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ')+' Z';
  const guides=f.regionGuides.filter(x=>x.guidePolygon);
  const shells=guides.map(x=>'<path d="'+path(x.guidePolygon)+
    '" fill="none" stroke="'+x.color+'" stroke-width="1.7" stroke-dasharray="5 3"/>').join('');
  const seams=r.inlandInterfaces.map(x=>'<path d="M'+x.guideEndpointA.x+' '+
    x.guideEndpointA.y+' L'+x.guideEndpointB.x+' '+x.guideEndpointB.y+
    '" stroke="#F0F5FF" stroke-width="2" stroke-dasharray="3 3" fill="none"/>').join('');
  const unpaired=r.northernSectors.slice(0,2).flatMap(s=>
    s.unmatchedSourceEdgeIndices);
  const byIndex=new Map(selected.edgeSectors.flat()
    .map(e=>[e.sourceEdgeIndex,e]));
  const missing=unpaired.map(i=>byIndex.get(i)).filter(Boolean);
  const missingMarks=missing.map(x=>'M'+x.a.x+' '+x.a.y+
    ' L'+x.b.x+' '+x.b.y).join(' ');
  const overlay='<svg x="646" y="57" width="608" height="470" viewBox="40 90 620 480">'+
    '<path d="'+missingMarks+'" stroke="#FF8585" stroke-width="3" stroke-dasharray="3 3" fill="none"/>'+
    '</svg>'+
    '<svg x="1274" y="57" width="608" height="470" viewBox="40 90 620 480">'+
    shells+seams+'<text x="70" y="550" font-size="13" fill="#FFFFFF" stroke="#172536" stroke-width="2" paint-order="stroke">'+
    'C1-K guide-gap witnesses, NOT borders</text></svg>';
  let out=base.replace(
    'KAELVAR C1-J / ORIGINAL COASTLINE VECTORS / NO BORDERS OR WATER SEMANTICS APPROVED',
    'KAELVAR C1-K / SOURCE COAST OUTER REFERENCE + INLAND GAP REVIEW / NO BORDERS APPROVED');
  out=out.replace('3. Current guide cells, held islands, separate river',
    '3. Draft guide rims and inland gap witnesses (C1-K)');
  const index=out.lastIndexOf('</svg>');
  process.stdout.write(out.slice(0,index)+overlay+out.slice(index));
}
