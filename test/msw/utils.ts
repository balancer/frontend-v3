import { TypedDocumentNode } from '@apollo/client'
import { RequestHandler } from 'msw'

import { server } from './server'

export function getQueryName(document: TypedDocumentNode): string {
  interface Node {
    name: { value: string }
  }
  const definition = document.definitions[0] as Node
  if (!definition?.name?.value) {
    throw new Error(`Query name not found in ${definition}`)
  }
  return definition?.name?.value
}

export function mockGQL(handlers: Array<RequestHandler> | RequestHandler) {
  if (Array.isArray(handlers)) return server.use(...handlers)
  server.use(handlers)
}
