import {
  Card,
  CardBody,
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
    <Card maxWidth="900px">
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
                    <Td>{detail.weight}</Td>
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
