import { GqlPoolApr } from '@/lib/shared/services/api/generated/graphql'
import {
  Box,
  Center,
  Button,
  HStack,
  PlacementWithLogical,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  TextProps,
  Icon,
  Divider,
  Stack,
  Portal,
} from '@chakra-ui/react'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { getTotalAprLabel } from '@/lib/modules/pool/pool.utils'
import { Info } from 'react-feather'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import {
  swapFeesTooltipText,
  useAprTooltip,
  baseAprTooltipText,
  inherentTokenYieldTooltipText,
  extraBalTooltipText,
} from '@/lib/shared/hooks/useAprTooltip'
import { TooltipAprItem } from './TooltipAprItem'
import { useRef } from 'react'

interface Props {
  data: GqlPoolApr
  textProps?: TextProps
  onlySparkles?: boolean
  placement?: PlacementWithLogical
  aprLabel?: boolean
  poolId?: string
  apr?: string
  vebalBoost?: string
}

const balRewardGradient =
  // eslint-disable-next-line max-len
  'linear-gradient(90deg, rgba(179, 174, 245, 0.1) 0%, rgba(215, 203, 231, 0.1) 25%, rgba(229, 200, 200, 0.1) 50%, rgba(234, 168, 121, 0.1) 100%)'

const hoverColor = 'font.highlight'

const basePopoverAprItemProps = {
  pl: 2,
  pr: 2,
  pb: 3,
  backgroundColor: 'background.level1',
  fontWeight: 700,
}

function AprTooltip({
  data,
  textProps,
  onlySparkles,
  placement,
  aprLabel,
  apr,
  vebalBoost,
}: Props) {
  const aprToShow = apr || getTotalAprLabel(data.items, vebalBoost)
  const colorMode = useThemeColorMode()
  const ref = useRef(null)

  const {
    totalBaseDisplayed,
    extraBalAprDisplayed,
    yieldBearingTokensAprDisplayed,
    stakingIncentivesAprDisplayed,
    swapFeesDisplayed,
    isSwapFeePresent,
    isYieldPresent,
    isStakingPresent,
    maxVeBalDisplayed,
    yieldBearingTokensDisplayed,
    stakingIncentivesDisplayed,
    subitemPopoverAprItemProps,
    balReward,
  } = useAprTooltip({
    aprItems: data.items,
    apr: data,
    vebalBoost: Number(vebalBoost),
  })

  return (
    <Popover trigger="hover" placement={placement}>
      {({ isOpen }) => (
        <>
          <HStack align="center" alignItems="center" ref={ref}>
            <PopoverTrigger>
              <Button variant="unstyled" _focus={{ outline: 'none' }} px="0">
                <HStack
                  _hover={{ color: 'font.link' }}
                  color={isOpen ? 'font.highlight' : 'font.primary'}
                >
                  {!onlySparkles && (
                    <Text
                      {...textProps}
                      textAlign="right"
                      color={isOpen ? hoverColor : 'font.primary'}
                    >
                      {apr || aprToShow}
                      {aprLabel ? ' APR' : ''}
                    </Text>
                  )}
                  <Box w="16px" h="auto" minW="16px">
                    {data.hasRewardApr ? (
                      <Center w="16px">
                        <Icon
                          as={StarsIcon}
                          gradFrom={isOpen ? 'green' : undefined}
                          gradTo={isOpen ? 'green' : undefined}
                        />
                      </Center>
                    ) : (
                      <Center w="16px">
                        <Icon as={Info} boxSize={4} color={isOpen ? hoverColor : 'grey.400'} />
                      </Center>
                    )}
                  </Box>
                </HStack>
              </Button>
            </PopoverTrigger>
          </HStack>
          <Portal containerRef={ref}>
            <PopoverContent w="fit-content" shadow="3xl" minWidth={['100px', '300px']} p="0">
              <TooltipAprItem
                {...basePopoverAprItemProps}
                pt={3}
                title="Swap fees"
                apr={swapFeesDisplayed}
                aprOpacity={isSwapFeePresent ? 1 : 0.5}
                tooltipText={swapFeesTooltipText}
                bg="background.level3"
              />
              <TooltipAprItem
                {...basePopoverAprItemProps}
                title="Staking incentives"
                apr={stakingIncentivesAprDisplayed}
                aprOpacity={isStakingPresent ? 1 : 0.5}
                bg="background.level3"
              >
                {stakingIncentivesDisplayed.map((item, index) => {
                  return (
                    <TooltipAprItem
                      {...subitemPopoverAprItemProps}
                      key={index}
                      title={item.title}
                      apr={item.apr}
                      aprOpacity={1}
                      tooltipText={baseAprTooltipText}
                      bg="background.level3"
                    />
                  )
                })}
              </TooltipAprItem>
              <TooltipAprItem
                {...basePopoverAprItemProps}
                title="Yield bearing tokens"
                apr={yieldBearingTokensAprDisplayed}
                aprOpacity={isYieldPresent ? 1 : 0.5}
                bg="background.level3"
              >
                {yieldBearingTokensDisplayed.map((item, index) => {
                  return (
                    <TooltipAprItem
                      {...subitemPopoverAprItemProps}
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
              <Divider />
              <TooltipAprItem
                {...basePopoverAprItemProps}
                pt={3}
                backgroundColor="background.level4"
                fontColor="font.maxContrast"
                title={`Total ${balReward ? 'base' : ''} APR`}
                apr={totalBaseDisplayed}
              />
              {balReward && (
                <>
                  <Divider />
                  <Stack roundedBottom="md" gap={0}>
                    <TooltipAprItem
                      {...basePopoverAprItemProps}
                      pt={3}
                      fontWeight={500}
                      fontColor={colorMode == 'light' ? 'gray.600' : 'gray.400'}
                      title="Extra BAL (veBAL boost)"
                      apr={extraBalAprDisplayed.toNumber()}
                      tooltipText={extraBalTooltipText}
                      bg="background.level3"
                    />
                    <Divider />

                    <TooltipAprItem
                      {...basePopoverAprItemProps}
                      pt={3}
                      fontColor="font.special"
                      title="Max veBAL APR"
                      apr={maxVeBalDisplayed.toNumber()}
                      boxBackground={balRewardGradient}
                      textBackground="background.special"
                      textBackgroundClip="text"
                      roundedBottom="md"
                    />
                  </Stack>
                </>
              )}
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}

export default AprTooltip
