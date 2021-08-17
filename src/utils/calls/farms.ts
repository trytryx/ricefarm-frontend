import BigNumber from 'bignumber.js'
import {DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL, TS_TOKEN_DECIMAL} from 'config'
import {getReferrer} from 'utils/referralHelpers'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const decimals = pid === 1 ? TS_TOKEN_DECIMAL : DEFAULT_TOKEN_DECIMAL
  const value = new BigNumber(amount).times(decimals).toString()
  // if (pid === 0) {
  //   const tx = await masterChefContract.enterStaking(value, options)
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }

  const tx = await masterChefContract.deposit(pid, value, getReferrer(), options)
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const decimals = pid === 1 ? TS_TOKEN_DECIMAL : DEFAULT_TOKEN_DECIMAL
  const value = new BigNumber(amount).times(decimals).toString()
  // if (pid === 0) {
  //   const tx = await masterChefContract.leaveStaking(value, options)
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }

  const tx = await masterChefContract.withdraw(pid, value, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  // if (pid === 0) {
  //   const tx = await await masterChefContract.leaveStaking('0', options)
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }
  const tx = await masterChefContract.deposit(pid, '0', getReferrer(), options)
  const receipt = await tx.wait()
  return receipt.status
}
