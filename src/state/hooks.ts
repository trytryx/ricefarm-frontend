import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { minBy, orderBy } from 'lodash'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { parseBigNumberObj } from './predictions/helpers'

import { State, Farm, NodeRound, ReduxNodeLedger, NodeLedger, ReduxNodeRound } from './types'

// /!\
// Don't add anything here. These hooks will be moved the the predictions folder

// Predictions
export const useGetRounds = () => {
  const rounds = useSelector((state: State) => state.predictions.rounds)
  return Object.keys(rounds).reduce((accum, epoch) => {
    return {
      ...accum,
      [epoch]: parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch]),
    }
  }, {}) as { [key: string]: NodeRound }
}

export const useGetRound = (epoch: number) => {
  const round = useSelector((state: State) => state.predictions.rounds[epoch])
  return parseBigNumberObj<ReduxNodeRound, NodeRound>(round)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetBetByEpoch = (account: string, epoch: number) => {
  const bets = useSelector((state: State) => state.predictions.ledgers)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][epoch]) {
    return null
  }

  return parseBigNumberObj<ReduxNodeLedger, NodeLedger>(bets[account][epoch])
}

export const useGetIsClaimable = (epoch) => {
  const claimableStatuses = useSelector((state: State) => state.predictions.claimableStatuses)
  return claimableStatuses[epoch] || false
}

/**
 * Used to get the range of rounds to poll for
 */
export const useGetEarliestEpoch = () => {
  return useSelector((state: State) => {
    const earliestRound = minBy(Object.values(state.predictions.rounds), 'epoch')
    return earliestRound?.epoch
  })
}

export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalBlocks = () => {
  return useSelector((state: State) => state.predictions.intervalBlocks)
}

export const useGetBufferBlocks = () => {
  return useSelector((state: State) => state.predictions.bufferBlocks)
}

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks()
  const bufferBlocks = useGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.predictions.currentRoundStartBlockNumber)
}

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
  return useMemo(() => ethers.BigNumber.from(minBetAmount), [minBetAmount])
}

export const useGetRewardRate = () => {
  const rewardRate = useSelector((state: State) => state.predictions.rewardRate)
  return rewardRate / 100
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history)
}

export const useGetHistoryByAccount = (account: string) => {
  const bets = useGetHistory()
  return bets ? bets[account] : []
}

export const useGetLedgerByRoundId = (account: string, roundId: string) => {
  const ledgers = useSelector((state: State) => state.predictions.ledgers)

  if (!ledgers[account]) {
    return null
  }

  if (!ledgers[account][roundId]) {
    return null
  }

  return ledgers[account][roundId]
}

export const useGetLastOraclePrice = () => {
  const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
  return useMemo(() => {
    return ethers.BigNumber.from(lastOraclePrice)
  }, [lastOraclePrice])
}

// IFO hooks
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}
export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}
export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(5)
  return bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO
}
// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  const bnbPriceBusd = usePriceBnbBusd()
  const quoteTokenFarm = useFarmFromTokenSymbol(farm?.quoteToken?.symbol)

  // Catch in case a farm isn't found
  if (!farm) {
    return null
  }

  // With a quoteToken of BUSD or wBNB, it is straightforward to return the token price.
  if (farm.quoteToken.symbol === 'BUSD') {
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd.gt(0) ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC
  // we find the pBTC farm (pBTC - BNB)'s quote token - BNB
  // from the BNB - pBTC BUSD price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
    const quoteTokenInBusd = bnbPriceBusd.gt(0) && bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return quoteTokenInBusd ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(farm.lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}
