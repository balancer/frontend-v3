import { Tab, TabList, Tabs } from '@chakra-ui/react'

import { Dispatch, SetStateAction } from 'react'
import { PoolActivityChartTab, PoolActivityChartTypeTab } from './usePoolActivityChart'

interface PoolChartTypeTabsProps {
  tabsList: PoolActivityChartTypeTab[]
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<PoolActivityChartTab>>
}

export function ActivityChartTypeTabs({ setActiveTab, tabsList }: PoolChartTypeTabsProps) {
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
