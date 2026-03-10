# Slug Conventions

Canonical record slugs are gameplay-first identifiers for database variables and cross-system references.

Rules:

- format: lowercase snake case (`^[a-z0-9]+(?:_[a-z0-9]+)*$`)
- scope: unique within a dataset file (and preferably unique within a domain)
- naming: avoid Earth region qualifiers in canonical names and slugs
- aliases: keep alternate names in `aliases` while preserving one canonical slug

Examples:

- good: `bison`, `blackberry`, `iron_ore`
- avoid: `american_bison`, `oregon_blackberry`