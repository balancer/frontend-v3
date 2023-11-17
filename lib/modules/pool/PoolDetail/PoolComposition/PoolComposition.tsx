import {
  Box,
  Flex,
  FormLabel,
  HStack,
  Link,
  Progress,
  Spacer,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Card,
  Icon,
} from '@chakra-ui/react'
import { FiCornerDownRight, FiExternalLink } from 'react-icons/fi'
import {
  Cell,
  ColumnDef,
  ExpandedState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import TokenAvatar from '@/lib/shared/components/avatars/TokenAvatar'
import numeral from 'numeral'
import { tokenFormat } from '@/lib/shared/hooks/useNumbers'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { usePool } from '@/lib/modules/pool/usePool'
import { GqlChain, GqlPoolTokenUnion } from '@/lib/shared/services/api/generated/graphql'
import { etherscanGetTokenUrl } from '@/lib/shared/utils/etherscan'

interface PoolCompositionTableProps {
  columns: ColumnDef<TableDataTemplate>[]
  data: TableData[]
  hasNestedTokens: boolean
  chain: GqlChain
}

interface TableDataTemplate {
  symbol: string
  name: string
  weight: string | number
  balance: string
  value: string
}

interface TableData extends TableDataTemplate {
  subRows?: TableDataTemplate[]
}

enum Columns {
  Expander = 'expander',
  Symbol = 'symbol',
  Name = 'name',
  Weight = 'weight',
  Balance = 'balance',
  Value = 'value',
}

function PoolCompositionTable({
  columns,
  data,
  hasNestedTokens,
  chain,
}: PoolCompositionTableProps) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const options: TableOptions<TableData> = {
    columns,
    data,
    state: { expanded },
    autoResetExpanded: false,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
  }

  const table = useReactTable(options)

  // TODO: type this
  function parseCell(cell: any) {
    if (cell.column.id === Columns.Symbol) {
      const [symbol, address] = cell.getValue().split('--')
      return (
        <HStack>
          {cell.row.depth > 0 ? (
            <Box pl={cell.row.depth === 1 ? 'sm' : 'md'}>
              <FiCornerDownRight />
            </Box>
          ) : null}
          <TokenAvatar size="xs" address={address} chain={chain} />
          <HStack spacing="sm">
            <Text fontSize="sm">{symbol}</Text>
            <Link
              href={etherscanGetTokenUrl(address, chain)}
              target="_blank"
              alignSelf="flex-start"
            >
              <Icon as={FiExternalLink} color="black" boxSize="3" />
            </Link>
          </HStack>
        </HStack>
      )
    } else if (cell.column.id === Columns.Weight) {
      // only show the progress bar for the main pool token and not for any nested tokens
      return cell.row.depth === 0 ? (
        <Progress width="80%" rounded="lg" value={parseFloat(cell.getValue() || '0') * 100} />
      ) : null
    } else {
      // just render the cell value
      return flexRender(cell.column.columnDef.cell, cell.getContext())
    }
  }

  return (
    <>
      {hasNestedTokens && (
        <Flex justifyContent="flex-end" mb="2">
          <Spacer />
          <Flex>
            <FormLabel htmlFor="nested-tokens" mb="0">
              Show nested tokens?
            </FormLabel>
            <Switch id="nested-tokens" onChange={() => table.toggleAllRowsExpanded()} />
          </Flex>
        </Flex>
      )}
      <TableContainer>
        <Table>
          <Thead w="full" px="2">
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} border="none" p={header.id === Columns.Expander ? '0' : '2'}>
                    <Text fontSize="xs">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Text>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <Tr key={row.id} p="2" w="full">
                  {row.getVisibleCells().map(cell => {
                    return (
                      <Td key={cell.id} borderBottom="0" p="2">
                        {parseCell(cell)}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

export function PoolComposition() {
  const { pool, chain } = usePool()
  const { prices, priceFor } = useTokens()
  const hasNestedTokens = pool.tokens.some(
    token =>
      token.__typename &&
      ['GqlPoolTokenLinear', 'GqlPoolTokenPhantomStable'].includes(token.__typename)
  )

  const columns: ColumnDef<TableData>[] = React.useMemo(
    () => [
      {
        accessorKey: Columns.Symbol,
        header: 'Symbol',
      },
      {
        accessorKey: Columns.Name,
        header: 'Name',
      },
      {
        accessorKey: Columns.Weight,
        header: 'Weight',
      },
      {
        accessorKey: Columns.Balance,
        header: 'Balance',
      },
      {
        accessorKey: Columns.Value,
        header: 'Value',
      },
    ],
    []
  )

  function getTokenData(tokens: GqlPoolTokenUnion[]): TableData[] {
    return tokens.map(token => {
      const tokenPrice = priceFor(token.address, chain)
      const totalTokenValue = parseFloat(token.balance) * tokenPrice
      const calculatedWeight = totalTokenValue / parseFloat(pool.dynamicData.totalLiquidity)

      return {
        symbol: `${token.symbol}--${token.address}`,
        name: token.name,
        weight: token.weight ?? calculatedWeight,
        balance: tokenFormat(token.balance),
        value: numeral(totalTokenValue).format('$0,0.00a'),
        ...(hasNestedTokens && 'pool' in token && { subRows: getTokenData(token.pool.tokens) }),
      }
    })
  }

  const data = React.useMemo(
    (): TableData[] => getTokenData(pool.tokens as GqlPoolTokenUnion[]),
    [JSON.stringify(pool.tokens), JSON.stringify(prices)]
  )

  return (
    <Card p="4" w="full">
      <PoolCompositionTable
        columns={columns}
        data={data}
        hasNestedTokens={hasNestedTokens}
        chain={chain}
      />
    </Card>
  )
}
