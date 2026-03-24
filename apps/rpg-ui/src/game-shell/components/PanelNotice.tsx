import type { GameShellNotice } from '../state.js';
import { toneClasses } from '../../utils';

type PanelNoticeProps = {
  notice: GameShellNotice;
};

export function PanelNotice({ notice }: PanelNoticeProps) {
  return (
    <div className={`rounded-[22px] border px-4 py-3 ${toneClasses(notice.tone)}`}>
      <div className="text-sm font-semibold">{notice.title}</div>
      <div className="mt-1 text-sm text-white/80">{notice.detail}</div>
    </div>
  );
}
