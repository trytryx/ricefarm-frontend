import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@ricefarm/uikitv2'
import { Farm } from 'state/types'
import { getBscScanAddressUrl } from 'utils/bscscan'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL, BASE_V1_ADD_LIQUIDITY_URL, BASE_V1_SWAP_TOKEN_URL, BASE_SWAP_TOKEN_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
  harvestInterval?: number
}

const AccentGradient = keyframes`  
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

const StyledCardAccent = styled.div`
  background: ${({ theme }) => `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`};
  background-size: 400% 400%;
  animation: ${AccentGradient} 2s linear infinite;
  border-radius: 32px;
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -3px;
  left: -1px;
  z-index: -1;
`

const FCard = styled.div<{ isPromotedFarm: boolean }>`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme, isPromotedFarm }) => (isPromotedFarm ? '31px' : theme.radii.card)};
  box-shadow: 0px 1px 4px rgba(25, 19, 38, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account }) => {
  const { t } = useTranslation()
  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const earnLabel = farm.dual ? farm.dual.earnLabel : t('RICE + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })

  const addLiquidityUrl = farm.isV1
    ? `${BASE_V1_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
    : `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const buyUrl = farm.isV1
    ? `${BASE_V1_SWAP_TOKEN_URL}${getAddress(farm.token.address)}`
    : `${BASE_SWAP_TOKEN_URL}${getAddress(farm.token.address)}`

  const lpAddress = farm.isTokenOnly ? getAddress(farm.tokenAddresses) : getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'RICE' || farm.token.symbol === 'TeslaSafe'

    // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be rice-bnb.svg, link-bnb.svg, nar-rice.svg
  const baseImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.isTokenOnly ? `${baseImage}-pool` : baseImage

  const depositFee = (typeof farm.depositFee !== 'undefined') ? `${farm.depositFee / 100}%` : `0%`
  const [harvestInterval, setHarvestInterval] = useState('0')

  useEffect(() => {
    const timer = setTimeout(() => {
      setHarvestInterval(`${(farm.harvestInterval / 60 / 60).toFixed(2)} hour(s)`)
    }, 1000)
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  },[farm])

  return (
    <FCard isPromotedFarm={isPromotedFarm}>
      {isPromotedFarm && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        isCommunityFarm={farm.isCommunity}
        token={farm.token}
        farmImage={farmImage}
        tokenSymbol={farm.token.symbol}
        quoteToken={farm.quoteToken}
        isTokenOnly={farm.isTokenOnly}
      />
      {!removed && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{t('APR')}:</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {farm.apr ? (
              <>
                <ApyButton
                  lpLabel={lpLabel}
                  addLiquidityUrl={farm.isTokenOnly ? buyUrl : addLiquidityUrl}
                  cakePrice={cakePrice}
                  apr={farm.apr}
                  displayApr={displayApr}
                />
                {displayApr}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <Text>{t('Earn')}:</Text>
        <Text bold>{earnLabel}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{t('Deposit Fee')}:</Text>
        <Text bold>{depositFee}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{t('Harvest Delay')}:</Text>
        <Text bold>{harvestInterval}</Text>
      </Flex>
      {!farm.isTokenOnly && (
        <Flex justifyContent="space-between">
          <Text>{t('LP Type')}:</Text>
          <Text bold>{farm.lpType}</Text>
        </Flex>
      )}
      <CardActionsContainer farm={farm} account={account} addLiquidityUrl={addLiquidityUrl} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          bscScanAddress={
            farm.isTokenOnly
              ? getBscScanAddressUrl(getAddress(farm.tokenAddresses))
              : getBscScanAddressUrl(getAddress(farm.lpAddresses))
          }
          infoAddress={farm.isTokenOnly ? null : `https://pancakeswap.info/pair/${lpAddress}`}
          totalValueFormatted={totalValueFormatted}
          lpLabel={lpLabel}
          addLiquidityUrl={farm.isTokenOnly ? buyUrl : addLiquidityUrl}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
