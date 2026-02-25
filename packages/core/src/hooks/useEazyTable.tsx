import { useState, useMemo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table'

import type {
  ViewMode,
  EazyTableOptions,
  UseEazyTableReturn,
  ViewSwitcherProps,
} from '../types'

import { DefaultViewSwitcher } from '../components/ViewSwitcher'
import { DefaultViewRenderer } from '../components/ViewRenderer'

const DEFAULT_VIEWS: ViewMode[] = ['table', 'card', 'list']

/**
 * The primary hook for eazytable.
 *
 * Pass your data and column definitions once; get back everything you need
 * to render a switchable multi-view data display.
 *
 * @example
 * const et = useEazyTable({
 *   data: users,
 *   columns: [
 *     { key: 'name',   label: 'Name',   card: { role: 'primary' } },
 *     { key: 'email',  label: 'Email',  list: { role: 'secondary' } },
 *     { key: 'status', label: 'Status', card: { role: 'badge' }, kanban: { role: 'groupBy' } },
 *   ],
 *   views: ['table', 'card', 'list', 'kanban'],
 * })
 *
 * return (
 *   <div>
 *     <et.ViewSwitcher />
 *     <et.ViewRenderer />
 *   </div>
 * )
 */
export function useEazyTable<TData extends object>(
  options: EazyTableOptions<TData>
): UseEazyTableReturn<TData> {
  const {
    data,
    columns: columnDefs,
    defaultView = 'table',
    views = DEFAULT_VIEWS,
    enableSorting = true,
    enableFiltering = false,
    enableGlobalFilter = false,
    pageSize: initialPageSize = 10,
    components = {},
  } = options

  // ── State ──────────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  // ── Convert EazyColumnDef → TanStack ColumnDef ─────────────────────────────
  const tanstackColumns = useMemo<ColumnDef<TData>[]>(() => {
    return columnDefs.map((col) => {
      const colDef: ColumnDef<TData> = {
        id: col.key,
        accessorKey: col.key as string,
        header: col.label,
        enableSorting: col.sortable !== false,
        enableColumnFilter: col.filterable === true,
        size: col.width ?? col.table?.width,
      }

      if (col.cell) {
        const userCell = col.cell
        colDef.cell = ({ getValue, row }) =>
          userCell(getValue() as TData[keyof TData], row.original)
      }

      return colDef
    })
  }, [columnDefs])

  // ── TanStack Table instance ────────────────────────────────────────────────
  const table = useReactTable<TData>({
    data,
    columns: tanstackColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      enableFiltering || enableGlobalFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting,
    enableFilters: enableFiltering,
    enableGlobalFilter,
    autoResetPageIndex: false,
  })

  const rows = table.getRowModel().rows

  // ── Pre-bound ViewSwitcher ─────────────────────────────────────────────────
  const BoundViewSwitcher = useCallback(
    (props: Partial<ViewSwitcherProps>) => {
      const Component = components.ViewSwitcher ?? DefaultViewSwitcher
      return (
        <Component
          viewMode={viewMode}
          availableViews={views}
          onViewChange={setViewMode}
          {...props}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewMode, views, components.ViewSwitcher]
  )

  // ── Pre-bound ViewRenderer ─────────────────────────────────────────────────
  const BoundViewRenderer = useCallback(
    ({ className }: { className?: string }) => (
      <DefaultViewRenderer<TData>
        viewMode={viewMode}
        table={table}
        rows={rows}
        columns={columnDefs}
        className={className}
        components={components}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewMode, table, rows, columnDefs, components]
  )

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    viewMode,
    setViewMode,
    availableViews: views,
    state: { viewMode, sorting, columnFilters, globalFilter, pagination },
    table,
    rows,
    columns: columnDefs,
    globalFilter,
    setGlobalFilter,
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    previousPage: table.previousPage,
    nextPage: table.nextPage,
    pageIndex: pagination.pageIndex,
    pageCount: table.getPageCount(),
    pageSize: pagination.pageSize,
    setPageSize: (size: number) => table.setPageSize(size),
    totalRows: table.getFilteredRowModel().rows.length,
    ViewSwitcher: BoundViewSwitcher,
    ViewRenderer: BoundViewRenderer,
  }
}
