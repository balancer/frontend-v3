import { makeVar, useReactiveVar } from '@apollo/client'

export type ViewType = 'list' | 'grid'

export const viewTypeStateVar = makeVar<ViewType>('list')

export function usePoolListViewType() {
  function setViewType(value: ViewType) {
    viewTypeStateVar(value)
  }

  return {
    viewType: useReactiveVar(viewTypeStateVar),
    setViewType,
  }
}
