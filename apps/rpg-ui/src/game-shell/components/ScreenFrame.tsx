import type { ReactNode } from 'react';
import { Card } from '../../components/ui/Card';
import type { GameShellNotice } from '../state.js';
import { NoticeBanner } from './NoticeBanner.js';

type ScreenFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  headerActions?: ReactNode;
  mainContent: ReactNode;
  sideContent?: ReactNode;
};

export function ScreenFrame({
  eyebrow,
  title,
  description,
  accent,
  notice,
  onDismissNotice,
  headerActions,
  mainContent,
  sideContent
}: ScreenFrameProps) {
  return (
    <div className="h-screen overflow-auto p-4 sm:p-6">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-4">
        <Card eyebrow={eyebrow} title={title} accent={accent} actions={headerActions}>
          <div className="max-w-3xl text-sm leading-7 text-slate-300">{description}</div>
        </Card>

        {notice && <NoticeBanner notice={notice} onDismiss={onDismissNotice} />}

        <div
          className={
            sideContent
              ? 'grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]'
              : 'flex-1'
          }
        >
          <div className="min-w-0">{mainContent}</div>
          {sideContent && <div className="min-w-0">{sideContent}</div>}
        </div>
      </div>
    </div>
  );
}
