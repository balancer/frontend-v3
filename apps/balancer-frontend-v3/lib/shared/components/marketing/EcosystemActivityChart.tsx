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
import { FC, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

import { EcosystemChainSelect } from './EcosystemChainSelect'
import { getChainShortName } from '@/lib/config/app.config'
import { supportedNetworks } from '@/lib/modules/web3/ChainConfig'
import {
  PoolActivityChartTypeTab,
  gradientMap,
  useEcosystemPoolActivityChart,
} from '@/lib/modules/marketing/useEcosystemPoolActivity'

const AnimateOpacity: FC<PropsWithChildren<object>> = ({ children }) => (
  <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }}>
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
  } = useEcosystemPoolActivityChart()

  const legendTabs = supportedNetworks.map(key => {
    return {
      label: getChainShortName(key),
      color: `linear-gradient(to bottom, ${gradientMap[key].from}, ${gradientMap[key].to})`,
    }
  })

  return (
    <Card>
      <Box position="relative">
        {isLoading ? <Skeleton h="100%" position="absolute" w="100%" /> : null}

        <Box opacity={isLoading ? 0 : 1}>
          <Stack
            alignItems="start"
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            justifyContent="space-between"
            role="group"
            w="full"
            width="full"
          >
            <VStack alignItems="flex-start" gap={0.5}>
              <Heading fontWeight="bold" size="h5">
                {headerInfo.total} transactions
              </Heading>
              <Text fontSize="0.85rem" variant="primary">
                In the last {headerInfo.elapsedMinutes} mins
              </Text>
            </VStack>

            <Flex flexWrap="wrap" gap="2">
              <ButtonGroup
                currentOption={activeTab}
                groupId="pool-activity"
                onChange={option => {
                  setActiveTab(option as PoolActivityChartTypeTab)
                }}
                options={tabsList}
                size="xxs"
              />

              <EcosystemChainSelect
                onChange={network => {
                  setActiveNetwork(network)
                }}
                value={activeNetwork}
              />
            </Flex>
          </Stack>
          <Box>
            <ReactECharts
              option={chartOption}
              ref={eChartsRef}
              style={{ height: `${chartHeight}px` }}
            />
          </Box>

          <AnimateOpacity>
            <Divider mb="4" pt="2" />

            <Flex flexWrap="wrap" gap={['1', '1', '4']} px={['1', '2']}>
              {legendTabs.map((tab, index) => (
                <HStack alignItems="center" gap="2" key={index}>
                  <Box
                    backgroundImage={tab.color}
                    borderRadius="50%"
                    display="inline-block"
                    height="2"
                    key={index}
                    width="2"
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
