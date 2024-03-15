import { PortfolioProvider } from '@/lib/modules/portfolio/usePortfolio'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { cookies } from 'next/headers'
import { COOKIE_KEYS } from '@/lib/modules/cookies/cookie.constants'

type Props = {
  children: React.ReactNode
}

export default async function PortfolioLayout({ children }: Props) {
  const cookieStore = cookies()
  const userAddressCookie = cookieStore.get(COOKIE_KEYS.UserAddress)
  const userAddress = userAddressCookie?.value

  const { data } = await getApolloServerClient().query({
    query: GetPoolsDocument,
    variables: { where: { userAddress } },
    notifyOnNetworkStatusChange: true,
  })

  return <PortfolioProvider data={data}>{children}</PortfolioProvider>
}
