#!/usr/bin/env node
/** C1-L landmass-first source arc review: stdout JSON/SVG, no content writes. */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateKaelvarC1ReviewLedger,C1_SOURCE_VARIANTS}
  from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource}
  from './lib/world-source-git-witness.mjs';
import {validateC1FPlacementGuides}
  from './lib/kaelvar-c1f-placement-intent.mjs';
import {validateC1JContract,selectC1JOriginalVectorEdges}
  from './lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1KContract,buildC1KCoastInlandReview}
  from './lib/kaelvar-c1k-coast-informed-boundary-review.mjs';
import {C1L_ARC_CLASSES,validateC1LContract,buildC1LLandmassSourceArcReview}
  from './lib/kaelvar-c1l-landmass-source-arc-review.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
 console.error('Usage: --check|--svg (source-arc visual review; no approvals)');
 process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
const fail=s=>{throw Error('C1-L landmass HOLD: '+s);};
const l=json('docs/design/kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json');
const c1=json(l.sourcePaths.c1),c1f=json(l.sourcePaths.c1f);
const c1j=json(l.sourcePaths.c1j),c1k=json(l.sourcePaths.c1k);
const c1g=json(c1j.sourcePaths.c1g);
validateKaelvarC1ReviewLedger(c1);
validateC1FPlacementGuides(c1f,c1);
validateC1JContract(c1j,c1,c1f,c1g);
validateC1KContract(c1k,c1j,c1f);
validateC1LContract(l,c1,c1f,c1j,c1k);
const callK=flag=>execFileSync(process.execPath,[
 resolve(root,'scripts/kaelvar-c1k-boundary-review.mjs'),flag],{
 cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,
});
const prior=JSON.parse(callK('--check'));
if(prior.status!=='C1K_COAST_REFERENCED_INLAND_REVIEW_COMPLETE_PUBLICATION_HELD'||
 prior.originalSourceEdges!==599||prior.northernSourceEdges!==310||
 prior.remainingOriginalSourceEdges!==289||
 prior.inheritedMainlandTerrainCandidateCells!==79419||
 prior.inheritedUnassignedMainlandCandidateCells!==26795||
 prior.geographicPublication?.canonicalWritable!==false||
 prior.geographicPublication?.assignedCoastlineEdges!==0)
 fail('C1-K source/PNG or geographic publication gates drifted');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
 repoRoot:root,sourcePath:c1j.sourceGeometryPath,
 acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
if(sourceBlob!==prior.originalSourceVectorBlob)
 fail('original source blob identity differs from predecessor');
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
 .records.find(x=>x.mapId==='world_map.first_world');
const selected=selectC1JOriginalVectorEdges(source,c1j);
const kReview=buildC1KCoastInlandReview(selected,c1f,c1k);
const result=buildC1LLandmassSourceArcReview(selected,c1f,kReview,l);
const report={
 status:'C1L_LANDMASS_ARC_REVIEW_COMPLETE_OWNER_VISUAL_GATE_HELD',
 exactPredecessorStatus:prior.status,
 originalSourceVectorBlob:sourceBlob,
 sourcePngRegistrationVerified:prior.sourcePngRegistrationVerified,
 originalSourceContourId:result.originalSourceContourId,
 originalEdgesAccounted:result.originalEdgesAccounted,
 northernOriginalEdgesAccounted:result.northernOriginalEdgesAccounted,
 otherOriginalEdgesAccounted:result.otherOriginalEdgesAccounted,
 countsBySourceArcStatus:result.countsBySourceArcStatus,
 cyclicSourceArcRuns:result.cyclicSourceArcRuns,
 originalSourceEdgeClassifications:result.statusByOriginalSourceEdgeIndex,
 candidateMainlandRegionDescriptions:l.regionDescriptions,
 existingInlandGuideInterfaces:result.existingInlandGuideInterfaces,
 physicalMainlandCandidateCells:result.physicalMainlandCandidateCells,
 unassignedPhysicalMainlandCandidateCells:result.unassignedPhysicalMainlandCandidateCells,
 inheritedDetachedPhysicalComponentsHeld:result.physicalDetachedCandidatesHeld,
 approval:{
  sourceCoastlineCertified:false,
  originalSourceArcRegionClaims:0,
  inlandBorderGeometriesApproved:0,
  regionPolygonsPublished:0,
  largeNortheastIslandOwnerRegionId:null,
  shattercapIslandClaims:0,
  kharuunDirectSeaFrontageApproved:false,
  saltBasinsPlaced:0,
  foreignWindwardParent:'region.serathyl',
  coast40Resolved:false,
  riverOrOceanCalibrated:false,
  ownerVisualReviewRequired:true,
  canonicalWritable:false,
 },
};
if(mode==='--check'){
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}else{
 const base=callK('--svg');
 if(!base.trimEnd().endsWith('</svg>'))
   fail('C1-K SVG shape changed');
 const colors=['#69D8EF','#F6C66E','#FF8F8F','#C1A0FF','#6F849A'];
 const paths=C1L_ARC_CLASSES.map(()=>[]);
 for(let i=0;i<599;i++){
   const status=result.statusByOriginalSourceEdgeIndex[i];
   const kind=C1L_ARC_CLASSES.indexOf(status);
   if(kind<0)fail('unknown original source arc class');
   if(kind===4)continue;
   const a=selected.main.points[i],b=selected.main.points[(i+1)%599];
   paths[kind].push('M'+a.x+' '+a.y+' L'+b.x+' '+b.y);
 }
 const overlay=paths.map((steps,i)=>i===4?'':(
   '<path d="'+steps.join(' ')+'" fill="none" stroke="'+colors[i]+
   '" stroke-width="'+(i===3?2.5:2.8)+
   '" stroke-opacity=".96" stroke-dasharray="'+(i===3?'5 3':'3 2')+'"/>'
 )).join('');
 let out=base.replace(
   'KAELVAR C1-K / SOURCE COAST OUTER REFERENCE + INLAND GAP REVIEW / NO BORDERS APPROVED',
   'KAELVAR C1-L / LANDMASS SOURCE-ARC REVIEW / ALL POLITICAL BORDERS HELD');
 const anchor=out.lastIndexOf('</svg>');
 const legend='<text x="650" y="542" font-size="13" fill="#FFFFFF">'+
   'C1-L source-edge arc classes: cyan Veyrholm guide match, amber other guide, coral unmatched, violet NE contested</text>';
 process.stdout.write(out.slice(0,anchor)+
   '<svg x="646" y="57" width="608" height="470" viewBox="40 90 620 480">'+
   overlay+'</svg>'+legend+out.slice(anchor));
}
