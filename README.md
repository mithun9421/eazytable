# EazyTable

**Switchable multi-view data display for React — table, card, list, kanban, and gallery from a single hook.**

[![npm version](https://img.shields.io/npm/v/@mithun9421/eazytable)](https://www.npmjs.com/package/@mithun9421/eazytable)
[![npm downloads](https://img.shields.io/npm/dm/@mithun9421/eazytable)](https://www.npmjs.com/package/@mithun9421/eazytable)
[![license](https://img.shields.io/npm/l/@mithun9421/eazytable)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%3E%3D18-61dafb)](https://react.dev/)
[![docs](https://img.shields.io/badge/docs-live-brightgreen)](https://eazytable-docs-ovfq1h9h7-mithun9421s-projects.vercel.app/docs)

---

## What is EazyTable?

EazyTable is a **headless React library** that lets your users switch between five data display modes — table, card, list, kanban, and gallery — all powered by a single `useEazyTable` hook. You define your data and columns once; EazyTable handles view switching, sorting, filtering, and pagination across every view.

```tsx
const et = useEazyTable({ data, columns })

return (
  <>
    <et.ViewSwitcher />
    <et.ViewRenderer />
  </>
)
```

No global store. No class components. No mandatory CSS. Just a hook and two components.

---

## Features

- **5 built-in views** — Table, Card, List, Kanban, Gallery
- **Single hook API** — one call to `useEazyTable`, everything else is derived
- **Column roles** — tell each column how to appear in each view (`primary`, `badge`, `image`, `groupBy`, etc.)
- **Sorting & filtering** — powered by [TanStack Table v8](https://tanstack.com/table/v8)
- **Built-in pagination** — client-side, with full control helpers
- **Headless & unstyled** — target views via `data-eazytable-*` attributes or pass custom components
- **Custom cell renderers** — override any cell with your own React component
- **Component overrides** — replace any built-in view or the switcher entirely
- **Full TypeScript support** — generic over your data type
- **Zero peer-dependency UI** — only requires React ≥ 18

---

## Installation

```bash
npm install @mithun9421/eazytable
# or
pnpm add @mithun9421/eazytable
# or
yarn add @mithun9421/eazytable
# or
bun add @mithun9421/eazytable
```

---

## Quick Start

### 1. Define your data type

```tsx
type User = {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}
```

### 2. Call `useEazyTable`

```tsx
import { useEazyTable } from '@mithun9421/eazytable'

const et = useEazyTable<User>({
  data: users,
  columns: [
    { key: 'id',     label: 'ID',     sortable: true,  card: { role: 'hidden' } },
    { key: 'avatar', label: 'Avatar', card: { role: 'image' }, gallery: { role: 'image' } },
    { key: 'name',   label: 'Name',   card: { role: 'primary' }, list: { role: 'primary' }, kanban: { role: 'title' }, gallery: { role: 'title' } },
    { key: 'email',  label: 'Email',  list: { role: 'secondary' } },
    { key: 'role',   label: 'Role',   card: { role: 'badge' }, kanban: { role: 'groupBy' } },
  ],
  views: ['table', 'card', 'list', 'kanban', 'gallery'],
  pageSize: 12,
})
```

### 3. Render

```tsx
return (
  <div>
    <et.ViewSwitcher />
    <et.ViewRenderer />
  </div>
)
```

Done. Users can now switch between all five views. Sorting and pagination work in every view automatically.

---

## The Five Views

### Table

The classic sortable, scrollable data table. Click any column header to sort.

```
| ID | Avatar | Name       | Email              | Role    |
|----|--------|------------|--------------------|---------|
| 1  | 🖼     | Alice Chen | alice@example.com  | Admin   |
| 2  | 🖼     | Bob Smith  | bob@example.com    | Editor  |
```

**Column roles:** all columns render by default. Use `table: { hidden: true }` to suppress one.

---

### Card

A responsive grid of cards. Each card has distinct zones for image, headline, badge, and metadata.

```
┌──────────────┐  ┌──────────────┐
│    [image]   │  │    [image]   │
│──────────────│  │──────────────│
│ Primary name │  │ Primary name │
│ [badge]      │  │ [badge]      │
│ meta · meta  │  │ meta · meta  │
└──────────────┘  └──────────────┘
```

**Column roles:** `image`, `primary`, `secondary`, `badge`, `meta`, `hidden`

---

### List

A compact, scannable vertical list. Good for email inboxes, activity feeds, and mobile layouts.

```
● Alice Chen          alice@example.com      Admin
● Bob Smith           bob@example.com        Editor
```

**Column roles:** `primary`, `secondary`, `meta`, `hidden`

---

### Kanban

Automatic horizontal lane grouping by any column. Perfect for status boards, pipelines, and workflows.

```
  TODO           IN PROGRESS       DONE
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Task A  │    │ Task C  │    │ Task E  │
│ meta    │    │ meta    │    │ meta    │
├─────────┤    └─────────┘    ├─────────┤
│ Task B  │                   │ Task F  │
│ meta    │                   │ meta    │
└─────────┘                   └─────────┘
```

**Column roles:** `groupBy` (required — drives lane grouping), `title`, `meta`, `hidden`

---

### Gallery

An image-first grid with title and metadata as a bottom overlay. Great for products, portfolios, and media.

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│          │  │          │  │          │
│  [img]   │  │  [img]   │  │  [img]   │
│          │  │          │  │          │
│▓ Title ▓▓│  │▓ Title ▓▓│  │▓ Title ▓▓│
└──────────┘  └──────────┘  └──────────┘
```

**Column roles:** `image`, `title`, `meta`, `hidden`

---

## Column Definitions

Columns are defined with `EazyColumnDef<TData>`. Each column can have different roles in different views.

```tsx
{
  key: 'status',               // keyof TData
  label: 'Status',            // displayed in table header and meta labels

  // Custom cell renderer (works in table view and as meta in other views)
  cell: (value, row) => <StatusBadge status={String(value)} />,

  sortable: true,              // default: true
  filterable: false,           // default: false
  width: 120,                  // pixel width (table view)

  // Per-view role overrides
  card:    { role: 'badge' },
  list:    { role: 'secondary' },
  kanban:  { role: 'groupBy' },
  gallery: { role: 'meta' },
  table:   { hidden: false },
}
```

### Role Reference

| Role | Available in | Effect |
|------|-------------|--------|
| `primary` | card, list | Main headline text |
| `secondary` | card, list | Subtitle text |
| `badge` | card | Rendered as a pill/chip |
| `image` | card, gallery | Cover image (value must be a URL) |
| `meta` | card, list, kanban, gallery | Key-value pair in footer |
| `title` | kanban, gallery | Card/tile headline |
| `groupBy` | kanban | Drives lane grouping — one column required |
| `hidden` | all | Not rendered in that view |

If no roles are specified, EazyTable applies sensible defaults: column 0 → primary, column 1 → secondary, rest → meta.

---

## `useEazyTable` Options

```ts
interface EazyTableOptions<TData> {
  data: TData[]                    // Your data array
  columns: EazyColumnDef<TData>[] // Column definitions with roles

  defaultView?: ViewMode           // Starting view (default: first in views[])
  views?: ViewMode[]               // Available views (default: ['table','card','list'])

  enableSorting?: boolean          // (default: true)
  enableFiltering?: boolean        // Per-column filter (default: false)
  enableGlobalFilter?: boolean     // Global search across all columns (default: false)

  pageSize?: number                // Rows per page (default: 10)
  components?: EazyTableComponents<TData>  // Override any built-in component
}
```

---

## Hook Return Value

```ts
const et = useEazyTable(options)

// View control
et.viewMode            // current ViewMode
et.setViewMode(mode)   // programmatically switch view
et.availableViews      // ViewMode[]

// TanStack Table instance — full access if you need it
et.table               // Table<TData>
et.rows                // Row<TData>[] for current page

// Global filter / search
et.globalFilter        // string
et.setGlobalFilter(v)  // drive from your own search input

// Pagination
et.pageIndex           // 0-based current page
et.pageCount           // total pages
et.pageSize            // rows per page
et.setPageSize(n)
et.canPreviousPage
et.canNextPage
et.previousPage()
et.nextPage()
et.totalRows           // total filtered row count

// Pre-bound render components
<et.ViewSwitcher />    // drop-in view toggle UI
<et.ViewRenderer />    // renders the active view
```

---

## Recipes

### Global search bar

```tsx
const et = useEazyTable({ data, columns, enableGlobalFilter: true })

return (
  <div>
    <input
      value={et.globalFilter}
      onChange={(e) => et.setGlobalFilter(e.target.value)}
      placeholder="Search…"
    />
    <et.ViewSwitcher />
    <et.ViewRenderer />
  </div>
)
```

### Custom pagination controls

```tsx
<et.ViewRenderer />

<div>
  <button disabled={!et.canPreviousPage} onClick={et.previousPage}>← Prev</button>
  <span>Page {et.pageIndex + 1} of {et.pageCount}</span>
  <button disabled={!et.canNextPage} onClick={et.nextPage}>Next →</button>
</div>
```

### Server-side pagination

EazyTable's internal pagination operates on the data you pass in. For server-side pagination, manage your own page state and pass each page's data directly:

```tsx
const [page, setPage] = useState(0)
const { data, totalCount } = useSWR(`/api/users?page=${page}`)

const et = useEazyTable({
  data: data ?? [],
  columns,
  pageSize: 20,
})

// Render et.ViewRenderer, then your own prev/next controls that call setPage()
```

### Custom cell renderer

```tsx
columns: [
  {
    key: 'status',
    label: 'Status',
    cell: (value) => (
      <span style={{ color: value === 'active' ? 'green' : 'red' }}>
        {String(value)}
      </span>
    ),
    card: { role: 'badge' },
  }
]
```

### Start in card view

```tsx
const et = useEazyTable({
  data,
  columns,
  views: ['card', 'table', 'list'],
  defaultView: 'card',
})
```

### Kanban-only mode

```tsx
const et = useEazyTable({
  data: tasks,
  columns: [
    { key: 'title',  label: 'Task',   kanban: { role: 'title' } },
    { key: 'status', label: 'Status', kanban: { role: 'groupBy' } },
    { key: 'due',    label: 'Due',    kanban: { role: 'meta' } },
  ],
  views: ['kanban'],
})
```

### Programmatic view switching

```tsx
const et = useEazyTable({ data, columns })

// Switch to gallery when a "grid" button is clicked
<button onClick={() => et.setViewMode('gallery')}>Grid</button>
```

### Replace a built-in view

```tsx
import { useEazyTable } from '@mithun9421/eazytable'
import type { ViewComponentProps } from '@mithun9421/eazytable'

function MyCardView<TData>({ rows, columns }: ViewComponentProps<TData>) {
  return (
    <div className="my-card-grid">
      {rows.map((row) => (
        <MyCard key={row.id} row={row} columns={columns} />
      ))}
    </div>
  )
}

const et = useEazyTable({
  data,
  columns,
  components: { CardView: MyCardView },
})
```

---

## Styling

EazyTable ships **zero CSS**. All built-in elements expose `data-eazytable-*` attributes for targeting:

```css
/* Table */
[data-eazytable-table] { border-collapse: collapse; }
[data-eazytable-th]    { background: #f9fafb; }
[data-eazytable-td]    { padding: 8px 12px; }

/* Cards */
[data-eazytable-card-grid]  { gap: 16px; }
[data-eazytable-card]       { border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
[data-eazytable-card-image] { height: 160px; object-fit: cover; }

/* Kanban */
[data-eazytable-kanban-column] { background: #f3f4f6; }
[data-eazytable-kanban-card]   { background: #fff; }

/* Gallery */
[data-eazytable-gallery-grid] { gap: 12px; }
[data-eazytable-gallery-item] { border-radius: 8px; overflow: hidden; }

/* ViewSwitcher */
[data-eazytable-switcher]        { display: flex; gap: 4px; }
[data-eazytable-switcher-button] { border-radius: 6px; }
```

Alternatively, pass `className` to `ViewRenderer` and style with Tailwind or CSS modules.

---

## Documentation

Full docs, API reference, and live examples: **[eazytable-docs-ovfq1h9h7-mithun9421s-projects.vercel.app/docs](https://eazytable-docs-ovfq1h9h7-mithun9421s-projects.vercel.app/docs)**

## Live Demo

The [showcase page](https://eazytable-docs-ovfq1h9h7-mithun9421s-projects.vercel.app/docs/showcase) uses the [PokéAPI](https://pokeapi.co/) to render all 1,302 Pokémon across all five views with real server-side pagination and live search — everything wired to a single `useEazyTable` call.

---

## Monorepo Structure

```
eazytable/
├── packages/
│   ├── core/          # @mithun9421/eazytable (this package)
│   └── mcp/           # MCP server for AI coding assistants
└── docs/              # Next.js documentation site
```

### MCP Server

The `packages/mcp` package is an [MCP](https://modelcontextprotocol.io/) server that gives AI coding assistants (Claude Code, Cursor, Windsurf) full knowledge of the EazyTable API. It can generate working code snippets on demand.

```json
// .mcp.json
{
  "mcpServers": {
    "eazytable": {
      "command": "npx",
      "args": ["-y", "@mithun9421/eazytable-mcp"]
    }
  }
}
```

---

## API Reference

### Types

```ts
type ViewMode = 'table' | 'card' | 'list' | 'kanban' | 'gallery'

interface EazyColumnDef<TData> {
  key: keyof TData & string
  label: string
  cell?: (value: TData[keyof TData], row: TData) => ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: number
  table?:   { hidden?: boolean; width?: number }
  card?:    { role?: 'primary' | 'secondary' | 'badge' | 'image' | 'meta' | 'hidden' }
  list?:    { role?: 'primary' | 'secondary' | 'meta' | 'hidden' }
  kanban?:  { role?: 'groupBy' | 'title' | 'meta' | 'hidden' }
  gallery?: { role?: 'image' | 'title' | 'meta' | 'hidden' }
}

interface EazyTableComponents<TData> {
  TableView:    ComponentType<ViewComponentProps<TData>>
  CardView:     ComponentType<ViewComponentProps<TData>>
  ListView:     ComponentType<ViewComponentProps<TData>>
  KanbanView:   ComponentType<ViewComponentProps<TData>>
  GalleryView:  ComponentType<ViewComponentProps<TData>>
  ViewSwitcher: ComponentType<ViewSwitcherProps>
  EmptyState:   ComponentType
  LoadingState: ComponentType
}

interface ViewSwitcherProps {
  viewMode: ViewMode
  availableViews: ViewMode[]
  onViewChange: (view: ViewMode) => void
  className?: string
  labels?: Partial<Record<ViewMode, string>>
  showLabels?: boolean
}
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| [`@tanstack/react-table`](https://tanstack.com/table/v8) | Headless table engine (sorting, filtering, pagination) |
| [`@dnd-kit/core`](https://dndkit.com/) | Drag-and-drop primitives |
| [`@dnd-kit/sortable`](https://dndkit.com/) | Sortable drag utilities |
| [`@dnd-kit/utilities`](https://dndkit.com/) | DnD helper utilities |

Peer dependencies: React ≥ 18, ReactDOM ≥ 18.

---

## Third-Party Notices

| Package | License | Copyright |
|---------|---------|-----------|
| @tanstack/react-table | MIT | Copyright (c) 2016 Tanner Linsley |
| @dnd-kit/core | MIT | Copyright (c) 2021 Claudéric Demers |
| @dnd-kit/sortable | MIT | Copyright (c) 2021 Claudéric Demers |
| @dnd-kit/utilities | MIT | Copyright (c) 2021 Claudéric Demers |
| react | MIT | Copyright (c) Meta Platforms, Inc. |
| react-dom | MIT | Copyright (c) Meta Platforms, Inc. |

---

## Contributing

Issues and PRs are welcome. The codebase is a pnpm monorepo:

```bash
# Install dependencies
pnpm install

# Build the core package
pnpm --filter @mithun9421/eazytable build

# Run the docs site
pnpm --filter docs dev

# Type-check everything
pnpm typecheck
```

---

## License

MIT © [mithun9421](https://github.com/mithun9421)
