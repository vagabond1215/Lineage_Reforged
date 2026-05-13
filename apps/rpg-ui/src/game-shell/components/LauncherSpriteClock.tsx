import type { CSSProperties } from 'react';

type LauncherSpriteClockProps = {
  clockLabel: string;
  clockTitle: string;
  className?: string;
};

type ClockGlyphId =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | ':'
  | 'AM'
  | 'PM';

type ClockGlyphRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CLOCK_SPRITE_URL = '/clock/number-tile-dark-glyphs.png';
const CLOCK_SPRITE_WIDTH = 1448;
const CLOCK_SPRITE_HEIGHT = 1086;
const CLOCK_SPRITE_SCALE = 0.165;

const CLOCK_GLYPHS: Record<ClockGlyphId, ClockGlyphRect> = {
  '0': { x: 61, y: 76, width: 192, height: 232 },
  '1': { x: 343, y: 73, width: 192, height: 232 },
  '2': { x: 620, y: 76, width: 192, height: 232 },
  '3': { x: 912, y: 74, width: 192, height: 232 },
  '4': { x: 1189, y: 73, width: 192, height: 232 },
  '5': { x: 57, y: 426, width: 192, height: 232 },
  '6': { x: 342, y: 424, width: 192, height: 232 },
  '7': { x: 622, y: 426, width: 192, height: 232 },
  '8': { x: 908, y: 425, width: 192, height: 232 },
  '9': { x: 1194, y: 426, width: 192, height: 232 },
  ':': { x: 122, y: 758, width: 64, height: 232 },
  AM: { x: 316, y: 763, width: 248, height: 232 },
  PM: { x: 598, y: 764, width: 248, height: 232 }
};

function normalizeMeridiem(value: string): ClockGlyphId | null {
  const normalized = value.replace(/\./g, '').toUpperCase();

  if (normalized === 'AM' || normalized === 'PM') {
    return normalized;
  }

  return null;
}

function parseClockGlyphs(clockLabel: string): ClockGlyphId[] | null {
  const normalized = clockLabel.trim();

  if (!normalized) {
    return null;
  }

  const [timePart = '', ...suffixParts] = normalized.split(/\s+/);
  const glyphs: ClockGlyphId[] = [];

  for (const character of timePart) {
    if (character in CLOCK_GLYPHS) {
      glyphs.push(character as ClockGlyphId);
      continue;
    }

    return null;
  }

  const suffix = suffixParts.join('');

  if (suffix) {
    const meridiem = normalizeMeridiem(suffix);

    if (!meridiem) {
      return null;
    }

    glyphs.push(meridiem);
  }

  return glyphs.length > 0 ? glyphs : null;
}

function buildGlyphStyle(glyph: ClockGlyphId): CSSProperties {
  const rect = CLOCK_GLYPHS[glyph];

  return {
    width: `${rect.width * CLOCK_SPRITE_SCALE}px`,
    height: `${rect.height * CLOCK_SPRITE_SCALE}px`,
    backgroundImage: `url("${CLOCK_SPRITE_URL}")`,
    backgroundSize: `${CLOCK_SPRITE_WIDTH * CLOCK_SPRITE_SCALE}px ${
      CLOCK_SPRITE_HEIGHT * CLOCK_SPRITE_SCALE
    }px`,
    backgroundPosition: `-${rect.x * CLOCK_SPRITE_SCALE}px -${
      rect.y * CLOCK_SPRITE_SCALE
    }px`
  };
}

export function LauncherSpriteClock({
  clockLabel,
  clockTitle,
  className = ''
}: LauncherSpriteClockProps) {
  const glyphs = parseClockGlyphs(clockLabel);
  const accessibleLabel = clockTitle || clockLabel;

  if (!glyphs) {
    return (
      <span
        className={`launcher-sprite-clock launcher-sprite-clock-fallback ${className}`}
        title={clockTitle}
        aria-label={accessibleLabel}
      >
        {clockLabel}
      </span>
    );
  }

  return (
    <span
      className={`launcher-sprite-clock ${className}`}
      title={clockTitle}
      aria-label={accessibleLabel}
    >
      <span className="sr-only">{clockLabel}</span>
      <span className="launcher-sprite-clock-glyphs" aria-hidden="true">
        {glyphs.map((glyph, index) => (
          <span
            key={`${glyph}.${index}`}
            className="launcher-sprite-clock-glyph"
            style={buildGlyphStyle(glyph)}
          />
        ))}
      </span>
    </span>
  );
}
