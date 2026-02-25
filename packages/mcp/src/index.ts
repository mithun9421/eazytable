import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'

import { VIEW_MODES, COMPONENT_PROPS, EXAMPLES } from './knowledge.js'

// ─── Server definition ────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'eazytable-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// ─── Tool definitions ─────────────────────────────────────────────────────────

const tools: Tool[] = [
  {
    name: 'list_views',
    description:
      'List all view modes supported by eazytable (table, card, list, kanban, gallery), including what each is best for and the column roles available.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_view_details',
    description:
      'Get detailed information about a specific view mode: description, best use cases, and all supported column roles with explanations.',
    inputSchema: {
      type: 'object',
      properties: {
        view: {
          type: 'string',
          enum: ['table', 'card', 'list', 'kanban', 'gallery'],
          description: 'The view mode to get details for.',
        },
      },
      required: ['view'],
    },
  },
  {
    name: 'get_component_props',
    description:
      'Get the TypeScript interface/props for any eazytable component or hook. Returns the exact TypeScript type so you can generate correct code.',
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          enum: ['useEazyTable', 'UseEazyTableReturn', 'ViewSwitcherProps', 'ViewComponentProps'],
          description: 'Which component or hook to get the props for.',
        },
      },
      required: ['component'],
    },
  },
  {
    name: 'generate_usage',
    description:
      'Generate a complete, working eazytable code example from a description of your data shape and the views you want. Returns copy-pasteable TypeScript/React code.',
    inputSchema: {
      type: 'object',
      properties: {
        dataDescription: {
          type: 'string',
          description:
            'Describe the data you want to display. E.g. "a list of users with name, email, role, status and joinedAt fields" or "products with name, price, category, stock and image fields".',
        },
        views: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['table', 'card', 'list', 'kanban', 'gallery'],
          },
          description: 'Which view modes to include. Default: table, card, list.',
        },
        defaultView: {
          type: 'string',
          enum: ['table', 'card', 'list', 'kanban', 'gallery'],
          description: 'Which view to show initially. Default: table.',
        },
        features: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['pagination', 'search', 'sorting', 'filtering'],
          },
          description: 'Optional features to enable.',
        },
      },
      required: ['dataDescription'],
    },
  },
  {
    name: 'get_example',
    description:
      'Get a pre-built, working code example for a specific scenario: basic usage, pagination, custom components, or a kanban board.',
    inputSchema: {
      type: 'object',
      properties: {
        scenario: {
          type: 'string',
          enum: ['basic', 'withPagination', 'customComponent', 'kanban'],
          description:
            'Which example scenario to return. basic=simple table+card+list, withPagination=search+pagination+all-views, customComponent=replacing a built-in view, kanban=task board.',
        },
      },
      required: ['scenario'],
    },
  },
  {
    name: 'get_column_roles',
    description:
      'Get a summary of all column role options across every view mode. Use this when building a column definitions array.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_installation',
    description:
      'Get installation instructions and quick start for eazytable, including npm/pnpm/yarn/bun install commands and the MCP server setup.',
    inputSchema: {
      type: 'object',
      properties: {
        packageManager: {
          type: 'string',
          enum: ['npm', 'pnpm', 'yarn', 'bun'],
          description: 'Package manager to use (default: npm)',
        },
      },
      required: [],
    },
  },
]

// ─── Tool handlers ────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const a = (args ?? {}) as Record<string, unknown>

  switch (name) {
    // ── list_views ───────────────────────────────────────────────────────────
    case 'list_views': {
      const lines = Object.entries(VIEW_MODES).map(([key, v]) => {
        return `### ${key} — ${v.name}\n${v.description}\n\n**Best for:** ${v.bestFor.join(', ')}`
      })
      return {
        content: [
          {
            type: 'text',
            text: `# eazytable View Modes\n\n${lines.join('\n\n---\n\n')}`,
          },
        ],
      }
    }

    // ── get_view_details ─────────────────────────────────────────────────────
    case 'get_view_details': {
      const viewKey = a['view'] as keyof typeof VIEW_MODES
      const view = VIEW_MODES[viewKey]
      if (!view) {
        return { content: [{ type: 'text', text: `Unknown view: ${viewKey}` }] }
      }
      const roleLines = Object.entries(view.columnRoles)
        .map(([role, desc]) => `- \`${role}\` — ${desc}`)
        .join('\n')
      return {
        content: [
          {
            type: 'text',
            text: [
              `# ${view.name} View`,
              ``,
              view.description,
              ``,
              `## Best for`,
              view.bestFor.map((b) => `- ${b}`).join('\n'),
              ``,
              `## Column roles`,
              `Set these on your column definition: \`{ key: 'myField', label: 'My Field', ${viewKey}: { role: 'primary' } }\``,
              ``,
              roleLines,
            ].join('\n'),
          },
        ],
      }
    }

    // ── get_component_props ──────────────────────────────────────────────────
    case 'get_component_props': {
      const component = a['component'] as keyof typeof COMPONENT_PROPS
      const props = COMPONENT_PROPS[component]
      if (!props) {
        return {
          content: [{ type: 'text', text: `Unknown component: ${component}` }],
        }
      }
      return {
        content: [
          {
            type: 'text',
            text: `# ${component} — TypeScript Interface\n\n\`\`\`typescript${props}\`\`\``,
          },
        ],
      }
    }

    // ── generate_usage ───────────────────────────────────────────────────────
    case 'generate_usage': {
      const dataDesc = String(a['dataDescription'] ?? '')
      const views = (a['views'] as string[]) ?? ['table', 'card', 'list']
      const defaultView = String(a['defaultView'] ?? 'table')
      const features = (a['features'] as string[]) ?? []

      const hasPagination = features.includes('pagination')
      const hasSearch = features.includes('search')

      const viewsStr = JSON.stringify(views)
      const pageSize = hasPagination ? '\n    pageSize: 20,' : ''
      const globalFilter = hasSearch ? '\n    enableGlobalFilter: true,' : ''
      const searchInput = hasSearch
        ? `
      <input
        placeholder="Search..."
        value={et.globalFilter}
        onChange={(e) => et.setGlobalFilter(e.target.value)}
        style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
      />`
        : ''
      const pagination = hasPagination
        ? `
      {/* Pagination */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={et.previousPage} disabled={!et.canPreviousPage}>← Previous</button>
        <span>Page {et.pageIndex + 1} of {et.pageCount} ({et.totalRows} total)</span>
        <button onClick={et.nextPage} disabled={!et.canNextPage}>Next →</button>
      </div>`
        : ''

      const code = `// Generated by eazytable MCP
// Data: ${dataDesc}
import { useEazyTable } from 'eazytable'

// TODO: Replace with your actual type and data
type MyData = Record<string, unknown>
const data: MyData[] = []

export default function MyPage() {
  const et = useEazyTable({
    data,
    columns: [
      // TODO: Define your columns here. See get_column_roles for role options.
      // Example:
      // { key: 'name',   label: 'Name',   card: { role: 'primary' }, list: { role: 'primary' } },
      // { key: 'status', label: 'Status', card: { role: 'badge' },   kanban: { role: 'groupBy' } },
      // { key: 'email',  label: 'Email',  list: { role: 'secondary' } },
    ],
    views: ${viewsStr},
    defaultView: '${defaultView}',${pageSize}${globalFilter}
  })

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <h1 style={{ margin: 0, flex: 1 }}>Data ({et.totalRows})</h1>${searchInput}
        <et.ViewSwitcher />
      </div>

      {/* Active view */}
      <et.ViewRenderer />${pagination}
    </div>
  )
}`
      return { content: [{ type: 'text', text: `\`\`\`tsx\n${code}\n\`\`\`` }] }
    }

    // ── get_example ──────────────────────────────────────────────────────────
    case 'get_example': {
      const scenario = a['scenario'] as keyof typeof EXAMPLES
      const example = EXAMPLES[scenario]
      if (!example) {
        return {
          content: [{ type: 'text', text: `Unknown scenario: ${scenario}` }],
        }
      }
      return {
        content: [
          {
            type: 'text',
            text: `# eazytable Example — ${scenario}\n\n\`\`\`tsx${example}\`\`\``,
          },
        ],
      }
    }

    // ── get_column_roles ─────────────────────────────────────────────────────
    case 'get_column_roles': {
      const lines = Object.entries(VIEW_MODES).map(([viewKey, view]) => {
        const roleLines = Object.entries(view.columnRoles)
          .map(([role, desc]) => `  - \`${viewKey}: { role: '${role}' }\` — ${desc}`)
          .join('\n')
        return `### ${view.name} (\`${viewKey}\`)\n${roleLines}`
      })

      return {
        content: [
          {
            type: 'text',
            text: [
              '# eazytable Column Roles Reference',
              '',
              'Add these to your column definitions to control how each field appears in each view:',
              '',
              ...lines,
              '',
              '## Example column with multiple roles',
              '',
              '```typescript',
              '{',
              "  key: 'status',",
              "  label: 'Status',",
              "  card: { role: 'badge' },      // shown as a pill chip on cards",
              "  list: { role: 'meta' },       // shown on the right side of list items",
              "  kanban: { role: 'groupBy' },  // groups kanban columns by this field",
              "  table: { hidden: false },     // visible in table (default)",
              '}',
              '```',
            ].join('\n'),
          },
        ],
      }
    }

    // ── get_installation ─────────────────────────────────────────────────────
    case 'get_installation': {
      const pm = String(a['packageManager'] ?? 'npm')
      const installCmd: Record<string, string> = {
        npm: 'npm install eazytable',
        pnpm: 'pnpm add eazytable',
        yarn: 'yarn add eazytable',
        bun: 'bun add eazytable',
      }
      const mcpCmd: Record<string, string> = {
        npm: 'npx -y eazytable-mcp',
        pnpm: 'pnpm dlx eazytable-mcp',
        yarn: 'yarn dlx eazytable-mcp',
        bun: 'bunx eazytable-mcp',
      }
      return {
        content: [
          {
            type: 'text',
            text: [
              '# Installing eazytable',
              '',
              '## 1. Install the package',
              '',
              '```bash',
              installCmd[pm] ?? installCmd['npm'],
              '```',
              '',
              '## 2. Basic usage',
              '',
              '```tsx',
              "import { useEazyTable } from 'eazytable'",
              '',
              'const et = useEazyTable({ data, columns })',
              'return (',
              '  <div>',
              '    <et.ViewSwitcher />',
              '    <et.ViewRenderer />',
              '  </div>',
              ')',
              '```',
              '',
              '## 3. Add the MCP server (optional — for AI coding assistant support)',
              '',
              '### Claude Code',
              '```bash',
              `claude mcp add eazytable -- ${mcpCmd[pm] ?? mcpCmd['npm']}`,
              '```',
              '',
              '### .mcp.json / cursor / other MCP clients',
              '```json',
              '{',
              '  "mcpServers": {',
              '    "eazytable": {',
              '      "command": "npx",',
              '      "args": ["-y", "eazytable-mcp"]',
              '    }',
              '  }',
              '}',
              '```',
              '',
              '> With the MCP server active, your AI assistant can use `list_views`, `get_column_roles`,',
              '> `generate_usage`, and `get_example` to generate correct eazytable code automatically.',
            ].join('\n'),
          },
        ],
      }
    }

    // ── fallback ─────────────────────────────────────────────────────────────
    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      }
  }
})

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('eazytable MCP server running on stdio')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
