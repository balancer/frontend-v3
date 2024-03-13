import { Card, Text } from '@chakra-ui/react'

type Props = {
  total: string
}

export function ClaimReviewTotal({ total }: Props) {
  return (
    <Card
      flexDirection="row"
      variant="level4"
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
