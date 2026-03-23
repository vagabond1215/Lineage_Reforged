CREATE TABLE IF NOT EXISTS civ_extraction_methods (
  id TEXT PRIMARY KEY,
  resource_domain TEXT NOT NULL,
  method TEXT NOT NULL,
  output_multiplier REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS civ_workplaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  input_tags_json TEXT NOT NULL,
  output_tags_json TEXT NOT NULL,
  labor_slots INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS civ_production_chains (
  id TEXT PRIMARY KEY,
  stages_json TEXT NOT NULL,
  primary_output TEXT NOT NULL,
  byproducts_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS civ_economy_rules (
  id TEXT PRIMARY KEY,
  price_floor REAL NOT NULL,
  price_ceiling REAL NOT NULL,
  volatility REAL NOT NULL,
  elasticity REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS civ_quest_templates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  issuing_guild_types_json TEXT NOT NULL,
  allow_adventurers_fallback INTEGER NOT NULL,
  generation_source TEXT NOT NULL,
  target_item_keys_json TEXT NOT NULL,
  target_settlement_tags_json TEXT NOT NULL,
  monster_ids_json TEXT NOT NULL,
  minimum_quantity INTEGER NOT NULL,
  minimum_shortfall_per_tick REAL NOT NULL,
  minimum_trade_surplus_per_tick REAL NOT NULL,
  reward_profile_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS civ_quest_definitions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  giver_json TEXT NOT NULL,
  requirements_json TEXT NOT NULL,
  scheduling_json TEXT NOT NULL,
  classification_json TEXT NOT NULL,
  deployment_json TEXT NOT NULL,
  logistics_json TEXT NOT NULL,
  rewards_json TEXT NOT NULL,
  misc_notes_json TEXT NOT NULL DEFAULT '[]',
  action_tree_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS civ_quest_archetypes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  quest_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  typical_giver_types_json TEXT NOT NULL,
  common_guild_types_json TEXT NOT NULL,
  encounter_monster_ids_json TEXT NOT NULL,
  baseline_requirements_json TEXT NOT NULL,
  classification_json TEXT NOT NULL,
  deployment_json TEXT NOT NULL,
  logistics_json TEXT NOT NULL,
  outcome_metrics_json TEXT NOT NULL,
  failure_states_json TEXT NOT NULL,
  reward_drivers_json TEXT NOT NULL,
  scaling_axes_json TEXT NOT NULL,
  action_tree_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_civ_workplaces_category ON civ_workplaces(category);
CREATE INDEX IF NOT EXISTS idx_civ_quest_templates_category ON civ_quest_templates(category);
CREATE INDEX IF NOT EXISTS idx_civ_quest_definitions_category ON civ_quest_definitions(category);
CREATE INDEX IF NOT EXISTS idx_civ_quest_archetypes_type ON civ_quest_archetypes(quest_type);
