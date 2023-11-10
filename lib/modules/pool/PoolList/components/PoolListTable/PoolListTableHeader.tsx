import { Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import PoolListSortLink from './PoolListSortLink'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { FiGlobe } from 'react-icons/fi'

export function PoolListTableHeader() {
  const { sorting, setSorting } = usePoolListQueryState()
  const sortingObj = sorting[0]

  return (
    <>
      <Grid
        px="4"
        py="3"
        alignItems="center"
        templateColumns={'50px 1fr 200px 200px 200px'}
        gap="0"
      >
        <GridItem>
          <Icon as={FiGlobe} boxSize="6" ml="1" />
        </GridItem>
        <GridItem>
          <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
            Pool details
          </Text>
        </GridItem>
        <GridItem textAlign="right">
          <PoolListSortLink
            title="TVL"
            orderDirection={sortingObj.id === GqlPoolOrderBy.TotalLiquidity && sortingObj.desc}
            onClick={() =>
              setSorting([{ id: GqlPoolOrderBy.TotalLiquidity, desc: !sorting[0].desc }])
            }
          />
        </GridItem>
        <GridItem textAlign="right" display="block">
          <PoolListSortLink
            title="Volume (24h)"
            orderDirection={sortingObj.id === GqlPoolOrderBy.Volume24h && sortingObj.desc}
            onClick={() => setSorting([{ id: GqlPoolOrderBy.Volume24h, desc: !sorting[0].desc }])}
          />
        </GridItem>
        <GridItem textAlign="right">
          <PoolListSortLink
            title="APR"
            orderDirection={sortingObj.id === GqlPoolOrderBy.Apr && sortingObj.desc}
            onClick={() => setSorting([{ id: GqlPoolOrderBy.Apr, desc: !sorting[0].desc }])}
          />
        </GridItem>
      </Grid>
    </>
  )
}
