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
      <Stack>
        <Link href={backLink}>
          <HStack>
            <ArrowLeft size={24} />

            <Heading variant="special">{title}</Heading>
          </HStack>
        </Link>

        <Card
          variant="level2"
          p="md"
          shadow="xl"
          flex="1"
          width="100%"
          minWidth={['320px', '320px', '600px']}
          maxWidth="600px"
          {...rest}
        >
          {children}
        </Card>
      </Stack>
    </Stack>
  )
}
