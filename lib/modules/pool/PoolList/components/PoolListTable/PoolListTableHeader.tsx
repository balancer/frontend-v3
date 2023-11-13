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
    <Grid
      mx="4"
      pr="6"
      py="3"
      alignItems="center"
      templateColumns={'50px 1fr 150px 175px 175px'}
      gap="0"
      borderBottom="1px solid"
      borderColor="gray.100"
      w="full"
      minW="800px"
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
          isDesc={sortingObj.desc}
          onClick={() =>
            setSorting([
              {
                id: GqlPoolOrderBy.TotalLiquidity,
                desc: setIsDesc(GqlPoolOrderBy.TotalLiquidity, sortingObj),
              },
            ])
          }
        />
      </GridItem>
      <GridItem justifySelf="end">
        <PoolListSortLink
          title="Volume (24h)"
          isCurrentSort={sortingObj.id === GqlPoolOrderBy.Volume24h}
          isDesc={sortingObj.desc}
          onClick={() =>
            setSorting([
              {
                id: GqlPoolOrderBy.Volume24h,
                desc: setIsDesc(GqlPoolOrderBy.Volume24h, sortingObj),
              },
            ])
          }
        />
      </GridItem>
      <GridItem justifySelf="end">
        <PoolListSortLink
          title="APR"
          isCurrentSort={sortingObj.id === GqlPoolOrderBy.Apr}
          isDesc={sortingObj.desc}
          onClick={() =>
            setSorting([
              {
                id: GqlPoolOrderBy.Apr,
                desc: setIsDesc(GqlPoolOrderBy.Apr, sortingObj),
              },
            ])
          }
        />
      </GridItem>
    </Grid>
  )
}
