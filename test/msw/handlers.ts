import { buildPoolListHandler } from './mocks/PoolList.handlers'
import { buildTokenListHandler } from './mocks/Tokens.handlers'
import { buildPoolHandler } from './mocks/Pool.handlers'

export const defaultHandlers = [buildPoolListHandler(), buildTokenListHandler(), buildPoolHandler()]
