import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {
 validateC1MShoreIntent,buildC1MReview,
} from '../../scripts/lib/kaelvar-c1m-shore-intent-review.mjs';

const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const d='docs/design/';
const input=()=>({
 m:read(d+'kaelvar-c1m-owner-shore-correction-2026-11-14.json'),
 l:read(d+'kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json'),
 j:read(d+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
});
const predecessor=()=>({
 status:'C1L_LANDMASS_ARC_REVIEW_COMPLETE_OWNER_VISUAL_GATE_HELD',
 originalEdgesAccounted:599,northernOriginalEdgesAccounted:310,
 otherOriginalEdgesAccounted:289,
 unassignedPhysicalMainlandCandidateCells:26795,
 inheritedDetachedPhysicalComponentsHeld:18,
 originalSourceEdgeClassifications:Array(196).fill('NW_NC_NO_GUIDE_MIDPOINT_HELD')
  .concat(Array(114).fill('NE_VEYRHOLM_KHARUUN_COMPETITION_HELD'))
  .concat(Array(289).fill('OTHER_SOURCE_ARC_UNREVIEWED_HELD')),
 candidateMainlandRegionDescriptions:Array(5).fill({proposedGeometryRef:null}),
 countsBySourceArcStatus:{
  NW_NC_VEYRHOLM_GUIDE_MIDPOINT_ONLY:0,
  NW_NC_OTHER_GUIDE_MIDPOINT_HELD:0,
  NW_NC_NO_GUIDE_MIDPOINT_HELD:196,
  NE_VEYRHOLM_KHARUUN_COMPETITION_HELD:114,
  OTHER_SOURCE_ARC_UNREVIEWED_HELD:289,
 },
 approval:{canonicalWritable:false,originalSourceArcRegionClaims:0,regionPolygonsPublished:0},
});
test('Owner Kharuun short northern shore is positive design intent, not a certified source border',()=>{
 const {m,l,j}=input(),q=validateC1MShoreIntent(m,l,j);
 assert.equal(q.kharuunHasShortNorthernCoast,true);
 assert.equal(q.veyrholmRibbonRejected,true);
 assert.equal(q.exactFrontageSourceEdgesApproved,0);
 assert.equal(q.placedPorts,0);
 assert.equal(q.canonicalWritable,false);
 assert.equal(m.ownerVisualDecision.portCityConceptAllowed,true);
 assert.equal(m.ownerVisualDecision.portCityCoordinates,null);
});
test('Previous false Veyrholm ribbon cannot be restored as a territorial boundary',()=>{
 const {m,l,j}=input();
 m.ownerVisualDecision.oldVeyrholmCorridorIsAcceptedBoundary=true;
 assert.throws(()=>validateC1MShoreIntent(m,l,j),/unsupported shore arc/);
});
test('Kharuun coastal existence cannot be regressed to no shoreline',()=>{
 const {m,l,j}=input();
 m.ownerVisualDecision.kharuunHasShortNorthernCoastAtDesignLevel=false;
 assert.throws(()=>validateC1MShoreIntent(m,l,j),/unsupported shore arc/);
});
test('A full NE source window is not a granted Kharuun coast and no coast indices can be invented',()=>{
 const {m,l,j}=input();
 m.ownerVisualDecision.kharuunShoreIsNotEntireNortheastSector=false;
 assert.throws(()=>validateC1MShoreIntent(m,l,j),/unsupported shore arc/);
 const {m:m2,l:l2,j:j2}=input();
 m2.ownerVisualDecision.frontageSourceEdgeIndices=[196,197];
 assert.throws(()=>validateC1MShoreIntent(m2,l2,j2),/unsupported shore arc/);
});
test('City and port are possible later, but may not acquire coordinates, name, or route',()=>{
 const {m,l,j}=input();
 m.ownerVisualDecision.portCityCoordinates={x:400,y:200};
 assert.throws(()=>validateC1MShoreIntent(m,l,j),/unsupported shore arc/);
 const {m:m2,l:l2,j:j2}=input();
 m2.ownerVisualDecision.portRoutePublished=true;
 assert.throws(()=>validateC1MShoreIntent(m2,l2,j2),/unsupported shore arc/);
 const {m:m3,l:l3,j:j3}=input();
 m3.approval.coastalPortSettlementPublished=true;
 assert.throws(()=>validateC1MShoreIntent(m3,l3,j3),/improperly promoted/);
});
test('All old detached islands and foreign territory remain protected',()=>{
 const {m,l,j}=input();
 m.retainedSourceClaims.foreignWindwardParent='region.kaelvar';
 assert.throws(()=>validateC1MShoreIntent(m,l,j),/source landmass/);
 const {m:m2,l:l2,j:j2}=input();
 m2.retainedSourceClaims.unassignedMainlandTerrainCandidateCells=0;
 assert.throws(()=>validateC1MShoreIntent(m2,l2,j2),/source landmass/);
});
test('Result records shore existence without changing 599 original source edges',()=>{
 const {m}=input();
 const result=buildC1MReview(predecessor(),m);
 assert.equal(result.kharuunShoreExistence,'OWNER_ACCEPTED_DESIGN_GEOGRAPHY');
 assert.equal(result.exactKharuunSourceFrontage,
   'WITHHELD_NEEDS_SOURCE_AND_OWNER_ADJUDICATION');
 assert.equal(result.coastlineSourceEdgeInventory,599);
 assert.equal(result.historicNortheasternCompetingSourceEdges,114);
 assert.equal(result.canonicalWritable,false);
});
test('A previously published coast or an altered NE source partition is refused',()=>{
 const {m}=input(),old=predecessor();
 old.approval.regionPolygonsPublished=1;
 assert.throws(()=>buildC1MReview(old,m),/source arc or held geometry/);
 const other=predecessor();
 other.countsBySourceArcStatus.NE_VEYRHOLM_KHARUUN_COMPETITION_HELD=0;
 assert.throws(()=>buildC1MReview(other,m),/accounting changed/);
});
