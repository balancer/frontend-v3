'use client'

import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { Button, Card, Flex, HStack, Icon, Text, useDisclosure, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { getAuraPoolLink, getPoolActionPath, getTotalAprLabel } from '../../../pool.utils'
import { usePool } from '../../../PoolProvider'
import { fNum } from '@/lib/shared/utils/numbers'
import { getChainId } from '@/lib/config/app.config'
import {
  PartnerRedirectModal,
  RedirectPartner,
} from '@/lib/shared/components/modals/PartnerRedirectModal'

export function StakingOptions() {
  const { chain, pool } = usePool()
  const canStake = !!pool.staking
  const stakePath = getPoolActionPath({
    id: pool.id,
    chain: pool.chain,
    action: 'stake',
  })

  const auraDisclosure = useDisclosure()

  return (
    <>
      <Text mb="2">Staking options</Text>
      <HStack alignItems="stretch" justify="space-between" w="full">
        <Card position="relative" variant="modalSubSection">
          <VStack align="left" spacing="md">
            <Text color="grayText">Balancer</Text>
            <HStack>
              <Text color="font.primary" fontSize="md" fontWeight="bold">
                {/* SHOULD WE USE MAX APR instead of the range?? */}
                {/* {fNum('apr', totalApr)} */}
                {getTotalAprLabel(pool.dynamicData.aprItems)}
              </Text>
              <Icon as={StarsIcon} height="20px" width="20px" />
            </HStack>
            <Flex position="absolute" right={2} top={3}>
              <Image alt="balancer" height={30} src="/images/protocols/balancer.svg" width={30} />
            </Flex>
            <Button
              as={Link}
              href={stakePath}
              isDisabled={!canStake}
              prefetch
              variant={canStake ? 'primary' : 'disabled'}
              w="full"
            >
              Stake
            </Button>
          </VStack>
        </Card>
        <Card position="relative" variant="modalSubSection">
          <VStack align="left" spacing="md">
            <Text color="grayText">Aura</Text>
            <HStack>
              <Text color="font.primary" fontSize="md" fontWeight="bold">
                {pool.staking?.aura ? fNum('apr', pool.staking.aura.apr) : 'Not available'}
              </Text>
            </HStack>
            <Flex position="absolute" right={2} top={3}>
              <Image alt="balancer" height={30} src="/images/protocols/aura.svg" width={30} />
            </Flex>
            {pool.staking && pool.staking.aura ? (
              <>
                <Button onClick={auraDisclosure.onOpen} variant="secondary" w="full">
                  Learn more
                </Button>
                <PartnerRedirectModal
                  isOpen={auraDisclosure.isOpen}
                  onClose={auraDisclosure.onClose}
                  partner={RedirectPartner.Aura}
                  redirectUrl={getAuraPoolLink(getChainId(chain), pool.staking.aura.auraPoolId)}
                />
              </>
            ) : null}
          </VStack>
        </Card>
      </HStack>
    </>
  )
}
