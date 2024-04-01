'use client'

import { Card, HStack, IconButton } from '@chakra-ui/react'
import Image from 'next/image'
import { usePool } from '../usePool'
import { getNetworkConfig } from '@/lib/config/app.config'
import { CloseIcon } from '@chakra-ui/icons'
import { getPoolPath } from '../pool.utils'
import { usePathname, useRouter } from 'next/navigation'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import Link from 'next/link'

type Tabs = { value: string; label: string }[]

const TABS: Tabs = [
  {
    value: 'add-liquidity',
    label: 'Add',
  },
  {
    value: 'remove-liquidity',
    label: 'Remove',
  },

  {
    value: 'stake',
    label: 'Stake',
  },
  {
    value: 'unstake',
    label: 'Unstake',
  },
]

// TODO: this is tightly coupled with the array above but should be ok I think?
function getTabs(index: number, tabs: Tabs) {
  switch (index) {
    case 0:
    case 1:
    default:
      return tabs.slice(0, 2)
    case 2:
    case 3:
      return tabs.slice(2, 4)
  }
}

export function PoolActionsNav() {
  const pathname = usePathname()
  const pathnameArray = pathname.split('/')
  const lastPathname = pathnameArray[pathnameArray.length - 1]
  const activeTabIndex = TABS.findIndex(tab => tab.value === lastPathname)
  const activeTab = TABS[activeTabIndex]
  const { pool } = usePool()
  const networkConfig = getNetworkConfig(pool.chain)
  const router = useRouter()

  function toggleFlow(option: ButtonGroupOption) {
    if (option.value === lastPathname) return
    router.push(`${getPoolPath(pool)}/${option.value}`)
  }

  return (
    <HStack justify="space-between">
      <Card variant="level2" p="sm" width="auto">
        <Image src={networkConfig.iconPath} width="24" height="24" alt={networkConfig.shortName} />
      </Card>
      <ButtonGroup
        currentOption={activeTab}
        options={getTabs(activeTabIndex, TABS)}
        onChange={toggleFlow}
        size="lg"
      />
      <IconButton
        as={Link}
        href={getPoolPath(pool)}
        isRound={true}
        variant="outline"
        aria-label="Close"
        prefetch={true}
        icon={<CloseIcon />}
      />
    </HStack>
  )
}
