import type { ReactNode } from 'react';

type TopBarProps = {
  brand?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  centerActions?: ReactNode;
  primaryActions?: ReactNode;
  accountControls?: ReactNode;
  priorityStatus?: ReactNode;
};

type AppShellProps = TopBarProps & {
  sidebar?: ReactNode;
  subBar?: ReactNode;
  notice?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
};

export type SidebarNavItem = {
  id: string;
  label: string;
  detail?: string;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export function TopBar({
  brand,
  title,
  subtitle,
  centerActions,
  primaryActions,
  accountControls,
  priorityStatus
}: TopBarProps) {
  return (
    <header className="relative z-30 shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] backdrop-blur-xl">
      <div className="grid min-h-[4.5rem] grid-cols-1 gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:px-6">
        <div className="flex min-w-0 items-center gap-4 lg:col-start-1">
          {brand && <div className="shrink-0">{brand}</div>}
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <div className="truncate text-base font-semibold text-[color:var(--color-text-strong)]">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-[color:var(--color-text-soft)]">
                  {subtitle}
                </div>
              )}
            </div>
          )}
        </div>

        {centerActions && (
          <div className="flex items-center justify-start lg:col-start-2 lg:justify-center">
            {centerActions}
          </div>
        )}

        {(priorityStatus || primaryActions || accountControls) && (
          <div className="flex min-w-0 flex-wrap items-center gap-3 lg:col-start-3 lg:justify-end">
            {priorityStatus}
            {primaryActions}
            {accountControls}
          </div>
        )}
      </div>
    </header>
  );
}

export function ShellSubBar({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-2 backdrop-blur-xl lg:px-6">
      {children}
    </div>
  );
}

export function ShellContent({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={`panel-scroll min-w-0 flex-1 overflow-auto ${className}`}>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">{children}</div>
    </main>
  );
}

export function SidebarNav({
  items,
  label = 'Sections'
}: {
  items: SidebarNavItem[];
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onSelect}
          disabled={item.disabled}
          aria-current={item.active ? 'page' : undefined}
          className={`min-w-[10rem] rounded-lg border px-4 py-4 text-left transition md:min-w-0 ${
            item.active
              ? 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-strong)] text-[color:var(--color-text-strong)] shadow-[0_10px_22px_rgba(15,23,42,0.14)]'
              : 'border-[color:var(--color-border)] bg-transparent text-[color:var(--color-text-soft)] hover:bg-[color:var(--color-surface-soft)]'
          } disabled:cursor-default disabled:opacity-60`}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="truncate text-xl font-semibold">{item.label}</span>
            {item.badge}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function AppShell({
  brand,
  title,
  subtitle,
  centerActions,
  primaryActions,
  accountControls,
  priorityStatus,
  sidebar,
  subBar,
  notice,
  contentClassName,
  children
}: AppShellProps) {
  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden text-[color:var(--color-text)]">
      <TopBar
        brand={brand}
        title={title}
        subtitle={subtitle}
        centerActions={centerActions}
        primaryActions={primaryActions}
        accountControls={accountControls}
        priorityStatus={priorityStatus}
      />
      {subBar && <ShellSubBar>{subBar}</ShellSubBar>}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {sidebar && (
          <aside className="shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-panel)] backdrop-blur-xl md:w-64 md:border-b-0 md:border-r">
            {sidebar}
          </aside>
        )}
        <ShellContent className={contentClassName ?? ''}>
          {notice && <div className="mb-4">{notice}</div>}
          {children}
        </ShellContent>
      </div>
    </div>
  );
}
