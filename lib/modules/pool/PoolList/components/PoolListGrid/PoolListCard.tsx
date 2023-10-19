import { Card, CardHeader } from '@chakra-ui/react'

interface Pool {
  //TODO add props as we build out the card
  name: string
}
interface Props {
  pool: Pool
}

export function PoolListCard({ pool }: Props) {
  return (
    // TODO: added height for now to get a scrollbar
    <Card h="400" bg="lightblue">
      <CardHeader>{pool.name}</CardHeader>
    </Card>
  )
}
