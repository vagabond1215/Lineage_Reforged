CREATE TABLE IF NOT EXISTS player_attributes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  default_value REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS player_equipment_slots (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  max_items INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS player_abilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scaling_attribute TEXT NOT NULL,
  cooldown_ticks INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS player_spells (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  mana_cost INTEGER NOT NULL,
  scaling_attribute TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_traits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  effects_json TEXT NOT NULL
);