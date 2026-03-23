CREATE TABLE IF NOT EXISTS player_progression_models (
  id TEXT PRIMARY KEY,
  entity_kind TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  config_json TEXT NOT NULL,
  source_reference TEXT
);

CREATE TABLE IF NOT EXISTS player_attributes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL,
  category TEXT NOT NULL,
  default_value REAL NOT NULL,
  description TEXT NOT NULL,
  derived_stats_json TEXT NOT NULL DEFAULT '[]',
  skill_affinities_json TEXT NOT NULL DEFAULT '[]',
  resource_influence_json TEXT NOT NULL DEFAULT '{}',
  tags_json TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS player_resource_formula_bindings (
  resource_id TEXT PRIMARY KEY,
  driving_attributes_json TEXT NOT NULL,
  secondary_attributes_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS player_equipment_slots (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  max_items INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS player_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  family TEXT NOT NULL,
  default_rank INTEGER NOT NULL,
  default_cap INTEGER NOT NULL,
  governing_attributes_json TEXT NOT NULL,
  progression_model_id TEXT NOT NULL,
  description TEXT NOT NULL,
  gain_sources_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  source_reference TEXT
);

CREATE TABLE IF NOT EXISTS player_abilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ability_type TEXT NOT NULL,
  family TEXT NOT NULL,
  resource_model_id TEXT NOT NULL,
  scaling_attribute TEXT NOT NULL,
  scaling_skill_id TEXT,
  required_weapon_skill_id TEXT,
  required_skill_rank INTEGER,
  cooldown_ticks INTEGER NOT NULL,
  stamina_cost INTEGER NOT NULL,
  description TEXT NOT NULL,
  unlock_rules_json TEXT NOT NULL DEFAULT '[]',
  effect_profile_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  source_reference TEXT
);

CREATE TABLE IF NOT EXISTS player_spells (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  discipline TEXT NOT NULL,
  element TEXT,
  mana_cost INTEGER NOT NULL,
  scaling_attribute TEXT NOT NULL,
  governing_skill_id TEXT NOT NULL,
  progression_model_id TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,
  power_rating REAL NOT NULL DEFAULT 0,
  effect_complexity REAL NOT NULL DEFAULT 0,
  required_level INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  effect_tags_json TEXT NOT NULL DEFAULT '[]',
  target_profile TEXT,
  source_reference TEXT
);

CREATE TABLE IF NOT EXISTS player_traits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  source_type TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  stacking_rule TEXT NOT NULL,
  unlock_rules_json TEXT NOT NULL DEFAULT '[]',
  effects_json TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  source_reference TEXT
);

CREATE TABLE IF NOT EXISTS player_resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  base_current REAL NOT NULL,
  base_max REAL NOT NULL
);
