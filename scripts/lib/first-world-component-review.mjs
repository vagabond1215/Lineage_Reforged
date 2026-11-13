/**
 * Independent per-4-neighbor-landmass ownership sampling.
 *
 * Region outlines are evidence of current labels, not political authority.
 * The selected-component accounting uses native raster cell centers. No
 * coastline-majority reassignment, invented child boundary, or write path.
 */
export function visitRasterPolygon(points, width, height, callback) {
  if (!Array.isArray(points) || points.length < 3 ||
      points.some(p => !Number.isFinite(p?.x) || !Number.isFinite(p?.y)))
    throw Error('Invalid source polygon vertices');
  const minY = Math.max(0, Math.floor(Math.min(...points.map(p => p.y)) - 0.5));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...points.map(p => p.y)) - 0.5));
  for (let y = minY; y <= maxY; y++) {
    const scanY = y + 0.5, xs = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i], b = points[j];
      if ((a.y > scanY) !== (b.y > scanY))
        xs.push(a.x + (scanY - a.y) * (b.x - a.x) / (b.y - a.y));
    }
    xs.sort((a,b) => a-b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const left = Math.max(0, Math.ceil(xs[i] - 0.5));
      const right = Math.min(width - 1, Math.ceil(xs[i+1] - 0.5)-1);
      for (let x = left; x <= right; x++) callback(y * width + x, x, y);
    }
  }
}

const popcount = num => {
  let n = num >>> 0, total = 0;
  while (n) {n &= n - 1; total++;}
  return total;
};

export function buildSelectedComponentReview({
  width, height, landMask, fourLabels, footprints, regions, selectedComponentIds,
}) {
  const n = width * height;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 ||
      landMask?.length !== n || fourLabels?.length !== n)
    throw Error('Component review requires same-size native land and 4-neighbor grids');
  if (!Array.isArray(footprints) || !Array.isArray(regions) ||
      !Array.isArray(selectedComponentIds))
    throw Error('Component review requires footprints, regions and selected IDs');
  const selected = [...new Set(selectedComponentIds)];
  if (!selected.length || selected.some(id => !Number.isInteger(id) || id <= 0))
    throw Error('Invalid selected four-neighbor component IDs');
  const wanted = new Set(selected);
  const regionById = new Map(regions.map(r => [r.id, r]));
  if (regionById.size !== regions.length) throw Error('Duplicate region identities');
  const macroIds = regions.filter(r =>
    r.regionType === 'continent' || r.regionType === 'island_system').map(r => r.id);
  const ownerRegionIds = [...new Set(footprints.map(p => p.regionIds?.[0]))].sort();
  if (macroIds.length > 16 || ownerRegionIds.length > 32)
    throw Error('Ownership bitset capacity exceeded');
  const macroCode = new Map(macroIds.map((id,i) => [id,1<<i]));
  const regionCode = new Map(ownerRegionIds.map((id,i) => [id,(1<<i)>>>0]));
  const macroGrid = new Uint16Array(n), childGrid = new Uint32Array(n);
  const areas = new Map(selected.map(id => [id, 0]));
  const partRows = new Map(selected.map(id => [id, []]));

  for (let i = 0; i < n; i++) {
    if (!landMask[i]) {
      if (fourLabels[i]) throw Error('Water pixel has an independent land component');
      continue;
    }
    const id = fourLabels[i];
    if (!id) throw Error('Raster land pixel missing four-neighbor component label');
    if (wanted.has(id)) areas.set(id, areas.get(id)+1);
  }

  for (const p of footprints) {
    const regionId = p.regionIds?.[0];
    const region = regionById.get(regionId);
    if (!region) throw Error('Unknown footprint region: ' + p.id);
    const macroId = region.regionType === 'subregion'
      ? region.parentRegionId : region.id;
    if (!macroCode.has(macroId) || !regionCode.has(regionId))
      throw Error('Unknown footprint macro: ' + p.id);
    const counts = new Map();
    visitRasterPolygon(p.points,width,height,i => {
      if (!landMask[i] || !wanted.has(fourLabels[i])) return;
      const id = fourLabels[i];
      counts.set(id,(counts.get(id)||0)+1);
      macroGrid[i] |= macroCode.get(macroId);
      childGrid[i] |= regionCode.get(regionId);
    });
    for (const [componentId,pixels] of counts)
      partRows.get(componentId).push({
        featureId:p.id,macroId,regionId,landPixelsOnComponent:pixels,
      });
  }

  return selected.map(componentId => {
    const rows = partRows.get(componentId).sort((a,b) =>
      b.landPixelsOnComponent-a.landPixelsOnComponent ||
      a.featureId.localeCompare(b.featureId));
    let covered = 0,unclaimed = 0,crossMacroOverlap = 0,
      sameMacroChildOverlap = 0,anyChildOverlap = 0;
    for (let i = 0; i < n; i++) {
      if (fourLabels[i] !== componentId || !landMask[i]) continue;
      const macroCount = popcount(macroGrid[i]);
      const childCount = popcount(childGrid[i]);
      if (childCount === 0) unclaimed++;
      else covered++;
      if (macroCount > 1) crossMacroOverlap++;
      if (childCount > 1) {
        anyChildOverlap++;
        if (macroCount === 1) sameMacroChildOverlap++;
      }
    }
    return {
      componentId,landPixels:areas.get(componentId),
      footprintCoveredLandPixels:covered,unclaimedLandPixels:unclaimed,
      directCrossMacroOverlapLandPixels:crossMacroOverlap,
      directSameMacroChildOverlapLandPixels:sameMacroChildOverlap,
      anyChildOverlapLandPixels:anyChildOverlap,
      featureRows:rows,
      ownerMacroIds:[...new Set(rows.map(r=>r.macroId))].sort(),
      ownerRegionIds:[...new Set(rows.map(r=>r.regionId))].sort(),
      status:'CURRENT_LABELS_ONLY_NO_PROPOSED_TRANSFER',
    };
  });
}
