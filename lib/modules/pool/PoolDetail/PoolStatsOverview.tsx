'use client'

import React, { useMemo, useState } from 'react'
import { BoxProps, Card, VStack } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { PoolMyStats } from './PoolStatsOverviewMyStats'
import { PoolStats } from './PoolStatsOverviewStats'

const COMMON_NOISY_CARD_PROPS: { contentProps: BoxProps; cardProps: BoxProps } = {
  contentProps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 'none',
    borderTopLeftRadius: 'none',
    borderBottomRightRadius: 'none',
  },
  cardProps: {
    position: 'relative',
    overflow: 'hidden',
  },
}

const TABS = [
  {
    value: 'poolStats',
    label: 'Pool stats',
  },
  {
    value: 'myStats',
    label: 'My stats',
  },
]

export default function PoolStatsOverview() {
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])
  const { pool } = usePool()

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  const options = useMemo(() => {
    return TABS.map(tab => ({
      ...tab,
      disabled: tab.value === 'myStats' && pool.userBalance?.totalBalance === '0.0',
    }))
  }, [pool])

  return (
    <Card h="full" position="relative">
      <NoisyCard
        cardProps={COMMON_NOISY_CARD_PROPS.cardProps}
        contentProps={COMMON_NOISY_CARD_PROPS.contentProps}
      >
        <ZenGarden variant="diamond" sizePx="225px" />
        <VStack
          spacing="xl"
          m="auto"
          align="flex-start"
          w="full"
          justify="flex-start"
          mb="8"
          p="md"
          zIndex={1}
        >
          <ButtonGroup
            size="xxs"
            currentOption={activeTab}
            options={options}
            onChange={handleTabChanged}
            width="70px"
          />
          {activeTab.value === 'poolStats' && <PoolStats />}
          {activeTab.value === 'myStats' && <PoolMyStats />}
        </VStack>
      </NoisyCard>
    </Card>
  )
}
