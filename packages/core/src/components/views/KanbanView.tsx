import type { ViewComponentProps } from '../../types'

function getCellValue<TData>(row: import('@tanstack/react-table').Row<TData>, key: string): string {
  const val = row.getValue(key)
  return val != null ? String(val) : ''
}

// Status color dots — these are semantic status indicators, intentionally
// kept as distinct pastel colors that work in both light and dark mode.
const GROUP_DOT_COLORS: Record<string, string> = {
  todo:          '#93c5fd',
  'in progress': '#fcd34d',
  done:          '#6ee7b7',
  blocked:       '#fca5a5',
  backlog:       '#9ca3af',
  review:        '#c4b5fd',
  cancelled:     '#9ca3af',
}

function getGroupDotColor(key: string): string {
  return GROUP_DOT_COLORS[key.toLowerCase()] ?? '#9ca3af'
}

export function DefaultKanbanView<TData>({ rows, columns, className }: ViewComponentProps<TData>) {
  const groupByCol = columns.find((c) => c.kanban?.role === 'groupBy') ?? columns[0]
  const titleCol = columns.find((c) => c.kanban?.role === 'title') ?? columns[0]
  const metaCols = columns.filter((c) => c.kanban?.role === 'meta')

  const groups = new Map<string, typeof rows>()
  for (const row of rows) {
    const key = getCellValue(row, groupByCol.key) || 'Uncategorized'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }

  if (rows.length === 0) {
    return (
      <div
        data-eazytable-view="kanban"
        className={className}
        style={{ padding: '40px', textAlign: 'center', color: 'var(--et-text-placeholder, #9ca3af)' }}
      >
        No data to display.
      </div>
    )
  }

  return (
    <div
      data-eazytable-view="kanban"
      className={className}
      style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        alignItems: 'flex-start',
        padding: '4px 2px 16px',
      }}
    >
      {Array.from(groups.entries()).map(([groupKey, groupRows]) => (
        <div
          key={groupKey}
          data-eazytable-kanban-column=""
          data-group={groupKey}
          style={{
            minWidth: '256px',
            maxWidth: '280px',
            flex: '0 0 256px',
            borderRadius: '12px',
            background: 'var(--et-bg-subtle, #f9fafb)',
            border: '1px solid var(--et-border, #e5e7eb)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Column header */}
          <div
            data-eazytable-kanban-column-header=""
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderBottom: '1px solid var(--et-border, #e5e7eb)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: getGroupDotColor(groupKey),
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--et-text-secondary, #374151)',
                }}
              >
                {groupKey}
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--et-text-placeholder, #9ca3af)',
                background: 'var(--et-bg-muted, #e5e7eb)',
                borderRadius: '999px',
                padding: '1px 8px',
              }}
            >
              {groupRows.length}
            </span>
          </div>

          {/* Cards */}
          <div
            data-eazytable-kanban-cards=""
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '10px',
              minHeight: '60px',
            }}
          >
            {groupRows.map((row) => (
              <div
                key={row.id}
                data-eazytable-kanban-card=""
                style={{
                  background: 'var(--et-bg, #ffffff)',
                  border: '1px solid var(--et-border, #e5e7eb)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: 'var(--et-shadow-card, 0 1px 2px rgba(0,0,0,0.05))',
                  cursor: 'default',
                }}
              >
                <div
                  data-eazytable-kanban-card-title=""
                  style={{
                    fontWeight: 500,
                    fontSize: '13px',
                    color: 'var(--et-text, #111827)',
                    lineHeight: 1.3,
                  }}
                >
                  {getCellValue(row, titleCol.key)}
                </div>

                {metaCols.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--et-border-subtle, #f3f4f6)',
                    }}
                  >
                    {metaCols.map((col) => (
                      <div
                        key={col.key}
                        data-eazytable-kanban-card-meta=""
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                        }}
                      >
                        <span style={{ color: 'var(--et-text-placeholder, #9ca3af)' }}>{col.label}</span>
                        <span style={{ color: 'var(--et-text-muted, #6b7280)', fontWeight: 500 }}>
                          {getCellValue(row, col.key)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
