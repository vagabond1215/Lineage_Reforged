import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  isSharedBlueCandidate,measureBlueAdjacency,
  summarizeGuideSourceEvidence,sampleNorthernEvidenceTransects,
  UNREACHED_BLUE_CONTACT,
} from '../../scripts/lib/kaelvar-c1h-source-diagnostics.mjs';

test('Shared source blue requires matching RGB and alpha; unverified blue never certifies sea',()=>{
  assert.equal(isSharedBlueCandidate(20,65,220,255,20,65,220,255),true);
  assert.equal(isSharedBlueCandidate(20,65,220,255,20,66,220,255),false);
  assert.equal(isSharedBlueCandidate(20,65,220,255,20,65,220,0),false);
  assert.equal(isSharedBlueCandidate(200,200,200,255,200,200,200,255),false);
});
test('Four-neighbor distances are confined to exact physical candidate component',()=>{
  const w=7,h=3,l=new Uint32Array(w*h),blue=new Uint8Array(w*h);
  for(let x=1;x<=4;x++)l[w+x]=30;
  l[w+6]=24;
  blue[w]=1;blue[w+5]=1;
  const t=measureBlueAdjacency({labels:l,blue,width:w,height:h});
  assert.equal(t.candidateMainlandPixels,4);
  assert.equal(t.immediateBlueNeighborMainlandPixels,2);
  assert.equal(t.reachableMainlandPixels,4);
  assert.equal(t.distances[w+1],0);
  assert.equal(t.distances[w+4],0);
  assert.equal(t.distances[w+2],1);
  assert.equal(t.distances[w+6],UNREACHED_BLUE_CONTACT);
  assert.equal(t.method.includes('NOT_OCEAN'),true);
});
test('Unconnected components cannot inherit marine contact from another component',()=>{
  const w=5,h=3,l=new Uint32Array(w*h),blue=new Uint8Array(w*h);
  l[w+1]=30;l[w+2]=30;l[w+4]=24;blue[w]=1;
  const t=measureBlueAdjacency({labels:l,blue,width:w,height:h});
  assert.equal(t.reachableMainlandPixels,2);
  assert.equal(t.distances[w+4],UNREACHED_BLUE_CONTACT);
});
test('No source blue anywhere means no certified frontages or fabricated proximity',()=>{
  const w=4,h=3,l=new Uint32Array(w*h),blue=new Uint8Array(w*h);
  l[w+1]=30;l[w+2]=30;
  const t=measureBlueAdjacency({labels:l,blue,width:w,height:h});
  assert.equal(t.reachableMainlandPixels,0);
  assert.equal(t.unreachableMainlandPixels,2);
  assert.equal(t.distances[w+1],UNREACHED_BLUE_CONTACT);
});
test('Overlapping source-blue and mainland terrain fails closed',()=>{
  const w=4,h=3,l=new Uint32Array(w*h),blue=new Uint8Array(w*h);
  l[w+1]=30;blue[w+1]=1;
  assert.throws(()=>measureBlueAdjacency({labels:l,blue,width:w,height:h}),
    /overlaps source terrain/);
});
test('Synthetic northern transect remains descriptive and no coast or route is approved',()=>{
  const w=2048,h=1152,n=w*h;
  const l=new Uint32Array(n),b=new Uint8Array(n),
    o=new Uint8Array(n),d=new Uint16Array(n);
  d.fill(UNREACHED_BLUE_CONTACT);
  for(let y=120;y<=123;y++){l[y*w+120]=30;o[y*w+120]=4;}
  for(let y=200;y<=204;y++){l[y*w+120]=30;o[y*w+120]=2;}
  const r=sampleNorthernEvidenceTransects({
    labels:l,blue:b,ownership:o,distances:d,
    samples:[120],yStart:115,yEnd:210,
  });
  assert.deepEqual(r[0].veyrholmCandidateYRange,[120,123]);
  assert.deepEqual(r[0].kharuunCandidateYRange,[200,204]);
  assert.equal(r[0].provesContinuousCoast,false);
  assert.equal(r[0].provesKharuunOceanAccess,false);
});
test('Invalid geometry and unknown classification refuse source diagnostics',()=>{
  const labels=new Uint32Array(6),blue=new Uint8Array(6);
  blue[0]=2;labels[1]=30;
  assert.throws(()=>measureBlueAdjacency({labels,blue,width:3,height:2}),
    /invalid blue candidate class/);
  assert.throws(()=>measureBlueAdjacency({
    labels,blue:new Uint8Array(7),width:3,height:2}),
    /reference size/);
});
