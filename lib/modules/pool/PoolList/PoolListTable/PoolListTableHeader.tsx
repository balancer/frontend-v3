'use client'

import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'
import PoolListSortButton from './PoolListSortButton'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { PoolsColumnSort, orderByHash } from '../../pool.types'
import { usePoolOrderByState } from '../usePoolOrderByState'
import { Globe } from 'react-feather'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

const setIsDesc = (id: GqlPoolOrderBy, currentSortingObj: PoolsColumnSort) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

export function PoolListTableHeader({ ...rest }) {
  const { sorting, setSorting } = usePoolListQueryState()
  const { orderBy } = usePoolOrderByState()
  const sortingObj = sorting[0]

  return (
    <Grid {...rest} p={['ms', 'md']} w="full" borderBottom="1px solid" borderColor="border.base">
      <GridItem>
        <FadeInOnView animateOnce={false}>
          <VStack align="start" w="full">
            <Icon as={Globe} boxSize="5" color="grayText" />
          </VStack>
        </FadeInOnView>
      </GridItem>
      <GridItem>
        <FadeInOnView animateOnce={false}>
          <Text fontWeight="bold">Pool name</Text>
        </FadeInOnView>
      </GridItem>
      <GridItem justifySelf="start">
        <FadeInOnView animateOnce={false}>
          <Text fontWeight="bold" textAlign="left">
            Type
          </Text>
        </FadeInOnView>
      </GridItem>
      {orderBy.map((orderByItem, index) => (
        <GridItem key={index} justifySelf="end">
          <FadeInOnView animateOnce={false}>
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
          </FadeInOnView>
        </GridItem>
      ))}
    </Grid>
  )
}
