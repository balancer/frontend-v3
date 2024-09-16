import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  PopoverContent,
  Text,
  TextProps,
  useTheme,
} from '@chakra-ui/react'
import BaseAprTooltip, { BaseAprTooltipProps } from './BaseAprTooltip'
import { Info } from 'react-feather'
import { getTotalAprLabel } from '@/lib/modules/pool/pool.utils'
import StarsIcon from '../../icons/StarsIcon'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { FeaturedPool, Pool } from '@/lib/modules/pool/PoolProvider'
import { isLBP } from '@/lib/modules/pool/pool.helpers'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { GqlPoolAprItemType } from '@/lib/shared/services/api/generated/graphql'

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
  pool: Pool | PoolListItem | FeaturedPool
  id?: string
}

export function SparklesIcon({
  isOpen,
  pool,
  id,
}: {
  isOpen: boolean
  pool: Pool | PoolListItem | FeaturedPool
  id?: string
}) {
  const theme = useTheme()
  const { corePoolId } = getProjectConfig()
  const hoverColor = isLBP(pool.type) ? 'inherit' : 'font.highlight'

  const hasRewardApr =
    pool.dynamicData.aprItems.filter(item => item.type !== GqlPoolAprItemType.SwapFee).length > 0

  let gradFromColor = theme.colors.sparkles.default.from
  let gradToColor = theme.colors.sparkles.default.to

  if (pool.id === corePoolId) {
    gradFromColor = theme.colors.sparkles.corePool.from
    gradToColor = theme.colors.sparkles.corePool.to
  }

  if (hasRewardApr) {
    gradFromColor = theme.colors.sparkles.rewards.from
    gradToColor = theme.colors.sparkles.rewards.to
  }

  return (
    <Box h="auto" minW="16px" w="16px">
      <Center w="16px">
        {isLBP(pool.type) ? (
          <Icon as={Info} boxSize={4} color={isOpen ? hoverColor : 'gray.400'} />
        ) : (
          <Icon
            as={StarsIcon}
            gradFrom={isOpen ? 'green' : gradFromColor}
            gradTo={isOpen ? 'green' : gradToColor}
            id={id || ''}
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
  vebalBoost,
  aprLabel,
  height = '16px',
  pool,
  id,
  ...props
}: Props) {
  const aprToShow = apr || getTotalAprLabel(pool.dynamicData.aprItems, vebalBoost)
  const hoverColor = isLBP(pool.type) ? 'inherit' : 'font.highlight'

  const customPopoverContent = isLBP(pool.type) ? (
    <PopoverContent p="md">
      <Text color="font.secondary" fontSize="sm">
        LBP APRs cannot be realized by LPs.
      </Text>
    </PopoverContent>
  ) : undefined

  return (
    <BaseAprTooltip
      {...props}
      customPopoverContent={customPopoverContent}
      maxVeBalText="Max veBAL APR"
      totalBaseText={hasVeBalBoost => `Total ${hasVeBalBoost ? 'base' : ''} APR`}
      totalBaseVeBalText="Total base APR"
      vebalBoost={vebalBoost}
    >
      {({ isOpen }) => (
        <HStack align="center" alignItems="center">
          <Button _focus={{ outline: 'none' }} h={height} px="0" variant="unstyled">
            <HStack
              _hover={{ color: hoverColor }}
              color={isOpen ? hoverColor : 'font.primary'}
              opacity={isLBP(pool.type) ? 0.5 : 1}
            >
              {!onlySparkles && (
                <Text
                  color={isOpen ? hoverColor : 'font.primary'}
                  noOfLines={2}
                  textAlign="left"
                  textDecoration={isLBP(pool.type) ? 'line-through' : 'none'}
                  whiteSpace="pre-wrap"
                  {...textProps}
                >
                  {apr || aprToShow}
                  {aprLabel ? ' APR' : ''}
                </Text>
              )}
              <SparklesIcon id={id} isOpen={isOpen} pool={pool} />
            </HStack>
          </Button>
        </HStack>
      )}
    </BaseAprTooltip>
  )
}

export default MainAprTooltip
