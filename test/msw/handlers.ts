import { buildPoolListMswHandler } from './handlers/PoolList.handlers'
import { buildTokenListMswHandler } from './handlers/Tokens.handlers'
import { buildPoolMswHandler } from './handlers/Pool.handlers'

export const defaultMswHandlers = [
  buildPoolListMswHandler(),
  buildTokenListMswHandler(),
  buildPoolMswHandler(),
]
