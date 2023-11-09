import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import GradientText from '@/lib/shared/components/text/GradientText'
import { Box, Card, HStack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

const TABS = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'unstaked',
    label: 'Unstaked',
  },
  {
    id: 'staked',
    label: 'Staked',
  },
  {
    id: 'third-parties',
    label: '3rd parties',
  },
]
export default function PoolMyLiquidity() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  return (
    <Card variant="gradient" width="full" height="320px">
      <HStack p="5" justifyContent="space-between">
        <Text variant="heading" fontWeight="bold" as="h2" fontSize="xl">
          My liquidity
        </Text>
        <ButtonGroup value={activeTab} options={TABS} />
      </HStack>
    </Card>
  )
}
