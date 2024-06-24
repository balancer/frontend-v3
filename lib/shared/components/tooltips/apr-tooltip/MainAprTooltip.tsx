import { Box, Button, Center, HStack, Icon, Text, TextProps } from '@chakra-ui/react'
import BaseAprTooltip, { BaseAprTooltipProps } from './BaseAprTooltip'
import { Info } from 'react-feather'
import { getTotalAprLabel } from '@/lib/modules/pool/pool.utils'
import StarsIcon from '../../icons/StarsIcon'

interface Props
  extends Omit<
    BaseAprTooltipProps,
    'children' | 'totalBaseText' | 'totalBaseVeBalText' | 'maxVeBalText'
  > {
  textProps?: TextProps
  onlySparkles?: boolean
  aprLabel?: boolean
  apr?: string
  height?: string
}

const hoverColor = 'font.highlight'

function MainAprTooltip({
  onlySparkles,
  textProps,
  apr,
  aprItems,
  vebalBoost,
  aprLabel,
  height = '16px',
  ...props
}: Props) {
  const aprToShow = apr || getTotalAprLabel(aprItems, vebalBoost)

  const hasRewardApr = aprItems.some(item => item.title === 'BAL reward APR')

  return (
    <BaseAprTooltip
      aprItems={aprItems}
      {...props}
      maxVeBalText="Max veBAL APR"
      totalBaseText={balReward => `Total ${balReward ? 'base' : ''} APR`}
      totalBaseVeBalText="Total base APR"
    >
      {({ isOpen }) => (
        <HStack align="center" alignItems="center">
          <Button variant="unstyled" _focus={{ outline: 'none' }} px="0" h={height}>
            <HStack
              _hover={{ color: 'font.link' }}
              color={isOpen ? 'font.highlight' : 'font.primary'}
            >
              {!onlySparkles && (
                <Text {...textProps} textAlign="right" color={isOpen ? hoverColor : 'font.primary'}>
                  {apr || aprToShow}
                  {aprLabel ? ' APR' : ''}
                </Text>
              )}
              <Box w="16px" h="auto" minW="16px">
                {hasRewardApr ? (
                  <Center w="16px">
                    <Icon
                      as={StarsIcon}
                      gradFrom={isOpen ? 'green' : undefined}
                      gradTo={isOpen ? 'green' : undefined}
                    />
                  </Center>
                ) : (
                  <Center w="16px">
                    <Icon as={Info} boxSize={4} color={isOpen ? hoverColor : 'gray.400'} />
                  </Center>
                )}
              </Box>
            </HStack>
          </Button>
        </HStack>
      )}
    </BaseAprTooltip>
  )
}

export default MainAprTooltip
