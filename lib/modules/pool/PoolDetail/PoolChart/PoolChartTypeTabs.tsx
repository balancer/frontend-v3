import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import { PoolChartTypeTab, PoolChartTab } from './usePoolCharts'

interface PoolChartTypeTabsProps {
  tabsList: PoolChartTypeTab[]
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<PoolChartTab>>
}

export function PoolChartTypeTabs({ setActiveTab, tabsList }: PoolChartTypeTabsProps) {
  return (
    <Tabs width="fit-content">
      <TabList>
        {tabsList.map(tab => (
          <Tab onClick={() => setActiveTab(tab.value)} key={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
