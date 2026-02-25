import { loader } from 'fumadocs-core/source'
import { docs } from '../.source'

// fumadocs-mdx v11: _runtime.docs() returns an intermediate object —
// call .toFumadocsSource() to get the Source<> that loader() expects.
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
})
