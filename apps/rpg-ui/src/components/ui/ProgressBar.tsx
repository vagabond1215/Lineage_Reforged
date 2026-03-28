type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color: string;
};

export function ProgressBar({ label, value, max, color }: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className="relative min-w-[170px]" aria-label={label}>
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
