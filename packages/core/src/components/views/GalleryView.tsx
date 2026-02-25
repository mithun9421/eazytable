import type { ViewComponentProps } from '../../types'

function getCellValue<TData>(row: import('@tanstack/react-table').Row<TData>, key: string): string {
  const val = row.getValue(key)
  return val != null ? String(val) : ''
}

export function DefaultGalleryView<TData>({ rows, columns, className }: ViewComponentProps<TData>) {
  const imageCol = columns.find((c) => c.gallery?.role === 'image')
  const titleCol = columns.find((c) => c.gallery?.role === 'title') ?? columns[0]
  const metaCols = columns.filter((c) => c.gallery?.role === 'meta')

  if (rows.length === 0) {
    return (
      <div
        data-eazytable-view="gallery"
        className={className}
        style={{ padding: '40px', textAlign: 'center', color: 'var(--et-text-placeholder, #9ca3af)' }}
      >
        No data to display.
      </div>
    )
  }

  return (
    <div
      data-eazytable-view="gallery"
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
      }}
    >
      {rows.map((row) => {
        const imageUrl = imageCol ? getCellValue(row, imageCol.key) : undefined
        const title = getCellValue(row, titleCol.key)

        return (
          <div
            key={row.id}
            data-eazytable-gallery-item=""
            style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              aspectRatio: '4/3',
              background: 'var(--et-bg-muted, #f3f4f6)',
              border: '1px solid var(--et-border, #e5e7eb)',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--et-text-faint, #d1d5db)',
                  fontSize: '32px',
                }}
              >
                🖼
              </div>
            )}

            {(title || metaCols.length > 0) && (
              <div
                data-eazytable-gallery-overlay=""
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  // Overlay is over an image — dark gradient is intentional regardless of theme
                  background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                  padding: '24px 12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {title && (
                  <div
                    data-eazytable-gallery-title=""
                    style={{
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#ffffff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </div>
                )}
                {metaCols.map((col) => (
                  <div
                    key={col.key}
                    data-eazytable-gallery-meta=""
                    style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}
                  >
                    {getCellValue(row, col.key)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
