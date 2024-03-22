'use client'

// import TokenRow from '../../tokens/TokenRow/TokenRow'
// import { ButtonGroupOption } from '@/lib/shared/components/btns/button-group/ButtonGroup'
// import { Box, Button, Card, HStack, Heading, Icon, Text, Tooltip, VStack } from '@chakra-ui/react'
// import React, { useState } from 'react'
// import { Address } from 'viem'
import { usePool } from '../usePool'
// import { useClaiming } from '../actions/claim/useClaiming'
// import { ClaimModal } from '../actions/claim/ClaimModal'
// import { Hex } from 'viem'
// import { PoolListItem } from '../pool.types'
import { IncentiveBadge } from '@/lib/shared/components/other/IncentiveBadge'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { sumBy } from 'lodash'
import { useTokens } from '../../tokens/useTokens'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
// import { ChevronDown } from 'react-feather'

// const TABS = [
//   {
//     value: 'pool',
//     label: 'Pool',
//   },
//   {
//     value: 'unclaimed',
//     label: 'Unclaimed',
//   },
//   {
//     value: 'my-total',
//     label: 'My total',
//   },
// ]

export default function PoolIncentives() {
  // const [activeTab, setActiveTab] = useState(TABS[0])
  const { pool, chain } = usePool()
  // const { previewModalDisclosure, disabledReason, isDisabled, hasNoRewards } = useClaiming([
  //   pool,
  // ] as unknown[] as PoolListItem[])
  //
  // function handleTabChanged(option: ButtonGroupOption) {
  //   setActiveTab(option)
  // }
  //
  // const onModalClose = () => {
  //   previewModalDisclosure.onClose()
  // }
  const { priceFor } = useTokens()
  const { toCurrency } = useCurrency()

  const rewards = pool.staking?.gauge?.rewards // || pool.staking?.farm?.rewarders

  const rewardsMapped = rewards?.map(({ tokenAddress, rewardPerSecond }) => ({
    tokenAddress,
    rewardPerSecond,
  }))

  const incentivesWeeklyValue = sumBy(
    rewardsMapped || [],
    rewarder =>
      priceFor(rewarder.tokenAddress, chain) * parseFloat(rewarder.rewardPerSecond) * 86400 * 7
  )

  console.log({ incentivesWeeklyValue })
  return (
    <VStack width="full">
      <HStack spacing="4" width="full" alignItems="flex-start">
        <IncentiveBadge
          label="Pool incentives (1w)"
          value={toCurrency(incentivesWeeklyValue, { abbreviated: false })}
          width="full"
        >
          <Text>bing</Text>
        </IncentiveBadge>
        <IncentiveBadge special label="Claimable incentives" value="$5555" width="full">
          <Text>bing</Text>
        </IncentiveBadge>
      </HStack>
    </VStack>
    // <Card variant="gradient" width="full" minHeight="320px">
    //   <VStack spacing="0" width="full">
    //     <HStack width="full" p="4" justifyContent="space-between">
    //       <Heading fontWeight="bold" size="h5">
    //         Incentives
    //       </Heading>
    //       <ButtonGroup currentOption={activeTab} options={TABS} onChange={handleTabChanged} />
    //     </HStack>
    //     <Box width="full" p="4" pt="0">
    //       <Card borderWidth={1} variant="level5" shadow="none">
    //         <VStack width="full">
    //           <Box width="full" borderBottomWidth={1} borderColor="borderColor">
    //             <HStack py="4" px="4" width="full" justifyContent="space-between">
    //               <VStack spacing="1" alignItems="flex-start">
    //                 <Heading fontWeight="bold" size="h6">
    //                   Pool incentives this week
    //                 </Heading>
    //                 <Text variant="secondary" fontSize="0.85rem">
    //                   Gauge votes
    //                 </Text>
    //               </VStack>
    //               <VStack spacing="1" alignItems="flex-end">
    //                 <Heading fontWeight="bold" size="h6">
    //                   $3000.00
    //                 </Heading>
    //                 <Text variant="secondary" fontSize="0.85rem">
    //                   8.69%
    //                 </Text>
    //               </VStack>
    //             </HStack>
    //           </Box>
    //           <VStack spacing="4" p="4" py="2" pb="4" width="full">
    //             {pool.displayTokens.map(token => {
    //               return (
    //                 <TokenRow
    //                   chain={chain}
    //                   key={`my-liquidity-token-${token.address}`}
    //                   address={token.address as Address}
    //                   // TODO: Fill pool balances
    //                   value={0}
    //                 />
    //               )
    //             })}
    //           </VStack>
    //         </VStack>
    //         <HStack p="4" width="full" justifyContent="flex-start">
    //           <Button variant="secondary">Vote</Button>
    //           <Button variant="disabled" isDisabled>
    //             Incentivize
    //           </Button>
    //           <Tooltip label={isDisabled ? disabledReason : ''}>
    //             <Button
    //               variant="secondary"
    //               w="full"
    //               size="lg"
    //               isDisabled={isDisabled || hasNoRewards}
    //               onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
    //             >
    //               Claim
    //             </Button>
    //           </Tooltip>
    //         </HStack>
    //       </Card>
    //     </Box>
    //   </VStack>
    //   <ClaimModal
    //     isOpen={previewModalDisclosure.isOpen}
    //     onOpen={previewModalDisclosure.onOpen}
    //     onClose={onModalClose}
    //     gaugeAddresses={[(pool.staking?.id || '') as Hex]}
    //     pool={pool as unknown as PoolListItem}
    //   />
    // </Card>
  )
}
