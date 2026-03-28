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
  type SaveSnapshot,
  type WorldLocationType
} from '../../../../packages/shared/types/src/index.js';
import {
  deserializeSnapshot,
  serializeSnapshot
} from '../../../../packages/shared/persistence/src/index.js';
import {
  hasCompleteCharacterCreationSelections,
  validateCharacterCreationForm,
  type CharacterCreationFormState,
  type CompleteCharacterCreationFormState
} from './characterCreationForm.js';
import { applyCharacterAttributeAllocation } from './characterAttributes.js';
import {
  getBackstoryStartAccessProfileId,
  getBackstoryTemplate,
  getBuildAttributeAdjustments,
  getBuildLabel,
  getHeightBandLabel,
  getHeightBandAttributeAdjustments,
  getIdentityOptionLabel,
  getLineageBaseAttributes,
  isCompatibleBackstorySelection,
  getPathAttributeAdjustments,
  getRepresentativeHeightCm,
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
  backstoryHook: string;
  reviewNarrative: string;
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
  reviewNarrative: string;
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
    | 'sexId'
    | 'lineageId'
    | 'heightBandId'
    | 'buildId'
    | 'hairColorId'
    | 'eyeColorId'
    | 'skinToneId'
  >
): CharacterCreationPreviewMetric[] {
  const sexLabel = form.sexId ? `${form.sexId[0]!.toUpperCase()}${form.sexId.slice(1)}` : null;
  const heightLabel = getHeightBandLabel(form.heightBandId);
  const buildLabel = getBuildLabel(form.buildId);
  const hairLabel = getIdentityOptionLabel(form.lineageId, 'hairColorOptions', form.hairColorId);
  const eyeLabel = getIdentityOptionLabel(form.lineageId, 'eyeColorOptions', form.eyeColorId);
  const skinLabel = getIdentityOptionLabel(form.lineageId, 'skinToneOptions', form.skinToneId);

  return [
    buildTextMetric('sex', 'Sex', sexLabel),
    buildTextMetric('height', 'Height', heightLabel),
    buildTextMetric('build', 'Build', buildLabel),
    buildTextMetric('hair', 'Hair', hairLabel),
    buildTextMetric('eyes', 'Eyes', eyeLabel),
    buildTextMetric('skin', 'Skin', skinLabel)
  ];
}

function buildAttributeMetrics(
  attributes: PlayerAttributes | null
): CharacterCreationPreviewMetric[] {
  return [
    buildPreviewMetric('str', 'STR', attributes?.STR ?? null),
    buildPreviewMetric('dex', 'DEX', attributes?.DEX ?? null),
    buildPreviewMetric('agi', 'AGI', attributes?.AGI ?? null),
    buildPreviewMetric('con', 'CON', attributes?.CON ?? null),
    buildPreviewMetric('vit', 'VIT', attributes?.VIT ?? null),
    buildPreviewMetric('wis', 'WIS', attributes?.WIS ?? null),
    buildPreviewMetric('int', 'INT', attributes?.INT ?? null),
    buildPreviewMetric('spt', 'SPT', attributes?.SPT ?? null),
    buildPreviewMetric('cha', 'CHA', attributes?.CHA ?? null)
  ];
}

function resolveWorkingCharacterAttributes(
  form: Pick<
    CharacterCreationFormState,
    | 'sexId'
    | 'lineageId'
    | 'classId'
    | 'backgroundId'
    | 'heightBandId'
    | 'buildId'
    | 'attributeAllocation'
  >,
  selectedWorld?: ReturnType<typeof resolveWorldSelection> | null
): PlayerAttributes {
  const hasPathSelection = form.classId.trim().length > 0;
  const resolvedClassId = hasPathSelection ? getPathTemplate(form.classId).id : 'class.explorer';
  const resolvedLineageId = form.lineageId.trim() || 'lineage.human';
  const resolvedSexId = form.sexId === 'female' ? 'female' : 'male';
  const originProfile = resolvePlayerOriginProfile(
    {
      lineageId: resolvedLineageId,
      classId: resolvedClassId,
      sexId: resolvedSexId
    },
    {
      level: 1,
      classLevel: 1
    }
  );

  let attributes = getLineageBaseAttributes(resolvedLineageId);

  if (hasPathSelection) {
    attributes = applyAttributeAdjustments(
      attributes,
      getPathAttributeAdjustments(resolvedClassId)
    );
  }
  attributes = applyAttributeAdjustments(attributes, originProfile.attributeAdjustments);

  if (
    form.backgroundId.trim().length > 0 &&
    isCompatibleBackstorySelection(resolvedLineageId, form.backgroundId)
  ) {
    attributes = applyAttributeAdjustments(
      attributes,
      getBackstoryTemplate(form.backgroundId, selectedWorld).attributeAdjustments
    );
  }

  attributes = applyAttributeAdjustments(
    attributes,
    getHeightBandAttributeAdjustments(form.heightBandId)
  );
  attributes = applyAttributeAdjustments(
    attributes,
    getBuildAttributeAdjustments(form.buildId)
  );

  return applyCharacterAttributeAllocation(attributes, form.attributeAllocation);
}

function formatNarrativeList(values: string[], fallback: string): string {
  const filtered = values.filter((value) => value.trim().length > 0);

  if (filtered.length === 0) {
    return fallback;
  }

  if (filtered.length === 1) {
    return filtered[0]!;
  }

  if (filtered.length === 2) {
    return `${filtered[0]} and ${filtered[1]}`;
  }

  return `${filtered.slice(0, -1).join(', ')}, and ${filtered[filtered.length - 1]}`;
}

function buildReviewNarrative(params: {
  characterName: string;
  pathLabel: string;
  backstoryHook: string;
  settlementLabel: string;
  regionLabel: string;
  dominantIndustries: string[];
  keyResources: string[];
  gearLabels: string[];
  starterPackLabels: string[];
  walletLabel: string;
}): string {
  const opportunity = formatNarrativeList(
    [...params.dominantIndustries.slice(0, 2), ...params.keyResources.slice(0, 2).map((value) => humanizeId(value))],
    'local trade and hard work'
  ).toLowerCase();
  const carried = formatNarrativeList(
    [...params.gearLabels.slice(0, 2), ...params.starterPackLabels.slice(0, 2)],
    'a modest starter kit'
  );

  return `${params.characterName}. ${params.backstoryHook} Now you turn toward the ${params.pathLabel} path as you make for ${params.settlementLabel} in ${params.regionLabel}. ${params.settlementLabel} is known for ${opportunity}, and many build a living there if they can seize the work before the next rival does. You carry ${carried}, and ${params.walletLabel} stands between you and immediate hunger.`;
}

function buildPlaceholderPreview(form: CharacterCreationFormState): CharacterCreationPreview {
  const provisionalAttributes = resolveWorkingCharacterAttributes(form);

  return {
    isResolved: false,
    characterName: form.playerName.trim() || 'Name Pending',
    chosenOrigin: 'An unproven soul with no sworn past, chosen path, or lawful arrival yet.',
    lineageLabel: form.lineageId.trim() ? humanizeId(form.lineageId) : null,
    backgroundLabel: null,
    pathLabel: null,
    startingContinent: null,
    startingSettlement: null,
    startingRegion: null,
    startingAccessLabel: 'Land restrictions undecided',
    startingAccessDetail:
      'Choose a homeland, city, backstory, and path before the local authorities can be judged.',
    identityMetrics: buildIdentityMetrics(form),
    resourceMetrics: [
      buildPreviewMetric('hp', 'HP', null),
      buildPreviewMetric('mp', 'MP', null),
      buildPreviewMetric('stamina', 'Stamina', null)
    ],
    attributeMetrics: buildAttributeMetrics(provisionalAttributes),
    starterSkills: [],
    starterTraits: [],
    starterGear: [],
    starterPack: [],
    walletLabel: null,
    starterNotes: [],
    reviewNarrative:
      'A life is still being forged. Choose lineage, identity, homeland, settlement, backstory, path, and final attribute allocation to shape the opening of the journey.'
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
  const backgroundTemplate = getBackstoryTemplate(form.backgroundId, selectedWorld);
  const settlementRecord = selectedWorld.settlementRecord;
  const locationType: WorldLocationType =
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
        { label: 'Difficulty', value: selectedWorld.continent.difficultyLabel }
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
        { label: 'Lodging', value: selectedWorld.settlement.access.lodgingType.replace(/_/g, ' ') },
        { label: 'Land Authority', value: selectedWorld.settlement.landRestriction.authorityLabel }
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

  const backgroundTemplate = getBackstoryTemplate(form.backgroundId, selectedWorld);
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
  const attributes = resolveWorkingCharacterAttributes(
    form,
    selectedWorld
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
  const walletLabel = formatWallet(currency);
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
          heightCm: getRepresentativeHeightCm(form.lineageId, form.heightBandId),
          buildId: form.buildId,
          hairColorId: form.hairColorId,
          hairHighlightColorId: null,
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
      selectedWorld.settlement.access.accessStatus === 'allowed' ? 'Land restrictions satisfied' : 'Land restrictions unmet',
    startingAccessDetail: [
      selectedWorld.settlement.landRestriction.propertyNarrative,
      selectedWorld.settlement.landRestriction.currentStanding,
      selectedWorld.settlement.landRestriction.purchaseRequirements.length > 0
        ? `Should you seek to buy land, the usual demands are ${formatNarrativeList(
            selectedWorld.settlement.landRestriction.purchaseRequirements,
            'no formal requirements are commonly spoken of'
          ).toLowerCase()}.`
        : ''
    ]
      .filter((value) => value.trim().length > 0)
      .join(' '),
    chosenOriginLabel: `${originProfile.lineageLabel} ${backgroundTemplate.label}`,
    backstoryHook: backgroundTemplate.hookLine,
    reviewNarrative: buildReviewNarrative({
      characterName: playerName,
      pathLabel: classTemplate.label,
      backstoryHook: backgroundTemplate.hookLine.replace(/\.$/, ''),
      settlementLabel: selectedWorld.settlement.label,
      regionLabel: selectedWorld.region.label,
      dominantIndustries: selectedWorld.settlement.dominantIndustries,
      keyResources: selectedWorld.settlement.keyResources,
      gearLabels: Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
      starterPackLabels: (inventory.bags[0]?.stacks ?? []).map(
        (item) => `${humanizeId(item.itemKey)} x${item.quantity}`
      ),
      walletLabel
    }),
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
      backgroundTemplate.narrativeParagraphs[0],
      backgroundTemplate.narrativeParagraphs[1],
      selectedWorld.settlement.description,
      selectedWorld.settlement.landRestriction.currentStanding
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
      attributeMetrics: buildAttributeMetrics(derived.attributes),
      starterSkills: derived.starterSkillLabels,
      starterTraits: derived.starterTraitLabels,
      starterGear: derived.gearLabels,
      starterPack: derived.starterPackLabels,
      walletLabel: formatWallet(derived.currency),
      starterNotes: derived.starterNotes.filter((note) => note.trim().length > 0),
      reviewNarrative: derived.reviewNarrative
    };
  } catch (error) {
    const selectedWorld = resolveWorldSelection({
      continentId: form.continentId,
      regionId: form.regionId,
      settlementId: form.startingSettlementId,
      classId: form.classId,
      backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
    });
    const classTemplate = getPathTemplate(form.classId);
    const backgroundTemplate = getBackstoryTemplate(form.backgroundId, selectedWorld);
    const originProfile = resolvePlayerOriginProfile(
      {
        lineageId: form.lineageId,
        classId: form.classId,
        sexId: form.sexId
      },
      {
        level: 1,
        classLevel: 1
      }
    );
    const attributes = resolveWorkingCharacterAttributes(form, selectedWorld);
    const currency = mergeCurrency(classTemplate.currency, backgroundTemplate.currencyBonus);
    const inventory = buildStarterInventory(form.classId, form.backgroundId);

    return {
      isResolved: true,
      characterName: form.playerName.trim() || 'Name Pending',
      chosenOrigin: `${originProfile.lineageLabel} ${backgroundTemplate.label}`,
      lineageLabel: originProfile.lineageLabel,
      backgroundLabel: backgroundTemplate.label,
      pathLabel: classTemplate.label,
      startingContinent: selectedWorld?.continent.label ?? 'Unknown Continent',
      startingSettlement: selectedWorld?.settlement.label ?? 'Unknown Settlement',
      startingRegion: selectedWorld?.region.label ?? 'Unknown Region',
      startingAccessLabel:
        selectedWorld?.settlement.access.accessStatus === 'allowed'
          ? 'Land restrictions satisfied'
          : 'Land restrictions unresolved',
      startingAccessDetail:
        selectedWorld?.settlement.landRestriction.propertyNarrative ??
        'Select a lawful settlement combination to finish the opening.',
      identityMetrics: buildIdentityMetrics(form),
      resourceMetrics: [
        buildPreviewMetric('hp', 'HP', originProfile.resolvedResourceMaxima.hp),
        buildPreviewMetric('mp', 'MP', originProfile.resolvedResourceMaxima.mp),
        buildPreviewMetric('stamina', 'Stamina', originProfile.resolvedResourceMaxima.stamina)
      ],
      attributeMetrics: buildAttributeMetrics(attributes),
      starterSkills: classTemplate.skills.map((skill) => `${humanizeId(skill.id)} ${skill.rank}`),
      starterTraits: backgroundTemplate.traitIds.map((traitId) => humanizeId(traitId)),
      starterGear: Object.values(buildStarterEquipment(form.classId)).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
      starterPack: (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`),
      walletLabel: formatWallet(currency),
      starterNotes: [
        backgroundTemplate.narrativeParagraphs[0],
        backgroundTemplate.narrativeParagraphs[1],
        selectedWorld?.settlement.landRestriction.currentStanding ??
          'Select a legal start to finalize the campaign.',
        error instanceof Error ? error.message : 'Preview fallback active.'
      ],
      reviewNarrative: selectedWorld
        ? buildReviewNarrative({
            characterName: form.playerName.trim() || 'Name Pending',
            pathLabel: classTemplate.label,
            backstoryHook: backgroundTemplate.hookLine.replace(/\.$/, ''),
            settlementLabel: selectedWorld.settlement.label,
            regionLabel: selectedWorld.region.label,
            dominantIndustries: selectedWorld.settlement.dominantIndustries,
            keyResources: selectedWorld.settlement.keyResources,
            gearLabels: Object.values(buildStarterEquipment(form.classId)).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
            starterPackLabels: (inventory.bags[0]?.stacks ?? []).map(
              (item) => `${humanizeId(item.itemKey)} x${item.quantity}`
            ),
            walletLabel: formatWallet(currency)
          })
        : 'The shape of the journey is forming, but the chosen city still needs a lawful opening before the tale can be told cleanly.'
    };
  }
}

export function createNewGameSnapshot(
  form: CharacterCreationFormState
): SaveSnapshot {
  const validation = validateCharacterCreationForm(form);

  if (!validation.isValid) {
    throw new Error(
      Object.values(validation.errors)[0] ?? 'Complete character creation before starting the campaign.'
    );
  }

  if (!hasCompleteCharacterCreationSelections(form)) {
    throw new Error('Complete character creation before starting the campaign.');
  }

  return deriveCharacterCreationState({
    ...form,
    playerName: form.playerName.trim()
  }).snapshot;
}
