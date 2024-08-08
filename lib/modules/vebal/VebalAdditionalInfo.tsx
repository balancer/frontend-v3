import networkConfig from '@/lib/config/networks/mainnet'
import { useVebalLockInfo } from './useVebalLockInfo'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { Stack, Text } from '@chakra-ui/react'

export function VebalAdditionalInfo() {
  const { balanceFor } = useTokenBalances()
  const lockInfo = useVebalLockInfo()
  const unlockedBalance = balanceFor(networkConfig.tokens.addresses.b8020BalWeth)

  const lockData = [
    {
      title: 'Locked veBAL',
      value: lockInfo.mainnetLockedInfo.lockedAmount,
    },
    {
      title: 'Unlocked veBAL',
      value: unlockedBalance?.formatted,
    },
  ]
  return (
    <Stack spacing="4">
      {lockData.map(({ title, value }) => (
        <Stack key={title} spacing="2">
          <Text>{title}</Text>
          <Text>{value}</Text>
        </Stack>
      ))}
    </Stack>
  )
}
