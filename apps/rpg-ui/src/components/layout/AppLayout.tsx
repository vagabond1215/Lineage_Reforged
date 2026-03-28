import type { ReactNode } from 'react';

type AppLayoutProps = {
  topBar: ReactNode;
  sideNav: ReactNode;
  activePanel: ReactNode;
};

export function AppLayout({ topBar, sideNav, activePanel }: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {topBar}
      <div className="min-h-0 flex-1 px-4 pb-4 pt-4">
        <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[180px_minmax(0,1fr)]">
          <div className="min-h-0">{sideNav}</div>
          <div className="min-h-0">{activePanel}</div>
        </div>
      </div>
    </div>
  );
}
