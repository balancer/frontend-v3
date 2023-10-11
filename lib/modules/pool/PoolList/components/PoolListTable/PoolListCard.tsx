import { Card, CardBody, Grid, GridItem, VStack, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  cells: React.ReactNode[]
  templateColumns: string
  templateAreas: string
  columnIds: string[]
  columnTitles: string[] | undefined
  bg: string
}

export function PoolListCard({
  cells,
  templateColumns,
  templateAreas,
  columnIds,
  columnTitles,
  bg,
}: Props) {
  return (
    <Card mb="4" w="full" bg={bg}>
      <CardBody>
        <Grid templateColumns={{ base: templateColumns }} templateAreas={{ base: templateAreas }}>
          {cells.map((cell, index) => (
            <GridItem key={index} area={columnIds[index]}>
              <VStack>
                <Text>{columnTitles && columnTitles[index]}</Text>
                {cell}
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </CardBody>
    </Card>
  )
}
