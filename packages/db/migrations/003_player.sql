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

CREATE TABLE IF NOT EXISTS player_progression_tracks (
  id TEXT PRIMARY KEY,
  track_type TEXT NOT NULL,
  rank_min INTEGER NOT NULL,
  rank_max INTEGER NOT NULL,
  bands_json TEXT NOT NULL,
  breakthrough_gate_ranks_json TEXT NOT NULL,
  gain_model_json TEXT NOT NULL,
  breakthrough_sources_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_knowledge_tracks (
  id TEXT PRIMARY KEY,
  knowledge_skill_id TEXT NOT NULL,
  spotting_skill_id TEXT NOT NULL,
  identify_skill_id TEXT NOT NULL,
  universal_support_skill_id TEXT NOT NULL,
  support_weights_json TEXT NOT NULL,
  identify_difficulty_json TEXT NOT NULL,
  auto_identify_thresholds_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_skill_effects (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  name TEXT NOT NULL,
  channels_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_trials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  associated_skill_id TEXT NOT NULL,
  threshold_to_pass REAL NOT NULL,
  progress REAL NOT NULL,
  max_potential REAL NOT NULL,
  checkpoints_json TEXT NOT NULL,
  rewards_json TEXT NOT NULL,
  penalties_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  layer TEXT NOT NULL,
  category TEXT NOT NULL,
  group_id TEXT NOT NULL,
  default_rank INTEGER NOT NULL,
  maximum_rank INTEGER NOT NULL,
  governing_attributes_json TEXT NOT NULL,
  progression_track_id TEXT NOT NULL,
  knowledge_track_id TEXT,
  effect_profile_id TEXT,
  description TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS player_abilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  activation_json TEXT NOT NULL,
  requirements_json TEXT NOT NULL,
  links_json TEXT NOT NULL,
  effects_json TEXT NOT NULL,
  effect_tags_json TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS player_spells (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  element TEXT,
  mana_cost INTEGER NOT NULL,
  cast_time_ticks INTEGER NOT NULL,
  governing_skill_id TEXT NOT NULL,
  scaling_attribute TEXT NOT NULL,
  effect_tags_json TEXT NOT NULL DEFAULT '[]',
  scaling_channels_json TEXT NOT NULL DEFAULT '[]',
  target_profile_json TEXT NOT NULL,
  effects_json TEXT NOT NULL,
  description TEXT NOT NULL
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
  modifiers_json TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS player_resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  base_current REAL NOT NULL,
  base_max REAL NOT NULL
);
