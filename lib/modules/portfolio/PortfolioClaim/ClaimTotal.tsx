import { Card, Text } from '@chakra-ui/react'

type Props = {
  total: string
}

export function ClaimTotal({ total }: Props) {
  return (
    <Card
      flexDirection="row"
      variant="level2"
      justifyContent="space-between"
      gap={4}
      p="md"
      shadow="xl"
      flex="1"
      width="100%"
    >
      <Text size="lg" variant="secondary">
        Total:
      </Text>
      <Text size="lg" variant="secondary">
        {total}
      </Text>
    </Card>
  )
}
