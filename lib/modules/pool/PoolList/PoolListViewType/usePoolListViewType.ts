import { PoolListView, useUserSettings } from '@/lib/modules/user/settings/useUserSettings'

export function usePoolListViewType() {
  const { poolListView, setPoolListView } = useUserSettings()

  return {
    isTableView: poolListView === PoolListView.List,
    isCardsView: poolListView === PoolListView.Grid,
    setPoolListView,
  }
}
