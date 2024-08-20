/* eslint-disable max-len */
'use client'
import ReactECharts from 'echarts-for-react'
import { Box, Button, Divider, HStack, Skeleton, Text, useTheme } from '@chakra-ui/react'
import { usePoolActivityChart } from './usePoolActivityChart'
import { FC, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { usePoolActivity } from '../PoolActivity/usePoolActivity'

const AnimateOpacity: FC<PropsWithChildren<object>> = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
)

export function PoolActivityChart() {
  const { isExpanded, isLoading, setIsExpanded } = usePoolActivity()
  const { chartOption, eChartsRef, chartHeight } = usePoolActivityChart(isExpanded)
  const theme = useTheme()

  const legendTabs = [
    {
      label: 'Adds',
      color: theme.semanticTokens.colors.chart.pool.scatter.add.label,
    },
    {
      label: 'Removes',
      color: theme.semanticTokens.colors.chart.pool.scatter.remove.label,
    },
    {
      label: 'Swaps',
      color: theme.semanticTokens.colors.chart.pool.scatter.swap.label,
    },
  ]

  return (
    <Box position="relative">
      {isLoading && <Skeleton w="100%" h="100%" position="absolute" />}
      {chartOption && (
        <Box>
          <motion.div
            initial={{ height: 90 }}
            animate={{ height: chartHeight, opacity: isExpanded ? [0, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <ReactECharts
              style={{ height: `${chartHeight}px` }}
              option={chartOption}
              onEvents={{}}
              ref={eChartsRef}
            />
          </motion.div>
        </Box>
      )}
      {isExpanded && <Divider pt="2" mb="4" />}
      {!isLoading && (
        <HStack>
          <Button variant="secondary" onClick={() => setIsExpanded(!isExpanded)} size="sm">
            {isExpanded ? 'Minimize' : 'Expand'}
          </Button>
          {isExpanded && (
            <AnimateOpacity>
              <HStack spacing="4" px={['1', '2']}>
                {legendTabs.map((tab, index) => (
                  <HStack alignItems="center" key={index} gap="2">
                    <Box
                      height="2"
                      width="2"
                      backgroundImage={tab.color}
                      borderRadius="50%"
                      display="inline-block"
                    />
                    <Text color="font.secondary" fontSize="sm">
                      {tab.label}
                    </Text>
                  </HStack>
                ))}
              </HStack>
            </AnimateOpacity>
          )}
        </HStack>
      )}
    </Box>
  )
}
