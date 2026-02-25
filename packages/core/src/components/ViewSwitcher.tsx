import type { ViewSwitcherProps, ViewMode } from '../types'

const TableIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="12" height="3" rx="1" fill="currentColor" opacity="0.4" />
    <rect x="1" y="5.5" width="5.5" height="2.5" rx="0.5" fill="currentColor" />
    <rect x="7.5" y="5.5" width="5.5" height="2.5" rx="0.5" fill="currentColor" />
    <rect x="1" y="9.5" width="5.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="7.5" y="9.5" width="5.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.6" />
  </svg>
)

const CardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
    <rect x="7.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
    <rect x="1" y="7.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.6" />
    <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.6" />
  </svg>
)

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1.5" width="12" height="2" rx="1" fill="currentColor" />
    <rect x="1" y="5.5" width="12" height="2" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="1" y="9.5" width="12" height="2" rx="1" fill="currentColor" opacity="0.5" />
  </svg>
)

const KanbanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
    <rect x="5.25" y="1" width="3.5" height="8" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="9.5" y="1" width="3.5" height="10" rx="1" fill="currentColor" opacity="0.5" />
  </svg>
)

const GalleryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="5.5" height="7" rx="1" fill="currentColor" />
    <rect x="7.5" y="1" width="5.5" height="4" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="1" y="9.5" width="5.5" height="3.5" rx="1" fill="currentColor" opacity="0.6" />
    <rect x="7.5" y="6.5" width="5.5" height="6.5" rx="1" fill="currentColor" opacity="0.5" />
  </svg>
)

const VIEW_ICONS: Record<ViewMode, () => JSX.Element> = {
  table: TableIcon,
  card: CardIcon,
  list: ListIcon,
  kanban: KanbanIcon,
  gallery: GalleryIcon,
}

const VIEW_LABELS: Record<ViewMode, string> = {
  table: 'Table',
  card: 'Cards',
  list: 'List',
  kanban: 'Kanban',
  gallery: 'Gallery',
}

export function DefaultViewSwitcher({
  viewMode,
  availableViews,
  onViewChange,
  className,
  labels,
  showLabels = true,
}: ViewSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Switch data view"
      data-eazytable-switcher=""
      className={className}
      style={{
        display: 'inline-flex',
        gap: '2px',
        padding: '3px',
        borderRadius: '10px',
        background: 'var(--et-switcher-bg, rgba(0,0,0,0.06))',
      }}
    >
      {availableViews.map((view) => {
        const isActive = view === viewMode
        const Icon = VIEW_ICONS[view]
        const label = labels?.[view] ?? VIEW_LABELS[view]

        return (
          <button
            key={view}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Switch to ${label} view`}
            data-eazytable-switcher-btn=""
            data-view={view}
            data-active={isActive ? '' : undefined}
            onClick={() => onViewChange(view)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: showLabels ? '5px 12px' : '6px 10px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: 1,
              transition: 'all 0.15s ease',
              background: isActive
                ? 'var(--et-switcher-active-bg, #ffffff)'
                : 'transparent',
              color: isActive
                ? 'var(--et-switcher-active-color, #111827)'
                : 'var(--et-switcher-inactive-color, #6b7280)',
              boxShadow: isActive
                ? 'var(--et-switcher-shadow, 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06))'
                : 'none',
            }}
          >
            <Icon />
            {showLabels && <span>{label}</span>}
          </button>
        )
      })}
    </div>
  )
}
