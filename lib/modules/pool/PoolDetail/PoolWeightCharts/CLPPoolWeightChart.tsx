import { Box, HStack, Grid, useTheme, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import PoolWeightChartLegend from './PoolWeightChartLegend'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import Image from 'next/image'

const chartSizes: Record<string, Record<string, ChartSizeValues>> = {
  square: {
    small: {
      chartHeight: '150px',
      boxWidth: 100,
      boxHeight: 100,
      haloTop: '40%',
      haloLeft: '55px',
      haloWidth: '40px',
      haloHeigth: '40px',
    },
    normal: {
      chartHeight: '',
      boxWidth: 160,
      boxHeight: 160,
      haloTop: '49%',
      haloLeft: '95px',
      haloWidth: '60px',
      haloHeigth: '60px',
    },
  },
  diamond: {
    small: {
      chartHeight: '150px',
      boxWidth: 150,
      boxHeight: 150,
      haloTop: '40%',
      haloLeft: '55px',
      haloWidth: '40px',
      haloHeigth: '40px',
    },
    normal: {
      chartHeight: '',
      boxWidth: 225,
      boxHeight: 114,
      haloTop: '49%',
      haloLeft: '95px',
      haloWidth: '60px',
      haloHeigth: '60px',
    },
  },
}

function OuterSymbolDiamond({ opacity, isSmall }: { opacity: string; isSmall: boolean }) {
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

function InnerSymbolDiamond({ opacity }: { opacity: string }) {
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

export default function CLPPoolWeightChart({
  pool,
  chain,
  hasLegend,
  isSmall,
  colors = [],
}: PoolWeightChartProps) {
  const colorMode = useThemeColorMode()

  function getChartSizeValues() {
    const chartSizeKey = isSmall ? 'small' : 'normal'
    if (pool.poolTokens.length === 2) {
      return chartSizes.diamond[chartSizeKey]
    }
    return chartSizes.square[chartSizeKey]
  }

  function getLegendOffset() {
    if (pool.poolTokens.length === 2) {
      return '14'
    }
    return '10'
  }

  function getChainIconContainerRatio() {
    if (pool.poolTokens.length === 2) {
      return 0.55
    }
    return 0.75
  }

  const chartSizeValues = getChartSizeValues()

  return (
    <VStack
      mt={isSmall ? '0' : getLegendOffset()}
      position="relative"
      width="full"
      height="full"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxHeight}px`}
        position="relative"
      >
        <Box
          as={motion.div}
          position="absolute"
          transform="translateY(-50%) rotate(45deg)"
          bottom="0"
          left="0"
          right="-1px"
          top="50%"
          mx="auto"
          zIndex={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          width={`${chartSizeValues.boxWidth * getChainIconContainerRatio()}px`}
          height={`${chartSizeValues.boxWidth * getChainIconContainerRatio()}px`}
          bg="background.base"
          rounded="md"
        >
          <NoisyCard
            cardProps={{
              // bg: 'background.base',
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
            <Box
              position="absolute"
              top="50%"
              transform="translateY(-50%) rotate(-45deg)"
              zIndex={5}
            >
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
            <OuterSymbolDiamond opacity="10%" isSmall={isSmall || false} />
            <OuterSymbolDiamond opacity="20%" isSmall={isSmall || false} />
            <OuterSymbolDiamond opacity="20%" isSmall={isSmall || false} />
            <InnerSymbolDiamond opacity="30%" />
            <InnerSymbolDiamond opacity="30%" />
            <InnerSymbolDiamond opacity="30%" />
          </NoisyCard>
        </Box>
        <svg
          style={{ visibility: 'hidden', position: 'absolute' }}
          width="0"
          height="0"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <defs>
            <filter id="round">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        {pool.displayTokens.length === 2 && (
          <Box filter="url(#round)">
            <Box
              bgGradient={`linear(to-r, ${colors[0].from}, ${colors[0].to})`}
              width={`${chartSizeValues.boxWidth}px`}
              height={`${chartSizeValues.boxHeight}px`}
              borderTopRightRadius="xl"
              clipPath="polygon(50% 0, 100% 100%, 0 100%)"
              transform="rotate(90deg) translateY(-50%)"
              position="absolute"
              borderWidth="2px"
              borderColor={`chartBorder.${colorMode}`}
              _hover={{ filter: 'brightness(103%)' }}
            />
            <Box
              bgGradient={`linear(to-r, ${colors[1].from}, ${colors[1].to})`}
              width={`${chartSizeValues.boxWidth}px`}
              height={`${chartSizeValues.boxHeight}px`}
              borderTopRightRadius="xl"
              clipPath="polygon(50% 0, 100% 100%, 0 100%)"
              transform="rotate(-90deg) translateY(-50%)"
              position="absolute"
              _hover={{ filter: 'brightness(103%)' }}
            />
          </Box>
        )}
        {pool.displayTokens.length === 3 && (
          <HStack
            spacing="0"
            zIndex={1}
            width="full"
            height="full"
            rounded="2xl"
            transform="rotate(-135deg)"
          >
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
            {pool.poolTokens.map((_, i) => {
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
        <HStack mt={getLegendOffset()} width="full" justifyContent="center">
          <PoolWeightChartLegend pool={pool} colors={colors} />
        </HStack>
      )}
    </VStack>
  )
}
