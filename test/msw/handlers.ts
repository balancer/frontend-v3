import { buildPoolListHandler } from './mocks/PoolList.handlers'
import { buildTokenListHandler } from './mocks/Tokens.handlers'

export const defaultHandlers = [buildPoolListHandler(), buildTokenListHandler()]
