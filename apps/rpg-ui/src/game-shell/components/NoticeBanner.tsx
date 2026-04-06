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
    standard: 'border-slate-400/55 bg-slate-600/88',
    compact: 'border-slate-700/70 bg-slate-600/95',
    dismiss:
      'border-slate-300/40 bg-slate-500/22 text-slate-100 hover:bg-slate-400/28',
    text: 'text-slate-100',
    shadow: 'shadow-[0_12px_24px_rgba(71,85,105,0.3)]'
  },
  success: {
    standard: 'border-emerald-400/45 bg-emerald-200/24',
    compact: 'border-emerald-500/45 bg-emerald-700/78',
    dismiss:
      'border-emerald-300/35 bg-emerald-500/20 text-emerald-50 hover:bg-emerald-400/28',
    text: 'text-emerald-50'
  },
  warning: {
    standard: 'border-orange-400/45 bg-orange-200/28',
    compact: 'border-orange-500/45 bg-orange-700/78',
    dismiss:
      'border-orange-300/35 bg-orange-500/20 text-orange-50 hover:bg-orange-400/28',
    text: 'text-orange-50'
  },
  neutral: {
    standard: 'border-slate-400/38 bg-slate-200/22',
    compact: 'border-slate-500/45 bg-slate-700/80',
    dismiss:
      'border-slate-300/35 bg-slate-500/20 text-slate-100 hover:bg-slate-400/28',
    text: 'text-slate-100'
  },
  danger: {
    standard: 'border-rose-400/45 bg-rose-200/24',
    compact: 'border-rose-500/45 bg-rose-700/78',
    dismiss:
      'border-rose-300/35 bg-rose-500/20 text-rose-50 hover:bg-rose-400/28',
    text: 'text-rose-50'
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
      className={`rounded-[24px] border ${shadowClass} backdrop-blur-xl ${
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
