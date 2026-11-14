/**
 * C1-F owner-corrected, NONCANONICAL placement guide validator.
 * Guide polygons are source-window hypotheses, never geometryRef records.
 * Terrain-candidate clipping in the preview cannot authorize sovereignty.
 */
import {
  FIRST_WORLD_REFERENCE,validateCoordinatePolygon,coordinatePolygonContains,
} from './world-coordinate-geometry.mjs';
import {
  validateCoordinateMultiPolygon,validateKaelvarC1ReviewLedger,
} from './world-geographic-authority.mjs';

const fail=x=>{throw Error('C1-F placement HOLD: '+x);};
const ids=[
  'region.auric_marches','region.kharuun_drylands',
  'region.verdant_thalos','region.veyrholm_shore','region.shattercap_isles',
];
const rules=[
  'WESTERN_STEPPE_MINERAL_UPLANDS_CORE_ONLY',
  'CENTRAL_DRYLANDS_ECOLOGY_UNCALIBRATED_NO_AUTOFILL',
  'SOUTHERN_GREEN_RIVERED_PENINSULA_INCLUDES_SE_PROMONTORY',
  'NARROW_NORTHERN_MAINLAND_LITTORAL_EXCLUDES_DEEP_INTERIOR',
  'DETACHED_NORTHERN_ISLANDS_HELD_WHOLE_OWNERSHIP',
];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&
  new Set(a).size===a.length&&a.every(v=>b.includes(v));
export function validateC1FPlacementGuides(spec,ledger){
  validateKaelvarC1ReviewLedger(ledger);
  if(spec?.schemaVersion!==1||
    spec.type!=='kaelvar-c1f-owner-corrected-placement-guides.v1'||
    spec.status!=='SOURCE_ALIGNED_CANDIDATE_ONLY_NO_APPROVED_BORDERS'||
    spec.mapId!==FIRST_WORLD_REFERENCE.mapId||
    spec.coordinateSpaceId!==FIRST_WORLD_REFERENCE.coordinateSpaceId||
    spec.parentRegionId!=='region.kaelvar'||
    spec.sourceC1LedgerPath!=='docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json'||
    spec.sourcePairClassification!=='DIVERGENT_RGB_OFF_BLUE_NOT_CERTIFIED_LAND'||
    spec.terrainOnlyComponent?.namespace!=='SOURCE_PAIR_TERRAIN_ONLY_4_NEIGHBOR_K1'||
    spec.terrainOnlyComponent.componentId!==30||
    spec.terrainOnlyComponent.expectedTerrainCandidateCells!==79419)
    fail('geometry frame, source or parent drift');
  if(!Array.isArray(spec.regionGuides)||spec.regionGuides.length!==5||
    !same(spec.regionGuides.map(g=>g.regionId),ids))
    fail('exact five child identities required');
  const guides=ids.map((id,index)=>{
    const g=spec.regionGuides.find(row=>row.regionId===id);
    if(!g||g.status!=='PREVIEW_GUIDE_NOT_CANONICAL'||
      g.authoredPlacementRule!==rules[index]||
      typeof g.label!=='string'||!g.label.trim()||
      typeof g.color!=='string'||!/^#[0-9A-F]{6}$/.test(g.color)||
      g.color==='#ED6C9B'||
      g.geometryRef!==null||!Array.isArray(g.physicalComponentClaims)||
      g.physicalComponentClaims.length!==0||
      !Array.isArray(g.sourceFeatureIds)||g.sourceFeatureIds.length!==0)
      fail('guide publication or foreign source contamination: '+id);
    if(index===4){
      if(g.guidePolygon!==null||g.labelAnchor!==null)
        fail('Shattercap detached islands must remain unallocated');
    }else{
      validateCoordinatePolygon({outer:g.guidePolygon});
      if(!coordinatePolygonContains({outer:g.guidePolygon},g.labelAnchor))
        fail('guide label anchor lies outside its envelope: '+id);
    }
    return g;
  });
  // Four disjoint mainland guides. No automatic filling between them.
  validateCoordinateMultiPolygon(guides.slice(0,4)
    .map(g=>({outer:g.guidePolygon})));
  const contains=(g,p)=>coordinatePolygonContains({outer:g.guidePolygon},p);
  const veyr=guides[3],verdant=guides[2],anchors=spec.reviewAnchors;
  if(!Array.isArray(anchors?.veyrholmMustExcludeInland)||
    anchors.veyrholmMustExcludeInland.length!==3||
    anchors.veyrholmMustExcludeInland.some(p=>contains(veyr,p)))
    fail('Veyrholm reaches hand-marked northern dry interior');
  if(!Array.isArray(anchors?.verdantMustIncludePeninsula)||
    anchors.verdantMustIncludePeninsula.length!==3||
    anchors.verdantMustIncludePeninsula.some(p=>!contains(verdant,p)))
    fail('Verdant no longer includes the southern peninsula');
  if(!anchors?.unownedNortheasternIslandSample||
    guides.slice(0,4).some(g=>contains(g,anchors.unownedNortheasternIslandSample)))
    fail('large northeastern island must remain outside mainland guides');
  const holds=spec.sourceHolds,approval=spec.approval;
  if(!same(holds?.foreignWindwardSourceFeatureIds,
      ['feature.region_windward_spine.part_1','feature.region_windward_spine.part_2'])||
    holds.coast40DisputedFeatureId!=='feature.region_verdant_thalos.part_6'||
    !same(holds.shattercapSourceFeatureIds,
      ['feature.region_shattercap_isles.part_1',
        'feature.region_shattercap_isles.part_7',
        'feature.region_shattercap_isles.part_15'])||
    holds.historicalMagentaSourceOutlineShownInProposal!==false||
    holds.foreignSourceTransferredToKaelvar!==false||
    holds.unassignedTerrainAllowed!==true||
    holds.waterOrSharedInkAllocated!==false||
    !Array.isArray(holds.islandClaims)||holds.islandClaims.length!==0||
    approval?.canonicalWritable!==false||
    approval.parentConfirmed!==false||
    approval.regionBordersApproved!==false||
    approval.ecologicalCalibrationApproved!==false||
    approval.ownerApprovalRef!==null)
    fail('foreign source, unresolved terrain, island or approval hold drift');
  return {
    status:'C1F_PLACEMENT_GUIDES_VALID_PUBLICATION_HELD',
    regionIntents:5,drawnMainlandGuides:4,
    detachedRegionGuides:0,ownerApprovalRef:null,canonicalWritable:false,
  };
}
