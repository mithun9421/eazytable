import type { Table, Row, SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table'
import type { ReactNode, FC, ComponentType } from 'react'

// ─── View Modes ────────────────────────────────────────────────────────────────

export type ViewMode = 'table' | 'card' | 'list' | 'kanban' | 'gallery'

// ─── Column Definition ─────────────────────────────────────────────────────────

/**
 * Extended column definition that describes how a field should appear
 * in each view mode. All view-specific roles are optional — eazytable
 * will fall back to sensible defaults when roles are not specified.
 */
export interface EazyColumnDef<TData> {
  /** Unique key that maps to a property on TData */
  key: keyof TData & string

  /** Human-readable label used in headers and field labels */
  label: string

  /**
   * Custom cell renderer. Receives the raw cell value and the full row object.
   * Return any React node.
   */
  cell?: (value: TData[keyof TData], row: TData) => ReactNode

  /** Enable sorting for this column (default: true) */
  sortable?: boolean

  /** Enable column-level filtering for this column (default: false) */
  filterable?: boolean

  /** Preferred column width in pixels for table view */
  width?: number

  /** Table view options */
  table?: {
    /** Hide this column in table view */
    hidden?: boolean
    /** Override width for table view */
    width?: number
  }

  /**
   * Card view options.
   * Roles determine how the field is rendered on each card:
   * - `primary`   → Large headline text (e.g. product name, user name)
   * - `secondary` → Subtitle / description text
   * - `badge`     → Pill/tag chip (e.g. status, category)
   * - `image`     → URL string used as the card cover image src
   * - `meta`      → Small key-value pair shown at the card footer
   * - `hidden`    → Not rendered in card view
   */
  card?: {
    role?: 'primary' | 'secondary' | 'badge' | 'image' | 'meta' | 'hidden'
  }

  /**
   * List view options.
   * - `primary`   → Main row text
   * - `secondary` → Subtext below primary
   * - `meta`      → Right-aligned metadata (e.g. date, count)
   * - `hidden`    → Not rendered
   */
  list?: {
    role?: 'primary' | 'secondary' | 'meta' | 'hidden'
  }

  /**
   * Kanban view options.
   * - `groupBy` → This field's value determines which column a card falls into
   * - `title`   → Card headline text
   * - `meta`    → Small metadata shown on the card
   * - `hidden`  → Not rendered
   */
  kanban?: {
    role?: 'groupBy' | 'title' | 'meta' | 'hidden'
  }

  /**
   * Gallery view options.
   * - `image` → URL string for the gallery image src
   * - `title` → Overlay title text
   * - `meta`  → Overlay metadata
   * - `hidden`→ Not rendered
   */
  gallery?: {
    role?: 'image' | 'title' | 'meta' | 'hidden'
  }
}

// ─── Props passed to each view component ───────────────────────────────────────

export interface ViewComponentProps<TData> {
  /** TanStack Table instance — full access for advanced customisation */
  table: Table<TData>
  /** Pre-processed rows for the current page/filter/sort state */
  rows: Row<TData>[]
  /** Column definitions passed to useEazyTable */
  columns: EazyColumnDef<TData>[]
  /** Optional className forwarded from ViewRenderer */
  className?: string
}

// ─── ViewSwitcher props ────────────────────────────────────────────────────────

export interface ViewSwitcherProps {
  /** Currently active view */
  viewMode: ViewMode
  /** Views available to switch between */
  availableViews: ViewMode[]
  /** Called when user clicks a different view button */
  onViewChange: (view: ViewMode) => void
  /** Optional className for the switcher container */
  className?: string
  /** Override button labels */
  labels?: Partial<Record<ViewMode, string>>
  /** Show text labels alongside icons (default: true) */
  showLabels?: boolean
}

// ─── useEazyTable options ──────────────────────────────────────────────────────

export interface EazyTableOptions<TData> {
  /** The data array to display */
  data: TData[]

  /** Column/field definitions with optional view-specific roles */
  columns: EazyColumnDef<TData>[]

  /** Which view to show initially (default: 'table') */
  defaultView?: ViewMode

  /** Restrict which views are available to the user (default: ['table', 'card', 'list']) */
  views?: ViewMode[]

  /** Enable column sorting (default: true) */
  enableSorting?: boolean

  /** Enable per-column filtering (default: false) */
  enableFiltering?: boolean

  /** Enable a global search across all columns (default: false) */
  enableGlobalFilter?: boolean

  /** Number of rows per page (default: 10) */
  pageSize?: number

  /**
   * Serialize view mode, sort, filter and pagination state to/from URL
   * search params. Enables shareable/bookmarkable views. (default: false)
   */
  urlState?: boolean

  /**
   * Override or replace any built-in component.
   * Pass your own fully-styled component and eazytable will use it
   * instead of the default unstyled version.
   */
  components?: Partial<EazyTableComponents<TData>>
}

export interface EazyTableComponents<TData> {
  TableView: ComponentType<ViewComponentProps<TData>>
  CardView: ComponentType<ViewComponentProps<TData>>
  ListView: ComponentType<ViewComponentProps<TData>>
  KanbanView: ComponentType<ViewComponentProps<TData>>
  GalleryView: ComponentType<ViewComponentProps<TData>>
  ViewSwitcher: ComponentType<ViewSwitcherProps>
  EmptyState: ComponentType
  LoadingState: ComponentType
}

// ─── Internal state shape ──────────────────────────────────────────────────────

export interface EazyTableState {
  viewMode: ViewMode
  sorting: SortingState
  columnFilters: ColumnFiltersState
  globalFilter: string
  pagination: PaginationState
}

// ─── Hook return value ─────────────────────────────────────────────────────────

export interface UseEazyTableReturn<TData> {
  // ── View ──────────────────────────────────────────────────────────────
  /** Currently active view mode */
  viewMode: ViewMode
  /** Programmatically switch view */
  setViewMode: (mode: ViewMode) => void
  /** Views available to the user */
  availableViews: ViewMode[]

  // ── Full state snapshot ───────────────────────────────────────────────
  state: EazyTableState

  // ── TanStack Table instance ───────────────────────────────────────────
  /** The underlying TanStack Table instance for advanced use cases */
  table: Table<TData>
  /** Rows for the current page after sorting and filtering */
  rows: Row<TData>[]
  /** Column definitions passed in */
  columns: EazyColumnDef<TData>[]

  // ── Global filter ─────────────────────────────────────────────────────
  globalFilter: string
  setGlobalFilter: (value: string) => void

  // ── Pagination helpers ────────────────────────────────────────────────
  canPreviousPage: boolean
  canNextPage: boolean
  previousPage: () => void
  nextPage: () => void
  pageIndex: number
  pageCount: number
  pageSize: number
  setPageSize: (size: number) => void
  totalRows: number

  // ── Pre-bound render components ───────────────────────────────────────
  /**
   * Pre-bound ViewSwitcher. Accepts any ViewSwitcherProps overrides.
   * Drop into JSX directly: <table.ViewSwitcher />
   */
  ViewSwitcher: FC<Partial<ViewSwitcherProps>>
  /**
   * Pre-bound ViewRenderer. Renders the currently active view.
   * Drop into JSX directly: <table.ViewRenderer />
   */
  ViewRenderer: FC<{ className?: string }>
}
