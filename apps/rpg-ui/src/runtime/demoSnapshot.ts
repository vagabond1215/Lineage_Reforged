import {
  applyAttributeAdjustments,
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile,
  resolvePlayerResources,
  type SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';

const demoCoreData = {
  playerName: 'Arden Voss',
  lineageId: 'lineage.human',
  sexId: 'female' as const,
  classId: 'class.explorer',
  jobId: 'job.merchant_captain'
};

const demoProgression = {
  level: 27,
  classLevel: 27,
  unspentAttributePoints: 1,
  unspentSkillPoints: 2
};

const demoOriginProfile = resolvePlayerOriginProfile(demoCoreData, demoProgression);
const demoAttributes = applyAttributeAdjustments(
  {
    STR: 14,
    DEX: 18,
    AGI: 16,
    CON: 14,
    VIT: 15,
    WIS: 14,
    INT: 16,
    SPT: 12,
    CHA: 15
  },
  demoOriginProfile.attributeAdjustments
);
const demoEquipment = {
  'slot.weapon.left': null,
  'slot.weapon.right': {
    itemId: 'item.surveyor_cutlass',
    itemKey: 'surveyor_cutlass',
    quantity: 1,
    durability: 0.94
  },
  'slot.armor.head': null,
  'slot.armor.shoulder': null,
  'slot.armor.chest': {
    itemId: 'item.shipwright_harness',
    itemKey: 'shipwright_harness',
    quantity: 1,
    durability: 0.88,
    resourceModifiers: [
      {
        id: 'equipment.shipwright_harness',
        label: 'Shipwright Harness',
        sourceType: 'equipment' as const,
        sourceId: 'item.shipwright_harness',
        maxFlat: { hp: 6, stamina: 12 },
        maxPercent: {},
        tickDeltaFlat: { stamina: 1 },
        notes: ['Rigging harness distributes load and reduces travel fatigue.']
      }
    ]
  },
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
  'slot.accessory.waist': {
    itemId: 'item.chart_case',
    itemKey: 'waterproof_chart_case',
    quantity: 1,
    durability: 0.91,
    resourceModifiers: [
      {
        id: 'equipment.waterproof_chart_case',
        label: 'Waterproof Chart Case',
        sourceType: 'equipment' as const,
        sourceId: 'item.chart_case',
        maxFlat: { mp: 8 },
        maxPercent: {},
        tickDeltaFlat: {},
        notes: ['Organized field notes reduce magical and mental strain while charting.']
      }
    ]
  },
  'slot.accessory.ankle': null
};
const demoResourceRuntime = createEmptyPlayerResourceRuntimeState();
demoResourceRuntime.modifiers = [
  {
    id: 'effect.harbor_rested',
    label: 'Harbor Rested',
    sourceType: 'food',
    sourceId: 'service.harbor_inn',
    maxFlat: {},
    maxPercent: {},
    tickDeltaFlat: { hp: 2, stamina: 3 },
    expiresAtTick: 1452,
    notes: ['A rested state from the harbor inn improves passive recovery.']
  },
  {
    id: 'effect.survey_charter',
    label: 'Survey Charter',
    sourceType: 'buff',
    sourceId: 'quest.ashen_reef_survey',
    maxFlat: { mp: 6, stamina: 4 },
    maxPercent: {},
    tickDeltaFlat: { mp: 1 },
    expiresAtTick: 1446,
    notes: ['Official backing grants support staff and steadier pacing during survey work.']
  },
  {
    id: 'effect.sea_legs_ii',
    label: 'Sea Legs II',
    sourceType: 'trait',
    sourceId: 'trait.sea_legs_ii',
    maxFlat: { stamina: 6 },
    maxPercent: {},
    tickDeltaFlat: { stamina: 1 },
    notes: ['Long sea travel makes stamina recovery steadier while underway.']
  }
];
demoResourceRuntime.pendingChanges = [
  {
    id: 'change.reef_scrape',
    label: 'Reef Scrape',
    resource: 'hp',
    amount: -5,
    kind: 'damage',
    sourceType: 'system',
    sourceId: 'event.ashen_reef_swell'
  },
  {
    id: 'change.chart_spell',
    label: 'Current Prediction',
    resource: 'mp',
    amount: -7,
    kind: 'spell_cost',
    sourceType: 'spell',
    sourceId: 'spell.storm.shock_spear'
  },
  {
    id: 'change.long_watch',
    label: 'Long Watch',
    resource: 'stamina',
    amount: -11,
    kind: 'scripted',
    sourceType: 'system',
    sourceId: 'activity.charting_tides'
  }
];
const demoResourceResolution = resolvePlayerResources(
  {
    playerId: 'player.arden_voss',
    attributes: demoAttributes,
    resources: {
      hp: { current: 170, max: demoOriginProfile.resolvedResourceMaxima.hp },
      mp: { current: 115, max: demoOriginProfile.resolvedResourceMaxima.mp },
      stamina: { current: 196, max: demoOriginProfile.resolvedResourceMaxima.stamina },
      xp: { current: 12480, total: 184400, toNextLevel: 14000 }
    },
    originProfile: demoOriginProfile,
    equipment: demoEquipment,
    resourceRuntime: demoResourceRuntime
  },
  [],
  1438
);

export const demoSnapshot: SaveSnapshot = {
  snapshotVersion: '0.1.0',
  capturedAtTick: 1438,
  clock: {
    tick: 1438,
    subday: 1,
    day: 21,
    month: 11,
    season: 'Withering',
    year: 302
  },
  playerState: {
    playerId: 'player.arden_voss',
    regionId: 'region.sable_coast',
    coreData: demoCoreData,
    attributes: demoAttributes,
    resources: demoResourceResolution.resources,
    resourceRuntime: demoResourceResolution.resourceRuntime,
    progression: demoProgression,
    skills: [
      { id: 'skill.navigation', rank: 9, source: 'trained' },
      { id: 'skill.mercantile', rank: 7, source: 'trained' },
      { id: 'skill.shipwright', rank: 6, source: 'trained' }
    ],
    spells: [
      {
        id: 'spell.storm.shock_spear',
        school: 'elemental',
        element: 'lightning',
        rank: 3,
        source: 'learned'
      }
    ],
    abilities: [
      {
        id: 'ability.mobility.combat_roll',
        category: 'general',
        rank: 2,
        source: 'learned'
      },
      {
        id: 'ability.combat.shield_bash',
        category: 'weapon',
        rank: 1,
        source: 'learned'
      }
    ],
    traits: [
      { id: 'trait.sea_legs_ii', source: 'story' },
      { id: 'trait.ledger_mind', source: 'story' }
    ],
    equipment: demoEquipment,
    inventory: {
      bags: [
        {
          id: 'bag.captains_case',
          label: 'Captain Satchel',
          slotCapacity: 20,
          stacks: [
            { itemId: 'item.ration_pack', itemKey: 'ration_pack', quantity: 6 },
            { itemId: 'item.bandage', itemKey: 'bandage', quantity: 4 },
            { itemId: 'item.coral_sample', itemKey: 'tideglass_coral_sample', quantity: 2 }
          ]
        }
      ],
      overflow: []
    },
    activeEffects: ['Saltproof Cloak', 'Survey Charter', 'Harbor Rested', 'Sea Legs II'],
    location: {
      settlementId: 'settlement.saltmere',
      siteLabel: 'Harbor Quarter',
      worldMapId: 'world_map.first_world',
      knownSettlementIds: ['settlement.saltmere', 'settlement.westreach', 'settlement.crown_bastion']
    },
    currency: {
      gold: 2418,
      silver: 37,
      copper: 12
    },
    originProfile: demoOriginProfile,
    reputation: [
      {
        id: 'rep.harbor_office',
        label: 'Saltmere Harbor Office',
        standingLabel: 'Honored',
        score: 82,
        effects: ['dock_fees_reduced', 'restricted_routes', 'rapid_inspection']
      },
      {
        id: 'rep.guild_consortium',
        label: 'Guild Consortium',
        standingLabel: 'Trusted',
        score: 68,
        effects: ['priority_bids', 'credit_line']
      }
    ],
    titles: [
      {
        id: 'title.sea_cartographer',
        label: 'Sea Cartographer',
        source: 'regional_exploration',
        equipped: true,
        effects: ['map_discovery_bonus', 'codex_insight_bonus']
      },
      {
        id: 'title.third_banner_reserve',
        label: 'Third Banner Reserve',
        source: 'military_service',
        equipped: false,
        effects: ['command_access', 'barracks_access']
      }
    ],
    discoveryChronicle: {
      entries: [
        {
          id: 'discovery.tideglass_coral',
          codexEntryId: 'flora.tideglass_coral',
          category: 'flora',
          title: 'Tideglass Coral',
          discoveredAtTick: 1403,
          discoveredAtLabel: 'Today, Dawn Watch',
          regionLabel: 'Glasswater',
          sourceType: 'survey',
          sourceId: 'quest.ashen_reef_survey',
          notes: ['Recovered from reef shelves during route inspection.', 'Logged into the harbor archive.']
        },
        {
          id: 'discovery.galehound_sign',
          codexEntryId: 'fauna.galehound',
          category: 'fauna',
          title: 'Galehound',
          discoveredAtTick: 1389,
          discoveredAtLabel: 'Yesterday, Midday',
          regionLabel: 'Stoneward March',
          sourceType: 'escort',
          sourceId: 'quest.stonepass_escort',
          notes: ['Observed fresh tracks and pack behavior near cliff lanes.']
        },
        {
          id: 'discovery.deepiron_grade',
          codexEntryId: 'minerals.deepiron',
          category: 'minerals',
          title: 'Deepiron',
          discoveredAtTick: 1360,
          discoveredAtLabel: '2 days ago',
          regionLabel: 'Stoneward March',
          sourceType: 'trade',
          sourceId: 'contract.rivet_shortfall_relief',
          notes: ['Assayed as shipyard-grade stock for rivet shortages.']
        },
        {
          id: 'discovery.survey_kit',
          codexEntryId: 'items.survey_kit',
          category: 'items',
          title: 'Survey Kit',
          discoveredAtTick: 1320,
          discoveredAtLabel: '4 days ago',
          regionLabel: 'Saltmere',
          sourceType: 'purchase',
          sourceId: 'market.saltmere',
          notes: ['Standardized field kit adopted for charting runs.']
        },
        {
          id: 'discovery.reef_notes',
          codexEntryId: 'notes.reef_survey',
          category: 'notes',
          title: 'Reef Survey Notes',
          discoveredAtTick: 1438,
          discoveredAtLabel: 'Today, High Sun',
          regionLabel: 'Glasswater',
          sourceType: 'study',
          sourceId: 'activity.charting_tides',
          notes: ['Merged harbor notices, prior charts, and crew testimony.']
        }
      ],
      lastUpdatedTick: 1438
    },
    discoveredRegions: ['region.sable_coast', 'region.stoneward_march', 'region.glasswater'],
    activeQuestIds: ['quest.ashen_reef_survey', 'quest.rivet_shortfall_relief'],
    completedQuestIds: ['quest.ledger_recovery'],
    flags: ['weather.storm_front_active', 'guild.harbor_priority'],
    saveMeta: {
      totalPlayTicks: 52340,
      lastRestAtTick: 1412,
      lastSavedAtTick: 1438
    }
  },
  worldState: {
    activeRegions: ['region.sable_coast', 'region.stoneward_march'],
    weatherState: {
      stormFront: 'Ashen Reef',
      tideWindow: 'dusk'
    }
  },
  civilizationState: {
    settlements: ['settlement.saltmere', 'settlement.westreach', 'settlement.crown_bastion'],
    markets: ['market.saltmere', 'market.westreach'],
    economy: {
      nodes: [],
      lastSnapshots: [],
      lastLevelTotals: [],
      marketStates: [],
      lastComputedTick: 1438
    },
    transport: {
      caravans: [],
      stockAdjustments: [],
      nextCaravanOrdinal: 1,
      assetReservations: [],
      lastEvaluatedOpportunities: [],
      lastProcessedTick: 1438
    },
    quests: {
      activeOffers: [],
      lastGeneratedTick: 1438
    }
  },
  sessionState: {
    activeEvents: ['event.weather.shift', 'event.market.price.updated'],
    flags: ['tutorial.complete', 'route.ashen_reef_scouted'],
    triggers: ['trigger.harbor_notice'],
    completedEvents: ['event.ledger.recovered'],
    trackedQuestId: 'quest.ashen_reef_survey',
    currentActivity: {
      id: 'activity.charting_tides',
      label: 'Charting Tides',
      category: 'Travel',
      detail: 'Preparing a safe reef departure window'
    },
    pinnedRecordIds: ['quest.ashen_reef_survey', 'region.sable_coast', 'flora.tideglass_coral'],
    notifications: [
      {
        id: 'note.caravan.westreach',
        title: 'Caravan reached Westreach',
        detail: 'Amber salt convoy sold 82% of stock above target value.',
        timeLabel: '4m ago',
        tone: 'success'
      },
      {
        id: 'note.contract.reef',
        title: 'Survey contract updated',
        detail: 'Ashen Reef route now lists storm risk as high until dusk.',
        timeLabel: '18m ago',
        tone: 'warning'
      },
      {
        id: 'note.codex.tideglass',
        title: 'New codex entry unlocked',
        detail: 'Tideglass coral can now be used in advanced fittings.',
        timeLabel: '1h ago',
        tone: 'accent'
      }
    ],
    knownLocations: [
      {
        id: 'location.saltmere',
        name: 'Saltmere',
        regionLabel: 'Sable Coast',
        type: 'harbor',
        x: 58,
        y: 44,
        note: 'Current player location with major harbor access.',
        known: true
      },
      {
        id: 'location.westreach',
        name: 'Westreach',
        regionLabel: 'Stoneward March',
        type: 'settlement',
        x: 31,
        y: 39,
        note: 'Timber and ore market with strong convoy demand.',
        known: true
      },
      {
        id: 'location.ashen_reef',
        name: 'Ashen Reef',
        regionLabel: 'Glasswater',
        type: 'ruin',
        x: 68,
        y: 58,
        note: 'Survey target with volatile weather and ruins.',
        known: true
      },
      {
        id: 'location.crown_bastion',
        name: 'Crown Bastion',
        regionLabel: 'Northwall',
        type: 'fort',
        x: 48,
        y: 22,
        note: 'Military staging point controlling inland passes.',
        known: true
      }
    ],
    worldRecords: [
      {
        id: 'region.sable_coast',
        sectionId: 'region',
        title: 'Sable Coast',
        subtitle: 'Storm-carved littoral region',
        meta: 'Coastal frontier',
        status: 'Moderate danger',
        summary: 'A wealthy but weather-beaten coast defined by trade, reefs, and guild ports.',
        tags: ['Salt', 'Fish', 'Ship Timber'],
        detailEntries: [
          { label: 'Climate', value: 'Wind-heavy, cold rain' },
          { label: 'Danger', value: 'Reef pirates and storm cells' },
          { label: 'Resources', value: 'Salt, fish oil, oak, coral glass' }
        ]
      },
      {
        id: 'region.stoneward_march',
        sectionId: 'region',
        title: 'Stoneward March',
        subtitle: 'Inland hills and mining roads',
        meta: 'Industrial interior',
        status: 'Stable',
        summary: 'A fortified production corridor feeding tools and masonry to the coast.',
        tags: ['Iron', 'Granite', 'Livestock'],
        detailEntries: [
          { label: 'Climate', value: 'Cool highland' },
          { label: 'Danger', value: 'Bandit lanes on minor roads' },
          { label: 'Resources', value: 'Iron, granite, wool, smoked meats' }
        ]
      },
      {
        id: 'settlement.saltmere',
        sectionId: 'settlement',
        title: 'Saltmere',
        subtitle: 'Harbor city',
        meta: 'Population 48,200',
        status: 'Supply surplus: rope',
        summary: 'Primary coastal trade hub with shipyards, guild halls, and naval patrol piers.',
        tags: ['Dockyards', 'Market', 'Guilds'],
        detailEntries: [
          { label: 'Population', value: '48,200' },
          { label: 'Demand', value: 'Hardwood planks, iron rivets' },
          { label: 'Services', value: 'Banking, drydock, guild exchange' }
        ]
      },
      {
        id: 'settlement.westreach',
        sectionId: 'settlement',
        title: 'Westreach',
        subtitle: 'March market town',
        meta: 'Population 11,400',
        status: 'Ore surplus',
        summary: 'A fortified trade town supplying worked ore, stone blocks, and caravan labor.',
        tags: ['Smelters', 'Convoys'],
        detailEntries: [
          { label: 'Population', value: '11,400' },
          { label: 'Demand', value: 'Salt, luxury cloth, navigation tools' },
          { label: 'Services', value: 'Barracks, mule station, assay office' }
        ]
      },
      {
        id: 'route.saltmere_westreach',
        sectionId: 'trade-routes',
        title: 'Saltmere to Westreach',
        subtitle: 'Coastal road and upland rise',
        meta: '146 miles',
        status: 'Risk: low',
        summary: 'Primary merchant road linking harbor intake to inland extraction markets.',
        tags: ['Road', 'Convoy'],
        detailEntries: [
          { label: 'Distance', value: '146 miles' },
          { label: 'Travel Time', value: '2.3 days by caravan' },
          { label: 'Risk', value: 'Low, patrol coverage active' }
        ]
      },
      {
        id: 'route.saltmere_ashen_reef',
        sectionId: 'trade-routes',
        title: 'Saltmere to Ashen Reef',
        subtitle: 'Open-water charting lane',
        meta: '83 nautical miles',
        status: 'Risk: high',
        summary: 'Storm-prone route with high discovery value and volatile salvage opportunities.',
        tags: ['Sea', 'Survey'],
        detailEntries: [
          { label: 'Distance', value: '83 nautical miles' },
          { label: 'Travel Time', value: '13 hours by cutter' },
          { label: 'Risk', value: 'High storm front' }
        ]
      },
      {
        id: 'travel.scout_ashen_reef',
        sectionId: 'travel',
        title: 'Scout Ashen Reef',
        subtitle: 'Player-planned travel action',
        meta: 'Departs at dusk',
        status: 'Weather lock',
        summary: 'Waiting for safer tide conditions before the survey vessel is released.',
        tags: ['Naval', 'Quest'],
        detailEntries: [
          { label: 'Distance', value: '83 nautical miles' },
          { label: 'Crew', value: '6 sailors' },
          { label: 'Readiness', value: 'Pending weather clearance' }
        ]
      },
      {
        id: 'travel.manifest_relay',
        sectionId: 'travel',
        title: 'Relay ore manifests to Saltmere',
        subtitle: 'Courier lane',
        meta: 'Leaves hourly',
        status: 'On schedule',
        summary: 'Clerical relay maintaining market forecasts between inland smelters and the docks.',
        tags: ['Road', 'Admin'],
        detailEntries: [
          { label: 'Carrier', value: 'Mounted courier' },
          { label: 'ETA', value: '7 hours' },
          { label: 'Risk', value: 'Minimal' }
        ]
      },
      {
        id: 'market.dock_rope',
        sectionId: 'local-market',
        title: 'Dock Rope',
        subtitle: 'Saltmere Exchange',
        meta: '21 crown / bale',
        status: 'Surplus',
        summary: 'Heavy harbor rope with stable surplus and reliable sell-side depth.',
        tags: ['Harbor', 'Crafted'],
        detailEntries: [
          { label: 'Price', value: '21 crown / bale' },
          { label: 'Demand', value: 'Low' },
          { label: 'Supply', value: 'High' }
        ]
      },
      {
        id: 'market.iron_rivets',
        sectionId: 'local-market',
        title: 'Iron Rivets',
        subtitle: 'Saltmere Exchange',
        meta: '48 crown / crate',
        status: 'Shortage',
        summary: 'Rivet shortage is limiting yard capacity and inflating vessel maintenance costs.',
        tags: ['Shipyard', 'Metal'],
        detailEntries: [
          { label: 'Price', value: '48 crown / crate' },
          { label: 'Demand', value: 'Very high' },
          { label: 'Supply', value: 'Low' }
        ]
      }
    ],
    activityRecords: [
      {
        id: 'job.harbor_surveyor',
        sectionId: 'employment',
        title: 'Harbor Surveyor',
        subtitle: 'Saltmere Harbor Office',
        meta: '320 crown / week',
        status: 'Renews in 3 days',
        summary: 'Paid civic role focused on route inspection, pier records, and hazard surveys.',
        tags: ['Exploration', 'Civic'],
        detailEntries: [
          { label: 'Pay', value: '320 crown / week' },
          { label: 'Duration', value: 'Ongoing, reviewed weekly' },
          { label: 'Bonus', value: 'Hazard pay on storm routes' }
        ]
      },
      {
        id: 'business.gannet_cutter',
        sectionId: 'businesses',
        title: 'Gannet Cutter',
        subtitle: 'Single-vessel survey and courier business',
        meta: 'Net 214 crown / day',
        status: 'Healthy',
        summary: 'Primary profit center built around scouting, cargo relays, and high-margin charter work.',
        tags: ['Naval', 'Trade'],
        detailEntries: [
          { label: 'Revenue', value: '418 crown / day' },
          { label: 'Expenses', value: '204 crown / day' },
          { label: 'Upgrades', value: 'Storm keel, chart locker, spare mast' }
        ]
      },
      {
        id: 'craft.waterproof_chart_case',
        sectionId: 'crafting',
        title: 'Waterproof Chart Case',
        subtitle: 'Shipwright bench',
        meta: '2.5h craft time',
        status: 'Ready',
        summary: 'Protective case for map items, journals, and sea warrants.',
        tags: ['Leather', 'Utility'],
        detailEntries: [
          { label: 'Materials', value: 'Treated leather, brass clasp, waxed cord' },
          { label: 'Output', value: '1 chart case' },
          { label: 'Margin', value: '+18 crown projected' }
        ]
      },
      {
        id: 'trade.amber_salt_convoy',
        sectionId: 'trade',
        title: 'Amber Salt Convoy',
        subtitle: 'Saltmere to Westreach',
        meta: 'Projected margin 17%',
        status: 'En route',
        summary: 'Bulk salt moved inland to stabilize curing and preserved-food production.',
        tags: ['Caravan', 'Bulk'],
        detailEntries: [
          { label: 'Cargo', value: '12 salt pallets' },
          { label: 'ETA', value: '14 hours' },
          { label: 'Insurance', value: 'Guild-covered' }
        ]
      },
      {
        id: 'contract.ashen_reef',
        sectionId: 'contracts',
        title: 'Ashen Reef Survey',
        subtitle: 'Harbor Office contract',
        meta: 'Reward 580 crown',
        status: 'Tracked',
        summary: 'Survey the reef lanes, confirm ruin coordinates, and assess safe vessel draft.',
        tags: ['Exploration', 'Naval'],
        detailEntries: [
          { label: 'Pay', value: '580 crown + salvage rights' },
          { label: 'Duration', value: '3 days' },
          { label: 'Deliverable', value: 'Verified chart packet' }
        ]
      },
      {
        id: 'military.third_banner_drill',
        sectionId: 'military',
        title: 'Third Banner Drill',
        subtitle: 'Reserve command duties',
        meta: 'Weekly',
        status: 'Optional attendance',
        summary: 'Reserve training keeps command access current and officers familiar with new recruits.',
        tags: ['Command', 'Reserve'],
        detailEntries: [
          { label: 'Role', value: 'Reserve line captain' },
          { label: 'Pay', value: 'Honor stipend only' },
          { label: 'Benefit', value: 'Command standing preserved' }
        ]
      },
      {
        id: 'naval.harbor_patrol',
        sectionId: 'naval',
        title: 'Harbor Patrol Escort',
        subtitle: 'Coastal security sweep',
        meta: 'Next launch at noon',
        status: 'Open slot',
        summary: 'A paid escort operation that builds standing with naval officials and harbor guards.',
        tags: ['Combat', 'Escort'],
        detailEntries: [
          { label: 'Pay', value: '190 crown' },
          { label: 'Duration', value: '6 hours' },
          { label: 'Risk', value: 'Moderate, weather dependent' }
        ]
      },
      {
        id: 'operations.drydock_queue',
        sectionId: 'operations',
        title: 'Drydock Queue',
        subtitle: 'Concurrent shipyard actions',
        meta: '3 active slots',
        status: '1 blocked by rivets',
        summary: 'The shipyard pipeline is operating near capacity but constrained by iron fasteners.',
        tags: ['Production', 'Queue'],
        detailEntries: [
          { label: 'Active Slots', value: '3 / 4' },
          { label: 'Blocker', value: 'Iron rivets shortage' },
          { label: 'Output', value: '1 refit, 2 maintenance jobs' }
        ]
      }
    ],
    operations: [
      {
        id: 'op.keel_refit',
        title: 'Refit cutter keel',
        stage: 'Shipyard work',
        progress: 68,
        etaLabel: '5h',
        owner: 'Saltmere Drydock',
        output: 'Storm-rated scout cutter',
        priority: 'High'
      },
      {
        id: 'op.manifest_delivery',
        title: 'Deliver ore manifests',
        stage: 'Courier relay',
        progress: 41,
        etaLabel: '2h',
        owner: 'Westreach clerks',
        output: 'Updated pricing ledger',
        priority: 'Normal'
      },
      {
        id: 'op.provisioning',
        title: 'Provision reef expedition',
        stage: 'Supply packing',
        progress: 84,
        etaLabel: '45m',
        owner: 'Quartermaster Vara',
        output: '3-day expedition kit',
        priority: 'Low'
      }
    ],
    codexEntries: [
      {
        id: 'flora.tideglass_coral',
        category: 'flora',
        title: 'Tideglass Coral',
        subtitle: 'Luminescent reef growth',
        status: 'Rare',
        summary: 'A luminous reef coral prized for optics, ceremonial inlays, and waterproof fittings.',
        tags: ['Glasswater', 'Crafting', 'Marine'],
        habitat: 'Reef shelves with cold tide exchange',
        uses: 'Lenswork, signal lanterns, luxury fittings',
        valueDescription: 'High',
        regionTags: ['Glasswater', 'Sable Coast']
      },
      {
        id: 'fauna.galehound',
        category: 'fauna',
        title: 'Galehound',
        subtitle: 'Lean cliff-running predator',
        status: 'Dangerous',
        summary: 'A fast pack hunter adapted to exposed cliff paths and scree fields.',
        tags: ['Northwall', 'Predator'],
        habitat: 'Wind-carved escarpments',
        uses: 'Hide, fang resin, patrol warning signs',
        valueDescription: 'Moderate',
        regionTags: ['Northwall', 'Stoneward March']
      },
      {
        id: 'minerals.deepiron',
        category: 'minerals',
        title: 'Deepiron',
        subtitle: 'Dense forging ore',
        status: 'Strategic',
        summary: 'Heavy ore used for reinforced fittings, anchors, and military-grade fasteners.',
        tags: ['Stoneward March', 'Metal'],
        habitat: 'Deep hill veins and cooled intrusions',
        uses: 'Rivets, anchors, armored tools',
        valueDescription: 'High',
        regionTags: ['Stoneward March']
      },
      {
        id: 'items.survey_kit',
        category: 'items',
        title: 'Survey Kit',
        subtitle: 'Composite exploration pack',
        status: 'Standard',
        summary: 'A modular kit containing line, wax tablets, markers, and field lenses.',
        tags: ['Travel', 'Utility'],
        habitat: 'Issued in ports and frontier offices',
        uses: 'Mapping, logging, hazard marking',
        valueDescription: 'Moderate',
        regionTags: ['Sable Coast', 'Northwall']
      },
      {
        id: 'recipes.saltproof_varnish',
        category: 'recipes',
        title: 'Saltproof Varnish',
        subtitle: 'Marine coating formula',
        status: 'Refined',
        summary: 'Resin blend used to reduce seawater wear on wood, canvas, and treated leather.',
        tags: ['Crafting', 'Shipwright'],
        habitat: 'Harbor workshops and alchemy benches',
        uses: 'Hull treatment, cloak waxing, kit repair',
        valueDescription: 'Moderate to high',
        regionTags: ['Saltmere', 'Glasswater']
      },
      {
        id: 'factions.harbor_office',
        category: 'factions',
        title: 'Saltmere Harbor Office',
        subtitle: 'Civic port authority',
        status: 'Influential',
        summary: 'Controls docking licenses, route notices, and lawful salvage registrations.',
        tags: ['Civic', 'Travel'],
        habitat: 'Saltmere harbor district',
        uses: 'Permits, contracts, route legitimacy',
        valueDescription: 'High political leverage',
        regionTags: ['Sable Coast']
      },
      {
        id: 'notes.reef_survey',
        category: 'notes',
        title: 'Reef Survey Notes',
        subtitle: 'Personal working brief',
        status: 'Updated',
        summary: 'Annotated observations combining harbor bulletins, older charts, and crew testimony.',
        tags: ['Quest', 'Travel'],
        habitat: 'Player journal',
        uses: 'Quest planning, risk tracking',
        valueDescription: 'Operational',
        regionTags: ['Glasswater', 'Sable Coast']
      },
      {
        id: 'flora.unknown_bloom',
        category: 'flora',
        title: 'Unknown Bloom',
        subtitle: 'Undiscovered flora entry',
        status: '???',
        summary: 'This entry has not been identified in the field.',
        tags: ['Unknown'],
        habitat: 'Unknown',
        uses: 'Unknown',
        valueDescription: 'Unknown',
        regionTags: ['Unknown'],
        locked: true
      }
    ],
    questJournal: [
      {
        id: 'quest.ashen_reef_survey',
        category: 'active',
        title: 'Ashen Reef Survey',
        regionLabel: 'Glasswater',
        rewardLabel: '580 crown + salvage rights',
        summary: 'Survey the reef lanes, confirm ruin coordinates, and file a safe-draft chart.',
        statusLabel: 'Tracked',
        tracked: true,
        objectives: [
          'Survey reef lanes: 0 / 3 sectors complete',
          'Confirm ruin markers: pending',
          'Return chart packet to Saltmere Harbor Office'
        ],
        rewards: ['580 crown', 'Registered salvage rights'],
        relatedLocations: ['Saltmere', 'Ashen Reef'],
        tags: ['Exploration', 'Naval']
      },
      {
        id: 'quest.rivet_shortfall_relief',
        category: 'contracts',
        title: 'Rivet Shortfall Relief',
        regionLabel: 'Stoneward March',
        rewardLabel: '410 crown',
        summary: 'Secure a fast shipment of deepiron rivets for the Saltmere drydocks.',
        statusLabel: 'Open contract',
        objectives: [
          'Acquire rivets: 0 / 6 crates',
          'Escort shipment for optional bonus',
          'Return cargo to Saltmere Drydock'
        ],
        rewards: ['410 crown', 'Drydock discount for 7 days'],
        relatedLocations: ['Westreach', 'Saltmere'],
        tags: ['Trade', 'Craft']
      },
      {
        id: 'quest.ledger_recovery',
        category: 'completed',
        title: 'Ledger Recovery',
        regionLabel: 'Saltmere',
        rewardLabel: 'Completed',
        summary: 'Recovered stolen customs ledgers and returned them to the harbor office.',
        statusLabel: 'Turned in',
        objectives: ['Recover the ledgers', 'Return them to the harbor office'],
        rewards: ['220 crown', '+8 harbor standing'],
        relatedLocations: ['Saltmere alleys', 'Harbor office'],
        tags: ['Social', 'Civic']
      },
      {
        id: 'quest.stonepass_escort',
        category: 'failed',
        title: 'Stonepass Escort',
        regionLabel: 'Northwall',
        rewardLabel: 'Failed',
        summary: 'Escort contract failed when the client abandoned the route after weather collapse.',
        statusLabel: 'Route closed',
        objectives: ['Protect the client through Stonepass'],
        rewards: ['No payout'],
        relatedLocations: ['Crown Bastion', 'Stonepass'],
        tags: ['Combat', 'Travel']
      }
    ],
    chronicle: [
      {
        id: 'chronicle.salt_convoy',
        category: 'trade',
        title: 'Amber salt convoy sold above estimate',
        timeLabel: 'Today, Dawn Watch',
        summary: 'The convoy reached Westreach and cleared inventory into a supply gap.',
        statusLabel: '+164 crown',
        entities: ['Gannet Cutter', 'Westreach exchange', 'Merchant guild'],
        results: ['82% sell-through at premium price'],
        statChanges: ['+164 crown', '+2 guild trust'],
        tags: ['Westreach', 'Margin']
      },
      {
        id: 'chronicle.tideglass_discovery',
        category: 'discovery',
        title: 'Reef coral identified as tideglass variant',
        timeLabel: 'Yesterday, Midday',
        summary: 'Field analysis confirmed the coral sample could be refined for marine optics.',
        statusLabel: 'New codex entry',
        entities: ['Arden Voss', 'Reef sample kit', 'Harbor archivist'],
        results: ['Tideglass Coral unlocked in codex'],
        statChanges: ['+1 codex completion', '+6 insight XP'],
        tags: ['Glasswater', 'Codex']
      },
      {
        id: 'chronicle.harbor_reputation',
        category: 'reputation',
        title: 'Harbor office reputation improved',
        timeLabel: 'Yesterday, Dusk',
        summary: 'Reliable chart delivery and clean ledgers improved official standing.',
        statusLabel: '+8 standing',
        entities: ['Harbor office', 'Dock clerks', 'Quartermaster Vara'],
        results: ['Access to priority dock queue'],
        statChanges: ['+8 standing', 'Dock fees reduced'],
        tags: ['Saltmere', 'Contracts']
      },
      {
        id: 'chronicle.keel_refit',
        category: 'crafting',
        title: 'Storm keel retrofit started',
        timeLabel: '2 days ago',
        summary: 'The cutter is now in drydock for upgraded storm handling.',
        statusLabel: 'Queue active',
        entities: ['Saltmere drydock', 'Shipwright crew', 'Rivet stockpile'],
        results: ['Projected handling bonus once complete'],
        statChanges: ['-240 crown reserve', '+naval capacity pending'],
        tags: ['Drydock', 'Naval']
      },
      {
        id: 'chronicle.patrol_reroute',
        category: 'travel',
        title: 'Harbor patrol rerouted by storm warning',
        timeLabel: '3 days ago',
        summary: 'Escort lanes were shifted to inner waters to avoid a severe front.',
        statusLabel: 'Delayed',
        entities: ['Harbor wardens', 'Patrol cutter', 'Outbound merchants'],
        results: ['Escort schedule preserved with delay'],
        statChanges: ['+2 fatigue', 'No hull damage'],
        tags: ['Weather', 'Escort']
      }
    ]
  }
};
