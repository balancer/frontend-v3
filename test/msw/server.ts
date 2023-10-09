import { setupServer } from 'msw/node'
import { defaultMswHandlers } from './handlers'

export const mswServer = setupServer(...defaultMswHandlers)
