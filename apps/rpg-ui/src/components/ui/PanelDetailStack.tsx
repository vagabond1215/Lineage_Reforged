import type { DetailGroup } from '../../types';
import { Card } from './Card';
import { DetailCard } from './DetailCard';

type DetailCardData = {
  title: string;
  summary: string;
  groups: DetailGroup[];
};

type PanelDetailStackProps = {
  accent: string;
  primary?: DetailCardData;
  sectionDetail?: DetailCardData;
  emptyTitle: string;
  emptyMessage: string;
};

export function PanelDetailStack({
  accent,
  primary,
  sectionDetail,
  emptyTitle,
  emptyMessage
}: PanelDetailStackProps) {
  return (
    <div className="panel-scroll h-full space-y-4 overflow-auto pr-1">
      {primary ? (
        <DetailCard
          accent={accent}
          title={primary.title}
          summary={primary.summary}
          groups={primary.groups}
          className=""
        />
      ) : (
        <Card title={emptyTitle} accent={accent}>
          <p className="text-sm text-slate-400">{emptyMessage}</p>
        </Card>
      )}
      {sectionDetail && (
        <DetailCard
          accent={accent}
          title={sectionDetail.title}
          summary={sectionDetail.summary}
          groups={sectionDetail.groups}
          className=""
        />
      )}
    </div>
  );
}
