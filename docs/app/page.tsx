import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-fd-muted-foreground">
        Open Source · MIT License
      </span>

      {/* Heading */}
      <div className="flex flex-col gap-3 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">
          EazyTable
        </h1>
        <p className="text-xl text-fd-muted-foreground leading-relaxed">
          Switchable multi-view data display for React.
          <br />
          Table, cards, list, kanban, and gallery — from a single hook.
        </p>
      </div>

      {/* Code preview */}
      <pre className="rounded-xl border bg-fd-card px-6 py-4 text-left text-sm font-mono text-fd-card-foreground shadow-sm">
        <code>{`const et = useEazyTable({ data, columns })

return (
  <>
    <et.ViewSwitcher />
    <et.ViewRenderer />
  </>
)`}</code>
      </pre>

      {/* CTAs */}
      <div className="flex gap-3">
        <Link
          href="/docs"
          className="rounded-lg bg-fd-primary text-fd-primary-foreground px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition"
        >
          Read the docs →
        </Link>
        <a
          href="https://github.com/yourusername/eazytable"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border px-6 py-2.5 text-sm font-semibold hover:bg-fd-accent transition"
        >
          GitHub
        </a>
      </div>

      {/* View mode labels */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['Table', 'Cards', 'List', 'Kanban', 'Gallery'].map((view) => (
          <span
            key={view}
            className="rounded-md border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground"
          >
            {view}
          </span>
        ))}
      </div>
    </main>
  )
}
