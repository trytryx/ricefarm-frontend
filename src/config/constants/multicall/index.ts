import { ChainId } from '@pancakeswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B', // '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.TESTNET]: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412', // '0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
