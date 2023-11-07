import { buildPoolListMswHandler } from './handlers/PoolList.handlers'
import { buildTokenListMswHandler } from './handlers/Tokens.handlers'
import { buildPoolMswHandler } from './handlers/Pool.handlers'
import { buildUserDataMswHandler } from './handlers/UserData.handlers'

export const defaultMswHandlers = [
  buildPoolListMswHandler(),
  buildTokenListMswHandler(),
  buildPoolMswHandler(),
  buildUserDataMswHandler(),
]
