import {
  Card,
  CardBody,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

import { usePoolInfo } from './usePoolInfo'

export function PoolInfoTable() {
  const { poolDetails } = usePoolInfo()

  return (
    <Stack maxWidth="900px">
      <Text fontSize="24px" fontWeight="bold">
        Pool Details
      </Text>
      <Card maxWidth="900px" flex="1">
        <CardBody p="0">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Attribute</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {poolDetails.map(detail => {
                  return (
                    detail && (
                      <Tr key={detail.title}>
                        <Td>{detail.title}</Td>
                        <Td>{detail.value}</Td>
                      </Tr>
                    )
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Stack>
  )
}
