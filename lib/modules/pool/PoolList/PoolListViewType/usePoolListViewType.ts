import { makeVar, useReactiveVar } from '@apollo/client'

export enum ViewType {
  Table = 'Table',
  Cards = 'Cards',
}

export const viewTypeStateVar = makeVar<ViewType>(ViewType.Table)

export function usePoolListViewType() {
  function setViewType(value: ViewType) {
    viewTypeStateVar(value)
  }

  const viewType = useReactiveVar(viewTypeStateVar)

  return {
    isTableView: viewType === ViewType.Table,
    isCardsView: viewType === ViewType.Cards,
    setViewType,
  }
}
