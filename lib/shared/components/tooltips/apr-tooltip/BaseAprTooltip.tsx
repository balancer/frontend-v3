import { GqlPoolAprItem } from '@/lib/shared/services/api/generated/graphql'
import {
  PlacementWithLogical,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Divider,
  Stack,
  Portal,
} from '@chakra-ui/react'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import {
  swapFeesTooltipText,
  useAprTooltip,
  inherentTokenYieldTooltipText,
  extraBalTooltipText,
  lockingIncentivesTooltipText,
  votingIncentivesTooltipText,
  merklIncentivesTooltipText,
} from '@/lib/shared/hooks/useAprTooltip'
import { TooltipAprItem } from './TooltipAprItem'
import BigNumber from 'bignumber.js'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { isVebalPool } from '@/lib/modules/pool/pool.helpers'

interface Props {
  aprItems: GqlPoolAprItem[]
  numberFormatter?: (value: string) => BigNumber
  displayValueFormatter?: (value: BigNumber) => string
  placement?: PlacementWithLogical
  poolId: string
  vebalBoost?: string
  totalBaseText: string | ((balReward?: GqlPoolAprItem) => string)
  totalBaseVeBalText: string
  totalVeBalTitle?: string
  maxVeBalText: string
  customPopoverContent?: React.ReactNode
  shouldDisplayBaseTooltip?: boolean
  shouldDisplayMaxVeBalTooltip?: boolean
  usePortal?: boolean
  children?: React.ReactNode | (({ isOpen }: { isOpen: boolean }) => React.ReactNode)
}

const balRewardGradient =
  // eslint-disable-next-line max-len
  'linear-gradient(90deg, rgba(179, 174, 245, 0.1) 0%, rgba(215, 203, 231, 0.1) 25%, rgba(229, 200, 200, 0.1) 50%, rgba(234, 168, 121, 0.1) 100%)'

const basePopoverAprItemProps = {
  pl: 2,
  pr: 2,
  pb: 3,
  backgroundColor: 'background.level1',
  fontWeight: 700,
}

const defaultDisplayValueFormatter = (value: BigNumber) => fNum('apr', value.toString())
const defaultNumberFormatter = (value: string) => bn(value)

function BaseAprTooltip({
  aprItems,
  poolId,
  numberFormatter,
  displayValueFormatter,
  placement,
  vebalBoost,
  customPopoverContent,
  totalBaseText,
  totalBaseVeBalText,
  totalVeBalTitle,
  maxVeBalText,
  shouldDisplayBaseTooltip,
  shouldDisplayMaxVeBalTooltip,
  children,
  usePortal = true,
}: Props) {
  const colorMode = useThemeColorMode()

  const usedDisplayValueFormatter = displayValueFormatter || defaultDisplayValueFormatter
  const usedNumberFormatter = numberFormatter || defaultNumberFormatter

  const {
    totalBaseDisplayed,
    extraBalAprDisplayed,
    yieldBearingTokensAprDisplayed,
    stakingIncentivesAprDisplayed,
    merklIncentivesAprDisplayed,
    hasMerklIncentives,
    swapFeesDisplayed,
    isSwapFeePresent,
    isYieldPresent,
    isStakingPresent,
    maxVeBalDisplayed,
    yieldBearingTokensDisplayed,
    stakingIncentivesDisplayed,
    subitemPopoverAprItemProps,
    balReward,
    totalBase,
    maxVeBal,
    lockingAprDisplayed,
    votingAprDisplayed,
    isVotingPresent,
    isLockingAprPresent,
    totalCombinedDisplayed,
  } = useAprTooltip({
    aprItems,
    vebalBoost: Number(vebalBoost),
    numberFormatter: usedNumberFormatter,
  })

  const isVebal = isVebalPool(poolId)

  const totalBaseTitle = isVebal
    ? totalBaseVeBalText
    : typeof totalBaseText === 'function'
    ? totalBaseText(balReward)
    : totalBaseText

  const popoverContent = customPopoverContent || (
    <PopoverContent w="fit-content" shadow="3xl" minWidth={['100px', '300px']} p="0">
      <TooltipAprItem
        {...basePopoverAprItemProps}
        displayValueFormatter={usedDisplayValueFormatter}
        pt={3}
        title="Swap fees"
        apr={swapFeesDisplayed}
        aprOpacity={isSwapFeePresent ? 1 : 0.5}
        tooltipText={swapFeesTooltipText}
        bg="background.level3"
      />
      <TooltipAprItem
        {...basePopoverAprItemProps}
        displayValueFormatter={usedDisplayValueFormatter}
        title="Staking incentives"
        apr={stakingIncentivesAprDisplayed}
        aprOpacity={isStakingPresent ? 1 : 0.5}
        bg="background.level3"
      >
        {stakingIncentivesDisplayed.map((item, index) => {
          return (
            <TooltipAprItem
              {...subitemPopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              key={index}
              title={item.title}
              apr={item.apr}
              aprOpacity={1}
              tooltipText={item.tooltipText}
              bg="background.level3"
            />
          )
        })}
      </TooltipAprItem>
      <TooltipAprItem
        {...basePopoverAprItemProps}
        displayValueFormatter={usedDisplayValueFormatter}
        title="Yield bearing tokens"
        apr={yieldBearingTokensAprDisplayed}
        aprOpacity={isYieldPresent ? 1 : 0.5}
        bg="background.level3"
      >
        {yieldBearingTokensDisplayed.map((item, index) => {
          return (
            <TooltipAprItem
              {...subitemPopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              key={index}
              title={item.title}
              apr={item.apr}
              aprOpacity={1}
              tooltipText={inherentTokenYieldTooltipText}
              bg="background.level3"
            />
          )
        })}
      </TooltipAprItem>
      {hasMerklIncentives && (
        <TooltipAprItem
          {...basePopoverAprItemProps}
          displayValueFormatter={usedDisplayValueFormatter}
          title="Merkl.xyz incentives"
          apr={merklIncentivesAprDisplayed}
          aprOpacity={1}
          tooltipText={merklIncentivesTooltipText}
          bg="background.level3"
        />
      )}
      <Divider />
      <TooltipAprItem
        {...basePopoverAprItemProps}
        displayValueFormatter={usedDisplayValueFormatter}
        pt={3}
        backgroundColor="background.level4"
        fontColor="font.maxContrast"
        tooltipText={
          shouldDisplayBaseTooltip
            ? `${defaultDisplayValueFormatter(defaultNumberFormatter(totalBase.toString()))} APR`
            : ''
        }
        title={totalBaseTitle}
        apr={totalBaseDisplayed}
      />
      {isVebal && (
        <>
          <Divider />
          <Stack roundedBottom="md" gap={0}>
            <TooltipAprItem
              pt={3}
              {...basePopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              title="Max locking incentives"
              tooltipText={lockingIncentivesTooltipText}
              apr={lockingAprDisplayed}
              aprOpacity={isLockingAprPresent ? 1 : 0.5}
              bg="background.level3"
            />
            <TooltipAprItem
              {...basePopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              title="Average voting incentives"
              tooltipText={votingIncentivesTooltipText}
              apr={votingAprDisplayed}
              aprOpacity={isVotingPresent ? 1 : 0.5}
              bg="background.level3"
            />
            <Divider />

            <TooltipAprItem
              {...basePopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              pt={3}
              fontColor="font.special"
              title={totalVeBalTitle || 'Total APR'}
              apr={totalCombinedDisplayed}
              boxBackground={balRewardGradient}
              textBackground="background.special"
              textBackgroundClip="text"
              roundedBottom="md"
            />
          </Stack>
        </>
      )}
      {balReward && (
        <>
          <Divider />
          <Stack roundedBottom="md" gap={0}>
            <TooltipAprItem
              {...basePopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              pt={3}
              fontWeight={500}
              fontColor={colorMode == 'light' ? 'gray.600' : 'gray.400'}
              title="Extra BAL (veBAL boost)"
              apr={extraBalAprDisplayed}
              tooltipText={extraBalTooltipText}
              bg="background.level3"
            />
            <Divider />

            <TooltipAprItem
              {...basePopoverAprItemProps}
              displayValueFormatter={usedDisplayValueFormatter}
              pt={3}
              fontColor="font.special"
              title={maxVeBalText || 'Max veBAL APR'}
              tooltipText={
                shouldDisplayMaxVeBalTooltip
                  ? `${defaultDisplayValueFormatter(
                      defaultNumberFormatter(maxVeBal.toString())
                    )} APR`
                  : ''
              }
              apr={maxVeBalDisplayed}
              boxBackground={balRewardGradient}
              textBackground="background.special"
              textBackgroundClip="text"
              roundedBottom="md"
            />
          </Stack>
        </>
      )}
    </PopoverContent>
  )

  return (
    <Popover trigger="hover" placement={placement}>
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            {typeof children === 'function' ? children({ isOpen }) : children}
          </PopoverTrigger>

          {usePortal ? <Portal>{popoverContent}</Portal> : popoverContent}
        </>
      )}
    </Popover>
  )
}

export type { Props as BaseAprTooltipProps }
export default BaseAprTooltip
