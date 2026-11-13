import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {
  FIRST_WORLD_REFERENCE,
} from '../../scripts/lib/world-coordinate-geometry.mjs';
import {
  validateCoordinateMultiPolygon,validateGeographicArea,
  findCoordinateAreasAtPoint,validateWholeComponentClaims,
  validateKaelvarC1ReviewLedger,
} from '../../scripts/lib/world-geographic-authority.mjs';
const square=(x,y,s)=>[{x,y},{x:x+s,y},{x:x+s,y:y+s},{x,y:y+s}];
const poly=(x,y,s)=>({outer:square(x,y,s)});
const area=(id,kind,polygons)=>({
  id,kind,mapId:FIRST_WORLD_REFERENCE.mapId,
  coordinateSpaceId:FIRST_WORLD_REFERENCE.coordinateSpaceId,
  parentContinentId:kind==='ECOLOGICAL_ZONE'?null:'region.kaelvar',
  geometryStatus:'PROPOSED',geometryRef:'review.'+id,geometryVersion:1,
  sourceFeatureIds:['feature.example'],polygons,ownerApprovalRef:null,
});
const ledgerPath=new URL('../../docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json',import.meta.url);
const ledger=()=>JSON.parse(readFileSync(ledgerPath,'utf8'));
test('C1 holds all five region geometries and 18 detached physical components',()=>{
  const result=validateKaelvarC1ReviewLedger(ledger());
  assert.equal(result.childRegionIntents,5);
  assert.equal(result.physicalComponents,19);
  assert.equal(result.detachedCandidateCells,3693);
  assert.equal(result.canonicalWritable,false);
});
test('C1 rejects forced allocation, missing island or altered mainland count',()=>{
  const a=ledger();a.regionIntents[0].geometryStatus='APPROVED';
  assert.throws(()=>validateKaelvarC1ReviewLedger(a),/HOLD/);
  const b=ledger();b.physicalComponents.splice(1,1);
  assert.throws(()=>validateKaelvarC1ReviewLedger(b),/inventory incomplete/);
  const c=ledger();c.physicalComponents[0].candidateCells++;
  assert.throws(()=>validateKaelvarC1ReviewLedger(c),/mainland reference drift/);
});
test('C1 excludes publication from unknown NE island and foreign Windward parent',()=>{
  const a=ledger();a.holds.northeastLargeIsland.ownerRegionId='region.shattercap_isles';
  assert.throws(()=>validateKaelvarC1ReviewLedger(a),/NE island/);
  const b=ledger();b.holds.windwardSpine.kaelvarTransferApproved=true;
  assert.throws(()=>validateKaelvarC1ReviewLedger(b),/foreign parent/);
  const c=ledger();c.approval.canonicalWritable=true;
  assert.throws(()=>validateKaelvarC1ReviewLedger(c),/publication lock/);
});
test('Irregular multipolygons have holes and non-overlapping detached pieces',()=>{
  const p={outer:square(10,10,80),holes:[square(30,30,30)]};
  assert.equal(validateCoordinateMultiPolygon([p,poly(100,10,10)]),true);
  assert.throws(()=>validateCoordinateMultiPolygon([p,poly(20,20,5)]),/overlapping/);
  assert.throws(()=>validateCoordinateMultiPolygon([poly(1,1,10),poly(11,1,4)]),/touching/);
  assert.throws(()=>validateCoordinateMultiPolygon([poly(1,1,10),{outer:square(2,2,0)}]),/zero-length/);
});
test('Ecological areas may overlap political borders without claiming sovereignty',()=>{
  const areas=[
    area('west','REGION',[poly(10,10,25)]),
    area('east','REGION',[poly(40,10,25)]),
    area('wind-belt','ECOLOGICAL_ZONE',[poly(20,20,35)]),
  ];
  assert.deepEqual(findCoordinateAreasAtPoint(areas,{x:24,y:24}).map(a=>a.id),['west','wind-belt']);
  const doubled=[...areas,area('conflict','REGION',[poly(20,20,10)])];
  assert.throws(()=>findCoordinateAreasAtPoint(doubled,{x:24,y:24}),/competing regional/);
});
test('Withheld areas never return geography; placed shapes require source linkage',()=>{
  const withheld={
    id:'region.unknown',kind:'REGION',mapId:FIRST_WORLD_REFERENCE.mapId,
    coordinateSpaceId:FIRST_WORLD_REFERENCE.coordinateSpaceId,
    parentContinentId:'region.kaelvar',geometryStatus:'WITHHELD',
    geometryRef:null,polygons:null,
  };
  assert.equal(validateGeographicArea(withheld),true);
  assert.deepEqual(findCoordinateAreasAtPoint([withheld],{x:40,y:40}),[]);
  const proposed=area('bad','REGION',[poly(1,1,5)]);
  proposed.sourceFeatureIds=[];
  assert.throws(()=>validateGeographicArea(proposed),/source provenance/);
});
test('Physical whole-component claims require a matching registered geometry ref',()=>{
  const components=[{namespace:'n',componentId:8,geometryRef:'physical.8'}];
  assert.equal(validateWholeComponentClaims(components,[{
    namespace:'n',componentId:8,coverage:'WHOLE_COMPONENT',
    regionId:'region.a',geometryRef:'physical.8',status:'PROPOSED',
  }]),true);
  assert.throws(()=>validateWholeComponentClaims(components,[{
    namespace:'n',componentId:8,coverage:'PART',regionId:'region.a',
    geometryRef:'physical.8',status:'PROPOSED',
  }]),/partial/);
  assert.throws(()=>validateWholeComponentClaims(components,[{
    namespace:'n',componentId:8,coverage:'WHOLE_COMPONENT',regionId:'region.a',
    geometryRef:'different',status:'APPROVED',ownerApprovalRef:'ref',
  }]),/unregistered/);
  assert.throws(()=>validateWholeComponentClaims(components,[{
    namespace:'n',componentId:8,coverage:'WHOLE_COMPONENT',regionId:'region.a',
    geometryRef:'physical.8',status:'APPROVED',ownerApprovalRef:null,
  }]),/approval reference/);
});
