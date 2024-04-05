import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'

import { Globe } from 'react-feather'
import PoolListSortButton from '../../pool/PoolList/PoolListTable/PoolListSortButton'
import { PortfolioTableSortingId, PortfolioSortingData, portfolioOrderBy } from './PortfolioTable'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

const setIsDesc = (id: PortfolioTableSortingId, currentSortingObj: PortfolioSortingData) =>
  currentSortingObj.id === id ? !currentSortingObj.desc : true

type Props = {
  currentSortingObj: PortfolioSortingData
  setCurrentSortingObj: (value: PortfolioSortingData) => void
}
export function PortfolioTableHeader({ currentSortingObj, setCurrentSortingObj, ...rest }: Props) {
  return (
    <Grid
      {...rest}
      p={['ms', 'md']}
      px="xs"
      w="full"
      borderBottom="1px solid"
      borderColor="border.base"
    >
      <GridItem>
        <FadeInOnView animateOnce={false}>
          <VStack align="start" w="full">
            <Icon as={Globe} boxSize="5" ml="1" color="grayText" />
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
      {portfolioOrderBy.map((orderByItem, index) => (
        <GridItem key={index} justifySelf="end">
          <FadeInOnView animateOnce={false}>
            <PoolListSortButton
              title={orderByItem.title}
              isCurrentSort={orderByItem.id === currentSortingObj.id}
              isDesc={currentSortingObj.desc}
              onClick={
                orderByItem.id === currentSortingObj.id
                  ? () =>
                      setCurrentSortingObj({
                        id: orderByItem.id,
                        desc: setIsDesc(orderByItem.id, currentSortingObj),
                      })
                  : () => setCurrentSortingObj({ id: orderByItem.id, desc: false })
              }
            />
          </FadeInOnView>
        </GridItem>
      ))}
    </Grid>
  )
}
