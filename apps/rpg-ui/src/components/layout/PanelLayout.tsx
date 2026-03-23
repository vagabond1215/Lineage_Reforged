import type { ReactNode } from 'react';

type PanelLayoutProps = {
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  detailPanel: ReactNode;
};

export function PanelLayout({ leftSidebar, mainContent, detailPanel }: PanelLayoutProps) {
  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <div className="min-h-0">{leftSidebar}</div>
      <div className="min-h-0">{mainContent}</div>
      <div className="min-h-0">{detailPanel}</div>
    </div>
  );
}
