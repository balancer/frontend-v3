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

const TABS = [
  {
    id: 'add-liquidity',
    label: 'Add',
  },
  {
    id: 'remove-liquidity',
    label: 'Remove',
  },
]

export function PoolActionsNav() {
  const pathname = usePathname()
  const activeTab = pathname.includes('remove') ? TABS[1] : TABS[0]
  const { pool } = usePool()
  const networkConfig = getNetworkConfig(pool.chain)
  const router = useRouter()

  function toggleFlow(option: ButtonGroupOption) {
    if (pathname.includes(option.id)) return
    router.push(`${getPoolPath(pool)}/${option.id}`)
  }

  return (
    <HStack justify="space-between">
      <Card variant="level3" p="sm">
        <Image src={networkConfig.iconPath} width="24" height="24" alt={networkConfig.shortName} />
      </Card>
      <ButtonGroup value={activeTab} options={TABS} onChange={toggleFlow} size="lg" />
      <IconButton
        as="a"
        href={getPoolPath(pool)}
        isRound={true}
        variant="outline"
        aria-label="Close"
        icon={<CloseIcon />}
      />
    </HStack>
  )
}
