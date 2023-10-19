import { Card, CardHeader } from '@chakra-ui/react'

interface Props<T> {
  pool: T
}

export function PoolListCard({ pool }: Props<any>) {
  return (
    // TODO: added height for now to get a scrollbar
    <Card h="400" bg="lightblue">
      <CardHeader>{pool.name}</CardHeader>
    </Card>
  )
}
