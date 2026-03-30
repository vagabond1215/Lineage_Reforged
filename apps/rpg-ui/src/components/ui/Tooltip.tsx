import type { ReactNode } from 'react';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
};

export function Tooltip({
  content,
  children,
  className = '',
  panelClassName = ''
}: TooltipProps) {
  return (
    <span className={`group/tooltip relative inline-flex items-center ${className}`}>
      {children}
      <span
        className={`pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-80 max-w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border bg-[color:var(--color-tooltip-bg)] px-3 py-2 text-xs leading-6 text-[color:var(--color-tooltip-text)] shadow-2xl group-hover/tooltip:block group-focus-within/tooltip:block ${panelClassName}`}
        style={{ borderColor: 'var(--color-tooltip-border)' }}
      >
        {content}
      </span>
    </span>
  );
}
