'use client'

import { useState, useEffect, useMemo } from 'react'
import { useEazyTable } from '@mithun9421/eazytable'

// ─── Types ────────────────────────────────────────────────────────────────────

type NameEntry = { name: string; url: string }

type Pokemon = {
  id: number
  name: string
  image: string
  type: string
  hp: number
  attack: number
  speed: number
  height: string
  weight: string
}

const PAGE_SIZE = 12

// ─── Pokemon type palette ─────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal:   { bg: '#9199a1', text: '#fff' },
  fire:     { bg: '#ff9c54', text: '#fff' },
  water:    { bg: '#4d90d5', text: '#fff' },
  electric: { bg: '#f3d23b', text: '#333' },
  grass:    { bg: '#63bb5b', text: '#fff' },
  ice:      { bg: '#74cec0', text: '#fff' },
  fighting: { bg: '#ce4069', text: '#fff' },
  poison:   { bg: '#ab6ac8', text: '#fff' },
  ground:   { bg: '#d97845', text: '#fff' },
  flying:   { bg: '#8fa8dd', text: '#fff' },
  psychic:  { bg: '#f97176', text: '#fff' },
  bug:      { bg: '#90c12c', text: '#fff' },
  rock:     { bg: '#c9bb8a', text: '#333' },
  ghost:    { bg: '#5269ac', text: '#fff' },
  dragon:   { bg: '#0a6dc4', text: '#fff' },
  dark:     { bg: '#5a5366', text: '#fff' },
  steel:    { bg: '#5a8ea2', text: '#fff' },
  fairy:    { bg: '#ec8fe6', text: '#fff' },
}

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] ?? { bg: '#9ca3af', text: '#fff' }
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'capitalize',
        background: c.bg,
        color: c.text,
      }}
    >
      {type}
    </span>
  )
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchAllNames(): Promise<NameEntry[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
  const data = (await res.json()) as { results: NameEntry[] }
  return data.results
}

type RawStat = { stat: { name: string }; base_stat: number }
type RawType = { type: { name: string } }

function transformPokemon(p: Record<string, unknown>): Pokemon {
  const stat = (name: string) =>
    ((p.stats as RawStat[]).find((s) => s.stat.name === name)?.base_stat ?? 0)
  const sprites = p.sprites as Record<string, unknown>
  const other = sprites?.other as Record<string, unknown> | undefined
  const artwork = other?.['official-artwork'] as Record<string, unknown> | undefined

  return {
    id: p.id as number,
    name: ((p.name as string).charAt(0).toUpperCase() + (p.name as string).slice(1)),
    image: (artwork?.front_default as string | null) ?? (sprites?.front_default as string | null) ?? '',
    type: ((p.types as RawType[])[0].type.name),
    hp: stat('hp'),
    attack: stat('attack'),
    speed: stat('speed'),
    height: `${(p.height as number) / 10}m`,
    weight: `${(p.weight as number) / 10}kg`,
  }
}

async function fetchDetails(entries: NameEntry[]): Promise<Pokemon[]> {
  const details = await Promise.all(entries.map((e) => fetch(e.url).then((r) => r.json())))
  return details.map(transformPokemon)
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  const pulse = (delay: number): React.CSSProperties => ({
    borderRadius: '8px',
    background: 'var(--et-bg-muted, #e5e7eb)',
    animation: `et-pulse 1.5s ease-in-out ${delay}s infinite`,
  })
  return (
    <div style={{ border: '1px solid var(--et-border, #e5e7eb)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--et-border, #e5e7eb)', background: 'var(--et-bg-subtle, #f9fafb)', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '32px', ...pulse(0) }} />
        <div style={{ width: '80px', height: '18px', ...pulse(0.1) }} />
        <div style={{ width: '168px', height: '32px', borderRadius: '10px', ...pulse(0.15) }} />
      </div>
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} style={{ height: '200px', ...pulse(i * 0.04) }} />
        ))}
      </div>
    </div>
  )
}

// ─── Main demo ────────────────────────────────────────────────────────────────

export function PokemonDemo() {
  // All ~1302 name+url pairs — fetched once, never refetched
  const [allEntries, setAllEntries] = useState<NameEntry[]>([])

  // Current page of fetched Pokemon details
  const [pokemon, setPokemon] = useState<Pokemon[]>([])

  // Search: input value (immediate) + debounced value (drives fetch)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [serverPage, setServerPage] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // ── Step 1: load all names once ───────────────────────────────────────────
  useEffect(() => {
    fetchAllNames()
      .then(setAllEntries)
      .catch((e: Error) => setFetchError(e.message))
  }, [])

  // ── Debounce search input (300 ms) ────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setServerPage(0) // always restart at page 1 for a new query
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // ── Filter the full name list client-side (O(n) on ~1302 strings, instant) ─
  const filteredEntries = useMemo(() => {
    if (!debouncedSearch) return allEntries
    const q = debouncedSearch.toLowerCase()
    return allEntries.filter((e) => e.name.includes(q))
  }, [allEntries, debouncedSearch])

  const totalFiltered = filteredEntries.length
  const serverPageCount = Math.max(Math.ceil(totalFiltered / PAGE_SIZE), 1)

  // ── Step 2: fetch details for the current page of results ─────────────────
  useEffect(() => {
    if (allEntries.length === 0) return // names not loaded yet

    setIsTransitioning(true)
    const pageEntries = filteredEntries.slice(serverPage * PAGE_SIZE, (serverPage + 1) * PAGE_SIZE)

    if (pageEntries.length === 0) {
      setPokemon([])
      setIsTransitioning(false)
      setIsInitialLoad(false)
      return
    }

    let cancelled = false
    fetchDetails(pageEntries)
      .then((data) => { if (!cancelled) setPokemon(data) })
      .catch((e: Error) => { if (!cancelled) setFetchError(e.message) })
      .finally(() => {
        if (!cancelled) {
          setIsTransitioning(false)
          setIsInitialLoad(false)
        }
      })
    return () => { cancelled = true }
  }, [allEntries, filteredEntries, serverPage])

  // ── eazytable — no internal global filter; we handle search above ─────────
  const et = useEazyTable<Pokemon>({
    data: pokemon,
    columns: [
      { key: 'id',     label: '#',      sortable: true,  width: 56, card: { role: 'hidden' } },
      { key: 'name',   label: 'Name',   card: { role: 'primary' },   list: { role: 'primary' },   kanban: { role: 'title' },   gallery: { role: 'title' } },
      {
        key: 'image', label: 'Sprite', sortable: false, width: 60,
        card: { role: 'image' }, gallery: { role: 'image' },
        cell: (value) => (
          <img src={String(value)} alt="" loading="lazy"
            style={{ width: '40px', height: '40px', objectFit: 'contain', display: 'block' }} />
        ),
      },
      {
        key: 'type',   label: 'Type',
        card: { role: 'badge' }, list: { role: 'secondary' }, kanban: { role: 'groupBy' }, gallery: { role: 'meta' },
        cell: (value) => <TypeBadge type={String(value)} />,
      },
      { key: 'hp',     label: 'HP',     card: { role: 'meta' }, list: { role: 'meta' }, kanban: { role: 'meta' } },
      { key: 'attack', label: 'Attack', card: { role: 'meta' }, list: { role: 'meta' }, kanban: { role: 'meta' } },
      { key: 'speed',  label: 'Speed',  card: { role: 'meta' } },
      { key: 'height', label: 'Height', card: { role: 'meta' } },
      { key: 'weight', label: 'Weight', card: { role: 'meta' } },
    ],
    views: ['table', 'card', 'list', 'kanban', 'gallery'],
    pageSize: PAGE_SIZE,
  })

  if (isInitialLoad) return <LoadingSkeleton />

  if (fetchError) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--et-border, #e5e7eb)', borderRadius: '12px', color: 'var(--et-text-muted, #6b7280)', fontSize: '14px' }}>
        Could not reach the PokéAPI — check your connection and refresh.
        <br /><span style={{ fontSize: '12px', opacity: 0.7 }}>{fetchError}</span>
      </div>
    )
  }

  const counterLabel = debouncedSearch
    ? `${totalFiltered} result${totalFiltered !== 1 ? 's' : ''}`
    : `#${serverPage * PAGE_SIZE + 1}–${Math.min((serverPage + 1) * PAGE_SIZE, totalFiltered)} of ${totalFiltered}`

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
    <div style={{ border: '1px solid var(--et-border, #e5e7eb)', borderRadius: '12px', overflow: 'hidden', fontFamily: 'inherit' }}>

      {/* ── Toolbar ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--et-border, #e5e7eb)', background: 'var(--et-bg-toolbar, #fafafa)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search all 1302 Pokémon by name…"
          style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--et-border, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--et-bg, #ffffff)', color: 'var(--et-text, #111827)', outline: 'none', fontFamily: 'inherit' }}
        />
        <span style={{ fontSize: '12px', color: 'var(--et-text-placeholder, #9ca3af)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {isTransitioning ? '…' : counterLabel}
        </span>
        <et.ViewSwitcher />
      </div>

      {/* ── View area ── */}
      <div style={{ padding: '16px', opacity: isTransitioning ? 0.45 : 1, pointerEvents: isTransitioning ? 'none' : undefined, transition: 'opacity 0.15s ease' }}>
        <et.ViewRenderer />
      </div>

      {/* ── Server pagination footer ── */}
      {serverPageCount > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--et-border, #e5e7eb)', background: 'var(--et-bg-subtle, #f9fafb)', fontSize: '13px' }}>
          <span style={{ color: 'var(--et-text-placeholder, #9ca3af)' }}>
            {isTransitioning ? 'Loading…' : `Page ${serverPage + 1} of ${serverPageCount}`}
          </span>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button style={btnStyle(serverPage > 0 && !isTransitioning)} disabled={serverPage === 0 || isTransitioning} onClick={() => setServerPage((p) => p - 1)}>
              ← Prev
            </button>

            {/* Page number pills (up to 7 visible) */}
            {Array.from({ length: Math.min(serverPageCount, 7) }, (_, i) => {
              const page = serverPageCount <= 7 ? i
                : serverPage <= 3 ? i
                : serverPage >= serverPageCount - 4 ? serverPageCount - 7 + i
                : serverPage - 3 + i
              const isActive = page === serverPage
              return (
                <button key={page} onClick={() => setServerPage(page)} disabled={isTransitioning}
                  style={{ width: '28px', height: '28px', border: '1px solid var(--et-border, #e5e7eb)', borderRadius: '6px', cursor: isTransitioning ? 'not-allowed' : 'pointer', fontSize: '12px', fontFamily: 'inherit', background: isActive ? 'var(--et-text, #111827)' : 'var(--et-bg, #ffffff)', color: isActive ? 'var(--et-bg, #ffffff)' : 'var(--et-text-muted, #6b7280)', fontWeight: isActive ? 600 : 400 }}>
                  {page + 1}
                </button>
              )
            })}

            <button style={btnStyle(serverPage < serverPageCount - 1 && !isTransitioning)} disabled={serverPage >= serverPageCount - 1 || isTransitioning} onClick={() => setServerPage((p) => p + 1)}>
              Next →
            </button>
          </div>

          <span style={{ color: 'var(--et-text-placeholder, #9ca3af)', fontSize: '12px' }}>
            {totalFiltered.toLocaleString()} total
          </span>
        </div>
      )}
    </div>
  )
}
