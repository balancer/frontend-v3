import { GetTokensQuery } from '@/lib/services/api/generated/graphql'

// Each Token in this list is a superset of TokenBase
export type MswTokenList = GetTokensQuery['tokens']
