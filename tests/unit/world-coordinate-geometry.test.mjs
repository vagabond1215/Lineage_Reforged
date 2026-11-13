import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  FIRST_WORLD_REFERENCE,
  referencePixelToPlanarKm,planarKmToReferencePixel,
  planarDistanceKm,assertCoordinatePoint,
  validateCoordinatePolygon,coordinatePolygonContains,
  coordinateAreaContains,requireExplicitRouteConnection,
} from '../../scripts/lib/world-coordinate-geometry.mjs';
const square=(x,y,s)=>[
  {x,y},{x:x+s,y},{x:x+s,y:y+s},{x,y:y+s},
];
test('Registered world reference scale preserves original pixel map without a grid',()=>{
  assert.deepEqual(referencePixelToPlanarKm({x:2048,y:1152}),
    {xKm:20000,yKm:11250});
  assert.deepEqual(planarKmToReferencePixel({xKm:20000,yKm:11250}),
    {x:2048,y:1152});
  assert.equal(planarDistanceKm({x:0,y:0},{x:10,y:0}),97.65625);
  assert.equal(FIRST_WORLD_REFERENCE.coordinateSpaceId,'world_map.first_world.reference');
});
test('Continuous fractional positions are allowed; out-of-frame and NaN are held',()=>{
  assert.deepEqual(assertCoordinatePoint({x:2.125,y:3.75}),{x:2.125,y:3.75});
  assert.throws(()=>assertCoordinatePoint({x:-.01,y:1}),/invalid coordinate/);
  assert.throws(()=>assertCoordinatePoint({x:Infinity,y:1}),/invalid coordinate/);
  assert.throws(()=>assertCoordinatePoint({x:1,y:1152.01}),/invalid coordinate/);
});
test('Irregular polygon supports holes without making a boundary or lake own the hole',()=>{
  const poly={outer:[{x:1,y:1},{x:12,y:1},{x:8,y:9},{x:2,y:8}],
    holes:[square(4,3,2)]};
  assert.equal(validateCoordinatePolygon(poly),true);
  assert.equal(coordinatePolygonContains(poly,{x:2,y:2}),true);
  assert.equal(coordinatePolygonContains(poly,{x:5,y:5}),false);
  assert.equal(coordinatePolygonContains(poly,{x:4,y:4}),false);
  assert.equal(coordinatePolygonContains(poly,{x:1,y:1}),true);
  assert.equal(coordinatePolygonContains(poly,{x:13,y:1}),false);
});
test('Disjoint islands can be authored as distinct polygons without forced equal size',()=>{
  const small={outer:square(1,1,2)};
  const large={outer:square(20,20,20)};
  assert.equal(coordinateAreaContains([small,large],{x:2,y:2}),true);
  assert.equal(coordinateAreaContains([small,large],{x:30,y:30}),true);
  assert.equal(coordinateAreaContains([small,large],{x:10,y:10}),false);
  assert.throws(()=>coordinateAreaContains([small,{outer:[
    {x:1,y:1},{x:2,y:2},{x:3,y:3},
  ]}],{x:2,y:2}),/zero area/);
});
test('Broken rings, zero-area, intersecting holes and out-of-bounds vertices fail closed',()=>{
  const outer=square(1,1,10);
  assert.throws(()=>validateCoordinatePolygon({outer:[{x:1,y:1},{x:2,y:2},{x:3,y:3}]}),/zero area/);
  assert.throws(()=>validateCoordinatePolygon({outer:[{x:1,y:1},{x:5,y:5},{x:1,y:5},{x:5,y:1}]}),/self-intersects|zero area/);
  assert.throws(()=>validateCoordinatePolygon({outer:[{x:1,y:1},{x:2050,y:1},{x:4,y:3}]}),/invalid coordinate/);
  assert.throws(()=>validateCoordinatePolygon({outer,holes:[square(9,9,4)]}),/hole crosses/);
  assert.throws(()=>validateCoordinatePolygon({outer,holes:[square(3,3,4),square(5,5,3)]}),/holes overlap/);
});
test('Nearby coordinates are not a substitute for an explicitly approved directed travel connection',()=>{
  const connections=[{fromPlaceId:'settlement.a',toPlaceId:'settlement.b',
    status:'PROPOSED',explicitlyTraversable:true},
    {fromPlaceId:'settlement.b',toPlaceId:'settlement.a',
      status:'APPROVED',explicitlyTraversable:true}];
  assert.throws(()=>requireExplicitRouteConnection({
    fromPlaceId:'settlement.a',toPlaceId:'settlement.b',connections,
  }),/no approved directed connection/);
  assert.equal(requireExplicitRouteConnection({
    fromPlaceId:'settlement.b',toPlaceId:'settlement.a',connections,
  }).status,'APPROVED');
});
