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

CREATE INDEX IF NOT EXISTS idx_civ_workplaces_category ON civ_workplaces(category);