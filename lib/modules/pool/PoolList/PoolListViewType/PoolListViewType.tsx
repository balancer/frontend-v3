'use client'

import { usePoolListViewType } from './usePoolListViewType'
import { PoolListView } from '@/lib/modules/user/settings/useUserSettings'
import { Grid, List } from 'react-feather'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { useEffect, useState } from 'react'

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

export function PoolListViewType() {
  const { setPoolListView, isTableView } = usePoolListViewType()
  const [currentOption, setCurrentOption] = useState<ButtonGroupOption>(options[0])

  function changeListView(option: ButtonGroupOption) {
    setPoolListView(option.value as PoolListView)
  }

  useEffect(() => {
    const newOption = isTableView ? options[0] : options[1]
    setCurrentOption(newOption)
  }, [isTableView])

  return (
    <ButtonGroup
      size="xs"
      currentOption={currentOption}
      options={options}
      onChange={changeListView}
    />
  )
}
