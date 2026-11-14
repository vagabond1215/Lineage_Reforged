/**
 * C1-G optional coastal-frontage and inland salt basin design-evidence gate.
 * No source color can become a certified biome or region merely by proximity.
 * This is pure review/authoring logic. Never writes active world state.
 */
import {validateC1FPlacementGuides}
  from './kaelvar-c1f-placement-intent.mjs';

const fail=reason=>{throw Error('C1-G ecology HOLD: '+reason);};
const sameSet=(a,b)=>Array.isArray(a)&&a.length===b.length&&
  new Set(a).size===a.length&&a.every(v=>b.includes(v));
const expectedRegionIds=[
  'region.auric_marches','region.kharuun_drylands','region.verdant_thalos',
  'region.veyrholm_shore','region.shattercap_isles',
];
const coastIds=[
  'source_shoreline_and_ink','northern_mainland_relief',
  'climate_and_maritime_reach','coastal_freshwater',
  'habitable_continuity','owner_border_review',
];
const seaExceptionIds=[
  'dry_coast_geographic_evidence','coastal_frontage_identity',
  'dry_coast_route_water_plan',
];
const saltIds=[
  'endorheic_drainage','basin_relief','mineral_evaporite',
  'evaporation_cycle','flood_hazard',
  'freshwater_logistics','owner_saltpan_placement',
];
const northernZones=[
  ['environment_zone.veyrholm_sheltered_inlets','region_locality.veyrholm_sheltered_inlets','veyrholm.inlets'],
  ['environment_zone.veyrholm_firshore_ridges','region_locality.veyrholm_firshore_ridges','veyrholm.firshore'],
  ['environment_zone.veyrholm_tidal_marshes','region_locality.veyrholm_tidal_marshes','veyrholm.marsh'],
  ['environment_zone.veyrholm_outer_capes','region_locality.veyrholm_outer_capes','veyrholm.capes'],
];
function evidenceRequirements(rows,expected,label){
  if(!Array.isArray(rows)||rows.length!==expected.length||
    !sameSet(rows.map(x=>x.id),expected))fail(label+' evidence gate inventory drift');
  for(const e of rows){
    if(typeof e.purpose!=='string'||!e.purpose.trim()||
      e.status!=='UNVERIFIED'||e.evidenceRef!==null)
      fail(label+' uncertified evidence was promoted');
  }
}
function exactObjectKeys(obj,expected,label){
  if(!obj||!sameSet(Object.keys(obj),expected))
    fail(label+' source references changed');
}
const mustExist=(items,id,label)=>Array.isArray(items)&&items.some(x=>x.id===id)||
  fail('missing '+label+': '+id);
export function validateKaelvarC1GEcology({
  review, c1fGuides, c1Ledger, localityPack, ecologyPack,
}){
  validateC1FPlacementGuides(c1fGuides,c1Ledger);
  if(review?.schemaVersion!==1||
    review.type!=='kaelvar-c1g-coastline-and-salt-basin-evidence.v1'||
    review.status!=='NONCANONICAL_ECOLOGICAL_BOUNDARY_REVIEW_HELD')
    fail('review identity or state changed');
  exactObjectKeys(review.sourcePaths,
    ['c1Review','c1fGuides','localityPack','ecologyPack'],'linked path');
  const expectedPaths={
    c1Review:'docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json',
    c1fGuides:'docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json',
    localityPack:'docs/design/kaelvar-five-region-locality-environment-and-settlement-candidates-2026-11-13.json',
    ecologyPack:'docs/design/kaelvar-five-region-ecology-and-generation-candidates-2026-11-13.json',
  };
  if(Object.keys(expectedPaths).some(k=>review.sourcePaths[k]!==expectedPaths[k]))
    fail('source content linkage changed');
  const authority=review.sourceAuthority;
  if(authority?.mapId!=='world_map.first_world'||
    authority.coordinateSpaceId!=='world_map.first_world.reference'||
    authority.sourceVariantPolicy!=='MATCH_PINNED_C1F_SOURCE_NOT_AUTOMATIC_CATALOG_TRANSFER'||
    authority.biomePaletteStatus!=='SOURCE_RGB_UNCALIBRATED'||
    authority.elevationScaleStatus!=='COLOR_RAMP_UNCALIBRATED'||
    authority.coastRiverInkStatus!=='NOT_INDEPENDENTLY_APPROVED'||
    authority.sourceClassification!=='TERRAIN_CANDIDATE_ONLY_NOT_CERTIFIED_LAND'||
    authority.parentAndIslandOwnership!=='OWNER_REVIEW_PENDING')
    fail('uncertified original-source semantics changed');
  const coast=review.coast;
  if(coast?.default?.scenarioId!=='veyrholm_continuous_coast_variable_depth'||
    coast.default.status!=='PREFERRED_DESIGN_HYPOTHESIS_NOT_APPROVED'||
    coast.default.mainlandRegionId!=='region.veyrholm_shore'||
    coast.default.adjacentDrylandRegionId!=='region.kharuun_drylands'||
    coast.default.shorelineCoverage!=='CONTINUOUS_NORTHERN_MAINLAND_AS_PROPOSAL_TARGET'||
    coast.default.depthRule!=='LANDFORM_DRAINAGE_SETTLEMENT_BASED_NOT_UNIFORM_PIXEL_DISTANCE'||
    coast.default.settlementConnections!=='ROUTES_NOT_INFERRED_FROM_CONTINUOUS_POLYGON'||
    coast.default.directKharuunSeaAccess!==false||
    coast.default.geometryRef!==null)
    fail('coastline default was promoted or forced uniform');
  evidenceRequirements(coast.default.evidenceRequirements,coastIds,'coastal continuity');
  if(coast.alternative?.scenarioId!=='limited_kharuun_dry_coast_if_geography_demands'||
    coast.alternative.status!=='CONDITIONAL_EXCEPTION_REQUIRES_SEPARATE_APPROVAL'||
    coast.alternative.mainlandRegionId!=='region.kharuun_drylands'||
    coast.alternative.shoreRegionId!=='region.veyrholm_shore'||
    coast.alternative.exceptionType!=='SMALL_GEOLOGICALLY_SUPPORTED_ARID_FRONTAGE'||
    coast.alternative.directKharuunSeaAccessApproved!==false||
    coast.alternative.geometryRef!==null)
    fail('unsupported dry coast frontage');
  evidenceRequirements(coast.alternative.evidenceRequirements,
    seaExceptionIds,'dry coast exception');
  if(!Array.isArray(coast.coastlineEcologyBands)||
    coast.coastlineEcologyBands.length!==4)
    fail('four coastal habitat contexts required');
  for(const [zoneId,localityId,habitatId] of northernZones){
    const row=coast.coastlineEcologyBands.find(z=>z.environmentZoneId===zoneId);
    if(!row||row.localityId!==localityId||row.habitatId!==habitatId||
      !row.waterRule||typeof row.waterRule!=='string'||
      row.sourceEvidenceRef!==null||row.geometryRef!==null||
      row.status!=='DESCRIPTIVE_PLACEMENT_PENDING')
      fail('Veyrholm ecological area was placed or modified: '+zoneId);
  }
  if(new Set(coast.coastlineEcologyBands.map(z=>z.environmentZoneId)).size!==4)
    fail('duplicated coastal ecological area');
  if(coast.transitionNarrative?.status!=='HYPOTHETICAL_NOT_SOURCE_CALIBRATED'||
    coast.transitionNarrative.coastWidthFixed!==false||
    coast.transitionNarrative.coastlineGuaranteesNoPhysicalSeaChannel!==false||
    coast.transitionNarrative.highlandRainShadowConfirmed!==false||
    !sameSet(coast.transitionNarrative.stages,[
      'OPEN_SEA_OR_TIDAL_COAST','SHELTERED_INLET_OR_WIND_EXPOSED_CAPE',
      'VARIABLE_WIDTH_COASTAL_BENCH_OR_FIR_RIDGE',
      'UPLAND_OR_ESCARPMENT_TRANSITION','INLAND_DRYLAND_BASINS',
    ]))
    fail('coastal inland process narrative drift');
  const dry=review.drylands,salt=dry?.saltFlat;
  if(dry?.regionId!=='region.kharuun_drylands'||
    dry.defaultAccess!=='INLAND_CARAVAN_AND_APPROVED_PASS_CONNECTIONS_ONLY'||
    salt?.localityId!=='region_locality.kharuun_salt_basins'||
    salt.environmentalZoneId!=='environment_zone.kharuun_salt_basins'||
    salt.existingHabitatId!=='kharuun.saltpan'||
    salt.settlementConceptId!=='settlement_concept.tirash_saltworks'||
    salt.developmentModel!=='MULTIPLE_CLOSED_BASINS_POSSIBLE_COUNT_UNVERIFIED'||
    salt.foodOrWaterGenerationAllowed!==false||
    salt.offshoreMarineSaltPanAssumed!==false||
    salt.geometryRef!==null||salt.mapCoordinates!==null||
    salt.physicalComponentId!==null||salt.verifiedBasinCount!==null||
    salt.status!=='DESIGN_ACCEPTED_PLACEMENT_UNVERIFIED')
    fail('salt flats were auto-placed or misidentified');
  if(!sameSet(salt.genesisHypotheses,[
    'INTERNALLY_DRAINED_DEPRESSION','EPISODIC_MINERAL_BEARING_INFLOW',
    'EVAPORATION_AND_EVAPORITE_CRUST',
    'INTERMITTENT_FLOODING_OR_SEASONAL_SALT_HARVEST'
  ])||!sameSet(salt.seasonalHazards,[
    'FLASH_FLOODS','HEAT_EXPOSURE','CRUST_COLLAPSE','WATER_SCARCITY',
  ]))fail('inland salt genesis or seasonal hazards drift');
  evidenceRequirements(salt.evidenceRequirements,saltIds,'salt flat');
  if(!Array.isArray(salt.candidateReviewSlots)||salt.candidateReviewSlots.length!==1||
    salt.candidateReviewSlots[0].slotId!=='saltpan.hypothesis.inland_basin'||
    salt.candidateReviewSlots[0].status!=='UNPLACED_HYPOTHESIS_NOT_A_NEW_CANONICAL_FEATURE'||
    salt.candidateReviewSlots[0].geometryRef!==null||
    salt.candidateReviewSlots[0].point!==null||
    salt.candidateReviewSlots[0].hydrologyEvidenceRef!==null)
    fail('speculative salt flat became mapped feature');
  const water=dry.waterDependencies;
  if(water?.oasisRegionLocalityId!=='region_locality.kharuun_oasis_chain'||
    water.wadisRegionLocalityId!=='region_locality.kharuun_wadi_fans'||
    water.wellLocationsVerified!==false||
    water.riverCoursesApproved!==false||
    water.noAutomaticLakeOasisOrSpringGeneration!==true||
    water.noImplicitPortOrSeaRoute!==true)
    fail('unapproved water or travel availability');
  const cross=review.crossRegion,app=review.approval;
  if(!sameSet(cross?.allFiveRegionIds,expectedRegionIds)||
    cross.foreignWindwardParent!=='region.serathyl'||
    cross.foreignWindwardReassignmentApproved!==false||
    cross.coast40OwnerRegionId!==null||
    cross.northeasternLargeIslandOwnerRegionId!==null||
    !Array.isArray(cross.islandComponentClaims)||cross.islandComponentClaims.length!==0||
    cross.forcedGapFillAllowed!==false||
    cross.canonicalSettlementPublicationAllowed!==false||
    app?.ownerPlacementApprovalRef!==null||
    app.sourceEcologyApprovalRef!==null||
    app.canonicalWritable!==false||
    app.newRoutePublicationAllowed!==false||
    app.newSpawnPublicationAllowed!==false||
    app.saltFlatGeometryApproved!==false||
    app.regionBordersApproved!==false)
    fail('foreign territory, islands or world publication gate changed');
  if(localityPack?.status!=='MAINLINE_COORDINATE_FIRST_CANDIDATES_NO_ACTIVE_PUBLICATION'||
    ecologyPack?.status!=='MAINLINE_DESIGN_ONLY_NO_ACTIVE_SPAWNS_ROUTES_OR_CANONICAL_MASKS')
    fail('existing authoring source state changed');
  const zones=localityPack.environmentZoneCandidateRecords,
    localities=localityPack.localityRecords,
    concepts=localityPack.settlementConcepts,
    profiles=ecologyPack.profiles;
  if(!Array.isArray(zones)||!Array.isArray(localities)||
    !Array.isArray(concepts)||!Array.isArray(profiles))
    fail('existing authored ecology pack incomplete');
  const known=zones.find(x=>x.id===salt.environmentalZoneId);
  const knownLocality=localities.find(x=>x.id===salt.localityId);
  const saltworks=concepts.find(x=>x.candidateId===salt.settlementConceptId);
  const kharuun=profiles.find(x=>x.regionId==='region.kharuun_drylands');
  const veyrholm=profiles.find(x=>x.regionId==='region.veyrholm_shore');
  if(!known||known.regionId!=='region.kharuun_drylands'||
    known.regionLocalityId!==salt.localityId||known.geometryRef!==null||
    known.placementStatus!=='UNPLACED_NO_POLYGON'||
    knownLocality?.regionId!=='region.kharuun_drylands'||
    knownLocality.localityType!=='saltpan_basin'||
    saltworks?.localityId!==salt.localityId||
    saltworks.regionId!=='region.kharuun_drylands'||
    saltworks.spatialStatus!=='UNPLACED_NO_PIXEL'||
    saltworks.canonicalSettlementId!==null||
    !kharuun?.ecology?.habitats?.some(h=>h.id==='kharuun.saltpan'&&
      h.landform==='closed evaporite basin'))
    fail('existing salt locality, outpost or habitat parity missing');
  for(const [zoneId,localityId,habitatId] of northernZones){
    const row=zones.find(x=>x.id===zoneId);
    if(row?.regionId!=='region.veyrholm_shore'||
      row.regionLocalityId!==localityId||row.geometryRef!==null||
      row.placementStatus!=='UNPLACED_NO_POLYGON'||
      !localities.some(x=>x.id===localityId&&x.regionId==='region.veyrholm_shore')||
      !veyrholm?.ecology?.habitats?.some(h=>h.id===habitatId))
      fail('Veyrholm authorship parity missing: '+zoneId);
  }
  const allRequirements=[
    ...coast.default.evidenceRequirements,
    ...coast.alternative.evidenceRequirements,
    ...salt.evidenceRequirements,
  ];
  return {
    status:'C1G_ECOLOGICAL_NARRATIVE_COMPLETE_ALL_SOURCE_GATES_HELD',
    preferredCoast:'CONTINUOUS_VEYRHOLM_VARIABLE_DEPTH',
    alternativeDryCoast:'CONDITIONAL_ONLY_NOT_APPROVED',
    existingCoastalHabitatContexts:northernZones.length,
    existingSaltLocalityValidated:true,
    existingTirashConceptUnplaced:true,
    saltPanHypothesisSlots:salt.candidateReviewSlots.length,
    unverifiedEvidenceRequirements:allRequirements.length,
    sourceCoordinatesPublished:0,
    islandAssignments:0,
    directSeaRoutesApproved:0,
    canonicalWritable:false,
  };
}
/**
 * Show missing proof for a potential *review*, never promote ownership or
 * coordinates. Pass keys from independent future source audits only.
 */
export function assessKaelvarEvidenceReadiness(requirements,proofs={}){
  if(!Array.isArray(requirements)||requirements.some(x=>
    typeof x.id!=='string'||!x.id.trim())||
    !proofs||typeof proofs!=='object'||Array.isArray(proofs))
    fail('invalid evidence assessment request');
  const missing=requirements.map(x=>x.id).filter(id=>
    typeof proofs[id]!=='string'||!proofs[id].trim());
  return {
    status:missing.length?'EVIDENCE_INCOMPLETE_NO_PLACEMENT':'EVIDENCE_REFERENCES_PRESENT_OWNER_REVIEW_STILL_REQUIRED',
    missing,
    reviewReadyForOwner:missing.length===0,
    canonicalWritable:false,
    geometryApproved:false,
    ownershipApproved:false,
  };
}
