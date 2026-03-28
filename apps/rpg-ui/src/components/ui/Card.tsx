import type { CSSProperties, ReactNode } from 'react';

type CardProps = {
  title?: string;
  eyebrow?: string;
  accent?: string;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Card({
  title,
  eyebrow,
  accent,
  actions,
  className = '',
  style,
  children
}: CardProps) {
  const accentStyle: CSSProperties | undefined = accent
    ? {
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 30%, transparent), 0 24px 60px rgba(0, 0, 0, 0.34)`
      }
    : undefined;

  return (
    <section
      className={`rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-panel backdrop-blur-xl ${className}`}
      style={{ ...accentStyle, ...style }}
    >
      {(title || eyebrow || actions) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-muted-strong)]">
                {eyebrow}
              </p>
            )}
            {title && <h3 className="text-lg text-[color:var(--color-text-strong)]">{title}</h3>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
