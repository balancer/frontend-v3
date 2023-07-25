import { ReactNode, createContext, useContext } from 'react'

export const TokensContext = createContext<ReturnType<
  typeof _useTokens
> | null>(null)

function _useTokens() {
  const tokens = ['some tokens']

  return { tokens }
}

export function TokensProvider({ children }: { children: ReactNode }) {
  const tokens = _useTokens()
  return (
    <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
  )
}

export const useTokens = () =>
  useContext(TokensContext) as ReturnType<typeof _useTokens>
