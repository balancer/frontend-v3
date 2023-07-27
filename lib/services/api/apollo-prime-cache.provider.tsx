import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { GetAppGlobalDataDocument } from '@/lib/services/api/generated/graphql'

export function ApolloPrimeCacheProvider({
  children,
}: React.PropsWithChildren) {
  useSuspenseQuery(GetAppGlobalDataDocument)

  return <>{children}</>
}
