import { buildPoolListMswHandler } from './handlers/PoolList.handlers'
import { buildTokenListMswHandler, buildTokenPricesMswHandler } from './handlers/Tokens.handlers'
import { buildPoolMswHandler } from './handlers/Pool.handlers'
import { buildAppGlobalDataMswHandler } from './handlers/AppGlobalData.handlers'
import { defaultPostMswHandler } from './handlers/rest-handlers'

export const defaultMswHandlers = [
  defaultPostMswHandler,
  buildPoolListMswHandler(),
  buildTokenListMswHandler(),
  buildTokenPricesMswHandler(),
  buildPoolMswHandler(),
  buildAppGlobalDataMswHandler(),
]
