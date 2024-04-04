import { Grid, GridItem, Icon, Text, VStack } from '@chakra-ui/react'

import { Globe } from 'react-feather'
import PoolListSortButton from '../../pool/PoolList/PoolListTable/PoolListSortButton'
import { PortfolioTableSortingId, PortfolioSortingData, portfolioOrderBy } from './PortfolioTable'

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
        <VStack align="start" w="full">
          <Icon as={Globe} boxSize="5" ml="1" color="grayText" />
        </VStack>
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">Pool name</Text>
      </GridItem>
      <GridItem justifySelf="start">
        <Text fontWeight="bold" textAlign="left">
          Type
        </Text>
      </GridItem>
      {portfolioOrderBy.map((orderByItem, index) => (
        <GridItem key={index} justifySelf="end">
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
        </GridItem>
      ))}
    </Grid>
  )
}
