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

const $ = (id) => document.getElementById(id);
const FRAME = { width: 2048, height: 1152 };
const KEY = 'lineage-first-world-map-review-v1';
const SVG_NS = 'http://www.w3.org/2000/svg';
const sources = {};
const state = { moved: {}, waypoints: {}, reviews: {} };
const view = { scale: 1, tx: 0, ty: 0 };
let settlements = [], routes = [], hexes = [], edges = [], regions = [], localities = [];
let settlementById = new Map(), regionById = new Map(), routesById = new Map(), featureById = new Map();
let selection = null, pointerAction = null;
const checks = ['showSettlements','showLabels','showRoutes','showFlows','showHexEdges','showPoints','showRivers','showRegions','showRegionLabels','showLocalities','showGrid'];
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
    localStorage.setItem(KEY, JSON.stringify({version:1,moved:state.moved,waypoints:state.waypoints,reviews:state.reviews}));
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
        (kind === 'locality' && localities.some(x=>x.id===key))) {
      reviews[id] = {status:['unreviewed','candidate','conflict','checked'].includes(r?.status) ? r.status : 'unreviewed',notes:String(r?.notes || '').slice(0,10000)};
    }
  }
  return {moved,waypoints,reviews};
}
function replaceDraft(draft) {
  Object.assign(state, sanitizeDraft(draft));
  save(); renderAll(); select(selection?.kind || null, selection?.id || null);
}
function updateDraftSummary() {
  const count = Object.values(state.waypoints).filter((a) => a.length).length;
  $('draftSummary').textContent = Object.keys(state.moved).length + ' moved · ' + count + ' routes';
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
  setTransform();
}
function zoom(factor, screenX=viewport.clientWidth/2, screenY=viewport.clientHeight/2) {
  const next = clamp(view.scale * factor, 0.11, 8);
  const ratio = next / view.scale;
  view.tx = screenX - (screenX-view.tx)*ratio;
  view.ty = screenY - (screenY-view.ty)*ratio;
  view.scale = next; setTransform();
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
  drawRegions();drawGrid();drawCoarseHexEdges();drawTradeRelationships();drawLinearFeatures();
  drawRoutes();drawSettlements();drawRegionLabels();drawLocalities();drawPoints();
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
    ...regions.map(r=>({kind:'region',id:r.id,name:r.name,meta:'Region · approximate center'})),
    ...localities.map(l=>({kind:'locality',id:l.id,name:l.name,meta:'Locality · centroid inferred'}))
  ].filter(o=>o.name?.toLowerCase().includes(term)).slice(0,30);
  for(const o of options) {
    const btn=document.createElement('button');btn.className='result-item';
    btn.innerHTML='<strong>'+escapeHtml(o.name)+'</strong><span>'+escapeHtml(o.meta)+'</span>';
    btn.onclick=()=>{select(o.kind,o.id);focusSelection();};
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
  if(selection.kind==='locality')return centroid(settlements.filter(s=>s.regionLocalityId===selection.id||s.localityBandId===selection.id).map(position).filter(Boolean));
  return null;
}
function focusSelection() {
  if(selection?.kind==='route') {const route=selectedRoute();if(route)focusRoute(route);}
  else {const p=selectionPoint();if(p)centerOn(p,Math.max(view.scale,.85));}
}
function selectionKey() {return selection ? selection.kind+':'+selection.id : '';}
function select(kind,id) {
  selection=kind&&id?{kind,id}:null;
  const review=state.reviews[selectionKey()]||{};
  $('reviewStatus').value=review.status||'unreviewed';
  $('reviewNotes').value=review.notes||'';
  $('reviewStatus').disabled=!selection;
  $('reviewNotes').disabled=!selection;
  if(selection?.kind!=='route')$('addCheckpoint').checked=false;
  $('selectionSummary').textContent=selection ? (nameOf(id) || id) : 'None';
  renderInspector();renderRoutesList();renderOverlay();
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
function renderAll() {renderOverlay();renderRoutesList();renderSearch();renderInspector();}
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
  catch {Object.assign(state,{moved:{},waypoints:{},reviews:{}});}
  updateDraftSummary();
}
function writeNotes() {
  if(!selection)return;
  state.reviews[selectionKey()]={status:$('reviewStatus').value,notes:$('reviewNotes').value};
  save();
}
function exportDraft() {
  const payload={schemaVersion:1,source:'Lineage_Reforged First World map reference 2048x1152',createdAt:new Date().toISOString(),
    caveat:'Review overlays only: NOT authoritative settlement coordinates, runtime paths, travel modes or Save data.',
    movedSettlementPixels:state.moved,routeWaypoints:state.waypoints,reviews:state.reviews,
    moved:state.moved,waypoints:state.waypoints};
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
    if(data.schemaVersion!==1 && data.version!==1)throw new Error('Unsupported review schema version');
    if(!confirm('Replace this browser’s review-only markers, waypoints and notes with the imported draft?'))return;
    replaceDraft({moved:data.moved||data.movedSettlementPixels,waypoints:data.waypoints||data.routeWaypoints,reviews:data.reviews});
  }catch(err){alert('Import rejected: '+err.message);}finally{event.target.value='';}
}
function resetSelected() {
  if(!selection)return;
  if(selection.kind==='settlement')delete state.moved[selection.id];
  if(selection.kind==='route')delete state.waypoints[selection.id];
  if(selection.kind==='settlement'||selection.kind==='route'){save();select(selection.kind,selection.id);}
}
function resetAll() {
  if(!confirm('Clear every local coordinate override, route checkpoint and review note? Source data will not change.'))return;
  Object.assign(state,{moved:{},waypoints:{},reviews:{}});save();select(null,null);
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
    if(checked('addCheckpoint') && selectedRoute() && within(point)) {
      insertCheckpoint(selectedRoute(),point);return;
    }
    const kind=target?.getAttribute('data-kind'),id=target?.getAttribute('data-id');
    if(kind==='checkpoint' && id){
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
      renderOverlay();
      if(selection?.kind==='settlement')renderInspector();
    }
  });
  const endPointer=()=>{
    if(!pointerAction)return;
    if(pointerAction.type!=='pan'){save();renderInspector();}
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
