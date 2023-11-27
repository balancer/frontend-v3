import { Card, CardHeader } from '@chakra-ui/react'
import { PoolListItem } from '../../pool.types'

interface Props {
  pool: PoolListItem
  cardClickHandler?: (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => void
  cardMouseEnterHandler?: (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => void
}

export function PoolListCard({ pool, cardClickHandler, cardMouseEnterHandler }: Props) {
  return (
    // TODO: added height for now to get a scrollbar
    <Card
      h="400"
      variant="gradient"
      onClick={event => cardClickHandler && cardClickHandler(event, pool)}
      cursor={cardClickHandler ? 'pointer' : 'default'}
      onMouseEnter={event => cardMouseEnterHandler && cardMouseEnterHandler(event, pool)}
    >
      <CardHeader>{pool.name}</CardHeader>
    </Card>
  )
}
