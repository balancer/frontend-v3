import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'

type Props = {
  children: React.ReactNode
}

export default async function MabeetsLayout({ children }: Props) {
  return <DefaultPageContainer minH="100vh">{children}</DefaultPageContainer>
}
