/**
 * Review-only, fail-closed territorial partitioning.
 *
 * Land is independent raster evidence. Only an explicitly approved spatial
 * mask may grant a macro owner. Child anchors never escape approved macro
 * ownership or their physical land component. No source mutation.
 */
export function planReviewedMacroOwnership({
  width, height, landMask, componentByCell, regions, decisions = [], anchors = [],
}) {
  const count = width * height;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1)
    throw Error('Invalid reference dimensions');
  if (landMask?.length !== count || componentByCell?.length !== count)
    throw Error('Independent land and four-neighbor component grids are required');
  if (!Array.isArray(regions) || !Array.isArray(decisions) || !Array.isArray(anchors))
    throw Error('Expected region, decision, and anchor arrays');
  const byId = new Map(regions.map(r => [r.id, r]));
  if (byId.size !== regions.length) throw Error('Duplicate region IDs');
  const macros = regions.filter(r => ['continent', 'island_system'].includes(r.regionType));
  const macroIndex = new Map(macros.map((r, i) => [r.id, i + 1]));
  if (macros.length < 1 || macros.length > 65534) throw Error('Invalid macro catalog');
  const owners = new Uint16Array(count);
  const conflicted = new Uint8Array(count);
  const provenance = new Map();
  let proposed = 0, approved = 0, foreignWaterCells = 0, overlappingCells = 0;
  for (const d of decisions) {
    if (!d || typeof d.id !== 'string' || !macroIndex.has(d.macroId))
      throw Error('Unknown macro in boundary decision');
    if (provenance.has(d.id)) throw Error('Duplicate boundary decision: ' + d.id);
    provenance.set(d.id, d);
    if (!['pending', 'approved', 'rejected'].includes(d.status))
      throw Error('Invalid decision status: ' + d.id);
    if (d.status !== 'approved') { proposed++; continue; }
    if (typeof d.approvalRef !== 'string' || !d.approvalRef.trim())
      throw Error('Approved boundary requires explicit reviewer evidence: ' + d.id);
    if (!(d.mask instanceof Uint8Array) || d.mask.length !== count)
      throw Error('Approved boundary needs a full-resolution spatial mask: ' + d.id);
    approved++;
    const code = macroIndex.get(d.macroId);
    for (let i = 0; i < count; i++) {
      if (!d.mask[i]) continue;
      if (!landMask[i]) { foreignWaterCells++; continue; }
      if (conflicted[i]) continue;
      if (owners[i] !== 0) {
        owners[i] = 0;
        conflicted[i] = 1;
        overlappingCells++;
      } else owners[i] = code;
    }
  }
  if (foreignWaterCells) throw Error('Approved macro mask includes ' + foreignWaterCells + ' water pixels');
  if (overlappingCells) throw Error('Approved macro masks overlap at ' + overlappingCells + ' land pixels');
  let unassignedMacroCells = 0, assignedMacroCells = 0, totalLandCells = 0;
  for (let i = 0; i < count; i++) {
    if (!landMask[i]) continue;
    totalLandCells++;
    if (owners[i]) assignedMacroCells++;
    else unassignedMacroCells++;
  }

  // Local anchors must be explicitly provided and scoped to a confirmed
  // four-neighbor physical land component. Never infer missing island owners.
  const childIds = [...new Set(anchors.map(a => a.regionId))].sort();
  const childCode = new Map(childIds.map((id, i) => [id, i + 1]));
  const anchorsByMacroComponent = new Map();
  for (const anchor of anchors) {
    const region = byId.get(anchor.regionId);
    if (!region) throw Error('Unknown child region anchor: ' + anchor.regionId);
    const parent = region.regionType === 'subregion' ? region.parentRegionId : region.id;
    if (parent !== anchor.macroId || !macroIndex.has(parent))
      throw Error('Cross-macro child anchor rejected: ' + anchor.regionId);
    if (!Number.isInteger(anchor.x) || !Number.isInteger(anchor.y) ||
        anchor.x < 0 || anchor.y < 0 || anchor.x >= width || anchor.y >= height)
      throw Error('Out-of-frame child anchor: ' + anchor.regionId);
    const i = anchor.y * width + anchor.x;
    if (!landMask[i] || owners[i] !== macroIndex.get(parent) || !componentByCell[i])
      throw Error('Unapproved/off-land child anchor: ' + anchor.regionId);
    const key = parent + ':' + componentByCell[i];
    if (!anchorsByMacroComponent.has(key)) anchorsByMacroComponent.set(key, []);
    anchorsByMacroComponent.get(key).push(anchor);
  }
  for (const list of anchorsByMacroComponent.values())
    list.sort((a, b) => a.regionId.localeCompare(b.regionId) || a.x - b.x || a.y - b.y);
  const children = new Uint16Array(count);
  let unassignedChildCells = 0;
  const missingAnchors = new Set();
  for (let i = 0; i < count; i++) {
    const ownerCode = owners[i];
    if (!ownerCode) continue;
    const macroId = macros[ownerCode - 1].id;
    const key = macroId + ':' + componentByCell[i];
    const local = anchorsByMacroComponent.get(key);
    if (!local?.length) {
      missingAnchors.add(key);
      unassignedChildCells++;
      continue;
    }
    const x = i % width, y = (i - x) / width;
    let winner = null, best = Infinity;
    for (const a of local) {
      const distance = (x - a.x) ** 2 + (y - a.y) ** 2;
      if (distance < best) { best = distance; winner = a; }
    }
    children[i] = childCode.get(winner.regionId);
  }
  const status = unassignedMacroCells || unassignedChildCells || proposed || !approved
    ? 'HELD_FOR_REVIEW' : 'PLAN_COMPLETE_REVIEW_ONLY';
  return {
    status, owners, children, macroIds: macros.map(r => r.id),
    childIds, totalLandCells, assignedMacroCells, unassignedMacroCells,
    unassignedChildCells, approvedDecisionCount: approved,
    pendingDecisionCount: proposed, missingAnchors: [...missingAnchors].sort(),
    sourceWritable: false,
  };
}

/** Scanline fill on reference pixel centers, not vector or ocean authority. */
export function rasterizePolygon(points, width, height) {
  if (!Array.isArray(points) || points.length < 3)
    throw Error('Spatial decision needs an explicit closed polygon');
  for (const p of points)
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y))
      throw Error('Nonfinite polygon coordinate');
  const out = new Uint8Array(width * height);
  const lo = Math.max(0, Math.floor(Math.min(...points.map(p => p.y)) - 0.5));
  const hi = Math.min(height - 1, Math.ceil(Math.max(...points.map(p => p.y)) - 0.5));
  for (let y = lo; y <= hi; y++) {
    const centerY = y + 0.5, crossings = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i], b = points[j];
      if ((a.y > centerY) !== (b.y > centerY))
        crossings.push(a.x + (centerY - a.y) * (b.x - a.x) / (b.y - a.y));
    }
    crossings.sort((a, b) => a - b);
    for (let i = 0; i + 1 < crossings.length; i += 2) {
      const start = Math.max(0, Math.ceil(crossings[i] - 0.5));
      const end = Math.min(width - 1, Math.ceil(crossings[i + 1] - 0.5) - 1);
      for (let x = start; x <= end; x++) out[y * width + x] = 1;
    }
  }
  return out;
}
