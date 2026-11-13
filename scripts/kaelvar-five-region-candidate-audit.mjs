#!/usr/bin/env node
/**
 * Read-only Kaelvar five-region candidate authoring audit.
 * `--check` outputs JSON; no integration or writes.
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateKaelvarFiveRegionCandidates}
  from './lib/kaelvar-five-region-candidate-audit.mjs';

if(process.argv.length!==3||process.argv[2]!=='--check'){
  console.error('Usage: --check (read-only authored candidate verification)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8').replace(/^\uFEFF/,''));
const regionPack=read('docs/design/kaelvar-five-region-candidate-region-records-2026-11-13.json');
const localityPack=read('docs/design/kaelvar-five-region-locality-environment-and-settlement-candidates-2026-11-13.json');
const ecologyPack=read('docs/design/kaelvar-five-region-ecology-and-generation-candidates-2026-11-13.json');
const activeRegions=read('packages/content/base/world/regions.json').records;
const activeLocalities=read('packages/content/base/world/region_localities.json').records;
const activeSettlements=read('packages/content/base/world/settlements.json').records;
const result=validateKaelvarFiveRegionCandidates({
  regionPack,localityPack,ecologyPack,
  activeRegions,activeLocalities,activeSettlements,
});
process.stdout.write(JSON.stringify(result,null,2)+'\n');
