type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color: string;
};

export function ProgressBar({ label, value, max, color }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="flex min-w-[150px] flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-400">
        <span>{label}</span>
        <span className="text-slate-200">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color} 0%, color-mix(in srgb, ${color} 62%, white) 100%)`
          }}
        />
      </div>
    </div>
  );
}
