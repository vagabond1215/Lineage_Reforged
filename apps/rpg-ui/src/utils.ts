import type { TagTone } from './types';

export function matchesQuery(
  query: string,
  ...values: Array<string | string[] | undefined | null>
): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return values
    .flatMap((value) => {
      if (typeof value === 'string') {
        return [value];
      }

      if (Array.isArray(value)) {
        return value;
      }

      return [];
    })
    .some((value) => value.toLowerCase().includes(normalized));
}

export function toneClasses(tone: TagTone = 'neutral'): string {
  switch (tone) {
    case 'accent':
      return 'border-white/15 bg-white/8 text-white';
    case 'success':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200';
    case 'warning':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-200';
    case 'danger':
      return 'border-rose-400/20 bg-rose-400/10 text-rose-200';
    default:
      return 'border-white/10 bg-white/5 text-slate-200';
  }
}
