import {
  GetPoolUserEventsDocument,
  GetPoolUserEventsQuery,
  GqlChain,
  GqlPoolEventsDataRange,
  GqlPoolEventType,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'

type PoolUserEventsProps = {
  chain: GqlChain
  poolId: string
  range: GqlPoolEventsDataRange
  typeIn?: GqlPoolEventType[]
  userAddress: string
}

type PoolEventList = GetPoolUserEventsQuery['events']
export type PoolEventItem = PoolEventList[0]

export function usePoolUserEvents({
  chain,
  poolId,
  range,
  typeIn = [GqlPoolEventType.Add, GqlPoolEventType.Remove],
  userAddress,
}: PoolUserEventsProps) {
  return useQuery(GetPoolUserEventsDocument, {
    variables: {
      chain,
      poolId,
      range,
      typeIn,
      userAddress,
    },
  })
}
