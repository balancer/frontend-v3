import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { Button, Card, Flex, HStack, Heading, IconButton, Stack, VStack } from '@chakra-ui/react'
import { chainToSlugMap } from '../../../pool/pool.utils'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import Link from 'next/link'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { ChevronRight } from 'react-feather'

type Props = {
  chain: GqlChain
  networkTotalClaimableFiatBalance: number
  link: string
  title?: string
}

export function ClaimNetworkBlock({ chain, title, networkTotalClaimableFiatBalance, link }: Props) {
  const { toCurrency } = useCurrency()
  const { isDesktop, isMobile } = useBreakpoints()

  const iconSize = isDesktop ? 14 : 8
  return (
    <Card
      variant="level1"
      p={['sm', 'md']}
      shadow="xl"
      border="1px solid"
      borderColor="border.base"
      flex="1"
      minW={['320px']}
      maxW={['auto', 'auto', '410px']}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <HStack>
          <NetworkIcon chain={chain} size={iconSize} />

          <Stack gap={1}>
            <Heading size={['sm', 'md']} textTransform={'capitalize'}>
              {title || chainToSlugMap[chain]}
            </Heading>
            {isDesktop && (
              <Heading size="md" variant="special">
                {toCurrency(networkTotalClaimableFiatBalance)}
              </Heading>
            )}
          </Stack>
        </HStack>

        {isMobile && (
          <Link href={link}>
            <HStack alignItems="center" gap={0}>
              <Heading size="sm" variant="sand">
                {toCurrency(networkTotalClaimableFiatBalance)}
              </Heading>
              <IconButton variant="ghost" icon={<ChevronRight />} aria-label="" />
            </HStack>
          </Link>
        )}
        {isDesktop && (
          <Link href={link}>
            <Button variant="secondary">View</Button>
          </Link>
        )}
      </Flex>
    </Card>
  )
}
