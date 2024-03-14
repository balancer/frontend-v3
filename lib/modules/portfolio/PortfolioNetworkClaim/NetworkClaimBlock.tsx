import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { Button, Card, Flex, HStack, Heading, Stack } from '@chakra-ui/react'
import { chainToSlugMap } from '../../pool/pool.utils'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

type Props = {
  chain: GqlChain
  networkTotalClaimableFiatBalance: number
  openClaimModal: (chain: string) => void
}

export function NetworkClaimBlock({
  chain,
  openClaimModal,
  networkTotalClaimableFiatBalance,
}: Props) {
  const { toCurrency } = useCurrency()

  return (
    <Card variant="level1" p="md" shadow="xl" flex="1">
      <Flex justifyContent="space-between" alignItems="center">
        <HStack>
          <NetworkIcon chain={chain} size={14} />

          <Stack>
            <Heading size="md">{chainToSlugMap[chain]}</Heading>
            <Heading size="md" variant="special">
              {toCurrency(networkTotalClaimableFiatBalance)}
            </Heading>
          </Stack>
        </HStack>
        <Button variant="secondary" onClick={() => openClaimModal(chain)}>
          View
        </Button>
      </Flex>
    </Card>
  )
}
