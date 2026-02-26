'use client'

import { useEazyTable, type ViewMode } from '@mithun9421/eazytable'
import { USERS, TASKS } from './sample-data'

// ─── Shared shell ─────────────────────────────────────────────────────────────

function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--et-border, #e5e7eb)',
        background: 'var(--et-bg-toolbar, #fafafa)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {children}
    </div>
  )
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search…"
      style={{
        flex: 1,
        padding: '6px 10px',
        border: '1px solid var(--et-border, #e5e7eb)',
        borderRadius: '6px',
        fontSize: '13px',
        background: 'var(--et-bg, #ffffff)',
        color: 'var(--et-text, #111827)',
        outline: 'none',
        fontFamily: 'inherit',
      }}
    />
  )
}

function ResultCount({ count }: { count: number }) {
  return (
    <span style={{ fontSize: '12px', color: 'var(--et-text-placeholder, #9ca3af)', flexShrink: 0 }}>
      {count} results
    </span>
  )
}

function PaginationBar({ et }: { et: ReturnType<typeof useEazyTable<never>> }) {
  if (et.pageCount <= 1) return null
  const btnStyle = (enabled: boolean): React.CSSProperties => ({
    padding: '5px 12px',
    border: '1px solid var(--et-border, #e5e7eb)',
    borderRadius: '6px',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.4,
    fontSize: '13px',
    background: 'var(--et-bg, #ffffff)',
    color: 'var(--et-text, #111827)',
    fontFamily: 'inherit',
  })

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', fontSize: '13px', padding: '10px 0 2px' }}>
      <button style={btnStyle(et.canPreviousPage)} onClick={et.previousPage} disabled={!et.canPreviousPage}>← Prev</button>
      <span style={{ color: 'var(--et-text-muted, #6b7280)' }}>{et.pageIndex + 1} / {et.pageCount}</span>
      <button style={btnStyle(et.canNextPage)} onClick={et.nextPage} disabled={!et.canNextPage}>Next →</button>
    </div>
  )
}

// ─── All-views switcher demo ──────────────────────────────────────────────────

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
    <div
      style={{
        border: '1px solid var(--et-border, #e5e7eb)',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      <Toolbar>
        <SearchInput value={et.globalFilter} onChange={et.setGlobalFilter} />
        <ResultCount count={et.totalRows} />
        <et.ViewSwitcher />
      </Toolbar>

      <div style={{ padding: '16px' }}>
        <et.ViewRenderer />
        <PaginationBar et={et as never} />
      </div>
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
    <div style={{ border: '1px solid var(--et-border, #e5e7eb)', borderRadius: '12px', overflow: 'hidden' }}>
      <et.ViewRenderer />
    </div>
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

  return <et.ViewRenderer />
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

  return <et.ViewRenderer />
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

  return <et.ViewRenderer />
}
