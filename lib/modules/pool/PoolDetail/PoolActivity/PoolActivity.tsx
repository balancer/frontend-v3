import { Card, Heading, Stack, VStack, Text } from '@chakra-ui/react'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { usePoolActivity } from './usePoolActivity'
import { PoolActivityChart } from '../PoolActivityChart/PoolActivityChart'

export function PoolActivity() {
  const { isExpanded, setIsExpanded, transactionsLabel, activeTab, tabsList, setActiveTab } =
    usePoolActivity()

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
        <ButtonGroup
          currentOption={activeTab}
          options={tabsList}
          onChange={option => {
            setActiveTab(option)
          }}
          size="xxs"
          groupId="pool-activity"
        />
      </Stack>
      <PoolActivityChart />
    </Card>
  )
}
