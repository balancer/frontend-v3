// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
import {
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
} from 'react-table'

declare module 'react-table' {
  export type TableOptions<D extends Record<string, unknown>> = UseExpandedOptions<D>

  export type Hooks<D extends Record<string, unknown> = Record<string, unknown>> =
    UseExpandedHooks<D>

  export type TableInstance<D extends Record<string, unknown> = Record<string, unknown>> =
    UseExpandedInstanceProps<D>

  export type TableState<D extends Record<string, unknown> = Record<string, unknown>> =
    UseExpandedState<D>

  export type Row<D extends Record<string, unknown> = Record<string, unknown>> =
    UseExpandedRowProps<D>
}
