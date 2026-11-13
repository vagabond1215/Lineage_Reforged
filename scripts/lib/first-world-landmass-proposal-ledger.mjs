/**
 * R0-R3 proposal-only ledger checks. No canonical mutation, land/water guessing,
 * border generation, nearest-anchor allocation, or region identity deletion.
 */
const SOURCE_NAMESPACE = 'SOURCE_PAIR_TERRAIN_ONLY_4_NEIGHBOR_K1';
const EXPECTED_DETACHED = new Map([
  [24,1893],[90,1013],[91,220],[34,118],[21,115],[25,80],[28,64],
  [47,37],[38,22],[20,20],[71,18],[26,17],[55,16],[95,16],
  [35,14],[51,13],[96,9],[78,8],
]);
const KAELVAR_CHILDREN = [
  ['region.auric_marches','kaelvar_western_interior'],
  ['region.verdant_thalos','kaelvar_southern_peninsula'],
  ['region.shattercap_isles','kaelvar_northern_coast'],
];
const COAST40 = [
  'feature.region_windward_spine.part_2',
  'feature.region_verdant_thalos.part_6',
];
const fail = (message) => { throw Error('Landmass proposal HOLD: ' + message); };
const unique = (items, label) => {
  if (items.length !== new Set(items).size) fail('duplicate ' + label);
};
const requireArray = (value,label) => {
  if (!Array.isArray(value)) fail('missing ' + label + ' array');
  return value;
};
const sameSet = (a,b) => a.length === b.length &&
  a.every(value => b.includes(value));

/**
 * Validate pending-only Kaelvar authoring and source provenance.
 * Caller supplies canonical arrays; this helper does not perform IO.
 */
export function validateLandmassProposalLedger({
  ledger, regions, sourceFootprints, approvedExclusionIds,
}) {
  if (!ledger || ledger.schemaVersion !== 1 ||
      ledger.type !== 'first-world-landmass-first-kaelvar-proposal-ledger.v1' ||
      ledger.status !== 'R0_R2_REVIEW_PENDING_NO_PROPOSED_MASKS')
    fail('unexpected or approved proposal schema/status');
  if (ledger.canonicalWritable !== false || ledger.placementApproved !== false ||
      ledger.modifiesGameplay !== false || ledger.ownerApprovalRef !== null)
    fail('unauthorized publication or gameplay write');
  const base = ledger.immutableEvidence;
  if (!base || base.evidenceBranchHead !== 'da45c0d21c15f403bcd173016ed2e88149e98f30' ||
      base.sourceGeometryGitBlob !== 'ec59ed66b7eaee4502dc56709a2f266b17b3cb17' ||
      base.biomePngSha256 !== '9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12' ||
      base.elevationPngSha256 !== '02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d')
    fail('evidence/source hash drift');
  if (base.grid?.width !== 2048 || base.grid?.height !== 1152 ||
      base.crop?.x !== 60 || base.crop?.y !== 60 ||
      base.crop?.width !== 3976 || base.crop?.height !== 2235 ||
      base.sourceSize?.width !== 4096 || base.sourceSize?.height !== 2355)
    fail('original source registration changed');
  if (base.acceptedOffshoreExclusionCount !== 42 ||
      base.effectiveSourceFootprints !== 159 || base.coastlineRecords !== 68 ||
      base.terrainOnlyComponentNamespace !== SOURCE_NAMESPACE ||
      base.terrainOnlyMainlandReferenceComponentId !== 30 ||
      base.terrainOnlyMainlandCandidateCells !== 79419 ||
      base.shattercapUnionCandidateCells !== 30938 ||
      base.shattercapOnMainlandCandidateCells !== 27245 ||
      base.shattercapDetachedCandidateCells !== 3693)
    fail('source candidate component/inventory drift');
  const byRegion = new Map(requireArray(regions,'canonical region').map(r => [r.id,r]));
  if (byRegion.size !== regions.length) fail('duplicate canonical region id');
  if (byRegion.get('region.kaelvar')?.regionType !== 'continent' ||
      byRegion.get('region.serathyl')?.regionType !== 'continent' ||
      ledger.parentMacroRegionId !== 'region.kaelvar' ||
      ledger.parentStatus !== 'CANDIDATE_AWAITING_OWNER_REVIEW')
    fail('parent macro identity was silently approved or changed');
  const specs = requireArray(ledger.regionPlacementSpecifications,'child specification');
  if (specs.length !== KAELVAR_CHILDREN.length) fail('Kaelvar child count drift');
  unique(specs.map(s => s.regionId),'child specification');
  for (const [id,position] of KAELVAR_CHILDREN) {
    const r = byRegion.get(id), spec = specs.find(s => s.regionId === id);
    if (r?.regionType !== 'subregion' || r.parentRegionId !== 'region.kaelvar' ||
        r.positionLabel !== position || spec?.parentRegionId !== 'region.kaelvar' ||
        spec.positionLabel !== position || spec.status !== 'PLACEMENT_SPEC_PENDING' ||
        !Array.isArray(spec.expectedLandforms) || !spec.expectedLandforms.length ||
        !Array.isArray(spec.proposedMaskIds) || spec.proposedMaskIds.length)
      fail('child intent or provisional mask drift: ' + id);
  }
  if (byRegion.get('region.windward_spine')?.parentRegionId !== 'region.serathyl' ||
      byRegion.get('region.windward_spine')?.positionLabel !== 'serathyl_northern_mountains')
    fail('Windward identity changed or moved to Kaelvar');
  const excluded = requireArray(approvedExclusionIds,'approved exclusion');
  unique(excluded,'approved exclusion');
  if (excluded.length !== 42) fail('accepted exclusion count drift');
  const all = requireArray(sourceFootprints,'source footprint');
  const sourceById = new Map(all.map(f => [f.id,f]));
  if (sourceById.size !== all.length) fail('duplicate source feature ids');
  if (!excluded.every(id => sourceById.has(id))) fail('accepted exclusion missing in source');
  if (all.filter(f => !excluded.includes(f.id)).length !== 159)
    fail('effective footprint count drift');
  const reviews = requireArray(ledger.sourceFootprintReviews,'source review');
  unique(reviews.map(r => r.sourceFeatureId),'source footprint review');
  if (reviews.length !== 6) fail('pilot source review inventory changed');
  const expectedIds = [
    'feature.region_shattercap_isles.part_1',
    'feature.region_shattercap_isles.part_7',
    'feature.region_shattercap_isles.part_15',
    'feature.region_windward_spine.part_1',
    ...COAST40,
  ];
  if (!sameSet(reviews.map(r => r.sourceFeatureId),expectedIds))
    fail('required source review missing');
  const permitted = new Set([
    'NON_TERRAIN_BLUE_EDGE_REVIEW',
    'WITHHELD_PENDING_LOCATION_RECONSTRUCTION',
    'UNPLACED_PENDING_PARENT_RECONCILIATION',
    'COAST40_SEPARATE_REVIEW',
  ]);
  for (const review of reviews) {
    const source = sourceById.get(review.sourceFeatureId);
    if (!source || excluded.includes(review.sourceFeatureId) ||
        !source.regionIds?.includes(review.authoredRegionId) ||
        !permitted.has(review.proposalDisposition) ||
        review.reassignmentApproved !== false ||
        !byRegion.has(review.authoredRegionId))
      fail('review/source provenance mismatch: ' + review.sourceFeatureId);
  }
  const disposition = new Map(reviews.map(r => [r.sourceFeatureId,r.proposalDisposition]));
  if (disposition.get(expectedIds[0]) !== 'NON_TERRAIN_BLUE_EDGE_REVIEW' ||
      disposition.get(expectedIds[1]) !== 'WITHHELD_PENDING_LOCATION_RECONSTRUCTION' ||
      disposition.get(expectedIds[2]) !== 'WITHHELD_PENDING_LOCATION_RECONSTRUCTION' ||
      disposition.get(expectedIds[3]) !== 'UNPLACED_PENDING_PARENT_RECONCILIATION' ||
      COAST40.some(id => disposition.get(id) !== 'COAST40_SEPARATE_REVIEW'))
    fail('unsafe original-footprint disposition');
  const displaced = requireArray(ledger.displacedSourceClaims,'displaced claims');
  if (displaced.length !== 1 ||
      displaced[0].sourceFeatureId !== 'feature.region_windward_spine.part_1' ||
      displaced[0].regionId !== 'region.windward_spine' ||
      displaced[0].authoredParentRegionId !== 'region.serathyl' ||
      displaced[0].reconciliationParentRegionId !== 'region.serathyl' ||
      displaced[0].status !== 'UNPLACED_PENDING_PARENT_RECONCILIATION')
    fail('Windward parent reconciliation was silently resolved');
  const detached = requireArray(ledger.detachedTerrainOnlyComponents,'detached components');
  unique(detached.map(c => c.componentId),'physical component id');
  if (detached.length !== 18) fail('detached component count drift');
  let sum = 0;
  for (const component of detached) {
    if (EXPECTED_DETACHED.get(component.componentId) !== component.sourceTerrainCandidateCells ||
        component.status !== 'PARENT_AND_CHILD_SOVEREIGNTY_PENDING' ||
        component.proposedRegionId !== null)
      fail('disputed island changed: component ' + component.componentId);
    sum += component.sourceTerrainCandidateCells;
  }
  if (sum !== 3693) fail('detached terrain union arithmetic drift');
  const coast = ledger.coast40;
  if (coast?.status !== 'INDEPENDENT_PARENT_AND_ISLAND_SOVEREIGNTY_REVIEW' ||
      coast.proposedRegionId !== null ||
      !sameSet(requireArray(coast.sourceFeatureIds,'Coast 40 IDs'),COAST40))
    fail('Coast 40 was silently allocated');
  const layouts = ledger.layouts;
  if (layouts?.layoutA?.status !== 'THREE_AUTHORED_CHILDREN_PROPOSAL_PENDING' ||
      !sameSet(requireArray(layouts.layoutA.regionIds,'Layout A child IDs'),KAELVAR_CHILDREN.map(v=>v[0])) ||
      requireArray(layouts.layoutA.proposedMasks,'Layout A masks').length ||
      layouts.layoutA.unassignedTerrainCells !== null ||
      layouts.layoutB?.status !== 'EASTERN_CHILD_ELIGIBILITY_ONLY' ||
      layouts.layoutB.proposedFourthRegionId !== null ||
      !layouts.layoutB.sourceTestWindowIsNotProposedArea ||
      requireArray(layouts.layoutB.proposedMasks,'Layout B masks').length)
    fail('unapproved A/B mask or fourth region');
  return {
    status:'R0_R3_LEDGER_VALID_PLACEMENT_HELD',
    parentMacroRegionId:ledger.parentMacroRegionId,
    authoredChildRegionIds:KAELVAR_CHILDREN.map(v=>v[0]),
    pendingDetachedComponents:detached.length,
    pendingDetachedTerrainCells:sum,
    disputedOriginalFootprintReviews:reviews.length,
    pendingDisplacedClaims:displaced.length,
    proposedMaskCount:0,
    placementApproved:false,canonicalWritable:false,
  };
}

/**
 * R3 pure review audit of *provided* candidate masks only. Does not invent
 * borders or owners. Component parent approvals must be provided explicitly.
 * A zero-claim proposal reports all candidate terrain as unassigned.
 */
export function auditProvisionalRegionMasks({
  width,height,terrainCandidateMask,terrainOnlyComponentByCell,
  regions,confirmedParentByComponent = {},claims = [],
}) {
  if (!Number.isInteger(width) || !Number.isInteger(height) ||
      width < 1 || height < 1) fail('invalid R3 grid');
  const n = width*height;
  if (terrainCandidateMask?.length !== n ||
      terrainOnlyComponentByCell?.length !== n ||
      !Array.isArray(regions) || !Array.isArray(claims))
    fail('missing R3 grid, regions or claims');
  const byId = new Map(regions.map(r => [r.id,r]));
  if (byId.size !== regions.length) fail('duplicate R3 region id');
  const ownership = new Uint8Array(n);
  let assignedTerrainCells = 0,terrainCandidateCells = 0;
  for (let i=0;i<n;i++) {
    if (terrainCandidateMask[i]) {
      terrainCandidateCells++;
      if (!terrainOnlyComponentByCell[i])
        fail('terrain candidate without physical component');
    }
  }
  const claimIds = new Set();
  for (const claim of claims) {
    if (!claim || !claim.id || claimIds.has(claim.id)) fail('duplicate/invalid R3 mask id');
    claimIds.add(claim.id);
    const region = byId.get(claim.regionId);
    if (region?.regionType !== 'subregion' ||
        region.parentRegionId !== claim.parentRegionId ||
        !Number.isInteger(claim.componentId) || claim.componentId < 1 ||
        confirmedParentByComponent[claim.componentId] !== claim.parentRegionId)
      fail('child claim without confirmed parent/component: ' + claim.id);
    if (!(claim.mask instanceof Uint8Array) || claim.mask.length !== n ||
        !Array.isArray(claim.sourceFeatureIds) || !claim.sourceFeatureIds.length ||
        !claim.sourceFeatureIds.every(id => typeof id === 'string' && id.startsWith('feature.')))
      fail('mask/source provenance missing: ' + claim.id);
    for (let i=0;i<n;i++) {
      if (!claim.mask[i]) continue;
      if (!terrainCandidateMask[i] || terrainOnlyComponentByCell[i] !== claim.componentId)
        fail('claim crosses water/ink or physical component: ' + claim.id);
      if (ownership[i]) fail('provisional mask overlap: ' + claim.id);
      ownership[i]=1;
      assignedTerrainCells++;
    }
  }
  return {
    status:'R3_MASK_TOPOLOGY_REVIEW_ONLY_NOT_ECOLOGICAL_APPROVAL',
    terrainCandidateCells,assignedTerrainCells,
    unassignedTerrainCells:terrainCandidateCells-assignedTerrainCells,
    submittedMaskCount:claims.length,sourceWritable:false,ownerApprovalRequired:true,
  };
}
