import {
  applyAttributeAdjustments,
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile,
  resolvePlayerResources,
  type EquipmentState,
  type InventoryStack,
  type PlayerAttributes,
  type PlayerCurrencyState,
  type PlayerResourceGrowthVector,
  type PlayerSkillState,
  type PlayerTraitState,
  type SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import {
  deserializeSnapshot,
  serializeSnapshot
} from '../../../../packages/shared/persistence/src/index.js';
import type { CharacterCreationFormState } from './characterCreationForm.js';
import {
  getStarterBackgroundTemplate,
  getStarterClassTemplate,
  getStarterSettlementTemplate
} from './starterTemplates.js';
import { demoSnapshot } from '../runtime/demoSnapshot.js';

type DerivedCharacterCreationState = {
  backgroundLabel: string;
  startingSettlementLabel: string;
  startingRegionLabel: string;
  chosenOriginLabel: string;
  attributes: PlayerAttributes;
  resources: {
    hp: number;
    mp: number;
    stamina: number;
  };
  skills: PlayerSkillState[];
  traits: PlayerTraitState[];
  inventory: InventoryStack[];
  currency: PlayerCurrencyState;
  gearLabels: string[];
  starterPackLabels: string[];
  starterSkillLabels: string[];
  starterTraitLabels: string[];
  starterNotes: string[];
  snapshot: SaveSnapshot;
};

export type CharacterCreationPreview = {
  characterName: string;
  chosenOrigin: string;
  backgroundLabel: string;
  startingSettlement: string;
  startingRegion: string;
  attributes: PlayerAttributes;
  resourceMaxima: PlayerResourceGrowthVector;
  starterSkills: string[];
  starterTraits: string[];
  starterGear: string[];
  starterPack: string[];
  walletLabel: string;
  starterNotes: string[];
};

const EMPTY_EQUIPMENT: EquipmentState = {
  'slot.weapon.left': null,
  'slot.weapon.right': null,
  'slot.armor.head': null,
  'slot.armor.shoulder': null,
  'slot.armor.chest': null,
  'slot.armor.arm': null,
  'slot.armor.hand': null,
  'slot.armor.waist': null,
  'slot.armor.leg': null,
  'slot.armor.foot': null,
  'slot.accessory.ear': null,
  'slot.accessory.eyes': null,
  'slot.accessory.neck': null,
  'slot.accessory.arms': null,
  'slot.accessory.fingers': null,
  'slot.accessory.waist': null,
  'slot.accessory.ankle': null
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  const segments = value.split('.');
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split('_')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatWallet(currency: PlayerCurrencyState): string {
  return `${currency.gold}g ${currency.silver}s ${currency.copper}c`;
}

function slugifyPlayerName(playerName: string): string {
  return (
    playerName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'new_adventurer'
  );
}

function mergeCurrency(
  left: PlayerCurrencyState,
  right: PlayerCurrencyState
): PlayerCurrencyState {
  return {
    gold: left.gold + right.gold,
    silver: left.silver + right.silver,
    copper: left.copper + right.copper
  };
}

function mergeSkills(
  primary: PlayerSkillState[],
  secondary: PlayerSkillState[]
): PlayerSkillState[] {
  const byId = new Map<string, PlayerSkillState>();

  for (const skill of [...primary, ...secondary]) {
    const current = byId.get(skill.id);

    if (!current) {
      byId.set(skill.id, { ...skill });
      continue;
    }

    byId.set(skill.id, {
      ...current,
      rank: current.rank + skill.rank,
      source: current.source === 'trained' || skill.source === 'trained' ? 'trained' : skill.source
    });
  }

  return Array.from(byId.values()).sort((left, right) => {
    if (right.rank !== left.rank) {
      return right.rank - left.rank;
    }

    return left.id.localeCompare(right.id);
  });
}

function mergeInventoryStacks(
  primary: InventoryStack[],
  secondary: InventoryStack[]
): InventoryStack[] {
  const byKey = new Map<string, InventoryStack>();

  for (const stack of [...primary, ...secondary]) {
    const mapKey = `${stack.itemId}.${stack.itemKey}`;
    const current = byKey.get(mapKey);

    if (!current) {
      byKey.set(mapKey, { ...stack });
      continue;
    }

    byKey.set(mapKey, {
      ...current,
      quantity: current.quantity + stack.quantity
    });
  }

  return Array.from(byKey.values()).sort((left, right) => left.itemKey.localeCompare(right.itemKey));
}

function buildStarterTraits(
  lineageId: string,
  classId: string,
  backgroundTraitIds: string[],
  settlementTraitIds: string[]
): PlayerTraitState[] {
  const lineageSegments = lineageId.split('.');
  const lineageKey = lineageSegments[lineageSegments.length - 1] ?? 'unknown';
  const classSegments = classId.split('.');
  const classKey = classSegments[classSegments.length - 1] ?? 'unknown';
  const uniqueTraitIds = Array.from(
    new Set([
      `trait.${lineageKey}_heritage`,
      `trait.${classKey}_training`,
      ...backgroundTraitIds,
      ...settlementTraitIds
    ])
  );

  return uniqueTraitIds.map((traitId, index) => ({
    id: traitId,
    source: index < 2 ? (index === 0 ? 'lineage' : 'class') : 'story'
  }));
}

function buildStarterEquipment(classId: string): EquipmentState {
  return {
    ...EMPTY_EQUIPMENT,
    ...getStarterClassTemplate(classId).equipment
  };
}

function buildStarterInventory(
  classId: string,
  backgroundId: string
) {
  const classTemplate = getStarterClassTemplate(classId);
  const backgroundTemplate = getStarterBackgroundTemplate(backgroundId);

  return {
    bags: [
      {
        id: 'bag.traveler_satchel',
        label: 'Traveler Satchel',
        slotCapacity: 20,
        stacks: mergeInventoryStacks(
          classTemplate.inventory,
          backgroundTemplate.inventoryBonuses
        )
      }
    ],
    overflow: []
  };
}

function buildStarterSessionState(
  baseSnapshot: SaveSnapshot,
  playerName: string,
  form: CharacterCreationFormState
): SaveSnapshot['sessionState'] {
  const backgroundTemplate = getStarterBackgroundTemplate(form.backgroundId);
  const settlementTemplate = getStarterSettlementTemplate(form.startingSettlementId);

  const questJournal = baseSnapshot.sessionState.questJournal.filter((entry) =>
    settlementTemplate.questJournalIds.includes(entry.id)
  );
  const chronicleEntries = baseSnapshot.sessionState.chronicle.filter((entry) =>
    settlementTemplate.chronicleIds.includes(entry.id)
  );

  return {
    activeEvents: ['event.campaign.started'],
    flags: [
      'campaign.new_game',
      `character.background.${backgroundTemplate.id}`,
      `character.start.${settlementTemplate.id}`
    ],
    triggers: [],
    completedEvents: [],
    trackedQuestId: null,
    currentActivity: settlementTemplate.currentActivity,
    pinnedRecordIds: [],
    notifications: [
      {
        id: 'note.new_game',
        title: `${settlementTemplate.label} arrival`,
        detail: `${playerName} begins as a ${backgroundTemplate.label} at ${settlementTemplate.label}.`,
        timeLabel: 'Just now',
        tone: 'accent'
      }
    ],
    knownLocations: baseSnapshot.sessionState.knownLocations.filter((location) =>
      settlementTemplate.knownLocationIds.includes(location.id)
    ),
    worldRecords: baseSnapshot.sessionState.worldRecords.filter((record) =>
      settlementTemplate.worldRecordIds.includes(record.id)
    ),
    activityRecords: baseSnapshot.sessionState.activityRecords.filter((record) =>
      settlementTemplate.activityRecordIds.includes(record.id)
    ),
    operations: [],
    codexEntries: baseSnapshot.sessionState.codexEntries.filter((entry) =>
      settlementTemplate.codexEntryIds.includes(entry.id)
    ),
    questJournal,
    chronicle: [
      {
        id: 'chronicle.campaign_started',
        category: 'social',
        title: `${playerName} began as a ${backgroundTemplate.label}`,
        timeLabel: 'Just now',
        summary: `${playerName} opens the campaign from ${settlementTemplate.label} in the ${settlementTemplate.regionLabel}.`,
        statusLabel: 'Campaign started',
        entities: [playerName, settlementTemplate.label, backgroundTemplate.label],
        results: ['Starter state generated', 'Local leads prepared'],
        statChanges: ['Save slot created', `Origin set to ${backgroundTemplate.label}`],
        tags: [settlementTemplate.regionLabel, 'New Game']
      },
      ...chronicleEntries
    ]
  };
}

function deriveCharacterCreationState(
  form: CharacterCreationFormState
): DerivedCharacterCreationState {
  const baseSnapshot = cloneSnapshot(demoSnapshot);
  const classTemplate = getStarterClassTemplate(form.classId);
  const backgroundTemplate = getStarterBackgroundTemplate(form.backgroundId);
  const settlementTemplate = getStarterSettlementTemplate(form.startingSettlementId);
  const progression = {
    level: 1,
    classLevel: 1,
    unspentAttributePoints: 0,
    unspentSkillPoints: 0
  };
  const playerName = form.playerName.trim();
  const originProfile = resolvePlayerOriginProfile(
    {
      lineageId: form.lineageId,
      classId: form.classId,
      sexId: form.sexId
    },
    progression
  );
  const baseAttributes = applyAttributeAdjustments(
    classTemplate.baseAttributes,
    originProfile.attributeAdjustments
  );
  const attributes = applyAttributeAdjustments(
    baseAttributes,
    backgroundTemplate.attributeAdjustments
  );
  const equipment = buildStarterEquipment(form.classId);
  const inventory = buildStarterInventory(form.classId, form.backgroundId);
  const skills = mergeSkills(classTemplate.skills, backgroundTemplate.skillBonuses);
  const traits = buildStarterTraits(
    form.lineageId,
    form.classId,
    backgroundTemplate.traitIds,
    settlementTemplate.traitIds
  );
  const currency = mergeCurrency(classTemplate.currency, backgroundTemplate.currencyBonus);
  const resourceRuntime = createEmptyPlayerResourceRuntimeState();
  const playerId = `player.${slugifyPlayerName(playerName)}`;
  const resourceResolution = resolvePlayerResources(
    {
      playerId,
      attributes,
      resources: {
        hp: {
          current: originProfile.resolvedResourceMaxima.hp,
          max: originProfile.resolvedResourceMaxima.hp
        },
        mp: {
          current: originProfile.resolvedResourceMaxima.mp,
          max: originProfile.resolvedResourceMaxima.mp
        },
        stamina: {
          current: originProfile.resolvedResourceMaxima.stamina,
          max: originProfile.resolvedResourceMaxima.stamina
        },
        xp: {
          current: 0,
          total: 0,
          toNextLevel: 1000
        }
      },
      originProfile,
      equipment,
      resourceRuntime
    },
    [],
    baseSnapshot.clock.tick
  );
  const sessionState = buildStarterSessionState(baseSnapshot, playerName, form);
  const activeQuestIds = sessionState.questJournal
    .filter((entry) => entry.category === 'active' || entry.category === 'contracts')
    .map((entry) => entry.id);
  const completedQuestIds = sessionState.questJournal
    .filter((entry) => entry.category === 'completed')
    .map((entry) => entry.id);
  const snapshot: SaveSnapshot = {
    ...baseSnapshot,
    playerState: {
      ...baseSnapshot.playerState,
      playerId,
      regionId: settlementTemplate.regionId,
      coreData: {
        playerName,
        lineageId: form.lineageId,
        sexId: form.sexId,
        classId: form.classId,
        jobId: backgroundTemplate.jobId
      },
      attributes,
      resources: resourceResolution.resources,
      resourceRuntime: resourceResolution.resourceRuntime,
      progression,
      skills,
      spells: classTemplate.spells,
      abilities: classTemplate.abilities,
      traits,
      equipment,
      inventory,
      activeEffects: [],
      location: {
        settlementId: settlementTemplate.settlementId,
        siteLabel: settlementTemplate.siteLabel,
        worldMapId: settlementTemplate.worldMapId,
        knownSettlementIds: settlementTemplate.knownSettlementIds
      },
      currency,
      originProfile,
      reputation: [],
      titles: [],
      discoveryChronicle: {
        entries: [],
        lastUpdatedTick: null
      },
      discoveredRegions: [settlementTemplate.regionId],
      activeQuestIds,
      completedQuestIds,
      flags: [
        'player.new_game',
        `player.background.${backgroundTemplate.id}`,
        `player.start.${settlementTemplate.id}`
      ],
      saveMeta: {
        totalPlayTicks: 0,
        lastRestAtTick: baseSnapshot.clock.tick,
        lastSavedAtTick: baseSnapshot.clock.tick
      }
    },
    worldState: {
      ...baseSnapshot.worldState,
      activeRegions: Array.from(
        new Set([settlementTemplate.regionId, ...baseSnapshot.worldState.activeRegions])
      )
    },
    sessionState
  };

  return {
    backgroundLabel: backgroundTemplate.label,
    startingSettlementLabel: settlementTemplate.label,
    startingRegionLabel: settlementTemplate.regionLabel,
    chosenOriginLabel: `${backgroundTemplate.label} of ${settlementTemplate.label}`,
    attributes,
    resources: {
      hp: resourceResolution.resources.hp.max,
      mp: resourceResolution.resources.mp.max,
      stamina: resourceResolution.resources.stamina.max
    },
    skills,
    traits,
    inventory: inventory.bags[0]?.stacks ?? [],
    currency,
    gearLabels: Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
    starterPackLabels: (inventory.bags[0]?.stacks ?? []).map(
      (item) => `${humanizeId(item.itemKey)} x${item.quantity}`
    ),
    starterSkillLabels: skills.map((skill) => `${humanizeId(skill.id)} ${skill.rank}`),
    starterTraitLabels: traits.map((trait) => humanizeId(trait.id)),
    starterNotes: [
      ...originProfile.notes.slice(0, 2),
      backgroundTemplate.description,
      settlementTemplate.description
    ],
    snapshot
  };
}

export function buildCharacterCreationPreview(
  form: CharacterCreationFormState
): CharacterCreationPreview {
  const derived = deriveCharacterCreationState(form);

  return {
    characterName: form.playerName.trim() || 'Unnamed Adventurer',
    chosenOrigin: derived.chosenOriginLabel,
    backgroundLabel: derived.backgroundLabel,
    startingSettlement: derived.startingSettlementLabel,
    startingRegion: derived.startingRegionLabel,
    attributes: derived.attributes,
    resourceMaxima: {
      hp: derived.resources.hp,
      mp: derived.resources.mp,
      stamina: derived.resources.stamina
    },
    starterSkills: derived.starterSkillLabels,
    starterTraits: derived.starterTraitLabels,
    starterGear: derived.gearLabels,
    starterPack: derived.starterPackLabels,
    walletLabel: formatWallet(derived.currency),
    starterNotes: derived.starterNotes
  };
}

export function createNewGameSnapshot(
  form: CharacterCreationFormState
): SaveSnapshot {
  return deriveCharacterCreationState({
    ...form,
    playerName: form.playerName.trim()
  }).snapshot;
}
