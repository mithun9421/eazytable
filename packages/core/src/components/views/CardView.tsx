import type { ViewComponentProps, EazyColumnDef } from '../../types'

function getCellValue<TData>(row: import('@tanstack/react-table').Row<TData>, key: string): string {
  const val = row.getValue(key)
  return val != null ? String(val) : ''
}

export function DefaultCardView<TData>({ rows, columns, className }: ViewComponentProps<TData>) {
  const imageCol = columns.find((c) => c.card?.role === 'image')
  const primaryCol = columns.find((c) => c.card?.role === 'primary') ?? columns[0]
  const secondaryCol = columns.find((c) => c.card?.role === 'secondary') ?? columns[1]
  const badgeCols = columns.filter((c) => c.card?.role === 'badge')
  const metaCols = columns.filter((c): c is EazyColumnDef<TData> => {
    if (c.card?.role === 'hidden') return false
    if (c.card?.role === 'image') return false
    if (c.card?.role === 'badge') return false
    if (c.key === primaryCol?.key) return false
    if (c.key === secondaryCol?.key) return false
    return true
  })

  if (rows.length === 0) {
    return (
      <div
        data-eazytable-view="card"
        className={className}
        style={{ padding: '40px', textAlign: 'center', color: 'var(--et-text-placeholder, #9ca3af)' }}
      >
        No data to display.
      </div>
    )
  }

  return (
    <div
      data-eazytable-view="card"
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
      }}
    >
      {rows.map((row) => {
        const imageUrl = imageCol ? getCellValue(row, imageCol.key) : undefined

        return (
          <div
            key={row.id}
            data-eazytable-card=""
            style={{
              background: 'var(--et-bg, #ffffff)',
              border: '1px solid var(--et-border, #e5e7eb)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--et-shadow-card, 0 1px 3px rgba(0,0,0,0.06))',
            }}
          >
            {/* Cover image */}
            {imageUrl && (
              <div
                data-eazytable-card-image=""
                style={{
                  height: '140px',
                  background: 'var(--et-bg-muted, #f3f4f6)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imageUrl}
                  alt={primaryCol ? getCellValue(row, primaryCol.key) : ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {/* Badge chips */}
              {badgeCols.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {badgeCols.map((col) => (
                    <span
                      key={col.key}
                      data-eazytable-badge=""
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'var(--et-bg-muted, #f3f4f6)',
                        color: 'var(--et-text-secondary, #374151)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {getCellValue(row, col.key)}
                    </span>
                  ))}
                </div>
              )}

              {/* Primary headline */}
              {primaryCol && (
                <div
                  data-eazytable-card-primary=""
                  style={{ fontWeight: 600, fontSize: '15px', color: 'var(--et-text, #111827)', lineHeight: 1.3 }}
                >
                  {getCellValue(row, primaryCol.key)}
                </div>
              )}

              {/* Secondary / subtitle */}
              {secondaryCol && secondaryCol.key !== primaryCol?.key && (
                <div
                  data-eazytable-card-secondary=""
                  style={{ fontSize: '13px', color: 'var(--et-text-muted, #6b7280)', lineHeight: 1.4 }}
                >
                  {getCellValue(row, secondaryCol.key)}
                </div>
              )}

              {/* Meta key-value rows */}
              {metaCols.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--et-border-subtle, #f3f4f6)',
                    marginTop: 'auto',
                  }}
                >
                  {metaCols.slice(0, 5).map((col) => (
                    <div
                      key={col.key}
                      data-eazytable-card-meta=""
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: 'var(--et-text-placeholder, #9ca3af)' }}>{col.label}</span>
                      <span style={{ color: 'var(--et-text-secondary, #374151)', fontWeight: 500 }}>
                        {getCellValue(row, col.key)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
