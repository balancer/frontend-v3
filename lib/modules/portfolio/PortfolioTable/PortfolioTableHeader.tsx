import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'

import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { FiGlobe } from 'react-icons/fi'
import PoolListSortButton from '../../pool/PoolList/PoolListTable/PoolListSortButton'
import { PoolsColumnSort } from '../../pool/pool.types'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

export function PortfolioTableHeader({ ...rest }) {
  //   const { sorting, setSorting } = usePoolListQueryState()
  //   const { orderBy } = usePoolOrderByState()
  //   const sortingObj = sorting[0]
  const orderBy = [
    {
      title: 'Staking',
    },
    {
      title: 'veBAL boost',
    },
    {
      title: 'My liquidity',
    },

    {
      title: 'APR',
    },
  ]
  return (
    <Grid {...rest} py="3" w="full" borderBottom="1px solid" borderColor="border.base">
      <GridItem>
        <VStack align="start" w="full">
          <Icon as={FiGlobe} boxSize="5" ml="1" color="grayText" />
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
            title={orderByItem.title}
            isCurrentSort={false}
            isDesc={false}
            onClick={
              () => {
                //
              }
              //   setSorting([
              //     {
              //       id: orderByItem,
              //       desc: setIsDesc(orderByItem, sortingObj),
              //     },
              //   ])
            }
          />
        </GridItem>
      ))}
    </Grid>
  )
}
