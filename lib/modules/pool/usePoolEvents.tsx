import {
  GqlChain,
  GetPoolEventsDocument,
  GqlPoolEventType,
  GqlPoolEventsDataRange,
  GetPoolEventsQuery,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'

type PoolEventList = GetPoolEventsQuery['poolEvents']
export type PoolEventItem = PoolEventList[0]

type PoolEventsProps = {
  poolId: string
  chain: GqlChain
  first?: number
  skip?: number
  range?: GqlPoolEventsDataRange
  typeIn?: GqlPoolEventType[]
  userAddress?: string
}

export function usePoolEvents({
  poolId,
  chain,
  first,
  skip,
  range,
  typeIn,
  userAddress,
}: PoolEventsProps) {
  return useQuery(GetPoolEventsDocument, {
    variables: {
      poolId,
      chain,
      first,
      skip,
      range,
      typeIn,
      userAddress,
    },
  })
}
