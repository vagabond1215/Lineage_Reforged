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
import {
  hasCompleteCharacterCreationSelections,
  type CharacterCreationFormState,
  type CompleteCharacterCreationFormState
} from './characterCreationForm.js';
import {
  getBackstoryStartAccessProfileId,
  getBackstoryTemplate,
  getIdentityOptionLabel,
  getPathTemplate
} from './characterCreationCatalog.js';
import { resolveWorldSelection } from './worldSelectionCatalog.js';
import { demoSnapshot } from '../runtime/demoSnapshot.js';

type DerivedCharacterCreationState = {
  backgroundLabel: string;
  lineageLabel: string;
  pathLabel: string;
  startingContinentLabel: string;
  startingSettlementLabel: string;
  startingRegionLabel: string;
  startingAccessLabel: string;
  startingAccessDetail: string;
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

type CharacterCreationPreviewMetric = {
  id: string;
  label: string;
  value: string | null;
};

export type CharacterCreationPreview = {
  isResolved: boolean;
  characterName: string;
  chosenOrigin: string;
  lineageLabel: string | null;
  backgroundLabel: string | null;
  pathLabel: string | null;
  startingContinent: string | null;
  startingSettlement: string | null;
  startingRegion: string | null;
  startingAccessLabel: string;
  startingAccessDetail: string;
  identityMetrics: CharacterCreationPreviewMetric[];
  resourceMetrics: CharacterCreationPreviewMetric[];
  attributeMetrics: CharacterCreationPreviewMetric[];
  starterSkills: string[];
  starterTraits: string[];
  starterGear: string[];
  starterPack: string[];
  walletLabel: string | null;
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

function buildPreviewMetric(
  id: string,
  label: string,
  value: number | null
): CharacterCreationPreviewMetric {
  return {
    id,
    label,
    value: value === null ? null : value.toString()
  };
}

function buildTextMetric(
  id: string,
  label: string,
  value: string | null
): CharacterCreationPreviewMetric {
  return {
    id,
    label,
    value
  };
}

function buildIdentityMetrics(
  form: Pick<
    CharacterCreationFormState,
    'sexId' | 'lineageId' | 'heightCm' | 'buildId' | 'hairColorId' | 'hairHighlightColorId' | 'eyeColorId' | 'skinToneId'
  >
): CharacterCreationPreviewMetric[] {
  const sexLabel = form.sexId ? `${form.sexId[0]!.toUpperCase()}${form.sexId.slice(1)}` : null;
  const buildLabel = getIdentityOptionLabel(form.lineageId, 'buildOptions', form.buildId);
  const hairLabel = getIdentityOptionLabel(form.lineageId, 'hairColorOptions', form.hairColorId);
  const highlightLabel = form.hairHighlightColorId
    ? getIdentityOptionLabel(form.lineageId, 'hairHighlightOptions', form.hairHighlightColorId)
    : 'None';
  const eyeLabel = getIdentityOptionLabel(form.lineageId, 'eyeColorOptions', form.eyeColorId);
  const skinLabel = getIdentityOptionLabel(form.lineageId, 'skinToneOptions', form.skinToneId);

  return [
    buildTextMetric('sex', 'Sex', sexLabel),
    buildTextMetric('height', 'Height', form.heightCm === null ? null : `${form.heightCm} cm`),
    buildTextMetric('build', 'Build', buildLabel),
    buildTextMetric('hair', 'Hair', hairLabel),
    buildTextMetric('highlight', 'Highlight', highlightLabel),
    buildTextMetric('eyes', 'Eyes', eyeLabel),
    buildTextMetric('skin', 'Skin', skinLabel)
  ];
}

function buildPlaceholderPreview(form: CharacterCreationFormState): CharacterCreationPreview {
  return {
    isResolved: false,
    characterName: form.playerName.trim() || 'Name Pending',
    chosenOrigin: 'An unproven wanderer without a sworn past, path, or legal start yet.',
    lineageLabel: null,
    backgroundLabel: null,
    pathLabel: null,
    startingContinent: null,
    startingSettlement: null,
    startingRegion: null,
    startingAccessLabel: 'Awaiting legal start',
    startingAccessDetail:
      'Choose lineage, identity, backstory, path, and settlement to generate a legal opening.',
    identityMetrics: buildIdentityMetrics(form),
    resourceMetrics: [
      buildPreviewMetric('hp', 'HP', null),
      buildPreviewMetric('mp', 'MP', null),
      buildPreviewMetric('stamina', 'Stamina', null)
    ],
    attributeMetrics: [
      buildPreviewMetric('str', 'Strength', null),
      buildPreviewMetric('agi', 'Agility', null),
      buildPreviewMetric('spt', 'Spirit', null)
    ],
    starterSkills: [],
    starterTraits: [],
    starterGear: [],
    starterPack: [],
    walletLabel: null,
    starterNotes: []
  };
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
    ...getPathTemplate(classId).equipment
  };
}

function buildStarterInventory(
  classId: string,
  backgroundId: string
) {
  const classTemplate = getPathTemplate(classId);
  const backgroundTemplate = getBackstoryTemplate(backgroundId);

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
  playerName: string,
  form: CharacterCreationFormState,
  selectedWorld: NonNullable<ReturnType<typeof resolveWorldSelection>>
): SaveSnapshot['sessionState'] {
  const backgroundTemplate = getBackstoryTemplate(form.backgroundId);
  const settlementRecord = selectedWorld.settlementRecord;
  const locationType =
    settlementRecord.settlementType === 'fort' || settlementRecord.settlementType === 'citadel'
      ? 'fort'
      : settlementRecord.settlementType === 'harbor_town' || settlementRecord.settlementType === 'port_city'
        ? 'harbor'
        : 'settlement';
  const knownLocations = [
    {
      id: settlementRecord.id,
      name: settlementRecord.name,
      regionLabel: selectedWorld.region.label,
      type: locationType,
      x: settlementRecord.visualMapRef?.pixelX ?? 0,
      y: settlementRecord.visualMapRef?.pixelY ?? 0,
      note: settlementRecord.summary,
      known: true
    }
  ];
  const worldRecords = [
    {
      id: selectedWorld.continent.id,
      sectionId: 'world.continent',
      title: selectedWorld.continent.label,
      summary: selectedWorld.continent.description,
      tags: selectedWorld.continent.biomeMix,
      detailEntries: [
        { label: 'Climate', value: selectedWorld.continent.climate },
        { label: 'Survivability', value: selectedWorld.continent.survivabilityLabel }
      ]
    },
    {
      id: selectedWorld.region.id,
      sectionId: 'world.region',
      title: selectedWorld.region.label,
      subtitle: selectedWorld.continent.label,
      summary: selectedWorld.region.description,
      tags: selectedWorld.region.resourceAvailability,
      detailEntries: [
        { label: 'Terrain', value: selectedWorld.region.terrainAndBiome },
        { label: 'Density', value: selectedWorld.region.populationDensity }
      ]
    },
    {
      id: selectedWorld.settlement.id,
      sectionId: 'world.settlement',
      title: selectedWorld.settlement.label,
      subtitle: selectedWorld.region.label,
      summary: selectedWorld.settlement.description,
      tags: selectedWorld.settlement.dominantIndustries,
      detailEntries: [
        { label: 'Population', value: selectedWorld.settlement.populationSize },
        { label: 'Trade Role', value: selectedWorld.settlement.tradeRole },
        { label: 'Authority', value: selectedWorld.settlement.landAuthorityType.replace(/_/g, ' ') }
      ]
    }
  ];
  const activityRecords = [
    {
      id: `activity.start.${settlementRecord.id}`,
      sectionId: 'activity.start',
      title: `Arrival at ${settlementRecord.name}`,
      summary: selectedWorld.settlement.access.notes[0] ?? settlementRecord.summary,
      tags: selectedWorld.settlement.dominantIndustries,
      detailEntries: [
        { label: 'Spawn Mode', value: selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ') },
        { label: 'Lodging', value: selectedWorld.settlement.access.lodgingType.replace(/_/g, ' ') }
      ]
    }
  ];

  return {
    activeEvents: ['event.campaign.started'],
    flags: [
      'campaign.new_game',
      `character.background.${backgroundTemplate.id}`,
      `character.start.${settlementRecord.id}`,
      `character.continent.${selectedWorld.continent.id}`,
      `character.region.${selectedWorld.region.id}`
    ],
    triggers: [],
    completedEvents: [],
    trackedQuestId: null,
    currentActivity: {
      id: `activity.arrival.${settlementRecord.id}`,
      label: `Arriving in ${settlementRecord.name}`,
      category: 'Arrival',
      detail: `${selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')} into ${settlementRecord.name}.`
    },
    pinnedRecordIds: [],
    notifications: [
      {
        id: 'note.new_game',
        title: `${settlementRecord.name} arrival`,
        detail: `${playerName} begins as a ${backgroundTemplate.label} at ${settlementRecord.name}.`,
        timeLabel: 'Just now',
        tone: 'accent'
      }
    ],
    knownLocations,
    worldRecords,
    activityRecords,
    operations: [],
    codexEntries: [],
    questJournal: [],
    chronicle: [
      {
        id: 'chronicle.campaign_started',
        category: 'social',
        title: `${playerName} began as a ${backgroundTemplate.label}`,
        timeLabel: 'Just now',
        summary: `${playerName} opens the campaign from ${settlementRecord.name} in the ${selectedWorld.region.label}.`,
        statusLabel: 'Campaign started',
        entities: [playerName, settlementRecord.name, backgroundTemplate.label],
        results: ['Starter state generated', selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')],
        statChanges: ['Save slot created', `Origin set to ${backgroundTemplate.label}`],
        tags: [selectedWorld.region.label, selectedWorld.continent.label, 'New Game']
      }
    ]
  };
}

function deriveCharacterCreationState(
  form: CompleteCharacterCreationFormState
): DerivedCharacterCreationState {
  const baseSnapshot = cloneSnapshot(demoSnapshot);
  const classTemplate = getPathTemplate(form.classId);
  const backgroundTemplate = getBackstoryTemplate(form.backgroundId);
  const selectedWorld = resolveWorldSelection({
    continentId: form.continentId,
    regionId: form.regionId,
    settlementId: form.startingSettlementId,
    classId: form.classId,
    backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
  });

  if (!selectedWorld) {
    throw new Error('Cannot create a new game without a valid world selection.');
  }

  if (selectedWorld.settlement.access.accessStatus !== 'allowed') {
    throw new Error(selectedWorld.settlement.access.notes[0] ?? 'Selected settlement start is restricted.');
  }

  const settlementTraitIds = [
    `trait.${selectedWorld.settlementRecord.terrainContext}`,
    `trait.${selectedWorld.settlement.tradeRole.toLowerCase()}_start`
  ];
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
    settlementTraitIds
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
  const sessionState = buildStarterSessionState(playerName, form, selectedWorld);
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
      regionId: selectedWorld.region.id,
      coreData: {
        playerName,
        lineageId: form.lineageId,
        sexId: form.sexId,
        classId: form.classId,
        jobId: backgroundTemplate.jobId,
        identityProfile: {
          heightCm: form.heightCm,
          buildId: form.buildId,
          hairColorId: form.hairColorId,
          hairHighlightColorId: form.hairHighlightColorId || null,
          eyeColorId: form.eyeColorId,
          skinToneId: form.skinToneId
        }
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
        settlementId: selectedWorld.settlement.id,
        siteLabel: selectedWorld.settlement.label,
        worldMapId: selectedWorld.settlementRecord.visualMapRef?.mapId ?? null,
        knownSettlementIds: [selectedWorld.settlement.id]
      },
      currency,
      originProfile,
      reputation: [],
      titles: [],
      discoveryChronicle: {
        entries: [],
        lastUpdatedTick: null
      },
      discoveredRegions: [selectedWorld.region.id],
      activeQuestIds,
      completedQuestIds,
      flags: [
        'player.new_game',
        `player.background.${backgroundTemplate.id}`,
        `player.start.${selectedWorld.settlement.id}`,
        `player.start_authority.${selectedWorld.settlement.landAuthorityType}`,
        `player.start_mode.${selectedWorld.settlement.access.spawnMode}`
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
        new Set([selectedWorld.region.id, ...baseSnapshot.worldState.activeRegions])
      )
    },
    sessionState
  };

  return {
    backgroundLabel: backgroundTemplate.label,
    lineageLabel: originProfile.lineageLabel,
    pathLabel: classTemplate.label,
    startingContinentLabel: selectedWorld.continent.label,
    startingSettlementLabel: selectedWorld.settlement.label,
    startingRegionLabel: selectedWorld.region.label,
    startingAccessLabel:
      selectedWorld.settlement.access.accessStatus === 'allowed' ? 'Authorized Start' : 'Restricted Start',
    startingAccessDetail:
      selectedWorld.settlement.access.notes[0] ??
      `${selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')} | ${selectedWorld.settlement.access.lodgingType.replace(/_/g, ' ')}`,
    chosenOriginLabel: `${originProfile.lineageLabel} ${backgroundTemplate.label} on the ${classTemplate.label} path`,
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
      selectedWorld.settlement.description,
      selectedWorld.settlement.access.notes[0] ?? ''
    ],
    snapshot
  };
}

export function buildCharacterCreationPreview(
  form: CharacterCreationFormState
): CharacterCreationPreview {
  if (!hasCompleteCharacterCreationSelections(form)) {
    return buildPlaceholderPreview(form);
  }

  try {
    const derived = deriveCharacterCreationState(form);

    return {
      isResolved: true,
      characterName: form.playerName.trim() || 'Name Pending',
      chosenOrigin: derived.chosenOriginLabel,
      lineageLabel: derived.lineageLabel,
      backgroundLabel: derived.backgroundLabel,
      pathLabel: derived.pathLabel,
      startingContinent: derived.startingContinentLabel,
      startingSettlement: derived.startingSettlementLabel,
      startingRegion: derived.startingRegionLabel,
      startingAccessLabel: derived.startingAccessLabel,
      startingAccessDetail: derived.startingAccessDetail,
      identityMetrics: buildIdentityMetrics(form),
      resourceMetrics: [
        buildPreviewMetric('hp', 'HP', derived.resources.hp),
        buildPreviewMetric('mp', 'MP', derived.resources.mp),
        buildPreviewMetric('stamina', 'Stamina', derived.resources.stamina)
      ],
      attributeMetrics: [
        buildPreviewMetric('str', 'Strength', derived.attributes.STR),
        buildPreviewMetric('agi', 'Agility', derived.attributes.AGI),
        buildPreviewMetric('spt', 'Spirit', derived.attributes.SPT)
      ],
      starterSkills: derived.starterSkillLabels,
      starterTraits: derived.starterTraitLabels,
      starterGear: derived.gearLabels,
      starterPack: derived.starterPackLabels,
      walletLabel: formatWallet(derived.currency),
      starterNotes: derived.starterNotes.filter((note) => note.trim().length > 0)
    };
  } catch (error) {
    const classTemplate = getPathTemplate(form.classId);
    const backgroundTemplate = getBackstoryTemplate(form.backgroundId);
    const selectedWorld = resolveWorldSelection({
      continentId: form.continentId,
      regionId: form.regionId,
      settlementId: form.startingSettlementId,
      classId: form.classId,
      backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
    });
    const originProfile = resolvePlayerOriginProfile(
      {
        lineageId: form.lineageId,
        classId: form.classId,
        sexId: form.sexId
      },
      {
        level: 1,
        classLevel: 1,
        unspentAttributePoints: 0,
        unspentSkillPoints: 0
      }
    );
    const attributes = applyAttributeAdjustments(
      applyAttributeAdjustments(classTemplate.baseAttributes, originProfile.attributeAdjustments),
      backgroundTemplate.attributeAdjustments
    );
    const currency = mergeCurrency(classTemplate.currency, backgroundTemplate.currencyBonus);
    const inventory = buildStarterInventory(form.classId, form.backgroundId);

    return {
      isResolved: true,
      characterName: form.playerName.trim() || 'Name Pending',
      chosenOrigin: `${originProfile.lineageLabel} ${backgroundTemplate.label} on the ${classTemplate.label} path`,
      lineageLabel: originProfile.lineageLabel,
      backgroundLabel: backgroundTemplate.label,
      pathLabel: classTemplate.label,
      startingContinent: selectedWorld?.continent.label ?? 'Unknown Continent',
      startingSettlement: selectedWorld?.settlement.label ?? 'Unknown Settlement',
      startingRegion: selectedWorld?.region.label ?? 'Unknown Region',
      startingAccessLabel:
        selectedWorld?.settlement.access.accessStatus === 'allowed' ? 'Authorized Start' : 'Start Unavailable',
      startingAccessDetail:
        selectedWorld?.settlement.access.notes[0] ??
        'Select a legal start to finalize the campaign.',
      identityMetrics: buildIdentityMetrics(form),
      resourceMetrics: [
        buildPreviewMetric('hp', 'HP', originProfile.resolvedResourceMaxima.hp),
        buildPreviewMetric('mp', 'MP', originProfile.resolvedResourceMaxima.mp),
        buildPreviewMetric('stamina', 'Stamina', originProfile.resolvedResourceMaxima.stamina)
      ],
      attributeMetrics: [
        buildPreviewMetric('str', 'Strength', attributes.STR),
        buildPreviewMetric('agi', 'Agility', attributes.AGI),
        buildPreviewMetric('spt', 'Spirit', attributes.SPT)
      ],
      starterSkills: classTemplate.skills.map((skill) => `${humanizeId(skill.id)} ${skill.rank}`),
      starterTraits: backgroundTemplate.traitIds.map((traitId) => humanizeId(traitId)),
      starterGear: Object.values(buildStarterEquipment(form.classId)).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
      starterPack: (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`),
      walletLabel: formatWallet(currency),
      starterNotes: [
        backgroundTemplate.description,
        selectedWorld?.settlement.access.notes[0] ?? 'Select a legal start to finalize the campaign.',
        error instanceof Error ? error.message : 'Preview fallback active.'
      ]
    };
  }
}

export function createNewGameSnapshot(
  form: CharacterCreationFormState
): SaveSnapshot {
  if (!hasCompleteCharacterCreationSelections(form)) {
    throw new Error('Complete character creation before starting the campaign.');
  }

  return deriveCharacterCreationState({
    ...form,
    playerName: form.playerName.trim()
  }).snapshot;
}
