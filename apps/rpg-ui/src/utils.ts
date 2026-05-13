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
      return 'border-[color:var(--color-tone-accent-border)] bg-[color:var(--color-tone-accent-bg)] text-[color:var(--color-tone-accent-text)]';
    case 'success':
      return 'border-[color:var(--color-tone-success-border)] bg-[color:var(--color-tone-success-bg)] text-[color:var(--color-tone-success-text)]';
    case 'warning':
      return 'border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] text-[color:var(--color-tone-warning-text)]';
    case 'danger':
      return 'border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)] text-[color:var(--color-tone-danger-text)]';
    default:
      return 'border-[color:var(--color-tone-neutral-border)] bg-[color:var(--color-tone-neutral-bg)] text-[color:var(--color-tone-neutral-text)]';
  }
}
