import { Box, HStack, Grid, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import PoolWeightChartChainIcon from './PoolWeightChartChainIcon'
import PoolWeightChartLegend from './PoolWeightChartLegend'
import { useThemeColor } from '@/lib/shared/services/chakra/useThemeColor'

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

export default function CLPPoolWeightChart({
  pool,
  chain,
  hasLegend,
  isSmall,
  colors = [],
}: PoolWeightChartProps) {
  const themeColor = useThemeColor()

  function getChartSizeValues() {
    const chartSizeKey = isSmall ? 'small' : 'normal'
    if (pool.tokens.length === 2) {
      return chartSizes.diamond[chartSizeKey]
    }
    return chartSizes.square[chartSizeKey]
  }

  function getLegendOffset() {
    if (pool.tokens.length === 2) {
      return '-5rem'
    }
    return '-4rem'
  }

  const chartSizeValues = getChartSizeValues()

  return (
    <Flex
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
              borderColor={`chartBorder.${themeColor}`}
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
                  borderColor={`chartBorder.${themeColor}`}
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
            {pool.tokens.map((_, i) => {
              return (
                <Box
                  key={`${pool.address}-token-weight-${i}`}
                  as={motion.div}
                  cursor="pointer"
                  bgGradient={`linear(to-b, ${colors[i].from}, ${colors[i].to})`}
                  borderColor={`chartBorder.${themeColor}`}
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
            bottom={getLegendOffset()}
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
