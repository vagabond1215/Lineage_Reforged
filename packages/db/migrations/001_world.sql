CREATE TABLE IF NOT EXISTS world_biomes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  climate_band TEXT NOT NULL,
  base_fertility REAL NOT NULL,
  hazards_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS world_habitats (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  biome_id TEXT NOT NULL,
  shape TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS world_flora (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  lifecycle TEXT NOT NULL,
  habitat_ids_json TEXT NOT NULL,
  harvest_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS world_fauna (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  aliases_json TEXT NOT NULL,
  type TEXT NOT NULL,
  diet TEXT NOT NULL,
  domesticatable INTEGER NOT NULL,
  danger_class TEXT NOT NULL,
  habitat_ids_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS world_minerals (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  aliases_json TEXT NOT NULL,
  tier INTEGER NOT NULL,
  deposit_forms_json TEXT NOT NULL,
  extraction_types_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_world_flora_type ON world_flora(type);
CREATE INDEX IF NOT EXISTS idx_world_flora_slug ON world_flora(slug);
CREATE INDEX IF NOT EXISTS idx_world_fauna_type ON world_fauna(type);
CREATE INDEX IF NOT EXISTS idx_world_fauna_slug ON world_fauna(slug);
CREATE INDEX IF NOT EXISTS idx_world_minerals_tier ON world_minerals(tier);
CREATE INDEX IF NOT EXISTS idx_world_minerals_slug ON world_minerals(slug);