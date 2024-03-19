import { Box, Card, CardProps, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import StarsIcon from '../icons/StarsIcon'
import { Gift } from 'react-feather'

type Props = {
  special?: boolean
  label: string
  value: string
} & CardProps

export function IncentiveBadge({ special = false, label, value, children, ...rest }: Props) {
  return (
    <Card borderWidth={0} position="relative" width="full">
      <Card {...rest} borderWidth={0} rounded="lg" variant="level2" p="3" shadow="2xl">
        <HStack zIndex="2" justifyContent="space-between">
          <HStack spacing="4" width="full">
            <Flex
              justifyContent="center"
              alignItems="center"
              rounded="md"
              background="background.level3"
              width="60px"
              height="60px"
              borderWidth={1}
              borderColor="border.base"
              shadow="sm"
            >
              {special && <Icon as={StarsIcon} boxSize="32px" />}
              {!special && <Icon color="font.secondary" as={Gift} boxSize="28px" />}
            </Flex>
            <HStack
              spacing="2"
              fontWeight="medium"
              alignItems="flex-start"
              justifyContent="space-between"
              width="full"
            >
              <Text
                fontSize="1rem"
                fontWeight="semibold"
                variant={special ? 'primaryGradient' : 'primaryGradient'}
              >
                {label}
              </Text>
              <Text
                variant={special ? 'primaryGradient' : 'primaryGradient'}
                fontSize="1rem"
                fontWeight="semibold"
              >
                {value}
              </Text>
            </HStack>
          </HStack>
          {children}
        </HStack>
      </Card>
    </Card>
  )
}
