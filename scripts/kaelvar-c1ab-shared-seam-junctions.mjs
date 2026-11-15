#!/usr/bin/env node
/** Read-only native C1-AB junction review, no original or canonical writes. */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {loadRelativeReview} from './kaelvar-c1aa-relative-review.mjs';
import {buildC1ABJunctionAudit} from './lib/kaelvar-c1ab-shared-seam-junction-audit.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const load=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
export function runJunctionAudit(){
 const spec=load('docs/design/kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json');
 const p=load('docs/design/kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json');
 const evidence=load('docs/design/kaelvar-c1aa-relative-relief-native-evidence-2026-11-15.json');
 const {report}=loadRelativeReview();
 return buildC1ABJunctionAudit({spec,p,evidence,nativeReport:report});
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv[2]!=='--check')throw Error(
  'Usage: node scripts/kaelvar-c1ab-shared-seam-junctions.mjs --check');
 process.stdout.write(JSON.stringify(runJunctionAudit(),null,2)+'\n');
}
