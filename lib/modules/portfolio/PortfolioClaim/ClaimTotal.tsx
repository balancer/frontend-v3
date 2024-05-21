import { Card, HStack, Text } from '@chakra-ui/react'

type Props = {
  total: string
}

export function ClaimTotal({ total }: Props) {
  return (
    <Card variant="modalSubSection">
      <HStack justify="space-between" alignItems="end">
        <Text size="lg" variant="secondary">
          Total
        </Text>
        <Text fontSize="2xl" fontWeight="bold" variant="special">
          {total}
        </Text>
      </HStack>
    </Card>
  )
}
