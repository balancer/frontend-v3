/* eslint-disable max-len */
'use client'
import ReactECharts from 'echarts-for-react'
import {
  Box,
  Card,
  Divider,
  Flex,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { FC, PropsWithChildren, useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EcosystemChainSelect } from './EcosystemChainSelect'
import { getChainShortName } from '@/lib/config/app.config'
import { supportedNetworks } from '@/lib/modules/web3/ChainConfig'
import {
  PoolActivityChartTypeTab,
  gradientMap,
  useEcosystemPoolActivityChart,
} from '@/lib/modules/marketing/useEcosystemPoolActivity'
import { createPortal } from 'react-dom'
import useMeasure from 'react-use-measure'

const AnimateOpacity: FC<PropsWithChildren<object>> = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
)

export function EcosystemActivityChart() {
  const chartHeight = 500
  const isLoading = false

  const {
    chartOption,
    activeTab,
    setActiveTab,
    activeNetwork,
    setActiveNetwork,
    tabsList,
    headerInfo,
    eChartsRef,
    tooltipContent,
    tooltipPosition,
    onEvents,
  } = useEcosystemPoolActivityChart()

  const [ref, bounds] = useMeasure({
    scroll: true,
  })

  const legendTabs = supportedNetworks.map(key => {
    return {
      label: getChainShortName(key),
      color: `linear-gradient(to bottom, ${gradientMap[key].from}, ${gradientMap[key].to})`,
    }
  })

  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showTooltip = useCallback(
    (params: any) => {
      onEvents.mousemove(params)
      setIsTooltipVisible(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    },
    [onEvents]
  )

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      onEvents.mouseout()
      setIsTooltipVisible(false)
    }, 100)
  }, [onEvents])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Card>
      <Box position="relative">
        {isLoading && <Skeleton w="100%" h="100%" position="absolute" />}
        <Box opacity={isLoading ? 0 : 1}>
          <Stack
            w="full"
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            width="full"
            justifyContent="space-between"
            alignItems="start"
            role="group"
          >
            <VStack alignItems="flex-start" gap={0.5}>
              <Heading fontWeight="bold" size="h5">
                {headerInfo.total} transactions
              </Heading>
              <Text variant="primary" fontSize="0.85rem">
                In the last {headerInfo.elapsedMinutes} mins
              </Text>
            </VStack>
            <Flex flexWrap="wrap" gap="2">
              <ButtonGroup
                currentOption={activeTab}
                options={tabsList}
                onChange={option => {
                  setActiveTab(option as PoolActivityChartTypeTab)
                }}
                size="xxs"
                groupId="pool-activity"
              />
              <EcosystemChainSelect
                value={activeNetwork}
                onChange={network => {
                  setActiveNetwork(network)
                }}
              />
            </Flex>
          </Stack>
          <Box>
            <Box ref={ref}>
              <ReactECharts
                style={{ height: `${chartHeight}px` }}
                option={chartOption}
                ref={eChartsRef}
                onEvents={{
                  ...onEvents,
                  mousemove: showTooltip,
                  mouseout: hideTooltip,
                }}
              />
              {/* No idea how to get this to work with <Portal> */}
              {createPortal(
                <div
                  ref={tooltipRef}
                  style={{
                    position: 'fixed',
                    left: `${tooltipPosition.x + bounds.left}px`,
                    top: `${tooltipPosition.y + bounds.top}px`,
                    pointerEvents: isTooltipVisible ? 'auto' : 'none',
                    zIndex: 9999,
                    opacity: isTooltipVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={showTooltip}
                  onMouseLeave={hideTooltip}
                >
                  {tooltipContent}
                </div>,
                document.body
              )}
            </Box>
          </Box>
          <AnimateOpacity>
            <Divider pt="2" mb="4" />
            <Flex flexWrap="wrap" gap={['1', '1', '4']} px={['1', '2']}>
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
                  <Text color="font.secondary" fontSize="sm" textTransform="capitalize">
                    {tab.label}
                  </Text>
                </HStack>
              ))}
            </Flex>
          </AnimateOpacity>
        </Box>
      </Box>
    </Card>
  )
}
