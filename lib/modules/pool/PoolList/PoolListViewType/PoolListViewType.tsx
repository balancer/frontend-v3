'use client'

import { usePoolListViewType } from './usePoolListViewType'
import { PoolListView } from '@/lib/modules/user/settings/useUserSettings'
import { Grid, List } from 'react-feather'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'

export function PoolListViewType() {
  const { setPoolListView, isTableView } = usePoolListViewType()

  const options: ButtonGroupOption[] = [
    {
      value: PoolListView.List,
      label: <List />,
    },
    {
      value: PoolListView.Grid,
      label: <Grid />,
    },
  ]

  function changeListView(option: ButtonGroupOption) {
    setPoolListView(option.value as PoolListView)
  }

  const currentOption = isTableView ? options[0] : options[1]

  return <ButtonGroup currentOption={currentOption} options={options} onChange={changeListView} />
}
