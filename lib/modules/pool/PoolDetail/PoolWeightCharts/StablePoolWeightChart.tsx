import { Box, HStack, Text, Grid, useTheme, useColorMode } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GqlChain, GqlPoolStable } from '@/lib/shared/services/api/generated/graphql'
import { ChartSizeValues } from './PoolWeightChart'
import PoolWeightChartChainIcon from './PoolWeightChartChainIcon'

const colors = [
  {
    from: '#1E4CF1',
    to: '#00FFAA',
  },
  {
    from: '#B2C4DB',
    to: '#FDFDFD',
  },
  {
    from: '#EF4A2B',
    to: '#F48975',
  },
  {
    from: '#FFD600',
    to: '#F48975',
  },
  {
    from: '#9C68AA',
    to: '#C03BE4',
  },
  {
    from: '#FFBD91',
    to: '#FF957B',
  },
  {
    from: '#30CEF0',
    to: '#02A2FE',
  },
]

export interface WeightedPoolWeightChartProps {
  pool: GqlPoolStable
  chain: GqlChain
  hasLegend?: boolean
  isSmall?: boolean
}

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
  boxWidth: 275,
  boxHeight: 275,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

export default function StablePoolWeightChart({
  pool,
  chain,
  hasLegend,
  isSmall,
}: WeightedPoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const { colorMode } = useColorMode()
  return (
    <Box position="relative" width="fit-content" height="fit-content">
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
        {pool.tokens.length <= 3 && (
          <HStack spacing="0" zIndex={1} width="full" height="full" rounded="2xl">
            {pool.tokens.map((_, i) => {
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
                  borderTopRightRadius={i === pool.tokens.length - 1 ? 'xl' : 'none'}
                  borderBottomRightRadius={i === pool.tokens.length - 1 ? 'xl' : 'none'}
                />
              )
            })}
          </HStack>
        )}
        {pool.tokens.length === 4 && (
          <Grid zIndex={1} templateColumns="1fr 1fr" width="full" height="full" rounded="2xl">
            {pool.tokens.map((_, i) => {
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
            spacing="6"
            justifyContent="center"
          >
            {pool.tokens.map((token, i) => {
              return (
                <Box
                  fontWeight="normal"
                  fontSize="1rem"
                  background="none"
                  key={`token-weight-chart-legend-${token.symbol}`}
                >
                  <HStack>
                    <Box width="8px" height="8px" bg={colors[i].from} rounded="full" />
                    <Text whiteSpace="nowrap" color="gray.400">
                      {token.symbol}
                    </Text>
                  </HStack>
                </Box>
              )
            })}
          </HStack>
        )}
      </Box>
    </Box>
  )
}
