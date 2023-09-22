import { buildPoolListHandler } from './handlers/PoolList.handlers'
import { buildTokenListHandler } from './handlers/Tokens.handlers'
import { buildPoolHandler } from './handlers/Pool.handlers'

export const defaultHandlers = [buildPoolListHandler(), buildTokenListHandler(), buildPoolHandler()]
