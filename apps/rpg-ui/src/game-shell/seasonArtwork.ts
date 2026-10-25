import type { SeasonName } from '../../../../packages/shared/types/src/index.js';
import { normalizeSeasonName } from '../../../../packages/shared/time/src/index.js';

const SEASON_ARTWORK: Record<SeasonName, string> = {
  Deepfrost: '/seasons/season-deepfrost.png',
  Thaw: '/seasons/season-thaw.png',
  Waking: '/seasons/season-waking.png',
  Swelter: '/seasons/season-swelter.png',
  Harvest: '/seasons/season-harvest.png',
  Withering: '/seasons/season-withering.png'
};

export function getSeasonArtworkUrl(value: string): string | null {
  const season = normalizeSeasonName(value);
  return season ? SEASON_ARTWORK[season] : null;
}
