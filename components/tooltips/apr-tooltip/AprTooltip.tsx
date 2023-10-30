import { GqlPoolApr } from '@/lib/services/api/generated/graphql'
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
  useTheme,
} from '@chakra-ui/react'
import StarsIcon from '@/components/icons/StarsIcon'
import { AprText } from './AprText'
import { FiInfo } from 'react-icons/fi'
import { getAprLabel } from '@/lib/modules/pool/pool.utils'

interface Props {
  data: GqlPoolApr
  textProps?: TextProps
  onlySparkles?: boolean
  placement?: PlacementWithLogical
  aprLabel?: boolean
  sparklesSize?: 'sm' | 'md'
  poolId?: string
  apr?: string
}

function AprTooltip({
  data,
  textProps,
  onlySparkles,
  placement,
  aprLabel,
  sparklesSize,
  apr,
}: Props) {
  const aprToShow = apr || getAprLabel(data.apr)
  const theme = useTheme()

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
          <Text>
            Total APR
            <Text>{getAprLabel(data.apr)}</Text>
          </Text>
        </PopoverHeader>
        <Box p="2" fontSize="sm">
          {data.items.map((item, index) => {
            return (
              <Box key={index}>
                <Flex>
                  {getAprLabel(item.apr)} <AprText>{item.title}</AprText>
                </Flex>
                {item.subItems?.map((subItem, subItemIndex) => {
                  const isSubItemsLengthOne = item.subItems?.length === 1
                  const isSubItemIndexZero = subItemIndex === 0
                  return (
                    <Flex align="center" key={subItemIndex}>
                      <Box
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
                      <Box h="1px" w="0.75rem" mr="0.25rem" ml="-0.25rem" />
                      <Flex>
                        {getAprLabel(subItem.apr)} <AprText>{subItem.title}</AprText>
                      </Flex>
                    </Flex>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </PopoverContent>
    </Popover>
  )
}

export default AprTooltip
