'use client'

import {
  Badge,
  Flex,
  HStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react'
import { usePool } from '../../PoolProvider'
import Image from 'next/image'
import { fNum } from '@/lib/shared/utils/numbers'
import { Repeat } from 'react-feather'
import { PoolListTokenPills } from '../../PoolList/PoolListTokenPills'
import { shouldHideSwapFee } from '../../pool.utils'
import { getChainShortName } from '@/lib/config/app.config'

export default function PoolMetaBadges() {
  const { pool, chain } = usePool()

  return (
    <Flex gap={{ base: 'xs', sm: 'sm' }} alignItems="center" wrap="wrap">
      <Badge
        py="2.5"
        px="2.5"
        rounded="full"
        background="background.level2"
        border="1px solid"
        borderColor="border.base"
        shadow="sm"
        title={getChainShortName(chain)}
      >
        <Image
          src={`/images/chains/${chain}.svg`}
          alt={`Chain icon for ${chain.toLowerCase()}`}
          width={20}
          height={20}
        />
      </Badge>
      <PoolListTokenPills pool={pool} py="2" px="sm" />
      {!shouldHideSwapFee(pool.type) && (
        <Popover trigger="hover">
          <PopoverTrigger>
            <Badge
              fontWeight="normal"
              py="xs"
              px="sm"
              background="background.level2"
              border="1px solid"
              borderColor="border.base"
              shadow="sm"
              rounded="full"
              display="flex"
              alignItems="center"
              h={{ base: '28px' }}
            >
              <HStack color="font.primary">
                <Repeat size={12} />
                <Text fontSize="xs">{fNum('feePercent', pool.dynamicData.swapFee)}</Text>
              </HStack>
            </Badge>
          </PopoverTrigger>
          <PopoverContent p="sm" w="auto" maxW="300px">
            <Text fontSize="sm" variant="secondary">
              The swap fee rate earned by Liquidity Providers anytime a swap is routed through this
              pool. These fees automatically accumulate into each LP&rsquo;s position.
            </Text>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  )
}
