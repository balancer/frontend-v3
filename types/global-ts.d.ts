import { HumanAmount } from '@balancer/sdk'

/*
Global type overrides for TypeScript
*/
declare module 'viem' {
  //Override viem's formatUnits function to return HumanAmount (AKA `${number}`) to improve type safety
  export function formatUnits(value: bigint, decimals: number): HumanAmount
}
