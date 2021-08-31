import { ChainId } from '@pancakeswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb', // '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.TESTNET]: '0x1afA9607136814473350eCbA53207219C3248ED7', // '0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
