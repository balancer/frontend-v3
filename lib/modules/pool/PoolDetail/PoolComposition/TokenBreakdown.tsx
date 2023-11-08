import { Td, Tr, theme } from '@chakra-ui/react'

interface TokenBreakdownProps {
  token: any
  parentLevel?: number
}
export function TokenBreakdown({ token, parentLevel = 0 }: TokenBreakdownProps) {
  const currentLevel = parentLevel + 1

  return (
    <>
      <Tr bg={parentLevel > 0 ? theme.colors.blue[100] : 'unset'} key={token.symbol}>
        <Td pl={parentLevel * 4}>{token.symbol}</Td>
        <Td>{token.balance}</Td>
        <Td>{token.value}</Td>
        <Td>{token.weight}</Td>
      </Tr>

      {token.nestedTokens?.map((token: any) => {
        return <TokenBreakdown token={token} key={token.symbol} parentLevel={currentLevel} />
      })}
    </>
  )
}
