/**
 * Apollo Prime Cache Provider
 *
 * This component is used to prime the Apollo cache with data that is needed
 * for the entire application. This is useful for data that is needed on every
 * page, such as token data.
 */
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { GetAppGlobalDataDocument } from '@/lib/services/api/generated/graphql'

export function ApolloPrimeCacheProvider({
  children,
}: React.PropsWithChildren) {
  useSuspenseQuery(GetAppGlobalDataDocument)

  return <>{children}</>
}
