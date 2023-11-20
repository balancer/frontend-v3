import {
  Card,
  CardBody,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { usePoolComposition } from './usePoolComposition'

const tableHeads = ['Token', 'Balance', 'Value', 'Token %']

// TO-DO make this work for nested tokens
export function PoolComposition() {
  const { poolComposition } = usePoolComposition()

  return (
    <Card variant="gradient" width="full">
      <HStack p="5">
        <Text variant="heading" fontWeight="bold" as="h2" fontSize="xl">
          My liquidity
        </Text>
      </HStack>
      <CardBody>
        <Text fontSize="24px" fontWeight="bold">
          Pool Composition
        </Text>
        <TableContainer>
          <Table variant="unstyled">
            <Thead>
              <Tr>
                {tableHeads.map(head => (
                  <Th key={head}>{head}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {poolComposition.map(detail => {
                return (
                  <Tr key={detail.symbol}>
                    <Td>{detail.symbol}</Td>
                    <Td>{detail.balance}</Td>
                    <Td>{detail.value}</Td>
                    {/* TODO if pool is weighted */}
                    {/* <Td>{detail.weight}</Td> */}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}
