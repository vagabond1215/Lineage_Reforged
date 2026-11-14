#!/usr/bin/env node
/** C1-O: native, source-verified, reversible four-region preview.
 * --check > JSON; --svg > SVG; --north-svg > SVG; --png <output.png>
 * No write occurs in the repository or canonical world records.
 */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateSync} from 'node:zlib';
import {C1_SOURCE_VARIANTS} from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource}
 from './lib/world-source-git-witness.mjs';
import {decodeSourcePng} from './lib/kaelvar-c1f-source-png.mjs';
import {registeredTerrainCandidates,checkedC1FMainland,buildC1FPreview}
 from './lib/kaelvar-c1f-source-raster.mjs';
import {validateC1FPlacementGuides}
 from './lib/kaelvar-c1f-placement-intent.mjs';
import {validateC1MShoreIntent}
 from './lib/kaelvar-c1m-shore-intent-review.mjs';
import {validateC1NAtlasContract}
 from './lib/kaelvar-c1n-source-edge-atlas.mjs';
import {selectC1JOriginalVectorEdges}
 from './lib/kaelvar-c1j-vector-coastline-review.mjs';
import {
 validateC1OContract,buildC1ORegionalGeometry,measureC1OReviewTerrain,
} from './lib/kaelvar-c1o-regional-boundaries.mjs';

const mode=process.argv[2];
if(!['--check','--svg','--north-svg','--png'].includes(mode)||
 (mode==='--png' ? process.argv.length!==4 : process.argv.length!==3)){
 console.error('Usage: node scripts/kaelvar-c1o-regional-boundaries.mjs --check|--svg|--north-svg|--png <output.png>');
 process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=p=>readFileSync(resolve(root,p));
const json=p=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
const hold=s=>{throw Error('C1-O native HOLD: '+s);};
const o=json('docs/design/kaelvar-c1o-regional-boundary-candidates-2026-11-14.json');
const n=json(o.sourcePaths.c1n),f=json(o.sourcePaths.c1f);
const j=json(o.sourcePaths.c1j),m=json(o.sourcePaths.c1m);
const l=json('docs/design/kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json');
const c1=json(f.sourceC1LedgerPath);
validateC1FPlacementGuides(f,c1);
validateC1MShoreIntent(m,l,j);
validateC1NAtlasContract(n,j,l,m);
validateC1OContract(o,n,f,j,m);
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
 repoRoot:root,sourcePath:o.source.path,
 acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
if(sourceBlob!==o.source.observedParentBlob)
 hold('observed C1-N source vector parent blob changed');
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
 .records.find(x=>x.mapId==='world_map.first_world');
const selected=selectC1JOriginalVectorEdges(source,j);
const geometry=buildC1ORegionalGeometry({proposal:o,selected,c1n:n,c1f:f});
const maps=json('packages/content/base/world/world_maps.json').records;
const map=maps.find(x=>x.id==='world_map.first_world');
const crop=c1.sourceWitness.crop;
if(!map||!['x','y','width','height'].every(k=>
 map.assetReferenceRectPx?.[k]===crop[k]))
 hold('registered map/crop mismatch');
const images={};
for(const layer of ['biome','elevation']){
 const file=map.layerAssetPaths?.[layer],expected=
  layer==='biome'?c1.sourceWitness.biomeSha256:c1.sourceWitness.elevationSha256;
 if(!file||!expected)hold('source image or fingerprint missing '+layer);
 const bytes=read(file);
 if(createHash('sha256').update(bytes).digest('hex')!==expected)
  hold('source image fingerprint changed '+layer);
 images[layer]={data:bytes,img:decodeSourcePng(bytes)};
}
const width=2048,height=1152;
const terrain=registeredTerrainCandidates({
 biome:images.biome.img,elevation:images.elevation.img,crop,width,height,
});
const {labels,main}=checkedC1FMainland(terrain,width,height);
const prior=buildC1FPreview({spec:f,labels,width,height});
if(main.id!==30||main.areaPx2!==79419||
 prior.unassignedMainlandCandidateCells!==26795||prior.islandAssignedCells!==0)
 hold('C1-F parent terrain witness diverged');
const metrics=measureC1OReviewTerrain(geometry,labels,{width,height});
const outline=geometry.regions.map(r=>({
 regionId:r.regionId,label:r.label,confidence:r.confidence,reason:r.reason,
 uncertainties:r.uncertainties,
 sourceArcStartVertex:r.sourceArcStartVertex,
 sourceArcEndVertex:r.sourceArcEndVertex,
 sourceArcWrapsZero:r.sourceArcWrapsZero,
 originalSourceEdgeIndices:r.sourceEdgeIndices,
 originalSourceEdges:r.sourceCoastEdgeOriginalPoints,
 candidatePolygonVertices:r.polygonRing,
 hypothesizedInlandWaypoints:r.hypothesizedInlandWaypoints,
 sourceVertexCount:r.sourceVertexCount,bounds:r.bounds,
 terrainCandidateCells:metrics.perRegion.find(x=>x.regionId===r.regionId).terrainCandidateCells,
 sourceContourCrossings:r.sourceInlandProperCrossings,
 offshoreSourceCrossings:r.protectedOffshoreCrossings,
 canonicalGeometryRef:null,politicalOwnershipApproved:false,
}));
const report={
 status:'C1O_REVERSIBLE_MAINLAND_POLYGON_CANDIDATES_BUILT_CANONICAL_HELD',
 baselineCommit:o.baseCommit,stage:'C1-O',mapId:'world_map.first_world',
 sourceVectorBlob:sourceBlob,sourcePngFingerprintsVerified:true,
 sourceContourId:geometry.regions[0]&&o.source.mainlandContourId,
 sourceContourVertices:geometry.originalContour,
 originalSourceEdgesConserved:599,originalSourceContourModified:false,
 originalNorthSourceSectorCounts:geometry.sourceSectorCounts,
 proposedCoastArcs:geometry.coastalReviewArcs,
 regionPolygonCandidates:outline,
 measurements:{
  sourceTerrainCandidateCells:79419,
  previousC1FUnassignedCandidateCells:26795,
  ...metrics,
  ownership:undefined,
 },
 diagnostics:{
  polygonSelfIntersections:geometry.selfIntersectionCount,
  polygonOwnershipCollisions:geometry.regionalOverlapCount,
  polygonInlandSourceContourCrossings:geometry.sourceCrossingCount,
  protectedOffshoreCrossings:geometry.offshoreSourceCrossingCount,
  reportedSourceContourCellsOutside:metrics.perRegion.reduce(
   (v,r)=>v+r.outsideMainlandSourceContourPixels,0),
  disconnectedComponentsNotClaimed:18,
  ownerAnchorsPass:true,
  rejectedUniformVeyrholmCorridorNotReintroduced:true,
 },
 holds:{
  publication:o.politicalHolds,
  northernCoastWaterCalibrated:false,
  kharuunSourceEdgeFrontageAccepted:false,
  inlandBoundaryAuthorityApproved:false,
  northEastHeadlandOwnershipApproved:false,
  waterSuppliesOrHarborsApproved:false,
  allLegacyHexDependenciesUnchanged:true,
 },
 nextReview:{
  kharuunEndpointIndices:[35,59],
  easternUnassignedSourceArc:[59,194],
  northernComplexHeadlandIndices:[75,115],
  sourceOutlineDoesNotEstablishLandSea:true,
  canonicalWritable:false,
 },
};
if(mode==='--check'){
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
 process.exit(0);
}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pt=p=>p.x+' '+p.y;
const path=(points,close=true)=>points.map((p,i)=>(i?'L':'M')+pt(p))
 .join(' ')+(close?' Z':'');
const img=images.biome.data.toString('base64');
const ox=-crop.x*width/crop.width,oy=-crop.y*height/crop.height;
const iw=images.biome.img.width*width/crop.width;
const ih=images.biome.img.height*height/crop.height;
const background='<image x="'+ox+'" y="'+oy+'" width="'+iw+'" height="'+ih+
 '" preserveAspectRatio="none" href="data:image/png;base64,'+img+'"/>';
const original='<path d="'+path(geometry.originalContour)+
 '" fill="none" stroke="#F5F8FC" stroke-opacity=".9" stroke-width="1.4"/>';
const islands=geometry.protectedOffshore.map(island=>'<path d="'+
 path(island.points)+'" fill="none" stroke="#FEA2AA" stroke-width="1.8"'+
 ' stroke-dasharray="4 3"/>').join('');
const unassigned='<path d="'+[path(geometry.originalContour),
 ...geometry.regions.map(r=>path(r.polygonRing))].join(' ')+
 '" fill="#68778B" fill-opacity=".28" fill-rule="evenodd"/>';
const fills=geometry.regions.map(r=>'<path d="'+path(r.polygonRing)+
 '" fill="'+r.color+'" fill-opacity=".42" stroke="'+r.color+
 '" stroke-opacity=".96" stroke-width="1.45"/>').join('');
const sourceArc=(start,end)=> {
 const p=geometry.originalContour,points=[];
 let i=start;
 for(let n=0;n<600;n++){
  points.push(p[i]);
  if(i===end)break;
  i=(i+1)%599;
 }
 return path(points,false);
};
const kline='<path d="'+sourceArc(35,59)+
 '" fill="none" stroke="#FFD341" stroke-width="4.1" stroke-linecap="round"/>';
const vline='<path d="'+sourceArc(475,24)+
 '" fill="none" stroke="#98C6FF" stroke-width="2.4" stroke-linecap="round"/>';
const contested='<path d="'+sourceArc(75,115)+
 '" fill="none" stroke="#FFB16A" stroke-width="2.5" stroke-dasharray="3 3"/>';
const endpoints=[35,59,24,475,75,115].map(i=>{
 const p=geometry.originalContour[i],k=i===35||i===59;
 return '<circle cx="'+p.x+'" cy="'+p.y+'" r="'+(k?4.1:2.5)+
 '" fill="'+(k?'#FF573F':'#FFDFAD')+
 '" stroke="#15263A" stroke-width=".9"/>';
}).join('');
const markerLabels=(view,level)=>{
 const p=geometry.originalContour;
 const points=p.map((q,i)=>({i,...q})).filter(q=>
  (q.i>=475||q.i<=115||q.i===598)&&
  (level==='detail'?(
   (q.i>=30&&q.i<=64&&q.i%2===0)||
   (q.i>=75&&q.i<=115&&q.i%5===0)||
   (q.i>=475&&q.i%10===0)||(q.i<=29&&q.i%5===0)||q.i===598
  ):q.i%10===0||q.i===35||q.i===59) &&
  q.x>=view[0]&&q.x<=view[0]+view[2]&&
  q.y>=view[1]&&q.y<=view[1]+view[3]);
 const fontSize=level==='detail'?3.7:5.2;
 return points.map(q=>'<circle cx="'+q.x+'" cy="'+q.y+'" r="1.15"'+
  ' fill="#FFFFFF" stroke="#182638" stroke-width=".5"/>'+
  '<text x="'+(q.x+1.8)+'" y="'+(q.y-1.7)+'" font-size="'+fontSize+
  '" fill="#FFFFFF" stroke="#16253B" stroke-width="1.05" paint-order="stroke">'+
  q.i+'</text>').join('');
};
const labels=f.regionGuides.slice(0,4).map((r,i)=>{
 const p=i===3?{x:213,y:176}:r.labelAnchor;
 return '<text x="'+p.x+'" y="'+p.y+'" text-anchor="middle" font-size="10"'+
  ' font-weight="bold" fill="#FFFFFF" stroke="#1A2C38" stroke-width="2.6"'+
  ' paint-order="stroke">'+esc(r.label)+'</text>';
}).join('');
const mapLayers=unassigned+fills+original+islands+vline+kline+contested+endpoints;
const panel=(x,y,w,h,view,layers)=>'<svg x="'+x+'" y="'+y+
 '" width="'+w+'" height="'+h+'" viewBox="'+view.join(' ')+
 '" preserveAspectRatio="xMidYMid meet">'+background+layers+'</svg>'+
 '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+
 '" fill="none" stroke="#A7B6CE" stroke-width="2"/>';
const header='<rect width="100%" height="100%" fill="#112337"/>';
const txt=(x,y,s,size=18,color='#DCE7F6')=>
 '<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+color+'">'+esc(s)+'</text>';
if(mode==='--svg'){
 const whole=[40,90,620,480],north=[50,110,505,232];
 const legend=geometry.regions.map((r,i)=>
 '<rect x="1360" y="'+(761+i*51)+'" width="25" height="20" fill="'+r.color+'"/>'+
 txt(1400,778+i*51,r.label,21)).join('');
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1150" viewBox="0 0 2560 1150">'+
 header+txt(30,42,'C1-O / KAELVAR / REVERSIBLE REGIONAL BOUNDARY CANDIDATES',29,'#FFFFFF')+
 txt(30,78,'SOURCE MAP UNDERLAY | NOT A CANONICAL GEOGRAPHIC PUBLICATION',18,'#FBD3A0')+
 panel(30,118,1240,960,whole,mapLayers+labels)+
 txt(1350,149,'Northern bay + disputed northeastern headland',22,'#FFFFFF')+
 panel(1350,170,1168,536,north,mapLayers+markerLabels(north,'overview'))+
 legend+txt(1360,992,'Gray: still unassigned / disputed source-mainland interior',17)+
 txt(1360,1020,'Pink dotted: protected offshore contours, no islands claimed',17)+
 txt(1360,1048,'Gold: Kharuun edges 35-58 (unapproved); orange dashes: NE held',17,'#FFE0A3')+
 txt(30,1120,'Original 599-edge source trace and PNG fingerprints verified | 18 detached components unclaimed | zero canonical changes',17)+
 '</svg>\n';
 process.stdout.write(svg);
 process.exit(0);
}
if(mode==='--north-svg'){
 const north=[57,108,502,249];
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="2600" height="1510" viewBox="0 0 2600 1510">'+
 header+txt(45,51,'C1-O / EXACT ORIGINAL SOURCE INDEX NORTHERN COASTLINE',32,'#FFFFFF')+
 txt(45,90,'Kharuun front proposed edges 35-58; red circles are unresolved endpoints at original vertices 35 and 59',23,'#FFCF8B')+
 panel(40,132,2510,1245,north,mapLayers+markerLabels(north,'detail'))+
 txt(45,1415,'Veyrholm northwest source arc 475-598, 0-23; irregular inland boundary. NE headland 75-115 remains disputed.',20)+
 txt(45,1450,'Indices label ORIGINAL contour vertices. Proposed coastline is neither water-calibrated nor accepted sovereignty.',19,'#F6C8A2')+
 '</svg>\n';
 process.stdout.write(svg);
 process.exit(0);
}
// Dependency-free PNG: the original registered biome RGB underlaid with
// reversible actual component-30 preview cells, original vector ink, endpoints.
// The indexed companion SVGs carry the higher-fidelity text annotations.
const W=2400,H=1858,frame=[40,90,620,480],rgba=Buffer.alloc(W*H*4);
const palette=geometry.regions.map(r=>[
 parseInt(r.color.slice(1,3),16),parseInt(r.color.slice(3,5),16),
 parseInt(r.color.slice(5,7),16)]);
const sX=(x)=>frame[0]+(x+.5)*frame[2]/W;
const sY=(y)=>frame[1]+(y+.5)*frame[3]/H;
const input=images.biome.img;
for(let y=0;y<H;y++){
 const qy=sY(y),iy=Math.max(0,Math.min(height-1,Math.floor(qy)));
 const sy=Math.max(0,Math.min(input.height-1,
  Math.floor(crop.y+qy*crop.height/height)));
 for(let x=0;x<W;x++){
  const qx=sX(x),ix=Math.max(0,Math.min(width-1,Math.floor(qx)));
  const sx=Math.max(0,Math.min(input.width-1,
   Math.floor(crop.x+qx*crop.width/width)));
  const out=(y*W+x)*4,src=(sy*input.width+sx)*4;
  let rgb=[input.rgba[src],input.rgba[src+1],input.rgba[src+2]];
  const at=iy*width+ix;
  if(labels[at]===30){
   const own=metrics.ownership[at];
   const fill=own?palette[own-1]:[126,145,165];
   const alpha=own?.41:.21;
   rgb=rgb.map((c,k)=>Math.round(c*(1-alpha)+fill[k]*alpha));
  }
  rgba[out]=rgb[0];rgba[out+1]=rgb[1];rgba[out+2]=rgb[2];rgba[out+3]=255;
 }
}
const outP=q=>({x:Math.round((q.x-frame[0])*W/frame[2]),
 y:Math.round((q.y-frame[1])*H/frame[3])});
const dab=(x,y,r,color)=>{
 for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
  if(dx*dx+dy*dy>r*r||x+dx<0||y+dy<0||x+dx>=W||y+dy>=H)continue;
  const at=((y+dy)*W+x+dx)*4;
  rgba[at]=color[0];rgba[at+1]=color[1];rgba[at+2]=color[2];
 }
};
const line=(a,b,r,color)=>{
 const p=outP(a),q=outP(b),steps=Math.ceil(Math.hypot(q.x-p.x,q.y-p.y)*2);
 for(let i=0;i<=steps;i++){
  const t=steps?i/steps:0;
  dab(Math.round(p.x+(q.x-p.x)*t),Math.round(p.y+(q.y-p.y)*t),r,color);
 }
};
const outlineLine=(points,col,r=2)=>points.forEach((q,i)=>
 line(q,points[(i+1)%points.length],r,col));
outlineLine(geometry.originalContour,[248,251,255],2);
for(const r of geometry.regions)outlineLine(r.polygonRing,
 palette[geometry.regions.indexOf(r)],3);
for(const island of geometry.protectedOffshore)outlineLine(island.points,
 [252,160,160],2);
const arcStroke=(a,b,color,r)=>{
 let i=a;for(let step=0;step<599;step++){
  const next=(i+1)%599;
  line(geometry.originalContour[i],geometry.originalContour[next],r,color);
  if(next===b)break;
  i=next;
 }
};
arcStroke(35,59,[255,221,55],7);
arcStroke(475,24,[155,199,255],4);
arcStroke(75,115,[247,172,115],3);
for(const i of [35,59,24,475,75,115])dab(outP(
 geometry.originalContour[i]).x,outP(geometry.originalContour[i]).y,
 i===35||i===59?12:8,[255,70,61]);
function crc32(bytes){
 let v=0xFFFFFFFF;
 for(const x of bytes){v^=x;for(let i=0;i<8;i++)
  v=v&1?(v>>>1)^0xEDB88320:v>>>1;}
 return (v^0xFFFFFFFF)>>>0;
}
const chunk=(name,body)=>{
 const a=Buffer.from(name,'ascii'),n=Buffer.alloc(4),c=Buffer.alloc(4);
 n.writeUInt32BE(body.length);c.writeUInt32BE(crc32(Buffer.concat([a,body])));
 return Buffer.concat([n,a,body,c]);
};
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);
ihdr[8]=8;ihdr[9]=6;
const raw=Buffer.alloc(H*(W*4+1));
for(let y=0;y<H;y++)rgba.copy(raw,y*(W*4+1)+1,y*W*4,(y+1)*W*4);
const png=Buffer.concat([
 Buffer.from([137,80,78,71,13,10,26,10]),
 chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:7})),
 chunk('IEND',Buffer.alloc(0)),
]);
const target=resolve(process.argv[3]);
writeFileSync(target,png);
process.stderr.write('C1-O noncanonical PNG review written: '+target+
 ' ('+W+'x'+H+')\n');
