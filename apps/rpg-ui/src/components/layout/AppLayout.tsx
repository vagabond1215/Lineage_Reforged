import type { ReactNode } from 'react';
import '../../styles/mobile-shell.css';

type AppLayoutProps = {
  topBar: ReactNode;
  sideNav: ReactNode;
  activePanel: ReactNode;
};

export function AppLayout({ topBar, sideNav, activePanel }: AppLayoutProps) {
  return (
    <div className="gameplay-shell flex h-screen flex-col overflow-hidden">
      {topBar}
      <div className="min-h-0 flex-1 px-2 pt-1 xl:px-4 xl:pb-4 xl:pt-4">
        <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-1 xl:grid-cols-[180px_minmax(0,1fr)] xl:grid-rows-none xl:gap-4">
          <div className="min-h-0 min-w-0">{sideNav}</div>
          <div className="min-h-0 min-w-0">{activePanel}</div>
        </div>
      </div>
    </div>
  );
}
