#!/usr/bin/env node
/** Read-only architecture guard. Newly authored systems must use coordinates,
 * place IDs, polygons and explicit route topology, not legacy hex ownership. */
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectNewLegacyHexDependencies}
  from './lib/legacy-hex-forward-gate.mjs';
if(process.argv.length!==3||process.argv[2]!=='--check'){
  console.error('Usage: --check (read-only, no changes)');
  process.exit(2);
}
const repoRoot=resolve(fileURLToPath(new URL('..',import.meta.url)));
const result=inspectNewLegacyHexDependencies({repoRoot});
process.stdout.write(JSON.stringify(result,null,2)+'\n');
if(result.newLegacyDependencies)process.exitCode=1;
