import { MockApi } from '@/lib/balancer-api/MockApi'
import {
  BALANCER_VAULT,
  ChainId,
  MAX_UINT256,
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

export async function getSdkTestUtils({
  client,
  account,
  chainId,
  poolId,
}: {
  client: Client & PublicActions & WalletActions & TestActions
  account: Address
  chainId: ChainId
  poolId: Address
}) {
  const api = new MockApi()
  // get pool state from api
  const poolStateInput = await api.getPool(poolId)

  return {
    poolStateInput,
    approveToken,
    getErc20Balance,
    getBalances,
    getPoolTokens,
    calculateBalanceDeltas,
    setupTokens,
  }

  async function approveToken(
    account: Address,
    token: Address,
    amount = MAX_UINT256 // approve max by default
  ): Promise<boolean> {
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

  function getErc20Balance(token: Address, holder: Address): Promise<bigint> {
    return client.readContract({
      address: token,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [holder],
    })
  }

  async function getBalances(tokens = getTokensForBalanceCheck(true)): Promise<Promise<bigint[]>> {
    const balances: Promise<bigint>[] = []
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === ZERO_ADDRESS) {
        balances[i] = client.getBalance({
          address: account,
        })
      } else {
        balances[i] = getErc20Balance(tokens[i], account)
      }
    }
    return Promise.all(balances)
  }

  function getPoolTokens() {
    return poolStateInput.tokens.map(t => new Token(chainId, t.address, t.decimals))
  }

  // Token addresses to check balance deltas
  // Includes BPT token address
  function getTokensForBalanceCheck(checkNativeBalance = true) {
    const poolTokens = getPoolTokens()
    // Replace with native asset if required
    const poolTokensAddr = checkNativeBalance
      ? replaceWrapped(poolTokens, chainId).map(t => t.address)
      : poolTokens.map(t => t.address)
    return [...poolTokensAddr, poolStateInput.address]
  }

  // // Includes BPT balance
  // async function getAllBalances() {
  //   return await getBalances([...getTokensForBalanceCheck(true), poolStateInput.address])
  // }

  async function calculateBalanceDeltas(
    balanceBefore: bigint[],
    transactionReceipt: TransactionReceipt
  ) {
    const { gasUsed, effectiveGasPrice } = transactionReceipt
    const gasPrice = gasUsed * effectiveGasPrice

    const balancesAfter = await getBalances()

    const tokensForBalanceCheck = getTokensForBalanceCheck(true)

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
  async function setTokenBalance(
    token: Address,
    slot: number,
    balance: bigint,
    isVyperMapping = false
  ): Promise<void> {
    // Get storage slot index

    const slotBytes = pad(toBytes(slot))
    const accountAddressBytes = pad(toBytes(account))

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
  async function findTokenBalanceSlot(
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
      const balance = await getErc20Balance(tokenAddress, account)

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
  async function setupTokens(
    balances: bigint[],
    isVyperMapping: boolean[] = Array(getPoolTokens().length).fill(false),
    slots?: number[]
  ): Promise<void> {
    await client.impersonateAccount({ address: account })

    const tokens = getPoolTokens().map(token => token.address)

    let _slots: number[]
    if (slots) {
      _slots = slots
    } else {
      _slots = await Promise.all(
        tokens.map(async (token, i) => findTokenBalanceSlot(account, token, isVyperMapping[i]))
      )
      console.log(`slots: ${_slots}`)
    }

    for (let i = 0; i < tokens.length; i++) {
      // Set initial account balance for each token that will be used to join pool
      await setTokenBalance(tokens[i], _slots[i], balances[i], isVyperMapping[i])

      // Approve appropriate allowances so that vault contract can move tokens
      await approveToken(account, tokens[i])
    }
  }
}
