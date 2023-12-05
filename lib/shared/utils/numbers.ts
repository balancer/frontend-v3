import numeral from 'numeral'

export function toPercentageFormatted(value: string) {
  return numeral(value).format('%')
}
