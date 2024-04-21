import { Box, HStack, Grid, useTheme, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import PoolWeightChartLegend from './PoolWeightChartLegend'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import Image from 'next/image'

const smallSize: ChartSizeValues = {
  chartHeight: '120px',
  boxWidth: 120,
  boxHeight: 120,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: 150,
  boxHeight: 150,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
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
  const chartSizeValues = isSmall ? smallSize : normalSize

  return (
    <VStack
      mt={isSmall ? '0' : '10'}
      position="relative"
      width="full"
      height="full"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxWidth}px`}
        position="relative"
        transform={isSmall ? 'scale(0.85)' : ''}
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
          width={`${chartSizeValues.boxWidth * 0.7}px`}
          height={`${chartSizeValues.boxWidth * 0.7}px`}
          bg="background.base"
          rounded="md"
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

        {pool.displayTokens.length <= 3 && (
          <HStack
            spacing="0"
            zIndex={1}
            width="full"
            height="full"
            rounded="2xl"
            transform="rotate(45deg)"
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
      </Box>
      {hasLegend && (
        <HStack mt="10" width="full" justifyContent="center">
          <PoolWeightChartLegend pool={pool} colors={colors} />
        </HStack>
      )}
    </VStack>
  )
}
