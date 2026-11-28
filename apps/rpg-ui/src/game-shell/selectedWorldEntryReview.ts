import type { PlayerAttributeKey } from '../../../../packages/shared/types/src/index.js';
import {
  getAgeBandAttributeAdjustments, getHeightBandAttributeAdjustments, getLineageBaseAttributes,
  getSexAttributeAdjustments, sumPlayerAttributes, type AgeBandId, type HeightBandId
} from './characterCreationCatalog.js';
import { entryAptitudes, entryBuilds, entryScenarios } from './selectedWorldEntryReviewCatalog.js';

export const creatorStages = ['Lineage', 'Identity', 'Continent', 'Region', 'Settlement', 'World Entry',
  'Summary', 'Opening'] as const;

export const attributeGroups = {
  Power: ['STR', 'CON', 'VIT'],
  Prowess: ['DEX', 'AGI', 'CHA'],
  Mind: ['INT', 'WIS', 'SPT']
} as const;

export type EntryBuild = typeof entryBuilds[number];
export type EntryAptitude = typeof entryAptitudes[number];
export type EntryScenario = typeof entryScenarios[number];
export type EntryIdentity = {
  lineageId: string;
  firstName: string;
  lastName: string;
  sex: 'male' | 'female';
  age: AgeBandId;
  height: HeightBandId;
  build: EntryBuild;
  aptitude: EntryAptitude;
  disposition: string;
};

export const defaultEntryIdentity: EntryIdentity = {
  lineageId: 'lineage.human', firstName: '', lastName: '', sex: 'male', age: 'prime', height: 'normal',
  build: entryBuilds[4], aptitude: entryAptitudes[3], disposition: ''
};

type Points = Partial<Record<PlayerAttributeKey, number>>;

// Use integer remainders so ties retain the pinned prototype's group key order.
function allocate(points: number, weights: Points): Points {
  const entries = Object.entries(weights) as [PlayerAttributeKey, number][];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const shares = entries.map(([key, weight]) => ({
    key, whole: Math.floor(points * weight / totalWeight), remainder: (points * weight) % totalWeight
  }));
  const remaining = points - shares.reduce((sum, share) => sum + share.whole, 0);
  shares.sort((a, b) => b.remainder - a.remainder);
  return Object.fromEntries(shares.map(({ key, whole }, index) => [key, whole + Number(index < remaining)]));
}

export function entryProfilePoints(build: EntryBuild, aptitude: EntryAptitude) {
  const power = Math.round(aptitude.physical * build.power);
  const prowess = aptitude.physical - power;
  const physical = { ...allocate(power, build.wPower), ...allocate(prowess, build.wProwess) };
  const mind = allocate(aptitude.mind, aptitude.mindWeights);
  return { physical, mind, power, prowess };
}

// The lineage resource offsets are illustrative values from the pinned presentation.
const resourceOffsets: Record<string, readonly [number, number, number]> = {
  'lineage.human': [0, 0, 0], 'lineage.dwarf': [10, -6, 8], 'lineage.gnome': [-10, 12, -2],
  'lineage.halfling': [-4, 0, 8], 'lineage.elf': [-8, 10, -4], 'lineage.dark_elf': [-4, 8, 2],
  'lineage.half_troll': [7, -3, 3], 'lineage.half_orc': [4, -1, 4],
  'lineage.half_goblin': [-4, 2, 5], 'lineage.half_merfolk': [-1, 3, 3]
};

export function selectedEntryStats(identity: EntryIdentity) {
  const { lineageId, sex, age, height, build, aptitude } = identity;
  const base = getLineageBaseAttributes(lineageId);
  const sexShift = getSexAttributeAdjustments(lineageId, sex);
  const ageShift = getAgeBandAttributeAdjustments(age);
  const heightShift = getHeightBandAttributeAdjustments(height);
  const generated = entryProfilePoints(build, aptitude);
  const attributes = { ...base };
  for (const key of Object.values(attributeGroups).flat()) {
    attributes[key] += (sexShift[key] ?? 0) + (ageShift[key] ?? 0) + (heightShift[key] ?? 0)
      + (generated.physical[key] ?? 0) + (generated.mind[key] ?? 0);
  }
  const [hp, mp, stamina] = resourceOffsets[lineageId] ?? [0, 0, 0];
  return { base, attributes, generated, total: sumPlayerAttributes(attributes), resources: {
    HP: 120 + hp + 4 * (attributes.CON + attributes.VIT - 20),
    MP: 60 + mp + 4 * (attributes.INT + attributes.SPT - 20),
    Stamina: 100 + stamina + 3 * (attributes.AGI + attributes.CON + attributes.VIT - 30)
  }};
}
