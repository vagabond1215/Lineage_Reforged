type GameActionButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'neutral' | 'accent' | 'warning';
};

export function GameActionButton({
  label,
  onClick,
  disabled = false,
  tone = 'neutral'
}: GameActionButtonProps) {
  const toneClass =
    tone === 'accent'
      ? 'border-amber-300/25 bg-amber-200/10 text-amber-50 hover:bg-amber-200/15'
      : tone === 'warning'
        ? 'border-rose-300/20 bg-rose-200/10 text-rose-50 hover:bg-rose-200/15'
        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-4 py-2 text-sm transition ${toneClass} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}
