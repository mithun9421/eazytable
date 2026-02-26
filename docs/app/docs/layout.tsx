import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { source } from '../source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="font-bold text-base">
            EazyTable
          </span>
        ),
      }}
      sidebar={{
        defaultOpenLevel: Infinity,
        footer: (
          <a
            href="https://github.com/mithun9421/eazytable"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-fd-muted-foreground hover:text-fd-foreground transition"
          >
            GitHub ↗
          </a>
        ),
      }}
    >
      {children}
    </DocsLayout>
  )
}
