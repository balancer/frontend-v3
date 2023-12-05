import { ChainId } from '@balancer/sdk'
import { setWagmiDefaultRpcUrlForTests } from '../utils/wagmi'

/*
  Specific setup for integration tests (that it is not needed in unit tests)
*/
const port = 8555

beforeAll(() => setWagmiDefaultRpcUrlForTests(ChainId.MAINNET, `http://127.0.0.1:${port}/`))
