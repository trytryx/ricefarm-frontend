import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import multicall, { multicallv2 } from 'utils/multicall'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import riceVaultAbi from 'config/abi/riceVault.json'
import masterChef from 'config/abi/masterchef.json'
import { getCakeVaultAddress, getRiceVaultAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestRiceRewards',
      'calculateTotalPendingRiceRewards',
      // 'calculateHarvestCakeRewards',
      // 'calculateTotalPendingCakeRewards',
    ].map((method) => ({
      address: getRiceVaultAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedCakeBountyReward], [totalPendingCakeHarvest]] = await multicall(
      riceVaultAbi,
      calls,
    )

    const [[canHarvest], userInfo] = await multicall(
      masterChef,
      [
        {
          address:getMasterChefAddress(),
          name: 'canHarvest',
          params: [0, getRiceVaultAddress()]
        },
        {
          address:getMasterChefAddress(),
          name: 'userInfo',
          params: [0, getRiceVaultAddress()]
        }
      ],
    )

    const nextHarvestUntilAsString = (userInfo && userInfo[3] && userInfo[3].toString()) || ''
    const canHarvestAsBoolean = Boolean(canHarvest)
    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      canHarvest: canHarvestAsBoolean,
      nextHarvestUntil: nextHarvestUntilAsString,
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: totalCakeInVaultEstimate.cakeAsBigNumber.toJSON(),
      estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward.toString()).toJSON(),
      totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest.toString()).toJSON(),
    }
  } catch (error) {

    return {
      canHarvest: null,
      nextHarvestUntil: null,
      totalShares: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
      estimatedCakeBountyReward: null,
      totalPendingCakeHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getRiceVaultAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicall(riceVaultAbi, calls)

    return {
      performanceFee: performanceFee.toNumber(),
      callFee: callFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
