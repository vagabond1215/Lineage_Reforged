/**
 * C1-AD: read-only Voronoi provenance and normalized mesh preflight.
 * An owner screenshot is not a matched game save, a province is not a
 * Lineage geographic region, and cell geometry does not confer ownership.
 */
const hold=reason=>{throw Error('C1-AD VORONOI HOLD: '+reason);};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const biomeHash='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const elevationHash='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const vectorHash='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const svgHash='6a0aaedfb4a4551dcbff6103bb5ca8405d1d923c0496577956af05a0657d2a8d';
const expectedRegions=['region.veyrholm_shore','region.auric_marches',
 'region.kharuun_drylands','region.verdant_thalos','region.shattercap_isles'];
const heldFields=[
 'northeastHeadlandHeld','originalPhysicalComponent51Held',
 'shattercapDetachedIslesHeld','largeNortheastIslandHeld',
 'allOtherDetachedComponentsHeld','verdantSoutheasternPeninsulaPreserved',
 'veyrholmDryInlandExclusionsPreserved','coast40Unclaimed',
 'serathylWindwardPreserved'
];

export function validateC1ADVoronoiPreflight(spec,c1ac,c1aa){
 if(spec?.schemaVersion!==1||
  spec.type!=='kaelvar-c1ad-voronoi-source-and-geographic-region-preflight.v1'||
  spec.status!=='VORONOI_PROVENANCE_SUPPORTED_SOURCE_MESH_UNRECOVERED_REGION_ADOPTION_HELD'||
  spec.sourceEvidence?.generator!=='Fantasy Map Simulator'||
  spec.sourceEvidence.steamAppId!==3035500||
  spec.sourceEvidence.ownerAttestedVoronoiMap!==true||
  !equal(spec.sourceEvidence.developerNotes.map(x=>[x.published,x.url]),[
   ['2025-01-16','https://steamdb.info/patchnotes/17025175/'],
   ['2026-04-20','https://steamcommunity.com/app/3035500/announcements/']
  ])||
  !equal(spec.sourceEvidence.hierarchy.map(x=>x.level),[
   'VORONOI_CELL','SIMULATOR_PROVINCE',
   'SIMULATOR_DISTRICT','LINEAGE_GEOGRAPHIC_REGION'])||
  spec.sourceEvidence.hierarchy.slice(0,3).some(x=>
   x.recoverableFromCurrentScreenshots!==false)||
  spec.sourceEvidence.hierarchy[3].recoverableFromCurrentScreenshots!==
   'APPROXIMATE_EDITOR_STROKES_ONLY'||
  ['originalGameSaveMatched','recoveredCellIds','recoveredVoronoiSites',
   'recoveredAdjacencyGraph','recoveredProvinceMembership',
   'recoveredDistrictMembership','recoveredOriginalHeightScalar',
   'numericElevationMetersCertified','sourceDataFormatRecognized']
   .some(k=>spec.sourceEvidence[k]!==false))
  hold('game hierarchy or unavailable original save/mesh provenance has drifted');
 const s=spec.exactSource,c=spec.ownerOverlay,loc=spec.potentialLocalSaveRecovery;
 if(s?.vectorBlob!==vectorHash||s.originalBiomeSha256!==biomeHash||
  s.originalElevationSha256!==elevationHash||
  s.originalMainlandComponent!==30||
  s.originalMainlandCandidateCells!==79419||
  s.acceptedC1PAssigned!==52449||s.acceptedC1PUnassigned!==26970||
  !equal(s.acceptedC1PRegionCells,[5632,18624,19182,9011])||
  s.originalCoastlineEdges!==599||
  !equal(s.originalKharuunOptionBEdges,[35,58])||
  !equal(s.heldNEHeadlandEdges,[75,115])||
  c?.screenshotManifest!=='docs/design/kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json'||
  c.originalScreenshotCount!==11||
  c.referenceSvg!=='docs/design/assets/kaelvar-c1ac-owner-simulator-district-ink-reference-only-2026-11-15.svg'||
  c.referenceSvgSha256!==svgHash||
  c.coordinateFrame!=='ORIGINAL_FIRST_WORLD_REFERENCE_GRID_2048_X_1152'||
  !equal(c.proposalPalette,expectedRegions)||
  c.screenshotInkOnly!==true||
  c.polygonBoundaryAuthority!==false||c.islandOwnershipAuthority!==false||
  loc?.platform!=='Windows'||loc.readOnlyInventoryOnly!==true||
  loc.searchExistingSavesWithoutRewriting!==true||
  loc.exactFileIdentificationNeeded!==true||
  loc.matchToFirstWorldBeforeParsingMembership!==true||
  loc.noAssumedSerializationSchema!==true||
  loc.doNotUploadPrivateOrUnverifiedSavesToGit!==true||
  loc.avoidFullSaveBinaryInRepository!==true)
  hold('original source/palette, screenshot overlay or safe save discovery guards changed');
 const a=spec.proposedFutureMeshAudit,g=spec.geometryReview,h=spec.sourceHolds;
 const requiredMeshFlags=[
  'acceptedOnlyIfMatchedToOriginalSource',
  'verifyCoordinateTransformFromSaveToOriginalSource','requireUniqueCellIds',
  'requireValidNonzeroAreaPolygons','requireReciprocalCellAdjacency',
  'requireSharedEdgeGeometryConsistency',
  'requireCellToProvinceMembershipIntegrity',
  'requireProvinceToDistrictMembershipIntegrity',
  'distinguishCellAndProvinceAndDistrictFromGeographicRegion',
  'noAutomaticVoronoiCellNearestSeedOwnership',
  'sharedPrimaryRegionCoverageOnFinalizedPhysicalLand',
  'exactOnePrimaryRegionPerFinalizedLandPoint',
  'deterministicSharedBoundaryTieBreaker',
  'noImplicitRegionlessEcotones',
  'optionalSecondaryEnvironmentalInfluences',
  'noHardPoliticalBorderAssumption',
  'noForcedCellEdgeWhenSupportedNaturalFeatureDiffers',
  'originalCoastlineAndComponentLabelsRemainAuthoritative',
  'noAutomaticOffshoreComponentAssignment',
  'unresolvedContourAndSourceInkRemainHeld'
 ];
 if(requiredMeshFlags.some(k=>a?.[k]!==true)||
  g?.compareEditorWholeRegionSilhouettesBeforeLocalWaypointOptimization!==true||
  g.northernVeyrholmKharuunC1AADiffersFromOwnerEditor!==true||
  g.southernKharuunVerdantC1AAOnlyPartlyAgreesWithOwnerEditor!==true||
  g.auricKharuunWholeInterfaceRequiresReview!==true||
  g.screenshotInkIsNeitherRiverNorRidgeProof!==true||
  g.ownerRelativeHeight!=='ORANGE_RED_RELATIVELY_HIGHER_CREAM_RELATIVELY_LOWER'||
  g.noNumericSlopeOrHydrologyClaims!==true||
  g.noSavedGraphAvailableYet!==true||
  g.acceptedC1PPolygonsChanged!==false||
  g.acceptedC1AASharedChainsChanged!==false||
  g.canonicalPublication!==false||
  heldFields.some(k=>h?.[k]!==true)||
  h.sourceRasterEdits!==0||h.sourceVectorEdits!==0||
  h.originalTerrainRelabels!==0||
  h.newCanonicallyAssignedRegionCells!==0||
  h.newGameContentOrSettlements!==0||
  h.canonicalWritable!==false)
  hold('mesh/region distinction, primary region membership or island/canon holds drifted');
 if(c1ac?.type!=='KAELVAR_C1AC_OWNER_SIMULATOR_MULTI_VIEW_SOURCE_EVIDENCE_V1'||
  c1ac.screenshotManifest?.length!==11||
  c1ac.sourceProvenance?.originalFirstWorldBiomeSHA256!==biomeHash||
  c1ac.sourceProvenance.originalFirstWorldElevationSHA256!==elevationHash||
  c1ac.sourceProvenance.originalVectorBlob!==vectorHash||
  c1ac.sourceProvenance.simulatorSaveMatchedToSource!==false||
  c1ac.derivedScreenshotInkReferenceSvg?.sha256!==svgHash||
  c1ac.derivedScreenshotInkReferenceSvg.canonicalWritable!==false||
  c1aa?.type!=='C1AA_RELATIVE_RELIEF_SHARED_SEAMS_REVIEW_ONLY'||
  c1aa.canonicalWritable!==false||
  c1aa.acceptedC1PChanged!==false||
  !equal(c1aa.candidates?.map(x=>[x.id,x.sharedChain]),[
   ['NORTH_APPROXIMATE_COASTAL_TRANSITION',[[279,197],[291,192],[301,188],[308,185]]],
   ['SOUTH_APPROXIMATE_UPLAND_APRON',[[304,330],[320,331],[338,332],[352,333]]]
  ]))
  hold('prior C1-AC screenshot evidence or C1-AA provisional chains changed');
 return true;
}

// A strict synthetic-cell checker to prepare later real-save research.
// It never identifies the owner save, approves region membership, or
// substitutes for the native source coastline/terrain-component gates.
const vertex=v=>{
 if(!Array.isArray(v)||v.length!==2||v.some(n=>typeof n!=='number'||
  !Number.isFinite(n)||n<0||n>2048))
  hold('invalid normalized mesh vertex');
 return v.join(',');
};
const edge=(a,b)=>{
 const A=vertex(a),B=vertex(b);
 if(A===B)hold('zero-length normalized polygon edge');
 return A<B?A+'|'+B:B+'|'+A;
};
const signedArea=points=>points.reduce((sum,p,i)=>{
 const q=points[(i+1)%points.length];
 return sum+p[0]*q[1]-q[0]*p[1];
},0)/2;
export function auditSyntheticVoronoiTopology(graph){
 if(graph?.role!=='SYNTHETIC_UNIT_FIXTURE_ONLY'||
  graph.coordinateFrame!=='ORIGINAL_FIRST_WORLD_REFERENCE_GRID_2048_X_1152'||
  graph.sourceSaveMatched!==false||graph.canonicalWritable!==false||
  !Array.isArray(graph.cells)||graph.cells.length<2||graph.cells.length>1000||
  !Array.isArray(graph.provinces)||!Array.isArray(graph.districts))
  hold('unverified mesh cannot be treated as matched save geometry');
 const cells=new Map(),edgeRecords=new Map(),neighborPairs=[];
 for(const c of graph.cells){
  if(typeof c?.id!=='string'||!c.id||cells.has(c.id)||
   c.regionId!==undefined||c.canonicalOwner!==undefined||
   !Array.isArray(c.ring)||c.ring.length<3||
   !Array.isArray(c.neighborIds)||new Set(c.neighborIds).size!==c.neighborIds.length||
   !c.provinceId||typeof c.provinceId!=='string')
   hold('duplicate, owner-bearing or malformed synthetic cell');
  if(Math.abs(signedArea(c.ring))<1e-8)
   hold('degenerate synthetic cell polygon');
  cells.set(c.id,c);
  for(let i=0;i<c.ring.length;i++){
   const a=c.ring[i],b=c.ring[(i+1)%c.ring.length],key=edge(a,b);
   if(!edgeRecords.has(key))edgeRecords.set(key,[]);
   edgeRecords.get(key).push({id:c.id,from:vertex(a),to:vertex(b)});
  }
 }
 for(const [key,rec] of edgeRecords){
  if(rec.length>2||rec.length===2&&(rec[0].from!==rec[1].to||
    rec[1].from!==rec[0].to))
   hold('nonmanifold or mismatched normalized Voronoi edge '+key);
  if(rec.length===2)neighborPairs.push(rec.map(x=>x.id).sort());
 }
 const expectedNeighbors=new Map([...cells.keys()].map(id=>[id,new Set()]));
 for(const pair of neighborPairs){
  if(pair[0]===pair[1])hold('cell has self-shared boundary');
  expectedNeighbors.get(pair[0]).add(pair[1]);
  expectedNeighbors.get(pair[1]).add(pair[0]);
 }
 for(const [id,c] of cells){
  if(!equal([...c.neighborIds].sort(),[...expectedNeighbors.get(id)].sort()))
   hold('cell adjacency not reciprocal to shared polygon edges '+id);
 }
 const provinces=new Map(),districts=new Map();
 for(const p of graph.provinces){
  if(!p?.id||provinces.has(p.id)||!Array.isArray(p.cellIds)||
   p.cellIds.length===0||new Set(p.cellIds).size!==p.cellIds.length||
   !('districtId' in p)||p.regionId!==undefined)
   hold('malformed or owner-bearing province grouping');
  provinces.set(p.id,p);
 }
 for(const d of graph.districts){
  if(!d?.id||districts.has(d.id)||!Array.isArray(d.provinceIds)||
   !d.provinceIds.length||new Set(d.provinceIds).size!==d.provinceIds.length||
   d.regionId!==undefined)
   hold('malformed or owner-bearing district grouping');
  districts.set(d.id,d);
 }
 const expectedCellMembership=new Map();
 for(const p of provinces.values()){
  for(const id of p.cellIds){
   if(!cells.has(id)||expectedCellMembership.has(id))
    hold('cell missing or claimed by multiple provinces');
   expectedCellMembership.set(id,p.id);
  }
  // Per the simulator's documented mechanics, a province consists
  // of adjacent cells, rather than disjoint islands joined by name.
  const visited=new Set([p.cellIds[0]]),stack=[p.cellIds[0]],
    own=new Set(p.cellIds);
  while(stack.length){
   for(const next of expectedNeighbors.get(stack.pop())){
    if(own.has(next)&&!visited.has(next)){visited.add(next);stack.push(next);}
   }
  }
  if(visited.size!==own.size)hold('province has disconnected Voronoi cells '+p.id);
 }
 if(expectedCellMembership.size!==cells.size)hold('orphan normalized cell');
 for(const [id,c] of cells){
  if(expectedCellMembership.get(id)!==c.provinceId)
   hold('cell province ID disagrees with province membership '+id);
 }
 const expectedProvinceMembership=new Map();
 for(const d of districts.values())for(const id of d.provinceIds){
  if(!provinces.has(id)||expectedProvinceMembership.has(id))
   hold('province missing or in multiple districts');
  expectedProvinceMembership.set(id,d.id);
 }
 for(const [id,p] of provinces){
  if(p.districtId!==null&&(!districts.has(p.districtId)||
    expectedProvinceMembership.get(id)!==p.districtId))
   hold('invalid province-to-district link '+id);
  if(p.districtId===null&&expectedProvinceMembership.has(id))
   hold('unassigned province incorrectly listed in a district');
 }
 return {
  status:'SYNTHETIC_ONLY_VORONOI_ADJACENCY_STRUCTURALLY_VALID',
  cells:cells.size,provinces:provinces.size,districts:districts.size,
  sharedCellEdges:neighborPairs.length,boundaryCellEdges:[...edgeRecords.values()]
   .filter(v=>v.length===1).length,
  originalSaveVerified:false,
  LineageRegionOwnershipAssigned:false,
  canonicalWritable:false
 };
}
