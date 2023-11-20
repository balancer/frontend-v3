import { GqlPoolSnapshotDataRange } from '@/lib/shared/services/api/generated/graphql'
import { Select } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import { poolChartPeriods } from './usePoolCharts'

interface PoolChartPeriodSelectorProps {
  activePeriod: string
  setActivePeriod: Dispatch<SetStateAction<GqlPoolSnapshotDataRange>>
}

export function PoolChartPeriodSelector({
  activePeriod,
  setActivePeriod,
}: PoolChartPeriodSelectorProps) {
  return (
    <Select
      width="fit-content"
      onChange={e => setActivePeriod(e.currentTarget.value as GqlPoolSnapshotDataRange)}
      defaultValue={activePeriod}
    >
      {poolChartPeriods.map(period => (
        <option key={period.value} value={period.value}>
          {period.label}
        </option>
      ))}
    </Select>
  )
}
