import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import {
  BALANCER_VAULT,
  ChainId,
  MAX_UINT256,
  PoolStateInput,
  Token,
  ZERO_ADDRESS,
  replaceWrapped,
} from '@balancer/sdk'
import {
  Address,
  Client,
  Hex,
  PublicActions,
  TestActions,
  TransactionReceipt,
  WalletActions,
  concat,
  encodeAbiParameters,
  hexToBigInt,
  keccak256,
  pad,
  toBytes,
  toHex,
  trim,
} from 'viem'
import { erc20ABI } from 'wagmi'

export const approveToken = async (
  client: Client & PublicActions & WalletActions,
  account: Address,
  token: Address,
  amount = MAX_UINT256 // approve max by default
): Promise<boolean> => {
  // approve token on the vault
  const hash = await client.writeContract({
    account,
    chain: client.chain,
    address: token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [BALANCER_VAULT, amount],
  })

  const txReceipt = await client.waitForTransactionReceipt({
    hash,
  })
  return txReceipt.status === 'success'
}

export const getErc20Balance = (
  token: Address,
  client: Client & PublicActions,
  holder: Address
): Promise<bigint> =>
  client.readContract({
    address: token,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [holder],
  })

export const getBalances = async (tokens: Address[]): Promise<Promise<bigint[]>> => {
  const balances: Promise<bigint>[] = []
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === ZERO_ADDRESS) {
      balances[i] = testPublicClient.getBalance({
        address: defaultTestUserAccount,
      })
    } else {
      balances[i] = getErc20Balance(tokens[i], testPublicClient, defaultTestUserAccount)
    }
  }
  return Promise.all(balances)
}

type Pool = ReturnType<typeof buildPool>

// This is just a testing util
// TODO: verify that checkNativeBalance is only for testing
export function buildPool(poolInput: PoolStateInput, checkNativeBalance = true, chainId: ChainId) {
  function poolTokens() {
    return poolInput.tokens.map(t => new Token(chainId, t.address, t.decimals))
  }

  function poolTokensAddr() {
    // Replace with native asset if required
    return checkNativeBalance
      ? replaceWrapped(poolTokens(), chainId).map(t => t.address)
      : poolTokens().map(t => t.address)
  }

  // Token addresses to check balance deltas
  // Includes BPT token address
  function tokensForBalanceCheck() {
    return [...poolTokensAddr(), poolInput.address]
  }

  // Includes BPT balance
  async function getAllBalances() {
    return await getBalances([...poolTokensAddr(), poolInput.address])
  }

  return { poolTokens, poolTokensAddr, tokensForBalanceCheck, getAllBalances }
}

export async function calculateBalanceDeltas(
  balanceBefore: bigint[],
  pool: Pool,
  transactionReceipt: TransactionReceipt
) {
  const { gasUsed, effectiveGasPrice } = transactionReceipt
  const gasPrice = gasUsed * effectiveGasPrice

  const balancesAfter = await pool.getAllBalances()
  const tokensForBalanceCheck = pool.tokensForBalanceCheck()

  const balanceDeltas = balancesAfter.map((balanceAfter, i) => {
    let _balanceAfter = balanceAfter
    if (tokensForBalanceCheck[i] === ZERO_ADDRESS) {
      // ignore ETH delta from gas cost
      _balanceAfter = balanceAfter + gasPrice
    }
    const delta = _balanceAfter - balanceBefore[i]
    return delta >= 0n ? delta : -delta
  })

  return balanceDeltas
}

/**
 * Set local ERC20 token balance for a given account address (used for testing)
 *
 * @param client client that will perform the setStorageAt call
 * @param accountAddress Account address that will have token balance set
 * @param token Token address which balance will be set
 * @param slot Slot memory that stores balance - use npm package `slot20` to identify which slot to provide
 * @param balance Balance in EVM amount
 * @param isVyperMapping Whether the storage uses Vyper or Solidity mapping
 */
export const setTokenBalance = async (
  client: Client & TestActions,
  accountAddress: Address,
  token: Address,
  slot: number,
  balance: bigint,
  isVyperMapping = false
): Promise<void> => {
  // Get storage slot index

  const slotBytes = pad(toBytes(slot))
  const accountAddressBytes = pad(toBytes(accountAddress))

  let index: Address
  if (isVyperMapping) {
    index = keccak256(concat([slotBytes, accountAddressBytes])) // slot, key
  } else {
    index = keccak256(concat([accountAddressBytes, slotBytes])) // key, slot
  }

  // Manipulate local balance (needs to be bytes32 string)
  await client.setStorageAt({
    address: token,
    index,
    value: toHex(balance, { size: 32 }),
  })
}

/**
 * Find ERC20 token balance storage slot (to be used on setTokenBalance)
 *
 * @param client client that will perform contract calls
 * @param accountAddress Account address to probe storage slot changes
 * @param tokenAddress Token address which we're looking for the balance slot
 * @param isVyperMapping Whether the storage uses Vyper or Solidity mapping
 */
export async function findTokenBalanceSlot(
  client: Client & PublicActions & TestActions,
  accountAddress: Address,
  tokenAddress: Address,
  isVyperMapping = false
): Promise<number> {
  const probeA = encodeAbiParameters(
    [{ name: 'probeA', type: 'uint256' }],
    [BigInt((Math.random() * 10000).toFixed())]
  )
  const probeB = encodeAbiParameters(
    [{ name: 'probeA', type: 'uint256' }],
    [BigInt((Math.random() * 10000).toFixed())]
  )
  for (let i = 0; i < 999; i++) {
    // encode probed slot
    const slotBytes = pad(toBytes(i))
    const accountAddressBytes = pad(toBytes(accountAddress))
    let probedSlot: Address
    if (isVyperMapping) {
      probedSlot = keccak256(concat([slotBytes, accountAddressBytes])) // slot, key
    } else {
      probedSlot = keccak256(concat([accountAddressBytes, slotBytes])) // key, slot
    }

    // remove padding for JSON RPC
    probedSlot = trim(probedSlot)

    // get storage value
    const prev = (await client.getStorageAt({
      address: tokenAddress,
      slot: probedSlot,
    })) as Hex

    // set storage slot to new probe
    const probe = prev === probeA ? probeB : probeA
    await client.setStorageAt({
      address: tokenAddress,
      index: probedSlot,
      value: probe,
    })

    // check if balance changed
    const balance = await getErc20Balance(tokenAddress, client, accountAddress)

    // reset to previous value
    await client.setStorageAt({
      address: tokenAddress,
      index: probedSlot,
      value: prev,
    })

    // return slot if balance changed
    if (balance === hexToBigInt(probe)) return i
  }
  throw new Error('Balance slot not found!')
}

/**
 * Setup local fork with approved token balance for a given account address
 *
 * @param client Client that will perform transactions
 * @param accountAddress Account address that will have token balance set and approved
 * @param tokens Token addresses which balance will be set and approved
 * @param slots Slot that stores token balance in memory - use npm package `slot20` to identify which slot to provide
 * @param balances Balances in EVM amounts
 * @param jsonRpcUrl Url with remote node to be forked locally
 * @param blockNumber Number of the block that the fork will happen
 * @param isVyperMapping Whether the storage uses Vyper or Solidity mapping
 */
export const setupTokens = async (
  client: Client & PublicActions & TestActions & WalletActions,
  accountAddress: Address,
  pool: Pool,
  balances: bigint[],
  isVyperMapping: boolean[] = Array(pool.poolTokens().length).fill(false),
  slots?: number[]
): Promise<void> => {
  await client.impersonateAccount({ address: accountAddress })

  const tokens = pool.poolTokens().map(token => token.address)

  let _slots: number[]
  if (slots) {
    _slots = slots
  } else {
    _slots = await Promise.all(
      tokens.map(async (token, i) =>
        findTokenBalanceSlot(client, accountAddress, token, isVyperMapping[i])
      )
    )
    console.log(`slots: ${_slots}`)
  }

  for (let i = 0; i < tokens.length; i++) {
    // Set initial account balance for each token that will be used to join pool
    await setTokenBalance(
      client,
      accountAddress,
      tokens[i],
      _slots[i],
      balances[i],
      isVyperMapping[i]
    )

    // Approve appropriate allowances so that vault contract can move tokens
    await approveToken(client, accountAddress, tokens[i])
  }
}
