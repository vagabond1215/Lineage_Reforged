import type { GameShellNotice } from '../state.js';

type NoticeBannerProps = {
  notice: GameShellNotice;
  onDismiss?: () => void;
};

const toneClasses: Record<
  GameShellNotice['tone'],
  { standard: string; compact: string; dismiss: string; text: string; shadow?: string }
> = {
  accent: {
    standard: 'border-[color:var(--color-tone-accent-border)] bg-[color:var(--color-tone-accent-bg)]',
    compact: 'border-[color:var(--color-tone-accent-border)] bg-[color:var(--color-tone-accent-bg)]',
    dismiss:
      'border-[color:var(--color-tone-accent-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-tone-accent-text)] hover:bg-[color:var(--color-surface-selected)]',
    text: 'text-[color:var(--color-tone-accent-text)]'
  },
  success: {
    standard: 'border-[color:var(--color-tone-success-border)] bg-[color:var(--color-tone-success-bg)]',
    compact: 'border-[color:var(--color-tone-success-border)] bg-[color:var(--color-tone-success-bg)]',
    dismiss:
      'border-[color:var(--color-tone-success-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-tone-success-text)] hover:bg-[color:var(--color-surface-selected)]',
    text: 'text-[color:var(--color-tone-success-text)]'
  },
  warning: {
    standard: 'border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)]',
    compact: 'border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)]',
    dismiss:
      'border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-tone-warning-text)] hover:bg-[color:var(--color-surface-selected)]',
    text: 'text-[color:var(--color-tone-warning-text)]'
  },
  neutral: {
    standard: 'border-[color:var(--color-tone-neutral-border)] bg-[color:var(--color-tone-neutral-bg)]',
    compact: 'border-[color:var(--color-tone-neutral-border)] bg-[color:var(--color-tone-neutral-bg)]',
    dismiss:
      'border-[color:var(--color-tone-neutral-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-tone-neutral-text)] hover:bg-[color:var(--color-surface-selected)]',
    text: 'text-[color:var(--color-tone-neutral-text)]'
  },
  danger: {
    standard: 'border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)]',
    compact: 'border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)]',
    dismiss:
      'border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-tone-danger-text)] hover:bg-[color:var(--color-surface-selected)]',
    text: 'text-[color:var(--color-tone-danger-text)]'
  }
};

export function NoticeBanner({ notice, onDismiss }: NoticeBannerProps) {
  const compact = notice.compact === true;
  const palette = toneClasses[notice.tone];
  const message = notice.message ?? notice.detail ?? notice.title;
  const shadowClass =
    compact && palette.shadow
      ? palette.shadow
      : 'shadow-[0_18px_34px_rgba(15,23,42,0.12)]';

  return (
    <div
      className={`rounded-lg border ${shadowClass} ${
        compact ? 'px-4 py-2.5' : 'px-4 py-3'
      } ${compact ? palette.compact : palette.standard}`}
    >
      <div className={`flex justify-between gap-4 ${compact ? 'items-center' : 'items-start'}`}>
        <div className="min-w-0 flex-1">
          {compact ? (
            <div className={`truncate text-sm ${palette.text}`}>{message}</div>
          ) : (
            <>
              <div className="text-base font-semibold text-[color:var(--color-text-strong)]">
                {notice.title}
              </div>
              <div className="mt-1 text-sm text-[color:var(--color-text-soft)]">{notice.detail}</div>
            </>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] transition ${palette.dismiss}`}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
