import { Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import PoolListSortButton from './PoolListSortButton'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { FiGlobe } from 'react-icons/fi'
import { PoolsColumnSort } from '../../pool.types'
import { orderByHash } from '../../pool.types'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

export function PoolListTableHeader({ ...rest }) {
  const { sorting, setSorting } = usePoolListQueryState()
  const sortingObj = sorting[0]

  return (
    <Grid {...rest} py="3" w="full">
      <GridItem>
        <Icon as={FiGlobe} boxSize="6" ml="1" />
      </GridItem>
      <GridItem>
        <Text>Pool tokens</Text>
      </GridItem>
      {[GqlPoolOrderBy.TotalLiquidity, GqlPoolOrderBy.Volume24h, GqlPoolOrderBy.Apr].map(
        (orderByItem, index) => (
          <GridItem key={index} justifySelf="end">
            <PoolListSortButton
              title={orderByHash[orderByItem]}
              isCurrentSort={sortingObj.id === orderByItem}
              isDesc={sortingObj.desc}
              onClick={() =>
                setSorting([
                  {
                    id: orderByItem,
                    desc: setIsDesc(orderByItem, sortingObj),
                  },
                ])
              }
            />
          </GridItem>
        )
      )}
    </Grid>
  )
}
