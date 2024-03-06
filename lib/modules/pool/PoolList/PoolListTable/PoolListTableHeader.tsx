import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'
import PoolListSortButton from './PoolListSortButton'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { PoolsColumnSort, orderByHash } from '../../pool.types'
import { usePoolOrderByState } from '../usePoolOrderByState'
import { Globe } from 'react-feather'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

export function PoolListTableHeader({ ...rest }) {
  const { sorting, setSorting } = usePoolListQueryState()
  const { orderBy } = usePoolOrderByState()
  const sortingObj = sorting[0]

  return (
    <Grid {...rest} py="3" w="full" borderBottom="1px solid" borderColor="border.base">
      <GridItem>
        <VStack align="start" w="full">
          <Icon as={Globe} boxSize="5" ml="1" color="grayText" />
        </VStack>
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">Pool name</Text>
      </GridItem>
      <GridItem justifySelf="end">
        <Text fontWeight="bold">Type</Text>
      </GridItem>
      {orderBy.map((orderByItem, index) => (
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
      ))}
    </Grid>
  )
}
