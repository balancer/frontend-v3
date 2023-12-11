import { Card, HStack, VStack, Text } from '@chakra-ui/react'
import { DecoratedPoolListItem } from '../../pool.types'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { convertSnakeToTitleCase } from '@/lib/shared/utils/strings'

interface Props {
  pool: DecoratedPoolListItem
  cardClickHandler?: (event: React.MouseEvent<HTMLElement>, pool: DecoratedPoolListItem) => void
  cardMouseEnterHandler?: (
    event: React.MouseEvent<HTMLElement>,
    pool: DecoratedPoolListItem
  ) => void
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
          <VStack align="start" spacing="none">
            <Text color="GrayText">{convertSnakeToTitleCase(pool.type)}</Text>
            <Text noOfLines={1}>{pool.name}</Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  )
}
