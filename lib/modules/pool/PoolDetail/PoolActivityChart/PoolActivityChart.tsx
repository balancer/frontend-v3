/* eslint-disable max-len */
'use client'
import ReactECharts from 'echarts-for-react'
import {
  Box,
  Card,
  Divider,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
  useTheme,
} from '@chakra-ui/react'
import { usePoolActivityChart } from './usePoolActivityChart'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { FC, PropsWithChildren, useState } from 'react'
import { ExpandIcon } from '@/lib/shared/components/icons/ExpandIcon'
import { ElevatedIcon } from '@/lib/shared/components/icons/ElevatedIcon'
import { motion } from 'framer-motion'
import { fNum } from '@/lib/shared/utils/numbers'

const AnimateOpacity: FC<PropsWithChildren<object>> = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
)

export function PoolActivityChart() {
  const [isExpanded, setIsExpanded] = useState(false)
  const chartHeight = isExpanded ? 300 : 90

  const {
    chartOption,
    activeTab,
    setActiveTab,
    tabsList,
    eChartsRef,
    dataSize,
    isLoading,
    getChartTitle,
    getChartDateCaption,
  } = usePoolActivityChart(isExpanded)

  const theme = useTheme()

  const legendTabs = [
    {
      label: 'Adds',
      color: `linear-gradient(to bottom, ${theme.semanticTokens.colors.chart.pool.scatter.add.from}, ${theme.semanticTokens.colors.chart.pool.scatter.add.to})`,
    },
    {
      label: 'Removes',
      color: `linear-gradient(to bottom, ${theme.semanticTokens.colors.chart.pool.scatter.remove.from}, ${theme.semanticTokens.colors.chart.pool.scatter.remove.to})`,
    },
    {
      label: 'Swaps',
      color: `linear-gradient(to bottom, ${theme.semanticTokens.colors.chart.pool.scatter.swap.from}, ${theme.semanticTokens.colors.chart.pool.scatter.swap.to})`,
    },
  ]

  return (
    <Card>
      <Box position="relative">
        {isLoading && <Skeleton w="100%" h="100%" position="absolute" />}

        <Box opacity={isLoading ? 0 : 1}>
          <Stack
            w="full"
            direction={isExpanded ? { base: 'column', sm: 'row' } : 'row'}
            justify="space-between"
            width="full"
            justifyContent="space-between"
            alignItems="start"
            onClick={() => {
              setIsExpanded(true)
            }}
            _hover={isExpanded ? {} : { cursor: 'pointer' }}
            role="group"
          >
            <VStack alignItems="flex-start" gap={0.5}>
              <Heading
                fontWeight="bold"
                size="h5"
                _groupHover={isExpanded ? {} : { color: 'font.maxContrast' }}
              >
                {fNum('integer', dataSize)} {getChartTitle()}
              </Heading>
              <Text
                variant="primary"
                fontSize="0.85rem"
                _groupHover={isExpanded ? {} : { color: 'font.maxContrast' }}
              >
                {getChartDateCaption()}
              </Text>
            </VStack>

            {isExpanded ? (
              <AnimateOpacity>
                <ButtonGroup
                  currentOption={activeTab}
                  options={tabsList}
                  onChange={option => {
                    setActiveTab(option)
                  }}
                  size="xxs"
                  groupId="pool-activity"
                />
              </AnimateOpacity>
            ) : (
              <ElevatedIcon
                background="background.level4"
                as={ExpandIcon}
                sizePx="32px"
                boxSize={5}
                style={{ color: 'font.maxContrast' }}
                _groupHover={{ color: 'green.400 !important' }}
              />
            )}
          </Stack>
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

          {isExpanded && (
            <AnimateOpacity>
              <Divider pt="2" mb="4" />

              <HStack spacing="4" px={['1', '2']}>
                {legendTabs.map((tab, index) => (
                  <HStack alignItems="center" key={index} gap="2">
                    <Box
                      key={index}
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
        </Box>
      </Box>
    </Card>
  )
}
