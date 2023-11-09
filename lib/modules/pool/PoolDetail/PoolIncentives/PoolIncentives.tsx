import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Card, HStack, Text } from '@chakra-ui/react'
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
    </Card>
  )
}
