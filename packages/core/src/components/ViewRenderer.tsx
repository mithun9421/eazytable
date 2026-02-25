import type { Table, Row } from '@tanstack/react-table'
import type { ViewMode, ViewComponentProps, EazyColumnDef, EazyTableComponents } from '../types'

import { DefaultTableView } from './views/TableView'
import { DefaultCardView } from './views/CardView'
import { DefaultListView } from './views/ListView'
import { DefaultKanbanView } from './views/KanbanView'
import { DefaultGalleryView } from './views/GalleryView'

interface ViewRendererInternalProps<TData> {
  viewMode: ViewMode
  table: Table<TData>
  rows: Row<TData>[]
  columns: EazyColumnDef<TData>[]
  className?: string
  components?: Partial<EazyTableComponents<TData>>
}

/**
 * Internal ViewRenderer — selects the correct view component based on
 * the current viewMode and renders it with the shared props.
 *
 * Consumed via the pre-bound `et.ViewRenderer` returned from `useEazyTable`.
 */
export function DefaultViewRenderer<TData>({
  viewMode,
  table,
  rows,
  columns,
  className,
  components = {},
}: ViewRendererInternalProps<TData>) {
  const props: ViewComponentProps<TData> = { table, rows, columns, className }

  const TableViewComp = components.TableView ?? DefaultTableView<TData>
  const CardViewComp = components.CardView ?? DefaultCardView<TData>
  const ListViewComp = components.ListView ?? DefaultListView<TData>
  const KanbanViewComp = components.KanbanView ?? DefaultKanbanView<TData>
  const GalleryViewComp = components.GalleryView ?? DefaultGalleryView<TData>

  switch (viewMode) {
    case 'table':
      return <TableViewComp {...props} />
    case 'card':
      return <CardViewComp {...props} />
    case 'list':
      return <ListViewComp {...props} />
    case 'kanban':
      return <KanbanViewComp {...props} />
    case 'gallery':
      return <GalleryViewComp {...props} />
    default:
      return <TableViewComp {...props} />
  }
}
