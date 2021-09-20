import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getCakeContract, getMasterchefContract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from './useRefresh'
import useLastUpdated from './useLastUpdated'

type UseTokenBalanceState = {
  balance: BigNumber
  fetchStatus: FetchStatus
}

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const useTokenBalance = (tokenAddress: string) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress)
      try {
        const res = await contract.balanceOf(account)
        setBalanceState({ balance: new BigNumber(res.toString()), fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getCakeContract()
      const supply = await cakeContract.totalSupply()
      setTotalSupply(new BigNumber(supply.toString()))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress)
      const res = await contract.balanceOf('0x000000000000000000000000000000000000dEaD')
      setBalance(new BigNumber(res.toString()))
    }

    fetchBalance()
  }, [tokenAddress, slowRefresh])

  return balance
}

export const useGetBnbBalance = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await simpleRpcProvider.getBalance(account)
        setBalance(new BigNumber(walletBalance.toString()))
        setFetchStatus(FetchStatus.SUCCESS)
      } catch {
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, lastUpdated, setBalance, setFetchStatus])

  return { balance, fetchStatus, refresh: setLastUpdated }
}

export const useMaxTransferAmount = () => {
  const { slowRefresh } = useRefresh()
  const [maxTransferAmount, setMaxTransferAmount] = useState<BigNumber>()

  useEffect(() => {
    async function fetchMaxTransferAmount() {
      const riceContract = getCakeContract()
      const maxTransfer = await riceContract.maxTransferAmount()
      setMaxTransferAmount(new BigNumber(maxTransfer.toString()))
    }

    fetchMaxTransferAmount()
  }, [slowRefresh])

  return maxTransferAmount
}

export const useLockedRewards = () => {
  const { slowRefresh } = useRefresh()
  const [lockedRewards, setLockedRewards] = useState<BigNumber>()

  useEffect(() => {
    async function fetchLockedRewards() {
      const masterChefContract = getMasterchefContract()
      const totalLocked = await masterChefContract.totalLockedRewards()
      setLockedRewards(new BigNumber(totalLocked.toString()))
    }

    fetchLockedRewards()
  }, [slowRefresh])

  return lockedRewards
}

export const useRicePerBlock = () => {
  const { slowRefresh } = useRefresh()
  const [ricePerBlock, setRicePerBlock] = useState<BigNumber>()

  useEffect(() => {
    async function fetchRicePerBlock() {
      const masterChef = getMasterchefContract()
      const _ricePerBlock = await masterChef.ricePerBlock()
      setRicePerBlock(new BigNumber(_ricePerBlock.toString()))
    }

    fetchRicePerBlock()
  }, [slowRefresh])

  return ricePerBlock
}

export const useTransferTaxRate = () => {
  const { slowRefresh } = useRefresh()
  const [transferTaxRate, setTransferTaxRate] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTransferTaxRate() {
      const riceContract = getCakeContract()
      const taxRate = await riceContract.transferTaxRate()
      setTransferTaxRate(new BigNumber(taxRate.toString()).div(100))
    }

    fetchTransferTaxRate()
  }, [slowRefresh])

  return transferTaxRate
}

export default useTokenBalance
