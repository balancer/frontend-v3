import { Card, CardProps, HStack, Heading, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { ArrowLeft } from 'react-feather'

interface Props extends CardProps {
  backLink: string
  children: React.ReactNode
  title: string
}

export function ClaimNetworkLayout({ backLink, children, title, ...rest }: Props) {
  return (
    <Stack alignItems="center">
      <Stack gap={8}>
        <Link href={backLink}>
          <HStack>
            <ArrowLeft size={20} />

            <Heading variant="special" size="lg">
              {title}
            </Heading>
          </HStack>
        </Link>

        <Card
          variant="level1"
          p="md"
          shadow="xl"
          flex="1"
          width="100%"
          minWidth={['320px', '320px', '600px']}
          maxWidth="600px"
          border="1px solid"
          borderColor="input.borderDefault"
          {...rest}
        >
          {children}
        </Card>
      </Stack>
    </Stack>
  )
}
