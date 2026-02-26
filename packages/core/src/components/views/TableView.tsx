import { flexRender } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { ViewComponentProps } from '../../types'

// flexRender types don't align perfectly with React 19's expanded ReactNode
// (which added bigint). The cast is safe — flexRender always returns renderable content.
const render = (v: unknown): ReactNode => v as ReactNode

export function DefaultTableView<TData>({ table, className }: ViewComponentProps<TData>) {
  return (
    <div
      data-eazytable-view="table"
      className={className}
      style={{ overflowX: 'auto', width: '100%' }}
    >
      <table
        data-eazytable-table=""
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}
      >
        <thead data-eazytable-thead="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} data-eazytable-header-row="">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    data-eazytable-th=""
                    data-sortable={canSort ? '' : undefined}
                    data-sorted={sorted ? sorted : undefined}
                    colSpan={header.colSpan}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '12px',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: 'var(--et-text-muted, #6b7280)',
                      borderBottom: '1px solid var(--et-border, #e5e7eb)',
                      cursor: canSort ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : undefined,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {render(flexRender(header.column.columnDef.header, header.getContext()))}
                        {canSort && (
                          <span
                            aria-hidden="true"
                            style={{ opacity: sorted ? 1 : 0.3, fontSize: '10px' }}
                          >
                            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
                          </span>
                        )}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody data-eazytable-tbody="">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                data-eazytable-empty=""
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: 'var(--et-text-placeholder, #9ca3af)',
                  fontSize: '14px',
                }}
              >
                No data to display.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                data-eazytable-row=""
                data-row-index={i}
                style={{ borderBottom: '1px solid var(--et-border-subtle, #f3f4f6)' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    data-eazytable-td=""
                    style={{
                      padding: '11px 14px',
                      color: 'var(--et-text, #111827)',
                      verticalAlign: 'middle',
                    }}
                  >
                    {render(flexRender(cell.column.columnDef.cell, cell.getContext()))}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
