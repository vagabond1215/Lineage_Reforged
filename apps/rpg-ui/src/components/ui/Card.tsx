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
        '--forged-accent': accent
      } as CSSProperties
    : undefined;

  const mergedStyle: CSSProperties | undefined =
    accentStyle || style
      ? {
          ...accentStyle,
          ...style
      }
    : undefined;

  return (
    <section
      className={`forged-card p-4 ${className}`}
      style={mergedStyle}
    >
      {(title || eyebrow || actions) && (
        <header className="forged-card-header mb-4 flex items-start justify-between gap-3">
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
