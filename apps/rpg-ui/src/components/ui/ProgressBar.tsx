type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color: string;
  visualState?: 'normal' | 'warning' | 'critical';
};

export function ProgressBar({
  label,
  value,
  max,
  color,
  visualState = 'normal'
}: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));
  const wrapperClass =
    visualState === 'critical'
      ? 'shadow-[0_0_0_1px_rgba(251,113,133,0.22),0_8px_20px_rgba(244,63,94,0.12)]'
      : visualState === 'warning'
        ? 'saturate-[0.72]'
        : '';

  return (
    <div className={`relative min-w-[170px] transition ${wrapperClass}`} aria-label={label}>
      <div className="h-8 overflow-hidden rounded-full border border-white/10 bg-black/25">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color} 0%, color-mix(in srgb, ${color} 62%, white) 100%)`
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
        {value}/{max}
      </div>
    </div>
  );
}
