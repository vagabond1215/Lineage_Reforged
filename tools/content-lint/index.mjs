import { readFile as readFileRaw } from "node:fs/promises";
import path from "node:path";
import { SPELL_SCALING_CHANNELS_BY_SCHOOL } from "../../packages/engines/player-engine/src/progression.js";
import {
  assertSupportedCombatEffectChannels,
  assertSupportedCombatResolutionHooks,
  isUtilityOnlyItemUseProfile
} from "./combat-hook-support.mjs";
import {
  assertKnownSpellItemGenerationHooks,
  assertKnownSpellResolutionHooks
} from "./spell-hook-support.mjs";

async function readFile(filePath, options) {
  const raw = await readFileRaw(filePath, options);
  return typeof raw === "string" && raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

const ROOT = process.cwd();
const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ITEM_KEY_PATTERN = /^(?:[a-z0-9]+(?:_[a-z0-9]+)*|[a-z]+\.[a-z0-9]+(?:_[a-z0-9]+)*)$/;
const RESOURCE_ITEM_PREFIX_PATTERN = /^(flora|fauna|mineral)\./;
const ITEM_PROCESSING_GROUP_PATTERN = /^[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const LEGACY_ROLE_OUTPUT_PATTERN = /^(ingredient|material)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const GEO_QUALIFIER_PATTERN = /\b(american|european|asian|african|oregon|texas|california|alaskan)\b/i;

const FLORA_TYPES = new Set(["tree", "shrub", "herb", "grass", "fungi"]);
const FLORA_LIFECYCLES = new Set(["annual", "biennial", "perennial"]);
const FLORA_NEEDS = new Set(["low", "medium", "high"]);
const FLORA_REGROWTH_PERIODS = new Set(["none", "growth_season", "annual"]);
const FLORA_STAGES = new Set(["germination", "vegetative", "flowering", "fruiting", "dormancy"]);
const HABITAT_SHAPES = new Set(["patch", "linear", "point", "edge", "volume"]);

const FAUNA_TYPES = new Set(["mammal", "reptile", "avian", "fish", "amphibian", "arthropod", "mollusk"]);
const FAUNA_DIETS = new Set(["herbivore", "omnivore", "carnivore", "detritivore"]);
const FAUNA_DANGER_CLASSES = new Set(["none", "low", "medium", "high"]);
const FAUNA_SIZE_CLASSES = new Set(["small", "medium", "large", "colossal"]);
const FAUNA_BEHAVIORS = new Set(["aggressive", "docile", "territorial", "passive"]);
const FAUNA_MOVEMENTS = new Set(["sedentary", "migration", "nomadic"]);
const FAUNA_HYDRATION_NEEDS = new Set(["low", "medium", "high"]);
const FAUNA_ACTIVE_TIMES = new Set(["diurnal", "nocturnal", "crepuscular"]);
const FAUNA_REPRODUCTION_TYPES = new Set(["oviparous", "viviparous", "asexual"]);
const FAUNA_PRODUCER_SEX = new Set(["female", "male", "any"]);
const FAUNA_PRODUCER_WINDOWS = new Set(["daily", "seasonal", "weekly"]);

const CLIMATE_SEASONS = ["Winter", "Thaw", "Spring", "Summer", "Harvest", "Withering"];
const CLIMATE_UNITS = new Set(["celsius", "fahrenheit", "kelvin"]);
const CLIMATE_SEASON_RATIOS = {
  Winter: { low: 0, high: 0.3 },
  Thaw: { low: 0.1, high: 0.55 },
  Spring: { low: 0.25, high: 0.75 },
  Summer: { low: 0.55, high: 1 },
  Harvest: { low: 0.4, high: 0.85 },
  Withering: { low: 0.15, high: 0.6 }
};
const CLIMATE_EPSILON = 0.000001;
const CLIMATE_WEEKS_PER_YEAR = 52;
const CALENDAR_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const FAUNA_PRODUCT_GROUPS = ["items", "materials", "ingredients", "byproducts"];
const GENERIC_PROPAGULE_KEYS = new Set(["seed", "seeds", "seed_mix", "bulb", "bulbs", "start", "starts", "propagule", "propagules"]);
const WORKPLACE_CATEGORIES = new Set(["extraction", "processing", "manufacturing", "distribution"]);
const WORKPLACE_TECH_LEVELS = new Set(["primitive", "basic", "improved", "advanced", "masterwork"]);
const WORKPLACE_OWNERSHIP_MODELS = new Set(["subsistence", "independent", "guild", "estate", "civic"]);
const WORKPLACE_WEALTH_BANDS = new Set(["low_income", "mid_income", "high_income"]);
const WORKPLACE_FACILITY_FORMS = new Set(["camp", "hut", "cabin", "lodge", "hall", "guildhouse", "workshop", "estate", "compound", "outpost"]);
const WORKPLACE_INTEGRATION_ROLES = new Set([
  "gathering",
  "primary_processing",
  "secondary_processing",
  "aging",
  "distillation",
  "bottling",
  "distribution",
  "integrated"
]);
const WORKPLACE_TRACK_ID_PATTERN = /^track\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const WORKPLACE_COMBO_ID_PATTERN = /^combo\.[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const WORKPLACE_BUSINESS_SCALES = new Set(["micro", "small", "medium", "large", "estate"]);
const WORKPLACE_CONSUMER_SCOPES = new Set(["self_use", "local", "district", "regional", "export"]);
const WORKPLACE_SUPPLY_ACCESS = new Set(["scarce", "constrained", "balanced", "surplus"]);
const WORKPLACE_RISK_TOLERANCE = new Set(["safe", "frontier", "dangerous"]);
const CHAIN_FACILITY_MODES = new Set(["compact", "tiered", "segmented", "integrated"]);
const WORKPLACE_JOB_ID_PATTERN = /^job\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const WORKPLACE_WORKFORCE_ROLES = new Set(["primary", "support", "specialist", "management"]);
const WORKPLACE_TOOL_TAG_PATTERN = /^tool\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const WORKPLACE_MISSING_TOOL_PENALTY_MODES = new Set(["reduced_output", "no_output"]);
const WORKPLACE_IO_CONSUMPTION_TYPES = new Set(["consumed"]);
const WORKPLACE_IO_PRODUCTION_TYPES = new Set(["primary", "byproduct"]);
const WORKPLACE_YIELD_GROUP_SELECTION_MODES = new Set(["weighted_pool", "deterministic_bundle"]);
const WORKPLACE_IRRIGATION_SOURCE_TYPES = new Set(["well", "ditch", "wood_lined_channel", "stone_culvert", "aqueduct"]);
const WORKPLACE_IRRIGATION_RENEWABILITY = new Set(["effectively_unbounded", "recharging", "bounded"]);
const WORKPLACE_IRRIGATION_DELIVERY_LATENCY = new Set(["high", "moderate", "low", "minimal"]);
const WORKPLACE_IRRIGATION_MAINTENANCE = new Set(["seasonal", "annual", "minimal"]);
const WORKPLACE_IRRIGATION_EROSION = new Set(["high", "low", "none"]);
const WORKPLACE_IRRIGATION_CROSS_INFRA = new Set(["none", "wood_and_stone", "full"]);
const WORKPLACE_IRRIGATION_PREFERRED_SOURCES = new Set(["major_river", "large_lake", "spring", "deep_aquifer"]);
const WORKPLACE_PLOT_TYPES = new Set(["garden", "farmland", "raised_bed", "orchard", "terraced_farm", "terraced_orchard", "greenhouse"]);
const WORKPLACE_PLOT_SPECIALTY_UPGRADES = new Set(["terracing", "greenhouse", "raised_beds", "built_in_irrigation"]);
const WORKPLACE_PLOT_TERRAINS = new Set(["flat", "rolling", "hillside", "mountain", "wetland"]);
const WORKPLACE_UPGRADE_ID_PATTERN = /^upgrade\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const WORKPLACE_UPGRADE_CATEGORIES = new Set([
  "tooling",
  "infrastructure",
  "logistics",
  "safety",
  "storage",
  "quality",
  "operations",
  "comfort"
]);
const WORKPLACE_PROGRESS_POWER_MODES = new Set(["manual", "animal", "water", "wind", "steam", "hybrid"]);
const INFRASTRUCTURE_CATEGORIES = new Set(["waterworks", "transport", "defense", "civic", "utility", "agriculture"]);
const INFRASTRUCTURE_TYPES = new Set(["irrigation", "road", "wall", "gate", "aqueduct", "bridge", "canal", "fortification", "utility"]);
const MEAT_CUT_SPECIES_CATEGORIES = new Set(["game", "livestock", "seafood"]);
const WORLD_REGION_TYPES = new Set(["continent", "subregion", "island_system", "ocean"]);
const WORLD_POPULATION_DENSITY_BANDS = new Set(["very_high", "high", "moderate", "low", "very_low"]);
const WORLD_HEX_FRESHWATER_TYPES = new Set(["none", "stream", "river", "coast", "marsh"]);
const WORLD_HEX_EDGE_TYPES = new Set(["road", "trail", "river", "pass", "ferry", "sea_lane", "none"]);
const WORLD_ROUTE_QUALITIES = new Set(["low", "medium", "high"]);
const WORLD_MAP_TYPES = new Set(["world"]);
const REGIONAL_ECOLOGY_COVERAGE_BANDS = new Set(["surplus", "strong", "moderate", "limited", "scarce", "none"]);
const TRAVEL_MODE_DOMAINS = new Set(["land", "water"]);
const TRAVEL_ROUTE_CLASSES = new Set(["road_corridor", "pack_track", "river_corridor", "mixed_corridor", "coastal_lane"]);
const TRANSPORT_PROPULSION_TYPES = new Set(["human", "draft_animals", "pack_train", "crew"]);
const GUILD_CATEGORIES = new Set(["mercantile", "martial", "gathering", "crafting", "logistics", "civic", "service"]);
const GUILD_ENTRY_METHODS = new Set(["buy_in", "task_trial", "sponsorship", "oath", "charter"]);
const RELIGION_GENDERS = new Set(["female", "male"]);
const RELIGION_ELEMENTS = new Set(["light", "water", "wind", "ice", "darkness", "fire", "stone", "earth", "thunder"]);
const RELIGION_RELATIONSHIPS = new Set(["opposed", "dominant"]);
const RELIGION_ORGANIZATION_CATEGORIES = new Set(["elemental_order", "prismatic_enclave", "unbound"]);
const RELIGION_MAGIC_SUPPORT_LEVELS = new Set(["none", "limited", "moderate", "high"]);
const MAGIC_SERVICE_CATEGORIES = new Set(["adventurer_magic", "utility_enchantment", "ritual_religious"]);
const MAGIC_SERVICE_SCALE_BANDS = new Set(["small", "moderate", "large"]);
const CRYSTAL_TIERS = new Set(["shard", "crystal", "cluster"]);
const CRYSTAL_ATTUNEMENT_MODES = new Set(["fixed", "attunable"]);
const QUEST_TEMPLATE_CATEGORIES = new Set([
  "gathering",
  "hunting",
  "domestic_labor",
  "escort",
  "porter",
  "exploration",
  "monster_subjugation",
  "salvage"
]);
const QUEST_TEMPLATE_SOURCES = new Set(["shortfall", "surplus", "security", "frontier"]);
const MONSTER_CLASSES = new Set(["beast", "humanoid", "ooze", "elemental", "undead", "giantkin"]);
const MONSTER_THREATS = new Set(["low", "moderate", "high", "severe"]);
const MONSTER_VARIANT_TYPES = new Set([
  "species_only",
  "biological",
  "evolved",
  "elemental",
  "material",
  "cursed",
  "transformed",
  "supernatural"
]);
const MONSTER_ATTUNEMENT_LEVELS = new Set(["unattuned", "low", "moderate", "high"]);
const MONSTER_APPEARANCE_RATES = new Set(["common", "uncommon", "rare", "lair_only"]);
const MONSTER_SECURE_SETTLEMENT_RULES = new Set([
  "blocked_without_open_path",
  "requires_subsurface_access",
  "requires_open_water_access",
  "can_bypass_if_airspace_unsecured",
  "requires_affinity_breach",
  "summoned_only"
]);
const SETTLEMENT_TYPES = new Set([
  "hamlet",
  "outpost",
  "village",
  "market_town",
  "town",
  "city",
  "fort",
  "citadel",
  "harbor_town",
  "port_city",
  "estate",
  "monastery",
  "ferry_post",
  "camp",
  "waystation"
]);
const SETTLEMENT_POPULATION_BANDS = new Set(["tiny", "small", "modest", "large", "major"]);
const SETTLEMENT_ADMIN_ROLES = new Set(["none", "local", "subregional", "regional", "continental"]);
const SETTLEMENT_INFRA_LEVELS = new Set(["rudimentary", "frontier", "established", "developed", "civic", "grand"]);
const SETTLEMENT_TRADE_DIRECTIONS = new Set(["exports_to", "imports_from", "exchange_with"]);
const SETTLEMENT_ROUTE_MODES = new Set(["road", "river", "coastal", "canal", "pack", "sea_lane"]);
const SETTLEMENT_GUILD_PRESENCE_LEVELS = new Set(["outpost", "hall", "chapterhouse", "guildhouse", "exchange", "great_house"]);
const SETTLEMENT_SITE_CLASSES = new Set(["surface", "subterranean", "underwater"]);
const SETTLEMENT_DEPENDENCY_BANDS = new Set(["low", "moderate", "high"]);
const BUILDING_CATEGORIES = new Set(["agrarian", "extractive", "industrial", "trade", "storage", "civic", "military", "maritime", "hospitality", "service"]);
const BUILDING_STORAGE_TYPES = new Set(["granary", "cellar", "warehouse", "vault"]);
const SETTLEMENT_DEPENDENCY_ROLES = new Set([
  "satellite_hamlet",
  "estate_supply",
  "resource_camp",
  "ferry_crossing",
  "monastic_estate",
  "watch_post",
  "waystation",
  "harbor_support",
  "seasonal_station"
]);
const DEPENDENT_SETTLEMENT_TYPES = new Set(["hamlet", "estate", "monastery", "ferry_post", "camp", "waystation"]);
const ITEM_ROLE_VALUES = new Set(["consumable", "ingredient", "material", "reagent", "trade_good", "fuel"]);
const ITEM_STAGE_VALUES = new Set(["raw", "refined", "processed", "finished"]);
const ITEM_VALUE_MODES = new Set(["source_derived", "recipe_derived"]);
const ITEM_MATERIAL_COST_MODELS = new Set(["source_effort", "input_rollup"]);
const ITEM_LABOR_INTENSITIES = new Set(["light", "moderate", "heavy"]);
const ITEM_PROCESSING_INTENSITIES = new Set(["minimal", "standard", "fuel_heavy", "precision"]);
const ITEM_DIFFICULTY_TIERS = new Set(["easy", "moderate", "hard", "expert"]);
const ITEM_DEMAND_BANDS = new Set(["subsistence", "common", "utility", "specialty", "luxury"]);
const ITEM_MATERIAL_FAMILIES = new Set(["wood", "metal", "textile", "leather"]);
const ITEM_WORKABILITY_VALUES = new Set(["easy", "moderate", "hard"]);
const ITEM_HARDNESS_VALUES = new Set(["soft", "medium", "hard"]);
const ITEM_REFINEMENT_DIFFICULTIES = new Set(["low", "moderate", "high"]);
const ITEM_PROCESSING_COST_IMPACTS = new Set(["light", "moderate", "heavy"]);
const PLAYER_SKILL_CATEGORIES = new Set(["resource", "survival", "combat", "magic", "crafting", "knowledge", "settlement", "leadership"]);
const PLAYER_ATTRIBUTE_KEYS = new Set(["STR", "DEX", "AGI", "CON", "VIT", "WIS", "INT", "SPT", "CHA"]);
const PLAYER_STARTER_SKILL_DEFAULT_CAP = 25;
const PLAYER_STARTER_SKILL_ABSOLUTE_CAP = 30;
const PLAYER_BACKSTORY_MAX_STARTING_SKILL_COUNT = 5;
const PLAYER_PROGRESS_TRACK_TYPES = new Set([
  "resource",
  "survival",
  "combat_fundamentals",
  "weapon",
  "defense",
  "armor",
  "tactical_combat",
  "magic_core",
  "magic_school",
  "crafting",
  "settlement",
  "leadership",
  "knowledge"
]);
const PLAYER_ABILITY_CATEGORIES = new Set(["melee", "ranged", "tactical", "defensive", "command", "reaction"]);
const PLAYER_SPELL_SCHOOLS = new Set(Object.keys(SPELL_SCALING_CHANNELS_BY_SCHOOL));
const PLAYER_SPELL_SCALING_CHANNELS = new Set([
  "power",
  "duration",
  "magnitude",
  "radius",
  "manaEfficiency",
  "accuracy",
  "healingPower",
  "barrier",
  "charges",
  "statusChance",
  "summonPotency",
  "tempo"
]);
const PLAYER_SPELL_SCALING_CHANNELS_BY_SCHOOL = Object.fromEntries(
  Object.entries(SPELL_SCALING_CHANNELS_BY_SCHOOL).map(([school, channels]) => [school, new Set(channels)])
);
const PLAYER_TITLE_FAMILIES = new Set(["combat", "crafting", "magic", "knowledge", "faith"]);
const PLAYER_CRAFT_SKILL_DIMENSIONS = new Set(["timeEfficiency", "waste", "quality", "quantity"]);
const LEGACY_UNLOCK_METADATA_IDENTIFIER_PATTERN = /^[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const LEGACY_UNLOCK_PURCHASE_MODES = new Set(["permanent", "unlock_only", "preparation"]);
const LEGACY_UNLOCK_CURRENCIES = new Set([
  "account_legacy",
  "family_prestige",
  "regional_renown",
  "knowledge_marks",
  "chronicle_milestones",
  "skill_marks"
]);
const LEGACY_UNLOCK_SCOPES = new Set([
  "account",
  "family",
  "region",
  "character_start",
  "next_run",
  "heir_only",
  "catalog_only"
]);
const LEGACY_UNLOCK_DURATIONS = new Set([
  "permanent",
  "next_character",
  "current_run",
  "limited_days"
]);
const LEGACY_UNLOCK_IMPLEMENTATION_PRIORITIES = new Set(["live", "catalog_only", "backlog"]);
const LEGACY_UNLOCK_EFFECT_KINDS = new Set([
  "account_flag",
  "profile_title",
  "chronicle_presentation",
  "future_heir_start",
  "future_inheritance_uses",
  "preparation_capacity",
  "next_run_preparation",
  "future_starting_item",
  "future_attribute_preparation",
  "future_resource_preparation",
  "future_lineage_retention",
  "future_renown",
  "future_preparation_discount"
]);
const TACTICAL_ROLE_IDS = new Set([
  "frontliner",
  "disruptor",
  "ranged_pressure",
  "healer",
  "support_buffer",
  "debuffer_controller",
  "opportunist",
  "tank_protector",
  "flexible_adaptive"
]);
const TACTICAL_BIASES = new Set(["avoid", "low", "normal", "high", "critical"]);
const SPELL_TIER_PREFERENCES = new Set(["low", "balanced", "high"]);
const COMBAT_TARGET_RULE_IDS = new Set([
  "lowest_hp",
  "highest_hp",
  "lowest_mp",
  "highest_mp",
  "lowest_stamina",
  "highest_stamina",
  "lowest_max_hp",
  "highest_max_hp",
  "lowest_max_mp",
  "highest_max_mp",
  "lowest_max_stamina",
  "highest_max_stamina",
  "weakest_to_element",
  "highest_threat",
  "currently_casting",
  "easiest_to_interrupt",
  "nearest",
  "farthest",
  "focus_current_player_target",
  "ignore_specific_targets",
  "melee_focus",
  "melee_ignore",
  "ranged_focus",
  "ranged_ignore",
  "magic_focus",
  "magic_ignore"
]);
const COMBAT_ENCOUNTER_DISPOSITIONS = new Set(["hostile", "friendly", "neutral"]);
const COMBAT_MOVEMENT_MODES = new Set(["roaming", "fixed"]);
const COMBAT_DENSITY_BANDS = new Set(["rare", "sporadic", "steady", "dense"]);
const COMBAT_PREFERRED_RANGES = new Set(["melee", "ranged", "magic"]);
const COMBAT_ACTION_PACKAGE_IDS = new Set([
  "melee_skirmisher",
  "melee_brute",
  "disruptor_bash",
  "ranged_harrier",
  "elemental_burst",
  "enfeebling_burst"
]);
const CHAIN_RECIPE_CLASSES = new Set([
  "alchemy",
  "rendering",
  "brewing",
  "ceramics",
  "cooperage",
  "agriculture",
  "cooking",
  "baking",
  "milling",
  "preserving",
  "dairy_processing",
  "glassmaking",
  "leatherworking",
  "woodworking",
  "metalsmithing",
  "assembly",
  "binding",
  "tailoring",
  "forging",
  "butchery"
]);
const CHAIN_STEP_OPERATIONS = new Set([
  "process",
  "gather",
  "harvest",
  "mill",
  "bake",
  "mix",
  "cook",
  "assemble_meal",
  "preserve",
  "smoke_cure",
  "butcher",
  "reduce_sugar",
  "smelt",
  "refine_forge",
  "forge_assemble",
  "shape_wood",
  "coop",
  "assemble_frame",
  "fletch_assemble",
  "cut_sew",
  "spin_weave",
  "bind",
  "tan_finish",
  "compound",
  "glasswork",
  "fire_shape",
  "cast_pour",
  "roast",
  "scribe"
]);
const CHAIN_MATERIAL_DIFFICULTY_MODES = new Set(["input_weighted"]);
const CHAIN_LOW_SKILL_OUTCOMES = new Set(["higher_labor_and_waste"]);
const CANONICAL_ITEM_MARKET_SOURCES = new Set(["items.catalog", "civilization", "economy.generic"]);


const checks = [
  {
    file: "packages/content/base/world/biomes.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/world/habitats.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true,
    validateHabitatBiomes: true
  },
  {
    file: "packages/content/base/world/flora.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true,
    validateFloraTemplate: true
  },
  {
    file: "packages/content/base/world/fauna.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true,
    validateFaunaTemplate: true
  },
  {
    file: "packages/content/base/world/minerals.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/items/items.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateItemCatalog: true
  },
  {
    file: "packages/content/base/civilization/market_item_values.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateMarketItemValues: true
  },
  {
    file: "packages/content/base/civilization/workplaces.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateWorkplaces: true
  },
  {
    file: "packages/content/base/civilization/workplace_abstractions.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateWorkplaceAbstractions: true
  },
  {
    file: "packages/content/base/civilization/buildings.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateBuildings: true
  },
  {
    file: "packages/content/base/civilization/infrastructure.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateInfrastructure: true
  },
  {
    file: "packages/content/base/civilization/production_chains.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateProductionChains: true
  },
  {
    file: "packages/content/base/civilization/meat_cut_standards.json",
    requiredTopLevel: ["records", "sausageUnitStandard"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateMeatCutStandards: true
  },
  {
    file: "packages/content/base/civilization/guilds.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateGuilds: true
  },
  {
    file: "packages/content/base/civilization/quest_templates.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateQuestTemplates: true
  },
  {
    file: "packages/content/base/civilization/quest_archetypes.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false
  },
  {
    file: "packages/content/base/civilization/quest_definitions.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false
  },
  {
    file: "packages/content/base/player/attributes.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerAttributes: true
  },
  {
    file: "packages/content/base/player/skills.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerSkills: true
  },
  {
    file: "packages/content/base/player/abilities.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerAbilities: true
  },
  {
    file: "packages/content/base/player/spells.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerSpells: true
  },
  {
    file: "packages/content/base/player/traits.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerTraits: true
  },
  {
    file: "packages/content/base/player/backstories.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerBackstories: true
  },
  {
    file: "packages/content/base/player/starting_bundles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validatePlayerStartingBundles: true
  },
  {
    file: "packages/content/base/player/progression_tracks.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateProgressionTracks: true
  },
  {
    file: "packages/content/base/player/knowledge_domains.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateKnowledgeDomains: true
  },
  {
    file: "packages/content/base/player/skill_effects.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateSkillEffects: true
  },
  {
    file: "packages/content/base/player/trials.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateTrials: true
  },
  {
    file: "packages/content/base/game/global_rules.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateGlobalRules: true
  },
  {
    file: "packages/content/base/items/consumable_profiles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateConsumableProfiles: true
  },
  {
    file: "packages/content/base/player/titles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateTitles: true
  },
  {
    file: "packages/content/base/player/legacy_unlocks.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateLegacyUnlockCatalog: true
  },
  {
    file: "packages/content/base/game/combat_roles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateCombatRoles: true
  },
  {
    file: "packages/content/base/game/tactics_presets.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateTacticsPresets: true
  },
  {
    file: "packages/content/base/world/monsters.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateMonsters: true
  },
  {
    file: "packages/content/base/world/encounter_templates.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateEncounterTemplates: true
  },
  {
    file: "packages/content/base/world/spawn_profiles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateSpawnProfiles: true
  },
  {
    file: "packages/content/base/player/equipment_slots.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false
  },
  {
    file: "packages/content/base/world/calendar.json",
    requiredTopLevel: ["months", "seasons"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateCalendar: true
  },
  {
    file: "packages/content/base/world/climate_profiles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateClimateProfiles: true
  },
  {
    file: "packages/content/base/world/regions.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateWorldRegions: true
  },
  {
    file: "packages/content/base/world/region_localities.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateRegionLocalities: true
  },
  {
    file: "packages/content/base/world/regional_ecology_profiles.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateRegionalEcologyProfiles: true
  },
  {
    file: "packages/content/base/world/religions.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateReligions: true
  },
  {
    file: "packages/content/base/world/magic_infrastructure.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateMagicInfrastructureCatalog: true
  },
  {
    file: "packages/content/base/world/crystal_catalog.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateCrystalCatalog: true
  },
  {
    file: "packages/content/base/world/settlements.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateSettlements: true
  },
  {
    file: "packages/content/base/world/world_hexes.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateWorldHexes: true
  },
  {
    file: "packages/content/base/world/world_hex_edges.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateWorldHexEdges: true
  },
  {
    file: "packages/content/base/world/transport_profiles.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateTransportProfiles: true
  },
  {
    file: "packages/content/base/world/travel_networks.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateTravelNetworks: true
  },
  {
    file: "packages/content/base/world/world_map_features.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateWorldMapFeatures: true
  },
  {
    file: "packages/content/base/world/world_maps.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: false,
    validateWorldMaps: true
  }
];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyObjectPlaceholder(value) {
  return isObject(value) && Object.keys(value).length === 0;
}

function containsEmptyObjectPlaceholder(value) {
  if (isEmptyObjectPlaceholder(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some((entry) => containsEmptyObjectPlaceholder(entry));
  }
  if (isObject(value)) {
    return Object.values(value).some((entry) => containsEmptyObjectPlaceholder(entry));
  }
  return false;
}

function ensureSetMembership(relativePath, recordId, field, value, allowed) {
  if (!allowed.has(value)) {
    throw new Error(`${relativePath} has invalid ${field} '${String(value)}' on record ${recordId}`);
  }
}

function ensureStringArray(relativePath, recordId, field, value, minLength = 0) {
  if (!Array.isArray(value)) {
    throw new Error(`${relativePath} has non-array ${field} on record ${recordId}`);
  }

  if (value.length < minLength) {
    throw new Error(`${relativePath} has too few values in ${field} on record ${recordId}`);
  }

  for (const entry of value) {
    if (typeof entry !== "string") {
      throw new Error(`${relativePath} has non-string value in ${field} on record ${recordId}`);
    }
  }
}

function ensureIntegerArray(relativePath, recordId, field, value, minLength = 0) {
  if (!Array.isArray(value) || value.length < minLength) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }

  for (const entry of value) {
    if (!Number.isInteger(entry)) {
      throw new Error(`${relativePath} has non-integer ${field} entry on record ${recordId}`);
    }
  }
}

function ensureNumber(relativePath, recordId, field, value, min = 0) {
  if (typeof value !== "number" || Number.isNaN(value) || value < min) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }
}

function ensureFiniteNumber(relativePath, recordId, field, value) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }
}

function ensureApproxEqual(relativePath, recordId, field, actual, expected, epsilon = CLIMATE_EPSILON) {
  ensureFiniteNumber(relativePath, recordId, field, actual);
  ensureFiniteNumber(relativePath, recordId, field, expected);

  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(
      `${relativePath} has invalid ${field} on record ${recordId}; expected ${expected}, received ${actual}`
    );
  }
}

function ensureInteger(relativePath, recordId, field, value, min = 0) {
  if (!Number.isInteger(value) || value < min) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }
}

function ensureString(relativePath, recordId, field, value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }
}

function ensureBoolean(relativePath, recordId, field, value) {
  if (typeof value !== "boolean") {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }
}

function ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, field, value, min = 0) {
  if (isEmptyObjectPlaceholder(value)) {
    return null;
  }
  ensureNumber(relativePath, recordId, field, value, min);
  return value;
}

function ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, field, value, min = 0) {
  if (isEmptyObjectPlaceholder(value)) {
    return null;
  }
  ensureInteger(relativePath, recordId, field, value, min);
  return value;
}

function ensureBooleanOrEmptyObjectPlaceholder(relativePath, recordId, field, value) {
  if (isEmptyObjectPlaceholder(value)) {
    return null;
  }
  ensureBoolean(relativePath, recordId, field, value);
  return value;
}

function ensureStringArrayOrNull(relativePath, recordId, field, value, minLength = 0) {
  if (value === null) {
    return null;
  }
  ensureStringArray(relativePath, recordId, field, value, minLength);
  return value;
}

function ensureUniqueSlugStrings(relativePath, recordId, field, value, { allowDotted = false } = {}) {
  ensureStringArray(relativePath, recordId, field, value, 1);

  const seen = new Set();
  for (const entry of value) {
    const isValidSlug = allowDotted ? ITEM_PROCESSING_GROUP_PATTERN.test(entry) : SLUG_PATTERN.test(entry);
    if (!isValidSlug) {
      throw new Error(`${relativePath} has invalid ${field} value '${entry}' on record ${recordId}`);
    }

    if (seen.has(entry)) {
      throw new Error(`${relativePath} has duplicate ${field} value '${entry}' on record ${recordId}`);
    }
    seen.add(entry);
  }
}

function ensureUniqueAliasStrings(relativePath, recordId, field, value) {
  ensureStringArray(relativePath, recordId, field, value, 1);

  const seen = new Set();
  for (const entry of value) {
    if (typeof entry !== "string" || entry.trim().length === 0) {
      throw new Error(`${relativePath} has invalid ${field} value on record ${recordId}`);
    }

    if (seen.has(entry)) {
      throw new Error(`${relativePath} has duplicate ${field} value '${entry}' on record ${recordId}`);
    }
    seen.add(entry);
  }
}

function isValidMarketItemKey(itemKey) {
  return ITEM_KEY_PATTERN.test(itemKey) || RESOURCE_ITEM_PREFIX_PATTERN.test(itemKey);
}

function buildItemAliasMap(relativePath, records) {
  const aliasToCanonical = new Map();

  for (const record of records) {
    for (const aliasKey of record.aliasKeys ?? []) {
      if (aliasToCanonical.has(aliasKey)) {
        throw new Error(
          `${relativePath} has duplicate aliasKey '${aliasKey}' on records ${aliasToCanonical.get(aliasKey)} and ${record.id ?? "<unknown>"}`
        );
      }
      aliasToCanonical.set(aliasKey, record.itemKey);
    }
  }

  return aliasToCanonical;
}

function marketSourceRequiresCanonicalItem(source) {
  return CANONICAL_ITEM_MARKET_SOURCES.has(source);
}

async function validateHabitatBiomes(relativePath, records) {
  const rawBiomes = await readFile(path.join(ROOT, "packages/content/base/world/biomes.json"), "utf8");
  const parsedBiomes = JSON.parse(rawBiomes);

  if (!Array.isArray(parsedBiomes.records)) {
    throw new Error(`${relativePath} could not validate habitats because biomes records is not an array`);
  }

  const validBiomeIds = new Set();
  for (const biome of parsedBiomes.records) {
    if (typeof biome.id === "string") {
      validBiomeIds.add(biome.id);
    }
  }

  const seenHabitatIds = new Set();
  const seenHabitatSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    ensureString(relativePath, recordId, "slug", record.slug);
    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "biomeId", record.biomeId);

    if (seenHabitatIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate habitat id ${record.id}`);
    }
    seenHabitatIds.add(record.id);

    if (seenHabitatSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate habitat slug ${record.slug}`);
    }
    seenHabitatSlugs.add(record.slug);

    ensureStringArray(relativePath, recordId, "biomeIds", record.biomeIds, 1);

    if (new Set(record.biomeIds).size !== record.biomeIds.length) {
      throw new Error(`${relativePath} has duplicate biomeIds values on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "shape", record.shape, HABITAT_SHAPES);

    if (!record.biomeIds.includes(record.biomeId)) {
      throw new Error(`${relativePath} has biomeId not included in biomeIds on record ${recordId}`);
    }

    for (const biomeId of record.biomeIds) {
      if (!validBiomeIds.has(biomeId)) {
        throw new Error(`${relativePath} references unknown biomeId '${biomeId}' on record ${recordId}`);
      }
    }
  }
}

function validateFloraOutputBlock(relativePath, recordId, fieldName, block) {
  if (!isObject(block) || !isObject(block.rawOutput) || !isObject(block.rawOutput.processing) || !isObject(block.rawOutput.processing.byProducts)) {
    throw new Error(`${relativePath} has incomplete ${fieldName} on record ${recordId}`);
  }

  ensureString(relativePath, recordId, `${fieldName}.trigger`, block.trigger);
  ensureStringArray(relativePath, recordId, `${fieldName}.rawOutput.materials`, block.rawOutput.materials, 1);
  ensureStringArray(relativePath, recordId, `${fieldName}.rawOutput.ingredients`, block.rawOutput.ingredients, 1);
  ensureStringArray(relativePath, recordId, `${fieldName}.rawOutput.processing.byProducts.materials`, block.rawOutput.processing.byProducts.materials, 1);
  ensureStringArray(relativePath, recordId, `${fieldName}.rawOutput.processing.byProducts.ingredients`, block.rawOutput.processing.byProducts.ingredients, 1);
}

function validateFloraTemplate(relativePath, records) {
  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureSetMembership(relativePath, recordId, "type", record.type, FLORA_TYPES);
    ensureSetMembership(relativePath, recordId, "lifecycle", record.lifecycle, FLORA_LIFECYCLES);
    ensureStringArray(relativePath, recordId, "habitatIds", record.habitatIds, 1);

    if (!isObject(record.harvest)) {
      throw new Error(`${relativePath} is missing harvest object on record ${recordId}`);
    }

    if (containsEmptyObjectPlaceholder(record.harvest) || isEmptyObjectPlaceholder(record.baseValue) || containsEmptyObjectPlaceholder(record.template)) {
      ensureString(relativePath, recordId, "currencyId", record.currencyId);
      if (!isObject(record.template)) {
        throw new Error(`${relativePath} is missing template object on record ${recordId}`);
      }

      const { identity, harvest, lifecycle } = record.template;
      if (!isObject(identity)) {
        throw new Error(`${relativePath} is missing template.identity on record ${recordId}`);
      }
      if (identity.name !== record.name) {
        throw new Error(`${relativePath} has mismatched identity.name on record ${recordId}`);
      }
      if (identity.type !== record.type) {
        throw new Error(`${relativePath} has mismatched identity.type on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, "template.identity.type", identity.type, FLORA_TYPES);

      if (isObject(harvest)) {
        ensureStringArray(relativePath, recordId, "template.harvest.harvestableParts", harvest.harvestableParts, 1);
        if (Array.isArray(harvest.partHarvestAvailability?.partsByStages)) {
          for (const stageParts of harvest.partHarvestAvailability.partsByStages) {
            if (!isObject(stageParts)) {
              throw new Error(`${relativePath} has invalid partsByStages entry on record ${recordId}`);
            }
            ensureSetMembership(relativePath, recordId, "template.harvest.partHarvestAvailability.partsByStages.stage", stageParts.stage, FLORA_STAGES);
            ensureStringArray(relativePath, recordId, "template.harvest.partHarvestAvailability.partsByStages.parts", stageParts.parts, 1);
          }
        }
        if (harvest.activeHarvest !== undefined) {
          validateFloraOutputBlock(relativePath, recordId, "template.harvest.activeHarvest", harvest.activeHarvest);
        }
        if (harvest.passiveHarvest !== undefined) {
          validateFloraOutputBlock(relativePath, recordId, "template.harvest.passiveHarvest", harvest.passiveHarvest);
        }
      }

      if (isObject(lifecycle)) {
        ensureSetMembership(relativePath, recordId, "template.lifecycle.type", lifecycle.type, FLORA_LIFECYCLES);
        if (lifecycle.type !== record.lifecycle) {
          throw new Error(`${relativePath} has mismatched lifecycle.type on record ${recordId}`);
        }
        if (Array.isArray(lifecycle.applicableStages)) {
          for (const stage of lifecycle.applicableStages) {
            ensureSetMembership(relativePath, recordId, "template.lifecycle.applicableStages", stage, FLORA_STAGES);
          }
        }
      }
      continue;
    }

    ensureBoolean(relativePath, recordId, "harvest.active", record.harvest.active);
    ensureBoolean(relativePath, recordId, "harvest.passive", record.harvest.passive);
    ensureNumber(relativePath, recordId, "harvest.yieldCap", record.harvest.yieldCap, 0);
    ensureNumber(relativePath, recordId, "baseValue", record.baseValue, 0);
    ensureString(relativePath, recordId, "currencyId", record.currencyId);

    if (!isObject(record.template)) {
      throw new Error(`${relativePath} is missing template object on record ${recordId}`);
    }

    const { identity, harvest, lifecycle, agronomy, domestication, ecology } = record.template;

    if (!isObject(identity)) {
      throw new Error(`${relativePath} is missing template.identity on record ${recordId}`);
    }

    if (identity.name !== record.name) {
      throw new Error(`${relativePath} has mismatched identity.name on record ${recordId}`);
    }

    if (identity.type !== record.type) {
      throw new Error(`${relativePath} has mismatched identity.type on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "template.identity.type", identity.type, FLORA_TYPES);

    if (!isObject(harvest) || !isObject(harvest.partHarvestAvailability) || !isObject(harvest.partPassiveHarvestRules) || !isObject(harvest.partActiveHarvestRules)) {
      throw new Error(`${relativePath} has incomplete template.harvest block on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "template.harvest.harvestableParts", harvest.harvestableParts, 1);
    ensureBoolean(relativePath, recordId, "template.harvest.partHarvestAvailability.active", harvest.partHarvestAvailability.active);
    ensureBoolean(relativePath, recordId, "template.harvest.partHarvestAvailability.passive", harvest.partHarvestAvailability.passive);

    if (harvest.partHarvestAvailability.active !== record.harvest.active) {
      throw new Error(`${relativePath} has mismatched harvest.active and template.harvest.partHarvestAvailability.active on record ${recordId}`);
    }

    if (harvest.partHarvestAvailability.passive !== record.harvest.passive) {
      throw new Error(`${relativePath} has mismatched harvest.passive and template.harvest.partHarvestAvailability.passive on record ${recordId}`);
    }

    if (!Array.isArray(harvest.partHarvestAvailability.partsByStages) || harvest.partHarvestAvailability.partsByStages.length === 0) {
      throw new Error(`${relativePath} has invalid template.harvest.partHarvestAvailability.partsByStages on record ${recordId}`);
    }

    for (const stageParts of harvest.partHarvestAvailability.partsByStages) {
      if (!isObject(stageParts)) {
        throw new Error(`${relativePath} has invalid partsByStages entry on record ${recordId}`);
      }

      ensureSetMembership(relativePath, recordId, "template.harvest.partHarvestAvailability.partsByStages.stage", stageParts.stage, FLORA_STAGES);
      ensureStringArray(relativePath, recordId, "template.harvest.partHarvestAvailability.partsByStages.parts", stageParts.parts, 1);
    }

    ensureInteger(relativePath, recordId, "template.harvest.partPassiveHarvestRules.passiveYieldStartAgeDays", harvest.partPassiveHarvestRules.passiveYieldStartAgeDays, 0);
    ensureInteger(relativePath, recordId, "template.harvest.partPassiveHarvestRules.yieldCapAnnual", harvest.partPassiveHarvestRules.yieldCapAnnual, 0);

    if (!isObject(harvest.partPassiveHarvestRules.regrowthBehavior)) {
      throw new Error(`${relativePath} has missing template.harvest.partPassiveHarvestRules.regrowthBehavior on record ${recordId}`);
    }

    ensureInteger(
      relativePath,
      recordId,
      "template.harvest.partPassiveHarvestRules.regrowthBehavior.unitsPerGrowthSeasonWhenMature",
      harvest.partPassiveHarvestRules.regrowthBehavior.unitsPerGrowthSeasonWhenMature,
      0
    );

    const activeRules = harvest.partActiveHarvestRules;

    if (!isObject(activeRules.primeYieldAges) || !isObject(activeRules.regrowthBehavior) || !isObject(activeRules.activeHarvestImpact)) {
      throw new Error(`${relativePath} has incomplete template.harvest.partActiveHarvestRules block on record ${recordId}`);
    }

    ensureInteger(relativePath, recordId, "template.harvest.partActiveHarvestRules.primeYieldAges.startAgeDays", activeRules.primeYieldAges.startAgeDays, 0);
    ensureInteger(relativePath, recordId, "template.harvest.partActiveHarvestRules.primeYieldAges.peakAgeDays", activeRules.primeYieldAges.peakAgeDays, 0);
    ensureInteger(relativePath, recordId, "template.harvest.partActiveHarvestRules.primeYieldAges.endAgeDays", activeRules.primeYieldAges.endAgeDays, 0);

    ensureNumber(relativePath, recordId, "template.harvest.partActiveHarvestRules.regrowthBehavior.growthCyclesPerSeason", activeRules.regrowthBehavior.growthCyclesPerSeason, 0);
    ensureNumber(relativePath, recordId, "template.harvest.partActiveHarvestRules.regrowthBehavior.unitGrowthSpeed", activeRules.regrowthBehavior.unitGrowthSpeed, 0);
    ensureInteger(relativePath, recordId, "template.harvest.partActiveHarvestRules.regrowthBehavior.matureAgeDays", activeRules.regrowthBehavior.matureAgeDays, 0);

    if (!isObject(activeRules.activeHarvestImpact.destructiveHarvestFlag)) {
      throw new Error(`${relativePath} has missing template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag on record ${recordId}`);
    }

    ensureInteger(
      relativePath,
      recordId,
      "template.harvest.partActiveHarvestRules.activeHarvestImpact.harvestableStructuralUnits",
      activeRules.activeHarvestImpact.harvestableStructuralUnits,
      0
    );

    const destructiveFlag = activeRules.activeHarvestImpact.destructiveHarvestFlag;

    ensureNumber(relativePath, recordId, "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.passiveYieldEffectPerHarvest", destructiveFlag.passiveYieldEffectPerHarvest, 0);
    ensureNumber(
      relativePath,
      recordId,
      "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.allPartGrowthSpeedReductionPerHarvest",
      destructiveFlag.allPartGrowthSpeedReductionPerHarvest,
      0
    );
    ensureInteger(
      relativePath,
      recordId,
      "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.maximumDestructiveHarvestsToStagnation",
      destructiveFlag.maximumDestructiveHarvestsToStagnation,
      0
    );
    ensureInteger(
      relativePath,
      recordId,
      "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.maximumDestructiveHarvestsToDeath",
      destructiveFlag.maximumDestructiveHarvestsToDeath,
      0
    );
    ensureBoolean(relativePath, recordId, "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.canRegrow", destructiveFlag.canRegrow);
    ensureInteger(
      relativePath,
      recordId,
      "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.timeToRegrowDays",
      destructiveFlag.timeToRegrowDays,
      0
    );
    ensureSetMembership(
      relativePath,
      recordId,
      "template.harvest.partActiveHarvestRules.activeHarvestImpact.destructiveHarvestFlag.regrowthPeriod",
      destructiveFlag.regrowthPeriod,
      FLORA_REGROWTH_PERIODS
    );

    ensureNumber(relativePath, recordId, "template.harvest.partActiveHarvestRules.unharvestedConversion", activeRules.unharvestedConversion, 0);

    ensureStringArray(relativePath, recordId, "template.harvest.tools", harvest.tools, 1);
    ensureStringArray(relativePath, recordId, "template.harvest.triggers", harvest.triggers, 1);

    validateFloraOutputBlock(relativePath, recordId, "template.harvest.activeHarvest", harvest.activeHarvest);
    validateFloraOutputBlock(relativePath, recordId, "template.harvest.passiveHarvest", harvest.passiveHarvest);

    if (!isObject(lifecycle) || !isObject(lifecycle.stages)) {
      throw new Error(`${relativePath} has incomplete template.lifecycle block on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "template.lifecycle.type", lifecycle.type, FLORA_LIFECYCLES);
    if (lifecycle.type !== record.lifecycle) {
      throw new Error(`${relativePath} has mismatched lifecycle.type on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "template.lifecycle.applicableStages", lifecycle.applicableStages, 1);
    for (const stage of lifecycle.applicableStages) {
      ensureSetMembership(relativePath, recordId, "template.lifecycle.applicableStages", stage, FLORA_STAGES);
    }

    for (const stageName of FLORA_STAGES) {
      const stageData = lifecycle.stages[stageName];
      if (!isObject(stageData) || !isObject(stageData.duration)) {
        throw new Error(`${relativePath} has invalid lifecycle stage '${stageName}' on record ${recordId}`);
      }

      ensureNumber(relativePath, recordId, `template.lifecycle.stages.${stageName}.mortalityThreshold`, stageData.mortalityThreshold, 0);
      ensureStringArray(relativePath, recordId, `template.lifecycle.stages.${stageName}.transitionTriggers`, stageData.transitionTriggers, 1);
      ensureInteger(relativePath, recordId, `template.lifecycle.stages.${stageName}.duration.baseDurationDays`, stageData.duration.baseDurationDays, 0);
      ensureNumber(
        relativePath,
        recordId,
        `template.lifecycle.stages.${stageName}.duration.environmentalVariability`,
        stageData.duration.environmentalVariability,
        0
      );
    }

    if (!isObject(agronomy) || !isObject(agronomy.rotationBenefit)) {
      throw new Error(`${relativePath} has incomplete template.agronomy block on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "template.agronomy.plantingWindow", agronomy.plantingWindow, 1);
    ensureStringArray(relativePath, recordId, "template.agronomy.companionCrops", agronomy.companionCrops, 1);
    ensureStringArray(relativePath, recordId, "template.agronomy.antagonisticCrops", agronomy.antagonisticCrops, 1);
    ensureStringArray(relativePath, recordId, "template.agronomy.harvestWindow", agronomy.harvestWindow, 1);
    ensureStringArray(relativePath, recordId, "template.agronomy.shedSeasons", agronomy.shedSeasons, 0);
    ensureStringArray(relativePath, recordId, "template.agronomy.growthSeasons", agronomy.growthSeasons, 1);

    ensureNumber(relativePath, recordId, "template.agronomy.rotationBenefit.soilQuality", agronomy.rotationBenefit.soilQuality, 0);
    ensureNumber(relativePath, recordId, "template.agronomy.rotationBenefit.fertilizationEffect", agronomy.rotationBenefit.fertilizationEffect, 0);
    ensureNumber(relativePath, recordId, "template.agronomy.rotationBenefit.survivability", agronomy.rotationBenefit.survivability, 0);
    ensureNumber(relativePath, recordId, "template.agronomy.rotationBenefit.pestInteraction", agronomy.rotationBenefit.pestInteraction, 0);

    if (!isObject(domestication) || !isObject(domestication.difficulty) || !isObject(domestication.mediation) || !isObject(domestication.infrastructure)) {
      throw new Error(`${relativePath} has incomplete template.domestication block on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "template.domestication.cultivable", domestication.cultivable);

    if (domestication.domesticVariant !== null && typeof domestication.domesticVariant !== "string") {
      throw new Error(`${relativePath} has invalid template.domestication.domesticVariant on record ${recordId}`);
    }

    ensureNumber(relativePath, recordId, "template.domestication.domesticationYieldModifier", domestication.domesticationYieldModifier, 0);
    ensureStringArray(relativePath, recordId, "template.domestication.tools", domestication.tools, 1);

    ensureNumber(relativePath, recordId, "template.domestication.difficulty.invasivity", domestication.difficulty.invasivity, 0);
    ensureStringArray(relativePath, recordId, "template.domestication.difficulty.fragilityFactors", domestication.difficulty.fragilityFactors, 1);
    ensureNumber(relativePath, recordId, "template.domestication.difficulty.soilDegradation", domestication.difficulty.soilDegradation, 0);
    ensureNumber(relativePath, recordId, "template.domestication.difficulty.survivability", domestication.difficulty.survivability, 0);
    ensureNumber(relativePath, recordId, "template.domestication.difficulty.landArea", domestication.difficulty.landArea, 0);

    if (!isObject(domestication.mediation.protection) || !isObject(domestication.mediation.pollination) || !isObject(domestication.mediation.upkeep)) {
      throw new Error(`${relativePath} has incomplete template.domestication.mediation block on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "template.domestication.mediation.protection.fences", domestication.mediation.protection.fences);
    ensureBoolean(relativePath, recordId, "template.domestication.mediation.protection.netting", domestication.mediation.protection.netting);
    ensureBoolean(relativePath, recordId, "template.domestication.mediation.pollination.fertilization", domestication.mediation.pollination.fertilization);
    ensureBoolean(relativePath, recordId, "template.domestication.mediation.upkeep.weedControl", domestication.mediation.upkeep.weedControl);
    ensureBoolean(relativePath, recordId, "template.domestication.mediation.upkeep.fungusControl", domestication.mediation.upkeep.fungusControl);

    ensureBoolean(relativePath, recordId, "template.domestication.infrastructure.irrigation", domestication.infrastructure.irrigation);
    ensureBoolean(relativePath, recordId, "template.domestication.infrastructure.greenhouse", domestication.infrastructure.greenhouse);
    ensureBoolean(relativePath, recordId, "template.domestication.infrastructure.mulch", domestication.infrastructure.mulch);
    ensureBoolean(relativePath, recordId, "template.domestication.infrastructure.trellising", domestication.infrastructure.trellising);
    ensureBoolean(relativePath, recordId, "template.domestication.infrastructure.raisedBeds", domestication.infrastructure.raisedBeds);

    if (!isObject(ecology)) {
      throw new Error(`${relativePath} is missing template.ecology on record ${recordId}`);
    }

    ensureString(relativePath, recordId, "template.ecology.climateRange", ecology.climateRange);
    ensureSetMembership(relativePath, recordId, "template.ecology.waterNeed", ecology.waterNeed, FLORA_NEEDS);
    ensureSetMembership(relativePath, recordId, "template.ecology.lightNeed", ecology.lightNeed, FLORA_NEEDS);
    ensureStringArray(relativePath, recordId, "template.ecology.soilType", ecology.soilType, 1);

    if (!Array.isArray(ecology.biomes) || ecology.biomes.length === 0) {
      throw new Error(`${relativePath} has invalid template.ecology.biomes on record ${recordId}`);
    }

    for (const biome of ecology.biomes) {
      if (!isObject(biome)) {
        throw new Error(`${relativePath} has invalid template.ecology.biome entry on record ${recordId}`);
      }

      ensureString(relativePath, recordId, "template.ecology.biomes.habitatId", biome.habitatId);
      if (!record.habitatIds.includes(biome.habitatId)) {
        throw new Error(`${relativePath} has ecology biome habitatId not present in habitatIds on record ${recordId}`);
      }

      ensureNumber(relativePath, recordId, "template.ecology.biomes.prevalence", biome.prevalence, 0);
    }
  }
}

function ensureItemKeyArray(relativePath, recordId, field, value) {
  ensureStringArray(relativePath, recordId, field, value, 1);

  const seen = new Set();
  for (const key of value) {
    if (!ITEM_KEY_PATTERN.test(key)) {
      throw new Error(`${relativePath} has invalid ${field} key '${key}' on record ${recordId}`);
    }

    if (RESOURCE_ITEM_PREFIX_PATTERN.test(key)) {
      throw new Error(`${relativePath} has prefixed ${field} key '${key}' on record ${recordId}`);
    }

    if (GENERIC_PROPAGULE_KEYS.has(key)) {
      throw new Error(`${relativePath} has generic propagule key '${key}' in ${field} on record ${recordId}`);
    }

    if (seen.has(key)) {
      throw new Error(`${relativePath} has duplicate ${field} key '${key}' on record ${recordId}`);
    }

    seen.add(key);
  }
}

function validateFaunaProductsBlock(relativePath, recordId, fieldName, products) {
  if (!isObject(products)) {
    throw new Error(`${relativePath} has invalid ${fieldName} on record ${recordId}`);
  }

  const keys = Object.keys(products);
  for (const key of keys) {
    if (!FAUNA_PRODUCT_GROUPS.includes(key)) {
      throw new Error(`${relativePath} has unsupported ${fieldName} group '${key}' on record ${recordId}`);
    }
  }

  if (keys.length === 0) {
    throw new Error(`${relativePath} has empty ${fieldName} on record ${recordId}`);
  }

  for (const group of keys) {
    ensureItemKeyArray(relativePath, recordId, `${fieldName}.${group}`, products[group]);
  }
}

function validateFaunaTemplate(relativePath, records) {
  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureSetMembership(relativePath, recordId, "type", record.type, FAUNA_TYPES);
    ensureSetMembership(relativePath, recordId, "diet", record.diet, FAUNA_DIETS);
    ensureSetMembership(relativePath, recordId, "dangerClass", record.dangerClass, FAUNA_DANGER_CLASSES);
    ensureStringArray(relativePath, recordId, "habitatIds", record.habitatIds, 1);

    if (!isObject(record.template)) {
      throw new Error(`${relativePath} is missing template object on record ${recordId}`);
    }

    const { identity, domestication, infrastructureModifiers, reproduction, ecology, lifecycle, output, activity, foodChain } =
      record.template;

    if (isEmptyObjectPlaceholder(record.domesticatable) || isEmptyObjectPlaceholder(record.baseValue) || containsEmptyObjectPlaceholder(record.template)) {
      if (!isObject(identity)) {
        throw new Error(`${relativePath} is missing template.identity on record ${recordId}`);
      }
      if (identity.type !== record.type) {
        throw new Error(`${relativePath} has mismatched identity.type on record ${recordId}`);
      }
      if (identity.name !== record.name) {
        throw new Error(`${relativePath} has mismatched identity.name on record ${recordId}`);
      }
      if (identity.dietType !== record.diet) {
        throw new Error(`${relativePath} has mismatched identity.dietType on record ${recordId}`);
      }
      if (identity.dangerClass !== record.dangerClass) {
        throw new Error(`${relativePath} has mismatched identity.dangerClass on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, "template.identity.type", identity.type, FAUNA_TYPES);
      ensureSetMembership(relativePath, recordId, "template.identity.dietType", identity.dietType, FAUNA_DIETS);
      ensureSetMembership(relativePath, recordId, "template.identity.dangerClass", identity.dangerClass, FAUNA_DANGER_CLASSES);
      if (identity.sizeClass !== undefined) {
        ensureSetMembership(relativePath, recordId, "template.identity.sizeClass", identity.sizeClass, FAUNA_SIZE_CLASSES);
      }
      if (Array.isArray(identity.behavior)) {
        for (const behavior of identity.behavior) {
          ensureSetMembership(relativePath, recordId, "template.identity.behavior", behavior, FAUNA_BEHAVIORS);
        }
      }
      if (isObject(ecology) && Array.isArray(ecology.biomes)) {
        for (const biome of ecology.biomes) {
          if (!isObject(biome)) {
            throw new Error(`${relativePath} has invalid biome object on record ${recordId}`);
          }
          if (typeof biome.habitatId !== "string" || !record.habitatIds.includes(biome.habitatId)) {
            throw new Error(`${relativePath} has biome habitatId not present in habitatIds on record ${recordId}`);
          }
        }
      }
      if (isObject(output)) {
        if (
          isObject(output.passiveOutput) &&
          "products" in output.passiveOutput &&
          !containsEmptyObjectPlaceholder(output.passiveOutput.products)
        ) {
          validateFaunaProductsBlock(relativePath, recordId, "template.output.passiveOutput.products", output.passiveOutput.products);
        }
        if (
          isObject(output.slaughterOutput) &&
          "products" in output.slaughterOutput &&
          !containsEmptyObjectPlaceholder(output.slaughterOutput.products)
        ) {
          validateFaunaProductsBlock(relativePath, recordId, "template.output.slaughterOutput.products", output.slaughterOutput.products);
        }
      }
      continue;
    }

    ensureBoolean(relativePath, recordId, "domesticatable", record.domesticatable);

    if (!isObject(identity)) {
      throw new Error(`${relativePath} is missing template.identity on record ${recordId}`);
    }

    if (identity.type !== record.type) {
      throw new Error(`${relativePath} has mismatched identity.type on record ${recordId}`);
    }

    if (identity.name !== record.name) {
      throw new Error(`${relativePath} has mismatched identity.name on record ${recordId}`);
    }

    if (identity.dietType !== record.diet) {
      throw new Error(`${relativePath} has mismatched identity.dietType on record ${recordId}`);
    }

    if (identity.dangerClass !== record.dangerClass) {
      throw new Error(`${relativePath} has mismatched identity.dangerClass on record ${recordId}`);
    }

    if (identity.domesticatable !== record.domesticatable) {
      throw new Error(`${relativePath} has mismatched identity.domesticatable on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "template.identity.type", identity.type, FAUNA_TYPES);
    ensureSetMembership(relativePath, recordId, "template.identity.dietType", identity.dietType, FAUNA_DIETS);
    ensureSetMembership(relativePath, recordId, "template.identity.dangerClass", identity.dangerClass, FAUNA_DANGER_CLASSES);
    ensureSetMembership(relativePath, recordId, "template.identity.sizeClass", identity.sizeClass, FAUNA_SIZE_CLASSES);
    ensureBoolean(relativePath, recordId, "template.identity.mountable", identity.mountable);

    ensureStringArray(relativePath, recordId, "template.identity.behavior", identity.behavior, 1);
    for (const behavior of identity.behavior) {
      ensureSetMembership(relativePath, recordId, "template.identity.behavior", behavior, FAUNA_BEHAVIORS);
    }

    if (!isObject(domestication) || !isObject(domestication.infrastructure) || !isObject(domestication.yieldBonus) || !isObject(domestication.population)) {
      throw new Error(`${relativePath} has incomplete template.domestication block on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "template.domestication.infrastructure.enabled", domestication.infrastructure.enabled);
    ensureNumber(relativePath, recordId, "template.domestication.infrastructure.infrastructureSize", domestication.infrastructure.infrastructureSize, 0);

    ensureNumber(relativePath, recordId, "template.domestication.yieldBonus.temperatureControlBonus", domestication.yieldBonus.temperatureControlBonus, 0);
    ensureNumber(relativePath, recordId, "template.domestication.yieldBonus.feedEfficiencyBonus", domestication.yieldBonus.feedEfficiencyBonus, 0);

    ensureNumber(relativePath, recordId, "template.domestication.population.populationCap", domestication.population.populationCap, 0);
    ensureNumber(relativePath, recordId, "template.domestication.population.populationRatio", domestication.population.populationRatio, 0);
    ensureNumber(
      relativePath,
      recordId,
      "template.domestication.population.stableSeasonSlaughterRateAtCap",
      domestication.population.stableSeasonSlaughterRateAtCap,
      0
    );
    ensureNumber(relativePath, recordId, "template.domestication.population.passiveOutputYieldBonus", domestication.population.passiveOutputYieldBonus, 0);

    if (!isObject(infrastructureModifiers)) {
      throw new Error(`${relativePath} is missing template.infrastructureModifiers on record ${recordId}`);
    }

    for (const key of [
      "hydrationBonus",
      "climateProtectionBonus",
      "feedDiversity",
      "nutritionBonus",
      "juvenileSurvivalRateBonus",
      "fertilityModifier"
    ]) {
      ensureNumber(relativePath, recordId, `template.infrastructureModifiers.${key}`, infrastructureModifiers[key], 0);
    }

    if (!isObject(reproduction)) {
      throw new Error(`${relativePath} is missing template.reproduction on record ${recordId}`);
    }

    ensureNumber(relativePath, recordId, "template.reproduction.annualReproductionRatio", reproduction.annualReproductionRatio, 0);
    ensureSetMembership(relativePath, recordId, "template.reproduction.reproductionType", reproduction.reproductionType, FAUNA_REPRODUCTION_TYPES);
    ensureStringArray(relativePath, recordId, "template.reproduction.breedingSeasons", reproduction.breedingSeasons, 1);
    ensureNumber(relativePath, recordId, "template.reproduction.gestationIncubationTimeDays", reproduction.gestationIncubationTimeDays, 0);
    ensureNumber(relativePath, recordId, "template.reproduction.fertileAgeDays", reproduction.fertileAgeDays, 0);
    ensureNumber(relativePath, recordId, "template.reproduction.offspringPerBreedingCycle", reproduction.offspringPerBreedingCycle, 0);
    ensureNumber(relativePath, recordId, "template.reproduction.offspringSurvivalRate", reproduction.offspringSurvivalRate, 0);
    ensureNumber(relativePath, recordId, "template.reproduction.effectiveRecruitmentRate", reproduction.effectiveRecruitmentRate, 0);

    if (!isObject(ecology) || !Array.isArray(ecology.biomes) || !isObject(ecology.territory)) {
      throw new Error(`${relativePath} has incomplete template.ecology block on record ${recordId}`);
    }

    if (ecology.biomes.length === 0) {
      throw new Error(`${relativePath} has empty template.ecology.biomes on record ${recordId}`);
    }

    for (const biome of ecology.biomes) {
      if (!isObject(biome)) {
        throw new Error(`${relativePath} has invalid biome object on record ${recordId}`);
      }

      if (typeof biome.habitatId !== "string" || !record.habitatIds.includes(biome.habitatId)) {
        throw new Error(`${relativePath} has biome habitatId not present in habitatIds on record ${recordId}`);
      }

      if (typeof biome.preference !== "string") {
        throw new Error(`${relativePath} has invalid biome preference on record ${recordId}`);
      }

      ensureNumber(relativePath, recordId, "template.ecology.biomes.prevalence", biome.prevalence, 0);

      if (typeof biome.terrainPreference !== "string") {
        throw new Error(`${relativePath} has invalid biome terrainPreference on record ${recordId}`);
      }
    }

    ensureSetMembership(relativePath, recordId, "template.ecology.territory.movement", ecology.territory.movement, FAUNA_MOVEMENTS);
    ensureSetMembership(relativePath, recordId, "template.ecology.territory.size", ecology.territory.size, FAUNA_SIZE_CLASSES);
    ensureBoolean(relativePath, recordId, "template.ecology.territory.waterDependency", ecology.territory.waterDependency);
    ensureSetMembership(relativePath, recordId, "template.ecology.territory.hydrationNeed", ecology.territory.hydrationNeed, FAUNA_HYDRATION_NEEDS);

    if (ecology.territory.size !== identity.sizeClass) {
      throw new Error(`${relativePath} has mismatched territory.size and identity.sizeClass on record ${recordId}`);
    }

    if (!isObject(lifecycle)) {
      throw new Error(`${relativePath} is missing template.lifecycle on record ${recordId}`);
    }

    if (typeof lifecycle.type !== "string" || lifecycle.type.trim().length === 0) {
      throw new Error(`${relativePath} has invalid template.lifecycle.type on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "template.lifecycle.applicableStages", lifecycle.applicableStages, 1);

    if (!isObject(output) || !isObject(output.passiveOutput) || !isObject(output.slaughterOutput)) {
      throw new Error(`${relativePath} has incomplete template.output block on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "template.output.passiveOutput.producerSex", output.passiveOutput.producerSex, FAUNA_PRODUCER_SEX);
    ensureSetMembership(relativePath, recordId, "template.output.passiveOutput.producerWindow", output.passiveOutput.producerWindow, FAUNA_PRODUCER_WINDOWS);

    if ("products" in output.passiveOutput) {
      validateFaunaProductsBlock(relativePath, recordId, "template.output.passiveOutput.products", output.passiveOutput.products);
    }

    ensureNumber(relativePath, recordId, "template.output.slaughterOutput.primeAgeDays", output.slaughterOutput.primeAgeDays, 0);
    ensureNumber(relativePath, recordId, "template.output.slaughterOutput.cullAgeDays", output.slaughterOutput.cullAgeDays, 0);

    if ("products" in output.slaughterOutput) {
      validateFaunaProductsBlock(relativePath, recordId, "template.output.slaughterOutput.products", output.slaughterOutput.products);
    }

    if (!isObject(activity)) {
      throw new Error(`${relativePath} is missing template.activity on record ${recordId}`);
    }

    if (typeof activity.hibernationPeriod !== "string") {
      throw new Error(`${relativePath} has invalid template.activity.hibernationPeriod on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "template.activity.activeTime", activity.activeTime, FAUNA_ACTIVE_TIMES);

    if (!isObject(foodChain) || !isObject(foodChain.foodBehaviors) || !isObject(foodChain.foodTargets) || !isObject(foodChain.foodTargets.specificTargets)) {
      throw new Error(`${relativePath} has incomplete template.foodChain block on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "template.foodChain.foodBehaviors.prey", foodChain.foodBehaviors.prey);
    ensureBoolean(relativePath, recordId, "template.foodChain.foodBehaviors.scavenger", foodChain.foodBehaviors.scavenger);
    ensureBoolean(relativePath, recordId, "template.foodChain.foodBehaviors.predator", foodChain.foodBehaviors.predator);
    ensureBoolean(relativePath, recordId, "template.foodChain.foodBehaviors.apex", foodChain.foodBehaviors.apex);

    ensureStringArray(relativePath, recordId, "template.foodChain.foodTargets.faunaTypes", foodChain.foodTargets.faunaTypes, 0);
    ensureStringArray(relativePath, recordId, "template.foodChain.foodTargets.floraTypes", foodChain.foodTargets.floraTypes, 0);
    ensureStringArray(relativePath, recordId, "template.foodChain.foodTargets.specificTargets.fauna", foodChain.foodTargets.specificTargets.fauna, 0);
    ensureStringArray(relativePath, recordId, "template.foodChain.foodTargets.specificTargets.flora", foodChain.foodTargets.specificTargets.flora, 0);
  }
}

function validateCalendarDefinition(relativePath, parsed) {
  const calendarKeys = Object.keys(parsed);
  const allowedCalendarKeys = new Set(["months", "seasons"]);
  const unknownCalendarKeys = calendarKeys.filter((key) => !allowedCalendarKeys.has(key));
  if (unknownCalendarKeys.length > 0) {
    throw new Error(`${relativePath} has unsupported keys: ${unknownCalendarKeys.join(",")}`);
  }

  if (!Array.isArray(parsed.months)) {
    throw new Error(`${relativePath} has non-array months`);
  }

  if (parsed.months.length !== CALENDAR_MONTHS.length) {
    throw new Error(`${relativePath} has invalid months length; expected ${CALENDAR_MONTHS.length}, received ${parsed.months.length}`);
  }

  const monthSet = new Set();
  for (const month of parsed.months) {
    if (!Number.isInteger(month)) {
      throw new Error(`${relativePath} has non-integer month value '${String(month)}'`);
    }

    monthSet.add(month);
  }

  if (monthSet.size !== parsed.months.length) {
    throw new Error(`${relativePath} has duplicate month values`);
  }

  const sortedMonths = [...monthSet].sort((a, b) => a - b);
  for (const [index, expectedMonth] of CALENDAR_MONTHS.entries()) {
    if (sortedMonths[index] !== expectedMonth) {
      throw new Error(`${relativePath} has invalid months set; expected ${CALENDAR_MONTHS.join(",")}`);
    }
  }

  if (!Array.isArray(parsed.seasons)) {
    throw new Error(`${relativePath} has non-array seasons`);
  }

  if (parsed.seasons.length !== CLIMATE_SEASONS.length) {
    throw new Error(`${relativePath} has invalid seasons length; expected ${CLIMATE_SEASONS.length}, received ${parsed.seasons.length}`);
  }

  if (new Set(parsed.seasons).size !== parsed.seasons.length) {
    throw new Error(`${relativePath} has duplicate seasons`);
  }

  for (const [index, expectedSeason] of CLIMATE_SEASONS.entries()) {
    if (parsed.seasons[index] !== expectedSeason) {
      throw new Error(
        `${relativePath} has invalid seasons order/content; expected ${CLIMATE_SEASONS.join(",")}, received ${parsed.seasons.join(",")}`
      );
    }
  }
}
function validateClimateProfiles(relativePath, records) {
  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    ensureString(relativePath, recordId, "name", record.name);

    if (!Array.isArray(record.seasonLengths) || record.seasonLengths.length !== CLIMATE_SEASONS.length) {
      throw new Error(`${relativePath} has invalid seasonLengths on record ${recordId}`);
    }

    for (const [index, seasonLength] of record.seasonLengths.entries()) {
      ensureInteger(relativePath, recordId, `seasonLengths[${index}]`, seasonLength, 1);
    }

    const seasonLengthTotalWeeks = record.seasonLengths.reduce((sum, weeks) => sum + weeks, 0);
    if (seasonLengthTotalWeeks !== CLIMATE_WEEKS_PER_YEAR) {
      throw new Error(
        `${relativePath} has invalid seasonLengths total on record ${recordId}; expected ${CLIMATE_WEEKS_PER_YEAR}, received ${seasonLengthTotalWeeks}`
      );
    }

    if (!isObject(record.temperatureVariance)) {
      throw new Error(`${relativePath} is missing temperatureVariance on record ${recordId}`);
    }

    ensureNumber(relativePath, recordId, "temperatureVariance.avg", record.temperatureVariance.avg, 0);
    ensureNumber(relativePath, recordId, "temperatureVariance.high", record.temperatureVariance.high, 0);
    ensureNumber(relativePath, recordId, "temperatureVariance.low", record.temperatureVariance.low, 0);

    if (!isObject(record.temperatureRangeTemplate)) {
      throw new Error(`${relativePath} is missing temperatureRangeTemplate on record ${recordId}`);
    }

    const template = record.temperatureRangeTemplate;

    ensureSetMembership(relativePath, recordId, "temperatureRangeTemplate.unit", template.unit, CLIMATE_UNITS);
    ensureFiniteNumber(relativePath, recordId, "temperatureRangeTemplate.lowLimit", template.lowLimit);
    ensureFiniteNumber(relativePath, recordId, "temperatureRangeTemplate.highLimit", template.highLimit);
    ensureFiniteNumber(relativePath, recordId, "temperatureRangeTemplate.range", template.range);

    const computedRange = template.highLimit - template.lowLimit;

    if (computedRange <= 0) {
      throw new Error(`${relativePath} has non-positive temperature range on record ${recordId}`);
    }

    ensureApproxEqual(relativePath, recordId, "temperatureRangeTemplate.range", template.range, computedRange);

    if (!isObject(record.seasonalTemperatureProfiles)) {
      throw new Error(`${relativePath} is missing seasonalTemperatureProfiles on record ${recordId}`);
    }

    const seasonKeys = Object.keys(record.seasonalTemperatureProfiles);
    if (seasonKeys.length !== CLIMATE_SEASONS.length || seasonKeys.some((season) => !CLIMATE_SEASONS.includes(season))) {
      throw new Error(`${relativePath} has invalid seasonalTemperatureProfiles seasons on record ${recordId}`);
    }

    for (const season of CLIMATE_SEASONS) {
      const seasonProfile = record.seasonalTemperatureProfiles[season];
      const expectedRatios = CLIMATE_SEASON_RATIOS[season];

      if (!isObject(seasonProfile)) {
        throw new Error(`${relativePath} is missing seasonal profile '${season}' on record ${recordId}`);
      }

      ensureFiniteNumber(relativePath, recordId, `seasonalTemperatureProfiles.${season}.lowOffsetRatio`, seasonProfile.lowOffsetRatio);
      ensureFiniteNumber(relativePath, recordId, `seasonalTemperatureProfiles.${season}.highOffsetRatio`, seasonProfile.highOffsetRatio);
      ensureFiniteNumber(relativePath, recordId, `seasonalTemperatureProfiles.${season}.low`, seasonProfile.low);
      ensureFiniteNumber(relativePath, recordId, `seasonalTemperatureProfiles.${season}.high`, seasonProfile.high);

      ensureApproxEqual(
        relativePath,
        recordId,
        `seasonalTemperatureProfiles.${season}.lowOffsetRatio`,
        seasonProfile.lowOffsetRatio,
        expectedRatios.low
      );
      ensureApproxEqual(
        relativePath,
        recordId,
        `seasonalTemperatureProfiles.${season}.highOffsetRatio`,
        seasonProfile.highOffsetRatio,
        expectedRatios.high
      );

      const expectedLow = template.lowLimit + (template.range * expectedRatios.low);
      const expectedHigh = template.lowLimit + (template.range * expectedRatios.high);

      ensureApproxEqual(relativePath, recordId, `seasonalTemperatureProfiles.${season}.low`, seasonProfile.low, expectedLow);
      ensureApproxEqual(relativePath, recordId, `seasonalTemperatureProfiles.${season}.high`, seasonProfile.high, expectedHigh);

      if (seasonProfile.low > seasonProfile.high) {
        throw new Error(`${relativePath} has low greater than high in season '${season}' on record ${recordId}`);
      }
    }
  }
}

function validateWorkplaceAbstractions(relativePath, records) {
  const abstractionKeys = new Set();
  const abstractionIds = new Set();
  const abstractionCategories = new Set(["terrain_access", "resource_source", "agricultural_site", "wildland"]);
  const usageContexts = new Set(["workplace_io", "workplace_progression"]);

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    ensureString(relativePath, recordId, "abstractionKey", record.abstractionKey);
    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "category", record.category);
    ensureString(relativePath, recordId, "description", record.description);
    ensureStringArray(relativePath, recordId, "usageContexts", record.usageContexts, 1);

    if (!/^abstraction\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid abstraction id '${record.id}' on record ${recordId}`);
    }

    if (!ITEM_KEY_PATTERN.test(record.abstractionKey)) {
      throw new Error(`${relativePath} has invalid abstractionKey '${record.abstractionKey}' on record ${recordId}`);
    }

    if (abstractionIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate abstraction id '${record.id}'`);
    }
    abstractionIds.add(record.id);

    if (abstractionKeys.has(record.abstractionKey)) {
      throw new Error(`${relativePath} has duplicate abstractionKey '${record.abstractionKey}'`);
    }
    abstractionKeys.add(record.abstractionKey);

    ensureSetMembership(relativePath, recordId, "category", record.category, abstractionCategories);
    for (const usageContext of record.usageContexts) {
      ensureSetMembership(relativePath, recordId, "usageContexts", usageContext, usageContexts);
    }
  }
}

function validateBuildings(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    if (typeof record.id !== "string" || !/^building\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid building id on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate building id ${record.id}`);
    }
    seenIds.add(record.id);

    if (typeof record.name !== "string" || record.name.trim().length === 0) {
      throw new Error(`${relativePath} record ${recordId} must define a non-empty name`);
    }
    if (typeof record.summary !== "string" || record.summary.trim().length === 0) {
      throw new Error(`${relativePath} record ${recordId} must define a non-empty summary`);
    }

    ensureSetMembership(relativePath, recordId, "category", record.category, BUILDING_CATEGORIES);

    for (const field of ["hostedWorkplaceIds", "serviceFunctions", "triggerBusinessTypes", "compatibleSettlementTypes"]) {
      if (!Array.isArray(record[field])) {
        throw new Error(`${relativePath} record ${recordId} must define array field ${field}`);
      }
    }

    if (record.hostedWorkplaceIds.length === 0 && record.serviceFunctions.length === 0) {
      throw new Error(`${relativePath} record ${recordId} must host workplaces or expose serviceFunctions`);
    }

    for (const settlementType of record.compatibleSettlementTypes) {
      ensureSetMembership(relativePath, recordId, "compatibleSettlementTypes", settlementType, SETTLEMENT_TYPES);
    }

    if (!isObject(record.requiredInfrastructure)) {
      throw new Error(`${relativePath} record ${recordId} must define requiredInfrastructure`);
    }
    for (const tierField of ["roadTier", "waterTier", "harborTier", "marketTier", "fortificationTier"]) {
      const value = record.requiredInfrastructure[tierField];
      if (!Number.isInteger(value) || value < 0 || value > 5) {
        throw new Error(`${relativePath} record ${recordId} has invalid requiredInfrastructure.${tierField}`);
      }
    }

    if (!isObject(record.placeability)) {
      throw new Error(`${relativePath} record ${recordId} must define placeability`);
    }
    if (!Array.isArray(record.placeability.supportedSiteClasses) || record.placeability.supportedSiteClasses.length === 0) {
      throw new Error(`${relativePath} record ${recordId} must define supportedSiteClasses`);
    }
    for (const siteClass of record.placeability.supportedSiteClasses) {
      ensureSetMembership(relativePath, recordId, "placeability.supportedSiteClasses", siteClass, SETTLEMENT_SITE_CLASSES);
    }
    if (!Array.isArray(record.placeability.requiredRouteModes)) {
      throw new Error(`${relativePath} record ${recordId} must define placeability.requiredRouteModes`);
    }
    for (const routeMode of record.placeability.requiredRouteModes) {
      ensureSetMembership(relativePath, recordId, "placeability.requiredRouteModes", routeMode, SETTLEMENT_ROUTE_MODES);
    }
    for (const flagField of ["requiresWaterAccess", "requiresCoastalAccess", "requiresRiverAccess"]) {
      if (typeof record.placeability[flagField] !== "boolean") {
        throw new Error(`${relativePath} record ${recordId} has invalid placeability.${flagField}`);
      }
    }

    for (const profile of record.storageProfiles ?? []) {
      ensureSetMembership(relativePath, recordId, "storageProfiles.storageType", profile.storageType, BUILDING_STORAGE_TYPES);
      if (typeof profile.capacityUnits !== "number" || Number.isNaN(profile.capacityUnits) || profile.capacityUnits <= 0) {
        throw new Error(`${relativePath} record ${recordId} has invalid storageProfiles.capacityUnits`);
      }
      if (!Array.isArray(profile.goodsFocus) || profile.goodsFocus.length === 0) {
        throw new Error(`${relativePath} record ${recordId} storageProfiles.goodsFocus must be a non-empty array`);
      }
    }
  }
}

function validateWorkplaces(relativePath, records) {
  const workplaceIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "category", record.category);
    ensureStringArray(relativePath, recordId, "inputTags", record.inputTags, 0);
    if ("siteTags" in record) {
      ensureStringArray(relativePath, recordId, "siteTags", record.siteTags, 0);
    }
    ensureStringArray(relativePath, recordId, "outputTags", record.outputTags, 1);
    ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, "laborSlots", record.laborSlots, 1);
    ensureSetMembership(relativePath, recordId, "category", record.category, WORKPLACE_CATEGORIES);

    if (new Set(record.inputTags).size !== record.inputTags.length) {
      throw new Error(`${relativePath} has duplicate inputTags values on record ${recordId}`);
    }

    if (Array.isArray(record.siteTags) && new Set(record.siteTags).size !== record.siteTags.length) {
      throw new Error(`${relativePath} has duplicate siteTags values on record ${recordId}`);
    }

    if (new Set(record.outputTags).size !== record.outputTags.length) {
      throw new Error(`${relativePath} has duplicate outputTags values on record ${recordId}`);
    }

    for (const inputTag of record.inputTags) {
      if (!isValidMarketItemKey(inputTag)) {
        throw new Error(`${relativePath} has invalid inputTags value '${inputTag}' on record ${recordId}`);
      }
    }

    for (const siteTag of record.siteTags ?? []) {
      if (!ITEM_KEY_PATTERN.test(siteTag)) {
        throw new Error(`${relativePath} has invalid siteTags value '${siteTag}' on record ${recordId}`);
      }
    }

    for (const outputTag of record.outputTags) {
      if (!isValidMarketItemKey(outputTag)) {
        throw new Error(`${relativePath} has invalid outputTags value '${outputTag}' on record ${recordId}`);
      }
    }

    for (const inputTag of record.inputTags) {
      if ((record.siteTags ?? []).includes(inputTag)) {
        throw new Error(`${relativePath} inputTags value '${inputTag}' must not also appear in siteTags on record ${recordId}`);
      }
    }

    if (workplaceIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate workplace id ${record.id}`);
    }
    workplaceIds.add(record.id);
  }

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    if (!("ioProfile" in record) || !isObject(record.ioProfile)) {
      throw new Error(`${relativePath} has invalid or missing ioProfile on record ${recordId}`);
    }

    const ioProfile = record.ioProfile;
    const workCycleHours = ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, "ioProfile.workCycleHours", ioProfile.workCycleHours, 1);
    if (workCycleHours !== null && workCycleHours > 24) {
      throw new Error(`${relativePath} has ioProfile.workCycleHours above 24 on record ${recordId}`);
    }

    if (!Array.isArray(ioProfile.inputs)) {
      throw new Error(`${relativePath} has non-array ioProfile.inputs on record ${recordId}`);
    }

    if ("siteRequirements" in ioProfile && !Array.isArray(ioProfile.siteRequirements)) {
      throw new Error(`${relativePath} has non-array ioProfile.siteRequirements on record ${recordId}`);
    }

    if (!Array.isArray(ioProfile.outputs)) {
      throw new Error(`${relativePath} has non-array ioProfile.outputs on record ${recordId}`);
    }

    if ("yieldGroups" in ioProfile && !Array.isArray(ioProfile.yieldGroups)) {
      throw new Error(`${relativePath} has non-array ioProfile.yieldGroups on record ${recordId}`);
    }

    if (ioProfile.inputs.length === 0 && (ioProfile.siteRequirements ?? []).length === 0) {
      throw new Error(`${relativePath} must include item inputs or siteRequirements on record ${recordId}`);
    }

    if (ioProfile.outputs.length === 0 && (ioProfile.yieldGroups ?? []).length === 0) {
      throw new Error(`${relativePath} must include deterministic outputs or yieldGroups on record ${recordId}`);
    }

    const seenInputItemKeys = new Set();
    const seenSiteRequirementKeys = new Set();
    const seenOutputItemKeys = new Set();
    let ioPrimaryOutputs = 0;

    for (const [index, input] of ioProfile.inputs.entries()) {
      const inputField = `ioProfile.inputs[${index}]`;

      if (!isObject(input)) {
        throw new Error(`${relativePath} has invalid ${inputField} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${inputField}.itemKey`, input.itemKey);
      if (!isValidMarketItemKey(input.itemKey)) {
        throw new Error(`${relativePath} has invalid ${inputField}.itemKey '${input.itemKey}' on record ${recordId}`);
      }

      if (seenInputItemKeys.has(input.itemKey)) {
        throw new Error(`${relativePath} has duplicate ${inputField}.itemKey '${input.itemKey}' on record ${recordId}`);
      }
      seenInputItemKeys.add(input.itemKey);

      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${inputField}.quantityPerCycle`, input.quantityPerCycle, 0.0001);
      ensureString(relativePath, recordId, `${inputField}.unit`, input.unit);
      if (!SLUG_PATTERN.test(input.unit)) {
        throw new Error(`${relativePath} has invalid ${inputField}.unit '${input.unit}' on record ${recordId}`);
      }

      ensureSetMembership(
        relativePath,
        recordId,
        `${inputField}.consumptionType`,
        input.consumptionType,
        WORKPLACE_IO_CONSUMPTION_TYPES
      );
    }

    for (const [index, requirement] of (ioProfile.siteRequirements ?? []).entries()) {
      const requirementField = `ioProfile.siteRequirements[${index}]`;

      if (!isObject(requirement)) {
        throw new Error(`${relativePath} has invalid ${requirementField} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${requirementField}.abstractionKey`, requirement.abstractionKey);
      if (!ITEM_KEY_PATTERN.test(requirement.abstractionKey)) {
        throw new Error(
          `${relativePath} has invalid ${requirementField}.abstractionKey '${requirement.abstractionKey}' on record ${recordId}`
        );
      }

      if (seenSiteRequirementKeys.has(requirement.abstractionKey)) {
        throw new Error(
          `${relativePath} has duplicate ${requirementField}.abstractionKey '${requirement.abstractionKey}' on record ${recordId}`
        );
      }
      seenSiteRequirementKeys.add(requirement.abstractionKey);

      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${requirementField}.quantityPerCycle`, requirement.quantityPerCycle, 0.0001);
      ensureString(relativePath, recordId, `${requirementField}.unit`, requirement.unit);
      if (!SLUG_PATTERN.test(requirement.unit)) {
        throw new Error(`${relativePath} has invalid ${requirementField}.unit '${requirement.unit}' on record ${recordId}`);
      }
    }

    for (const [index, output] of ioProfile.outputs.entries()) {
      const outputField = `ioProfile.outputs[${index}]`;

      if (!isObject(output)) {
        throw new Error(`${relativePath} has invalid ${outputField} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${outputField}.itemKey`, output.itemKey);
      if (!isValidMarketItemKey(output.itemKey)) {
        throw new Error(`${relativePath} has invalid ${outputField}.itemKey '${output.itemKey}' on record ${recordId}`);
      }

      if (seenOutputItemKeys.has(output.itemKey)) {
        throw new Error(`${relativePath} has duplicate ${outputField}.itemKey '${output.itemKey}' on record ${recordId}`);
      }
      seenOutputItemKeys.add(output.itemKey);

      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${outputField}.quantityPerCycle`, output.quantityPerCycle, 0.0001);
      ensureString(relativePath, recordId, `${outputField}.unit`, output.unit);
      if (!SLUG_PATTERN.test(output.unit)) {
        throw new Error(`${relativePath} has invalid ${outputField}.unit '${output.unit}' on record ${recordId}`);
      }

      ensureSetMembership(
        relativePath,
        recordId,
        `${outputField}.productionType`,
        output.productionType,
        WORKPLACE_IO_PRODUCTION_TYPES
      );

      if (output.productionType === "primary") {
        ioPrimaryOutputs += 1;
      }
    }

    for (const [groupIndex, group] of (ioProfile.yieldGroups ?? []).entries()) {
      const groupField = `ioProfile.yieldGroups[${groupIndex}]`;

      if (!isObject(group)) {
        throw new Error(`${relativePath} has invalid ${groupField} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${groupField}.groupId`, group.groupId);
      if (!SLUG_PATTERN.test(group.groupId)) {
        throw new Error(`${relativePath} has invalid ${groupField}.groupId '${group.groupId}' on record ${recordId}`);
      }

      ensureSetMembership(
        relativePath,
        recordId,
        `${groupField}.selectionMode`,
        group.selectionMode,
        WORKPLACE_YIELD_GROUP_SELECTION_MODES
      );

      if ("drawsPerCycle" in group) {
        ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${groupField}.drawsPerCycle`, group.drawsPerCycle, 1);
      }

      if (!Array.isArray(group.outputs) || group.outputs.length === 0) {
        throw new Error(`${relativePath} has empty ${groupField}.outputs on record ${recordId}`);
      }

      const seenGroupOutputKeys = new Set();
      for (const [outputIndex, output] of group.outputs.entries()) {
        const outputField = `${groupField}.outputs[${outputIndex}]`;
        if (!isObject(output)) {
          throw new Error(`${relativePath} has invalid ${outputField} on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${outputField}.itemKey`, output.itemKey);
        if (!isValidMarketItemKey(output.itemKey)) {
          throw new Error(`${relativePath} has invalid ${outputField}.itemKey '${output.itemKey}' on record ${recordId}`);
        }

        if (seenOutputItemKeys.has(output.itemKey) || seenGroupOutputKeys.has(output.itemKey)) {
          throw new Error(`${relativePath} has duplicate grouped output itemKey '${output.itemKey}' on record ${recordId}`);
        }
        seenOutputItemKeys.add(output.itemKey);
        seenGroupOutputKeys.add(output.itemKey);

        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${outputField}.quantityPerCycle`, output.quantityPerCycle, 0.0001);
        ensureString(relativePath, recordId, `${outputField}.unit`, output.unit);
        if (!SLUG_PATTERN.test(output.unit)) {
          throw new Error(`${relativePath} has invalid ${outputField}.unit '${output.unit}' on record ${recordId}`);
        }

        ensureSetMembership(
          relativePath,
          recordId,
          `${outputField}.productionType`,
          output.productionType,
          WORKPLACE_IO_PRODUCTION_TYPES
        );

        if ("weight" in output) {
          ensureNumber(relativePath, recordId, `${outputField}.weight`, output.weight, 0.0001);
        }

        if (output.productionType === "primary") {
          ioPrimaryOutputs += 1;
        }
      }
    }

    if (ioPrimaryOutputs < 1) {
      throw new Error(`${relativePath} must include at least one primary output on record ${recordId}`);
    }

    if (seenSiteRequirementKeys.size !== (record.siteTags ?? []).length) {
      throw new Error(`${relativePath} ioProfile.siteRequirements count does not match siteTags on record ${recordId}`);
    }

    for (const inputItemKey of seenInputItemKeys) {
      if (!record.inputTags.includes(inputItemKey)) {
        throw new Error(`${relativePath} ioProfile.inputs item '${inputItemKey}' missing from inputTags on record ${recordId}`);
      }
    }

    for (const siteRequirementKey of seenSiteRequirementKeys) {
      if (!(record.siteTags ?? []).includes(siteRequirementKey)) {
        throw new Error(
          `${relativePath} ioProfile.siteRequirements abstraction '${siteRequirementKey}' missing from siteTags on record ${recordId}`
        );
      }
    }

    for (const outputItemKey of seenOutputItemKeys) {
      if (!record.outputTags.includes(outputItemKey)) {
        throw new Error(`${relativePath} workplace output item '${outputItemKey}' missing from outputTags on record ${recordId}`);
      }
    }

    for (const input of ioProfile.inputs) {
      if (input.itemKey === "irrigation_water") {
        throw new Error(`${relativePath} irrigation_water transport input is deprecated on record ${recordId}`);
      }
    }

    for (const output of [...ioProfile.outputs, ...((ioProfile.yieldGroups ?? []).flatMap((group) => group.outputs ?? []))]) {
      if (output.itemKey === "irrigation_water") {
        throw new Error(`${relativePath} irrigation_water transport output is deprecated on record ${recordId}`);
      }

      if (output.itemKey === "irrigated_plot") {
        throw new Error(
          `${relativePath} workplace output irrigated_plot is deprecated; irrigation capability must come from infrastructure.json on record ${recordId}`
        );
      }
    }

    if (record.category !== "extraction" && (ioProfile.yieldGroups ?? []).length > 0) {
      throw new Error(`${relativePath} yieldGroups are only allowed on extraction workplaces; record ${recordId} is ${record.category}`);
    }

    if ("irrigationProfile" in record) {
      throw new Error(`${relativePath} irrigationProfile is deprecated on workplace record ${recordId}; move irrigation data to infrastructure.json`);
    }

    if (isObject(record.tierProfile) && record.tierProfile.trackId === "track.irrigation") {
      throw new Error(`${relativePath} track.irrigation is no longer a workplace track; move record ${recordId} to infrastructure.json`);
    }

    if ("plotProfile" in record) {
      if (!isObject(record.plotProfile)) {
        throw new Error(`${relativePath} has invalid plotProfile on record ${recordId}`);
      }

      const plot = record.plotProfile;
      ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, "plotProfile.plotCapacity", plot.plotCapacity, 1);
      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, "plotProfile.usableAreaPerPlot", plot.usableAreaPerPlot, 0.0001);
      ensureBooleanOrEmptyObjectPlaceholder(relativePath, recordId, "plotProfile.proportionalAreaScaling", plot.proportionalAreaScaling);

      ensureStringArray(relativePath, recordId, "plotProfile.allowedPlotTypes", plot.allowedPlotTypes, 1);
      if (new Set(plot.allowedPlotTypes).size !== plot.allowedPlotTypes.length) {
        throw new Error(`${relativePath} has duplicate plotProfile.allowedPlotTypes values on record ${recordId}`);
      }
      for (const plotType of plot.allowedPlotTypes) {
        ensureSetMembership(relativePath, recordId, "plotProfile.allowedPlotTypes", plotType, WORKPLACE_PLOT_TYPES);
      }

      if (!isObject(plot.irrigationPolicy)) {
        throw new Error(`${relativePath} has invalid plotProfile.irrigationPolicy on record ${recordId}`);
      }
      const minimumIrrigationTier = ensureIntegerOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        "plotProfile.irrigationPolicy.minimumIrrigationTier",
        plot.irrigationPolicy.minimumIrrigationTier,
        0
      );
      if (minimumIrrigationTier !== null && minimumIrrigationTier > 5) {
        throw new Error(`${relativePath} has plotProfile.irrigationPolicy.minimumIrrigationTier above 5 on record ${recordId}`);
      }
      const bonusPerTierAboveMinimum = ensureNumberOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        "plotProfile.irrigationPolicy.bonusPerTierAboveMinimum",
        plot.irrigationPolicy.bonusPerTierAboveMinimum,
        0
      );
      const maxTierBonus = ensureNumberOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        "plotProfile.irrigationPolicy.maxTierBonus",
        plot.irrigationPolicy.maxTierBonus,
        0
      );
      if (
        bonusPerTierAboveMinimum !== null &&
        maxTierBonus !== null &&
        bonusPerTierAboveMinimum > maxTierBonus
      ) {
        throw new Error(`${relativePath} has plotProfile.irrigationPolicy.bonusPerTierAboveMinimum above maxTierBonus on record ${recordId}`);
      }

      ensureStringArray(relativePath, recordId, "plotProfile.specialtyUpgrades", plot.specialtyUpgrades, 0);
      if (new Set(plot.specialtyUpgrades).size !== plot.specialtyUpgrades.length) {
        throw new Error(`${relativePath} has duplicate plotProfile.specialtyUpgrades values on record ${recordId}`);
      }
      for (const upgrade of plot.specialtyUpgrades) {
        ensureSetMembership(relativePath, recordId, "plotProfile.specialtyUpgrades", upgrade, WORKPLACE_PLOT_SPECIALTY_UPGRADES);
      }

      ensureStringArray(relativePath, recordId, "plotProfile.terrainCompatibility", plot.terrainCompatibility, 1);
      if (new Set(plot.terrainCompatibility).size !== plot.terrainCompatibility.length) {
        throw new Error(`${relativePath} has duplicate plotProfile.terrainCompatibility values on record ${recordId}`);
      }
      for (const terrain of plot.terrainCompatibility) {
        ensureSetMembership(relativePath, recordId, "plotProfile.terrainCompatibility", terrain, WORKPLACE_PLOT_TERRAINS);
      }
    }

    // agriculture tier plot semantics
    if (isObject(record.tierProfile) && record.tierProfile.trackId === "track.agriculture") {
      if (!isObject(record.plotProfile)) {
        throw new Error(`${relativePath} agriculture track record requires plotProfile on record ${recordId}`);
      }

      const plotTypes = new Set(record.plotProfile.allowedPlotTypes);
      const tier = Number.isInteger(record.tierProfile.tier) ? record.tierProfile.tier : null;

      if (tier === 1) {
        if (plotTypes.size !== 1 || !plotTypes.has("garden")) {
          throw new Error(`${relativePath} agriculture tier 1 must support only garden plots on record ${recordId}`);
        }
      }

      if (tier === 2) {
        for (const plotType of plotTypes) {
          if (plotType !== "farmland" && plotType !== "orchard") {
            throw new Error(`${relativePath} agriculture tier 2 may only use farmland or orchard plots on record ${recordId}`);
          }
        }
        if (!plotTypes.has("farmland")) {
          throw new Error(`${relativePath} agriculture tier 2 must include farmland plot mode on record ${recordId}`);
        }
      }

      if (tier >= 3) {
        const requiredHighTierPlotTypes = ["farmland", "raised_bed", "orchard", "terraced_farm", "terraced_orchard", "greenhouse"];
        for (const plotType of requiredHighTierPlotTypes) {
          if (!plotTypes.has(plotType)) {
            throw new Error(`${relativePath} agriculture tier ${tier} must include plot mode '${plotType}' on record ${recordId}`);
          }
        }
      }

      const minimumByTier = new Map([
        [1, 0],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 4]
      ]);
      const minimumRequiredIrrigation = minimumByTier.get(tier) ?? 0;
      const irrigationTier =
        Number.isInteger(record.plotProfile.irrigationPolicy.minimumIrrigationTier) ?
          record.plotProfile.irrigationPolicy.minimumIrrigationTier :
          null;
      if (tier !== null && irrigationTier !== null && irrigationTier < minimumRequiredIrrigation) {
        throw new Error(
          `${relativePath} agriculture tier ${tier} requires minimumIrrigationTier >= ${minimumRequiredIrrigation} on record ${recordId}`
        );
      }

      if (tier >= 2 && !record.inputTags.includes("irrigated_plot")) {
        throw new Error(`${relativePath} agriculture tier ${tier} must include irrigated_plot input tag on record ${recordId}`);
      }
    }

    if ("tierProfile" in record) {
      if (!isObject(record.tierProfile)) {
        throw new Error(`${relativePath} has invalid tierProfile on record ${recordId}`);
      }

      const tier = record.tierProfile;
      ensureString(relativePath, recordId, "tierProfile.trackId", tier.trackId);
      if (!WORKPLACE_TRACK_ID_PATTERN.test(tier.trackId)) {
        throw new Error(`${relativePath} has invalid tierProfile.trackId '${tier.trackId}' on record ${recordId}`);
      }

      const tierNumber = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, "tierProfile.tier", tier.tier, 1);
      if (tierNumber !== null && tierNumber > 5) {
        throw new Error(`${relativePath} has tierProfile.tier above 5 on record ${recordId}`);
      }

      ensureString(relativePath, recordId, "tierProfile.tierLabel", tier.tierLabel);
      ensureSetMembership(relativePath, recordId, "tierProfile.facilityForm", tier.facilityForm, WORKPLACE_FACILITY_FORMS);
      ensureSetMembership(relativePath, recordId, "tierProfile.techLevel", tier.techLevel, WORKPLACE_TECH_LEVELS);
      ensureSetMembership(relativePath, recordId, "tierProfile.ownershipModel", tier.ownershipModel, WORKPLACE_OWNERSHIP_MODELS);
      ensureSetMembership(relativePath, recordId, "tierProfile.wealthBand", tier.wealthBand, WORKPLACE_WEALTH_BANDS);

      if (tier.upgradesFrom !== null && typeof tier.upgradesFrom !== "string") {
        throw new Error(`${relativePath} has invalid tierProfile.upgradesFrom on record ${recordId}`);
      }

      ensureStringArray(relativePath, recordId, "tierProfile.upgradesTo", tier.upgradesTo, 0);
      ensureBooleanOrEmptyObjectPlaceholder(relativePath, recordId, "tierProfile.splitFacility", tier.splitFacility);
      ensureStringArray(relativePath, recordId, "tierProfile.regionalSuitability", tier.regionalSuitability, 0);

      if (tier.upgradesFrom === record.id) {
        throw new Error(`${relativePath} has self-referencing tierProfile.upgradesFrom on record ${recordId}`);
      }

      for (const upgradeTarget of tier.upgradesTo) {
        if (upgradeTarget === record.id) {
          throw new Error(`${relativePath} has self-referencing tierProfile.upgradesTo on record ${recordId}`);
        }
      }
    }

    if ("efficiencyProfile" in record) {
      if (!isObject(record.efficiencyProfile)) {
        throw new Error(`${relativePath} has invalid efficiencyProfile on record ${recordId}`);
      }

      const efficiency = record.efficiencyProfile;
      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, "efficiencyProfile.throughputMultiplier", efficiency.throughputMultiplier, 0.01);
      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, "efficiencyProfile.laborEfficiency", efficiency.laborEfficiency, 0.01);
      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, "efficiencyProfile.wasteMultiplier", efficiency.wasteMultiplier, 0.01);
      const comfortScore = ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, "efficiencyProfile.comfortScore", efficiency.comfortScore, 0);

      if (comfortScore !== null && comfortScore > 1) {
        throw new Error(`${relativePath} has efficiencyProfile.comfortScore above 1 on record ${recordId}`);
      }
    }

    if ("marketProfile" in record) {
      if (!isObject(record.marketProfile)) {
        throw new Error(`${relativePath} has invalid marketProfile on record ${recordId}`);
      }

      const market = record.marketProfile;
      ensureSetMembership(relativePath, recordId, "marketProfile.businessScale", market.businessScale, WORKPLACE_BUSINESS_SCALES);
      ensureSetMembership(relativePath, recordId, "marketProfile.consumerScope", market.consumerScope, WORKPLACE_CONSUMER_SCOPES);
      ensureSetMembership(relativePath, recordId, "marketProfile.supplyAccess", market.supplyAccess, WORKPLACE_SUPPLY_ACCESS);
      ensureSetMembership(relativePath, recordId, "marketProfile.riskTolerance", market.riskTolerance, WORKPLACE_RISK_TOLERANCE);
      ensureStringArray(relativePath, recordId, "marketProfile.districtTags", market.districtTags, 1);

      if (isObject(record.tierProfile)) {
        const overlap = market.districtTags.some((tag) => record.tierProfile.regionalSuitability.includes(tag));
        if (!overlap) {
          throw new Error(
            `${relativePath} has marketProfile.districtTags with no overlap with tierProfile.regionalSuitability on record ${recordId}`
          );
        }
      }
    }

    if ("progressionProfile" in record) {
      if (!isObject(record.progressionProfile)) {
        throw new Error(`${relativePath} has invalid progressionProfile on record ${recordId}`);
      }

      const progression = record.progressionProfile;
      const progressionMaxTier = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, "progressionProfile.maxTier", progression.maxTier, 1);
      if (progressionMaxTier !== null && progressionMaxTier > 5) {
        throw new Error(`${relativePath} has progressionProfile.maxTier above 5 on record ${recordId}`);
      }

      if (!Array.isArray(progression.tiers) || progression.tiers.length === 0) {
        throw new Error(`${relativePath} has empty progressionProfile.tiers on record ${recordId}`);
      }

      if (progressionMaxTier !== null && progression.tiers.length !== progressionMaxTier) {
        throw new Error(`${relativePath} progressionProfile.tiers length must equal maxTier on record ${recordId}`);
      }

      const seenProgressTiers = new Set();
      for (const [index, tierDef] of progression.tiers.entries()) {
        const tierField = `progressionProfile.tiers[${index}]`;
        if (!isObject(tierDef)) {
          throw new Error(`${relativePath} has invalid ${tierField} on record ${recordId}`);
        }

        const progressionTier = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.tier`, tierDef.tier, 1);
        if (progressionTier !== null && progressionTier > 5) {
          throw new Error(`${relativePath} has ${tierField}.tier above 5 on record ${recordId}`);
        }

        if (progressionTier !== null && seenProgressTiers.has(progressionTier)) {
          throw new Error(`${relativePath} has duplicate ${tierField}.tier ${tierDef.tier} on record ${recordId}`);
        }
        if (progressionTier !== null) {
          seenProgressTiers.add(progressionTier);
        }

        ensureString(relativePath, recordId, `${tierField}.tierLabel`, tierDef.tierLabel);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.throughputMultiplier`, tierDef.throughputMultiplier, 0.01);
        ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.variantSlots`, tierDef.variantSlots, 1);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.switchLaborCost`, tierDef.switchLaborCost, 0);

        ensureSetMembership(
          relativePath,
          recordId,
          `${tierField}.powerMode`,
          tierDef.powerMode,
          WORKPLACE_PROGRESS_POWER_MODES
        );

        if ("facilityForm" in tierDef) {
          ensureSetMembership(relativePath, recordId, `${tierField}.facilityForm`, tierDef.facilityForm, WORKPLACE_FACILITY_FORMS);
        }

        if ("ownershipModel" in tierDef) {
          ensureSetMembership(
            relativePath,
            recordId,
            `${tierField}.ownershipModel`,
            tierDef.ownershipModel,
            WORKPLACE_OWNERSHIP_MODELS
          );
        }

        if ("techLevel" in tierDef) {
          ensureSetMembership(relativePath, recordId, `${tierField}.techLevel`, tierDef.techLevel, WORKPLACE_TECH_LEVELS);
        }

        if ("wealthBand" in tierDef) {
          ensureSetMembership(relativePath, recordId, `${tierField}.wealthBand`, tierDef.wealthBand, WORKPLACE_WEALTH_BANDS);
        }

        if ("laborSlots" in tierDef) {
          const tierLaborSlots = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.laborSlots`, tierDef.laborSlots, 1);
          const recordLaborSlots = Number.isInteger(record.laborSlots) ? record.laborSlots : null;
          if (tierLaborSlots !== null && recordLaborSlots !== null && tierLaborSlots > recordLaborSlots) {
            throw new Error(`${relativePath} has ${tierField}.laborSlots above record laborSlots on record ${recordId}`);
          }
        }

        if ("maxConcurrentWorkers" in tierDef) {
          const tierMaxConcurrentWorkers = ensureIntegerOrEmptyObjectPlaceholder(
            relativePath,
            recordId,
            `${tierField}.maxConcurrentWorkers`,
            tierDef.maxConcurrentWorkers,
            1
          );
          const workforceMaxConcurrentWorkers =
            isObject(record.workforceProfile) && Number.isInteger(record.workforceProfile.maxConcurrentWorkers) ?
              record.workforceProfile.maxConcurrentWorkers :
              null;
          if (
            tierMaxConcurrentWorkers !== null &&
            workforceMaxConcurrentWorkers !== null &&
            tierMaxConcurrentWorkers > workforceMaxConcurrentWorkers
          ) {
            throw new Error(
              `${relativePath} has ${tierField}.maxConcurrentWorkers above workforceProfile.maxConcurrentWorkers on record ${recordId}`
            );
          }
        }

        if ("upgradeSlots" in tierDef) {
          ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.upgradeSlots`, tierDef.upgradeSlots, 0);
        }

        if ("requiredUpgradeIds" in tierDef) {
          const requiredUpgradeIds =
            ensureStringArrayOrNull(relativePath, recordId, `${tierField}.requiredUpgradeIds`, tierDef.requiredUpgradeIds, 0) ?? [];
          const tierRequiredUpgradeIds = new Set();
          for (const requiredUpgradeId of requiredUpgradeIds) {
            if (!WORKPLACE_UPGRADE_ID_PATTERN.test(requiredUpgradeId)) {
              throw new Error(
                `${relativePath} has invalid ${tierField}.requiredUpgradeIds value '${requiredUpgradeId}' on record ${recordId}`
              );
            }

            if (tierRequiredUpgradeIds.has(requiredUpgradeId)) {
              throw new Error(
                `${relativePath} has duplicate ${tierField}.requiredUpgradeIds value '${requiredUpgradeId}' on record ${recordId}`
              );
            }
            tierRequiredUpgradeIds.add(requiredUpgradeId);
          }

          if (progressionTier === 1 && tierRequiredUpgradeIds.size > 0) {
            throw new Error(`${relativePath} has tier 1 ${tierField}.requiredUpgradeIds on record ${recordId}`);
          }
        }

        if ("advancementNotes" in tierDef && typeof tierDef.advancementNotes !== "string") {
          throw new Error(`${relativePath} has invalid ${tierField}.advancementNotes on record ${recordId}`);
        }

        ensureStringArray(relativePath, recordId, `${tierField}.variantUnlocks`, tierDef.variantUnlocks, 0);
        for (const variantUnlock of tierDef.variantUnlocks) {
          if (!SLUG_PATTERN.test(variantUnlock)) {
            throw new Error(`${relativePath} has invalid ${tierField}.variantUnlocks value '${variantUnlock}' on record ${recordId}`);
          }
        }

        if ("jobUnlocks" in tierDef) {
          ensureStringArray(relativePath, recordId, `${tierField}.jobUnlocks`, tierDef.jobUnlocks, 0);
          const tierJobUnlocks = new Set();
          for (const jobUnlock of tierDef.jobUnlocks) {
            if (!WORKPLACE_JOB_ID_PATTERN.test(jobUnlock)) {
              throw new Error(`${relativePath} has invalid ${tierField}.jobUnlocks value '${jobUnlock}' on record ${recordId}`);
            }

            if (tierJobUnlocks.has(jobUnlock)) {
              throw new Error(`${relativePath} has duplicate ${tierField}.jobUnlocks value '${jobUnlock}' on record ${recordId}`);
            }
            tierJobUnlocks.add(jobUnlock);
          }
        }

        if ("outputUnlocks" in tierDef) {
          ensureStringArray(relativePath, recordId, `${tierField}.outputUnlocks`, tierDef.outputUnlocks, 0);
          const tierOutputUnlocks = new Set();
          for (const outputUnlock of tierDef.outputUnlocks) {
            if (!isValidMarketItemKey(outputUnlock)) {
              throw new Error(
                `${relativePath} has invalid ${tierField}.outputUnlocks value '${outputUnlock}' on record ${recordId}`
              );
            }

            if (!record.outputTags.includes(outputUnlock)) {
              throw new Error(
                `${relativePath} has ${tierField}.outputUnlocks value '${outputUnlock}' not present in outputTags on record ${recordId}`
              );
            }

            if (tierOutputUnlocks.has(outputUnlock)) {
              throw new Error(
                `${relativePath} has duplicate ${tierField}.outputUnlocks value '${outputUnlock}' on record ${recordId}`
              );
            }
            tierOutputUnlocks.add(outputUnlock);
          }
        }

        if ("districtTags" in tierDef) {
          ensureStringArray(relativePath, recordId, `${tierField}.districtTags`, tierDef.districtTags, 0);
        }

        if (!Array.isArray(tierDef.inputLaborWeights)) {
          throw new Error(`${relativePath} has non-array ${tierField}.inputLaborWeights on record ${recordId}`);
        }

        if ("siteLaborWeights" in tierDef && !Array.isArray(tierDef.siteLaborWeights)) {
          throw new Error(`${relativePath} has non-array ${tierField}.siteLaborWeights on record ${recordId}`);
        }

        if (tierDef.inputLaborWeights.length === 0 && (tierDef.siteLaborWeights ?? []).length === 0) {
          throw new Error(`${relativePath} must include item or site labor weights on ${tierField} for record ${recordId}`);
        }

        const seenLaborWeightItemKeys = new Set();
        for (const [weightIndex, laborWeight] of tierDef.inputLaborWeights.entries()) {
          const weightField = `${tierField}.inputLaborWeights[${weightIndex}]`;
          if (!isObject(laborWeight)) {
            throw new Error(`${relativePath} has invalid ${weightField} on record ${recordId}`);
          }

          ensureString(relativePath, recordId, `${weightField}.itemKey`, laborWeight.itemKey);
          if (!isValidMarketItemKey(laborWeight.itemKey)) {
            throw new Error(`${relativePath} has invalid ${weightField}.itemKey '${laborWeight.itemKey}' on record ${recordId}`);
          }

          if (!record.inputTags.includes(laborWeight.itemKey)) {
            throw new Error(`${relativePath} has ${weightField}.itemKey '${laborWeight.itemKey}' not present in inputTags on record ${recordId}`);
          }

          if (seenLaborWeightItemKeys.has(laborWeight.itemKey)) {
            throw new Error(`${relativePath} has duplicate ${weightField}.itemKey '${laborWeight.itemKey}' on record ${recordId}`);
          }
          seenLaborWeightItemKeys.add(laborWeight.itemKey);

          ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${weightField}.laborWeight`, laborWeight.laborWeight, 0.01);
        }

        const seenSiteLaborWeightKeys = new Set();
        for (const [weightIndex, laborWeight] of (tierDef.siteLaborWeights ?? []).entries()) {
          const weightField = `${tierField}.siteLaborWeights[${weightIndex}]`;
          if (!isObject(laborWeight)) {
            throw new Error(`${relativePath} has invalid ${weightField} on record ${recordId}`);
          }

          ensureString(relativePath, recordId, `${weightField}.abstractionKey`, laborWeight.abstractionKey);
          if (!ITEM_KEY_PATTERN.test(laborWeight.abstractionKey)) {
            throw new Error(
              `${relativePath} has invalid ${weightField}.abstractionKey '${laborWeight.abstractionKey}' on record ${recordId}`
            );
          }

          if (!(record.siteTags ?? []).includes(laborWeight.abstractionKey)) {
            throw new Error(
              `${relativePath} has ${weightField}.abstractionKey '${laborWeight.abstractionKey}' not present in siteTags on record ${recordId}`
            );
          }

          if (seenSiteLaborWeightKeys.has(laborWeight.abstractionKey)) {
            throw new Error(
              `${relativePath} has duplicate ${weightField}.abstractionKey '${laborWeight.abstractionKey}' on record ${recordId}`
            );
          }
          seenSiteLaborWeightKeys.add(laborWeight.abstractionKey);

          ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${weightField}.laborWeight`, laborWeight.laborWeight, 0.01);
        }
      }

      if (progressionMaxTier !== null) {
        for (let expectedTier = 1; expectedTier <= progressionMaxTier; expectedTier += 1) {
          if (!seenProgressTiers.has(expectedTier)) {
            throw new Error(`${relativePath} progressionProfile tiers must be contiguous from 1 on record ${recordId}`);
          }
        }
      }
    }
    if ("upgradesProfile" in record) {
      if (!isObject(record.upgradesProfile)) {
        throw new Error(`${relativePath} has invalid upgradesProfile on record ${recordId}`);
      }

      const upgrades = record.upgradesProfile;
      const upgradesProfileSlots = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, "upgradesProfile.upgradeSlots", upgrades.upgradeSlots, 0);

      if (!Array.isArray(upgrades.availableUpgrades) || upgrades.availableUpgrades.length === 0) {
        throw new Error(`${relativePath} has empty upgradesProfile.availableUpgrades on record ${recordId}`);
      }

      if (!Array.isArray(upgrades.tierUpgradeRequirements)) {
        throw new Error(`${relativePath} has non-array upgradesProfile.tierUpgradeRequirements on record ${recordId}`);
      }

      const upgradeIds = new Set();
      const essentialUpgradeStateById = new Map();

      for (const [index, upgrade] of upgrades.availableUpgrades.entries()) {
        const upgradeField = `upgradesProfile.availableUpgrades[${index}]`;

        if (!isObject(upgrade)) {
          throw new Error(`${relativePath} has invalid ${upgradeField} on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${upgradeField}.id`, upgrade.id);
        if (!WORKPLACE_UPGRADE_ID_PATTERN.test(upgrade.id)) {
          throw new Error(`${relativePath} has invalid ${upgradeField}.id '${upgrade.id}' on record ${recordId}`);
        }

        if (upgradeIds.has(upgrade.id)) {
          throw new Error(`${relativePath} has duplicate ${upgradeField}.id '${upgrade.id}' on record ${recordId}`);
        }
        upgradeIds.add(upgrade.id);

        ensureString(relativePath, recordId, `${upgradeField}.name`, upgrade.name);
        ensureString(relativePath, recordId, `${upgradeField}.description`, upgrade.description);
        ensureSetMembership(relativePath, recordId, `${upgradeField}.category`, upgrade.category, WORKPLACE_UPGRADE_CATEGORIES);

        ensureStringArray(relativePath, recordId, `${upgradeField}.requiredUpgradeIds`, upgrade.requiredUpgradeIds, 0);
        const essentialForTierUpgrade = ensureBooleanOrEmptyObjectPlaceholder(
          relativePath,
          recordId,
          `${upgradeField}.essentialForTierUpgrade`,
          upgrade.essentialForTierUpgrade
        );
        essentialUpgradeStateById.set(upgrade.id, essentialForTierUpgrade);

        if (!isObject(upgrade.effects)) {
          throw new Error(`${relativePath} has invalid ${upgradeField}.effects on record ${recordId}`);
        }

        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${upgradeField}.effects.throughputMultiplier`, upgrade.effects.throughputMultiplier, 0.01);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${upgradeField}.effects.laborEfficiency`, upgrade.effects.laborEfficiency, 0.01);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${upgradeField}.effects.wasteMultiplier`, upgrade.effects.wasteMultiplier, 0.01);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${upgradeField}.effects.qualityMultiplier`, upgrade.effects.qualityMultiplier, 0.01);

        if ("variantSlotDelta" in upgrade.effects) {
          ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${upgradeField}.effects.variantSlotDelta`, upgrade.effects.variantSlotDelta, 0);
        }

        if ("switchLaborCostMultiplier" in upgrade.effects) {
          ensureNumberOrEmptyObjectPlaceholder(
            relativePath,
            recordId,
            `${upgradeField}.effects.switchLaborCostMultiplier`,
            upgrade.effects.switchLaborCostMultiplier,
            0.01
          );
        }

        if ("variantUnlocks" in upgrade.effects) {
          ensureStringArray(relativePath, recordId, `${upgradeField}.effects.variantUnlocks`, upgrade.effects.variantUnlocks, 0);
          for (const variantUnlock of upgrade.effects.variantUnlocks) {
            if (!SLUG_PATTERN.test(variantUnlock)) {
              throw new Error(
                `${relativePath} has invalid ${upgradeField}.effects.variantUnlocks value '${variantUnlock}' on record ${recordId}`
              );
            }
          }
        }
      }

      for (const [index, upgrade] of upgrades.availableUpgrades.entries()) {
        const upgradeField = `upgradesProfile.availableUpgrades[${index}]`;

        for (const requiredId of upgrade.requiredUpgradeIds) {
          if (!upgradeIds.has(requiredId)) {
            throw new Error(`${relativePath} has unknown ${upgradeField}.requiredUpgradeIds '${requiredId}' on record ${recordId}`);
          }

          if (requiredId === upgrade.id) {
            throw new Error(`${relativePath} has self-referencing ${upgradeField}.requiredUpgradeIds on record ${recordId}`);
          }
        }
      }

      const tierUpgradeTargets = new Set();
      for (const [index, requirement] of upgrades.tierUpgradeRequirements.entries()) {
        const requirementField = `upgradesProfile.tierUpgradeRequirements[${index}]`;

        if (!isObject(requirement)) {
          throw new Error(`${relativePath} has invalid ${requirementField} on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${requirementField}.targetWorkplaceId`, requirement.targetWorkplaceId);
        ensureStringArray(relativePath, recordId, `${requirementField}.requiredUpgradeIds`, requirement.requiredUpgradeIds, 1);

        if (tierUpgradeTargets.has(requirement.targetWorkplaceId)) {
          throw new Error(`${relativePath} has duplicate ${requirementField}.targetWorkplaceId '${requirement.targetWorkplaceId}' on record ${recordId}`);
        }
        tierUpgradeTargets.add(requirement.targetWorkplaceId);

        for (const requiredId of requirement.requiredUpgradeIds) {
          if (!upgradeIds.has(requiredId)) {
            throw new Error(`${relativePath} has unknown ${requirementField}.requiredUpgradeIds '${requiredId}' on record ${recordId}`);
          }

          if (essentialUpgradeStateById.get(requiredId) === false) {
            throw new Error(`${relativePath} ${requirementField}.requiredUpgradeIds '${requiredId}' must be marked essentialForTierUpgrade on record ${recordId}`);
          }
        }

        if ("notes" in requirement && typeof requirement.notes !== "string") {
          throw new Error(`${relativePath} has invalid ${requirementField}.notes on record ${recordId}`);
        }
      }

      if (isObject(record.tierProfile) && Array.isArray(record.tierProfile.upgradesTo)) {
        const tierTargets = record.tierProfile.upgradesTo;

        if (tierTargets.length > 0) {
          for (const tierTarget of tierTargets) {
            if (!tierUpgradeTargets.has(tierTarget)) {
              throw new Error(
                `${relativePath} is missing upgradesProfile.tierUpgradeRequirements target '${tierTarget}' on record ${recordId}`
              );
            }
          }

          for (const target of tierUpgradeTargets) {
            if (!tierTargets.includes(target)) {
              throw new Error(
                `${relativePath} has upgradesProfile.tierUpgradeRequirements target '${target}' not present in tierProfile.upgradesTo on record ${recordId}`
              );
            }
          }
        } else if (tierUpgradeTargets.size > 0) {
          throw new Error(`${relativePath} has tierUpgradeRequirements on non-upgrading record ${recordId}`);
        }
      } else if (tierUpgradeTargets.size > 0) {
        throw new Error(`${relativePath} has tierUpgradeRequirements without tierProfile on record ${recordId}`);
      }

      if (isObject(record.progressionProfile)) {
        for (const [index, tierDef] of record.progressionProfile.tiers.entries()) {
          const tierField = `progressionProfile.tiers[${index}]`;

          const tierUpgradeSlots =
            "upgradeSlots" in tierDef ?
              ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${tierField}.upgradeSlots`, tierDef.upgradeSlots, 0) :
              null;
          if (tierUpgradeSlots !== null && upgradesProfileSlots !== null && tierUpgradeSlots > upgradesProfileSlots) {
            throw new Error(`${relativePath} has ${tierField}.upgradeSlots above upgradesProfile.upgradeSlots on record ${recordId}`);
          }

          if ("requiredUpgradeIds" in tierDef) {
            const requiredUpgradeIds =
              ensureStringArrayOrNull(relativePath, recordId, `${tierField}.requiredUpgradeIds`, tierDef.requiredUpgradeIds, 0) ?? [];
            for (const requiredId of requiredUpgradeIds) {
              if (!upgradeIds.has(requiredId)) {
                throw new Error(`${relativePath} has unknown ${tierField}.requiredUpgradeIds '${requiredId}' on record ${recordId}`);
              }

              if (essentialUpgradeStateById.get(requiredId) === false) {
                throw new Error(
                  `${relativePath} ${tierField}.requiredUpgradeIds '${requiredId}' must be marked essentialForTierUpgrade on record ${recordId}`
                );
              }
            }
          }
        }
      }
    } else if (isObject(record.progressionProfile)) {
      for (const [index, tierDef] of record.progressionProfile.tiers.entries()) {
        const tierField = `progressionProfile.tiers[${index}]`;
        if ("upgradeSlots" in tierDef) {
          throw new Error(`${relativePath} has ${tierField}.upgradeSlots without upgradesProfile on record ${recordId}`);
        }
        const requiredUpgradeIds =
          "requiredUpgradeIds" in tierDef ?
            ensureStringArrayOrNull(relativePath, recordId, `${tierField}.requiredUpgradeIds`, tierDef.requiredUpgradeIds, 0) :
            null;
        if (Array.isArray(requiredUpgradeIds) && requiredUpgradeIds.length > 0) {
          throw new Error(`${relativePath} has ${tierField}.requiredUpgradeIds without upgradesProfile on record ${recordId}`);
        }
      }
    }

    if (!("workforceProfile" in record) || !isObject(record.workforceProfile)) {
      throw new Error(`${relativePath} has invalid or missing workforceProfile on record ${recordId}`);
    }

    const workforce = record.workforceProfile;
    const workforceMaxConcurrentWorkers = ensureIntegerOrEmptyObjectPlaceholder(
      relativePath,
      recordId,
      "workforceProfile.maxConcurrentWorkers",
      workforce.maxConcurrentWorkers,
      1
    );

    if (!Array.isArray(workforce.jobs) || workforce.jobs.length === 0) {
      throw new Error(`${relativePath} has empty workforceProfile.jobs on record ${recordId}`);
    }

    const seenJobIds = new Set();
    let primaryJobCount = 0;
    let minimumWorkersFloor = 0;
    let minimumWorkersFloorHasPlaceholders = false;
    const workplaceTier = isObject(record.tierProfile) && Number.isInteger(record.tierProfile.tier) ? record.tierProfile.tier : null;
    const hasProgressionProfile = isObject(record.progressionProfile);

    for (const [index, job] of workforce.jobs.entries()) {
      const jobField = `workforceProfile.jobs[${index}]`;

      if (!isObject(job)) {
        throw new Error(`${relativePath} has invalid ${jobField} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${jobField}.jobId`, job.jobId);
      if (!WORKPLACE_JOB_ID_PATTERN.test(job.jobId)) {
        throw new Error(`${relativePath} has invalid ${jobField}.jobId '${job.jobId}' on record ${recordId}`);
      }

      if (seenJobIds.has(job.jobId)) {
        throw new Error(`${relativePath} has duplicate ${jobField}.jobId '${job.jobId}' on record ${recordId}`);
      }
      seenJobIds.add(job.jobId);

      ensureSetMembership(relativePath, recordId, `${jobField}.role`, job.role, WORKPLACE_WORKFORCE_ROLES);
      if (job.role === "primary") {
        primaryJobCount += 1;
      }

      const requiredTier = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${jobField}.requiredTier`, job.requiredTier, 1);
      if (requiredTier !== null && requiredTier > 5) {
        throw new Error(`${relativePath} has ${jobField}.requiredTier above 5 on record ${recordId}`);
      }

      if (requiredTier !== null && workplaceTier !== null && requiredTier > workplaceTier) {
        throw new Error(`${relativePath} has ${jobField}.requiredTier above workplace tier on record ${recordId}`);
      }

      const minWorkers = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${jobField}.minWorkers`, job.minWorkers, 0);
      const recommendedWorkers = ensureIntegerOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        `${jobField}.recommendedWorkers`,
        job.recommendedWorkers,
        1
      );
      const diminishingStartsAt = ensureIntegerOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        `${jobField}.diminishingStartsAt`,
        job.diminishingStartsAt,
        1
      );
      const maxWorkers = ensureIntegerOrEmptyObjectPlaceholder(relativePath, recordId, `${jobField}.maxWorkers`, job.maxWorkers, 1);

      if (maxWorkers !== null && workforceMaxConcurrentWorkers !== null && maxWorkers > workforceMaxConcurrentWorkers) {
        throw new Error(`${relativePath} has ${jobField}.maxWorkers above workforceProfile.maxConcurrentWorkers on record ${recordId}`);
      }

      if (minWorkers !== null) {
        minimumWorkersFloor += minWorkers;
      } else {
        minimumWorkersFloorHasPlaceholders = true;
      }

      if (minWorkers !== null && recommendedWorkers !== null && minWorkers > recommendedWorkers) {
        throw new Error(`${relativePath} has ${jobField}.minWorkers above recommendedWorkers on record ${recordId}`);
      }

      if (recommendedWorkers !== null && diminishingStartsAt !== null && recommendedWorkers > diminishingStartsAt) {
        throw new Error(`${relativePath} has ${jobField}.recommendedWorkers above diminishingStartsAt on record ${recordId}`);
      }

      if (diminishingStartsAt !== null && maxWorkers !== null && diminishingStartsAt > maxWorkers) {
        throw new Error(`${relativePath} has ${jobField}.diminishingStartsAt above maxWorkers on record ${recordId}`);
      }

      ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${jobField}.baseOutputPerWorker`, job.baseOutputPerWorker, 0);
      const diminishingFactor = ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${jobField}.diminishingFactor`, job.diminishingFactor, 0.01);
      if (diminishingFactor !== null && diminishingFactor > 1) {
        throw new Error(`${relativePath} has ${jobField}.diminishingFactor above 1 on record ${recordId}`);
      }

      ensureStringArray(relativePath, recordId, `${jobField}.unlocks`, job.unlocks, 0);
      if (!isObject(job.toolRequirements)) {
        throw new Error(`${relativePath} has invalid ${jobField}.toolRequirements on record ${recordId}`);
      }

      const minimumToolTier = ensureIntegerOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        `${jobField}.toolRequirements.minimumToolTier`,
        job.toolRequirements.minimumToolTier,
        1
      );
      if (minimumToolTier !== null && minimumToolTier > 5) {
        throw new Error(`${relativePath} has ${jobField}.toolRequirements.minimumToolTier above 5 on record ${recordId}`);
      }

      ensureStringArray(relativePath, recordId, `${jobField}.toolRequirements.requiredToolTags`, job.toolRequirements.requiredToolTags, 1);
      for (const toolTag of job.toolRequirements.requiredToolTags) {
        if (!WORKPLACE_TOOL_TAG_PATTERN.test(toolTag)) {
          throw new Error(`${relativePath} has invalid ${jobField}.toolRequirements.requiredToolTags value '${toolTag}' on record ${recordId}`);
        }
      }

      if (!isObject(job.toolRequirements.missingToolPenalty)) {
        throw new Error(`${relativePath} has invalid ${jobField}.toolRequirements.missingToolPenalty on record ${recordId}`);
      }

      ensureSetMembership(
        relativePath,
        recordId,
        `${jobField}.toolRequirements.missingToolPenalty.mode`,
        job.toolRequirements.missingToolPenalty.mode,
        WORKPLACE_MISSING_TOOL_PENALTY_MODES
      );
      const missingToolOutputMultiplier = ensureNumberOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        `${jobField}.toolRequirements.missingToolPenalty.outputMultiplier`,
        job.toolRequirements.missingToolPenalty.outputMultiplier,
        0
      );

      if (missingToolOutputMultiplier !== null && missingToolOutputMultiplier > 1) {
        throw new Error(`${relativePath} has ${jobField}.toolRequirements.missingToolPenalty.outputMultiplier above 1 on record ${recordId}`);
      }

      if (
        job.toolRequirements.missingToolPenalty.mode === "no_output" &&
        missingToolOutputMultiplier !== null &&
        missingToolOutputMultiplier !== 0
      ) {
        throw new Error(`${relativePath} has ${jobField}.toolRequirements.missingToolPenalty mode no_output with non-zero multiplier on record ${recordId}`);
      }

      if (
        job.toolRequirements.missingToolPenalty.mode === "reduced_output" &&
        missingToolOutputMultiplier !== null &&
        (missingToolOutputMultiplier <= 0 || missingToolOutputMultiplier >= 1)
      ) {
        throw new Error(`${relativePath} has ${jobField}.toolRequirements.missingToolPenalty reduced_output multiplier outside (0,1) on record ${recordId}`);
      }

      if ("replanting" in job) {
        if (!isObject(job.replanting)) {
          throw new Error(`${relativePath} has invalid ${jobField}.replanting on record ${recordId}`);
        }

        const replantingEnabled = ensureBooleanOrEmptyObjectPlaceholder(relativePath, recordId, `${jobField}.replanting.enabled`, job.replanting.enabled);
        const outputGainPerWorker = ensureNumberOrEmptyObjectPlaceholder(
          relativePath,
          recordId,
          `${jobField}.replanting.outputGainPerWorker`,
          job.replanting.outputGainPerWorker,
          0
        );
        const maxOutputGain = ensureNumberOrEmptyObjectPlaceholder(
          relativePath,
          recordId,
          `${jobField}.replanting.maxOutputGain`,
          job.replanting.maxOutputGain,
          0
        );
        const effectiveRadiusReductionPerWorker = ensureNumberOrEmptyObjectPlaceholder(
          relativePath,
          recordId,
          `${jobField}.replanting.effectiveRadiusReductionPerWorker`,
          job.replanting.effectiveRadiusReductionPerWorker,
          0
        );
        const maxRadiusReduction = ensureNumberOrEmptyObjectPlaceholder(
          relativePath,
          recordId,
          `${jobField}.replanting.maxRadiusReduction`,
          job.replanting.maxRadiusReduction,
          0
        );

        if (outputGainPerWorker !== null && maxOutputGain !== null && outputGainPerWorker > maxOutputGain) {
          throw new Error(`${relativePath} has ${jobField}.replanting.outputGainPerWorker above maxOutputGain on record ${recordId}`);
        }

        if (
          effectiveRadiusReductionPerWorker !== null &&
          maxRadiusReduction !== null &&
          effectiveRadiusReductionPerWorker > maxRadiusReduction
        ) {
          throw new Error(
            `${relativePath} has ${jobField}.replanting.effectiveRadiusReductionPerWorker above maxRadiusReduction on record ${recordId}`
          );
        }

        if (replantingEnabled === true && !job.unlocks.includes("feature.replanting")) {
          throw new Error(`${relativePath} has enabled replanting without feature.replanting unlock on record ${recordId}`);
        }
      }
    }

    if (!hasProgressionProfile && primaryJobCount !== 1) {
      throw new Error(`${relativePath} must define exactly one primary workforce job on record ${recordId}`);
    }

    if (hasProgressionProfile && primaryJobCount < 1) {
      throw new Error(`${relativePath} must define at least one primary workforce job on record ${recordId}`);
    }

    if (!minimumWorkersFloorHasPlaceholders && workforceMaxConcurrentWorkers !== null && minimumWorkersFloor > workforceMaxConcurrentWorkers) {
      throw new Error(`${relativePath} has workforce min worker floor above maxConcurrentWorkers on record ${recordId}`);
    }

    if (hasProgressionProfile) {
      for (const [index, tierDef] of record.progressionProfile.tiers.entries()) {
        const tierField = `progressionProfile.tiers[${index}]`;
        if ("jobUnlocks" in tierDef) {
          for (const jobUnlock of tierDef.jobUnlocks) {
            if (!seenJobIds.has(jobUnlock)) {
              throw new Error(`${relativePath} has ${tierField}.jobUnlocks '${jobUnlock}' not present in workforceProfile.jobs on record ${recordId}`);
            }
          }
        }
      }
    }

    if (
      isObject(record.tierProfile) &&
      record.tierProfile.trackId === "track.forestry" &&
      Number.isInteger(record.tierProfile.tier) &&
      record.tierProfile.tier >= 4
    ) {
      const foresterJob = record.workforceProfile.jobs.find((job) => isObject(job) && job.jobId === "job.forester");
      if (!foresterJob) {
        throw new Error(`${relativePath} is missing job.forester on forestry lodge-or-higher record ${recordId}`);
      }

      if (!Array.isArray(foresterJob.unlocks) || !foresterJob.unlocks.includes("feature.replanting")) {
        throw new Error(`${relativePath} job.forester must unlock feature.replanting on record ${recordId}`);
      }

      if (!isObject(foresterJob.replanting) || foresterJob.replanting.enabled !== true) {
        throw new Error(`${relativePath} job.forester must enable replanting on record ${recordId}`);
      }
    }
    if ("integrationProfile" in record) {
      if (!isObject(record.integrationProfile)) {
        throw new Error(`${relativePath} has invalid integrationProfile on record ${recordId}`);
      }

      const integration = record.integrationProfile;
      ensureSetMembership(relativePath, recordId, "integrationProfile.role", integration.role, WORKPLACE_INTEGRATION_ROLES);
      ensureStringArray(relativePath, recordId, "integrationProfile.comboGroupIds", integration.comboGroupIds, 0);

      for (const comboGroupId of integration.comboGroupIds) {
        if (!WORKPLACE_COMBO_ID_PATTERN.test(comboGroupId)) {
          throw new Error(`${relativePath} has invalid integrationProfile.comboGroupIds value '${comboGroupId}' on record ${recordId}`);
        }
      }

      if (!Array.isArray(integration.comboBonuses)) {
        throw new Error(`${relativePath} has non-array integrationProfile.comboBonuses on record ${recordId}`);
      }

      for (const [index, bonus] of integration.comboBonuses.entries()) {
        const bonusField = `integrationProfile.comboBonuses[${index}]`;

        if (!isObject(bonus)) {
          throw new Error(`${relativePath} has invalid ${bonusField} on record ${recordId}`);
        }

        ensureStringArray(relativePath, recordId, `${bonusField}.withWorkplaceIds`, bonus.withWorkplaceIds, 1);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${bonusField}.throughputMultiplier`, bonus.throughputMultiplier, 0.01);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${bonusField}.laborEfficiency`, bonus.laborEfficiency, 0.01);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${bonusField}.wasteMultiplier`, bonus.wasteMultiplier, 0.01);
        ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${bonusField}.logisticsCostMultiplier`, bonus.logisticsCostMultiplier, 0.01);
      }
    }
  }

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    if (isObject(record.tierProfile)) {
      const tier = record.tierProfile;

      if (Array.isArray(tier.upgradesTo) && tier.upgradesTo.length > 0 && !("upgradesProfile" in record)) {
        throw new Error(`${relativePath} requires upgradesProfile on upgrading workplace record ${recordId}`);
      }

      if (typeof tier.upgradesFrom === "string" && !workplaceIds.has(tier.upgradesFrom)) {
        throw new Error(`${relativePath} has unknown tierProfile.upgradesFrom '${tier.upgradesFrom}' on record ${recordId}`);
      }

      for (const upgradeTarget of tier.upgradesTo) {
        if (!workplaceIds.has(upgradeTarget)) {
          throw new Error(`${relativePath} has unknown tierProfile.upgradesTo '${upgradeTarget}' on record ${recordId}`);
        }
      }
    }

    if (isObject(record.integrationProfile)) {
      for (const [index, bonus] of record.integrationProfile.comboBonuses.entries()) {
        for (const withWorkplaceId of bonus.withWorkplaceIds) {
          if (!workplaceIds.has(withWorkplaceId)) {
            throw new Error(
              `${relativePath} has unknown integrationProfile.comboBonuses[${index}].withWorkplaceIds '${withWorkplaceId}' on record ${recordId}`
            );
          }
        }
      }
    }
  }
}

function isPixelPoint(value) {
  return isObject(value) && Number.isInteger(value.x) && Number.isInteger(value.y) && value.x >= 0 && value.y >= 0;
}

function pointInPolygon(point, polygonPoints) {
  let inside = false;
  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = polygonPoints[i].x;
    const yi = polygonPoints[i].y;
    const xj = polygonPoints[j].x;
    const yj = polygonPoints[j].y;
    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}

function polylineLengthPixels(points) {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const dx = points[index].x - points[index - 1].x;
    const dy = points[index].y - points[index - 1].y;
    total += Math.hypot(dx, dy);
  }
  return total;
}

function validateInfrastructure(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^infrastructure\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid infrastructure id '${record.id}' on record ${recordId}`);
    }

    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate infrastructure id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "category", record.category, INFRASTRUCTURE_CATEGORIES);
    ensureSetMembership(relativePath, recordId, "infrastructureType", record.infrastructureType, INFRASTRUCTURE_TYPES);
    ensureString(relativePath, recordId, "description", record.description);

    if (!Array.isArray(record.serviceOutputs) || record.serviceOutputs.length === 0) {
      throw new Error(`${relativePath} has invalid serviceOutputs on record ${recordId}`);
    }

    for (const [index, output] of record.serviceOutputs.entries()) {
      const field = `serviceOutputs[${index}]`;
      if (!isObject(output)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${field}.itemKey`, output.itemKey);
      if (!ITEM_KEY_PATTERN.test(output.itemKey)) {
        throw new Error(`${relativePath} has invalid ${field}.itemKey '${output.itemKey}' on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${field}.unit`, output.unit);
      if (!SLUG_PATTERN.test(output.unit)) {
        throw new Error(`${relativePath} has invalid ${field}.unit '${output.unit}' on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${field}.description`, output.description);
    }

    if (!isObject(record.constructionPolicy)) {
      throw new Error(`${relativePath} has invalid constructionPolicy on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "constructionPolicy.directBuildAllowed", record.constructionPolicy.directBuildAllowed);
    ensureNumber(relativePath, recordId, "constructionPolicy.upgradeLaborMultiplier", record.constructionPolicy.upgradeLaborMultiplier, 1);
    if (record.constructionPolicy.upgradeLaborMultiplier <= 1) {
      throw new Error(`${relativePath} constructionPolicy.upgradeLaborMultiplier must be greater than 1 on record ${recordId}`);
    }
    ensureNumber(relativePath, recordId, "constructionPolicy.deconstructionLaborShare", record.constructionPolicy.deconstructionLaborShare, 0);
    ensureString(relativePath, recordId, "constructionPolicy.notes", record.constructionPolicy.notes);

    if (!isObject(record.progressionProfile)) {
      throw new Error(`${relativePath} has invalid progressionProfile on record ${recordId}`);
    }

    const progression = record.progressionProfile;
    ensureInteger(relativePath, recordId, "progressionProfile.maxTier", progression.maxTier, 1);
    if (progression.maxTier > 5) {
      throw new Error(`${relativePath} has progressionProfile.maxTier above 5 on record ${recordId}`);
    }
    if (progression.maxTier > 1 && !record.constructionPolicy.directBuildAllowed) {
      throw new Error(`${relativePath} tiered infrastructure must allow direct build at higher tiers on record ${recordId}`);
    }

    if (!Array.isArray(progression.tiers) || progression.tiers.length !== progression.maxTier) {
      throw new Error(`${relativePath} progressionProfile.tiers length must equal maxTier on record ${recordId}`);
    }

    const seenTiers = new Set();
    for (const [index, tierDef] of progression.tiers.entries()) {
      const tierField = `progressionProfile.tiers[${index}]`;
      if (!isObject(tierDef)) {
        throw new Error(`${relativePath} has invalid ${tierField} on record ${recordId}`);
      }

      ensureInteger(relativePath, recordId, `${tierField}.tier`, tierDef.tier, 1);
      if (tierDef.tier > 5) {
        throw new Error(`${relativePath} has ${tierField}.tier above 5 on record ${recordId}`);
      }
      if (seenTiers.has(tierDef.tier)) {
        throw new Error(`${relativePath} has duplicate ${tierField}.tier ${tierDef.tier} on record ${recordId}`);
      }
      seenTiers.add(tierDef.tier);

      ensureString(relativePath, recordId, `${tierField}.tierLabel`, tierDef.tierLabel);
      ensureSetMembership(relativePath, recordId, `${tierField}.techLevel`, tierDef.techLevel, WORKPLACE_TECH_LEVELS);
      ensureStringArray(relativePath, recordId, `${tierField}.technologyRequirements`, tierDef.technologyRequirements, 1);
      for (const tech of tierDef.technologyRequirements) {
        if (!/^(?:feature|tech)\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(tech)) {
          throw new Error(`${relativePath} has invalid ${tierField}.technologyRequirements value '${tech}' on record ${recordId}`);
        }
      }

      ensureNumber(relativePath, recordId, `${tierField}.laborRequirement`, tierDef.laborRequirement, 0.0001);
      ensureStringArray(relativePath, recordId, `${tierField}.accessRequirements`, tierDef.accessRequirements, 1);
      for (const access of tierDef.accessRequirements) {
        if (!ITEM_KEY_PATTERN.test(access)) {
          throw new Error(`${relativePath} has invalid ${tierField}.accessRequirements value '${access}' on record ${recordId}`);
        }
      }

      if (!Array.isArray(tierDef.materialRequirements) || tierDef.materialRequirements.length === 0) {
        throw new Error(`${relativePath} has invalid ${tierField}.materialRequirements on record ${recordId}`);
      }

      for (const [materialIndex, material] of tierDef.materialRequirements.entries()) {
        const materialField = `${tierField}.materialRequirements[${materialIndex}]`;
        if (!isObject(material)) {
          throw new Error(`${relativePath} has invalid ${materialField} on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${materialField}.itemKey`, material.itemKey);
        if (!ITEM_KEY_PATTERN.test(material.itemKey)) {
          throw new Error(`${relativePath} has invalid ${materialField}.itemKey '${material.itemKey}' on record ${recordId}`);
        }
        ensureNumber(relativePath, recordId, `${materialField}.quantity`, material.quantity, 0.0001);
        ensureString(relativePath, recordId, `${materialField}.unit`, material.unit);
        if (!SLUG_PATTERN.test(material.unit)) {
          throw new Error(`${relativePath} has invalid ${materialField}.unit '${material.unit}' on record ${recordId}`);
        }
      }

      if (!Array.isArray(tierDef.serviceMetrics) || tierDef.serviceMetrics.length === 0) {
        throw new Error(`${relativePath} has invalid ${tierField}.serviceMetrics on record ${recordId}`);
      }

      for (const [metricIndex, metric] of tierDef.serviceMetrics.entries()) {
        const metricField = `${tierField}.serviceMetrics[${metricIndex}]`;
        if (!isObject(metric)) {
          throw new Error(`${relativePath} has invalid ${metricField} on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${metricField}.label`, metric.label);
        ensureString(relativePath, recordId, `${metricField}.valueText`, metric.valueText);
      }

      ensureStringArray(relativePath, recordId, `${tierField}.benefits`, tierDef.benefits, 1);
      if ("buildNotes" in tierDef) {
        ensureString(relativePath, recordId, `${tierField}.buildNotes`, tierDef.buildNotes);
      }
    }

    for (let tier = 1; tier <= progression.maxTier; tier += 1) {
      if (!seenTiers.has(tier)) {
        throw new Error(`${relativePath} is missing infrastructure progression tier ${tier} on record ${recordId}`);
      }
    }

    if (record.infrastructureType === "irrigation") {
      const irrigatedOutputs = record.serviceOutputs.filter((output) => output.itemKey === "irrigated_plot" && output.unit === "flag");
      if (irrigatedOutputs.length !== 1) {
        throw new Error(`${relativePath} irrigation infrastructure must define exactly one irrigated_plot flag output on record ${recordId}`);
      }

      const allowedSources = new Set();
      for (const tierDef of progression.tiers) {
        for (const metric of tierDef.serviceMetrics) {
          if (metric.label === "Water source") {
            allowedSources.add(metric.valueText);
          }
        }
      }

      const sourceMap = new Map([
        ["well", "well"],
        ["ditch", "ditch"],
        ["wood-lined channel", "wood_lined_channel"],
        ["stone culvert", "stone_culvert"],
        ["aqueduct", "aqueduct"]
      ]);

      for (const source of allowedSources) {
        const normalized = sourceMap.get(source);
        if (!normalized || !WORKPLACE_IRRIGATION_SOURCE_TYPES.has(normalized)) {
          throw new Error(`${relativePath} irrigation infrastructure has unsupported water source metric '${source}' on record ${recordId}`);
        }
      }
    }
  }
}

async function validateProductionChains(relativePath, records) {
  const extractionPath = path.join(ROOT, "packages/content/base/civilization/extraction_methods.json");
  const workplacePath = path.join(ROOT, "packages/content/base/civilization/workplaces.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");
  const skillPath = path.join(ROOT, "packages/content/base/player/skills.json");

  const extractionParsed = JSON.parse(await readFile(extractionPath, "utf8"));
  const workplaceParsed = JSON.parse(await readFile(workplacePath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));
  const skillParsed = JSON.parse(await readFile(skillPath, "utf8"));

  if (
    !Array.isArray(extractionParsed.records) ||
    !Array.isArray(workplaceParsed.records) ||
    !Array.isArray(marketParsed.records) ||
    !Array.isArray(skillParsed.records)
  ) {
    throw new Error(`${relativePath} could not validate production chains due to missing dependency records`);
  }

  const extractionIds = new Set();
  const workplaceIds = new Set();
  const marketKeys = new Set();
  const skillIds = new Set();

  for (const record of extractionParsed.records) {
    if (typeof record.id === "string") {
      extractionIds.add(record.id);
    }
  }

  for (const record of workplaceParsed.records) {
    if (typeof record.id === "string") {
      workplaceIds.add(record.id);
    }
  }

  for (const record of marketParsed.records) {
    if (typeof record.itemKey === "string") {
      marketKeys.add(record.itemKey);
    }
  }

  for (const record of skillParsed.records) {
    if (typeof record.id === "string") {
      skillIds.add(record.id);
    }
  }

  function validateChainItemKey(recordId, fieldName, itemKey, requireMarketKey = true) {
    if (!ITEM_KEY_PATTERN.test(itemKey)) {
      throw new Error(`${relativePath} has invalid ${fieldName} key '${itemKey}' on record ${recordId}`);
    }

    if (RESOURCE_ITEM_PREFIX_PATTERN.test(itemKey)) {
      throw new Error(`${relativePath} ${fieldName} key ${itemKey} must not use resource prefixes on record ${recordId}`);
    }

    if (requireMarketKey && !marketKeys.has(itemKey)) {
      throw new Error(`${relativePath} ${fieldName} key '${itemKey}' missing in market item values on record ${recordId}`);
    }
  }

  const seenIds = new Set();
  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate chain id ${record.id}`);
    }
    seenIds.add(record.id);

    ensureStringArray(relativePath, recordId, "stages", record.stages, 1);
    ensureString(relativePath, recordId, "primaryOutput", record.primaryOutput);
    ensureStringArray(relativePath, recordId, "byProducts", record.byProducts, 0);

    let hasWorkplaceStage = false;
    for (const stage of record.stages) {
      if (stage.startsWith("extract.")) {
        if (!extractionIds.has(stage)) {
          throw new Error(`${relativePath} has unknown extraction stage '${stage}' on record ${recordId}`);
        }
      } else if (stage.startsWith("workplace.")) {
        hasWorkplaceStage = true;
        if (!workplaceIds.has(stage)) {
          throw new Error(`${relativePath} has unknown workplace stage '${stage}' on record ${recordId}`);
        }
      } else {
        throw new Error(`${relativePath} has invalid stage prefix '${stage}' on record ${recordId}`);
      }
    }

    if (!hasWorkplaceStage) {
      throw new Error(`${relativePath} chain ${recordId} must include at least one workplace stage`);
    }

    for (const outputKey of [record.primaryOutput, ...record.byProducts]) {
      validateChainItemKey(recordId, "output", outputKey);
    }

    if ("facilityStrategy" in record) {
      if (!isObject(record.facilityStrategy)) {
        throw new Error(`${relativePath} has invalid facilityStrategy on record ${recordId}`);
      }

      const strategy = record.facilityStrategy;
      ensureSetMembership(relativePath, recordId, "facilityStrategy.mode", strategy.mode, CHAIN_FACILITY_MODES);

      if (!Array.isArray(strategy.tierRange) || strategy.tierRange.length !== 2) {
        throw new Error(`${relativePath} has invalid facilityStrategy.tierRange on record ${recordId}`);
      }

      const facilityTierRangeMin = ensureIntegerOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        "facilityStrategy.tierRange[0]",
        strategy.tierRange[0],
        1
      );
      const facilityTierRangeMax = ensureIntegerOrEmptyObjectPlaceholder(
        relativePath,
        recordId,
        "facilityStrategy.tierRange[1]",
        strategy.tierRange[1],
        1
      );

      if (facilityTierRangeMin !== null && facilityTierRangeMax !== null && facilityTierRangeMin > facilityTierRangeMax) {
        throw new Error(`${relativePath} has descending facilityStrategy.tierRange on record ${recordId}`);
      }

      if (facilityTierRangeMax !== null && facilityTierRangeMax > 5) {
        throw new Error(`${relativePath} has facilityStrategy.tierRange above 5 on record ${recordId}`);
      }

      ensureStringArray(relativePath, recordId, "facilityStrategy.ownershipModels", strategy.ownershipModels, 1);
      for (const ownershipModel of strategy.ownershipModels) {
        ensureSetMembership(relativePath, recordId, "facilityStrategy.ownershipModels", ownershipModel, WORKPLACE_OWNERSHIP_MODELS);
      }

      ensureString(relativePath, recordId, "facilityStrategy.comboGroupId", strategy.comboGroupId);
      if (!WORKPLACE_COMBO_ID_PATTERN.test(strategy.comboGroupId)) {
        throw new Error(`${relativePath} has invalid facilityStrategy.comboGroupId '${strategy.comboGroupId}' on record ${recordId}`);
      }

      if ("marketContext" in strategy) {
        if (!isObject(strategy.marketContext)) {
          throw new Error(`${relativePath} has invalid facilityStrategy.marketContext on record ${recordId}`);
        }

        ensureSetMembership(
          relativePath,
          recordId,
          "facilityStrategy.marketContext.consumerScope",
          strategy.marketContext.consumerScope,
          WORKPLACE_CONSUMER_SCOPES
        );
        ensureSetMembership(
          relativePath,
          recordId,
          "facilityStrategy.marketContext.supplyAccess",
          strategy.marketContext.supplyAccess,
          WORKPLACE_SUPPLY_ACCESS
        );
        ensureSetMembership(
          relativePath,
          recordId,
          "facilityStrategy.marketContext.riskTolerance",
          strategy.marketContext.riskTolerance,
          WORKPLACE_RISK_TOLERANCE
        );
        ensureStringArray(relativePath, recordId, "facilityStrategy.marketContext.districtTags", strategy.marketContext.districtTags, 1);
      }
    }

    if ("variantConfig" in record) {
      if (!isObject(record.variantConfig)) {
        throw new Error(`${relativePath} has invalid variantConfig on record ${recordId}`);
      }

      const variantConfig = record.variantConfig;
      ensureString(relativePath, recordId, "variantConfig.variantFlag", variantConfig.variantFlag);
      ensureString(relativePath, recordId, "variantConfig.defaultVariant", variantConfig.defaultVariant);

      if (!SLUG_PATTERN.test(variantConfig.variantFlag)) {
        throw new Error(`${relativePath} has invalid variantConfig.variantFlag '${variantConfig.variantFlag}' on record ${recordId}`);
      }

      if (!SLUG_PATTERN.test(variantConfig.defaultVariant)) {
        throw new Error(
          `${relativePath} has invalid variantConfig.defaultVariant '${variantConfig.defaultVariant}' on record ${recordId}`
        );
      }

      if (!Array.isArray(variantConfig.variants) || variantConfig.variants.length === 0) {
        throw new Error(`${relativePath} has empty variantConfig.variants on record ${recordId}`);
      }

      const seenVariantIds = new Set();
      const seenVariantOutputs = new Set();
      let defaultVariantResolved = false;

      for (const [index, variant] of variantConfig.variants.entries()) {
        const variantField = `variantConfig.variants[${index}]`;

        if (!isObject(variant)) {
          throw new Error(`${relativePath} has invalid ${variantField} on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${variantField}.id`, variant.id);
        if (!SLUG_PATTERN.test(variant.id)) {
          throw new Error(`${relativePath} has invalid ${variantField}.id '${variant.id}' on record ${recordId}`);
        }

        if (seenVariantIds.has(variant.id)) {
          throw new Error(`${relativePath} has duplicate ${variantField}.id '${variant.id}' on record ${recordId}`);
        }
        seenVariantIds.add(variant.id);

        if (variant.id === variantConfig.defaultVariant) {
          defaultVariantResolved = true;
        }

        ensureStringArray(relativePath, recordId, `${variantField}.inputItemKeys`, variant.inputItemKeys, 1);
        for (const inputItemKey of variant.inputItemKeys) {
          validateChainItemKey(recordId, `${variantField}.inputItem`, inputItemKey, true);
        }

        ensureString(relativePath, recordId, `${variantField}.primaryOutput`, variant.primaryOutput);
        ensureStringArray(relativePath, recordId, `${variantField}.byProducts`, variant.byProducts, 0);

        validateChainItemKey(recordId, `${variantField}.primaryOutput`, variant.primaryOutput);
        if (seenVariantOutputs.has(variant.primaryOutput)) {
          throw new Error(
            `${relativePath} has duplicate ${variantField}.primaryOutput '${variant.primaryOutput}' on record ${recordId}`
          );
        }
        seenVariantOutputs.add(variant.primaryOutput);

        for (const byProductKey of variant.byProducts) {
          validateChainItemKey(recordId, `${variantField}.byProducts`, byProductKey);
        }
        if ("laborWeight" in variant) {
          ensureNumberOrEmptyObjectPlaceholder(relativePath, recordId, `${variantField}.laborWeight`, variant.laborWeight, 0.01);
        }

      }
      if (!defaultVariantResolved) {
        throw new Error(
          `${relativePath} has variantConfig.defaultVariant '${variantConfig.defaultVariant}' missing in variants on record ${recordId}`
        );
      }
    }

    if (!isObject(record.recipeProfile)) {
      throw new Error(`${relativePath} chain ${recordId} must define recipeProfile`);
    }

    const recipeProfile = record.recipeProfile;
    ensureSetMembership(relativePath, recordId, "recipeProfile.recipeClass", recipeProfile.recipeClass, CHAIN_RECIPE_CLASSES);
    ensureString(relativePath, recordId, "recipeProfile.primarySkillId", recipeProfile.primarySkillId);
    if (!skillIds.has(recipeProfile.primarySkillId)) {
      throw new Error(`${relativePath} has unknown recipeProfile.primarySkillId '${recipeProfile.primarySkillId}' on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "recipeProfile.externalInputs", recipeProfile.externalInputs, 0);
    for (const itemKey of recipeProfile.externalInputs) {
      validateChainItemKey(recordId, "recipeProfile.externalInputs", itemKey);
    }

    ensureStringArray(relativePath, recordId, "recipeProfile.intermediateItems", recipeProfile.intermediateItems, 0);
    for (const itemKey of recipeProfile.intermediateItems) {
      validateChainItemKey(recordId, "recipeProfile.intermediateItems", itemKey);
    }

    if (!Array.isArray(recipeProfile.processingSteps) || recipeProfile.processingSteps.length === 0) {
      throw new Error(`${relativePath} has empty recipeProfile.processingSteps on record ${recordId}`);
    }

    const seenStepIds = new Set();
    for (const [index, step] of recipeProfile.processingSteps.entries()) {
      const stepField = `recipeProfile.processingSteps[${index}]`;
      if (!isObject(step)) {
        throw new Error(`${relativePath} has invalid ${stepField} on record ${recordId}`);
      }

      ensureString(relativePath, recordId, `${stepField}.id`, step.id);
      if (!SLUG_PATTERN.test(step.id)) {
        throw new Error(`${relativePath} has invalid ${stepField}.id '${step.id}' on record ${recordId}`);
      }
      if (seenStepIds.has(step.id)) {
        throw new Error(`${relativePath} has duplicate ${stepField}.id '${step.id}' on record ${recordId}`);
      }
      seenStepIds.add(step.id);

      ensureString(relativePath, recordId, `${stepField}.stageRef`, step.stageRef);
      if (!record.stages.includes(step.stageRef)) {
        throw new Error(`${relativePath} has ${stepField}.stageRef '${step.stageRef}' outside stages on record ${recordId}`);
      }

      ensureSetMembership(relativePath, recordId, `${stepField}.operation`, step.operation, CHAIN_STEP_OPERATIONS);
      ensureStringArray(relativePath, recordId, `${stepField}.inputs`, step.inputs, 0);
      ensureStringArray(relativePath, recordId, `${stepField}.outputs`, step.outputs, 0);

      for (const itemKey of step.inputs) {
        validateChainItemKey(recordId, `${stepField}.inputs`, itemKey);
      }
      for (const itemKey of step.outputs) {
        validateChainItemKey(recordId, `${stepField}.outputs`, itemKey);
      }

      if ("usesVariantInputs" in step) {
        ensureBoolean(relativePath, recordId, `${stepField}.usesVariantInputs`, step.usesVariantInputs);
      }
      if ("usesVariantPrimaryOutput" in step) {
        ensureBoolean(relativePath, recordId, `${stepField}.usesVariantPrimaryOutput`, step.usesVariantPrimaryOutput);
      }
      if ("usesVariantByProducts" in step) {
        ensureBoolean(relativePath, recordId, `${stepField}.usesVariantByProducts`, step.usesVariantByProducts);
      }

      ensureSetMembership(relativePath, recordId, `${stepField}.laborIntensity`, step.laborIntensity, ITEM_LABOR_INTENSITIES);
      ensureSetMembership(
        relativePath,
        recordId,
        `${stepField}.processingIntensity`,
        step.processingIntensity,
        ITEM_PROCESSING_INTENSITIES
      );
      ensureSetMembership(relativePath, recordId, `${stepField}.difficultyTier`, step.difficultyTier, ITEM_DIFFICULTY_TIERS);
      ensureSetMembership(
        relativePath,
        recordId,
        `${stepField}.materialDifficultyMode`,
        step.materialDifficultyMode,
        CHAIN_MATERIAL_DIFFICULTY_MODES
      );

      if (step.stageRef.startsWith("workplace.")) {
        if (!isObject(step.skillCheck)) {
          throw new Error(`${relativePath} workplace ${stepField} must define skillCheck on record ${recordId}`);
        }

        ensureString(relativePath, recordId, `${stepField}.skillCheck.skillId`, step.skillCheck.skillId);
        if (!skillIds.has(step.skillCheck.skillId)) {
          throw new Error(`${relativePath} has unknown ${stepField}.skillCheck.skillId '${step.skillCheck.skillId}' on record ${recordId}`);
        }

        ensureInteger(relativePath, recordId, `${stepField}.skillCheck.minimumRank`, step.skillCheck.minimumRank, 1);
        ensureInteger(relativePath, recordId, `${stepField}.skillCheck.efficiencyRank`, step.skillCheck.efficiencyRank, 1);
        ensureInteger(relativePath, recordId, `${stepField}.skillCheck.qualityRank`, step.skillCheck.qualityRank, 1);
        if (step.skillCheck.minimumRank > step.skillCheck.efficiencyRank) {
          throw new Error(`${relativePath} has descending ${stepField}.skillCheck ranks on record ${recordId}`);
        }
        if (step.skillCheck.efficiencyRank > step.skillCheck.qualityRank) {
          throw new Error(`${relativePath} has descending ${stepField}.skillCheck ranks on record ${recordId}`);
        }
        ensureSetMembership(
          relativePath,
          recordId,
          `${stepField}.skillCheck.lowSkillOutcome`,
          step.skillCheck.lowSkillOutcome,
          CHAIN_LOW_SKILL_OUTCOMES
        );
        if ("allowedDimensions" in step.skillCheck) {
          ensureStringArray(relativePath, recordId, `${stepField}.skillCheck.allowedDimensions`, step.skillCheck.allowedDimensions, 1);
          for (const dimension of step.skillCheck.allowedDimensions) {
            ensureSetMembership(
              relativePath,
              recordId,
              `${stepField}.skillCheck.allowedDimensions`,
              dimension,
              PLAYER_CRAFT_SKILL_DIMENSIONS
            );
          }
        }
        if ("quantityRank" in step.skillCheck) {
          ensureInteger(relativePath, recordId, `${stepField}.skillCheck.quantityRank`, step.skillCheck.quantityRank, 1);
          if (!(step.skillCheck.allowedDimensions ?? []).includes("quantity")) {
            throw new Error(`${relativePath} has quantityRank without quantity dimension on ${stepField} for record ${recordId}`);
          }
        }
      }
    }

    if (!isObject(recipeProfile.valuePropagation)) {
      throw new Error(`${relativePath} has invalid recipeProfile.valuePropagation on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "recipeProfile.valuePropagation.materialCostMode", recipeProfile.valuePropagation.materialCostMode);
    if (recipeProfile.valuePropagation.materialCostMode !== "input_sum") {
      throw new Error(`${relativePath} has unsupported recipeProfile.valuePropagation.materialCostMode on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "recipeProfile.valuePropagation.laborCostMode", recipeProfile.valuePropagation.laborCostMode);
    if (recipeProfile.valuePropagation.laborCostMode !== "skill_time_weighted") {
      throw new Error(`${relativePath} has unsupported recipeProfile.valuePropagation.laborCostMode on record ${recordId}`);
    }
    ensureString(
      relativePath,
      recordId,
      "recipeProfile.valuePropagation.processingCostMode",
      recipeProfile.valuePropagation.processingCostMode
    );
    if (!["fuel_tool_wear", "tool_wear", "fuel_and_tool_wear"].includes(recipeProfile.valuePropagation.processingCostMode)) {
      throw new Error(`${relativePath} has unsupported recipeProfile.valuePropagation.processingCostMode on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "recipeProfile.valuePropagation.difficultyMode", recipeProfile.valuePropagation.difficultyMode);
    if (recipeProfile.valuePropagation.difficultyMode !== "step_material_weighted") {
      throw new Error(`${relativePath} has unsupported recipeProfile.valuePropagation.difficultyMode on record ${recordId}`);
    }
    ensureSetMembership(
      relativePath,
      recordId,
      "recipeProfile.valuePropagation.demandBand",
      recipeProfile.valuePropagation.demandBand,
      ITEM_DEMAND_BANDS
    );
    ensureBoolean(relativePath, recordId, "recipeProfile.valuePropagation.carriesForward", recipeProfile.valuePropagation.carriesForward);
  }
}

function validateWorldRegions(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid region id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate region id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "regionType", record.regionType, WORLD_REGION_TYPES);
    ensureStringArray(relativePath, recordId, "aliases", record.aliases, 0);
    ensureStringArray(relativePath, recordId, "mapIds", record.mapIds, 1);
    ensureString(relativePath, recordId, "positionLabel", record.positionLabel);
    if (!SLUG_PATTERN.test(record.positionLabel)) {
      throw new Error(`${relativePath} has invalid positionLabel '${record.positionLabel}' on record ${recordId}`);
    }

    for (const mapId of record.mapIds) {
      if (!/^world_map\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(mapId)) {
        throw new Error(`${relativePath} has invalid mapIds value '${mapId}' on record ${recordId}`);
      }
    }

    if ("parentRegionId" in record) {
      ensureString(relativePath, recordId, "parentRegionId", record.parentRegionId);
      if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.parentRegionId)) {
        throw new Error(`${relativePath} has invalid parentRegionId '${record.parentRegionId}' on record ${recordId}`);
      }
    }

    ensureString(relativePath, recordId, "summary", record.summary);
    ensureStringArray(relativePath, recordId, "tags", record.tags, 1);
    for (const tag of record.tags) {
      if (!SLUG_PATTERN.test(tag)) {
        throw new Error(`${relativePath} has invalid tag '${tag}' on record ${recordId}`);
      }
    }

    if ("geography" in record) {
      if (!isObject(record.geography)) {
        throw new Error(`${relativePath} has invalid geography on record ${recordId}`);
      }
      if ("climateSummary" in record.geography) {
        ensureString(relativePath, recordId, "geography.climateSummary", record.geography.climateSummary);
      }
      if ("terrainNotes" in record.geography) {
        ensureStringArray(relativePath, recordId, "geography.terrainNotes", record.geography.terrainNotes, 1);
      }
      if ("notableFeatures" in record.geography) {
        ensureStringArray(relativePath, recordId, "geography.notableFeatures", record.geography.notableFeatures, 1);
      }
    }

    if ("populationProfile" in record) {
      if (!isObject(record.populationProfile)) {
        throw new Error(`${relativePath} has invalid populationProfile on record ${recordId}`);
      }
      const population = record.populationProfile;
      if ("densityBand" in population) {
        ensureSetMembership(relativePath, recordId, "populationProfile.densityBand", population.densityBand, WORLD_POPULATION_DENSITY_BANDS);
      }
      if ("densityNotes" in population) {
        ensureStringArray(relativePath, recordId, "populationProfile.densityNotes", population.densityNotes, 1);
      }
      if ("settlementPattern" in population) {
        ensureString(relativePath, recordId, "populationProfile.settlementPattern", population.settlementPattern);
      }
      if ("estimatedPopulationMillions" in population) {
        ensureNumber(relativePath, recordId, "populationProfile.estimatedPopulationMillions", population.estimatedPopulationMillions, 0);
      }
    }

    if ("demographicProfile" in record) {
      if (!isObject(record.demographicProfile)) {
        throw new Error(`${relativePath} has invalid demographicProfile on record ${recordId}`);
      }
      const demographics = record.demographicProfile;
      if ("raceDistribution" in demographics) {
        if (!Array.isArray(demographics.raceDistribution) || demographics.raceDistribution.length === 0) {
          throw new Error(`${relativePath} has invalid demographicProfile.raceDistribution on record ${recordId}`);
        }

        let total = 0;
        for (const [index, entry] of demographics.raceDistribution.entries()) {
          const field = `demographicProfile.raceDistribution[${index}]`;
          if (!isObject(entry)) {
            throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
          }
          ensureString(relativePath, recordId, `${field}.race`, entry.race);
          ensureNumber(relativePath, recordId, `${field}.percentage`, entry.percentage, 0);
          if (entry.percentage > 100) {
            throw new Error(`${relativePath} has ${field}.percentage above 100 on record ${recordId}`);
          }
          total += entry.percentage;
        }

        if (Math.abs(total - 100) > 0.5) {
          throw new Error(`${relativePath} demographicProfile.raceDistribution must total 100 (+/-0.5) on record ${recordId}`);
        }
      }
      if ("notableGroups" in demographics) {
        ensureStringArray(relativePath, recordId, "demographicProfile.notableGroups", demographics.notableGroups, 1);
      }
    }

    if ("economicProfile" in record) {
      if (!isObject(record.economicProfile)) {
        throw new Error(`${relativePath} has invalid economicProfile on record ${recordId}`);
      }
      if ("majorExports" in record.economicProfile) {
        ensureStringArray(relativePath, recordId, "economicProfile.majorExports", record.economicProfile.majorExports, 1);
      }
      if ("majorImports" in record.economicProfile) {
        ensureStringArray(relativePath, recordId, "economicProfile.majorImports", record.economicProfile.majorImports, 1);
      }
    }

    if ("civilizationNotes" in record) {
      ensureStringArray(relativePath, recordId, "civilizationNotes", record.civilizationNotes, 1);
    }
    if ("strategicNotes" in record) {
      ensureStringArray(relativePath, recordId, "strategicNotes", record.strategicNotes, 1);
    }
  }
}

function validateWorldMaps(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^world_map\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid world map id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate world map id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "mapType", record.mapType, WORLD_MAP_TYPES);
    ensureString(relativePath, recordId, "sourceSummary", record.sourceSummary);
    if (!isObject(record.scaleProfile)) {
      throw new Error(`${relativePath} has invalid scaleProfile on record ${recordId}`);
    }
    ensureNumber(relativePath, recordId, "scaleProfile.referenceImageWidthPx", record.scaleProfile.referenceImageWidthPx, 1);
    ensureNumber(relativePath, recordId, "scaleProfile.referenceImageHeightPx", record.scaleProfile.referenceImageHeightPx, 1);
    ensureNumber(relativePath, recordId, "scaleProfile.kilometersPerPixel", record.scaleProfile.kilometersPerPixel, 0.01);
    ensureNumber(relativePath, recordId, "scaleProfile.milesPerPixel", record.scaleProfile.milesPerPixel, 0.01);
    ensureNumber(relativePath, recordId, "scaleProfile.mapWidthKilometers", record.scaleProfile.mapWidthKilometers, 1);
    ensureNumber(relativePath, recordId, "scaleProfile.mapWidthMiles", record.scaleProfile.mapWidthMiles, 1);
    ensureNumber(relativePath, recordId, "scaleProfile.mapHeightKilometers", record.scaleProfile.mapHeightKilometers, 1);
    ensureNumber(relativePath, recordId, "scaleProfile.mapHeightMiles", record.scaleProfile.mapHeightMiles, 1);
    if (!Array.isArray(record.scaleProfile.practicalRulerBenchmarks) || record.scaleProfile.practicalRulerBenchmarks.length === 0) {
      throw new Error(`${relativePath} has invalid scaleProfile.practicalRulerBenchmarks on record ${recordId}`);
    }
    for (const [index, benchmark] of record.scaleProfile.practicalRulerBenchmarks.entries()) {
      const field = `scaleProfile.practicalRulerBenchmarks[${index}]`;
      if (!isObject(benchmark)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureNumber(relativePath, recordId, `${field}.pixels`, benchmark.pixels, 1);
      ensureNumber(relativePath, recordId, `${field}.distanceKilometers`, benchmark.distanceKilometers, 0.01);
      ensureNumber(relativePath, recordId, `${field}.distanceMiles`, benchmark.distanceMiles, 0.01);
    }
    if (!Array.isArray(record.scaleProfile.distanceBenchmarks) || record.scaleProfile.distanceBenchmarks.length === 0) {
      throw new Error(`${relativePath} has invalid scaleProfile.distanceBenchmarks on record ${recordId}`);
    }
    const seenDistanceBenchmarkIds = new Set();
    for (const [index, benchmark] of record.scaleProfile.distanceBenchmarks.entries()) {
      const field = `scaleProfile.distanceBenchmarks[${index}]`;
      if (!isObject(benchmark)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, benchmark.id);
      if (!SLUG_PATTERN.test(benchmark.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${benchmark.id}' on record ${recordId}`);
      }
      if (seenDistanceBenchmarkIds.has(benchmark.id)) {
        throw new Error(`${relativePath} has duplicate ${field}.id '${benchmark.id}' on record ${recordId}`);
      }
      seenDistanceBenchmarkIds.add(benchmark.id);
      ensureString(relativePath, recordId, `${field}.name`, benchmark.name);
      ensureNumber(relativePath, recordId, `${field}.distanceKilometersMin`, benchmark.distanceKilometersMin, 0.01);
      ensureNumber(relativePath, recordId, `${field}.distanceKilometersMax`, benchmark.distanceKilometersMax, benchmark.distanceKilometersMin);
      ensureNumber(relativePath, recordId, `${field}.distanceMilesMin`, benchmark.distanceMilesMin, 0.01);
      ensureNumber(relativePath, recordId, `${field}.distanceMilesMax`, benchmark.distanceMilesMax, benchmark.distanceMilesMin);
      ensureString(relativePath, recordId, `${field}.notes`, benchmark.notes);
    }
    ensureStringArray(relativePath, recordId, "scaleProfile.notes", record.scaleProfile.notes, 1);

    const expectedMapWidthKilometers = record.scaleProfile.referenceImageWidthPx * record.scaleProfile.kilometersPerPixel;
    const expectedMapHeightKilometers = record.scaleProfile.referenceImageHeightPx * record.scaleProfile.kilometersPerPixel;
    const expectedMapWidth = record.scaleProfile.referenceImageWidthPx * record.scaleProfile.milesPerPixel;
    const expectedMapHeight = record.scaleProfile.referenceImageHeightPx * record.scaleProfile.milesPerPixel;
    if (Math.abs(expectedMapWidthKilometers - record.scaleProfile.mapWidthKilometers) > 1) {
      throw new Error(`${relativePath} scaleProfile.mapWidthKilometers does not match image width * kilometersPerPixel on record ${recordId}`);
    }
    if (Math.abs(expectedMapHeightKilometers - record.scaleProfile.mapHeightKilometers) > 1) {
      throw new Error(`${relativePath} scaleProfile.mapHeightKilometers does not match image height * kilometersPerPixel on record ${recordId}`);
    }
    if (Math.abs(expectedMapWidth - record.scaleProfile.mapWidthMiles) > 1) {
      throw new Error(`${relativePath} scaleProfile.mapWidthMiles does not match image width * milesPerPixel on record ${recordId}`);
    }
    if (Math.abs(expectedMapHeight - record.scaleProfile.mapHeightMiles) > 1) {
      throw new Error(`${relativePath} scaleProfile.mapHeightMiles does not match image height * milesPerPixel on record ${recordId}`);
    }
    const expectedMilesPerPixel = record.scaleProfile.kilometersPerPixel * 0.621371;
    if (Math.abs(expectedMilesPerPixel - record.scaleProfile.milesPerPixel) > 0.01) {
      throw new Error(`${relativePath} scaleProfile.milesPerPixel must match kilometersPerPixel conversion on record ${recordId}`);
    }
    for (const benchmark of record.scaleProfile.practicalRulerBenchmarks) {
      const expectedDistanceMiles = benchmark.distanceKilometers * 0.621371;
      if (Math.abs(expectedDistanceMiles - benchmark.distanceMiles) > 1) {
        throw new Error(`${relativePath} scaleProfile.practicalRulerBenchmarks distanceMiles must match distanceKilometers conversion on record ${recordId}`);
      }
    }
    for (const benchmark of record.scaleProfile.distanceBenchmarks) {
      const expectedMinMiles = benchmark.distanceKilometersMin * 0.621371;
      const expectedMaxMiles = benchmark.distanceKilometersMax * 0.621371;
      if (Math.abs(expectedMinMiles - benchmark.distanceMilesMin) > 1) {
        throw new Error(`${relativePath} scaleProfile.distanceBenchmarks distanceMilesMin must match distanceKilometersMin conversion on record ${recordId}`);
      }
      if (Math.abs(expectedMaxMiles - benchmark.distanceMilesMax) > 1) {
        throw new Error(`${relativePath} scaleProfile.distanceBenchmarks distanceMilesMax must match distanceKilometersMax conversion on record ${recordId}`);
      }
      if (benchmark.distanceKilometersMax < benchmark.distanceKilometersMin) {
        throw new Error(`${relativePath} scaleProfile.distanceBenchmarks has distanceKilometersMax below distanceKilometersMin on record ${recordId}`);
      }
      if (benchmark.distanceMilesMax < benchmark.distanceMilesMin) {
        throw new Error(`${relativePath} scaleProfile.distanceBenchmarks has distanceMilesMax below distanceMilesMin on record ${recordId}`);
      }
    }

    if ("layerSummaries" in record) {
      ensureStringArray(relativePath, recordId, "layerSummaries", record.layerSummaries, 1);
    }
    if ("layerAssetPaths" in record) {
      if (!isObject(record.layerAssetPaths)) {
        throw new Error(`${relativePath} has invalid layerAssetPaths on record ${recordId}`);
      }
      if ("biome" in record.layerAssetPaths) {
        ensureString(relativePath, recordId, "layerAssetPaths.biome", record.layerAssetPaths.biome);
      }
      if ("elevation" in record.layerAssetPaths) {
        ensureString(relativePath, recordId, "layerAssetPaths.elevation", record.layerAssetPaths.elevation);
      }
    }
    if ("assetReferenceRectPx" in record) {
      if (!isObject(record.assetReferenceRectPx)) {
        throw new Error(`${relativePath} has invalid assetReferenceRectPx on record ${recordId}`);
      }
      ensureNumber(relativePath, recordId, "assetReferenceRectPx.x", record.assetReferenceRectPx.x, 0);
      ensureNumber(relativePath, recordId, "assetReferenceRectPx.y", record.assetReferenceRectPx.y, 0);
      ensureNumber(relativePath, recordId, "assetReferenceRectPx.width", record.assetReferenceRectPx.width, 1);
      ensureNumber(relativePath, recordId, "assetReferenceRectPx.height", record.assetReferenceRectPx.height, 1);
      const sourceAspectRatio = record.assetReferenceRectPx.width / record.assetReferenceRectPx.height;
      const referenceAspectRatio = record.scaleProfile.referenceImageWidthPx / record.scaleProfile.referenceImageHeightPx;
      if (Math.abs(sourceAspectRatio - referenceAspectRatio) > 0.02) {
        throw new Error(`${relativePath} assetReferenceRectPx aspect ratio must closely match the reference image aspect ratio on record ${recordId}`);
      }
    }

    ensureStringArray(relativePath, recordId, "continentRegionIds", record.continentRegionIds, 1);
    ensureStringArray(relativePath, recordId, "islandSystemRegionIds", record.islandSystemRegionIds, 1);
    ensureStringArray(relativePath, recordId, "oceanRegionIds", record.oceanRegionIds, 1);
    ensureStringArray(relativePath, recordId, "globalAssumptions", record.globalAssumptions, 1);

    if (!Array.isArray(record.densityScale) || record.densityScale.length === 0) {
      throw new Error(`${relativePath} has invalid densityScale on record ${recordId}`);
    }

    const seenDensityBands = new Set();
    for (const [index, entry] of record.densityScale.entries()) {
      const field = `densityScale[${index}]`;
      if (!isObject(entry)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, `${field}.densityBand`, entry.densityBand, WORLD_POPULATION_DENSITY_BANDS);
      ensureString(relativePath, recordId, `${field}.settlementPattern`, entry.settlementPattern);
      if (seenDensityBands.has(entry.densityBand)) {
        throw new Error(`${relativePath} has duplicate ${field}.densityBand '${entry.densityBand}' on record ${recordId}`);
      }
      seenDensityBands.add(entry.densityBand);
    }

    if (!Array.isArray(record.populationEstimates) || record.populationEstimates.length === 0) {
      throw new Error(`${relativePath} has invalid populationEstimates on record ${recordId}`);
    }

    const seenPopulationIds = new Set();
    for (const [index, estimate] of record.populationEstimates.entries()) {
      const field = `populationEstimates[${index}]`;
      if (!isObject(estimate)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.regionId`, estimate.regionId);
      if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(estimate.regionId)) {
        throw new Error(`${relativePath} has invalid ${field}.regionId '${estimate.regionId}' on record ${recordId}`);
      }
      ensureNumber(relativePath, recordId, `${field}.estimateMillions`, estimate.estimateMillions, 0);
      if (seenPopulationIds.has(estimate.regionId)) {
        throw new Error(`${relativePath} has duplicate ${field}.regionId '${estimate.regionId}' on record ${recordId}`);
      }
      seenPopulationIds.add(estimate.regionId);
    }

    if ("totalPopulationMillions" in record) {
      ensureNumber(relativePath, recordId, "totalPopulationMillions", record.totalPopulationMillions, 0);
    }

    if (!Array.isArray(record.majorTradeRoutes) || record.majorTradeRoutes.length === 0) {
      throw new Error(`${relativePath} has invalid majorTradeRoutes on record ${recordId}`);
    }
    for (const [index, route] of record.majorTradeRoutes.entries()) {
      const field = `majorTradeRoutes[${index}]`;
      if (!isObject(route)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, route.id);
      ensureString(relativePath, recordId, `${field}.name`, route.name);
      ensureString(relativePath, recordId, `${field}.summary`, route.summary);
      ensureStringArray(relativePath, recordId, `${field}.regionIds`, route.regionIds, 1);
    }

    if (!Array.isArray(record.conflictZones) || record.conflictZones.length === 0) {
      throw new Error(`${relativePath} has invalid conflictZones on record ${recordId}`);
    }
    for (const [index, zone] of record.conflictZones.entries()) {
      const field = `conflictZones[${index}]`;
      if (!isObject(zone)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.name`, zone.name);
      ensureString(relativePath, recordId, `${field}.summary`, zone.summary);
      ensureStringArray(relativePath, recordId, `${field}.regionIds`, zone.regionIds, 1);
    }
  }
}

function validateRegionLocalities(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^region_locality\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid locality id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate locality id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid locality slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate locality slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "macroRegionId", record.macroRegionId);
    ensureString(relativePath, recordId, "regionId", record.regionId);
    ensureString(relativePath, recordId, "localityType", record.localityType);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureInteger(relativePath, recordId, "habitationScoreModifier", record.habitationScoreModifier, -100);

    if (!isObject(record.resourceCatchment)) {
      throw new Error(`${relativePath} has invalid resourceCatchment on record ${recordId}`);
    }
    for (const field of ["arableLand", "pasture", "timber", "fishery", "stone", "ore", "salt", "herbs", "specialty"]) {
      ensureSetMembership(relativePath, recordId, `resourceCatchment.${field}`, record.resourceCatchment[field], REGIONAL_ECOLOGY_COVERAGE_BANDS);
    }

    if (!isObject(record.settlementSuitability)) {
      throw new Error(`${relativePath} has invalid settlementSuitability on record ${recordId}`);
    }
    ensureNumber(relativePath, recordId, "settlementSuitability.settlementWeight", record.settlementSuitability.settlementWeight, 0);
    ensureSetMembership(relativePath, recordId, "settlementSuitability.maxPopulationBand", record.settlementSuitability.maxPopulationBand, SETTLEMENT_POPULATION_BANDS);
    ensureNumber(relativePath, recordId, "settlementSuitability.strategicSiteWeight", record.settlementSuitability.strategicSiteWeight, 0);
    ensureStringArray(relativePath, recordId, "settlementSuitability.favoredSettlementTypes", record.settlementSuitability.favoredSettlementTypes, 1);
    for (const settlementType of record.settlementSuitability.favoredSettlementTypes) {
      ensureSetMembership(relativePath, recordId, "settlementSuitability.favoredSettlementTypes", settlementType, SETTLEMENT_TYPES);
    }

    if (!isObject(record.routeAccessModifier)) {
      throw new Error(`${relativePath} has invalid routeAccessModifier on record ${recordId}`);
    }
    for (const field of ["road", "river", "coastal", "caravan", "pass", "seaLane"]) {
      ensureNumber(relativePath, recordId, `routeAccessModifier.${field}`, record.routeAccessModifier[field], 0);
    }

    ensureStringArray(relativePath, recordId, "dominantIndustries", record.dominantIndustries, 1);
    for (const industry of record.dominantIndustries) {
      if (!SLUG_PATTERN.test(industry)) {
        throw new Error(`${relativePath} has invalid dominantIndustries value '${industry}' on record ${recordId}`);
      }
    }

    ensureStringArray(relativePath, recordId, "supportedSiteClasses", record.supportedSiteClasses, 1);
    for (const siteClass of record.supportedSiteClasses) {
      ensureSetMembership(relativePath, recordId, "supportedSiteClasses", siteClass, SETTLEMENT_SITE_CLASSES);
    }
  }
}

function validateRegionalEcologyProfiles(relativePath, records) {
  const seenIds = new Set();
  const seenRegionIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^regional_ecology\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid regional ecology id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate regional ecology id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "regionId", record.regionId);
    if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.regionId)) {
      throw new Error(`${relativePath} has invalid regionId '${record.regionId}' on record ${recordId}`);
    }
    if (seenRegionIds.has(record.regionId)) {
      throw new Error(`${relativePath} has duplicate regionId '${record.regionId}' on record ${recordId}`);
    }
    seenRegionIds.add(record.regionId);

    ensureString(relativePath, recordId, "summary", record.summary);
    ensureString(relativePath, recordId, "primaryClimateProfileId", record.primaryClimateProfileId);
    if (!/^climate\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.primaryClimateProfileId)) {
      throw new Error(`${relativePath} has invalid primaryClimateProfileId '${record.primaryClimateProfileId}' on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "secondaryClimateProfileIds", record.secondaryClimateProfileIds, 0);
    for (const climateId of record.secondaryClimateProfileIds) {
      if (!/^climate\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(climateId)) {
        throw new Error(`${relativePath} has invalid secondaryClimateProfileIds value '${climateId}' on record ${recordId}`);
      }
    }

    ensureStringArray(relativePath, recordId, "dominantBiomeIds", record.dominantBiomeIds, 1);
    ensureStringArray(relativePath, recordId, "supportingBiomeIds", record.supportingBiomeIds, 0);
    for (const biomeId of [...record.dominantBiomeIds, ...record.supportingBiomeIds]) {
      if (!/^biome\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(biomeId)) {
        throw new Error(`${relativePath} has invalid biome id '${biomeId}' on record ${recordId}`);
      }
    }

    ensureStringArray(relativePath, recordId, "nativeFloraIds", record.nativeFloraIds, 1);
    ensureStringArray(relativePath, recordId, "nativeFaunaIds", record.nativeFaunaIds, 1);
    for (const floraId of record.nativeFloraIds) {
      if (!/^flora\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(floraId)) {
        throw new Error(`${relativePath} has invalid flora id '${floraId}' on record ${recordId}`);
      }
    }
    for (const faunaId of record.nativeFaunaIds) {
      if (!/^fauna\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(faunaId)) {
        throw new Error(`${relativePath} has invalid fauna id '${faunaId}' on record ${recordId}`);
      }
    }

    if (!isObject(record.coverageProfile)) {
      throw new Error(`${relativePath} has invalid coverageProfile on record ${recordId}`);
    }
    for (const field of ["stapleCrops", "herdAndGame", "maritimeFoods", "timberAndFiber", "metalsAndStone", "herbsAndReagents", "luxuryGoods"]) {
      ensureSetMembership(relativePath, recordId, `coverageProfile.${field}`, record.coverageProfile[field], REGIONAL_ECOLOGY_COVERAGE_BANDS);
    }

    ensureStringArray(relativePath, recordId, "domesticStrengths", record.domesticStrengths, 1);
    ensureStringArray(relativePath, recordId, "domesticGaps", record.domesticGaps, 1);
    ensureStringArray(relativePath, recordId, "likelyTradePartnerRegionIds", record.likelyTradePartnerRegionIds, 1);
    ensureStringArray(relativePath, recordId, "tradePressureNotes", record.tradePressureNotes, 1);

    if (!isObject(record.simulationProfile)) {
      throw new Error(`${relativePath} has invalid simulationProfile on record ${recordId}`);
    }
    for (const field of ["habitationScore", "foodProductionCapacity", "waterAvailability", "climateBurden", "hazardPressure", "infrastructureDifficulty"]) {
      ensureInteger(relativePath, recordId, `simulationProfile.${field}`, record.simulationProfile[field], 0);
      if (record.simulationProfile[field] > 100) {
        throw new Error(`${relativePath} has invalid simulationProfile.${field} above 100 on record ${recordId}`);
      }
    }
    ensureInteger(relativePath, recordId, "simulationProfile.populationCapacity", record.simulationProfile.populationCapacity, 0);
    ensureSetMembership(relativePath, recordId, "simulationProfile.densityBand", record.simulationProfile.densityBand, WORLD_POPULATION_DENSITY_BANDS);
    ensureSetMembership(relativePath, recordId, "resourceDiversityBand", record.resourceDiversityBand, WORLD_POPULATION_DENSITY_BANDS);
    ensureStringArray(relativePath, recordId, "supplyStrengths", record.supplyStrengths, 1);
    ensureStringArray(relativePath, recordId, "demandPressures", record.demandPressures, 1);
    ensureNumber(relativePath, recordId, "importBias", record.importBias, 0);
    ensureNumber(relativePath, recordId, "exportBias", record.exportBias, 0);
    if (record.importBias > 1 || record.exportBias > 1) {
      throw new Error(`${relativePath} has import/export bias above 1 on record ${recordId}`);
    }

    for (const partnerRegionId of record.likelyTradePartnerRegionIds) {
      if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(partnerRegionId)) {
        throw new Error(`${relativePath} has invalid likelyTradePartnerRegionIds value '${partnerRegionId}' on record ${recordId}`);
      }
    }
  }
}

function validateGuilds(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^guild\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid guild id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate guild id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid guild slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate guild slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "category", record.category, GUILD_CATEGORIES);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureStringArray(relativePath, recordId, "governsActivities", record.governsActivities, 1);
    ensureStringArray(relativePath, recordId, "excludedActivities", record.excludedActivities, 0);
    ensureStringArray(relativePath, recordId, "contractTypes", record.contractTypes, 1);
    ensureStringArray(relativePath, recordId, "typicalPresenceLevels", record.typicalPresenceLevels, 1);
    ensureStringArray(relativePath, recordId, "typicalSettlementTags", record.typicalSettlementTags, 1);

    for (const field of ["governsActivities", "excludedActivities", "contractTypes", "typicalSettlementTags"]) {
      for (const value of record[field]) {
        if (!SLUG_PATTERN.test(value)) {
          throw new Error(`${relativePath} has invalid ${field} value '${value}' on record ${recordId}`);
        }
      }
    }
    for (const presenceLevel of record.typicalPresenceLevels) {
      ensureSetMembership(relativePath, recordId, "typicalPresenceLevels", presenceLevel, SETTLEMENT_GUILD_PRESENCE_LEVELS);
    }

    if (!isObject(record.membershipModel)) {
      throw new Error(`${relativePath} has invalid membershipModel on record ${recordId}`);
    }
    ensureSetMembership(
      relativePath,
      recordId,
      "membershipModel.entryMethod",
      record.membershipModel.entryMethod,
      GUILD_ENTRY_METHODS
    );
    if (record.membershipModel.entryMethod === "buy_in") {
      ensureString(relativePath, recordId, "membershipModel.buyInRequirement", record.membershipModel.buyInRequirement);
    }
    ensureStringArray(relativePath, recordId, "membershipModel.entryRequirements", record.membershipModel.entryRequirements, 1);
    ensureStringArray(relativePath, recordId, "membershipModel.benefits", record.membershipModel.benefits, 1);
    ensureStringArray(relativePath, recordId, "membershipModel.memberObligations", record.membershipModel.memberObligations, 1);
    if (record.membershipModel.notes !== undefined) {
      ensureString(relativePath, recordId, "membershipModel.notes", record.membershipModel.notes);
    }
  }
}

function validateReligions(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^religion\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid religion id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate religion id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid religion slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate religion slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "summary", record.summary);
    if (!Array.isArray(record.deities) || record.deities.length === 0) {
      throw new Error(`${relativePath} has invalid deities on record ${recordId}`);
    }
    if (!Array.isArray(record.dualities)) {
      throw new Error(`${relativePath} has invalid dualities on record ${recordId}`);
    }
    if (!Array.isArray(record.dominanceCycle)) {
      throw new Error(`${relativePath} has invalid dominanceCycle on record ${recordId}`);
    }
    if (!Array.isArray(record.organizations) || record.organizations.length === 0) {
      throw new Error(`${relativePath} has invalid organizations on record ${recordId}`);
    }
    if (!Array.isArray(record.structureTypes) || record.structureTypes.length === 0) {
      throw new Error(`${relativePath} has invalid structureTypes on record ${recordId}`);
    }

    const deityIds = new Set();
    for (const [index, deity] of record.deities.entries()) {
      const field = `deities[${index}]`;
      if (!isObject(deity)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, deity.id);
      if (!/^deity\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(deity.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${deity.id}' on record ${recordId}`);
      }
      if (deityIds.has(deity.id)) {
        throw new Error(`${relativePath} has duplicate deity id '${deity.id}' on record ${recordId}`);
      }
      deityIds.add(deity.id);
      ensureString(relativePath, recordId, `${field}.name`, deity.name);
      ensureSetMembership(relativePath, recordId, `${field}.presentationGender`, deity.presentationGender, RELIGION_GENDERS);
      ensureSetMembership(relativePath, recordId, `${field}.element`, deity.element, RELIGION_ELEMENTS);
      ensureStringArray(relativePath, recordId, `${field}.domains`, deity.domains, 1);
      if (deity.opposedDeityId !== undefined) {
        ensureString(relativePath, recordId, `${field}.opposedDeityId`, deity.opposedDeityId);
      }
    }

    for (const [index, duality] of record.dualities.entries()) {
      const field = `dualities[${index}]`;
      if (!isObject(duality)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.leftDeityId`, duality.leftDeityId);
      ensureString(relativePath, recordId, `${field}.rightDeityId`, duality.rightDeityId);
      if (!deityIds.has(duality.leftDeityId) || !deityIds.has(duality.rightDeityId)) {
        throw new Error(`${relativePath} has unknown deity reference in ${field} on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, `${field}.relationship`, duality.relationship, RELIGION_RELATIONSHIPS);
      if (duality.relationship !== "opposed") {
        throw new Error(`${relativePath} has invalid duality relationship '${duality.relationship}' on record ${recordId}`);
      }
    }

    for (const [index, pairing] of record.dominanceCycle.entries()) {
      const field = `dominanceCycle[${index}]`;
      if (!isObject(pairing)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.winnerDeityId`, pairing.winnerDeityId);
      ensureString(relativePath, recordId, `${field}.loserDeityId`, pairing.loserDeityId);
      if (!deityIds.has(pairing.winnerDeityId) || !deityIds.has(pairing.loserDeityId)) {
        throw new Error(`${relativePath} has unknown deity reference in ${field} on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, `${field}.relationship`, pairing.relationship, RELIGION_RELATIONSHIPS);
      if (pairing.relationship !== "dominant") {
        throw new Error(`${relativePath} has invalid dominance relationship '${pairing.relationship}' on record ${recordId}`);
      }
    }

    const organizationIds = new Set();
    for (const [index, organization] of record.organizations.entries()) {
      const field = `organizations[${index}]`;
      if (!isObject(organization)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, organization.id);
      if (!/^religious_order\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(organization.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${organization.id}' on record ${recordId}`);
      }
      if (organizationIds.has(organization.id)) {
        throw new Error(`${relativePath} has duplicate organization id '${organization.id}' on record ${recordId}`);
      }
      organizationIds.add(organization.id);
      ensureString(relativePath, recordId, `${field}.name`, organization.name);
      ensureSetMembership(relativePath, recordId, `${field}.category`, organization.category, RELIGION_ORGANIZATION_CATEGORIES);
      ensureStringArray(relativePath, recordId, `${field}.favoredDeityIds`, organization.favoredDeityIds, 1);
      ensureStringArray(relativePath, recordId, `${field}.typicalTerrainTags`, organization.typicalTerrainTags, 1);
      ensureString(relativePath, recordId, `${field}.summary`, organization.summary);
      for (const deityId of organization.favoredDeityIds) {
        if (!deityIds.has(deityId)) {
          throw new Error(`${relativePath} has unknown favoredDeityId '${deityId}' in ${field} on record ${recordId}`);
        }
      }
    }

    const structureTypeIds = new Set();
    for (const [index, structureType] of record.structureTypes.entries()) {
      const field = `structureTypes[${index}]`;
      if (!isObject(structureType)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, structureType.id);
      if (!/^religious_site\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(structureType.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${structureType.id}' on record ${recordId}`);
      }
      if (structureTypeIds.has(structureType.id)) {
        throw new Error(`${relativePath} has duplicate structureType id '${structureType.id}' on record ${recordId}`);
      }
      structureTypeIds.add(structureType.id);
      ensureString(relativePath, recordId, `${field}.label`, structureType.label);
      ensureSetMembership(
        relativePath,
        recordId,
        `${field}.minimumPopulationBand`,
        structureType.minimumPopulationBand,
        SETTLEMENT_POPULATION_BANDS
      );
      ensureSetMembership(
        relativePath,
        recordId,
        `${field}.magicSupport`,
        structureType.magicSupport,
        RELIGION_MAGIC_SUPPORT_LEVELS
      );
    }
  }
}

function validateMagicInfrastructureCatalog(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^magic_service\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid magic service id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate magic service id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid magic service slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate magic service slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureSetMembership(relativePath, recordId, "category", record.category, MAGIC_SERVICE_CATEGORIES);

    if (!isObject(record.requiredInfrastructure)) {
      throw new Error(`${relativePath} has invalid requiredInfrastructure on record ${recordId}`);
    }
    for (const field of ["roadTier", "waterTier", "harborTier", "marketTier", "fortificationTier"]) {
      ensureInteger(relativePath, recordId, `requiredInfrastructure.${field}`, record.requiredInfrastructure[field], 0);
      if (record.requiredInfrastructure[field] > 5) {
        throw new Error(`${relativePath} has out-of-range requiredInfrastructure.${field} on record ${recordId}`);
      }
    }

    ensureStringArray(relativePath, recordId, "requiredGuildTypes", record.requiredGuildTypes, 0);
    ensureStringArray(relativePath, recordId, "requiredReligionOrganizationIds", record.requiredReligionOrganizationIds, 0);
    ensureStringArray(relativePath, recordId, "supportedUseCases", record.supportedUseCases, 1);
    ensureStringArray(relativePath, recordId, "prohibitedBypassTags", record.prohibitedBypassTags, 1);
    ensureStringArray(relativePath, recordId, "preferredCrystalTiers", record.preferredCrystalTiers, 1);
    ensureStringArray(relativePath, recordId, "allowedElements", record.allowedElements, 1);
    ensureSetMembership(relativePath, recordId, "serviceScaleBand", record.serviceScaleBand, MAGIC_SERVICE_SCALE_BANDS);

    for (const guildType of record.requiredGuildTypes) {
      if (!SLUG_PATTERN.test(guildType)) {
        throw new Error(`${relativePath} has invalid requiredGuildTypes value '${guildType}' on record ${recordId}`);
      }
    }
    for (const organizationId of record.requiredReligionOrganizationIds) {
      if (!/^religious_order\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(organizationId)) {
        throw new Error(`${relativePath} has invalid requiredReligionOrganizationIds value '${organizationId}' on record ${recordId}`);
      }
    }
    for (const tier of record.preferredCrystalTiers) {
      ensureSetMembership(relativePath, recordId, "preferredCrystalTiers", tier, CRYSTAL_TIERS);
    }
    for (const element of record.allowedElements) {
      ensureSetMembership(relativePath, recordId, "allowedElements", element, new Set(["neutral", ...RELIGION_ELEMENTS]));
    }
  }
}

function validateCrystalCatalog(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();
  const seenElementTierPairs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^crystal\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid crystal id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate crystal id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid crystal slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate crystal slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "tier", record.tier, CRYSTAL_TIERS);
    ensureSetMembership(relativePath, recordId, "element", record.element, new Set(["neutral", ...RELIGION_ELEMENTS]));
    ensureSetMembership(relativePath, recordId, "affinityKey", record.affinityKey, new Set(["neutral", ...RELIGION_ELEMENTS]));
    ensureInteger(relativePath, recordId, "capacity", record.capacity, 1);
    ensureFiniteNumber(relativePath, recordId, "efficiency", record.efficiency);
    ensureFiniteNumber(relativePath, recordId, "stability", record.stability);
    ensureSetMembership(relativePath, recordId, "attunementMode", record.attunementMode, CRYSTAL_ATTUNEMENT_MODES);
    ensureBoolean(relativePath, recordId, "reusable", record.reusable);
    ensureBoolean(relativePath, recordId, "consumedOnPermanentEnchant", record.consumedOnPermanentEnchant);
    ensureStringArray(relativePath, recordId, "supportedUseCases", record.supportedUseCases, 1);
    ensureString(relativePath, recordId, "rechargeMethod", record.rechargeMethod);
    ensureNumber(relativePath, recordId, "mismatchPenalty", record.mismatchPenalty, 0);
    if (record.mismatchPenalty > 1) {
      throw new Error(`${relativePath} has mismatchPenalty above 1 on record ${recordId}`);
    }

    if (record.affinityKey === "stone") {
      throw new Error(`${relativePath} must normalize affinityKey 'stone' to 'earth' on record ${recordId}`);
    }

    const pairKey = `${record.element}:${record.tier}`;
    if (seenElementTierPairs.has(pairKey)) {
      throw new Error(`${relativePath} has duplicate crystal element/tier pair '${pairKey}' on record ${recordId}`);
    }
    seenElementTierPairs.add(pairKey);
  }
}

function validateQuestTemplates(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^quest_template\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid quest template id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate quest template id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid quest template slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate quest template slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "category", record.category, QUEST_TEMPLATE_CATEGORIES);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureStringArray(relativePath, recordId, "issuingGuildTypes", record.issuingGuildTypes, 1);
    ensureBoolean(relativePath, recordId, "allowAdventurersFallback", record.allowAdventurersFallback);
    ensureSetMembership(relativePath, recordId, "generationSource", record.generationSource, QUEST_TEMPLATE_SOURCES);
    ensureStringArray(relativePath, recordId, "targetItemKeys", record.targetItemKeys, 0);
    ensureStringArray(relativePath, recordId, "targetSettlementTags", record.targetSettlementTags, 0);
    ensureStringArray(relativePath, recordId, "monsterIds", record.monsterIds, 0);
    ensureInteger(relativePath, recordId, "minimumQuantity", record.minimumQuantity, 1);
    ensureNumber(relativePath, recordId, "minimumShortfallPerTick", record.minimumShortfallPerTick, 0);
    ensureNumber(relativePath, recordId, "minimumTradeSurplusPerTick", record.minimumTradeSurplusPerTick, 0);

    for (const guildType of record.issuingGuildTypes) {
      if (!SLUG_PATTERN.test(guildType)) {
        throw new Error(`${relativePath} has invalid issuingGuildTypes value '${guildType}' on record ${recordId}`);
      }
    }
    for (const itemKey of record.targetItemKeys) {
      if (!ITEM_KEY_PATTERN.test(itemKey)) {
        throw new Error(`${relativePath} has invalid targetItemKeys value '${itemKey}' on record ${recordId}`);
      }
    }
    for (const settlementTag of record.targetSettlementTags) {
      if (!SLUG_PATTERN.test(settlementTag)) {
        throw new Error(`${relativePath} has invalid targetSettlementTags value '${settlementTag}' on record ${recordId}`);
      }
    }
    for (const monsterId of record.monsterIds) {
      if (!/^monster\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(monsterId)) {
        throw new Error(`${relativePath} has invalid monsterIds value '${monsterId}' on record ${recordId}`);
      }
    }

    if (!isObject(record.rewardProfile)) {
      throw new Error(`${relativePath} has invalid rewardProfile on record ${recordId}`);
    }
    ensureInteger(relativePath, recordId, "rewardProfile.coinBase", record.rewardProfile.coinBase, 0);
    ensureInteger(relativePath, recordId, "rewardProfile.standingBase", record.rewardProfile.standingBase, 0);
    ensureStringArray(relativePath, recordId, "rewardProfile.bonusItemKeys", record.rewardProfile.bonusItemKeys, 0);
    for (const itemKey of record.rewardProfile.bonusItemKeys) {
      if (!ITEM_KEY_PATTERN.test(itemKey)) {
        throw new Error(`${relativePath} has invalid rewardProfile.bonusItemKeys value '${itemKey}' on record ${recordId}`);
      }
    }
  }
}

function validateCombatFocusDirectives(relativePath, recordId, fieldName, directives) {
  if (!isObject(directives)) {
    throw new Error(`${relativePath} has invalid ${fieldName} on record ${recordId}`);
  }

  for (const key of [
    "focusTargetIds",
    "ignoreTargetIds",
    "priorityTargetIds",
    "deprioritizedTargetIds",
    "meleeFocusTargetIds",
    "meleeIgnoreTargetIds",
    "rangedFocusTargetIds",
    "rangedIgnoreTargetIds",
    "magicFocusTargetIds",
    "magicIgnoreTargetIds"
  ]) {
    ensureStringArray(relativePath, recordId, `${fieldName}.${key}`, directives[key], 0);
  }
}

function validateCombatTargetPreferences(relativePath, recordId, fieldName, preferences) {
  if (!Array.isArray(preferences) || preferences.length === 0) {
    throw new Error(`${relativePath} has invalid ${fieldName} on record ${recordId}`);
  }

  for (const [index, preference] of preferences.entries()) {
    const entryField = `${fieldName}[${index}]`;
    if (!isObject(preference)) {
      throw new Error(`${relativePath} has invalid ${entryField} on record ${recordId}`);
    }
    ensureString(relativePath, recordId, `${entryField}.id`, preference.id);
    ensureSetMembership(relativePath, recordId, `${entryField}.rule`, preference.rule, COMBAT_TARGET_RULE_IDS);
    ensureNumber(relativePath, recordId, `${entryField}.weight`, preference.weight, 0);
    ensureSetMembership(
      relativePath,
      recordId,
      `${entryField}.scope`,
      preference.scope,
      new Set(["ally", "enemy", "any"])
    );
    if ("actionTypes" in preference) {
      ensureStringArray(relativePath, recordId, `${entryField}.actionTypes`, preference.actionTypes, 1);
    }
    if ("element" in preference) {
      ensureString(relativePath, recordId, `${entryField}.element`, preference.element);
    }
    if ("sourceTargetIds" in preference) {
      ensureStringArray(relativePath, recordId, `${entryField}.sourceTargetIds`, preference.sourceTargetIds, 1);
    }
  }
}

function validateCombatTactics(relativePath, recordId, fieldName, tactics) {
  if (!isObject(tactics)) {
    throw new Error(`${relativePath} has invalid ${fieldName} on record ${recordId}`);
  }

  ensureSetMembership(relativePath, recordId, `${fieldName}.roleId`, tactics.roleId, TACTICAL_ROLE_IDS);

  if (!isObject(tactics.preferences)) {
    throw new Error(`${relativePath} has invalid ${fieldName}.preferences on record ${recordId}`);
  }
  for (const key of [
    "favorInterrupts",
    "favorDamage",
    "favorLowTierSpells",
    "favorHighTierSpells",
    "favorConservation",
    "favorWeaknessExploitation",
    "favorHealingUrgency",
    "favorEnfeebling",
    "favorEnhancing",
    "favorAreaEffects",
    "favorSingleTargetPressure",
    "favorMeleeEngagement",
    "favorRangedEngagement",
    "favorMagicEngagement"
  ]) {
    ensureSetMembership(relativePath, recordId, `${fieldName}.preferences.${key}`, tactics.preferences[key], TACTICAL_BIASES);
  }

  if (!isObject(tactics.spellPreferences)) {
    throw new Error(`${relativePath} has invalid ${fieldName}.spellPreferences on record ${recordId}`);
  }
  ensureStringArray(
    relativePath,
    recordId,
    `${fieldName}.spellPreferences.preferredSchools`,
    tactics.spellPreferences.preferredSchools,
    0
  );
  ensureStringArray(
    relativePath,
    recordId,
    `${fieldName}.spellPreferences.preferredElements`,
    tactics.spellPreferences.preferredElements,
    0
  );
  ensureSetMembership(
    relativePath,
    recordId,
    `${fieldName}.spellPreferences.preferredTier`,
    tactics.spellPreferences.preferredTier,
    SPELL_TIER_PREFERENCES
  );
  ensureSetMembership(
    relativePath,
    recordId,
    `${fieldName}.spellPreferences.buffPriority`,
    tactics.spellPreferences.buffPriority,
    TACTICAL_BIASES
  );
  ensureSetMembership(
    relativePath,
    recordId,
    `${fieldName}.spellPreferences.debuffPriority`,
    tactics.spellPreferences.debuffPriority,
    TACTICAL_BIASES
  );
  if (!isObject(tactics.spellPreferences.resourceConservationThresholds)) {
    throw new Error(`${relativePath} has invalid ${fieldName}.spellPreferences.resourceConservationThresholds on record ${recordId}`);
  }
  for (const key of ["mpRatio", "staminaRatio"]) {
    ensureNumber(
      relativePath,
      recordId,
      `${fieldName}.spellPreferences.resourceConservationThresholds.${key}`,
      tactics.spellPreferences.resourceConservationThresholds[key],
      0
    );
    if (tactics.spellPreferences.resourceConservationThresholds[key] > 1) {
      throw new Error(`${relativePath} has ${fieldName}.spellPreferences.resourceConservationThresholds.${key} above 1 on record ${recordId}`);
    }
  }

  validateCombatTargetPreferences(relativePath, recordId, `${fieldName}.targetPreferences`, tactics.targetPreferences);
  validateCombatFocusDirectives(relativePath, recordId, `${fieldName}.focusDirectives`, tactics.focusDirectives);
}

function validateCombatRoles(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureSetMembership(relativePath, recordId, "id", record.id, TACTICAL_ROLE_IDS);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate combat role id '${record.id}'`);
    }
    seenIds.add(record.id);
    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureStringArray(relativePath, recordId, "preferredActionTypes", record.preferredActionTypes, 1);
    validateCombatTactics(relativePath, recordId, "defaultTactics", record.defaultTactics);
    if (record.defaultTactics.roleId !== record.id) {
      throw new Error(`${relativePath} defaultTactics.roleId must match id on record ${recordId}`);
    }
  }
}

function validateTacticsPresets(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate tactics preset id '${record.id}'`);
    }
    seenIds.add(record.id);
    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "disposition", record.disposition, new Set(["ally", "enemy", "neutral"]));
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureSetMembership(relativePath, recordId, "roleId", record.roleId, TACTICAL_ROLE_IDS);
    validateCombatTactics(relativePath, recordId, "tactics", record.tactics);
    if (record.tactics.roleId !== record.roleId) {
      throw new Error(`${relativePath} tactics.roleId must match roleId on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "tags", record.tags, 1);
  }
}

function validateEncounterTemplates(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (!/^encounter\.[a-z0-9]+(?:[._][a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid encounter id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate encounter id '${record.id}'`);
    }
    seenIds.add(record.id);
    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureSetMembership(relativePath, recordId, "disposition", record.disposition, COMBAT_ENCOUNTER_DISPOSITIONS);
    ensureSetMembership(relativePath, recordId, "movementMode", record.movementMode, COMBAT_MOVEMENT_MODES);
    ensureStringArray(relativePath, recordId, "regionIds", record.regionIds, 1);
    ensureStringArray(relativePath, recordId, "habitatTags", record.habitatTags, 1);
    ensureStringArray(relativePath, recordId, "tags", record.tags, 1);
    ensureSetMembership(relativePath, recordId, "difficultyBand", record.difficultyBand, MONSTER_THREATS);

    if (!Array.isArray(record.members) || record.members.length === 0) {
      throw new Error(`${relativePath} has invalid members on record ${recordId}`);
    }
    for (const [index, member] of record.members.entries()) {
      const field = `members[${index}]`;
      if (!isObject(member)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.monsterId`, member.monsterId);
      ensureInteger(relativePath, recordId, `${field}.minCount`, member.minCount, 1);
      ensureInteger(relativePath, recordId, `${field}.maxCount`, member.maxCount, 1);
      if (member.maxCount < member.minCount) {
        throw new Error(`${relativePath} has ${field}.maxCount below minCount on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, `${field}.roleId`, member.roleId, TACTICAL_ROLE_IDS);
    }

    if ("alliedTemplateIds" in record) {
      ensureStringArray(relativePath, recordId, "alliedTemplateIds", record.alliedTemplateIds, 1);
      for (const alliedId of record.alliedTemplateIds) {
        if (!/^encounter\.[a-z0-9]+(?:[._][a-z0-9]+)*$/.test(alliedId)) {
          throw new Error(`${relativePath} has invalid alliedTemplateIds value '${alliedId}' on record ${recordId}`);
        }
      }
    }
  }
}

function validateSpawnProfiles(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (!/^spawn\.[a-z0-9]+(?:[._][a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid spawn profile id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate spawn profile id '${record.id}'`);
    }
    seenIds.add(record.id);
    ensureString(relativePath, recordId, "name", record.name);
    ensureStringArray(relativePath, recordId, "regionIds", record.regionIds, 1);
    ensureStringArray(relativePath, recordId, "worldHexIds", record.worldHexIds, 0);
    ensureStringArray(relativePath, recordId, "settlementIds", record.settlementIds, 0);
    ensureStringArray(relativePath, recordId, "siteIds", record.siteIds, 0);
    ensureStringArray(relativePath, recordId, "habitatTags", record.habitatTags, 0);
    ensureNumber(relativePath, recordId, "minHazardPressure", record.minHazardPressure, 0);
    ensureNumber(relativePath, recordId, "maxHazardPressure", record.maxHazardPressure, 0);
    if (record.maxHazardPressure < record.minHazardPressure) {
      throw new Error(`${relativePath} has maxHazardPressure below minHazardPressure on record ${recordId}`);
    }
    ensureNumber(relativePath, recordId, "spawnRatePerDay", record.spawnRatePerDay, 0);
    if (record.spawnRatePerDay > 100) {
      throw new Error(`${relativePath} has spawnRatePerDay above 100 on record ${recordId}`);
    }
    ensureSetMembership(relativePath, recordId, "densityBand", record.densityBand, COMBAT_DENSITY_BANDS);
    if (!isObject(record.hostilityWeights)) {
      throw new Error(`${relativePath} has invalid hostilityWeights on record ${recordId}`);
    }
    let totalHostilityWeight = 0;
    for (const key of ["hostile", "friendly", "neutral"]) {
      ensureNumber(relativePath, recordId, `hostilityWeights.${key}`, record.hostilityWeights[key], 0);
      totalHostilityWeight += record.hostilityWeights[key];
    }
    if (totalHostilityWeight <= 0) {
      throw new Error(`${relativePath} hostilityWeights total must be positive on record ${recordId}`);
    }

    ensureStringArray(relativePath, recordId, "allowedMovementModes", record.allowedMovementModes, 1);
    for (const movementMode of record.allowedMovementModes) {
      ensureSetMembership(relativePath, recordId, "allowedMovementModes", movementMode, COMBAT_MOVEMENT_MODES);
    }

    if (!Array.isArray(record.encounterWeights) || record.encounterWeights.length === 0) {
      throw new Error(`${relativePath} has invalid encounterWeights on record ${recordId}`);
    }
    const seenEncounterIds = new Set();
    for (const [index, weightRecord] of record.encounterWeights.entries()) {
      const field = `encounterWeights[${index}]`;
      if (!isObject(weightRecord)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.encounterTemplateId`, weightRecord.encounterTemplateId);
      ensureNumber(relativePath, recordId, `${field}.weight`, weightRecord.weight, 1);
      if (seenEncounterIds.has(weightRecord.encounterTemplateId)) {
        throw new Error(`${relativePath} has duplicate ${field}.encounterTemplateId '${weightRecord.encounterTemplateId}' on record ${recordId}`);
      }
      seenEncounterIds.add(weightRecord.encounterTemplateId);
      if ("minHazardPressure" in weightRecord) {
        ensureNumber(relativePath, recordId, `${field}.minHazardPressure`, weightRecord.minHazardPressure, 0);
      }
      if ("maxHazardPressure" in weightRecord) {
        ensureNumber(relativePath, recordId, `${field}.maxHazardPressure`, weightRecord.maxHazardPressure, 0);
      }
      if (
        "minHazardPressure" in weightRecord &&
        "maxHazardPressure" in weightRecord &&
        weightRecord.maxHazardPressure < weightRecord.minHazardPressure
      ) {
        throw new Error(`${relativePath} has ${field}.maxHazardPressure below minHazardPressure on record ${recordId}`);
      }
    }
  }
}

function validateMonsters(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^monster\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid monster id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate monster id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid monster slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate monster slug '${record.slug}'`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "monsterClass", record.monsterClass, MONSTER_CLASSES);
    ensureSetMembership(relativePath, recordId, "threat", record.threat, MONSTER_THREATS);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureStringArray(relativePath, recordId, "habitatTags", record.habitatTags, 1);
    ensureStringArray(relativePath, recordId, "behaviorTags", record.behaviorTags, 1);

    for (const field of ["habitatTags", "behaviorTags"]) {
      for (const value of record[field]) {
        if (!SLUG_PATTERN.test(value)) {
          throw new Error(`${relativePath} has invalid ${field} value '${value}' on record ${recordId}`);
        }
      }
    }

    if (!Array.isArray(record.drops) || record.drops.length === 0) {
      throw new Error(`${relativePath} has invalid drops on record ${recordId}`);
    }
    for (const [index, drop] of record.drops.entries()) {
      const field = `drops[${index}]`;
      if (!isObject(drop)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.itemKey`, drop.itemKey);
      if (!ITEM_KEY_PATTERN.test(drop.itemKey)) {
        throw new Error(`${relativePath} has invalid ${field}.itemKey '${drop.itemKey}' on record ${recordId}`);
      }
      ensureInteger(relativePath, recordId, `${field}.quantityMin`, drop.quantityMin, 1);
      ensureInteger(relativePath, recordId, `${field}.quantityMax`, drop.quantityMax, 1);
      if (drop.quantityMax < drop.quantityMin) {
        throw new Error(`${relativePath} has ${field}.quantityMax below quantityMin on record ${recordId}`);
      }
      ensureNumber(relativePath, recordId, `${field}.chance`, drop.chance, 0);
      if (drop.chance > 1) {
        throw new Error(`${relativePath} has ${field}.chance above 1 on record ${recordId}`);
      }
    }

    if (!Array.isArray(record.loot)) {
      throw new Error(`${relativePath} has invalid loot on record ${recordId}`);
    }
    for (const [index, loot] of record.loot.entries()) {
      const field = `loot[${index}]`;
      if (!isObject(loot)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.itemKey`, loot.itemKey);
      if (!ITEM_KEY_PATTERN.test(loot.itemKey)) {
        throw new Error(`${relativePath} has invalid ${field}.itemKey '${loot.itemKey}' on record ${recordId}`);
      }
      ensureNumber(relativePath, recordId, `${field}.chance`, loot.chance, 0);
      if (loot.chance > 1) {
        throw new Error(`${relativePath} has ${field}.chance above 1 on record ${recordId}`);
      }
    }

    if ("baseFaunaId" in record) {
      ensureString(relativePath, recordId, "baseFaunaId", record.baseFaunaId);
      if (!/^fauna\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.baseFaunaId)) {
        throw new Error(`${relativePath} has invalid baseFaunaId '${record.baseFaunaId}' on record ${recordId}`);
      }
    }

    if ("baseMonsterId" in record) {
      ensureString(relativePath, recordId, "baseMonsterId", record.baseMonsterId);
      if (!/^monster\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.baseMonsterId)) {
        throw new Error(`${relativePath} has invalid baseMonsterId '${record.baseMonsterId}' on record ${recordId}`);
      }
      if (record.baseMonsterId === record.id) {
        throw new Error(`${relativePath} has self-referencing baseMonsterId on record ${recordId}`);
      }
    }

    if ("variantType" in record) {
      ensureSetMembership(relativePath, recordId, "variantType", record.variantType, MONSTER_VARIANT_TYPES);
    }

    if ("attunementLevel" in record) {
      ensureSetMembership(relativePath, recordId, "attunementLevel", record.attunementLevel, MONSTER_ATTUNEMENT_LEVELS);
    }

    if ("elements" in record) {
      ensureStringArray(relativePath, recordId, "elements", record.elements, 1);
      const seenElements = new Set();
      for (const element of record.elements) {
        ensureSetMembership(relativePath, recordId, "elements", element, new Set(["neutral", ...RELIGION_ELEMENTS]));
        if (seenElements.has(element)) {
          throw new Error(`${relativePath} has duplicate elements value '${element}' on record ${recordId}`);
        }
        seenElements.add(element);
      }
    }

    if ("originProfile" in record) {
      if (!isObject(record.originProfile)) {
        throw new Error(`${relativePath} has invalid originProfile on record ${recordId}`);
      }

      ensureSetMembership(
        relativePath,
        recordId,
        "originProfile.appearanceRate",
        record.originProfile.appearanceRate,
        MONSTER_APPEARANCE_RATES
      );
      ensureStringArray(relativePath, recordId, "originProfile.terrainSources", record.originProfile.terrainSources, 1);
      ensureStringArray(relativePath, recordId, "originProfile.entryVectors", record.originProfile.entryVectors, 1);
      ensureSetMembership(
        relativePath,
        recordId,
        "originProfile.secureSettlementRule",
        record.originProfile.secureSettlementRule,
        MONSTER_SECURE_SETTLEMENT_RULES
      );

      for (const field of ["terrainSources", "entryVectors"]) {
        const seenValues = new Set();
        for (const value of record.originProfile[field]) {
          if (!SLUG_PATTERN.test(value)) {
            throw new Error(`${relativePath} has invalid originProfile.${field} value '${value}' on record ${recordId}`);
          }
          if (seenValues.has(value)) {
            throw new Error(`${relativePath} has duplicate originProfile.${field} value '${value}' on record ${recordId}`);
          }
          seenValues.add(value);
        }
      }
    }

    if (!isObject(record.combatProfile)) {
      throw new Error(`${relativePath} has invalid combatProfile on record ${recordId}`);
    }
    for (const field of [
      "baseHp",
      "baseMp",
      "baseStamina",
      "baseAccuracy",
      "baseDefense",
      "baseEvasion",
      "baseAttackSpeed",
      "baseRecoverySpeed",
      "threatRating"
    ]) {
      ensureNumber(relativePath, recordId, `combatProfile.${field}`, record.combatProfile[field], 0);
    }
    if (record.combatProfile.baseHp < 1 || record.combatProfile.baseStamina < 1) {
      throw new Error(`${relativePath} has invalid combatProfile base resource minima on record ${recordId}`);
    }
    ensureSetMembership(
      relativePath,
      recordId,
      "combatProfile.preferredRange",
      record.combatProfile.preferredRange,
      COMBAT_PREFERRED_RANGES
    );

    ensureSetMembership(relativePath, recordId, "defaultRole", record.defaultRole, TACTICAL_ROLE_IDS);
    ensureStringArray(relativePath, recordId, "actionPackageIds", record.actionPackageIds, 1);
    for (const actionPackageId of record.actionPackageIds) {
      ensureSetMembership(relativePath, recordId, "actionPackageIds", actionPackageId, COMBAT_ACTION_PACKAGE_IDS);
    }

    if (!isObject(record.difficultyScalingHooks)) {
      throw new Error(`${relativePath} has invalid difficultyScalingHooks on record ${recordId}`);
    }
    for (const field of [
      "hpPerTier",
      "mpPerTier",
      "staminaPerTier",
      "accuracyPerTier",
      "defensePerTier",
      "actionTimeMultiplierPerTier",
      "recoveryMultiplierPerTier"
    ]) {
      ensureNumber(relativePath, recordId, `difficultyScalingHooks.${field}`, record.difficultyScalingHooks[field], 0);
    }
  }
}

function validateSettlements(relativePath, records) {
  const seenIds = new Set();
  const populationBandRanges = {
    tiny: { min: 1, max: 500 },
    small: { min: 501, max: 2500 },
    modest: { min: 2501, max: 12000 },
    large: { min: 12001, max: 60000 },
    major: { min: 60001, max: Number.POSITIVE_INFINITY }
  };

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid settlement id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate settlement id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "macroRegionId", record.macroRegionId);
    ensureString(relativePath, recordId, "regionId", record.regionId);
    ensureString(relativePath, recordId, "localityBandId", record.localityBandId);
    ensureString(relativePath, recordId, "hexAnchorId", record.hexAnchorId);
    if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.macroRegionId)) {
      throw new Error(`${relativePath} has invalid macroRegionId '${record.macroRegionId}' on record ${recordId}`);
    }
    if (!/^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.regionId)) {
      throw new Error(`${relativePath} has invalid regionId '${record.regionId}' on record ${recordId}`);
    }
    if (!/^region_locality\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.localityBandId)) {
      throw new Error(`${relativePath} has invalid localityBandId '${record.localityBandId}' on record ${recordId}`);
    }
    if (!/^world_hex\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.hexAnchorId)) {
      throw new Error(`${relativePath} has invalid hexAnchorId '${record.hexAnchorId}' on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, "settlementType", record.settlementType, SETTLEMENT_TYPES);
    ensureSetMembership(relativePath, recordId, "siteClass", record.siteClass, SETTLEMENT_SITE_CLASSES);
    ensureString(relativePath, recordId, "terrainContext", record.terrainContext);
    if (!SLUG_PATTERN.test(record.terrainContext)) {
      throw new Error(`${relativePath} has invalid terrainContext '${record.terrainContext}' on record ${recordId}`);
    }
    ensureSetMembership(relativePath, recordId, "populationBand", record.populationBand, SETTLEMENT_POPULATION_BANDS);

    if (!Number.isInteger(record.populationTotal) || record.populationTotal < 1) {
      throw new Error(`${relativePath} has invalid populationTotal on record ${recordId}`);
    }
    const bandRange = populationBandRanges[record.populationBand];
    if (record.populationTotal < bandRange.min || record.populationTotal > bandRange.max) {
      throw new Error(
        `${relativePath} populationTotal ${record.populationTotal} is outside ${record.populationBand} band range on record ${recordId}`
      );
    }

    ensureSetMembership(relativePath, recordId, "administrativeRole", record.administrativeRole, SETTLEMENT_ADMIN_ROLES);
    if (record.parentSettlementId !== undefined) {
      ensureString(relativePath, recordId, "parentSettlementId", record.parentSettlementId);
      if (!/^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.parentSettlementId)) {
        throw new Error(`${relativePath} has invalid parentSettlementId '${record.parentSettlementId}' on record ${recordId}`);
      }
    }
    if (record.dependencyRole !== undefined) {
      ensureSetMembership(relativePath, recordId, "dependencyRole", record.dependencyRole, SETTLEMENT_DEPENDENCY_ROLES);
    }
    if ((record.parentSettlementId === undefined) !== (record.dependencyRole === undefined)) {
      throw new Error(`${relativePath} parentSettlementId and dependencyRole must be provided together on record ${recordId}`);
    }
    if (DEPENDENT_SETTLEMENT_TYPES.has(record.settlementType) && record.parentSettlementId === undefined) {
      throw new Error(`${relativePath} dependent settlement type '${record.settlementType}' requires parentSettlementId on record ${recordId}`);
    }

    ensureString(relativePath, recordId, "summary", record.summary);
    ensureString(relativePath, recordId, "siteContext", record.siteContext);
    ensureStringArray(relativePath, recordId, "identityTags", record.identityTags, 1);
    ensureStringArray(relativePath, recordId, "purposeTags", record.purposeTags, 1);

    for (const tag of [...record.identityTags, ...record.purposeTags]) {
      if (!SLUG_PATTERN.test(tag)) {
        throw new Error(`${relativePath} has invalid tag '${tag}' on record ${recordId}`);
      }
    }

    if (!isObject(record.economicModel)) {
      throw new Error(`${relativePath} has invalid economicModel on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "economicModel.dominantRole", record.economicModel.dominantRole);
    if (!SLUG_PATTERN.test(record.economicModel.dominantRole)) {
      throw new Error(`${relativePath} has invalid economicModel.dominantRole '${record.economicModel.dominantRole}' on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "economicModel.secondaryRoles", record.economicModel.secondaryRoles, 0);
    ensureStringArray(relativePath, recordId, "economicModel.localSupplyStrengths", record.economicModel.localSupplyStrengths, 1);
    ensureStringArray(relativePath, recordId, "economicModel.demandPressures", record.economicModel.demandPressures, 1);
    ensureNumber(relativePath, recordId, "economicModel.specializationWeight", record.economicModel.specializationWeight, 0.1);
    for (const role of record.economicModel.secondaryRoles) {
      if (!SLUG_PATTERN.test(role)) {
        throw new Error(`${relativePath} has invalid economicModel.secondaryRoles value '${role}' on record ${recordId}`);
      }
    }
    for (const itemKey of [...record.economicModel.localSupplyStrengths, ...record.economicModel.demandPressures]) {
      if (!ITEM_KEY_PATTERN.test(itemKey)) {
        throw new Error(`${relativePath} has invalid economicModel item '${itemKey}' on record ${recordId}`);
      }
    }

    if (!isObject(record.survivalModel)) {
      throw new Error(`${relativePath} has invalid survivalModel on record ${recordId}`);
    }
    for (const field of ["habitationScore", "foodSecurity", "waterSecurity", "climateBurden", "hazardPressure", "infrastructureDifficulty"]) {
      ensureInteger(relativePath, recordId, `survivalModel.${field}`, record.survivalModel[field], 0);
      if (record.survivalModel[field] > 100) {
        throw new Error(`${relativePath} has invalid survivalModel.${field} above 100 on record ${recordId}`);
      }
    }

    if (!isObject(record.tradeDependencyProfile)) {
      throw new Error(`${relativePath} has invalid tradeDependencyProfile on record ${recordId}`);
    }
    ensureNumber(relativePath, recordId, "tradeDependencyProfile.importBias", record.tradeDependencyProfile.importBias, 0);
    ensureNumber(relativePath, recordId, "tradeDependencyProfile.exportBias", record.tradeDependencyProfile.exportBias, 0);
    if (record.tradeDependencyProfile.importBias > 1 || record.tradeDependencyProfile.exportBias > 1) {
      throw new Error(`${relativePath} has tradeDependencyProfile import/export bias above 1 on record ${recordId}`);
    }
    ensureSetMembership(relativePath, recordId, "tradeDependencyProfile.dependencyBand", record.tradeDependencyProfile.dependencyBand, SETTLEMENT_DEPENDENCY_BANDS);
    ensureStringArray(relativePath, recordId, "tradeDependencyProfile.stapleImports", record.tradeDependencyProfile.stapleImports, 0);
    ensureStringArray(relativePath, recordId, "tradeDependencyProfile.exportFocus", record.tradeDependencyProfile.exportFocus, 0);
    for (const itemKey of [...record.tradeDependencyProfile.stapleImports, ...record.tradeDependencyProfile.exportFocus]) {
      if (!ITEM_KEY_PATTERN.test(itemKey)) {
        throw new Error(`${relativePath} has invalid tradeDependencyProfile item '${itemKey}' on record ${recordId}`);
      }
    }
    if (!isObject(record.tradeDependencyProfile.routeAccess)) {
      throw new Error(`${relativePath} has invalid tradeDependencyProfile.routeAccess on record ${recordId}`);
    }
    for (const field of ["road", "river", "coastal", "caravan", "pass", "seaLane"]) {
      ensureNumber(relativePath, recordId, `tradeDependencyProfile.routeAccess.${field}`, record.tradeDependencyProfile.routeAccess[field], 0);
    }

    if (!isObject(record.infrastructureProfile)) {
      throw new Error(`${relativePath} has invalid infrastructureProfile on record ${recordId}`);
    }
    ensureSetMembership(
      relativePath,
      recordId,
      "infrastructureProfile.overallLevel",
      record.infrastructureProfile.overallLevel,
      SETTLEMENT_INFRA_LEVELS
    );
    for (const field of ["roadTier", "waterTier", "fortificationTier", "harborTier", "marketTier"]) {
      const value = record.infrastructureProfile[field];
      if (!Number.isInteger(value) || value < 0 || value > 5) {
        throw new Error(`${relativePath} has invalid infrastructureProfile.${field} on record ${recordId}`);
      }
    }

    if (!Array.isArray(record.racialMix) || record.racialMix.length === 0) {
      throw new Error(`${relativePath} has invalid racialMix on record ${recordId}`);
    }
    let raceTotal = 0;
    let humanPercentage = 0;
    for (const [index, entry] of record.racialMix.entries()) {
      const field = `racialMix[${index}]`;
      if (!isObject(entry)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.race`, entry.race);
      ensureNumber(relativePath, recordId, `${field}.percentage`, entry.percentage, 0);
      if (entry.percentage > 100) {
        throw new Error(`${relativePath} has ${field}.percentage above 100 on record ${recordId}`);
      }
      raceTotal += entry.percentage;
      if (entry.race === "humans") {
        humanPercentage += entry.percentage;
      }
    }
    if (Math.abs(raceTotal - 100) > 0.5) {
      throw new Error(`${relativePath} racialMix must total 100 (+/-0.5) on record ${recordId}`);
    }

    if (!isObject(record.domesticResourceProfile)) {
      throw new Error(`${relativePath} has invalid domesticResourceProfile on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "domesticResourceProfile.primaryGoods", record.domesticResourceProfile.primaryGoods, 1);
    ensureStringArray(relativePath, recordId, "domesticResourceProfile.secondaryGoods", record.domesticResourceProfile.secondaryGoods, 0);
    ensureStringArray(relativePath, recordId, "domesticResourceProfile.demandedGoods", record.domesticResourceProfile.demandedGoods, 1);
    for (const field of ["primaryGoods", "secondaryGoods", "demandedGoods"]) {
      for (const item of record.domesticResourceProfile[field]) {
        if (!ITEM_KEY_PATTERN.test(item)) {
          throw new Error(`${relativePath} has invalid domesticResourceProfile.${field} item '${item}' on record ${recordId}`);
        }
      }
    }

    if (!Array.isArray(record.domesticTradeFlows)) {
      throw new Error(`${relativePath} has invalid domesticTradeFlows on record ${recordId}`);
    }
    for (const [index, flow] of record.domesticTradeFlows.entries()) {
      const field = `domesticTradeFlows[${index}]`;
      if (!isObject(flow)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.partnerSettlementId`, flow.partnerSettlementId);
      if (!/^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(flow.partnerSettlementId)) {
        throw new Error(`${relativePath} has invalid ${field}.partnerSettlementId '${flow.partnerSettlementId}' on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, `${field}.direction`, flow.direction, SETTLEMENT_TRADE_DIRECTIONS);
      ensureStringArray(relativePath, recordId, `${field}.goods`, flow.goods, 1);
      for (const item of flow.goods) {
        if (!ITEM_KEY_PATTERN.test(item)) {
          throw new Error(`${relativePath} has invalid ${field}.goods item '${item}' on record ${recordId}`);
        }
      }
      ensureStringArray(relativePath, recordId, `${field}.routeModes`, flow.routeModes, 1);
      for (const routeMode of flow.routeModes) {
        ensureSetMembership(relativePath, recordId, `${field}.routeModes`, routeMode, SETTLEMENT_ROUTE_MODES);
      }
      ensureString(relativePath, recordId, `${field}.notes`, flow.notes);
    }

    if (!Array.isArray(record.guildPresence)) {
      throw new Error(`${relativePath} has invalid guildPresence on record ${recordId}`);
    }
    if (humanPercentage <= 0 && record.guildPresence.length > 0) {
      throw new Error(`${relativePath} guildPresence requires a human population on record ${recordId}`);
    }
    for (const [index, guild] of record.guildPresence.entries()) {
      const field = `guildPresence[${index}]`;
      if (!isObject(guild)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.guildType`, guild.guildType);
      if (!SLUG_PATTERN.test(guild.guildType)) {
        throw new Error(`${relativePath} has invalid ${field}.guildType '${guild.guildType}' on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.name`, guild.name);
      ensureSetMembership(relativePath, recordId, `${field}.presenceLevel`, guild.presenceLevel, SETTLEMENT_GUILD_PRESENCE_LEVELS);
      ensureStringArray(relativePath, recordId, `${field}.functions`, guild.functions, 1);
      for (const func of guild.functions) {
        if (!SLUG_PATTERN.test(func)) {
          throw new Error(`${relativePath} has invalid ${field}.functions item '${func}' on record ${recordId}`);
        }
      }
      ensureString(relativePath, recordId, `${field}.notes`, guild.notes);
    }

    if (record.visualMapRef !== undefined) {
      if (!isObject(record.visualMapRef)) {
        throw new Error(`${relativePath} has invalid visualMapRef on record ${recordId}`);
      }
      ensureString(relativePath, recordId, "visualMapRef.mapId", record.visualMapRef.mapId);
      if (!/^world_map\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.visualMapRef.mapId)) {
        throw new Error(`${relativePath} has invalid visualMapRef.mapId '${record.visualMapRef.mapId}' on record ${recordId}`);
      }
      if (!Number.isInteger(record.visualMapRef.pixelX) || record.visualMapRef.pixelX < 0) {
        throw new Error(`${relativePath} has invalid visualMapRef.pixelX on record ${recordId}`);
      }
      if (!Number.isInteger(record.visualMapRef.pixelY) || record.visualMapRef.pixelY < 0) {
        throw new Error(`${relativePath} has invalid visualMapRef.pixelY on record ${recordId}`);
      }
      ensureString(relativePath, recordId, "visualMapRef.climateZoneId", record.visualMapRef.climateZoneId);
      ensureString(relativePath, recordId, "visualMapRef.biomeZoneId", record.visualMapRef.biomeZoneId);
    }
  }
}

function validateWorldHexes(relativePath, records) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (!/^world_hex\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid world hex id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate world hex id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "slug", record.slug);
    if (!SLUG_PATTERN.test(record.slug)) {
      throw new Error(`${relativePath} has invalid slug '${record.slug}' on record ${recordId}`);
    }
    if (seenSlugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate slug '${record.slug}' on record ${recordId}`);
    }
    seenSlugs.add(record.slug);

    ensureString(relativePath, recordId, "regionId", record.regionId);
    ensureString(relativePath, recordId, "localityBandId", record.localityBandId);
    ensureString(relativePath, recordId, "biomeFamily", record.biomeFamily);
    ensureString(relativePath, recordId, "elevationBand", record.elevationBand);
    ensureString(relativePath, recordId, "terrainType", record.terrainType);
    ensureSetMembership(relativePath, recordId, "freshwaterType", record.freshwaterType, WORLD_HEX_FRESHWATER_TYPES);
    ensureInteger(relativePath, recordId, "habitabilityScore", record.habitabilityScore, 0);
    if (record.habitabilityScore > 100) {
      throw new Error(`${relativePath} has habitabilityScore above 100 on record ${recordId}`);
    }
    if (!isObject(record.frictionByMode)) {
      throw new Error(`${relativePath} has invalid frictionByMode on record ${recordId}`);
    }
    for (const field of ["foot", "horseback", "pack_animal", "wagon", "river_craft", "sea_vessel"]) {
      ensureNumber(relativePath, recordId, `frictionByMode.${field}`, record.frictionByMode[field], 0.1);
    }
    ensureStringArray(relativePath, recordId, "barrierTags", record.barrierTags, 0);
    ensureStringArray(relativePath, recordId, "hazardTags", record.hazardTags, 0);
    ensureStringArray(relativePath, recordId, "resourceAffinityTags", record.resourceAffinityTags, 0);
    ensureStringArray(relativePath, recordId, "anchoredSettlementIds", record.anchoredSettlementIds, 0);
  }
}

function validateWorldHexEdges(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (!/^world_hex_edge\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid world hex edge id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate world hex edge id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "fromHexId", record.fromHexId);
    ensureString(relativePath, recordId, "toHexId", record.toHexId);
    if (record.fromHexId === record.toHexId) {
      throw new Error(`${relativePath} edge '${record.id}' must not point to the same hex`);
    }
    ensureSetMembership(relativePath, recordId, "edgeType", record.edgeType, WORLD_HEX_EDGE_TYPES);
    ensureInteger(relativePath, recordId, "hexSpan", record.hexSpan, 1);
    ensureSetMembership(relativePath, recordId, "routeQuality", record.routeQuality, WORLD_ROUTE_QUALITIES);
    ensureNumber(relativePath, recordId, "crossingDifficulty", record.crossingDifficulty, 0.1);
    ensureStringArray(relativePath, recordId, "barrierTags", record.barrierTags, 0);
    ensureStringArray(relativePath, recordId, "allowedTravelModes", record.allowedTravelModes, 1);
    ensureString(relativePath, recordId, "directionFrom", record.directionFrom);
    ensureString(relativePath, recordId, "directionTo", record.directionTo);
    ensureString(relativePath, recordId, "corridorName", record.corridorName);
    if (record.terrainTags !== undefined) {
      ensureStringArray(relativePath, recordId, "terrainTags", record.terrainTags, 1);
    }
    if (record.featureTags !== undefined) {
      ensureStringArray(relativePath, recordId, "featureTags", record.featureTags, 0);
    }
  }
}

function validateTransportProfiles(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    if (seenIds.has(recordId)) {
      throw new Error(`${relativePath} has duplicate record id ${recordId}`);
    }
    seenIds.add(recordId);

    const harnessIds = new Set((record.harnessProfiles ?? []).map((entry) => entry.id));
    const animalIds = new Set((record.animalProfiles ?? []).map((entry) => entry.id));

    for (const harness of record.harnessProfiles ?? []) {
      ensureString(relativePath, recordId, `harnessProfiles.${harness.id}.name`, harness.name);
      ensureNumber(relativePath, recordId, `harnessProfiles.${harness.id}.efficiencyModifier`, harness.efficiencyModifier, 0.01);
      for (const animalId of harness.compatibleAnimalIds ?? []) {
        if (!animalIds.has(animalId)) {
          throw new Error(`${relativePath} harness '${harness.id}' references missing compatibleAnimalId '${animalId}' on record ${recordId}`);
        }
      }
    }

    for (const animal of record.animalProfiles ?? []) {
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.pullStrength`, animal.pullStrength, 0.01);
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.packCapacityUnits`, animal.packCapacityUnits, 0.01);
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.speedModifier`, animal.speedModifier, 0.01);
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.enduranceHours`, animal.enduranceHours, 0.01);
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.inclineHandling`, animal.inclineHandling, 0.01);
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.sprintFactor`, animal.sprintFactor, 0.01);
      ensureNumber(relativePath, recordId, `animalProfiles.${animal.id}.diminishingExponent`, animal.diminishingExponent, 0.01);
      for (const harnessId of animal.compatibleHarnessIds ?? []) {
        if (!harnessIds.has(harnessId)) {
          throw new Error(`${relativePath} animal '${animal.id}' references missing compatibleHarnessId '${harnessId}' on record ${recordId}`);
        }
      }
    }

    for (const vehicle of record.vehicleProfiles ?? []) {
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.cargoCapacityUnits`, vehicle.cargoCapacityUnits, 0.01);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.baseWeightUnits`, vehicle.baseWeightUnits, 0.01);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.crewRequired`, vehicle.crewRequired, 1);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.baseEnduranceHours`, vehicle.baseEnduranceHours, 0.01);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.restDaysPerFatigueCycle`, vehicle.restDaysPerFatigueCycle, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.speedModifier`, vehicle.speedModifier, 0.01);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.maxAnimals`, vehicle.maxAnimals, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.optimalAnimals`, vehicle.optimalAnimals, 0);
      ensureSetMembership(
        relativePath,
        recordId,
        `vehicleProfiles.${vehicle.id}.propulsionType`,
        vehicle.propulsionType,
        TRANSPORT_PROPULSION_TYPES
      );
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.minimumRoadTier`, vehicle.minimumRoadTier, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.minimumWaterTier`, vehicle.minimumWaterTier, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.minimumHarborTier`, vehicle.minimumHarborTier, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.minimumMarketTier`, vehicle.minimumMarketTier, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.minimumFillRatio`, vehicle.minimumFillRatio, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.loadingDays`, vehicle.loadingDays, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.unloadingDays`, vehicle.unloadingDays, 0);
      ensureNumber(relativePath, recordId, `vehicleProfiles.${vehicle.id}.routeScaleCost`, vehicle.routeScaleCost, 0.1);
      if (vehicle.optimalAnimals > vehicle.maxAnimals) {
        throw new Error(`${relativePath} vehicle '${vehicle.id}' has optimalAnimals above maxAnimals on record ${recordId}`);
      }
      if (vehicle.transportType === "ship") {
        if (vehicle.requiredHarnessId !== null) {
          throw new Error(`${relativePath} ship vehicle '${vehicle.id}' cannot require a harness on record ${recordId}`);
        }
        if (vehicle.maxAnimals !== 0) {
          throw new Error(`${relativePath} ship vehicle '${vehicle.id}' cannot support draft animals on record ${recordId}`);
        }
        if (vehicle.propulsionType !== "crew") {
          throw new Error(`${relativePath} ship vehicle '${vehicle.id}' must use crew propulsion on record ${recordId}`);
        }
      }
      if (vehicle.transportType === "vehicle" && vehicle.propulsionType === "crew") {
        throw new Error(`${relativePath} land vehicle '${vehicle.id}' cannot use crew propulsion on record ${recordId}`);
      }
      if (vehicle.propulsionType === "human") {
        if (vehicle.requiredHarnessId !== null || vehicle.maxAnimals !== 0 || vehicle.optimalAnimals !== 0) {
          throw new Error(`${relativePath} human-powered vehicle '${vehicle.id}' cannot require harnessed animals on record ${recordId}`);
        }
      }
      if ((vehicle.propulsionType === "draft_animals" || vehicle.propulsionType === "pack_train") && vehicle.requiredHarnessId === null) {
        throw new Error(`${relativePath} animal-powered vehicle '${vehicle.id}' must declare a requiredHarnessId on record ${recordId}`);
      }
      if (vehicle.requiredHarnessId !== null && !harnessIds.has(vehicle.requiredHarnessId)) {
        throw new Error(`${relativePath} vehicle '${vehicle.id}' references missing requiredHarnessId '${vehicle.requiredHarnessId}' on record ${recordId}`);
      }
    }
  }
}

function validateTravelNetworks(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (!/^travel_network\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid travel network id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate travel network id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    if (record.mapId !== undefined) {
      ensureString(relativePath, recordId, "mapId", record.mapId);
      if (!/^world_map\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.mapId)) {
        throw new Error(`${relativePath} has invalid mapId '${record.mapId}' on record ${recordId}`);
      }
    }
    ensureString(relativePath, recordId, "summary", record.summary);

    if (!Array.isArray(record.modeProfiles) || record.modeProfiles.length === 0) {
      throw new Error(`${relativePath} has invalid modeProfiles on record ${recordId}`);
    }
    const modeIds = new Set();
    for (const [index, mode] of record.modeProfiles.entries()) {
      const field = `modeProfiles[${index}]`;
      if (!isObject(mode)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, mode.id);
      if (!/^travel_mode\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(mode.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${mode.id}' on record ${recordId}`);
      }
      if (modeIds.has(mode.id)) {
        throw new Error(`${relativePath} has duplicate ${field}.id '${mode.id}' on record ${recordId}`);
      }
      modeIds.add(mode.id);
      ensureString(relativePath, recordId, `${field}.name`, mode.name);
      ensureSetMembership(relativePath, recordId, `${field}.domain`, mode.domain, TRAVEL_MODE_DOMAINS);
      ensureNumber(relativePath, recordId, `${field}.baseMilesPerDay`, mode.baseMilesPerDay, 0.01);
      ensureString(relativePath, recordId, `${field}.notes`, mode.notes);
    }

    if (!Array.isArray(record.travelBenchmarks) || record.travelBenchmarks.length === 0) {
      throw new Error(`${relativePath} has invalid travelBenchmarks on record ${recordId}`);
    }
    const seenBenchmarkModes = new Set();
    for (const [index, benchmark] of record.travelBenchmarks.entries()) {
      const field = `travelBenchmarks[${index}]`;
      if (!isObject(benchmark)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.modeId`, benchmark.modeId);
      if (!modeIds.has(benchmark.modeId)) {
        throw new Error(`${relativePath} references unknown ${field}.modeId '${benchmark.modeId}' on record ${recordId}`);
      }
      if (seenBenchmarkModes.has(benchmark.modeId)) {
        throw new Error(`${relativePath} has duplicate ${field}.modeId '${benchmark.modeId}' on record ${recordId}`);
      }
      seenBenchmarkModes.add(benchmark.modeId);
      ensureString(relativePath, recordId, `${field}.summary`, benchmark.summary);
      if (!Array.isArray(benchmark.examples) || benchmark.examples.length === 0) {
        throw new Error(`${relativePath} has invalid ${field}.examples on record ${recordId}`);
      }
      for (const [exampleIndex, example] of benchmark.examples.entries()) {
        const exampleField = `${field}.examples[${exampleIndex}]`;
        if (!isObject(example)) {
          throw new Error(`${relativePath} has invalid ${exampleField} on record ${recordId}`);
        }
        ensureNumber(relativePath, recordId, `${exampleField}.distanceKilometers`, example.distanceKilometers, 0.01);
        ensureNumber(relativePath, recordId, `${exampleField}.distanceMiles`, example.distanceMiles, 0.01);
        ensureNumber(relativePath, recordId, `${exampleField}.expectedDaysMin`, example.expectedDaysMin, 0.01);
        ensureNumber(relativePath, recordId, `${exampleField}.expectedDaysMax`, example.expectedDaysMax, example.expectedDaysMin);
        const expectedDistanceMiles = example.distanceKilometers * 0.621371;
        if (Math.abs(expectedDistanceMiles - example.distanceMiles) > 1) {
          throw new Error(`${relativePath} ${exampleField}.distanceMiles must match distanceKilometers conversion on record ${recordId}`);
        }
        if (example.expectedDaysMax < example.expectedDaysMin) {
          throw new Error(`${relativePath} ${exampleField}.expectedDaysMax must be >= expectedDaysMin on record ${recordId}`);
        }
      }
    }

    const validateVarianceRules = (rules, fieldPrefix) => {
      if (!Array.isArray(rules) || rules.length === 0) {
        throw new Error(`${relativePath} has invalid ${fieldPrefix} on record ${recordId}`);
      }
      const seenTags = new Set();
      for (const [index, rule] of rules.entries()) {
        const field = `${fieldPrefix}[${index}]`;
        if (!isObject(rule)) {
          throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
        }
        ensureString(relativePath, recordId, `${field}.tag`, rule.tag);
        if (!SLUG_PATTERN.test(rule.tag)) {
          throw new Error(`${relativePath} has invalid ${field}.tag '${rule.tag}' on record ${recordId}`);
        }
        if (seenTags.has(rule.tag)) {
          throw new Error(`${relativePath} has duplicate ${field}.tag '${rule.tag}' on record ${recordId}`);
        }
        seenTags.add(rule.tag);
        ensureString(relativePath, recordId, `${field}.name`, rule.name);
        ensureString(relativePath, recordId, `${field}.summary`, rule.summary);
        if (!Array.isArray(rule.modeEffects) || rule.modeEffects.length === 0) {
          throw new Error(`${relativePath} has invalid ${field}.modeEffects on record ${recordId}`);
        }
        const seenEffectModes = new Set();
        for (const [effectIndex, effect] of rule.modeEffects.entries()) {
          const effectField = `${field}.modeEffects[${effectIndex}]`;
          if (!isObject(effect)) {
            throw new Error(`${relativePath} has invalid ${effectField} on record ${recordId}`);
          }
          ensureString(relativePath, recordId, `${effectField}.modeId`, effect.modeId);
          if (!modeIds.has(effect.modeId)) {
            throw new Error(`${relativePath} references unknown ${effectField}.modeId '${effect.modeId}' on record ${recordId}`);
          }
          if (seenEffectModes.has(effect.modeId)) {
            throw new Error(`${relativePath} has duplicate ${effectField}.modeId '${effect.modeId}' on record ${recordId}`);
          }
          seenEffectModes.add(effect.modeId);
          ensureNumber(relativePath, recordId, `${effectField}.speedMultiplier`, effect.speedMultiplier, 0.01);
          ensureNumber(relativePath, recordId, `${effectField}.variancePercent`, effect.variancePercent, 0);
        }
      }
    };

    validateVarianceRules(record.terrainVarianceRules, "terrainVarianceRules");
    validateVarianceRules(record.featureVarianceRules, "featureVarianceRules");

    const validateTimeArray = (timeEstimates, availableModeIds, fieldPrefix) => {
      if (!Array.isArray(timeEstimates) || timeEstimates.length === 0) {
        throw new Error(`${relativePath} has invalid ${fieldPrefix}.travelTimeEstimates on record ${recordId}`);
      }
      const seenModeIds = new Set();
      for (const [index, estimate] of timeEstimates.entries()) {
        const timeField = `${fieldPrefix}.travelTimeEstimates[${index}]`;
        if (!isObject(estimate)) {
          throw new Error(`${relativePath} has invalid ${timeField} on record ${recordId}`);
        }
        ensureString(relativePath, recordId, `${timeField}.modeId`, estimate.modeId);
        if (!modeIds.has(estimate.modeId)) {
          throw new Error(`${relativePath} references unknown ${timeField}.modeId '${estimate.modeId}' on record ${recordId}`);
        }
        if (!availableModeIds.includes(estimate.modeId)) {
          throw new Error(`${relativePath} ${timeField}.modeId '${estimate.modeId}' must appear in availableModeIds on record ${recordId}`);
        }
        if (seenModeIds.has(estimate.modeId)) {
          throw new Error(`${relativePath} has duplicate ${timeField}.modeId '${estimate.modeId}' on record ${recordId}`);
        }
        seenModeIds.add(estimate.modeId);
        ensureNumber(relativePath, recordId, `${timeField}.expectedDays`, estimate.expectedDays, 0.01);
        ensureNumber(relativePath, recordId, `${timeField}.varianceDays`, estimate.varianceDays, 0);
      }
    };

    if (!Array.isArray(record.routeRecords) || record.routeRecords.length === 0) {
      throw new Error(`${relativePath} has invalid routeRecords on record ${recordId}`);
    }
    const seenRouteIds = new Set();
    const validatePathGeometry = (points, segments, fieldPrefix) => {
      if (points === undefined && segments === undefined) {
        return;
      }
      if (!Array.isArray(points) || points.length < 2) {
        throw new Error(`${relativePath} has invalid ${fieldPrefix}.pathPoints on record ${recordId}`);
      }
      for (const [pointIndex, point] of points.entries()) {
        const pointField = `${fieldPrefix}.pathPoints[${pointIndex}]`;
        if (!isPixelPoint(point)) {
          throw new Error(`${relativePath} has invalid ${pointField} on record ${recordId}`);
        }
      }
      if (!Array.isArray(segments) || segments.length === 0) {
        throw new Error(`${relativePath} has invalid ${fieldPrefix}.pathSegments on record ${recordId}`);
      }
      for (const [segmentIndex, segment] of segments.entries()) {
        const segmentField = `${fieldPrefix}.pathSegments[${segmentIndex}]`;
        if (!isObject(segment)) {
          throw new Error(`${relativePath} has invalid ${segmentField} on record ${recordId}`);
        }
        ensureNumber(relativePath, recordId, `${segmentField}.fromPointIndex`, segment.fromPointIndex, 0);
        ensureNumber(relativePath, recordId, `${segmentField}.toPointIndex`, segment.toPointIndex, 1);
        if (!Number.isInteger(segment.fromPointIndex) || !Number.isInteger(segment.toPointIndex)) {
          throw new Error(`${relativePath} ${segmentField} indexes must be integers on record ${recordId}`);
        }
        if (segment.fromPointIndex < 0 || segment.toPointIndex >= points.length || segment.toPointIndex <= segment.fromPointIndex) {
          throw new Error(`${relativePath} has out-of-range ${segmentField} indexes on record ${recordId}`);
        }
        ensureString(relativePath, recordId, `${segmentField}.terrainTag`, segment.terrainTag);
        if (!SLUG_PATTERN.test(segment.terrainTag)) {
          throw new Error(`${relativePath} has invalid ${segmentField}.terrainTag '${segment.terrainTag}' on record ${recordId}`);
        }
        ensureStringArray(relativePath, recordId, `${segmentField}.featureTags`, segment.featureTags, 0);
        for (const featureTag of segment.featureTags) {
          if (!SLUG_PATTERN.test(featureTag)) {
            throw new Error(`${relativePath} has invalid ${segmentField}.featureTags value '${featureTag}' on record ${recordId}`);
          }
        }
      }
    };
    for (const [index, route] of record.routeRecords.entries()) {
      const field = `routeRecords[${index}]`;
      if (!isObject(route)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, route.id);
      if (!/^route\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(route.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${route.id}' on record ${recordId}`);
      }
      if (seenRouteIds.has(route.id)) {
        throw new Error(`${relativePath} has duplicate ${field}.id '${route.id}' on record ${recordId}`);
      }
      seenRouteIds.add(route.id);
      ensureString(relativePath, recordId, `${field}.name`, route.name);
      ensureString(relativePath, recordId, `${field}.fromSettlementId`, route.fromSettlementId);
      ensureString(relativePath, recordId, `${field}.toSettlementId`, route.toSettlementId);
      ensureSetMembership(relativePath, recordId, `${field}.routeClass`, route.routeClass, TRAVEL_ROUTE_CLASSES);
      ensureNumber(relativePath, recordId, `${field}.distanceMiles`, route.distanceMiles, 1);
      if (route.pathPoints !== undefined || route.pathSegments !== undefined) {
        validatePathGeometry(route.pathPoints, route.pathSegments, field);
      }
      ensureStringArray(relativePath, recordId, `${field}.terrainTags`, route.terrainTags, 1);
      ensureStringArray(relativePath, recordId, `${field}.featureTags`, route.featureTags, 0);
      ensureStringArray(relativePath, recordId, `${field}.availableModeIds`, route.availableModeIds, 1);
      for (const modeId of route.availableModeIds) {
        if (!modeIds.has(modeId)) {
          throw new Error(`${relativePath} references unknown ${field}.availableModeIds value '${modeId}' on record ${recordId}`);
        }
      }
      validateTimeArray(route.travelTimeEstimates, route.availableModeIds, field);
      ensureString(relativePath, recordId, `${field}.notes`, route.notes);
      if (route.fromSettlementId === route.toSettlementId) {
        throw new Error(`${relativePath} route ${route.id} must not connect a settlement to itself on record ${recordId}`);
      }
    }

    if (!Array.isArray(record.interPortShipRoutes) || record.interPortShipRoutes.length === 0) {
      throw new Error(`${relativePath} has invalid interPortShipRoutes on record ${recordId}`);
    }
    const seenLaneIds = new Set();
    for (const [index, lane] of record.interPortShipRoutes.entries()) {
      const field = `interPortShipRoutes[${index}]`;
      if (!isObject(lane)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, lane.id);
      if (!/^lane\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(lane.id)) {
        throw new Error(`${relativePath} has invalid ${field}.id '${lane.id}' on record ${recordId}`);
      }
      if (seenLaneIds.has(lane.id)) {
        throw new Error(`${relativePath} has duplicate ${field}.id '${lane.id}' on record ${recordId}`);
      }
      seenLaneIds.add(lane.id);
      ensureString(relativePath, recordId, `${field}.name`, lane.name);
      ensureString(relativePath, recordId, `${field}.fromSettlementId`, lane.fromSettlementId);
      ensureString(relativePath, recordId, `${field}.toSettlementId`, lane.toSettlementId);
      ensureNumber(relativePath, recordId, `${field}.distanceMiles`, lane.distanceMiles, 1);
      ensureStringArray(relativePath, recordId, `${field}.seaRegionIds`, lane.seaRegionIds, 1);
      if (lane.pathPoints !== undefined || lane.pathSegments !== undefined) {
        validatePathGeometry(lane.pathPoints, lane.pathSegments, field);
      }
      ensureStringArray(relativePath, recordId, `${field}.terrainTags`, lane.terrainTags, 1);
      ensureStringArray(relativePath, recordId, `${field}.featureTags`, lane.featureTags, 0);
      ensureStringArray(relativePath, recordId, `${field}.availableModeIds`, lane.availableModeIds, 1);
      for (const modeId of lane.availableModeIds) {
        if (!modeIds.has(modeId)) {
          throw new Error(`${relativePath} references unknown ${field}.availableModeIds value '${modeId}' on record ${recordId}`);
        }
      }
      validateTimeArray(lane.travelTimeEstimates, lane.availableModeIds, field);
      ensureString(relativePath, recordId, `${field}.notes`, lane.notes);
      if (lane.fromSettlementId === lane.toSettlementId) {
        throw new Error(`${relativePath} maritime lane ${lane.id} must not connect a settlement to itself on record ${recordId}`);
      }
    }
  }
}

function validateWorldMapFeatures(relativePath, records) {
  const seenIds = new Set();
  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (!/^world_map_feature\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.id)) {
      throw new Error(`${relativePath} has invalid world map feature id '${record.id}' on record ${recordId}`);
    }
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate world map feature id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "mapId", record.mapId);
    if (!/^world_map\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(record.mapId)) {
      throw new Error(`${relativePath} has invalid mapId '${record.mapId}' on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureNumber(relativePath, recordId, "referenceImageWidthPx", record.referenceImageWidthPx, 1);
    ensureNumber(relativePath, recordId, "referenceImageHeightPx", record.referenceImageHeightPx, 1);

    const validateFeaturePoints = (feature, field, minPoints) => {
      if (!Array.isArray(feature.points) || feature.points.length < minPoints) {
        throw new Error(`${relativePath} has invalid ${field}.points on record ${recordId}`);
      }
      for (const [pointIndex, point] of feature.points.entries()) {
        if (!isPixelPoint(point)) {
          throw new Error(`${relativePath} has invalid ${field}.points[${pointIndex}] on record ${recordId}`);
        }
      }
    };

    const validateLineSet = (entries, field, minPoints = 2) => {
      if (!Array.isArray(entries) || entries.length === 0) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      const seenFeatureIds = new Set();
      for (const [index, feature] of entries.entries()) {
        const featureField = `${field}[${index}]`;
        if (!isObject(feature)) {
          throw new Error(`${relativePath} has invalid ${featureField} on record ${recordId}`);
        }
        ensureString(relativePath, recordId, `${featureField}.id`, feature.id);
        if (seenFeatureIds.has(feature.id)) {
          throw new Error(`${relativePath} has duplicate ${featureField}.id '${feature.id}' on record ${recordId}`);
        }
        seenFeatureIds.add(feature.id);
        ensureString(relativePath, recordId, `${featureField}.name`, feature.name);
        ensureStringArray(relativePath, recordId, `${featureField}.regionIds`, feature.regionIds, 1);
        ensureString(relativePath, recordId, `${featureField}.notes`, feature.notes);
        validateFeaturePoints(feature, featureField, minPoints);
      }
    };

    if (!Array.isArray(record.sourceLayers) || record.sourceLayers.length < 1) {
      throw new Error(`${relativePath} has invalid sourceLayers on record ${recordId}`);
    }
    validateLineSet(record.regionFootprints, "regionFootprints", 3);
    validateLineSet(record.coastlines, "coastlines", 2);
    validateLineSet(record.riverFeatures, "riverFeatures", 2);
    validateLineSet(record.mountainFeatures, "mountainFeatures", 2);
    validateLineSet(record.climateZones, "climateZones", 3);
    validateLineSet(record.biomeZones, "biomeZones", 3);

    if (!Array.isArray(record.passFeatures) || record.passFeatures.length === 0) {
      throw new Error(`${relativePath} has invalid passFeatures on record ${recordId}`);
    }
    for (const [index, feature] of record.passFeatures.entries()) {
      const field = `passFeatures[${index}]`;
      if (!isObject(feature)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, feature.id);
      ensureString(relativePath, recordId, `${field}.name`, feature.name);
      ensureStringArray(relativePath, recordId, `${field}.regionIds`, feature.regionIds, 1);
      ensureString(relativePath, recordId, `${field}.notes`, feature.notes);
      if (!isPixelPoint(feature.point)) {
        throw new Error(`${relativePath} has invalid ${field}.point on record ${recordId}`);
      }
    }

    if (!Array.isArray(record.crossingFeatures) || record.crossingFeatures.length === 0) {
      throw new Error(`${relativePath} has invalid crossingFeatures on record ${recordId}`);
    }
    for (const [index, feature] of record.crossingFeatures.entries()) {
      const field = `crossingFeatures[${index}]`;
      if (!isObject(feature)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.id`, feature.id);
      ensureString(relativePath, recordId, `${field}.name`, feature.name);
      ensureStringArray(relativePath, recordId, `${field}.regionIds`, feature.regionIds, 1);
      ensureString(relativePath, recordId, `${field}.notes`, feature.notes);
      if (!isPixelPoint(feature.point)) {
        throw new Error(`${relativePath} has invalid ${field}.point on record ${recordId}`);
      }
      ensureSetMembership(relativePath, recordId, `${field}.crossingType`, feature.crossingType, new Set(["bridge", "ferry", "ford", "strait", "lock"]));
    }
  }
}

function validatePlayerAttributes(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate player attribute id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "shortCode", record.shortCode);
    ensureString(relativePath, recordId, "category", record.category);
    ensureFiniteNumber(relativePath, recordId, "default", record.default);
    ensureString(relativePath, recordId, "description", record.description);
    ensureStringArray(relativePath, recordId, "derivedStats", record.derivedStats ?? [], 0);
    ensureStringArray(relativePath, recordId, "skillAffinities", record.skillAffinities ?? [], 0);

    if (record.resourceInfluence !== undefined) {
      if (!isObject(record.resourceInfluence)) {
        throw new Error(`${relativePath} has invalid resourceInfluence on record ${recordId}`);
      }
      for (const resourceId of ["hp", "mp", "stamina"]) {
        if (record.resourceInfluence[resourceId] === undefined) {
          continue;
        }
        if (!isObject(record.resourceInfluence[resourceId])) {
          throw new Error(`${relativePath} has invalid resourceInfluence.${resourceId} on record ${recordId}`);
        }
      }
    }
  }
}

function validatePlayerSkills(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate player skill id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "category", record.category, PLAYER_SKILL_CATEGORIES);
    ensureString(relativePath, recordId, "domain", record.domain);
    if (record.parentSkillId !== null && record.parentSkillId !== undefined) {
      ensureString(relativePath, recordId, "parentSkillId", record.parentSkillId);
    }
    ensureString(relativePath, recordId, "description", record.description);
    if (!isObject(record.leveling)) {
      throw new Error(`${relativePath} has invalid leveling on record ${recordId}`);
    }
    ensureInteger(relativePath, recordId, "leveling.defaultRank", record.leveling.defaultRank, 1);
    ensureInteger(relativePath, recordId, "leveling.maximumRank", record.leveling.maximumRank, 1);
    if (record.leveling.maximumRank > 125) {
      throw new Error(`${relativePath} has leveling.maximumRank above 125 on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "governingAttributes", record.governingAttributes, 1);
    ensureString(relativePath, recordId, "progressionTrackId", record.progressionTrackId);
    if (!isObject(record.combatHooks)) {
      throw new Error(`${relativePath} has invalid combatHooks on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "combatHooks.skillEffectIds", record.combatHooks.skillEffectIds ?? [], 0);
    ensureStringArray(relativePath, recordId, "combatHooks.actionGrantTags", record.combatHooks.actionGrantTags ?? [], 0);
    ensureStringArray(relativePath, recordId, "combatHooks.tacticalTags", record.combatHooks.tacticalTags ?? [], 0);
    ensureStringArray(relativePath, recordId, "combatHooks.titleModifierTags", record.combatHooks.titleModifierTags ?? [], 0);
    ensureStringArray(relativePath, recordId, "combatHooks.spellTags", record.combatHooks.spellTags ?? [], 0);
    ensureStringArray(relativePath, recordId, "combatHooks.resolutionHooks", record.combatHooks.resolutionHooks ?? [], 0);
    ensureStringArray(relativePath, recordId, "itemHookTags", record.itemHookTags ?? [], 0);
    if (record.knowledgeDomainId !== undefined) {
      ensureString(relativePath, recordId, "knowledgeDomainId", record.knowledgeDomainId);
    }
    if (record.milestoneTitleTrackId !== undefined) {
      ensureString(relativePath, recordId, "milestoneTitleTrackId", record.milestoneTitleTrackId);
    }
  }
}

function validatePlayerAbilities(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate player ability id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "category", record.category, PLAYER_ABILITY_CATEGORIES);
    ensureString(relativePath, recordId, "description", record.description);

    if (!isObject(record.activation)) {
      throw new Error(`${relativePath} has invalid activation on record ${recordId}`);
    }
    ensureSetMembership(relativePath, recordId, "activation.type", record.activation.type, new Set(["active", "reaction", "passive"]));
    ensureString(relativePath, recordId, "activation.actionType", record.activation.actionType);
    ensureString(relativePath, recordId, "activation.timing", record.activation.timing);
    ensureInteger(relativePath, recordId, "activation.executionTimeTicks", record.activation.executionTimeTicks, 0);
    ensureInteger(relativePath, recordId, "activation.recoveryTimeTicks", record.activation.recoveryTimeTicks, 0);
    if (!isObject(record.activation.costs)) {
      throw new Error(`${relativePath} has invalid activation.costs on record ${recordId}`);
    }

    if (!isObject(record.requirements)) {
      throw new Error(`${relativePath} has invalid requirements on record ${recordId}`);
    }
    for (const field of ["skillRanks", "attributes", "equipmentTagsAny", "handlingTagsAny", "targetConditionsAny"]) {
      if (!Array.isArray(record.requirements[field])) {
        throw new Error(`${relativePath} requirements must define ${field} array on record ${recordId}`);
      }
    }
    if (!isObject(record.targetProfile)) {
      throw new Error(`${relativePath} has invalid targetProfile on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "governingSkillIds", record.governingSkillIds ?? [], 1);
    ensureStringArray(relativePath, recordId, "governingAttributeIds", record.governingAttributeIds ?? [], 0);
    ensureStringArray(relativePath, recordId, "effectChannels", record.effectChannels ?? [], 1);
    assertSupportedCombatEffectChannels({
      channels: record.effectChannels ?? [],
      source: `${relativePath} effectChannels on record ${recordId}`
    });
    ensureStringArray(relativePath, recordId, "combatTags", record.combatTags ?? [], 1);
    ensureStringArray(relativePath, recordId, "resolutionHooks", record.resolutionHooks ?? [], 1);
    assertSupportedCombatResolutionHooks({
      hooks: record.resolutionHooks ?? [],
      source: `${relativePath} resolutionHooks on record ${recordId}`
    });
  }
}

function validatePlayerSpells(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate player spell id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "school", record.school, PLAYER_SPELL_SCHOOLS);
    ensureString(relativePath, recordId, "governingSkillId", record.governingSkillId);
    ensureStringArray(relativePath, recordId, "governingAttributes", record.governingAttributes ?? [], 0);
    ensureString(relativePath, recordId, "description", record.description);
    ensureStringArray(relativePath, recordId, "effectTags", record.effectTags, 1);
    ensureStringArray(relativePath, recordId, "scalingChannels", record.scalingChannels, 1);
    for (const channel of record.scalingChannels) {
      ensureSetMembership(relativePath, recordId, "scalingChannels", channel, PLAYER_SPELL_SCALING_CHANNELS);
      if (!PLAYER_SPELL_SCALING_CHANNELS_BY_SCHOOL[record.school].has(channel)) {
        throw new Error(`${relativePath} has invalid scaling channel '${channel}' for school '${record.school}' on record ${recordId}`);
      }
    }
    if (!isObject(record.targetProfile)) {
      throw new Error(`${relativePath} has invalid targetProfile on record ${recordId}`);
    }
    if (!isObject(record.castProfile)) {
      throw new Error(`${relativePath} has invalid castProfile on record ${recordId}`);
    }
    ensureStringArray(relativePath, recordId, "resolutionHooks", record.resolutionHooks ?? [], 1);
    assertKnownSpellResolutionHooks({
      hooks: record.resolutionHooks ?? [],
      source: `${relativePath} resolutionHooks on record ${recordId}`
    });
    if (record.itemGenerationHooks !== undefined) {
      if (!Array.isArray(record.itemGenerationHooks)) {
        throw new Error(`${relativePath} has invalid itemGenerationHooks on record ${recordId}`);
      }
      for (const [index, hook] of record.itemGenerationHooks.entries()) {
        const field = `itemGenerationHooks[${index}]`;
        if (!isObject(hook)) {
          throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
        }
        ensureString(relativePath, recordId, `${field}.generatedItemId`, hook.generatedItemId);
        ensureString(relativePath, recordId, `${field}.generatedItemName`, hook.generatedItemName);
        ensureInteger(relativePath, recordId, `${field}.charges`, hook.charges, 1);
        ensureBoolean(relativePath, recordId, `${field}.partyLimited`, hook.partyLimited);
        ensureBoolean(relativePath, recordId, `${field}.dissipatesOnChargeLoss`, hook.dissipatesOnChargeLoss);
        ensureStringArray(relativePath, recordId, `${field}.combatTags`, hook.combatTags ?? [], 0);
      }
      assertKnownSpellItemGenerationHooks({
        hooks: record.itemGenerationHooks,
        source: `${relativePath} itemGenerationHooks on record ${recordId}`
      });
    }
  }
}

function validatePlayerTraits(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate player trait id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "family", record.family);
    ensureString(relativePath, recordId, "sourceType", record.sourceType);
    ensureInteger(relativePath, recordId, "tier", record.tier, 1);
    ensureString(relativePath, recordId, "description", record.description);
    ensureString(relativePath, recordId, "stackingRule", record.stackingRule);
    if (!Array.isArray(record.unlockRules) || record.unlockRules.length === 0) {
      throw new Error(`${relativePath} has empty unlockRules on record ${recordId}`);
    }
    if (!Array.isArray(record.modifiers) || record.modifiers.length === 0) {
      throw new Error(`${relativePath} has empty modifiers on record ${recordId}`);
    }
  }
}

const PLAYER_BACKSTORY_STARTING_ABILITY_ALLOWLIST = new Map([
  ["backstory.village_hunter", new Set(["ability.ranged.quick_shot"])],
  ["backstory.military_brat", new Set(["ability.command.hold_formation"])]
]);

function validatePlayerAttributeAdjustments(relativePath, recordId, field, value) {
  if (value === undefined || value === null) {
    return;
  }

  if (!isObject(value)) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }

  const keys = Object.keys(value);
  if (keys.length > 3) {
    throw new Error(`${relativePath} ${field} touches more than 3 attributes on record ${recordId}`);
  }

  let total = 0;
  for (const key of keys) {
    if (!PLAYER_ATTRIBUTE_KEYS.has(key)) {
      throw new Error(`${relativePath} ${field}.${key} is not a valid player attribute on record ${recordId}`);
    }
    ensureInteger(relativePath, recordId, `${field}.${key}`, value[key], -2);
    if (Math.abs(value[key]) > 2) {
      throw new Error(`${relativePath} ${field}.${key} must stay within +/-2 on record ${recordId}`);
    }
    total += value[key];
  }

  if (total !== 0) {
    throw new Error(`${relativePath} ${field} must be zero-sum on record ${recordId}`);
  }
}

function validatePlayerBackstories(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate backstory id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "summary", record.summary);
    ensureString(relativePath, recordId, "description", record.description);
    validatePlayerAttributeAdjustments(relativePath, recordId, "attributeAdjustments", record.attributeAdjustments);
    if (!Array.isArray(record.startingSkills) || record.startingSkills.length === 0) {
      throw new Error(`${relativePath} has empty startingSkills on record ${recordId}`);
    }
    if (record.startingSkills.length > PLAYER_BACKSTORY_MAX_STARTING_SKILL_COUNT) {
      throw new Error(`${relativePath} has too many startingSkills on record ${recordId}`);
    }
    const seenStartingSkillIds = new Set();
    for (const [index, startingSkill] of record.startingSkills.entries()) {
      const field = `startingSkills[${index}]`;
      if (!isObject(startingSkill)) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${field}.skillId`, startingSkill.skillId);
      if (seenStartingSkillIds.has(startingSkill.skillId)) {
        throw new Error(`${relativePath} has duplicate starting skill '${startingSkill.skillId}' on record ${recordId}`);
      }
      seenStartingSkillIds.add(startingSkill.skillId);
      ensureInteger(relativePath, recordId, `${field}.level`, startingSkill.level, 1);
      if (startingSkill.level >= PLAYER_STARTER_SKILL_ABSOLUTE_CAP) {
        throw new Error(`${relativePath} ${field}.level must stay below first breakthrough rank ${PLAYER_STARTER_SKILL_ABSOLUTE_CAP} on record ${recordId}`);
      }
      if (startingSkill.level > PLAYER_STARTER_SKILL_DEFAULT_CAP) {
        throw new Error(`${relativePath} ${field}.level must be <= ${PLAYER_STARTER_SKILL_DEFAULT_CAP} on record ${recordId}`);
      }
    }
    if (record.startingAbilityIds !== undefined && (!Array.isArray(record.startingAbilityIds) || record.startingAbilityIds.length > 1)) {
      throw new Error(`${relativePath} startingAbilityIds must contain at most one id on record ${recordId}`);
    }
    const allowedAbilityIds =
      PLAYER_BACKSTORY_STARTING_ABILITY_ALLOWLIST.get(record.id) ?? new Set();
    for (const abilityId of record.startingAbilityIds ?? []) {
      if (!allowedAbilityIds.has(abilityId)) {
        throw new Error(`${relativePath} startingAbilityIds '${abilityId}' is not allowed on record ${recordId}`);
      }
    }
  }
}

function validatePlayerStartingBundles(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate starting bundle id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "summary", record.summary);

    const hasFixedItems = Array.isArray(record.fixedItems) && record.fixedItems.length > 0;
    const hasChoiceGroups = Array.isArray(record.choiceGroups) && record.choiceGroups.length > 0;
    const hasCurrency = isObject(record.startingCurrency);

    if (!hasFixedItems && !hasChoiceGroups && !hasCurrency) {
      throw new Error(`${relativePath} must define fixedItems, choiceGroups, or startingCurrency on record ${recordId}`);
    }

    const seenGroupIds = new Set();
    for (const group of record.choiceGroups ?? []) {
      ensureString(relativePath, recordId, "choiceGroups.id", group.id);
      ensureString(relativePath, recordId, "choiceGroups.label", group.label);
      if (seenGroupIds.has(group.id)) {
        throw new Error(`${relativePath} has duplicate choice group id '${group.id}' on record ${recordId}`);
      }
      seenGroupIds.add(group.id);

      const seenOptionItemIds = new Set();
      for (const option of group.options ?? []) {
        if (seenOptionItemIds.has(option.itemId)) {
          throw new Error(`${relativePath} choice group '${group.id}' repeats item '${option.itemId}' on record ${recordId}`);
        }
        seenOptionItemIds.add(option.itemId);
      }
    }
  }
}

function validateProgressionTracks(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate progression track id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureSetMembership(relativePath, recordId, "trackType", record.trackType, PLAYER_PROGRESS_TRACK_TYPES);
    if (!isObject(record.rankRange)) {
      throw new Error(`${relativePath} has invalid rankRange on record ${recordId}`);
    }
    ensureInteger(relativePath, recordId, "rankRange.min", record.rankRange.min, 1);
    ensureInteger(relativePath, recordId, "rankRange.max", record.rankRange.max, 1);
    if (!Array.isArray(record.bands) || record.bands.length !== 5) {
      throw new Error(`${relativePath} must define exactly five bands on record ${recordId}`);
    }
    ensureIntegerArray(relativePath, recordId, "breakthroughGateRanks", record.breakthroughGateRanks, 1);
    if (!isObject(record.gainModel)) {
      throw new Error(`${relativePath} has invalid gainModel on record ${recordId}`);
    }
    if (!isObject(record.breakthroughSources)) {
      throw new Error(`${relativePath} has invalid breakthroughSources on record ${recordId}`);
    }
  }
}

function validateKnowledgeDomains(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate knowledge track id '${record.id}'`);
    }
    seenIds.add(record.id);

    for (const field of ["knowledgeSkillId", "spottingSkillId", "identifySkillId", "generalSupportSkillId"]) {
      if (record[field] !== undefined) {
        ensureString(relativePath, recordId, field, record[field]);
      }
    }
    for (const field of ["supportWeights", "identifyDifficulty", "autoIdentifyThresholds"]) {
      if (!isObject(record[field])) {
        throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
      }
    }
  }
}

function validateSkillEffects(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate skill effect id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "skillId", record.skillId);
    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "family", record.family);
    if (!Array.isArray(record.channels) || record.channels.length === 0) {
      throw new Error(`${relativePath} has empty channels on record ${recordId}`);
    }
    for (const [index, channel] of record.channels.entries()) {
      if (!isObject(channel)) {
        throw new Error(`${relativePath} has invalid channels[${index}] on record ${recordId}`);
      }
      if (channel.actionType !== undefined) {
        ensureString(relativePath, recordId, `channels[${index}].actionType`, channel.actionType);
      }
      ensureString(relativePath, recordId, `channels[${index}].effectChannel`, channel.effectChannel);
      assertSupportedCombatEffectChannels({
        channels: [channel.effectChannel],
        source: `${relativePath} channels[${index}].effectChannel on record ${recordId}`
      });
      ensureStringArray(relativePath, recordId, `channels[${index}].resolutionHooks`, channel.resolutionHooks ?? [], 0);
      assertSupportedCombatResolutionHooks({
        hooks: channel.resolutionHooks ?? [],
        source: `${relativePath} channels[${index}].resolutionHooks on record ${recordId}`
      });
      if (!isObject(channel.scaling)) {
        throw new Error(`${relativePath} has invalid channels[${index}].scaling on record ${recordId}`);
      }
    }
  }
}

function validateTrials(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate trial id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureString(relativePath, recordId, "associatedSkillId", record.associatedSkillId);
    ensureFiniteNumber(relativePath, recordId, "thresholdToPass", record.thresholdToPass);
    ensureFiniteNumber(relativePath, recordId, "progress", record.progress);
    ensureFiniteNumber(relativePath, recordId, "maxPotential", record.maxPotential);
    if (!Array.isArray(record.checkpoints) || record.checkpoints.length === 0) {
      throw new Error(`${relativePath} has empty checkpoints on record ${recordId}`);
    }
    if (!Array.isArray(record.rewards) || !Array.isArray(record.penalties)) {
      throw new Error(`${relativePath} must define rewards and penalties arrays on record ${recordId}`);
    }
    if (record.echoRequirement !== undefined && record.echoRequirement !== null) {
      validateEchoRequirement(relativePath, recordId, "echoRequirement", record.echoRequirement);
    }
  }
}

function validateEchoRequirement(relativePath, recordId, field, value) {
  if (!isObject(value)) {
    throw new Error(`${relativePath} has invalid ${field} on record ${recordId}`);
  }

  ensureInteger(relativePath, recordId, `${field}.minLevel`, value.minLevel, 0);

  if (value.minEchoAdjusted !== undefined && value.minEchoAdjusted !== null) {
    ensureFiniteNumber(relativePath, recordId, `${field}.minEchoAdjusted`, value.minEchoAdjusted);
    if (value.minEchoAdjusted < 0) {
      throw new Error(`${relativePath} has invalid ${field}.minEchoAdjusted on record ${recordId}`);
    }
  }
}

function validateEchoBalanceGlobalRule(relativePath, recordId, value) {
  if (!isObject(value)) {
    throw new Error(`${relativePath} has invalid value on record ${recordId}`);
  }

  ensureInteger(relativePath, recordId, "value.version", value.version, 1);
  ensureNumber(relativePath, recordId, "value.levelScale", value.levelScale, Number.EPSILON);

  if (!isObject(value.exponents) || !isObject(value.weights) || !isObject(value.normalization) || !isObject(value.diversity)) {
    throw new Error(`${relativePath} has incomplete echo balance blocks on record ${recordId}`);
  }

  ensureNumber(relativePath, recordId, "value.exponents.skill", value.exponents.skill, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.exponents.stat", value.exponents.stat, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.exponents.knowledge", value.exponents.knowledge, Number.EPSILON);

  ensureNumber(relativePath, recordId, "value.weights.skills", value.weights.skills, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.weights.stats", value.weights.stats, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.weights.knowledge", value.weights.knowledge, Number.EPSILON);
  ensureApproxEqual(
    relativePath,
    recordId,
    "value.weights",
    value.weights.skills + value.weights.stats + value.weights.knowledge,
    1
  );

  ensureNumber(relativePath, recordId, "value.normalization.skillReferenceRank", value.normalization.skillReferenceRank, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.normalization.skillReferenceSlots", value.normalization.skillReferenceSlots, Number.EPSILON);
  ensureNumber(
    relativePath,
    recordId,
    "value.normalization.knowledgeSkillReferenceRank",
    value.normalization.knowledgeSkillReferenceRank,
    Number.EPSILON
  );
  ensureNumber(
    relativePath,
    recordId,
    "value.normalization.knowledgeSkillReferenceSlots",
    value.normalization.knowledgeSkillReferenceSlots,
    Number.EPSILON
  );
  ensureNumber(relativePath, recordId, "value.normalization.statReferenceDelta", value.normalization.statReferenceDelta, Number.EPSILON);

  if (!Array.isArray(value.normalization.trackedAttributeKeys) || value.normalization.trackedAttributeKeys.length === 0) {
    throw new Error(`${relativePath} has empty value.normalization.trackedAttributeKeys on record ${recordId}`);
  }

  const seenAttributeKeys = new Set();
  for (const attributeKey of value.normalization.trackedAttributeKeys) {
    if (!PLAYER_ATTRIBUTE_KEYS.has(attributeKey)) {
      throw new Error(`${relativePath} has invalid value.normalization.trackedAttributeKeys entry '${attributeKey}' on record ${recordId}`);
    }
    if (seenAttributeKeys.has(attributeKey)) {
      throw new Error(`${relativePath} has duplicate value.normalization.trackedAttributeKeys entry '${attributeKey}' on record ${recordId}`);
    }
    seenAttributeKeys.add(attributeKey);
  }

  ensureNumber(relativePath, recordId, "value.diversity.thresholdRank", value.diversity.thresholdRank, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.diversity.bonusPerSkill", value.diversity.bonusPerSkill, 0);
  ensureNumber(relativePath, recordId, "value.diversity.maxMultiplier", value.diversity.maxMultiplier, 1);
}

function validateBodyStateBalanceGlobalRule(relativePath, recordId, value) {
  if (!isObject(value)) {
    throw new Error(`${relativePath} has invalid body-state balance value on record ${recordId}`);
  }

  if (!isObject(value.targets) || !isObject(value.energy) || !isObject(value.hydration) || !isObject(value.fatigue) || !isObject(value.intoxication) || !isObject(value.starvation) || !isObject(value.recovery)) {
    throw new Error(`${relativePath} body-state balance is missing one or more required blocks on record ${recordId}`);
  }

  ensureNumber(relativePath, recordId, "value.targets.dailyCalories", value.targets.dailyCalories, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.targets.dailyHydration", value.targets.dailyHydration, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.targets.proteinBaseline", value.targets.proteinBaseline, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.targets.proteinLoadScale", value.targets.proteinLoadScale, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.energy.quickWeight", value.energy.quickWeight, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.energy.storedWeight", value.energy.storedWeight, Number.EPSILON);
  ensureApproxEqual(
    relativePath,
    recordId,
    "value.energy.weights",
    value.energy.quickWeight + value.energy.storedWeight,
    1
  );
  ensureNumber(relativePath, recordId, "value.hydration.passiveLossPerTick", value.hydration.passiveLossPerTick, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.fatigue.carryoverThreshold", value.fatigue.carryoverThreshold, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.intoxication.decayPerTick", value.intoxication.decayPerTick, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.starvation.dailyRecoveryWhenCovered", value.starvation.dailyRecoveryWhenCovered, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.starvation.maxDeficitDays", value.starvation.maxDeficitDays, Number.EPSILON);
  for (const field of ["none", "basic", "proper", "secure_indoor"]) {
    ensureNumber(relativePath, recordId, `value.recovery.campMultipliers.${field}`, value.recovery.campMultipliers?.[field], Number.EPSILON);
  }
  for (const field of ["unsafe", "exposed", "stable", "secure"]) {
    ensureNumber(relativePath, recordId, `value.recovery.safetyMultipliers.${field}`, value.recovery.safetyMultipliers?.[field], Number.EPSILON);
  }
}

function validateStatGrowthBalanceGlobalRule(relativePath, recordId, value) {
  if (!isObject(value)) {
    throw new Error(`${relativePath} has invalid stat growth balance value on record ${recordId}`);
  }

  ensureInteger(relativePath, recordId, "value.version", value.version, 1);

  for (const field of ["low", "moderate", "high", "extreme"]) {
    ensureNumber(relativePath, recordId, `value.intensityMultipliers.${field}`, value.intensityMultipliers?.[field], Number.EPSILON);
  }

  for (const attributeKey of PLAYER_ATTRIBUTE_KEYS) {
    const threshold = value.thresholds?.[attributeKey];
    if (!isObject(threshold)) {
      throw new Error(`${relativePath} is missing value.thresholds.${attributeKey} on record ${recordId}`);
    }
    ensureNumber(relativePath, recordId, `value.thresholds.${attributeKey}.loadThreshold`, threshold.loadThreshold, Number.EPSILON);
    ensureNumber(relativePath, recordId, `value.thresholds.${attributeKey}.progressPerPoint`, threshold.progressPerPoint, Number.EPSILON);
    ensureNumber(relativePath, recordId, `value.thresholds.${attributeKey}.dailySoftCap`, threshold.dailySoftCap, Number.EPSILON);
    ensureNumber(relativePath, recordId, `value.thresholds.${attributeKey}.growthScale`, threshold.growthScale, Number.EPSILON);
    ensureNumber(relativePath, recordId, `value.thresholds.${attributeKey}.growthExponent`, threshold.growthExponent, Number.EPSILON);
  }

  ensureNumber(relativePath, recordId, "value.saturation.startMultiplier", value.saturation?.startMultiplier, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.saturation.hardCapMultiplier", value.saturation?.hardCapMultiplier, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.saturation.exponent", value.saturation?.exponent, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.recoveryCapacity.base", value.recoveryCapacity?.base, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.recoveryCapacity.constitutionWeight", value.recoveryCapacity?.constitutionWeight, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.recoveryCapacity.vitalityWeight", value.recoveryCapacity?.vitalityWeight, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.recoveryCapacity.wisdomWeight", value.recoveryCapacity?.wisdomWeight, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.recoveryCapacity.spiritWeight", value.recoveryCapacity?.spiritWeight, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.diminishing.trivialCutoff", value.diminishing?.trivialCutoff, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.diminishing.dailyExponent", value.diminishing?.dailyExponent, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.diminishing.varietyBonusPerSource", value.diminishing?.varietyBonusPerSource, 0);
  ensureNumber(relativePath, recordId, "value.diminishing.maxVarietyBonus", value.diminishing?.maxVarietyBonus, 0);
  ensureNumber(relativePath, recordId, "value.diminishing.loadDecayWithoutRecovery", value.diminishing?.loadDecayWithoutRecovery, 0);
  ensureNumber(relativePath, recordId, "value.diminishing.postRecoveryRetention", value.diminishing?.postRecoveryRetention, 0);
  ensureNumber(relativePath, recordId, "value.rng.minimum", value.rng?.minimum, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.rng.maximum", value.rng?.maximum, Number.EPSILON);
  if (value.rng.minimum > value.rng.maximum) {
    throw new Error(`${relativePath} value.rng.minimum must not exceed value.rng.maximum on record ${recordId}`);
  }
  ensureNumber(relativePath, recordId, "value.tension.threshold", value.tension?.threshold, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.gapStart", value.tension?.gapStart, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.precisionCap", value.tension?.precisionCap, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.precisionPerGap", value.tension?.precisionPerGap, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.mobilityCap", value.tension?.mobilityCap, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.mobilityPerGap", value.tension?.mobilityPerGap, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.stabilityCap", value.tension?.stabilityCap, Number.EPSILON);
  ensureNumber(relativePath, recordId, "value.tension.stabilityPerGap", value.tension?.stabilityPerGap, Number.EPSILON);
}

function validateConsumableProfiles(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate consumable profile id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureNumber(relativePath, recordId, "calories", record.calories, 0);
    ensureNumber(relativePath, recordId, "protein", record.protein, 0);
    ensureNumber(relativePath, recordId, "carbs", record.carbs, 0);
    ensureNumber(relativePath, recordId, "fat", record.fat, 0);
    if (record.hydration !== undefined) {
      ensureNumber(relativePath, recordId, "hydration", record.hydration, 0);
    }
    if (record.intoxication !== undefined) {
      ensureNumber(relativePath, recordId, "intoxication", record.intoxication, 0);
    }
    if (record.useVerb !== undefined) {
      ensureString(relativePath, recordId, "useVerb", record.useVerb);
    }
  }
}

function validateGlobalRules(relativePath, records) {
  const seenIds = new Set();
  let hasEchoBalanceRule = false;
  let hasBodyStateBalanceRule = false;
  let hasStatGrowthBalanceRule = false;

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate global rule id '${record.id}'`);
    }
    seenIds.add(record.id);

    if (!("value" in record)) {
      throw new Error(`${relativePath} is missing value on record ${recordId}`);
    }

    if (record.id === "rule.echo_balance") {
      hasEchoBalanceRule = true;
      validateEchoBalanceGlobalRule(relativePath, recordId, record.value);
      continue;
    }

    if (record.id === "rule.body_state_balance") {
      hasBodyStateBalanceRule = true;
      validateBodyStateBalanceGlobalRule(relativePath, recordId, record.value);
      continue;
    }

    if (record.id === "rule.stat_growth_balance") {
      hasStatGrowthBalanceRule = true;
      validateStatGrowthBalanceGlobalRule(relativePath, recordId, record.value);
      continue;
    }

    if (record.id === "rule.enchanter_profession") {
      if (!isObject(record.value)) {
        throw new Error(`${relativePath} has invalid value on record ${recordId}`);
      }
      ensureString(relativePath, recordId, "value.professionId", record.value.professionId);
      validateEchoRequirement(relativePath, recordId, "value.echoRequirement", record.value.echoRequirement);
      continue;
    }

    if (isObject(record.value) && record.value.echoRequirement !== undefined && record.value.echoRequirement !== null) {
      validateEchoRequirement(relativePath, recordId, "value.echoRequirement", record.value.echoRequirement);
    }
  }

  if (!hasEchoBalanceRule) {
    throw new Error(`${relativePath} is missing required global rule 'rule.echo_balance'`);
  }
  if (!hasBodyStateBalanceRule) {
    throw new Error(`${relativePath} is missing required global rule 'rule.body_state_balance'`);
  }
  if (!hasStatGrowthBalanceRule) {
    throw new Error(`${relativePath} is missing required global rule 'rule.stat_growth_balance'`);
  }
}

function validateTitles(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate title id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "name", record.name);
    ensureSetMembership(relativePath, recordId, "family", record.family, PLAYER_TITLE_FAMILIES);
    ensureString(relativePath, recordId, "trackId", record.trackId);
    if (record.sourceSkillId !== undefined && record.sourceSkillId !== null) {
      ensureString(relativePath, recordId, "sourceSkillId", record.sourceSkillId);
    }
    if (!isObject(record.milestone)) {
      throw new Error(`${relativePath} has invalid milestone on record ${recordId}`);
    }
    ensureInteger(relativePath, recordId, "milestone.threshold", record.milestone.threshold, 50);
    ensureString(relativePath, recordId, "description", record.description);
    ensureStringArray(relativePath, recordId, "effects", record.effects ?? [], 1);
    ensureStringArray(relativePath, recordId, "tags", record.tags ?? [], 1);
  }
}

function ensureOptionalLegacyUnlockEnum(relativePath, recordId, field, value, allowed) {
  if (value !== undefined) {
    ensureSetMembership(relativePath, recordId, field, value, allowed);
  }
}

function validateLegacyUnlockEffectArray(relativePath, recordId, field, value) {
  if (!Array.isArray(value)) {
    throw new Error(`${relativePath} has non-array ${field} on record ${recordId}`);
  }

  for (const effect of value) {
    if (!isObject(effect)) {
      throw new Error(`${relativePath} has invalid ${field} entry on record ${recordId}`);
    }

    ensureSetMembership(relativePath, recordId, `${field}.type`, effect.type, LEGACY_UNLOCK_EFFECT_KINDS);
    ensureString(relativePath, recordId, `${field}.key`, effect.key);
    if (
      effect.value !== undefined &&
      typeof effect.value !== "string" &&
      typeof effect.value !== "number" &&
      typeof effect.value !== "boolean"
    ) {
      throw new Error(`${relativePath} has invalid ${field}.value on record ${recordId}`);
    }
  }
}

function validateLegacyUnlockBreakthroughRanks(relativePath, recordId, record) {
  if (!Array.isArray(record.breakthroughRanks)) {
    throw new Error(`${relativePath} has non-array breakthroughRanks on record ${recordId}`);
  }

  if (
    record.maxRank !== undefined &&
    (!Number.isInteger(record.maxRank) || record.maxRank <= 0)
  ) {
    throw new Error(`${relativePath} has invalid maxRank for breakthroughRanks on record ${recordId}`);
  }

  let previousRank = 0;
  for (const rank of record.breakthroughRanks) {
    if (!Number.isInteger(rank) || rank <= 0) {
      throw new Error(`${relativePath} has invalid breakthroughRanks entry on record ${recordId}`);
    }
    if (rank <= previousRank) {
      throw new Error(`${relativePath} has duplicate or unsorted breakthroughRanks on record ${recordId}`);
    }
    if (record.maxRank !== undefined && rank > record.maxRank) {
      throw new Error(`${relativePath} has breakthroughRanks entry above maxRank on record ${recordId}`);
    }
    previousRank = rank;
  }
}

function validateLegacyUnlockCatalog(relativePath, records) {
  const seenIds = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";
    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate legacy unlock id '${record.id}'`);
    }
    seenIds.add(record.id);

    if (record.track !== undefined) {
      ensureString(relativePath, recordId, "track", record.track);
      if (!LEGACY_UNLOCK_METADATA_IDENTIFIER_PATTERN.test(record.track)) {
        throw new Error(`${relativePath} has invalid track '${record.track}' on record ${recordId}`);
      }
    }

    ensureOptionalLegacyUnlockEnum(
      relativePath,
      recordId,
      "purchaseMode",
      record.purchaseMode,
      LEGACY_UNLOCK_PURCHASE_MODES
    );
    ensureOptionalLegacyUnlockEnum(
      relativePath,
      recordId,
      "currency",
      record.currency,
      LEGACY_UNLOCK_CURRENCIES
    );
    ensureOptionalLegacyUnlockEnum(
      relativePath,
      recordId,
      "scope",
      record.scope,
      LEGACY_UNLOCK_SCOPES
    );
    ensureOptionalLegacyUnlockEnum(
      relativePath,
      recordId,
      "duration",
      record.duration,
      LEGACY_UNLOCK_DURATIONS
    );
    ensureOptionalLegacyUnlockEnum(
      relativePath,
      recordId,
      "implementationPriority",
      record.implementationPriority,
      LEGACY_UNLOCK_IMPLEMENTATION_PRIORITIES
    );

    if (record.breakthroughRanks !== undefined) {
      validateLegacyUnlockBreakthroughRanks(relativePath, recordId, record);
    }
    if (record.breakthroughEffect !== undefined) {
      validateLegacyUnlockEffectArray(
        relativePath,
        recordId,
        "breakthroughEffect",
        record.breakthroughEffect
      );
    }
    if (record.repeatable !== undefined) {
      ensureBoolean(relativePath, recordId, "repeatable", record.repeatable);
    }
  }
}

function validateRecords(relativePath, parsed, check) {
  if (!Array.isArray(parsed.records)) {
    throw new Error(`${relativePath} has non-array records`);
  }

  const seenSlugs = new Set();

  for (const record of parsed.records) {
    if (check.requireSlug) {
      if (typeof record.slug !== "string" || !SLUG_PATTERN.test(record.slug)) {
        throw new Error(`${relativePath} has invalid slug on record ${record.id ?? "<unknown>"}`);
      }

      if (seenSlugs.has(record.slug)) {
        throw new Error(`${relativePath} has duplicate slug ${record.slug}`);
      }

      seenSlugs.add(record.slug);
    }

    if (check.forbidGeoQualifierInName && typeof record.name === "string" && GEO_QUALIFIER_PATTERN.test(record.name)) {
      throw new Error(`${relativePath} has geo-qualified name '${record.name}' on record ${record.id ?? "<unknown>"}`);
    }
  }

  if (check.validateWorkplaces) {
    validateWorkplaces(relativePath, parsed.records);
  }
  if (check.validateWorkplaceAbstractions) {
    validateWorkplaceAbstractions(relativePath, parsed.records);
  }
  if (check.validateBuildings) {
    validateBuildings(relativePath, parsed.records);
  }
  if (check.validateInfrastructure) {
    validateInfrastructure(relativePath, parsed.records);
  }
  if (check.validateItemCatalog) {
    validateItemCatalog(relativePath, parsed.records);
  }
  if (check.validateMarketItemValues) {
    validateMarketItemValues(relativePath, parsed.records);
  }
  if (check.validatePlayerAttributes) {
    validatePlayerAttributes(relativePath, parsed.records);
  }
  if (check.validatePlayerSkills) {
    validatePlayerSkills(relativePath, parsed.records);
  }
  if (check.validatePlayerAbilities) {
    validatePlayerAbilities(relativePath, parsed.records);
  }
  if (check.validatePlayerSpells) {
    validatePlayerSpells(relativePath, parsed.records);
  }
  if (check.validatePlayerTraits) {
    validatePlayerTraits(relativePath, parsed.records);
  }
  if (check.validatePlayerBackstories) {
    validatePlayerBackstories(relativePath, parsed.records);
  }
  if (check.validatePlayerStartingBundles) {
    validatePlayerStartingBundles(relativePath, parsed.records);
  }
  if (check.validateProgressionTracks) {
    validateProgressionTracks(relativePath, parsed.records);
  }
  if (check.validateKnowledgeDomains) {
    validateKnowledgeDomains(relativePath, parsed.records);
  }
  if (check.validateGlobalRules) {
    validateGlobalRules(relativePath, parsed.records);
  }
  if (check.validateConsumableProfiles) {
    validateConsumableProfiles(relativePath, parsed.records);
  }
  if (check.validateSkillEffects) {
    validateSkillEffects(relativePath, parsed.records);
  }
  if (check.validateTrials) {
    validateTrials(relativePath, parsed.records);
  }
  if (check.validateTitles) {
    validateTitles(relativePath, parsed.records);
  }
  if (check.validateLegacyUnlockCatalog) {
    validateLegacyUnlockCatalog(relativePath, parsed.records);
  }
  if (check.validateCombatRoles) {
    validateCombatRoles(relativePath, parsed.records);
  }
  if (check.validateTacticsPresets) {
    validateTacticsPresets(relativePath, parsed.records);
  }

  if (check.validateFloraTemplate) {
    validateFloraTemplate(relativePath, parsed.records);
  }

  if (check.validateFaunaTemplate) {
    validateFaunaTemplate(relativePath, parsed.records);
  }

  if (check.validateClimateProfiles) {
    validateClimateProfiles(relativePath, parsed.records);
  }
  if (check.validateWorldRegions) {
    validateWorldRegions(relativePath, parsed.records);
  }
  if (check.validateRegionLocalities) {
    validateRegionLocalities(relativePath, parsed.records);
  }
  if (check.validateWorldMaps) {
    validateWorldMaps(relativePath, parsed.records);
  }
  if (check.validateRegionalEcologyProfiles) {
    validateRegionalEcologyProfiles(relativePath, parsed.records);
  }
  if (check.validateReligions) {
    validateReligions(relativePath, parsed.records);
  }
  if (check.validateMagicInfrastructureCatalog) {
    validateMagicInfrastructureCatalog(relativePath, parsed.records);
  }
  if (check.validateCrystalCatalog) {
    validateCrystalCatalog(relativePath, parsed.records);
  }
  if (check.validateGuilds) {
    validateGuilds(relativePath, parsed.records);
  }
  if (check.validateQuestTemplates) {
    validateQuestTemplates(relativePath, parsed.records);
  }
  if (check.validateMonsters) {
    validateMonsters(relativePath, parsed.records);
  }
  if (check.validateEncounterTemplates) {
    validateEncounterTemplates(relativePath, parsed.records);
  }
  if (check.validateSpawnProfiles) {
    validateSpawnProfiles(relativePath, parsed.records);
  }
  if (check.validateSettlements) {
    validateSettlements(relativePath, parsed.records);
  }
  if (check.validateWorldHexes) {
    validateWorldHexes(relativePath, parsed.records);
  }
  if (check.validateWorldHexEdges) {
    validateWorldHexEdges(relativePath, parsed.records);
  }
  if (check.validateTransportProfiles) {
    validateTransportProfiles(relativePath, parsed.records);
  }
  if (check.validateTravelNetworks) {
    validateTravelNetworks(relativePath, parsed.records);
  }
  if (check.validateWorldMapFeatures) {
    validateWorldMapFeatures(relativePath, parsed.records);
  }
}

function validateItemCatalog(relativePath, records) {
  const seenIds = new Set();
  const seenKeys = new Set();
  const seenAliasKeys = new Map();

  for (const record of records) {
    if (typeof record.id !== "string" || record.id.trim().length === 0) {
      throw new Error(`${relativePath} has invalid id on item record`);
    }

    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate item id ${record.id}`);
    }
    seenIds.add(record.id);

    if (typeof record.itemKey !== "string" || !ITEM_KEY_PATTERN.test(record.itemKey)) {
      throw new Error(`${relativePath} has invalid itemKey on record ${record.id}`);
    }

    if (seenKeys.has(record.itemKey)) {
      throw new Error(`${relativePath} has duplicate itemKey ${record.itemKey}`);
    }
    seenKeys.add(record.itemKey);

    for (const key of ["name", "itemClass", "itemBranch", "itemSubBranch", "currencyId", "valueUnit"]) {
      if (typeof record[key] !== "string" || record[key].trim().length === 0) {
        throw new Error(`${relativePath} has invalid ${key} on record ${record.id}`);
      }
    }

    if (typeof record.baseValue !== "number" || Number.isNaN(record.baseValue) || record.baseValue < 0) {
      throw new Error(`${relativePath} has invalid baseValue on record ${record.id}`);
    }

    if (typeof record.marketable !== "boolean") {
      throw new Error(`${relativePath} has invalid marketable flag on record ${record.id}`);
    }

    if (!isObject(record.valueProfile)) {
      throw new Error(`${relativePath} item ${record.id} must define valueProfile`);
    }
    ensureSetMembership(relativePath, record.id, "valueProfile.valueMode", record.valueProfile.valueMode, ITEM_VALUE_MODES);
    ensureSetMembership(
      relativePath,
      record.id,
      "valueProfile.materialCostModel",
      record.valueProfile.materialCostModel,
      ITEM_MATERIAL_COST_MODELS
    );
    ensureSetMembership(
      relativePath,
      record.id,
      "valueProfile.laborIntensity",
      record.valueProfile.laborIntensity,
      ITEM_LABOR_INTENSITIES
    );
    ensureSetMembership(
      relativePath,
      record.id,
      "valueProfile.processingIntensity",
      record.valueProfile.processingIntensity,
      ITEM_PROCESSING_INTENSITIES
    );
    ensureSetMembership(relativePath, record.id, "valueProfile.difficultyTier", record.valueProfile.difficultyTier, ITEM_DIFFICULTY_TIERS);
    ensureSetMembership(relativePath, record.id, "valueProfile.demandBand", record.valueProfile.demandBand, ITEM_DEMAND_BANDS);

    if (record.materialDifficultyProfile !== undefined) {
      if (!isObject(record.materialDifficultyProfile)) {
        throw new Error(`${relativePath} has invalid materialDifficultyProfile on record ${record.id}`);
      }
      ensureSetMembership(
        relativePath,
        record.id,
        "materialDifficultyProfile.family",
        record.materialDifficultyProfile.family,
        ITEM_MATERIAL_FAMILIES
      );
      ensureSetMembership(
        relativePath,
        record.id,
        "materialDifficultyProfile.workability",
        record.materialDifficultyProfile.workability,
        ITEM_WORKABILITY_VALUES
      );
      ensureSetMembership(
        relativePath,
        record.id,
        "materialDifficultyProfile.hardness",
        record.materialDifficultyProfile.hardness,
        ITEM_HARDNESS_VALUES
      );
      ensureSetMembership(
        relativePath,
        record.id,
        "materialDifficultyProfile.refinementDifficulty",
        record.materialDifficultyProfile.refinementDifficulty,
        ITEM_REFINEMENT_DIFFICULTIES
      );
      ensureSetMembership(
        relativePath,
        record.id,
        "materialDifficultyProfile.processingCostImpact",
        record.materialDifficultyProfile.processingCostImpact,
        ITEM_PROCESSING_COST_IMPACTS
      );
    }

    if (record.roles !== undefined) {
      ensureUniqueSlugStrings(relativePath, record.id, "roles", record.roles);
      for (const role of record.roles) {
        ensureSetMembership(relativePath, record.id, "roles", role, ITEM_ROLE_VALUES);
      }
    }

    if (record.tags !== undefined) {
      ensureUniqueSlugStrings(relativePath, record.id, "tags", record.tags);
    }

    if (record.processingGroups !== undefined) {
      ensureUniqueSlugStrings(relativePath, record.id, "processingGroups", record.processingGroups, { allowDotted: true });
    }

    if (record.stage !== undefined) {
      ensureSetMembership(relativePath, record.id, "stage", record.stage, ITEM_STAGE_VALUES);
    }

    if (record.aliasKeys !== undefined) {
      ensureUniqueAliasStrings(relativePath, record.id, "aliasKeys", record.aliasKeys);
      for (const aliasKey of record.aliasKeys) {
        if (aliasKey === record.itemKey) {
          throw new Error(`${relativePath} aliasKey '${aliasKey}' must not repeat itemKey on record ${record.id}`);
        }
        if (seenAliasKeys.has(aliasKey)) {
          throw new Error(`${relativePath} has duplicate aliasKey '${aliasKey}' on records ${seenAliasKeys.get(aliasKey)} and ${record.id}`);
        }
        seenAliasKeys.set(aliasKey, record.id);
      }
    }

    if (record.consumableProfileId !== undefined) {
      ensureString(relativePath, record.id, "consumableProfileId", record.consumableProfileId);
      if (!Array.isArray(record.roles) || !record.roles.includes("consumable")) {
        throw new Error(`${relativePath} consumableProfileId requires consumable role on record ${record.id}`);
      }
    }

    if (record.spoilageProfileId !== undefined) {
      ensureString(relativePath, record.id, "spoilageProfileId", record.spoilageProfileId);
      if (!Array.isArray(record.roles) || (!record.roles.includes("consumable") && !record.roles.includes("ingredient"))) {
        throw new Error(`${relativePath} spoilageProfileId requires consumable or ingredient role on record ${record.id}`);
      }
    }

    if (record.useProfiles !== undefined) {
      if (!Array.isArray(record.useProfiles) || record.useProfiles.length === 0) {
        throw new Error(`${relativePath} has invalid useProfiles on record ${record.id}`);
      }
      for (const [index, profile] of record.useProfiles.entries()) {
        const field = `useProfiles[${index}]`;
        if (!isObject(profile)) {
          throw new Error(`${relativePath} has invalid ${field} on record ${record.id}`);
        }
        ensureString(relativePath, record.id, `${field}.actionType`, profile.actionType);
        ensureString(relativePath, record.id, `${field}.primarySkillId`, profile.primarySkillId);
        ensureStringArray(relativePath, record.id, `${field}.supportSkillIds`, profile.supportSkillIds, 0);
        ensureInteger(relativePath, record.id, `${field}.requiredSkillRank`, profile.requiredSkillRank, 0);
        ensureInteger(relativePath, record.id, `${field}.masteryRank`, profile.masteryRank, 0);
        if (profile.masteryRank > 125) {
          throw new Error(`${relativePath} has ${field}.masteryRank above 125 on record ${record.id}`);
        }
        ensureStringArray(relativePath, record.id, `${field}.effectChannels`, profile.effectChannels, 1);
        assertSupportedCombatEffectChannels({
          channels: profile.effectChannels,
          source: `${relativePath} ${field}.effectChannels on record ${record.id}`,
          allowUtilityOnlyItemChannels: isUtilityOnlyItemUseProfile(profile)
        });
        if (profile.handlingType !== undefined) {
          ensureSetMembership(
            relativePath,
            record.id,
            `${field}.handlingType`,
            profile.handlingType,
            new Set(["weapon", "shield", "armor", "hybrid"])
          );
        }
        if (profile.proficiencySkillId !== undefined) {
          ensureString(relativePath, record.id, `${field}.proficiencySkillId`, profile.proficiencySkillId);
        }
        ensureStringArray(relativePath, record.id, `${field}.hybridSkillIds`, profile.hybridSkillIds ?? [], 0);
        ensureStringArray(relativePath, record.id, `${field}.combatTags`, profile.combatTags ?? [], 0);
        ensureStringArray(relativePath, record.id, `${field}.resolutionHooks`, profile.resolutionHooks ?? [], 0);
        assertSupportedCombatResolutionHooks({
          hooks: profile.resolutionHooks ?? [],
          source: `${relativePath} ${field}.resolutionHooks on record ${record.id}`
        });
        ensureStringArray(relativePath, record.id, `${field}.grantTags`, profile.grantTags ?? [], 0);
      }
    }

  }
}

function validateMarketItemValues(relativePath, records) {
  const seenIds = new Set();
  const seenKeys = new Set();

  for (const record of records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate market id ${record.id}`);
    }
    seenIds.add(record.id);

    if (typeof record.itemKey !== "string" || !isValidMarketItemKey(record.itemKey)) {
      throw new Error(`${relativePath} has invalid itemKey on record ${recordId}`);
    }
    if (seenKeys.has(record.itemKey)) {
      throw new Error(`${relativePath} has duplicate market itemKey ${record.itemKey}`);
    }
    seenKeys.add(record.itemKey);

    for (const key of ["source", "category", "currencyId", "valueUnit"]) {
      ensureString(relativePath, recordId, key, record[key]);
    }

    if (typeof record.baseValue !== "number" || Number.isNaN(record.baseValue) || record.baseValue < 0) {
      throw new Error(`${relativePath} has invalid baseValue on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "marketable", record.marketable);

    if (!isObject(record.pricingProfile)) {
      throw new Error(`${relativePath} market row ${recordId} must define pricingProfile`);
    }
    ensureString(relativePath, recordId, "pricingProfile.pricingMode", record.pricingProfile.pricingMode);
    if (record.pricingProfile.pricingMode !== "derived_snapshot") {
      throw new Error(`${relativePath} has unsupported pricingProfile.pricingMode on record ${recordId}`);
    }
    ensureSetMembership(
      relativePath,
      recordId,
      "pricingProfile.materialCostSource",
      record.pricingProfile.materialCostSource,
      ITEM_MATERIAL_COST_MODELS
    );
    ensureString(relativePath, recordId, "pricingProfile.laborCostSource", record.pricingProfile.laborCostSource);
    if (record.pricingProfile.laborCostSource !== "recipe_skill_time") {
      throw new Error(`${relativePath} has unsupported pricingProfile.laborCostSource on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "pricingProfile.processingCostSource", record.pricingProfile.processingCostSource);
    if (record.pricingProfile.processingCostSource !== "fuel_and_tool_wear") {
      throw new Error(`${relativePath} has unsupported pricingProfile.processingCostSource on record ${recordId}`);
    }
    ensureString(relativePath, recordId, "pricingProfile.difficultySource", record.pricingProfile.difficultySource);
    if (record.pricingProfile.difficultySource !== "material_and_precision") {
      throw new Error(`${relativePath} has unsupported pricingProfile.difficultySource on record ${recordId}`);
    }
    ensureSetMembership(relativePath, recordId, "pricingProfile.demandBand", record.pricingProfile.demandBand, ITEM_DEMAND_BANDS);
  }
}


function validateMeatCutStandards(relativePath, parsed) {
  if (!Array.isArray(parsed.records)) {
    throw new Error(`${relativePath} has non-array records`);
  }

  if (!isObject(parsed.sausageUnitStandard)) {
    throw new Error(`${relativePath} has invalid sausageUnitStandard`);
  }

  const sausageStandard = parsed.sausageUnitStandard;
  ensureString(relativePath, "<sausage>", "sausageUnitStandard.baseUnitItemKey", sausageStandard.baseUnitItemKey);
  if (!ITEM_KEY_PATTERN.test(sausageStandard.baseUnitItemKey)) {
    throw new Error(`${relativePath} has invalid sausageUnitStandard.baseUnitItemKey '${sausageStandard.baseUnitItemKey}'`);
  }

  if (!Array.isArray(sausageStandard.packaging) || sausageStandard.packaging.length < 2) {
    throw new Error(`${relativePath} has invalid sausageUnitStandard.packaging`);
  }

  for (const [index, pack] of sausageStandard.packaging.entries()) {
    const packField = `sausageUnitStandard.packaging[${index}]`;
    if (!isObject(pack)) {
      throw new Error(`${relativePath} has invalid ${packField}`);
    }

    ensureString(relativePath, "<sausage>", `${packField}.itemKey`, pack.itemKey);
    if (!ITEM_KEY_PATTERN.test(pack.itemKey)) {
      throw new Error(`${relativePath} has invalid ${packField}.itemKey '${pack.itemKey}'`);
    }

    ensureInteger(relativePath, "<sausage>", `${packField}.links`, pack.links, 1);
  }

  const seenIds = new Set();
  const seenSpecies = new Set();
  for (const record of parsed.records) {
    const recordId = record.id ?? "<unknown>";

    ensureString(relativePath, recordId, "id", record.id);
    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate id '${record.id}'`);
    }
    seenIds.add(record.id);

    ensureString(relativePath, recordId, "speciesKey", record.speciesKey);
    if (!SLUG_PATTERN.test(record.speciesKey)) {
      throw new Error(`${relativePath} has invalid speciesKey '${record.speciesKey}' on record ${recordId}`);
    }

    if (seenSpecies.has(record.speciesKey)) {
      throw new Error(`${relativePath} has duplicate speciesKey '${record.speciesKey}' on record ${recordId}`);
    }
    seenSpecies.add(record.speciesKey);

    ensureSetMembership(relativePath, recordId, "category", record.category, MEAT_CUT_SPECIES_CATEGORIES);
    ensureString(relativePath, recordId, "sourceItemKey", record.sourceItemKey);
    if (!ITEM_KEY_PATTERN.test(record.sourceItemKey)) {
      throw new Error(`${relativePath} has invalid sourceItemKey '${record.sourceItemKey}' on record ${recordId}`);
    }

    ensureNumber(relativePath, recordId, "usableMeatPerCarcass", record.usableMeatPerCarcass, 0.0001);
    ensureString(relativePath, recordId, "yieldUnit", record.yieldUnit);
    if (!SLUG_PATTERN.test(record.yieldUnit)) {
      throw new Error(`${relativePath} has invalid yieldUnit '${record.yieldUnit}' on record ${recordId}`);
    }

    if (!Array.isArray(record.bulkCuts) || record.bulkCuts.length === 0) {
      throw new Error(`${relativePath} has empty bulkCuts on record ${recordId}`);
    }

    if (!Array.isArray(record.retailCuts) || record.retailCuts.length === 0) {
      throw new Error(`${relativePath} has empty retailCuts on record ${recordId}`);
    }

    if (!Array.isArray(record.byproducts) || record.byproducts.length === 0) {
      throw new Error(`${relativePath} has empty byproducts on record ${recordId}`);
    }

    ensureBoolean(relativePath, recordId, "sausageEligible", record.sausageEligible);

    for (const [index, cut] of record.bulkCuts.entries()) {
      const cutField = `bulkCuts[${index}]`;
      if (!isObject(cut)) {
        throw new Error(`${relativePath} has invalid ${cutField} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${cutField}.itemKey`, cut.itemKey);
      if (!ITEM_KEY_PATTERN.test(cut.itemKey)) {
        throw new Error(`${relativePath} has invalid ${cutField}.itemKey '${cut.itemKey}' on record ${recordId}`);
      }
      ensureInteger(relativePath, recordId, `${cutField}.portionCount`, cut.portionCount, 1);
    }

    for (const [index, cut] of record.retailCuts.entries()) {
      const cutField = `retailCuts[${index}]`;
      if (!isObject(cut)) {
        throw new Error(`${relativePath} has invalid ${cutField} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${cutField}.itemKey`, cut.itemKey);
      if (!ITEM_KEY_PATTERN.test(cut.itemKey)) {
        throw new Error(`${relativePath} has invalid ${cutField}.itemKey '${cut.itemKey}' on record ${recordId}`);
      }
      ensureInteger(relativePath, recordId, `${cutField}.portionCount`, cut.portionCount, 1);
    }

    for (const [index, byproduct] of record.byproducts.entries()) {
      const byproductField = `byproducts[${index}]`;
      if (!isObject(byproduct)) {
        throw new Error(`${relativePath} has invalid ${byproductField} on record ${recordId}`);
      }
      ensureString(relativePath, recordId, `${byproductField}.itemKey`, byproduct.itemKey);
      if (!ITEM_KEY_PATTERN.test(byproduct.itemKey)) {
        throw new Error(`${relativePath} has invalid ${byproductField}.itemKey '${byproduct.itemKey}' on record ${recordId}`);
      }
      ensureNumber(relativePath, recordId, `${byproductField}.quantity`, byproduct.quantity, 0.0001);
      ensureString(relativePath, recordId, `${byproductField}.unit`, byproduct.unit);
      if (!SLUG_PATTERN.test(byproduct.unit)) {
        throw new Error(`${relativePath} has invalid ${byproductField}.unit '${byproduct.unit}' on record ${recordId}`);
      }
    }
  }
}

async function validateFile(check) {
  const fullPath = path.join(ROOT, check.file);
  const raw = await readFile(fullPath, "utf8");
  const parsed = JSON.parse(raw);

  for (const key of check.requiredTopLevel) {
    if (!(key in parsed)) {
      throw new Error(`${check.file} is missing top-level key: ${key}`);
    }
  }

  if (check.validateCalendar) {
    validateCalendarDefinition(check.file, parsed);
    return true;
  }

  validateRecords(check.file, parsed, check);

  if (check.validateHabitatBiomes) {
    await validateHabitatBiomes(check.file, parsed.records);
  }

  if (check.validateProductionChains) {
    await validateProductionChains(check.file, parsed.records);
  }

  if (check.validateMeatCutStandards) {
    validateMeatCutStandards(check.file, parsed);
  }

  return true;
}

async function validateFaunaProductsAgainstMarketKeys() {
  const faunaPath = path.join(ROOT, "packages/content/base/world/fauna.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const faunaParsed = JSON.parse(await readFile(faunaPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (!Array.isArray(faunaParsed.records) || !Array.isArray(marketParsed.records)) {
    throw new Error("content cross-check failed: fauna or market records is not an array");
  }

  const marketKeys = new Set();
  for (const record of marketParsed.records) {
    if (typeof record.itemKey === "string") {
      marketKeys.add(record.itemKey);
    }
  }

  for (const fauna of faunaParsed.records) {
    const recordId = typeof fauna.id === "string" ? fauna.id : "<unknown>";
    const output = fauna?.template?.output;
    if (!isObject(output)) {
      continue;
    }

    for (const fieldName of ["passiveOutput", "slaughterOutput"]) {
      const section = output[fieldName];
      if (!isObject(section) || !isObject(section.products)) {
        continue;
      }

      for (const group of Object.keys(section.products)) {
        const values = section.products[group];
        if (!Array.isArray(values)) {
          continue;
        }

        for (const key of values) {
          if (!marketKeys.has(key)) {
            throw new Error(
              `packages/content/base/world/fauna.json has unknown economy itemKey '${key}' in template.output.${fieldName}.products.${group} on record ${recordId}`
            );
          }
        }
      }
    }
  }
}


async function validateMeatCutStandardsAgainstMarketKeys() {
  const meatPath = path.join(ROOT, "packages/content/base/civilization/meat_cut_standards.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const meatParsed = JSON.parse(await readFile(meatPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (!Array.isArray(meatParsed.records) || !isObject(meatParsed.sausageUnitStandard) || !Array.isArray(marketParsed.records)) {
    throw new Error("content cross-check failed: meat standards or market records are invalid");
  }

  const marketKeys = new Set();
  for (const record of marketParsed.records) {
    if (typeof record.itemKey === "string") {
      marketKeys.add(record.itemKey);
    }
  }

  const ensureMarketKey = (field, key) => {
    if (!marketKeys.has(key)) {
      throw new Error(`packages/content/base/civilization/meat_cut_standards.json ${field} key '${key}' missing in market item values`);
    }
  };

  for (const record of meatParsed.records) {
    const recordId = record.id ?? "<unknown>";

    ensureMarketKey(`sourceItemKey (${recordId})`, record.sourceItemKey);

    for (const cut of record.bulkCuts ?? []) {
      ensureMarketKey(`bulkCuts (${recordId})`, cut.itemKey);
    }

    for (const cut of record.retailCuts ?? []) {
      ensureMarketKey(`retailCuts (${recordId})`, cut.itemKey);
    }

    for (const byproduct of record.byproducts ?? []) {
      ensureMarketKey(`byproducts (${recordId})`, byproduct.itemKey);
    }

    if (!Array.isArray(record.bulkCuts) || record.bulkCuts.length === 0) {
      throw new Error(`packages/content/base/civilization/meat_cut_standards.json record ${recordId} must include at least one bulk cut`);
    }

    if (!Array.isArray(record.retailCuts) || record.retailCuts.length === 0) {
      throw new Error(`packages/content/base/civilization/meat_cut_standards.json record ${recordId} must include at least one retail cut`);
    }
  }

  const sausage = meatParsed.sausageUnitStandard;
  ensureMarketKey("sausageUnitStandard.baseUnitItemKey", sausage.baseUnitItemKey);

  const packagingMap = new Map();
  for (const pack of sausage.packaging ?? []) {
    packagingMap.set(pack.itemKey, pack.links);
    ensureMarketKey("sausageUnitStandard.packaging", pack.itemKey);
  }

  if (sausage.baseUnitItemKey !== "sausage_link") {
    throw new Error("packages/content/base/civilization/meat_cut_standards.json sausage base unit must be sausage_link");
  }

  if (packagingMap.get("sausage_coil") !== 12 || packagingMap.get("sausage_bundle") !== 48) {
    throw new Error("packages/content/base/civilization/meat_cut_standards.json sausage conversion must be 1:12:48 for link/coil/bundle");
  }
}

async function validateFloraOutputsAgainstItemIdentitySpace() {
  const floraPath = path.join(ROOT, "packages/content/base/world/flora.json");
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const floraParsed = JSON.parse(await readFile(floraPath, "utf8"));
  const itemParsed = JSON.parse(await readFile(itemPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (!Array.isArray(floraParsed.records) || !Array.isArray(itemParsed.records) || !Array.isArray(marketParsed.records)) {
    throw new Error("content cross-check failed: flora, items, or market records are invalid");
  }

  const itemKeys = new Set(itemParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));
  const aliasToCanonical = buildItemAliasMap("packages/content/base/items/items.json", itemParsed.records);
  const marketKeys = new Set(marketParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));

  const ensureResolvableOutputKey = (recordId, fieldPath, key) => {
    if (marketKeys.has(key)) {
      return;
    }

    if (itemKeys.has(key)) {
      if (!marketKeys.has(key)) {
        throw new Error(`packages/content/base/world/flora.json ${fieldPath} key '${key}' exists in items but is missing in market item values on record ${recordId}`);
      }
      return;
    }

    const canonicalKey = aliasToCanonical.get(key);
    if (canonicalKey) {
      if (!marketKeys.has(canonicalKey)) {
        throw new Error(
          `packages/content/base/world/flora.json ${fieldPath} key '${key}' resolves to '${canonicalKey}' but that canonical itemKey is missing in market item values on record ${recordId}`
        );
      }
      return;
    }

    const legacyRoleMatch = key.match(LEGACY_ROLE_OUTPUT_PATTERN);
    if (legacyRoleMatch) {
      const normalizedKey = legacyRoleMatch[2];
      if (marketKeys.has(normalizedKey)) {
        return;
      }
      if (itemKeys.has(normalizedKey) && marketKeys.has(normalizedKey)) {
        return;
      }
    }

    throw new Error(`packages/content/base/world/flora.json has unresolved ${fieldPath} key '${key}' on record ${recordId}`);
  };

  for (const flora of floraParsed.records) {
    const recordId = flora.id ?? "<unknown>";
    for (const [fieldPath, block] of [
      ["template.harvest.activeHarvest", flora?.template?.harvest?.activeHarvest],
      ["template.harvest.passiveHarvest", flora?.template?.harvest?.passiveHarvest]
    ]) {
      if (!isObject(block) || !isObject(block.rawOutput) || !isObject(block.rawOutput.processing) || !isObject(block.rawOutput.processing.byProducts)) {
        continue;
      }

      for (const [groupPath, values] of [
        [`${fieldPath}.rawOutput.materials`, block.rawOutput.materials ?? []],
        [`${fieldPath}.rawOutput.ingredients`, block.rawOutput.ingredients ?? []],
        [`${fieldPath}.rawOutput.processing.byProducts.materials`, block.rawOutput.processing.byProducts.materials ?? []],
        [`${fieldPath}.rawOutput.processing.byProducts.ingredients`, block.rawOutput.processing.byProducts.ingredients ?? []]
      ]) {
        for (const key of values) {
          ensureResolvableOutputKey(recordId, groupPath, key);
        }
      }
    }
  }
}

async function validateCanonicalCommodityItemsAgainstMarketKeys() {
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const itemParsed = JSON.parse(await readFile(itemPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (!Array.isArray(itemParsed.records) || !Array.isArray(marketParsed.records)) {
    throw new Error("content cross-check failed: item or market records are invalid");
  }

  const aliasToCanonical = buildItemAliasMap("packages/content/base/items/items.json", itemParsed.records);
  const marketKeys = new Set(marketParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));

  for (const aliasKey of aliasToCanonical.keys()) {
    if (marketKeys.has(aliasKey)) {
      throw new Error(`packages/content/base/items/items.json aliasKey '${aliasKey}' conflicts with an existing market itemKey`);
    }
  }

  for (const record of itemParsed.records) {
    if (record.itemClass === "commodity" && record.marketable && !marketKeys.has(record.itemKey)) {
      throw new Error(
        `packages/content/base/items/items.json commodity itemKey '${record.itemKey}' is marked marketable but missing in market item values`
      );
    }
  }
}

async function validateTierOneCanonicalItemCoverage() {
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");
  const workplacePath = path.join(ROOT, "packages/content/base/civilization/workplaces.json");
  const chainPath = path.join(ROOT, "packages/content/base/civilization/production_chains.json");

  const itemParsed = JSON.parse(await readFile(itemPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));
  const workplaceParsed = JSON.parse(await readFile(workplacePath, "utf8"));
  const chainParsed = JSON.parse(await readFile(chainPath, "utf8"));

  if (
    !Array.isArray(itemParsed.records) ||
    !Array.isArray(marketParsed.records) ||
    !Array.isArray(workplaceParsed.records) ||
    !Array.isArray(chainParsed.records)
  ) {
    throw new Error("content cross-check failed: item, market, workplace, or production chain records are invalid");
  }

  const itemKeys = new Set(itemParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));
  const marketSourceByKey = new Map();
  for (const record of marketParsed.records) {
    if (typeof record.itemKey === "string" && typeof record.source === "string") {
      marketSourceByKey.set(record.itemKey, record.source);
    }
  }

  const ensureCanonicalItemWhenRequired = (relativePath, recordId, fieldName, itemKey) => {
    const source = marketSourceByKey.get(itemKey);
    if (!marketSourceRequiresCanonicalItem(source)) {
      return;
    }

    if (!itemKeys.has(itemKey)) {
      throw new Error(`${relativePath} ${fieldName} key '${itemKey}' is source='${source}' and must exist in packages/content/base/items/items.json on record ${recordId}`);
    }
  };

  for (const record of marketParsed.records) {
    const recordId = record.id ?? "<unknown>";
    if (marketSourceRequiresCanonicalItem(record.source) && !itemKeys.has(record.itemKey)) {
      throw new Error(
        `packages/content/base/civilization/market_item_values.json itemKey '${record.itemKey}' with source '${record.source}' is missing in packages/content/base/items/items.json on record ${recordId}`
      );
    }
  }

  for (const record of chainParsed.records) {
    const recordId = record.id ?? "<unknown>";
    ensureCanonicalItemWhenRequired("packages/content/base/civilization/production_chains.json", recordId, "primaryOutput", record.primaryOutput);
    for (const itemKey of record.byProducts ?? []) {
      ensureCanonicalItemWhenRequired("packages/content/base/civilization/production_chains.json", recordId, "byProducts", itemKey);
    }

    for (const variant of record?.variantConfig?.variants ?? []) {
      const variantId = variant.id ?? "<unknown>";
      ensureCanonicalItemWhenRequired(
        "packages/content/base/civilization/production_chains.json",
        `${recordId}:${variantId}`,
        "variant.primaryOutput",
        variant.primaryOutput
      );
      for (const itemKey of variant.byProducts ?? []) {
        ensureCanonicalItemWhenRequired(
          "packages/content/base/civilization/production_chains.json",
          `${recordId}:${variantId}`,
          "variant.byProducts",
          itemKey
        );
      }
      for (const itemKey of variant.inputItemKeys ?? []) {
        ensureCanonicalItemWhenRequired(
          "packages/content/base/civilization/production_chains.json",
          `${recordId}:${variantId}`,
          "variant.inputItemKeys",
          itemKey
        );
      }
    }

    for (const itemKey of record?.recipeProfile?.externalInputs ?? []) {
      ensureCanonicalItemWhenRequired(
        "packages/content/base/civilization/production_chains.json",
        `${recordId}:recipeProfile`,
        "recipeProfile.externalInputs",
        itemKey
      );
    }
    for (const itemKey of record?.recipeProfile?.intermediateItems ?? []) {
      ensureCanonicalItemWhenRequired(
        "packages/content/base/civilization/production_chains.json",
        `${recordId}:recipeProfile`,
        "recipeProfile.intermediateItems",
        itemKey
      );
    }
    for (const [stepIndex, step] of (record?.recipeProfile?.processingSteps ?? []).entries()) {
      for (const itemKey of step?.inputs ?? []) {
        ensureCanonicalItemWhenRequired(
          "packages/content/base/civilization/production_chains.json",
          `${recordId}:recipeProfile.step[${stepIndex}]`,
          "recipeProfile.processingSteps.inputs",
          itemKey
        );
      }
      for (const itemKey of step?.outputs ?? []) {
        ensureCanonicalItemWhenRequired(
          "packages/content/base/civilization/production_chains.json",
          `${recordId}:recipeProfile.step[${stepIndex}]`,
          "recipeProfile.processingSteps.outputs",
          itemKey
        );
      }
    }
  }

  for (const record of workplaceParsed.records) {
    const recordId = record.id ?? "<unknown>";
    for (const input of record?.ioProfile?.inputs ?? []) {
      ensureCanonicalItemWhenRequired("packages/content/base/civilization/workplaces.json", recordId, "ioProfile.inputs", input.itemKey);
    }
    for (const output of record?.ioProfile?.outputs ?? []) {
      ensureCanonicalItemWhenRequired("packages/content/base/civilization/workplaces.json", recordId, "ioProfile.outputs", output.itemKey);
    }
    for (const [groupIndex, group] of (record?.ioProfile?.yieldGroups ?? []).entries()) {
      for (const output of group?.outputs ?? []) {
        ensureCanonicalItemWhenRequired(
          "packages/content/base/civilization/workplaces.json",
          `${recordId}:yieldGroup[${groupIndex}]`,
          "ioProfile.yieldGroups.outputs",
          output.itemKey
        );
      }
    }
  }
}

async function validateWorkplaceAbstractionSeparation() {
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");
  const workplacePath = path.join(ROOT, "packages/content/base/civilization/workplaces.json");
  const abstractionPath = path.join(ROOT, "packages/content/base/civilization/workplace_abstractions.json");

  const itemParsed = JSON.parse(await readFile(itemPath, "utf8"));
  const workplaceParsed = JSON.parse(await readFile(workplacePath, "utf8"));
  const abstractionParsed = JSON.parse(await readFile(abstractionPath, "utf8"));

  if (!Array.isArray(itemParsed.records) || !Array.isArray(workplaceParsed.records) || !Array.isArray(abstractionParsed.records)) {
    throw new Error("content cross-check failed: item, workplace, or workplace abstraction records are invalid");
  }

  const itemKeys = new Set(itemParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));
  const abstractionKeys = new Set(
    abstractionParsed.records.map((record) => record.abstractionKey).filter((value) => typeof value === "string")
  );

  for (const abstractionKey of abstractionKeys) {
    if (itemKeys.has(abstractionKey)) {
      throw new Error(
        `packages/content/base/civilization/workplace_abstractions.json abstractionKey '${abstractionKey}' conflicts with a canonical item identity`
      );
    }
  }

  for (const record of workplaceParsed.records) {
    const recordId = record.id ?? "<unknown>";

    for (const inputTag of record.inputTags ?? []) {
      if (abstractionKeys.has(inputTag)) {
        throw new Error(`packages/content/base/civilization/workplaces.json inputTags '${inputTag}' must move to siteTags on record ${recordId}`);
      }
      if (!itemKeys.has(inputTag)) {
        throw new Error(`packages/content/base/civilization/workplaces.json inputTags '${inputTag}' missing canonical item on record ${recordId}`);
      }
    }

    for (const outputTag of record.outputTags ?? []) {
      if (abstractionKeys.has(outputTag)) {
        throw new Error(`packages/content/base/civilization/workplaces.json outputTags '${outputTag}' must not use workplace abstractions on record ${recordId}`);
      }
      if (!itemKeys.has(outputTag)) {
        throw new Error(`packages/content/base/civilization/workplaces.json outputTags '${outputTag}' missing canonical item on record ${recordId}`);
      }
    }

    for (const siteTag of record.siteTags ?? []) {
      if (!abstractionKeys.has(siteTag)) {
        throw new Error(`packages/content/base/civilization/workplaces.json siteTags '${siteTag}' missing workplace abstraction on record ${recordId}`);
      }
    }

    for (const input of record?.ioProfile?.inputs ?? []) {
      if (abstractionKeys.has(input.itemKey)) {
        throw new Error(
          `packages/content/base/civilization/workplaces.json ioProfile.inputs itemKey '${input.itemKey}' must move to ioProfile.siteRequirements on record ${recordId}`
        );
      }
      if (!itemKeys.has(input.itemKey)) {
        throw new Error(
          `packages/content/base/civilization/workplaces.json ioProfile.inputs itemKey '${input.itemKey}' missing canonical item on record ${recordId}`
        );
      }
    }

    for (const requirement of record?.ioProfile?.siteRequirements ?? []) {
      if (!abstractionKeys.has(requirement.abstractionKey)) {
        throw new Error(
          `packages/content/base/civilization/workplaces.json ioProfile.siteRequirements abstractionKey '${requirement.abstractionKey}' missing registry entry on record ${recordId}`
        );
      }
    }

    for (const output of [
      ...(record?.ioProfile?.outputs ?? []),
      ...((record?.ioProfile?.yieldGroups ?? []).flatMap((group) => group.outputs ?? []))
    ]) {
      if (abstractionKeys.has(output.itemKey)) {
        throw new Error(`packages/content/base/civilization/workplaces.json output itemKey '${output.itemKey}' must not use workplace abstractions on record ${recordId}`);
      }
      if (!itemKeys.has(output.itemKey)) {
        throw new Error(`packages/content/base/civilization/workplaces.json output itemKey '${output.itemKey}' missing canonical item on record ${recordId}`);
      }
    }

    for (const tier of record?.progressionProfile?.tiers ?? []) {
      for (const laborWeight of tier.inputLaborWeights ?? []) {
        if (abstractionKeys.has(laborWeight.itemKey)) {
          throw new Error(
            `packages/content/base/civilization/workplaces.json progression inputLaborWeights itemKey '${laborWeight.itemKey}' must move to siteLaborWeights on record ${recordId}`
          );
        }
        if (!itemKeys.has(laborWeight.itemKey)) {
          throw new Error(
            `packages/content/base/civilization/workplaces.json progression inputLaborWeights itemKey '${laborWeight.itemKey}' missing canonical item on record ${recordId}`
          );
        }
      }

      for (const laborWeight of tier.siteLaborWeights ?? []) {
        if (!abstractionKeys.has(laborWeight.abstractionKey)) {
          throw new Error(
            `packages/content/base/civilization/workplaces.json progression siteLaborWeights abstractionKey '${laborWeight.abstractionKey}' missing registry entry on record ${recordId}`
          );
        }
      }
    }
  }
}

async function validateInfrastructureAgainstWorkplaces() {
  const infrastructurePath = path.join(ROOT, "packages/content/base/civilization/infrastructure.json");
  const workplacePath = path.join(ROOT, "packages/content/base/civilization/workplaces.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const infrastructureParsed = JSON.parse(await readFile(infrastructurePath, "utf8"));
  const workplaceParsed = JSON.parse(await readFile(workplacePath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (!Array.isArray(infrastructureParsed.records) || !Array.isArray(workplaceParsed.records) || !Array.isArray(marketParsed.records)) {
    throw new Error("content cross-check failed: infrastructure, workplaces, or market records are invalid");
  }

  const marketKeys = new Set();
  for (const record of marketParsed.records) {
    if (typeof record.itemKey === "string") {
      marketKeys.add(record.itemKey);
    }
  }

  let irrigationMaxTier = 0;
  let irrigationRecordCount = 0;

  for (const record of infrastructureParsed.records) {
    const recordId = record.id ?? "<unknown>";

    for (const tierDef of record.progressionProfile?.tiers ?? []) {
      for (const material of tierDef.materialRequirements ?? []) {
        if (!marketKeys.has(material.itemKey)) {
          throw new Error(
            `packages/content/base/civilization/infrastructure.json materialRequirements key '${material.itemKey}' missing in market item values on record ${recordId}`
          );
        }
      }
    }

    if (record.infrastructureType === "irrigation") {
      irrigationRecordCount += 1;
      irrigationMaxTier = Math.max(irrigationMaxTier, record.progressionProfile?.maxTier ?? 0);
      const hasIrrigatedPlotFlag = (record.serviceOutputs ?? []).some((output) => output.itemKey === "irrigated_plot" && output.unit === "flag");
      if (!hasIrrigatedPlotFlag) {
        throw new Error(`packages/content/base/civilization/infrastructure.json irrigation record ${recordId} must expose irrigated_plot as a flag output`);
      }
    }
  }

  if (irrigationRecordCount < 1) {
    throw new Error("packages/content/base/civilization/infrastructure.json must include at least one irrigation infrastructure record");
  }

  for (const workplace of workplaceParsed.records) {
    const recordId = workplace.id ?? "<unknown>";

    if ("irrigationProfile" in workplace) {
      throw new Error(`packages/content/base/civilization/workplaces.json irrigationProfile remains on workplace record ${recordId}`);
    }

    if (workplace?.tierProfile?.trackId === "track.irrigation") {
      throw new Error(`packages/content/base/civilization/workplaces.json track.irrigation remains on workplace record ${recordId}`);
    }

    for (const output of workplace?.ioProfile?.outputs ?? []) {
      if (output.itemKey === "irrigated_plot") {
        throw new Error(`packages/content/base/civilization/workplaces.json irrigated_plot output remains on workplace record ${recordId}`);
      }
    }

    if (workplace?.plotProfile?.irrigationPolicy) {
      const minimumTier = Number.isInteger(workplace.plotProfile.irrigationPolicy.minimumIrrigationTier) ?
        workplace.plotProfile.irrigationPolicy.minimumIrrigationTier :
        null;
      if (minimumTier !== null && minimumTier > irrigationMaxTier) {
        throw new Error(
          `packages/content/base/civilization/workplaces.json plotProfile.irrigationPolicy.minimumIrrigationTier ${minimumTier} exceeds available irrigation infrastructure max tier ${irrigationMaxTier} on record ${recordId}`
        );
      }
    }
  }
}

async function validateBuildingsAgainstWorkplaces() {
  const buildingPath = path.join(ROOT, "packages/content/base/civilization/buildings.json");
  const workplacePath = path.join(ROOT, "packages/content/base/civilization/workplaces.json");

  const buildingParsed = JSON.parse(await readFile(buildingPath, "utf8"));
  const workplaceParsed = JSON.parse(await readFile(workplacePath, "utf8"));

  if (!Array.isArray(buildingParsed.records) || !Array.isArray(workplaceParsed.records)) {
    throw new Error("content cross-check failed: buildings or workplaces are invalid");
  }

  const workplaceIds = new Set();
  for (const workplace of workplaceParsed.records) {
    if (typeof workplace.id === "string") {
      workplaceIds.add(workplace.id);
    }
  }

  const hostedWorkplaceIds = new Set();
  for (const building of buildingParsed.records) {
    const recordId = building.id ?? "<unknown>";

    for (const workplaceId of building.hostedWorkplaceIds ?? []) {
      if (!workplaceIds.has(workplaceId)) {
        throw new Error(`packages/content/base/civilization/buildings.json hostedWorkplaceIds '${workplaceId}' missing workplace definition on record ${recordId}`);
      }
      hostedWorkplaceIds.add(workplaceId);
    }

    if ((building.hostedWorkplaceIds?.length ?? 0) === 0 && (building.serviceFunctions?.length ?? 0) === 0) {
      throw new Error(`packages/content/base/civilization/buildings.json record ${recordId} must host workplaces or expose service functions`);
    }
  }

  for (const workplace of workplaceParsed.records) {
    if (!hostedWorkplaceIds.has(workplace.id)) {
      throw new Error(`packages/content/base/civilization/workplaces.json record ${workplace.id} has no compatible building coverage`);
    }
  }
}

async function validateWorldMapsAgainstRegions() {
  const regionPath = path.join(ROOT, "packages/content/base/world/regions.json");
  const worldMapPath = path.join(ROOT, "packages/content/base/world/world_maps.json");

  const regionParsed = JSON.parse(await readFile(regionPath, "utf8"));
  const worldMapParsed = JSON.parse(await readFile(worldMapPath, "utf8"));

  if (!Array.isArray(regionParsed.records) || !Array.isArray(worldMapParsed.records)) {
    throw new Error("content cross-check failed: region or world map records are invalid");
  }

  const regionsById = new Map();
  for (const record of regionParsed.records) {
    if (typeof record.id === "string") {
      regionsById.set(record.id, record);
    }
  }

  const worldMapsById = new Map();
  for (const record of worldMapParsed.records) {
    if (typeof record.id === "string") {
      worldMapsById.set(record.id, record);
    }
  }

  for (const region of regionParsed.records) {
    const recordId = region.id ?? "<unknown>";

    for (const mapId of region.mapIds ?? []) {
      if (!worldMapsById.has(mapId)) {
        throw new Error(`packages/content/base/world/regions.json mapIds value '${mapId}' missing in world_maps.json on record ${recordId}`);
      }
    }

    if (region.regionType === "subregion") {
      if (typeof region.parentRegionId !== "string") {
        throw new Error(`packages/content/base/world/regions.json subregion record ${recordId} must define parentRegionId`);
      }
      const parent = regionsById.get(region.parentRegionId);
      if (!parent) {
        throw new Error(`packages/content/base/world/regions.json parentRegionId '${region.parentRegionId}' missing on record ${recordId}`);
      }
      if (parent.regionType !== "continent" && parent.regionType !== "island_system") {
        throw new Error(`packages/content/base/world/regions.json subregion parent '${region.parentRegionId}' must be a continent or island_system on record ${recordId}`);
      }
    }
    else if ("parentRegionId" in region) {
      throw new Error(`packages/content/base/world/regions.json only subregion records may define parentRegionId on record ${recordId}`);
    }
  }

  for (const record of worldMapParsed.records) {
    const recordId = record.id ?? "<unknown>";

    const validateTypedRegion = (regionId, expectedType, field) => {
      const region = regionsById.get(regionId);
      if (!region) {
        throw new Error(`packages/content/base/world/world_maps.json ${field} regionId '${regionId}' missing on record ${recordId}`);
      }
      if (region.regionType !== expectedType) {
        throw new Error(`packages/content/base/world/world_maps.json ${field} regionId '${regionId}' must be a ${expectedType} on record ${recordId}`);
      }
    };

    for (const regionId of record.continentRegionIds ?? []) {
      validateTypedRegion(regionId, "continent", "continentRegionIds");
    }
    for (const regionId of record.islandSystemRegionIds ?? []) {
      validateTypedRegion(regionId, "island_system", "islandSystemRegionIds");
    }
    for (const regionId of record.oceanRegionIds ?? []) {
      validateTypedRegion(regionId, "ocean", "oceanRegionIds");
    }

    if (record.layerAssetPaths && typeof record.layerAssetPaths === "object") {
      for (const [layerName, assetPath] of Object.entries(record.layerAssetPaths)) {
        if (typeof assetPath !== "string" || assetPath.trim().length === 0) {
          continue;
        }

        const resolvedAssetPath = path.isAbsolute(assetPath) ? assetPath : path.join(ROOT, assetPath);
        try {
          await readFile(resolvedAssetPath);
        }
        catch {
          throw new Error(`packages/content/base/world/world_maps.json layerAssetPaths.${layerName} '${assetPath}' is missing on record ${recordId}`);
        }
      }
    }

    let populationTotal = 0;
    for (const estimate of record.populationEstimates ?? []) {
      if (!regionsById.has(estimate.regionId)) {
        throw new Error(`packages/content/base/world/world_maps.json populationEstimates regionId '${estimate.regionId}' missing on record ${recordId}`);
      }
      populationTotal += estimate.estimateMillions;
    }
    if (typeof record.totalPopulationMillions === "number" && Math.abs(populationTotal - record.totalPopulationMillions) > 0.5) {
      throw new Error(`packages/content/base/world/world_maps.json totalPopulationMillions does not match summed populationEstimates on record ${recordId}`);
    }

    for (const route of record.majorTradeRoutes ?? []) {
      for (const regionId of route.regionIds ?? []) {
        if (!regionsById.has(regionId)) {
          throw new Error(`packages/content/base/world/world_maps.json majorTradeRoutes regionId '${regionId}' missing on record ${recordId}`);
        }
      }
    }

    for (const zone of record.conflictZones ?? []) {
      for (const regionId of zone.regionIds ?? []) {
        if (!regionsById.has(regionId)) {
          throw new Error(`packages/content/base/world/world_maps.json conflictZones regionId '${regionId}' missing on record ${recordId}`);
        }
      }
    }
  }
}

async function validateWorldMapFeaturesAgainstWorldData() {
  const featurePath = path.join(ROOT, "packages/content/base/world/world_map_features.json");
  const worldMapPath = path.join(ROOT, "packages/content/base/world/world_maps.json");
  const regionPath = path.join(ROOT, "packages/content/base/world/regions.json");
  const climatePath = path.join(ROOT, "packages/content/base/world/climate_profiles.json");
  const biomePath = path.join(ROOT, "packages/content/base/world/biomes.json");

  const featureParsed = JSON.parse(await readFile(featurePath, "utf8"));
  const worldMapParsed = JSON.parse(await readFile(worldMapPath, "utf8"));
  const regionParsed = JSON.parse(await readFile(regionPath, "utf8"));
  const climateParsed = JSON.parse(await readFile(climatePath, "utf8"));
  const biomeParsed = JSON.parse(await readFile(biomePath, "utf8"));

  if (
    !Array.isArray(featureParsed.records) ||
    !Array.isArray(worldMapParsed.records) ||
    !Array.isArray(regionParsed.records) ||
    !Array.isArray(climateParsed.records) ||
    !Array.isArray(biomeParsed.records)
  ) {
    throw new Error("content cross-check failed: world map feature dependencies are invalid");
  }

  const worldMapsById = new Map(worldMapParsed.records.map((record) => [record.id, record]));
  const regionsById = new Map(regionParsed.records.map((record) => [record.id, record]));
  const climateIds = new Set(climateParsed.records.map((record) => record.id));
  const biomeIds = new Set(biomeParsed.records.map((record) => record.id));

  for (const record of featureParsed.records) {
    const recordId = record.id ?? "<unknown>";
    const worldMap = worldMapsById.get(record.mapId);
    if (!worldMap) {
      throw new Error(`packages/content/base/world/world_map_features.json mapId '${record.mapId}' missing on record ${recordId}`);
    }
    if (
      record.referenceImageWidthPx !== worldMap.scaleProfile?.referenceImageWidthPx ||
      record.referenceImageHeightPx !== worldMap.scaleProfile?.referenceImageHeightPx
    ) {
      throw new Error(`packages/content/base/world/world_map_features.json image dimensions must match world_maps.json on record ${recordId}`);
    }

    const validateFeature = (feature, field) => {
      for (const regionId of feature.regionIds ?? []) {
        if (!regionsById.has(regionId)) {
          throw new Error(`packages/content/base/world/world_map_features.json ${field} regionId '${regionId}' missing on record ${recordId}`);
        }
      }
      if ("points" in feature) {
        for (const point of feature.points ?? []) {
          if (point.x > record.referenceImageWidthPx || point.y > record.referenceImageHeightPx) {
            throw new Error(`packages/content/base/world/world_map_features.json ${field} point lies outside image bounds on record ${recordId}`);
          }
        }
      }
      if ("point" in feature) {
        if (feature.point.x > record.referenceImageWidthPx || feature.point.y > record.referenceImageHeightPx) {
          throw new Error(`packages/content/base/world/world_map_features.json ${field} point lies outside image bounds on record ${recordId}`);
        }
      }
    };

    const climateZoneIds = new Set();
    for (const [index, zone] of (record.climateZones ?? []).entries()) {
      validateFeature(zone, `climateZones[${index}]`);
      if (!climateIds.has(zone.climateProfileId)) {
        throw new Error(`packages/content/base/world/world_map_features.json climateProfileId '${zone.climateProfileId}' missing on record ${recordId}`);
      }
      if (climateZoneIds.has(zone.id)) {
        throw new Error(`packages/content/base/world/world_map_features.json duplicate climate zone id '${zone.id}' on record ${recordId}`);
      }
      climateZoneIds.add(zone.id);
    }

    const biomeZoneIds = new Set();
    for (const [index, zone] of (record.biomeZones ?? []).entries()) {
      validateFeature(zone, `biomeZones[${index}]`);
      if (!biomeIds.has(zone.biomeId)) {
        throw new Error(`packages/content/base/world/world_map_features.json biomeId '${zone.biomeId}' missing on record ${recordId}`);
      }
      if (biomeZoneIds.has(zone.id)) {
        throw new Error(`packages/content/base/world/world_map_features.json duplicate biome zone id '${zone.id}' on record ${recordId}`);
      }
      biomeZoneIds.add(zone.id);
    }

    for (const [fieldName, features] of Object.entries({
      regionFootprints: record.regionFootprints ?? [],
      coastlines: record.coastlines ?? [],
      riverFeatures: record.riverFeatures ?? [],
      mountainFeatures: record.mountainFeatures ?? [],
      passFeatures: record.passFeatures ?? [],
      crossingFeatures: record.crossingFeatures ?? []
    })) {
      for (const [index, feature] of features.entries()) {
        validateFeature(feature, `${fieldName}[${index}]`);
      }
    }
  }
}

async function validateRegionalEcologyAgainstWorldData() {
  const ecologyPath = path.join(ROOT, "packages/content/base/world/regional_ecology_profiles.json");
  const regionPath = path.join(ROOT, "packages/content/base/world/regions.json");
  const climatePath = path.join(ROOT, "packages/content/base/world/climate_profiles.json");
  const biomePath = path.join(ROOT, "packages/content/base/world/biomes.json");
  const floraPath = path.join(ROOT, "packages/content/base/world/flora.json");
  const faunaPath = path.join(ROOT, "packages/content/base/world/fauna.json");

  const ecologyParsed = JSON.parse(await readFile(ecologyPath, "utf8"));
  const regionParsed = JSON.parse(await readFile(regionPath, "utf8"));
  const climateParsed = JSON.parse(await readFile(climatePath, "utf8"));
  const biomeParsed = JSON.parse(await readFile(biomePath, "utf8"));
  const floraParsed = JSON.parse(await readFile(floraPath, "utf8"));
  const faunaParsed = JSON.parse(await readFile(faunaPath, "utf8"));

  if (
    !Array.isArray(ecologyParsed.records) ||
    !Array.isArray(regionParsed.records) ||
    !Array.isArray(climateParsed.records) ||
    !Array.isArray(biomeParsed.records) ||
    !Array.isArray(floraParsed.records) ||
    !Array.isArray(faunaParsed.records)
  ) {
    throw new Error("content cross-check failed: regional ecology dependencies are invalid");
  }

  const regionsById = new Map();
  for (const record of regionParsed.records) {
    if (typeof record.id === "string") {
      regionsById.set(record.id, record);
    }
  }

  const climateIds = new Set();
  for (const record of climateParsed.records) {
    if (typeof record.id === "string") {
      climateIds.add(record.id);
    }
  }

  const biomeIds = new Set();
  for (const record of biomeParsed.records) {
    if (typeof record.id === "string") {
      biomeIds.add(record.id);
    }
  }

  const floraIds = new Set();
  for (const record of floraParsed.records) {
    if (typeof record.id === "string") {
      floraIds.add(record.id);
    }
  }

  const faunaIds = new Set();
  for (const record of faunaParsed.records) {
    if (typeof record.id === "string") {
      faunaIds.add(record.id);
    }
  }

  for (const record of ecologyParsed.records) {
    const recordId = record.id ?? "<unknown>";
    const region = regionsById.get(record.regionId);
    if (!region) {
      throw new Error(`packages/content/base/world/regional_ecology_profiles.json regionId '${record.regionId}' missing on record ${recordId}`);
    }
    if (!["continent", "island_system"].includes(region.regionType)) {
      throw new Error(`packages/content/base/world/regional_ecology_profiles.json regionId '${record.regionId}' must target a continent or island_system on record ${recordId}`);
    }

    if (!climateIds.has(record.primaryClimateProfileId)) {
      throw new Error(`packages/content/base/world/regional_ecology_profiles.json primaryClimateProfileId '${record.primaryClimateProfileId}' missing on record ${recordId}`);
    }
    for (const climateId of record.secondaryClimateProfileIds ?? []) {
      if (!climateIds.has(climateId)) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json secondaryClimateProfileId '${climateId}' missing on record ${recordId}`);
      }
    }

    for (const biomeId of [...(record.dominantBiomeIds ?? []), ...(record.supportingBiomeIds ?? [])]) {
      if (!biomeIds.has(biomeId)) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json biome id '${biomeId}' missing on record ${recordId}`);
      }
    }
    for (const floraId of record.nativeFloraIds ?? []) {
      if (!floraIds.has(floraId)) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json flora id '${floraId}' missing on record ${recordId}`);
      }
    }
    for (const faunaId of record.nativeFaunaIds ?? []) {
      if (!faunaIds.has(faunaId)) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json fauna id '${faunaId}' missing on record ${recordId}`);
      }
    }

    for (const partnerRegionId of record.likelyTradePartnerRegionIds ?? []) {
      const partnerRegion = regionsById.get(partnerRegionId);
      if (!partnerRegion) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json likelyTradePartnerRegionId '${partnerRegionId}' missing on record ${recordId}`);
      }
      if (!["continent", "island_system"].includes(partnerRegion.regionType)) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json likelyTradePartnerRegionId '${partnerRegionId}' must target a continent or island_system on record ${recordId}`);
      }
      if (partnerRegionId === record.regionId) {
        throw new Error(`packages/content/base/world/regional_ecology_profiles.json record ${recordId} must not list itself as a trade partner`);
      }
    }
  }
}

async function validateInstitutionalMagicAgainstWorldData() {
  const guildPath = path.join(ROOT, "packages/content/base/civilization/guilds.json");
  const religionPath = path.join(ROOT, "packages/content/base/world/religions.json");
  const magicPath = path.join(ROOT, "packages/content/base/world/magic_infrastructure.json");
  const crystalPath = path.join(ROOT, "packages/content/base/world/crystal_catalog.json");

  const guildParsed = JSON.parse(await readFile(guildPath, "utf8"));
  const religionParsed = JSON.parse(await readFile(religionPath, "utf8"));
  const magicParsed = JSON.parse(await readFile(magicPath, "utf8"));
  const crystalParsed = JSON.parse(await readFile(crystalPath, "utf8"));

  if (
    !Array.isArray(guildParsed.records) ||
    !Array.isArray(religionParsed.records) ||
    !Array.isArray(magicParsed.records) ||
    !Array.isArray(crystalParsed.records)
  ) {
    throw new Error("content cross-check failed: institutional magic dependencies are invalid");
  }

  const guildSlugs = new Set(guildParsed.records.map((record) => record.slug).filter((value) => typeof value === "string"));
  const religionOrganizationIds = new Set(
    religionParsed.records
      .flatMap((record) => record.organizations ?? [])
      .map((organization) => organization.id)
      .filter((value) => typeof value === "string")
  );
  const crystalPairs = new Set(
    crystalParsed.records
      .map((record) => (typeof record.element === "string" && typeof record.tier === "string" ? `${record.element}:${record.tier}` : null))
      .filter((value) => value !== null)
  );

  for (const requiredPair of ["neutral:shard", "neutral:crystal", "neutral:cluster"]) {
    if (!crystalPairs.has(requiredPair)) {
      throw new Error(`packages/content/base/world/crystal_catalog.json missing required neutral crystal pair '${requiredPair}'`);
    }
  }

  for (const record of magicParsed.records) {
    const recordId = record.id ?? "<unknown>";

    for (const guildType of record.requiredGuildTypes ?? []) {
      if (!guildSlugs.has(guildType)) {
        throw new Error(`packages/content/base/world/magic_infrastructure.json requiredGuildType '${guildType}' missing guild definition on record ${recordId}`);
      }
    }

    for (const organizationId of record.requiredReligionOrganizationIds ?? []) {
      if (!religionOrganizationIds.has(organizationId)) {
        throw new Error(`packages/content/base/world/magic_infrastructure.json requiredReligionOrganizationId '${organizationId}' missing religion definition on record ${recordId}`);
      }
    }

    const hasCrystalSupport = (record.allowedElements ?? []).some((element) =>
      (record.preferredCrystalTiers ?? []).some((tier) => crystalPairs.has(`${element}:${tier}`))
    );
    if (!hasCrystalSupport) {
      throw new Error(`packages/content/base/world/magic_infrastructure.json record ${recordId} has no compatible crystal definitions`);
    }
  }
}

async function validateRegionLocalitiesAgainstWorldData() {
  const localityPath = path.join(ROOT, "packages/content/base/world/region_localities.json");
  const regionPath = path.join(ROOT, "packages/content/base/world/regions.json");

  const localityParsed = JSON.parse(await readFile(localityPath, "utf8"));
  const regionParsed = JSON.parse(await readFile(regionPath, "utf8"));

  if (!Array.isArray(localityParsed.records) || !Array.isArray(regionParsed.records)) {
    throw new Error("content cross-check failed: region locality dependencies are invalid");
  }

  const regionsById = new Map();
  for (const record of regionParsed.records) {
    if (typeof record.id === "string") {
      regionsById.set(record.id, record);
    }
  }

  for (const record of localityParsed.records) {
    const recordId = record.id ?? "<unknown>";
    const macroRegion = regionsById.get(record.macroRegionId);
    const localRegion = regionsById.get(record.regionId);

    if (!macroRegion) {
      throw new Error(`packages/content/base/world/region_localities.json macroRegionId '${record.macroRegionId}' missing on record ${recordId}`);
    }
    if (!["continent", "island_system"].includes(macroRegion.regionType)) {
      throw new Error(`packages/content/base/world/region_localities.json macroRegionId '${record.macroRegionId}' must target a continent or island_system on record ${recordId}`);
    }
    if (!localRegion) {
      throw new Error(`packages/content/base/world/region_localities.json regionId '${record.regionId}' missing on record ${recordId}`);
    }
    const regionBelongsToMacro =
      localRegion.id === macroRegion.id ||
      (localRegion.regionType === "subregion" && localRegion.parentRegionId === macroRegion.id);
    if (!regionBelongsToMacro) {
      throw new Error(`packages/content/base/world/region_localities.json regionId '${record.regionId}' does not belong to macroRegionId '${record.macroRegionId}' on record ${recordId}`);
    }
  }
}

async function validateSettlementsAgainstRegions() {
  const settlementPath = path.join(ROOT, "packages/content/base/world/settlements.json");
  const regionPath = path.join(ROOT, "packages/content/base/world/regions.json");
  const localityPath = path.join(ROOT, "packages/content/base/world/region_localities.json");
  const hexPath = path.join(ROOT, "packages/content/base/world/world_hexes.json");
  const guildPath = path.join(ROOT, "packages/content/base/civilization/guilds.json");

  const settlementParsed = JSON.parse(await readFile(settlementPath, "utf8"));
  const regionParsed = JSON.parse(await readFile(regionPath, "utf8"));
  const localityParsed = JSON.parse(await readFile(localityPath, "utf8"));
  const hexParsed = JSON.parse(await readFile(hexPath, "utf8"));
  const guildParsed = JSON.parse(await readFile(guildPath, "utf8"));

  if (
    !Array.isArray(settlementParsed.records) ||
    !Array.isArray(regionParsed.records) ||
    !Array.isArray(localityParsed.records) ||
    !Array.isArray(hexParsed.records) ||
    !Array.isArray(guildParsed.records)
  ) {
    throw new Error("content cross-check failed: settlement, region, locality, hex, or guild records are invalid");
  }

  const regionsById = new Map();
  for (const record of regionParsed.records) {
    if (typeof record.id === "string") {
      regionsById.set(record.id, record);
    }
  }

  const settlementsById = new Map();
  for (const record of settlementParsed.records) {
    if (typeof record.id === "string") {
      settlementsById.set(record.id, record);
    }
  }

  const localitiesById = new Map();
  for (const record of localityParsed.records) {
    if (typeof record.id === "string") {
      localitiesById.set(record.id, record);
    }
  }

  const hexesById = new Map();
  for (const record of hexParsed.records) {
    if (typeof record.id === "string") {
      hexesById.set(record.id, record);
    }
  }

  const guildsBySlug = new Map();
  for (const record of guildParsed.records) {
    if (typeof record.slug === "string") {
      guildsBySlug.set(record.slug, record);
    }
  }

  for (const record of settlementParsed.records) {
    const recordId = record.id ?? "<unknown>";
    const macroRegion = regionsById.get(record.macroRegionId);
    const localRegion = regionsById.get(record.regionId);
    const locality = localitiesById.get(record.localityBandId);
    const hex = hexesById.get(record.hexAnchorId);

    if (!macroRegion) {
      throw new Error(`packages/content/base/world/settlements.json macroRegionId '${record.macroRegionId}' missing on record ${recordId}`);
    }
    if (!["continent", "island_system"].includes(macroRegion.regionType)) {
      throw new Error(`packages/content/base/world/settlements.json macroRegionId '${record.macroRegionId}' must target a continent or island_system on record ${recordId}`);
    }
    if (!localRegion) {
      throw new Error(`packages/content/base/world/settlements.json regionId '${record.regionId}' missing on record ${recordId}`);
    }
    if (!locality) {
      throw new Error(`packages/content/base/world/settlements.json localityBandId '${record.localityBandId}' missing on record ${recordId}`);
    }
    if (!hex) {
      throw new Error(`packages/content/base/world/settlements.json hexAnchorId '${record.hexAnchorId}' missing on record ${recordId}`);
    }

    const regionBelongsToMacro =
      localRegion.id === macroRegion.id ||
      (localRegion.regionType === "subregion" && localRegion.parentRegionId === macroRegion.id);
    if (!regionBelongsToMacro) {
      throw new Error(`packages/content/base/world/settlements.json regionId '${record.regionId}' does not belong to macroRegionId '${record.macroRegionId}' on record ${recordId}`);
    }
    if (locality.regionId !== record.regionId || locality.macroRegionId !== record.macroRegionId) {
      throw new Error(`packages/content/base/world/settlements.json localityBandId '${record.localityBandId}' must share region and macro region on record ${recordId}`);
    }
    if (!(locality.supportedSiteClasses ?? []).includes(record.siteClass)) {
      throw new Error(`packages/content/base/world/settlements.json siteClass '${record.siteClass}' is not supported by localityBandId '${record.localityBandId}' on record ${recordId}`);
    }
    if (record.terrainContext !== locality.localityType) {
      throw new Error(`packages/content/base/world/settlements.json terrainContext '${record.terrainContext}' must match localityBandId '${record.localityBandId}' type '${locality.localityType}' on record ${recordId}`);
    }
    if (hex.regionId !== record.regionId || hex.localityBandId !== record.localityBandId) {
      throw new Error(`packages/content/base/world/settlements.json hexAnchorId '${record.hexAnchorId}' must share region and locality on record ${recordId}`);
    }
    if (!(hex.anchoredSettlementIds ?? []).includes(record.id)) {
      throw new Error(`packages/content/base/world/world_hexes.json hex '${record.hexAnchorId}' must list settlement '${record.id}' in anchoredSettlementIds`);
    }

    if (record.parentSettlementId) {
      const parent = settlementsById.get(record.parentSettlementId);
      if (!parent) {
        throw new Error(`packages/content/base/world/settlements.json parentSettlementId '${record.parentSettlementId}' missing on record ${recordId}`);
      }
      if (parent.id === record.id) {
        throw new Error(`packages/content/base/world/settlements.json record ${recordId} must not depend on itself`);
      }
      if (parent.parentSettlementId) {
        throw new Error(`packages/content/base/world/settlements.json parentSettlementId '${record.parentSettlementId}' must target a primary settlement on record ${recordId}`);
      }
      if (parent.regionId !== record.regionId || parent.macroRegionId !== record.macroRegionId) {
        throw new Error(`packages/content/base/world/settlements.json parentSettlementId '${record.parentSettlementId}' must share region and macro region on record ${recordId}`);
      }
      if ((parent.populationTotal ?? 0) <= (record.populationTotal ?? 0)) {
        throw new Error(`packages/content/base/world/settlements.json parentSettlementId '${record.parentSettlementId}' must be larger than dependent settlement on record ${recordId}`);
      }
    }

    for (const guild of record.guildPresence ?? []) {
      if (!guildsBySlug.has(guild.guildType)) {
        throw new Error(`packages/content/base/world/settlements.json guildPresence guildType '${guild.guildType}' missing guild definition on record ${recordId}`);
      }
    }

    for (const flow of record.domesticTradeFlows ?? []) {
      const partner = settlementsById.get(flow.partnerSettlementId);
      if (!partner) {
        throw new Error(`packages/content/base/world/settlements.json domesticTradeFlows partnerSettlementId '${flow.partnerSettlementId}' missing on record ${recordId}`);
      }
      if (partner.id === record.id) {
        throw new Error(`packages/content/base/world/settlements.json record ${recordId} must not trade with itself`);
      }
      if (partner.macroRegionId !== record.macroRegionId) {
        throw new Error(
          `packages/content/base/world/settlements.json domesticTradeFlows partnerSettlementId '${flow.partnerSettlementId}' must share macroRegionId '${record.macroRegionId}' on record ${recordId}`
        );
      }
    }
  }
}

async function validateQuestTemplatesAgainstWorldData() {
  const templatePath = path.join(ROOT, "packages/content/base/civilization/quest_templates.json");
  const guildPath = path.join(ROOT, "packages/content/base/civilization/guilds.json");
  const monsterPath = path.join(ROOT, "packages/content/base/world/monsters.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const templateParsed = JSON.parse(await readFile(templatePath, "utf8"));
  const guildParsed = JSON.parse(await readFile(guildPath, "utf8"));
  const monsterParsed = JSON.parse(await readFile(monsterPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (
    !Array.isArray(templateParsed.records) ||
    !Array.isArray(guildParsed.records) ||
    !Array.isArray(monsterParsed.records) ||
    !Array.isArray(marketParsed.records)
  ) {
    throw new Error("content cross-check failed: quest template dependencies are invalid");
  }

  const guildSlugs = new Set(guildParsed.records.map((record) => record.slug).filter((value) => typeof value === "string"));
  const monsterIds = new Set(monsterParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const marketKeys = new Set(marketParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));

  for (const record of templateParsed.records) {
    const recordId = record.id ?? "<unknown>";
    for (const guildType of record.issuingGuildTypes ?? []) {
      if (!guildSlugs.has(guildType)) {
        throw new Error(`packages/content/base/civilization/quest_templates.json issuingGuildTypes '${guildType}' missing guild definition on record ${recordId}`);
      }
    }
    for (const monsterId of record.monsterIds ?? []) {
      if (!monsterIds.has(monsterId)) {
        throw new Error(`packages/content/base/civilization/quest_templates.json monsterIds '${monsterId}' missing monster definition on record ${recordId}`);
      }
    }
    for (const itemKey of [...(record.targetItemKeys ?? []), ...(record.rewardProfile?.bonusItemKeys ?? [])]) {
      if (!marketKeys.has(itemKey)) {
        throw new Error(`packages/content/base/civilization/quest_templates.json itemKey '${itemKey}' missing market item value on record ${recordId}`);
      }
    }
  }
}

async function validateQuestArchetypesAgainstWorldData() {
  const archetypePath = path.join(ROOT, "packages/content/base/civilization/quest_archetypes.json");
  const guildPath = path.join(ROOT, "packages/content/base/civilization/guilds.json");
  const monsterPath = path.join(ROOT, "packages/content/base/world/monsters.json");
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");
  const attributePath = path.join(ROOT, "packages/content/base/player/attributes.json");
  const skillPath = path.join(ROOT, "packages/content/base/player/skills.json");
  const abilityPath = path.join(ROOT, "packages/content/base/player/abilities.json");
  const spellPath = path.join(ROOT, "packages/content/base/player/spells.json");
  const traitPath = path.join(ROOT, "packages/content/base/player/traits.json");

  const archetypeParsed = JSON.parse(await readFile(archetypePath, "utf8"));
  const guildParsed = JSON.parse(await readFile(guildPath, "utf8"));
  const monsterParsed = JSON.parse(await readFile(monsterPath, "utf8"));
  const itemParsed = JSON.parse(await readFile(itemPath, "utf8"));
  const attributeParsed = JSON.parse(await readFile(attributePath, "utf8"));
  const skillParsed = JSON.parse(await readFile(skillPath, "utf8"));
  const abilityParsed = JSON.parse(await readFile(abilityPath, "utf8"));
  const spellParsed = JSON.parse(await readFile(spellPath, "utf8"));
  const traitParsed = JSON.parse(await readFile(traitPath, "utf8"));

  if (
    !Array.isArray(archetypeParsed.records) ||
    !Array.isArray(guildParsed.records) ||
    !Array.isArray(monsterParsed.records) ||
    !Array.isArray(itemParsed.records) ||
    !Array.isArray(attributeParsed.records) ||
    !Array.isArray(skillParsed.records) ||
    !Array.isArray(abilityParsed.records) ||
    !Array.isArray(spellParsed.records) ||
    !Array.isArray(traitParsed.records)
  ) {
    throw new Error("content cross-check failed: quest archetype dependencies are invalid");
  }

  const archetypeFile = "packages/content/base/civilization/quest_archetypes.json";
  const questTypeIds = new Set((archetypeParsed.questTypes ?? []).map((entry) => entry.id).filter((value) => typeof value === "string"));
  const guildSlugs = new Set(guildParsed.records.map((record) => record.slug).filter((value) => typeof value === "string"));
  const monsterIds = new Set(monsterParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const itemKeys = new Set(itemParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));
  const attributeIds = new Set(attributeParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const skillIds = new Set(skillParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const abilityIds = new Set(abilityParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const spellIds = new Set(spellParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const traitIds = new Set(traitParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));

  const validateCheckTarget = (kind, targetId, recordId, nodeId) => {
    if (typeof targetId !== "string" || targetId.length === 0) {
      return;
    }

    if (kind === "attribute" && !attributeIds.has(targetId)) {
      throw new Error(`${archetypeFile} actionTree check targetId '${targetId}' missing attribute definition on record ${recordId}, node ${nodeId}`);
    }
    if (kind === "skill" && !skillIds.has(targetId)) {
      throw new Error(`${archetypeFile} actionTree check targetId '${targetId}' missing skill definition on record ${recordId}, node ${nodeId}`);
    }
    if (kind === "ability" && !abilityIds.has(targetId)) {
      throw new Error(`${archetypeFile} actionTree check targetId '${targetId}' missing ability definition on record ${recordId}, node ${nodeId}`);
    }
    if (kind === "spell" && !spellIds.has(targetId)) {
      throw new Error(`${archetypeFile} actionTree check targetId '${targetId}' missing spell definition on record ${recordId}, node ${nodeId}`);
    }
    if ((kind === "tool" || kind === "item") && !itemKeys.has(targetId)) {
      throw new Error(`${archetypeFile} actionTree check targetId '${targetId}' missing item definition on record ${recordId}, node ${nodeId}`);
    }
  };

  for (const record of archetypeParsed.records) {
    const recordId = record.id ?? "<unknown>";

    if (questTypeIds.size > 0 && !questTypeIds.has(record.questType)) {
      throw new Error(`${archetypeFile} questType '${record.questType}' missing top-level questTypes entry on record ${recordId}`);
    }

    for (const guildType of record.commonGuildTypes ?? []) {
      if (!guildSlugs.has(guildType)) {
        throw new Error(`${archetypeFile} commonGuildTypes '${guildType}' missing guild definition on record ${recordId}`);
      }
    }

    for (const monsterId of record.encounterMonsterIds ?? []) {
      if (!monsterIds.has(monsterId)) {
        throw new Error(`${archetypeFile} encounterMonsterIds '${monsterId}' missing monster definition on record ${recordId}`);
      }
    }

    for (const requirement of record.baselineRequirements?.requiredSkills ?? []) {
      if (!skillIds.has(requirement.id)) {
        throw new Error(`${archetypeFile} requiredSkills id '${requirement.id}' missing skill definition on record ${recordId}`);
      }
    }
    for (const requirement of record.baselineRequirements?.requiredAbilities ?? []) {
      if (!abilityIds.has(requirement.id)) {
        throw new Error(`${archetypeFile} requiredAbilities id '${requirement.id}' missing ability definition on record ${recordId}`);
      }
    }
    for (const requirement of record.baselineRequirements?.requiredSpells ?? []) {
      if (!spellIds.has(requirement.id)) {
        throw new Error(`${archetypeFile} requiredSpells id '${requirement.id}' missing spell definition on record ${recordId}`);
      }
    }
    for (const requirement of record.baselineRequirements?.requiredTraits ?? []) {
      if (!traitIds.has(requirement.id)) {
        throw new Error(`${archetypeFile} requiredTraits id '${requirement.id}' missing trait definition on record ${recordId}`);
      }
    }
    for (const itemKey of [
      ...(record.baselineRequirements?.requiredItems ?? []),
      ...(record.logistics?.requiredTools ?? []),
      ...(record.logistics?.recommendedTools ?? []),
      ...(record.logistics?.consumedItems ?? [])
    ]) {
      if (!itemKeys.has(itemKey)) {
        throw new Error(`${archetypeFile} item reference '${itemKey}' missing item definition on record ${recordId}`);
      }
    }
    for (const spellId of record.logistics?.recommendedSpells ?? []) {
      if (!spellIds.has(spellId)) {
        throw new Error(`${archetypeFile} recommendedSpells id '${spellId}' missing spell definition on record ${recordId}`);
      }
    }

    const nodeIds = new Set((record.actionTree?.nodes ?? []).map((node) => node.id).filter((value) => typeof value === "string"));
    const roleSlotIds = new Set((record.deployment?.roleSlots ?? []).map((slot) => slot.slotId).filter((value) => typeof value === "string"));

    if (record.actionTree?.entryNodeId && !nodeIds.has(record.actionTree.entryNodeId)) {
      throw new Error(`${archetypeFile} entryNodeId '${record.actionTree.entryNodeId}' missing action node on record ${recordId}`);
    }
    for (const nodeId of record.actionTree?.completionNodeIds ?? []) {
      if (!nodeIds.has(nodeId)) {
        throw new Error(`${archetypeFile} completionNodeId '${nodeId}' missing action node on record ${recordId}`);
      }
    }

    for (const slot of record.deployment?.roleSlots ?? []) {
      for (const ref of slot.preferredChecks ?? []) {
        if (typeof ref !== "string") {
          continue;
        }
        if (ref.startsWith("attr.") && !attributeIds.has(ref)) {
          throw new Error(`${archetypeFile} preferredChecks '${ref}' missing attribute definition on record ${recordId}`);
        }
        if (ref.startsWith("skill.") && !skillIds.has(ref)) {
          throw new Error(`${archetypeFile} preferredChecks '${ref}' missing skill definition on record ${recordId}`);
        }
        if (ref.startsWith("ability.") && !abilityIds.has(ref)) {
          throw new Error(`${archetypeFile} preferredChecks '${ref}' missing ability definition on record ${recordId}`);
        }
        if (ref.startsWith("spell.") && !spellIds.has(ref)) {
          throw new Error(`${archetypeFile} preferredChecks '${ref}' missing spell definition on record ${recordId}`);
        }
        if (!ref.includes(".") && !itemKeys.has(ref)) {
          throw new Error(`${archetypeFile} preferredChecks '${ref}' missing item definition on record ${recordId}`);
        }
      }
    }

    for (const node of record.actionTree?.nodes ?? []) {
      const nodeId = node.id ?? "<unknown>";
      for (const assignedRole of node.assignedRoles ?? []) {
        if (!roleSlotIds.has(assignedRole)) {
          throw new Error(`${archetypeFile} assignedRoles '${assignedRole}' missing deployment roleSlot on record ${recordId}, node ${nodeId}`);
        }
      }
      for (const check of node.checks ?? []) {
        validateCheckTarget(check.kind, check.targetId, recordId, nodeId);
      }
      for (const branch of Object.values(node.branches ?? {})) {
        if (branch?.nextNodeId && !nodeIds.has(branch.nextNodeId)) {
          throw new Error(`${archetypeFile} branch nextNodeId '${branch.nextNodeId}' missing action node on record ${recordId}, node ${nodeId}`);
        }
      }
    }
  }
}

async function validateQuestDefinitionsAgainstWorldData() {
  const definitionPath = path.join(ROOT, "packages/content/base/civilization/quest_definitions.json");
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");
  const attributePath = path.join(ROOT, "packages/content/base/player/attributes.json");
  const skillPath = path.join(ROOT, "packages/content/base/player/skills.json");
  const abilityPath = path.join(ROOT, "packages/content/base/player/abilities.json");
  const spellPath = path.join(ROOT, "packages/content/base/player/spells.json");
  const traitPath = path.join(ROOT, "packages/content/base/player/traits.json");

  const definitionsParsed = JSON.parse(await readFile(definitionPath, "utf8"));
  const itemParsed = JSON.parse(await readFile(itemPath, "utf8"));
  const attributeParsed = JSON.parse(await readFile(attributePath, "utf8"));
  const skillParsed = JSON.parse(await readFile(skillPath, "utf8"));
  const abilityParsed = JSON.parse(await readFile(abilityPath, "utf8"));
  const spellParsed = JSON.parse(await readFile(spellPath, "utf8"));
  const traitParsed = JSON.parse(await readFile(traitPath, "utf8"));

  if (
    !Array.isArray(definitionsParsed.records) ||
    !Array.isArray(itemParsed.records) ||
    !Array.isArray(attributeParsed.records) ||
    !Array.isArray(skillParsed.records) ||
    !Array.isArray(abilityParsed.records) ||
    !Array.isArray(spellParsed.records) ||
    !Array.isArray(traitParsed.records)
  ) {
    throw new Error("content cross-check failed: quest definition dependencies are invalid");
  }

  const definitionFile = "packages/content/base/civilization/quest_definitions.json";
  const itemKeys = new Set(itemParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));
  const attributeIds = new Set(attributeParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const skillIds = new Set(skillParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const abilityIds = new Set(abilityParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const spellIds = new Set(spellParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));
  const traitIds = new Set(traitParsed.records.map((record) => record.id).filter((value) => typeof value === "string"));

  const validateCheckTarget = (kind, targetId, recordId, nodeId) => {
    if (typeof targetId !== "string" || targetId.length === 0) {
      return;
    }

    if (kind === "attribute" && !attributeIds.has(targetId)) {
      throw new Error(`${definitionFile} actionTree check targetId '${targetId}' missing attribute definition on record ${recordId}, node ${nodeId}`);
    }
    if (kind === "skill" && !skillIds.has(targetId)) {
      throw new Error(`${definitionFile} actionTree check targetId '${targetId}' missing skill definition on record ${recordId}, node ${nodeId}`);
    }
    if (kind === "ability" && !abilityIds.has(targetId)) {
      throw new Error(`${definitionFile} actionTree check targetId '${targetId}' missing ability definition on record ${recordId}, node ${nodeId}`);
    }
    if (kind === "spell" && !spellIds.has(targetId)) {
      throw new Error(`${definitionFile} actionTree check targetId '${targetId}' missing spell definition on record ${recordId}, node ${nodeId}`);
    }
    if ((kind === "tool" || kind === "item") && !itemKeys.has(targetId)) {
      throw new Error(`${definitionFile} actionTree check targetId '${targetId}' missing item definition on record ${recordId}, node ${nodeId}`);
    }
  };

  for (const record of definitionsParsed.records) {
    const recordId = record.id ?? "<unknown>";

    for (const requirement of record.requirements?.requiredSkills ?? []) {
      if (!skillIds.has(requirement.id)) {
        throw new Error(`${definitionFile} requiredSkills id '${requirement.id}' missing skill definition on record ${recordId}`);
      }
    }
    for (const requirement of record.requirements?.requiredAbilities ?? []) {
      if (!abilityIds.has(requirement.id)) {
        throw new Error(`${definitionFile} requiredAbilities id '${requirement.id}' missing ability definition on record ${recordId}`);
      }
    }
    for (const requirement of record.requirements?.requiredSpells ?? []) {
      if (!spellIds.has(requirement.id)) {
        throw new Error(`${definitionFile} requiredSpells id '${requirement.id}' missing spell definition on record ${recordId}`);
      }
    }
    for (const requirement of record.requirements?.requiredTraits ?? []) {
      if (!traitIds.has(requirement.id)) {
        throw new Error(`${definitionFile} requiredTraits id '${requirement.id}' missing trait definition on record ${recordId}`);
      }
    }

    for (const itemKey of [
      ...(record.requirements?.requiredItems ?? []),
      ...(record.logistics?.requiredTools ?? []),
      ...(record.logistics?.recommendedTools ?? []),
      ...(record.logistics?.consumedItems ?? [])
    ]) {
      if (!itemKeys.has(itemKey)) {
        throw new Error(`${definitionFile} item reference '${itemKey}' missing item definition on record ${recordId}`);
      }
    }

    for (const spellId of record.logistics?.recommendedSpells ?? []) {
      if (!spellIds.has(spellId)) {
        throw new Error(`${definitionFile} recommendedSpells id '${spellId}' missing spell definition on record ${recordId}`);
      }
    }

    const nodeIds = new Set((record.actionTree?.nodes ?? []).map((node) => node.id).filter((value) => typeof value === "string"));
    const roleSlotIds = new Set((record.deployment?.roleSlots ?? []).map((slot) => slot.slotId).filter((value) => typeof value === "string"));

    for (const slot of record.deployment?.roleSlots ?? []) {
      for (const ref of slot.preferredChecks ?? []) {
        if (typeof ref !== "string") {
          continue;
        }
        if (ref.startsWith("attr.") && !attributeIds.has(ref)) {
          throw new Error(`${definitionFile} preferredChecks '${ref}' missing attribute definition on record ${recordId}`);
        }
        if (ref.startsWith("skill.") && !skillIds.has(ref)) {
          throw new Error(`${definitionFile} preferredChecks '${ref}' missing skill definition on record ${recordId}`);
        }
        if (ref.startsWith("ability.") && !abilityIds.has(ref)) {
          throw new Error(`${definitionFile} preferredChecks '${ref}' missing ability definition on record ${recordId}`);
        }
        if (ref.startsWith("spell.") && !spellIds.has(ref)) {
          throw new Error(`${definitionFile} preferredChecks '${ref}' missing spell definition on record ${recordId}`);
        }
        if (!ref.includes(".") && !itemKeys.has(ref)) {
          throw new Error(`${definitionFile} preferredChecks '${ref}' missing item definition on record ${recordId}`);
        }
      }
    }

    for (const node of record.actionTree?.nodes ?? []) {
      const nodeId = node.id ?? "<unknown>";
      for (const assignedRole of node.assignedRoles ?? []) {
        if (!roleSlotIds.has(assignedRole)) {
          throw new Error(`${definitionFile} assignedRoles '${assignedRole}' missing deployment roleSlot on record ${recordId}, node ${nodeId}`);
        }
      }
      for (const check of node.checks ?? []) {
        validateCheckTarget(check.kind, check.targetId, recordId, nodeId);
      }
      for (const branch of Object.values(node.branches ?? {})) {
        if (branch?.nextNodeId && !nodeIds.has(branch.nextNodeId)) {
          throw new Error(`${definitionFile} branch nextNodeId '${branch.nextNodeId}' missing action node on record ${recordId}, node ${nodeId}`);
        }
      }
    }
  }
}

async function validatePlayerContentAgainstDependencies() {
  const attributePath = path.join(ROOT, "packages/content/base/player/attributes.json");
  const skillPath = path.join(ROOT, "packages/content/base/player/skills.json");
  const abilityPath = path.join(ROOT, "packages/content/base/player/abilities.json");
  const spellPath = path.join(ROOT, "packages/content/base/player/spells.json");
  const traitPath = path.join(ROOT, "packages/content/base/player/traits.json");
  const backstoryPath = path.join(ROOT, "packages/content/base/player/backstories.json");
  const startingBundlePath = path.join(ROOT, "packages/content/base/player/starting_bundles.json");
  const progressionTrackPath = path.join(ROOT, "packages/content/base/player/progression_tracks.json");
  const knowledgeDomainPath = path.join(ROOT, "packages/content/base/player/knowledge_domains.json");
  const skillEffectPath = path.join(ROOT, "packages/content/base/player/skill_effects.json");
  const trialPath = path.join(ROOT, "packages/content/base/player/trials.json");
  const titlePath = path.join(ROOT, "packages/content/base/player/titles.json");
  const itemPath = path.join(ROOT, "packages/content/base/items/items.json");

  const attributesParsed = JSON.parse(await readFile(attributePath, "utf8"));
  const skillsParsed = JSON.parse(await readFile(skillPath, "utf8"));
  const abilitiesParsed = JSON.parse(await readFile(abilityPath, "utf8"));
  const spellsParsed = JSON.parse(await readFile(spellPath, "utf8"));
  const traitsParsed = JSON.parse(await readFile(traitPath, "utf8"));
  const backstoriesParsed = JSON.parse(await readFile(backstoryPath, "utf8"));
  const startingBundlesParsed = JSON.parse(await readFile(startingBundlePath, "utf8"));
  const progressionParsed = JSON.parse(await readFile(progressionTrackPath, "utf8"));
  const knowledgeParsed = JSON.parse(await readFile(knowledgeDomainPath, "utf8"));
  const skillEffectsParsed = JSON.parse(await readFile(skillEffectPath, "utf8"));
  const trialsParsed = JSON.parse(await readFile(trialPath, "utf8"));
  const titlesParsed = JSON.parse(await readFile(titlePath, "utf8"));
  const itemsParsed = JSON.parse(await readFile(itemPath, "utf8"));

  const attributeIds = new Set(attributesParsed.records.map((record) => record.id));
  const skillIds = new Set(skillsParsed.records.map((record) => record.id));
  const abilityIds = new Set(abilitiesParsed.records.map((record) => record.id));
  const progressionTrackIds = new Set(progressionParsed.records.map((record) => record.id));
  const knowledgeDomainIds = new Set(knowledgeParsed.records.map((record) => record.id));
  const skillEffectIds = new Set(skillEffectsParsed.records.map((record) => record.id));
  const trialIds = new Set(trialsParsed.records.map((record) => record.id));
  const itemIds = new Set(itemsParsed.records.map((record) => record.id));

  for (const record of attributesParsed.records) {
    for (const skillId of record.skillAffinities ?? []) {
      if (!skillIds.has(skillId)) {
        throw new Error(`packages/content/base/player/attributes.json skillAffinities '${skillId}' missing skill definition on record ${record.id}`);
      }
    }
  }

  for (const record of skillsParsed.records) {
    for (const attributeId of record.governingAttributes ?? []) {
      if (!attributeIds.has(attributeId)) {
        throw new Error(`packages/content/base/player/skills.json governingAttributes '${attributeId}' missing attribute definition on record ${record.id}`);
      }
    }
    if (!progressionTrackIds.has(record.progressionTrackId)) {
      throw new Error(`packages/content/base/player/skills.json progressionTrackId '${record.progressionTrackId}' missing progression track on record ${record.id}`);
    }
    if (record.knowledgeDomainId !== undefined && !knowledgeDomainIds.has(record.knowledgeDomainId)) {
      throw new Error(`packages/content/base/player/skills.json knowledgeDomainId '${record.knowledgeDomainId}' missing knowledge track on record ${record.id}`);
    }
    for (const skillEffectId of record.combatHooks?.skillEffectIds ?? []) {
      if (!skillEffectIds.has(skillEffectId)) {
        throw new Error(`packages/content/base/player/skills.json combatHooks.skillEffectIds '${skillEffectId}' missing skill effect on record ${record.id}`);
      }
    }
  }

  for (const record of abilitiesParsed.records) {
    for (const requirement of record.requirements?.skillRanks ?? []) {
      if (!skillIds.has(requirement.id)) {
        throw new Error(`packages/content/base/player/abilities.json requirement skill '${requirement.id}' missing skill definition on record ${record.id}`);
      }
    }
    for (const requirement of record.requirements?.attributes ?? []) {
      if (!attributeIds.has(requirement.id)) {
        throw new Error(`packages/content/base/player/abilities.json requirement attribute '${requirement.id}' missing attribute definition on record ${record.id}`);
      }
    }
    for (const skillId of record.governingSkillIds ?? []) {
      if (!skillIds.has(skillId)) {
        throw new Error(`packages/content/base/player/abilities.json governingSkillIds '${skillId}' missing skill definition on record ${record.id}`);
      }
    }
    for (const attributeId of record.governingAttributeIds ?? []) {
      if (!attributeIds.has(attributeId)) {
        throw new Error(`packages/content/base/player/abilities.json governingAttributeIds '${attributeId}' missing attribute definition on record ${record.id}`);
      }
    }
  }

  for (const record of spellsParsed.records) {
    if (!skillIds.has(record.governingSkillId)) {
      throw new Error(`packages/content/base/player/spells.json governingSkillId '${record.governingSkillId}' missing skill definition on record ${record.id}`);
    }
    for (const attributeId of record.governingAttributes ?? []) {
      if (!attributeIds.has(attributeId)) {
        throw new Error(`packages/content/base/player/spells.json governingAttributes '${attributeId}' missing attribute definition on record ${record.id}`);
      }
    }
  }

  for (const record of traitsParsed.records) {
    for (const modifier of record.modifiers ?? []) {
      if (modifier.skillId !== undefined && !skillIds.has(modifier.skillId)) {
        throw new Error(`packages/content/base/player/traits.json modifier skill '${modifier.skillId}' missing skill definition on record ${record.id}`);
      }
    }
  }

  for (const record of backstoriesParsed.records) {
    for (const skill of record.startingSkills ?? []) {
      if (!skillIds.has(skill.skillId)) {
        throw new Error(`packages/content/base/player/backstories.json startingSkills '${skill.skillId}' missing skill definition on record ${record.id}`);
      }
    }
    for (const abilityId of record.startingAbilityIds ?? []) {
      if (!abilityIds.has(abilityId)) {
        throw new Error(`packages/content/base/player/backstories.json startingAbilityIds '${abilityId}' missing ability definition on record ${record.id}`);
      }
    }
  }

  for (const record of startingBundlesParsed.records) {
    for (const item of record.fixedItems ?? []) {
      if (!itemIds.has(item.itemId)) {
        throw new Error(`packages/content/base/player/starting_bundles.json fixedItems '${item.itemId}' missing item definition on record ${record.id}`);
      }
    }
    for (const group of record.choiceGroups ?? []) {
      for (const option of group.options ?? []) {
        if (!itemIds.has(option.itemId)) {
          throw new Error(`packages/content/base/player/starting_bundles.json choiceGroups '${option.itemId}' missing item definition on record ${record.id}`);
        }
      }
    }
  }

  for (const record of knowledgeParsed.records) {
    for (const field of ["knowledgeSkillId", "spottingSkillId", "identifySkillId", "generalSupportSkillId"]) {
      if (record[field] !== undefined && !skillIds.has(record[field])) {
        throw new Error(`packages/content/base/player/knowledge_domains.json ${field} '${record[field]}' missing skill definition on record ${record.id}`);
      }
    }
  }

  for (const record of skillEffectsParsed.records) {
    if (!skillIds.has(record.skillId)) {
      throw new Error(`packages/content/base/player/skill_effects.json skillId '${record.skillId}' missing skill definition on record ${record.id}`);
    }
  }

  for (const record of trialsParsed.records) {
    if (!skillIds.has(record.associatedSkillId)) {
      throw new Error(`packages/content/base/player/trials.json associatedSkillId '${record.associatedSkillId}' missing skill definition on record ${record.id}`);
    }
  }

  for (const record of titlesParsed.records) {
    if (record.sourceSkillId !== undefined && record.sourceSkillId !== null && !skillIds.has(record.sourceSkillId)) {
      throw new Error(`packages/content/base/player/titles.json sourceSkillId '${record.sourceSkillId}' missing skill definition on record ${record.id}`);
    }
    if (record.milestone?.trialId !== undefined && record.milestone?.trialId !== null && !trialIds.has(record.milestone.trialId)) {
      throw new Error(`packages/content/base/player/titles.json milestone.trialId '${record.milestone.trialId}' missing trial definition on record ${record.id}`);
    }
  }

  for (const record of itemsParsed.records) {
    for (const profile of record.useProfiles ?? []) {
      if (!skillIds.has(profile.primarySkillId)) {
        throw new Error(`packages/content/base/items/items.json useProfiles primarySkillId '${profile.primarySkillId}' missing skill definition on record ${record.id}`);
      }
      if (profile.proficiencySkillId !== undefined && !skillIds.has(profile.proficiencySkillId)) {
        throw new Error(`packages/content/base/items/items.json useProfiles proficiencySkillId '${profile.proficiencySkillId}' missing skill definition on record ${record.id}`);
      }
      for (const skillId of profile.supportSkillIds ?? []) {
        if (!skillIds.has(skillId)) {
          throw new Error(`packages/content/base/items/items.json useProfiles supportSkillId '${skillId}' missing skill definition on record ${record.id}`);
        }
      }
      for (const skillId of profile.hybridSkillIds ?? []) {
        if (!skillIds.has(skillId)) {
          throw new Error(`packages/content/base/items/items.json useProfiles hybridSkillId '${skillId}' missing skill definition on record ${record.id}`);
        }
      }
    }
  }

  if (abilityIds.size === 0) {
    throw new Error("content cross-check failed: player ability catalog is empty");
  }
}

async function validateCombatFoundationAgainstDependencies() {
  const combatRolePath = path.join(ROOT, "packages/content/base/game/combat_roles.json");
  const tacticsPresetPath = path.join(ROOT, "packages/content/base/game/tactics_presets.json");
  const encounterTemplatePath = path.join(ROOT, "packages/content/base/world/encounter_templates.json");
  const spawnProfilePath = path.join(ROOT, "packages/content/base/world/spawn_profiles.json");
  const monsterPath = path.join(ROOT, "packages/content/base/world/monsters.json");
  const regionPath = path.join(ROOT, "packages/content/base/world/regions.json");
  const settlementPath = path.join(ROOT, "packages/content/base/world/settlements.json");
  const worldHexPath = path.join(ROOT, "packages/content/base/world/world_hexes.json");

  const combatRolesParsed = JSON.parse(await readFile(combatRolePath, "utf8"));
  const tacticsPresetsParsed = JSON.parse(await readFile(tacticsPresetPath, "utf8"));
  const encounterTemplatesParsed = JSON.parse(await readFile(encounterTemplatePath, "utf8"));
  const spawnProfilesParsed = JSON.parse(await readFile(spawnProfilePath, "utf8"));
  const monstersParsed = JSON.parse(await readFile(monsterPath, "utf8"));
  const regionsParsed = JSON.parse(await readFile(regionPath, "utf8"));
  const settlementsParsed = JSON.parse(await readFile(settlementPath, "utf8"));
  const worldHexesParsed = JSON.parse(await readFile(worldHexPath, "utf8"));

  const roleIds = new Set(combatRolesParsed.records.map((record) => record.id));
  const presetIds = new Set(tacticsPresetsParsed.records.map((record) => record.id));
  const encounterIds = new Set(encounterTemplatesParsed.records.map((record) => record.id));
  const monsterIds = new Set(monstersParsed.records.map((record) => record.id));
  const regionIds = new Set(regionsParsed.records.map((record) => record.id));
  const settlementIds = new Set(settlementsParsed.records.map((record) => record.id));
  const worldHexIds = new Set(worldHexesParsed.records.map((record) => record.id));

  if (roleIds.size === 0 || presetIds.size === 0 || encounterIds.size === 0 || monsterIds.size === 0) {
    throw new Error("content cross-check failed: combat foundation catalogs must not be empty");
  }

  for (const record of combatRolesParsed.records) {
    if (record.defaultTactics.roleId !== record.id) {
      throw new Error(`packages/content/base/game/combat_roles.json defaultTactics.roleId must match id on record ${record.id}`);
    }
  }

  for (const record of tacticsPresetsParsed.records) {
    if (!roleIds.has(record.roleId)) {
      throw new Error(`packages/content/base/game/tactics_presets.json roleId '${record.roleId}' missing combat role on record ${record.id}`);
    }
    if (record.tactics.roleId !== record.roleId) {
      throw new Error(`packages/content/base/game/tactics_presets.json tactics.roleId must match roleId on record ${record.id}`);
    }
  }

  for (const record of monstersParsed.records) {
    if (!roleIds.has(record.defaultRole)) {
      throw new Error(`packages/content/base/world/monsters.json defaultRole '${record.defaultRole}' missing combat role on record ${record.id}`);
    }
  }

  for (const record of encounterTemplatesParsed.records) {
    for (const regionId of record.regionIds) {
      if (!regionIds.has(regionId)) {
        throw new Error(`packages/content/base/world/encounter_templates.json regionId '${regionId}' missing world region on record ${record.id}`);
      }
    }

    for (const member of record.members) {
      if (!monsterIds.has(member.monsterId)) {
        throw new Error(`packages/content/base/world/encounter_templates.json monsterId '${member.monsterId}' missing monster record on record ${record.id}`);
      }
      if (!roleIds.has(member.roleId)) {
        throw new Error(`packages/content/base/world/encounter_templates.json roleId '${member.roleId}' missing combat role on record ${record.id}`);
      }
    }

    for (const alliedTemplateId of record.alliedTemplateIds ?? []) {
      if (!encounterIds.has(alliedTemplateId)) {
        throw new Error(`packages/content/base/world/encounter_templates.json alliedTemplateId '${alliedTemplateId}' missing encounter template on record ${record.id}`);
      }
      if (alliedTemplateId === record.id) {
        throw new Error(`packages/content/base/world/encounter_templates.json alliedTemplateId cannot self-reference on record ${record.id}`);
      }
    }
  }

  for (const record of spawnProfilesParsed.records) {
    for (const regionId of record.regionIds) {
      if (!regionIds.has(regionId)) {
        throw new Error(`packages/content/base/world/spawn_profiles.json regionId '${regionId}' missing world region on record ${record.id}`);
      }
    }
    for (const settlementId of record.settlementIds) {
      if (!settlementIds.has(settlementId)) {
        throw new Error(`packages/content/base/world/spawn_profiles.json settlementId '${settlementId}' missing settlement on record ${record.id}`);
      }
    }
    for (const worldHexId of record.worldHexIds) {
      if (!worldHexIds.has(worldHexId)) {
        throw new Error(`packages/content/base/world/spawn_profiles.json worldHexId '${worldHexId}' missing world hex on record ${record.id}`);
      }
    }
    for (const encounterWeight of record.encounterWeights) {
      if (!encounterIds.has(encounterWeight.encounterTemplateId)) {
        throw new Error(`packages/content/base/world/spawn_profiles.json encounterTemplateId '${encounterWeight.encounterTemplateId}' missing encounter template on record ${record.id}`);
      }
    }
  }
}

async function validateMonstersAgainstMarketValues() {
  const monsterPath = path.join(ROOT, "packages/content/base/world/monsters.json");
  const marketPath = path.join(ROOT, "packages/content/base/civilization/market_item_values.json");

  const monsterParsed = JSON.parse(await readFile(monsterPath, "utf8"));
  const marketParsed = JSON.parse(await readFile(marketPath, "utf8"));

  if (!Array.isArray(monsterParsed.records) || !Array.isArray(marketParsed.records)) {
    throw new Error("content cross-check failed: monster or market records are invalid");
  }

  const marketKeys = new Set(marketParsed.records.map((record) => record.itemKey).filter((value) => typeof value === "string"));

  for (const record of monsterParsed.records) {
    const recordId = record.id ?? "<unknown>";
    for (const drop of record.drops ?? []) {
      if (!marketKeys.has(drop.itemKey)) {
        throw new Error(`packages/content/base/world/monsters.json drop itemKey '${drop.itemKey}' missing market item value on record ${recordId}`);
      }
    }
    for (const loot of record.loot ?? []) {
      if (!marketKeys.has(loot.itemKey)) {
        throw new Error(`packages/content/base/world/monsters.json loot itemKey '${loot.itemKey}' missing market item value on record ${recordId}`);
      }
    }
  }
}

async function validateTravelNetworksAgainstWorldData() {
  const travelPath = path.join(ROOT, "packages/content/base/world/travel_networks.json");
  const worldMapPath = path.join(ROOT, "packages/content/base/world/world_maps.json");
  const settlementPath = path.join(ROOT, "packages/content/base/world/settlements.json");
  const hexPath = path.join(ROOT, "packages/content/base/world/world_hexes.json");
  const edgePath = path.join(ROOT, "packages/content/base/world/world_hex_edges.json");

  const travelParsed = JSON.parse(await readFile(travelPath, "utf8"));
  const worldMapParsed = JSON.parse(await readFile(worldMapPath, "utf8"));
  const settlementParsed = JSON.parse(await readFile(settlementPath, "utf8"));
  const hexParsed = JSON.parse(await readFile(hexPath, "utf8"));
  const edgeParsed = JSON.parse(await readFile(edgePath, "utf8"));

  if (
    !Array.isArray(travelParsed.records) ||
    !Array.isArray(worldMapParsed.records) ||
    !Array.isArray(settlementParsed.records) ||
    !Array.isArray(hexParsed.records) ||
    !Array.isArray(edgeParsed.records)
  ) {
    throw new Error("content cross-check failed: travel network dependencies are invalid");
  }

  const worldMapsById = new Map();
  for (const record of worldMapParsed.records) {
    if (typeof record.id === "string") {
      worldMapsById.set(record.id, record);
    }
  }

  const settlementsById = new Map();
  for (const record of settlementParsed.records) {
    if (typeof record.id === "string") {
      settlementsById.set(record.id, record);
    }
  }

  const hexesById = new Map();
  for (const record of hexParsed.records) {
    if (typeof record.id === "string") {
      hexesById.set(record.id, record);
    }
  }

  const edgesById = new Map();
  for (const record of edgeParsed.records) {
    if (typeof record.id === "string") {
      edgesById.set(record.id, record);
    }
  }

  for (const record of travelParsed.records) {
    const recordId = record.id ?? "<unknown>";
    if (record.mapId !== undefined && !worldMapsById.has(record.mapId)) {
      throw new Error(`packages/content/base/world/travel_networks.json mapId '${record.mapId}' missing on record ${recordId}`);
    }

    const modeIds = new Set((record.modeProfiles ?? []).map((entry) => entry.id).filter((value) => typeof value === "string"));
    const coastalIdentityPattern = /\b(coastal|port|harbor|quay|anchorage|haven|estuary)\b/i;
    const isCoastalSettlement = (settlement) => {
      if (!settlement || (settlement.infrastructureProfile?.harborTier ?? 0) < 1) {
        return false;
      }

      const siteClass = settlement.siteClass ?? "surface";
      if (siteClass === "subterranean") {
        return false;
      }

      const routeAccess = settlement.tradeDependencyProfile?.routeAccess ?? {};
      return (
        siteClass === "underwater" ||
        (settlement.identityTags ?? []).some(
          (tag) => typeof tag === "string" && coastalIdentityPattern.test(tag.replace(/[_-]+/g, " "))
        ) ||
        (routeAccess.coastal ?? 0) >= 0.7 ||
        (routeAccess.seaLane ?? 0) >= 0.7
      );
    };

    const validateRouteRefs = (pathRecord, fieldPrefix) => {
      if (pathRecord.distanceMiles < 1) {
        throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix}.distanceMiles must be positive on record ${recordId}`);
      }

      const fromSettlement = settlementsById.get(pathRecord.fromSettlementId);
      const toSettlement = settlementsById.get(pathRecord.toSettlementId);
      if (!fromSettlement) {
        throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} missing fromSettlementId '${pathRecord.fromSettlementId}' on record ${recordId}`);
      }
      if (!toSettlement) {
        throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} missing toSettlementId '${pathRecord.toSettlementId}' on record ${recordId}`);
      }

      for (const modeId of pathRecord.availableModeIds ?? []) {
        if (!modeIds.has(modeId)) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix}.availableModeIds '${modeId}' missing in modeProfiles on record ${recordId}`);
        }
      }
      for (const estimate of pathRecord.travelTimeEstimates ?? []) {
        if (!modeIds.has(estimate.modeId)) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix}.travelTimeEstimates mode '${estimate.modeId}' missing in modeProfiles on record ${recordId}`);
        }
      }

      const orderedHexIds = Array.isArray(pathRecord.orderedHexIds) ? pathRecord.orderedHexIds : [];
      const edgeIds = Array.isArray(pathRecord.edgeIds) ? pathRecord.edgeIds : [];
      if (orderedHexIds.length === 0 && edgeIds.length === 0) {
        throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} must provide orderedHexIds or edgeIds on record ${recordId}`);
      }

      for (const hexId of orderedHexIds) {
        if (!hexesById.has(hexId)) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} orderedHexId '${hexId}' missing on record ${recordId}`);
        }
      }
      for (const edgeId of edgeIds) {
        if (!edgesById.has(edgeId)) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} edgeId '${edgeId}' missing on record ${recordId}`);
        }
      }

      if (orderedHexIds.length === 1 && pathRecord.intraHexDistanceKm !== undefined) {
        if (fromSettlement.hexAnchorId !== orderedHexIds[0] || toSettlement.hexAnchorId !== orderedHexIds[0]) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} intraHexDistanceKm must remain within the endpoint hex anchor on record ${recordId}`);
        }
      } else if (orderedHexIds.length > 0) {
        if (orderedHexIds[0] !== fromSettlement.hexAnchorId) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} first orderedHexId must match fromSettlementId hexAnchorId on record ${recordId}`);
        }
        if (orderedHexIds[orderedHexIds.length - 1] !== toSettlement.hexAnchorId) {
          throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} last orderedHexId must match toSettlementId hexAnchorId on record ${recordId}`);
        }
      }

      if (edgeIds.length > 0 && orderedHexIds.length >= 2 && edgeIds.length !== orderedHexIds.length - 1) {
        throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} edgeIds count must match orderedHexIds transitions on record ${recordId}`);
      }
      if (edgeIds.length > 0 && orderedHexIds.length >= 2) {
        for (let index = 0; index < edgeIds.length; index += 1) {
          const edge = edgesById.get(edgeIds[index]);
          const fromHexId = orderedHexIds[index];
          const toHexId = orderedHexIds[index + 1];
          const connects =
            (edge.fromHexId === fromHexId && edge.toHexId === toHexId) ||
            (edge.fromHexId === toHexId && edge.toHexId === fromHexId);
          if (!connects) {
            throw new Error(`packages/content/base/world/travel_networks.json ${fieldPrefix} edgeId '${edge.id}' must connect orderedHexIds '${fromHexId}' and '${toHexId}' on record ${recordId}`);
          }
        }
      }
    };

    for (const route of record.routeRecords ?? []) {
      const fromSettlement = settlementsById.get(route.fromSettlementId);
      const toSettlement = settlementsById.get(route.toSettlementId);
      if (!fromSettlement) {
        throw new Error(`packages/content/base/world/travel_networks.json route ${route.id} missing fromSettlementId '${route.fromSettlementId}' on record ${recordId}`);
      }
      if (!toSettlement) {
        throw new Error(`packages/content/base/world/travel_networks.json route ${route.id} missing toSettlementId '${route.toSettlementId}' on record ${recordId}`);
      }
      validateRouteRefs(route, `route ${route.id}`);

      if (route.routeClass === "coastal_lane") {
        if (!isCoastalSettlement(fromSettlement)) {
          throw new Error(`packages/content/base/world/travel_networks.json route ${route.id} fromSettlementId '${route.fromSettlementId}' must be a coastal harbor settlement on record ${recordId}`);
        }
        if (!isCoastalSettlement(toSettlement)) {
          throw new Error(`packages/content/base/world/travel_networks.json route ${route.id} toSettlementId '${route.toSettlementId}' must be a coastal harbor settlement on record ${recordId}`);
        }
      }
    }

    for (const lane of record.interPortShipRoutes ?? []) {
      const fromSettlement = settlementsById.get(lane.fromSettlementId);
      const toSettlement = settlementsById.get(lane.toSettlementId);
      if (!fromSettlement) {
        throw new Error(`packages/content/base/world/travel_networks.json lane ${lane.id} missing fromSettlementId '${lane.fromSettlementId}' on record ${recordId}`);
      }
      if (!toSettlement) {
        throw new Error(`packages/content/base/world/travel_networks.json lane ${lane.id} missing toSettlementId '${lane.toSettlementId}' on record ${recordId}`);
      }
      if (!isCoastalSettlement(fromSettlement)) {
        throw new Error(`packages/content/base/world/travel_networks.json lane ${lane.id} fromSettlementId '${lane.fromSettlementId}' must be a coastal harbor settlement on record ${recordId}`);
      }
      if (!isCoastalSettlement(toSettlement)) {
        throw new Error(`packages/content/base/world/travel_networks.json lane ${lane.id} toSettlementId '${lane.toSettlementId}' must be a coastal harbor settlement on record ${recordId}`);
      }
      validateRouteRefs(lane, `lane ${lane.id}`);

      for (const regionId of lane.seaRegionIds ?? []) {
        const regionExists = worldMapParsed.records.some((worldMap) => (worldMap.oceanRegionIds ?? []).includes(regionId));
        if (!regionExists) {
          throw new Error(`packages/content/base/world/travel_networks.json lane ${lane.id} seaRegionId '${regionId}' missing on record ${recordId}`);
        }
      }
    }
  }
}

async function validateTransportProfilesAgainstWorldData() {
  const transportPath = path.join(ROOT, "packages/content/base/world/transport_profiles.json");
  const travelPath = path.join(ROOT, "packages/content/base/world/travel_networks.json");

  const transportParsed = JSON.parse(await readFile(transportPath, "utf8"));
  const travelParsed = JSON.parse(await readFile(travelPath, "utf8"));

  if (!Array.isArray(transportParsed.records) || !Array.isArray(travelParsed.records)) {
    throw new Error("content cross-check failed: transport profile dependencies are invalid");
  }

  const travelModeIds = new Set(
    travelParsed.records
      .flatMap((record) => record.modeProfiles ?? [])
      .map((entry) => entry.id)
      .filter((value) => typeof value === "string")
  );

  for (const record of transportParsed.records) {
    const recordId = record.id ?? "<unknown>";
    const vehicleIds = new Set((record.vehicleProfiles ?? []).map((entry) => entry.id));
    for (const vehicle of record.vehicleProfiles ?? []) {
      if (!travelModeIds.has(vehicle.routeModeId)) {
        throw new Error(`packages/content/base/world/transport_profiles.json vehicle '${vehicle.id}' references missing routeModeId '${vehicle.routeModeId}' on record ${recordId}`);
      }
      if (vehicle.transportType === "vehicle" && !["travel_mode.wagon", "travel_mode.pack_animal"].includes(vehicle.routeModeId)) {
        throw new Error(`packages/content/base/world/transport_profiles.json land vehicle '${vehicle.id}' must use wagon or pack-animal travel modes on record ${recordId}`);
      }
      if (vehicle.transportType === "ship" && !["travel_mode.river_craft", "travel_mode.sea_vessel"].includes(vehicle.routeModeId)) {
        throw new Error(`packages/content/base/world/transport_profiles.json ship '${vehicle.id}' must use water travel modes on record ${recordId}`);
      }
      if (vehicleIds.has(vehicle.requiredHarnessId) && vehicle.requiredHarnessId !== null) {
        throw new Error(`packages/content/base/world/transport_profiles.json vehicle '${vehicle.id}' requiredHarnessId cannot point at a vehicle id on record ${recordId}`);
      }
    }
  }
}

async function main() {
  for (const check of checks) {
    await validateFile(check);
  }

  await validateFloraOutputsAgainstItemIdentitySpace();
  await validateFaunaProductsAgainstMarketKeys();
  await validateCanonicalCommodityItemsAgainstMarketKeys();
  await validateTierOneCanonicalItemCoverage();
  await validateWorkplaceAbstractionSeparation();
  await validateMeatCutStandardsAgainstMarketKeys();
  await validateInfrastructureAgainstWorkplaces();
  await validateBuildingsAgainstWorkplaces();
  await validateWorldMapsAgainstRegions();
  await validateWorldMapFeaturesAgainstWorldData();
  await validateRegionalEcologyAgainstWorldData();
  await validateInstitutionalMagicAgainstWorldData();
  await validateRegionLocalitiesAgainstWorldData();
  await validateSettlementsAgainstRegions();
  await validateQuestTemplatesAgainstWorldData();
  await validateQuestArchetypesAgainstWorldData();
  await validateQuestDefinitionsAgainstWorldData();
  await validatePlayerContentAgainstDependencies();
  await validateCombatFoundationAgainstDependencies();
  await validateMonstersAgainstMarketValues();
  await validateTravelNetworksAgainstWorldData();
  await validateTransportProfilesAgainstWorldData();

  console.log(`content-lint: ok (${checks.length} files checked)`);
}

main().catch((error) => {
  console.error("content-lint: failed", error.message);
  process.exitCode = 1;
});


















