#!/usr/bin/env node
/** C1-P original-source noncanonical native review; stdout only.
 * --check > report.json
 * --svg > source-backed-original-versus-refined.svg
 * --north-svg > source-backed-northern-seams.svg
 */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateSync} from 'node:zlib';
import {C1_SOURCE_VARIANTS} from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource}
 from './lib/world-source-git-witness.mjs';
import {decodeSourcePng}
 from './lib/kaelvar-c1f-source-png.mjs';
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
import {buildC1PRegionalReview}
 from './lib/kaelvar-c1p-regional-seam-review.mjs';
import {buildC1QHeadlandReview}
 from './lib/kaelvar-c1q-headland-continuity.mjs';

const mode=process.argv[2];
if(!['--check','--svg','--north-svg','--headland-check','--headland-svg'].includes(mode)||process.argv.length!==3){
 console.error('Usage: node scripts/kaelvar-c1p-regional-seams.mjs --check|--svg|--north-svg|--headland-check|--headland-svg');
 process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=p=>readFileSync(resolve(root,p));
const json=p=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
const hold=s=>{throw Error('C1-P native HOLD: '+s);};
const p=json('docs/design/kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json');
const o=json(p.C1ORegionProposalPath);
const n=json(o.sourcePaths.c1n),f=json(o.sourcePaths.c1f);
const j=json(o.sourcePaths.c1j),m=json(o.sourcePaths.c1m);
const l=json('docs/design/kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json');
const c1=json(f.sourceC1LedgerPath);
validateC1FPlacementGuides(f,c1);
validateC1MShoreIntent(m,l,j);
validateC1NAtlasContract(n,j,l,m);
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
 repoRoot:root,sourcePath:o.source.path,
 acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS)
});
if(sourceBlob!==p.sourceVectorBlob||sourceBlob!==o.source.observedParentBlob)
 hold('frozen original source vector changed');
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
 .records.find(x=>x.mapId==='world_map.first_world');
const selected=selectC1JOriginalVectorEdges(source,j);
const maps=json('packages/content/base/world/world_maps.json').records;
const world=maps.find(x=>x.id==='world_map.first_world');
const crop=c1.sourceWitness.crop;
if(!world||!['x','y','width','height'].every(k=>
 world.assetReferenceRectPx?.[k]===crop[k]))
 hold('source raster registration changed');
const images={};
for(const layer of ['biome','elevation']){
 const src=world.layerAssetPaths?.[layer],expected=
  layer==='biome'?c1.sourceWitness.biomeSha256:c1.sourceWitness.elevationSha256;
 if(!src||!expected)hold('missing original '+layer+' source');
 const bytes=read(src);
 if(createHash('sha256').update(bytes).digest('hex')!==expected)
  hold('original '+layer+' PNG fingerprint changed');
 images[layer]={bytes,img:decodeSourcePng(bytes)};
}
if(p.sourceBiomePngSha256!==c1.sourceWitness.biomeSha256)
 hold('C1-P biome source fingerprint disagrees with original witness');
const width=2048,height=1152;
const candidate=registeredTerrainCandidates({
 biome:images.biome.img,elevation:images.elevation.img,
 crop,width,height
});
const {labels,main}=checkedC1FMainland(candidate,width,height);
const prior=buildC1FPreview({spec:f,labels,width,height});
if(main.id!==30||main.areaPx2!==79419||
 prior.unassignedMainlandCandidateCells!==26795||
 prior.islandAssignedCells!==0)
 hold('original C1-F source terrain witness diverged');

const {report,baseline,revised,imageMasks}=buildC1PRegionalReview({
 p,o,f,n,j,m,selected,labels
});
report.sourcePngFingerprintsVerified=true;
report.sourceOriginalContourUnmodified=true;
report.c1oBaselineCommit=p.baseC1OCommit;
report.visualMode='READ_ONLY_NONCANONICAL_RASTER_CLIPPED_REVIEW';
let headland=null;
if(mode==='--headland-check'||mode==='--headland-svg'){
 const q=json('docs/design/kaelvar-c1q-northeast-headland-options-2026-11-14.json');
 headland=buildC1QHeadlandReview({
  c:q,p,r:report,revised,selected,labels,ownership:imageMasks.refined
 });
 if(mode==='--headland-check'){
  process.stdout.write(JSON.stringify(headland,null,2)+'\n');
  process.exit(0);
 }
}
if(mode==='--check'){
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
 process.exit(0);
}

const esc=s=>String(s).replace(/&/g,'&amp;')
 .replace(/</g,'&lt;').replace(/>/g,'&gt;')
 .replace(/"/g,'&quot;');
const colors=baseline.regions.map(r=>[
 parseInt(r.color.slice(1,3),16),
 parseInt(r.color.slice(3,5),16),
 parseInt(r.color.slice(5,7),16)
]);
const originalPng=images.biome.bytes.toString('base64');
const background='<image x="'+(-crop.x*width/crop.width)+
 '" y="'+(-crop.y*height/crop.height)+
 '" width="'+(images.biome.img.width*width/crop.width)+
 '" height="'+(images.biome.img.height*height/crop.height)+
 '" preserveAspectRatio="none" href="data:image/png;base64,'+
 originalPng+'"/>';
function pngChunk(name,data){
 const n=Buffer.alloc(4),c=Buffer.alloc(4),t=Buffer.from(name,'ascii');
 n.writeUInt32BE(data.length,0);
 let crc=0xffffffff;
 for(const b of Buffer.concat([t,data])){
  crc^=b;
  for(let k=0;k<8;k++)crc=(crc&1)?(crc>>>1)^0xedb88320:crc>>>1;
 }
 c.writeUInt32BE((crc^0xffffffff)>>>0,0);
 return Buffer.concat([n,t,data,c]);
}
function maskPng(own){
 if(own?.length!==width*height)hold('raster preview ownership dimensions invalid');
 const ihdr=Buffer.alloc(13);
 ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);
 ihdr[8]=8;ihdr[9]=6;
 const raw=Buffer.alloc(height*(width*4+1));
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const index=y*width+x,v=own[index],off=y*(width*4+1)+1+x*4;
  if(labels[index]!==30){
   if(v)hold('preview attempts to color detached source cell');
   continue;
  }
  const rgb=v?colors[v-1]:[119,135,153];
  if(!rgb)hold('invalid ownership code in source sample');
  raw[off]=rgb[0];raw[off+1]=rgb[1];raw[off+2]=rgb[2];
  raw[off+3]=v?124:48;
 }
 return Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]),
  pngChunk('IHDR',ihdr),
  pngChunk('IDAT',deflateSync(raw,{level:7})),
  pngChunk('IEND',Buffer.alloc(0))
 ]).toString('base64');
}
const imgs=[maskPng(imageMasks.baseline),maskPng(imageMasks.refined)];
const svgPath=(pts,close=true)=>pts.map((q,i)=>
 (i?'L':'M')+q.x+' '+q.y).join(' ')+(close?' Z':'');
const sourceInk='<path d="'+svgPath(revised.originalContour)+
 '" fill="none" stroke="#FFFFFF" stroke-width="1.15"/>';
const held=revised.protectedOffshore.map(x=>
 '<path d="'+svgPath(x.points)+
 '" fill="none" stroke="#FF9FA9" stroke-dasharray="4 3" stroke-width="1.8"/>').join('');
const outlines=(g)=>g.regions.map((r,i)=>
 '<path d="'+svgPath(r.polygonRing)+
 '" fill="none" stroke="'+baseline.regions[i].color+
 '" stroke-width="1.85"/>').join('');
const endpoints=[35,59,24,75,115].map(i=>{
 const q=revised.originalContour[i];
 return '<circle cx="'+q.x+'" cy="'+q.y+
 '" r="'+(i===35||i===59?3.9:2.7)+
 '" fill="'+(i===35||i===59?'#FF6147':'#FFCD77')+
 '" stroke="#102030" stroke-width=".7"/>';
}).join('');
const arc=(a,b)=>{
 let i=a,out=[];
 for(let j=0;j<599;j++){
  out.push(revised.originalContour[i]);
  if(i===b)break;
  i=(i+1)%599;
 }
 return svgPath(out,false);
};
const kh='<path d="'+arc(35,59)+
 '" fill="none" stroke="#FFD344" stroke-width="3.3"/>';
const ne='<path d="'+arc(75,116)+
 '" fill="none" stroke="#FFAC68" stroke-width="2.3" stroke-dasharray="3 3"/>';
const panel=(x,y,w,h,view,mask,geom,extra='')=>'<svg x="'+x+'" y="'+y+
 '" width="'+w+'" height="'+h+'" viewBox="'+view.join(' ')+
 '" preserveAspectRatio="xMidYMid meet">'+background+
 '<image x="0" y="0" width="'+width+'" height="'+height+
 '" preserveAspectRatio="none" href="data:image/png;base64,'+mask+'"/>'+
 sourceInk+held+outlines(geom)+kh+ne+endpoints+extra+'</svg>'+
 '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+
 '" fill="none" stroke="#9DB1C7" stroke-width="2"/>';
const title=(x,y,t,size=20,color='#F2F6FA')=>
 '<text x="'+x+'" y="'+y+'" font-size="'+size+
 '" fill="'+color+'">'+esc(t)+'</text>';
const head='<rect width="100%" height="100%" fill="#12263A"/>';
if(mode==='--svg'){
 const view=[40,90,620,480],W=2540,H=1140;
 const s='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+
 '" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+head+
 title(34,45,'KAELVAR C1-P / SOURCE-CLIPPED MAINLAND TERRAIN REVIEW',29)+
 title(34,78,'C1-O baseline versus C1-P refined, both noncanonical; original source imagery verified',18,'#FFCFA1')+
 panel(30,115,1220,890,view,imgs[0],baseline)+
 panel(1290,115,1220,890,view,imgs[1],revised)+
 title(36,1050,'C1-O baseline / 53,158 assigned candidate cells',21)+
 title(1296,1050,'C1-P refined / '+report.measurements.previewAssignedMainlandTerrainCells+
 ' assigned, '+report.measurements.remainingUnassignedMainlandTerrainCells+' unassigned',21)+
 title(36,1096,'Yellow: Kharuun B edges 35-58; orange dash: unowned NE headland; pink: held offshore contours',17,'#FFE1AF')+
 '</svg>\n';
 process.stdout.write(s);
 process.exit(0);
}
if(mode==='--north-svg'){
 const view=[54,102,510,275];
 const s='<svg xmlns="http://www.w3.org/2000/svg" width="2540" height="1100" viewBox="0 0 2540 1100">'+head+
 title(35,44,'KAELVAR C1-P / NORTHWEST, INNER BAY AND NORTHEAST HEADLAND',28)+
 title(35,78,'Source original vertices, Kharuun option B kept; orange headland has no owner',19,'#FFD4A3')+
 panel(35,112,1200,875,view,imgs[0],baseline)+
 panel(1305,112,1200,875,view,imgs[1],revised)+
 title(40,1034,'C1-O baseline northern inland edge',20)+
 title(1310,1034,'C1-P revised variable-depth northern inland edge',20)+
 '</svg>\n';
 process.stdout.write(s);
 process.exit(0);
}

if(mode==='--headland-svg'){
 const path=headland.candidateCorridors[0];
 const seed={x:390,y:336},target={x:492,y:215};
 const pathStr=path.found?path.path.map((q,i)=>(i?'L':'M')+
  (q.x+.5)+' '+(q.y+.5)).join(' '):'';
 const draw='<path d="'+pathStr+
  '" fill="none" stroke="#55F7F2" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3.2 2.2"/>'+
  [seed,target].map((q,i)=>'<circle cx="'+(q.x+.5)+'" cy="'+(q.y+.5)+
   '" r="4.5" fill="'+(i?'#FFCF7A':'#58F7ED')+
   '" stroke="#071828" stroke-width="1.5"/>').join('');
 const view=[375,186,170,170];
 const intro=path.found?'Source terrain-candidate corridor exists; not an approved political or travel route':
  'No verified path in source-constrained search window: Verdant extension HELD';
 const s='<svg xmlns="http://www.w3.org/2000/svg" width="2540" height="1130" viewBox="0 0 2540 1130">'+head+
  title(35,44,'C1-Q / NORTHEAST HEADLAND - TWO OPTIONS, NO REGION ALLOCATION',28)+
  title(35,77,'All 79,419 terrain candidates remain in C1-P accounting; islands, source coastline and canon untouched',18,'#FFCFA1')+
  panel(35,115,1200,875,view,imgs[1],revised)+
  panel(1305,115,1200,875,view,imgs[1],revised,draw)+
  title(45,1030,'OPTION A - KEEP HEADLAND AND EASTERN FLANK UNASSIGNED',21)+
  title(1312,1030,'OPTION B - VERDANT CONNECTION FEASIBILITY ONLY',21)+
  title(45,1070,'Gold Kharuun 35-58 / Orange NE 75-115 unassigned / Pink detached coast contours',16,'#FFE0A6')+
  title(1312,1070,intro,16,path.found?'#98FFEF':'#FBB9A4')+
  title(45,1101,'A path through uncalibrated source terrain candidates does not certify mainland walkability, sea type, sovereignty or a valid new polygon.',16)+
  '</svg>\n';
 process.stdout.write(s);
 process.exit(0);
}
