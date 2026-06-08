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
  contentInnerClassName?: string;
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

type LauncherSidebarAsset = {
  inactive: string;
  active: string;
};

export const LAUNCHER_SIDEBAR_ART_ASPECT_RATIO = '7 / 2';

/*
 * Sidebar art contract:
 * - 7:2 transparent PNG or SVG button plates.
 * - No baked readable labels; live labels stay in React for accessibility and localization.
 * - Add sections here only after both active and inactive files exist in /public/launcher.
 */
const launcherSidebarAssets: Partial<Record<string, LauncherSidebarAsset>> = {
  characters: {
    inactive: '/launcher/character-inactive-soft.png',
    active: '/launcher/character-active-soft.png'
  },
  legacy: {
    inactive: '/launcher/legacy-inactive-soft.png',
    active: '/launcher/legacy-active-soft.png'
  },
  chronicles: {
    inactive: '/launcher/chronicles-inactive-soft.png',
    active: '/launcher/chronicles-active-soft.png'
  },
  bloodlines: {
    inactive: '/launcher/bloodlines-inactive-soft.svg',
    active: '/launcher/bloodlines-active-soft.svg'
  },
  settings: {
    inactive: '/launcher/settings-inactive-soft.png',
    active: '/launcher/settings-active-soft.png'
  }
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
  const hasLeadingContent = Boolean(brand || title || subtitle);

  return (
    <header
      className="launcher-shell-bar relative z-30 shrink-0 border-b"
      style={{ background: 'var(--color-shell-chrome-top-bg)' }}
    >
      <div className="grid min-h-[4.5rem] grid-cols-1 gap-3 px-4 py-3 md:min-h-[4.75rem] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:px-6">
        {hasLeadingContent ? (
          <div className="flex min-w-0 items-center gap-4 lg:col-start-1">
            {brand && <div className="shrink-0">{brand}</div>}
            {(title || subtitle) && (
              <div className="min-w-0">
                {title && (
                  <div className="truncate text-base font-semibold text-[color:var(--color-text-primary)]">
                    {title}
                  </div>
                )}
                {subtitle && (
                  <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-[color:var(--color-text-secondary)]">
                    {subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:block" aria-hidden="true" />
        )}

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

function ShellLogoArea({
  brand,
  extendThroughSubBar = false
}: {
  brand: ReactNode;
  extendThroughSubBar?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden border-b border-r border-[color:var(--color-shell-chrome-border)] bg-[color:var(--color-surface-elevated)] ${
        extendThroughSubBar ? 'row-span-2' : ''
      } launcher-logo-well`}
      style={{
        background: 'var(--color-shell-chrome-top-bg)',
        boxShadow: 'var(--shadow-shell-bar)'
      }}
    >
      <div className="relative flex min-h-full items-stretch">
        <div className="min-w-0 flex-1">{brand}</div>
      </div>
    </div>
  );
}

export function ShellSubBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="launcher-subbar relative z-10 shrink-0 border-b px-4 py-2 lg:px-6"
      style={{ background: 'var(--color-shell-chrome-subbar-bg)' }}
    >
      {children}
    </div>
  );
}

export function ShellContent({
  children,
  className = '',
  innerClassName
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const contentInnerClassName =
    innerClassName ?? 'mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6';

  return (
    <main className={`panel-scroll min-w-0 flex-1 overflow-auto ${className}`}>
      <div className={contentInnerClassName}>{children}</div>
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
      className="launcher-sidebar-nav flex gap-3 overflow-x-auto p-4 md:flex-col md:gap-0 md:overflow-visible md:p-0"
    >
      {items.map((item) => {
        const assets = launcherSidebarAssets[item.id];
        const hasAssets = Boolean(assets);

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onSelect}
            disabled={item.disabled}
            aria-label={item.label}
            aria-current={item.active ? 'page' : undefined}
            data-launcher-section={item.id}
            data-launcher-has-art={hasAssets ? 'true' : 'false'}
            data-launcher-art-aspect={LAUNCHER_SIDEBAR_ART_ASPECT_RATIO}
            className={`launcher-sidebar-button min-w-[10rem] rounded-lg border px-4 py-4 text-left transition md:min-h-[2.125rem] md:min-w-0 md:w-full md:rounded-none md:border-x-0 md:border-t-0 md:first:border-t md:px-4 md:py-1.5 ${
              hasAssets ? 'has-art' : ''
            } ${
              item.active
                ? 'is-active border-[color:var(--color-border-soft)] text-[color:var(--color-text-primary)]'
                : 'border-[color:var(--color-border-soft)] text-[color:var(--color-text-secondary)]'
            } disabled:cursor-default disabled:opacity-60`}
          >
            {assets ? (
              <>
                <span className="launcher-sidebar-button-art" aria-hidden="true">
                  <img
                    src={assets.inactive}
                    alt=""
                    draggable={false}
                    className="launcher-sidebar-button-image launcher-sidebar-button-image-inactive"
                  />
                  <img
                    src={assets.active}
                    alt=""
                    draggable={false}
                    className="launcher-sidebar-button-image launcher-sidebar-button-image-active"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="sr-only truncate text-[1.75rem] font-light leading-tight tracking-[0.08em] md:text-[0.875rem]"
                >
                  {item.label}
                </span>
              </>
            ) : (
              <span className="flex items-center justify-between gap-3">
                <span className="truncate text-[1.75rem] font-light leading-tight tracking-[0.08em] md:text-[0.875rem]">
                  {item.label}
                </span>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
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
  contentInnerClassName,
  children
}: AppShellProps) {
  const hasDesktopBrandCorner = Boolean(brand && sidebar);

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden text-[color:var(--color-text-primary)]">
      {hasDesktopBrandCorner ? (
        <>
          <div className="md:hidden">
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
          </div>

          <div className="hidden md:grid md:grid-cols-[18.48rem_minmax(0,1fr)]">
            <ShellLogoArea brand={brand} extendThroughSubBar={Boolean(subBar)} />
            <TopBar
              title={title}
              subtitle={subtitle}
              centerActions={centerActions}
              primaryActions={primaryActions}
              accountControls={accountControls}
              priorityStatus={priorityStatus}
            />
            {subBar && <ShellSubBar>{subBar}</ShellSubBar>}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {sidebar && (
          <aside
            className="launcher-side-rail shrink-0 border-b md:w-[18.48rem] md:border-b-0 md:border-r"
            style={{ background: 'var(--color-shell-chrome-side-bg)' }}
          >
            {sidebar}
          </aside>
        )}
        <ShellContent className={contentClassName ?? ''} innerClassName={contentInnerClassName}>
          {notice && <div className="mb-4">{notice}</div>}
          {children}
        </ShellContent>
      </div>
    </div>
  );
}
