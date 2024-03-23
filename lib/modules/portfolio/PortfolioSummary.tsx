import { BoxProps, Card, Heading, Icon } from '@chakra-ui/react'
import { usePortfolio } from './usePortfolio'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { BarChart } from 'react-feather'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'

const commonNoisyCardProps: { contentProps: BoxProps; cardProps: BoxProps } = {
  contentProps: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 'none',
    borderBottomRightRadius: 'none',
    py: [8],
  },
  cardProps: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
  },
}
export function PortfolioSummary() {
  const { portfolioData, totalFiatClaimableBalance, protocolRewardsBalance } = usePortfolio()
  const { toCurrency } = useCurrency()
  const totalBalance = portfolioData?.userTotalBalance?.toNumber()
  const totalClaimableBalance = totalFiatClaimableBalance.plus(protocolRewardsBalance)

  return (
    <Card
      variant="level2"
      width="full"
      display="flex"
      alignItems="center"
      position="relative"
      shadow="2xl"
      borderWidth={0}
      p={['md', 'md']}
      direction={['column', 'column', 'row']}
      justifyContent={['space-around']}
      gap={[3, 5]}
    >
      <NoisyCard
        cardProps={{
          ...commonNoisyCardProps.cardProps,
        }}
        contentProps={commonNoisyCardProps.contentProps}
      >
        <ZenGarden variant="diamond" sizePx="225px" />
        <Icon as={BarChart} mb={5} width="30px" height="30px" />
        <Heading size="sm">My Balancer liquidity</Heading>
        <Heading size="lg">{toCurrency(totalBalance)}</Heading>
      </NoisyCard>

      <NoisyCard
        cardProps={{
          ...commonNoisyCardProps.cardProps,
        }}
        contentProps={commonNoisyCardProps.contentProps}
      >
        <ZenGarden variant="diamond" sizePx="225px" />
        <Icon as={StarsIcon} mb={5} width="30px" height="30px" />
        <Heading size="sm">Claimable incentives</Heading>
        <Heading variant="special" size="lg">
          {toCurrency(totalClaimableBalance)}
        </Heading>
      </NoisyCard>
    </Card>
  )
}
