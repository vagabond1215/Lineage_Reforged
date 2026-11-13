/**
 * Coordinate-first geometry primitives for future world geography authoring.
 * Pure calculation. Does not replace active legacy travel/settlement authority.
 *
 * The registered First World source frame is planar for authored image scale.
 * This is NOT geodetic latitude/longitude, and it is NOT a walking path.
 */
export const FIRST_WORLD_REFERENCE = Object.freeze({
  mapId: 'world_map.first_world',
  coordinateSpaceId: 'world_map.first_world.reference',
  widthPixels: 2048,
  heightPixels: 1152,
  kilometersPerPixel: 9.765625,
  units: 'reference_pixels',
  orientation: 'top_left_x_east_y_south',
});

const fail = why => { throw Error('World coordinate HOLD: '+why); };
const finite = n => Number.isFinite(n);
const validFrame = frame => frame &&
  typeof frame.mapId==='string'&&frame.mapId.length>0&&
  typeof frame.coordinateSpaceId==='string'&&frame.coordinateSpaceId.length>0&&
  Number.isInteger(frame.widthPixels)&&frame.widthPixels>0&&
  Number.isInteger(frame.heightPixels)&&frame.heightPixels>0&&
  finite(frame.kilometersPerPixel)&&frame.kilometersPerPixel>0;
const point = p => p && finite(p.x) && finite(p.y);

/** An image-edge coordinate may equal width/height; actual pixel-center samples remain inside. */
export function assertCoordinatePoint(p,frame=FIRST_WORLD_REFERENCE) {
  if(!validFrame(frame)||!point(p)||p.x<0||p.y<0||
     p.x>frame.widthPixels||p.y>frame.heightPixels)
    fail('invalid coordinate frame or point');
  return {x:p.x,y:p.y};
}

export function referencePixelToPlanarKm(p,frame=FIRST_WORLD_REFERENCE) {
  const {x,y}=assertCoordinatePoint(p,frame);
  return {xKm:x*frame.kilometersPerPixel,yKm:y*frame.kilometersPerPixel};
}
export function planarKmToReferencePixel(p,frame=FIRST_WORLD_REFERENCE) {
  if(!validFrame(frame)||!p||!finite(p.xKm)||!finite(p.yKm))
    fail('invalid kilometer point');
  return assertCoordinatePoint({
    x:p.xKm/frame.kilometersPerPixel,
    y:p.yKm/frame.kilometersPerPixel,
  },frame);
}
export function planarDistanceKm(a,b,frame=FIRST_WORLD_REFERENCE) {
  const p=referencePixelToPlanarKm(a,frame);
  const q=referencePixelToPlanarKm(b,frame);
  return Math.hypot(p.xKm-q.xKm,p.yKm-q.yKm);
}
const cross = (a,b,p) => (b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
const eps = 1e-9;
const onSegment = (a,b,p) =>
  Math.abs(cross(a,b,p))<eps &&
  p.x>=Math.min(a.x,b.x)-eps&&p.x<=Math.max(a.x,b.x)+eps&&
  p.y>=Math.min(a.y,b.y)-eps&&p.y<=Math.max(a.y,b.y)+eps;
const signedDoubleArea = ring => ring.reduce((a,p,i)=>{
  const q=ring[(i+1)%ring.length];return a+p.x*q.y-q.x*p.y;
},0);
const simpleSegmentsIntersect=(a,b,c,d)=>{
  const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b);
  if((x>eps&&y< -eps||x< -eps&&y>eps)&&
     (z>eps&&w< -eps||z< -eps&&w>eps))return true;
  return (Math.abs(x)<eps&&onSegment(a,b,c))||
    (Math.abs(y)<eps&&onSegment(a,b,d))||
    (Math.abs(z)<eps&&onSegment(c,d,a))||
    (Math.abs(w)<eps&&onSegment(c,d,b));
};
function validateRing(ring,frame,label) {
  if(!Array.isArray(ring)||ring.length<3)fail(label+' needs at least three vertices');
  for(const p of ring)assertCoordinatePoint(p,frame);
  const n=ring.length;
  for(let i=0;i<n;i++)
    if(Math.hypot(ring[i].x-ring[(i+1)%n].x,ring[i].y-ring[(i+1)%n].y)<eps)
      fail(label+' contains zero-length edge');
  if(Math.abs(signedDoubleArea(ring))<=eps)fail(label+' has zero area');
  for(let i=0;i<n;i++){
    const a=ring[i],b=ring[(i+1)%n];
    for(let j=i+1;j<n;j++){
      if(j===i+1||(i===0&&j===n-1))continue;
      if(simpleSegmentsIntersect(a,b,ring[j],ring[(j+1)%n]))
        fail(label+' self-intersects');
    }
  }
  return ring;
}
/**
 * Polygon represented as {outer:[{x,y},...],holes:[[...],...]}.
 * The boundary of a hole is excluded; outer boundary is included.
 * Holes cannot touch or cross the outer ring or each other.
 */
function ringRelation(p,ring) {
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const a=ring[j],b=ring[i];
    if(onSegment(a,b,p))return 'boundary';
    if((a.y>p.y)!==(b.y>p.y)&&
       p.x < (b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
  }
  return inside?'inside':'outside';
}
function ringsIntersect(a,b) {
  for(let i=0;i<a.length;i++)
    for(let j=0;j<b.length;j++)
      if(simpleSegmentsIntersect(a[i],a[(i+1)%a.length],
        b[j],b[(j+1)%b.length]))return true;
  return false;
}
export function validateCoordinatePolygon(polygon,frame=FIRST_WORLD_REFERENCE) {
  if(!polygon||typeof polygon!=='object')fail('polygon missing');
  const outer=validateRing(polygon.outer,frame,'outer ring');
  const holes=polygon.holes??[];
  if(!Array.isArray(holes))fail('holes must be an array');
  holes.forEach((hole,i)=>{
    validateRing(hole,frame,'hole '+i);
    if(ringsIntersect(outer,hole)||hole.some(p=>ringRelation(p,outer)!=='inside'))
      fail('hole crosses or leaves outer ring');
    holes.slice(0,i).forEach(prior=>{
      if(ringsIntersect(prior,hole)||hole.some(p=>ringRelation(p,prior)!=='outside')||
         prior.some(p=>ringRelation(p,hole)!=='outside'))
        fail('holes overlap or contain one another');
    });
  });
  return true;
}
export function coordinatePolygonContains(polygon,p,frame=FIRST_WORLD_REFERENCE) {
  validateCoordinatePolygon(polygon,frame);
  assertCoordinatePoint(p,frame);
  if(ringRelation(p,polygon.outer)==='outside')return false;
  return !(polygon.holes??[]).some(hole=>ringRelation(p,hole)!=='outside');
}
/** One area's multiple non-overlapping pieces; island group membership requires separate explicit physical-component authority. */
export function coordinateAreaContains(polygons,p,frame=FIRST_WORLD_REFERENCE) {
  if(!Array.isArray(polygons)||polygons.length===0)fail('area requires polygons');
  // Validate every piece even if an earlier polygon contains the point.
  // An invalid detached-island piece must never be silently ignored.
  for(const poly of polygons)validateCoordinatePolygon(poly,frame);
  assertCoordinatePoint(p,frame);
  return polygons.some(poly=>
    ringRelation(p,poly.outer)!=='outside'&&
    !(poly.holes??[]).some(hole=>ringRelation(p,hole)!=='outside'));
}
export function requireExplicitRouteConnection({
  fromPlaceId,toPlaceId,connections,
}) {
  if(!fromPlaceId||!toPlaceId||fromPlaceId===toPlaceId||
     !Array.isArray(connections))fail('invalid route endpoint request');
  const link=connections.find(c=>
    c.fromPlaceId===fromPlaceId&&c.toPlaceId===toPlaceId&&
    c.status==='APPROVED'&&c.explicitlyTraversable===true);
  if(!link)fail('no approved directed connection; coordinate proximity does not imply travel');
  return link;
}
