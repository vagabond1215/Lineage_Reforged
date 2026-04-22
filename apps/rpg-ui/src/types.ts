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
export type BodyStateSeverity = 'normal' | 'warning' | 'critical';
export type BodyStateTrend = 'improving' | 'worsening' | 'stable';
export type BodyStateAlertLevel = 'soft' | 'medium' | 'hard';
export type StatMeterVisualState = 'normal' | 'warning' | 'critical';

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
  visualState?: StatMeterVisualState;
};

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: TagTone;
};

export type BodyStatePillViewModel = {
  id: 'energy' | 'hydration' | 'fatigue' | 'protein' | 'intoxication';
  label: string;
  severity: BodyStateSeverity;
  trend: BodyStateTrend;
  tooltip: string;
  emphasis?: BodyStateAlertLevel | null;
};

export type ConditionStripViewModel = {
  primary: BodyStatePillViewModel[];
  secondary: BodyStatePillViewModel[];
  collapsedLabel: string;
  expandedByDefault: boolean;
};

export type ReadinessIssueViewModel = {
  id: string;
  label: string;
  detail: string;
  severity: BodyStateSeverity;
};

export type RecommendedActionViewModel = {
  id: 'drink' | 'rest' | 'eat';
  label: 'Drink' | 'Rest' | 'Eat';
  detail: string;
};

export type ReadinessCardViewModel = {
  overallCondition: 'Ready' | 'Pressured' | 'Strained' | 'Compromised';
  staminaRegenLabel: 'Steady' | 'Slowed' | 'Poor' | 'Suppressed';
  recoveryLabel: 'Strong' | 'Fair' | 'Poor' | 'Impaired';
  primaryIssues: ReadinessIssueViewModel[];
  recommendedActions: RecommendedActionViewModel[];
};

export type RecoveryProjectionWindowViewModel = {
  id: 'now' | 'short' | 'medium';
  label: string;
  energy: string;
  fatigue: string;
};

export type RecoveryProjectionViewModel = {
  windows: RecoveryProjectionWindowViewModel[];
};

export type ConsumableEffectDeltaLabel =
  | 'Strong support'
  | 'Helpful'
  | 'Light support'
  | 'No major change'
  | 'Rises';

export type ConsumableEffectPreviewViewModel = {
  immediateEffects: {
    energy: ConsumableEffectDeltaLabel;
    protein: ConsumableEffectDeltaLabel;
    hydration: ConsumableEffectDeltaLabel;
    intoxication: ConsumableEffectDeltaLabel;
  };
  delayedRecovery: 'Boosts recovery' | 'Supports recovery' | 'Little recovery support' | 'May hinder recovery';
  contextTag: 'Good for hydration' | 'Best after heavy exertion' | 'Light meal' | 'Drink with care';
  highlighted: boolean;
  highlightLabel?: 'Recommended' | 'Useful now';
};

export type ActionOutcomeRiskTier = 'safe' | 'straining' | 'risky';

export type ActionOutcomePreviewViewModel = {
  energy: 'Recovery' | 'No major change' | 'Minor drain' | 'Moderate drain' | 'Heavy drain';
  hydration: 'Recovery' | 'No major change' | 'Minor drain' | 'Moderate drain' | 'Heavy drain';
  fatigue: 'Recovery' | 'No change' | 'Increase' | 'Heavy increase';
  riskTier: ActionOutcomeRiskTier;
  warnings: string[];
};

export type MetricTooltip = {
  title: string;
  body: string;
  footer?: string;
};

export type SummaryMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tooltip?: MetricTooltip;
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
