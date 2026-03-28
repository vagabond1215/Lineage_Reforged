import type { ReactNode } from 'react';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
};

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-80 max-w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs leading-6 text-slate-200 shadow-2xl group-hover:block group-focus-within:block">
        {content}
      </span>
    </span>
  );
}
