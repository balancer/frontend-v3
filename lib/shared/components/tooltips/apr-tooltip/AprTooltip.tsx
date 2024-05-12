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
  Heading,
  Card,
  Stack,
} from '@chakra-ui/react'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'

import { Info } from 'react-feather'
import { useMemo } from 'react'
import { fNum } from '@/lib/shared/utils/numbers'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
import {
  getApr,
  getBalApr,
  getMaxMinTotalApr,
  getSecondaryAprItems,
  getSwapFeesApr,
  sortAprItems,
} from '@/lib/shared/utils/apr-calculation'

interface Props {
  data: GqlPoolApr
  pool?: PoolListItem
  textProps?: TextProps
  onlySparkles?: boolean
  placement?: PlacementWithLogical
  aprLabel?: boolean
  poolId?: string
  apr?: string
  vebalBoost?: number
}

const hoverColor = 'font.highlight'

function AprTooltip({
  data,
  textProps,
  onlySparkles,
  placement,
  aprLabel,
  apr,
  vebalBoost,
}: Props) {
  const aprItems = sortAprItems(data.items)

  const { minApr, maxApr, singleApr, label: aprToShow } = getMaxMinTotalApr(data, vebalBoost)

  const dataBlocks = useMemo(() => {
    if (singleApr) {
      return []
    }

    return [
      {
        title: 'Minimum Apr',
        value: minApr,
      },
      {
        title: 'Maximum Apr',
        value: maxApr,
      },
    ]
  }, [minApr, maxApr, singleApr])

  const dataRows = useMemo(() => {
    const rows = []

    const balApr = getBalApr(aprItems)

    const secondaryAprItems = getSecondaryAprItems(aprItems)

    if (balApr) {
      const { minApr: minBalApr, maxApr: maxBalApr } = getApr(balApr.apr)

      rows.push({
        title: 'Staking incentives (min)',
        value: minBalApr,
      })

      rows.push({
        title: 'Bal (No boost)',
        value: minBalApr,
        isSecondary: true,
      })

      secondaryAprItems.forEach(item => {
        if (item?.apr.__typename === 'GqlPoolAprTotal' && item?.apr?.total) {
          rows.push({
            title: item.title,
            value: fNum('apr', item.apr.total),
            isSecondary: true,
          })
        }
      })

      rows.push({
        title: 'Staking incentives (max)',
        value: maxBalApr,
      })

      const balBoostTitle = `Bal (${vebalBoost && vebalBoost > 1 ? vebalBoost : 2.5}x boost)`
      rows.push({
        title: balBoostTitle,
        value: maxBalApr,
        isSecondary: true,
      })

      secondaryAprItems.forEach(item => {
        if (item?.apr.__typename === 'GqlPoolAprTotal' && item?.apr?.total) {
          rows.push({
            title: item.title,
            value: fNum('apr', item.apr.total),
            isSecondary: true,
          })
        }
      })
    }

    const swapApr = getSwapFeesApr(aprItems)

    if (swapApr) {
      if (swapApr.apr.__typename === 'GqlPoolAprTotal') {
        rows.push({
          title: 'Swap fees',
          value: fNum('apr', swapApr.apr.total),
          hasInfoIcon: true,
        })
      }
    }
    return rows
  }, [aprItems])

  return (
    <Popover trigger="hover" placement={placement}>
      {({ isOpen }) => (
        <>
          <HStack align="center" alignItems="center">
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
                        <Icon as={StarsIcon} gradFrom={isOpen ? 'green' : undefined} />
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
          <PopoverContent w="fit-content" shadow="2xl" minWidth={['100px', '300px']} p="2" gap="2">
            <HStack alignItems="flex-start" justifyContent="space-between">
              <Heading variant="special" size="md" textAlign="left">
                Total APR
              </Heading>
              {singleApr && (
                <Heading variant="special" size="sm">
                  {singleApr}
                </Heading>
              )}
            </HStack>

            <Box fontSize="sm" gap={5}>
              {dataBlocks.length > 0 && (
                <HStack mb="4">
                  {dataBlocks.map((block, index) => (
                    <Card key={index} height="auto" minWidth="134px" variant="level3">
                      <Heading variant="special" size="sm">
                        {block.title}
                      </Heading>
                      <Heading variant="special" size="sm">
                        {block.value}
                      </Heading>
                    </Card>
                  ))}
                </HStack>
              )}
              <Stack spacing="2">
                {dataRows.map((row, index) => (
                  <HStack justifyContent="space-between" key={index}>
                    <Text variant={row.isSecondary ? 'secondary' : ''} size="sm">
                      {row.title}
                    </Text>
                    <HStack>
                      <Text variant={row.isSecondary ? 'secondary' : 'special'} size="sm">
                        {row.value}
                      </Text>
                      {row.hasInfoIcon && (
                        <Center w="16px">
                          <Icon as={Info} boxSize={4} color="gray.400" />
                        </Center>
                      )}
                    </HStack>
                  </HStack>
                ))}
              </Stack>
            </Box>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

export default AprTooltip
