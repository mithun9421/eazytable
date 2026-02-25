import type { ViewComponentProps } from '../../types'

function getCellValue<TData>(row: import('@tanstack/react-table').Row<TData>, key: string): string {
  const val = row.getValue(key)
  return val != null ? String(val) : ''
}

export function DefaultListView<TData>({ rows, columns, className }: ViewComponentProps<TData>) {
  const primaryCol = columns.find((c) => c.list?.role === 'primary') ?? columns[0]
  const secondaryCol = columns.find((c) => c.list?.role === 'secondary') ?? columns[1]
  const metaCols = columns.filter((c) => c.list?.role === 'meta')

  if (rows.length === 0) {
    return (
      <div
        data-eazytable-view="list"
        className={className}
        style={{ padding: '40px', textAlign: 'center', color: 'var(--et-text-placeholder, #9ca3af)' }}
      >
        No data to display.
      </div>
    )
  }

  return (
    <div
      data-eazytable-view="list"
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
    >
      {rows.map((row) => (
        <div
          key={row.id}
          data-eazytable-list-item=""
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--et-bg, #ffffff)',
            borderRadius: '8px',
            border: '1px solid var(--et-border-subtle, #f3f4f6)',
            gap: '12px',
          }}
        >
          {/* Left: primary + secondary */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {primaryCol && (
              <div
                data-eazytable-list-primary=""
                style={{
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'var(--et-text, #111827)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getCellValue(row, primaryCol.key)}
              </div>
            )}

            {secondaryCol && secondaryCol.key !== primaryCol?.key && (
              <div
                data-eazytable-list-secondary=""
                style={{
                  fontSize: '12px',
                  color: 'var(--et-text-placeholder, #9ca3af)',
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getCellValue(row, secondaryCol.key)}
              </div>
            )}
          </div>

          {/* Right: meta columns */}
          {metaCols.length > 0 && (
            <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
              {metaCols.map((col) => (
                <div
                  key={col.key}
                  data-eazytable-list-meta=""
                  style={{ textAlign: 'right' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--et-text-secondary, #374151)' }}>
                    {getCellValue(row, col.key)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--et-text-placeholder, #9ca3af)', marginTop: '1px' }}>
                    {col.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
