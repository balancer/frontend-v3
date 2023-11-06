import { GqlBalancePoolAprItem, GqlPoolApr } from '@/lib/shared/services/api/generated/graphql'
import {
  Box,
  Button,
  Flex,
  HStack,
  PlacementWithLogical,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  TextProps,
  Icon,
  VStack,
} from '@chakra-ui/react'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { FiInfo } from 'react-icons/fi'
import { getAprLabel } from '@/lib/modules/pool/pool.utils'
import { sortBy } from 'lodash'

interface Props {
  data: GqlPoolApr
  textProps?: TextProps
  onlySparkles?: boolean
  placement?: PlacementWithLogical
  aprLabel?: boolean
  poolId?: string
  apr?: string
}

function sortAprItems(aprItems: GqlBalancePoolAprItem[]) {
  const balAprTitle = 'BAL reward APR'
  const swapFeesTitle = 'Swap fees APR'

  const balApr = aprItems.find(item => item.title === balAprTitle)
  const swapApr = aprItems.find(item => item.title === swapFeesTitle)
  const aprItemsSortedWithoutBalAndSwap = sortBy(
    aprItems.filter(item => ![balAprTitle, swapFeesTitle].includes(item.title)),
    'title'
  )

  return [balApr, ...aprItemsSortedWithoutBalAndSwap, swapApr]
}

function AprTooltip({ data, textProps, onlySparkles, placement, aprLabel, apr }: Props) {
  const aprToShow = apr || getAprLabel(data.apr)

  const aprItems = sortAprItems(data.items)

  return (
    <Popover trigger="hover" placement={placement}>
      <HStack align="center" alignItems="center">
        {!onlySparkles && (
          <Text {...textProps}>
            {aprToShow}
            {aprLabel ? ' APR' : ''}
          </Text>
        )}
        <PopoverTrigger>
          <Button
            minWidth="0"
            //height="auto"
            variant="unstyled"
            _active={{ outline: 'none' }}
            _focus={{ outline: 'none' }}
          >
            {data.hasRewardApr ? (
              <Icon as={StarsIcon} />
            ) : (
              <Icon as={FiInfo} boxSize={4} color="gray.400" mx="1" mt="1" />
            )}
          </Button>
        </PopoverTrigger>
      </HStack>
      <PopoverContent w="fit-content" shadow="2xl">
        <PopoverHeader>
          <VStack alignItems="flex-start">
            <Text textAlign="left">Total APR</Text>
            <Text>{getAprLabel(data.apr)}</Text>
          </VStack>
        </PopoverHeader>
        <Box p="2" fontSize="sm">
          {aprItems.map((item, index) => {
            return (
              item && (
                <Box key={index}>
                  <HStack>
                    <Text>{getAprLabel(item.apr)}</Text>
                    <Text>{item.title}</Text>
                  </HStack>
                  {item.subItems?.map((subItem, subItemIndex) => {
                    const isSubItemsLengthOne = item.subItems?.length === 1
                    const isSubItemIndexZero = subItemIndex === 0
                    return (
                      <Flex align="center" key={subItemIndex}>
                        <Box
                          bgColor="red"
                          w="1px"
                          m="0.25rem"
                          h={isSubItemsLengthOne ? '0.8rem' : isSubItemIndexZero ? '1rem' : '2rem'}
                          mt={
                            isSubItemsLengthOne
                              ? '-0.5rem'
                              : isSubItemIndexZero
                              ? '-0.3rem'
                              : '-1.7rem'
                          }
                        />
                        <Box h="1px" w="0.75rem" mr="0.25rem" ml="-0.25rem" bgColor="red" />
                        <HStack>
                          <Text>{getAprLabel(subItem.apr)}</Text>
                          <Text>{subItem.title}</Text>
                        </HStack>
                      </Flex>
                    )
                  })}
                </Box>
              )
            )
          })}
        </Box>
      </PopoverContent>
    </Popover>
  )
}

export default AprTooltip
