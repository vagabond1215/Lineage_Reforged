# Climate

Core fields:

- calendar alignment: month list + season set are defined in `packages/content/base/world/calendar.json`; runtime month->season mapping currently lives in `packages/shared/time/src/index.ts`
- profile identity: climate profile id + display name
- season lengths: six values for Winter/Thaw/Spring/Summer/Harvest/Withering
- temperature variance: avg/high/low multipliers
- temperature range template: `lowLimit` (L), `highLimit` (H), and `range` (R) where `R = H - L`
- seasonal temperature profiles: explicit low/high temperature values plus fixed seasonal offset ratios

Seasonal profile formula template:

| Season | Low Formula | High Formula |
| --- | --- | --- |
| Winter | `L + 0.00R` | `L + 0.30R` |
| Thaw | `L + 0.10R` | `L + 0.55R` |
| Spring | `L + 0.25R` | `L + 0.75R` |
| Summer | `L + 0.55R` | `L + 1.00R` |
| Harvest | `L + 0.40R` | `L + 0.85R` |
| Withering | `L + 0.15R` | `L + 0.60R` |
