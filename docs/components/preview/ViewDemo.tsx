'use client'

import { useEazyTable, type ViewMode } from 'eazytable'
import { USERS, TASKS } from './sample-data'

// ─── Shared toolbar style ─────────────────────────────────────────────────────

function DemoShell({ children, search, setSearch, totalRows }: {
  children: React.ReactNode
  search?: string
  setSearch?: (v: string) => void
  totalRows: number
}) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Toolbar */}
      {setSearch && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6',
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              background: 'white',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            {totalRows} results
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px' }}>{children}</div>
    </div>
  )
}

// ─── All-views demo (switchable) ──────────────────────────────────────────────

export function AllViewsDemo({ defaultView = 'table' }: { defaultView?: ViewMode }) {
  const et = useEazyTable({
    data: USERS,
    columns: [
      { key: 'name',       label: 'Name',       card: { role: 'primary' },   list: { role: 'primary' } },
      { key: 'email',      label: 'Email',      card: { role: 'secondary' }, list: { role: 'secondary' } },
      { key: 'role',       label: 'Role',       card: { role: 'badge' } },
      { key: 'status',     label: 'Status',     card: { role: 'badge' },     kanban: { role: 'groupBy' } },
      { key: 'department', label: 'Department', card: { role: 'meta' },      list: { role: 'meta' } },
      { key: 'joinedAt',   label: 'Joined',     card: { role: 'meta' } },
    ],
    views: ['table', 'card', 'list', 'kanban'],
    defaultView,
    enableGlobalFilter: true,
    pageSize: 6,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          value={et.globalFilter}
          onChange={(e) => et.setGlobalFilter(e.target.value)}
          placeholder="Search users…"
          style={{
            flex: 1,
            padding: '7px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <et.ViewSwitcher />
      </div>

      {/* View */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          overflow: 'hidden',
          minHeight: '200px',
        }}
      >
        <et.ViewRenderer className="" />
      </div>

      {/* Pagination */}
      {et.pageCount > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', fontSize: '13px' }}>
          <button
            onClick={et.previousPage}
            disabled={!et.canPreviousPage}
            style={{
              padding: '5px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: et.canPreviousPage ? 'pointer' : 'not-allowed',
              opacity: et.canPreviousPage ? 1 : 0.4,
              fontSize: '13px',
              background: 'white',
            }}
          >
            ← Prev
          </button>
          <span style={{ color: '#6b7280' }}>
            {et.pageIndex + 1} / {et.pageCount}
          </span>
          <button
            onClick={et.nextPage}
            disabled={!et.canNextPage}
            style={{
              padding: '5px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: et.canNextPage ? 'pointer' : 'not-allowed',
              opacity: et.canNextPage ? 1 : 0.4,
              fontSize: '13px',
              background: 'white',
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Table-only demo ──────────────────────────────────────────────────────────

export function TableDemo() {
  const et = useEazyTable({
    data: USERS,
    columns: [
      { key: 'name',       label: 'Name' },
      { key: 'email',      label: 'Email' },
      { key: 'role',       label: 'Role' },
      { key: 'status',     label: 'Status' },
      { key: 'department', label: 'Department' },
      { key: 'joinedAt',   label: 'Joined' },
    ],
    views: ['table'],
    pageSize: 5,
  })

  return (
    <DemoShell totalRows={et.totalRows}>
      <et.ViewRenderer />
    </DemoShell>
  )
}

// ─── Card-only demo ───────────────────────────────────────────────────────────

export function CardDemo() {
  const et = useEazyTable({
    data: USERS.slice(0, 6),
    columns: [
      { key: 'name',       label: 'Name',       card: { role: 'primary' } },
      { key: 'email',      label: 'Email',      card: { role: 'secondary' } },
      { key: 'role',       label: 'Role',       card: { role: 'badge' } },
      { key: 'status',     label: 'Status',     card: { role: 'badge' } },
      { key: 'department', label: 'Department', card: { role: 'meta' } },
      { key: 'joinedAt',   label: 'Joined',     card: { role: 'meta' } },
    ],
    views: ['card'],
  })

  return (
    <DemoShell totalRows={et.totalRows}>
      <et.ViewRenderer />
    </DemoShell>
  )
}

// ─── List-only demo ───────────────────────────────────────────────────────────

export function ListDemo() {
  const et = useEazyTable({
    data: USERS.slice(0, 6),
    columns: [
      { key: 'name',       label: 'Name',       list: { role: 'primary' } },
      { key: 'email',      label: 'Email',      list: { role: 'secondary' } },
      { key: 'role',       label: 'Role',       list: { role: 'meta' } },
      { key: 'department', label: 'Department', list: { role: 'meta' } },
    ],
    views: ['list'],
  })

  return (
    <DemoShell totalRows={et.totalRows}>
      <et.ViewRenderer />
    </DemoShell>
  )
}

// ─── Kanban demo ──────────────────────────────────────────────────────────────

export function KanbanDemo() {
  const et = useEazyTable({
    data: TASKS,
    columns: [
      { key: 'title',    label: 'Task',     kanban: { role: 'title' } },
      { key: 'status',   label: 'Status',   kanban: { role: 'groupBy' } },
      { key: 'assignee', label: 'Assignee', kanban: { role: 'meta' } },
      { key: 'priority', label: 'Priority', kanban: { role: 'meta' } },
    ],
    views: ['kanban'],
  })

  return (
    <DemoShell totalRows={et.totalRows}>
      <et.ViewRenderer />
    </DemoShell>
  )
}
