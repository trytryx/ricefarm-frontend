import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
  ROUNDING_MODE: BigNumber.ROUND_FLOOR,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 20 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 9 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 19 (40 - Amount sent to burn pool)
export const TWITTER_USERNAME = 'fuzionchain'
export const TELEGRAM = 'https://t.me/fuzionchain'
export const CAKE_PER_BLOCK = new BigNumber(1.2709329141645)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BASE_URL = 'https://ricefarm.fi'
export const BASE_EXCHANGE_URL = `${BASE_URL}/swap`
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_URL}/pools`
export const BASE_V1_EXCHANGE_URL = 'https://teslasafe.ricefarm.fi'
export const BASE_V1_ADD_LIQUIDITY_URL = `${BASE_V1_EXCHANGE_URL}/#/add`
export const BASE_V1_LIQUIDITY_POOL_URL = `${BASE_V1_EXCHANGE_URL}/#/pool`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]

export const BASE_V1_SWAP_URL = `${BASE_V1_EXCHANGE_URL}/#/swap`
export const BASE_V1_SWAP_TOKEN_URL = `${BASE_V1_SWAP_URL}?outputCurrency=`

export const BASE_PANCAKE_URL = 'https://pancakeswap.finance'
export const BASE_SWAP_URL = `${BASE_URL}/swap`
export const BASE_SWAP_TOKEN_URL = `${BASE_SWAP_URL}?outputCurrency=`

export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL_PLACES = 18
export const TESLA_SAFE_DECIMAL_PLACES = 9
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(DEFAULT_TOKEN_DECIMAL_PLACES)
export const TS_TOKEN_DECIMAL = BIG_TEN.pow(TESLA_SAFE_DECIMAL_PLACES)
export const DEFAULT_GAS_LIMIT = 400000
export const MEDIUM_GAS_LIMIT = 600000
export const HIGH_GAS_LIMIT = 800000
export const DEFAULT_GAS_PRICE = 5
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const REFERRAL_COOKIE = 'referral_id'
export const REFERRER = '0xDdA752b218cA661F047eDdBDb6A3B713d5eb997d'
