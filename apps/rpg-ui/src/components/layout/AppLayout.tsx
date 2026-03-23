import type { ReactNode } from 'react';

type AppLayoutProps = {
  topBar: ReactNode;
  sideNav: ReactNode;
  activePanel: ReactNode;
};

export function AppLayout({ topBar, sideNav, activePanel }: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col gap-4 p-4">
      {topBar}
      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
        <div className="min-h-0">{sideNav}</div>
        <div className="min-h-0">{activePanel}</div>
      </div>
    </div>
  );
}
