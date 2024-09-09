import { SdkSimulateSwapResponse } from '../swap.types'
import { useSwap } from '../SwapProvider'
import ReactECharts from 'echarts-for-react'
import { useTokens } from '../../../modules/tokens/TokensProvider'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { renderToString } from 'react-dom/server'
import { Box, VStack } from '@chakra-ui/react'
import { uniqBy } from 'lodash'

type Params = {
  data: {
    source: string
    target: string
    value: number
  }
  value: number
  dataIndex: number
}

function ToolTip({
  params,
  selectedChain,
  poolInfoArray,
  tokenInfoArray,
}: {
  params: Params
  selectedChain: GqlChain
  poolInfoArray: { symbol: string }[]
  tokenInfoArray: { symbol: string | undefined; address: string | undefined }[]
}) {
  const sourceTokenInfo = tokenInfoArray.find(token => token.address === params.data.source)
  const targetTokenInfo = tokenInfoArray.find(token => token.address === params.data.target)
  const poolSymbol = poolInfoArray[params.dataIndex].symbol

  return (
    <VStack>
      <Box>{poolSymbol}</Box>
      <Box>
        {sourceTokenInfo?.symbol} {'>>>'} {targetTokenInfo?.symbol}: {params.data.value}
      </Box>
    </VStack>
  )
}

export function SwapRoutesChart() {
  const { simulationQuery, selectedChain } = useSwap()
  const { getToken } = useTokens()

  const queryData = simulationQuery.data as SdkSimulateSwapResponse

  const dataPaths = queryData.paths
    .map(path => path.tokens.map(token => ({ name: token.address })))
    .flat()

  const uniqueTokenAddresses = uniqBy(dataPaths, 'name')
  const data = uniqueTokenAddresses.map(token => ({ name: token.name }))

  const links = queryData.routes
    .map(route => {
      const value = Number(route.hops[0].tokenInAmount)
      return route.hops.map(hop => ({ source: hop.tokenIn, target: hop.tokenOut, value }))
    })
    .flat()

  const tokenInfoArray = data.map(name => {
    const token = getToken(name.name, selectedChain)
    return { symbol: token?.symbol, address: token?.address }
  })

  const poolInfoArray = queryData.routes
    .map(route => {
      return route.hops.map(hop => ({
        symbol: hop.pool.symbol,
      }))
    })
    .flat()

  const option = {
    series: {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency',
      },
      data,
      links,
      label: {
        formatter: function (params: any) {
          return tokenInfoArray.find(token => token.address === params.data.name)?.symbol
        },
        rotate: 90,
        position: 'inside',
        align: 'center',
        verticalAlign: 'middle',
      },
      right: '5%',
      nodeWidth: 50,
      draggable: false,
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: function (params: Params) {
        return renderToString(
          <ToolTip
            params={params}
            selectedChain={selectedChain}
            poolInfoArray={poolInfoArray}
            tokenInfoArray={tokenInfoArray}
          />
        )
      },
    },
  }

  return <ReactECharts style={{ height: '600px', width: '1000px' }} option={option} />
}
