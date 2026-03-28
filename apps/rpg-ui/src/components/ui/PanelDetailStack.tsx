import type { DetailGroup } from '../../types';
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
  sectionDetail
}: PanelDetailStackProps) {
  if (!primary && !sectionDetail) {
    return null;
  }

  return (
    <div className="panel-scroll h-full space-y-4 overflow-auto pr-1">
      {primary && (
        <DetailCard
          accent={accent}
          title={primary.title}
          summary={primary.summary}
          groups={primary.groups}
          className=""
        />
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
