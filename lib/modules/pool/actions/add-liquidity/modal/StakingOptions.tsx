'use client'

import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { Button, Card, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { getAuraPoolLink, getPoolActionPath, getTotalAprLabel } from '../../../pool.utils'
import { usePool } from '../../../PoolProvider'
import { fNum } from '@/lib/shared/utils/numbers'
import { getChainId } from '@/lib/config/app.config'

export function StakingOptions() {
  const { chain, pool } = usePool()
  const canStake = !!pool.staking
  const stakePath = getPoolActionPath({
    id: pool.id,
    chain: pool.chain,
    action: 'stake',
  })

  return (
    <>
      <Text mb="2">Staking options</Text>
      <HStack w="full" justify="space-between" alignItems="stretch">
        <Card variant="modalSubSection" position="relative">
          <VStack align="left" spacing="md">
            <Text color="grayText">Balancer</Text>
            <HStack>
              <Text fontWeight="bold" color="font.primary" fontSize="md">
                {/* SHOULD WE USE MAX APR instead of the range?? */}
                {/* {fNum('apr', totalApr)} */}
                {getTotalAprLabel(pool.dynamicData.aprItems)}
              </Text>
              <Icon as={StarsIcon} width="20px" height="20px" />
            </HStack>
            <Flex position="absolute" top={3} right={2}>
              <Image src="/images/protocols/balancer.svg" width={30} height={30} alt="balancer" />
            </Flex>
            <Button
              as={Link}
              href={stakePath}
              w="full"
              variant={canStake ? 'primary' : 'disabled'}
              isDisabled={!canStake}
              prefetch={true}
            >
              Stake
            </Button>
          </VStack>
        </Card>
        <Card variant="modalSubSection" position="relative">
          <VStack align="left" spacing="md">
            <Text color="grayText">Aura</Text>
            <HStack>
              <Text fontWeight="bold" color="font.primary" fontSize="md">
                {pool.staking?.aura ? fNum('apr', pool.staking.aura.apr) : 'Not available'}
              </Text>
            </HStack>
            <Flex position="absolute" top={3} right={2}>
              <Image src="/images/protocols/aura.svg" width={30} height={30} alt="balancer" />
            </Flex>
            {pool.staking && pool.staking.aura && (
              <Button
                as={Link}
                target="_blank"
                href={getAuraPoolLink(getChainId(chain), pool.staking.aura.auraPoolId)}
                w="full"
                variant={'secondary'}
              >
                Learn more
              </Button>
            )}
          </VStack>
        </Card>
      </HStack>
    </>
  )
}
