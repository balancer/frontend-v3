'use client'

import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { Button, Card, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAprLabel } from '../../../pool.utils'
import { usePool } from '../../../usePool'

export function StakingOptions() {
  const { pool } = usePool()
  const pathname = usePathname()

  const stakePath = pathname.replace('/add-liquidity', '/stake')
  const canStake = !!pool.staking

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
                {getAprLabel(pool.dynamicData.apr.apr)}
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
              <Text fontWeight="bold" color="font.primary" fontSize="md" opacity={0.2}>
                Support coming soon
              </Text>
            </HStack>

            <Flex position="absolute" top={3} right={2}>
              <Image src="/images/protocols/aura.svg" width={30} height={30} alt="balancer" />
            </Flex>

            <Button
              as={Link}
              target="_blank"
              href={'https://aura.finance/'}
              w="full"
              variant={'secondary'}
              isDisabled
            >
              Learn more
            </Button>
          </VStack>
        </Card>
      </HStack>
    </>
  )
}
