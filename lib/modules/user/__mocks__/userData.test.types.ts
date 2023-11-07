/**
 * The types in this file only exist for testing reasons (MSW handlers will use them to mock GQL responses)
 */

import { GetUserDataQuery } from '@/lib/shared/services/api/generated/graphql'

export type MswUserBalances = GetUserDataQuery['balances']
