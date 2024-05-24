'use client'

import React, { useEffect, useState } from 'react'
import { Box, BoxProps, Card, VStack } from '@chakra-ui/react'
import { usePool } from '../../../PoolProvider'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { UserSnapshotValues } from './UserSnapshotValues'
import { PoolSnapshotValues } from './PoolSnapshotValues'

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

export function PoolSnapshot() {
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])
  const { pool } = usePool()

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  useEffect(() => {
    if (pool.userBalance?.totalBalance !== '0.0') {
      setActiveTab(TABS[1])
    }
  }, [pool])

  return (
    <Card h="full" position="relative">
      <NoisyCard
        cardProps={COMMON_NOISY_CARD_PROPS.cardProps}
        contentProps={COMMON_NOISY_CARD_PROPS.contentProps}
      >
        <Box top={0} bottom={0} left={0} right={0} position="absolute" overflow="hidden">
          <ZenGarden variant="diamond" sizePx="225px" />
        </Box>
        <VStack
          spacing="xl"
          m="auto"
          align="flex-start"
          w="full"
          justify="flex-start"
          mb="8"
          p={{ base: 'sm', md: 'md' }}
          zIndex={1}
        >
          <ButtonGroup
            size="xxs"
            currentOption={activeTab}
            options={TABS}
            onChange={handleTabChanged}
            width="70px"
          />
          {activeTab.value === 'poolStats' && <PoolSnapshotValues />}
          {activeTab.value === 'myStats' && <UserSnapshotValues />}
        </VStack>
      </NoisyCard>
    </Card>
  )
}
