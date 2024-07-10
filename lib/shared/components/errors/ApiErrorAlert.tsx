import { GlobalAlert } from './GlobalAlert'

export function ApiErrorAlert() {
  return (
    <GlobalAlert title={'Our API data provider appears to be having issues...'} status="error" />
  )
}
