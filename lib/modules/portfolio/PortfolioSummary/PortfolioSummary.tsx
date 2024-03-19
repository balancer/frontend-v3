import { Flex, Heading, Icon, Stack } from '@chakra-ui/react'
import { usePortfolio } from '../usePortfolio'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { BarChart } from 'react-feather'

export function PortfolioSummary() {
  const { portfolioData, totalFiatClaimableBalance, protocolRewardsBalance } = usePortfolio()
  const { toCurrency } = useCurrency()
  const totalBalance = portfolioData?.userTotalBalance?.toNumber()
  const totalClaimableBalance = totalFiatClaimableBalance.plus(protocolRewardsBalance)

  return (
    <Flex direction={['column', 'column', 'row']} justifyContent={['space-around']}>
      <Stack alignItems="center" mb={[5, 5, 0]}>
        <Icon as={BarChart} mb="10px" width="30px" height="30px" />
        <Heading size="sm">My Balancer liquidity</Heading>
        <Heading size="lg">{toCurrency(totalBalance)}</Heading>
      </Stack>

      <Stack alignItems="center">
        <Icon as={StarsIcon} mb="10px" width="30px" height="30px" />
        <Heading size="sm">Claimable incentives</Heading>
        <Heading variant="special" size="lg">
          {toCurrency(totalClaimableBalance)}
        </Heading>
      </Stack>
    </Flex>
  )
}
