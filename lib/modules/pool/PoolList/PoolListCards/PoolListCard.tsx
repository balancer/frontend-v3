import { Card, HStack, VStack } from '@chakra-ui/react'
import { PoolListItem } from '../../pool.types'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'

interface Props {
  pool: PoolListItem
  cardClickHandler?: (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => void
  cardMouseEnterHandler?: (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => void
}

export function PoolListCard({ pool, cardClickHandler, cardMouseEnterHandler }: Props) {
  return (
    <Card
      h="400"
      variant="gradient"
      onClick={event => cardClickHandler && cardClickHandler(event, pool)}
      cursor={cardClickHandler ? 'pointer' : 'default'}
      onMouseEnter={event => cardMouseEnterHandler && cardMouseEnterHandler(event, pool)}
      p="md"
    >
      <VStack align="start">
        <HStack>
          <NetworkIcon chain={pool.chain} />
        </HStack>
      </VStack>
    </Card>
  )
}
