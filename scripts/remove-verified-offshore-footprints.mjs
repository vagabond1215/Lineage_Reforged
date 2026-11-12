#!/usr/bin/env node
/**
 * Exact, idempotent source repair of 42 owner-verified offshore polygon parts.
 * Never edits source PNGs, coastlines, biome zones, settlements or travel content.
 *
 * node scripts/remove-verified-offshore-footprints.mjs --check
 * node scripts/remove-verified-offshore-footprints.mjs --write
 *
 * This must run from an authenticated local checkout. It intentionally checks
 * original IDs/shape/landmask evidence before removing any full-source records.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
const FEATURE=resolve(ROOT,'packages/content/base/world/world_map_features.json');
const MANIFEST=resolve(ROOT,'docs/design/first-world-verified-offshore-footprint-removals-2026-11-12.json');
const manifest=JSON.parse(readFileSync(MANIFEST,'utf8'));
const approved=new Set(manifest.excludedFeatureIds);
const argv=process.argv.slice(2);
const write=argv.includes('--write');
const check=argv.includes('--check');
if((!write&&!check)||(write&&check)||argv.some(a=>!['--write','--check','--json'].includes(a))) {
  console.error('Usage: node scripts/remove-verified-offshore-footprints.mjs --check|--write [--json]');
  process.exit(2);
}
if(approved.size!==42||manifest.excludedFeatureIds.length!==42)
  throw Error('The owner-approved 42-ID exclusion manifest has changed; review required.');
const raw=readFileSync(FEATURE,'utf8');
const doc=JSON.parse(raw.replace(/^\uFEFF/,''));
const record=doc.records.find(x=>x.mapId==='world_map.first_world');
if(!record)throw Error('First World source record missing');
const footprints=record.regionFootprints;
const byId=new Map(footprints.map(f=>[f.id,f]));
const remaining=manifest.excludedFeatureIds.filter(id=>byId.has(id));
const missingFromSource=manifest.excludedFeatureIds.filter(id=>!byId.has(id));
function isExactSquare(points){
 if(!Array.isArray(points)||points.length!==4)return false;
 const xs=[...new Set(points.map(p=>p.x))],ys=[...new Set(points.map(p=>p.y))];
 return xs.length===2&&ys.length===2&&Math.abs(xs[0]-xs[1])===8&&Math.abs(ys[0]-ys[1])===8;
}
function within(point,points){
 let inside=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j];
  if((a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }
 return inside;
}
for(const id of remaining) {
 const part=byId.get(id),p=part.points;
 if(!isExactSquare(p))throw Error('Approved part is not an exact 8x8 polygon: '+id);
 const x=(Math.min(...p.map(v=>v.x))+Math.max(...p.map(v=>v.x)))/2;
 const y=(Math.min(...p.map(v=>v.y))+Math.max(...p.map(v=>v.y)))/2;
 if(record.coastlines.some(c=>within({x,y},c.points)))
   throw Error('Approved offshore part now overlaps source coastline; refuse to remove: '+id);
}
const otherSquares=footprints.filter(f=>isExactSquare(f.points)&&!approved.has(f.id));
if(otherSquares.length)throw Error('Unreviewed exact 8x8 footprint parts exist: '+otherSquares.map(x=>x.id).join(', '));
if(remaining.length!==0&&remaining.length!==42)
  throw Error('Partially applied cleanup: '+remaining.length+' still present. Review source before proceeding.');
if(remaining.length===0&&footprints.length!==159)
  throw Error('Already-clean source does not contain expected 159 parts: '+footprints.length);
if(remaining.length===42&&footprints.length!==201)
  throw Error('Original source part count unexpectedly changed: '+footprints.length);
function reconstructWithoutApproved(text) {
 const pos=text.indexOf('"regionFootprints"'),arrayStart=text.indexOf('[',pos);
 if(pos<0||arrayStart<0)throw Error('No regionFootprints source array.');
 let quoted=false,slash=false,depth=0,start=-1,arrayEnd=-1;
 const entries=[];
 for(let i=arrayStart+1;i<text.length;i++){
  const ch=text[i];
  if(quoted){if(slash)slash=false;else if(ch==='\\')slash=true;else if(ch==='"')quoted=false;continue;}
  if(ch==='"'){quoted=true;continue;}
  if(ch==='{'){if(depth===0)start=i;depth++;}
  else if(ch==='}'){depth--;if(depth===0){entries.push({start,end:i+1,raw:text.slice(start,i+1)});start=-1;}}
  else if(ch===']'&&depth===0){arrayEnd=i;break;}
 }
 if(entries.length!==201||arrayEnd<0)throw Error('Unexpected JSON source-array layout.');
 const kept=[];
 for(let i=0;i<entries.length;i++){
  const entry=entries[i],data=JSON.parse(entry.raw);
  if(!approved.has(data.id))kept.push({index:i,...entry});
 }
 if(kept.length!==159)throw Error('Expected 159 preserved source parts.');
 const prefix=text.slice(arrayStart+1,entries[0].start),suffix=text.slice(entries.at(-1).end,arrayEnd);
 let contents=prefix;
 for(let i=0;i<kept.length;i++){
  const e=kept[i];
  if(i){
   const previous=entries[e.index-1];
   const sep=text.slice(previous.end,e.start);
   if(!/^\s*,\s*$/.test(sep))throw Error('Unexpected regionPart separator.');
   contents+=sep;
  }
  contents+=e.raw;
 }
 contents+=suffix;
 return text.slice(0,arrayStart+1)+contents+text.slice(arrayEnd);
}
let updated=raw;
if(remaining.length===42){
 updated=reconstructWithoutApproved(raw);
 const final=JSON.parse(updated.replace(/^\uFEFF/,''));
 const post=final.records.find(x=>x.mapId==='world_map.first_world');
 if(post.regionFootprints.length!==159||post.regionFootprints.some(p=>approved.has(p.id)))
   throw Error('Post-clean source inventory failed.');
 const canonical={...record,regionFootprints:undefined};
 const inspected={...post,regionFootprints:undefined};
 if(JSON.stringify(canonical)!==JSON.stringify(inspected))
   throw Error('Out-of-scope source record property would change.');
 const otherBefore=doc.records.filter(x=>x.mapId!=='world_map.first_world');
 const otherAfter=final.records.filter(x=>x.mapId!=='world_map.first_world');
 if(JSON.stringify(otherBefore)!==JSON.stringify(otherAfter))
   throw Error('Another world map record would change.');
}
const summary={
 status:remaining.length===0?'SOURCE_ALREADY_CLEAN':write?'SOURCE_CLEANED':'CLEANUP_PENDING',
 originalFootprints:footprints.length,authorizedRemovals:approved.size,
 remainingApprovedArtifacts:write?0:remaining.length,
 targetFootprints:159,sourceChanged:write&&remaining.length>0,
 sourcePath:'packages/content/base/world/world_map_features.json'
};
if(write&&remaining.length>0)writeFileSync(FEATURE,updated,'utf8');
if(argv.includes('--json'))console.log(JSON.stringify(summary,null,2));
else console.log(summary.status+': '+JSON.stringify(summary));
if(check&&remaining.length>0)process.exitCode=1;
