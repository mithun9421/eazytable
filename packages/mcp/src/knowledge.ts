// ─── Static knowledge base powering all MCP tools ────────────────────────────

export const VIEW_MODES = {
  table: {
    name: 'Table',
    description: 'Classic spreadsheet-style rows and columns. Best for comparing values across many records. Supports sorting by clicking column headers.',
    bestFor: ['Large datasets', 'Comparisons across records', 'Data with many fields of equal importance'],
    columnRoles: { hidden: 'Hide this column in table view' },
  },
  card: {
    name: 'Cards',
    description: 'Responsive CSS grid of cards. Each card highlights the most important fields. Best when records have a natural visual identity.',
    bestFor: ['Products', 'User profiles', 'Articles/posts', 'Any record with a clear headline'],
    columnRoles: {
      primary: 'Large headline text (e.g. product name)',
      secondary: 'Subtitle or description',
      badge: 'Pill/chip (e.g. status, category)',
      image: 'URL string used as the card cover image',
      meta: 'Small key-value pair in the card footer',
      hidden: 'Not rendered in card view',
    },
  },
  list: {
    name: 'List',
    description: 'Compact vertical list of rows. Great for mobile or space-constrained layouts. Shows primary text with optional subtitle and right-aligned metadata.',
    bestFor: ['Mobile-friendly layouts', 'Email/message lists', 'File browsers', 'Simple record listings'],
    columnRoles: {
      primary: 'Main row text',
      secondary: 'Subtext below primary',
      meta: 'Right-aligned metadata column',
      hidden: 'Not rendered',
    },
  },
  kanban: {
    name: 'Kanban',
    description: 'Groups records into vertical columns based on a status/stage field. Ideal for workflow data where records move through stages.',
    bestFor: ['Task/ticket tracking', 'Sales pipelines (leads by stage)', 'Content moderation queues', 'Hiring pipelines'],
    columnRoles: {
      groupBy: 'This field determines which column the card falls into (e.g. status)',
      title: 'Card headline',
      meta: 'Small metadata shown on each card',
      hidden: 'Not rendered',
    },
  },
  gallery: {
    name: 'Gallery',
    description: 'Image-centric grid with overlay text. Best when records have a primary image and you want a visual browsing experience.',
    bestFor: ['Photo libraries', 'Product catalogs with images', 'Portfolio items', 'Media assets'],
    columnRoles: {
      image: 'URL string for the gallery image src',
      title: 'Overlay title text',
      meta: 'Overlay metadata text',
      hidden: 'Not rendered',
    },
  },
} as const

export const COMPONENT_PROPS = {
  useEazyTable: `
interface EazyTableOptions<TData> {
  /** The data array to display */
  data: TData[]

  /** Column/field definitions */
  columns: EazyColumnDef<TData>[]

  /** Initial view (default: 'table') */
  defaultView?: 'table' | 'card' | 'list' | 'kanban' | 'gallery'

  /** Restrict available views (default: ['table', 'card', 'list']) */
  views?: Array<'table' | 'card' | 'list' | 'kanban' | 'gallery'>

  /** Enable sorting (default: true) */
  enableSorting?: boolean

  /** Enable per-column filtering (default: false) */
  enableFiltering?: boolean

  /** Enable global search (default: false) */
  enableGlobalFilter?: boolean

  /** Rows per page (default: 10) */
  pageSize?: number

  /** Override any built-in view component */
  components?: {
    TableView?: ComponentType<ViewComponentProps<TData>>
    CardView?: ComponentType<ViewComponentProps<TData>>
    ListView?: ComponentType<ViewComponentProps<TData>>
    KanbanView?: ComponentType<ViewComponentProps<TData>>
    GalleryView?: ComponentType<ViewComponentProps<TData>>
    ViewSwitcher?: ComponentType<ViewSwitcherProps>
  }
}

interface EazyColumnDef<TData> {
  key: keyof TData & string      // Maps to a property on TData
  label: string                  // Display label
  cell?: (value, row) => ReactNode  // Custom cell renderer
  sortable?: boolean             // Default: true
  filterable?: boolean           // Default: false
  width?: number                 // Pixel width for table view
  table?: { hidden?: boolean }
  card?: { role?: 'primary' | 'secondary' | 'badge' | 'image' | 'meta' | 'hidden' }
  list?: { role?: 'primary' | 'secondary' | 'meta' | 'hidden' }
  kanban?: { role?: 'groupBy' | 'title' | 'meta' | 'hidden' }
  gallery?: { role?: 'image' | 'title' | 'meta' | 'hidden' }
}`,

  UseEazyTableReturn: `
interface UseEazyTableReturn<TData> {
  // View state
  viewMode: 'table' | 'card' | 'list' | 'kanban' | 'gallery'
  setViewMode: (mode: ViewMode) => void
  availableViews: ViewMode[]

  // TanStack Table instance (for advanced use)
  table: Table<TData>
  rows: Row<TData>[]
  columns: EazyColumnDef<TData>[]

  // Global filter / search
  globalFilter: string
  setGlobalFilter: (value: string) => void

  // Pagination
  canPreviousPage: boolean
  canNextPage: boolean
  previousPage: () => void
  nextPage: () => void
  pageIndex: number
  pageCount: number
  pageSize: number
  setPageSize: (size: number) => void
  totalRows: number

  // Pre-bound render components
  ViewSwitcher: FC<Partial<ViewSwitcherProps>>
  ViewRenderer: FC<{ className?: string }>
}`,

  ViewSwitcherProps: `
interface ViewSwitcherProps {
  viewMode: ViewMode
  availableViews: ViewMode[]
  onViewChange: (view: ViewMode) => void
  className?: string
  labels?: Partial<Record<ViewMode, string>>   // Override button labels
  showLabels?: boolean                          // Show text labels (default: true)
}`,

  ViewComponentProps: `
interface ViewComponentProps<TData> {
  table: Table<TData>       // Full TanStack Table instance
  rows: Row<TData>[]        // Current page rows
  columns: EazyColumnDef<TData>[]
  className?: string
}`,
}

export const EXAMPLES = {
  basic: `
import { useEazyTable } from 'eazytable'

type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  joinedAt: string
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active', joinedAt: '2023-01-15' },
  { id: 2, name: 'Bob Smith',    email: 'bob@example.com',   role: 'Editor', status: 'active', joinedAt: '2023-03-22' },
  { id: 3, name: 'Carol White',  email: 'carol@example.com', role: 'Viewer', status: 'inactive', joinedAt: '2023-06-01' },
]

export default function UsersPage() {
  const et = useEazyTable({
    data: users,
    columns: [
      { key: 'name',     label: 'Name',     card: { role: 'primary' },   list: { role: 'primary' } },
      { key: 'email',    label: 'Email',    card: { role: 'secondary' }, list: { role: 'secondary' } },
      { key: 'role',     label: 'Role',     card: { role: 'badge' } },
      { key: 'status',   label: 'Status',   card: { role: 'badge' },     kanban: { role: 'groupBy' } },
      { key: 'joinedAt', label: 'Joined',   list: { role: 'meta' },      card: { role: 'meta' } },
    ],
    views: ['table', 'card', 'list', 'kanban'],
    defaultView: 'table',
  })

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Users ({et.totalRows})</h1>
        <et.ViewSwitcher />
      </div>
      <et.ViewRenderer />
    </div>
  )
}`,

  withPagination: `
import { useEazyTable } from 'eazytable'

export default function ProductsPage() {
  const et = useEazyTable({
    data: products,
    columns: [
      { key: 'image',    label: 'Image',    card: { role: 'image' },    gallery: { role: 'image' } },
      { key: 'name',     label: 'Name',     card: { role: 'primary' },  gallery: { role: 'title' } },
      { key: 'category', label: 'Category', card: { role: 'badge' },    kanban: { role: 'groupBy' } },
      { key: 'price',    label: 'Price',    card: { role: 'meta' },     list: { role: 'meta' } },
      { key: 'stock',    label: 'In Stock', card: { role: 'meta' },     gallery: { role: 'meta' } },
    ],
    views: ['table', 'card', 'list', 'kanban', 'gallery'],
    pageSize: 12,
    enableGlobalFilter: true,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          placeholder="Search products..."
          value={et.globalFilter}
          onChange={(e) => et.setGlobalFilter(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <et.ViewSwitcher />
      </div>

      {/* View */}
      <et.ViewRenderer />

      {/* Pagination */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={et.previousPage} disabled={!et.canPreviousPage}>← Prev</button>
        <span>Page {et.pageIndex + 1} of {et.pageCount}</span>
        <button onClick={et.nextPage} disabled={!et.canNextPage}>Next →</button>
      </div>
    </div>
  )
}`,

  customComponent: `
// Override the card view with your own styled component
import { useEazyTable, type ViewComponentProps } from 'eazytable'

function MyCard<TData>({ rows, columns }: ViewComponentProps<TData>) {
  const primaryCol = columns.find(c => c.card?.role === 'primary') ?? columns[0]
  return (
    <div className="grid grid-cols-3 gap-4">
      {rows.map(row => (
        <div key={row.id} className="rounded-xl border p-4 shadow-sm">
          <h3 className="font-semibold">{String(row.getValue(primaryCol.key))}</h3>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const et = useEazyTable({
    data,
    columns,
    components: { CardView: MyCard },
  })
  return <et.ViewRenderer />
}`,

  kanban: `
// Kanban board for task management
import { useEazyTable } from 'eazytable'

type Task = {
  id: number
  title: string
  status: 'Todo' | 'In Progress' | 'Review' | 'Done'
  assignee: string
  priority: 'Low' | 'Medium' | 'High'
}

export default function TaskBoard() {
  const et = useEazyTable({
    data: tasks,
    columns: [
      { key: 'title',    label: 'Title',    kanban: { role: 'title' } },
      { key: 'status',   label: 'Status',   kanban: { role: 'groupBy' } },
      { key: 'assignee', label: 'Assignee', kanban: { role: 'meta' } },
      { key: 'priority', label: 'Priority', kanban: { role: 'meta' }, card: { role: 'badge' } },
    ],
    views: ['kanban', 'table', 'list'],
    defaultView: 'kanban',
  })

  return (
    <div>
      <et.ViewSwitcher />
      <et.ViewRenderer style={{ marginTop: '16px' }} />
    </div>
  )
}`,
}
