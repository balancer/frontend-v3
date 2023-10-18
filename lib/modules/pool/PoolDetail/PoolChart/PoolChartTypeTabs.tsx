import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { PoolChartTab, poolChartTabs } from './usePoolCharts'
import { Dispatch, SetStateAction } from 'react'

interface PoolChartTypeTabsProps {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<PoolChartTab>>
}

export function PoolChartTypeTabs({ setActiveTab }: PoolChartTypeTabsProps) {
  return (
    <Tabs width="fit-content">
      <TabList>
        {poolChartTabs.map(tab => (
          <Tab onClick={() => setActiveTab(tab.value)} key={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
