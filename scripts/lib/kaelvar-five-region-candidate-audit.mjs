/**
 * Fail-closed audit for master-hosted but noncanonical Kaelvar five-region
 * authored content. It validates catalog-shaped records without publishing
 * new region IDs, localities, hexes, settlement coordinates or borders.
 */
const fail = x => {throw Error('Kaelvar five-region candidate HOLD: '+x);};
const unique = (values,what) => {
  if(!Array.isArray(values)||new Set(values).size!==values.length||
     values.some(x=>typeof x!=='string'||!x.trim())) fail(what+' not unique');
};
const exactly = (a,b) => a.length===b.length&&a.every(x=>b.includes(x));
const keys = (record,baseline,what) => {
  for(const key of Object.keys(baseline)) if(!(key in record))
    fail(what+' missing field '+key);
};
const sum = entries => Object.values(entries).reduce((total,v)=>total+v,0);
const expected = ['region.kharuun_drylands','region.veyrholm_shore'];
const allChildren = [
  'region.auric_marches','region.kharuun_drylands',
  'region.verdant_thalos','region.veyrholm_shore','region.shattercap_isles'
];
export function validateKaelvarFiveRegionCandidates({
  regionPack,localityPack,ecologyPack,
  activeRegions,activeLocalities,activeWorldHexes,activeSettlements,
}){
  for(const [data,label] of [[regionPack,'region'],[localityPack,'locality'],
    [ecologyPack,'ecology']])
    if(!data||data.schemaVersion!==1||!Array.isArray(activeRegions)||
      !Array.isArray(activeLocalities)||!Array.isArray(activeWorldHexes)||
      !Array.isArray(activeSettlements))fail('invalid '+label+' source/schema');
  if(regionPack.status!=='MAINLINE_AUTHORED_PROPOSALS_NOT_ACTIVE_REGION_RECORDS'||
    localityPack.status!=='MAINLINE_DESIGN_ONLY_NOT_ACTIVE_LOCALITY_HEX_OR_SETTLEMENT_CONTENT'||
    ecologyPack.status!=='MAINLINE_DESIGN_ONLY_NO_ACTIVE_SPAWNS_ROUTES_OR_CANONICAL_MASKS'||
    regionPack.canonicalWritable!==false||
    localityPack.approval?.canonicalWritable!==false||
    ecologyPack.publicationHolds?.ownerApprovalRef!==null||
    ecologyPack.publicationHolds?.northeastLargeIslandIndivisible!==true)
    fail('premature world publication or island split');
  const rs=regionPack.newRegionRecords,ls=localityPack.localityRecords,
    hs=localityPack.worldHexCandidateRecords,ss=localityPack.settlementConcepts,
    es=ecologyPack.profiles;
  if(rs?.length!==2||ls?.length!==8||hs?.length!==8||ss?.length!==8||
     es?.length!==2||!exactly(rs.map(r=>r.id),expected)||
     !exactly(es.map(r=>r.regionId),expected))
    fail('two region, eight locality/hex/seed and ecology inventory required');
  unique(rs.map(x=>x.id),'region IDs');
  unique(ls.map(x=>x.id),'locality IDs');
  unique(hs.map(x=>x.id),'world hex IDs');
  unique(ss.map(x=>x.candidateId),'settlement concept IDs');
  const originalThree=['region.auric_marches','region.verdant_thalos',
    'region.shattercap_isles'];
  if(regionPack.macroRegionId!=='region.kaelvar'||
    !exactly(regionPack.existingChildRegionIds,originalThree)||
    regionPack.geographyHolds?.northeastLargeIsland!=='INDIVISIBLE_PARENT_PENDING'||
    regionPack.geographyHolds?.shattercapIslands!=='ALL_DETACHED_PENDING'||
    regionPack.geographyHolds?.noEqualAreaRequirement!==true)
    fail('parent geography, island or existing child identities drift');
  const activeById=new Map(activeRegions.map(x=>[x.id,x]));
  if(activeById.size!==activeRegions.length||
    !originalThree.every(id=>activeById.get(id)?.parentRegionId==='region.kaelvar')||
    activeById.get('region.kaelvar')?.regionType!=='continent')
    fail('active Kaelvar hierarchy drift');
  const oldPopulation=regionPack.populationScenario?.originalThreeRegionMillions;
  const nextPopulation=regionPack.populationScenario?.candidateFiveRegionMillions;
  if(!oldPopulation||!nextPopulation||
    !exactly(Object.keys(oldPopulation),originalThree)||
    !exactly(Object.keys(nextPopulation),allChildren)||
    !Object.values(nextPopulation).every(n=>Number.isInteger(n)&&n>0)||
    regionPack.populationScenario.macroEstimatedPopulationMillions!==40||
    sum(oldPopulation)!==40||sum(nextPopulation)!==40||
    !originalThree.every(id=>oldPopulation[id]===
      activeById.get(id)?.populationProfile?.estimatedPopulationMillions))
    fail('40-million population conservation or source baseline drift');
  const activeNames=new Set(
    [...activeRegions,...activeLocalities,...activeSettlements]
      .map(x=>x.name?.trim().toLowerCase()).filter(Boolean)
  );
  const introducedNames=[
    ...rs.map(x=>x.name),...ls.map(x=>x.name),...ss.map(x=>x.suggestedName)
  ];
  unique(introducedNames.map(x=>x.toLowerCase()),'new names');
  for(const name of introducedNames)
    if(activeNames.has(name.toLowerCase()))fail('name collision: '+name);
  const baseline=activeById.get('region.auric_marches');
  if(!baseline)fail('Auric schema missing');
  for(const r of rs){
    keys(r,baseline,'region '+r.id);
    if(activeById.has(r.id)||r.parentRegionId!=='region.kaelvar'||
       r.regionType!=='subregion'||
       !r.mapIds.includes('world_map.first_world')||
       r.populationProfile?.estimatedPopulationMillions!==nextPopulation[r.id]||
       r.populationProfile?.populationCapacityMillions!==nextPopulation[r.id]||
       r.simulationProfile?.populationCapacity!==nextPopulation[r.id]*1e6||
       r.populationProfile.urbanPopulationPercent+
         r.populationProfile.ruralPopulationPercent!==100||
       r.demographicProfile?.raceDistribution?.reduce((s,v)=>s+v.percentage,0)!==100)
      fail('region parent, population or race profile invalid: '+r.id);
    if(!Array.isArray(r.tags)||r.tags.length<4||
       !Array.isArray(r.environmentProfile?.dominantBiomeMix)||
       r.environmentProfile.dominantBiomeMix.length<3||
       !Array.isArray(r.civilizationNotes)||r.civilizationNotes.length<3||
       !Array.isArray(r.strategicNotes)||r.strategicNotes.length<3||
       !r.settlementDistributionModel?.targetCounts||
       Object.values(r.settlementDistributionModel.targetCounts)
         .some(n=>!Number.isInteger(n)||n<0))
      fail('region under-authored: '+r.id);
  }
  const activeLocalityIds=new Set(activeLocalities.map(x=>x.id));
  const activeHexIds=new Set(activeWorldHexes.map(x=>x.id));
  const localityById=new Map(ls.map(x=>[x.id,x]));
  for(const l of ls){
    keys(l,activeLocalities[0],'locality '+l.id);
    if(activeLocalityIds.has(l.id)||!expected.includes(l.regionId)||
       l.macroRegionId!=='region.kaelvar'||
       !l.id.endsWith(l.slug)||l.supportedSiteClasses?.length<1||
       !l.settlementSuitability?.favoredSettlementTypes?.length||
       Object.keys(l.resourceCatchment||{}).length!==9||
       Object.keys(l.routeAccessModifier||{}).length!==6)
      fail('locality fields or parent invalid: '+l.id);
  }
  for(const h of hs){
    keys(h,activeWorldHexes[0],'world hex '+h.id);
    if(activeHexIds.has(h.id)||!expected.includes(h.regionId)||
       localityById.get(h.localityBandId)?.regionId!==h.regionId||
       h.anchoredSettlementIds?.length!==0||
       Object.keys(h.frictionByMode||{}).length!==6||
       !Number.isFinite(h.habitabilityScore))
      fail('unapproved or incomplete world hex: '+h.id);
  }
  for(const s of ss){
    if(!expected.includes(s.regionId)||
       localityById.get(s.localityId)?.regionId!==s.regionId||
       s.spatialStatus!=='UNPLACED_NO_PIXEL'||s.canonicalSettlementId!==null||
       !Array.isArray(s.craftingServices)||s.craftingServices.length<2)
      fail('settlement concept became placed or has wrong parent: '+s.candidateId);
  }
  for(const e of es){
    if(!expected.includes(e.regionId)||e.ecology?.habitats?.length!==4||
       e.generationAndGameHooks?.crafting?.length<8||
       e.generationAndGameHooks?.routes?.length<3||
       e.generationAndGameHooks?.requiredDependencies?.length<3)
      fail('ecology/generation profile incomplete: '+e.regionId);
    unique(e.ecology.habitats.map(h=>h.id),'habitat IDs');
    for(const h of e.ecology.habitats)
      if(h.flora?.length<3||h.fauna?.length<3||
         h.monsterArchetypes?.length<2||h.resources?.length<3||
         h.hazards?.length<2||!h.settlementRule)
        fail('habitat incomplete: '+h.id);
  }
  if(ecologyPack.publicationHolds?.canonicalRegionCatalogUnchanged!==true||
     ecologyPack.publicationHolds?.canonicalWorldHexesUnchanged!==true||
     ecologyPack.publicationHolds?.canonicalSettlementsUnchanged!==true)
    fail('active world content publication guard removed');
  return {
    status:'FIVE_REGION_AUTHORING_COMPLETE_CANONICAL_HELD',
    newRegionCount:rs.length,newLocalityCount:ls.length,
    candidateHexCount:hs.length,unplacedSettlementConceptCount:ss.length,
    ecologicalHabitatCount:es.reduce((n,r)=>n+r.ecology.habitats.length,0),
    fiveRegionPopulationMillions:sum(nextPopulation),
    sourceThreeRegionPopulationMillions:sum(oldPopulation),
    canonicalWritable:false,ownerGeographyApprovalRequired:true
  };
}
