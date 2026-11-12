/* Read-only First World cartographic evidence workbench.
   Vite serves source files from their existing canonical paths. No game state is imported or changed. */
import biomeUrl from '../../packages/content/base/world/map_assets/First World Biome.png?url';
import heightUrl from '../../packages/content/base/world/map_assets/First World Elevation.png?url';
import mapUrl from '../../packages/content/base/world/world_maps.json?url';
import settlementsUrl from '../../packages/content/base/world/settlements.json?url';
import regionsUrl from '../../packages/content/base/world/regions.json?url';
import localitiesUrl from '../../packages/content/base/world/region_localities.json?url';
import hexUrl from '../../packages/content/base/world/world_hexes.json?url';
import hexEdgesUrl from '../../packages/content/base/world/world_hex_edges.json?url';
import routesUrl from '../../packages/content/base/world/travel_networks.json?url';
import featuresUrl from '../../packages/content/base/world/world_map_features.json?url';
import semanticUrl from '../../packages/content/base/world/map_features.json?url';
import {buildBoundaryCatalog, newBoundaryDraft, cleanBoundaryDraft, copyPoints, boundaryPart,
  boundaryParts, setBoundaryPoints, excludeBoundary, resetBoundary, addCustomBoundary,
  squareCandidate, segmentIndex} from './world-map-review-boundaries.mjs';

const $ = (id) => document.getElementById(id);
const FRAME = { width: 2048, height: 1152 };
const KEY = 'lineage-first-world-map-review-v1';
const SVG_NS = 'http://www.w3.org/2000/svg';
const sources = {};
const state = { moved: {}, waypoints: {}, reviews: {}, boundary: newBoundaryDraft() };
const view = { scale: 1, tx: 0, ty: 0 };
let settlements = [], routes = [], hexes = [], edges = [], regions = [], localities = [];
let settlementById = new Map(), regionById = new Map(), routesById = new Map(), featureById = new Map();
let selection = null, pointerAction = null, boundaryCatalog = null, drawingPoints = [];
const checks = ['showSettlements','showLabels','showRoutes','showFlows','showHexEdges','showPoints','showRivers','showContinents','showRegions','showSuspectSquares','showSourceCoastline','showOriginalBoundary','showRegionLabels','showLocalities','showGrid'];
const atlas = $('atlas'), overlay = $('overlay'), viewport = $('viewport'), stage = $('stage');
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const fmt = (n) => Number.isFinite(n) ? Number(n).toLocaleString(undefined,{maximumFractionDigits:1}) : 'unknown';
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const box = (label, value) => '<dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value) + '</dd>';
const nameOf = (id) => regionById.get(id)?.name || settlementById.get(id)?.name || localities.find((l) => l.id === id)?.name || id || 'Unknown';
const checked = (id) => Boolean($(id)?.checked);
const isPoint = (p) => Number.isFinite(p?.x) && Number.isFinite(p?.y);
const within = (p) => isPoint(p) && p.x >= 0 && p.y >= 0 && p.x < FRAME.width && p.y < FRAME.height;
const near = (a, b) => Math.hypot(a.x-b.x,a.y-b.y);

async function loadJson(url, name) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(name + ' HTTP ' + response.status);
  const raw = (await response.text()).replace(/^\uFEFF/, '');
  const json = JSON.parse(raw);
  sources[name] = json;
  return json.records || [];
}
function originalPosition(site) {
  const p = site?.visualMapRef;
  return p && Number.isFinite(p.pixelX) && Number.isFinite(p.pixelY) ? {x:p.pixelX, y:p.pixelY} : null;
}
function position(site) {
  if (!site) return null;
  return state.moved[site.id] || originalPosition(site);
}
function routePoints(route) {
  const a = position(settlementById.get(route.fromSettlementId));
  const b = position(settlementById.get(route.toSettlementId));
  if (!a || !b) return [];
  return [a, ...(state.waypoints[route.id] || []), b];
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({version:2,moved:state.moved,waypoints:state.waypoints,reviews:state.reviews,boundary:state.boundary}));
  } catch (err) { $('loadStatus').textContent = 'Storage unavailable; export to retain edits'; }
  updateDraftSummary();
}
function sanitizeDraft(raw) {
  const moved = {}, waypoints = {}, reviews = {};
  for (const [id,p] of Object.entries(raw?.moved || {})) {
    if (settlementById.has(id) && within(p)) moved[id] = {x:Math.round(p.x),y:Math.round(p.y)};
  }
  for (const [id,points] of Object.entries(raw?.waypoints || {})) {
    if (routesById.has(id) && Array.isArray(points)) waypoints[id] = points.filter(within).slice(0,150).map(p => ({x:Math.round(p.x),y:Math.round(p.y)}));
  }
  for (const [id,r] of Object.entries(raw?.reviews || {})) {
    const [kind, ...parts] = id.split(':');
    const key = parts.join(':');
    if ((kind === 'settlement' && settlementById.has(key)) ||
        (kind === 'route' && routesById.has(key)) ||
        (kind === 'feature' && featureById.has(key)) ||
        (kind === 'region' && regionById.has(key)) ||
        (kind === 'locality' && localities.some(x=>x.id===key)) ||
        (kind === 'boundary' && ['region','continent'].includes(parts[0]) &&
          (boundaryCatalog.parts.has(parts.slice(1).join(':')) ||
           Boolean(state.boundary?.custom?.[parts[0]]?.[parts.slice(1).join(':')])))) {
      reviews[id] = {status:['unreviewed','candidate','conflict','checked'].includes(r?.status) ? r.status : 'unreviewed',notes:String(r?.notes || '').slice(0,10000)};
    }
  }
  return {moved,waypoints,reviews,boundary:cleanBoundaryDraft(raw?.boundary,boundaryCatalog)};
}
function replaceDraft(draft) {
  Object.assign(state, sanitizeDraft(draft));
  drawingPoints=[];save(); renderAll(); select(selection?.kind || null, selection?.id || null,selection?.scope||null);
}
function updateDraftSummary() {
  const count = Object.values(state.waypoints).filter((a) => a.length).length;
  const altered=Object.values(state.boundary.region).length+Object.values(state.boundary.continent).length+
    Object.values(state.boundary.custom.region).length+Object.values(state.boundary.custom.continent).length;
  $('draftSummary').textContent = Object.keys(state.moved).length + ' moved · ' + count + ' routes · ' + altered + ' boundary parts';
}
function setTransform() {
  stage.style.transform = 'translate(' + view.tx + 'px,' + view.ty + 'px) scale(' + view.scale + ')';
  $('zoomLabel').textContent = Math.round(view.scale * 100) + '%';
}
function fitAtlas() {
  const w = viewport.clientWidth, h = viewport.clientHeight;
  view.scale = Math.min(w / FRAME.width, h / FRAME.height) * 0.985;
  view.tx = (w - FRAME.width * view.scale) / 2;
  view.ty = (h - FRAME.height * view.scale) / 2;
  setTransform();if(boundaryCatalog)renderOverlay();
}
function zoom(factor, screenX=viewport.clientWidth/2, screenY=viewport.clientHeight/2) {
  const next = clamp(view.scale * factor, 0.11, 8);
  const ratio = next / view.scale;
  view.tx = screenX - (screenX-view.tx)*ratio;
  view.ty = screenY - (screenY-view.ty)*ratio;
  view.scale = next; setTransform();if(boundaryCatalog)renderOverlay();
}
function worldPoint(event) {
  const bounds = viewport.getBoundingClientRect();
  return {x:(event.clientX-bounds.left-view.tx)/view.scale, y:(event.clientY-bounds.top-view.ty)/view.scale};
}
function centerOn(point, scale) {
  if (!point) return;
  if (scale) view.scale = clamp(scale,0.11,8);
  view.tx = viewport.clientWidth/2-point.x*view.scale;
  view.ty = viewport.clientHeight/2-point.y*view.scale;
  setTransform();
}
function focusRoute(route) {
  const points=routePoints(route);
  if (!points.length) return;
  const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
  const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
  const s=clamp(Math.min(viewport.clientWidth/(maxX-minX+220),viewport.clientHeight/(maxY-minY+180))*.82,.18,3.2);
  centerOn({x:(minX+maxX)/2,y:(minY+maxY)/2},s);
}
function addSvg(tag, attributes, parent=overlay, textContent) {
  const node=document.createElementNS(SVG_NS,tag);
  for (const [key,value] of Object.entries(attributes)) if (value !== null && value !== undefined) node.setAttribute(key,String(value));
  if (textContent !== undefined) node.textContent=textContent;
  parent.append(node);
  return node;
}
function group(id) { return addSvg('g',{'data-layer':id}); }
function pointsString(points) { return points.filter(isPoint).map(p=>p.x+','+p.y).join(' '); }
function polygonPath(points) { return points.length ? 'M'+pointsString(points).replaceAll(' ','L')+'Z' : ''; }
function centroid(points) {
  const good=points.filter(within);
  return good.length ? {x:good.reduce((a,p)=>a+p.x,0)/good.length,y:good.reduce((a,p)=>a+p.y,0)/good.length} : null;
}
function addLabel(parent,point,label,kind) {
  if (!within(point)) return;
  addSvg('text',{x:point.x+11,y:point.y-11,class:kind},parent,label);
}
function drawGrid() {
  if (!checked('showGrid')) return;
  const layer=group('pixel-grid');
  for(let x=0;x<=FRAME.width;x+=256) {
    addSvg('line',{x1:x,y1:0,x2:x,y2:FRAME.height,stroke:'#ffffff',opacity:.23,'stroke-width':1},layer);
    if(x<FRAME.width)addSvg('text',{x:x+4,y:18,fill:'#f7f9fc','font-size':13},layer,String(x));
  }
  for(let y=0;y<=FRAME.height;y+=256) {
    addSvg('line',{x1:0,y1:y,x2:FRAME.width,y2:y,stroke:'#ffffff',opacity:.23,'stroke-width':1},layer);
    if(y<FRAME.height)addSvg('text',{x:4,y:y+18,fill:'#f7f9fc','font-size':13},layer,String(y));
  }
}
function boundaryScope() {return $('boundaryScope').value;}
function boundaryOwner() {return $('boundaryOwner').value;}
function activeBoundary() {
  return selection?.kind==='boundary' ? boundaryPart(boundaryCatalog,state.boundary,selection.scope,selection.id):null;
}
function selectBoundaryPart(scope,id) {
  const part=boundaryPart(boundaryCatalog,state.boundary,scope,id);
  if(!part)return;
  $('boundaryScope').value=scope;
  populateBoundaryOwners();
  $('boundaryOwner').value=part.custom?part.ownerId:(scope==='continent'?part.macroId:part.ownerId);
  select('boundary',id,scope);
}
function populateBoundaryOwners() {
  const scope=boundaryScope(),owners=scope==='continent'?boundaryCatalog.macros:boundaryCatalog.namedRegions;
  const picker=$('boundaryOwner'),selected=picker.value;
  picker.replaceChildren();
  for(const owner of owners) {
    const option=document.createElement('option');
    option.value=owner.id;
    option.textContent=owner.name+(owner.regionType==='island_system'?' (island system)':'');
    picker.append(option);
  }
  if(owners.some(x=>x.id===selected))picker.value=selected;
}
function renderBoundaryPartList() {
  const scope=boundaryScope(),ownerId=boundaryOwner(),parts=boundaryParts(boundaryCatalog,state.boundary,scope,ownerId);
  const list=$('boundaryPartList');list.replaceChildren();
  const ownKind=boundaryCatalog.byRegion.get(ownerId)?.regionType;
  $('boundaryOwnership').textContent=scope==='continent'
    ? 'Macro contours combine mainland child-subregion footprints or directly owned island-system parts. Editing this preview does not change the subregion layer.'
    : (parts.length?'Existing generated footprints; offshore squares are only candidates for exclusion.':
       'No source polygon exists for this subregion. Draw a proposed independent polygon if evidence supports it.');
  if(!parts.length)list.textContent='No source footprint. Use Draw new polygon to add review geometry.';
  for(const part of parts){
    const item=document.createElement('button');item.className='boundary-part-item'+
      (part.squareCandidate?' candidate':'')+(part.excluded?' excluded':'')+
      (selection?.kind==='boundary'&&selection?.scope===scope&&selection?.id===part.id?' active':'');
    const count=part.points?.length||0;
    item.innerHTML='<strong>'+escapeHtml(part.name)+'</strong><small>'+
      (part.squareCandidate?'8×8 square candidate · ':'')+
      (part.custom?'new draft · ':'')+
      (part.excluded?'excluded · ':part.edited?'edited · ':'source · ')+
      count+' vertices</small>';
    item.onclick=()=>{selectBoundaryPart(scope,part.id);focusSelection();};
    list.append(item);
  }
  const selected=activeBoundary();
  const validSelection=selection?.scope===scope && parts.some(p=>p.id===selection?.id);
  $('toggleBoundaryPart').disabled=!validSelection;
  $('resetBoundaryPart').disabled=!validSelection;
  $('toggleBoundaryPart').textContent=validSelection&&selected?.excluded?'Restore selected part':'Exclude selected part from draft';
  $('finishBoundary').disabled=!checked('editBoundary')||$('boundaryTool').value!=='draw'||drawingPoints.length<3;
  $('cancelBoundary').disabled=!drawingPoints.length;
}
function drawSourceCoastlines() {
  if(!checked('showSourceCoastline'))return;
  const layer=group('source-coastline-reference');
  for(const feature of sources.features?.records?.[0]?.coastlines||[]) {
    if(!feature.points?.length)continue;
    const el=addSvg('path',{d:polygonPath(feature.points),fill:'none',stroke:'#f1f1f4',
      'stroke-opacity':.8,'stroke-width':2},layer);
    addSvg('title',{},el,'Unmodified coastline reference · '+feature.name);
  }
}
function drawBoundaryScope(scope) {
  const visible=checked(scope==='continent'?'showContinents':'showRegions');
  if(!visible)return;
  const layer=group(scope+'-review-boundaries');
  const owners=scope==='continent'?boundaryCatalog.macros:boundaryCatalog.namedRegions;
  const color=scope==='continent'?'#ffbd7a':'#81e5c4',width=scope==='continent'?3.8:2.2;
  for(const owner of owners) {
    for(const part of boundaryParts(boundaryCatalog,state.boundary,scope,owner.id)) {
      if(part.points.length<3)continue;
      const active=selection?.kind==='boundary'&&selection.id===part.id&&selection.scope===scope;
      const path=addSvg('path',{d:polygonPath(part.points),
        fill:active?'#fff3c2':color,'fill-opacity':part.excluded?.015:active?.17:.025,
        stroke:part.excluded?'#8799a3':color,'stroke-width':active?8:width,
        'stroke-opacity':part.excluded?.45:.9,'stroke-dasharray':part.excluded?'10 8':null,
        class:'clickable boundary-shape'+(part.excluded?' excluded':''),
        'data-kind':'boundary','data-scope':scope,'data-id':part.id},layer);
      addSvg('title',{},path,owner.name+' · '+part.name+(part.excluded?' · excluded draft':''));
    }
  }
}
function drawSuspectSquares() {
  if(!checked('showSuspectSquares'))return;
  const layer=group('square-buffer-candidates');
  for(const part of boundaryCatalog.suspected){
    const ownerType=boundaryCatalog.byRegion.get(part.ownerId)?.regionType;
    const scope=ownerType==='island_system'||ownerType==='continent'?'continent':'region';
    const entry=boundaryPart(boundaryCatalog,state.boundary,scope,part.id);
    if(!entry || entry.excluded)continue;
    const rect=addSvg('path',{d:polygonPath(entry.points),fill:'#ef875c','fill-opacity':.45,
      stroke:'#ffe0a4','stroke-width':2.5,'stroke-dasharray':'4 3',class:'clickable square-candidate',
      'data-kind':'boundary','data-scope':scope,'data-id':part.id},layer);
    addSvg('title',{},rect,'8×8 square candidate, not confirmed artifact · '+part.name);
  }
}
function drawBoundaryHandles() {
  if(!checked('editBoundary'))return;
  const layer=group('boundary-edit-handles'),part=activeBoundary();
  if(part && !part.excluded) {
    const source=boundaryCatalog.parts.get(part.id);
    if(checked('showOriginalBoundary')&&source) {
      addSvg('path',{d:polygonPath(source.points),fill:'none',stroke:'#ffffff','stroke-opacity':.6,
        'stroke-width':2,'stroke-dasharray':'6 7'},layer);
    }
    if($('boundaryTool').value==='vertex') {
      if(view.scale >= .55) part.points.forEach((point,index)=>{
        addSvg('circle',{cx:point.x,cy:point.y,r:5.5,fill:'#ffffff',stroke:'#182637','stroke-width':2,
          class:'clickable boundary-handle','data-kind':'boundary-vertex',
          'data-scope':selection.scope,'data-id':part.id,'data-index':index},layer);
      });
    }else if($('boundaryTool').value==='translate') {
      addSvg('path',{d:polygonPath(part.points),fill:'#ffffff','fill-opacity':.06,
        stroke:'#fff4c6','stroke-width':4,'stroke-dasharray':'6 6',
        class:'clickable boundary-shape','data-kind':'boundary',
        'data-scope':selection.scope,'data-id':part.id},layer);
    }
  }
  if(drawingPoints.length) {
    addSvg('polyline',{points:pointsString(drawingPoints),fill:'none',stroke:'#fffc9e','stroke-width':4,
      'stroke-dasharray':'7 6'},layer);
    for(const [index,p] of drawingPoints.entries()) {
      addSvg('circle',{cx:p.x,cy:p.y,r:6,fill:'#fffc9e',stroke:'#152734','stroke-width':2},layer);
      addSvg('text',{x:p.x+10,y:p.y-8,fill:'#fff8ca','font-size':14},layer,''+(index+1));
    }
  }
}
function drawRegions() {
  if (!checked('showRegions')) return;
  const layer=group('region-footprints');
  for (const feature of sources.features?.records?.[0]?.regionFootprints || []) {
    if (!feature.points?.length) continue;
    addSvg('path',{d:polygonPath(feature.points),fill:'#b3d3be','fill-opacity':.07,stroke:'#e0e2ad','stroke-width':2,'stroke-opacity':.64,'vector-effect':'none',class:'clickable','data-kind':'region','data-id':feature.regionIds?.[0] || ''},layer)
      .append(addSvg('title',{},document.createDocumentFragment(), feature.name || 'Region footprint'));
  }
}
function drawLinearFeatures() {
  if (!checked('showRivers')) return;
  const layer=group('terrain-linework');
  const f=sources.features?.records?.[0];
  for (const [items,color,width] of [[f?.riverFeatures,'#8fddf8',5],[f?.mountainFeatures,'#f8e6ae',5]]) {
    for (const item of items || []) {
      if (!item.points?.length) continue;
      const line=addSvg('polyline',{points:pointsString(item.points),fill:'none',stroke:color,'stroke-width':width,opacity:.88,
        class:'clickable','data-kind':'feature','data-id':item.id},layer);
      addSvg('title',{},line,item.name);
    }
  }
}
function drawPoints() {
  if (!checked('showPoints')) return;
  const layer=group('named-physical-anchors');
  const f=sources.features?.records?.[0];
  for (const item of [...(f?.passFeatures||[]),...(f?.crossingFeatures||[])]) {
    if (!within(item.point)) continue;
    addSvg('circle',{cx:item.point.x,cy:item.point.y,r:8,fill:'#e8d59e',stroke:'#12232c','stroke-width':3,class:'clickable','data-kind':'feature','data-id':item.id},layer);
    addLabel(layer,item.point,item.name,'locality-label');
  }
}
function drawCoarseHexEdges() {
  if(!checked('showHexEdges')) return;
  const layer=group('coarse-hex-links');
  const centers=new Map(hexes.map(h=>[h.id,centroid((h.anchoredSettlementIds||[]).map(id=>position(settlementById.get(id))).filter(Boolean))]));
  for(const edge of edges) {
    const a=centers.get(edge.fromHexId),b=centers.get(edge.toHexId);
    if(!a||!b) continue;
    const line=addSvg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#d4f4d7','stroke-opacity':.55,'stroke-width':3,'stroke-dasharray':'4 11'},layer);
    addSvg('title',{},line,edge.corridorName+' — '+edge.edgeType+' (centroid-derived; NOT a literal path)');
  }
}
function drawTradeRelationships() {
  if (!checked('showFlows')) return;
  const layer=group('trade-relationships');
  for (const s of settlements) for (const flow of s.domesticTradeFlows||[]) {
    const a=position(s), b=position(settlementById.get(flow.partnerSettlementId));
    if(!a||!b) continue;
    const line=addSvg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#edbdf0','stroke-width':1.6,'stroke-opacity':.35},layer);
    addSvg('title',{},line,s.name+' ↔ '+nameOf(flow.partnerSettlementId)+' (economy relationship only)');
  }
}
function routeColor(type) { return ({sea_lane:'#79e4ff',road:'#f1b66b',trail:'#e6dd80',river:'#76b6ed'})[type]||'#dfc6e5'; }
function selectedRoute() { return selection?.kind==='route' ? routesById.get(selection.id) : null; }
function drawRoutes() {
  if (!checked('showRoutes')) return;
  const layer=group('named-routes');
  for (const route of routes) {
    if($('routeFilter').value!=='all' && $('routeFilter').value!==route.routeType)continue;
    const p=routePoints(route);if(p.length<2)continue;
    const active=selection?.kind==='route' && selection.id===route.id;
    const line=addSvg('polyline',{points:pointsString(p),fill:'none',stroke:'#06151f','stroke-width':active?13:9,opacity:.83},layer);
    addSvg('title',{},line,route.name+' — unverified review geometry');
    const actual=addSvg('polyline',{points:pointsString(p),fill:'none',stroke:routeColor(route.routeType),'stroke-width':active?8:5,'stroke-dasharray':'15 10',
      opacity:active?1:.79,class:'clickable','data-kind':'route','data-id':route.id},layer);
    addSvg('title',{},actual,route.name+' | '+route.routeType+' | provisional chord / local checkpoints');
    if(active) {
      (state.waypoints[route.id]||[]).forEach((point,index)=>{
        addSvg('circle',{cx:point.x,cy:point.y,r:10,fill:'#fff4c9',stroke:'#09232c','stroke-width':3,
          class:'clickable drag-point','data-kind':'checkpoint','data-id':route.id,'data-index':index},layer);
        addSvg('text',{x:point.x+13,y:point.y+4,fill:'#ffffff','font-size':16},layer,'W'+(index+1));
      });
    }
  }
}
function drawSettlements() {
  if(!checked('showSettlements'))return;
  const layer=group('settlements');
  const labels=group('settlement-names');
  const activeId=selection?.kind==='settlement'?selection.id:null;
  for(const site of settlements) {
    const p=position(site); if(!within(p)) continue;
    const selected=site.id===activeId;
    const moved=Boolean(state.moved[site.id]);
    const underwater=/underwater|submerged|deep_sea/i.test([site.siteClass,site.settlementType,site.identityTags?.join(' ')].join(' '));
    addSvg('circle',{cx:p.x,cy:p.y,r:selected?11:7,fill:selected?'#fff5bf':underwater?'#8dc3ff':moved?'#ffb990':'#faf2d5',
      stroke:'#10202d','stroke-width':3,class:'clickable'+(checked('moveAnchors')?' drag-point':''),
      'data-kind':'settlement','data-id':site.id},layer);
    if(checked('showLabels')) addLabel(labels,p,site.name,'settlement-label');
  }
}
function drawRegionLabels() {
  if(!checked('showRegionLabels'))return;
  const layer=group('region-labels');
  for(const region of regions) {
    const linked=settlements.filter(s=>s.regionId===region.id || s.macroRegionId===region.id);
    const center=centroid(linked.map(s=>position(s)).filter(Boolean));
    if(center) {
      addSvg('circle',{cx:center.x,cy:center.y,r:5,fill:'#f0fcff',opacity:.5},layer);
      addLabel(layer,center,region.name+' ≈','region-label');
    }
  }
}
function drawLocalities() {
  if(!checked('showLocalities'))return;
  const layer=group('locality-centroids');
  for(const locality of localities) {
    const linked=settlements.filter(s=>s.regionLocalityId===locality.id || s.localityBandId===locality.id);
    const c=centroid(linked.map(s=>position(s)).filter(Boolean));
    if(!c)continue;
    addSvg('rect',{x:c.x-5,y:c.y-5,width:10,height:10,fill:'#bce7b2',
      transform:'rotate(45 '+c.x+' '+c.y+')',class:'clickable','data-kind':'locality','data-id':locality.id},layer);
    addLabel(layer,c,locality.name+' ≈','locality-label');
  }
}
function renderOverlay() {
  overlay.replaceChildren();
  drawSourceCoastlines();drawBoundaryScope('continent');drawBoundaryScope('region');
  drawGrid();drawCoarseHexEdges();drawTradeRelationships();drawLinearFeatures();drawRoutes();
  drawSuspectSquares();drawSettlements();drawRegionLabels();drawLocalities();drawPoints();
  drawBoundaryHandles();
}
function renderRoutesList() {
  const list=$('routeList');list.replaceChildren();
  for(const route of routes) {
    if($('routeFilter').value!=='all' && route.routeType!==$('routeFilter').value)continue;
    const btn=document.createElement('button');btn.className='route-item'+(selectedRoute()?.id===route.id?' active':'');
    btn.innerHTML='<strong>'+escapeHtml(route.name)+'</strong><span class="route-kind">'+escapeHtml(route.routeType.replaceAll('_',' '))+
      '</span><span>'+escapeHtml(nameOf(route.fromSettlementId))+' → '+escapeHtml(nameOf(route.toSettlementId))+'</span>';
    btn.onclick=()=>{select('route',route.id);focusRoute(route);};
    list.append(btn);
  }
}
function renderSearch() {
  const term=$('search').value.trim().toLowerCase(), box=$('searchResults');
  box.replaceChildren();
  if(!term)return;
  const options=[
    ...settlements.map(s=>({kind:'settlement',id:s.id,name:s.name,meta:'Settlement · '+nameOf(s.regionId)})),
    ...regions.map(r=>({kind:r.regionType==='ocean'?'region':'boundary-owner',
      scope:r.regionType==='continent'||r.regionType==='island_system'?'continent':'region',
      id:r.id,name:r.name,meta:r.regionType+' · '+(r.regionType==='ocean'?'no polygon':'boundary review')})),
    ...localities.map(l=>({kind:'locality',id:l.id,name:l.name,meta:'Locality · centroid inferred'}))
  ].filter(o=>o.name?.toLowerCase().includes(term)).slice(0,30);
  for(const o of options) {
    const btn=document.createElement('button');btn.className='result-item';
    btn.innerHTML='<strong>'+escapeHtml(o.name)+'</strong><span>'+escapeHtml(o.meta)+'</span>';
    btn.onclick=()=>{
      if(o.kind==='boundary-owner') {
        $('boundaryScope').value=o.scope;populateBoundaryOwners();$('boundaryOwner').value=o.id;
      }
      select(o.kind,o.id,o.scope||null);focusSelection();
    };
    box.append(btn);
  }
  if (!options.length) box.textContent='No matching authored identity.';
}
function selectionPoint() {
  if(!selection)return null;
  if(selection.kind==='settlement') return position(settlementById.get(selection.id));
  if(selection.kind==='feature') {
    const item=featureById.get(selection.id);
    return item?.point || centroid(item?.points||[]);
  }
  if(selection.kind==='region') return centroid(settlements.filter(s=>s.regionId===selection.id||s.macroRegionId===selection.id).map(position).filter(Boolean));
  if(selection.kind==='boundary')return centroid(activeBoundary()?.points||[]);
  if(selection.kind==='boundary-owner') {
    const parts=boundaryParts(boundaryCatalog,state.boundary,selection.scope,selection.id).filter(p=>!p.excluded);
    const pts=parts.flatMap(p=>p.points);
    if(!pts.length)return null;
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
    return {x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2};
  }
  if(selection.kind==='locality')return centroid(settlements.filter(s=>s.regionLocalityId===selection.id||s.localityBandId===selection.id).map(position).filter(Boolean));
  return null;
}
function focusSelection() {
  if(selection?.kind==='route') {const route=selectedRoute();if(route)focusRoute(route);}
  else {const p=selectionPoint();if(p)centerOn(p,Math.max(view.scale,.85));}
}
function selectionKey() {return selection ? selection.kind+':'+(selection.scope?selection.scope+':':'')+selection.id : '';}
function select(kind,id,scope=null) {
  selection=kind&&id?{kind,id,scope}:null;
  const review=state.reviews[selectionKey()]||{};
  $('reviewStatus').value=review.status||'unreviewed';
  $('reviewNotes').value=review.notes||'';
  $('reviewStatus').disabled=!selection;
  $('reviewNotes').disabled=!selection;
  if(selection?.kind!=='route')$('addCheckpoint').checked=false;
  $('selectionSummary').textContent=selection ?
    (kind==='boundary'?boundaryPart(boundaryCatalog,state.boundary,scope,id)?.name||id:
      kind==='boundary-owner'?nameOf(id):nameOf(id)) : 'None';
  renderInspector();renderBoundaryPartList();renderRoutesList();renderOverlay();
}
function renderInspector() {
  const c=$('inspectorContents');
  if(!selection){c.innerHTML='<p>Select an authored marker, route, locality or region to compare its original identity and review-only draft placement.</p>';return;}
  const {kind,id}=selection;
  if(kind==='settlement'){
    const s=settlementById.get(id);if(!s)return;
    const p=originalPosition(s),draft=position(s);
    c.innerHTML='<h3>'+escapeHtml(s.name)+'</h3><p>'+escapeHtml(s.summary||s.siteContext||'')+'</p>'+
      '<dl>'+box('Source ID',s.id)+box('Original',p?fmt(p.x)+', '+fmt(p.y):'No pixel point')+
      box('Review pixel',draft?fmt(draft.x)+', '+fmt(draft.y):'Unplaced')+
      box('Macro region',nameOf(s.macroRegionId))+box('Subregion',nameOf(s.regionId))+
      box('Locality',nameOf(s.regionLocalityId||s.localityBandId))+
      box('World hex',s.worldHexId||s.hexId||'not listed')+
      box('Population',s.populationTotal||'unknown')+
      box('Site type',s.settlementType||s.siteClass||s.type||'not listed')+
      box('Parent',nameOf(s.parentSettlementId)||'none')+'</dl>'+
      (state.moved[id]?'<p class="warning">Marker changed for visual review only. Source coordinates are untouched.</p>':'');
  } else if(kind==='route'){
    const r=routesById.get(id);if(!r)return;
    const pts=state.waypoints[id]||[];
    c.innerHTML='<h3>'+escapeHtml(r.name)+'</h3><p class="warning">These drawn segments are unverified. A named route and distance do not establish shoreline clearance, bridges, transfers or playable access.</p>'+
      '<dl>'+box('Source ID',r.id)+box('Route mode',r.routeType)+
      box('From',nameOf(r.fromSettlementId))+box('To',nameOf(r.toSettlementId))+
      box('Authored length',fmt(r.distanceMiles)+' miles')+
      box('Hex edges',(r.edgeIds||[]).join(', ')||'none')+
      box('Allowed modes',(r.availableModeIds||[]).join(', '))+
      box('Draft points',pts.length)+'</dl>'+
      '<div class="route-pts"><strong>Route editing</strong><p>Enable “Click map to insert checkpoint”, click near the desired segment, then drag its yellow waypoint. Click any route or its list entry to select it. Checkpoint order follows the nearest currently drawn segment.</p>'+
      (pts.length?'<ol>'+pts.map(p=>'<li>'+fmt(p.x)+', '+fmt(p.y)+'</li>').join('')+'</ol>':'<p>No authored waypoints; displaying a straight endpoint chord.</p>')+'</div>';
  } else if(kind==='boundary'){
    const p=boundaryPart(boundaryCatalog,state.boundary,selection.scope,id);if(!p)return;
    const ownerId=p.custom?p.ownerId:(selection.scope==='continent'?p.macroId:p.ownerId);
    const original=boundaryCatalog.parts.get(id);
    const square=p.squareCandidate?'8×8 source square candidate: visually inspect against independent landmask. Do not assume it represents real land.':'No automatic artifact classification for this part.';
    c.innerHTML='<h3>'+escapeHtml(p.name)+'</h3>'+
      '<p class="warning">Review geometry only. Excluding a part changes this overlay, not the authoritative coastline, landmask, settlement records or gameplay.</p>'+
      '<dl>'+box('Layer',selection.scope)+box('Source ID',p.id)+box('Owner',nameOf(ownerId))+
      box('Source vertices',original?.points.length??'new draft')+
      box('Draft vertices',p.points.length)+box('Excluded in draft',p.excluded?'Yes':'No')+
      box('Classification',p.squareCandidate?'Exact 8×8 square candidate':'Not a square candidate')+
      box('Geometry',p.custom?'New review polygon':p.edited?'Modified preview':'Unmodified source')+'</dl>'+
      '<p>'+escapeHtml(square)+'</p><div class="boundary-edit-hint">'+
      'Select this part in the sidebar, enable boundary editing, then drag vertices at closer zoom; Shift-click its boundary to add a vertex. Alt-click a vertex to remove it. Use Move whole polygon for translation. The original is retained for comparison.</div>';
  } else if(kind==='boundary-owner'){
    const owner=boundaryCatalog.byRegion.get(id);if(!owner)return;
    const parts=boundaryParts(boundaryCatalog,state.boundary,selection.scope,id);
    c.innerHTML='<h3>'+escapeHtml(owner.name)+'</h3><dl>'+
      box('Identity',owner.id)+box('Source type',owner.regionType)+
      box('Source-part count',parts.filter(p=>p.source).length)+
      box('Added draft parts',parts.filter(p=>p.custom).length)+
      box('Excluded draft parts',parts.filter(p=>p.excluded).length)+
      box('8×8 candidates',parts.filter(p=>p.squareCandidate).length)+'</dl><p>'+
      escapeHtml(owner.summary||'')+'</p>'+
      '<p class="warning">'+(parts.length?
      'This layer is a collection of individual footprint parts. It is not a solid bounding-box territory.':
      'No independent source footprint exists here. Any new polygon is an unverified proposed review shape.')+'</p>';
  } else if(kind==='feature'){
    const f=featureById.get(id);if(!f)return;
    c.innerHTML='<h3>'+escapeHtml(f.name)+'</h3><dl>'+box('Source ID',f.id)+box('Region links',(f.regionIds||[]).map(nameOf).join(', '))+
      box('Pixel geometry',f.point?'Point: '+f.point.x+', '+f.point.y:'Polyline: '+(f.points?.length||0)+' vertices')+
      box('Authority','Cartographic reference feature')+'</dl><p>'+escapeHtml(f.notes||'')+'</p>';
  } else if(kind==='region'){
    const r=regionById.get(id);if(!r)return;
    c.innerHTML='<h3>'+escapeHtml(r.name)+'</h3><dl>'+box('Source ID',r.id)+box('Region kind',r.regionType)+box('Label center','Inferred from settlement anchors; not an authored point')+'</dl><p>'+escapeHtml(r.summary||'')+'</p>';
  } else if(kind==='locality'){
    const l=localities.find(x=>x.id===id);if(!l)return;
    c.innerHTML='<h3>'+escapeHtml(l.name)+'</h3><dl>'+box('Source ID',l.id)+box('Subregion',nameOf(l.regionId))+
      box('Locality kind',l.localityType)+box('Location','Centroid inferred from member settlement anchors')+'</dl><p>'+escapeHtml(l.summary||'')+'</p>';
  }
}
function nearestSegmentIndex(points,point) {
  let best=Infinity,index=0;
  for(let i=0;i<points.length-1;i++) {
    const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y;
    const t=clamp(((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);
    const d=near(point,{x:a.x+t*dx,y:a.y+t*dy});
    if(d<best){best=d;index=i;}
  }
  return index;
}
function insertCheckpoint(route,point) {
  if(!within(point))return;
  const rounded={x:Math.round(point.x),y:Math.round(point.y)};
  const index=nearestSegmentIndex(routePoints(route),rounded);
  if(!state.waypoints[route.id])state.waypoints[route.id]=[];
  state.waypoints[route.id].splice(index,0,rounded);
  save();select('route',route.id);
}
function renderAll() {renderOverlay();renderBoundaryPartList();renderRoutesList();renderSearch();renderInspector();}
function registerRasterImage() {
  const width=atlas.naturalWidth,height=atlas.naturalHeight;
  const legacy=sources.map.records[0]?.assetReferenceRectPx;
  atlas.style.width=FRAME.width+'px';
  atlas.style.height=FRAME.height+'px';
  atlas.style.left='0px';
  atlas.style.top='0px';
  if(width===FRAME.width && height===FRAME.height) {
    $('loadStatus').textContent=settlements.length+' points · '+routes.length+' routes · native-frame image';
    return;
  }
  if(legacy && width>=legacy.x+legacy.width && height>=legacy.y+legacy.height &&
     legacy.width>0 && legacy.height>0) {
    // Explicitly conditional: never crop a normalized 2048×1152 raster twice.
    const sx=FRAME.width/legacy.width,sy=FRAME.height/legacy.height;
    atlas.style.width=(width*sx)+'px';
    atlas.style.height=(height*sy)+'px';
    atlas.style.left=(-legacy.x*sx)+'px';
    atlas.style.top=(-legacy.y*sy)+'px';
    $('loadStatus').textContent='SOURCE-RECT PREVIEW: verify crop and coastline visually';
    $('layerBadge').textContent+=' / SOURCE-RECT PROVISIONAL';
    return;
  }
  $('loadStatus').textContent='RASTER DIMENSION HOLD '+width+'×'+height;
  $('layerBadge').textContent+=' / REGISTRATION UNRESOLVED';
}
function switchBase() {
  const height=$('baseLayer').value==='height';
  atlas.onload=registerRasterImage;
  atlas.onerror=()=>$('loadStatus').textContent='Raster image failed to load';
  atlas.alt='Original First World '+(height?'elevation':'biome')+' raster';
  $('layerBadge').textContent=(height?'ELEVATION':'BIOME')+' / ORIGINAL';
  atlas.src=height?heightUrl:biomeUrl;
}
function loadDraft() {
  try {const raw=JSON.parse(localStorage.getItem(KEY)||'{}');Object.assign(state,sanitizeDraft(raw));}
  catch {Object.assign(state,{moved:{},waypoints:{},reviews:{},boundary:newBoundaryDraft()});}
  updateDraftSummary();
}
function writeNotes() {
  if(!selection)return;
  state.reviews[selectionKey()]={status:$('reviewStatus').value,notes:$('reviewNotes').value};
  save();
}
function exportDraft() {
  const payload={schemaVersion:2,source:'Lineage_Reforged First World map reference 2048x1152',createdAt:new Date().toISOString(),
    caveat:'Review overlays only: NOT authoritative landmask, continent/subregion boundaries, settlements, routes or Save data.',
    movedSettlementPixels:state.moved,routeWaypoints:state.waypoints,reviews:state.reviews,
    boundary:state.boundary,moved:state.moved,waypoints:state.waypoints};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='first-world-map-review-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importDraft(event) {
  const file=event.target.files?.[0];if(!file)return;
  try {
    if(file.size>2_000_000)throw new Error('Review file is too large');
    const data=JSON.parse(await file.text());
    if(![1,2].includes(data.schemaVersion) && ![1,2].includes(data.version))
      throw new Error('Unsupported review schema version');
    if(!confirm('Replace this browser’s review-only markers, waypoints and notes with the imported draft?'))return;
    replaceDraft({moved:data.moved||data.movedSettlementPixels,
      waypoints:data.waypoints||data.routeWaypoints,reviews:data.reviews,boundary:data.boundary});
  }catch(err){alert('Import rejected: '+err.message);}finally{event.target.value='';}
}
function resetSelected() {
  if(!selection)return;
  if(selection.kind==='settlement')delete state.moved[selection.id];
  if(selection.kind==='route')delete state.waypoints[selection.id];
  if(selection.kind==='boundary'){
    resetBoundary(boundaryCatalog,state.boundary,selection.scope,selection.id);
    save();select('boundary-owner',boundaryOwner(),boundaryScope());return;
  }
  if(selection.kind==='settlement'||selection.kind==='route'){save();select(selection.kind,selection.id);}
}
function resetAll() {
  if(!confirm('Clear every local coordinate override, route checkpoint and review note? Source data will not change.'))return;
  drawingPoints=[];
  Object.assign(state,{moved:{},waypoints:{},reviews:{},boundary:newBoundaryDraft()});
  save();select(null,null);
}
function annotateUnplaced() {
  const semantic=sources.semantic?.records||[];
  const matched=new Set([...featureById.keys()]);
  const noGeometry=semantic.filter(x=>!(x.visualReferences||[]).some(ref=>matched.has(ref.visualFeatureId)));
  $('unplaced').innerHTML='<strong>'+noGeometry.length+' planned features without linked drawn geometry</strong>'+
    '<p>'+noGeometry.map(x=>escapeHtml(x.name)+' ('+escapeHtml(x.id)+')').join('; ')+'</p>'+
    '<p>These remain list-only. No coordinates have been guessed.</p>';
}
function events() {
  $('baseLayer').onchange=switchBase;
  $('fit').onclick=fitAtlas;
  $('zoomIn').onclick=()=>zoom(1.25);
  $('zoomOut').onclick=()=>zoom(.8);
  $('exportReview').onclick=exportDraft;
  $('importReview').onchange=importDraft;
  $('resetSelected').onclick=resetSelected;
  $('resetAll').onclick=resetAll;
  $('boundaryScope').onchange=()=>{
    drawingPoints=[];populateBoundaryOwners();
    if(boundaryScope()==='continent')$('showContinents').checked=true;
    else $('showRegions').checked=true;
    select('boundary-owner',boundaryOwner(),boundaryScope());
  };
  $('boundaryOwner').onchange=()=>{
    drawingPoints=[];select('boundary-owner',boundaryOwner(),boundaryScope());
  };
  $('editBoundary').onchange=()=>{
    if(!checked('editBoundary'))drawingPoints=[];
    else if(boundaryScope()==='continent')$('showContinents').checked=true;
    else $('showRegions').checked=true;
    renderBoundaryPartList();renderOverlay();
  };
  $('boundaryTool').onchange=()=>{drawingPoints=[];renderBoundaryPartList();renderOverlay();};
  $('finishBoundary').onclick=()=>{
    if(!checked('editBoundary')||$('boundaryTool').value!=='draw'||drawingPoints.length<3)return;
    const id=addCustomBoundary(boundaryCatalog,state.boundary,boundaryScope(),boundaryOwner(),drawingPoints);
    if(!id){alert('Cannot create this polygon. Check its owner and three or more in-frame vertices.');return;}
    drawingPoints=[];save();selectBoundaryPart(boundaryScope(),id);
  };
  $('cancelBoundary').onclick=()=>{drawingPoints=[];renderBoundaryPartList();renderOverlay();};
  $('toggleBoundaryPart').onclick=()=>{
    const part=activeBoundary();if(!part)return;
    excludeBoundary(boundaryCatalog,state.boundary,selection.scope,selection.id,!part.excluded);
    save();renderAll();
  };
  $('resetBoundaryPart').onclick=()=>{
    const part=activeBoundary();if(!part)return;
    resetBoundary(boundaryCatalog,state.boundary,selection.scope,selection.id);
    save();select('boundary-owner',boundaryOwner(),boundaryScope());
  };
  $('routeFilter').onchange=()=>{renderRoutesList();renderOverlay();};
  $('search').oninput=renderSearch;
  $('reviewStatus').onchange=writeNotes;
  $('reviewNotes').oninput=writeNotes;
  for(const id of checks)$(id).onchange=renderOverlay;
  viewport.addEventListener('wheel',(e)=>{
    e.preventDefault();const bounds=viewport.getBoundingClientRect();
    zoom(e.deltaY<0?1.14:1/1.14,e.clientX-bounds.left,e.clientY-bounds.top);
  },{passive:false});
  viewport.addEventListener('pointerdown',(e)=>{
    if(e.button!==0 && e.pointerType==='mouse')return;
    const target=e.target.closest?.('[data-kind]');
    const point=worldPoint(e);
    const edit=checked('editBoundary'),editTool=$('boundaryTool').value;
    if(edit&&editTool==='draw'&&within(point)){
      drawingPoints.push({x:Math.round(point.x),y:Math.round(point.y)});
      renderBoundaryPartList();renderOverlay();return;
    }
    if(checked('addCheckpoint') && selectedRoute() && within(point)) {
      insertCheckpoint(selectedRoute(),point);return;
    }
    const kind=target?.getAttribute('data-kind'),id=target?.getAttribute('data-id');
    if(kind==='boundary-vertex'&&id&&edit&&editTool==='vertex'){
      const scope=target.getAttribute('data-scope'),index=Number(target.getAttribute('data-index'));
      selectBoundaryPart(scope,id);
      const part=activeBoundary();
      if(e.altKey&&part?.points?.length>3){
        const pts=copyPoints(part.points);pts.splice(index,1);
        setBoundaryPoints(boundaryCatalog,state.boundary,scope,id,pts);
        save();renderAll();return;
      }
      if(part&&!part.excluded)pointerAction={type:'boundary-vertex',scope,id,index};
    }else if(kind==='boundary'&&id){
      const scope=target.getAttribute('data-scope');
      selectBoundaryPart(scope,id);
      const part=activeBoundary();
      if(edit&&part&&!part.excluded&&within(point)){
        if(editTool==='vertex'&&e.shiftKey){
          const pts=copyPoints(part.points);
          if(pts.length<2000){
            const index=segmentIndex(pts,point,true);
            pts.splice(index+1,0,{x:Math.round(point.x),y:Math.round(point.y)});
            setBoundaryPoints(boundaryCatalog,state.boundary,scope,id,pts);
            save();renderAll();
          }
          return;
        }
        if(editTool==='translate')pointerAction={type:'boundary-translate',scope,id,
          start:point,sourcePoints:copyPoints(part.points)};
      }
    }else if(kind==='checkpoint' && id){
      select('route',id);
      pointerAction={type:'checkpoint',id,index:Number(target.getAttribute('data-index'))};
    }else if(kind==='settlement' && id){
      select('settlement',id);
      if(checked('moveAnchors'))pointerAction={type:'settlement',id};
    }else if(kind==='route'||kind==='feature'||kind==='region'||kind==='locality') {
      if(id)select(kind,id);
    }else {
      pointerAction={type:'pan',x:e.clientX,y:e.clientY,tx:view.tx,ty:view.ty};
      viewport.classList.add('panning');
    }
    if(pointerAction){viewport.setPointerCapture(e.pointerId);e.preventDefault();}
  });
  viewport.addEventListener('pointermove',(e)=>{
    const p=worldPoint(e);
    $('cursor').textContent=within(p)
      ? 'x='+Math.floor(p.x)+' y='+Math.floor(p.y)+'  ·  '+(p.x/FRAME.width*100).toFixed(2)+'% E, '+(p.y/FRAME.height*100).toFixed(2)+'% S  ·  '+fmt(Math.floor(p.x)*9.765625)+' km E'
      : 'outside 2048 × 1152 source';
    if(!pointerAction)return;
    if(pointerAction.type==='pan'){
      view.tx=pointerAction.tx+e.clientX-pointerAction.x;
      view.ty=pointerAction.ty+e.clientY-pointerAction.y;setTransform();
    }else if(within(p)) {
      const rounded={x:Math.round(clamp(p.x,0,FRAME.width-1)),y:Math.round(clamp(p.y,0,FRAME.height-1))};
      if(pointerAction.type==='settlement')state.moved[pointerAction.id]=rounded;
      if(pointerAction.type==='checkpoint' && state.waypoints[pointerAction.id]?.[pointerAction.index])
        state.waypoints[pointerAction.id][pointerAction.index]=rounded;
      if(pointerAction.type==='boundary-vertex'){
        const part=boundaryPart(boundaryCatalog,state.boundary,pointerAction.scope,pointerAction.id);
        if(part?.points[pointerAction.index]){
          const pts=copyPoints(part.points);
          pts[pointerAction.index]=rounded;
          setBoundaryPoints(boundaryCatalog,state.boundary,pointerAction.scope,pointerAction.id,pts);
        }
      }
      if(pointerAction.type==='boundary-translate'){
        const pts=pointerAction.sourcePoints;
        const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
        const dx=clamp(Math.round(p.x-pointerAction.start.x),
          -Math.min(...xs),2047-Math.max(...xs));
        const dy=clamp(Math.round(p.y-pointerAction.start.y),
          -Math.min(...ys),1151-Math.max(...ys));
        setBoundaryPoints(boundaryCatalog,state.boundary,pointerAction.scope,pointerAction.id,
          pts.map(p=>({x:p.x+dx,y:p.y+dy})));
      }
      renderOverlay();
      if(['settlement','boundary'].includes(selection?.kind))renderInspector();
    }
  });
  const endPointer=()=>{
    if(!pointerAction)return;
    if(pointerAction.type!=='pan'){save();renderInspector();renderBoundaryPartList();}
    pointerAction=null;viewport.classList.remove('panning');
  };
  viewport.addEventListener('pointerup',endPointer);
  viewport.addEventListener('pointercancel',endPointer);
  viewport.addEventListener('pointerleave',()=>{if(!pointerAction)$('cursor').textContent='outside map';});
  viewport.addEventListener('keydown',(e)=>{
    if(e.target!==viewport)return;
    if(e.key.toLowerCase()==='f'){fitAtlas();e.preventDefault();}
    if(e.key==='+'||e.key==='='){zoom(1.25);e.preventDefault();}
    if(e.key==='-'){zoom(.8);e.preventDefault();}
  });
  window.addEventListener('resize',()=>{if(!pointerAction)fitAtlas();});
}
async function boot() {
  try {
    const paths=[
      [mapUrl,'map'],[settlementsUrl,'settlements'],[regionsUrl,'regions'],
      [localitiesUrl,'localities'],[hexUrl,'hexes'],[hexEdgesUrl,'edges'],
      [routesUrl,'travel'],[featuresUrl,'features'],[semanticUrl,'semantic']
    ];
    await Promise.all(paths.map(([url,name])=>loadJson(url,name)));
    settlements=sources.settlements.records;regions=sources.regions.records;localities=sources.localities.records;
    hexes=sources.hexes.records;edges=sources.edges.records;
    routes=[...(sources.travel.records[0]?.routeRecords||[]),...(sources.travel.records[0]?.interPortShipRoutes||[])];
    settlementById=new Map(settlements.map(s=>[s.id,s]));
    regionById=new Map(regions.map(r=>[r.id,r]));
    routesById=new Map(routes.map(r=>[r.id,r]));
    const visual=sources.features.records[0]||{};
    boundaryCatalog=buildBoundaryCatalog(regions,visual.regionFootprints||[]);
    populateBoundaryOwners();
    $('squareCount').textContent=boundaryCatalog.suspected.length+' candidates';
    featureById=new Map(['riverFeatures','mountainFeatures','passFeatures','crossingFeatures'].flatMap(k=>visual[k]||[]).map(f=>[f.id,f]));
    const width=sources.map.records[0]?.scaleProfile?.referenceImageWidthPx;
    const height=sources.map.records[0]?.scaleProfile?.referenceImageHeightPx;
    if(width!==FRAME.width||height!==FRAME.height)throw new Error('Source map reference frame changed: '+width+'×'+height);
    $('countSettlements').textContent=settlements.length;
    $('countRoutes').textContent=routes.length;
    $('loadStatus').textContent=settlements.length+' points · '+routes.length+' routes';
    loadDraft();events();renderAll();annotateUnplaced();switchBase();fitAtlas();
    $('busy').classList.add('hidden');
  }catch(err){
    $('busy').textContent='Unable to load canonical map evidence: '+err.message+'. Serve from the repository’s Vite app, not file://.';
    $('loadStatus').textContent='SOURCE LOAD FAILED';
    console.error(err);
  }
}
boot();
