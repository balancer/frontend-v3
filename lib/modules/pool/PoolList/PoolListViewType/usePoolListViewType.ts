import { PoolListView, useUserSettings } from '@/lib/modules/user/settings/UserSettingsProvider'

export function usePoolListViewType() {
  const { poolListView, setPoolListView } = useUserSettings()

  return {
    isTableView: poolListView === PoolListView.List,
    isCardsView: poolListView === PoolListView.Grid,
    setPoolListView,
  }
}
