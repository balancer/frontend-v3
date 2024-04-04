'use client'

import { Box, HStack, Grid, useTheme, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import Image from 'next/image'
import PoolWeightChartLegend from './PoolWeightChartLegend'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'

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

function OuterSymbolSquare({ opacity, isSmall }: { opacity: string; isSmall: boolean }) {
  const colorMode = useThemeColorMode()
  const theme = useTheme()
  const colorModeKey = colorMode === 'light' ? 'default' : '_dark'
  const chartOuter = isSmall ? '' : theme.semanticTokens.shadows.chartIconOuter[colorModeKey]
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      width="55%"
      height="55%"
      overflow="hidden"
      filter={chartOuter}
      opacity={opacity}
      display="flex"
      justifyContent="center"
      alignItems="center"
      rounded="md"
    >
      <Box bg="background.level3" width="full" height="full" filter={chartOuter} shadow="2xl" />
    </Box>
  )
}

function InnerSymbolSquare({ opacity }: { opacity: string }) {
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      width="45%"
      height="45%"
      overflow="hidden"
      rounded="md"
      opacity={opacity}
    >
      <Box
        bg="background.level4"
        width="full"
        height="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
      ></Box>
    </Box>
  )
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
    <VStack
      mt={isSmall ? '0' : '8'}
      position="relative"
      width="full"
      height="full"
      justifyContent="center"
      alignItems="center"
      spacing="4"
    >
      <Box
        width={`${chartSizeValues.boxWidth * 0.75}px`}
        height={`${chartSizeValues.boxHeight * 0.75}px`}
        position="relative"
      >
        <Box
          as={motion.div}
          rounded="md"
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
          width={`${chartSizeValues.boxWidth * 0.58}px`}
          height={`${chartSizeValues.boxHeight * 0.58}px`}
          bg="background.base"
        >
          <NoisyCard
            cardProps={{
              rounded: 'md',
              shadow: 'none',
            }}
            contentProps={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              shadow: 'innerXl',
              rounded: 'md',
            }}
            shadowContainerProps={{ shadow: 'none' }}
          >
            <Box position="absolute" top="50%" transform="translateY(-50%)" zIndex={5}>
              <Image
                src={`/images/chains/${chain}.svg`}
                alt={`Chain icon for ${chain.toLowerCase()}`}
                width={isSmall ? 15 : 25}
                height={isSmall ? 15 : 25}
              />
            </Box>

            {/* Since these triangles utilise clip-path, we cannot use box-shadow, we need to utilise css filters */}
            {/* Simply applying an opacity to the background color will achieve weird effects, so to match the designs */}
            {/* We utilise layers of the same component! */}
            <OuterSymbolSquare opacity="10%" isSmall={isSmall || false} />
            <OuterSymbolSquare opacity="20%" isSmall={isSmall || false} />
            <OuterSymbolSquare opacity="20%" isSmall={isSmall || false} />
            <InnerSymbolSquare opacity="30%" />
            <InnerSymbolSquare opacity="30%" />
            <InnerSymbolSquare opacity="30%" />
          </NoisyCard>
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
      </Box>
      {hasLegend && (
        <HStack width="full" justifyContent="center">
          <PoolWeightChartLegend pool={pool} colors={colors} />
        </HStack>
      )}
    </VStack>
  )
}
