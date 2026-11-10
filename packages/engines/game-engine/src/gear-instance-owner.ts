/** Physical ownership for new-format, individually tracked gear. Not a legacy-save converter. */
export const GEAR_OWNER_VERSION = 1;

export const GEAR_SLOT_IDS = [
  'slot.equipment.weapon.left', 'slot.equipment.weapon.right',
  'slot.equipment.armor.head', 'slot.equipment.armor.shoulder',
  'slot.equipment.armor.chest', 'slot.equipment.armor.arm',
  'slot.equipment.armor.hand', 'slot.equipment.armor.waist',
  'slot.equipment.armor.leg', 'slot.equipment.armor.foot',
  'slot.equipment.back',
  'slot.clothing.head', 'slot.clothing.shoulder', 'slot.clothing.chest',
  'slot.clothing.arm', 'slot.clothing.hand', 'slot.clothing.waist',
  'slot.clothing.leg', 'slot.clothing.foot', 'slot.clothing.back',
  'slot.accessory.ear.left', 'slot.accessory.ear.right',
  'slot.accessory.eye.left', 'slot.accessory.eye.right',
  'slot.accessory.neck', 'slot.accessory.arms',
  'slot.accessory.waist', 'slot.accessory.ankle',
  ...(['left', 'right'] as const).flatMap(side =>
    ([1, 2, 3, 4, 5] as const).map(number => `slot.accessory.ring.${side}.${number}` as const)
  )
] as const;

export type GearSlotId = (typeof GEAR_SLOT_IDS)[number];
export type GearLocation =
  | { kind: 'worn'; slotId: GearSlotId }
  | { kind: 'bag'; bagId: string }
  | { kind: 'overflow' };
export type GearItemInstance = {
  itemInstanceId: string;
  itemId: string;
  itemKey: string;
  durability: number;
  location: GearLocation;
};
export type GearOwner = {
  version: typeof GEAR_OWNER_VERSION;
  revision: number;
  instances: GearItemInstance[];
  receipts: { requestId: string; fingerprint: string }[];
};
export type GearFit = {
  itemId: string;
  itemKey: string;
  slots: readonly GearSlotId[];
};
export type GearBagCapacity = {
  bagId: string;
  slotCapacity: number;
  fungibleSlots: number;
};

/** A bulk fungible stack occupies one bag slot, regardless of its quantity. */
export function deriveGearBagCapacities(inventory: {
  bags: readonly { id: string; slotCapacity: number; stacks: readonly unknown[] }[];
}): GearBagCapacity[] {
  return inventory.bags.map(bag => ({
    bagId: bag.id,
    slotCapacity: bag.slotCapacity,
    fungibleSlots: bag.stacks.length
  }));
}
export type GearResult = {
  status: 'accepted' | 'duplicate' | 'noop' | 'stale' | 'invalid';
  state: GearOwner;
  reason?: string;
};
type Request = { requestId: string; expectedRevision: number };

const slots = new Set<string>(GEAR_SLOT_IDS);
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const nonblank = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && value.trim() === value;
const integer = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;

export function createGearOwner(): GearOwner {
  return { version: GEAR_OWNER_VERSION, revision: 0, instances: [], receipts: [] };
}

function findFit(itemId: string, itemKey: string, fits: readonly GearFit[]): GearFit | undefined {
  return fits.find(fit => fit.itemId === itemId && fit.itemKey === itemKey);
}

export function validateGearFits(fits: readonly GearFit[]): boolean {
  const ids = new Set<string>();
  return Array.isArray(fits) && fits.every(fit => {
    if (!record(fit) || !nonblank(fit.itemKey) || fit.itemId !== `item.${fit.itemKey}` ||
      ids.has(fit.itemId) || !Array.isArray(fit.slots) ||
      new Set(fit.slots).size !== fit.slots.length ||
      !fit.slots.every(slot => typeof slot === 'string' && slots.has(slot))) return false;
    ids.add(fit.itemId);
    return true;
  });
}

function validBagFacts(bags: readonly GearBagCapacity[]): boolean {
  const ids = new Set<string>();
  return bags.every(bag => {
    if (!nonblank(bag.bagId) || ids.has(bag.bagId) || !integer(bag.slotCapacity) ||
      !integer(bag.fungibleSlots) || bag.fungibleSlots > bag.slotCapacity) return false;
    ids.add(bag.bagId);
    return true;
  });
}

function validLocation(value: unknown, fit: GearFit, bagIds: Set<string>): value is GearLocation {
  if (!record(value)) return false;
  if (value.kind === 'overflow') return Object.keys(value).length === 1;
  if (value.kind === 'bag') return Object.keys(value).length === 2 &&
    nonblank(value.bagId) && bagIds.has(value.bagId);
  return value.kind === 'worn' && Object.keys(value).length === 2 &&
    typeof value.slotId === 'string' && slots.has(value.slotId) &&
    fit.slots.includes(value.slotId as GearSlotId);
}

export function validateGearOwner(
  value: unknown,
  fits: readonly GearFit[],
  bags: readonly GearBagCapacity[]
): { ok: boolean; reason?: string } {
  if (!validateGearFits(fits)) return { ok: false, reason: 'Invalid authored gear fit profiles.' };
  if (!validBagFacts(bags)) return { ok: false, reason: 'Invalid bag capacity facts.' };
  if (!record(value) || Object.keys(value).sort().join(',') !== 'instances,receipts,revision,version' ||
    value.version !== GEAR_OWNER_VERSION || !integer(value.revision) ||
    !Array.isArray(value.instances) || !Array.isArray(value.receipts)) {
    return { ok: false, reason: 'Incompatible or malformed gear owner.' };
  }
  const bagIds = new Set(bags.map(bag => bag.bagId));
  const instanceIds = new Set<string>();
  const wornSlots = new Set<string>();
  const bagCounts = new Map<string, number>();
  for (const raw of value.instances) {
    if (!record(raw) || Object.keys(raw).sort().join(',') !== 'durability,itemId,itemInstanceId,itemKey,location' ||
      !nonblank(raw.itemInstanceId) || instanceIds.has(raw.itemInstanceId) ||
      !nonblank(raw.itemId) || !nonblank(raw.itemKey) || typeof raw.durability !== 'number' ||
      !Number.isFinite(raw.durability) || raw.durability < 0 || raw.durability > 1) {
      return { ok: false, reason: 'Invalid item identity or condition.' };
    }
    const fit = findFit(raw.itemId, raw.itemKey, fits);
    if (!fit || !validLocation(raw.location, fit, bagIds)) {
      return { ok: false, reason: 'Unsupported item or physical location.' };
    }
    instanceIds.add(raw.itemInstanceId);
    if (raw.location.kind === 'worn') {
      if (wornSlots.has(raw.location.slotId)) return { ok: false, reason: 'Two items occupy one slot.' };
      wornSlots.add(raw.location.slotId);
    } else if (raw.location.kind === 'bag') {
      bagCounts.set(raw.location.bagId, (bagCounts.get(raw.location.bagId) ?? 0) + 1);
    }
  }
  for (const bag of bags) {
    if ((bagCounts.get(bag.bagId) ?? 0) + bag.fungibleSlots > bag.slotCapacity) {
      return { ok: false, reason: 'Bag capacity exceeded.' };
    }
  }
  const receipts = value.receipts;
  if (value.revision !== receipts.length || receipts.some(receipt => !record(receipt) ||
    Object.keys(receipt).sort().join(',') !== 'fingerprint,requestId' ||
    !nonblank(receipt.requestId) || !nonblank(receipt.fingerprint)) ||
    new Set(receipts.map(receipt => receipt.requestId)).size !== receipts.length) {
    return { ok: false, reason: 'Invalid mutation receipts.' };
  }
  return { ok: true };
}

export function readGearOwner(
  json: string,
  fits: readonly GearFit[],
  bags: readonly GearBagCapacity[]
): GearOwner {
  const value: unknown = JSON.parse(json);
  const result = validateGearOwner(value, fits, bags);
  if (!result.ok) throw new Error(`Incompatible equipment save format or invalid gear graph: ${result.reason}`);
  return value as GearOwner;
}

export function getWornGear(state: GearOwner): readonly GearItemInstance[] {
  return state.instances.filter(item => item.location.kind === 'worn');
}

function preflight(state: GearOwner, request: Request, fingerprint: string, fits: readonly GearFit[], bags: readonly GearBagCapacity[]): GearResult | null {
  const validity = validateGearOwner(state, fits, bags);
  if (!validity.ok) return { status: 'invalid', state, reason: validity.reason ?? 'Invalid gear owner.' };
  if (!nonblank(request.requestId) || !integer(request.expectedRevision)) {
    return { status: 'invalid', state, reason: 'Invalid request identity or revision.' };
  }
  const prior = state.receipts.find(receipt => receipt.requestId === request.requestId);
  if (prior) return prior.fingerprint === fingerprint ? { status: 'duplicate', state } :
    { status: 'invalid', state, reason: 'Request ID already belongs to a different gear action.' };
  if (state.revision !== request.expectedRevision) return { status: 'stale', state };
  return null;
}

function commit(state: GearOwner, instances: GearItemInstance[], requestId: string, fingerprint: string, fits: readonly GearFit[], bags: readonly GearBagCapacity[]): GearResult {
  const next: GearOwner = {
    version: GEAR_OWNER_VERSION,
    revision: state.revision + 1,
    instances,
    receipts: [...state.receipts, { requestId, fingerprint }]
  };
  const validity = validateGearOwner(next, fits, bags);
  return validity.ok ? { status: 'accepted', state: next } :
    { status: 'invalid', state, reason: validity.reason ?? 'Invalid gear owner.' };
}

export function grantGear(
  state: GearOwner,
  request: Request & Pick<GearItemInstance, 'itemId' | 'itemKey' | 'durability' | 'location'>,
  fits: readonly GearFit[],
  bags: readonly GearBagCapacity[]
): GearResult {
  const fingerprint = JSON.stringify(['grant', request.itemId, request.itemKey, request.durability,
    request.location.kind, request.location.kind === 'worn' ? request.location.slotId :
      request.location.kind === 'bag' ? request.location.bagId : null]);
  const blocked = preflight(state, request, fingerprint, fits, bags);
  if (blocked) return blocked;
  if (!findFit(request.itemId, request.itemKey, fits) ||
    typeof request.durability !== 'number' || !Number.isFinite(request.durability) ||
    request.durability < 0 || request.durability > 1) {
    return { status: 'invalid', state, reason: 'Unsupported item or condition.' };
  }
  let itemInstanceId: string;
  do { itemInstanceId = `gear.${globalThis.crypto.randomUUID()}`; }
  while (state.instances.some(item => item.itemInstanceId === itemInstanceId));
  return commit(state, [...state.instances, {
    itemInstanceId, itemId: request.itemId, itemKey: request.itemKey,
    durability: request.durability, location: request.location
  }], request.requestId, fingerprint, fits, bags);
}

function availableBag(instances: readonly GearItemInstance[], bags: readonly GearBagCapacity[]): GearLocation {
  for (const bag of bags) {
    const gearCount = instances.filter(item => item.location.kind === 'bag' && item.location.bagId === bag.bagId).length;
    if (gearCount + bag.fungibleSlots < bag.slotCapacity) return { kind: 'bag', bagId: bag.bagId };
  }
  return { kind: 'overflow' };
}

export function moveGear(
  state: GearOwner,
  request: Request & { itemInstanceId: string; destination: { kind: 'worn'; slotId: GearSlotId } | { kind: 'carried' } },
  fits: readonly GearFit[],
  bags: readonly GearBagCapacity[]
): GearResult {
  if (!record(request) || !nonblank(request.itemInstanceId) || !record(request.destination) ||
    !(request.destination.kind === 'carried' && Object.keys(request.destination).length === 1 ||
      request.destination.kind === 'worn' && Object.keys(request.destination).length === 2 &&
      typeof request.destination.slotId === 'string' && slots.has(request.destination.slotId))) {
    return { status: 'invalid', state, reason: 'Invalid gear move request.' };
  }
  const fingerprint = JSON.stringify(['move', request.itemInstanceId, request.destination.kind,
    request.destination.kind === 'worn' ? request.destination.slotId : null]);
  const blocked = preflight(state, request, fingerprint, fits, bags);
  if (blocked) return blocked;
  const source = state.instances.find(item => item.itemInstanceId === request.itemInstanceId);
  if (!source) return { status: 'invalid', state, reason: 'Item instance is no longer owned.' };
  if (request.destination.kind === 'carried' && source.location.kind !== 'worn') {
    return { status: 'noop', state };
  }
  if (request.destination.kind === 'worn') {
    const fit = findFit(source.itemId, source.itemKey, fits);
    if (!fit?.slots.includes(request.destination.slotId)) {
      return { status: 'invalid', state, reason: 'Item cannot occupy that authored position.' };
    }
    if (source.location.kind === 'worn' && source.location.slotId === request.destination.slotId) {
      return { status: 'noop', state };
    }
  }
  const instances = structuredClone(state.instances);
  const item = instances.find(entry => entry.itemInstanceId === request.itemInstanceId)!;
  if (request.destination.kind === 'carried') {
    item.location = availableBag(instances, bags);
  } else {
    const slotId = request.destination.slotId;
    const occupied = instances.find(entry => entry.location.kind === 'worn' && entry.location.slotId === slotId);
    const formerLocation = item.location;
    item.location = { kind: 'worn', slotId };
    if (occupied) {
      occupied.location = formerLocation.kind === 'bag' ? formerLocation : availableBag(instances, bags);
    }
  }
  return commit(state, instances, request.requestId, fingerprint, fits, bags);
}
