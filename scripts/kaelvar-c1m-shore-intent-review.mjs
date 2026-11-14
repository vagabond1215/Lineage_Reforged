#!/usr/bin/env node
/** Owner-accepted short Kharuun shoreline, exact political coast still held. */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateC1MShoreIntent,buildC1MReview}
 from './lib/kaelvar-c1m-shore-intent-review.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
 console.error('Usage: --check|--svg (no canonical geographic writes)');
 process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
const m=json('docs/design/kaelvar-c1m-owner-shore-correction-2026-11-14.json');
const l=json(m.predecessor.reviewPath);
const j=json('docs/design/kaelvar-c1j-coastline-sector-review-2026-11-13.json');
validateC1MShoreIntent(m,l,j);
const call=(file,arg)=>execFileSync(process.execPath,
 [resolve(root,file),arg],{
  cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,
 });
const old=JSON.parse(call('scripts/kaelvar-c1l-landmass-review.mjs','--check'));
const review=buildC1MReview(old,m);
const report={
 ...review,
 originalSourceVectorBlob:old.originalSourceVectorBlob,
 originalSourcePngsVerified:old.sourcePngRegistrationVerified,
 previousC1LReportStatus:old.status,
 ownerDecision:m.ownerVisualDecision,
 regionDescriptions:m.territorialIntents,
 coastalSourceEvidence:{
   originalMainlandSourceId:j.mainlandSource.id,
   originalSourceEdges:599,
   northernSectors:old.countsBySourceArcStatus,
   oldSourceArcClassificationRetained:true,
   exactKharuunShoreSourceEdgeIndices:null,
   exactVeyrholmShoreSourceEdgeIndices:null,
   geographicCoastAndSeaCalibrated:false,
 },
 approval:m.approval,
};
if(mode==='--check'){
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}else{
 const base=call('scripts/kaelvar-c1j-coastline-review.mjs','--svg');
 if(!base.trimEnd().endsWith('</svg>'))
   throw Error('C1-M source SVG shape drift');
 // The previous blue/yellow guide masks are NOT physical coastlines;
 // suppress both rather than present the rejected coastal ribbon as a border.
 const guideMask=/<path fill="#(?:80C2F5|D9B16D)" fill-opacity="\.28" d="[^"]*"\/>/g;
 const stripped=base.replace(guideMask,'');
 if(stripped===base)
   throw Error('C1-M expected stale guide-mask imagery was not found');
 let svg=stripped.replace(
  'KAELVAR C1-J / ORIGINAL COASTLINE VECTORS / NO BORDERS OR WATER SEMANTICS APPROVED',
  'KAELVAR C1-M / KHARUUN SMALL NORTH SHORE ACCEPTED / EXACT FRONTAGE HELD');
 svg=svg.replace(
  '3. Current guide cells, held islands, separate river',
  '3. Original contour only: rejected shoreline ribbon removed');
 svg=svg.replace(
  'NE island, Shattercap components, Coast 40 and Serathyl Windward remain disputed. No Kharuun port, salt basin or route is approved.',
  'NE island / Shattercap / Coast 40 / Serathyl holds. Kharuun small north shore ACCEPTED as intent, no port or boundary placed.');
 svg=svg.replace(
  'Registered 2048x1152 | 599 exact original mainland edges | 79,419 terrain candidates | 26,795 unassigned | canonical publication OFF.',
  '599 original source edges | Kharuun shore EXISTS in design | exact coast and Veyrholm inland division UNPLACED | canonical OFF.');
 const end=svg.lastIndexOf('</svg>');
 const stamp='<text x="1280" y="19" fill="#F5D28A" font-size="14">'+
  'OWNER SHORE DECISION: YES  |  CITY/PORT NOT PLACED</text>';
 process.stdout.write(svg.slice(0,end)+stamp+svg.slice(end));
}
