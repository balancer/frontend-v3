import { SupportedChainId } from '@/lib/config/config.types'
import { PoolStateInput, Token } from '@balancer/sdk'

export class PoolState {
  constructor(private poolStateInput: PoolStateInput, private chainId: SupportedChainId) {}

  getPoolTokens() {
    return this.poolStateInput.tokens.map(t => new Token(this.chainId, t.address, t.decimals))
  }
}
