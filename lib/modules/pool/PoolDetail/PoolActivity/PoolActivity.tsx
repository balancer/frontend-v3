import { Card, Heading, Stack, VStack, Text, HStack, Skeleton, Box } from '@chakra-ui/react'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { PoolActivityProvider, usePoolActivity } from './usePoolActivity'
import { PoolActivityChart } from '../PoolActivityChart/PoolActivityChart'
import { PoolActivityTable } from '../PoolActivityTable/PoolActivityTable'
import { PoolActivityViewType } from '../PoolActivityViewType/PoolActivityViewType'
import {
  PoolActivityViewTypeProvider,
  usePoolActivityViewType,
} from '../PoolActivityViewType/usePoolActivityViewType'

export function PoolActivity() {
  return (
    <PoolActivityViewTypeProvider>
      <PoolActivityProvider>
        <Content />
      </PoolActivityProvider>
    </PoolActivityViewTypeProvider>
  )
}

function Content() {
  const { isExpanded, transactionsLabel, activeTab, tabsList, setActiveTab, isLoading } =
    usePoolActivity()

  const { isChartView, isListView } = usePoolActivityViewType()

  return (
    <Card>
      <Stack
        w="full"
        direction={isExpanded ? { base: 'column', sm: 'row' } : 'row'}
        justify="space-between"
        width="full"
        justifyContent="space-between"
        alignItems="start"
      >
        <VStack alignItems="flex-start" gap="0.5">
          <Heading fontWeight="bold" size="h5">
            Pool Activity
          </Heading>
          {isLoading ? (
            <Skeleton height="20px" w="100px" />
          ) : (
            <Text fontWeight="medium" variant="secondary" fontSize="sm">
              {transactionsLabel}
            </Text>
          )}
        </VStack>
        <HStack>
          <ButtonGroup
            currentOption={activeTab}
            options={tabsList}
            onChange={option => {
              setActiveTab(option)
            }}
            size="xxs"
            groupId="pool-activity"
          />
          <PoolActivityViewType />
        </HStack>
      </Stack>
      <Box mt="4">
        {isChartView && <PoolActivityChart />}
        {isListView && <PoolActivityTable />}
      </Box>
    </Card>
  )
}
