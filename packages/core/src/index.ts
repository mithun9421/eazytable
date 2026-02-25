// ─── Primary hook ──────────────────────────────────────────────────────────────
export { useEazyTable } from './hooks/useEazyTable'

// ─── Types ─────────────────────────────────────────────────────────────────────
export type {
  ViewMode,
  EazyColumnDef,
  EazyTableOptions,
  EazyTableComponents,
  EazyTableState,
  UseEazyTableReturn,
  ViewComponentProps,
  ViewSwitcherProps,
} from './types'

// ─── Default components (unstyled) ────────────────────────────────────────────
// Import these to extend or wrap the defaults in your own styled components.
export { DefaultViewSwitcher } from './components/ViewSwitcher'
export { DefaultViewRenderer } from './components/ViewRenderer'
export { DefaultTableView } from './components/views/TableView'
export { DefaultCardView } from './components/views/CardView'
export { DefaultListView } from './components/views/ListView'
export { DefaultKanbanView } from './components/views/KanbanView'
export { DefaultGalleryView } from './components/views/GalleryView'
