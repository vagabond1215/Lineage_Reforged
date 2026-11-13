/**
 * Forward-only architectural gate. Grandfathers the exact previously tracked
 * legacy simulation/travel/settlement references, but rejects NEW hex-coupled
 * source lines after the coordinate-first migration decision.
 *
 * No file writes, schema migration, runtime conversion or automatic deletion.
 */
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';

export const HEX_LEGACY_BASELINE =
  '1731975e3ec3675089b12d72513b50434ef71f23';
const filePattern=/\.(?:js|mjs|cjs|ts|tsx|mts|cts|json|ps1)$/i;
const tokenPattern=/\b(?:world_hex(?:_edge)?s?|world_hex(?:_edge)?\.[a-z0-9_]+|worldHex(?:Id|Ids|EdgeId|EdgeIds|es|Edges|CandidateRecords)?|hexAnchorId|(?:origin|destination|from|to)HexId|orderedHexIds|hexSpan|HEX_DISTANCE_KILOMETERS|loadWorldHex(?:Edge)?Content|hexesById|edgesById|hexesJson|edgesJson|hexAvailabilityCache|HexResourceAvailabilityState)\b/i;
const scopes=['package.json','packages','apps','tools','scripts','tests'];
const exclusions=new Set([
  'scripts/lib/legacy-hex-forward-gate.mjs',
  'scripts/check-no-new-hex-dependencies.mjs',
  'tests/unit/legacy-hex-forward-gate.test.mjs',
]);
const fail = why => {throw Error('Forward coordinate-first gate HOLD: '+why);};
export const legacyHexLines = text => String(text).split(/\r?\n/).
  map((line,index)=>({line:index+1,text:line.trim()})).
  filter(v=>tokenPattern.test(v.text));
/**
 * Existing lines can be removed, but changing an old line while keeping
 * a legacy token is intentionally treated as a new coupling pending review.
 * A multiset stops moving a single old line to cover many new references.
 */
export function addedLegacyHexLines(currentText,oldText) {
  const old=new Map();
  for(const item of legacyHexLines(oldText))
    old.set(item.text,(old.get(item.text)||0)+1);
  const added=[];
  for(const item of legacyHexLines(currentText)) {
    const left=old.get(item.text)||0;
    if(left)old.set(item.text,left-1);
    else added.push(item);
  }
  return added;
}
const git=(repoRoot,...args)=>execFileSync('git',args,{
  cwd:repoRoot,encoding:'utf8',maxBuffer:12*1024*1024,
  stdio:['ignore','pipe','pipe'],
});
/** Scan only maintained source and executable JSON, not explanatory design docs. */
export function inspectNewLegacyHexDependencies({
  repoRoot,baseline=HEX_LEGACY_BASELINE,
}){
  if(!repoRoot||typeof baseline!=='string'||!/^[0-9a-f]{40}$/.test(baseline))
    fail('invalid pinned baseline or root');
  const cwd=resolve(repoRoot);
  try{
    git(cwd,'cat-file','-e',baseline+'^{commit}');
    git(cwd,'merge-base','--is-ancestor',baseline,'HEAD');
  }catch{fail('frozen legacy baseline must be a verified HEAD ancestor');}
  let paths;
  try{
    paths=git(cwd,'ls-files','-z','--cached','--others','--exclude-standard',
      '--',...scopes).split('\0').filter(Boolean);
  }catch{fail('cannot enumerate tracked and untracked source paths');}
  const findings=[],seen=new Set();
  for(const path of paths) {
    if(seen.has(path)||exclusions.has(path)||!filePattern.test(path))continue;
    seen.add(path);
    const absolute=resolve(cwd,path);
    if(relative(cwd,absolute).startsWith('..')||!existsSync(absolute))
      continue;
    const content=readFileSync(absolute,'utf8');
    if(!legacyHexLines(content).length)continue;
    let old='';
    try{old=git(cwd,'show',baseline+':'+path);}
    catch{old='';} // File was introduced after the frozen ancestor.
    const added=addedLegacyHexLines(content,old);
    if(added.length)findings.push({
      path,addedLines:added.map(x=>({
        line:x.line,text:x.text.slice(0,240),
      })),
    });
  }
  return {
    status:findings.length?'NEW_LEGACY_HEX_DEPENDENCIES_HELD':'NO_NEW_LEGACY_HEX_DEPENDENCIES',
    baseline,scannedCodeFiles:seen.size,
    grandfatheredLegacyReferencesAllowed:true,
    newLegacyDependencies:findings.length,findings,
  };
}
