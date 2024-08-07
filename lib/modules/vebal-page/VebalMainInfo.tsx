import { useVebalLockInfo } from '../vebal/useVebalLockInfo'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { differenceInDays, format } from 'date-fns'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { GetVeBalUserDocument, GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useUserAccount } from '../web3/UserAccountProvider'
import { Stack, Text } from '@chakra-ui/react'
import { VeBALLocksChart } from './vebal-chart/VebalLocksChart'

export function VebalMainInfo() {
  const lockInfo = useVebalLockInfo()
  const user = useUserAccount()

  const { data } = useQuery(GetVeBalUserDocument, {
    variables: {
      address: user.userAddress.toLowerCase(),
      chain: GqlChain.Mainnet,
    },
  })

  const lockedUntil = !lockInfo.mainnetLockedInfo.lockedEndDate
    ? '-'
    : format(lockInfo.mainnetLockedInfo.lockedEndDate, 'yyyy-MM-dd')

  const percentOfAllSupply = bn(data?.veBalGetUser.balance || 0).div(
    lockInfo.mainnetLockedInfo.totalSupply || 0
  )

  const vebalData = [
    {
      title: 'My veBAL',
      value: data?.veBalGetUser.balance,
    },
    {
      title: '',
      value: `Expires ${lockedUntil} (${differenceInDays(new Date(lockedUntil), new Date())} days)`,
    },
    {
      title: '% of all supply',
      value: fNum('feePercent', percentOfAllSupply),
    },
    {
      title: 'Rank',
      value: data?.veBalGetUser.rank,
    },
  ]

  return (
    <Stack spacing="4">
      {vebalData.map(({ title, value }) => (
        <Stack key={title} spacing="2">
          <Text>{title}</Text>
          <Text>{value}</Text>
        </Stack>
      ))}
      <VeBALLocksChart />
    </Stack>
  )
}
