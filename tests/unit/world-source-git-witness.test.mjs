import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join} from 'node:path';
import {
  C1_VECTOR_SOURCE_PATH,readPinnedCommittedVectorSource,
} from '../../scripts/lib/world-source-git-witness.mjs';
const git=(cwd,...args)=>execFileSync('git',args,{
  cwd,encoding:'utf8',stdio:['ignore','pipe','pipe'],
}).trim();
test('Source fingerprint uses immutable Git bytes even with Windows-style checkout CRLF',()=>{
  const cwd=mkdtempSync(join(tmpdir(),'lineage-c1-git-witness-'));
  try{
    git(cwd,'init','--quiet');
    git(cwd,'config','user.name','C1 Fixture');
    git(cwd,'config','user.email','c1-fixture@example.invalid');
    git(cwd,'config','core.autocrlf','true');
    const path=join(cwd,C1_VECTOR_SOURCE_PATH);
    mkdirSync(dirname(path),{recursive:true});
    const source='\uFEFF{\n  "records": [\n    {"id": "world_map.first_world"}\n  ]\n}\n';
    writeFileSync(path,source,'utf8');
    git(cwd,'add','--',C1_VECTOR_SOURCE_PATH);
    git(cwd,'commit','--quiet','-m','fixture');
    const blob=git(cwd,'rev-parse','HEAD:'+C1_VECTOR_SOURCE_PATH);
    // Simulate Windows checkout materialization without changing Git content.
    writeFileSync(path,source.replace(/\n/g,'\r\n'),'utf8');
    assert.match(readFileSync(path,'utf8'),/\r\n/);
    const actual=readPinnedCommittedVectorSource({
      repoRoot:cwd,acceptedBlobShas:[blob],
    });
    assert.equal(actual.sourceBlob,blob);
    assert.equal(actual.sourceBytes.toString('utf8'),source);
    assert.equal(actual.sourceBytes.includes(Buffer.from('\r\n')),false);
    // A modified geometry file must still fail closed, regardless of EOL.
    writeFileSync(path,source.replace('world_map.first_world','world_map.forged')
      .replace(/\n/g,'\r\n'),'utf8');
    assert.throws(()=>readPinnedCommittedVectorSource({
      repoRoot:cwd,acceptedBlobShas:[blob],
    }),/working source differs/);
    // A different committed source is not accepted just because it parses.
    writeFileSync(path,source.replace(/\n/g,'\r\n'),'utf8');
    assert.throws(()=>readPinnedCommittedVectorSource({
      repoRoot:cwd,acceptedBlobShas:['0'.repeat(40)],
    }),/unrecognized original source blob/);
  }finally{
    rmSync(cwd,{recursive:true,force:true});
  }
});
