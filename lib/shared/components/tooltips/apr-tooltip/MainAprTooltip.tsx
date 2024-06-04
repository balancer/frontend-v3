import { Box, Button, Center, HStack, Icon, Text, TextProps } from '@chakra-ui/react'
import BaseAprTooltip, { BaseAprTooltipProps } from './BaseAprTooltip'
import { Info } from 'react-feather'
import { getTotalAprLabel } from '@/lib/modules/pool/pool.utils'
import StarsIcon from '../../icons/StarsIcon'

interface Props extends Omit<BaseAprTooltipProps, 'children' | 'totalBaseText' | 'maxVeBalText'> {
  textProps?: TextProps
  onlySparkles?: boolean
  aprLabel?: boolean
  apr?: string
}

const hoverColor = 'font.highlight'

function MainAprTooltip({
  onlySparkles,
  textProps,
  apr,
  data,
  vebalBoost,
  aprLabel,
  ...props
}: Props) {
  const aprToShow = apr || getTotalAprLabel(data.items, vebalBoost)

  return (
    <BaseAprTooltip
      data={data}
      {...props}
      maxVeBalText="Max veBAL APR"
      totalBaseText={balReward => `Total ${balReward ? 'base' : ''} APR`}
    >
      {({ isOpen }) => (
        <HStack align="center" alignItems="center">
          <Button variant="unstyled" _focus={{ outline: 'none' }} px="0" h="16px">
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
