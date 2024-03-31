import { Card, HStack, Text } from '@chakra-ui/react'

type Props = {
  total: string
}

export function ClaimTotal({ total }: Props) {
  return (
    <Card variant="modalSubSection">
      <HStack justify="space-between">
        <Text size="lg" variant="secondary">
          Total:
        </Text>
        <Text size="lg" variant="secondary">
          {total}
        </Text>
      </HStack>
    </Card>
  )
}
