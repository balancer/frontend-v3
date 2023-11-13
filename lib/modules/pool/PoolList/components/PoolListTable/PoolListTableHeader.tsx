import { Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import PoolListSortLink from './PoolListSortLink'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { FiGlobe } from 'react-icons/fi'
import { PoolsColumnSort } from '@/lib/modules/pool/pool.types'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

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
          <Text>Pool name</Text>
        </GridItem>
        <GridItem justifySelf="end">
          <PoolListSortLink
            title="TVL"
            isCurrentSort={sortingObj.id === GqlPoolOrderBy.TotalLiquidity}
            isDesc={setIsDesc(GqlPoolOrderBy.TotalLiquidity, sortingObj)}
            onClick={() =>
              setSorting([{ id: GqlPoolOrderBy.TotalLiquidity, desc: !sorting[0].desc }])
            }
          />
        </GridItem>
        <GridItem justifySelf="end">
          <PoolListSortLink
            title="Volume (24h)"
            isCurrentSort={sortingObj.id === GqlPoolOrderBy.Volume24h}
            isDesc={setIsDesc(GqlPoolOrderBy.Volume24h, sortingObj)}
            onClick={() => setSorting([{ id: GqlPoolOrderBy.Volume24h, desc: !sorting[0].desc }])}
          />
        </GridItem>
        <GridItem justifySelf="end">
          <PoolListSortLink
            title="APR"
            isCurrentSort={sortingObj.id === GqlPoolOrderBy.Apr}
            isDesc={setIsDesc(GqlPoolOrderBy.Apr, sortingObj)}
            onClick={() => setSorting([{ id: GqlPoolOrderBy.Apr, desc: !sorting[0].desc }])}
          />
        </GridItem>
      </Grid>
    </>
  )
}
