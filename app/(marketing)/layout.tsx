import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import { PropsWithChildren } from 'react'

export default function MarketingLayout({ children }: PropsWithChildren) {
  return <DefaultPageContainer>{children}</DefaultPageContainer>
}
