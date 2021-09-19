import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Trade anything. No registration, no hassle.',
  bodyText: 'Trade any token on Binance Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.ricefarm.fi/',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'teslasafe', alt: 'TeslaSafe Token' },
      { src: 'fuzion', alt: 'Fuzion Token' },
      { src: 'rice', alt: 'RiceFarm Token' },
    ],
  },
}

export const earnSectionData: SalesSectionProps = {
  headingText: 'Earn passive income with crypto.',
  bodyText: 'Ricefarm makes it easy to make your crypto work for you.',
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: 'Explore',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.ricefarm.fi/products/farms-pools-vaults',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/earn-rice/',
    attributes: [
      { src: 'pie', alt: 'Pie chart' },
      { src: 'stonks', alt: 'Stocks chart' },
      { src: 'folder', alt: 'Folder with rice token' },
    ],
  },
}

export const cakeSectionData: SalesSectionProps = {
  headingText: 'RICE makes our world go round.',
  bodyText:
    'RICE token is at the heart of the RiceFarm ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0xC4eEFF5aab678C3FF32362D80946A3f5De4a1861',
    text: 'Buy RICE',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.ricefarm.fi/tokenomics/rice-farm-token',
    text: 'Learn',
    external: true,
  },

  images: {
    path: '/images/home/rice/',
    attributes: [
      { src: 'bottom-right', alt: 'Small 3d ricefarm' },
      { src: 'top-right', alt: 'Small 3d ricefarm' },
      { src: 'coin', alt: 'RICE token' },
      { src: 'top-left', alt: 'Small 3d ricefarm' },
    ],
  },
}
