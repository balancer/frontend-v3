import { Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import PoolListSortButton from '@/lib/modules/pool/PoolList/PoolListTable/PoolListSortButton'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { FiGlobe } from 'react-icons/fi'
import { PoolsColumnSort } from '@/lib/modules/pool/pool.types'
import { orderByHash } from '@/lib/modules/pool/pool.types'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

export function PoolListTableHeader({ ...rest }) {
  const { sorting, setSorting } = usePoolListQueryState()
  const sortingObj = sorting[0]

  return (
    <Grid {...rest} py="3" borderBottom="1px solid" borderColor="gray.100" w="full">
      <GridItem>
        <Icon as={FiGlobe} boxSize="6" ml="1" />
      </GridItem>
      <GridItem>
        <Text>Pool name</Text>
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
