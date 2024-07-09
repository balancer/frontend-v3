import { useQuery } from '@tanstack/react-query'
import { useUserAccount } from '../web3/UserAccountProvider'
import { Pool } from '../pool/PoolProvider'
import { getChainId } from '@/lib/config/app.config'

type CampaignDataEntry = {
  accumulated: string
  auxiliaryData1: string
  auxiliaryData2: string
  decimals: number
  mainParameter: string
  type: number
  symbol: string
  token: string
  unclaimed: string
}

type CampaignData = {
  base: CampaignDataEntry
  staker: CampaignDataEntry
  stakoor: CampaignDataEntry
  migrator?: CampaignDataEntry
}

type Campaign = {
  campaignData: {
    [key: string]: CampaignData
  }
}

type ChainId = number

type MerklRewardsSchema = {
  [key: ChainId]: Campaign
}

export function useHasMerklRewards(poolsWithOnchainUserBalances: Pool[]) {
  const { userAddress, isConnected } = useUserAccount()

  const queryFn = async () => {
    const userAccount = '0x1B72Bac3772050FDCaF468CcE7e20deb3cB02d89'
    const response = await fetch(`https://api.merkl.xyz/v3/rewards?user=${userAccount}`)
    const rewards: MerklRewardsSchema = await response.json()
    return rewards
  }

  const { data: rewards } = useQuery({
    queryKey: ['merkl-rewards', userAddress],
    queryFn,
    enabled: isConnected,
  })

  const hasMerklRewards = poolsWithOnchainUserBalances.some(pool => {
    if (!rewards) return false
    const campaignData = rewards[getChainId(pool.chain)].campaignData
    // MATCH campaignId with poolId (not available at the moment)
    return false
  })

  return { hasMerklRewards }
}
