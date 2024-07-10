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
  poolIdIn: string[]
  chainIn: GqlChain[]
  first?: number
  skip?: number
  range?: GqlPoolEventsDataRange
  typeIn?: GqlPoolEventType[]
  userAddress?: string
}

export function usePoolEvents({
  poolIdIn,
  chainIn,
  first,
  skip,
  range,
  typeIn,
  userAddress,
}: PoolEventsProps) {
  return useQuery(GetPoolEventsDocument, {
    variables: {
      poolIdIn,
      chainIn,
      first,
      skip,
      range,
      typeIn,
      userAddress,
    },
  })
}
