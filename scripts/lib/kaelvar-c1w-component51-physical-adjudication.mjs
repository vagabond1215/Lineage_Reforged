/**
 * C1-W: paired original-image physical interpretation evidence, owner HOLD.
 * No automatic choice between promontory, separate islet, and unclassified
 * cartographic ink. All data originate from source PNG/reference-grid samples
 * and already-verified noncanonical C1-V witness.
 */
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';

const fail=s=>{throw Error('C1-W source-owner HOLD: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const hash='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const biomeHash='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const elevHash='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const parent='ca43b359bd5c9232ed42721817dab11b6861d522';
const crop={x:60,y:60,width:3976,height:2235};
const bounds={minX:454,minY:196,maxX:516,maxY:252};
const expected={
  componentLabel:51,mainlandLabel:30,
  componentReferenceBounds:{minX:466,minY:206,maxX:470,maxY:212},
  originalComponentCellCount:21,
  insideOriginalCoastCellCount:13,outsideOriginalCoastCellCount:8,
  adjacentExcludedSharedBlackCells:18,
  gapReferencePixel:[469,213],gapOriginalPngPixel:[971,474],
  originalComponentSide:[469,212],originalMainlandSide:[469,214],
  originalStrictPhysicalConnection:false,
  hypotheticalBlackConnectionExists:true,
  hypotheticalBlackConnectionCertifiesLand:false,
  sourceReferenceReviewWindow:bounds,
};
const policies={
 chooseNoAutomaticWinner:true,
 requiredOwnerAction:'Review paired original biome/elevation crops and exact vector overlay, then explicitly select an interpretation or continue HOLD.',
 noApprovalRecorded:true,visualMustShowOriginalSourcePairUnaltered:true,
 allHypothesisOverlaysClearlyDiagnostic:true,component51NotRelabeled:true,
 sourceRastersNotRewritten:true,sourceVectorNotRewritten:true,
 canonicalWritable:false,invalidFullVerdantShortcutStillRejected:true,
 newlyAssignedPoliticalCells:0
};
const held={
 kharuunOptionBEdges:[35,58],verdantSoutheasternPeninsulaIncluded:true,
 veyrholmDryInlandExclusionsPreserved:true,
 northeasternHeadlandPoliticalOwner:null,component51PoliticalOwner:null,
 largeNortheasternIslandUnassigned:true,
 shattercapDetachedIslandsUnassigned:true,coast40Claim:null,
 serathylWindwardParent:'region.serathyl',
 noPortWellRiverRouteSaltBasinPlacement:true,
 noNewLegacyHexDependencies:true
};
const ids=['COAST_ATTACHED_PROMONTORY','PHYSICALLY_SEPARATE_ISLET',
 'UNRESOLVED_CARTOGRAPHIC_LINEWORK'];
const black=rgb=>rgb.every(x=>x===0);
const srcPixel=(x,y)=>({
 x:60+Math.min(3975,Math.floor((x+.5)*3976/2048)),
 y:60+Math.min(2234,Math.floor((y+.5)*2235/1152))
});
function sourcePair(biome,elevation,x,y){
 const source=srcPixel(x,y),i=(source.y*biome.width+source.x)*4;
 const a=biome.rgba,b=elevation.rgba;
 const ar=[a[i],a[i+1],a[i+2]],br=[b[i],b[i+1],b[i+2]];
 const validAlpha=a[i+3]>0&&a[i+3]===b[i+3];
 const blue=ar[2]>150&&ar[2]-ar[1]>25&&ar[2]-ar[0]>80;
 const identical=eq(ar,br);
 return {reference:{x,y},originalPixel:source,
  biomeRGB:ar,elevationRGB:br,biomeAlpha:a[i+3],elevationAlpha:b[i+3],
  equalRGB:identical,sourceBlueRule:blue,alphaValid:validAlpha,
  isExactUnresolvedSharedBlack:validAlpha&&!blue&&identical&&black(ar)};
}
function pointDistance(p,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
 const t=den===0?0:Math.max(0,Math.min(1,
  ((p.x-a.x)*dx+(p.y-a.y)*dy)/den));
 return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
}
function nearHeadland(pt,contour){
 const p={x:pt.x+.5,y:pt.y+.5};
 let best={sourceCoastEdge:null,distanceSourceReferencePixels:Infinity};
 for(let k=75;k<=115;k++){
  const d=pointDistance(p,contour[k],contour[(k+1)%599]);
  if(d<best.distanceSourceReferencePixels)
   best={sourceCoastEdge:k,distanceSourceReferencePixels:d};
 }
 return best;
}
export function validateC1WContract(s,c1vSpec,c1vReport,c1pReport){
 if(s?.schemaVersion!==1||
  s.type!=='kaelvar-c1w-component51-physical-interpretation-owner-review.v1'||
  s.status!=='OWNER_ADJUDICATION_REQUIRED_SOURCE_EVIDENCE_ONLY_NO_PHYSICAL_OR_POLITICAL_PUBLICATION'||
  s.parentC1VHead!==parent||
  !eq(s.source,{
   originalVectorBlob:hash,originalCoastEdgeCount:599,
   reviewedHeadlandEdges:[75,115],componentCrossingSourceEdge:81,
   originalBiomePngSha256:biomeHash,originalElevationPngSha256:elevHash,
   sourceRegistration:{crop,reference:{width:2048,height:1152}}
  })||
  !eq(s.focus,expected)||
  !eq(s.interpretations?.map(x=>x.id),ids)||
  s.interpretations.some(x=>x.ownerDecision!==null||
    x.status!=='UNDECIDED'||!Array.isArray(x.evidenceFor)||
    x.evidenceFor.length===0||!Array.isArray(x.notEstablished)||
    x.notEstablished.length===0||!Array.isArray(x.mustNotDo)||
    x.mustNotDo.length===0)||
  !eq(s.reviewPolicy,policies)||!eq(s.immutableHolds,held))
  fail('source fingerprint, undecided human options or immutable holds changed');
 if(c1vSpec?.parentC1UHead!=='02e3a0a0d42dde010c92c0fb086c9f3cdda54553'||
   c1vSpec.immutableHolds?.canonicalWritable!==false||
   c1vReport?.status!=='C1V_COMPONENT51_INLET_IDENTITY_NATIVE_SOURCE_AUDIT_CANONICAL_HELD'||
   c1vReport.component?.actualSourceCandidatePixelCount!==21||
   c1vReport.component.originalSourceContourContainedCells!==13||
   c1vReport.component.originalSourceContourOutsideCells!==8||
   c1vReport.component.sourceCoastProximity.sourceEdgeIndex!==81||
   c1vReport.component.sourceCoastProximity.distanceReferencePixels!==0||
   !eq(c1vReport.component.boundingReferencePixels,expected.componentReferenceBounds)||
   c1vReport.componentBoundary?.uniqueAdjacentReferencePixels!==18||
   !eq(c1vReport.componentBoundary?.uniqueAdjacentExcludedPixelColorCategories,
    {black:18,teal:0,other:0,sourceBlue:0,otherExcluded:0,invalidAlpha:0})||
   !eq(c1vReport.localHypotheticalConnectivity?.routeScenarios.map(x=>x.found),
    [false,true,false,true,true])||
   !eq(c1vReport.localHypotheticalConnectivity.routeScenarios[1].path,
    [{x:469,y:212},{x:469,y:213},{x:469,y:214}])||
   c1vReport.fixedC1P?.terrainComponentLabelsChanged!==0||
   c1vReport.fixedC1P.newPoliticalTerritoryCells!==0||
   c1vReport.fixedC1P.canonicalWritable!==false||
   c1pReport?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
   c1pReport.originalSourceEdgesConserved!==599||
   c1pReport.sourcePngFingerprintsVerified!==true||
   c1pReport.sourceOriginalContourUnmodified!==true||
   c1pReport.measurements?.candidateMainlandTerrainCells!==79419||
   c1pReport.measurements.previewAssignedMainlandTerrainCells!==52449||
   c1pReport.measurements.remainingUnassignedMainlandTerrainCells!==26970||
   !eq(c1pReport.measurements.perRegion.map(x=>x.terrainCandidateCells),
    [5632,18624,19182,9011])||
   c1pReport.measurements.detachedPhysicalComponentsClaimed!==0||
   c1pReport.holds?.canonicalWritable!==false)
  fail('original verified C1-V pixel report or C1-P terrain accounting changed');
 return true;
}
export function buildC1WPhysicalInterpretation({spec,c1vSpec,c1vReport,
 c1pReport,revised,labels,ownership,biome,elevation}){
 validateC1WContract(spec,c1vSpec,c1vReport,c1pReport);
 if(revised?.originalContour?.length!==599||
  labels?.length!==2048*1152||ownership?.length!==labels.length||
  biome?.width!==4096||biome.height!==2355||
  elevation?.width!==4096||elevation.height!==2355||
  biome.rgba?.length!==4096*2355*4||
  elevation.rgba?.length!==4096*2355*4)
  fail('original 599-edge coast, label raster or original PNG pair unavailable');
 const contour=revised.originalContour;
 const component=c1vReport.component.originalComponent51Pixels;
 const neighbors=c1vReport.componentBoundary.originalSourceZeroNeighborSamples;
 const cells=component.map(p=>{
  const i=p.y*2048+p.x,ink=sourcePair(biome,elevation,p.x,p.y);
  if(labels[i]!==51||ownership[i]!==0||ink.equalRGB||
   ink.sourceBlueRule||!ink.alphaValid)
   fail('component-51 original strict source pixel changed');
  const inside=c1oPointInRing({x:p.x+.5,y:p.y+.5},contour);
  return {...ink,originalLabel:51,politicalOwner:null,
   sourceVectorInside:inside,...nearHeadland(p,contour)};
 });
 const inside=cells.filter(x=>x.sourceVectorInside).length;
 if(cells.length!==21||inside!==13)
  fail('component-51 physical cell inventory changed');
 const excluded=neighbors.map(p=>{
  const i=p.y*2048+p.x,ink=sourcePair(biome,elevation,p.x,p.y);
  if(labels[i]!==0||ownership[i]!==0||!ink.isExactUnresolvedSharedBlack)
   fail('source-ink perimeter unknown sample reclassified');
  return {...ink,originalLabel:0,politicalOwner:null,
   sourceVectorInside:c1oPointInRing({x:p.x+.5,y:p.y+.5},contour),
   ...nearHeadland(p,contour)};
 });
 if(excluded.length!==18||
  new Set(excluded.map(x=>x.reference.x+','+x.reference.y)).size!==18)
  fail('18 individually excluded shared-black neighbor cells drifted');
 const px=[
  {role:'COMPONENT51',point:{x:469,y:212},expectedLabel:51},
  {role:'BLACK_INK_GAP',point:{x:469,y:213},expectedLabel:0},
  {role:'MAINLAND30',point:{x:469,y:214},expectedLabel:30}
 ].map(({role,point,expectedLabel})=>{
  const id=point.y*2048+point.x;
  if(labels[id]!==expectedLabel)fail('gap path strict physical label drift');
  const src=sourcePair(biome,elevation,point.x,point.y);
  if(role==='BLACK_INK_GAP'&&
   (!eq(src.originalPixel,{x:971,y:474})||!src.isExactUnresolvedSharedBlack))
   fail('bridge sample source registered RGB has changed');
  return {role,originalTerrainLabel:labels[id],
   assignedToPoliticalRegion:ownership[id]!==0,
   originalSourceVectorInside:c1oPointInRing(
     {x:point.x+.5,y:point.y+.5},contour),
   ...nearHeadland(point,contour),...src};
 });
 if(px.some(x=>x.assignedToPoliticalRegion))
  fail('gap source-pair review overlaps provisional regional ownership');
 const rows=[];
 for(let y=201;y<=218;y++){
  let glyphs='';
  for(let x=462;x<=475;x++){
   const idx=y*2048+x,lab=labels[idx];
   let g=lab===51?'C':lab===30?'M':lab>0?'X':'?';
   if(lab===0){
    const sample=sourcePair(biome,elevation,x,y);
    g=sample.isExactUnresolvedSharedBlack?'#':
      sample.sourceBlueRule?'~':sample.equalRGB?'=':'?';
   }
   if(x===469&&y===213)g='G';
   glyphs+=g;
  }
  rows.push({y,glyphs});
 }
 const physicalHypotheses=spec.interpretations.map(x=>({
  ...x,approval:null,physicalEvidenceStatus:'INSUFFICIENT_FOR_CERTIFICATION',
  sourceSharedInkIsAmbiguous:true,mayPublishRegion:false
 }));
 return {
  status:'C1W_ORIGINAL_PAIRED_SOURCE_OWNER_CHOICE_REQUIRED_NO_GEOGRAPHIC_PUBLICATION',
  originalSourceWitness:{vectorBlob:hash,originalCoastEdges:599,
   biomeSha256:biomeHash,elevationSha256:elevHash,
   reviewedHeadlandSourceEdges:[75,115],componentCrossingEdge:81},
  component51OriginalCellInventory:{
   total:cells.length,insideMainlandVector:inside,
   outsideMainlandVector:cells.length-inside,
   originalLabel:51,originalCells:cells},
  blackInkOriginalNeighborInventory:{
   uniqueExcluded:excluded.length,
   allIdenticalOriginalSourceRGB:true,allExactlyBlack:true,
   originalLabel:0,originalNeighborCells:excluded},
  exactBridgeOriginalPixelPairs:px,
  pixelGlyphNeighborhood:{
   windowReference:{minX:462,minY:201,maxX:475,maxY:218},
   glyphLegend:{C:'strict terrain component 51',
    M:'strict mainland terrain component 30',
    X:'other strict physical component',
    '#':'excluded shared-black source pair',
    '~':'excluded blue-rule source pixel',
    '=':'other excluded equal-RGB source ink',
    '?':'other excluded source pixel',
    G:'excluded original shared-black gap at (469,213)'},
   rows},
  candidatePhysicalInterpretations:physicalHypotheses,
  decision:{selected:null,ownerApproved:false,
   status:'HOLD_REQUIRES_SOURCE_CONVENTION_ADJUDICATION',
   attachedTipCertified:false,separateIsletCertified:false,
   unresolvedLineworkProven:false,
   requiredNextAction:spec.reviewPolicy.requiredOwnerAction},
  immutableBaseline:{originalMainlandCandidates:79419,
   provisionalRegionAssigned:52449,deliberatelyUnassigned:26970,
   fourRegionCells:[5632,18624,19182,9011],
   component51StillSeparate:true,
   originalTerrainLabelsModified:0,
   originalVectorModified:0,originalPngsModified:0,
   headlandNewOwner:null,detachedComponentsClaimed:0,
   canonicalWritable:false},
  warning:'The source-pair black gap and the coast vector are conflicting witnesses; no branch of this review resolves a physical coastline or political parent.'
 };
}
