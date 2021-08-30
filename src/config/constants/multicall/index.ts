import { ChainId } from '@pancakeswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1ee38d535d541c55c9dae27b12edf090c608e6fb',
  [ChainId.TESTNET]: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
