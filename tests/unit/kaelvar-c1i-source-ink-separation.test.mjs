import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  isSharedNonblueUnresolved,classifyBlueComponents,
  measureInkBridgeContacts,reportRegionInkContacts,UNREACHABLE_INK,
} from '../../scripts/lib/kaelvar-c1i-source-ink-separation.mjs';
test('Source-shared nonblue is unresolved, not certified shoreline ink',()=>{
  assert.equal(isSharedNonblueUnresolved(20,20,20,255,20,20,20,255),true);
  assert.equal(isSharedNonblueUnresolved(20,60,220,255,20,60,220,255),false);
  assert.equal(isSharedNonblueUnresolved(20,20,20,255,20,21,20,255),false);
  assert.equal(isSharedNonblueUnresolved(20,20,20,255,20,20,20,0),false);
});
test('Edge blue and enclosed four-neighbor blue remain different, neither proves water body type',()=>{
  const w=7,h=6,b=new Uint8Array(w*h);
  for(let y=0;y<4;y++)b[y*w]=1;
  b[w+2]=1;b[2*w+2]=1; // enclosed: no horizontal or diagonal cross accepted
  b[3*w+5]=1;b[3*w+6]=1; // right frame edge
  b[4*w+3]=1;
  const out=classifyBlueComponents({blue:b,width:w,height:h});
  assert.equal(out.summary.boundaryConnectedBlueComponents,2);
  assert.equal(out.summary.enclosedBlueComponents,2);
  assert.equal(out.edgeConnectedBlue[2*w+2],0);
  assert.equal(out.edgeConnectedBlue[3*w+6],1);
  assert.equal(out.summary.borderBlueIsNotCertifiedOcean,true);
  assert.equal(out.summary.enclosedBlueIsNotCertifiedLake,true);
});
test('Two unresolved shared-nonblue pixels bridge but one cannot',()=>{
  const w=9,h=3,n=w*h,b=new Uint8Array(n),
    s=new Uint8Array(n),l=new Uint32Array(n);
  b[w]=1;s[w+1]=1;s[w+2]=1;l[w+3]=30;l[w+4]=30;
  const a=measureInkBridgeContacts({
    boundaryBlue:b,sharedNonblue:s,labels:l,width:w,height:h,maxInkSteps:2,
  });
  assert.equal(a.contactMinInk[w+3],2);
  assert.equal(a.contactMinInk[w+4],UNREACHABLE_INK);
  assert.deepEqual(a.summary.contactsByMinimumSharedNonblueSteps,[0,0,1]);
  const z=measureInkBridgeContacts({
    boundaryBlue:b,sharedNonblue:s,labels:l,width:w,height:h,maxInkSteps:1,
  });
  assert.equal(z.contactMinInk[w+3],UNREACHABLE_INK);
});
test('Enclosed source blue cannot seed an accepted edge-blue ink bridge',()=>{
  const w=9,h=3,n=w*h,b=new Uint8Array(n),
    s=new Uint8Array(n),l=new Uint32Array(n);
  b[w]=1;b[w+6]=1;s[w+1]=1;s[w+7]=1;
  l[w+2]=30;l[w+8]=30;
  const edge=classifyBlueComponents({blue:b,width:w,height:h});
  const out=measureInkBridgeContacts({
    boundaryBlue:edge.edgeConnectedBlue,sharedNonblue:s,labels:l,
    width:w,height:h,maxInkSteps:1,
  });
  assert.equal(out.contactMinInk[w+2],1);
  assert.equal(out.contactMinInk[w+8],UNREACHABLE_INK);
});
test('Region contact counts keep unassigned mainland and reject island ownership',()=>{
  const w=7,h=3,n=w*h,l=new Uint32Array(n),
    o=new Uint8Array(n),d=new Uint8Array(n);
  d.fill(UNREACHABLE_INK);
  l[w+1]=30;o[w+1]=4;d[w+1]=1;
  l[w+2]=30;o[w+2]=2;d[w+2]=0;
  l[w+3]=30;l[w+5]=24;
  const x=reportRegionInkContacts({
    ownership:o,labels:l,contactMinInk:d,width:w,height:h,
  });
  assert.equal(x.regionRows[0].terrainCandidateCells,1);
  assert.equal(x.regionRows[4].contactCandidatesByMinInkSteps[1],1);
  assert.equal(x.regionRows[2].contactCandidatesByMinInkSteps[0],1);
  assert.equal(x.canonicalWritable,false);
  o[w+5]=4;
  assert.throws(()=>reportRegionInkContacts({
    ownership:o,labels:l,contactMinInk:d,width:w,height:h,
  }),/detached physical/);
});
test('Overlapping blue and nonblue or mainland source classes fail closed',()=>{
  const w=4,h=3,n=w*h,b=new Uint8Array(n),
    s=new Uint8Array(n),l=new Uint32Array(n);
  l[w+1]=30;b[w+1]=1;
  assert.throws(()=>measureInkBridgeContacts({
    boundaryBlue:b,sharedNonblue:s,labels:l,width:w,height:h,
  }),/overlaps mainland/);
  b[w+1]=0;b[w]=1;s[w]=1;
  assert.throws(()=>measureInkBridgeContacts({
    boundaryBlue:b,sharedNonblue:s,labels:l,width:w,height:h,
  }),/overlap/);
});
test('Unbounded ink horizon and mismatched dimensions are rejected',()=>{
  const w=3,h=3,l=new Uint32Array(9),b=new Uint8Array(9),s=new Uint8Array(9);
  l[4]=30;b[0]=1;
  assert.throws(()=>measureInkBridgeContacts({
    boundaryBlue:b,sharedNonblue:s,labels:l,width:w,height:h,maxInkSteps:99,
  }),/horizon invalid/);
  assert.throws(()=>classifyBlueComponents({
    blue:new Uint8Array(8),width:w,height:h,
  }),/dimensions invalid/);
});
