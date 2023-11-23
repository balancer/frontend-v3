import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Card, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const TABS = [
  {
    id: 'pool',
    label: 'Pool',
  },
  {
    id: 'unclaimed',
    label: 'Unclaimed',
  },
  {
    id: 'my-total',
    label: 'My total',
  },
]

export default function PoolIncentives() {
  const [activeTab, setActiveTab] = useState(TABS[0])

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  return (
    <Card variant="gradient" width="full" height="320px">
      <HStack p="5" justifyContent="space-between">
        <Text variant="heading" fontWeight="bold" as="h2" fontSize="xl">
          Incentives
        </Text>
        <ButtonGroup value={activeTab} options={TABS} onChange={handleTabChanged} />
      </HStack>
      <Box p="4" pt="0">
        <Card borderWidth={1} borderColor="borderColor" bg="sand.50" shadow="none">
          <VStack width="full">
            <Box width="full" borderBottomWidth={1} borderColor="borderColor">
              <HStack py="3" px="4" width="full" justifyContent="space-between">
                <VStack spacing="0" alignItems="flex-start">
                  <Text variant="heading" fontWeight="bold" as="h3" fontSize="1rem">
                    Pool incentives this week
                  </Text>
                  <Text variant="secondary" fontSize="0.85rem">
                    Gauge votes
                  </Text>
                </VStack>
                <VStack spacing="0" alignItems="flex-end">
                  <Text variant="heading" fontWeight="bold" as="h3" fontSize="1rem">
                    $3,000.00
                  </Text>
                  <Text variant="secondary" fontSize="0.85rem">
                    1.34%
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <VStack p="4" py="2" pb="4" width="full">
              <TokenRow address="0x3" />
              <TokenRow address="0x3" />
            </VStack>
          </VStack>
        </Card>
      </Box>
    </Card>
  )
}
