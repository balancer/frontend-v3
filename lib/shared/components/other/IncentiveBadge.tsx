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
    <Card
      p={special ? '1px' : '0'}
      pr={special ? '1.5px' : '0'}
      position="relative"
      background="background.special"
    >
      <Card {...rest} rounded="lg" variant="elevation2" p="3" shadow="2xl">
        <Box
          position="absolute"
          width="full"
          height="full"
          content=""
          top="0"
          left="0"
          right="0"
          background={special ? 'background.special' : 'transparent'}
          rounded="sm"
          opacity="0.15"
          zIndex="1"
        />
        <HStack zIndex="2" justifyContent="space-between">
          <HStack spacing="4">
            <Flex
              justifyContent="center"
              alignItems="center"
              rounded="md"
              background="elevation.level4"
              width="60px"
              height="60px"
            >
              {special && <Icon as={StarsIcon} boxSize="40px" />}
              {!special && <Icon color="font.secondary" as={Gift} boxSize="30px" />}
            </Flex>
            <VStack spacing="2" fontWeight="medium" alignItems="flex-start">
              <Text
                fontSize="0.95rem"
                lineHeight="1rem"
                fontWeight="medium"
                variant={special ? 'primaryGradient' : 'secondary'}
              >
                {label}
              </Text>
              <Text
                variant={special ? 'primaryGradient' : 'secondary'}
                fontSize="1.25rem"
                lineHeight="1rem"
                fontWeight="semibold"
              >
                {value}
              </Text>
            </VStack>
          </HStack>
          {children}
        </HStack>
      </Card>
    </Card>
  )
}
