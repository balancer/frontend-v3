import { Box, Button, Center, HStack, Icon, Text, TextProps, useTheme } from '@chakra-ui/react'
import BaseAprTooltip, { BaseAprTooltipProps } from './BaseAprTooltip'
import { Info } from 'react-feather'
import { getTotalAprLabel } from '@/lib/modules/pool/pool.utils'
import StarsIcon from '../../icons/StarsIcon'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { Pool } from '@/lib/modules/pool/PoolProvider'
import { isLBP } from '@/lib/modules/pool/pool.helpers'
import { getProjectConfig } from '@/lib/config/getProjectConfig'

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
  pool: Pool | PoolListItem
}

const hoverColor = 'font.highlight'

export const SparklesIcon = ({
  isOpen,
  pool,
  hasRewardApr,
}: {
  isOpen: boolean
  pool: Pool | PoolListItem
  hasRewardApr: boolean
}) => {
  const theme = useTheme()
  const { votingPoolId } = getProjectConfig()

  let gradFromColor = theme.colors.sparkles.default.from
  let gradToColor = theme.colors.sparkles.default.to

  if (pool.id === votingPoolId) {
    gradFromColor = theme.colors.sparkles.voting.from
    gradToColor = theme.colors.sparkles.voting.to
  }

  if (hasRewardApr) {
    gradFromColor = theme.colors.sparkles.rewards.from
    gradToColor = theme.colors.sparkles.rewards.to
  }

  return (
    <Box w="16px" h="auto" minW="16px">
      <Center w="16px">
        {isLBP(pool.type) ? (
          <Icon as={Info} boxSize={4} color={isOpen ? hoverColor : 'gray.400'} />
        ) : (
          <Icon
            as={StarsIcon}
            gradFrom={isOpen ? 'green' : gradFromColor}
            gradTo={isOpen ? 'green' : gradToColor}
          />
        )}
      </Center>
    </Box>
  )
}

function MainAprTooltip({
  onlySparkles,
  textProps,
  apr,
  aprItems,
  vebalBoost,
  aprLabel,
  height = '16px',
  pool,
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
              <SparklesIcon isOpen={isOpen} pool={pool} hasRewardApr={hasRewardApr} />
            </HStack>
          </Button>
        </HStack>
      )}
    </BaseAprTooltip>
  )
}

export default MainAprTooltip
