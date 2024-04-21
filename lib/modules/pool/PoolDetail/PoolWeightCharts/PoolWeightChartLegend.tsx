import { Box, HStack, Text } from '@chakra-ui/react'
import { PoolWeightChartColorDef } from './PoolWeightChart'
import { Pool } from '../../usePool'

export default function PoolWeightChartLegend({
  pool,
  colors = [],
}: {
  pool: Pool
  colors?: PoolWeightChartColorDef[]
}) {
  return (
    <HStack spacing="6" zIndex={2}>
      {pool.displayTokens.map((token, i) => {
        return (
          <Box
            fontWeight="normal"
            fontSize="1rem"
            background="none"
            key={`token-weight-chart-legend-${token.symbol}`}
          >
            <HStack>
              <Box width="8px" height="8px" bg={colors[i].from} rounded="full" />
              <Text whiteSpace="nowrap" color="font.secondary">
                {token.symbol}
              </Text>
            </HStack>
          </Box>
        )
      })}
    </HStack>
  )
}
