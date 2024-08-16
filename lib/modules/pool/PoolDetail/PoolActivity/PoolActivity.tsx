import { Card, Heading, Stack, VStack, Text, HStack } from '@chakra-ui/react'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { usePoolActivity } from './usePoolActivity'
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
      <PoolActivityContent />
    </PoolActivityViewTypeProvider>
  )
}

function PoolActivityContent() {
  const { isExpanded, setIsExpanded, transactionsLabel, activeTab, tabsList, setActiveTab } =
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
            Pool Activity
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="sm">
            {transactionsLabel}
          </Text>
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
      {isChartView && <PoolActivityChart />}
      {isListView && <PoolActivityTable />}
    </Card>
  )
}
