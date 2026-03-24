import type { GameShellNotice } from '../state.js';

type NoticeBannerProps = {
  notice: GameShellNotice;
  onDismiss?: () => void;
};

const toneClasses: Record<GameShellNotice['tone'], string> = {
  accent: 'border-amber-300/20 bg-amber-200/10 text-amber-50',
  success: 'border-emerald-300/20 bg-emerald-200/10 text-emerald-50',
  warning: 'border-orange-300/20 bg-orange-200/10 text-orange-50',
  neutral: 'border-slate-300/15 bg-slate-200/10 text-slate-100',
  danger: 'border-rose-300/20 bg-rose-200/10 text-rose-50'
};

export function NoticeBanner({ notice, onDismiss }: NoticeBannerProps) {
  return (
    <div
      className={`rounded-[24px] border px-4 py-3 shadow-panel backdrop-blur-xl ${toneClasses[notice.tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/60">
            {notice.tone}
          </div>
          <div className="mt-1 text-base font-semibold">{notice.title}</div>
          <div className="mt-1 text-sm text-white/80">{notice.detail}</div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
