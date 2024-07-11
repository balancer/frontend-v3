import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useProtocolStats } from '@/lib/shared/hooks/useProtocolStats'
import { fNum } from '@/lib/shared/utils/numbers'
import { Center, Box, Text, useColorMode, SimpleGrid, Skeleton } from '@chakra-ui/react'
import { useMemo } from 'react'

type ProtocolStatsSectionProps = {
  title: string
  value: string
  isLoading?: boolean
}
function ProtocolStatItem({ title, value, isLoading }: ProtocolStatsSectionProps) {
  const { colorMode } = useColorMode()

  return (
    <Box position="relative" rounded="full">
      <Center>
        <picture className="picture enso">
          <source
            srcSet="/images/homepage/enso1.png"
            media={colorMode === 'dark' ? 'all' : 'none'}
          />

          <img
            src="/images/homepage/enso3.png"
            alt="Plugged into Balancer vault"
            loading="lazy"
            decoding="async"
            width="100%"
            height="100%"
            object-fit="cover"
            border-radius="100%"
          />
        </picture>

        <Box
          textAlign="center"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%,-50%)"
          zIndex="10"
        >
          <Box>
            <Text color={colorMode === 'dark' ? 'white' : 'font.dark'}>{title}</Text>
          </Box>
          <Box>
            {isLoading ? (
              <Skeleton height="8" w="16" />
            ) : (
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colorMode === 'dark' ? 'white' : 'font.dark'}
              >
                {value}
              </Text>
            )}
          </Box>
        </Box>
      </Center>
    </Box>
  )
}

export function ProtocolStatsSection() {
  const { statQuery } = useProtocolStats()
  const { toCurrency } = useCurrency()

  const stats = useMemo(() => {
    const data = statQuery.data?.protocolMetricsAggregated
    const totalLiquidity = data?.totalLiquidity ?? 0
    const swapVolume24h = data?.swapVolume24h ?? 0
    const numLiquidityProviders = data?.numLiquidityProviders ?? 0
    const swapFee24h = data?.swapFee24h ?? 0

    return [
      {
        title: 'TVL',
        value: toCurrency(totalLiquidity),
      },
      {
        title: 'Vol 24h',
        value: toCurrency(swapVolume24h),
      },

      {
        title: 'Swap fees 24h',
        value: toCurrency(swapFee24h),
      },
      {
        title: 'LPs',
        value: fNum('integer', numLiquidityProviders),
      },
    ]
  }, [statQuery.data, toCurrency])

  return (
    <SimpleGrid
      columns={{ base: 2, md: 4 }}
      spacing={{ base: 4, md: 8 }}
      maxW={{ base: '500px', md: '100%' }}
    >
      {stats.map((stat, index) => (
        <ProtocolStatItem
          key={index}
          title={stat.title}
          value={stat.value}
          isLoading={statQuery.loading}
        />
      ))}
    </SimpleGrid>
  )
}
