export type TabId =
  | 'character'
  | 'world'
  | 'activity'
  | 'codex'
  | 'quests'
  | 'chronicle';

export type IconName =
  | 'character'
  | 'world'
  | 'activity'
  | 'codex'
  | 'quests'
  | 'chronicle'
  | 'bell'
  | 'search'
  | 'pin'
  | 'pinFilled'
  | 'mapPin'
  | 'clock'
  | 'coin'
  | 'heart'
  | 'bolt'
  | 'chevron'
  | 'lock'
  | 'filter'
  | 'queue'
  | 'plus'
  | 'minus'
  | 'star'
  | 'gear'
  | 'closeCircle'
  | 'trash'
  | 'arrowLeft'
  | 'menu'
  | 'sun'
  | 'moon'
  | 'dice'
  | 'info'
  | 'tree'
  | 'grain'
  | 'fruit'
  | 'vegetable'
  | 'animal';

export type TagTone = 'accent' | 'success' | 'warning' | 'neutral' | 'danger';

export type NavItem = {
  id: TabId;
  label: string;
  icon: IconName;
  accent: string;
  hint: string;
};

export type StatMeter = {
  label: string;
  current: number;
  max: number;
  color: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: TagTone;
};

export type SummaryMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type DetailEntry = {
  label: string;
  value: string;
  tone?: TagTone;
  tooltip?: string;
};

export type DetailGroup = {
  title: string;
  entries: DetailEntry[];
};

export type ListItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: string;
  description?: string;
  tags?: string[];
  locked?: boolean;
  category?: string;
  detailTitle?: string;
  detailSummary?: string;
  detailGroups?: DetailGroup[];
};

export type SidebarItem = {
  id: string;
  label: string;
  description?: string;
  count?: number;
};

export type OperationItem = {
  id: string;
  title: string;
  stage: string;
  progress: number;
  eta: string;
  owner: string;
  output: string;
  priority: 'Low' | 'Normal' | 'High';
};

export type MapLocation = {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'settlement' | 'ruin' | 'harbor' | 'fort';
  region: string;
  note: string;
  known: boolean;
};
