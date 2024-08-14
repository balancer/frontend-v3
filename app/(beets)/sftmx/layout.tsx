import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import { PropsWithChildren } from 'react'

export default async function SftmxLayout({ children }: PropsWithChildren) {
  return <DefaultPageContainer minH="100vh">{children}</DefaultPageContainer>
}
