import { Card, CardProps, HStack, Heading, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { ArrowLeft } from 'react-feather'

interface Props extends CardProps {
  backLink: string
  children: React.ReactNode
  title: string
}

export function ClaimPoolLayout({ backLink, children, title, ...rest }: Props) {
  return (
    <Stack alignItems="center">
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
        <Link href={backLink}>
          <HStack>
            <ArrowLeft size={24} />
            <Heading variant="sand" size="lg">
              {title}
            </Heading>
          </HStack>
        </Link>
        {children}
      </Card>
    </Stack>
  )
}
