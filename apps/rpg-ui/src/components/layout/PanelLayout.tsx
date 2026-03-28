import { useState, type ReactNode } from 'react';
import { Icon } from '../icons';

type PanelLayoutProps = {
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  detailPanel: ReactNode;
};

export function PanelLayout({ leftSidebar, mainContent, detailPanel }: PanelLayoutProps) {
  const [detailOpen, setDetailOpen] = useState(true);

  return (
    <div className="relative h-full min-h-0 pr-7">
      <div
        className={`grid h-full min-h-0 gap-4 ${
          detailOpen
            ? 'xl:grid-cols-[220px_minmax(0,1fr)_320px]'
            : 'xl:grid-cols-[220px_minmax(0,1fr)]'
        }`}
      >
        <div className="min-h-0">{leftSidebar}</div>
        <div className="min-h-0">{mainContent}</div>
        {detailOpen && <div className="min-h-0">{detailPanel}</div>}
      </div>
      <button
        type="button"
        onClick={() => setDetailOpen((current) => !current)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[color:var(--color-panel-strong)]/95 p-2.5 text-slate-200 shadow-panel transition hover:bg-white/10"
        aria-label={detailOpen ? 'Hide information pane' : 'Show information pane'}
      >
        <Icon name="info" className="h-5 w-5" />
      </button>
    </div>
  );
}
