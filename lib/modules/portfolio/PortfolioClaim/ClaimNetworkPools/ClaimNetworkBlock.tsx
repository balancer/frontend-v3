import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { Button, Card, Flex, HStack, Heading, Stack } from '@chakra-ui/react'
import { chainToSlugMap } from '../../../pool/pool.utils'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import Link from 'next/link'

type Props = {
  chain: GqlChain
  networkTotalClaimableFiatBalance: number
  link: string
  title?: string
}

export function ClaimNetworkBlock({ chain, title, networkTotalClaimableFiatBalance, link }: Props) {
  const { toCurrency } = useCurrency()

  return (
    <Card
      variant="level1"
      p="md"
      shadow="xl"
      border="1px solid"
      borderColor="border.base"
      flex="1"
      minW={['320px']}
      maxW={['320px', '410px']}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <HStack>
          <NetworkIcon chain={chain} size={14} />

          <Stack gap={1}>
            <Heading size="md" textTransform={'capitalize'}>
              {title || chainToSlugMap[chain]}
            </Heading>
            <Heading size="md" variant="special">
              {toCurrency(networkTotalClaimableFiatBalance)}
            </Heading>
          </Stack>
        </HStack>

        <Link href={link}>
          <Button variant="secondary">View</Button>
        </Link>
      </Flex>
    </Card>
  )
}
