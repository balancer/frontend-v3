import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { PoolChartTab, PoolChartTypeTab } from './usePoolCharts'
import { Dispatch, SetStateAction } from 'react'

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
