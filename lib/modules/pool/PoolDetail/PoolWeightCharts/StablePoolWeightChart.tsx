'use client'

import { Box, HStack, Grid, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import PoolWeightChartChainIcon from './PoolWeightChartChainIcon'
import PoolWeightChartLegend from './PoolWeightChartLegend'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'

const smallSize: ChartSizeValues = {
  chartHeight: '150px',
  boxWidth: 150,
  boxHeight: 150,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: 225,
  boxHeight: 225,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

export default function StablePoolWeightChart({
  pool,
  chain,
  hasLegend,
  colors = [],
  isSmall,
}: PoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const colorMode = useThemeColorMode()

  return (
    <Flex
      position="relative"
      width="full"
      height="full"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={`${chartSizeValues.boxWidth * 0.75}px`}
        height={`${chartSizeValues.boxHeight * 0.75}px`}
        position="relative"
      >
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          transform="translateY(-50%)"
          bottom="0"
          left="0"
          right="0"
          top="50%"
          mx="auto"
          zIndex={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          width={chartSizeValues.haloWidth}
          height={chartSizeValues.haloHeigth}
        >
          <PoolWeightChartChainIcon chain={chain} isChartLoaded={true} isSmall={isSmall} />
        </Box>
        {pool.displayTokens.length <= 3 && (
          <HStack spacing="0" zIndex={1} width="full" height="full" rounded="2xl">
            {pool.displayTokens.map((_, i) => {
              return (
                <Box
                  borderColor={`chartBorder.${colorMode}`}
                  borderWidth="1px"
                  key={`${pool.address}-token-weight-${i}`}
                  as={motion.div}
                  cursor="pointer"
                  width="full"
                  bgGradient={`linear(to-b, ${colors[i].from}, ${colors[i].to})`}
                  height="full"
                  _hover={{ filter: 'brightness(103%)' }}
                  borderTopLeftRadius={i === 0 ? 'xl' : 'none'}
                  borderBottomLeftRadius={i === 0 ? 'xl' : 'none'}
                  borderTopRightRadius={i === pool.displayTokens.length - 1 ? 'xl' : 'none'}
                  borderBottomRightRadius={i === pool.displayTokens.length - 1 ? 'xl' : 'none'}
                />
              )
            })}
          </HStack>
        )}
        {pool.displayTokens.length === 4 && (
          <Grid zIndex={1} templateColumns="1fr 1fr" width="full" height="full" rounded="2xl">
            {pool.displayTokens.map((_, i) => {
              return (
                <Box
                  key={`${pool.address}-token-weight-${i}`}
                  as={motion.div}
                  cursor="pointer"
                  bgGradient={`linear(to-b, ${colors[i].from}, ${colors[i].to})`}
                  borderColor={`chartBorder.${colorMode}`}
                  borderWidth="1px"
                  _hover={{ filter: 'brightness(103%)' }}
                  borderTopLeftRadius={i === 0 ? 'xl' : 'none'}
                  borderBottomLeftRadius={i === 2 ? 'xl' : 'none'}
                  borderTopRightRadius={i === 1 ? 'xl' : 'none'}
                  borderBottomRightRadius={i === 3 ? 'xl' : 'none'}
                />
              )
            })}
          </Grid>
        )}
        {hasLegend && (
          <HStack
            width="full"
            bottom="-2.5rem"
            position="absolute"
            left="0"
            right="0"
            mx="auto"
            justifyContent="center"
          >
            <PoolWeightChartLegend pool={pool} colors={colors} />
          </HStack>
        )}
      </Box>
    </Flex>
  )
}
