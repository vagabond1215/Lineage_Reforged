#!/usr/bin/env node
/**
 * C1-G readable ecology review, stdout only. This is not the source PNG
 * classifier or a polygon authoring command.
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  validateKaelvarC1GEcology,assessKaelvarEvidenceReadiness,
} from './lib/kaelvar-c1g-ecology-evidence.mjs';
const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--review'].includes(mode)){
  console.error('Usage: --check|--review (no canonical writes)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8').replace(/^\uFEFF/,''));
const path='docs/design/kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json';
const review=read(path);
const result=validateKaelvarC1GEcology({
  review,
  c1fGuides:read(review.sourcePaths.c1fGuides),
  c1Ledger:read(review.sourcePaths.c1Review),
  localityPack:read(review.sourcePaths.localityPack),
  ecologyPack:read(review.sourcePaths.ecologyPack),
});
const evidence={
  coastal:assessKaelvarEvidenceReadiness(review.coast.default.evidenceRequirements),
  dryCoast:assessKaelvarEvidenceReadiness(review.coast.alternative.evidenceRequirements),
  saltBasins:assessKaelvarEvidenceReadiness(review.drylands.saltFlat.evidenceRequirements),
};
if(mode==='--check'){
  process.stdout.write(JSON.stringify({...result,evidence},null,2)+'\n');
}else{
  const bullet=(name,value)=>'- **'+name+':** '+value+'\n';
  process.stdout.write(
    '# Kaelvar C1-G: coastline and inland salt basin evidence review\n\n'+
    'Status: NONCANONICAL, NO BORDERS, BASIN COORDINATES OR SOVEREIGNTY APPROVED.\n\n'+
    '## Working coastal hypotheses\n\n'+
    bullet('Default','Veyrholm forms an irregular continuous northern MAINLAND shore, shaped by cliffs, inlets, freshwater valleys, ridges and settlements; not a uniform buffer.')+
    bullet('Conditional exception','Kharuun may touch the northern ocean ONLY if a specific source-backed arid coastline is independently reviewed and owner-approved.')+
    bullet('Water','Coastal estuaries are not automatic potable sources. No harbor or route appears just because it is adjacent to the sea.')+
    '## Drylands and salt flats\n\n'+
    bullet('Location','Closed interior drainage basins; geometry, verified basin count, hydrography and coordinates still NULL.')+
    bullet('Formation','Episodic mineral-bearing inflow, repeated evaporation and salt-crust formation are hypotheses requiring physical and climatic evidence.')+
    bullet('Existing IDs','Kharuun Salt Basins locality, corresponding coordinate-first environmental-zone candidate, kharuun.saltpan habitat and Tirash Saltworks outpost concept.')+
    bullet('Risk and viability','Flash floods, unstable crust, extreme heat and dependable imported freshwater constrain mining and settlement.')+
    '## Outstanding independent evidence\n\n'+
    bullet('Northern-coast continuity',evidence.coastal.missing.join(', '))+
    bullet('Possible dry coast',evidence.dryCoast.missing.join(', '))+
    bullet('Interior evaporites',evidence.saltBasins.missing.join(', '))+
    '\nNo source colors or elevation values have been promoted to ecological truth.\n'
  );
}
