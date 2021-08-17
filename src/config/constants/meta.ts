import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Ricefarm',
  description:
    'Cheaper and faster than Uniswap? Discover Rice Farm, the leading DEX on Binance Smart Chain (BSC) with the best farms in DeFi.',
  image: 'https://ricefarm.fi/images/logo.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Ricefarm')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Ricefarm')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Ricefarm')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Ricefarm')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Ricefarm')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Ricefarm')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('Ricefarm')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Ricefarm')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Ricefarm')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('Ricefarm')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('Ricefarm')}`,
      }
    default:
      return null
  }
}
