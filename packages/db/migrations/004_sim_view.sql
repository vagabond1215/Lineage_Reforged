-- Cross-domain read model database and views.
-- A real build pipeline will attach domain DBs and materialize query-optimized views.

CREATE TABLE IF NOT EXISTS sim_build_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR REPLACE INTO sim_build_metadata (key, value)
VALUES
  ('schema_version', '0.1.0'),
  ('description', 'Merged read model for cross-domain lookups');