/**
 * C1 read-only source witness.
 * Git object identity survives Windows core.autocrlf checkout conversion.
 * Validate the pinned committed blob AND the clean working tree; read the
 * canonical Git bytes, never silently normalize and rehash a changed file.
 */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';

export const C1_VECTOR_SOURCE_PATH=
  'packages/content/base/world/world_map_features.json';
const fail=reason=>{throw Error('C1 source registration HOLD: '+reason);};
const git=(cwd,...args)=>execFileSync('git',args,{
  cwd,encoding:'buffer',maxBuffer:32*1024*1024,
  stdio:['ignore','pipe','pipe'],
});
const blobHash=data=>createHash('sha1')
  .update('blob '+data.length+'\0').update(data).digest('hex');

/**
 * Exact source variants are passed in by the separately reviewed C1 registry.
 * A checkout with CRLF files may be clean according to Git even when raw
 * working-tree bytes differ from the immutable blob stored in HEAD.
 */
export function readPinnedCommittedVectorSource({
  repoRoot,sourcePath=C1_VECTOR_SOURCE_PATH,acceptedBlobShas,
}){
  if(!repoRoot||sourcePath!==C1_VECTOR_SOURCE_PATH||
    !Array.isArray(acceptedBlobShas)||acceptedBlobShas.length===0||
    acceptedBlobShas.some(sha=>typeof sha!=='string'||!/^[0-9a-f]{40}$/.test(sha)))
    fail('invalid source path or source witness allowlist');
  const cwd=resolve(repoRoot);
  if(!existsSync(resolve(cwd,sourcePath)))
    fail('source file absent in worktree');
  let sha;
  try{
    sha=git(cwd,'rev-parse','HEAD:'+sourcePath).toString('utf8').trim();
  }catch{
    fail('committed source identity unavailable');
  }
  if(!acceptedBlobShas.includes(sha))
    fail('unrecognized original source blob');
  try{
    // Git diff uses repository checkout/clean filters, including core.autocrlf.
    // It rejects semantic modifications and staged changes, not harmless CRLF.
    git(cwd,'diff','--quiet','HEAD','--',sourcePath);
  }catch{
    fail('working source differs from verified committed blob');
  }
  let bytes;
  try{
    bytes=git(cwd,'show','HEAD:'+sourcePath);
  }catch{
    fail('cannot read committed source bytes');
  }
  if(blobHash(bytes)!==sha)
    fail('committed source bytes do not match pinned object identity');
  return {sourceBlob:sha,sourceBytes:bytes};
}
