import { Card, Flex, Heading, Icon, Stack } from '@chakra-ui/react'
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
    <Card
      variant={'level1'}
      p={['md', 'md']}
      direction={['column', 'column', 'row']}
      justifyContent={['space-around']}
      gap={[3, 5]}
    >
      <Card flex="1" variant="level2" py={[8]} alignItems="center" mb={[0, 5, 0]}>
        <Icon as={BarChart} mb={5} width="30px" height="30px" />
        <Heading size="sm">My Balancer liquidity</Heading>
        <Heading size="lg">{toCurrency(totalBalance)}</Heading>
      </Card>

      <Card flex="1" variant="level2" py={[8]} alignItems="center" mb={[0, 5, 0]}>
        <Icon as={StarsIcon} mb={5} width="30px" height="30px" />
        <Heading size="sm">Claimable incentives</Heading>
        <Heading variant="special" size="lg">
          {toCurrency(totalClaimableBalance)}
        </Heading>
      </Card>
    </Card>
  )
}
