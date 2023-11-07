import { Box, Card, Center, HStack, Stack, Text, theme } from '@chakra-ui/react'
import { UserLiquidity } from './UserLiquidity'

export function UserPoolData() {
  const tabsList = [
    {
      title: 'My liquidity',
      value: 'my-liquidity',
    },
    {
      title: 'Unstaked',
      value: 'unstaked',
    },
    {
      title: 'Staked',
      value: 'staked',
    },
  ]

  return (
    <HStack justifyContent="center" alignItems="flex-start" gap={6} p={6}>
      <Card flex={1}>
        {tabsList.map(tab => (
          <Box key={tab.title} p="sm" _hover={{ bgColor: theme.colors.gray[100] }} cursor="pointer">
            <Text>{tab.title}</Text>
          </Box>
        ))}
      </Card>

      <UserLiquidity />

      <Card flex={1}></Card>
    </HStack>
  )
}
