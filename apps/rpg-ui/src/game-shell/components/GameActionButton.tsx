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
      ? 'border-[color:var(--color-action-primary)] bg-[color:var(--color-action-primary)] text-[color:var(--color-action-primary-text)] hover:brightness-[1.04]'
      : tone === 'warning'
        ? 'border-[color:var(--color-action-warning)] bg-[color:var(--color-action-warning)] text-[color:var(--color-action-warning-text)] hover:brightness-[1.04]'
        : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-selected)]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${toneClass} disabled:cursor-not-allowed disabled:border-[color:var(--color-border-soft)] disabled:bg-[color:var(--color-surface-muted)] disabled:text-[color:var(--color-text-muted)] disabled:opacity-100`}
    >
      {label}
    </button>
  );
}
