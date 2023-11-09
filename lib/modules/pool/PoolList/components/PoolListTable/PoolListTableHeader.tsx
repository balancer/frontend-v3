import { Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import PoolListSortLink from './PoolListSortLink'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { getNetworkConfig } from '@/lib/config/app.config'
import { FiGlobe } from 'react-icons/fi'
//import { InfoButton } from '~/components/info-button/InfoButton';

export function PoolListTableHeader() {
  const { sorting, setSorting } = usePoolListQueryState()
  const sortingObj = sorting[0]

  return (
    <>
      <Grid
        px="4"
        py="3"
        borderTopLeftRadius="md"
        borderTopRightRadius="md"
        alignItems="center"
        bgColor="rgba(255,255,255,0.08)"
        borderBottom="2px"
        borderColor="black"
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
        {/* {showMyInvestments && (
                    <GridItem textAlign="right">
                        <Flex justifyContent="flex-end" color="beets.base.100">
                            <Text fontSize="md" fontWeight="semibold">
                                My balance
                            </Text>
                            <InfoButton infoText="To increase performance, your pool balances are cached for this list view. If you just made an invest or withdraw, it may take a few seconds for the change to be reflected here." />
                        </Flex>
                    </GridItem>
                )} */}
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
